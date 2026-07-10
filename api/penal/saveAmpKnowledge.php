<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function readAmpPayload(): array
{
    $rawBody = file_get_contents('php://input');
    $decoded = json_decode($rawBody ?: '', true);

    if (!is_array($decoded)) {
        sendError('El cuerpo de la petición no tiene un formato válido', 400);
    }

    return [
        'asunto_id' => isset($decoded['asunto_id']) ? (int) $decoded['asunto_id'] : 0,
        'fecha_conocimiento_amp' => trim((string) ($decoded['fecha_conocimiento_amp'] ?? '')),
    ];
}

function parseIsoDateOrFail(string $value, string $fieldLabel): DateTimeImmutable
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        sendError("El campo {$fieldLabel} no tiene un formato válido", 400);
    }

    $date = DateTimeImmutable::createFromFormat('Y-m-d', $value);
    $errors = DateTimeImmutable::getLastErrors();

    if (!$date || !empty($errors['warning_count']) || !empty($errors['error_count'])) {
        sendError("El campo {$fieldLabel} no tiene una fecha válida", 400);
    }

    return $date;
}

try {
    $user = requirePenalWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $payload = readAmpPayload();

    if ($payload['asunto_id'] <= 0) {
        sendError('El asunto es obligatorio', 400);
    }

    if ($payload['fecha_conocimiento_amp'] === '') {
        sendError('La fecha de conocimiento del AMP es obligatoria', 400);
    }

    $fechaConocimiento = parseIsoDateOrFail($payload['fecha_conocimiento_amp'], 'fecha_conocimiento_amp');

    if ($payload['fecha_conocimiento_amp'] > date('Y-m-d')) {
        sendError('La fecha de conocimiento del AMP no puede ser posterior a hoy', 400);
    }

    $pdo = getDatabaseConnection();

    $stmtAsunto = $pdo->prepare('
        SELECT
            id,
            delegacion_id,
            numero_carpeta,
            fecha_presentacion_denuncia,
            fecha_conocimiento_amp,
            estatus_general
        FROM penal_asuntos
        WHERE id = :id
          AND activo = TRUE
        LIMIT 1
    ');

    $stmtAsunto->execute([
        'id' => $payload['asunto_id'],
    ]);

    $asunto = $stmtAsunto->fetch(PDO::FETCH_ASSOC);

    if (!$asunto) {
        sendError('Asunto penal no encontrado', 404);
    }

    if (strtoupper((string) ($asunto['estatus_general'] ?? '')) === 'CONCLUIDO') {
        sendError('El asunto se encuentra concluido, no se permiten modificaciones.', 400);
    }

    if (!empty($asunto['fecha_conocimiento_amp']) && !isAdminUser($user)) {
        sendError('La fecha de conocimiento del AMP ya fue registrada para este asunto', 400);
    }

    ensureWriteDelegacionAccess($user, isset($asunto['delegacion_id']) ? (int) $asunto['delegacion_id'] : null);

    $fechaPresentacion = trim((string) ($asunto['fecha_presentacion_denuncia'] ?? ''));
    if ($fechaPresentacion !== '') {
        $fechaDenuncia = parseIsoDateOrFail($fechaPresentacion, 'fecha_presentacion_denuncia');

        if ($fechaConocimiento < $fechaDenuncia) {
            sendError('La fecha de conocimiento del AMP no puede ser menor a la fecha de presentación de la denuncia / querella', 400);
        }
    }

    $pdo->beginTransaction();

    $stmtUpsert = $pdo->prepare('
        INSERT INTO penal_conocimiento_amp (
            asunto_id,
            fecha_conocimiento_amp,
            usuario_id
        )
        VALUES (
            :asunto_id,
            :fecha_conocimiento_amp,
            :usuario_id
        )
        ON CONFLICT (asunto_id)
        DO UPDATE SET
            fecha_conocimiento_amp = EXCLUDED.fecha_conocimiento_amp,
            usuario_id = EXCLUDED.usuario_id,
            updated_at = now()
    ');

    $stmtUpsert->execute([
        'asunto_id' => $payload['asunto_id'],
        'fecha_conocimiento_amp' => $payload['fecha_conocimiento_amp'],
        'usuario_id' => isset($user['id']) ? (int) $user['id'] : null,
    ]);

    $stmtUpdateAsunto = $pdo->prepare('
        UPDATE penal_asuntos
        SET
            fecha_conocimiento_amp = :fecha_conocimiento_amp,
            updated_at = now()
        WHERE id = :id
    ');

    $stmtUpdateAsunto->execute([
        'id' => $payload['asunto_id'],
        'fecha_conocimiento_amp' => $payload['fecha_conocimiento_amp'],
    ]);

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => empty($asunto['fecha_conocimiento_amp']) ? 'CREAR' : 'EDITAR',
        'entidad' => 'Fecha del AMP',
        'entidad_id' => $payload['asunto_id'],
        'expediente_id' => $payload['asunto_id'],
        'delegacion_id' => isset($asunto['delegacion_id']) ? (int) $asunto['delegacion_id'] : null,
        'descripcion' => empty($asunto['fecha_conocimiento_amp'])
            ? 'Registro de conocimiento del AMP'
            : 'Edicion de conocimiento del AMP',
        'detalles' => [
            'numero_expediente' => $asunto['numero_carpeta'] ?? null,
            'estatus' => strtoupper((string) ($asunto['estatus_general'] ?? '')) === 'CONCLUIDO' ? 'Concluido' : 'En tramite',
            'fecha_anterior' => $asunto['fecha_conocimiento_amp'] ?: null,
            'fecha_nueva' => $payload['fecha_conocimiento_amp'],
            'cambios' => buildAuditFieldChanges(
                ['fecha_conocimiento_amp' => $asunto['fecha_conocimiento_amp'] ?: null],
                ['fecha_conocimiento_amp' => $payload['fecha_conocimiento_amp']],
                ['fecha_conocimiento_amp' => 'Fecha de conocimiento AMP']
            ),
        ],
    ]);

    $pdo->commit();

    sendSuccess('Registro de conocimiento del AMP guardado correctamente', [
        'asunto_id' => $payload['asunto_id'],
        'fecha_conocimiento_amp' => $payload['fecha_conocimiento_amp'],
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo guardar el registro de conocimiento del AMP', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
