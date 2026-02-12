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
  // CASO 1: PADRE (Tiene acumulados al 2 y 3)
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
    juicios_acumulados: [2, 3], // TIENE HIJOS
    tribunal_id: 1,
    fecha_inicio: "2024-01-15",
    imss_es: "DEMANDADO",
    actor: {
      tipo_persona: "FISICA",
      nombres: "Juan Carlos",
      apellido_paterno: "Pérez",
      apellido_materno: "García"
    },
    demandados: [], 
    codemandados: [
      { tipo_persona: "MORAL", empresa: "Constructora ABC S.A. de C.V." }
    ],
    prestacion_reclamada: 1,
    prestaciones_notas: "Daños por negligencia en obra colindante a UMF",
    importe_demandado: 500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-01-15T10:30:00",
    seguimiento: []
  },

  // CASO 2: HIJO (Acumulado al 1)
  {
    id: 2,
    numero: 2,
    delegacion_id: 5, 
    area_generadora_id: 14,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Daños y Perjuicios",
    numero_juicio: "234567",
    año: "2024",
    numero_expediente: "234567/2024",
    acumulado_a: 1, // ES HIJO
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
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Demanda conexa por afectaciones estructurales",
    importe_demandado: 250000.00,
    estatus: "CONCLUIDO", // Los hijos suelen cerrarse al acumularse
    fecha_creacion: "2024-02-20T14:15:00",
    seguimiento: []
  },

  // CASO 3: HIJO (Acumulado al 1)
  {
    id: 3,
    numero: 3,
    delegacion_id: 5, 
    area_generadora_id: 15,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: null,
    numero_juicio: "345678",
    año: "2024",
    numero_expediente: "345678/2024",
    acumulado_a: 1, // ES HIJO
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-03-10",
    imss_es: "TERCERO",
    actor: { tipo_persona: "MORAL", empresa: "Aseguradora del Sur S.A." },
    demandados: [
       { tipo_persona: "FISICA", nombres: "Pedro", apellido_paterno: "Ramírez", apellido_materno: "Torres" }
    ],
    codemandados: [],
    prestacion_reclamada: 4,
    prestaciones_notas: "Reclamo de póliza de responsabilidad civil",
    importe_demandado: 100000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-03-10T09:00:00",
    seguimiento: []
  },

  // CASO 4: PADRE (Tiene acumulado al 5)
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
    juicios_acumulados: [5], // TIENE UN HIJO
    tribunal_id: 2,
    fecha_inicio: "2024-04-05",
    imss_es: "ACTOR",
    actor: {}, 
    demandados: [
      { tipo_persona: "MORAL", empresa: "Tecnología Médica Jalisco S.A." }
    ],
    codemandados: [
      { tipo_persona: "FISICA", nombres: "Roberto", apellido_paterno: "Hernández", apellido_materno: "Flores" }
    ],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cobro de pagaré por insumos médicos no pagados",
    importe_demandado: 1200000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-04-05T11:20:00",
    seguimiento: []
  },

  // CASO 5: HIJO (Acumulado al 4)
  {
    id: 5,
    numero: 5,
    delegacion_id: 2, 
    area_generadora_id: 5,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario Mercantil",
    sub_subtipo_juicio: null,
    numero_juicio_local: "MERC-2024-ORD-099",
    numero_expediente: "MERC-2024-ORD-099",
    acumulado_a: 4, // ES HIJO
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-04-10",
    imss_es: "ACTOR",
    actor: {},
    demandados: [
      { tipo_persona: "MORAL", empresa: "Tecnología Médica Jalisco S.A." }
    ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Incumplimiento de contrato marco de suministro",
    importe_demandado: 800000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-04-10T10:00:00",
    seguimiento: []
  },

  // CASO 6
  {
    id: 6,
    numero: 6,
    delegacion_id: 1, // AGUASCALIENTES
    area_generadora_id: 1,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Daño Moral",
    numero_juicio: "998877",
    año: "2024",
    numero_expediente: "998877/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-05-12",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Laura", apellido_paterno: "Méndez", apellido_materno: "Ruiz" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 5,
    prestaciones_notas: "Demanda por supuesta difamación institucional",
    importe_demandado: 300000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-05-12T09:30:00",
    seguimiento: []
  },

  // CASO 7
  {
    id: 7,
    numero: 7,
    delegacion_id: 9, // DF NORTE
    area_generadora_id: 25,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Arrendamiento",
    sub_subtipo_juicio: null,
    numero_juicio_local: "CIV-ARR-2024-001",
    numero_expediente: "CIV-ARR-2024-001",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-06-01",
    imss_es: "ACTOR",
    actor: {},
    demandados: [ { tipo_persona: "FISICA", nombres: "Oscar", apellido_paterno: "López", apellido_materno: "V." } ],
    codemandados: [],
    prestacion_reclamada: 9,
    prestaciones_notas: "Rescisión de contrato de arrendamiento de oficinas administrativas",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-06-01T11:00:00",
    seguimiento: []
  },

  // CASO 8
  {
    id: 8,
    numero: 8,
    delegacion_id: 15, // GUERRERO
    area_generadora_id: 50,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Concursos Mercantiles",
    sub_subtipo_juicio: null,
    numero_juicio: "112233",
    año: "2024",
    numero_expediente: "112233/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-06-15",
    imss_es: "TERCERO",
    actor: { tipo_persona: "MORAL", empresa: "Proveedora del Pacífico S.A." },
    demandados: [ { tipo_persona: "MORAL", empresa: "Hospitales Privados de Acapulco" } ],
    codemandados: [],
    prestacion_reclamada: 10,
    prestaciones_notas: "Reconocimiento de créditos fiscales en concurso mercantil",
    importe_demandado: 4500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-06-15T12:00:00",
    seguimiento: []
  },

  // CASO 9
  {
    id: 9,
    numero: 9,
    delegacion_id: 3, // BAJA CALIFORNIA SUR
    area_generadora_id: 7,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Usucapión",
    sub_subtipo_juicio: null,
    numero_juicio_local: "CIV-USU-2024-088",
    numero_expediente: "CIV-USU-2024-088",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-07-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Ejido Los Cabos", apellido_paterno: "", apellido_materno: "" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 4,
    prestaciones_notas: "Prescripción positiva de terreno colindante a HGZ 1",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-07-01T09:00:00",
    seguimiento: []
  },

  // CASO 10
  {
    id: 10,
    numero: 10,
    delegacion_id: 12, // EDOMEX ORIENTE
    area_generadora_id: 40,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Otros",
    numero_juicio: "667788",
    año: "2024",
    numero_expediente: "667788/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-07-20",
    imss_es: "ACTOR",
    actor: {},
    demandados: [ { tipo_persona: "MORAL", empresa: "Seguridad Privada Elite" } ],
    codemandados: [],
    prestacion_reclamada: 2,
    prestaciones_notas: "Recuperación de pagos en exceso por servicios de vigilancia",
    importe_demandado: 150000.00,
    estatus: "CONCLUIDO",
    fecha_creacion: "2024-07-20T10:00:00",
    seguimiento: []
  },

  // CASO 11
  {
    id: 11,
    numero: 11,
    delegacion_id: 10, // DF SUR
    area_generadora_id: 31,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Especial de Fianza",
    sub_subtipo_juicio: null,
    numero_juicio: "445566",
    año: "2024",
    numero_expediente: "445566/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 4,
    fecha_inicio: "2024-08-05",
    imss_es: "ACTOR",
    actor: {},
    demandados: [ { tipo_persona: "MORAL", empresa: "Afianzadora Aserta S.A." } ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Reclamación de fianza por vicios ocultos en obra hospitalaria",
    importe_demandado: 2000000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-08-05T13:00:00",
    seguimiento: []
  },

  // CASO 12
  {
    id: 12,
    numero: 12,
    delegacion_id: 8, // COLIMA
    area_generadora_id: 22,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Hipotecario",
    sub_subtipo_juicio: null,
    numero_juicio_local: "HIP-2024-77",
    numero_expediente: "HIP-2024-77",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-08-15",
    imss_es: "TERCERO",
    actor: { tipo_persona: "FISICA", nombres: "Banco Santander", apellido_paterno: "", apellido_materno: "" },
    demandados: [ { tipo_persona: "FISICA", nombres: "Empleado", apellido_paterno: "Desconocido", apellido_materno: "" } ],
    codemandados: [],
    prestacion_reclamada: 10,
    prestaciones_notas: "Informe sobre descuentos vía nómina",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-08-15T09:00:00",
    seguimiento: []
  },

  // CASO 13
  {
    id: 13,
    numero: 13,
    delegacion_id: 6, // CHIHUAHUA
    area_generadora_id: 16,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Agrario",
    sub_subtipo_juicio: null,
    numero_juicio: "101010",
    año: "2024",
    numero_expediente: "101010/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-09-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Comisariado Ejidal", apellido_paterno: "Villa Ahumada", apellido_materno: "" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 4,
    prestaciones_notas: "Restitución de tierras ejidales ocupadas por UMF",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-09-01T10:00:00",
    seguimiento: []
  },

  // CASO 14
  {
    id: 14,
    numero: 14,
    delegacion_id: 14, // GUANAJUATO
    area_generadora_id: 48,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Escrito",
    numero_juicio_local: "CIV-2024-999",
    numero_expediente: "CIV-2024-999",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-09-10",
    imss_es: "ACTOR",
    actor: {},
    demandados: [ { tipo_persona: "MORAL", empresa: "Limpieza Industrial del Bajío" } ],
    codemandados: [],
    prestacion_reclamada: 3,
    prestaciones_notas: "Cumplimiento forzoso de contrato de limpieza",
    importe_demandado: 50000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-09-10T14:00:00",
    seguimiento: []
  },

  // CASO 15
  {
    id: 15,
    numero: 15,
    delegacion_id: 4, // CAMPECHE
    area_generadora_id: 10,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Oral",
    numero_juicio: "202020",
    año: "2024",
    numero_expediente: "202020/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 1,
    fecha_inicio: "2024-10-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "MORAL", empresa: "Insumos Hospitalarios del Sureste" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 2,
    prestaciones_notas: "Pago de facturas retenidas por auditoría",
    importe_demandado: 670000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-10-01T11:00:00",
    seguimiento: []
  },

  // CASO 16
  {
    id: 16,
    numero: 16,
    delegacion_id: 7, // COAHUILA
    area_generadora_id: 19,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Responsabilidad Civil",
    numero_juicio_local: "CIV-RESP-002",
    numero_expediente: "CIV-RESP-002",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-10-15",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Familia", apellido_paterno: "Reyes", apellido_materno: "" },
    demandados: [],
    codemandados: [ { tipo_persona: "FISICA", nombres: "Dr. Jorge", apellido_paterno: "Salas", apellido_materno: "" } ],
    prestacion_reclamada: 1,
    prestaciones_notas: "Responsabilidad civil objetiva por caída en instalaciones",
    importe_demandado: 120000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-10-15T09:00:00",
    seguimiento: []
  },

  // CASO 17
  {
    id: 17,
    numero: 17,
    delegacion_id: 13, // EDOMEX PONIENTE
    area_generadora_id: 43,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Otros",
    numero_juicio: "303030",
    año: "2024",
    numero_expediente: "303030/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-11-01",
    imss_es: "ACTOR",
    actor: {},
    demandados: [ { tipo_persona: "MORAL", empresa: "Comedor Industrial Toluca" } ],
    codemandados: [],
    prestacion_reclamada: 9,
    prestaciones_notas: "Rescisión administrativa de contrato de comedores",
    importe_demandado: 0,
    estatus: "TRAMITE",
    fecha_creacion: "2024-11-01T12:00:00",
    seguimiento: []
  },

  // CASO 18
  {
    id: 18,
    numero: 18,
    delegacion_id: 11, // DURANGO
    area_generadora_id: 37,
    jurisdiccion: "LOCAL",
    tipo_juicio: "MERCANTIL",
    subtipo_juicio: "Ejecutivo Mercantil",
    sub_subtipo_juicio: "Otros",
    numero_juicio_local: "MERC-DGO-55",
    numero_expediente: "MERC-DGO-55",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 2,
    fecha_inicio: "2024-11-10",
    imss_es: "TERCERO",
    actor: { tipo_persona: "MORAL", empresa: "Financiera Independencia" },
    demandados: [ { tipo_persona: "FISICA", nombres: "Trabajador", apellido_paterno: "IMSS", apellido_materno: "" } ],
    codemandados: [],
    prestacion_reclamada: 10,
    prestaciones_notas: "Retención de salario por deuda mercantil",
    importe_demandado: 45000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-11-10T11:30:00",
    seguimiento: []
  },

  // CASO 19
  {
    id: 19,
    numero: 19,
    delegacion_id: 1, // AGUASCALIENTES
    area_generadora_id: 2,
    jurisdiccion: "FEDERAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Daño Moral",
    numero_juicio: "404040",
    año: "2024",
    numero_expediente: "404040/2024",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 5,
    fecha_inicio: "2024-12-01",
    imss_es: "DEMANDADO",
    actor: { tipo_persona: "FISICA", nombres: "Paciente", apellido_paterno: "Molesto", apellido_materno: "" },
    demandados: [],
    codemandados: [],
    prestacion_reclamada: 5,
    prestaciones_notas: "Daño moral por negativa de servicio en urgencias",
    importe_demandado: 200000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-12-01T10:00:00",
    seguimiento: []
  },

  // CASO 20
  {
    id: 20,
    numero: 20,
    delegacion_id: 9, // DF NORTE
    area_generadora_id: 27,
    jurisdiccion: "LOCAL",
    tipo_juicio: "CIVIL",
    subtipo_juicio: "Ordinario",
    sub_subtipo_juicio: "Responsabilidad Civil",
    numero_juicio_local: "CIV-2024-FIN",
    numero_expediente: "CIV-2024-FIN",
    acumulado_a: null,
    juicios_acumulados: [],
    tribunal_id: 3,
    fecha_inicio: "2024-12-15",
    imss_es: "ACTOR",
    actor: {},
    demandados: [ { tipo_persona: "MORAL", empresa: "Mantenimiento Hospitalario S.A." } ],
    codemandados: [],
    prestacion_reclamada: 1,
    prestaciones_notas: "Daños a equipos de tomografía por mal mantenimiento",
    importe_demandado: 3500000.00,
    estatus: "TRAMITE",
    fecha_creacion: "2024-12-15T09:00:00",
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