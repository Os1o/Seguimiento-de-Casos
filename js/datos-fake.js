// =====================================================
// DATOS FAKE PARA MAQUETA FUNCIONAL
// =====================================================

// CATÁLOGOS (Datos reales IMSS - 2-3 áreas por OOAD)
const catalogos = {
  delegaciones: [
    { id: 1, nombre: "AGUASCALIENTES", estado: "Aguascalientes" },
    { id: 2, nombre: "BAJA CALIFORNIA", estado: "Baja California" },
    { id: 3, nombre: "BAJA CALIFORNIA SUR", estado: "Baja California Sur" },
    { id: 4, nombre: "CAMPECHE", estado: "Campeche" },
    { id: 5, nombre: "CHIAPAS", estado: "Chiapas" },
    { id: 6, nombre: "CHIHUAHUA", estado: "Chihuahua" },
    { id: 7, nombre: "COAHUILA", estado: "Coahuila" },
    { id: 8, nombre: "COLIMA", estado: "Colima" },
    { id: 9, nombre: "D.F. NORTE", estado: "Ciudad de México" },
    { id: 10, nombre: "D.F. SUR", estado: "Ciudad de México" },
    { id: 11, nombre: "DURANGO", estado: "Durango" },
    { id: 12, nombre: "ESTADO MEXICO ORIENTE", estado: "Estado de México" },
    { id: 13, nombre: "ESTADO MEXICO PONIENTE", estado: "Estado de México" },
    { id: 14, nombre: "GUANAJUATO", estado: "Guanajuato" },
    { id: 15, nombre: "GUERRERO", estado: "Guerrero" }
  ],
  
  areas: {
    1: [ // AGUASCALIENTES
      { id: 1, nombre: "DELEGACION ESTATAL DEL IMSS EN AGUASCALIENTES AGS." },
      { id: 2, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 1 AGS." },
      { id: 3, nombre: "HOSPITAL GENERAL DE ZONA NUM. 1 AGS." }
    ],
    2: [ // BAJA CALIFORNIA
      { id: 4, nombre: "DELEGACION ESTATAL DEL IMSS EN BAJA CALIFORNIA BC." },
      { id: 5, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 2 BC." },
      { id: 6, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 3 BC." }
    ],
    3: [ // BAJA CALIFORNIA SUR
      { id: 7, nombre: "DELEGACION ESTATAL DEL IMSS EN BAJA CALIFORNIA SUR BCS." },
      { id: 8, nombre: "HOSPITAL GENERAL DE ZONA/MF NUM. 1 BCS." },
      { id: 9, nombre: "HOSPITAL GENERAL DE SUBZONA/MF NUM. 2 BCS." }
    ],
    4: [ // CAMPECHE
      { id: 10, nombre: "DELEGACION ESTATAL DEL IMSS EN CAMPECHE CAM." },
      { id: 11, nombre: "HOSPITAL GENERAL DE ZONA/MF NUM. 1 CAM." },
      { id: 12, nombre: "UNIDAD DE MEDICINA FAMILIAR/CH NUM. 2 CAM." }
    ],
    5: [ // CHIAPAS
      { id: 13, nombre: "DELEGACION ESTATAL DEL IMSS EN CHIAPAS CHS." },
      { id: 14, nombre: "HOSPITAL GENERAL DE ZONA/MF NUM. 1 CHS." },
      { id: 15, nombre: "HOSPITAL GENERAL DE ZONA/MF NUM. 2 CHS." }
    ],
    6: [ // CHIHUAHUA
      { id: 16, nombre: "DELEGACION ESTATAL DEL IMSS EN CHIHUAHUA CHH." },
      { id: 17, nombre: "HOSPITAL GENERAL REGIONAL NUM. 1 CHH." },
      { id: 18, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 2 CHH." }
    ],
    7: [ // COAHUILA
      { id: 19, nombre: "DELEGACION ESTATAL DEL IMSS EN COAHUILA COA." },
      { id: 20, nombre: "HOSPITAL GENERAL DE ZONA NUM. 1 COA." },
      { id: 21, nombre: "HOSPITAL GENERAL DE ZONA NUM. 2 COA." }
    ],
    8: [ // COLIMA
      { id: 22, nombre: "DELEGACION REGIONAL DEL IMSS EN COLIMA COL." },
      { id: 23, nombre: "HOSPITAL GENERAL DE ZONA NUM. 1 COL." },
      { id: 24, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 2 COL." }
    ],
    9: [ // D.F. NORTE
      { id: 25, nombre: "DELEGACION NORTE DEL DISTRITO FEDERAL DFN" },
      { id: 26, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 2 DFN" },
      { id: 27, nombre: "HOSPITAL DE GINECO-OBSTETRICIA NUM. 3A DFN" }
    ],
    10: [ // D.F. SUR
      { id: 31, nombre: "DELEGACION SUR DEL DISTRITO FEDERAL DFS" },
      { id: 32, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 1 DFS" },
      { id: 33, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 4 DFS" }
    ],
    11: [ // DURANGO
      { id: 37, nombre: "DELEGACION ESTATAL DEL IMSS EN DURANGO DGO." },
      { id: 38, nombre: "HOSPITAL GENERAL DE ZONA/MF NUM. 1 DGO." },
      { id: 39, nombre: "HOSPITAL GENERAL DE SUBZONA NUM. 2 DGO." }
    ],
    12: [ // ESTADO MEXICO ORIENTE
      { id: 40, nombre: "DELEGACION ESTADO DE MEXICO ZONA ORIENTE EMO." },
      { id: 41, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 52 EMO." },
      { id: 42, nombre: "HOSPITAL GENERAL DE ZONA NUM. 53 EMO." }
    ],
    13: [ // ESTADO MEXICO PONIENTE
      { id: 43, nombre: "DELEGACION ESTADO DE MEXICO ZONA PONIENTE EMP." },
      { id: 44, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 51 EMP." },
      { id: 45, nombre: "HOSPITAL GENERAL DE ZONA/MF NUM. 58 EMP." }
    ],
    14: [ // GUANAJUATO
      { id: 47, nombre: "DELEGACION ESTATAL DEL IMSS EN GUANAJUATO GTO." },
      { id: 48, nombre: "HOSPITAL GENERAL DE ZONA NUM. 2 GTO." },
      { id: 49, nombre: "UNIDAD DE MEDICINA FAMILIAR NUM. 3 GTO." }
    ],
    15: [ // GUERRERO
      { id: 50, nombre: "DELEGACION ESTATAL DEL IMSS EN GUERRERO GRO." },
      { id: 51, nombre: "HOSPITAL GENERAL DE ZONA/MF NUM. 1 GRO." },
      { id: 52, nombre: "HOSPITAL GENERAL DE ZONA NUM. 2 GRO." }
    ]
  },
  
  tiposJuicio: {
    CIVIL: [
      { 
        id: 1, 
        nombre: "Ordinario",
        subtipos: [
          { id: 11, nombre: "Oral", jurisdiccion: "LOCAL" },
          { id: 12, nombre: "Escrito", jurisdiccion: "AMBAS" }
        ]
      },
      { 
        id: 2, 
        nombre: "Hipotecario",
        jurisdiccion: "LOCAL",
        subtipos: []
      },
      { 
        id: 3, 
        nombre: "Arrendamiento",
        jurisdiccion: "LOCAL",
        subtipos: []
      },
      { 
        id: 4, 
        nombre: "Usucapión",
        jurisdiccion: "LOCAL",
        subtipos: []
      },
      { 
        id: 5, 
        nombre: "Agrario",
        jurisdiccion: "FEDERAL",
        subtipos: []
      },
      { 
        id: 6, 
        nombre: "Otros",
        jurisdiccion: "AMBAS",
        subtipos: [],
        requiere_descripcion: true
      }
    ],
    MERCANTIL: [
      { 
        id: 7, 
        nombre: "Ordinario",
        subtipos: [
          { id: 71, nombre: "Oral", jurisdiccion: "LOCAL" },
          { id: 72, nombre: "Escrito", jurisdiccion: "AMBAS" }
        ]
      },
      { 
        id: 8, 
        nombre: "Concursos Mercantiles",
        jurisdiccion: "FEDERAL",
        subtipos: []
      },
      { 
        id: 9, 
        nombre: "Especial de Fianza",
        jurisdiccion: "FEDERAL",
        subtipos: []
      },
      { 
        id: 10, 
        nombre: "Otros",
        jurisdiccion: "AMBAS",
        subtipos: [],
        requiere_descripcion: true
      }
    ]
  },
  
  tribunales: [
    { id: 1, nombre: "Juzgado Primero Civil - Tuxtla Gutiérrez" },
    { id: 2, nombre: "Juzgado Segundo Mercantil - Guadalajara" },
    { id: 3, nombre: "Juzgado Tercero Civil - Ecatepec" },
    { id: 4, nombre: "Juzgado Cuarto Mercantil - CDMX" },
    { id: 5, nombre: "Juzgado de Distrito Federal - CDMX" }
  ],
  
  prestaciones: [
    { id: 1, nombre: "Indemnización por daños y perjuicios" },
    { id: 2, nombre: "Pago de prestaciones laborales" },
    { id: 3, nombre: "Cumplimiento de contrato" },
    { id: 4, nombre: "Responsabilidad civil" },
    { id: 5, nombre: "Daño moral" },
    { id: 6, nombre: "Pago de salarios caídos" },
    { id: 7, nombre: "Reinstalación laboral" },
    { id: 8, nombre: "Pago de finiquito" },
    { id: 9, nombre: "Rescisión de contrato" },
    { id: 10, nombre: "Nulidad de acto administrativo" }
  ]
};

// CASOS FAKE
const casosFake = [
  {
    id: 1,
    numero: 1,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 13,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Daños y Perjuicios",
    numero_juicio: "123456",
    año: "2024",
    numero_expediente: "123456/2024",
    acumulado_a: null,
    juicios_acumulados: [2, 3],
    tribunal_id: 1,
    fecha_inicio: "2024-01-15",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Juan Carlos",
      apellido_paterno: "Pérez",
      apellido_materno: "García"
    },
    demandados: [], // IMSS es demandado
    codemandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Constructora ABC S.A. de C.V."
      }
    ],
    prestacion_reclamada: 1,
    prestaciones_notas: "Daños ocasionados por negligencia médica durante procedimiento quirúrgico",
    importe_demandado: 500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-01-15T10:30:00"
  },
  {
    id: 2,
    numero: 2,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 14,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Daños y Perjuicios",
    numero_juicio: "234567",
    año: "2024",
    numero_expediente: "234567/2024",
    acumulado_a: 1, // Acumulado al caso 1
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-02-20",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "María Fernanda",
      apellido_paterno: "López",
      apellido_materno: "Sánchez"
    },
    demandados: [],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Pedro",
        apellido_paterno: "Ramírez",
        apellido_materno: "Torres"
      }
    ],
    prestacion_reclamada: 1,
    prestaciones_notas: "Caso relacionado con el expediente principal 123456/2024",
    importe_demandado: 250000.00,
    estatus: "CONCLUIDO", // Automático por estar acumulado
    fecha_creacion: "2024-02-20T14:15:00"
  },
  {
    id: 3,
    numero: 3,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 15,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Daños y Perjuicios",
    numero_juicio: "345678",
    año: "2024",
    numero_expediente: "345678/2024",
    acumulado_a: 1,
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-03-10",
    imss_es: "TERCERO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Farmacéutica Nacional S.A."
    },
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Carlos Alberto",
        apellido_paterno: "González",
        apellido_materno: "Martínez"
      }
    ],
    codemandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Distribuidora Médica del Sur"
      }
    ],
    prestacion_reclamada: 3,
    prestaciones_notas: "Incumplimiento de contrato de suministro médico",
    importe_demandado: 800000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-03-10T09:00:00"
  },
  {
    id: 4,
    numero: 4,
    delegacion_id: 2, // BAJA CALIFORNIA
    area_generadora_id: 4,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ejecutivo Mercantil",
    sub_subtipo_juicio: "Pagaré",
    numero_juicio_local: "MERC-2024-EJ-001",
    numero_expediente: "MERC-2024-EJ-001",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-04-05",
    imss_es: "ACTOR",
    actor: {}, // IMSS es actor
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Tecnología Médica Jalisco S.A."
      },
      {
        tipo_persona: "FISICA",
        nombres: "Roberto",
        apellido_paterno: "Hernández",
        apellido_materno: "Flores"
      }
    ],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Ana Patricia",
        apellido_paterno: "Jiménez",
        apellido_materno: "Ruiz"
      }
    ],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de pagaré vencido por suministro de equipo médico",
    importe_demandado: 1200000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-04-05T11:20:00"
  },
  {
    id: 5,
    numero: 5,
    delegacion_id: 14, // GUANAJUATO
    area_generadora_id: 47,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Especial",
    sub_subtipo_juicio: "Desahucio",
    numero_juicio_local: "CIV-2024-ESP-045",
    numero_expediente: "CIV-2024-ESP-045",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-05-12",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Luis Fernando",
        apellido_paterno: "Morales",
        apellido_materno: "Castro"
      }
    ],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Sandra",
        apellido_paterno: "Vega",
        apellido_materno: "Domínguez"
      }
    ],
    prestacion_reclamada: 9,
    prestaciones_notas: "Desalojo de inmueble propiedad del IMSS",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-05-12T08:45:00"
  },
  {
    id: 6,
    numero: 6,
    delegacion_id: 12, // ESTADO MEXICO ORIENTE
    area_generadora_id: 7,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Cumplimiento de Contrato",
    numero_juicio: "456789",
    año: "2024",
    numero_expediente: "456789/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-06-18",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Servicios Integrales de Salud S.A."
    },
    demandados: [],
    codemandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Gobierno del Estado de México"
      }
    ],
    prestacion_reclamada: 2,
    prestaciones_notas: "Incumplimiento de convenio de subrogación de servicios médicos",
    importe_demandado: 2500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-06-18T13:10:00"
  },
  {
    id: 7,
    numero: 7,
    delegacion_id: 9, // D.F. NORTE
    area_generadora_id: 25,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: null,
    numero_juicio_local: "MERC-ORD-2024-078",
    numero_expediente: "MERC-ORD-2024-078",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-07-22",
    imss_es: "TERCERO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Banco Nacional de México S.A."
    },
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Javier",
        apellido_paterno: "Mendoza",
        apellido_materno: "Silva"
      }
    ],
    codemandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Clínica Privada del Valle"
      }
    ],
    prestacion_reclamada: 4,
    prestaciones_notas: "Controversia mercantil sobre cesión de derechos de crédito",
    importe_demandado: 950000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-07-22T10:00:00"
  },
  {
    id: 8,
    numero: 8,
    delegacion_id: 10, // D.F. SUR
    area_generadora_id: 31,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ejecutivo",
    sub_subtipo_juicio: null,
    numero_juicio: "567890",
    año: "2024",
    numero_expediente: "567890/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-08-30",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Patricia",
        apellido_paterno: "Ortiz",
        apellido_materno: "Navarro"
      }
    ],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Miguel Ángel",
        apellido_paterno: "Reyes",
        apellido_materno: "Guzmán"
      }
    ],
    prestacion_reclamada: 2,
    prestaciones_notas: "Cobro de crédito por pago indebido de prestaciones",
    importe_demandado: 180000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-08-30T15:30:00"
  },
  {
    id: 9,
    numero: 9,
    delegacion_id: 4,
    area_generadora_id: 10,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Daños y Perjuicios",
    numero_juicio_local: "CIV-ORD-2024-192",
    numero_expediente: "CIV-ORD-2024-192",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 4,
    fecha_inicio: "2024-09-15",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Rosa María",
      apellido_paterno: "Soto",
      apellido_materno: "Medina"
    },
    demandados: [],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Francisco",
        apellido_paterno: "Cruz",
        apellido_materno: "Vargas"
      },
      {
        tipo_persona: "MORAL",
        empresa: "Hospital General de Zona 32"
      }
    ],
    prestacion_reclamada: 1,
    prestaciones_notas: "Demanda por mala praxis médica durante atención de emergencia",
    importe_demandado: 750000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-09-15T09:20:00"
  },
  {
    id: 10,
    numero: 10,
    delegacion_id: 4,
    area_generadora_id: 9,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ejecutivo Mercantil",
    sub_subtipo_juicio: "Cheque",
    numero_juicio: "678901",
    año: "2024",
    numero_expediente: "678901/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 4,
    fecha_inicio: "2024-10-20",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Laboratorios Farmacéuticos Unidos S.A."
      }
    ],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Eduardo",
        apellido_paterno: "Campos",
        apellido_materno: "Rojas"
      }
    ],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de cheque devuelto por fondos insuficientes",
    importe_demandado: 320000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-10-20T12:00:00"
  }
];

