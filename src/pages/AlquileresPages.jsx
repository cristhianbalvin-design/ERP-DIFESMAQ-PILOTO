import { useState } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';

// ── Mock Data ──────────────────────────────────────────────────────────────
const ACTIVOS_RENTAL = [
  { id: 'LHD-01', modelo: 'Caterpillar R1300G',  tipo: 'Scoop LHD',        horometro: 12500, ubicacion: 'Base — Ate',          estadoComercial: 'Disponible',    cliente: null,                      contrato: null,          imagen: '/images/equipo-lhd-01.png' },
  { id: 'LHD-02', modelo: 'Sandvik LH517i',      tipo: 'Scoop LHD',        horometro:  8340, ubicacion: 'Mina — Volcán',       estadoComercial: 'Alquilado',     cliente: 'Minera Nexa',             contrato: 'CT-2026-001', imagen: '/images/equipo-lhd-02.png' },
  { id: 'JB-24',  modelo: 'EPIROC Simba S7D',    tipo: 'Jumbo Perforador', horometro: 15200, ubicacion: 'Mina — Buenaventura', estadoComercial: 'Alquilado',     cliente: 'Cia. Minas Buenaventura', contrato: 'CT-2026-002', imagen: '/images/equipo-jb-24.png'  },
  { id: 'DT-01',  modelo: 'Sandvik TH540i',      tipo: 'Camión Minero',    horometro:  4800, ubicacion: 'Taller — Ate',        estadoComercial: 'Mantenimiento', cliente: null,                      contrato: null,          imagen: '/images/equipo-dt-01.png'  },
  { id: 'LHD-03', modelo: 'GHH LF-14',           tipo: 'Scoop LHD',        horometro:  6100, ubicacion: 'Base — Satipo',       estadoComercial: 'Disponible',    cliente: null,                      contrato: null,          imagen: '/images/equipo-lhd-03.png' },
];

const CONTRATOS_MOCK = [
  {
    id: 'CT-2026-001', cliente: 'Minera Nexa Resources',  unidadMinera: 'U.M. Animón — Cerro de Pasco',
    equipo: 'LHD-02',  equipoModelo: 'Sandvik LH517i',
    tarifa: 55.00, unidadMedida: 'Hora', minimo: 200, metaDMR: 85,
    inicio: '2026-01-01', vencimiento: '2026-12-31',
    objeto: 'Alquiler de equipo cargador frontal subterráneo para labores de extracción en la unidad minera Animón. Incluye operación, mantenimiento preventivo y correctivo a cargo de DIFESMAQ.',
    representanteCliente: 'Ing. Roberto Quispe Mamani',   representanteZahory: 'Ing. Carlos Mendoza Torres',
  },
  {
    id: 'CT-2026-002', cliente: 'Cia. Minas Buenaventura', unidadMinera: 'U.M. Uchucchacua — Lima',
    equipo: 'JB-24',   equipoModelo: 'EPIROC Simba S7D',
    tarifa: 72.00, unidadMedida: 'Hora', minimo: 180, metaDMR: 88,
    inicio: '2026-02-01', vencimiento: '2026-09-30',
    objeto: 'Alquiler de Jumbo de perforación para avances y preparación de labores en la U.M. Uchucchacua. Mantenimiento integral a cargo de DIFESMAQ con técnico residente.',
    representanteCliente: 'Ing. Patricia Salinas Huerta',  representanteZahory: 'Ing. Carlos Mendoza Torres',
  },
  {
    id: 'CT-2026-004', cliente: 'Antamina S.A.',            unidadMinera: 'U.M. Antamina — Áncash',
    equipo: 'LHD-03',  equipoModelo: 'GHH LF-14',
    tarifa: 61.00, unidadMedida: 'Hora', minimo: 220, metaDMR: 90,
    inicio: '2026-04-01', vencimiento: '2026-06-05',
    objeto: 'Alquiler de cargador subterráneo para soporte operativo en sección de transporte de mineral. Contrato de corto plazo con opción de renovación.',
    representanteCliente: 'Ing. Juan Flores Ccallo',       representanteZahory: 'Ing. Carlos Mendoza Torres',
  },
  {
    id: 'CT-2025-018', cliente: 'Volcan Compañía Minera',   unidadMinera: 'U.M. Yauli — Junín',
    equipo: 'LHD-01',  equipoModelo: 'Caterpillar R1300G',
    tarifa: 48.00, unidadMedida: 'Hora', minimo: 160, metaDMR: 85,
    inicio: '2025-06-01', vencimiento: '2026-03-31',
    objeto: 'Alquiler de cargador LHD para labores de extracción en la U.M. Yauli durante campaña de producción 2025–2026.',
    representanteCliente: 'Ing. Hugo Tapia Cervantes',     representanteZahory: 'Ing. Carlos Mendoza Torres',
  },
];

// ── Helpers de fecha y estado ─────────────────────────────────────────────
const HOY = new Date('2026-05-13');

const calcEstadoContrato = (vencStr) => {
  const venc = new Date(vencStr);
  const diffDias = Math.floor((venc - HOY) / 86400000);
  if (diffDias < 0)   return 'Vencido';
  if (diffDias <= 45) return 'Por Vencer';
  return 'Vigente';
};

const ESTADO_CT_CFG = {
  'Vigente':    { cls: 'badge green',  label: 'Vigente'    },
  'Por Vencer': { cls: 'badge orange', label: 'Por Vencer' },
  'Vencido':    { cls: 'badge red',    label: 'Vencido'    },
};

