// ZAHORY SAC mock data
export const ZAHORY_SAC_DATA = {
  fx: 3.745,
  projects: ["Todos", "Pepas de Oro", "Buenaventura", "Antapaccay", "Uchucchacua"],

  // Módulo 1 — Clientes
  clientes: [
    { id: 'C001', razonSocial: 'Buenaventura S.A.A.',      ruc: '20100122398', contacto: 'Ing. Ramírez Torres',  email: 'contratos@buenaventura.com.pe', telefono: '(01) 419-2500', estado: 'Activo' },
    { id: 'C002', razonSocial: 'Minsur S.A.',              ruc: '20100113514', contacto: 'Ing. Quispe Mamani',   email: 'mant@minsur.com.pe',           telefono: '(01) 215-3000', estado: 'Activo' },
    { id: 'C003', razonSocial: 'Antapaccay - Glencore',   ruc: '20521141789', contacto: 'Luis Anderson R.',     email: 'l.anderson@antapaccay.com',    telefono: '+51 984 112 334', estado: 'Activo' },
    { id: 'C004', razonSocial: 'Volcan Cía. Minera S.A.A.',ruc: '20100077660', contacto: 'Arq. Condori V.',      email: 'contratos@volcan.com.pe',      telefono: '(01) 219-7000', estado: 'Activo' },
    { id: 'C005', razonSocial: 'Gold Fields La Cima',     ruc: '20504741551', contacto: 'Ing. Flores Huanca',   email: 'mant@goldfields.com.pe',       telefono: '+51 976 443 210', estado: 'Inactivo' },
  ],

  // Módulo 1 — Contratos / OS
  contratos: [
    {
      id: 'CT001', numero: 'CT-2025-BUE-001', clienteId: 'C001', cliente: 'Buenaventura S.A.A.',
      tipo: 'Contrato', descripcion: 'Servicio de mantenimiento JB-24 y SC-701 — Unidad Uchucchacua',
      moneda: 'USD', fechaInicio: '2025-01-01', fechaFin: '2025-12-31',
      estado: 'Activo', condicionFact: 'Por período mensual',
      equiposScope: ['JB-24', 'SC-701'], dmp: 97.92,
      obs: 'Renovación automática si ninguna parte notifica con 60 días de anticipación.'
    },
    {
      id: 'CT002', numero: 'OS-2026-APC-011', clienteId: 'C003', cliente: 'Antapaccay - Glencore',
      tipo: 'OS', descripcion: 'Orden de servicio mantenimiento JB-26 — Espinar',
      moneda: 'USD', fechaInicio: '2026-01-15', fechaFin: '2026-07-15',
      estado: 'Activo', condicionFact: 'Por OT aprobada',
      equiposScope: ['JB-26'], dmp: 98.00,
      obs: 'Incluye penalidad de 5% sobre factura si DMR < DMP por más de 3 guardias consecutivas.'
    },
    {
      id: 'CT003', numero: 'CT-2026-PEP-003', clienteId: 'C002', cliente: 'Minsur S.A.',
      tipo: 'Contrato', descripcion: 'Mantenimiento JB-DD311 — Pepas de Oro',
      moneda: 'USD', fechaInicio: '2026-02-01', fechaFin: '2026-12-31',
      estado: 'Activo', condicionFact: 'Por período mensual',
      equiposScope: ['JB-DD311'], dmp: 97.92,
      obs: ''
    },
    {
      id: 'CT004', numero: 'OS-2025-VOL-008', clienteId: 'C004', cliente: 'Volcan Cía. Minera S.A.A.',
      tipo: 'OS', descripcion: 'Reparación mayor scoop — Cerro de Pasco',
      moneda: 'USD', fechaInicio: '2025-11-01', fechaFin: '2026-03-31',
      estado: 'Cerrado', condicionFact: 'Por hito',
      equiposScope: ['EQ-TALLER-01'], dmp: 97.92,
      obs: 'Cerrado con conformidad del cliente 31/03/2026.'
    },
  ],

  // Panel E — Estado actual de activos
  activosEstado: [
    { cod: 'JB-DD311', marca: 'SANDVIK DD311-40', tipo: 'Jumbo', proyecto: 'Pepas de Oro',  propietario: 'ZAHORY SAC', ubicacion: 'Mina',            estadoOp: 'Operativo',     ultimaOT: 'OT-2026-047', proximoMantto: 'PM en 85 hrs',    dmr: 97.44, dmp: 97.92 },
    { cod: 'JB-24',    marca: 'EPIROC SIMBA S7D', tipo: 'Simba', proyecto: 'Buenaventura',  propietario: 'ZAHORY SAC', ubicacion: 'Mina',            estadoOp: 'Operativo',     ultimaOT: 'OT-2026-050', proximoMantto: 'PM en 120 hrs',   dmr: 98.10, dmp: 97.92 },
    { cod: 'JB-26',    marca: 'EPIROC SIMBA S7D', tipo: 'Simba', proyecto: 'Antapaccay',    propietario: 'ZAHORY SAC', ubicacion: 'Mina',            estadoOp: 'Operativo',     ultimaOT: 'OT-2026-048', proximoMantto: 'PM en 210 hrs',   dmr: 97.95, dmp: 98.00 },
    { cod: 'SC-701',   marca: 'SANDVIK',          tipo: 'Scoop', proyecto: 'Buenaventura',  propietario: 'Cliente',  ubicacion: 'Mina',            estadoOp: 'En mantenimiento', ultimaOT: 'OT-2026-049', proximoMantto: '—',               dmr: 96.50, dmp: 97.92 },
    { cod: 'EQ-TALL-01', marca: 'CATERPILLAR R1600', tipo: 'Scoop', proyecto: 'Uchucchacua', propietario: 'Cliente', ubicacion: 'Taller Carapongo', estadoOp: 'En taller',     ultimaOT: 'OT-2026-051', proximoMantto: '—',               dmr: null,  dmp: null },
    { cod: 'JB-NEW-01',  marca: 'EPIROC BOOMER S2', tipo: 'Jumbo', proyecto: '—',            propietario: 'ZAHORY SAC', ubicacion: 'Taller Carapongo', estadoOp: 'Acondicionamiento', ultimaOT: 'OT-2026-054', proximoMantto: 'Listo en ~15 días', dmr: null, dmp: null },
  ],
  equipos: [
    { cod: "JB-DD311", marca: "SANDVIK DD311-40", proyecto: "Pepas de Oro", ctx: "Mina" },
    { cod: "JB-24", marca: "EPIROC SIMBA S7D", proyecto: "Buenaventura", ctx: "Mina" },
    { cod: "JB-26", marca: "EPIROC SIMBA S7D", proyecto: "Buenaventura", ctx: "Mina" },
    { cod: "SC-701", marca: "SANDVIK", proyecto: "Buenaventura", ctx: "Mina" },
    { cod: "EQ-TALLER-01", marca: "CATERPILLAR R1600", proyecto: "Uchucchacua", ctx: "Taller Carapongo" },
  ],
  tecnicos: [
    { nombre: "Pajuelo Jurado, Edson", rol: "Mecatrónico", ctx: "Mina", proy: "Buenaventura", tarifa: 18.50 },
    { nombre: "Miranda Barra, Sandro", rol: "Mecánico", ctx: "Mina", proy: "Pepas de Oro", tarifa: 15.00 },
    { nombre: "García Quispe, Roberto", rol: "Mecánico", ctx: "Mina", proy: "Buenaventura", tarifa: 15.00 },
    { nombre: "Torres Mamani, Miguel", rol: "Electricista", ctx: "Mina", proy: "Antapaccay", tarifa: 16.00 },
    { nombre: "López Vargas, Carlos", rol: "Mecánico", ctx: "Taller Carapongo", proy: "—", tarifa: 14.00 },
  ],
  standardJobs: [
    { id: 'SJ-001', codigo: 'SJ-HYD-001', descripcion: 'Cambio kit de sellos cilindro hidraulico', sistemaId: 'HID', horasEstimadasMo: 6, operacionesDefault: ['Bloquear energia y despresurizar circuito', 'Desmontar cilindro', 'Cambiar sellos y armar', 'Prueba de presion y fugas'], repuestosDefault: [{ codigo: 'REP-9900-SEL', cantidad: 1 }, { codigo: 'INS-0088-AH5', cantidad: 2 }] },
    { id: 'SJ-002', codigo: 'SJ-ENG-002', descripcion: 'Diagnostico baja potencia motor diesel', sistemaId: 'MOT', horasEstimadasMo: 4, operacionesDefault: ['Descargar codigos ECM', 'Inspeccionar admision y filtros', 'Medir parametros de combustible', 'Emitir reporte de diagnostico'], repuestosDefault: [{ codigo: 'REP-2201-AIR', cantidad: 2 }, { codigo: 'INS-0055-MOT', cantidad: 1 }] },
    { id: 'SJ-003', codigo: 'SJ-PER-003', descripcion: 'Inspeccion y ajuste sistema de percusion', sistemaId: 'PER', horasEstimadasMo: 5, operacionesDefault: ['Inspeccionar culata y acumuladores', 'Medir presion de percusion', 'Ajustar parametros', 'Prueba operacional con registro ECM'], repuestosDefault: [{ codigo: 'REP-3310-PER', cantidad: 1 }] },
  ],
  otSegmentos: [
    { id: 'SEG-050-01', otId: 'OT-2026-050', numeroSegmento: '01', descripcion: 'Reparacion sistema hidraulico', tipoCargo: 'Cliente_Contrato', standardJobId: 'SJ-001' },
    { id: 'SEG-049-01', otId: 'OT-2026-049', numeroSegmento: '01', descripcion: 'Diagnostico motor diesel', tipoCargo: 'Cliente_Contrato', standardJobId: 'SJ-002' },
  ],
  otOperaciones: [
    { id: 'OP-050-01', segmentoId: 'SEG-050-01', numeroOperacion: '01', descripcion: 'Desmontar cilindro hidraulico' },
    { id: 'OP-050-02', segmentoId: 'SEG-050-01', numeroOperacion: '02', descripcion: 'Cambiar kit de sellos y probar' },
    { id: 'OP-049-01', segmentoId: 'SEG-049-01', numeroOperacion: '01', descripcion: 'Descargar codigos ECM' },
  ],
  confiabilidad: [
    { eq: 'SC-701', horasOperacion: 420, otsCorrectivas: 7, paradasCorrectivas: 41, horasHombreMtto: 96 },
    { eq: 'JB-DD311', horasOperacion: 510, otsCorrectivas: 5, paradasCorrectivas: 28, horasHombreMtto: 72 },
    { eq: 'JB-26', horasOperacion: 585, otsCorrectivas: 4, paradasCorrectivas: 18, horasHombreMtto: 61 },
    { eq: 'JB-24', horasOperacion: 610, otsCorrectivas: 3, paradasCorrectivas: 12, horasHombreMtto: 44 },
    { eq: 'EQ-TALL-01', horasOperacion: 190, otsCorrectivas: 3, paradasCorrectivas: 22, horasHombreMtto: 58 },
  ],
  dmrByEquipo: [
    { eq: "JB-DD311", proy: "Pepas de Oro", dmr: 97.44, dmp: 97.92, hrep: 2.33, estado: "riesgo" },
    { eq: "JB-24",    proy: "Buenaventura", dmr: 98.10, dmp: 97.92, hrep: 0.00, estado: "cumpliendo" },
    { eq: "SC-701",   proy: "Buenaventura", dmr: 96.50, dmp: 97.92, hrep: 4.50, estado: "incumpliendo" },
    { eq: "JB-26",    proy: "Antapaccay",   dmr: 97.95, dmp: 97.92, hrep: 0.50, estado: "cumpliendo" },
  ],
  otsDashboard: [
    { codigo: 'OT-2026-050', eq: 'JB-24',    tec: 'Pajuelo E.', fecha: '16/04', costo: 772,   margen: 92.4, estado: 'Aprobada',  tipoTrabajo: 'Correctivo',        tipoCargo: 'Cliente_Contrato', lineaNegocio: 'flota_alquileres' },
    { codigo: 'OT-2026-049', eq: 'SC-701',   tec: 'García R.',  fecha: '15/04', costo: 1764,  margen: 74.1, estado: 'Pendiente', tipoTrabajo: 'Preventivo_PM',     tipoCargo: 'Cliente_Contrato', lineaNegocio: 'flota_alquileres' },
    { codigo: 'OT-2026-048', eq: 'JB-26',    tec: 'Torres M.',  fecha: '14/04', costo: 565,   margen: 93.4, estado: 'Aprobada',  tipoTrabajo: 'Correctivo',        tipoCargo: 'Cliente_Contrato', lineaNegocio: 'flota_alquileres' },
    { codigo: 'OT-2026-047', eq: 'JB-DD311', tec: 'Miranda B.', fecha: '13/04', costo: 2100,  margen: 85.2, estado: 'Cerrada',   tipoTrabajo: 'Correctivo',        tipoCargo: 'Cliente_Contrato', lineaNegocio: 'flota_alquileres' },
    { codigo: 'OT-2026-046', eq: 'JB-NEW-01',tec: 'López V.',   fecha: '12/04', costo: 3200,  margen: null, estado: 'En taller', tipoTrabajo: 'Acondicionamiento', tipoCargo: 'Interno_Zahory',   lineaNegocio: 'interno_zahory'   },
    { codigo: 'OT-2026-045', eq: 'SC-701',   tec: 'García R.',  fecha: '10/04', costo: 980,   margen: null, estado: 'Aprobada',  tipoTrabajo: 'Correctivo',        tipoCargo: 'Reclamo_Rework',   lineaNegocio: 'flota_alquileres' },
    { codigo: 'OT-2026-044', eq: 'JB-24',    tec: 'Pajuelo E.', fecha: '08/04', costo: 450,   margen: 88.0, estado: 'Aprobada',  tipoTrabajo: 'Preventivo_PM',     tipoCargo: 'Cliente_Contrato', lineaNegocio: 'flota_alquileres' },
  ],  // Full OT cost breakdown — incluye costoEstimado para gráfico de desviación (v4.0)
  // facturable: true = activo del cliente; false = acondicionamiento activo propio
  otsCostos: [
    { codigo: 'OT-2026-050', eq: 'JB-24',    proy: 'Buenaventura', fecha: '16/04', tipoTrabajo: 'Correctivo',       tec: 'Pajuelo E.',  mo: 222,  mat: 490,  tra: 60,  ingreso: 10200, tipoCargo: 'Cliente_Contrato', fechaProgramadaInicio: '2026-04-15', fechaAprobacionComercial: '2026-04-15T09:00:00', fechaPrimerLaborReal: '2026-04-15T18:20:00', motivoRetrabajo: '', moEst: 200, matEst: 420, traEst: 50 },
    { codigo: 'OT-2026-048', eq: 'JB-26',    proy: 'Antapaccay',   fecha: '14/04', tipoTrabajo: 'Correctivo',       tec: 'Torres M.',   mo: 185,  mat: 320,  tra: 60,  ingreso: 8500,  tipoCargo: 'Cliente_Contrato', fechaProgramadaInicio: '2026-04-14', fechaAprobacionComercial: '2026-04-13T11:00:00', fechaPrimerLaborReal: '2026-04-14T08:00:00', motivoRetrabajo: '', moEst: 180, matEst: 300, traEst: 60 },
    { codigo: 'OT-2026-052', eq: 'JB-DD311', proy: 'Pepas de Oro', fecha: '12/04', tipoTrabajo: 'Preventivo_PM',    tec: 'Miranda B.',  mo: 350,  mat: 1600, tra: 150, ingreso: 9350,  tipoCargo: 'Cliente_Contrato', fechaProgramadaInicio: '2026-04-12', fechaAprobacionComercial: '2026-04-11T08:00:00', fechaPrimerLaborReal: '2026-04-12T08:30:00', motivoRetrabajo: '', moEst: 300, matEst: 1400,traEst: 120 },
    { codigo: 'OT-2026-049', eq: 'SC-701',   proy: 'Buenaventura', fecha: '15/04', tipoTrabajo: 'Preventivo_PM',    tec: 'García R.',   mo: 444,  mat: 1200, tra: 120, ingreso: 6800,  tipoCargo: 'Cliente_Contrato', fechaProgramadaInicio: '2026-04-15', fechaAprobacionComercial: '2026-04-14T10:00:00', fechaPrimerLaborReal: '2026-04-15T07:30:00', motivoRetrabajo: '', moEst: 400, matEst: 1100,traEst: 100 },
    { codigo: 'OT-2026-051', eq: 'JB-24',    proy: 'Buenaventura', fecha: '10/04', tipoTrabajo: 'Correctivo',       tec: 'Pajuelo E.',  mo: 280,  mat: 620,  tra: 80,  ingreso: 5100,  tipoCargo: 'Cliente_Contrato', fechaProgramadaInicio: '2026-04-10', fechaAprobacionComercial: '2026-04-09T09:30:00', fechaPrimerLaborReal: '2026-04-10T09:00:00', motivoRetrabajo: '', moEst: 250, matEst: 580, traEst: 80 },
    { codigo: 'OT-2026-047', eq: 'JB-DD311', proy: 'Pepas de Oro', fecha: '13/04', tipoTrabajo: 'Correctivo',       tec: 'Miranda B.',  mo: 310,  mat: 850,  tra: 90,  ingreso: 12750, tipoCargo: 'Cliente_Contrato', fechaProgramadaInicio: '2026-04-13', fechaAprobacionComercial: '2026-04-12T16:00:00', fechaPrimerLaborReal: '2026-04-13T10:00:00', motivoRetrabajo: '', moEst: 280, matEst: 900, traEst: 90 },
    { codigo: 'OT-2026-046', eq: 'SC-701',   proy: 'Buenaventura', fecha: '12/04', tipoTrabajo: 'Correctivo',       tec: 'García R.',   mo: 800,  mat: 2100, tra: 300, ingreso: 0,     tipoCargo: 'Reclamo_Rework', fechaProgramadaInicio: '2026-04-12', fechaAprobacionComercial: '2026-04-10T15:00:00', fechaPrimerLaborReal: '2026-04-12T09:30:00', motivoRetrabajo: 'Repeticion de falla por ajuste incompleto en taller', moEst: 600, matEst: 1800,traEst: 200 },
    { codigo: 'OT-2026-053', eq: 'JB-26',    proy: 'Antapaccay',   fecha: '08/04', tipoTrabajo: 'Correctivo',       tec: 'Torres M.',   mo: 900,  mat: 1900, tra: 180, ingreso: 0,     tipoCargo: 'Garantia_Fabrica', fechaProgramadaInicio: '2026-04-08', fechaAprobacionComercial: '2026-04-07T09:00:00', fechaPrimerLaborReal: '2026-04-08T12:00:00', motivoRetrabajo: '', moEst: 750, matEst: 1600,traEst: 150 },
    { codigo: 'OT-2026-054', eq: 'JB-NEW-01',proy: '—',            fecha: '20/04', tipoTrabajo: 'Acondicionamiento', tec: 'López V.',   mo: 1200, mat: 8500, tra: 400, ingreso: 0,     tipoCargo: 'Interno_Zahory', fechaProgramadaInicio: '2026-04-20', fechaAprobacionComercial: null, fechaPrimerLaborReal: null, motivoRetrabajo: '', moEst: 1000,matEst: 8000,traEst: 350 },
  ],  solicitudesUrgentes: [
    { tipo: "URGENTE", desc: "Kit de drives",   cant: 1, tec: "Miranda B.", proy: "Pepas de Oro", fecha: "16/04", estado: "Pendiente" },
    { tipo: "URGENTE", desc: "Lock tite",        cant: 1, tec: "Miranda B.", proy: "Pepas de Oro", fecha: "16/04", estado: "Pendiente" },
    { tipo: "URGENTE", desc: "Palanca L 3/4",   cant: 1, tec: "Miranda B.", proy: "Pepas de Oro", fecha: "16/04", estado: "Pendiente" },
    { tipo: "NORMAL",  desc: "Filtro hidráulico",cant: 2, tec: "Pajuelo E.", proy: "Buenaventura", fecha: "15/04", estado: "En proceso" },
    { tipo: "NORMAL",  desc: "Aceite 15W-40",    cant: "5 GAL", tec: "Torres M.", proy: "Antapaccay", fecha: "14/04", estado: "Atendido" },
  ],
  historialMina: [
    { fecha: "16/04", turno: "DÍA",   eq: "JB-DD311", proy: "Pepas de Oro", tec: "Miranda B.", ht: 2.9, dm: 97.9, costo: 480, estado: "Aprobado" },
    { fecha: "15/04", turno: "NOCHE", eq: "JB-24",    proy: "Buenaventura", tec: "Pajuelo E.", ht: 3.9, dm: 97.9, costo: 620, estado: "Aprobado" },
    { fecha: "15/04", turno: "DÍA",   eq: "SC-701",   proy: "Buenaventura", tec: "García R.",  ht: 0,   dm: 97.9, costo: 0,   estado: "Pendiente" },
    { fecha: "14/04", turno: "NOCHE", eq: "JB-26",    proy: "Antapaccay",   tec: "Torres M.",  ht: 3.1, dm: 98.5, costo: 390, estado: "Aprobado" },
    { fecha: "14/04", turno: "DÍA",   eq: "JB-DD311", proy: "Pepas de Oro", tec: "Miranda B.", ht: 2.0, dm: 97.9, costo: 290, estado: "Rechazado" },
  ],
  repuestos: [
    { cod: "REP-4412-HYD", np: "57789123", desc: "Filtro hidráulico EPIROC SIMBA", cat: "Hidráulico",  um: "Unidad", usd: 320, ctx: "Mina",   activo: true,  stock: 2,  min: 3  },
    { cod: "REP-2201-AIR", np: "44512890", desc: "Filtro de aire",                   cat: "Filtros",    um: "Unidad", usd: 85,  ctx: "Ambos",  activo: true,  stock: 8,  min: 5  },
    { cod: "INS-0088-AH5", np: "—",         desc: "Aceite hidráulico ISO 46 5L",     cat: "Lubricantes",um: "Litro",  usd: 58,  ctx: "Ambos",  activo: true,  stock: 15, min: 10 },
    { cod: "INS-0012-GR",  np: "—",         desc: "Grasa multiuso (tubo)",           cat: "Consumibles",um: "Unidad", usd: 12,  ctx: "Ambos",  activo: true,  stock: 4,  min: 8  },
    { cod: "REP-7701-ELC", np: "99012345",  desc: "Conector eléctrico 440V",         cat: "Eléctrico",  um: "Unidad", usd: 45,  ctx: "Taller", activo: true,  stock: 0,  min: 2  },
    { cod: "REP-9900-SEL", np: "HYD-SK-88", desc: "Kit de sellos hidráulicos",       cat: "Hidráulico",  um: "Kit",    usd: 180, ctx: "Ambos",  activo: true,  stock: 1,  min: 2  },
    { cod: "INS-0055-MOT", np: "—",          desc: "Aceite de motor 15W-40 (galón)",  cat: "Lubricantes",um: "Galón",  usd: 32,  ctx: "Ambos",  activo: true,  stock: 20, min: 10 },
    { cod: "REP-3310-PER", np: "SD-311-P1", desc: "Culata de percusión SANDVIK",     cat: "Percusión",  um: "Unidad", usd: 1450,ctx: "Mina",   activo: true,  stock: 0,  min: 1  },
  ],
  personalOperativo: [
    { cod: "TEC-001", nombre: "Pajuelo Jurado, Edson",   cargo: "Técnico Mecatrónico", esp: "Mecatrónico", proy: "Buenaventura", ctx: "Mina",    costoHora: 18.50, costoExtra: 27.75, sctr: "2026-12-31", licencia: "2026-09-15", emo: "2026-06-30", induccion: "2027-01-10", habilitado: true,  estado: "Activo" },
    { cod: "TEC-002", nombre: "Miranda Barra, Sandro",   cargo: "Técnico Mecánico",    esp: "Mecánico",    proy: "Pepas de Oro",  ctx: "Mina",    costoHora: 15.00, costoExtra: 22.50, sctr: "2026-08-20", licencia: "2025-11-30", emo: "2026-04-15", induccion: "2026-07-22", habilitado: false, estado: "Activo" },
    { cod: "TEC-003", nombre: "García Quispe, Roberto",  cargo: "Técnico Mecánico",    esp: "Mecánico",    proy: "Buenaventura", ctx: "Mina",    costoHora: 15.00, costoExtra: 22.50, sctr: "2026-11-01", licencia: "2026-11-01", emo: "2026-11-01", induccion: "2026-11-01", habilitado: true,  estado: "Activo" },
    { cod: "TEC-004", nombre: "Torres Mamani, Miguel",   cargo: "Técnico Electricista",esp: "Electricista", proy: "Antapaccay",   ctx: "Mina",    costoHora: 16.00, costoExtra: 24.00, sctr: "2026-10-15", licencia: "2026-10-15", emo: "2026-10-15", induccion: "2026-10-15", habilitado: true,  estado: "Activo" },
    { cod: "TEC-005", nombre: "López Vargas, Carlos",    cargo: "Técnico Mecánico",    esp: "Mecánico",    proy: "—",            ctx: "Carapongo",costoHora: 14.00, costoExtra: 21.00, sctr: "2026-05-01", licencia: "2027-03-20", emo: "2026-05-01", induccion: "2026-05-01", habilitado: false, estado: "Inactivo" },
  ],
  propuestas: [
    { n: "PROP-2026-001", cliente: "Buenaventura S.A.",   proy: "Renovación JB-24",     fecha: "10/04", usd: 180000, estado: "Aceptada" },
    { n: "PROP-2026-002", cliente: "Volcan Cía. Minera",  proy: "Nuevo SC",             fecha: "15/04", usd: 240000, estado: "Enviada" },
    { n: "PROP-2026-003", cliente: "Antapaccay",          proy: "Ampliación taller",    fecha: "18/04", usd: 95000,  estado: "Borrador" },
  ],
  remisiones: [
    { n: "REM-2026-047", ots: "OT-047, OT-048", periodo: "Abr 2026", cliente: "Buenaventura S.A.", usd: 14280, estado: "Conformada" },
  ],
  consolidadoJB_DD311: [
    { turno: "DÍA",   fecha: "26/03", mIni: 3588.30, mFin: 3588.30, pIni: 2099.70, pFin: 2099.70, eIni: 3908.10, eFin: 3908.10, ht: 0.00, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 11.75, total: 12.00, dm: 97.92, obs: "Equipo no ingresa a labor por falta de sostenimiento." },
    { turno: "NOCHE", fecha: "26/03", mIni: 3588.30, mFin: 3589.20, pIni: 2099.70, pFin: 2101.40, eIni: 3908.10, eFin: 3908.40, ht: 1.20, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 10.55, total: 12.00, dm: 97.92, obs: "—" },
    { turno: "DÍA",   fecha: "27/03", mIni: 3589.20, mFin: 3590.60, pIni: 2101.40, pFin: 2103.30, eIni: 3908.40, eFin: 3911.30, ht: 4.30, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 7.45, total: 12.00, dm: 97.92, obs: "—" },
    { turno: "NOCHE", fecha: "27/03", mIni: 3590.60, mFin: 3592.40, pIni: 2103.30, pFin: 2105.80, eIni: 3911.30, eFin: 3915.10, ht: 5.50, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 6.25, total: 12.00, dm: 97.92, obs: "—" },
    { turno: "DÍA",   fecha: "28/03", mIni: 3592.40, mFin: 3594.90, pIni: 2105.80, pFin: 2109.10, eIni: 3915.10, eFin: 3920.20, ht: 7.40, prg: 0.25, prv: 0.00, acc: 0, ctvo: 0, hsb: 4.35, total: 12.00, dm: 97.92, obs: "Operación normal." },
    { turno: "NOCHE", fecha: "28/03", mIni: 3594.90, mFin: 3596.50, pIni: 2109.10, pFin: 2111.50, eIni: 3920.20, eFin: 3924.00, ht: 5.20, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 6.55, total: 12.00, dm: 97.92, obs: "—" },
    { turno: "DÍA",   fecha: "29/03", mIni: 3596.50, mFin: 3598.00, pIni: 2111.50, pFin: 2113.80, eIni: 3924.00, eFin: 3927.10, ht: 4.90, prg: 0.00, prv: 0.25, acc: 0, ctvo: 2.33, hsb: 4.52, total: 12.00, dm: 97.44, obs: "Reparación sistema percusión." },
    { turno: "NOCHE", fecha: "29/03", mIni: 3598.00, mFin: 3599.80, pIni: 2113.80, pFin: 2116.20, eIni: 3927.10, eFin: 3930.90, ht: 6.20, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 5.55, total: 12.00, dm: 97.92, obs: "—" },
    { turno: "DÍA",   fecha: "30/03", mIni: 3599.80, mFin: 3601.90, pIni: 2116.20, pFin: 2118.80, eIni: 3930.90, eFin: 3935.40, ht: 8.70, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 3.05, total: 12.00, dm: 97.92, obs: "—" },
    { turno: "NOCHE", fecha: "30/03", mIni: 3601.90, mFin: 3603.40, pIni: 2118.80, pFin: 2121.00, eIni: 3935.40, eFin: 3939.00, ht: 5.00, prg: 0.00, prv: 0.25, acc: 0, ctvo: 0, hsb: 6.75, total: 12.00, dm: 97.92, obs: "—" },
  ],
  // daily cumulative for month line chart (days 1..30)
  monthDaily: (() => {
    const days = 30;
    let cumCost = 0, cumRev = 0;
    const arr = [];
    const seed = [
      [420, 1100],[680,2400],[0,0],[520,1800],[310,1900],[720,3200],[0,0],[2980,3200],[0,0],[980,5100],
      [0,0],[5300,13200],[1250,12750],[565,8500],[1764,6800],[772,10200],[0,0],[420,2100],[900,4200],[1100,5800],
      [0,0],[560,2400],[820,3100],[0,0],[1320,4800],[0,0],[450,1900],[690,3400],[880,4100],[0,0]
    ];
    for (let i = 0; i < days; i++) {
      cumCost += seed[i][0];
      cumRev += seed[i][1];
      arr.push({ d: i+1, cost: cumCost, rev: cumRev });
    }
    return arr;
  })(),
  contratos_rental: [
    {
      id: 'CTR-001', cliente_id: 'C002', cliente_nombre: 'Minsur S.A.',
      equipos: ['LHD-R1600G-001', 'LHD-R1300G-002'],
      tipo_tarifa: 'disponibilidad',
      tarifa_base: 18500,
      meta_dmp: 85, penalidad_pct: 0.5,
      moneda: 'USD',
      fecha_inicio: '2026-01-01', fecha_fin: '2026-12-31',
      estado: 'activo', unidad_minera: 'La Oroya',
    },
    {
      id: 'CTR-002', cliente_id: 'C004', cliente_nombre: 'Volcan Cía. Minera S.A.A.',
      equipos: ['LHD-R1600H-003'],
      tipo_tarifa: 'por_hora',
      tarifa_hora: 85, horas_minimas: 400,
      moneda: 'USD',
      fecha_inicio: '2026-02-01', fecha_fin: '2026-07-31',
      estado: 'activo', unidad_minera: 'Cerro de Pasco',
    },
  ],
  liquidaciones: [
    {
      id: 'LIQ-2026-04-001', contrato_id: 'CTR-001', equipo_id: 'LHD-R1600G-001',
      periodo: '2026-04', horas_facturables: 612, dmr_real: 82.4, meta_dmp: 85,
      penalidad: 2775, total_usd: 15725, estado: 'en_conciliacion',
      observaciones_conciliacion: [
        { concepto: 'Horas parada programada día 14', valor_zahory: 612, valor_cliente: 598, resuelto: false },
      ],
    },
  ],
  actas: [
    {
      id: 'ACTA-001', tipo: 'despacho',
      contrato_id: 'CTR-001', equipo_id: 'LHD-R1600G-001',
      fecha: '2026-01-03', horometro: 14250,
      estado_equipo: 'operativo', operador_recibe: 'Juan Quispe',
      observaciones: 'Sin observaciones',
    },
  ],
  backlog: [
    { bkl: 'BKL-2026-090', fecha: '20/04/2026', eq: 'SC-701',   sistema: 'Motor',        hallazgo: 'SOS Feedback critico: presencia de limalla y silicio elevado en aceite motor', prioridad: 'Emergencia', score: 17, dias: 0, estado: 'Listo para OT', cicloVida: 'Listo para OT', requiereRetorno: true, fuente: 'SOS Feedback (Analisis de fluidos)', nivelAlertaSos: 'Critico', reporteLaboratorio: 'sos-sc701-2026-04.pdf' },
    { bkl: 'BKL-2026-089', fecha: '20/04/2026', eq: 'JB-DD311', sistema: 'Hidráulico',   hallazgo: 'Fuga de aceite en manguera de percusión de brazo derecho',     prioridad: 'Emergencia',  score: 95, dias: 0, estado: 'Pendiente',        cicloVida: 'Nuevo',              requiereRetorno: true,  fuente: 'Reporte diario' },
    { bkl: 'BKL-2026-088', fecha: '19/04/2026', eq: 'SC-701',   sistema: 'Motor',        hallazgo: 'Pérdida de potencia al subir rampa, humo negro excesivo',       prioridad: 'Urgente',     score: 82, dias: 1, estado: 'Pend. Recursos',   cicloVida: 'Pendiente recursos', requiereRetorno: true,  fuente: 'Reporte diario' },
    { bkl: 'BKL-2026-085', fecha: '18/04/2026', eq: 'JB-24',    sistema: 'Eléctrico',    hallazgo: 'Faro pirata delantero izquierdo quemado',                       prioridad: 'Normal',      score: 45, dias: 2, estado: 'Pendiente',        cicloVida: 'En análisis',        requiereRetorno: false, fuente: 'Reporte diario' },
    { bkl: 'BKL-2026-082', fecha: '15/04/2026', eq: 'JB-26',    sistema: 'Estructura',   hallazgo: 'Desgaste en pines de articulación central',                    prioridad: 'Planificable', score: 30, dias: 5, estado: 'Pendiente',        cicloVida: 'Nuevo',              requiereRetorno: false, fuente: 'Inspección' },
    { bkl: 'BKL-2026-079', fecha: '12/04/2026', eq: 'JB-DD311', sistema: 'Transmisión',  hallazgo: 'Ruido anómalo al cambiar a 2da marcha',                        prioridad: 'Urgente',     score: 75, dias: 8, estado: 'Listo para OT',    cicloVida: 'Listo para OT',      requiereRetorno: false, fuente: 'Parte taller' },
    { bkl: 'BKL-2026-076', fecha: '10/04/2026', eq: 'SC-701',   sistema: 'Hidráulico',   hallazgo: 'Manguera de dirección con micro-fisuras visibles',              prioridad: 'Urgente',     score: 68, dias: 13, estado: 'En análisis',     cicloVida: 'En análisis',        requiereRetorno: true,  fuente: 'Inspección' },
    { bkl: 'BKL-2026-073', fecha: '08/04/2026', eq: 'JB-26',    sistema: 'Eléctrico',    hallazgo: 'Tablero de control presenta falla intermitente en display',    prioridad: 'Normal',      score: 40, dias: 15, estado: 'Pendiente',       cicloVida: 'Nuevo',              requiereRetorno: false, fuente: 'Reporte diario' },
  ],
};
