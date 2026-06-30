from __future__ import annotations

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "pkgrel": "http://schemas.openxmlformats.org/package/2006/relationships",
}

TARGET_SHEET = "CATALOGO CIVIL Y MERCANTIL"
MODULO = "CIVIL"

CIRCUITO_TO_DELEGACIONES = {
    "30° Aguascalientes": [1],
    "15° Baja California": [2],
    "26° Baja California Sur": [3],
    "31° Campeche": [4],
    "8° Coahuila": [5],
    "32° Colima": [6],
    "20° Chiapas": [7],
    "17° Chihuahua": [8],
    "25° Durango": [10],
    "16° Guanajuato": [11],
    "21° Guerrero": [12],
    "29° Hidalgo": [13],
    "3° Jalisco": [14],
    "2° Estado de México": [15, 16],
    "11° Michoacán": [17],
    "18° Morelos": [18],
    "24° Nayarit": [19],
    "4° Nuevo León": [20],
    "13° Oaxaca": [21],
    "6° Puebla": [22],
    "22° Querétaro": [23],
    "27° Quintana Roo": [24],
    "9° San Luis Potosí": [25],
    "12° Sinaloa": [26],
    "5° Sonora": [27],
    "10° Tabasco": [28],
    "19° Tamaulipas": [29],
    "28° Tlaxcala": [30],
    "7° Veracruz": [31, 32],
    "14° Yucatán": [33],
    "23° Zacatecas": [34],
    "1° CDMX": [43, 44, 45, 46],
}


def col_letters(cell_ref: str) -> str:
    match = re.match(r"([A-Z]+)", cell_ref)
    return match.group(1) if match else ""


def col_index(letters: str) -> int:
    value = 0
    for char in letters:
        value = value * 26 + (ord(char) - 64)
    return value


def sql_text(value: str | None) -> str:
    if value is None:
        return "NULL"
    escaped = value.replace("'", "''")
    return f"'{escaped}'"


def load_shared_strings(xlsx_path: Path) -> list[str]:
    with zipfile.ZipFile(xlsx_path) as archive:
        if "xl/sharedStrings.xml" not in archive.namelist():
            return []

        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
        values: list[str] = []
        for si in root.findall("main:si", NS):
            values.append(
                "".join(
                    node.text or ""
                    for node in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                )
            )
        return values


def resolve_sheet_path(archive: zipfile.ZipFile, sheet_name: str) -> str:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in rels.findall("pkgrel:Relationship", NS)
    }

    for sheet in workbook.find("main:sheets", NS):
        if sheet.attrib["name"] != sheet_name:
            continue
        rel_id = sheet.attrib[
            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
        ]
        target = rel_map[rel_id]
        return "xl/" + target if not target.startswith("xl/") else target

    raise ValueError(f"No se encontró la hoja '{sheet_name}' en el archivo.")


def load_catalog_rows(xlsx_path: Path) -> list[dict[str, str]]:
    shared = load_shared_strings(xlsx_path)

    with zipfile.ZipFile(xlsx_path) as archive:
        sheet_path = resolve_sheet_path(archive, TARGET_SHEET)
        root = ET.fromstring(archive.read(sheet_path))
        sheet_data = root.find("main:sheetData", NS)
        if sheet_data is None:
            return []

        rows: list[list[str]] = []
        for row in sheet_data.findall("main:row", NS):
            vals: dict[int, str] = {}
            for cell in row.findall("main:c", NS):
                idx = col_index(col_letters(cell.attrib.get("r", "")))
                cell_type = cell.attrib.get("t")
                value = ""
                node_v = cell.find("main:v", NS)

                if cell_type == "s" and node_v is not None and node_v.text is not None:
                    value = shared[int(node_v.text)]
                elif cell_type == "inlineStr":
                    node_is = cell.find("main:is", NS)
                    if node_is is not None:
                        value = "".join(
                            t.text or ""
                            for t in node_is.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                        )
                elif node_v is not None and node_v.text is not None:
                    value = node_v.text

                vals[idx] = value.strip()

            if not vals:
                continue

            max_idx = max(vals)
            normalized = [""] * max_idx
            for idx, value in vals.items():
                normalized[idx - 1] = value

            if any(item.strip() for item in normalized):
                rows.append(normalized)

    header_index = None
    for idx, row in enumerate(rows):
        values = [cell.strip() for cell in row]
        if "Circuito" in values and "Órgano Jurisdiccional" in values:
            header_index = idx
            break

    if header_index is None:
        raise ValueError("No se encontró la fila de encabezados esperada.")

    headers = rows[header_index]
    header_map = {value.strip(): i for i, value in enumerate(headers) if value.strip()}

    required = ["Circuito", "Órgano Jurisdiccional", "Tipo", "Materia"]
    for field in required:
        if field not in header_map:
            raise ValueError(f"Falta la columna requerida '{field}'.")

    data_rows: list[dict[str, str]] = []
    for row in rows[header_index + 1 :]:
        circuito = row[header_map["Circuito"]].strip() if header_map["Circuito"] < len(row) else ""
        organo = row[header_map["Órgano Jurisdiccional"]].strip() if header_map["Órgano Jurisdiccional"] < len(row) else ""
        tipo = row[header_map["Tipo"]].strip() if header_map["Tipo"] < len(row) else ""
        materia = row[header_map["Materia"]].strip() if header_map["Materia"] < len(row) else ""

        if not circuito and not organo:
            continue
        if not organo:
            continue

        data_rows.append(
            {
                "circuito": circuito,
                "nombre": organo,
                "tipo": tipo or None,
                "materia": materia or None,
            }
        )

    return data_rows


