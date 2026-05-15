import React, { useState as useS2 } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';
import { ZAHORY_SAC_DATA } from '../data.js';

// ─── OTs Centro de Control Operativo ─────────────────────────────────────────

// ── Columna 3: Clasificación (tipo_trabajo) — badge outline con color semántico
const TRABAJO_CFG = {
  Preventivo_PM:     { label: 'Preventivo PM',    cls: 'badge-tipo badge-tipo-pm'       },
  Correctivo:        { label: 'Correctivo',        cls: 'badge-tipo badge-tipo-corr'     },
  Acondicionamiento: { label: 'Acondicionamiento', cls: 'badge-tipo badge-tipo-acond'    },
  Overhaul:          { label: 'Overhaul',          cls: 'badge-tipo badge-tipo-overhaul' },
};

// ── Columna 3: Clasificación (tipo_cargo) — badge filled, rework destructivo
const CARGO_CFG = {
  Cliente_Contrato: { label: 'Cliente / Contrato', cls: 'badge cyan'    },
  Interno_Zahory:    { label: 'Interno Zahory',     cls: 'badge slate'   },
  Garantia_Fabrica: { label: 'Garantía Fábrica',   cls: 'badge orange'  },
  Reclamo_Rework:   { label: '⚠ Reclamo / Rework', cls: 'badge-destructive' },
};

// ── Columna 4: Estado técnico — dot 8px + label
const ESTADO_CFG = {
  'Planificada':      { dotColor: '#94A3B8', bg: '#F1F5F9', textColor: '#475569', label: 'Planificada'       },
  'En Ejecución':     { dotColor: '#4CAF50', bg: '#E8F5E9', textColor: '#1B5E20', label: 'En Ejecución'      },
  'Espera Repuestos': { dotColor: '#FF9800', bg: '#FFF3E0', textColor: '#C15D00', label: 'Espera Repuestos'  },
  'Finalizada':       { dotColor: '#00BCD4', bg: '#E0F7FA', textColor: '#006978', label: 'Finalizada'        },
};

// Enriquece cada OT con campos derivados no presentes en el mock
const NOW = new Date('2026-04-20');
const ESTADO_TEC_SEQ = ['En Ejecución','En Ejecución','Planificada','Espera Repuestos','Finalizada','Finalizada','En Ejecución','Espera Repuestos','Planificada'];
const UBICACION_MAP = {
  Buenaventura: 'Mina — Buenaventura',
  Antapaccay:   'Mina — Antapaccay',
  'Pepas de Oro': 'Mina — Pepas de Oro',
  '—':          'Taller — Lurín',
};
const enrichOT = (r, i) => ({
  ...r,
  estadoTecnico: r.tipoCargo === 'Reclamo_Rework' ? 'En Ejecución' : ESTADO_TEC_SEQ[i % ESTADO_TEC_SEQ.length],
  ubicacion: r.tipoCargo === 'Interno_Zahory' ? 'Taller — Lurín' : (UBICACION_MAP[r.proy] || 'Taller — Carapongo'),
  dias: Math.max(0, Math.round((NOW - new Date(r.fechaProgramadaInicio)) / 86400000)),
});

const QUICK_TABS = [
  { id: 'activas',   label: 'Todas las activas' },
  { id: 'taller',    label: 'En Taller' },
  { id: 'mina',      label: 'En Mina' },
  { id: 'repuestos', label: 'Espera Repuestos' },
  { id: 'rework',    label: 'Retrabajos', alert: true },
];

const applyQuickFilter = (rows, tab) => {
  if (tab === 'taller')    return rows.filter(r => r.ubicacion.startsWith('Taller'));
  if (tab === 'mina')      return rows.filter(r => r.ubicacion.startsWith('Mina'));
  if (tab === 'repuestos') return rows.filter(r => r.estadoTecnico === 'Espera Repuestos');
  if (tab === 'rework')    return rows.filter(r => r.tipoCargo === 'Reclamo_Rework');
  return rows;
};

const SlaChip = ({ dias }) => {
  const color = dias <= 3 ? '#4CAF50' : dias <= 7 ? '#FF9800' : '#E53935';
  const bg    = dias <= 3 ? '#E8F5E9' : dias <= 7 ? '#FFF3E0' : '#FFEBEE';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 7px', borderRadius:12,
      background: bg, color, fontSize:11, fontWeight:700, fontFamily:'ui-monospace,monospace' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background: color, flexShrink:0 }}/>
      {dias}d
    </span>
  );
};

const ActionMenu = ({ ot, onNav, setCurrentOT, open, onOpen, onClose }) => (
  <div style={{ position:'relative' }}>
    <button
      className="btn btn-ghost btn-sm"
      style={{ padding:'4px 8px', fontSize:16, lineHeight:1 }}
      onClick={e => { e.stopPropagation(); open ? onClose() : onOpen(); }}
    >⋯</button>
    {open && (
      <div style={{
        position:'absolute', right:0, top:'calc(100% + 4px)', zIndex:100,
        background:'white', border:'1px solid var(--card-border)',
        borderRadius:8, boxShadow:'0 8px 24px rgba(17,24,39,0.12)',
        width:200, padding:'4px 0', fontSize:13,
      }} onClick={e => e.stopPropagation()}>
        {[
          { icon:'report', label:'Ver detalles', action: () => { setCurrentOT(ot.codigo); onNav('ot-detalle'); onClose(); } },
          { icon:'pdf',    label:'Reporte técnico (PDF)', action: onClose },
          { icon:'edit',   label:'Registrar horas / partes', action: onClose },
          { icon:'orders', label:'Ver historial técnico', action: onClose },
        ].map(({ icon, label, action }) => (
          <button key={label}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'8px 14px',
              background:'none', fontSize:13, color:'var(--text)', textAlign:'left' }}
            className="btn"
            onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.background='none'}
            onClick={action}>
            <Icon name={icon} size={13}/> {label}
          </button>
        ))}
      </div>
    )}
  </div>
);

