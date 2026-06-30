-- SQL generado automaticamente desde el catalogo real de organos jurisdiccionales.
-- Hoja origen: CATALOGO CIVIL Y MERCANTIL
-- Total de organos: 449

BEGIN;

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE VERACRUZ, CON RESIDENCIA EN COATZACOALCOS', '10° Tabasco', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO CUARTO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO NOVENO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)', '10° Tabasco', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL DÉCIMO CIRCUITO CON RESIDENCIA EN COATZACOALCOS', '10° Tabasco', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL DÉCIMO CIRCUITO CON RESIDENCIA EN COATZACOALCOS', '10° Tabasco', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO CIRCUITO (VILLAHERMOSA)', '10° Tabasco', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DÉCIMO CIRCUITO EN VILLAHERMOSA, TABASCO', '10° Tabasco', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE MICHOACÁN (MORELIA)', '11° Michoacán', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE MICHOACÁN (URUAPAN)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE MICHOACÁN (URUAPAN)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE MICHOACÁN (URUAPAN)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)', '11° Michoacán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOPRIMER CIRCUITO (MORELIA)', '11° Michoacán', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOPRIMER CIRCUITO (MORELIA)', '11° Michoacán', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOPRIMER CIRCUITO (MORELIA)', '11° Michoacán', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('CUARTO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA QUINTA REGIÓN (LOS MOCHIS)', '12° Sinaloa', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEGUNDO CIRCUITO (MAZATLÁN)', '12° Sinaloa', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEGUNDO CIRCUITO (MAZATLÁN)', '12° Sinaloa', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO SEGUNDO CIRCUITO, CON SEDE EN CULIACÁN, SINALOA', '12° Sinaloa', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOPRIMERO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE OAXACA (SALINA CRUZ)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE OAXACA (SALINA CRUZ)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)', '13° Oaxaca', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL DECIMOTERCER CIRCUITO (OAXACA)', '13° Oaxaca', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL DECIMOTERCER CIRCUITO (OAXACA)', '13° Oaxaca', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOTERCER CIRCUITO, CON RESIDENCIA EN SAN BARTOLO COYOTEPEC', '13° Oaxaca', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)', '14° Yucatán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (MÉRIDA)', '14° Yucatán', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)', '14° Yucatán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)', '14° Yucatán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)', '14° Yucatán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)', '14° Yucatán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)', '14° Yucatán', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR OCTAVA REGIÓN (MÉRIDA)', '14° Yucatán', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO CUARTO CIRCUITO (MÉRIDA)', '14° Yucatán', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL DECIMOCUARTO CIRCUITO (MÉRIDA)', '14° Yucatán', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('CUARTO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOCUARTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOPRIMERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOQUINTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOSEGUNDO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOSEXTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOSÉPTIMO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA, CON RESIDENCIA EN TIJUANA', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOTERCERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (ENSENADA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA, (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA, (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (ENSENADA)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)', '15° Baja California', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO MATERIAS CIVIL Y DE TRABAJO DEL DECIMOQUINTO CIRCUITO (TIJUANA)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('QUINTO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO MATERIAS CIVIL Y DE TRABAJO DEL DECIMOQUINTO CIRCUITO (TIJUANA)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEXTO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)', '15° Baja California', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOQUINTO CIRCUITO, CON SEDE EN TIJUANA, BAJA CALIFORNIA', '15° Baja California', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE GUANAJUATO (IRAPUATO)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO PRIMERO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE GUANAJUATO (IRAPUATO)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE GUANAJUATO (CELAYA)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR TERCERA REGIÓN EN EL ESTADO DE GUANAJUATO (GUANAJUATO)', '16° Guanajuato', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE GUANAJUATO (GUANAJUATO)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE GUANAJUATO (CELAYA)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE GUANAJUATO (GUANAJUATO)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE GUANAJUATO (CELAYA)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)', '16° Guanajuato', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)', '16° Guanajuato', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)', '16° Guanajuato', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)', '16° Guanajuato', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)', '16° Guanajuato', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO PRIMERO DE DISTRITO EN EL ESTADO CHIHUAHUA (CHIHUAHUA)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CD. JUÁREZ)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)', '17° Chihuahua', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN EL DECIMOSÉPTIMO CIRCUITO (CD. JUÁREZ)', '17° Chihuahua', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)', '17° Chihuahua', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN EL DECIMOSÉPTIMO CIRCUITO (CD. JUÁREZ)', '17° Chihuahua', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)', '17° Chihuahua', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)', '17° Chihuahua', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOSÉPTIMO CIRCUITO (CD. JUÁREZ)', '17° Chihuahua', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)', '17° Chihuahua', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)', '18° Morelos', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOCTAVO CIRCUITO (XOCHITEPEC)', '18° Morelos', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOCTAVO CIRCUITO (CUERNAVACA)', '18° Morelos', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOCUARTO DE DISTRITO EN EL ESTADO DE TAMAULIPAS, CON RESIDENCIA EN CIUDAD VICTORIA', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (TAMPICO)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO PRIMERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO TERCERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (TAMPICO)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (TAMPICO)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD REYNOSA)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD REYNOSA)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (NUEVO LAREDO)', '19° Tamaulipas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL DECIMONOVENO CIRCUITO (CD. REYNOSA)', '19° Tamaulipas', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL DECIMONOVENO CIRCUITO (CD.VICTORIA)', '19° Tamaulipas', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL DECIMONOVENO CIRCUITO (CD. REYNOSA)', '19° Tamaulipas', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL DECIMONOVENO CIRCUITO (CD.VICTORIA)', '19° Tamaulipas', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO NOVENO CIRCUITO (MATAMOROS)', '19° Tamaulipas', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('CUARTO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('DÉCIMO CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('DÉCIMO PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('DÉCIMO QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('DÉCIMO SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('DÉCIMO SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('DÉCIMO TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('DÉCIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Concursos Mercantiles', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Concursos Mercantiles', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('NOVENO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('OCTAVO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SÉPTIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO', '1° CDMX', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)', '20° Chiapas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE CHIAPAS (TUXTLA GUTIÉRREZ)', '20° Chiapas', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)', '20° Chiapas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)', '20° Chiapas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)', '20° Chiapas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS PENAL Y CIVIL DEL VIGÉSIMO CIRCUITO (TUXTLA GUTIÉRREZ)', '20° Chiapas', 'Tribunal Colegiado de Circuito', 'Penal y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS PENAL Y CIVIL DEL VIGÉSIMO CIRCUITO (TUXTLA GUTIÉRREZ)', '20° Chiapas', 'Tribunal Colegiado de Circuito', 'Penal y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO CIRCUITO (CINTALAPA DE FIGUEROA)', '20° Chiapas', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO DEL CENTRO AUXILIAR DE LA SÉPTIMA REGIÓN (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE GUERRERO (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE GUERRERO (CHILPANCINGO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE GUERRERO (IGUALA)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA SÉPTIMA REGIÓN (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE GUERRERO (CHILPANCINGO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO DEL CENTRO AUXILIAR DE LA SÉPTIMA REGIÓN (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE GUERRERO (IGUALA)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE GUERRERO (CHILPANCINGO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)', '21° Guerrero', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL VIGÉSIMO PRIMER CIRCUITO (CHILPANCINGO)', '21° Guerrero', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL VIGÉSIMO PRIMER CIRCUITO (CHILPANCINGO)', '21° Guerrero', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCERO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL VIGÉSIMO PRIMER CIRCUITO (CHILPANCINGO)', '21° Guerrero', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO PRIMER CIRCUITO (ACAPULCO)', '21° Guerrero', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)', '22° Querétaro', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)', '22° Querétaro', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)', '22° Querétaro', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)', '22° Querétaro', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)', '22° Querétaro', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)', '22° Querétaro', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)', '22° Querétaro', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)', '22° Querétaro', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)', '22° Querétaro', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)', '22° Querétaro', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)', '22° Querétaro', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)', '23° Zacatecas', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)', '23° Zacatecas', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE ZACATECAS (ZACATECAS)', '23° Zacatecas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)', '23° Zacatecas', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE ZACATECAS (ZACATECAS)', '23° Zacatecas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)', '23° Zacatecas', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE ZACATECAS (ZACATECAS)', '23° Zacatecas', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO TERCER CIRCUITO (ZACATECAS)', '23° Zacatecas', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO TERCER CIRCUITO (ZACATECAS)', '23° Zacatecas', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO TERCERO CIRCUITO (ZACATECAS)', '23° Zacatecas', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT', '24° Nayarit', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT', '24° Nayarit', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT', '24° Nayarit', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT', '24° Nayarit', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO CUARTO CIRCUITO (TEPIC)', '24° Nayarit', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO VIGÉSIMO CUARTO CIRCUITO (TEPIC)', '24° Nayarit', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO DEL VIGÉSIMO CUARTO CIRCUITO (TEPIC)', '24° Nayarit', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO CUARTO CIRCUITO (TEPIC)', '24° Nayarit', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE DURANGO (DURANGO)', '25° Durango', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE DURANGO (DURANGO)', '25° Durango', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE DURANGO (DURANGO)', '25° Durango', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO QUINTO CIRCUITO (DURANGO)', '25° Durango', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO QUINTO CIRCUITO (DURANGO)', '25° Durango', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMOQUINTO CIRCUITO (DURANGO)', '25° Durango', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA SUR (LA PAZ)', '26° Baja California Sur', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA SUR (LA PAZ)', '26° Baja California Sur', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA SUR (LA PAZ)', '26° Baja California Sur', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO SEXTO CIRCUITO CON SEDE EN LA PAZ, BAJA CALIFORNIA SUR', '26° Baja California Sur', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO SEXTO CIRCUITO CON SEDE EN LA PAZ, BAJA CALIFORNIA SUR', '26° Baja California Sur', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO SEXTO CIRCUITO, CON SEDE EN LA PAZ, BAJA CALIFORNIA SUR', '26° Baja California Sur', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE QUINTANA ROO, ESPECIALIZADO EN JUICIOS ORALES (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CHETUMAL)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CHETUMAL)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)', '27° Quintana Roo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)', '27° Quintana Roo', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)', '27° Quintana Roo', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)', '27° Quintana Roo', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)', '27° Quintana Roo', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE TLAXCALA (APIZACO)', '28° Tlaxcala', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE TLAXCALA (APIZACO)', '28° Tlaxcala', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE TLAXCALA (APIZACO)', '28° Tlaxcala', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE TLAXCALA (APIZACO)', '28° Tlaxcala', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO OCTAVO CIRCUITO (APIZACO)', '28° Tlaxcala', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO OCTAVO CIRCUITO (APIZACO)', '28° Tlaxcala', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO OCTAVO CIRCUITO (APIZACO)', '28° Tlaxcala', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)', '29° Hidalgo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)', '29° Hidalgo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)', '29° Hidalgo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)', '29° Hidalgo', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)', '29° Hidalgo', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)', '29° Hidalgo', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)', '29° Hidalgo', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)', '29° Hidalgo', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO CUARTO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO PRIMERO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO QUINTO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SEGUNDO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SEXTO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SÉPTIMO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO TERCERO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO (NAUCALPAN)', '2° Estado de México', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)', '2° Estado de México', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('CUARTO TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)', '30° Aguascalientes', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)', '30° Aguascalientes', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)', '30° Aguascalientes', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)', '30° Aguascalientes', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)', '30° Aguascalientes', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)', '30° Aguascalientes', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)', '30° Aguascalientes', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)', '30° Aguascalientes', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)', '30° Aguascalientes', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)', '30° Aguascalientes', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)', '30° Aguascalientes', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)', '30° Aguascalientes', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE CAMPECHE (CAMPECHE)', '31° Campeche', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE CAMPECHE (CAMPECHE)', '31° Campeche', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE CAMPECHE, CON RESIDENCIA EN CIUDAD DEL CARMEN', '31° Campeche', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL TRIGÉSIMO PRIMER CIRCUITO (CAMPECHE)', '31° Campeche', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DEL TRIGÉSIMO PRIMER CIRCUITO (CAMPECHE)', '31° Campeche', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE COLIMA (COLIMA)', '32° Colima', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE COLIMA (COLIMA)', '32° Colima', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE COLIMA (COLIMA)', '32° Colima', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL TRIGESIMO SEGUNDO CIRCUITO (COLIMA)', '32° Colima', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DEL TRIGESIMO SEGUNDO CIRCUITO (COLIMA)', '32° Colima', 'Tribunal Colegiado de Circuito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO', '3° Jalisco', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DE APELACIÓN DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DE APELACIÓN DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)', '3° Jalisco', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MATERIAS CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)', '4° Nuevo León', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE NUEVO LEÓN, CON RESIDENCIA EN MONTERREY', '4° Nuevo León', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)', '4° Nuevo León', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN MATERIAS CIVIL Y DE TRABJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)', '4° Nuevo León', 'Juzgado de Distrito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)', '4° Nuevo León', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN MATERIAS CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN, CON RESIDENCIA EN MONTERREY', '4° Nuevo León', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)', '4° Nuevo León', 'Juzgado de Distrito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL CUARTO CIRCUITO (MONTERREY)', '4° Nuevo León', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL CUARTO CIRCUITO (MONTERREY)', '4° Nuevo León', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL CUARTO CIRCUITO (MONTERREY)', '4° Nuevo León', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL CUARTO CIRCUITO (MONTERREY)', '4° Nuevo León', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE SONORA (NOGALES)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOCUARTO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOPRIMERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOSEGUNDO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DECIMOTERCERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE SONORA (AGUA PRIETA)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE SONORA (CIUDAD OBREGÓN)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE SONORA (NOGALES)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE SONORA (CIUDAD OBREGÓN)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)', '5° Sonora', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL QUINTO CIRCUITO (HERMOSILLO)', '5° Sonora', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL QUINTO CIRCUITO (HERMOSILLO)', '5° Sonora', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL QUINTO CIRCUITO (HERMOSILLO)', '5° Sonora', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL QUINTO CIRCUITO, CON RESIDENCIA EN HERMOSILLO', '5° Sonora', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO NOVENO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE PUEBLA, ESPECIALIZADO EN JUICIOS ORALES', '6° Puebla', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE PUEBLA, ESPECIALIZADO EN JUICIOS ORALES', '6° Puebla', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA', '6° Puebla', 'Juzgado de Distrito', 'Administrativa, Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR SEGUNDA REGIÓN (SAN ANDRÉS CHOLULA, PUEBLA)', '6° Puebla', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SEXTO CIRCUITO (SAN ANDRÉS CHOLULA, PUEBLA)', '6° Puebla', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR SEGUNDA REGIÓN (SAN ANDRÉS CHOLULA, PUEBLA)', '6° Puebla', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SEXTO CIRCUITO (SAN ANDRÉS CHOLULA, PUEBLA)', '6° Puebla', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SEXTO CIRCUITO (SAN ANDRÉS CHOLULA, PUEBLA)', '6° Puebla', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL SEXTO CIRCUITO, CON SEDE EN SAN ANDRÉS CHOLULA, PUEBLA', '6° Puebla', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCATIL FEDERAL EN EL ESTADO DE VERACRUZ (BOCA DEL RÍO)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCATIL FEDERAL EN EL ESTADO DE VERACRUZ (XALAPA)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO OCTAVO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO PRIMERO DE DISTRITO EN POZA RICA (VERACRUZ)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO QUINTO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN CÓRDOBA (VERACRUZ)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SÉPTIME DE DISTRITO EN CÓRDOBA (VERACRUZ)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO SÉPTIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DÉCIMO TERCERO DE DISTRITO EN POZA RICA (VERACRUZ)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE VERACRUZ (TUXPAN)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (TUXPAN)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO DEL CENTRO AUXILIAR CUARTA REGIÓN EN EL ESTADO DE VERACRUZ (XALAPA)', '7° Veracruz', 'Juzgado de Distrito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)', '7° Veracruz', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR CUARTA REGIÓN (XALAPA)', '7° Veracruz', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SÉPTIMO CIRCUITO (XALAPA)', '7° Veracruz', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR CUARTA REGIÓN (XALAPA)', '7° Veracruz', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SÉPTIMO CIRCUITO (XALAPA)', '7° Veracruz', 'Tribunal Colegiado de Circuito', 'Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL SÉPTIMO CIRCUITO (EMILIANO ZAPATA, VER.)', '7° Veracruz', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN LA LAGUNA, TORREÓN, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN MONCLOVA, (COAHUILA)', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN LA LAGUNA, TORREON, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN SALTILLO, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN SALTILLO, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN LA LAGUNA, TORREON, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN SALTILLO, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN LA LAGUNA, TORREON, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN PIEDRAS NEGRAS, COAHUILA', '8° Coahuila', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA DÉCIMA REGIÓN (SALTILLO) CON JURISDICCIÓN EN TODA LA REPÚBLICA', '8° Coahuila', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y TRABAJO DEL OCTAVO CIRCUITO (TORREÓN)', '8° Coahuila', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA DÉCIMA REGIÓN (SALTILLO) CON JURISDICCIÓN EN TODA LA REPÚBLICA', '8° Coahuila', 'Tribunal Colegiado de Circuito', 'Auxiliar / Mixta', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y TRABAJO DEL OCTAVO CIRCUITO (TORREÓN)', '8° Coahuila', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TERCER TRIBUNAL COLEGIADO DE CIRCUITO EN MATERIAS CIVIL Y DE TRABAJO DEL OCTAVO CIRCUITO CON RESIDENCIA EN TORREÓN, COAHUILA DE ZARAGOZA', '8° Coahuila', 'Tribunal Colegiado de Circuito', 'Civil y de Trabajo', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL OCTAVO CIRCUITO (TORREÓN)', '8° Coahuila', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL OCTAVO CIRCUITO (SALTILLO)', '8° Coahuila', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO DE DISTRITO EN MATERIA MERCANTIL EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mercantil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (CD VALLES)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (CD. VALLES)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Juzgado de Distrito', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL NOVENO CIRCUITO (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL NOVENO CIRCUITO (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Tribunal Colegiado de Circuito', 'Administrativa y Civil', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

