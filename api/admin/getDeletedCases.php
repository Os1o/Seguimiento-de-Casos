<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

try {
    requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $pdo = getDatabaseConnection();
    $modulo = strtoupper(trim((string) ($_GET['modulo'] ?? '')));

    if ($modulo !== '' && !in_array($modulo, ['CIVIL', 'PENAL'], true)) {
        sendError('Modulo invalido', 400);
    }

    $partes = [];
    $params = [];

    if ($modulo === '' || $modulo === 'CIVIL') {
        $partes[] = "
            SELECT
                'CIVIL' AS modulo,
                ec.id,
                ec.numero_expediente,
                ec.delegacion_id,
                d.nombre AS delegacion_nombre,
                ec.deleted_at,
                ec.deleted_by,
                u.nombre_completo AS deleted_by_nombre
            FROM expedientes_civil ec
            LEFT JOIN delegaciones d
                ON d.id = ec.delegacion_id
            LEFT JOIN usuarios u
                ON u.id = ec.deleted_by
            WHERE ec.activo = FALSE
        ";
    }

    if ($modulo === '' || $modulo === 'PENAL') {
        $partes[] = "
            SELECT
                'PENAL' AS modulo,
                pa.id,
                pa.numero_carpeta AS numero_expediente,
                pa.delegacion_id,
                d.nombre AS delegacion_nombre,
                pa.deleted_at,
                pa.deleted_by,
                u.nombre_completo AS deleted_by_nombre
            FROM penal_asuntos pa
            LEFT JOIN delegaciones d
                ON d.id = pa.delegacion_id
            LEFT JOIN usuarios u
                ON u.id = pa.deleted_by
            WHERE pa.activo = FALSE
        ";
    }

    $sql = implode("\nUNION ALL\n", $partes) . "\nORDER BY deleted_at DESC NULLS LAST, id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendSuccess('Expedientes dados de baja cargados correctamente', [
        'cases' => $stmt->fetchAll(),
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los expedientes dados de baja', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
