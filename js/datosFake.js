// =====================================================
// DATOS FAKE PARA MAQUETA FUNCIONAL
// =====================================================

// CATÁLOGOS (Datos reales IMSS - 2-3 áreas por JSJ)
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
        nombre: "Ordinario Civil",
        subtipos: [
          { id: 11, nombre: "Oral", jurisdiccion: "LOCAL" },
          { id: 12, nombre: "Escrito", jurisdiccion: "AMBAS" }
        ]
      },
      { id: 2, nombre: "Ejecutivo", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 3, nombre: "Sumario", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 4, nombre: "Especial", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 5, nombre: "Especial Hipotecario", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 6, nombre: "Agrario", jurisdiccion: "FEDERAL", subtipos: [] },
      { id: 7, nombre: "Arrendamiento", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 8, nombre: "Reivindicatorio", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 9, nombre: "Usucapión", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 10, nombre: "Medios Preparatorios a Juicio", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 11, nombre: "Jurisdicción Voluntaria", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 12, nombre: "Ordinario Familiar", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 13, nombre: "Oral Familiar", jurisdiccion: "LOCAL", subtipos: [] },
      { id: 14, nombre: "Otro, caso sui generis", jurisdiccion: "AMBAS", subtipos: [], requiere_descripcion: true }
    ],
    MERCANTIL: [
      {
        id: 20,
        nombre: "Ordinario Mercantil",
        subtipos: [
          { id: 201, nombre: "Oral", jurisdiccion: "FEDERAL" },
          { id: 202, nombre: "Escrito", jurisdiccion: "AMBAS" }
        ]
      },
      { id: 21, nombre: "Ejecutivo", jurisdiccion: "AMBAS", subtipos: [] },
      {
        id: 22,
        nombre: "Especiales",
        jurisdiccion: "FEDERAL",
        subtipos: [
          { id: 221, nombre: "Concursos Mercantiles", jurisdiccion: "FEDERAL" },
          { id: 222, nombre: "Especial de Fianzas", jurisdiccion: "FEDERAL" }
        ]
      },
      { id: 23, nombre: "Otro, caso sui generis", jurisdiccion: "AMBAS", subtipos: [], requiere_descripcion: true }
    ],
    "AMPARO INDIRECTO": [
      { id: 30, nombre: "Amparo Indirecto", jurisdiccion: "FEDERAL", subtipos: [] }
    ]
  },
  
  tribunales: [
    { id: 1, nombre: "Juzgado Primero Civil - Tuxtla Gutiérrez", delegacion_id: 5 },
    { id: 2, nombre: "Juzgado Segundo Mercantil - Guadalajara", delegacion_id: 8 },
    { id: 3, nombre: "Juzgado Tercero Civil - Ecatepec", delegacion_id: 12 },
    { id: 4, nombre: "Juzgado Cuarto Mercantil - CDMX", delegacion_id: 9 },
    { id: 5, nombre: "Juzgado de Distrito Federal - CDMX", delegacion_id: 9 },
    { id: 6, nombre: "Juzgado Primero Civil - Aguascalientes", delegacion_id: 1 },
    { id: 7, nombre: "Juzgado Primero Civil - Mexicali", delegacion_id: 2 },
    { id: 8, nombre: "Juzgado Primero Civil - La Paz", delegacion_id: 3 },
    { id: 9, nombre: "Juzgado Primero Civil - Campeche", delegacion_id: 4 },
    { id: 10, nombre: "Juzgado Primero Civil - Chihuahua", delegacion_id: 6 },
    { id: 11, nombre: "Juzgado Primero Civil - Saltillo", delegacion_id: 7 },
    { id: 12, nombre: "Juzgado Primero Civil - Colima", delegacion_id: 8 },
    { id: 13, nombre: "Juzgado Segundo Civil - CDMX Sur", delegacion_id: 10 },
    { id: 14, nombre: "Juzgado Primero Civil - Durango", delegacion_id: 11 },
    { id: 15, nombre: "Juzgado Segundo Civil - Ecatepec", delegacion_id: 12 },
    { id: 16, nombre: "Juzgado Primero Civil - Toluca", delegacion_id: 13 },
    { id: 17, nombre: "Juzgado Primero Civil - León", delegacion_id: 14 },
    { id: 18, nombre: "Juzgado Primero Civil - Chilpancingo", delegacion_id: 15 }
  ],
  
  tiposActuacion: [
    "Acuerdo", "Alegatos", "Amparo", "Archivo", "Audiencia",
    "Caducidad", "Conciliación", "Contestación", "Demanda", "Desahogo",
    "Ejecución", "Notificación", "Pericial", "Promoción", "Pruebas",
    "Recurso", "Sentencia", "Sobreseimiento", "Suspensión", "Vista"
  ],

  prestaciones: [
    { id: 1, nombre: "Indemnización por daños y perjuicios" },
    { id: 2, nombre: "Indemnización por reparación del daño moral" },
    { id: 3, nombre: "Indemnización por reparación del daño moral indirecto" },
    { id: 4, nombre: "Indemnización por daño material" },
    { id: 5, nombre: "Recuperación de créditos hipotecarios" },
    { id: 6, nombre: "Recuperación de préstamos para financiamiento de automóvil" },
    { id: 7, nombre: "Recuperación por préstamos a mediano plazo" },
    { id: 8, nombre: "Reconocimiento y pago de adeudo de cuotas obrero patronales (concurso mercantil)" },
    { id: 9, nombre: "Arrendamientos de inmuebles, desocupación y entrega de inmueble" },
    { id: 10, nombre: "Arrendamientos de inmuebles, pago de rentas vencidas" },
    { id: 11, nombre: "Arrendamientos de inmuebles, formalización de contrato" },
    { id: 12, nombre: "Reivindicación de bien inmueble" },
    { id: 13, nombre: "Declaración judicial de la prescripción de la acción hipotecaria" },
    { id: 14, nombre: "Declaración judicial de incumplimiento contrato de obra pública" },
    { id: 15, nombre: "Declaración judicial de la nulidad absoluta de escritura pública" },
    { id: 16, nombre: "Declaración judicial de terminación del contrato de arrendamiento" },
    { id: 17, nombre: "Declaración judicial de nulidad de contrato" },
    { id: 18, nombre: "Rescisión del mutuo con interés y garantía hipotecaria" },
    { id: 19, nombre: "Vencimiento anticipado del contrato de mutuo con interés y garantía hipotecaria" },
    { id: 20, nombre: "Cumplimiento forzoso de contrato" },
    { id: 21, nombre: "Pago de intereses moratorios" },
    { id: 22, nombre: "Pago de gastos financieros" },
    { id: 23, nombre: "Pago de actualizaciones" },
    { id: 24, nombre: "Pago de recargos" },
    { id: 25, nombre: "Pago de devolución de anticipo" },
    { id: 26, nombre: "Pago de gastos" },
    { id: 27, nombre: "Pago de costas" },
    { id: 28, nombre: "Pago de cuotas de recuperación" },
    { id: 29, nombre: "Pago de honorarios profesionales" },
    { id: 30, nombre: "Pago de facturas por adquisición de servicios profesionales" },
    { id: 31, nombre: "Pago de facturas por adquisición de bienes" },
    { id: 32, nombre: "Pago de cantidad garantizada en póliza de fianza por incumplimiento de contrato" },
    { id: 33, nombre: "Pago de saldos insolutos" },
    { id: 34, nombre: "Pago de cantidad en dinero por concepto de suerte principal consignado en el título de crédito" },
    { id: 35, nombre: "Pago de la cantidad del cobro indebido" },
    { id: 36, nombre: "Publicación de extractos de la sentencia" },
    { id: 37, nombre: "Pago por reembolso de gastos médicos" },
    { id: 38, nombre: "Nulidad de contrato de crédito y mandato irrevocable para descuento vía nómina y pago de indemnización por daño moral y daños punitivos" },
    { id: 39, nombre: "Consignación de rentas" },
    { id: 40, nombre: "Pago derivado de título de crédito en su modalidad de pagaré" }
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
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: "Escrito",
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
    prestacion_principal: 1,
    prestaciones_secundarias: [4, 21],
    prestaciones_notas: "Daño estructural en vivienda colindante",
    importe_demandado: 500000.00,
    abogado_responsable: "Lic. Fernando Ruiz Díaz",
    pronostico: "FAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-01-10T09:00:00",
    fecha_actualizacion: "2025-02-10T14:30:00",
    fecha_vencimiento: "2025-03-15",
    seguimiento: {
      fecha_actuacion: "2025-02-10",
      tipo_actuacion: "Audiencia",
      descripcion: "Se llevó a cabo audiencia de pruebas y alegatos. El juzgado admitió las pruebas documentales del IMSS. Se fijó fecha para siguiente audiencia.",
      actualizado_siij: "SI"
    }
  },
  {
    id: 2,
    numero: 2,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 14,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
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
    prestacion_principal: 1,
    prestaciones_secundarias: [],
    prestaciones_notas: "Afectaciones por humedad en muro compartido",
    importe_demandado: 150000.00,
    abogado_responsable: "Lic. Fernando Ruiz Díaz",
    pronostico: "FAVORABLE",
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-02-15T10:00:00",
    seguimiento: {}
  },
  {
    id: 3,
    numero: 3,
    delegacion_id: 5, // CHIAPAS
    area_generadora_id: 15,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
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
    prestacion_principal: 4,
    prestaciones_secundarias: [2],
    prestaciones_notas: "Reclamo de póliza de seguro",
    importe_demandado: 0,
    pronostico: "DESFAVORABLE",
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-03-01T11:00:00",
    seguimiento: {}
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
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: "Escrito",
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
    prestacion_principal: 3,
    prestaciones_secundarias: [20, 27],
    prestaciones_notas: "Incumplimiento en entrega de insumos médicos",
    importe_demandado: 2500000.00,
    abogado_responsable: "Lic. Adriana Soto Mendoza",
    pronostico: "DESFAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-04-05T12:00:00",
    fecha_actualizacion: "2025-02-11T16:45:00",
    fecha_vencimiento: "2025-03-20",
    seguimiento: {
      fecha_actuacion: "2025-02-11",
      tipo_actuacion: "Promoción",
      descripcion: "Se presentó promoción solicitando prórroga para desahogo de pruebas periciales. El tribunal acordó favorablemente.",
      actualizado_siij: "PENDIENTE"
    }
  },
  {
    id: 5,
    numero: 5,
    delegacion_id: 2, // BAJA CALIFORNIA
    area_generadora_id: 5,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: "Escrito",
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
    prestacion_principal: 3,
    prestaciones_secundarias: [],
    prestaciones_notas: "Cobro de penalizaciones contractuales",
    importe_demandado: 120000.00,
    pronostico: "FAVORABLE",
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-04-20T13:00:00",
    seguimiento: {}
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
    subtipo_juicio: "Especial Hipotecario",
    sub_subtipo_juicio: null,
    numero_juicio_local: "HIP-001/2024",
    numero_expediente: "HIP-001/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 6,
    fecha_inicio: "2024-05-01",
    imss_es: "TERCERO",
    actor: { tipo_persona: "MORAL", empresa: "Banco del Bajío S.A." },
    demandados: [
      { tipo_persona: "FISICA", nombres: "Empleado", apellido_paterno: "Desconocido", apellido_materno: "N." }
    ],
    codemandados: [],
    prestacion_principal: 10,
    prestaciones_secundarias: [9],
    prestaciones_notas: "Informe de descuentos vía nómina",
    importe_demandado: 0,
    pronostico: "INCIERTO",
    estatus: "TRAMITE",
    fecha_creacion: "2024-05-01T08:00:00",
    seguimiento: {}
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
    prestacion_principal: 4,
    prestaciones_secundarias: [12],
    prestaciones_notas: "Restitución de tierras de la UMF 2",
    importe_demandado: 0,
    abogado_responsable: "Lic. Patricia Vega Noriega",
    pronostico: "DESFAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-05-15T09:30:00",
    seguimiento: {}
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
    tribunal_id: 17,
    fecha_inicio: "2024-06-01",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "FISICA", nombres: "Luis", apellido_paterno: "Miguel", apellido_materno: "Gallego" }
    ],
    codemandados: [],
    prestacion_principal: 9,
    prestaciones_secundarias: [16],
    prestaciones_notas: "Falta de pago de renta inmueble administrativo",
    importe_demandado: 80000.00,
    abogado_responsable: "Lic. Miguel Ángel Torres",
    pronostico: "FAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-06-01T10:00:00",
    seguimiento: {}
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
    tribunal_id: 8,
    fecha_inicio: "2024-06-10",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Juana", apellido_paterno: "Inés", apellido_materno: "De la Cruz" },
    demandados: [],
    codemandados: [],
    prestacion_principal: 3,
    prestaciones_secundarias: [],
    prestaciones_notas: "Prescripción positiva predio almacén",
    importe_demandado: 0,
    pronostico: "INCIERTO",
    estatus: "TRAMITE",
    fecha_creacion: "2024-06-10T11:00:00",
    seguimiento: {}
  },
  {
    id: 10,
    numero: 10,
    delegacion_id: 10, // DF SUR
    area_generadora_id: 31,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Especiales",
    sub_subtipo_juicio: "Concursos Mercantiles",
    numero_juicio: "CM-777",
    año: "2024",
    numero_expediente: "CM-777/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 13,
    fecha_inicio: "2024-07-01",
    imss_es: "TERCERO",
    actor: { tipo_persona: "MORAL", empresa: "Empresas en Quiebra S.A." },
    demandados: [
      { tipo_persona: "MORAL", empresa: "Juez Concursal" }
    ],
    codemandados: [],
    prestacion_principal: 3,
    prestaciones_secundarias: [8, 33],
    prestaciones_notas: "Reconocimiento de créditos fiscales (Cuotas)",
    importe_demandado: 4500000.00,
    abogado_responsable: "Lic. Ricardo Monreal Ávila",
    pronostico: "FAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-07-01T12:00:00",
    seguimiento: {}
  },
  {
    id: 11,
    numero: 11,
    delegacion_id: 12, // EDOMEX ORIENTE
    area_generadora_id: 40,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Especiales",
    sub_subtipo_juicio: "Especial de Fianzas",
    numero_juicio: "FIA-888",
    año: "2024",
    numero_expediente: "FIA-888/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-07-15",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Afianzadora Nacional" }
    ],
    codemandados: [],
    prestacion_principal: 3,
    prestaciones_secundarias: [32],
    prestaciones_notas: "Cobro de fianza por vicios ocultos obra HGR 200",
    importe_demandado: 3000000.00,
    abogado_responsable: "Lic. Laura Esquivel Pérez",
    pronostico: "FAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-07-15T10:30:00",
    seguimiento: {}
  },
  {
    id: 12,
    numero: 12,
    delegacion_id: 7, // COAHUILA
    area_generadora_id: 19,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: "Oral",
    numero_juicio_local: "CIV-852/2024",
    numero_expediente: "CIV-852/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 11,
    fecha_inicio: "2024-08-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Pedro", apellido_paterno: "Infante", apellido_materno: "Cruz" },
    demandados: [],
    codemandados: [],
    prestacion_principal: 5,
    prestaciones_secundarias: [2, 37],
    prestaciones_notas: "Demanda por supuesta mala praxis administrativa",
    importe_demandado: 100000.00,
    abogado_responsable: "Lic. Fernando Ruiz Díaz",
    pronostico: "DESFAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-08-01T09:00:00",
    fecha_actualizacion: "2025-02-12T10:15:00",
    fecha_vencimiento: "2025-04-01",
    seguimiento: {
      fecha_actuacion: "2025-02-12",
      tipo_actuacion: "Contestación",
      descripcion: "Se presentó contestación de demanda por parte del IMSS. Se opusieron excepciones de falta de legitimación activa y prescripción de la acción.",
      actualizado_siij: "SI"
    }
  },
  {
    id: 13,
    numero: 13,
    delegacion_id: 8, // COLIMA
    area_generadora_id: 22,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: "Escrito",
    numero_juicio_local: "MER-ESC-005/2024",
    numero_expediente: "MER-ESC-005/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 12,
    fecha_inicio: "2024-08-10",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Seguridad Privada Colima" }
    ],
    codemandados: [],
    prestacion_principal: 9,
    prestaciones_secundarias: [],
    prestaciones_notas: "Rescisión contrato seguridad por incumplimiento",
    importe_demandado: 0,
    pronostico: "INCIERTO",
    estatus: "TRAMITE",
    fecha_creacion: "2024-08-10T14:00:00",
    seguimiento: {}
  },
  {
    id: 14,
    numero: 14,
    delegacion_id: 13, // EDOMEX PONIENTE
    area_generadora_id: 43,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Otro, caso sui generis",
    sub_subtipo_juicio: null,
    numero_juicio: "OTRO-111",
    año: "2024",
    numero_expediente: "OTRO-111/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 16,
    fecha_inicio: "2024-09-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "MORAL", empresa: "Sindicato Nacional" },
    demandados: [],
    codemandados: [],
    prestacion_principal: 10,
    prestaciones_secundarias: [17],
    prestaciones_notas: "Nulidad de convenio administrativo",
    importe_demandado: 0,
    pronostico: "DESFAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-09-01T09:00:00",
    seguimiento: {}
  },
  {
    id: 15,
    numero: 15,
    delegacion_id: 6, // CHIHUAHUA
    area_generadora_id: 16,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: "Oral",
    numero_juicio_local: "CIV-1010/2024",
    numero_expediente: "CIV-1010/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 10,
    fecha_inicio: "2024-09-15",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "FISICA", nombres: "Jorge", apellido_paterno: "Negrete", apellido_materno: "Moreno" }
    ],
    codemandados: [],
    prestacion_principal: 1,
    prestaciones_secundarias: [26],
    prestaciones_notas: "Daños a vehículo oficial",
    importe_demandado: 45000.00,
    pronostico: "FAVORABLE",
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-09-15T11:00:00",
    seguimiento: {}
  },
  {
    id: 16,
    numero: 16,
    delegacion_id: 11, // DURANGO
    area_generadora_id: 37,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Otro, caso sui generis",
    sub_subtipo_juicio: null,
    numero_juicio: "MER-OTR-222",
    año: "2024",
    numero_expediente: "MER-OTR-222/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 14,
    fecha_inicio: "2024-10-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "MORAL", empresa: "Proveedor de Limpieza S.A." },
    demandados: [],
    codemandados: [],
    prestacion_principal: 2,
    prestaciones_secundarias: [21],
    prestaciones_notas: "Reclamo de intereses moratorios",
    importe_demandado: 50000.00,
    pronostico: "INCIERTO",
    estatus: "TRAMITE",
    fecha_creacion: "2024-10-01T12:00:00",
    seguimiento: {}
  },
  {
    id: 17,
    numero: 17,
    delegacion_id: 4, // CAMPECHE
    area_generadora_id: 10,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: "Escrito",
    numero_juicio_local: "CIV-CAMP-09/2024",
    numero_expediente: "CIV-CAMP-09/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 9,
    fecha_inicio: "2024-10-20",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Arrendadora del Golfo" }
    ],
    codemandados: [],
    prestacion_principal: 8,
    prestaciones_secundarias: [],
    prestaciones_notas: "Devolución de depósito en garantía",
    importe_demandado: 30000.00,
    abogado_responsable: "Lic. Ana Martínez Solís",
    pronostico: "FAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-10-20T10:00:00",
    seguimiento: {}
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
    tribunal_id: 18,
    fecha_inicio: "2024-11-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Comunidad", apellido_paterno: "Indígena", apellido_materno: "Tlapa" },
    demandados: [],
    codemandados: [],
    prestacion_principal: 4,
    prestaciones_secundarias: [12],
    prestaciones_notas: "Deslinde de terrenos Hospital Rural",
    importe_demandado: 0,
    abogado_responsable: "Lic. Patricia Vega Noriega",
    pronostico: "DESFAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-11-01T11:00:00",
    fecha_actualizacion: "2025-02-08T17:00:00",
    fecha_vencimiento: "2025-03-01",
    seguimiento: {
      fecha_actuacion: "2025-02-08",
      tipo_actuacion: "Acuerdo",
      descripcion: "El tribunal agrario emitió acuerdo requiriendo al IMSS la presentación de documentos que acrediten la propiedad del terreno en disputa. Plazo de 10 días hábiles.",
      actualizado_siij: "NO"
    }
  },
  {
    id: 19,
    numero: 19,
    delegacion_id: 1, // AGUASCALIENTES
    area_generadora_id: 3,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: "Escrito",
    numero_juicio_local: "MER-AGS-900/2024",
    numero_expediente: "MER-AGS-900/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 6,
    fecha_inicio: "2024-11-15",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "MORAL", empresa: "Papelería del Centro" },
    demandados: [],
    codemandados: [],
    prestacion_principal: 2,
    prestaciones_secundarias: [21, 27],
    prestaciones_notas: "Pago de facturas rezagadas 2023",
    importe_demandado: 15000.00,
    pronostico: "DESFAVORABLE",
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-11-15T12:00:00",
    seguimiento: {}
  },
  {
    id: 20,
    numero: 20,
    delegacion_id: 3, // BCS
    area_generadora_id: 8,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario Civil",
    sub_subtipo_juicio: "Escrito",
    numero_juicio: "CIV-BCS-777",
    año: "2024",
    numero_expediente: "CIV-BCS-777/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 8,
    fecha_inicio: "2024-12-01",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "FISICA", nombres: "Francisco", apellido_paterno: "Villa", apellido_materno: "Arango" }
    ],
    codemandados: [
      { tipo_persona: "MORAL", empresa: "Avales Unidos S.A." }
    ],
    prestacion_principal: 1,
    prestaciones_secundarias: [26, 37],
    prestaciones_notas: "Recuperación de gastos por subrogación de servicios",
    importe_demandado: 85000.00,
    abogado_responsable: "Lic. Adriana Soto Mendoza",
    pronostico: "FAVORABLE",
    estatus: "TRAMITE",
    fecha_creacion: "2024-12-01T09:00:00",
    fecha_actualizacion: "2025-02-09T08:30:00",
    fecha_vencimiento: "2025-03-10",
    seguimiento: {
      fecha_actuacion: "2025-02-09",
      tipo_actuacion: "Desahogo",
      descripcion: "Se desahogó prueba pericial en grafoscopía. El perito ratificó su dictamen favorable al IMSS. La contraparte no presentó objeciones.",
      actualizado_siij: "SI"
    }
  }
];

