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
    fecha_creacion: "2024-01-15T10:30:00",
    fecha_actualizacion: "2024-01-15T10:30:00",
    // Campos de seguimiento (vacíos por default)
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    }
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
    fecha_creacion: "2024-02-20T14:15:00",
    fecha_actualizacion: "2024-02-20T14:15:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-03-10T09:00:00",
    fecha_actualizacion: "2024-03-10T09:00:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-04-05T11:20:00",
    fecha_actualizacion: "2024-04-05T11:20:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-05-12T08:45:00",
    fecha_actualizacion: "2024-05-12T08:45:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-06-18T13:10:00",
    fecha_actualizacion: "2024-06-18T13:10:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-07-22T10:00:00",
    fecha_actualizacion: "2024-07-22T10:00:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-08-30T15:30:00",
    fecha_actualizacion: "2024-08-30T15:30:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-09-15T09:20:00",
    fecha_actualizacion: "2024-09-15T09:20:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
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
    fecha_creacion: "2024-10-20T12:00:00",
    fecha_actualizacion: "2024-10-20T12:00:00",
 // Campos de seguimiento (vacíos por default)
 seguimiento: {
   pronostico: null,
   sentencia: null,
   importe_sentencia: null,
   observaciones: null,
   fecha_estado_procesal: null,
   ultimo_estado_procesal: null,
   abogado_responsable: null
 }
 }
