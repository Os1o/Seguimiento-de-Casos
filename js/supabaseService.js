// =====================================================
// SUPABASE SERVICE - Capa de acceso a datos
// Reemplaza el acceso directo a localStorage/datosFake
// =====================================================

const db = () => window.supabaseClient;
const sb = () => window.supabaseClient;

// Cache de catálogos (se cargan una vez y se reutilizan)
const catalogosDB = {
    delegaciones: [],
    areas: {},        // { delegacion_id: [areas] }
    tribunales: [],
    prestaciones: [],
    tiposActuacion: [],
    tiposJuicio: {},  // { materia: [tipos] }
    subtiposJuicio: {},// { tipo_juicio_id: [subtipos] }
    delitos: [],
    estadosProcesales: [],
    estatusInvestigacion: []
};

let catalogosCargados = false;

// =====================================================
// CATÁLOGOS
// =====================================================

async function cargarCatalogos() {
    if (catalogosCargados) return catalogosDB;

    try {
        // Cargar todo en paralelo
        const [
            { data: delegaciones },
            { data: areas },
            { data: tribunales },
            { data: prestaciones },
            { data: tiposActuacion },
            { data: tiposJuicio },
            { data: subtiposJuicio },
            { data: delitos },
            { data: estadosProcesales },
            { data: estatusInvestigacion }
        ] = await Promise.all([
            db().from('delegaciones').select('*').order('id'),
            db().from('areas').select('*').order('delegacion_id, id'),
            db().from('tribunales').select('*').order('id'),
            db().from('prestaciones').select('*').order('id'),
            db().from('tipos_actuacion').select('*').order('id'),
            db().from('tipos_juicio').select('*').order('id'),
            db().from('subtipos_juicio').select('*').order('id'),
            db().from('delitos').select('*').order('nombre'),
            db().from('estados_procesales').select('*').order('orden'),
            db().from('estatus_investigacion').select('*').order('id')
        ]);

        catalogosDB.delegaciones = delegaciones || [];

        // Agrupar áreas por delegación
        catalogosDB.areas = {};
        (areas || []).forEach(a => {
            if (!catalogosDB.areas[a.delegacion_id]) catalogosDB.areas[a.delegacion_id] = [];
            catalogosDB.areas[a.delegacion_id].push(a);
        });

        catalogosDB.tribunales = tribunales || [];
        catalogosDB.prestaciones = prestaciones || [];
        catalogosDB.tiposActuacion = tiposActuacion || [];

        // Agrupar tipos de juicio por materia
        catalogosDB.tiposJuicio = {};
        (tiposJuicio || []).forEach(t => {
            if (!catalogosDB.tiposJuicio[t.materia]) catalogosDB.tiposJuicio[t.materia] = [];
            catalogosDB.tiposJuicio[t.materia].push(t);
        });

        // Agrupar subtipos por tipo_juicio_id
        catalogosDB.subtiposJuicio = {};
        (subtiposJuicio || []).forEach(s => {
            if (!catalogosDB.subtiposJuicio[s.tipo_juicio_id]) catalogosDB.subtiposJuicio[s.tipo_juicio_id] = [];
            catalogosDB.subtiposJuicio[s.tipo_juicio_id].push(s);
        });

        catalogosDB.delitos = delitos || [];
        catalogosDB.estadosProcesales = estadosProcesales || [];
        catalogosDB.estatusInvestigacion = estatusInvestigacion || [];

        catalogosCargados = true;
        console.log('✅ Catálogos cargados desde Supabase');
        return catalogosDB;
    } catch (err) {
        console.error('Error cargando catálogos:', err);
        throw err;
    }
}

// Helpers de catálogos
function obtenerDelegacionDB(id) {
    return catalogosDB.delegaciones.find(d => d.id === id);
}

function obtenerDelegacion(id) {
    if (!id) return null;
    return obtenerDelegacionDB(parseInt(id));
}

function obtenerAreaDB(delegacionId, areaId) {
    const areas = catalogosDB.areas[delegacionId] || [];
    return areas.find(a => a.id === areaId);
}