// USUARIOS FAKE (catálogo de usuarios del sistema)
const usuariosFake = [
  {
    id: 1,
    usuario: "admin",
    password: "admin123",
    nombre_completo: "Administrador General",
    rol: "admin",
    delegacion_id: null,
    permiso_civil_mercantil: true,
    permiso_penal: true,
    activo: true
  },
  {
    id: 2,
    usuario: "oscar.lopez",
    password: "1234",
    nombre_completo: "Oscar López",
    rol: "editor",
    delegacion_id: 5,
    permiso_civil_mercantil: true,
    permiso_penal: false,
    activo: true
  },
  {
    id: 3,
    usuario: "maria.garcia",
    password: "1234",
    nombre_completo: "María García",
    rol: "consulta",
    delegacion_id: 5,
    permiso_civil_mercantil: true,
    permiso_penal: false,
    activo: true
  },
  {
    id: 4,
    usuario: "carlos.ramirez",
    password: "1234",
    nombre_completo: "Carlos Ramírez",
    rol: "editor",
    delegacion_id: 2,
    permiso_civil_mercantil: true,
    permiso_penal: false,
    activo: true
  },
  {
    id: 5,
    usuario: "ana.martinez",
    password: "1234",
    nombre_completo: "Ana Martínez",
    rol: "editor",
    delegacion_id: 1,
    permiso_civil_mercantil: true,
    permiso_penal: false,
    activo: true
  }
];

