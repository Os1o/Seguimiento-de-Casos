<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

try {
    $user = requirePenalAccess();
    $pdo = getDatabaseConnection();
    $userDelegacionId = getUserDelegacionId($user);

    $sql = '
        SELECT
            ap.id,
            ap.delegacion_id,
            ap.nombre
        FROM areas_penal ap
        INNER JOIN delegaciones d
            ON d.id = ap.delegacion_id
           AND d.activo = TRUE
        WHERE ap.activo = TRUE
    ';

    $params = [];

    if (!hasGlobalScope($user) && $userDelegacionId !== null) {
        $sql .= ' AND ap.delegacion_id = :delegacion_id';
        $params['delegacion_id'] = $userDelegacionId;
    }

    $sql .= ' ORDER BY ap.nombre ASC, ap.id ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendSuccess('Areas generadoras penales cargadas correctamente', [
        'areas' => $stmt->fetchAll(PDO::FETCH_ASSOC),
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar las areas generadoras penales', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
