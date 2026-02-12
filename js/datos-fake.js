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
  // =========================================================================
  // GRUPO 1: Juicio Civil Federal (Caso 1 es PADRE de 2 y 3)
  // =========================================================================
  {
    id: 1,
    numero: 1,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 13, // Validación: Área 13 pertenece a Del 5
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Escrito", // Catálogo real
    numero_juicio: "100100",
    año: "2024",
    numero_expediente: "100100/2024",
    acumulado_a: null,
    juicios_acumulados: [2, 3],
    tribunal_id: 1,
    fecha_inicio: "2024-01-10",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Roberto",
      apellido_paterno: "Gómez",
      apellido_materno: "Bolaños"
    },
    demandados: [], // Vacío porque IMSS es demandado
    codemandados: [
      { tipo_persona: "MORAL", empresa: "Constructora del Sur S.A." }
    ],
    prestacion_reclamada: 1, // Indemnización
    prestaciones_notas: "Daño estructural en vivienda colindante",
    importe_demandado: 500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-01-10T09:00:00",
    fecha_actualizacion: "2025-02-10T14:30:00",
    seguimiento: []
  },
  {
    id: 2,
    numero: 2,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 14,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Escrito",
    numero_juicio: "100101",
    año: "2024",
    numero_expediente: "100101/2024",
    acumulado_a: 1, // HIJO del 1
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-02-15",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "María",
      apellido_paterno: "Antonieta",
      apellido_materno: "De las Nieves"
    },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Afectaciones por humedad en muro compartido",
    importe_demandado: 150000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-02-15T10:00:00",
    seguimiento: []
  },
  {
    id: 3,
    numero: 3,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 15,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Escrito",
    numero_juicio: "100102",
    año: "2024",
    numero_expediente: "100102/2024",
    acumulado_a: 1, // HIJO del 1
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-03-01",
    imss_es: "TERCERO",
    actor: {
      tipo_persona: "MORAL",
      empresa: "Aseguradora Chiapaneca S.A."
    },
    demandados: [
      { tipo_persona: "FISICA", nombres: "Juan", apellido_paterno: "Pérez", apellido_materno: "López" }
    ],
    codemandados: [],
    prestacion_reclamada: 4, // Resp. Civil
    prestaciones_notas: "Reclamo de póliza de seguro",
    importe_demandado: 0,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-03-01T11:00:00",
    seguimiento: []
  },

  // =========================================================================
  // GRUPO 2: Juicio Mercantil Local (Caso 4 es PADRE de 5)
  // =========================================================================
  {
    id: 4,
    numero: 4,
    delegacion_id: 2, // BAJA CALIFORNIA
    area_generadora_id: 4, // Área correcta de BC
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Oral", // Catálogo real
    numero_juicio_local: "MER-ORAL-200/2024",
    numero_expediente: "MER-ORAL-200/2024",
    acumulado_a: null,
    juicios_acumulados: [5],
    tribunal_id: 2,
    fecha_inicio: "2024-04-05",
    imss_es: "ACTOR",
    actor: {}, // Vacío si IMSS es Actor
    demandados: [
      { tipo_persona: "MORAL", empresa: "Proveedora Médica del Norte" }
    ],
    codemandados: [
      { tipo_persona: "FISICA", nombres: "Carlos", apellido_paterno: "Villagrán", apellido_materno: "Eslava" }
    ],
    prestacion_reclamada: 3, // Cumplimiento contrato
    prestaciones_notas: "Incumplimiento en entrega de insumos médicos",
    importe_demandado: 2500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-04-05T12:00:00",
    fecha_actualizacion: "2025-02-11T16:45:00",
    seguimiento: []
  },
  {
    id: 5,
    numero: 5,
    delegacion_id: 2, // BAJA CALIFORNIA
    area_generadora_id: 5,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Oral",
    numero_juicio_local: "MER-ORAL-250/2024",
    numero_expediente: "MER-ORAL-250/2024",
    acumulado_a: 4, // HIJO del 4
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-04-20",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Proveedora Médica del Norte" }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de penalizaciones contractuales",
    importe_demandado: 120000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-04-20T13:00:00",
    seguimiento: []
  },

  // =========================================================================
  // CASOS INDEPENDIENTES (VARIADOS)
  // =========================================================================
  {
    id: 6,
    numero: 6,
    delegacion_id: 1, // AGUASCALIENTES
    area_generadora_id: 1,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Hipotecario",
    sub_subtipo_juicio: null, // No tiene subtipos en catálogo
    numero_juicio_local: "HIP-001/2024",
    numero_expediente: "HIP-001/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-05-01",
    imss_es: "TERCERO",
    actor: { tipo_persona: "MORAL", empresa: "Banco del Bajío S.A." },
    demandados: [
      { tipo_persona: "FISICA", nombres: "Empleado", apellido_paterno: "Desconocido", apellido_materno: "N." }
    ],
    codemandados: [],
    prestacion_reclamada: 10, // Nulidad/Otros
    prestaciones_notas: "Informe de descuentos vía nómina",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-05-01T08:00:00",
    seguimiento: []
  },
  {
    id: 7,
    numero: 7,
    delegacion_id: 9, // DF NORTE
    area_generadora_id: 25,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Agrario",
    sub_subtipo_juicio: null, // No tiene
    numero_juicio: "AGR-999",
    año: "2024",
    numero_expediente: "AGR-999/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-05-15",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Comisariado", apellido_paterno: "Ejidal", apellido_materno: "Tláhuac" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 4, // Resp Civil / Tierras
    prestaciones_notas: "Restitución de tierras de la UMF 2",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-05-15T09:30:00",
    seguimiento: []
  },
  {
    id: 8,
    numero: 8,
    delegacion_id: 14, // GUANAJUATO
    area_generadora_id: 48,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Arrendamiento",
    sub_subtipo_juicio: null,
    numero_juicio_local: "ARR-555/2024",
    numero_expediente: "ARR-555/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-06-01",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "FISICA", nombres: "Luis", apellido_paterno: "Miguel", apellido_materno: "Gallego" }
    ],
    codemandados: [],
    prestacion_reclamada: 9, // Rescisión
    prestaciones_notas: "Falta de pago de renta inmueble administrativo",
    importe_demandado: 80000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-06-01T10:00:00",
    seguimiento: []
  },
  {
    id: 9,
    numero: 9,
    delegacion_id: 3, // BCS
    area_generadora_id: 7,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Usucapión",
    sub_subtipo_juicio: null,
    numero_juicio_local: "USU-123/2024",
    numero_expediente: "USU-123/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-06-10",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Juana", apellido_paterno: "Inés", apellido_materno: "De la Cruz" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 3, 
    prestaciones_notas: "Prescripción positiva predio almacén",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-06-10T11:00:00",
    seguimiento: []
  },
  {
    id: 10,
    numero: 10,
    delegacion_id: 10, // DF SUR
    area_generadora_id: 31,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Concursos Mercantiles",
    sub_subtipo_juicio: null,
    numero_juicio: "CM-777",
    año: "2024",
    numero_expediente: "CM-777/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 4,
    fecha_inicio: "2024-07-01",
    imss_es: "TERCERO",
    actor: { tipo_persona: "MORAL", empresa: "Empresas en Quiebra S.A." },
    demandados: [
      { tipo_persona: "MORAL", empresa: "Juez Concursal" }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Reconocimiento de créditos fiscales (Cuotas)",
    importe_demandado: 4500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-07-01T12:00:00",
    seguimiento: []
  },
  {
    id: 11,
    numero: 11,
    delegacion_id: 12, // EDOMEX ORIENTE
    area_generadora_id: 40,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Especial de Fianza",
    sub_subtipo_juicio: null,
    numero_juicio: "FIA-888",
    año: "2024",
    numero_expediente: "FIA-888/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-07-15",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Afianzadora Nacional" }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de fianza por vicios ocultos obra HGR 200",
    importe_demandado: 3000000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-07-15T10:30:00",
    seguimiento: []
  },
  {
    id: 12,
    numero: 12,
    delegacion_id: 7, // COAHUILA
    area_generadora_id: 19,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Oral",
    numero_juicio_local: "CIV-852/2024",
    numero_expediente: "CIV-852/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-08-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Pedro", apellido_paterno: "Infante", apellido_materno: "Cruz" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 5, // Daño moral
    prestaciones_notas: "Demanda por supuesta mala praxis administrativa",
    importe_demandado: 100000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-08-01T09:00:00",
    fecha_actualizacion: "2025-02-12T10:15:00",
    seguimiento: []
  },
  {
    id: 13,
    numero: 13,
    delegacion_id: 8, // COLIMA
    area_generadora_id: 22,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Escrito",
    numero_juicio_local: "MER-ESC-005/2024",
    numero_expediente: "MER-ESC-005/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-08-10",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Seguridad Privada Colima" }
    ],
    codemandados: [],
    prestacion_reclamada: 9, // Rescisión
    prestaciones_notas: "Rescisión contrato seguridad por incumplimiento",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-08-10T14:00:00",
    seguimiento: []
  },
  {
    id: 14,
    numero: 14,
    delegacion_id: 13, // EDOMEX PONIENTE
    area_generadora_id: 43,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Otros",
    sub_subtipo_juicio: null,
    numero_juicio: "OTRO-111",
    año: "2024",
    numero_expediente: "OTRO-111/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-09-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "MORAL", empresa: "Sindicato Nacional" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 10, // Nulidad
    prestaciones_notas: "Nulidad de convenio administrativo",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-09-01T09:00:00",
    seguimiento: []
  },
  {
    id: 15,
    numero: 15,
    delegacion_id: 6, // CHIHUAHUA
    area_generadora_id: 16,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Oral",
    numero_juicio_local: "CIV-1010/2024",
    numero_expediente: "CIV-1010/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-09-15",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "FISICA", nombres: "Jorge", apellido_paterno: "Negrete", apellido_materno: "Moreno" }
    ],
    codemandados: [],
    prestacion_reclamada: 1, // Indemnización
    prestaciones_notas: "Daños a vehículo oficial",
    importe_demandado: 45000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-09-15T11:00:00",
    seguimiento: []
  },
  {
    id: 16,
    numero: 16,
    delegacion_id: 11, // DURANGO
    area_generadora_id: 37,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Otros",
    sub_subtipo_juicio: null,
    numero_juicio: "MER-OTR-222",
    año: "2024",
    numero_expediente: "MER-OTR-222/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-10-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "MORAL", empresa: "Proveedor de Limpieza S.A." },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 2, // Prestaciones
    prestaciones_notas: "Reclamo de intereses moratorios",
    importe_demandado: 50000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-10-01T12:00:00",
    seguimiento: []
  },
  {
    id: 17,
    numero: 17,
    delegacion_id: 4, // CAMPECHE
    area_generadora_id: 10,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Escrito",
    numero_juicio_local: "CIV-CAMP-09/2024",
    numero_expediente: "CIV-CAMP-09/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-10-20",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Arrendadora del Golfo" }
    ],
    codemandados: [],
    prestacion_reclamada: 8, // Finiquito
    prestaciones_notas: "Devolución de depósito en garantía",
    importe_demandado: 30000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-10-20T10:00:00",
    seguimiento: []
  },
  {
    id: 18,
    numero: 18,
    delegacion_id: 15, // GUERRERO
    area_generadora_id: 50,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Agrario",
    sub_subtipo_juicio: null,
    numero_juicio: "AGR-GRO-001",
    año: "2024",
    numero_expediente: "AGR-GRO-001/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-11-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Comunidad", apellido_paterno: "Indígena", apellido_materno: "Tlapa" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 4,
    prestaciones_notas: "Deslinde de terrenos Hospital Rural",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-11-01T11:00:00",
    fecha_actualizacion: "2025-02-08T17:00:00",
    seguimiento: []
  },
  {
    id: 19,
    numero: 19,
    delegacion_id: 1, // AGUASCALIENTES
    area_generadora_id: 3,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Escrito",
    numero_juicio_local: "MER-AGS-900/2024",
    numero_expediente: "MER-AGS-900/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-11-15",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "MORAL", empresa: "Papelería del Centro" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 2,
    prestaciones_notas: "Pago de facturas rezagadas 2023",
    importe_demandado: 15000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-11-15T12:00:00",
    seguimiento: []
  },
  {
    id: 20,
    numero: 20,
    delegacion_id: 3, // BCS
    area_generadora_id: 8,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Oral",
    numero_juicio: "CIV-BCS-777",
    año: "2024",
    numero_expediente: "CIV-BCS-777/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-12-01",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "FISICA", nombres: "Francisco", apellido_paterno: "Villa", apellido_materno: "Arango" }
    ],
    codemandados: [
      { tipo_persona: "MORAL", empresa: "Avales Unidos S.A." }
    ],
    prestacion_reclamada: 1,
    prestaciones_notas: "Recuperación de gastos por subrogación de servicios",
    importe_demandado: 85000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-12-01T09:00:00",
    fecha_actualizacion: "2025-02-09T08:30:00",
    seguimiento: []
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