// USUARIO FAKE (para simular login)
const usuarioFake = {
  id: 1,
  usuario: "oscar.lopez",
  nombre_completo: "Oscar López",
  rol: "usuario",
  delegacion_id: 1,
  permiso_civil_mercantil: true,
  permiso_penal: true
};

// Funciones helper
function obtenerDelegacion(id) {
  return catalogos.delegaciones.find(d => d.id === id);
}

function obtenerArea(delegacionId, areaId) {
  const areas = catalogos.areas[delegacionId] || [];
  return areas.find(a => a.id === areaId);
}

function obtenerTribunal(id) {
  return catalogos.tribunales.find(t => t.id === id);
}

function obtenerPrestaciones(ids) {
  return ids.map(id => catalogos.prestaciones.find(p => p.id === id)).filter(Boolean);
}

function obtenerCaso(id) {
  return casosFake.find(c => c.id === id);
}

function obtenerCasosAcumulados(casoId) {
  const caso = obtenerCaso(casoId);
  if (!caso || !caso.juicios_acumulados || caso.juicios_acumulados.length === 0) {
    return [];
  }
  return caso.juicios_acumulados.map(id => obtenerCaso(id)).filter(Boolean);
}

// Formatear moneda
function formatearMoneda(cantidad) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(cantidad);
}

// Formatear fecha
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}