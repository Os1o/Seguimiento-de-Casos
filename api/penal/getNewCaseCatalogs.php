<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

try {
    $user = requirePenalWriteAccess();
    $pdo = getDatabaseConnection();
    $userDelegacionId = getUserDelegacionId($user);

    $delegacionesSql = '
        SELECT
            d.id,
            d.nombre,
            d.estado
        FROM delegaciones d
        WHERE d.activo = TRUE
    ';

    $areasSql = '
        SELECT
            a.id,
            a.delegacion_id,
            a.nombre
        FROM areas a
        INNER JOIN delegaciones d
            ON d.id = a.delegacion_id
           AND d.activo = TRUE
        WHERE 1 = 1
    ';

    $params = [];

    if (!hasGlobalScope($user) && $userDelegacionId !== null) {
        $delegacionesSql .= ' AND d.id = :delegacionId';
        $areasSql .= ' AND a.delegacion_id = :delegacionId';
        $params['delegacionId'] = $userDelegacionId;
    }

    $delegacionesSql .= ' ORDER BY d.nombre ASC, d.id ASC';
    $areasSql .= ' ORDER BY a.nombre ASC, a.id ASC';

    $delegacionesStmt = $pdo->prepare($delegacionesSql);
    $areasStmt = $pdo->prepare($areasSql);
    $delitosStmt = $pdo->query('SELECT id, nombre FROM delitos ORDER BY nombre ASC, id ASC');

    $delegacionesStmt->execute($params);
    $areasStmt->execute($params);

    sendSuccess('Catalogos de nuevo asunto penal cargados correctamente', [
        'delegaciones' => $delegacionesStmt->fetchAll(),
        'areas' => $areasStmt->fetchAll(),
        'delitos' => $delitosStmt->fetchAll(),
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los catalogos del nuevo asunto penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