function obtenerTribunalDB(id) {
    return catalogosDB.tribunales.find(t => t.id === id);
}

function obtenerPrestacionesDB(ids) {
    if (!Array.isArray(ids)) return [];
    return ids.map(id => catalogosDB.prestaciones.find(p => p.id === id)).filter(Boolean);
}

function obtenerDelitoDB(id) {
    return catalogosDB.delitos.find(d => d.id === id);
}

function obtenerEstadoProcesalDB(id) {
    return catalogosDB.estadosProcesales.find(e => e.id === id);
}

function obtenerEstatusInvestigacionDB(id) {
    return catalogosDB.estatusInvestigacion.find(e => e.id === id);
}

function obtenerTribunalesPorDelegacion(delegacionId) {
    if (!delegacionId) return catalogosDB.tribunales;
    return catalogosDB.tribunales.filter(t => t.delegacion_id === parseInt(delegacionId));
}

function obtenerTiposActuacionPorModulo(modulo) {
    // modulo: 'CIVIL' o 'PENAL'
    return catalogosDB.tiposActuacion.filter(t => t.modulo === 'AMBOS' || t.modulo === modulo);
}

function formatearFecha(fecha) {
    if (!fecha) return '---';

    const soloFecha = typeof fecha === 'string' ? fecha.split('T')[0] : null;
    let d;

    if (soloFecha && /^\d{4}-\d{2}-\d{2}$/.test(soloFecha)) {
        const [anio, mes, dia] = soloFecha.split('-').map(Number);
        d = new Date(anio, mes - 1, dia);
    } else {
        d = new Date(fecha);
    }

    if (isNaN(d.getTime())) return fecha;

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function obtenerCacheCasosPenal() {
    return JSON.parse(localStorage.getItem('casosPenal') || '[]');
}

function guardarCacheCasosPenal(casos) {
    localStorage.setItem('casosPenal', JSON.stringify(casos || []));
}

function upsertCacheCasoPenal(caso) {
    if (!caso || !caso.id) return;
    const casos = obtenerCacheCasosPenal();
    const index = casos.findIndex(c => c.id === caso.id);
    if (index >= 0) {
        casos[index] = { ...casos[index], ...caso };
    } else {
        casos.unshift(caso);
    }
    guardarCacheCasosPenal(casos);
}

function eliminarCacheCasoPenal(id) {
    const casos = obtenerCacheCasosPenal().filter(c => c.id !== id);
    guardarCacheCasosPenal(casos);
}

// =====================================================
// USUARIOS
// =====================================================

async function buscarUsuario(usuario, password) {
    const { data, error } = await sb()
        .from('usuarios')
        .select('*')
        .eq('usuario', usuario)
        .eq('password', password)
        .single();

    if (error || !data) return null;
    return data;
}

async function obtenerUsuarios() {
    const { data, error } = await sb()
        .from('usuarios')
        .select('*')
        .order('id');
    if (error) throw error;
    return data || [];
}

async function guardarUsuario(usuario) {
    if (usuario.id) {
        const { data, error } = await sb()
            .from('usuarios')
            .update(usuario)
            .eq('id', usuario.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await sb()
            .from('usuarios')
            .insert(usuario)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

// =====================================================
// EXPEDIENTES CIVIL / MERCANTIL
// =====================================================

async function obtenerCasosCivil(filtros = {}) {
    let query = sb()
        .from('expedientes_civil')
        .select('*')
        .order('id', { ascending: true });

    if (filtros.delegacion_id) {
        query = query.eq('delegacion_id', filtros.delegacion_id);
    }
    if (filtros.estatus) {
        query = query.eq('estatus', filtros.estatus);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Cargar seguimiento más reciente para cada caso
    const casos = data || [];
    for (const caso of casos) {
        const { data: seg } = await sb()
            .from('seguimiento_civil')
            .select('*')
            .eq('expediente_id', caso.id)
            .order('fecha_actuacion', { ascending: false })
            .limit(1);
        caso.seguimiento = seg && seg.length > 0 ? seg[0] : {};

        // Cargar acumulados
        const { data: acum } = await sb()
            .from('acumulados_civil')
            .select('caso_hijo_id')
            .eq('caso_padre_id', caso.id);
        caso.juicios_acumulados = (acum || []).map(a => a.caso_hijo_id);

        // Cargar si está acumulado a otro
        const { data: acumA } = await sb()
            .from('acumulados_civil')
            .select('caso_padre_id')
            .eq('caso_hijo_id', caso.id);
        caso.acumulado_a = acumA && acumA.length > 0 ? acumA[0].caso_padre_id : null;
    }

    return casos;
}

async function obtenerCasoCivil(id) {
    const { data, error } = await sb()
        .from('expedientes_civil')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;

    // Seguimiento completo (timeline)
    const { data: seguimientos } = await sb()
        .from('seguimiento_civil')
        .select('*')
        .eq('expediente_id', id)
        .order('fecha_actuacion', { ascending: false });
    data.seguimientos = seguimientos || [];
    data.seguimiento = seguimientos && seguimientos.length > 0 ? seguimientos[0] : {};

    // Acumulados
    const { data: acum } = await sb()
        .from('acumulados_civil')
        .select('caso_hijo_id')
        .eq('caso_padre_id', id);
    data.juicios_acumulados = (acum || []).map(a => a.caso_hijo_id);

    const { data: acumA } = await sb()
        .from('acumulados_civil')
        .select('caso_padre_id')
        .eq('caso_hijo_id', id);
    data.acumulado_a = acumA && acumA.length > 0 ? acumA[0].caso_padre_id : null;

    return data;
}

async function guardarCasoCivil(caso) {
    // Separar seguimiento y acumulados del caso principal
    const { seguimiento, seguimientos, juicios_acumulados, acumulado_a, ...casoDB } = caso;

    if (!casoDB.actor && Array.isArray(casoDB.actores) && casoDB.actores.length > 0) {
        casoDB.actor = casoDB.actores;
    }
    delete casoDB.actores;

    const columnasPermitidas = [
        'id',
        'numero',
        'delegacion_id',
        'area_generadora_id',
        'jurisdiccion',
        'tipo_juicio',
        'subtipo_juicio',
        'sub_subtipo_juicio',
        'numero_juicio',
        'anio',
        'numero_expediente',
        'tribunal_id',
        'fecha_inicio',
        'imss_es',
        'actor',
        'demandados',
        'codemandados',
        'prestacion_principal',
        'prestaciones_secundarias',
        'prestaciones_notas',
        'importe_demandado',
        'abogado_responsable',
        'pronostico',
        'estatus',
        'fecha_vencimiento'
    ];

    Object.keys(casoDB).forEach(key => {
        if (!columnasPermitidas.includes(key)) {
            delete casoDB[key];
        }
    });

    if (!casoDB.anio && casoDB.ano) {
        casoDB.anio = casoDB.ano;
    }
    delete casoDB.ano;

    if (casoDB.id) {
        // Actualizar
        casoDB.fecha_actualizacion = new Date().toISOString();
        const { data, error } = await sb()
            .from('expedientes_civil')
            .update(casoDB)
            .eq('id', casoDB.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        // Insertar nuevo
        casoDB.fecha_creacion = new Date().toISOString();
        casoDB.fecha_actualizacion = new Date().toISOString();
        const { data, error } = await sb()
            .from('expedientes_civil')
            .insert(casoDB)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

async function actualizarSeguimientoCasoCivil(expedienteId, seguimiento, fechaVencimiento = null) {
    const actuacionGuardada = await agregarSeguimientoCivil(expedienteId, seguimiento);

    const cambiosExpediente = {
        id: expedienteId,
        fecha_vencimiento: fechaVencimiento
    };

    const expedienteActualizado = await guardarCasoCivil(cambiosExpediente);

    return {
        actuacion: actuacionGuardada,
        expediente: expedienteActualizado
    };
}

async function eliminarCasoCivil(id) {
    const { error } = await sb()
        .from('expedientes_civil')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

async function agregarSeguimientoCivil(expedienteId, seguimiento) {
    const { data, error } = await sb()
        .from('seguimiento_civil')
        .insert({
            expediente_id: expedienteId,
            fecha_actuacion: seguimiento.fecha_actuacion,
            tipo_actuacion: seguimiento.tipo_actuacion,
            descripcion: seguimiento.descripcion,
            actualizado_siij: seguimiento.actualizado_siij || 'NO'
        })
        .select()
        .single();
    if (error) throw error;

    // Actualizar fecha_actualizacion del expediente
    await sb()
        .from('expedientes_civil')
        .update({ fecha_actualizacion: new Date().toISOString() })
        .eq('id', expedienteId);

    return data;
}

async function guardarAcumulacionCivil(casoPadreId, casoHijoId) {
    const { error } = await sb()
        .from('acumulados_civil')
        .insert({ caso_padre_id: casoPadreId, caso_hijo_id: casoHijoId });
    if (error) throw error;

    // Cambiar estatus del hijo a CONCLUIDO
    await sb()
        .from('expedientes_civil')
        .update({ estatus: 'CONCLUIDO' })
        .eq('id', casoHijoId);
}

// =====================================================
// EXPEDIENTES PENAL
// =====================================================

async function obtenerCasosPenal(filtros = {}) {
    let query = sb()
        .from('expedientes_penal')
        .select('*')
        .order('id', { ascending: true });

    if (filtros.delegacion_id) {
        query = query.eq('delegacion_id', filtros.delegacion_id);
    }
    if (filtros.estatus) {
        query = query.eq('estatus', filtros.estatus);
    }

    const { data, error } = await query;
    if (error) throw error;

    const casos = data || [];
    // Cargar último seguimiento para cada caso
    for (const caso of casos) {
        const { data: seg } = await sb()
            .from('seguimiento_penal')
            .select('*')
            .eq('expediente_id', caso.id)
            .order('fecha_actuacion', { ascending: false })
            .limit(1);
        caso.seguimiento = seg && seg.length > 0 ? seg[0] : {};
    }

    return casos;
}

async function obtenerCasoPenal(id) {
    const { data, error } = await sb()
        .from('expedientes_penal')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;

    // Timeline completo
    const { data: seguimientos } = await sb()
        .from('seguimiento_penal')
        .select('*')
        .eq('expediente_id', id)
        .order('fecha_actuacion', { ascending: false });
    data.seguimientos = seguimientos || [];
    data.seguimiento = seguimientos && seguimientos.length > 0 ? seguimientos[0] : {};

    return data;
}

async function guardarCasoPenal(caso) {
    const { seguimiento, seguimientos, ...casoDB } = caso;

    if (casoDB.id) {
        casoDB.fecha_actualizacion = new Date().toISOString();
        const { data, error } = await sb()
            .from('expedientes_penal')
            .update(casoDB)
            .eq('id', casoDB.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        casoDB.fecha_creacion = new Date().toISOString();
        casoDB.fecha_actualizacion = new Date().toISOString();
        const { data, error } = await sb()
            .from('expedientes_penal')
            .insert(casoDB)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

async function eliminarCasoPenal(id) {
    const { error } = await sb()
        .from('expedientes_penal')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

async function agregarSeguimientoPenal(expedienteId, seguimiento) {
    const { data, error } = await sb()
        .from('seguimiento_penal')
        .insert({
            expediente_id: expedienteId,
            fecha_actuacion: seguimiento.fecha_actuacion,
            tipo_actuacion: seguimiento.tipo_actuacion,
            descripcion: seguimiento.descripcion
        })
        .select()
        .single();
    if (error) throw error;

    await sb()
        .from('expedientes_penal')
        .update({ fecha_actualizacion: new Date().toISOString() })
        .eq('id', expedienteId);

    return data;
}

