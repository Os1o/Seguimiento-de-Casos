BEGIN;

DELETE FROM public.tipos_actuacion;

INSERT INTO public.tipos_actuacion (id, nombre, modulo) VALUES
    (1, 'Acuerdo', 'CIVIL'),
    (2, 'Alegatos', 'CIVIL'),
    (3, 'Amparo', 'CIVIL'),
    (4, 'Archivo', 'CIVIL'),
    (5, 'Audiencia', 'CIVIL'),
    (6, 'Caducidad', 'CIVIL'),
    (7, 'Conciliacion', 'CIVIL'),
    (8, 'Contestacion', 'CIVIL'),
    (9, 'Demanda', 'CIVIL'),
    (10, 'Desahogo', 'CIVIL'),
    (11, 'Ejecucion', 'CIVIL'),
    (12, 'Notificacion', 'CIVIL'),
    (13, 'Pericial', 'CIVIL'),
    (14, 'Promocion', 'CIVIL'),
    (15, 'Pruebas', 'CIVIL'),
    (16, 'Recurso', 'CIVIL'),
    (17, 'Sentencia', 'CIVIL'),
    (18, 'Sobreseimiento', 'CIVIL'),
    (19, 'Suspension', 'CIVIL'),
    (20, 'Vista', 'CIVIL'),
    (21, 'ACUERDO REPARATORIO', 'PENAL'),
    (22, 'EN TRAMITE', 'PENAL'),
    (23, 'CONCLUIDO', 'PENAL'),
    (24, 'INCOMPETENCIA', 'PENAL'),
    (25, 'NO EJERCICIO DE LA ACCION PENAL', 'PENAL'),
    (26, 'SE SENALA NUEVA FECHA PARA AUDIENCIA DE JUICIO ORAL', 'PENAL'),
    (27, 'CAUSA PENAL', 'PENAL');

SELECT setval(
    pg_get_serial_sequence('public.tipos_actuacion', 'id'),
    (SELECT MAX(id) FROM public.tipos_actuacion),
    true
);

COMMIT;