INSERT INTO organos_jurisdiccionales (nombre, circuito, tipo, materia, modulo, activo)
VALUES ('TRIBUNAL COLEGIADO DE APELACIÓN DEL NOVENO CIRCUITO (SAN LUIS POTOSÍ)', '9° San Luis Potosí', 'Tribunal Colegiado de Apelación', 'Mixta / Sin especificar', 'CIVIL', TRUE)
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

-- Rehacer relaciones CIVIL -> delegaciones segun circuito.
DELETE FROM organos_jurisdiccionales_delegaciones
WHERE organo_jurisdiccional_id IN (
    SELECT id
    FROM organos_jurisdiccionales
    WHERE modulo = 'CIVIL'
);

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE AGUASCALIENTES (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 1 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL TRIGÉSIMO CIRCUITO (AGUASCALIENTES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOCUARTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOPRIMERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOQUINTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOSEGUNDO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOSEXTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOSÉPTIMO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA, CON RESIDENCIA EN TIJUANA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOTERCERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (ENSENADA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA, (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA, (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (ENSENADA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO MATERIAS CIVIL Y DE TRABAJO DEL DECIMOQUINTO CIRCUITO (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'QUINTO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO MATERIAS CIVIL Y DE TRABAJO DEL DECIMOQUINTO CIRCUITO (TIJUANA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEXTO TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO DEL DECIMOQUINTO CIRCUITO (MEXICALI)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 2 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOQUINTO CIRCUITO, CON SEDE EN TIJUANA, BAJA CALIFORNIA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 3 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA SUR (LA PAZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 3 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA SUR (LA PAZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 3 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE BAJA CALIFORNIA SUR (LA PAZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 3 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO SEXTO CIRCUITO CON SEDE EN LA PAZ, BAJA CALIFORNIA SUR'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 3 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO SEXTO CIRCUITO CON SEDE EN LA PAZ, BAJA CALIFORNIA SUR'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 3 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO SEXTO CIRCUITO, CON SEDE EN LA PAZ, BAJA CALIFORNIA SUR'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 4 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE CAMPECHE (CAMPECHE)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 4 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE CAMPECHE (CAMPECHE)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 4 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE CAMPECHE, CON RESIDENCIA EN CIUDAD DEL CARMEN'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 4 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL TRIGÉSIMO PRIMER CIRCUITO (CAMPECHE)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 4 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DEL TRIGÉSIMO PRIMER CIRCUITO (CAMPECHE)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN LA LAGUNA, TORREÓN, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MONCLOVA, (COAHUILA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN LA LAGUNA, TORREON, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN SALTILLO, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN SALTILLO, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN LA LAGUNA, TORREON, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN SALTILLO, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN LA LAGUNA, TORREON, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN PIEDRAS NEGRAS, COAHUILA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA DÉCIMA REGIÓN (SALTILLO) CON JURISDICCIÓN EN TODA LA REPÚBLICA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y TRABAJO DEL OCTAVO CIRCUITO (TORREÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA DÉCIMA REGIÓN (SALTILLO) CON JURISDICCIÓN EN TODA LA REPÚBLICA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y TRABAJO DEL OCTAVO CIRCUITO (TORREÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO DE CIRCUITO EN MATERIAS CIVIL Y DE TRABAJO DEL OCTAVO CIRCUITO CON RESIDENCIA EN TORREÓN, COAHUILA DE ZARAGOZA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL OCTAVO CIRCUITO (TORREÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 5 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL OCTAVO CIRCUITO (SALTILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 6 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE COLIMA (COLIMA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 6 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE COLIMA (COLIMA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 6 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE COLIMA (COLIMA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 6 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL TRIGESIMO SEGUNDO CIRCUITO (COLIMA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 6 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DEL TRIGESIMO SEGUNDO CIRCUITO (COLIMA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE CHIAPAS (TUXTLA GUTIÉRREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE CHIAPAS (TAPACHULA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS PENAL Y CIVIL DEL VIGÉSIMO CIRCUITO (TUXTLA GUTIÉRREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS PENAL Y CIVIL DEL VIGÉSIMO CIRCUITO (TUXTLA GUTIÉRREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 7 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO CIRCUITO (CINTALAPA DE FIGUEROA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN EL ESTADO CHIHUAHUA (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CD. JUÁREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CIUDAD JUAREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE CHIHUAHUA (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN EL DECIMOSÉPTIMO CIRCUITO (CD. JUÁREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN EL DECIMOSÉPTIMO CIRCUITO (CD. JUÁREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOSÉPTIMO CIRCUITO (CD. JUÁREZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 8 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOSÉPTIMO CIRCUITO (CHIHUAHUA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 10 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE DURANGO (DURANGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 10 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE DURANGO (DURANGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 10 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE DURANGO (DURANGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 10 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO QUINTO CIRCUITO (DURANGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 10 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO QUINTO CIRCUITO (DURANGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 10 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMOQUINTO CIRCUITO (DURANGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE GUANAJUATO (IRAPUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE GUANAJUATO (IRAPUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE GUANAJUATO (CELAYA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR TERCERA REGIÓN EN EL ESTADO DE GUANAJUATO (GUANAJUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE GUANAJUATO (GUANAJUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE GUANAJUATO (CELAYA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE GUANAJUATO (GUANAJUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE GUANAJUATO (CELAYA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE GUANAJUATO (LEÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 11 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOSEXTO CIRCUITO (GUANAJUATO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO DEL CENTRO AUXILIAR DE LA SÉPTIMA REGIÓN (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE GUERRERO (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE GUERRERO (CHILPANCINGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE GUERRERO (IGUALA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA SÉPTIMA REGIÓN (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE GUERRERO (CHILPANCINGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO DEL CENTRO AUXILIAR DE LA SÉPTIMA REGIÓN (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE GUERRERO (IGUALA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE GUERRERO (CHILPANCINGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE GUERRERO (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL VIGÉSIMO PRIMER CIRCUITO (CHILPANCINGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL VIGÉSIMO PRIMER CIRCUITO (CHILPANCINGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCERO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL VIGÉSIMO PRIMER CIRCUITO (CHILPANCINGO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 12 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO PRIMER CIRCUITO (ACAPULCO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE HIDALGO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 13 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO NOVENO CIRCUITO (PACHUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL EN EL ESTADO DE JALISCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE APELACIÓN DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DE APELACIÓN DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 14 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL TERCER CIRCUITO (ZAPOPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO CUARTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO QUINTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEXTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SÉPTIMO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 15 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO CUARTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO QUINTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEXTO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SÉPTIMO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO (CIUDAD NEZAHUALCÓYOTL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO (NAUCALPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 16 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIAS ADMINISTRATIVA, CIVIL Y DE TRABAJO (TOLUCA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE MICHOACÁN (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE MICHOACÁN (URUAPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE MICHOACÁN (URUAPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE MICHOACÁN (URUAPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE MICHOACÁN (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOPRIMER CIRCUITO (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOPRIMER CIRCUITO (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 17 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOPRIMER CIRCUITO (MORELIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE MORELOS (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOCTAVO CIRCUITO (XOCHITEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 18 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOCTAVO CIRCUITO (CUERNAVACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN TEPIC, NAYARIT'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO CUARTO CIRCUITO (TEPIC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO VIGÉSIMO CUARTO CIRCUITO (TEPIC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO DEL VIGÉSIMO CUARTO CIRCUITO (TEPIC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 19 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO CUARTO CIRCUITO (TEPIC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIAS CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE NUEVO LEÓN, CON RESIDENCIA EN MONTERREY'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIAS CIVIL Y DE TRABJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIAS CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN, CON RESIDENCIA EN MONTERREY'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL Y DE TRABAJO EN EL ESTADO DE NUEVO LEÓN (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL CUARTO CIRCUITO (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL CUARTO CIRCUITO (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL CUARTO CIRCUITO (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 20 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL CUARTO CIRCUITO (MONTERREY)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOPRIMERO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE OAXACA (SALINA CRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE OAXACA (SALINA CRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE OAXACA (SAN BARTOLO COYOTEPEC)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL DECIMOTERCER CIRCUITO (OAXACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL DECIMOTERCER CIRCUITO (OAXACA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 21 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DECIMOTERCER CIRCUITO, CON RESIDENCIA EN SAN BARTOLO COYOTEPEC'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE PUEBLA, ESPECIALIZADO EN JUICIOS ORALES'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE PUEBLA, ESPECIALIZADO EN JUICIOS ORALES'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVA Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR SEGUNDA REGIÓN (SAN ANDRÉS CHOLULA, PUEBLA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SEXTO CIRCUITO (SAN ANDRÉS CHOLULA, PUEBLA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR SEGUNDA REGIÓN (SAN ANDRÉS CHOLULA, PUEBLA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SEXTO CIRCUITO (SAN ANDRÉS CHOLULA, PUEBLA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SEXTO CIRCUITO (SAN ANDRÉS CHOLULA, PUEBLA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 22 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL SEXTO CIRCUITO, CON SEDE EN SAN ANDRÉS CHOLULA, PUEBLA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA DE AMPARO CIVIL, ADMINISTRATIVO Y DE TRABAJO Y DE JUICIOS FEDERALES EN EL ESTADO DE QUERÉTARO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 23 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO SEGUNDO CIRCUITO (QUERÉTARO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE QUINTANA ROO, ESPECIALIZADO EN JUICIOS ORALES (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CHETUMAL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CHETUMAL)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE QUINTANA ROO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 24 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO SÉPTIMO CIRCUITO (CANCÚN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (CD VALLES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (CD. VALLES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE SAN LUIS POTOSÍ (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL NOVENO CIRCUITO (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL NOVENO CIRCUITO (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 25 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL NOVENO CIRCUITO (SAN LUIS POTOSÍ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 26 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA QUINTA REGIÓN (LOS MOCHIS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 26 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEGUNDO CIRCUITO (MAZATLÁN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 26 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DECIMOSEGUNDO CIRCUITO (MAZATLÁN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 26 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO SEGUNDO CIRCUITO, CON SEDE EN CULIACÁN, SINALOA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE SONORA (NOGALES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOCUARTO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOPRIMERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOSEGUNDO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOTERCERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE SONORA (AGUA PRIETA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE SONORA (CIUDAD OBREGÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE SONORA (NOGALES)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE SONORA (CIUDAD OBREGÓN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE SONORA (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL QUINTO CIRCUITO (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL QUINTO CIRCUITO (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y DE TRABAJO DEL QUINTO CIRCUITO (HERMOSILLO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 27 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL QUINTO CIRCUITO, CON RESIDENCIA EN HERMOSILLO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE VERACRUZ, CON RESIDENCIA EN COATZACOALCOS'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO CUARTO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO NOVENO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE VERACRUZ (COATZACOALCOS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE TABASCO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL DÉCIMO CIRCUITO CON RESIDENCIA EN COATZACOALCOS'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL DÉCIMO CIRCUITO CON RESIDENCIA EN COATZACOALCOS'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO CIRCUITO (VILLAHERMOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 28 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL DÉCIMO CIRCUITO EN VILLAHERMOSA, TABASCO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DECIMOCUARTO DE DISTRITO EN EL ESTADO DE TAMAULIPAS, CON RESIDENCIA EN CIUDAD VICTORIA'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (TAMPICO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (TAMPICO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (TAMPICO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD REYNOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD VICTORIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (CIUDAD REYNOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE TAMAULIPAS (NUEVO LAREDO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL DECIMONOVENO CIRCUITO (CD. REYNOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL DECIMONOVENO CIRCUITO (CD.VICTORIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL DECIMONOVENO CIRCUITO (CD. REYNOSA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIAS ADMINISTRATIVA Y CIVIL DEL DECIMONOVENO CIRCUITO (CD.VICTORIA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 29 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO NOVENO CIRCUITO (MATAMOROS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 30 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL EN EL ESTADO DE TLAXCALA (APIZACO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 30 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE TLAXCALA (APIZACO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 30 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE TLAXCALA (APIZACO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 30 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE TLAXCALA (APIZACO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 30 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO OCTAVO CIRCUITO (APIZACO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 30 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO OCTAVO CIRCUITO (APIZACO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 30 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO OCTAVO CIRCUITO (APIZACO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCATIL FEDERAL EN EL ESTADO DE VERACRUZ (BOCA DEL RÍO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCATIL FEDERAL EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO OCTAVO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN POZA RICA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO QUINTO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN CÓRDOBA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SÉPTIME DE DISTRITO EN CÓRDOBA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SÉPTIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO EN POZA RICA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE VERACRUZ (TUXPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (TUXPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO DEL CENTRO AUXILIAR CUARTA REGIÓN EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR CUARTA REGIÓN (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SÉPTIMO CIRCUITO (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR CUARTA REGIÓN (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SÉPTIMO CIRCUITO (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 31 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL SÉPTIMO CIRCUITO (EMILIANO ZAPATA, VER.)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCATIL FEDERAL EN EL ESTADO DE VERACRUZ (BOCA DEL RÍO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCATIL FEDERAL EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO OCTAVO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN POZA RICA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO QUINTO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN CÓRDOBA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SÉPTIME DE DISTRITO EN CÓRDOBA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SÉPTIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO EN POZA RICA (VERACRUZ)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN EL ESTADO DE VERACRUZ (TUXPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN EL ESTADO DE VERACRUZ (TUXPAN)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO DEL CENTRO AUXILIAR CUARTA REGIÓN EN EL ESTADO DE VERACRUZ (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE VERACRUZ (BOCA DEL RIO)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR CUARTA REGIÓN (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SÉPTIMO CIRCUITO (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR CUARTA REGIÓN (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL SÉPTIMO CIRCUITO (XALAPA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 32 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL SÉPTIMO CIRCUITO (EMILIANO ZAPATA, VER.)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DE DISTRITO EN MATERIA MERCANTIL FEDERAL (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE YUCATÁN (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR OCTAVA REGIÓN (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL DÉCIMO CUARTO CIRCUITO (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 33 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO EN MATERIAS CIVIL Y ADMINISTRATIVA DEL DECIMOCUARTO CIRCUITO (MÉRIDA)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN EL ESTADO DE ZACATECAS (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN EL ESTADO DE ZACATECAS (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO DEL CENTRO AUXILIAR DE LA NOVENA REGIÓN (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN EL ESTADO DE ZACATECAS (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DEL VIGÉSIMO TERCER CIRCUITO (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO DEL VIGÉSIMO TERCER CIRCUITO (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 34 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TRIBUNAL COLEGIADO DE APELACIÓN DEL VIGÉSIMO TERCERO CIRCUITO (ZACATECAS)'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'NOVENO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'OCTAVO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SÉPTIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 43 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'NOVENO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'OCTAVO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SÉPTIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 44 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'NOVENO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'OCTAVO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SÉPTIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 45 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO CUARTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'DÉCIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO CUARTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO DÉCIMO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO NOVENO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO OCTAVO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO PRIMERO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO QUINTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEGUNDO DE DISTRITO EN MATERIA DE CONCURSOS MERCANTILES EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SEXTO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO SÉPTIMO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'JUZGADO TERCERO DE DISTRITO EN MATERIA CIVIL EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'NOVENO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'OCTAVO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO DE CIRCUITO DEL CENTRO AUXILIAR DE LA PRIMERA REGIÓN, CON RESIDENCIA EN LA CIUDAD DE MÉXICO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'PRIMER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'QUINTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEGUNDO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SEXTO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'SÉPTIMO TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

INSERT INTO organos_jurisdiccionales_delegaciones (organo_jurisdiccional_id, delegacion_id)
SELECT id, 46 FROM organos_jurisdiccionales WHERE modulo = 'CIVIL' AND nombre = 'TERCER TRIBUNAL COLEGIADO EN MATERIA CIVIL DEL PRIMER CIRCUITO'
ON CONFLICT DO NOTHING;

COMMIT;
