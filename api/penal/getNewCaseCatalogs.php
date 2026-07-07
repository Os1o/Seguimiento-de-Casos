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
    $categoriasStmt = $pdo->query('
        SELECT
            cd.id,
            cd.nombre,
            cd.descripcion
        FROM categorias_delito cd
        WHERE cd.activo = TRUE
        ORDER BY cd.nombre ASC, cd.id ASC
    ');

    $delitosStmt = $pdo->query('
        SELECT
            d.id,
            d.nombre,
            d.fuero,
            d.categoria_id
        FROM delitos d
        LEFT JOIN categorias_delito cd
            ON cd.id = d.categoria_id
        ORDER BY
            CASE WHEN d.categoria_id IS NULL THEN 1 ELSE 0 END ASC,
            cd.nombre ASC NULLS LAST,
            d.nombre ASC,
            d.id ASC
    ');

    $delegacionesStmt->execute($params);
    $areasStmt->execute($params);
    $categorias = $categoriasStmt->fetchAll(PDO::FETCH_ASSOC);
    $delitos = $delitosStmt->fetchAll(PDO::FETCH_ASSOC);

    $categoriasPorId = [];
    foreach ($categorias as $categoria) {
        $categoria['delitos'] = [];
        $categoriasPorId[(int) $categoria['id']] = $categoria;
    }

    $delitosSinCategoria = [];
    foreach ($delitos as $delito) {
        $categoriaId = isset($delito['categoria_id']) ? (int) $delito['categoria_id'] : null;
        if ($categoriaId !== null && isset($categoriasPorId[$categoriaId])) {
            $categoriasPorId[$categoriaId]['delitos'][] = $delito;
            continue;
        }

        $delitosSinCategoria[] = $delito;
    }

    $categoriasDelito = array_values($categoriasPorId);
    if ($delitosSinCategoria !== []) {
        $categoriasDelito[] = [
            'id' => null,
            'nombre' => 'Sin categoría',
            'descripcion' => null,
            'sin_categoria' => true,
            'delitos' => $delitosSinCategoria,
        ];
    }

    sendSuccess('Catalogos de nuevo asunto penal cargados correctamente', [
        'delegaciones' => $delegacionesStmt->fetchAll(),
        'areas' => $areasStmt->fetchAll(),
        'categorias_delito' => $categoriasDelito,
        'delitos' => $delitos,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los catalogos del nuevo asunto penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
