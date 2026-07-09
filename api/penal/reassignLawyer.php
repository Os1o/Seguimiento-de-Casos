<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function requirePenalLawyerReassignmentAccess(array $user, int $delegacionId): void
{
    if (isAdminUser($user)) {
        return;
    }

    if (($user['rol'] ?? null) !== 'editor' || !isJefeUser($user)) {
        sendError('No tienes permisos para reasignar abogados responsables', 403);
    }

    ensureWriteDelegacionAccess($user, $delegacionId);
}

try {
    $user = requirePenalAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $payload = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($payload)) {
        sendError('No se recibieron datos validos', 400);
    }

    $caseId = isset($payload['case_id']) ? (int) $payload['case_id'] : 0;
    $lawyerId = isset($payload['abogado_responsable_id']) ? (int) $payload['abogado_responsable_id'] : 0;

    if ($caseId <= 0 || $lawyerId <= 0) {
        sendError('Debes indicar el asunto y el abogado responsable', 400);
    }

    $pdo = getDatabaseConnection();

    $caseStmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.numero_carpeta,
            pa.delegacion_id,
            pa.abogado_responsable_id,
            actual.nombre_completo AS abogado_responsable_nombre
        FROM penal_asuntos pa
        LEFT JOIN usuarios actual
            ON actual.id = pa.abogado_responsable_id
        WHERE pa.id = :id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        LIMIT 1
    ');
    $caseStmt->execute(['id' => $caseId]);
    $case = $caseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$case) {
        sendError('Asunto penal no encontrado', 404);
    }

    $delegacionId = isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : 0;
    requirePenalLawyerReassignmentAccess($user, $delegacionId);

    $lawyerStmt = $pdo->prepare('
        SELECT
            u.id,
            u.nombre_completo,
            u.delegacion_id
        FROM usuarios u
        WHERE u.id = :id
          AND u.activo = TRUE
          AND u.es_abogado = TRUE
          AND u.permiso_penal = TRUE
        LIMIT 1
    ');
    $lawyerStmt->execute(['id' => $lawyerId]);
    $lawyer = $lawyerStmt->fetch(PDO::FETCH_ASSOC);

    if (!$lawyer) {
        sendError('El abogado seleccionado no es valido', 400);
    }

    if (!isAdminUser($user) && (int) $lawyer['delegacion_id'] !== $delegacionId) {
        sendError('Solo puedes asignar abogados de la misma JSJ del asunto', 400);
    }

    $previousLawyerId = isset($case['abogado_responsable_id']) ? (int) $case['abogado_responsable_id'] : null;
    if ($previousLawyerId === (int) $lawyer['id']) {
        sendSuccess('El abogado responsable ya estaba asignado', [
            'case_id' => $caseId,
            'abogado_responsable_id' => (int) $lawyer['id'],
            'abogado_responsable_nombre' => $lawyer['nombre_completo'],
        ]);
    }

    $updateStmt = $pdo->prepare('
        UPDATE penal_asuntos
        SET abogado_responsable_id = :abogado_responsable_id,
            updated_at = NOW()
        WHERE id = :id
    ');
    $updateStmt->execute([
        'abogado_responsable_id' => (int) $lawyer['id'],
        'id' => $caseId,
    ]);

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'REASIGNAR_ABOGADO',
        'entidad' => 'Expediente penal',
        'entidad_id' => $caseId,
        'expediente_id' => $caseId,
        'descripcion' => 'Reasignacion de abogado responsable penal',
        'detalles' => [
            'registro' => sprintf('%s ID interno: %d', (string) $case['numero_carpeta'], $caseId),
            'cambios' => [
                'abogado_responsable_id' => [
                    'etiqueta' => 'Abogado responsable',
                    'antes' => $previousLawyerId,
                    'despues' => (int) $lawyer['id'],
                ],
            ],
            'abogado_anterior_nombre' => $case['abogado_responsable_nombre'] ?? null,
            'abogado_nuevo_nombre' => $lawyer['nombre_completo'],
        ],
        'delegacion_id' => $delegacionId,
    ]);

    sendSuccess('Abogado responsable reasignado correctamente', [
        'case_id' => $caseId,
        'abogado_responsable_id' => (int) $lawyer['id'],
        'abogado_responsable_nombre' => $lawyer['nombre_completo'],
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo reasignar el abogado responsable', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