,
  {
    "id": 11,
    "numero": 11,
    "delegacion_id": 6,
    "area_generadora_id": 16,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": "189337",
    "año": "2025",
    "numero_expediente": "189337/2025",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 2,
    "fecha_inicio": "2025-04-21",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Constructora Nacional S.A. de C.V."
    },
    "demandados": [],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Patricia",
        "apellido_paterno": "Pérez",
        "apellido_materno": "Cruz"
      }
    ],
    "prestacion_reclamada": 7,
    "prestaciones_notas": "",
    "importe_demandado": 3572558,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2025-04-21T12:41:00.000Z",
    "fecha_actualizacion": "2025-04-21T12:41:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 12,
    "numero": 12,
    "delegacion_id": 15,
    "area_generadora_id": 63,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Especial de Fianza",
    "sub_subtipo_juicio": null,
    "numero_juicio": "712686",
    "año": "2023",
    "numero_expediente": "712686/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 5,
    "fecha_inicio": "2023-09-22",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Claudia",
      "apellido_paterno": "García",
      "apellido_materno": "Rodríguez"
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 9,
    "prestaciones_notas": "",
    "importe_demandado": 3027694,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-09-22T11:56:00.000Z",
    "fecha_actualizacion": "2023-09-22T11:56:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 13,
    "numero": 13,
    "delegacion_id": 9,
    "area_generadora_id": 25,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": "171950",
    "año": "2022",
    "numero_expediente": "171950/2022",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 7,
    "fecha_inicio": "2022-06-30",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Mónica",
        "apellido_paterno": "Morales",
        "apellido_materno": "Castillo"
      },
      {
        "tipo_persona": "MORAL",
        "empresa": "Aseguradora Nacional S.A."
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 1,
    "prestaciones_notas": "",
    "importe_demandado": 3221850,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2022-06-30T09:59:00.000Z",
    "fecha_actualizacion": "2022-06-30T09:59:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 14,
    "numero": 14,
    "delegacion_id": 8,
    "area_generadora_id": 22,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Usucapión",
    "sub_subtipo_juicio": null,
    "numero_juicio": "622734",
    "año": "2023",
    "numero_expediente": "622734/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 2,
    "fecha_inicio": "2023-08-17",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "MORAL",
        "empresa": "Consultoría Jurídica Integral S.C."
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 4394633,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-08-17T12:50:00.000Z",
    "fecha_actualizacion": "2023-08-17T12:50:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 15,
    "numero": 15,
    "delegacion_id": 6,
    "area_generadora_id": 17,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "MER-2022-945",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 2,
    "fecha_inicio": "2022-01-22",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Patricia",
      "apellido_paterno": "Cruz",
      "apellido_materno": "Castillo"
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Ricardo",
        "apellido_paterno": "Hernández",
        "apellido_materno": "Torres"
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Roberto",
        "apellido_paterno": "García",
        "apellido_materno": "Torres"
      }
    ],
    "prestacion_reclamada": 5,
    "prestaciones_notas": "",
    "importe_demandado": 410908,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-01-22T08:04:00.000Z",
    "fecha_actualizacion": "2022-01-22T08:04:00.000Z",
    "seguimiento": {
      "pronostico": "Desfavorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2022-01-22",
      "ultimo_estado_procesal": "Pruebas",
      "abogado_responsable": "Ana Hernández"
    }
  },
  {
    "id": 16,
    "numero": 16,
    "delegacion_id": 4,
    "area_generadora_id": 10,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Usucapión",
    "sub_subtipo_juicio": null,
    "numero_juicio": "464487",
    "año": "2023",
    "numero_expediente": "464487/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 6,
    "fecha_inicio": "2023-12-19",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Laura",
      "apellido_paterno": "Cruz",
      "apellido_materno": "González"
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Roberto",
        "apellido_paterno": "Ortiz",
        "apellido_materno": "Flores"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 2318632,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-12-19T09:57:00.000Z",
    "fecha_actualizacion": "2023-12-19T09:57:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 17,
    "numero": 17,
    "delegacion_id": 2,
    "area_generadora_id": 6,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": "058213",
    "año": "2024",
    "numero_expediente": "058213/2024",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 6,
    "fecha_inicio": "2024-01-31",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Laura",
      "apellido_paterno": "González",
      "apellido_materno": "Ortiz"
    },
    "demandados": [],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Roberto",
        "apellido_paterno": "García",
        "apellido_materno": "Reyes"
      }
    ],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 590931,
    "estatus": "TRAMITE",
    "fecha_creacion": "2024-01-31T10:46:00.000Z",
    "fecha_actualizacion": "2024-01-31T10:46:00.000Z",
    "seguimiento": {
      "pronostico": "Desfavorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2024-01-31",
      "ultimo_estado_procesal": "Sentencia",
      "abogado_responsable": "Arturo Flores"
    }
  },
  {
    "id": 18,
    "numero": 18,
    "delegacion_id": 5,
    "area_generadora_id": 13,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": "103444",
    "año": "2023",
    "numero_expediente": "103444/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 1,
    "fecha_inicio": "2023-12-27",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Claudia",
      "apellido_paterno": "Torres",
      "apellido_materno": "Reyes"
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 4,
    "prestaciones_notas": "",
    "importe_demandado": 552874,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-12-27T09:16:00.000Z",
    "fecha_actualizacion": "2023-12-27T09:16:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 19,
    "numero": 19,
    "delegacion_id": 15,
    "area_generadora_id": 61,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Hipotecario",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "MER-2025-555",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 8,
    "fecha_inicio": "2025-04-05",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Constructora Nacional S.A. de C.V."
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "TRAMITE",
    "fecha_creacion": "2025-04-05T12:48:00.000Z",
    "fecha_actualizacion": "2025-04-05T12:48:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 20,
    "numero": 20,
    "delegacion_id": 8,
    "area_generadora_id": 22,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Usucapión",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "MER-2025-640",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 2,
    "fecha_inicio": "2025-03-22",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Patricia",
        "apellido_paterno": "González",
        "apellido_materno": "Morales"
      },
      {
        "tipo_persona": "MORAL",
        "empresa": "Laboratorios Farmacéuticos del Sur S.A."
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 7,
    "prestaciones_notas": "",
    "importe_demandado": 626499,
    "estatus": "TRAMITE",
    "fecha_creacion": "2025-03-22T08:28:00.000Z",
    "fecha_actualizacion": "2025-03-22T08:28:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 21,
    "numero": 21,
    "delegacion_id": 11,
    "area_generadora_id": 37,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Usucapión",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "CIV-2023-627",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 2,
    "fecha_inicio": "2023-07-27",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Elena",
      "apellido_paterno": "Castillo",
      "apellido_materno": "Castillo"
    },
    "demandados": [],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Laura",
        "apellido_paterno": "Martínez",
        "apellido_materno": "Torres"
      }
    ],
    "prestacion_reclamada": 2,
    "prestaciones_notas": "",
    "importe_demandado": 3310790,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-07-27T16:47:00.000Z",
    "fecha_actualizacion": "2023-07-27T16:47:00.000Z",
    "seguimiento": {
      "pronostico": "Incierto",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-07-27",
      "ultimo_estado_procesal": "Audiencia",
      "abogado_responsable": "Diana Flores"
    }
  },
  {
    "id": 22,
    "numero": 22,
    "delegacion_id": 10,
    "area_generadora_id": 32,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Concursos Mercantiles",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "HIP-2022-428",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 4,
    "fecha_inicio": "2022-01-11",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Ricardo",
        "apellido_paterno": "Jiménez",
        "apellido_materno": "Sánchez"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 4,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-01-11T16:36:00.000Z",
    "fecha_actualizacion": "2022-01-11T16:36:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 23,
    "numero": 23,
    "delegacion_id": 12,
    "area_generadora_id": 45,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": "542552",
    "año": "2024",
    "numero_expediente": "542552/2024",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 8,
    "fecha_inicio": "2024-06-14",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Laboratorios Farmacéuticos del Sur S.A."
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Ricardo",
        "apellido_paterno": "Martínez",
        "apellido_materno": "García"
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Elena",
        "apellido_paterno": "Pérez",
        "apellido_materno": "Morales"
      }
    ],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 2266312,
    "estatus": "TRAMITE",
    "fecha_creacion": "2024-06-14T17:53:00.000Z",
    "fecha_actualizacion": "2024-06-14T17:53:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 24,
    "numero": 24,
    "delegacion_id": 14,
    "area_generadora_id": 57,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "CIV-2023-353",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 5,
    "fecha_inicio": "2023-05-13",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Ana",
      "apellido_paterno": "López",
      "apellido_materno": "Ortiz"
    },
    "demandados": [
      {
        "tipo_persona": "MORAL",
        "empresa": "Laboratorios Farmacéuticos del Sur S.A."
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 1,
    "prestaciones_notas": "",
    "importe_demandado": 3056704,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-05-13T08:22:00.000Z",
    "fecha_actualizacion": "2023-05-13T08:22:00.000Z",
    "seguimiento": {
      "pronostico": "Incierto",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-05-13",
      "ultimo_estado_procesal": "Sentencia",
      "abogado_responsable": "Laura González"
    }
  },
  {
    "id": 25,
    "numero": 25,
    "delegacion_id": 15,
    "area_generadora_id": 61,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": "879211",
    "año": "2025",
    "numero_expediente": "879211/2025",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 4,
    "fecha_inicio": "2025-06-27",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Transportes Unidos del Centro S.A."
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 3,
    "prestaciones_notas": "",
    "importe_demandado": 485326,
    "estatus": "TRAMITE",
    "fecha_creacion": "2025-06-27T12:22:00.000Z",
    "fecha_actualizacion": "2025-06-27T12:22:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 26,
    "numero": 26,
    "delegacion_id": 4,
    "area_generadora_id": 11,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Usucapión",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "MER-2022-376",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 8,
    "fecha_inicio": "2022-05-27",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Laboratorios Farmacéuticos del Sur S.A."
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 2494823,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-05-27T17:31:00.000Z",
    "fecha_actualizacion": "2022-05-27T17:31:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 27,
    "numero": 27,
    "delegacion_id": 13,
    "area_generadora_id": 51,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": "904196",
    "año": "2025",
    "numero_expediente": "904196/2025",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 6,
    "fecha_inicio": "2025-03-02",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Patricia",
      "apellido_paterno": "Ortiz",
      "apellido_materno": "Mendoza"
    },
    "demandados": [
      {
        "tipo_persona": "MORAL",
        "empresa": "Arrendadora Comercial S.A. de C.V."
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "MORAL",
        "empresa": "Servicios Médicos del Norte S.C."
      }
    ],
    "prestacion_reclamada": 7,
    "prestaciones_notas": "",
    "importe_demandado": 4982927,
    "estatus": "TRAMITE",
    "fecha_creacion": "2025-03-02T13:56:00.000Z",
    "fecha_actualizacion": "2025-03-02T13:56:00.000Z",
    "seguimiento": {
      "pronostico": "Incierto",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2025-03-02",
      "ultimo_estado_procesal": "Audiencia",
      "abogado_responsable": "Ana López"
    }
  },
  {
    "id": 28,
    "numero": 28,
    "delegacion_id": 8,
    "area_generadora_id": 22,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Arrendamiento",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "HIP-2022-167",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 6,
    "fecha_inicio": "2022-02-04",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Distribuidora Metropolitana S.A. de C.V."
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 3,
    "prestaciones_notas": "",
    "importe_demandado": 4223586,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2022-02-04T11:02:00.000Z",
    "fecha_actualizacion": "2022-02-04T11:02:00.000Z",
    "seguimiento": {
      "pronostico": "Desfavorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2022-02-04",
      "ultimo_estado_procesal": "Audiencia",
      "abogado_responsable": "Sandra Rodríguez"
    }
  },
  {
    "id": 29,
    "numero": 29,
    "delegacion_id": 8,
    "area_generadora_id": 23,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": "621413",
    "año": "2023",
    "numero_expediente": "621413/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 5,
    "fecha_inicio": "2023-01-19",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Luis",
      "apellido_paterno": "Sánchez",
      "apellido_materno": "Hernández"
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Arturo",
        "apellido_paterno": "Martínez",
        "apellido_materno": "Castillo"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 1,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2023-01-19T10:25:00.000Z",
    "fecha_actualizacion": "2023-01-19T10:25:00.000Z",
    "seguimiento": {
      "pronostico": "Favorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-01-19",
      "ultimo_estado_procesal": "Demanda",
      "abogado_responsable": "María Rodríguez"
    }
  },
  {
    "id": 30,
    "numero": 30,
    "delegacion_id": 12,
    "area_generadora_id": 43,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Especial de Fianza",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "HIP-2023-766",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 1,
    "fecha_inicio": "2023-08-30",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Arrendadora Comercial S.A. de C.V."
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 3,
    "prestaciones_notas": "",
    "importe_demandado": 3548195,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-08-30T13:46:00.000Z",
    "fecha_actualizacion": "2023-08-30T13:46:00.000Z",
    "seguimiento": {
      "pronostico": "Incierto",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-08-30",
      "ultimo_estado_procesal": "Demanda",
      "abogado_responsable": "Fernando Morales"
    }
  },
  {
    "id": 31,
    "numero": 31,
    "delegacion_id": 4,
    "area_generadora_id": 10,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": "126310",
    "año": "2024",
    "numero_expediente": "126310/2024",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 7,
    "fecha_inicio": "2024-01-28",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Fernando",
      "apellido_paterno": "Ortiz",
      "apellido_materno": "Ramírez"
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 10,
    "prestaciones_notas": "",
    "importe_demandado": 3718210,
    "estatus": "TRAMITE",
    "fecha_creacion": "2024-01-28T15:50:00.000Z",
    "fecha_actualizacion": "2024-01-28T15:50:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 32,
    "numero": 32,
    "delegacion_id": 13,
    "area_generadora_id": 50,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Especial de Fianza",
    "sub_subtipo_juicio": null,
    "numero_juicio": "559182",
    "año": "2023",
    "numero_expediente": "559182/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 1,
    "fecha_inicio": "2023-10-14",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Patricia",
      "apellido_paterno": "Torres",
      "apellido_materno": "Morales"
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Miguel",
        "apellido_paterno": "Vargas",
        "apellido_materno": "Hernández"
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Fernando",
        "apellido_paterno": "González",
        "apellido_materno": "Pérez"
      }
    ],
    "prestacion_reclamada": 1,
    "prestaciones_notas": "",
    "importe_demandado": 153760,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2023-10-14T16:22:00.000Z",
    "fecha_actualizacion": "2023-10-14T16:22:00.000Z",
    "seguimiento": {
      "pronostico": "Favorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-10-14",
      "ultimo_estado_procesal": "Sentencia",
      "abogado_responsable": "Mónica Reyes"
    }
  },
  {
    "id": 33,
    "numero": 33,
    "delegacion_id": 13,
    "area_generadora_id": 51,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Especial de Fianza",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "CIV-2022-828",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 8,
    "fecha_inicio": "2022-09-18",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "MORAL",
        "empresa": "Servicios Médicos del Norte S.C."
      },
      {
        "tipo_persona": "MORAL",
        "empresa": "Servicios Médicos del Norte S.C."
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 9,
    "prestaciones_notas": "",
    "importe_demandado": 1237477,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-09-18T15:54:00.000Z",
    "fecha_actualizacion": "2022-09-18T15:54:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 34,
    "numero": 34,
    "delegacion_id": 13,
    "area_generadora_id": 50,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "CIV-2024-809",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 5,
    "fecha_inicio": "2024-09-08",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "MORAL",
        "empresa": "Servicios Médicos del Norte S.C."
      },
      {
        "tipo_persona": "FISICA",
        "nombres": "Patricia",
        "apellido_paterno": "Ortiz",
        "apellido_materno": "Morales"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 521041,
    "estatus": "TRAMITE",
    "fecha_creacion": "2024-09-08T12:51:00.000Z",
    "fecha_actualizacion": "2024-09-08T12:51:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 35,
    "numero": 35,
    "delegacion_id": 8,
    "area_generadora_id": 24,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Arrendamiento",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "ARR-2022-263",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 2,
    "fecha_inicio": "2022-06-06",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Aseguradora Nacional S.A."
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Héctor",
        "apellido_paterno": "Reyes",
        "apellido_materno": "Morales"
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Héctor",
        "apellido_paterno": "Vargas",
        "apellido_materno": "Hernández"
      }
    ],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-06-06T10:35:00.000Z",
    "fecha_actualizacion": "2022-06-06T10:35:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 36,
    "numero": 36,
    "delegacion_id": 6,
    "area_generadora_id": 17,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Especial de Fianza",
    "sub_subtipo_juicio": null,
    "numero_juicio": "683771",
    "año": "2022",
    "numero_expediente": "683771/2022",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 5,
    "fecha_inicio": "2022-09-28",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Héctor",
        "apellido_paterno": "Castillo",
        "apellido_materno": "Ramírez"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-09-28T15:25:00.000Z",
    "fecha_actualizacion": "2022-09-28T15:25:00.000Z",
    "seguimiento": {
      "pronostico": "Desfavorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2022-09-28",
      "ultimo_estado_procesal": "Sentencia",
      "abogado_responsable": "Luis Castillo"
    }
  },
  {
    "id": 37,
    "numero": 37,
    "delegacion_id": 9,
    "area_generadora_id": 26,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Concursos Mercantiles",
    "sub_subtipo_juicio": null,
    "numero_juicio": "210264",
    "año": "2023",
    "numero_expediente": "210264/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 4,
    "fecha_inicio": "2023-07-22",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Distribuidora Metropolitana S.A. de C.V."
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 4,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-07-22T08:35:00.000Z",
    "fecha_actualizacion": "2023-07-22T08:35:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 38,
    "numero": 38,
    "delegacion_id": 1,
    "area_generadora_id": 2,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": "273229",
    "año": "2022",
    "numero_expediente": "273229/2022",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 5,
    "fecha_inicio": "2022-09-16",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Carlos",
      "apellido_paterno": "Rodríguez",
      "apellido_materno": "Cruz"
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Sandra",
        "apellido_paterno": "Morales",
        "apellido_materno": "Castillo"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-09-16T08:02:00.000Z",
    "fecha_actualizacion": "2022-09-16T08:02:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 39,
    "numero": 39,
    "delegacion_id": 3,
    "area_generadora_id": 8,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "MER-2023-048",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 3,
    "fecha_inicio": "2023-04-08",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Consultoría Jurídica Integral S.C."
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Mónica",
        "apellido_paterno": "Martínez",
        "apellido_materno": "García"
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Claudia",
        "apellido_paterno": "García",
        "apellido_materno": "Rodríguez"
      }
    ],
    "prestacion_reclamada": 2,
    "prestaciones_notas": "",
    "importe_demandado": 4463668,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2023-04-08T10:08:00.000Z",
    "fecha_actualizacion": "2023-04-08T10:08:00.000Z",
    "seguimiento": {
      "pronostico": "Incierto",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-04-08",
      "ultimo_estado_procesal": "Demanda",
      "abogado_responsable": "María Flores"
    }
  },
  {
    "id": 40,
    "numero": 40,
    "delegacion_id": 9,
    "area_generadora_id": 26,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "MER-2022-918",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 6,
    "fecha_inicio": "2022-06-09",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Diana",
      "apellido_paterno": "Torres",
      "apellido_materno": "López"
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Jorge",
        "apellido_paterno": "Pérez",
        "apellido_materno": "López"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 4,
    "prestaciones_notas": "",
    "importe_demandado": 1412119,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-06-09T14:30:00.000Z",
    "fecha_actualizacion": "2022-06-09T14:30:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 41,
    "numero": 41,
    "delegacion_id": 10,
    "area_generadora_id": 31,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Escrito",
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "CIV-2022-021",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 4,
    "fecha_inicio": "2022-08-18",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Sandra",
        "apellido_paterno": "Mendoza",
        "apellido_materno": "Sánchez"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 5,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2022-08-18T13:43:00.000Z",
    "fecha_actualizacion": "2022-08-18T13:43:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 42,
    "numero": 42,
    "delegacion_id": 15,
    "area_generadora_id": 61,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Usucapión",
    "sub_subtipo_juicio": null,
    "numero_juicio": "750528",
    "año": "2023",
    "numero_expediente": "750528/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 1,
    "fecha_inicio": "2023-09-13",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Fernando",
        "apellido_paterno": "González",
        "apellido_materno": "Sánchez"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 9,
    "prestaciones_notas": "",
    "importe_demandado": 1472089,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-09-13T15:09:00.000Z",
    "fecha_actualizacion": "2023-09-13T15:09:00.000Z",
    "seguimiento": {
      "pronostico": "Desfavorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-09-13",
      "ultimo_estado_procesal": "Sentencia",
      "abogado_responsable": "Mónica Rivera"
    }
  },
  {
    "id": 43,
    "numero": 43,
    "delegacion_id": 5,
    "area_generadora_id": 14,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Hipotecario",
    "sub_subtipo_juicio": null,
    "numero_juicio": "521099",
    "año": "2025",
    "numero_expediente": "521099/2025",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 1,
    "fecha_inicio": "2025-02-15",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Arturo",
        "apellido_paterno": "López",
        "apellido_materno": "López"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 7,
    "prestaciones_notas": "",
    "importe_demandado": 3177533,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2025-02-15T11:38:00.000Z",
    "fecha_actualizacion": "2025-02-15T11:38:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 44,
    "numero": 44,
    "delegacion_id": 13,
    "area_generadora_id": 50,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Concursos Mercantiles",
    "sub_subtipo_juicio": null,
    "numero_juicio": "634384",
    "año": "2023",
    "numero_expediente": "634384/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 1,
    "fecha_inicio": "2023-01-10",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Verónica",
      "apellido_paterno": "Morales",
      "apellido_materno": "López"
    },
    "demandados": [
      {
        "tipo_persona": "MORAL",
        "empresa": "Transportes Unidos del Centro S.A."
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Arturo",
        "apellido_paterno": "Flores",
        "apellido_materno": "Rivera"
      }
    ],
    "prestacion_reclamada": 7,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "TRAMITE",
    "fecha_creacion": "2023-01-10T17:19:00.000Z",
    "fecha_actualizacion": "2023-01-10T17:19:00.000Z",
    "seguimiento": {
      "pronostico": "Incierto",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-01-10",
      "ultimo_estado_procesal": "Pruebas",
      "abogado_responsable": "Sandra Rivera"
    }
  },
  {
    "id": 45,
    "numero": 45,
    "delegacion_id": 3,
    "area_generadora_id": 8,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": "713557",
    "año": "2023",
    "numero_expediente": "713557/2023",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 2,
    "fecha_inicio": "2023-10-01",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Luis",
      "apellido_paterno": "Rodríguez",
      "apellido_materno": "Cruz"
    },
    "demandados": [],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Diana",
        "apellido_paterno": "Vargas",
        "apellido_materno": "García"
      }
    ],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 514843,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2023-10-01T13:06:00.000Z",
    "fecha_actualizacion": "2023-10-01T13:06:00.000Z",
    "seguimiento": {
      "pronostico": "Desfavorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2023-10-01",
      "ultimo_estado_procesal": "Pruebas",
      "abogado_responsable": "Arturo Flores"
    }
  },
  {
    "id": 46,
    "numero": 46,
    "delegacion_id": 4,
    "area_generadora_id": 11,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Especial de Fianza",
    "sub_subtipo_juicio": null,
    "numero_juicio": "477409",
    "año": "2024",
    "numero_expediente": "477409/2024",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 4,
    "fecha_inicio": "2024-11-20",
    "imss_es": "TERCERO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Miguel",
      "apellido_paterno": "Flores",
      "apellido_materno": "Rodríguez"
    },
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Roberto",
        "apellido_paterno": "Pérez",
        "apellido_materno": "López"
      }
    ],
    "codemandados": [],
    "prestacion_reclamada": 7,
    "prestaciones_notas": "",
    "importe_demandado": 762560,
    "estatus": "TRAMITE",
    "fecha_creacion": "2024-11-20T11:13:00.000Z",
    "fecha_actualizacion": "2024-11-20T11:13:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 47,
    "numero": 47,
    "delegacion_id": 14,
    "area_generadora_id": 56,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Usucapión",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "ARR-2024-546",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 7,
    "fecha_inicio": "2024-11-17",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Miguel",
        "apellido_paterno": "Mendoza",
        "apellido_materno": "Ramírez"
      },
      {
        "tipo_persona": "MORAL",
        "empresa": "Grupo Industrial del Pacífico S.A."
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Miguel",
        "apellido_paterno": "Hernández",
        "apellido_materno": "López"
      }
    ],
    "prestacion_reclamada": 6,
    "prestaciones_notas": "",
    "importe_demandado": 1852312,
    "estatus": "TRAMITE",
    "fecha_creacion": "2024-11-17T11:03:00.000Z",
    "fecha_actualizacion": "2024-11-17T11:03:00.000Z",
    "seguimiento": {
      "pronostico": "Favorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2024-11-17",
      "ultimo_estado_procesal": "Sentencia",
      "abogado_responsable": "Fernando Cruz"
    }
  },
  {
    "id": 48,
    "numero": 48,
    "delegacion_id": 10,
    "area_generadora_id": 33,
    "jurisdiccion": "LOCAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Especial de Fianza",
    "sub_subtipo_juicio": null,
    "numero_juicio": null,
    "año": null,
    "numero_expediente": "CIV-2022-870",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 7,
    "fecha_inicio": "2022-05-17",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "FISICA",
      "nombres": "Carlos",
      "apellido_paterno": "Reyes",
      "apellido_materno": "González"
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 6,
    "prestaciones_notas": "",
    "importe_demandado": 3372707,
    "estatus": "TRAMITE",
    "fecha_creacion": "2022-05-17T13:47:00.000Z",
    "fecha_actualizacion": "2022-05-17T13:47:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
  {
    "id": 49,
    "numero": 49,
    "delegacion_id": 8,
    "area_generadora_id": 24,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "MERCANTIL",
    "subtipo_juicio": "Concursos Mercantiles",
    "sub_subtipo_juicio": null,
    "numero_juicio": "227083",
    "año": "2022",
    "numero_expediente": "227083/2022",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 4,
    "fecha_inicio": "2022-05-26",
    "imss_es": "DEMANDADO",
    "actor": {
      "tipo_persona": "MORAL",
      "empresa": "Aseguradora Nacional S.A."
    },
    "demandados": [],
    "codemandados": [],
    "prestacion_reclamada": 7,
    "prestaciones_notas": "",
    "importe_demandado": 2986566,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2022-05-26T11:23:00.000Z",
    "fecha_actualizacion": "2022-05-26T11:23:00.000Z",
    "seguimiento": {
      "pronostico": "Favorable",
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": "En espera de resolución",
      "fecha_estado_procesal": "2022-05-26",
      "ultimo_estado_procesal": "Pruebas",
      "abogado_responsable": "Fernando Hernández"
    }
  },
  {
    "id": 50,
    "numero": 50,
    "delegacion_id": 7,
    "area_generadora_id": 21,
    "jurisdiccion": "FEDERAL",
    "tipo_juicio": "CIVIL",
    "subtipo_juicio": "Ordinario",
    "sub_subtipo_juicio": "Oral",
    "numero_juicio": "190010",
    "año": "2025",
    "numero_expediente": "190010/2025",
    "acumulado_a": null,
    "juicios_acumulados": [],
    "tribunal_id": 3,
    "fecha_inicio": "2025-04-30",
    "imss_es": "ACTOR",
    "actor": null,
    "demandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Ana",
        "apellido_paterno": "Morales",
        "apellido_materno": "Hernández"
      }
    ],
    "codemandados": [
      {
        "tipo_persona": "FISICA",
        "nombres": "Héctor",
        "apellido_paterno": "Jiménez",
        "apellido_materno": "Rivera"
      }
    ],
    "prestacion_reclamada": 8,
    "prestaciones_notas": "",
    "importe_demandado": 0,
    "estatus": "CONCLUIDO",
    "fecha_creacion": "2025-04-30T10:16:00.000Z",
    "fecha_actualizacion": "2025-04-30T10:16:00.000Z",
    "seguimiento": {
      "pronostico": null,
      "sentencia": null,
      "importe_sentencia": null,
      "observaciones": null,
      "fecha_estado_procesal": null,
      "ultimo_estado_procesal": null,
      "abogado_responsable": null
    }
  },
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