def build_sql(rows: list[dict[str, str]]) -> str:
    unique_rows: dict[str, dict[str, str]] = {}
    unmapped: set[str] = set()

    for row in rows:
        unique_rows[row["nombre"]] = row
        if row["circuito"] not in CIRCUITO_TO_DELEGACIONES:
            unmapped.add(row["circuito"])

    if unmapped:
        raise ValueError(
            "Hay circuitos sin mapeo definido: " + ", ".join(sorted(unmapped))
        )

    lines: list[str] = []
    lines.append("-- SQL generado automaticamente desde el catalogo real de organos jurisdiccionales.")
    lines.append("-- Hoja origen: CATALOGO CIVIL Y MERCANTIL")
    lines.append(f"-- Total de organos: {len(unique_rows)}")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")

    for row in sorted(unique_rows.values(), key=lambda item: (item["circuito"], item["nombre"])):
        lines.append(
            "INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)"
        )
        lines.append(
            f"VALUES ({sql_text(row['nombre'])}, {sql_text(row['circuito'])}, {sql_text(row['tipo'])}, {sql_text(row['materia'])}, 'CIVIL', TRUE)"
        )
        lines.append("ON CONFLICT (modulo, nombre) DO UPDATE")
        lines.append("SET")
        lines.append("    circuito = EXCLUDED.circuito,")
        lines.append("    tipo = EXCLUDED.tipo,")
        lines.append("    materia = EXCLUDED.materia,")
        lines.append("    activo = TRUE,")
        lines.append("    updated_at = NOW();")
        lines.append("")

    lines.append("-- Rehacer relaciones CIVIL -> delegaciones segun circuito.")
    lines.append("DELETE FROM organos_jurisdiccionales_delegaciones")
    lines.append("WHERE organo_jurisdiccional_id IN (")
    lines.append("    SELECT id")
    lines.append("    FROM organos_jurisdiccionales")
    lines.append("    WHERE modulo = 'CIVIL'")
    lines.append(");")
    lines.append("")

    relation_pairs: set[tuple[str, int]] = set()
    for row in unique_rows.values():
        for delegacion_id in CIRCUITO_TO_DELEGACIONES[row["circuito"]]:
            relation_pairs.add((row["nombre"], delegacion_id))

    for nombre, delegacion_id in sorted(relation_pairs, key=lambda item: (item[1], item[0])):
        lines.append("INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)")
        lines.append(
            "SELECT id, {delegacion_id} FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = {nombre}".format(
                delegacion_id=delegacion_id,
                nombre=sql_text(nombre),
            )
        )
        lines.append("ON CONFLICT DO NOTHING;")
        lines.append("")

    lines.append("COMMIT;")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    if len(sys.argv) != 3:
        print(
            "Uso: python generar_sql_organos_jurisdiccionales.py <ruta_excel> <ruta_sql_salida>",
            file=sys.stderr,
        )
        return 1

    excel_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not excel_path.exists():
        print(f"No existe el archivo Excel: {excel_path}", file=sys.stderr)
        return 1

    rows = load_catalog_rows(excel_path)
    sql = build_sql(rows)
    output_path.write_text(sql, encoding="utf-8")

    summary = {
        "excel": str(excel_path),
        "sheet": TARGET_SHEET,
        "rows_source": len(rows),
        "rows_unique": len({row["nombre"] for row in rows}),
        "output_sql": str(output_path),
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