const fmtFechaLarga = (iso) => {
  const [y, m, d] = iso.split('-');
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d} ${meses[parseInt(m,10)-1]} ${y}`;
};

// Opciones del formulario de nuevo contrato
const CLIENTES_OPT   = ['Minera Nexa Resources','Cia. Minas Buenaventura','Antamina S.A.','Volcan Compañía Minera','Cerro Verde S.A.C.','Gold Fields La Cima','Antapaccay S.A.'];
const UNIDADES_OPT   = ['U.M. Animón — Cerro de Pasco','U.M. Uchucchacua — Lima','U.M. Antamina — Áncash','U.M. Yauli — Junín','U.M. Cuajone — Moquegua','U.M. Cerro Verde — Arequipa','U.M. Tintaya — Cusco'];
const UM_TARIFA_OPT  = ['Hora','Día','Mes'];

const CTFORM_INIT = {
  numero: '', cliente: '', unidad: '',
  equipo: '', tarifa: '', unidadMedida: 'Hora', minimo: '',
  metaDMR: '85',
  inicio: '', vencimiento: '',
};

// ── Componente de vista previa de contrato ────────────────────────────────
const ContratoPdfPreview = ({ contrato, onClose }) => {
  const estado = calcEstadoContrato(contrato.vencimiento);
  const cfg    = ESTADO_CT_CFG[estado];
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(10,17,32,0.80)',
      zIndex:1100, display:'flex', flexDirection:'column',
      alignItems:'center', padding:'0 0 32px',
      overflowY:'auto',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Toolbar flotante */}
      <div style={{
        width:'100%', background:'var(--navy)', padding:'10px 24px',
        display:'flex', alignItems:'center', gap:10,
        position:'sticky', top:0, zIndex:10,
        boxShadow:'0 2px 12px rgba(0,0,0,0.35)',
      }}>
        <span className={cfg.cls} style={{ fontSize:11 }}>
          <span className="dot"/>{cfg.label}
        </span>
        <span style={{
          fontFamily:'ui-monospace,monospace', fontWeight:800,
          color:'white', fontSize:14, marginLeft:4,
        }}>{contrato.id}</span>
        <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.65)', marginLeft:4 }}>
          · {contrato.cliente}
        </span>
        <div style={{ flex:1 }}/>
        <button className="btn btn-secondary btn-sm" style={{ color:'white', borderColor:'rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.08)' }}>
          <Icon name="download" size={13}/> Descargar PDF
        </button>
        <button className="btn btn-secondary btn-sm" style={{ color:'white', borderColor:'rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.08)' }}>
          <Icon name="report" size={13}/> Imprimir
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onClose}
          style={{ color:'rgba(255,255,255,0.75)', marginLeft:4 }}>
          <Icon name="x" size={15}/>
        </button>
      </div>

      {/* Hoja A4 */}
      <div style={{
        width:'100%', maxWidth:794, margin:'32px auto 0',
        background:'white', boxShadow:'0 12px 48px rgba(0,0,0,0.45)',
        borderRadius:4, padding:'56px 64px', color:'#111',
        fontFamily:'Georgia, "Times New Roman", serif',
        lineHeight:1.6,
      }}>

        {/* Encabezado del documento */}
        <div style={{
          display:'flex', alignItems:'flex-start', gap:20,
          borderBottom:'3px solid var(--navy)', paddingBottom:20, marginBottom:24,
        }}>
          <div style={{
            width:56, height:56, background:'var(--navy)', borderRadius:8,
            display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0,
          }}>
            <span style={{ color:'white', fontWeight:900, fontSize:13, letterSpacing:-1, fontFamily:'sans-serif' }}>Z</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'sans-serif', fontWeight:900, fontSize:18, color:'var(--navy)', letterSpacing:-.5 }}>
              DIFESMAQ
            </div>
            <div style={{ fontFamily:'sans-serif', fontSize:11, color:'#666', marginTop:1 }}>
              Servicios de Mantenimiento y Alquiler de Equipos Mineros
            </div>
            <div style={{ fontFamily:'sans-serif', fontSize:10.5, color:'#666' }}>
              Av. Industrial 1240, Ate — Lima · RUC 20512345678
            </div>
          </div>
          <div style={{ textAlign:'right', fontFamily:'sans-serif' }}>
            <div style={{ fontWeight:800, fontSize:15, color:'var(--navy)' }}>
              CONTRATO DE ALQUILER
            </div>
            <div style={{ fontWeight:700, fontFamily:'ui-monospace,monospace', fontSize:13, color:'var(--cyan)', marginTop:3 }}>
              {contrato.id}
            </div>
            <div style={{ fontSize:11, color:'#666', marginTop:4 }}>
              Vigencia: {fmtFechaLarga(contrato.inicio)} — {fmtFechaLarga(contrato.vencimiento)}
            </div>
          </div>
        </div>

        {/* I — Partes Intervinientes */}
        <Section title="I. PARTES INTERVINIENTES">
          <Row label="ARRENDADOR" val="DIFESMAQ — RUC 20512345678"/>
          <Row label="Representante Legal" val="Ing. Carlos Mendoza Torres — DNI 08765432"/>
          <Row label="ARRENDATARIO" val={contrato.cliente}/>
          <Row label="Representante" val={contrato.representanteCliente}/>
        </Section>

        {/* II — Objeto */}
        <Section title="II. OBJETO DEL ALQUILER">
          <Row label="Equipo" val={`${contrato.equipo} — ${contrato.equipoModelo}`}/>
          <Row label="Unidad Minera" val={contrato.unidadMinera}/>
          <div style={{ marginTop:10, fontSize:13 }}>
            <span style={{ fontWeight:700 }}>Descripción: </span>
            {contrato.objeto}
          </div>
        </Section>

        {/* III — Tarifas */}
        <Section title="III. TARIFAS Y CONDICIONES">
          <Row label="Tarifa Operativa" val={`USD ${contrato.tarifa.toFixed(2)} por hora`}/>
          <Row label="Mínimo Garantizado" val={`${contrato.minimo} horas / mes`}/>
          <Row label="Meta de Disponibilidad Mecánica (DMR)" val={`${contrato.metaDMR}% — Según cláusula 5.2`}/>
          <Row label="Moneda de Facturación" val="Dólares Americanos (USD)"/>
          <Row label="Forma de Pago" val="30 días calendario desde la remisión de servicios"/>
          <div style={{ marginTop:12, fontSize:12, color:'#555', background:'#F8FAFC', padding:'10px 14px', borderRadius:6, borderLeft:'3px solid #CBD5E1' }}>
            En caso de que el DMR real sea inferior al DMR pactado, se aplicará una penalidad proporcional
            calculada según el Anexo A del presente contrato.
          </div>
        </Section>

        {/* IV — Firmas */}
        <Section title="IV. FIRMAS Y CONFORMIDAD">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, marginTop:8 }}>
            {[
              { rol:'POR EL ARRENDADOR', nombre:'DIFESMAQ', rep:contrato.representanteZahory },
              { rol:'POR EL ARRENDATARIO', nombre:contrato.cliente, rep:contrato.representanteCliente },
            ].map(f => (
              <div key={f.rol} style={{ textAlign:'center' }}>
                <div style={{ borderBottom:'1.5px solid #111', height:52, marginBottom:8 }}/>
                <div style={{ fontWeight:700, fontSize:12 }}>{f.rol}</div>
                <div style={{ fontSize:12 }}>{f.nombre}</div>
                <div style={{ fontSize:11.5, color:'#555' }}>{f.rep}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer del doc */}
        <div style={{
          marginTop:32, paddingTop:14,
          borderTop:'1px solid #E2E8F0',
          fontSize:10.5, color:'#999',
          fontFamily:'sans-serif', display:'flex', justifyContent:'space-between',
        }}>
          <span>Documento generado por DIFESMAQ ERP · {new Date().toLocaleDateString('es-PE')}</span>
          <span>Pág. 1 de 1</span>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom:24 }}>
    <div style={{
      fontFamily:'sans-serif', fontWeight:800, fontSize:12,
      textTransform:'uppercase', letterSpacing:.8,
      color:'var(--navy)', borderBottom:'1px solid #E2E8F0',
      paddingBottom:5, marginBottom:10,
    }}>{title}</div>
    {children}
  </div>
);

const Row = ({ label, val }) => (
  <div style={{ display:'flex', gap:8, marginBottom:4, fontSize:13 }}>
    <span style={{ fontWeight:700, minWidth:240, color:'#333' }}>{label}:</span>
    <span style={{ color:'#111' }}>{val}</span>
  </div>
);

// ─── Datos diarios de disponibilidad — Abril 2026 ─────────────────────────
// Formato por día: [opH, paradaH, tipo, otRef, observacion]
// tipo: 'P' = Programada · 'NP' = No Programada · null = sin parada
const _mkDias = (raw) => raw.map(([op, par, tipo, ot, obs], idx) => ({
  dia: idx + 1, opH: op, paradaH: par, tipo, ot, obs,
  dmrPct: (op + par) > 0 ? +((op / (op + par)) * 100).toFixed(1) : null,
}));

const DIAS_LHD02 = _mkDias([
  [8.0, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [7.0, 2.0, 'P',  'OT-2026-028', 'PM-250h — Cambio de aceite hidráulico y filtros'],
  [8.0, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [0,   0,   null, null,           'Domingo — sin operación'],
  [8.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [6.0, 5.0, 'NP', 'OT-2026-035', 'Fuga de aceite en cilindro de levante — parada imprevista turno noche'],
  [8.0, 0,   null, null,           ''],
  [8.5, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [6.0, 5.0, 'P',  'OT-2026-041', 'Reemplazo de pines y bocinas delanteras — PM programado'],
  [8.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [0,   0,   null, null,           'Domingo — sin operación'],
  [8.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [8.0, 0,   null, null,           ''],
  [8.5, 0,   null, null,           ''],
  [7.5, 0,   null, null,           ''],
  [7.0, 0,   null, null,           ''],
]);

const DIAS_JB24 = _mkDias([
  [5.5, 0,   null, null,           ''],
  [4.0, 6.0, 'NP', 'OT-2026-029', 'Falla en sistema de rotación — cabezal de perforación bloqueado'],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [0,   0,   null, null,           'Domingo — sin operación'],
  [5.5, 0,   null, null,           ''],
  [3.0, 7.0, 'NP', 'OT-2026-033', 'Rotura de manguera de agua a alta presión — parada de emergencia'],
  [5.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [4.5, 3.5, 'P',  'OT-2026-039', 'PM-500h — Cambio de filtros y lubricación general'],
  [5.0, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [2.5, 7.0, 'NP', 'OT-2026-044', 'Falla eléctrica panel de control — módulo ECU dañado'],
  [5.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [4.5, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [0,   0,   null, null,           'Domingo — sin operación'],
  [4.5, 7.5, 'NP', 'OT-2026-051', 'Fisura en brazo del boom — inspección y refuerzo de soldadura'],
  [5.5, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
]);

const DIAS_DT01 = _mkDias([
  [5.5, 0,   null, null,           ''],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [5.0, 4.0, 'NP', 'OT-2026-030', 'Falla en sistema de frenos — válvula de freno de servicio'],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [0,   0,   null, null,           'Domingo — sin operación'],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [6.0, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
  [4.5, 5.5, 'P',  'OT-2026-040', 'PM-1000h — Cambio de neumáticos y calibración de frenos'],
  [5.5, 0,   null, null,           ''],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [5.0, 3.5, 'NP', 'OT-2026-047', 'Sobrecalentamiento de motor — cambio de termostato y correas'],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [0,   0,   null, null,           'Domingo — sin operación'],
  [5.5, 0,   null, null,           ''],
  [6.0, 0,   null, null,           ''],
  [5.0, 5.0, 'P',  'OT-2026-053', 'Revisión sistema hidráulico — mantenimiento semi-anual'],
  [5.5, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [6.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
  [5.0, 0,   null, null,           ''],
  [5.5, 0,   null, null,           ''],
]);

const LIQUIDACION_MOCK = [
  {
    equipo:'LHD-02', modelo:'Sandvik LH517i', cliente:'Minera Nexa Resources',
    contrato:'CT-2026-001', tarifa:55.00, horasContrato:200,
    horasReales:217, horasParada:12, dmr:94.7, metaDMR:85,
    estado:'Pre-facturado', proyecto:'U.M. Animón — Cerro de Pasco',
    serie:'LH517i-A3-28840', dias:DIAS_LHD02,
  },
  {
    equipo:'JB-24', modelo:'EPIROC Simba S7D', cliente:'Cia. Minas Buenaventura',
    contrato:'CT-2026-002', tarifa:72.00, horasContrato:180,
    horasReales:140, horasParada:31, dmr:81.9, metaDMR:88,
    estado:'En Revisión', proyecto:'U.M. Uchucchacua — Lima',
    serie:'S7D-BV-10093', dias:DIAS_JB24,
  },
  {
    equipo:'DT-01', modelo:'Sandvik TH540i', cliente:'Antapaccay S.A.',
    contrato:'CT-2026-004', tarifa:61.00, horasContrato:160,
    horasReales:155, horasParada:18, dmr:89.6, metaDMR:85,
    estado:'Pre-facturado', proyecto:'U.M. Antapaccay — Cusco',
    serie:'TH540i-AP-77412', dias:DIAS_DT01,
  },
];

// ── Flota status config ────────────────────────────────────────────────────
const ESTADO_FLOTA_CFG = {
  'Disponible':    { cls: 'badge green',  dot: '#4CAF50', bg: '#E8F5E9' },
  'Alquilado':     { cls: 'badge cyan',   dot: '#00BCD4', bg: '#E0F7FA' },
  'Mantenimiento': { cls: 'badge orange', dot: '#FF9800', bg: '#FFF3E0' },
};

const FLOTA_TABS = [
  { id: 'todos',         label: 'Todos'          },
  { id: 'Disponible',    label: 'Disponibles'    },
  { id: 'Alquilado',     label: 'Alquilados'     },
  { id: 'Mantenimiento', label: 'En Taller'      },
];

// ── Opciones mock para el formulario de nuevo equipo ──────────────────────
const CATEGORIAS_EQUIPO   = ['Cargador Subterráneo (LHD)', 'Camión Minero', 'Jumbo Perforador', 'Bolter', 'Excavadora', 'Camioneta 4×4', 'Otro'];
const MARCAS_EQUIPO       = ['Caterpillar', 'Sandvik', 'EPIROC', 'GHH', 'Atlas Copco', 'Komatsu', 'Toyota', 'Hilux', 'Otra'];
const UBICACIONES_EQUIPO  = ['Base — Ate', 'Base — Satipo', 'Mina — Volcán', 'Mina — Buenaventura', 'Mina — Antamina', 'Proyecto Antapaccay', 'En Tránsito'];
const ESTADOS_COMERCIALES = ['Disponible', 'Alquilado', 'Mantenimiento'];

const FORM_INIT = {
  codigo: '', categoria: '', marca: '', modelo: '', serie: '',
  horometro: '', ubicacion: '', estadoComercial: 'Disponible',
};

// ── Toast simple ───────────────────────────────────────────────────────────
const Toast = ({ msg }) => (
  <div style={{
    position:'fixed', bottom:28, right:28, zIndex:2000,
    background:'#1B5E20', color:'white',
    padding:'12px 20px', borderRadius:10,
    fontWeight:700, fontSize:13.5,
    boxShadow:'0 8px 32px rgba(0,0,0,0.25)',
    display:'flex', alignItems:'center', gap:10,
    animation:'fadeInUp 0.22s ease-out',
  }}>
    <span style={{ fontSize:18 }}>✓</span> {msg}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// 1. PANEL DE FLOTA
// ═══════════════════════════════════════════════════════════════════════════
export const FlotaRentalPage = ({ onNav }) => {
  const [tab, setTab]         = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]       = useState(FORM_INIT);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(false);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGuardar = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setModalOpen(false);
      setForm(FORM_INIT);
      setToast(true);
      setTimeout(() => setToast(false), 2800);
    }, 900);
  };

  const handleCancelar = () => { setModalOpen(false); setForm(FORM_INIT); };

  const filtered = ACTIVOS_RENTAL.filter(e =>
    tab === 'todos' || e.estadoComercial === tab
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Panel de Flota</h1>
          <div className="sub">Disponibilidad y estado comercial de activos en alquiler</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-secondary"><Icon name="download" size={13}/> Exportar</button>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Icon name="plus" size={13}/> Nuevo Equipo
        </button>
      </div>

      {/* Quick filter tabs */}
      <div className="ot-quick-tabs" style={{ marginBottom:16 }}>
        {FLOTA_TABS.map(t => (
          <button key={t.id}
            className={'ot-qtab' + (tab === t.id ? ' active' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className="qtab-count">
              {t.id === 'todos'
                ? ACTIVOS_RENTAL.length
                : ACTIVOS_RENTAL.filter(e => e.estadoComercial === t.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid de cards */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(284px, 1fr))',
        gap:16, marginBottom:24,
      }}>
        {filtered.map(eq => {
          const cfg = ESTADO_FLOTA_CFG[eq.estadoComercial];
          return (
            <div key={eq.id} className="card"
              style={{ overflow:'hidden', cursor:'pointer', transition:'box-shadow .15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 6px 24px rgba(17,24,39,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow=''}
            >
              {/* Foto del equipo */}
              <div style={{
                height:160, position:'relative', overflow:'hidden',
                background:'#F0F2F5',
              }}>
                <img
                  src={eq.imagen}
                  alt={eq.modelo}
                  style={{
                    width:'100%', height:'100%',
                    objectFit:'contain', objectPosition:'center',
                    padding:'10px 16px',
                    transition:'transform .25s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, var(--navy) 0%, #253759 100%)';
                  }}
                />
                <span className={cfg.cls} style={{
                  position:'absolute', top:10, right:10, fontSize:11, padding:'3px 9px',
                }}>
                  <span className="dot"/>{eq.estadoComercial}
                </span>
                <span style={{
                  position:'absolute', bottom:8, left:12,
                  fontSize:10, fontWeight:700, letterSpacing:1,
                  color:'var(--text-muted)', textTransform:'uppercase',
                }}>
                  {eq.tipo}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding:'14px 16px 16px' }}>
                <div style={{ marginBottom:12 }}>
                  <div style={{
                    fontFamily:'ui-monospace,monospace', fontWeight:800,
                    fontSize:16, color:'var(--navy)', letterSpacing:-.2,
                  }}>{eq.id}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginTop:2 }}>
                    {eq.modelo}
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                  {[
                    { label:'Horómetro', val:`${eq.horometro.toLocaleString()} h`, mono:true },
                    { label:'Ubicación',  val: eq.ubicacion,                        mono:false },
                  ].map(({ label, val, mono }) => (
                    <div key={label} style={{ padding:'7px 10px', background:'#F8FAFC', borderRadius:6 }}>
                      <div style={{ fontSize:9.5, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:.6, marginBottom:3 }}>
                        {label}
                      </div>
                      <div style={{
                        fontWeight:700, color:'var(--navy)', fontSize:12,
                        fontFamily: mono ? 'ui-monospace,monospace' : 'inherit',
                      }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

                {eq.cliente && (
                  <div style={{
                    marginBottom:12, padding:'8px 10px',
                    background: cfg.bg, borderRadius:6,
                    fontSize:12,
                  }}>
                    <span style={{ color:'var(--text-muted)' }}>Cliente: </span>
                    <span style={{ fontWeight:700 }}>{eq.cliente}</span>
                    <span className="chip" style={{ marginLeft:8, fontSize:10.5, fontFamily:'ui-monospace,monospace' }}>
                      {eq.contrato}
                    </span>
                  </div>
                )}

                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex:1, justifyContent:'center' }}>
                    Historial
                  </button>
                  {eq.estadoComercial === 'Disponible' && (
                    <button className="btn btn-cyan btn-sm"
                      style={{ flex:1, justifyContent:'center' }}
                      onClick={() => onNav('checkout')}
                    >
                      <Icon name="arrow" size={12}/> Despachar
                    </button>
                  )}
                  {eq.estadoComercial === 'Alquilado' && (
                    <button className="btn btn-secondary btn-sm"
                      style={{ flex:1, justifyContent:'center' }}
                      onClick={() => onNav('checkout')}
                    >
                      <Icon name="back" size={12}/> Retornar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Nuevo Equipo ─────────────────────────────────────────── */}
      {modalOpen && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(15,23,42,0.65)',
          zIndex:1000, display:'grid', placeItems:'center', padding:20,
          overflowY:'auto',
        }}
          onClick={e => { if (e.target === e.currentTarget) handleCancelar(); }}
        >
          <div className="card" style={{
            width:'100%', maxWidth:680,
            animation:'fadeInUp 0.2s ease-out',
            margin:'auto',
          }}>
            {/* Header */}
            <div className="card-header" style={{
              background:'var(--navy)', color:'white', borderRadius:'8px 8px 0 0',
            }}>
              <div>
                <h3 style={{ margin:0 }}>Registrar Nuevo Equipo</h3>
                <div style={{ fontSize:12, opacity:.75, marginTop:2 }}>
                  Ingrese los datos técnicos y el estado inicial del activo.
                </div>
              </div>
              <div className="spacer"/>
              <button className="icon-btn" onClick={handleCancelar} style={{ color:'white' }}>
                <Icon name="x" size={16}/>
              </button>
            </div>

            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {/* Sección A */}
              <div>
                <div style={{
                  fontSize:11, fontWeight:800, letterSpacing:.8, textTransform:'uppercase',
                  color:'var(--cyan)', marginBottom:10,
                }}>A — Identificación del Activo</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="field">
                    <label>Código Interno *</label>
                    <input className="input" placeholder="Ej. LHD-04, CAM-02"
                      value={form.codigo} onChange={e => setField('codigo', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label>Categoría *</label>
                    <select className="select"
                      value={form.categoria} onChange={e => setField('categoria', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {CATEGORIAS_EQUIPO.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Marca</label>
                    <select className="select"
                      value={form.marca} onChange={e => setField('marca', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {MARCAS_EQUIPO.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Modelo</label>
                    <input className="input" placeholder="Ej. R1300G, TH540i"
                      value={form.modelo} onChange={e => setField('modelo', e.target.value)}/>
                  </div>
                  <div className="field" style={{ gridColumn:'1/-1' }}>
                    <label>Número de Serie / PIN</label>
                    <input className="input" placeholder="Vital para historial de mantenimiento"
                      value={form.serie} onChange={e => setField('serie', e.target.value)}/>
                  </div>
                </div>
              </div>

              {/* Sección B */}
              <div>
                <div style={{
                  fontSize:11, fontWeight:800, letterSpacing:.8, textTransform:'uppercase',
                  color:'var(--cyan)', marginBottom:10,
                }}>B — Estado Operativo Inicial</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="field">
                    <label>Horómetro / Kilometraje Inicial</label>
                    <input className="input" type="number" placeholder="Ej. 8340"
                      value={form.horometro} onChange={e => setField('horometro', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label>Estado Comercial</label>
                    <select className="select"
                      value={form.estadoComercial} onChange={e => setField('estadoComercial', e.target.value)}>
                      {ESTADOS_COMERCIALES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ gridColumn:'1/-1' }}>
                    <label>Ubicación Actual</label>
                    <select className="select"
                      value={form.ubicacion} onChange={e => setField('ubicacion', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {UBICACIONES_EQUIPO.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección C */}
              <div>
                <div style={{
                  fontSize:11, fontWeight:800, letterSpacing:.8, textTransform:'uppercase',
                  color:'var(--cyan)', marginBottom:10,
                }}>C — Multimedia</div>
                <div className="field">
                  <label>Foto del equipo</label>
                  <div style={{
                    border:'2px dashed var(--card-border)', borderRadius:10,
                    padding:'24px 20px', textAlign:'center', background:'#F8FAFC',
                    cursor:'pointer', transition:'border-color .15s, background .15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--cyan)'; e.currentTarget.style.background='#F0FDFE'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--card-border)'; e.currentTarget.style.background='#F8FAFC'; }}
                  >
                    <Icon name="camera" size={28} stroke={1.5}/>
                    <div style={{ marginTop:8, fontWeight:700, fontSize:13, color:'var(--navy)' }}>
                      Arrastra una imagen o haz clic para subir
                    </div>
                    <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:3 }}>
                      JPG, PNG, HEIC · Máx. 10 MB
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display:'flex', gap:10, padding:'4px 16px 16px' }}>
              <button className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}
                onClick={handleCancelar} disabled={saving}>
                Cancelar
              </button>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}
                onClick={handleGuardar} disabled={saving}>
                {saving
                  ? <><span className="spinner" style={{ width:13, height:13, borderWidth:2, marginRight:6 }}/> Guardando...</>
                  : <><Icon name="check" size={13}/> Guardar Equipo</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg="Equipo registrado correctamente"/>}
      <FooterBrand/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. CONTRATOS Y TARIFAS
// ═══════════════════════════════════════════════════════════════════════════
export const ContratosRentalPage = () => {
  const [modalNuevo,  setModalNuevo]  = useState(false);
  const [preview,     setPreview]     = useState(null);   // contrato seleccionado para PDF
  const [ctForm,      setCtForm]      = useState(CTFORM_INIT);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(false);

  const setCtField = (k, v) => setCtForm(f => ({ ...f, [k]: v }));

  const handleGuardar = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setModalNuevo(false);
      setCtForm(CTFORM_INIT);
      setToast(true);
      setTimeout(() => setToast(false), 2800);
    }, 900);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Contratos y Tarifas</h1>
          <div className="sub">Acuerdos comerciales de alquiler de flota</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-secondary"><Icon name="download" size={13}/> Exportar</button>
        <button className="btn btn-primary" onClick={() => setModalNuevo(true)}>
          <Icon name="plus" size={13}/> Nuevo Contrato
        </button>
      </div>

      {/* ── Tabla de contratos ─────────────────────────────────────────── */}
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width:200 }}>Contrato</th>
              <th>Cliente / Unidad Minera</th>
              <th style={{ width:160 }}>Equipo</th>
              <th style={{ width:170 }}>Condiciones</th>
              <th className="num" style={{ width:110 }}>Meta DMR</th>
              <th style={{ width:110 }}>Estado</th>
              <th style={{ width:72 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {CONTRATOS_MOCK.map(c => {
              const estado = calcEstadoContrato(c.vencimiento);
              const cfg    = ESTADO_CT_CFG[estado];
              return (
                <tr key={c.id} className="clickable">

                  {/* Col: Contrato (Nº + vigencia apilados) */}
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{
                        fontFamily:'ui-monospace,monospace', fontWeight:800, fontSize:12.5,
                        color:'var(--cyan)', textDecoration:'underline', textUnderlineOffset:3,
                        padding:'2px 4px', display:'block', marginBottom:2,
                      }}
                      onClick={() => setPreview(c)}
                    >
                      {c.id}
                    </button>
                    <div style={{ fontSize:11, color:'var(--text-muted)', paddingLeft:4 }}>
                      {fmtFechaLarga(c.inicio)} — {fmtFechaLarga(c.vencimiento)}
                    </div>
                  </td>

                  {/* Col: Cliente / Sede apilados */}
                  <td>
                    <div style={{ fontWeight:700, fontSize:13 }}>{c.cliente}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:1 }}>{c.unidadMinera}</div>
                  </td>

                  {/* Col: Equipo */}
                  <td>
                    <span className="chip" style={{ fontFamily:'ui-monospace,monospace', fontSize:11.5 }}>
                      {c.equipo}
                    </span>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>{c.equipoModelo}</div>
                  </td>

                  {/* Col: Condiciones (tarifa + mínimo apilados) */}
                  <td>
                    <div style={{ fontFamily:'ui-monospace,monospace', fontWeight:700, fontSize:13, color:'var(--navy)' }}>
                      ${c.tarifa.toFixed(2)} / hr
                    </div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>
                      {c.minimo} h mínimas / mes
                    </div>
                  </td>

                  {/* Col: Meta DMR */}
                  <td className="num">
                    <span style={{
                      display:'inline-flex', alignItems:'center', justifyContent:'center',
                      padding:'4px 12px', borderRadius:20, fontWeight:800,
                      fontSize:12.5, fontFamily:'ui-monospace,monospace',
                      background: c.metaDMR >= 88 ? '#EDE7F6' : '#E0F7FA',
                      color:      c.metaDMR >= 88 ? '#4527A0' : '#006064',
                    }}>
                      {c.metaDMR}%
                    </span>
                  </td>

                  {/* Col: Estado */}
                  <td>
                    <span className={cfg.cls}><span className="dot"/>{cfg.label}</span>
                  </td>

                  {/* Col: Acciones */}
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setPreview(c)}
                      title="Ver documento del contrato">
                      <Icon name="report" size={13}/>
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Editar">
                      <Icon name="edit" size={13}/>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Modal Nuevo Contrato ───────────────────────────────────────── */}
      {modalNuevo && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(15,23,42,0.65)',
          zIndex:1000, display:'grid', placeItems:'center', padding:20, overflowY:'auto',
        }}
          onClick={e => { if (e.target === e.currentTarget) { setModalNuevo(false); setCtForm(CTFORM_INIT); } }}
        >
          <div className="card" style={{ width:'100%', maxWidth:640, animation:'fadeInUp 0.2s ease-out', margin:'auto' }}>
            <div className="card-header" style={{ background:'var(--navy)', color:'white', borderRadius:'8px 8px 0 0' }}>
              <div>
                <h3 style={{ margin:0 }}>Nuevo Contrato de Alquiler</h3>
                <div style={{ fontSize:12, opacity:.75, marginTop:2 }}>Complete los datos del acuerdo comercial.</div>
              </div>
              <div className="spacer"/>
              <button className="icon-btn" onClick={() => { setModalNuevo(false); setCtForm(CTFORM_INIT); }} style={{ color:'white' }}>
                <Icon name="x" size={16}/>
              </button>
            </div>

            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {/* Sección A */}
              <div>
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:.8, textTransform:'uppercase', color:'var(--cyan)', marginBottom:10 }}>
                  A — Identificación
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="field" style={{ gridColumn:'1/-1' }}>
                    <label>Nº de Contrato *</label>
                    <input className="input" placeholder="Ej. CT-2026-005"
                      value={ctForm.numero} onChange={e => setCtField('numero', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label>Cliente *</label>
                    <select className="select" value={ctForm.cliente} onChange={e => setCtField('cliente', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {CLIENTES_OPT.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Unidad Minera *</label>
                    <select className="select" value={ctForm.unidad} onChange={e => setCtField('unidad', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {UNIDADES_OPT.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Equipo Asignado *</label>
                    <select className="select" value={ctForm.equipo} onChange={e => setCtField('equipo', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {ACTIVOS_RENTAL.filter(e => e.estadoComercial === 'Disponible').map(e => (
                        <option key={e.id}>{e.id} — {e.modelo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Fecha de Inicio *</label>
                    <input className="input" type="date" value={ctForm.inicio} onChange={e => setCtField('inicio', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label>Fecha de Vencimiento *</label>
                    <input className="input" type="date" value={ctForm.vencimiento} onChange={e => setCtField('vencimiento', e.target.value)}/>
                  </div>
                </div>
              </div>

              {/* Sección B */}
              <div>
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:.8, textTransform:'uppercase', color:'var(--cyan)', marginBottom:10 }}>
                  B — Parámetros de Cobro
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  <div className="field">
                    <label>Tarifa (USD) *</label>
                    <input className="input" type="number" placeholder="0.00"
                      value={ctForm.tarifa} onChange={e => setCtField('tarifa', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label>Unidad de Medida</label>
                    <select className="select" value={ctForm.unidadMedida} onChange={e => setCtField('unidadMedida', e.target.value)}>
                      {UM_TARIFA_OPT.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Mínimo Garantizado (hrs)</label>
                    <input className="input" type="number" placeholder="200"
                      value={ctForm.minimo} onChange={e => setCtField('minimo', e.target.value)}/>
                  </div>
                </div>
              </div>

              {/* Sección C */}
              <div>
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:.8, textTransform:'uppercase', color:'var(--cyan)', marginBottom:10 }}>
                  C — KPI de Disponibilidad
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="field">
                    <label>Meta DMR % *</label>
                    <input className="input" type="number" min={0} max={100} placeholder="85"
                      value={ctForm.metaDMR} onChange={e => setCtField('metaDMR', e.target.value)}/>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:4 }}>
                    <div style={{
                      padding:'8px 12px', background:'#E0F7FA', borderRadius:8,
                      fontSize:12, color:'#006064', fontWeight:600, lineHeight:1.4,
                    }}>
                      Si DMR real {'<'} meta → penalidad contractual según Anexo A
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección D */}
              <div>
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:.8, textTransform:'uppercase', color:'var(--cyan)', marginBottom:10 }}>
                  D — Documento del Contrato
                </div>
                <div style={{
                  border:'2px dashed var(--card-border)', borderRadius:10,
                  padding:'22px 20px', textAlign:'center', background:'#F8FAFC',
                  cursor:'pointer', transition:'border-color .15s, background .15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--cyan)'; e.currentTarget.style.background='#F0FDFE'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--card-border)'; e.currentTarget.style.background='#F8FAFC'; }}
                >
                  <Icon name="pdf" size={26} stroke={1.5}/>
                  <div style={{ marginTop:8, fontWeight:700, fontSize:13, color:'var(--navy)' }}>
                    Adjuntar PDF escaneado del contrato
                  </div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:3 }}>
                    PDF · Máx. 25 MB
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, padding:'4px 16px 16px' }}>
              <button className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}
                onClick={() => { setModalNuevo(false); setCtForm(CTFORM_INIT); }} disabled={saving}>
                Cancelar
              </button>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}
                onClick={handleGuardar} disabled={saving}>
                {saving
                  ? <><span className="spinner" style={{ width:13, height:13, borderWidth:2, marginRight:6 }}/> Guardando...</>
                  : <><Icon name="check" size={13}/> Guardar Contrato</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PDF Preview ────────────────────────────────────────────────── */}
      {preview && <ContratoPdfPreview contrato={preview} onClose={() => setPreview(null)}/>}

      {toast && <Toast msg="Contrato registrado correctamente"/>}
      <FooterBrand/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. ACTAS DIGITALES — CHECK-IN / CHECK-OUT
// ═══════════════════════════════════════════════════════════════════════════
export const DespachosRentalPage = ({ onNav }) => {
  const [tipo, setTipo]             = useState('salida');
  const [combustible, setCombustible] = useState(75);

  const lados = ['Frontal', 'Posterior', 'Lat. Izq.', 'Lat. Der.'];

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => onNav('flota')}>
          <Icon name="back" size={14}/> Volver
        </button>
        <div>
          <h1>Acta de Despacho / Recepción</h1>
          <div className="sub">Registro digital de salida a mina o retorno a base</div>
        </div>
      </div>

      <div style={{ maxWidth:820, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Sección 1: Datos */}
        <div className="card">
          <div className="card-header"><h3>Sección 1 — Datos del movimiento</h3></div>
          <div className="card-body">
            <div className="grid-2" style={{ gap:14 }}>
              <div className="field">
                <label>Contrato *</label>
                <select className="select">
                  {CONTRATOS_MOCK.filter(c => c.estado === 'Activo').map(c => (
                    <option key={c.id}>{c.id} — {c.cliente} / {c.equipo}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Fecha y Hora *</label>
                <input className="input" type="datetime-local" defaultValue="2026-04-19T08:00"/>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Tipo de movimiento *</label>
                <div className="toggle-pills">
                  <button className={'toggle-pill ' + (tipo === 'salida' ? 'active' : '')}
                    onClick={() => setTipo('salida')}>
                    Salida a Mina
                  </button>
                  <button className={'toggle-pill ' + (tipo === 'retorno' ? 'active' : '')}
                    onClick={() => setTipo('retorno')}>
                    Retorno a Base
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2: Inspección */}
        <div className="card">
          <div className="card-header"><h3>Sección 2 — Inspección del equipo</h3></div>
          <div className="card-body">
            {/* Dropzone */}
            <div className="field" style={{ marginBottom:18 }}>
              <label>Fotos de los 4 lados del equipo *</label>
              <div style={{
                border:'2px dashed var(--card-border)', borderRadius:10,
                padding:'28px 20px', textAlign:'center', background:'#F8FAFC',
                cursor:'pointer', transition:'border-color .15s, background .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--cyan)'; e.currentTarget.style.background='#F0FDFE'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--card-border)'; e.currentTarget.style.background='#F8FAFC'; }}
              >
                <Icon name="upload" size={26} stroke={1.5}/>
                <div style={{ marginTop:8, fontWeight:700, fontSize:13, color:'var(--navy)' }}>
                  Arrastra las fotos aquí o haz clic para seleccionar
                </div>
                <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:3 }}>
                  JPG, PNG, HEIC · Máx. 10 MB por imagen · 4 fotos requeridas
                </div>
                <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:16 }}>
                  {lados.map(lado => (
                    <div key={lado} style={{
                      width:82, height:68, borderRadius:8,
                      border:'1.5px dashed #CBD5E1', background:'white',
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center',
                      gap:5, fontSize:10.5, color:'var(--text-muted)', fontWeight:600,
                    }}>
                      <Icon name="camera" size={18} stroke={1.5}/>
                      {lado}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap:14 }}>
              <div className="field">
                <label>Horómetro {tipo === 'salida' ? 'Inicial' : 'Final'} (hrs) *</label>
                <input className="input" type="number" placeholder="Ej. 8340"/>
              </div>
              <div className="field">
                <label>
                  Nivel de Combustible —{' '}
                  <span style={{ fontFamily:'ui-monospace,monospace', fontWeight:700, color:'var(--navy)' }}>
                    {combustible}%
                  </span>
                </label>
                <input type="range" min={0} max={100} value={combustible}
                  onChange={e => setCombustible(Number(e.target.value))}
                  style={{ width:'100%', marginTop:8, accentColor:'var(--cyan)' }}
                />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginTop:3 }}>
                  <span>Vacío</span><span>50%</span><span>Lleno</span>
                </div>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Observaciones / Anomalías detectadas</label>
                <textarea className="input" rows={3}
                  placeholder="Describe cualquier daño, fuga, desgaste u observación relevante..."
                  style={{ resize:'vertical', fontFamily:'inherit', paddingTop:8 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección 3: Firma */}
        <div className="card">
          <div className="card-header"><h3>Sección 3 — Firma digital del cliente</h3></div>
          <div className="card-body">
            <div style={{
              height:176, border:'2px dashed var(--card-border)', borderRadius:10,
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              gap:10, background:'#FAFAFA', color:'var(--text-muted)',
            }}>
              <Icon name="edit" size={28} stroke={1.5}/>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--navy)' }}>
                Área para Firma Digital del Cliente
              </div>
              <div style={{ fontSize:12 }}>
                El representante del cliente firmará en este recuadro
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button className="btn btn-secondary" style={{ justifyContent:'center' }}
                onClick={() => onNav('flota')}>
                Cancelar
              </button>
              <button className="btn btn-secondary" style={{ justifyContent:'center' }}>
                <Icon name="x" size={13}/> Limpiar firma
              </button>
              <div style={{ flex:1 }}/>
              <button className="btn btn-primary" style={{ justifyContent:'center' }}>
                <Icon name="pdf" size={13}/> Generar Acta PDF
              </button>
            </div>
          </div>
        </div>

      </div>
      <FooterBrand/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. LIQUIDACIÓN Y REPORTE DMR — Componentes de soporte
// ═══════════════════════════════════════════════════════════════════════════

// Mini sparkline para la columna de tendencia en la tabla principal
const SparklineMini = ({ dias }) => {
  const vals = dias.filter(d => d.dmrPct !== null).map(d => d.dmrPct);
  if (vals.length < 2) return null;
  const w = 80, h = 28, minV = 50, maxV = 100;
  const scaleY = v => h - ((v - minV) / (maxV - minV)) * h;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${scaleY(v)}`).join(' ');
  const last = vals[vals.length - 1];
  const rising = last >= vals[0];
  return (
    <svg width={w} height={h} style={{ display:'block', overflow:'visible' }}>
      <polyline points={pts} fill="none"
        stroke={rising ? '#22c55e' : '#ef4444'} strokeWidth={1.8}
        strokeLinejoin="round" strokeLinecap="round"/>
      <circle
        cx={(vals.length - 1) / (vals.length - 1) * w}
        cy={scaleY(last)} r={3}
        fill={rising ? '#22c55e' : '#ef4444'}/>
    </svg>
  );
};

