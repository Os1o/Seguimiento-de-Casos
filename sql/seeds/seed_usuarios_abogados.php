<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "Este script solo puede ejecutarse desde linea de comandos.\n");
    exit(1);
}

require_once dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'db.php';

function normalizarClaveDelegacion(string $nombre): string
{
    $texto = trim($nombre);

    if (function_exists('iconv')) {
        $convertido = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $texto);
        if (is_string($convertido)) {
            $texto = $convertido;
        }
    }

    $texto = strtolower($texto);
    $texto = preg_replace('/[^a-z0-9]+/', '_', $texto) ?? '';
    $texto = trim($texto, '_');

    return $texto !== '' ? $texto : 'delegacion';
}

function generarPasswordSeguro(int $length = 12): string
{
    $mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $minusculas = 'abcdefghijklmnopqrstuvwxyz';
    $numeros = '0123456789';
    $todos = $mayusculas . $minusculas . $numeros;

    $chars = [
        $mayusculas[random_int(0, strlen($mayusculas) - 1)],
        $minusculas[random_int(0, strlen($minusculas) - 1)],
        $numeros[random_int(0, strlen($numeros) - 1)],
    ];

    while (count($chars) < $length) {
        $chars[] = $todos[random_int(0, strlen($todos) - 1)];
    }

    shuffle($chars);

    return implode('', $chars);
}

function imprimirFila(array $row, array $widths): void
{
    printf(
        "%-{$widths['estado']}s | %-{$widths['usuario']}s | %-{$widths['password']}s | %-{$widths['delegacion']}s\n",
        $row['estado'],
        $row['usuario'],
        $row['password'],
        $row['delegacion']
    );
}

try {
    $pdo = getDatabaseConnection();

    $delegacionesStmt = $pdo->query('
        SELECT id, nombre, estado
        FROM public.delegaciones
        WHERE activo = TRUE
        ORDER BY id ASC
    ');
    $delegaciones = $delegacionesStmt->fetchAll(PDO::FETCH_ASSOC);

    $totalDelegaciones = count($delegaciones);
    $totalUsuariosObjetivo = $totalDelegaciones * 2;

    echo "Delegaciones activas encontradas: {$totalDelegaciones}\n";
    echo "Usuarios objetivo a crear/verificar: {$totalUsuariosObjetivo}\n\n";

    $existeStmt = $pdo->prepare('
        SELECT id
        FROM public.usuarios
        WHERE usuario = :usuario
        LIMIT 1
    ');

    $insertStmt = $pdo->prepare('
        INSERT INTO public.usuarios (
            usuario,
            password,
            nombre_completo,
            rol,
            delegacion_id,
            permiso_civil_mercantil,
            permiso_penal,
            activo,
            alcance_global,
            es_abogado,
            es_jefe
        )
        VALUES (
            :usuario,
            :password,
            :nombre_completo,
            :rol,
            :delegacion_id,
            :permiso_civil_mercantil,
            :permiso_penal,
            :activo,
            :alcance_global,
            :es_abogado,
            :es_jefe
        )
    ');

    $resultados = [];

    foreach ($delegaciones as $delegacion) {
        $delegacionId = (int) $delegacion['id'];
        $delegacionNombre = (string) $delegacion['nombre'];
        $claveDelegacion = normalizarClaveDelegacion($delegacionNombre);

        for ($numero = 1; $numero <= 2; $numero++) {
            $numeroTexto = str_pad((string) $numero, 2, '0', STR_PAD_LEFT);
            $usuario = "abogado_{$numeroTexto}_{$claveDelegacion}";
            $nombreCompleto = "Abogado {$numero} {$delegacionNombre}";

            $existeStmt->execute(['usuario' => $usuario]);
            $existe = $existeStmt->fetch(PDO::FETCH_ASSOC);

            if ($existe) {
                echo "[EXISTE] {$usuario} ya existe; se omite insercion.\n";
                $resultados[] = [
                    'estado' => 'EXISTE',
                    'usuario' => $usuario,
                    'password' => 'NO DISPONIBLE',
                    'delegacion' => $delegacionNombre,
                ];
                continue;
            }

            $passwordPlano = generarPasswordSeguro(12);
            $passwordHash = password_hash($passwordPlano, PASSWORD_DEFAULT);

            $insertStmt->execute([
                'usuario' => $usuario,
                'password' => $passwordHash,
                'nombre_completo' => $nombreCompleto,
                'rol' => 'editor',
                'delegacion_id' => $delegacionId,
                'permiso_civil_mercantil' => 'false',
                'permiso_penal' => 'true',
                'activo' => 'true',
                'alcance_global' => 'false',
                'es_abogado' => 'true',
                'es_jefe' => 'false',
            ]);

            echo "[CREADO] {$usuario} creado para {$delegacionNombre}.\n";
            $resultados[] = [
                'estado' => 'CREADO',
                'usuario' => $usuario,
                'password' => $passwordPlano,
                'delegacion' => $delegacionNombre,
            ];
        }
    }

    echo "\nCredenciales generadas/verificadas:\n";
    echo "Nota: para usuarios existentes no se muestra password porque el script no modifica credenciales previas.\n\n";

    $widths = [
        'estado' => 8,
        'usuario' => 36,
        'password' => 16,
        'delegacion' => 50,
    ];

    imprimirFila([
        'estado' => 'ESTADO',
        'usuario' => 'USUARIO',
        'password' => 'PASSWORD',
        'delegacion' => 'DELEGACION',
    ], $widths);

    echo str_repeat('-', array_sum($widths) + 9) . "\n";

    foreach ($resultados as $resultado) {
        imprimirFila($resultado, $widths);
    }

    echo "\nProceso terminado. Total filas reportadas: " . count($resultados) . "\n";
} catch (Throwable $exception) {
    fwrite(STDERR, 'Error al cargar usuarios abogados: ' . $exception->getMessage() . "\n");
    exit(1);
}