export const OTsListadoPage = ({ onNav, setCurrentOT }) => {
  const D   = ZAHORY_SAC_DATA;
  const all = D.otsCostos.map(enrichOT);

  const [quickTab, setQuickTab]   = useS2('activas');
  const [search,   setSearch]     = useS2('');
  const [filterTec, setFilterTec] = useS2('Todos');
  const [openMenu, setOpenMenu]   = useS2(null);

  const filtered = applyQuickFilter(all, quickTab)
    .filter(r => !search || r.codigo.toLowerCase().includes(search.toLowerCase()) || r.eq.toLowerCase().includes(search.toLowerCase()))
    .filter(r => filterTec === 'Todos' || r.tec === filterTec);

  // KPIs para la barra de salud
  const kpis = {
    ejecucion: all.filter(r => r.estadoTecnico === 'En Ejecución').length,
    espera:    all.filter(r => r.estadoTecnico === 'Espera Repuestos').length,
    planif:    all.filter(r => r.estadoTecnico === 'Planificada').length,
    fin:       all.filter(r => r.estadoTecnico === 'Finalizada').length,
    rework:    all.filter(r => r.tipoCargo === 'Reclamo_Rework').length,
  };
  const total = all.length;
  const tecnicos = [...new Set(all.map(r => r.tec))];

  return (
    <div className="page" onClick={() => setOpenMenu(null)}>

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1>Tablero de OTs</h1>
          <div className="sub">Centro de control operativo · {total} órdenes activas · Abril 2026</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-secondary"><Icon name="download" size={13}/> Exportar</button>
        <button className="btn btn-cyan" onClick={() => onNav('crear-ot')}><Icon name="plus" size={13}/> Nueva OT</button>
      </div>

      {/* ── Barra de Salud Operativa ── */}
      <div className="card" style={{ marginBottom:14, padding:'14px 18px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.8px', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:7 }}>
              Salud operativa — distribución de estados
            </div>
            <div style={{ display:'flex', height:8, borderRadius:8, overflow:'hidden', gap:2 }}>
              {[
                { n: kpis.ejecucion, color:'#4CAF50' },
                { n: kpis.espera,    color:'#FF9800'  },
                { n: kpis.planif,    color:'#94A3B8'  },
                { n: kpis.fin,       color:'#00BCD4'  },
              ].map(({ n, color }, i) => (
                <div key={i} style={{ flex: n || 0.05, background: color, borderRadius: 4, transition:'flex .3s' }}/>
              ))}
            </div>
          </div>
          {[
            { label:'En Ejecución',     val: kpis.ejecucion, color:'#4CAF50', bg:'#E8F5E9' },
            { label:'Espera Repuestos', val: kpis.espera,    color:'#C15D00', bg:'#FFF3E0' },
            { label:'Planificadas',     val: kpis.planif,    color:'var(--text-muted)', bg:'#F1F5F9' },
            { label:'Finalizadas',      val: kpis.fin,       color:'#006978', bg:'#E0F7FA' },
            { label:'Retrabajos',       val: kpis.rework,    color:'#B71C1C', bg:'#FFEBEE' },
          ].map(({ label, val, color, bg }) => (
            <div key={label} style={{ textAlign:'center', padding:'4px 12px', borderRadius:8, background: bg, minWidth:80 }}>
              <div style={{ fontSize:20, fontWeight:800, color, fontFamily:'ui-monospace,monospace', lineHeight:1.1 }}>{val}</div>
              <div style={{ fontSize:10, color, fontWeight:600, marginTop:2, letterSpacing:'.3px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Filter Tabs ── */}
      <div className="ot-quick-tabs" style={{ marginBottom:12 }}>
        {QUICK_TABS.map(t => (
          <button
            key={t.id}
            className={'ot-qtab' + (quickTab === t.id ? ' active' : '')}
            onClick={() => setQuickTab(t.id)}
          >
            {t.alert && <Icon name="alert" size={12} style={{ color:'#E53935' }}/>}
            {t.label}
            <span className="qtab-count">
              {applyQuickFilter(all, t.id).length}
            </span>
          </button>
        ))}
        <div style={{ flex:1 }}/>
        {/* Secondary filters */}
        <input
          className="input"
          placeholder="Buscar OT o equipo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:220 }}
        />
        <select className="select" value={filterTec} onChange={e => setFilterTec(e.target.value)} style={{ width:160 }}>
          <option value="Todos">Técnico: Todos</option>
          {tecnicos.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* ── Tabla Principal ── */}
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width:130 }}>OT / Fecha</th>
              <th>Activo / Cliente</th>
              <th style={{ width:150 }}>Tipo & Cargo</th>
              <th style={{ width:152 }}>Estado técnico</th>
              <th>Ubicación</th>
              <th style={{ width:72 }}>SLA</th>
              <th style={{ width:60 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const etCfg    = ESTADO_CFG[r.estadoTecnico]  || ESTADO_CFG['Planificada'];
              const tCfg     = TRABAJO_CFG[r.tipoTrabajo]   || { label: r.tipoTrabajo,  cls: 'badge-tipo' };
              const cargoCfg = CARGO_CFG[r.tipoCargo]       || { label: r.tipoCargo,    cls: 'badge slate' };
              return (
                <tr key={r.codigo} className="clickable"
                  onClick={() => { setCurrentOT(r.codigo); onNav('ot-detalle'); }}>

                  {/* Col 1 — OT / Fecha */}
                  <td>
                    <div className="ot-code" style={{ fontSize:12.5 }}>{r.codigo}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                      {r.fechaProgramadaInicio}
                    </div>
                  </td>

                  {/* Col 2 — Activo / Cliente */}
                  <td>
                    <div style={{ fontWeight:700, fontSize:13 }}>{r.eq}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{r.proy}</div>
                  </td>

                  {/* Col 3 — Tipo & Cargo */}
                  <td>
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      <span className={tCfg.cls}>{tCfg.label}</span>
                      <span className={cargoCfg.cls} style={{ fontSize:10 }}>
                        {r.tipoCargo !== 'Reclamo_Rework' && <span className="dot"/>}
                        {cargoCfg.label}
                      </span>
                    </div>
                  </td>

                  {/* Col 4 — Estado Técnico */}
                  <td>
                    <span style={{
                      display:'inline-flex', alignItems:'center', gap:6,
                      padding:'3px 9px', borderRadius:20,
                      background: etCfg.bg, color: etCfg.textColor,
                      fontSize:11.5, fontWeight:600,
                    }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background: etCfg.dotColor, flexShrink:0 }}/>
                      {etCfg.label}
                    </span>
                  </td>

                  {/* Col 5 — Ubicación */}
                  <td>
                    <div style={{ fontSize:12.5 }}>{r.ubicacion.split(' — ')[0]}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>
                      {r.ubicacion.split(' — ')[1] || ''}
                    </div>
                  </td>

                  {/* Col 6 — SLA */}
                  <td className="num" onClick={e => e.stopPropagation()}>
                    <SlaChip dias={r.dias}/>
                  </td>

                  {/* Col 7 — Acciones (3-dot dropdown) */}
                  <td onClick={e => e.stopPropagation()} style={{ overflow:'visible' }}>
                    <ActionMenu
                      ot={r}
                      onNav={onNav}
                      setCurrentOT={setCurrentOT}
                      open={openMenu === r.codigo}
                      onOpen={() => setOpenMenu(r.codigo)}
                      onClose={() => setOpenMenu(null)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:'40px 0', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>
            <Icon name="search" size={28}/>
            <div style={{ marginTop:10 }}>No hay OTs con los filtros seleccionados.</div>
          </div>
        )}
      </div>

      <FooterBrand/>
    </div>
  );
};
// ── Partes Diarios — datos mock ────────────────────────────────────────────
const PARTES_TALLER_MOCK = [
  { id: 'PT-2026-041', fecha: '2026-04-19', mecanico: 'Quispe R.',  ot: 'OT-2026-050', horas: 8.0, estado: 'Aprobado'  },
  { id: 'PT-2026-040', fecha: '2026-04-18', mecanico: 'Torres M.',  ot: 'OT-2026-048', horas: 7.5, estado: 'Aprobado'  },
  { id: 'PT-2026-039', fecha: '2026-04-17', mecanico: 'Quispe R.',  ot: 'OT-2026-044', horas: 6.0, estado: 'Aprobado'  },
  { id: 'PT-2026-038', fecha: '2026-04-16', mecanico: 'Pajuelo E.', ot: 'OT-2026-042', horas: 8.0, estado: 'Pendiente' },
  { id: 'PT-2026-037', fecha: '2026-04-15', mecanico: 'Torres M.',  ot: 'OT-2026-041', horas: 4.5, estado: 'Rechazado' },
  { id: 'PT-2026-036', fecha: '2026-04-14', mecanico: 'Condori L.', ot: 'OT-2026-039', horas: 8.0, estado: 'Aprobado'  },
  { id: 'PT-2026-035', fecha: '2026-04-13', mecanico: 'Quispe R.',  ot: 'OT-2026-038', horas: 7.0, estado: 'Aprobado'  },
  { id: 'PT-2026-034', fecha: '2026-04-12', mecanico: 'Pajuelo E.', ot: 'OT-2026-035', horas: 3.0, estado: 'Pendiente' },
];

const PARTES_MINA_MOCK = [
  { id: 'PM-2026-016', fecha: '2026-04-16', mecanico: 'Miranda B.', ot: 'OT-2026-047', horas: 2.9, estado: 'Aprobado'  },
  { id: 'PM-2026-015', fecha: '2026-04-15', mecanico: 'Pajuelo E.', ot: 'OT-2026-045', horas: 3.9, estado: 'Aprobado'  },
  { id: 'PM-2026-014', fecha: '2026-04-14', mecanico: 'Torres M.',  ot: 'OT-2026-043', horas: 2.5, estado: 'Rechazado' },
  { id: 'PM-2026-013', fecha: '2026-04-13', mecanico: 'Miranda B.', ot: 'OT-2026-041', horas: 4.1, estado: 'Aprobado'  },
  { id: 'PM-2026-012', fecha: '2026-04-12', mecanico: 'Pajuelo E.', ot: 'OT-2026-040', horas: 3.5, estado: 'Pendiente' },
  { id: 'PM-2026-011', fecha: '2026-04-11', mecanico: 'Torres M.',  ot: 'OT-2026-038', horas: 2.0, estado: 'Pendiente' },
];

// ── Shared UI — Partes Diarios ─────────────────────────────────────────────

const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const fmtFechaCorta = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${d} ${MESES_CORTOS[parseInt(m, 10) - 1]} ${y}`;
};

const EstadoBadgeParte = ({ estado }) => {
  if (estado === 'Aprobado')  return <span className="badge green"><span className="dot"/>Aprobado</span>;
  if (estado === 'Rechazado') return <span className="badge red"><span className="dot"/>Rechazado</span>;
  return <span className="badge orange"><span className="dot"/>Pendiente</span>;
};

const PARTES_TABS = [
  { id: 'todos',      label: 'Todos'      },
  { id: 'Pendiente',  label: 'Pendientes' },
  { id: 'Aprobado',   label: 'Aprobados'  },
  { id: 'Rechazado',  label: 'Rechazados' },
];

const PartesMenuAcciones = ({ onNav, editRoute, open, onOpen, onClose }) => (
  <div style={{ position:'relative' }}>
    <button
      className="btn btn-ghost btn-sm"
      style={{ padding:'4px 8px', fontSize:16, lineHeight:1 }}
      onClick={e => { e.stopPropagation(); open ? onClose() : onOpen(); }}
    >⋯</button>
    {open && (
      <div style={{
        position:'absolute', right:0, top:'calc(100% + 4px)', zIndex:100,
        background:'white', border:'1px solid var(--card-border)',
        borderRadius:8, boxShadow:'0 8px 24px rgba(17,24,39,0.12)',
        width:190, padding:'4px 0',
      }} onClick={e => e.stopPropagation()}>
        {[
          { icon:'report', label:'Ver detalle',  color:'var(--text)',  action: onClose },
          { icon:'edit',   label:'Editar parte', color:'var(--text)',  action: () => { onNav(editRoute); onClose(); } },
          { icon:'x',      label:'Eliminar',     color:'#E53935',     action: onClose },
        ].map(({ icon, label, color, action }) => (
          <button key={label}
            className="btn"
            style={{
              width:'100%', display:'flex', alignItems:'center', gap:9,
              padding:'8px 14px', background:'none', fontSize:13,
              color, textAlign:'left',
            }}
            onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.background='none'}
            onClick={action}
          >
            <Icon name={icon} size={13}/> {label}
          </button>
        ))}
      </div>
    )}
  </div>
);

const PartesDiariosToolbar = ({ tab, setTab, allRows, search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo }) => (
  <div className="ot-quick-tabs" style={{ marginBottom:12, flexWrap:'wrap', rowGap:8 }}>
    {PARTES_TABS.map(t => (
      <button key={t.id}
        className={'ot-qtab' + (tab === t.id ? ' active' : '')}
        onClick={() => setTab(t.id)}
      >
        {t.label}
        <span className="qtab-count">
          {t.id === 'todos' ? allRows.length : allRows.filter(r => r.estado === t.id).length}
        </span>
      </button>
    ))}
    <div style={{ flex:1 }}/>
    <input className="input" placeholder="Buscar por técnico u OT..."
      value={search} onChange={e => setSearch(e.target.value)} style={{ width:230 }}/>
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <span style={{ fontSize:12, color:'var(--text-muted)', whiteSpace:'nowrap' }}>Desde</span>
      <input className="input" type="date" value={dateFrom}
        onChange={e => setDateFrom(e.target.value)} style={{ width:140 }}/>
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <span style={{ fontSize:12, color:'var(--text-muted)', whiteSpace:'nowrap' }}>Hasta</span>
      <input className="input" type="date" value={dateTo}
        onChange={e => setDateTo(e.target.value)} style={{ width:140 }}/>
    </div>
  </div>
);

const PartesDiariosDataTable = ({ rows, onNav, editRoute, openMenu, setOpenMenu }) => (
  <div className="card">
    <table className="tbl">
      <thead>
        <tr>
          <th style={{ width:136 }}>Nº Parte</th>
          <th style={{ width:136 }}>Fecha</th>
          <th>Técnico</th>
          <th style={{ width:148 }}>OT Vinculada</th>
          <th style={{ width:116 }} className="num">Horas Totales</th>
          <th style={{ width:120 }}>Estado</th>
          <th style={{ width:56 }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} className="clickable">
            <td>
              <button
                className="btn btn-ghost btn-sm"
                title="Ver detalle del Parte Diario"
                onClick={() => onNav(editRoute)}
                style={{
                  fontFamily:'ui-monospace,monospace', fontSize:12,
                  color:'var(--cyan)', padding:'2px 6px',
                  textDecoration:'underline', textUnderlineOffset:3,
                }}
              >
                {r.id}
              </button>
            </td>
            <td style={{ fontSize:12.5 }}>{fmtFechaCorta(r.fecha)}</td>
            <td style={{ fontWeight:600, fontSize:13 }}>{r.mecanico}</td>
            <td>
              <span className="chip" style={{ fontSize:11.5, fontFamily:'ui-monospace,monospace' }}>
                {r.ot}
              </span>
            </td>
            <td className="num">
              <span style={{ fontFamily:'ui-monospace,monospace', fontWeight:700, fontSize:13 }}>
                {r.horas.toFixed(1)} h
              </span>
            </td>
            <td><EstadoBadgeParte estado={r.estado}/></td>
            <td onClick={e => e.stopPropagation()} style={{ overflow:'visible' }}>
              <PartesMenuAcciones
                onNav={onNav}
                editRoute={editRoute}
                open={openMenu === r.id}
                onOpen={() => setOpenMenu(r.id)}
                onClose={() => setOpenMenu(null)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {rows.length === 0 && (
      <div style={{ padding:'40px 0', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>
        <Icon name="search" size={28}/>
        <div style={{ marginTop:10 }}>No hay partes con los filtros aplicados.</div>
      </div>
    )}
  </div>
);

// ── Gestión de Partes Diarios — Taller ────────────────────────────────────
export const GestionPartesTallerPage = ({ onNav }) => {
  const [tab,      setTab]      = useS2('todos');
  const [search,   setSearch]   = useS2('');
  const [dateFrom, setDateFrom] = useS2('');
  const [dateTo,   setDateTo]   = useS2('');
  const [openMenu, setOpenMenu] = useS2(null);

  const filtered = PARTES_TALLER_MOCK
    .filter(r => tab === 'todos' || r.estado === tab)
    .filter(r => !search   || r.mecanico.toLowerCase().includes(search.toLowerCase()) || r.ot.toLowerCase().includes(search.toLowerCase()))
    .filter(r => !dateFrom || r.fecha >= dateFrom)
    .filter(r => !dateTo   || r.fecha <= dateTo);

  return (
    <div className="page" onClick={() => setOpenMenu(null)}>
      <div className="page-header">
        <div>
          <h1>Gestión de Partes Diarios — Taller</h1>
          <div className="sub">Carapongo y Lurín · {PARTES_TALLER_MOCK.length} registros</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-primary" onClick={() => onNav('crear-parte-taller')}>
          <Icon name="plus" size={13}/> Nuevo Parte Diario
        </button>
      </div>
      <PartesDiariosToolbar
        tab={tab} setTab={setTab} allRows={PARTES_TALLER_MOCK}
        search={search} setSearch={setSearch}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
      />
      <PartesDiariosDataTable
        rows={filtered} onNav={onNav}
        editRoute="crear-parte-taller"
        openMenu={openMenu} setOpenMenu={setOpenMenu}
      />
      <FooterBrand/>
    </div>
  );
};

// ── Gestión de Partes Diarios — Campo / Mina ──────────────────────────────
export const HistorialMinaPage = ({ onNav }) => {
  const [tab,      setTab]      = useS2('todos');
  const [search,   setSearch]   = useS2('');
  const [dateFrom, setDateFrom] = useS2('');
  const [dateTo,   setDateTo]   = useS2('');
  const [openMenu, setOpenMenu] = useS2(null);

  const filtered = PARTES_MINA_MOCK
    .filter(r => tab === 'todos' || r.estado === tab)
    .filter(r => !search   || r.mecanico.toLowerCase().includes(search.toLowerCase()) || r.ot.toLowerCase().includes(search.toLowerCase()))
    .filter(r => !dateFrom || r.fecha >= dateFrom)
    .filter(r => !dateTo   || r.fecha <= dateTo);

  return (
    <div className="page" onClick={() => setOpenMenu(null)}>
      <div className="page-header">
        <div>
          <h1>Gestión de Partes Diarios — Campo / Mina</h1>
          <div className="sub">Buenaventura · Antapaccay · Pepas de Oro · {PARTES_MINA_MOCK.length} registros</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-primary" onClick={() => onNav?.('nuevo-reporte')}>
          <Icon name="plus" size={13}/> Nuevo Parte Diario
        </button>
      </div>
      <PartesDiariosToolbar
        tab={tab} setTab={setTab} allRows={PARTES_MINA_MOCK}
        search={search} setSearch={setSearch}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
      />
      <PartesDiariosDataTable
        rows={filtered} onNav={onNav}
        editRoute="nuevo-reporte"
        openMenu={openMenu} setOpenMenu={setOpenMenu}
      />
      <FooterBrand/>
    </div>
  );
};

// ---------- Solicitudes ----------
export const SolicitudesPage = () => {
  const D = ZAHORY_SAC_DATA;
  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Solicitudes de repuestos</h1><div className="sub">Pedidos desde mina y taller — para pasar a compras</div></div>
        <div className="spacer"/>
        <button className="btn btn-secondary"><Icon name="download" size={13}/> Exportar a Excel</button>
      </div>
      <div className="toolbar">
        <div className="seg"><button className="active">Todos</button><button>Urgentes</button><button>Normales</button></div>
        <select className="select"><option>Proyecto: Todos</option></select>
        <select className="select"><option>Técnico: Todos</option></select>
        <select className="select"><option>Estado: Todos</option></select>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Tipo</th><th>Descripción</th><th className="num">Cant.</th><th>Solicitado por</th><th>Proyecto</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {D.solicitudesUrgentes.map((r, i) => (
              <tr key={i}>
                <td>{r.tipo === "URGENTE" ? <span className="badge solid-red">URGENTE</span> : <span className="badge orange"><span className="dot"/>NORMAL</span>}</td>
                <td className="bold">{r.desc}</td>
                <td className="num mono">{r.cant}</td>
                <td>{r.tec}</td>
                <td>{r.proy}</td>
                <td>{r.fecha}</td>
                <td>{r.estado === "Atendido" ? <span className="badge green"><span className="dot"/>Atendido</span> : r.estado === "En proceso" ? <span className="badge cyan"><span className="dot"/>En proceso</span> : <span className="badge orange"><span className="dot"/>Pendiente</span>}</td>
                <td><button className="btn btn-ghost btn-sm">{r.estado === "Pendiente" ? "Atender" : "Ver"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FooterBrand/>
    </div>
  );
};

// ---------- Import Modal ----------
const ImportModal = ({ tipo, onClose }) => {
  const [fase, setFase] = useS2('upload');
  const mockRows = [
    { fila: 2, codigo: 'REP-9901-HYD', desc: 'Filtro presión SANDVIK', stock: 4, ok: true, error: null },
    { fila: 3, codigo: 'INS-0099-LUB', desc: 'Grasa EP-2 (kg)', stock: 10, ok: true, error: null },
    { fila: 4, codigo: 'REP-ERR-001',  desc: 'Conector X440', stock: 'abc', ok: false, error: 'Stock debe ser número entero' },
    { fila: 5, codigo: 'REP-3311-PER', desc: 'Culata percusión completa', stock: 0, ok: true, error: null },
    { fila: 6, codigo: '',             desc: 'Sin código', stock: 2, ok: false, error: 'Código de ítem requerido' },
  ];
  const ok = mockRows.filter(r => r.ok).length;
  const err = mockRows.filter(r => !r.ok).length;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.65)', zIndex:1000, display:'grid', placeItems:'center', padding:20 }}>
      <div className="card" style={{ width:'100%', maxWidth:680, animation:'fadeInUp 0.2s ease-out' }}>
        <div className="card-header" style={{ background:'var(--navy)', color:'white', borderRadius:'8px 8px 0 0' }}>
          <h3>Importar {tipo === 'catalogo' ? 'Catálogo de Repuestos' : 'Reportes Diarios'}</h3>
          <div className="spacer"/>
          <button className="icon-btn" onClick={onClose} style={{ color:'white' }}><Icon name="x" size={16}/></button>
        </div>
        <div className="card-body">
          {fase === 'upload' && (
            <>
              <div style={{ border:'2px dashed var(--card-border)', borderRadius:10, padding:36, textAlign:'center', marginBottom:16, background:'#F8FAFC' }}>
                <Icon name="upload" size={32}/>
                <div style={{ fontWeight:700, fontSize:15, marginTop:12 }}>Arrastrar archivo aquí</div>
                <div className="muted" style={{ fontSize:12, marginTop:4 }}>Formatos aceptados: .xlsx · .xls · .csv</div>
                <button className="btn btn-secondary" style={{ marginTop:16 }}>Seleccionar archivo</button>
              </div>
              <div style={{ background:'var(--cyan-soft)', border:'1px solid var(--cyan)', borderRadius:8, padding:'10px 14px', fontSize:12, marginBottom:16 }}>
                <b>Plantilla requerida:</b> La primera fila debe contener encabezados exactos.
                <a href="#" style={{ color:'var(--cyan)', textDecoration:'underline', marginLeft:6 }}>Descargar plantilla</a>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button className="btn btn-primary" onClick={() => { setFase('validating'); setTimeout(() => setFase('result'), 1200); }}>
                  <Icon name="upload" size={14}/> Cargar y validar
                </button>
              </div>
            </>
          )}
          {fase === 'validating' && (
            <div style={{ textAlign:'center', padding:48 }}>
              <div style={{ width:40, height:40, border:'3px solid var(--cyan)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}/>
              <div style={{ fontWeight:600 }}>Validando filas...</div>
              <div className="muted" style={{ fontSize:12, marginTop:4 }}>Verificando códigos, formatos y duplicados</div>
            </div>
          )}
          {fase === 'result' && (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <div className="kpi green-soft" style={{ padding:14 }}>
                  <div className="label" style={{ color:'#1B5E20' }}>Filas válidas</div>
                  <div className="value" style={{ color:'#1B5E20', fontSize:28 }}>{ok}</div>
                </div>
                <div className="kpi red-soft" style={{ padding:14 }}>
                  <div className="label" style={{ color:'#B71C1C' }}>Filas con error</div>
                  <div className="value" style={{ color:'#B71C1C', fontSize:28 }}>{err}</div>
                </div>
              </div>
              <div className="card" style={{ marginBottom:16 }}>
                <table className="tbl" style={{ fontSize:12 }}>
                  <thead><tr><th>#</th><th>Código</th><th>Descripción</th><th className="num">Stock</th><th>Resultado</th></tr></thead>
                  <tbody>
                    {mockRows.map((r, i) => (
                      <tr key={i} style={{ background: r.ok ? 'transparent' : 'var(--red-soft)' }}>
                        <td className="muted">{r.fila}</td>
                        <td className="ot-code">{r.codigo || <span className="muted">—</span>}</td>
                        <td>{r.desc}</td>
                        <td className="num mono">{String(r.stock)}</td>
                        <td>
                          {r.ok
                            ? <span className="badge green"><span className="dot"/>OK</span>
                            : <span className="badge red" style={{ fontSize:11 }}>{r.error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button className="btn btn-secondary" onClick={() => setFase('upload')}><Icon name="back" size={13}/> Reintentar</button>
                <button className="btn btn-primary" onClick={onClose}><Icon name="check" size={14}/> Importar {ok} filas válidas</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Catálogo ----------
export const CatalogoPage = () => {
  const D = ZAHORY_SAC_DATA;
  const [showImport, setShowImport] = useS2(false);
  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Catálogo de repuestos</h1><div className="sub">{D.repuestos.length} ítems · inventario mínimo integrado</div></div>
        <div className="spacer"/>
        <button className="btn btn-secondary" onClick={() => setShowImport(true)}><Icon name="upload" size={13}/> Importar Excel</button>
        <button className="btn btn-cyan"><Icon name="plus" size={13}/> Nuevo repuesto</button>
      </div>
      <div className="toolbar">
        <input className="input" placeholder="Buscar por código, N° parte o descripción..." style={{ flex: 1, maxWidth: 400 }}/>
        <select className="select"><option>Categoría: Todos</option><option>Hidráulico</option><option>Filtros</option><option>Lubricantes</option><option>Consumibles</option><option>Eléctrico</option></select>
        <select className="select"><option>Stock: Todos</option><option>Stock bajo</option><option>Sin stock</option><option>OK</option></select>
      </div>
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Código</th><th>N° Parte</th><th>Descripción</th><th>Categoría</th><th>Unidad</th>
              <th className="num">USD</th><th className="num">PEN</th>
              <th className="num">Stock</th><th className="num">Mín.</th>
              <th>Contexto</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {D.repuestos.map(r => {
              const sinStock = r.stock === 0;
              const bajo = !sinStock && r.stock <= r.min;
              const stockColor = sinStock ? '#E53935' : bajo ? '#C15D00' : '#2E7D32';
              return (
                <tr key={r.cod} style={{ background: sinStock ? 'rgba(229,57,53,0.05)' : bajo ? 'rgba(193,93,0,0.04)' : 'transparent' }}>
                  <td className="ot-code">{r.cod}</td>
                  <td className="mono">{r.np}</td>
                  <td className="bold">{r.desc}</td>
                  <td><span className="chip">{r.cat}</span></td>
                  <td>{r.um}</td>
                  <td className="num mono">${r.usd.toFixed(2)}</td>
                  <td className="num mono">S/ {(r.usd * D.fx).toFixed(2)}</td>
                  <td className="num">
                    <span style={{ fontWeight:700, color:stockColor, fontFamily:'ui-monospace,monospace' }}>{r.stock}</span>
                    {sinStock && <span className="badge solid-red" style={{ marginLeft:5, fontSize:9, padding:'1px 5px' }}>SIN STOCK</span>}
                    {bajo     && <span className="badge orange"    style={{ marginLeft:5, fontSize:9, padding:'1px 5px' }}>BAJO</span>}
                  </td>
                  <td className="num mono" style={{ color:'var(--text-muted)' }}>{r.min}</td>
                  <td>{r.ctx}</td>
                  <td>{r.activo ? <span className="badge green"><span className="dot"/>Activo</span> : <span className="badge slate"><span className="dot"/>Inactivo</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {D.repuestos.some(r => r.stock <= r.min) && (
          <div style={{ padding:'10px 16px', background:'var(--red-soft)', borderTop:'1px solid #FFCDD2', display:'flex', alignItems:'center', gap:10, fontSize:12 }}>
            <Icon name="alert" size={15}/>
            <b>{D.repuestos.filter(r => r.stock <= r.min).length} ítems</b> con stock bajo o agotado — solicitudes de reposición generadas automáticamente.
            <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }}>Ver solicitudes</button>
          </div>
        )}
      </div>
      {showImport && <ImportModal tipo="catalogo" onClose={() => setShowImport(false)}/>}
      <FooterBrand/>
    </div>
  );
};


// ---------- Documentos comerciales ----------
export const DocsPage = () => {
  const [tab, setTab] = useS2("prop");
  const D = ZAHORY_SAC_DATA;
  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Documentos comerciales</h1><div className="sub">Propuestas, actas y remisiones a clientes</div></div>
        <div className="spacer"/>
        <button className="btn btn-cyan"><Icon name="plus" size={13}/> Nuevo documento</button>
      </div>
      <div className="tabs">
        <div className={"tab " + (tab === "prop"      ? "active" : "")} onClick={() => setTab("prop")}>Propuestas</div>
        <div className={"tab " + (tab === "actas"     ? "active" : "")} onClick={() => setTab("actas")}>Actas de inicio</div>
        <div className={"tab " + (tab === "rem"       ? "active" : "")} onClick={() => setTab("rem")}>Remisiones de servicio</div>
        <div className={"tab " + (tab === "checklist" ? "active" : "")} onClick={() => setTab("checklist")}>
          Checklist documental
          <span className="badge solid-red" style={{ marginLeft:6, fontSize:10 }}>1</span>
        </div>
      </div>
      {tab === "prop" && (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>N°</th><th>Cliente</th><th>Proyecto</th><th>Fecha</th><th className="num">Monto USD</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {D.propuestas.map(p => (
                <tr key={p.n}>
                  <td className="ot-code">{p.n}</td>
                  <td className="bold">{p.cliente}</td>
                  <td>{p.proy}</td>
                  <td>{p.fecha}</td>
                  <td className="num mono">${p.usd.toLocaleString()}</td>
                  <td>
                    {p.estado === "Aceptada" && <span className="badge green"><span className="dot"/>Aceptada</span>}
                    {p.estado === "Enviada" && <span className="badge orange"><span className="dot"/>Enviada</span>}
                    {p.estado === "Borrador" && <span className="badge slate"><span className="dot"/>Borrador</span>}
                  </td>
                  <td><button className="btn btn-ghost btn-sm">Ver</button><button className="btn btn-ghost btn-sm">PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "actas" && (() => {
        const actas = [
          { n: 'AI-2026-001', proyecto: 'Pepas de Oro', contrato: 'CT-2026-PEP-003', cliente: 'Minsur S.A.', fechaInicio: '01/02/2026', estado: 'Firmada', responsable: 'A. Parado' },
          { n: 'AI-2026-002', proyecto: 'Antapaccay',   contrato: 'OS-2026-APC-011', cliente: 'Antapaccay - Glencore', fechaInicio: '15/01/2026', estado: 'Firmada', responsable: 'A. Parado' },
          { n: 'AI-2026-003', proyecto: 'Buenaventura', contrato: 'CT-2025-BUE-001', cliente: 'Buenaventura S.A.A.', fechaInicio: '01/01/2025', estado: 'Firmada', responsable: 'A. Parado' },
        ];
        return (
          <div className="card">
            <table className="tbl">
              <thead><tr><th>N° Acta</th><th>Proyecto</th><th>Contrato / OS</th><th>Cliente</th><th>Fecha inicio</th><th>Responsable</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {actas.map(a => (
                  <tr key={a.n}>
                    <td className="ot-code">{a.n}</td>
                    <td className="bold">{a.proyecto}</td>
                    <td className="mono" style={{fontSize:12}}>{a.contrato}</td>
                    <td>{a.cliente}</td>
                    <td>{a.fechaInicio}</td>
                    <td>{a.responsable}</td>
                    <td><span className="badge green"><span className="dot"/>Firmada</span></td>
                    <td><button className="btn btn-ghost btn-sm">Ver</button><button className="btn btn-ghost btn-sm">PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}
      {tab === "rem" && (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>N°</th><th>OTs incluidas</th><th>Período</th><th>Cliente</th><th className="num">Total USD</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {D.remisiones.map(r => (
                <tr key={r.n}>
                  <td className="ot-code">{r.n}</td>
                  <td className="mono">{r.ots}</td>
                  <td>{r.periodo}</td>
                  <td className="bold">{r.cliente}</td>
                  <td className="num mono">${r.usd.toLocaleString()}</td>
                  <td><span className="badge green"><span className="dot"/>{r.estado}</span></td>
                  <td><button className="btn btn-ghost btn-sm">Ver</button><button className="btn btn-ghost btn-sm">PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "checklist" && (() => {
        const ITEMS = [
          'Reportes / partes completos (sin borrador)',
          'Firmas del técnico ejecutor registradas',
          'Firmas del supervisor o jefe de taller',
          'Materiales consumidos registrados o declarados como no consumo',
          'Horas reales cerradas',
          'Paradas formalmente registradas',
          'Evidencia fotográfica adjunta (≥ 1 foto)',
          'Estado final del equipo declarado',
          'OT dentro del período del contrato vigente',
        ];
        const otsChecklist = [
          { ot: 'OT-2026-050', eq: 'JB-24',    cliente: 'Buenaventura S.A.A.', checks: [true,true,true,true,true,true,false,true,true] },
          { ot: 'OT-2026-048', eq: 'JB-26',    cliente: 'Antapaccay',          checks: [true,true,true,true,true,false,true,true,true] },
          { ot: 'OT-2026-052', eq: 'JB-DD311', cliente: 'Minsur S.A.',          checks: [true,true,false,true,true,true,true,true,true] },
        ];
        const completa = (checks) => checks.every(Boolean);
        return (
          <div>
            <div style={{ padding:'10px 16px', background:'var(--orange-soft)', border:'1px solid #FFD9A8', borderRadius:8, fontSize:12, display:'flex', gap:8, alignItems:'center', marginBottom:16 }}>
              <Icon name="alert" size={14}/>
              <span>Administración valida que cada OT cumpla estos requisitos antes de incluirla en una remisión. Una OT con ítems pendientes <b>no puede pasar a Costeada</b>.</span>
            </div>
            {otsChecklist.map(ot => (
              <div key={ot.ot} className="card" style={{ marginBottom:16 }}>
                <div className="card-header">
                  <div><span className="ot-code">{ot.ot}</span><span className="muted" style={{marginLeft:10,fontSize:12}}>{ot.eq} · {ot.cliente}</span></div>
                  <div className="spacer"/>
                  {completa(ot.checks)
                    ? <span className="badge green"><span className="dot"/>Lista para remisión</span>
                    : <span className="badge solid-red">{ot.checks.filter(c=>!c).length} pendiente{ot.checks.filter(c=>!c).length>1?'s':''}</span>}
                  <button className={`btn btn-sm ${completa(ot.checks)?'btn-primary':'btn-secondary'}`} style={{marginLeft:10}}>
                    {completa(ot.checks) ? 'Aprobar' : 'Completar pendientes'}
                  </button>
                </div>
                <div style={{ padding:'8px 16px' }}>
                  {ITEMS.map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid var(--card-border)', fontSize:13 }}>
                      <span style={{ fontSize:15 }}>{ot.checks[i] ? '✅' : '❌'}</span>
                      <span style={{ flex:1, color: ot.checks[i] ? 'var(--text)' : '#D32F2F', fontWeight: ot.checks[i] ? 400 : 600 }}>{item}</span>
                      {!ot.checks[i] && <button className="btn btn-ghost btn-sm" style={{fontSize:11}}>Completar</button>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      <FooterBrand/>
    </div>
  );
};

// ---------- Usuarios y roles ----------
export const UsuariosPage = () => {
  const [tab, setTab] = useS2("users");
  const [openModule, setOpenModule] = useS2("reportes");
  const [perms, setPerms] = useS2({
    "reportes.ver": true, "reportes.aprobar": true, "reportes.crear": false, "reportes.costos": false,
    "dashboard.graficos": false, "dashboard.tabla": true, "dashboard.pdf": false,
  });
  const togglePerm = (k) => setPerms({ ...perms, [k]: !perms[k] });

  const users = [
    { nombre: "A. Castro",     email: "acastro@zahorysac.com",         rol: "Gerente",       roloColor: "cyan", ctx: "Todos",          estado: "Activo" },
    { nombre: "Pajuelo E.",    email: "e.pajuelo@zahorysac.com",       rol: "Técnico Mina",  roloColor: "slate", ctx: "Buenaventura",  estado: "Activo" },
    { nombre: "Miranda B.",    email: "s.miranda@zahorysac.com",       rol: "Técnico Mina",  roloColor: "slate", ctx: "Pepas de Oro",  estado: "Activo" },
    { nombre: "García Q.",     email: "r.garcia@zahorysac.com",        rol: "Supervisor",    roloColor: "purple", ctx: "Buenaventura", estado: "Activo" },
    { nombre: "Torres M.",     email: "m.torres@zahorysac.com",        rol: "Técnico Mina",  roloColor: "slate", ctx: "Antapaccay",    estado: "Activo" },
    { nombre: "López V.",      email: "c.lopez@zahorysac.com",         rol: "Técnico Taller",roloColor: "slate", ctx: "Carapongo",    estado: "Inactivo" },
  ];

  const ToggleSwitch = ({ on, onClick }) => (
    <button onClick={onClick} style={{ width: 40, height: 22, borderRadius: 12, background: on ? "#00BCD4" : "#CFD8DC", position: "relative", transition: "background 0.15s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, background: "white", borderRadius: "50%", transition: "left 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}/>
    </button>
  );

  const PermRow = ({ k, label }) => (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--card-border)" }}>
      <span style={{ flex: 1, fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 11, color: perms[k] ? "#00BCD4" : "var(--text-muted)", fontWeight: 700, marginRight: 10 }}>{perms[k] ? "ON" : "OFF"}</span>
      <ToggleSwitch on={perms[k]} onClick={() => togglePerm(k)}/>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Usuarios y roles</h1><div className="sub">Gestión de cuentas, permisos y personal operativo</div></div>
        <div className="spacer"/>
        <button className="btn btn-cyan"><Icon name="plus" size={13}/> Nuevo usuario</button>
      </div>
      <div className="tabs">
        <div className={"tab " + (tab === "users" ? "active" : "")} onClick={() => setTab("users")}>Usuarios del sistema</div>
        <div className={"tab " + (tab === "personal" ? "active" : "")} onClick={() => setTab("personal")}>Personal operativo</div>
        <div className={"tab " + (tab === "roles" ? "active" : "")} onClick={() => setTab("roles")}>Roles y permisos</div>
      </div>

      {tab === "users" && (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Contexto</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.email}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#CFD8DC", color: "#37474F", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 11 }}>
                        {u.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="bold">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="mono">{u.email}</td>
                  <td><span className={"badge " + u.roloColor}><span className="dot"/>{u.rol}</span></td>
                  <td>{u.ctx}</td>
                  <td>{u.estado === "Activo" ? <span className="badge green"><span className="dot"/>Activo</span> : <span className="badge slate"><span className="dot"/>Inactivo</span>}</td>
                  <td><button className="btn btn-ghost btn-sm"><Icon name="edit" size={12}/> Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "personal" && (() => {
        const hoy = new Date('2026-04-23');
        const alertaDias = 60;
        const VigenciaCell = ({ fecha }) => {
          const d = new Date(fecha);
          const diff = Math.round((d - hoy) / 86400000);
          const vencido = diff < 0;
          const proximo = diff >= 0 && diff <= alertaDias;
          const color = vencido ? '#E53935' : proximo ? '#C15D00' : '#2E7D32';
          const bg = vencido ? 'var(--red-soft)' : proximo ? 'var(--orange-soft)' : 'transparent';
          const label = vencido ? 'VENCIDO' : proximo ? `${diff}d` : '✓';
          return (
            <td style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 11, fontFamily: 'ui-monospace,monospace', color: 'var(--text-muted)' }}>{fecha.slice(5).replace('-','/')}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color, background: bg, padding: '1px 5px', borderRadius: 4 }}>{label}</span>
              </div>
            </td>
          );
        };
        return (
          <div className="card">
            <div style={{ padding: '10px 16px', background: 'var(--orange-soft)', borderBottom: '1px solid #FFD9A8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="alert" size={14}/>
              <span>Los técnicos con documentos <b>vencidos o próximos a vencer (&lt;60 días)</b> se marcan automáticamente. Un técnico <b>bloqueado</b> no puede ser asignado a nuevas OTs.</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    <th>Código</th><th>Nombre</th><th>Cargo / Esp.</th><th>Proyecto</th>
                    <th className="num">Costo/h USD</th><th className="num">Extra/h</th>
                    <th style={{ textAlign: 'center' }}>SCTR</th>
                    <th style={{ textAlign: 'center' }}>Licencia</th>
                    <th style={{ textAlign: 'center' }}>EMO</th>
                    <th style={{ textAlign: 'center' }}>Inducción</th>
                    <th>Habilitado</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {D.personalOperativo.map(p => (
                    <tr key={p.cod}>
                      <td className="ot-code">{p.cod}</td>
                      <td className="bold">{p.nombre}</td>
                      <td><div>{p.cargo}</div><span className="chip" style={{ marginTop: 2 }}>{p.esp}</span></td>
                      <td>{p.proy} <span className="muted">· {p.ctx}</span></td>
                      <td className="num mono" style={{ fontWeight: 700 }}>${p.costoHora.toFixed(2)}</td>
                      <td className="num mono" style={{ color: 'var(--text-muted)' }}>${p.costoExtra.toFixed(2)}</td>
                      <VigenciaCell fecha={p.sctr}/>
                      <VigenciaCell fecha={p.licencia}/>
                      <VigenciaCell fecha={p.emo}/>
                      <VigenciaCell fecha={p.induccion}/>
                      <td>
                        {p.habilitado
                          ? <span className="badge green"><span className="dot"/>Habilitado</span>
                          : <span className="badge solid-red"><Icon name="lock" size={11}/> Bloqueado</span>}
                      </td>
                      <td>{p.estado === 'Activo' ? <span className="badge green"><span className="dot"/>Activo</span> : <span className="badge slate"><span className="dot"/>Inactivo</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {tab === "roles" && (
        <div className="grid-2" style={{ gridTemplateColumns: "240px 1fr", alignItems: "start" }}>
          <div className="card">
            <div className="card-header"><h3>Roles</h3></div>
            <div style={{ padding: "4px 0" }}>
              {["Gerente de Operaciones", "Supervisor de Mina", "Técnico de Mina", "Técnico de Taller", "Cliente"].map(r => (
                <button key={r} className={"nav-item " + (r === "Supervisor de Mina" ? "active" : "")} style={{ color: r === "Supervisor de Mina" ? "var(--navy)" : "var(--text)", background: r === "Supervisor de Mina" ? "var(--cyan-soft)" : "transparent", margin: "1px 6px", width: "calc(100% - 12px)" }}>
                  <Icon name="users" size={13}/>
                  <span className="label">{r}</span>
                </button>
              ))}
              <button className="btn btn-secondary btn-sm" style={{ margin: 8, width: "calc(100% - 16px)", justifyContent: "center" }}><Icon name="plus" size={12}/> Nuevo rol</button>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Permisos · Supervisor de Mina</h3>
              <div className="spacer"/>
              <button className="btn btn-primary btn-sm">Guardar cambios</button>
            </div>
            <div>
              <div className="accordion open">
                <button className="accordion-head" onClick={() => setOpenModule(openModule === "reportes" ? null : "reportes")}>
                  <Icon name="mine" size={14}/> Reportes de mina
                  <span className="chip" style={{ marginLeft: 8 }}>2/4 permisos</span>
                  <Icon name="chev" size={14} />
                </button>
                {openModule === "reportes" && (
                  <div>
                    <PermRow k="reportes.ver" label="Ver listado"/>
                    <PermRow k="reportes.aprobar" label="Aprobar / rechazar"/>
                    <PermRow k="reportes.crear" label="Crear nuevo reporte"/>
                    <PermRow k="reportes.costos" label="Ver costos en el reporte"/>
                  </div>
                )}
              </div>
              <div className="accordion open">
                <button className="accordion-head" onClick={() => setOpenModule(openModule === "dash" ? null : "dash")}>
                  <Icon name="chart" size={14}/> Dashboard · Costos
                  <span className="chip" style={{ marginLeft: 8 }}>1/3 permisos</span>
                </button>
                {openModule === "dash" && (
                  <div>
                    <PermRow k="dashboard.graficos" label="Ver gráficos de costos"/>
                    <PermRow k="dashboard.tabla" label="Ver tabla de OTs"/>
                    <PermRow k="dashboard.pdf" label="Exportar reporte PDF"/>
                  </div>
                )}
              </div>
              <div className="accordion">
                <button className="accordion-head" onClick={() => setOpenModule(openModule === "ots" ? null : "ots")}>
                  <Icon name="orders" size={14}/> OTs
                  <span className="muted" style={{ marginLeft: 8, fontSize: 11 }}>Colapsado</span>
                </button>
              </div>
              <div className="accordion" style={{ opacity: 0.5 }}>
                <div className="accordion-head">
                  <Icon name="box" size={14}/> Almacén
                  <span className="badge slate" style={{ marginLeft: 8 }}><Icon name="lock" size={10}/> Próximamente</span>
                </div>
              </div>
              <div className="accordion" style={{ opacity: 0.5 }}>
                <div className="accordion-head">
                  <Icon name="report" size={14}/> Facturación
                  <span className="badge slate" style={{ marginLeft: 8 }}><Icon name="lock" size={10}/> Próximamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <FooterBrand/>
    </div>
  );
};

// ---------- Reporte consolidado mensual ----------
export const ConsolidadoPage = () => {
  const D = ZAHORY_SAC_DATA;
  const rows = D.consolidadoJB_DD311;
  const tot = rows.reduce((a, r) => ({
    ht: a.ht + r.ht, prg: a.prg + r.prg, prv: a.prv + r.prv, ctvo: a.ctvo + r.ctvo, hsb: a.hsb + r.hsb, total: a.total + r.total
  }), { ht: 0, prg: 0, prv: 0, ctvo: 0, hsb: 0, total: 0 });
  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Reporte consolidado</h1><div className="sub">Informe mensual para el cliente</div></div>
        <div className="spacer"/>
        <select className="select"><option>Equipo: JB-DD311</option></select>
        <select className="select"><option>Período: Marzo 2026</option></select>
        <button className="btn btn-primary"><Icon name="pdf" size={13}/> Generar PDF</button>
      </div>

      <div style={{ background: "var(--navy)", color: "white", padding: "16px 20px", borderRadius: 8, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--slate-2)", textTransform: "uppercase", letterSpacing: 0.6 }}>Equipo</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>JB-DD311 · SANDVIK DD311-40</div>
        </div>
        <div style={{ height: 40, width: 1, background: "rgba(255,255,255,0.15)" }}/>
        <div>
          <div style={{ fontSize: 11, color: "var(--slate-2)", textTransform: "uppercase", letterSpacing: 0.6 }}>Proyecto</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Pepas de Oro · Serv. Civiles y Mineros Perú S.A.</div>
        </div>
        <div className="spacer"/>
        <span className="badge orange" style={{ padding: "6px 12px", fontSize: 12 }}><span className="dot"/>DMR 97.44% bajo objetivo</span>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><h3>Guardias del mes</h3><span className="hint">10 turnos registrados</span></div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl" style={{ fontSize: 11.5 }}>
            <thead>
              <tr>
                <th>Turno</th><th>Fecha</th>
                <th className="num">Motor Ini</th><th className="num">Fin</th><th className="num">HT</th>
                <th className="num">Perc. Ini</th><th className="num">Fin</th><th className="num">HT</th>
                <th className="num">Elec. Ini</th><th className="num">Fin</th><th className="num">HT</th>
                <th className="num">Hr.Trab</th><th className="num">PRG</th><th className="num">PRV</th><th className="num">Rep.ACC</th><th className="num">Rep.CTVO</th><th className="num">HSB</th><th className="num">Total</th>
                <th>D.M.%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td><span className="chip" style={{ background: r.turno === "DÍA" ? "#FFF3E0" : "#E3F2FD", color: r.turno === "DÍA" ? "#C15D00" : "#0D47A1" }}>{r.turno}</span></td>
                  <td>{r.fecha}</td>
                  <td className="num mono">{r.mIni.toFixed(2)}</td><td className="num mono">{r.mFin.toFixed(2)}</td><td className="num mono bold">{(r.mFin - r.mIni).toFixed(2)}</td>
                  <td className="num mono">{r.pIni.toFixed(2)}</td><td className="num mono">{r.pFin.toFixed(2)}</td><td className="num mono bold">{(r.pFin - r.pIni).toFixed(2)}</td>
                  <td className="num mono">{r.eIni.toFixed(2)}</td><td className="num mono">{r.eFin.toFixed(2)}</td><td className="num mono bold">{(r.eFin - r.eIni).toFixed(2)}</td>
                  <td className="num mono bold">{r.ht.toFixed(2)}</td>
                  <td className="num mono">{r.prg.toFixed(2)}</td>
                  <td className="num mono">{r.prv.toFixed(2)}</td>
                  <td className="num mono">{r.acc.toFixed(2)}</td>
                  <td className="num mono">{r.ctvo.toFixed(2)}</td>
                  <td className="num mono">{r.hsb.toFixed(2)}</td>
                  <td className="num mono">{r.total.toFixed(2)}</td>
                  <td className="mono" style={{ color: r.dm < 97.92 ? "#FF9800" : "#4CAF50", fontWeight: 700 }}>{r.dm.toFixed(2)}%</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan={11}>TOTALES</td>
                <td className="num mono">{tot.ht.toFixed(2)}</td>
                <td className="num mono">{tot.prg.toFixed(2)}</td>
                <td className="num mono">{tot.prv.toFixed(2)}</td>
                <td className="num mono">0.00</td>
                <td className="num mono">{tot.ctvo.toFixed(2)}</td>
                <td className="num mono">{tot.hsb.toFixed(2)}</td>
                <td className="num mono">{tot.total.toFixed(2)}</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Resumen del mes</h3></div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <div className="kpi" style={{ padding: 14 }}><div className="label">Horas disponibles</div><div className="value" style={{ fontSize: 22 }}>492.00 <span style={{ fontSize: 11, color: "var(--text-muted)" }}>hrs</span></div></div>
            <div className="kpi" style={{ padding: 14 }}><div className="label">Horas trabajadas</div><div className="value" style={{ fontSize: 22 }}>133.20 <span style={{ fontSize: 11, color: "var(--text-muted)" }}>hrs</span></div></div>
            <div className="kpi" style={{ padding: 14 }}><div className="label">Horas mantenimiento</div><div className="value" style={{ fontSize: 22 }}>10.25 <span style={{ fontSize: 11, color: "var(--text-muted)" }}>hrs</span></div></div>
            <div className="kpi" style={{ padding: 14 }}><div className="label">Horas reparación</div><div className="value" style={{ fontSize: 22, color: "#FF9800" }}>2.33 <span style={{ fontSize: 11, color: "var(--text-muted)" }}>hrs</span></div></div>
            <div className="kpi" style={{ padding: 14 }}><div className="label">Horas stand-by</div><div className="value" style={{ fontSize: 22 }}>346.22 <span style={{ fontSize: 11, color: "var(--text-muted)" }}>hrs</span></div></div>
            <div className="kpi" style={{ padding: 14 }}><div className="label">DMP objetivo</div><div className="value" style={{ fontSize: 22 }}>97.92%</div></div>
            <div className="kpi orange-soft" style={{ padding: 14, background: "var(--orange-soft)", borderColor: "#FFD9A8" }}><div className="label" style={{ color: "#C15D00" }}>DMR real</div><div className="value" style={{ fontSize: 22, color: "#C15D00" }}>97.44% <Icon name="alert" size={18}/></div></div>
            <div className="kpi" style={{ padding: 14 }}><div className="label">Factor DMR/DMP</div><div className="value" style={{ fontSize: 22 }}>0.9995</div></div>
          </div>
        </div>
      </div>
      <FooterBrand/>
    </div>
  );
};

// ---------- Placeholder for tecnico dashboard and misc ----------
export const TecnicoDashboard = ({ onNav }) => (
  <div className="page" style={{ maxWidth: 560, margin: "0 auto" }}>
    <div className="page-header">
      <div><h1>Hola, Sandro</h1><div className="sub">Lunes 20 de abril · Turno Día</div></div>
    </div>
    <button className="card" style={{ width: "100%", padding: 20, display: "flex", gap: 14, alignItems: "center", background: "var(--cyan)", color: "white", border: "none", cursor: "pointer", marginBottom: 14 }} onClick={() => onNav("nuevo-reporte")}>
      <Icon name="plus" size={28} stroke={2.5}/>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Nuevo reporte de mina</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>Registra el parte diario del equipo</div>
      </div>
    </button>
    <div className="grid-2" style={{ marginBottom: 14 }}>
      <div className="kpi"><div className="label">Mis reportes</div><div className="value">23</div><div className="sub">Este mes</div></div>
      <div className="kpi"><div className="label">Pendientes</div><div className="value" style={{ color: "#FF9800" }}>2</div><div className="sub">Por aprobar</div></div>
    </div>
    <div className="card">
      <div className="card-header"><h3>Mis últimos reportes</h3></div>
      <div>
        {[
          { fecha: "16/04", turno: "DÍA", eq: "JB-DD311", estado: "Aprobado" },
          { fecha: "15/04", turno: "NOCHE", eq: "JB-DD311", estado: "Aprobado" },
          { fecha: "14/04", turno: "DÍA", eq: "JB-DD311", estado: "Rechazado" },
          { fecha: "13/04", turno: "NOCHE", eq: "JB-DD311", estado: "Aprobado" },
        ].map((r, i) => (
          <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: r.turno === "DÍA" ? "#FFF3E0" : "#E3F2FD", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: r.turno === "DÍA" ? "#C15D00" : "#0D47A1" }}>{r.turno}</div>
            <div style={{ flex: 1 }}>
              <div className="bold">{r.eq}</div>
              <div className="muted" style={{ fontSize: 11 }}>{r.fecha}</div>
            </div>
            {r.estado === "Aprobado" ? <span className="badge green"><span className="dot"/>Aprobado</span> : <span className="badge red"><span className="dot"/>Rechazado</span>}
          </div>
        ))}
      </div>
    </div>
    <FooterBrand/>
  </div>
);