// Inicializar usuarios en localStorage si no existen
function inicializarUsuarios() {
  if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(usuariosFake));
  }
}
inicializarUsuarios();

// =====================================================
// CASOS PENALES FAKE
// =====================================================
const casosPenalFake = [
  {
    id: 1, numero: 1, delegacion_id: 5,
    numero_expediente: "PEN-CHS-001/2024",
    fecha_inicio: "2024-03-15",
    delito_id: 1,
    denunciante: { tipo_persona: "MORAL", empresa: "IMSS Delegación Chiapas" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "Miguel", apellido_paterno: "Hernández", apellido_materno: "Cruz" },
    fecha_conocimiento_amp: "2024-03-16",
    estado_procesal_id: 4,
    acciones_pendientes: "Dar seguimiento a la audiencia de juicio oral programada para el 15/04/2025",
    fecha_judicializacion: "2024-08-20",
    determinacion_judicial: "Vinculado a proceso",
    sentencia: null, fecha_sentencia: null, fecha_conclusion: null,
    dato_relevante: "Robo de equipo médico del almacén del HGZ No. 1",
    estatus: "TRAMITE",
    abogado_responsable: "Lic. Fernando Ruiz Díaz",
    fecha_creacion: "2024-03-15T09:00:00",
    fecha_actualizacion: "2025-03-01T10:00:00",
    seguimiento: { fecha_actuacion: "2025-03-01", tipo_actuacion: "Audiencia", descripcion: "Se programó audiencia de juicio oral para el 15/04/2025." },
    seguimientos: [
      { fecha_actuacion: "2024-03-16", tipo_actuacion: "Denuncia", descripcion: "Se presentó denuncia ante el Ministerio Público por robo de equipo médico." },
      { fecha_actuacion: "2024-05-20", tipo_actuacion: "Investigación", descripcion: "El MP recabó videos de vigilancia y declaraciones de testigos." },
      { fecha_actuacion: "2024-08-20", tipo_actuacion: "Vinculación a proceso", descripcion: "Juez de Control dictó auto de vinculación a proceso contra el imputado." },
      { fecha_actuacion: "2025-03-01", tipo_actuacion: "Audiencia", descripcion: "Se programó audiencia de juicio oral para el 15/04/2025." }
    ]
  },
  {
    id: 2, numero: 2, delegacion_id: 5,
    numero_expediente: "PEN-CHS-002/2024",
    fecha_inicio: "2024-05-10",
    delito_id: 3,
    denunciante: { tipo_persona: "MORAL", empresa: "IMSS Delegación Chiapas" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "Laura", apellido_paterno: "Mendoza", apellido_materno: "Ruiz" },
    fecha_conocimiento_amp: "2024-05-11",
    estado_procesal_id: 2,
    acciones_pendientes: "Solicitar informe pericial contable al MP",
    fecha_judicializacion: null, determinacion_judicial: null,
    sentencia: null, fecha_sentencia: null, fecha_conclusion: null,
    dato_relevante: "Fraude en licitación de servicios de limpieza",
    estatus: "TRAMITE",
    abogado_responsable: "Lic. Patricia Vega Noriega",
    fecha_creacion: "2024-05-10T11:00:00",
    fecha_actualizacion: "2025-02-15T14:00:00",
    seguimiento: { fecha_actuacion: "2025-02-15", tipo_actuacion: "Promoción", descripcion: "Se promovió ante el MP la ampliación de la investigación a otros proveedores." },
    seguimientos: [
      { fecha_actuacion: "2024-05-11", tipo_actuacion: "Querella", descripcion: "Se presentó querella por fraude en proceso de licitación." },
      { fecha_actuacion: "2024-08-15", tipo_actuacion: "Investigación", descripcion: "Se solicitó peritaje contable sobre las facturas presentadas." },
      { fecha_actuacion: "2025-02-15", tipo_actuacion: "Promoción", descripcion: "Se promovió ante el MP la ampliación de la investigación a otros proveedores." }
    ]
  },
  {
    id: 3, numero: 3, delegacion_id: 2,
    numero_expediente: "PEN-BC-001/2024",
    fecha_inicio: "2024-06-01",
    delito_id: 5,
    denunciante: { tipo_persona: "MORAL", empresa: "IMSS Delegación Baja California" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "Ricardo", apellido_paterno: "Salinas", apellido_materno: "Pliego" },
    fecha_conocimiento_amp: "2024-06-02",
    estado_procesal_id: 5,
    acciones_pendientes: null,
    fecha_judicializacion: "2024-09-15",
    determinacion_judicial: "Sentencia condenatoria",
    sentencia: "FAVORABLE", fecha_sentencia: "2025-01-20", fecha_conclusion: "2025-01-20",
    dato_relevante: "Daño a equipo de rayos X por negligencia",
    estatus: "CONCLUIDO",
    abogado_responsable: "Lic. Adriana Soto Mendoza",
    fecha_creacion: "2024-06-01T10:00:00",
    fecha_actualizacion: "2025-01-20T16:00:00",
    seguimiento: { fecha_actuacion: "2025-01-20", tipo_actuacion: "Sentencia", descripcion: "Sentencia condenatoria. Se ordenó reparación del daño." },
    seguimientos: [
      { fecha_actuacion: "2024-06-02", tipo_actuacion: "Denuncia", descripcion: "Denuncia por daño a equipo de rayos X valorado en $2,500,000." },
      { fecha_actuacion: "2024-09-15", tipo_actuacion: "Vinculación a proceso", descripcion: "Vinculación a proceso del imputado." },
      { fecha_actuacion: "2025-01-20", tipo_actuacion: "Sentencia", descripcion: "Sentencia condenatoria. Se ordenó reparación del daño." }
    ]
  },
  {
    id: 4, numero: 4, delegacion_id: 1,
    numero_expediente: "PEN-AGS-001/2024",
    fecha_inicio: "2024-07-20",
    delito_id: 10,
    denunciante: { tipo_persona: "MORAL", empresa: "IMSS Delegación Aguascalientes" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "José", apellido_paterno: "García", apellido_materno: "López" },
    fecha_conocimiento_amp: "2024-07-21",
    estado_procesal_id: 1,
    acciones_pendientes: "El MP solicitó ampliación de declaración del denunciante",
    fecha_judicializacion: null, determinacion_judicial: null,
    sentencia: null, fecha_sentencia: null, fecha_conclusion: null,
    dato_relevante: "Presentación de recetas médicas falsas para obtener medicamentos controlados",
    estatus: "TRAMITE",
    abogado_responsable: "Lic. Ana Martínez Solís",
    fecha_creacion: "2024-07-20T09:30:00",
    fecha_actualizacion: "2025-02-28T11:00:00",
    seguimiento: { fecha_actuacion: "2025-02-28", tipo_actuacion: "Investigación", descripcion: "El MP solicitó ampliación de declaración del denunciante." },
    seguimientos: [
      { fecha_actuacion: "2024-07-21", tipo_actuacion: "Denuncia", descripcion: "Se presentó denuncia por falsificación de recetas médicas." },
      { fecha_actuacion: "2025-02-28", tipo_actuacion: "Investigación", descripcion: "El MP solicitó ampliación de declaración del denunciante." }
    ]
  },
  {
    id: 5, numero: 5, delegacion_id: 9,
    numero_expediente: "PEN-DFN-001/2024",
    fecha_inicio: "2024-08-05",
    delito_id: 16,
    denunciante: { tipo_persona: "MORAL", empresa: "IMSS Delegación Norte DF" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "Servidor", apellido_paterno: "Público", apellido_materno: "Federal" },
    fecha_conocimiento_amp: "2024-08-06",
    estado_procesal_id: 3,
    acciones_pendientes: "Audiencia de etapa intermedia programada para 20/04/2025",
    fecha_judicializacion: "2024-11-10",
    determinacion_judicial: "Vinculado a proceso",
    sentencia: null, fecha_sentencia: null, fecha_conclusion: null,
    dato_relevante: "Peculado de recursos destinados a mantenimiento de equipos médicos",
    estatus: "TRAMITE",
    abogado_responsable: "Lic. Ricardo Monreal Ávila",
    fecha_creacion: "2024-08-05T14:00:00",
    fecha_actualizacion: "2025-03-10T09:00:00",
    seguimiento: { fecha_actuacion: "2025-03-10", tipo_actuacion: "Audiencia", descripcion: "Se programó audiencia de etapa intermedia para 20/04/2025." },
    seguimientos: [
      { fecha_actuacion: "2024-08-06", tipo_actuacion: "Denuncia", descripcion: "Denuncia por peculado de recursos de mantenimiento." },
      { fecha_actuacion: "2024-11-10", tipo_actuacion: "Vinculación a proceso", descripcion: "Auto de vinculación a proceso." },
      { fecha_actuacion: "2025-03-10", tipo_actuacion: "Audiencia", descripcion: "Se programó audiencia de etapa intermedia para 20/04/2025." }
    ]
  },
  {
    id: 6, numero: 6, delegacion_id: 7,
    numero_expediente: "PEN-COA-001/2024",
    fecha_inicio: "2024-09-12",
    delito_id: 12,
    denunciante: { tipo_persona: "MORAL", empresa: "IMSS Delegación Coahuila" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "Grupo", apellido_paterno: "Invasor", apellido_materno: "Desconocido" },
    fecha_conocimiento_amp: "2024-09-13",
    estado_procesal_id: 1,
    acciones_pendientes: "Solicitar medidas cautelares para proteger el inmueble",
    fecha_judicializacion: null, determinacion_judicial: null,
    sentencia: null, fecha_sentencia: null, fecha_conclusion: null,
    dato_relevante: "Despojo de terreno aledaño a la UMF No. 5 en Torreón",
    estatus: "TRAMITE",
    abogado_responsable: "Lic. Fernando Ruiz Díaz",
    fecha_creacion: "2024-09-12T10:00:00",
    fecha_actualizacion: "2025-01-15T13:00:00",
    seguimiento: { fecha_actuacion: "2025-01-15", tipo_actuacion: "Promoción", descripcion: "Se solicitaron medidas cautelares para protección del inmueble." },
    seguimientos: [
      { fecha_actuacion: "2024-09-13", tipo_actuacion: "Denuncia", descripcion: "Denuncia por despojo de terreno institucional." },
      { fecha_actuacion: "2025-01-15", tipo_actuacion: "Promoción", descripcion: "Se solicitaron medidas cautelares para protección del inmueble." }
    ]
  },
  {
    id: 7, numero: 7, delegacion_id: 14,
    numero_expediente: "PEN-GTO-001/2024",
    fecha_inicio: "2024-10-01",
    delito_id: 7,
    denunciante: { tipo_persona: "FISICA", nombres: "Familia", apellido_paterno: "del", apellido_materno: "Paciente" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "Dr. Médico", apellido_paterno: "Residente", apellido_materno: "HGZ" },
    fecha_conocimiento_amp: "2024-10-02",
    estado_procesal_id: 5,
    acciones_pendientes: null,
    fecha_judicializacion: "2024-12-01",
    determinacion_judicial: "Sentencia absolutoria",
    sentencia: "FAVORABLE", fecha_sentencia: "2025-02-10", fecha_conclusion: "2025-02-10",
    dato_relevante: "Denuncia por homicidio culposo durante intervención quirúrgica - se determinó que no hubo negligencia",
    estatus: "CONCLUIDO",
    abogado_responsable: "Lic. Miguel Ángel Torres",
    fecha_creacion: "2024-10-01T08:00:00",
    fecha_actualizacion: "2025-02-10T17:00:00",
    seguimiento: { fecha_actuacion: "2025-02-10", tipo_actuacion: "Sentencia", descripcion: "Sentencia absolutoria. Se determinó que no hubo negligencia médica." },
    seguimientos: [
      { fecha_actuacion: "2024-10-02", tipo_actuacion: "Querella", descripcion: "Querella por homicidio culposo durante cirugía." },
      { fecha_actuacion: "2024-12-01", tipo_actuacion: "Vinculación a proceso", descripcion: "Vinculación a proceso del médico residente." },
      { fecha_actuacion: "2025-02-10", tipo_actuacion: "Sentencia", descripcion: "Sentencia absolutoria. Se determinó que no hubo negligencia médica." }
    ]
  },
  {
    id: 8, numero: 8, delegacion_id: 5,
    numero_expediente: "PEN-CHS-003/2025",
    fecha_inicio: "2025-01-15",
    delito_id: 4,
    denunciante: { tipo_persona: "MORAL", empresa: "IMSS Delegación Chiapas" },
    probable_responsable: { tipo_persona: "FISICA", nombres: "Empleado", apellido_paterno: "Administrativo", apellido_materno: "X" },
    fecha_conocimiento_amp: "2025-01-16",
    estado_procesal_id: 1,
    acciones_pendientes: "Integrar carpeta de investigación con auditoría interna",
    fecha_judicializacion: null, determinacion_judicial: null,
    sentencia: null, fecha_sentencia: null, fecha_conclusion: null,
    dato_relevante: "Abuso de confianza por desvío de insumos del almacén general",
    estatus: "TRAMITE",
    abogado_responsable: "Lic. Fernando Ruiz Díaz",
    fecha_creacion: "2025-01-15T09:00:00",
    fecha_actualizacion: "2025-03-20T10:00:00",
    seguimiento: { fecha_actuacion: "2025-03-20", tipo_actuacion: "Investigación", descripcion: "Se inició auditoría interna para cuantificar el daño patrimonial." },
    seguimientos: [
      { fecha_actuacion: "2025-01-16", tipo_actuacion: "Denuncia", descripcion: "Denuncia por abuso de confianza y desvío de insumos." },
      { fecha_actuacion: "2025-03-20", tipo_actuacion: "Investigación", descripcion: "Se inició auditoría interna para cuantificar el daño patrimonial." }
    ]
  }
];

// Inicializar casos penales en localStorage
function inicializarCasosPenal() {
  if (!localStorage.getItem('casosPenal')) {
    localStorage.setItem('casosPenal', JSON.stringify(casosPenalFake));
  }
}
inicializarCasosPenal();

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

// Formatear fecha en dd/mm/yy (evita desfase de zona horaria)
function formatearFecha(fecha) {
  if (!fecha) return '---';
  // Si la fecha es solo "YYYY-MM-DD", parsear manualmente para evitar que
  // JavaScript la interprete como UTC y muestre el día anterior en zonas horarias negativas
  const soloFecha = typeof fecha === 'string' ? fecha.split('T')[0] : null;
  let d;
  if (soloFecha && /^\d{4}-\d{2}-\d{2}$/.test(soloFecha)) {
    const [año, mes, dia] = soloFecha.split('-').map(Number);
    d = new Date(año, mes - 1, dia);
  } else {
    d = new Date(fecha);
  }
  if (isNaN(d.getTime())) return fecha;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}