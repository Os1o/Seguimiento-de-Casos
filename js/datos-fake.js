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
    id: 101,
    numero: 101,
    delegacion_id: 1, // Aguascalientes
    area_generadora_id: 1, // Área de Aguascalientes
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: null,
    numero_expediente: "123456/2025",
    numero_juicio: "123456",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 2, // Juzgado Primero de Distrito
    fecha_inicio: "2025-01-15",
    fecha_creacion: "2025-01-15T10:00:00.000Z",
    fecha_actualizacion: "2025-01-15T10:00:00.000Z",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Juan Carlos",
      apellido_paterno: "Pérez",
      apellido_materno: "González"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Pensión por invalidez",
    importe_demandado: 150000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 102,
    numero: 102,
    delegacion_id: 2, // Baja California
    area_generadora_id: 16, // Área de Baja California
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ejecutivo Mercantil",
    sub_subtipo_juicio: null,
    numero_expediente: "MERC-2025-001",
    numero_juicio_local: "MERC-2025-001",
    acumulado_a: null,
    tribunal_id: 1, // Juzgado Civil
    fecha_inicio: "2025-01-20",
    fecha_creacion: "2025-01-20T09:30:00.000Z",
    fecha_actualizacion: "2025-01-20T09:30:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Constructora del Norte SA de CV"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de adeudo",
    importe_demandado: 500000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 103,
    numero: 103,
    delegacion_id: 5, // Campeche
    area_generadora_id: 61, // Área de Campeche
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Juicio de Amparo",
    sub_subtipo_juicio: "Amparo Indirecto",
    numero_expediente: "654321/2025",
    numero_juicio: "654321",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 3, // Juzgado Segundo de Distrito
    fecha_inicio: "2025-02-05",
    fecha_creacion: "2025-02-05T11:15:00.000Z",
    fecha_actualizacion: "2025-02-05T11:15:00.000Z",
    imss_es: "TERCERO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "María Luisa",
      apellido_paterno: "Rodríguez",
      apellido_materno: "Martínez"
    },
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Empresa Fantasma SA"
      }
    ],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Pedro",
        apellido_paterno: "Sánchez",
        apellido_materno: "López"
      }
    ],
    prestacion_reclamada: 2,
    prestaciones_notas: "Amparo contra negativa de servicio",
    importe_demandado: 0,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 104,
    numero: 104,
    delegacion_id: 7, // Chihuahua
    area_generadora_id: 91, // Área de Chihuahua
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: null,
    numero_expediente: "CIV-2025-045",
    numero_juicio_local: "CIV-2025-045",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-02-10",
    fecha_creacion: "2025-02-10T14:20:00.000Z",
    fecha_actualizacion: "2025-02-10T14:20:00.000Z",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Industrias del Norte SA de CV"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 4,
    prestaciones_notas: "Daños y perjuicios",
    importe_demandado: 250000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 105,
    numero: 105,
    delegacion_id: 9, // Ciudad de México Norte
    area_generadora_id: 121, // Área CDMX Norte
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: null,
    numero_expediente: "789012/2025",
    numero_juicio: "789012",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 4,
    fecha_inicio: "2025-02-15",
    fecha_creacion: "2025-02-15T08:45:00.000Z",
    fecha_actualizacion: "2025-02-15T08:45:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Roberto",
        apellido_paterno: "Hernández",
        apellido_materno: "Vargas"
      },
      {
        tipo_persona: "FISICA",
        nombres: "Ana",
        apellido_paterno: "Jiménez",
        apellido_materno: "Cruz"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 5,
    prestaciones_notas: "Incumplimiento de contrato",
    importe_demandado: 800000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 106,
    numero: 106,
    delegacion_id: 12, // Guerrero
    area_generadora_id: 166, // Área de Guerrero
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Especial Hipotecario",
    sub_subtipo_juicio: null,
    numero_expediente: "HIP-2025-012",
    numero_juicio_local: "HIP-2025-012",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-03-01",
    fecha_creacion: "2025-03-01T10:00:00.000Z",
    fecha_actualizacion: "2025-03-01T10:00:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Luis",
        apellido_paterno: "Gómez",
        apellido_materno: "Ramírez"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Ejecución hipotecaria",
    importe_demandado: 1200000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 107,
    numero: 107,
    delegacion_id: 12, // Guerrero
    area_generadora_id: 167, // Otra área de Guerrero
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: null,
    numero_expediente: "345678/2025",
    numero_juicio: "345678",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 2,
    fecha_inicio: "2025-03-10",
    fecha_creacion: "2025-03-10T12:30:00.000Z",
    fecha_actualizacion: "2025-03-10T12:30:00.000Z",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Carlos",
      apellido_paterno: "Mendoza",
      apellido_materno: "Torres"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 2,
    prestaciones_notas: "Pensión vitalicia",
    importe_demandado: 300000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 108,
    numero: 108,
    delegacion_id: 14, // Jalisco
    area_generadora_id: 196, // Área de Jalisco
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ejecutivo Mercantil",
    sub_subtipo_juicio: null,
    numero_expediente: "EJEC-2025-089",
    numero_juicio_local: "EJEC-2025-089",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-03-15",
    fecha_creacion: "2025-03-15T09:00:00.000Z",
    fecha_actualizacion: "2025-03-15T09:00:00.000Z",
    imss_es: "TERCERO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Proveedores Asociados SA"
    },
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Distribuidora del Pacífico SA de CV"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de pagaré",
    importe_demandado: 450000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 109,
    numero: 109,
    delegacion_id: 15, // Estado de México Oriente
    area_generadora_id: 211, // Área EDOMEX Oriente
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Juicio de Amparo",
    sub_subtipo_juicio: "Amparo Directo",
    numero_expediente: "901234/2025",
    numero_juicio: "901234",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 3,
    fecha_inicio: "2025-03-20",
    fecha_creacion: "2025-03-20T15:45:00.000Z",
    fecha_actualizacion: "2025-03-20T15:45:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Sofía",
        apellido_paterno: "Morales",
        apellido_materno: "Reyes"
      }
    ],
    codemandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Clínica San Rafael SA"
      }
    ],
    prestacion_reclamada: 4,
    prestaciones_notas: "Amparo contra resolución administrativa",
    importe_demandado: 0,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 110,
    numero: 110,
    delegacion_id: 16, // Estado de México Poniente
    area_generadora_id: 226, // Área EDOMEX Poniente
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: null,
    numero_expediente: "ORD-2025-156",
    numero_juicio_local: "ORD-2025-156",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-04-01",
    fecha_creacion: "2025-04-01T11:20:00.000Z",
    fecha_actualizacion: "2025-04-01T11:20:00.000Z",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Diego",
      apellido_paterno: "Castro",
      apellido_materno: "Flores"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Indemnización por accidente",
    importe_demandado: 600000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 111,
    numero: 111,
    delegacion_id: 10, // Ciudad de México Sur
    area_generadora_id: 136, // Área CDMX Sur
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: null,
    numero_expediente: "567890/2025",
    numero_juicio: "567890",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 4,
    fecha_inicio: "2025-04-10",
    fecha_creacion: "2025-04-10T10:15:00.000Z",
    fecha_actualizacion: "2025-04-10T10:15:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Transportes Rápidos del Sur SA de CV"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 5,
    prestaciones_notas: "Incumplimiento contractual",
    importe_demandado: 950000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 112,
    numero: 112,
    delegacion_id: 6, // Coahuila
    area_generadora_id: 76, // Área de Coahuila
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Especial Hipotecario",
    sub_subtipo_juicio: null,
    numero_expediente: "HIP-2025-033",
    numero_juicio_local: "HIP-2025-033",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-04-15",
    fecha_creacion: "2025-04-15T13:30:00.000Z",
    fecha_actualizacion: "2025-04-15T13:30:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Fernando",
        apellido_paterno: "Ruiz",
        apellido_materno: "Ortega"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Ejecución de garantía hipotecaria",
    importe_demandado: 1500000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 113,
    numero: 113,
    delegacion_id: 13, // Hidalgo
    area_generadora_id: 181, // Área de Hidalgo
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: null,
    numero_expediente: "234567/2025",
    numero_juicio: "234567",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 2,
    fecha_inicio: "2025-04-20",
    fecha_creacion: "2025-04-20T09:45:00.000Z",
    fecha_actualizacion: "2025-04-20T09:45:00.000Z",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Servicios Médicos Especializados SA"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 2,
    prestaciones_notas: "Reclamación de servicios médicos",
    importe_demandado: 200000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 114,
    numero: 114,
    delegacion_id: 3, // Baja California Sur
    area_generadora_id: 31, // Área de BCS
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ejecutivo Mercantil",
    sub_subtipo_juicio: null,
    numero_expediente: "MERC-2025-067",
    numero_juicio_local: "MERC-2025-067",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-05-05",
    fecha_creacion: "2025-05-05T14:00:00.000Z",
    fecha_actualizacion: "2025-05-05T14:00:00.000Z",
    imss_es: "TERCERO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Patricia",
      apellido_paterno: "Gutiérrez",
      apellido_materno: "Silva"
    },
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Comercializadora del Pacífico SA"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de letra de cambio",
    importe_demandado: 320000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 115,
    numero: 115,
    delegacion_id: 11, // Durango
    area_generadora_id: 151, // Área de Durango
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Juicio de Amparo",
    sub_subtipo_juicio: "Amparo Indirecto",
    numero_expediente: "678901/2025",
    numero_juicio: "678901",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 3,
    fecha_inicio: "2025-05-10",
    fecha_creacion: "2025-05-10T08:30:00.000Z",
    fecha_actualizacion: "2025-05-10T08:30:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Ricardo",
        apellido_paterno: "Vega",
        apellido_materno: "Núñez"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 4,
    prestaciones_notas: "Amparo contra acto administrativo",
    importe_demandado: 0,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 116,
    numero: 116,
    delegacion_id: 4, // Campeche
    area_generadora_id: 46, // Área de Campeche
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: null,
    numero_expediente: "CIV-2025-078",
    numero_juicio_local: "CIV-2025-078",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-05-15",
    fecha_creacion: "2025-05-15T10:45:00.000Z",
    fecha_actualizacion: "2025-05-15T10:45:00.000Z",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Alejandra",
      apellido_paterno: "Medina",
      apellido_materno: "Campos"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Responsabilidad civil",
    importe_demandado: 350000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 117,
    numero: 117,
    delegacion_id: 8, // Chiapas
    area_generadora_id: 106, // Área de Chiapas
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: null,
    numero_expediente: "890123/2025",
    numero_juicio: "890123",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 4,
    fecha_inicio: "2025-05-20",
    fecha_creacion: "2025-05-20T11:30:00.000Z",
    fecha_actualizacion: "2025-05-20T11:30:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Agroindustrias del Sureste SA de CV"
      },
      {
        tipo_persona: "FISICA",
        nombres: "Jorge",
        apellido_paterno: "Ramírez",
        apellido_materno: "Paz"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 5,
    prestaciones_notas: "Incumplimiento de contrato de suministro",
    importe_demandado: 700000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 118,
    numero: 118,
    delegacion_id: 12, // Guerrero
    area_generadora_id: 168, // Área de Guerrero
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Especial Hipotecario",
    sub_subtipo_juicio: null,
    numero_expediente: "HIP-2025-024",
    numero_juicio_local: "HIP-2025-024",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-06-01",
    fecha_creacion: "2025-06-01T09:15:00.000Z",
    fecha_actualizacion: "2025-06-01T09:15:00.000Z",
    imss_es: "ACTOR",
    actor: null,
    demandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Gabriela",
        apellido_paterno: "López",
        apellido_materno: "Cervantes"
      }
    ],
    codemandados: [
      {
        tipo_persona: "FISICA",
        nombres: "Miguel",
        apellido_paterno: "Cervantes",
        apellido_materno: "Rojas"
      }
    ],
    prestacion_reclamada: 1,
    prestaciones_notas: "Ejecución hipotecaria por incumplimiento",
    importe_demandado: 1800000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 119,
    numero: 119,
    delegacion_id: 12, // Guerrero
    area_generadora_id: 169, // Área de Guerrero
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: null,
    numero_expediente: "456789/2025",
    numero_juicio: "456789",
    año: "2025",
    acumulado_a: null,
    tribunal_id: 2,
    fecha_inicio: "2025-06-10",
    fecha_creacion: "2025-06-10T12:00:00.000Z",
    fecha_actualizacion: "2025-06-10T12:00:00.000Z",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Elena",
      apellido_paterno: "Fuentes",
      apellido_materno: "Márquez"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 2,
    prestaciones_notas: "Pensión por viudez",
    importe_demandado: 280000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
  },
  {
    id: 120,
    numero: 120,
    delegacion_id: 12, // Guerrero
    area_generadora_id: 170, // Área de Guerrero
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ejecutivo Mercantil",
    sub_subtipo_juicio: null,
    numero_expediente: "EJEC-2025-055",
    numero_juicio_local: "EJEC-2025-055",
    acumulado_a: null,
    tribunal_id: 1,
    fecha_inicio: "2025-06-15",
    fecha_creacion: "2025-06-15T14:30:00.000Z",
    fecha_actualizacion: "2025-06-15T14:30:00.000Z",
    imss_es: "TERCERO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Financiera del Pacífico SA de CV"
    },
    demandados: [
      {
        tipo_persona: "MORAL",
        empresa: "Comercial Acapulco SA"
      }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de cheque sin fondos",
    importe_demandado: 180000,
    estatus: "TRAMITE",
    seguimiento: {
      pronostico: null,
      sentencia: null,
      importe_sentencia: null,
      observaciones: null,
      fecha_estado_procesal: null,
      ultimo_estado_procesal: null,
      abogado_responsable: null
    },
    juicios_acumulados: []
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

// Formatear fecha (evita desfase de zona horaria)
function formatearFecha(fecha) {
  // Si la fecha es solo "YYYY-MM-DD", parsear manualmente para evitar que
  // JavaScript la interprete como UTC y muestre el día anterior en zonas horarias negativas
  const soloFecha = typeof fecha === 'string' ? fecha.split('T')[0] : null;
  if (soloFecha && /^\d{4}-\d{2}-\d{2}$/.test(soloFecha)) {
    const [año, mes, dia] = soloFecha.split('-').map(Number);
    const fechaLocal = new Date(año, mes - 1, dia);
    return fechaLocal.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}