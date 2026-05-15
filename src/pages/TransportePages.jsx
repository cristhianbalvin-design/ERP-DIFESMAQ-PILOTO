import { useState } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';
import { ZAHORY_SAC_DATA } from '../data.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const TODAY = '2026-05-15';

const OV_STATES = {
  borrador:      { label: 'Borrador',      badge: 'slate'  },
  programada:    { label: 'Programada',    badge: 'cyan'   },
  en_ruta:       { label: 'En ruta',       badge: 'orange' },
  con_incidente: { label: 'Con incidente', badge: 'red'    },
  completada:    { label: 'Completada',    badge: 'green'  },
  cerrada:       { label: 'Cerrada',       badge: 'green'  },
};

const UNIT_STATES = {
  disponible:       { label: 'Disponible',      badge: 'green'  },
  en_ruta:          { label: 'En ruta',          badge: 'orange' },
  en_mantenimiento: { label: 'En mantenimiento', badge: 'red'    },
  baja:             { label: 'Baja',             badge: 'slate'  },
};

const TIPO_TARIFA_LABEL = {
  por_viaje:        'Por viaje',
  por_km:           'Por km',
  por_dia:          'Por día',
  contrato_mensual: 'Contrato mensual',
};

const TIPO_UNIDAD_LABEL = {
  camioneta_4x4: 'Camioneta 4x4',
  camion_plano:  'Camión plano',
  camion_grua:   'Camión grúa',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d} ${meses[parseInt(m,10)-1]} ${y}`;
};

const fmtUSD = (n) => {
  if (n == null) return '—';
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
};

// ── Shared sub-components ─────────────────────────────────────────────────────

const OVBadge = ({ estado }) => {
  const s = OV_STATES[estado] || { label: estado, badge: 'slate' };
  return <span className={`badge ${s.badge}`}><span className="dot"/>{s.label}</span>;
};

const UnitBadge = ({ estado }) => {
  const s = UNIT_STATES[estado] || { label: estado, badge: 'slate' };
  return <span className={`badge ${s.badge}`}><span className="dot"/>{s.label}</span>;
};

const MetaField = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value || '—'}</div>
  </div>
);

// ── 1. DashboardTransporte ────────────────────────────────────────────────────

export const DashboardTransporte = ({ onNav }) => {
  const unidades = ZAHORY_SAC_DATA.unidades_transporte || [];
  const ovs      = ZAHORY_SAC_DATA.ordenes_viaje || [];

  const enRutaHoy   = ovs.filter(v => v.estado === 'en_ruta' && v.fecha_programada === TODAY).length;
  const disponibles = unidades.filter(u => u.estado === 'disponible').length;
  const enRutaUnits = unidades.filter(u => u.estado === 'en_ruta').length;
  const enMantto    = unidades.filter(u => u.estado === 'en_mantenimiento').length;
  const kmMes       = ovs.reduce((s, v) => s + (v.km_real || 0), 0);
  const factMes     = ovs
    .filter(v => v.tipo_operacion === 'comercial')
    .reduce((s, v) => s + (v.ingreso_estimado || 0), 0);

  const ovEnRuta = ovs.filter(v => v.estado === 'en_ruta');

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard Transporte Comercial</h1>
          <div className="sub">Monitor de flota y KPIs del día · {fmtDate(TODAY)}</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan" onClick={() => onNav('transporte-crear-ov')}>
          <Icon name="plus" size={14}/> Nueva Orden de Viaje
        </button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card" style={{ borderTop: '3px solid var(--orange)' }}>
          <div className="kpi-value">{enRutaHoy}</div>
          <div className="kpi-label">Viajes en ruta hoy</div>
        </div>
        <div className="kpi-card" style={{ borderTop: '3px solid var(--green)' }}>
          <div className="kpi-value">{disponibles}</div>
          <div className="kpi-label">Unidades disponibles</div>
          <div className="kpi-sub">{enRutaUnits} en ruta · {enMantto} en mantto</div>
        </div>
        <div className="kpi-card" style={{ borderTop: '3px solid var(--cyan)' }}>
          <div className="kpi-value">{kmMes.toLocaleString()} km</div>
          <div className="kpi-label">Km recorridos (mes)</div>
        </div>
        <div className="kpi-card" style={{ borderTop: '3px solid #7c3aed' }}>
          <div className="kpi-value">{fmtUSD(factMes)}</div>
          <div className="kpi-label">Facturación del mes</div>
          <div className="kpi-sub">Transporte comercial</div>
        </div>
      </div>

      {/* Alertas */}
      {enMantto > 0 && (
        <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid var(--orange)' }}>
          <div className="card-body" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="alert" size={16}/>
            <span style={{ fontSize: 13 }}>
              <strong>{enMantto} unidad(es)</strong> en mantenimiento · revisar disponibilidad antes de programar nuevos viajes.
            </span>
          </div>
        </div>
      )}

      {/* Monitor de flota */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><h3>Monitor de Flota</h3></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {unidades.map(u => {
              const viajeActual = ovs.find(v => v.unidad_id === u.id && v.estado === 'en_ruta');
              const bgColor = u.estado === 'en_ruta' ? 'rgba(234,179,8,0.04)'
                : u.estado === 'en_mantenimiento' ? 'rgba(239,68,68,0.04)'
                : 'var(--card-bg)';
              return (
                <div key={u.id} style={{ border: '1px solid var(--card-border)', borderRadius: 8, padding: 14, background: bgColor }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{u.placa || 'Tercerizada'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {TIPO_UNIDAD_LABEL[u.tipo] || u.tipo} · {u.marca}
                      </div>
                    </div>
                    <UnitBadge estado={u.estado}/>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 12, marginTop: 8 }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', fontWeight: 700 }}>Conductor</div>
                      <div style={{ fontWeight: 600, marginTop: 2 }}>
                        {u.origen === 'tercerizada' ? 'Del proveedor' : u.conductor_default}
                      </div>
                    </div>
                    {u.km_actual != null && (
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', fontWeight: 700 }}>Odómetro</div>
                        <div style={{ fontWeight: 600, marginTop: 2 }}>{u.km_actual.toLocaleString()} km</div>
                      </div>
                    )}
                    {u.origen === 'tercerizada' && (
                      <div style={{ gridColumn: 'span 2', marginTop: 4 }}>
                        <span className="badge slate" style={{ fontSize: 10 }}>Unidad tercerizada</span>
                      </div>
                    )}
                  </div>

                  {viajeActual && (
                    <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(0,0,0,0.04)', borderRadius: 6, fontSize: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{viajeActual.id}</div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        {viajeActual.origen?.split('—')[0]?.trim()} → {viajeActual.destino?.split('—')[0]?.trim()}
                      </div>
                      {viajeActual.hora_salida && (
                        <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>Salida {viajeActual.hora_salida}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Viajes activos */}
      {ovEnRuta.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Viajes en Curso</h3>
            <button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={() => onNav('transporte-viajes')}>
              Ver todos
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th><th>Tipo</th><th>Destino</th>
                  <th>Unidad</th><th>Conductor</th><th>Salida</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ovEnRuta.map(v => (
                  <tr key={v.id}>
                    <td><strong>{v.id}</strong></td>
                    <td>
                      <span className={`badge ${v.tipo_operacion === 'comercial' ? 'cyan' : 'slate'}`} style={{ fontSize: 10 }}>
                        {v.tipo_operacion === 'comercial' ? 'Comercial' : 'Propio'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, maxWidth: 200 }}>{v.destino?.split('—')[0]?.trim()}</td>
                    <td style={{ fontSize: 12 }}>{v.unidad_id}</td>
                    <td style={{ fontSize: 12 }}>{v.conductor}</td>
                    <td style={{ fontSize: 12 }}>{v.hora_salida || '—'}</td>
                    <td><OVBadge estado={v.estado}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};

// ── 2. MonitorViajes ──────────────────────────────────────────────────────────

export const MonitorViajes = ({ onNav }) => {
  const ovs = ZAHORY_SAC_DATA.ordenes_viaje || [];
  const [filtroTipo, setFiltroTipo]     = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const filtered = ovs.filter(v => {
    if (filtroTipo !== 'todos' && v.tipo_operacion !== filtroTipo) return false;
    if (filtroEstado !== 'todos' && v.estado !== filtroEstado) return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Monitor de Viajes</h1>
          <div className="sub">{ovs.length} órdenes de viaje registradas</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan" onClick={() => onNav('transporte-crear-ov')}>
          <Icon name="plus" size={14}/> Nueva Orden de Viaje
        </button>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px' }}>
          <Icon name="filter" size={14}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Filtros:</span>
          <select className="form-control" style={{ width: 180 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="todos">Todos los tipos</option>
            <option value="propio">Transporte propio</option>
            <option value="comercial">Transporte comercial</option>
          </select>
          <select className="form-control" style={{ width: 160 }} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {Object.entries(OV_STATES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} resultado(s)
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código OV</th><th>Tipo</th><th>Ruta</th><th>Fecha</th>
                <th>Unidad</th><th>Conductor</th><th>Estado</th>
                <th>Km real</th><th>Costo total</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No hay órdenes de viaje para los filtros seleccionados.
                  </td>
                </tr>
              )}
              {filtered.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.id}</strong></td>
                  <td>
                    <span className={`badge ${v.tipo_operacion === 'comercial' ? 'cyan' : 'slate'}`} style={{ fontSize: 10 }}>
                      {v.tipo_operacion === 'comercial' ? 'Comercial' : 'Propio'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, maxWidth: 180 }}>
                    <div style={{ fontWeight: 600 }}>{v.origen?.split('—')[0]?.trim()}</div>
                    <div style={{ color: 'var(--text-muted)' }}>→ {v.destino?.split('—')[0]?.trim()}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{fmtDate(v.fecha_programada)}</td>
                  <td style={{ fontSize: 12 }}>{v.unidad_id}</td>
                  <td style={{ fontSize: 12 }}>{v.conductor}</td>
                  <td><OVBadge estado={v.estado}/></td>
                  <td style={{ textAlign: 'right', fontSize: 12 }}>{v.km_real != null ? `${v.km_real} km` : '—'}</td>
                  <td style={{ textAlign: 'right', fontSize: 12 }}>{v.costo_total != null ? fmtUSD(v.costo_total) : '—'}</td>
                  <td>
                    {v.estado === 'en_ruta' && (
                      <button className="btn btn-sm btn-cyan" style={{ fontSize: 11 }} onClick={() => onNav('transporte-ruta')}>
                        Hoja de ruta
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FooterBrand/>
    </div>
  );
};

// ── 3. CrearOVPage ────────────────────────────────────────────────────────────

export const CrearOVPage = ({ onNav }) => {
  const unidades      = ZAHORY_SAC_DATA.unidades_transporte || [];
  const rutas         = ZAHORY_SAC_DATA.rutas_maestro || [];
  const contratos     = ZAHORY_SAC_DATA.contratos_transporte || [];
  const otsData       = ZAHORY_SAC_DATA.otsDashboard || [];
  const ctrRental     = ZAHORY_SAC_DATA.contratos_rental || [];

  const [form, setForm] = useState({
    tipo_operacion: 'propio',
    vinculo_tipo: 'contrato',
    vinculo_id: '',
    cliente_id: '',
    contrato_id: '',
    ruta_id: '',
    origen: '',
    destino: '',
    km_planificado: '',
    tiempo_estimado: '',
    guardar_ruta: false,
    unidad_origen: 'propia',
    unidad_id: '',
    conductor: '',
    proveedor: '',
    conductor_tercero: '',
    carga_descripcion: '',
    peso_kg: '',
    fecha_programada: TODAY,
    hora_salida: '',
    obs: '',
  });

  const [openSecs, setOpenSecs] = useState({ tipo: true, ruta: true, unidad: true, carga: true });
  const toggleSec = (k) => setOpenSecs(p => ({ ...p, [k]: !p[k] }));
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onRutaChange = (rutaId) => {
    const r = rutas.find(r => r.id === rutaId);
    if (r) {
      setForm(f => ({ ...f, ruta_id: rutaId, origen: r.origen, destino: r.destino, km_planificado: r.km_estandar, tiempo_estimado: r.tiempo_estimado_hrs }));
    } else {
      set('ruta_id', '');
    }
  };

  const unidadesDisponibles = unidades.filter(u => u.origen === 'propia' && u.estado === 'disponible');
  const nextId = (ZAHORY_SAC_DATA.ordenes_viaje || []).length + 1;
  const codigoOV = `OV-${new Date().getFullYear()}-${String(nextId).padStart(3, '0')}`;

  const Section = ({ id, title, icon, children }) => (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-header" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSec(id)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name={icon} size={14}/>
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <div className="spacer"/>
        <Icon name={openSecs[id] ? 'chevDown' : 'chev'} size={14}/>
      </div>
      {openSecs[id] && <div className="card-body" style={{ paddingTop: 0 }}>{children}</div>}
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Nueva Orden de Viaje</h1>
          <div className="sub">Código asignado: <strong>{codigoOV}</strong></div>
        </div>
        <div className="spacer"/>
        <button className="btn" onClick={() => onNav('transporte-viajes')}>
          <Icon name="back" size={14}/> Volver
        </button>
      </div>

      {/* Sección 1 — Tipo */}
      <Section id="tipo" title="Tipo de operación" icon="briefcase">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { value: 'propio',     label: 'Transporte propio',     sub: 'Costo se carga a OT o contrato' },
            { value: 'comercial',  label: 'Transporte comercial',  sub: 'Genera ciclo comercial facturable' },
          ].map(opt => (
            <label key={opt.value} style={{
              flex: 1, border: `2px solid ${form.tipo_operacion === opt.value ? 'var(--cyan)' : 'var(--card-border)'}`,
              borderRadius: 8, padding: 12, cursor: 'pointer',
              background: form.tipo_operacion === opt.value ? 'rgba(0,188,212,0.06)' : undefined,
            }}>
              <input type="radio" name="tipo_operacion" value={opt.value}
                checked={form.tipo_operacion === opt.value}
                onChange={e => set('tipo_operacion', e.target.value)}
                style={{ marginRight: 8 }}
              />
              <strong>{opt.label}</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{opt.sub}</div>
            </label>
          ))}
        </div>

        {form.tipo_operacion === 'propio' && (
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Vinculado a</label>
              <select className="form-control" value={form.vinculo_tipo} onChange={e => set('vinculo_tipo', e.target.value)}>
                <option value="ot">Orden de Trabajo</option>
                <option value="contrato">Contrato de alquiler</option>
              </select>
            </div>
            <div>
              <label className="form-label">
                {form.vinculo_tipo === 'ot' ? 'Orden de Trabajo' : 'Contrato'} <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <select className="form-control" value={form.vinculo_id} onChange={e => set('vinculo_id', e.target.value)}>
                <option value="">— Seleccionar —</option>
                {form.vinculo_tipo === 'ot'
                  ? otsData.map(o => <option key={o.codigo} value={o.codigo}>{o.codigo} · {o.eq}</option>)
                  : ctrRental.map(c => <option key={c.id} value={c.id}>{c.id} · {c.cliente_nombre || c.cliente_id}</option>)
                }
              </select>
            </div>
          </div>
        )}

        {form.tipo_operacion === 'comercial' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Cliente</label>
              <select className="form-control" value={form.cliente_id} onChange={e => set('cliente_id', e.target.value)}>
                <option value="">— Seleccionar —</option>
                {[...new Set(contratos.map(c => c.cliente_id))].map(cid => (
                  <option key={cid} value={cid}>{contratos.find(c => c.cliente_id === cid)?.cliente_nombre || cid}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Contrato de transporte</label>
              <select className="form-control" value={form.contrato_id} onChange={e => set('contrato_id', e.target.value)}>
                <option value="">— Seleccionar —</option>
                {contratos.filter(c => !form.cliente_id || c.cliente_id === form.cliente_id).map(c => (
                  <option key={c.id} value={c.id}>{c.id} · {TIPO_TARIFA_LABEL[c.tipo_tarifa]}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Section>

      {/* Sección 2 — Ruta */}
      <Section id="ruta" title="Ruta" icon="arrow">
        <div style={{ marginBottom: 12 }}>
          <label className="form-label">Ruta predefinida (Maestro Rutas)</label>
          <select className="form-control" value={form.ruta_id} onChange={e => onRutaChange(e.target.value)}>
            <option value="">— Ingresar manualmente —</option>
            {rutas.map(r => <option key={r.id} value={r.id}>{r.nombre} · {r.km_estandar} km</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label className="form-label">Origen</label>
            <input className="form-control" value={form.origen} onChange={e => set('origen', e.target.value)} placeholder="Ej. Taller Zahory — Ate, Lima"/>
          </div>
          <div>
            <label className="form-label">Destino</label>
            <input className="form-control" value={form.destino} onChange={e => set('destino', e.target.value)} placeholder="Ej. Unidad Minera La Oroya"/>
          </div>
          <div>
            <label className="form-label">Km planificado</label>
            <input className="form-control" type="number" value={form.km_planificado} onChange={e => set('km_planificado', e.target.value)} placeholder="km"/>
          </div>
          <div>
            <label className="form-label">Tiempo estimado (hrs)</label>
            <input className="form-control" type="number" step="0.5" value={form.tiempo_estimado} onChange={e => set('tiempo_estimado', e.target.value)} placeholder="horas"/>
          </div>
        </div>
        {!form.ruta_id && (form.origen || form.destino) && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.guardar_ruta} onChange={e => set('guardar_ruta', e.target.checked)}/>
            Guardar esta ruta para uso futuro
          </label>
        )}
      </Section>

      {/* Sección 3 — Unidad */}
      <Section id="unidad" title="Unidad y conductor" icon="equipment">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { value: 'propia',      label: 'Unidad propia' },
            { value: 'tercerizada', label: 'Unidad tercerizada' },
          ].map(opt => (
            <label key={opt.value} style={{
              flex: 1, border: `2px solid ${form.unidad_origen === opt.value ? 'var(--cyan)' : 'var(--card-border)'}`,
              borderRadius: 8, padding: 10, cursor: 'pointer',
              background: form.unidad_origen === opt.value ? 'rgba(0,188,212,0.06)' : undefined,
            }}>
              <input type="radio" name="unidad_origen" value={opt.value}
                checked={form.unidad_origen === opt.value}
                onChange={e => set('unidad_origen', e.target.value)}
                style={{ marginRight: 8 }}
              />
              <strong>{opt.label}</strong>
            </label>
          ))}
        </div>

        {form.unidad_origen === 'propia' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Unidad (solo disponibles)</label>
              <select className="form-control" value={form.unidad_id} onChange={e => set('unidad_id', e.target.value)}>
                <option value="">— Seleccionar —</option>
                {unidadesDisponibles.map(u => (
                  <option key={u.id} value={u.id}>{u.placa} · {TIPO_UNIDAD_LABEL[u.tipo] || u.tipo}</option>
                ))}
              </select>
              {unidades.some(u => u.origen === 'propia' && u.estado === 'en_mantenimiento') && (
                <div style={{ fontSize: 11, color: 'var(--orange)', marginTop: 4 }}>
                  <Icon name="alert" size={11}/> Algunas unidades propias están en mantenimiento.
                </div>
              )}
            </div>
            <div>
              <label className="form-label">Conductor Zahory</label>
              <input
                className="form-control"
                value={form.conductor || (unidades.find(u => u.id === form.unidad_id)?.conductor_default || '')}
                onChange={e => set('conductor', e.target.value)}
                placeholder="Nombre del conductor"
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Proveedor de transporte homologado</label>
              <select className="form-control" value={form.proveedor} onChange={e => set('proveedor', e.target.value)}>
                <option value="">— Seleccionar —</option>
                <option value="PROV-TRANS-001">PROV-TRANS-001 · Transportes Andinos SAC</option>
              </select>
            </div>
            <div>
              <label className="form-label">Conductor del proveedor</label>
              <input className="form-control" value={form.conductor_tercero} onChange={e => set('conductor_tercero', e.target.value)} placeholder="Nombre del conductor"/>
            </div>
          </div>
        )}
      </Section>

      {/* Sección 4 — Carga */}
      <Section id="carga" title="Carga y programación" icon="box">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Descripción de carga o equipo transportado</label>
            <input className="form-control" value={form.carga_descripcion} onChange={e => set('carga_descripcion', e.target.value)} placeholder="Ej. LHD R1600G-001 — traslado post-mantenimiento"/>
          </div>
          <div>
            <label className="form-label">Peso estimado (kg)</label>
            <input className="form-control" type="number" value={form.peso_kg} onChange={e => set('peso_kg', e.target.value)} placeholder="kg"/>
          </div>
          <div>
            <label className="form-label">Fecha programada de salida</label>
            <input className="form-control" type="date" value={form.fecha_programada} onChange={e => set('fecha_programada', e.target.value)}/>
          </div>
          <div>
            <label className="form-label">Hora de salida programada</label>
            <input className="form-control" type="time" value={form.hora_salida} onChange={e => set('hora_salida', e.target.value)}/>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Observaciones</label>
            <textarea className="form-control" rows={2} value={form.obs} onChange={e => set('obs', e.target.value)} placeholder="Instrucciones especiales, restricciones, etc."/>
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 24 }}>
        <button className="btn" onClick={() => onNav('transporte-viajes')}>Cancelar</button>
        <button className="btn btn-cyan" onClick={() => { alert(`Orden de Viaje ${codigoOV} creada.`); onNav('transporte-viajes'); }}>
          <Icon name="check" size={14}/> Crear Orden de Viaje
        </button>
      </div>

      <FooterBrand/>
    </div>
  );
};

// ── 4. HojaDeRuta ─────────────────────────────────────────────────────────────

export const HojaDeRuta = ({ onNav }) => {
  const ovs = ZAHORY_SAC_DATA.ordenes_viaje || [];
  const ovActual = ovs.find(v => v.estado === 'en_ruta') || ovs[0];

  const [fase, setFase]               = useState('salida');
  const [kmInicial, setKmInicial]     = useState('');
  const [kmFinal, setKmFinal]         = useState('');
  const [combustible, setCombustible] = useState('');
  const [peajes, setPeajes]           = useState('');
  const [destinatario, setDestinatario] = useState('');

  if (!ovActual) {
    return (
      <div className="page">
        <div className="page-header"><div><h1>Hoja de Ruta</h1></div></div>
        <div className="card"><div className="card-body muted" style={{ textAlign: 'center', padding: 40 }}>No hay viajes activos.</div></div>
        <FooterBrand/>
      </div>
    );
  }

  const kmRecorridos = kmFinal && kmInicial ? Number(kmFinal) - Number(kmInicial) : null;
  const costoTotal   = (Number(combustible) || 0) + (Number(peajes) || 0) + (ovActual.costo_tercero || 0);
  const margen       = ovActual.ingreso_estimado != null ? ovActual.ingreso_estimado - costoTotal : null;

  const TABS = [
    { id: 'salida',  label: 'Salida',            icon: 'arrow'  },
    { id: 'en_ruta', label: 'En ruta',            icon: 'mine'   },
    { id: 'llegada', label: 'Llegada',            icon: 'check'  },
    { id: 'cierre',  label: 'Cierre económico',   icon: 'chart'  },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Hoja de Ruta</h1>
          <div className="sub">{ovActual.id} · {ovActual.origen?.split('—')[0]?.trim()} → {ovActual.destino?.split('—')[0]?.trim()}</div>
        </div>
        <div className="spacer"/>
        <OVBadge estado={ovActual.estado}/>
        <button className="btn" style={{ marginLeft: 8 }} onClick={() => onNav('transporte-viajes')}>
          <Icon name="back" size={14}/> Volver
        </button>
      </div>

      {/* Cabecera */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {[
              ['Código OV',      ovActual.id],
              ['Unidad',         ovActual.unidad_id],
              ['Conductor',      ovActual.conductor],
              ['Fecha',          fmtDate(ovActual.fecha_programada)],
              ['Km planificado', `${ovActual.km_planificado} km`],
              ['Tipo',           ovActual.tipo_operacion === 'comercial' ? 'Comercial' : 'Propio'],
            ].map(([lbl, val]) => (
              <MetaField key={lbl} label={lbl} value={val}/>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} className={`btn${fase === t.id ? ' btn-cyan' : ''}`} style={{ fontSize: 12 }} onClick={() => setFase(t.id)}>
            <Icon name={t.icon} size={13}/> {t.label}
          </button>
        ))}
      </div>

      {/* Salida */}
      {fase === 'salida' && (
        <div className="card">
          <div className="card-header"><h3>Registro de Salida</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 480 }}>
              <div>
                <label className="form-label">Km inicial (odómetro)</label>
                <input className="form-control" type="number" value={kmInicial} onChange={e => setKmInicial(e.target.value)} placeholder="km"/>
              </div>
              <div>
                <label className="form-label">Hora de salida real</label>
                <input className="form-control" type="time" defaultValue={ovActual.hora_salida}/>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Foto del odómetro</label>
                <div style={{ border: '2px dashed var(--card-border)', borderRadius: 8, padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  <Icon name="camera" size={24}/>
                  <div style={{ marginTop: 8 }}>Tomar foto o cargar imagen</div>
                  <input type="file" accept="image/*" capture="environment" style={{ display: 'block', margin: '8px auto 0' }}/>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-cyan" onClick={() => setFase('en_ruta')}>
                <Icon name="arrow" size={14}/> Iniciar viaje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En ruta */}
      {fase === 'en_ruta' && (
        <div className="card">
          <div className="card-header"><h3>Registro en Ruta</h3></div>
          <div className="card-body">
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Combustible cargado</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 480 }}>
                <div>
                  <label className="form-label">Galones</label>
                  <input className="form-control" type="number" step="0.5" placeholder="gal"/>
                </div>
                <div>
                  <label className="form-label">Costo (USD)</label>
                  <input className="form-control" type="number" step="0.01" placeholder="$"/>
                </div>
                <div>
                  <label className="form-label">Estación</label>
                  <input className="form-control" placeholder="Nombre"/>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Registrar incidente (opcional)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 480 }}>
                <div>
                  <label className="form-label">Tipo</label>
                  <select className="form-control">
                    <option value="">— Sin incidentes —</option>
                    <option>Mecánico</option>
                    <option>Accidente</option>
                    <option>Demora externa</option>
                    <option>Clima</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Descripción</label>
                  <input className="form-control" placeholder="Descripción breve"/>
                </div>
              </div>
            </div>
            <button className="btn btn-cyan" onClick={() => setFase('llegada')}>
              <Icon name="check" size={14}/> Registrar llegada
            </button>
          </div>
        </div>
      )}

      {/* Llegada */}
      {fase === 'llegada' && (
        <div className="card">
          <div className="card-header"><h3>Registro de Llegada</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 480 }}>
              <div>
                <label className="form-label">Km final (odómetro)</label>
                <input className="form-control" type="number" value={kmFinal} onChange={e => setKmFinal(e.target.value)} placeholder="km"/>
              </div>
              <div>
                <label className="form-label">Hora de llegada real</label>
                <input className="form-control" type="time"/>
              </div>
              <div>
                <label className="form-label">Destinatario</label>
                <input className="form-control" value={destinatario} onChange={e => setDestinatario(e.target.value)} placeholder="Nombre de quien recibe"/>
              </div>
              <div>
                <label className="form-label">Código de conformidad</label>
                <input className="form-control" placeholder="Código o referencia"/>
              </div>
              {kmRecorridos != null && (
                <div style={{ gridColumn: 'span 2', padding: '12px 14px', background: 'rgba(0,188,212,0.06)', borderRadius: 8, border: '1px solid rgba(0,188,212,0.2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Km recorridos calculados</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{kmRecorridos} km</div>
                  {ovActual.km_planificado && (
                    <div style={{ fontSize: 11, marginTop: 2, color: Math.abs(kmRecorridos - ovActual.km_planificado) / ovActual.km_planificado > 0.1 ? 'var(--orange)' : 'var(--green)' }}>
                      {kmRecorridos > ovActual.km_planificado ? '+' : ''}{kmRecorridos - ovActual.km_planificado} km vs planificado ({ovActual.km_planificado} km)
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-cyan" onClick={() => setFase('cierre')}>
                <Icon name="check" size={14}/> Registrar llegada → ir a cierre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cierre económico */}
      {fase === 'cierre' && (
        <div className="card">
          <div className="card-header"><h3>Cierre Económico</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 480, marginBottom: 16 }}>
              <div>
                <label className="form-label">Combustible total (USD)</label>
                <input className="form-control" type="number" step="0.01" value={combustible} onChange={e => setCombustible(e.target.value)} placeholder="$"/>
              </div>
              <div>
                <label className="form-label">Peajes (USD)</label>
                <input className="form-control" type="number" step="0.01" value={peajes} onChange={e => setPeajes(e.target.value)} placeholder="$"/>
              </div>
              {ovActual.costo_tercero != null && ovActual.costo_tercero > 0 && (
                <div>
                  <label className="form-label">Costo tercero (USD)</label>
                  <input className="form-control" readOnly value={fmtUSD(ovActual.costo_tercero)}/>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, padding: '14px 16px', background: 'rgba(0,0,0,0.03)', borderRadius: 8, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Costo total viaje</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{fmtUSD(costoTotal)}</div>
              </div>
              {ovActual.tipo_operacion === 'comercial' && ovActual.ingreso_estimado != null && (
                <>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingreso estimado</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>{fmtUSD(ovActual.ingreso_estimado)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Margen bruto</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: (margen || 0) >= 0 ? 'var(--green)' : 'var(--red)', marginTop: 4 }}>{fmtUSD(margen)}</div>
                  </div>
                </>
              )}
              {ovActual.tipo_operacion === 'propio' && (
                <div style={{ gridColumn: 'span 2', fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
                  Costo se registrará como gasto en {ovActual.vinculo_tipo === 'ot' ? 'OT' : 'contrato'} {ovActual.vinculo_id}
                </div>
              )}
            </div>

            <button className="btn btn-cyan" onClick={() => { alert('Viaje cerrado.'); onNav('transporte-viajes'); }}>
              <Icon name="check" size={14}/> Cerrar viaje
            </button>
          </div>
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};

// ── 5. MaestroRutas ───────────────────────────────────────────────────────────

export const MaestroRutas = () => {
  const rutas = ZAHORY_SAC_DATA.rutas_maestro || [];
  const ovs   = ZAHORY_SAC_DATA.ordenes_viaje || [];

  const [selectedId, setSelectedId] = useState(rutas[0]?.id || null);

  const rutaSel = rutas.find(r => r.id === selectedId);

  const kmPromedio = (() => {
    const con = ovs.filter(v => v.km_real);
    if (!con.length) return null;
    return Math.round(con.reduce((s, v) => s + v.km_real, 0) / con.length);
  })();

  const rutaFrecNombre = (() => {
    const counts = {};
    ovs.forEach(v => { if (v.ruta_id) counts[v.ruta_id] = (counts[v.ruta_id] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? rutas.find(r => r.id === top[0])?.nombre || top[0] : '—';
  })();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Maestro de Rutas</h1>
          <div className="sub">Catálogo de rutas predefinidas y tarifas por tipo de unidad</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan">
          <Icon name="plus" size={14}/> Nueva ruta
        </button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-value">{rutas.length}</div>
          <div className="kpi-label">Rutas predefinidas</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ fontSize: 14 }}>{rutaFrecNombre}</div>
          <div className="kpi-label">Ruta más frecuente</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{kmPromedio != null ? `${kmPromedio} km` : '—'}</div>
          <div className="kpi-label">Km promedio por viaje</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
        {/* Tabla */}
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nombre de ruta</th><th>Km estándar</th><th>Tiempo est.</th><th>Tarifas</th></tr>
              </thead>
              <tbody>
                {rutas.map(r => (
                  <tr key={r.id}
                    style={{ cursor: 'pointer', background: selectedId === r.id ? 'rgba(0,188,212,0.06)' : undefined }}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <td>
                      <div style={{ fontWeight: 700 }}>{r.nombre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.tipo_carga_habitual}</div>
                    </td>
                    <td>{r.km_estandar} km</td>
                    <td>{r.tiempo_estimado_hrs} hrs</td>
                    <td><span className="badge cyan" style={{ fontSize: 10 }}>{r.tarifas?.length || 0} tarifas</span></td>
                  </tr>
                ))}
                {!rutas.length && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Sin rutas definidas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel lateral */}
        {rutaSel && (
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: 14 }}>{rutaSel.nombre}</h3>
              <button className="btn btn-sm btn-ghost" style={{ marginLeft: 'auto' }}><Icon name="edit" size={13}/></button>
            </div>
            <div className="card-body">
              {[
                ['Origen',          rutaSel.origen],
                ['Destino',         rutaSel.destino],
                ['Km estándar',     `${rutaSel.km_estandar} km`],
                ['Tiempo estimado', `${rutaSel.tiempo_estimado_hrs} hrs`],
                ['Carga habitual',  rutaSel.tipo_carga_habitual],
              ].map(([lbl, val]) => (
                <MetaField key={lbl} label={lbl} value={val}/>
              ))}

              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 12, marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
                  Tarifas por tipo de unidad
                </div>
                {(rutaSel.tarifas || []).map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--card-border)', fontSize: 13 }}>
                    <span>{TIPO_UNIDAD_LABEL[t.tipo_unidad] || t.tipo_unidad}</span>
                    <strong>{t.moneda} {t.tarifa_por_km}/km</strong>
                  </div>
                ))}
                {!rutaSel.tarifas?.length && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sin tarifas definidas.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <FooterBrand/>
    </div>
  );
};

// ── 6. LiquidacionTransporte ──────────────────────────────────────────────────

export const LiquidacionTransporte = () => {
  const ovs       = ZAHORY_SAC_DATA.ordenes_viaje || [];
  const contratos = ZAHORY_SAC_DATA.contratos_transporte || [];

  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [estadoLiq, setEstadoLiq]         = useState('borrador');

  const comerciales = ovs.filter(v =>
    v.tipo_operacion === 'comercial' &&
    (v.estado === 'completada' || v.estado === 'cerrada') &&
    (filtroCliente === 'todos' || v.cliente_id === filtroCliente)
  );

  const totalKm       = comerciales.reduce((s, v) => s + (v.km_real ?? v.km_planificado ?? 0), 0);
  const totalFacturar = comerciales.reduce((s, v) => s + (v.ingreso_estimado || 0), 0);
  const clientes      = [...new Set(ovs.filter(v => v.cliente_id).map(v => v.cliente_id))];

  const LIQ_FLOW   = ['borrador', 'enviada', 'aprobada', 'facturada'];
  const LIQ_BADGES = { borrador: 'slate', enviada: 'cyan', aprobada: 'orange', facturada: 'green' };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Liquidación de Transporte</h1>
          <div className="sub">Agrupación de viajes comerciales por cliente y período</div>
        </div>
        <div className="spacer"/>
        {comerciales.length > 0 && estadoLiq === 'borrador' && (
          <button className="btn btn-cyan" onClick={() => setEstadoLiq('enviada')}>
            <Icon name="report" size={14}/> Enviar al cliente
          </button>
        )}
      </div>

      {/* Flujo de estados */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Estado:</span>
            {LIQ_FLOW.map((s, i) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <Icon name="arrow" size={12} style={{ color: 'var(--text-muted)' }}/>}
                <span
                  className={`badge ${LIQ_BADGES[s]}`}
                  style={{ cursor: 'pointer', opacity: estadoLiq === s ? 1 : 0.45, fontSize: 11 }}
                  onClick={() => setEstadoLiq(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon name="filter" size={14}/>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Cliente:</span>
            <select className="form-control" style={{ width: 220 }} value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)}>
              <option value="todos">Todos los clientes</option>
              {clientes.map(c => {
                const ctr = contratos.find(ct => ct.cliente_id === c);
                return <option key={c} value={c}>{ctr?.cliente_nombre || c}</option>;
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de viajes */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><h3>Viajes comerciales completados</h3></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código OV</th><th>Fecha</th><th>Ruta</th>
                <th>Km real</th><th>Tarifa aplicada</th><th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {!comerciales.length && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No hay viajes comerciales completados para liquidar.
                  </td>
                </tr>
              )}
              {comerciales.map(v => {
                const ctr = contratos.find(c => c.id === v.contrato_id);
                return (
                  <tr key={v.id}>
                    <td><strong>{v.id}</strong></td>
                    <td style={{ fontSize: 12 }}>{fmtDate(v.fecha_programada)}</td>
                    <td style={{ fontSize: 12, maxWidth: 200 }}>
                      <div>{v.origen?.split('—')[0]?.trim()}</div>
                      <div style={{ color: 'var(--text-muted)' }}>→ {v.destino?.split('—')[0]?.trim()}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {v.km_real != null ? `${v.km_real} km` : `${v.km_planificado} km (est.)`}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {ctr ? `${TIPO_TARIFA_LABEL[ctr.tipo_tarifa]} · ${ctr.tarifa_km || ctr.tarifa_base} ${ctr.moneda}` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmtUSD(v.ingreso_estimado)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen */}
      {comerciales.length > 0 && (
        <div className="card">
          <div className="card-header"><h3>Resumen de liquidación</h3></div>
          <div className="card-body">
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
              <div className="kpi-card">
                <div className="kpi-value">{comerciales.length}</div>
                <div className="kpi-label">Viajes del período</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-value">{totalKm.toLocaleString()} km</div>
                <div className="kpi-label">Km totales</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-value">{fmtUSD(totalFacturar)}</div>
                <div className="kpi-label">Total a facturar</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {estadoLiq === 'aprobada' && (
                <button className="btn btn-cyan" onClick={() => alert('Generando factura en módulo Facturación...')}>
                  <Icon name="report" size={14}/> Generar factura
                </button>
              )}
              {estadoLiq === 'enviada' && (
                <button className="btn btn-cyan" onClick={() => setEstadoLiq('aprobada')}>
                  <Icon name="check" size={14}/> Marcar como aprobada
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};
