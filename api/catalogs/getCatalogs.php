<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

try {
    $user = requireAnyModuleAccess();
    $pdo = getDatabaseConnection();
    $userDelegacionId = getUserDelegacionId($user);
    $delegacionesSql = 'SELECT id, nombre, estado FROM delegaciones WHERE activo = TRUE';
    $areasSql = '
        SELECT a.id, a.delegacion_id, a.nombre
        FROM areas a
        INNER JOIN delegaciones d
            ON d.id = a.delegacion_id
           AND d.activo = TRUE
        WHERE 1 = 1
    ';
    $organosSql = '
        SELECT
            oj.id,
            oj.nombre,
            ojd.delegacion_id,
            oj.circuito,
            oj.tipo,
            oj.materia
        FROM organos_jurisdiccionales oj
        INNER JOIN organos_jurisdiccionales_delegaciones ojd
            ON ojd.organo_jurisdiccional_id = oj.id
        INNER JOIN delegaciones d
            ON d.id = ojd.delegacion_id
        WHERE oj.modulo = \'CIVIL\'
          AND oj.activo = TRUE
          AND d.activo = TRUE
    ';
    $abogadosSql = '
        SELECT
            u.id,
            u.nombre_completo,
            u.usuario,
            u.delegacion_id,
            d.nombre AS delegacion_nombre,
            u.es_abogado,
            u.es_jefe,
            u.rol
        FROM usuarios u
        LEFT JOIN delegaciones d
            ON d.id = u.delegacion_id
        WHERE u.activo = TRUE
          AND u.es_abogado = TRUE
          AND u.permiso_civil_mercantil = TRUE
    ';

    if (!hasGlobalScope($user) && $userDelegacionId !== null) {
        $delegacionesSql .= ' AND id = :delegacionId';
        $areasSql .= ' AND a.delegacion_id = :delegacionId';
        $organosSql .= ' AND ojd.delegacion_id = :delegacionId';
        $abogadosSql .= ' AND u.delegacion_id = :delegacionId';
    }

    $delegacionesSql .= ' ORDER BY id';
    $areasSql .= ' ORDER BY delegacion_id, id';
    $organosSql .= ' ORDER BY oj.nombre, oj.id, ojd.delegacion_id';
    $abogadosSql .= ' ORDER BY u.nombre_completo, u.id';

    $delegacionesStmt = $pdo->prepare($delegacionesSql);
    $areasStmt = $pdo->prepare($areasSql);
    $organosStmt = $pdo->prepare($organosSql);
    $abogadosStmt = $pdo->prepare($abogadosSql);
    $prestacionesStmt = $pdo->query('SELECT id, nombre FROM prestaciones ORDER BY id');
    $tiposActuacionStmt = $pdo->query('SELECT id, nombre, modulo FROM tipos_actuacion ORDER BY id');
    $tiposJuicioStmt = $pdo->query('SELECT id, materia, nombre, jurisdiccion, requiere_descripcion FROM tipos_juicio ORDER BY id');
    $subtiposJuicioStmt = $pdo->query('SELECT id, tipo_juicio_id, nombre, jurisdiccion FROM subtipos_juicio ORDER BY id');

    $delitosStmt = $pdo->query('SELECT id, nombre FROM delitos ORDER BY nombre');
    $estadosProcesalesStmt = $pdo->query('SELECT id, nombre FROM estados_procesales ORDER BY id');
    $estatusInvestigacionStmt = $pdo->query('SELECT id, nombre FROM estatus_investigacion ORDER BY id');

    $catalogParams = !hasGlobalScope($user) && $userDelegacionId !== null
        ? ['delegacionId' => $userDelegacionId]
        : [];

    $delegacionesStmt->execute($catalogParams);
    $areasStmt->execute($catalogParams);
    $organosStmt->execute($catalogParams);
    $abogadosStmt->execute($catalogParams);

    sendSuccess('Catalogos cargados correctamente', [
        'delegaciones' => $delegacionesStmt->fetchAll(),
        'areas' => $areasStmt->fetchAll(),
        'organosJurisdiccionales' => $organosStmt->fetchAll(),
        'abogadosResponsables' => $abogadosStmt->fetchAll(),
        'prestaciones' => $prestacionesStmt->fetchAll(),
        'tiposActuacion' => $tiposActuacionStmt->fetchAll(),
        'tiposJuicio' => $tiposJuicioStmt->fetchAll(),
        'subtiposJuicio' => $subtiposJuicioStmt->fetchAll(),
        'delitos' => $delitosStmt->fetchAll(),
        'estadosProcesales' => $estadosProcesalesStmt->fetchAll(),
        'estatusInvestigacion' => $estatusInvestigacionStmt->fetchAll(),
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los catalogos', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