// Gráfico de línea completo para la vista detalle
const DisponibilidadChart = ({ dias, metaDMR }) => {
  const [hover, setHover] = useState(null);
  const activeDias = dias.filter(d => (d.opH + d.paradaH) > 0);
  const w = 700, h = 160, padL = 44, padR = 16, padT = 12, padB = 32;
  const minV = 40, maxV = 100;
  const xOf = i => padL + (w - padL - padR) * (i / (activeDias.length - 1));
  const yOf = v => padT + (h - padT - padB) * (1 - (v - minV) / (maxV - minV));
  const metaY = yOf(metaDMR);
  const pts = activeDias.map((d, i) => `${xOf(i)},${yOf(d.dmrPct || 0)}`).join(' ');
  const areaD = `M${xOf(0)},${yOf(activeDias[0]?.dmrPct || 0)} ` +
    activeDias.map((d, i) => `L${xOf(i)},${yOf(d.dmrPct || 0)}`).join(' ') +
    ` L${xOf(activeDias.length - 1)},${h - padB} L${xOf(0)},${h - padB} Z`;

  return (
    <div style={{ position:'relative', width:'100%', overflowX:'auto' }}>
      <svg width={w} height={h} style={{ display:'block' }}>
        <defs>
          <linearGradient id="dmrAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {/* Gridlines */}
        {[40, 60, 80, 100].map(v => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={yOf(v)} y2={yOf(v)} stroke="#f1f5f9" strokeWidth={1}/>
            <text x={padL - 5} y={yOf(v) + 4} fontSize={9} fill="#94a3b8" textAnchor="end">{v}%</text>
          </g>
        ))}
        {/* Meta DMR line */}
        <line x1={padL} x2={w - padR} y1={metaY} y2={metaY} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.5}/>
        <text x={w - padR - 2} y={metaY - 5} fontSize={9} fill="#ef4444" textAnchor="end" fontWeight="700">
          Meta {metaDMR}%
        </text>
        {/* Area fill */}
        <path d={areaD} fill="url(#dmrAreaGrad)"/>
        {/* Line */}
        <polyline points={pts} fill="none" stroke="#0ea5e9" strokeWidth={2.2}
          strokeLinejoin="round" strokeLinecap="round"/>
        {/* X axis day labels every 5 */}
        {activeDias.map((d, i) => {
          if (i % 5 !== 0 && i !== activeDias.length - 1) return null;
          return (
            <text key={d.dia} x={xOf(i)} y={h - padB + 14} fontSize={9} fill="#94a3b8" textAnchor="middle">
              {d.dia}
            </text>
          );
        })}
        {/* Interaction dots */}
        {activeDias.map((d, i) => (
          <g key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor:'pointer' }}>
            <rect x={xOf(i) - (w / activeDias.length / 2)} y={padT}
              width={w / activeDias.length} height={h - padT - padB} fill="transparent"/>
            <circle cx={xOf(i)} cy={yOf(d.dmrPct || 0)}
              r={hover === i ? 5 : 3}
              fill={(d.dmrPct || 0) < metaDMR ? '#ef4444' : '#0ea5e9'}
              style={{ transition:'r .1s' }}/>
          </g>
        ))}
      </svg>
      {hover !== null && activeDias[hover] && (
        <div style={{
          position:'absolute',
          left: xOf(hover),
          top: yOf(activeDias[hover].dmrPct || 0) - 46,
          background:'#1e293b', color:'white',
          padding:'6px 10px', borderRadius:6,
          fontSize:11.5, fontWeight:700,
          pointerEvents:'none', transform:'translateX(-50%)',
          boxShadow:'0 4px 16px rgba(0,0,0,0.35)',
          whiteSpace:'nowrap',
        }}>
          Día {activeDias[hover].dia} Abr: {activeDias[hover].dmrPct}%
          {activeDias[hover].tipo && (
            <span style={{
              marginLeft:8, fontSize:10.5,
              color: activeDias[hover].tipo === 'NP' ? '#fca5a5' : '#fcd34d',
            }}>
              ({activeDias[hover].tipo === 'NP' ? 'No Prog.' : 'Prog.'})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Modal de confirmación y cálculo de liquidación
const ModalLiquidacion = ({ equipo, onClose }) => {
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState(false);
  const hFact    = Math.max(equipo.horasReales, equipo.horasContrato);
  const subtotal = hFact * equipo.tarifa;
  const penalidad = equipo.dmr < equipo.metaDMR
    ? ((equipo.metaDMR - equipo.dmr) / 100) * equipo.horasContrato * equipo.tarifa * 0.5
    : 0;
  const total = subtotal - penalidad;

  const handleConfirmar = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setDone(true); }, 1200);
  };

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,0.72)',
      zIndex:1100, display:'grid', placeItems:'center', padding:20,
    }}
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div className="card" style={{ width:'100%', maxWidth:520, animation:'fadeInUp 0.2s ease-out' }}>
        <div className="card-header" style={{ background:'var(--navy)', color:'white', borderRadius:'8px 8px 0 0' }}>
          <div>
            <h3 style={{ margin:0 }}>Cerrar Liquidación</h3>
            <div style={{ fontSize:12, opacity:.7, marginTop:2 }}>
              {equipo.equipo} · {equipo.cliente} · Abril 2026
            </div>
          </div>
          <div className="spacer"/>
          <button className="icon-btn" onClick={onClose} style={{ color:'white' }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        {done ? (
          <div className="card-body" style={{ textAlign:'center', padding:'40px 24px' }}>
            <div style={{ fontSize:44, marginBottom:12 }}>✓</div>
            <h3 style={{ color:'#15803d', margin:'0 0 8px' }}>Liquidación Confirmada</h3>
            <div style={{ fontSize:13, color:'var(--text-muted)' }}>
              {equipo.equipo} pasado a estado "Facturado". El área financiera recibirá la notificación.
            </div>
            <button className="btn btn-primary" style={{ marginTop:20 }} onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Resumen período */}
              <div style={{ background:'#F8FAFC', borderRadius:8, padding:'14px 16px', border:'1px solid var(--card-border)' }}>
                <div style={{ fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:.8, color:'var(--text-muted)', marginBottom:10 }}>
                  Resumen del Período
                </div>
                {[
                  ['Horas Mínimas (Contrato)',      `${equipo.horasContrato} h`],
                  ['Horas Reales (Partes Diarios)', `${equipo.horasReales} h`],
                  ['Horas de Parada (Taller)',       `${equipo.horasParada} h`],
                  ['Horas a Facturar (max real/mín)',`${hFact} h`],
                  ['Tarifa por Hora',                `$${equipo.tarifa.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display:'flex', justifyContent:'space-between', padding:'4px 0',
                    fontSize:12.5, borderBottom:'1px solid #F0F2F5',
                  }}>
                    <span style={{ color:'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontWeight:700, fontFamily:'ui-monospace,monospace' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Cálculo */}
              <div style={{
                background: penalidad > 0 ? '#FFF5F5' : '#F0FDF4',
                borderRadius:8, padding:'14px 16px',
                border:`1px solid ${penalidad > 0 ? '#fca5a5' : '#86efac'}`,
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:8 }}>
                  <span>Subtotal ({hFact}h × ${equipo.tarifa.toFixed(2)})</span>
                  <span style={{ fontWeight:700, fontFamily:'ui-monospace,monospace' }}>
                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits:2 })}
                  </span>
                </div>
                {penalidad > 0 && (
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#dc2626', marginBottom:8 }}>
                    <span>⚠ Penalidad DMR ({equipo.dmr.toFixed(1)}% vs meta {equipo.metaDMR}%)</span>
                    <span style={{ fontWeight:700, fontFamily:'ui-monospace,monospace' }}>
                      −${penalidad.toLocaleString('en-US', { minimumFractionDigits:2 })}
                    </span>
                  </div>
                )}
                <div style={{
                  display:'flex', justifyContent:'space-between',
                  fontSize:16, fontWeight:800,
                  paddingTop:10, borderTop:`2px solid ${penalidad > 0 ? '#fca5a5' : '#86efac'}`,
                }}>
                  <span>TOTAL A FACTURAR (USD)</span>
                  <span style={{
                    fontFamily:'ui-monospace,monospace',
                    color: penalidad > 0 ? '#dc2626' : '#15803d',
                  }}>
                    ${total.toLocaleString('en-US', { minimumFractionDigits:2 })}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, padding:'4px 16px 16px' }}>
              <button className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}
                onClick={onClose} disabled={saving}>
                Cancelar
              </button>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}
                onClick={handleConfirmar} disabled={saving}>
                {saving
                  ? <><span className="spinner" style={{ width:13, height:13, borderWidth:2, marginRight:6 }}/> Procesando...</>
                  : <><Icon name="check" size={13}/> Confirmar y Facturar</>
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Vista detalle de disponibilidad por equipo
const LiquidacionDetalleEquipo = ({ equipo, onBack, onNav, setCurrentOT }) => {
  const totalOp  = equipo.dias.reduce((s, d) => s + d.opH, 0);
  const totalPar = equipo.dias.reduce((s, d) => s + d.paradaH, 0);
  const dmrCalc  = ((totalOp / (totalOp + totalPar)) * 100).toFixed(1);
  const npCount  = equipo.dias.filter(d => d.tipo === 'NP').length;
  const pCount   = equipo.dias.filter(d => d.tipo === 'P').length;

  const handleOTClick = (otRef) => {
    if (onNav && setCurrentOT) {
      setCurrentOT(otRef);
      onNav('ot-detalle');
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ flexWrap:'wrap', gap:10 }}>
        <button className="btn btn-ghost" onClick={onBack}>
          <Icon name="back" size={14}/> Volver a Liquidación General
        </button>
        <div>
          <h1>
            <span style={{ fontFamily:'ui-monospace,monospace', color:'var(--cyan)' }}>{equipo.equipo}</span>
            {' '}— Reporte de Disponibilidad
          </h1>
          <div className="sub">Abril 2026 · {equipo.cliente} · {equipo.proyecto}</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-secondary btn-sm">
          <Icon name="download" size={13}/> Exportar PDF Reporte
        </button>
      </div>

      {/* Filtros pre-seleccionados */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16,
        background:'#F8FAFC', borderRadius:10, padding:'14px 18px',
        border:'1px solid var(--card-border)',
      }}>
        {[
          { label:'Proyecto / U.M.', val:equipo.proyecto },
          { label:'Modelo',           val:equipo.modelo  },
          { label:'Nº de Serie',      val:equipo.serie   },
          { label:'Contrato',         val:equipo.contrato },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.6, color:'var(--text-muted)', marginBottom:2 }}>
              {item.label}
            </div>
            <div style={{ fontWeight:700, fontSize:12.5, color:'var(--navy)', fontFamily:'ui-monospace,monospace' }}>
              {item.val}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de tendencia */}
      <div className="card" style={{ marginBottom:16 }}>
        <div className="card-header">
          <h3>Tendencia de Disponibilidad Diaria — Abril 2026</h3>
          <div style={{ display:'flex', gap:16, marginLeft:'auto', fontSize:11.5, alignItems:'center' }}>
            <span style={{ color:'var(--text-muted)' }}>
              DMR promedio: <strong style={{ color:'var(--navy)' }}>{dmrCalc}%</strong>
            </span>
            <span style={{ color:'#ef4444', fontWeight:700 }}>
              {npCount} parada(s) NP
            </span>
            <span style={{ color:'#d97706', fontWeight:700 }}>
              {pCount} parada(s) programada(s)
            </span>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop:8 }}>
          <DisponibilidadChart dias={equipo.dias} metaDMR={equipo.metaDMR}/>
          <div style={{ display:'flex', gap:20, marginTop:10, paddingTop:10, borderTop:'1px solid var(--card-border)', fontSize:11.5 }}>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ display:'inline-block', width:24, height:2, background:'#0ea5e9', borderRadius:1 }}/>
              <span style={{ color:'var(--text-muted)' }}>Disponibilidad diaria</span>
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ display:'inline-block', width:20, borderTop:'1.5px dashed #ef4444' }}/>
              <span style={{ color:'var(--text-muted)' }}>Meta DMR {equipo.metaDMR}%</span>
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'#ef4444' }}/>
              <span style={{ color:'var(--text-muted)' }}>Día bajo meta (penaliza)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabla detalle diario */}
      <div className="card">
        <div className="card-header">
          <h3>Detalle Diario de Operación</h3>
          <div style={{ marginLeft:'auto', display:'flex', gap:12, fontSize:11.5, alignItems:'center' }}>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ display:'inline-block', width:12, height:12, borderRadius:3, background:'#fee2e2', border:'1px solid #fca5a5' }}/>
              No Programada (afecta penalidad)
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ display:'inline-block', width:12, height:12, borderRadius:3, background:'#fef3c7', border:'1px solid #fcd34d' }}/>
              Programada (menor impacto)
            </span>
          </div>
        </div>
        <table className="tbl" style={{ fontSize:12.5 }}>
          <thead>
            <tr>
              <th style={{ width:52 }}>Día</th>
              <th style={{ width:100 }}>Fecha</th>
              <th className="num" style={{ width:130 }}>Hrs Operativas</th>
              <th className="num" style={{ width:120 }}>Hrs Parada</th>
              <th style={{ width:140 }}>Tipo Parada</th>
              <th style={{ width:130 }}>OT Vinculada</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {equipo.dias.map((d) => {
              const isNP  = d.tipo === 'NP';
              const isP   = d.tipo === 'P';
              const rowBg = isNP ? 'rgba(254,226,226,0.55)' : isP ? 'rgba(254,243,199,0.55)' : '';
              return (
                <tr key={d.dia} style={{ background:rowBg }}>
                  <td style={{ fontFamily:'ui-monospace,monospace', fontWeight:700, fontSize:12 }}>{d.dia}</td>
                  <td style={{ fontSize:11.5, color:'var(--text-muted)' }}>
                    {String(d.dia).padStart(2, '0')} Abr 2026
                  </td>
                  <td className="num mono" style={{
                    fontWeight: d.opH > 0 ? 700 : 400,
                    color: d.opH === 0 ? 'var(--text-muted)' : '#15803d',
                  }}>
                    {d.opH > 0 ? `${d.opH.toFixed(1)} h` : '—'}
                  </td>
                  <td className="num mono" style={{
                    fontWeight: d.paradaH > 0 ? 700 : 400,
                    color: d.paradaH === 0 ? 'var(--text-muted)' : isNP ? '#dc2626' : '#d97706',
                  }}>
                    {d.paradaH > 0 ? `${d.paradaH.toFixed(1)} h` : '—'}
                  </td>
                  <td>
                    {d.tipo === 'NP' && <span className="badge red"   style={{ fontSize:10.5 }}>No Programada</span>}
                    {d.tipo === 'P'  && <span className="badge orange" style={{ fontSize:10.5 }}>Programada</span>}
                    {!d.tipo         && <span style={{ color:'var(--text-muted)', fontSize:11 }}>—</span>}
                  </td>
                  <td>
                    {d.ot ? (
                      <button
                        className="btn btn-ghost btn-sm"
                        title={`Abrir ${d.ot} en OTs`}
                        style={{
                          fontFamily:'ui-monospace,monospace', fontWeight:700,
                          color:'var(--cyan)', textDecoration:'underline',
                          textUnderlineOffset:2, fontSize:11.5, padding:'1px 4px',
                        }}
                        onClick={() => handleOTClick(d.ot)}
                      >
                        {d.ot}
                      </button>
                    ) : (
                      <span style={{ color:'var(--text-muted)', fontSize:11 }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize:12, color: d.obs ? 'var(--text)' : 'var(--text-muted)' }}>
                    {d.obs || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background:'var(--navy)', color:'white', fontWeight:700 }}>
              <td colSpan={2} style={{ padding:'10px 16px', color:'white', fontWeight:800, fontSize:13 }}>
                TOTALES DEL PERÍODO
              </td>
              <td className="num" style={{ color:'#4ade80', fontFamily:'ui-monospace,monospace', padding:'10px 16px', fontSize:13 }}>
                {totalOp.toFixed(1)} h
              </td>
              <td className="num" style={{
                color: totalPar > 20 ? '#fca5a5' : '#fcd34d',
                fontFamily:'ui-monospace,monospace', padding:'10px 16px', fontSize:13,
              }}>
                {totalPar.toFixed(1)} h
              </td>
              <td colSpan={3} style={{ padding:'10px 16px', color:'rgba(255,255,255,0.8)', fontSize:12 }}>
                DMR Calculado:{' '}
                <strong style={{ color:'white', fontSize:14, fontFamily:'ui-monospace,monospace' }}>
                  {dmrCalc}%
                </strong>
                {' '}· Meta: {equipo.metaDMR}%
                {parseFloat(dmrCalc) < equipo.metaDMR && (
                  <span style={{
                    marginLeft:12, padding:'2px 10px', borderRadius:12,
                    background:'#dc2626', fontSize:11, fontWeight:800,
                  }}>
                    ⚠ PENALIDAD APLICABLE
                  </span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <FooterBrand/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. LIQUIDACIÓN Y REPORTE DMR — Página principal
// ═══════════════════════════════════════════════════════════════════════════
export const LiquidacionRentalPage = ({ onNav, setCurrentOT }) => {
  const [detalleEquipo, setDetalleEquipo] = useState(null);
  const [modalLiq,      setModalLiq]      = useState(null);

  // KPI cómputos
  const dmrPromedio   = (LIQUIDACION_MOCK.reduce((s, r) => s + r.dmr, 0) / LIQUIDACION_MOCK.length).toFixed(1);
  const totalHorasOp  = LIQUIDACION_MOCK.reduce((s, r) => s + r.horasReales, 0);
  const criticos      = LIQUIDACION_MOCK.filter(r => r.dmr < 85).length;
  const penalidades   = LIQUIDACION_MOCK
    .filter(r => r.dmr < r.metaDMR)
    .reduce((s, r) => s + ((r.metaDMR - r.dmr) / 100) * r.horasContrato * r.tarifa * 0.5, 0);

  const dmrBadgeColor = (dmr) => dmr > 90 ? '#15803d' : dmr >= 85 ? '#b45309' : '#dc2626';
  const dmrBadgeBg    = (dmr) => dmr > 90 ? '#dcfce7' : dmr >= 85 ? '#fef3c7' : '#fee2e2';

  // Sub-vista: detalle
  if (detalleEquipo) {
    return (
      <LiquidacionDetalleEquipo
        equipo={detalleEquipo}
        onBack={() => setDetalleEquipo(null)}
        onNav={onNav}
        setCurrentOT={setCurrentOT}
      />
    );
  }

  const kpis = [
    {
      label:'DMR Promedio de Flota', icon:'📊',
      val:`${dmrPromedio}%`,
      sub:'Disponibilidad global · Abril 2026',
      valColor: parseFloat(dmrPromedio) > 90 ? '#4ade80' : parseFloat(dmrPromedio) >= 85 ? '#fbbf24' : '#f87171',
    },
    {
      label:'Total Horas Operativas', icon:'⏱',
      val:`${totalHorasOp.toLocaleString()} h`,
      sub:'Suma de horas reales de la flota',
      valColor:'#93c5fd',
    },
    {
      label:'Equipos Críticos', icon:'⚠',
      val:`${criticos}`,
      sub:'Equipos con DMR < 85%',
      valColor: criticos > 0 ? '#f87171' : '#4ade80',
    },
    {
      label:'Penalidades Estimadas', icon:'💰',
      val:`$${penalidades.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })}`,
      sub:'Según cláusulas contractuales',
      valColor: penalidades > 0 ? '#f87171' : '#4ade80',
    },
  ];

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1>Liquidación y Reporte DMR</h1>
          <div className="sub">Centro de control de cierre de mes · Abril 2026</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-secondary"><Icon name="download" size={13}/> Exportar Excel</button>
        <button className="btn btn-cyan" style={{ color:'#0f172a', fontWeight:800 }}>
          <Icon name="pdf" size={13}/> Generar Reporte Mensual
        </button>
      </div>

      {/* ── KPI Cards (dark panel) ── */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14,
        marginBottom:20,
        background:'linear-gradient(135deg, #0f172a 0%, #1e2d45 100%)',
        borderRadius:12, padding:'20px',
        boxShadow:'0 8px 32px rgba(15,23,42,0.28)',
      }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.09)',
            borderRadius:10, padding:'16px 18px',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ fontSize:17 }}>{kpi.icon}</span>
              <span style={{
                fontSize:10.5, fontWeight:700, textTransform:'uppercase',
                letterSpacing:.7, color:'rgba(255,255,255,0.50)',
              }}>
                {kpi.label}
              </span>
            </div>
            <div style={{
              fontSize:26, fontWeight:900, letterSpacing:-.5,
              color:kpi.valColor, fontFamily:'ui-monospace,monospace',
              lineHeight:1.1, marginBottom:6,
            }}>
              {kpi.val}
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.40)' }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabla Pro ── */}
      <div className="card">
        <div className="card-header">
          <h3>Detalle de Liquidación — Flota Activa</h3>
          <div style={{ marginLeft:'auto', display:'flex', gap:12, fontSize:11.5, color:'var(--text-muted)', alignItems:'center' }}>
            {[
              { bg:'#dcfce7', border:'#86efac', label:'>90% Cumple'  },
              { bg:'#fef3c7', border:'#fcd34d', label:'85–90% Alerta' },
              { bg:'#fee2e2', border:'#fca5a5', label:'<85% Crítico'  },
            ].map(l => (
              <span key={l.label} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ display:'inline-block', width:11, height:11, borderRadius:3, background:l.bg, border:`1px solid ${l.border}` }}/>
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width:120 }}>Equipo</th>
              <th>Cliente / Contrato</th>
              <th className="num" style={{ width:120 }}>Hrs Real / Mín.</th>
              <th className="num" style={{ width:105 }}>Hrs Parada</th>
              <th className="num" style={{ width:148 }}>% DMR</th>
              <th style={{ width:92 }}>Tendencia</th>
              <th style={{ width:120 }}>Estado</th>
              <th style={{ width:90 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {LIQUIDACION_MOCK.map((r) => (
              <tr key={r.equipo}
                className="clickable"
                style={{ cursor:'pointer' }}
                onClick={() => setDetalleEquipo(r)}
              >
                {/* Equipo */}
                <td onClick={e => e.stopPropagation()}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{
                      fontFamily:'ui-monospace,monospace', fontWeight:800,
                      fontSize:13, color:'var(--cyan)',
                      textDecoration:'underline', textUnderlineOffset:2,
                      padding:'1px 0', display:'block',
                    }}
                    onClick={() => setDetalleEquipo(r)}
                  >
                    {r.equipo}
                  </button>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{r.modelo}</div>
                </td>

                {/* Cliente */}
                <td>
                  <div style={{ fontWeight:600, fontSize:13 }}>{r.cliente}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'ui-monospace,monospace' }}>{r.contrato}</div>
                </td>

                {/* Hrs */}
                <td className="num mono">
                  <div style={{
                    fontWeight:700,
                    color: r.horasReales < r.horasContrato ? '#d97706' : '#15803d',
                  }}>
                    {r.horasReales} h
                  </div>
                  <div style={{ fontSize:10.5, color:'var(--text-muted)', marginTop:1 }}>mín. {r.horasContrato} h</div>
                </td>

                {/* Parada */}
                <td className="num mono" style={{
                  fontWeight:700,
                  color: r.horasParada > 20 ? '#dc2626' : 'var(--text)',
                }}>
                  {r.horasParada} h
                </td>

                {/* DMR badge */}
                <td className="num" onClick={e => e.stopPropagation()}>
                  <div style={{
                    display:'inline-flex', alignItems:'center', gap:5, justifyContent:'center',
                    padding:'4px 12px', borderRadius:20, fontWeight:800,
                    fontSize:13, fontFamily:'ui-monospace,monospace', minWidth:76,
                    background: dmrBadgeBg(r.dmr),
                    color:      dmrBadgeColor(r.dmr),
                  }}>
                    {r.dmr < r.metaDMR && <Icon name="alert" size={11}/>}
                    {r.dmr.toFixed(1)}%
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:3, textAlign:'center' }}>
                    meta {r.metaDMR}%
                  </div>
                </td>

                {/* Sparkline */}
                <td onClick={e => e.stopPropagation()}>
                  <SparklineMini dias={r.dias}/>
                </td>

                {/* Estado */}
                <td>
                  {r.estado === 'Pre-facturado'
                    ? <span className="badge cyan"><span className="dot"/>Pre-facturado</span>
                    : <span className="badge orange"><span className="dot"/>En Revisión</span>
                  }
                </td>

                {/* Acciones */}
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display:'flex', gap:2 }}>
                    <button className="icon-btn" title="Ver Detalle de Disponibilidad"
                      style={{ padding:5 }}
                      onClick={() => setDetalleEquipo(r)}>
                      <Icon name="report" size={14}/>
                    </button>
                    <button className="icon-btn" title="Generar Liquidación"
                      style={{ padding:5, color:'var(--cyan)' }}
                      onClick={() => setModalLiq(r)}>
                      <Icon name="briefcase" size={14}/>
                    </button>
                    <button className="icon-btn" title="Exportar PDF individual"
                      style={{ padding:5 }}>
                      <Icon name="download" size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal de Liquidación ── */}
      {modalLiq && <ModalLiquidacion equipo={modalLiq} onClose={() => setModalLiq(null)}/>}

      <FooterBrand/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Dashboard Rental — Panel ejecutivo de la línea Flota y Alquileres
// ═══════════════════════════════════════════════════════════════════════════════
const _RENTAL_STATS = (() => {
  const enCampo     = LIQUIDACION_MOCK.length;
  const dmrProm     = (LIQUIDACION_MOCK.reduce((s, e) => s + e.dmr, 0) / enCampo).toFixed(1);
  const facturMes   = LIQUIDACION_MOCK.reduce((s, e) => s + Math.max(e.horasReales, e.horasContrato) * e.tarifa, 0);
  const liqPendiente= LIQUIDACION_MOCK.filter(e => e.estado === 'En Revisión').length;
  const criticos    = LIQUIDACION_MOCK.filter(e => e.dmr < e.metaDMR).length;
  return { enCampo, dmrProm, facturMes, liqPendiente, criticos };
})();

const _DMR_COLOR = (dmr, meta) => {
  if (dmr >= 90)          return { bg: '#E8F5E9', color: '#1B5E20', dot: '#4CAF50' };
  if (dmr >= meta)        return { bg: '#FFF3E0', color: '#C15D00', dot: '#FF9800' };
  return                         { bg: '#FFEBEE', color: '#B71C1C', dot: '#E53935' };
};

export const DashboardRentalPage = ({ onNav }) => {
  const s = _RENTAL_STATS;

  const KpiCard = ({ label, value, sub, accent }) => (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a, #1e2d45)',
      borderRadius: 10, padding: '18px 20px',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent || '#f1f5f9', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{sub}</div>}
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard Rental</h1>
          <div className="sub">Línea de negocio — Flota y Alquileres</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan" onClick={() => onNav('flota')}>Ver Panel de Flota</button>
        <button className="btn btn-secondary" onClick={() => onNav('liquidacion')}>Liquidaciones</button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <KpiCard label="Equipos en Campo"         value={s.enCampo}           sub="contratos activos"                    accent="#38bdf8"/>
        <KpiCard label="DMR Promedio Flota"        value={`${s.dmrProm}%`}     sub="últimos 30 días"                      accent={Number(s.dmrProm) >= 88 ? '#4ade80' : '#fbbf24'}/>
        <KpiCard label="Facturación Est. del Mes"  value={`$${s.facturMes.toLocaleString('en-US',{maximumFractionDigits:0})}`} sub="USD — por horas facturables" accent="#f1f5f9"/>
        <KpiCard label="Liq. Pendientes Aprobación" value={s.liqPendiente}     sub={s.criticos > 0 ? `${s.criticos} equipos bajo meta DMR` : 'Sin alertas críticas'} accent={s.liqPendiente > 0 ? '#fbbf24' : '#4ade80'}/>
      </div>

      {/* Contratos activos */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>Contratos Activos</h3>
          <span className="hint">{LIQUIDACION_MOCK.length} equipos en campo</span>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav('contratos-rental')}>Ver todos los contratos</button>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Equipo</th><th>Cliente</th><th>Proyecto</th>
              <th>DMR Real</th><th>Meta DMR</th><th>Hrs. Reales</th>
              <th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {LIQUIDACION_MOCK.map(e => {
              const c = _DMR_COLOR(e.dmr, e.metaDMR);
              return (
                <tr key={e.equipo} className="clickable" onClick={() => onNav('liquidacion')}>
                  <td><span className="ot-code">{e.equipo}</span><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.modelo}</div></td>
                  <td>{e.cliente}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.proyecto}</td>
                  <td>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:6, background: c.bg, color: c.color, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                      <span style={{ width:7, height:7, borderRadius:'50%', background: c.dot }}/>
                      {e.dmr}%
                    </span>
                  </td>
                  <td style={{ color:'var(--text-muted)', fontSize:12 }}>{e.metaDMR}%</td>
                  <td className="num">{e.horasReales} h</td>
                  <td><span className={"badge " + (e.estado === 'Pre-facturado' ? 'green' : 'orange')}>{e.estado}</span></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={ev => { ev.stopPropagation(); onNav('liquidacion'); }}>Detalle</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Alertas rápidas */}
      {s.criticos > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--red)' }}>
          <div className="card-body">
            <div style={{ display:'flex', alignItems:'center', gap:10, color:'var(--red)', fontWeight:700, marginBottom:8 }}>
              <Icon name="alert" size={16}/>
              {s.criticos} equipo(s) con DMR por debajo de la meta contractual
            </div>
            {LIQUIDACION_MOCK.filter(e => e.dmr < e.metaDMR).map(e => (
              <div key={e.equipo} style={{ fontSize:13, color:'var(--text-muted)', marginBottom:4 }}>
                · <strong style={{ color:'var(--text)' }}>{e.equipo}</strong> — DMR {e.dmr}% vs meta {e.metaDMR}% ({e.cliente})
              </div>
            ))}
          </div>
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};
