import { useState } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';
import { ZAHORY_SAC_DATA } from '../data.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const TODAY = '2026-05-15';

const OF_STATES = {
  borrador:        { label: 'Borrador',           badge: 'slate'  },
  en_ingenieria:   { label: 'En ingeniería',       badge: 'purple' },
  cotizada:        { label: 'Cotizada',            badge: 'cyan'   },
  aprobada:        { label: 'Aprobada',            badge: 'cyan'   },
  en_planificacion:{ label: 'En planificación',    badge: 'cyan'   },
  en_ejecucion:    { label: 'En ejecución',        badge: 'orange' },
  en_qc:           { label: 'En QC',               badge: 'orange' },
  observada:       { label: 'Observada',           badge: 'red'    },
  lista_entrega:   { label: 'Lista para entrega',  badge: 'green'  },
  entregada:       { label: 'Entregada',           badge: 'green'  },
  cerrada:         { label: 'Cerrada',             badge: 'green'  },
};

// ── Shared helpers ────────────────────────────────────────────────────────────

const daysLeft = (fecha) => Math.ceil((new Date(fecha) - new Date(TODAY)) / 86400000);

const calcBOMCost = (bom) =>
  (bom || []).reduce((s, it) => s + Number(it.cantidad || 0) * Number(it.costo_unit || 0), 0);

const calcOFProgress = (of) => {
  const ops = of.operaciones || [];
  if (!ops.length) return 0;
  return Math.round(ops.filter(op => op.estado === 'aprobada').length / ops.length * 100);
};

// ── Shared sub-components ─────────────────────────────────────────────────────

const OFBadge = ({ estado }) => {
  const s = OF_STATES[estado] || { label: estado, badge: 'slate' };
  return <span className={`badge ${s.badge}`}><span className="dot"/>{s.label}</span>;
};

const SemaforoOF = ({ fecha }) => {
  const d = daysLeft(fecha);
  const color = d > 5 ? 'var(--green)' : d > 0 ? 'var(--orange)' : 'var(--red)';
  const label = d > 0 ? `${d}d` : `${Math.abs(d)}d venc.`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }}/>
      <span style={{ color, fontWeight: 700 }}>{label}</span>
    </span>
  );
};

const ProgressBar = ({ pct, color = 'var(--cyan)' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ flex: 1, height: 6, background: '#EEF2F6', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.3s' }}/>
    </div>
    <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 30, textAlign: 'right' }}>{pct}%</span>
  </div>
);

const MetaRow = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
  </div>
);

// ── 1. DashboardMaestranza ────────────────────────────────────────────────────

export const DashboardMaestranza = ({ onNav, setCurrentOF }) => {
  const ofs = ZAHORY_SAC_DATA.ordenes_fabricacion || [];
  const reclamos = ZAHORY_SAC_DATA.reclamos_garantia || [];
  const propuestas = ZAHORY_SAC_DATA.propuestas_ingenieria || [];

  const ACTIVE = ['en_ejecucion', 'en_qc', 'lista_entrega'];
  const ofActivas  = ofs.filter(o => ACTIVE.includes(o.estado));
  const ofVencidas = ofActivas.filter(o => daysLeft(o.fecha_compromiso) <= 0);
  const reclamosActivos = reclamos.filter(r => r.estado !== 'cerrado').length;
  const propuestasSinOF = propuestas.filter(p => p.estado === 'aprobada_por_cliente' && !p.of_generada_id);
  const ofMultiQC = ofs.filter(o => (o.historial_qc || []).filter(h => h.resultado === 'observada').length >= 2);

  const KPI_DARK = { background: 'linear-gradient(135deg,#0f172a,#1e2d45)', border: 'none' };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard Maestranza y Fab.</h1>
          <div className="sub">Seguimiento de Órdenes de Fabricación activas</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan" onClick={() => onNav('maestranza-crear-of')}>
          <Icon name="plus" size={14}/> Nueva OF
        </button>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi" style={KPI_DARK}>
          <div className="label" style={{ color: 'var(--slate-2)' }}>OFs Activas</div>
          <div className="value" style={{ color: 'white', fontSize: 32 }}>{ofActivas.length}</div>
          <div className="sub" style={{ color: 'var(--slate-2)' }}>Ejecución, QC o lista</div>
        </div>
        <div className={`kpi ${ofVencidas.length > 0 ? 'red-soft' : 'green-soft'}`}>
          <div className="label">Vencidas</div>
          <div className="value" style={{ color: ofVencidas.length > 0 ? 'var(--red)' : 'var(--green)' }}>{ofVencidas.length}</div>
          <div className="sub">Fecha compromiso excedida</div>
        </div>
        <div className="kpi" style={KPI_DARK}>
          <div className="label" style={{ color: 'var(--slate-2)' }}>Nuevas este mes</div>
          <div className="value" style={{ color: 'white' }}>{ofs.filter(o => o.fecha_apertura?.startsWith('2026-05')).length}</div>
          <div className="sub" style={{ color: 'var(--slate-2)' }}>OFs abiertas en mayo</div>
        </div>
        <div className={`kpi ${reclamosActivos > 0 ? 'red-soft' : ''}`}>
          <div className="label">Garantías activas</div>
          <div className="value" style={{ color: reclamosActivos > 0 ? 'var(--red)' : 'var(--navy)' }}>{reclamosActivos}</div>
          <div className="sub">Reclamos en proceso</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>OFs Activas</h3>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => onNav('maestranza-of')}>
            Ver todas
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Código</th><th>Cliente</th><th>Descripción</th>
                <th>Estado</th><th>Avance</th><th>Compromiso</th><th>Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {ofActivas.map(of => (
                <tr key={of.id} className="clickable" onClick={() => { setCurrentOF(of.id); onNav('maestranza-detalle-of'); }}>
                  <td><span className="ot-code">{of.codigo}</span></td>
                  <td>{of.cliente_nombre}</td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{of.descripcion}</td>
                  <td><OFBadge estado={of.estado}/></td>
                  <td style={{ minWidth: 130 }}><ProgressBar pct={calcOFProgress(of)}/></td>
                  <td>{of.fecha_compromiso}</td>
                  <td><SemaforoOF fecha={of.fecha_compromiso}/></td>
                </tr>
              ))}
              {ofActivas.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Sin OFs activas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(ofMultiQC.length > 0 || propuestasSinOF.length > 0) && (
        <div className="card">
          <div className="card-header"><h3>Alertas</h3></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ofMultiQC.map(of => (
              <div key={of.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--red-soft)', borderRadius: 6, borderLeft: '3px solid var(--red)', fontSize: 12 }}>
                <Icon name="alert" size={14}/>
                <span><strong>{of.codigo}</strong> — En QC con {(of.historial_qc || []).filter(h => h.resultado === 'observada').length} ciclo(s) de observación</span>
              </div>
            ))}
            {propuestasSinOF.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--orange-soft)', borderRadius: 6, borderLeft: '3px solid var(--orange)', fontSize: 12 }}>
                <Icon name="alert" size={14}/>
                <span><strong>{p.id}</strong> — Propuesta aprobada sin OF generada: {p.descripcion_problema}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};

// ── 2. BandejaMaestranza ──────────────────────────────────────────────────────

export const BandejaMaestranza = ({ onNav, setCurrentOF }) => {
  const ofs = ZAHORY_SAC_DATA.ordenes_fabricacion || [];
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  const filtered = ofs.filter(o => {
    if (filtroEstado && o.estado !== filtroEstado) return false;
    if (filtroCliente && !o.cliente_nombre.toLowerCase().includes(filtroCliente.toLowerCase())) return false;
    return true;
  });

  const goDetalle = (of, e) => {
    e?.stopPropagation();
    setCurrentOF(of.id);
    onNav('maestranza-detalle-of');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Órdenes de Fabricación</h1>
          <div className="sub">{ofs.length} OFs registradas</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan" onClick={() => onNav('maestranza-crear-of')}>
          <Icon name="plus" size={14}/> Nueva OF
        </button>
      </div>

      <div className="toolbar">
        <select className="input" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ minWidth: 170 }}>
          <option value="">Todos los estados</option>
          {Object.entries(OF_STATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input className="input" placeholder="Buscar cliente..." value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} style={{ minWidth: 200 }}/>
        <div className="spacer"/>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Código</th><th>Cliente</th><th>Descripción</th>
                <th>Estado</th><th>Avance</th><th>Apertura</th><th>Compromiso</th><th className="num">Precio OS</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(of => (
                <tr key={of.id} className="clickable" onClick={() => goDetalle(of)}>
                  <td><span className="ot-code">{of.codigo}</span></td>
                  <td>{of.cliente_nombre}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{of.descripcion}</td>
                  <td><OFBadge estado={of.estado}/></td>
                  <td style={{ minWidth: 120 }}><ProgressBar pct={calcOFProgress(of)}/></td>
                  <td>{of.fecha_apertura}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span>{of.fecha_compromiso}</span>
                      <SemaforoOF fecha={of.fecha_compromiso}/>
                    </div>
                  </td>
                  <td className="num">${(of.precio_os || 0).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={e => goDetalle(of, e)}>Ver</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <FooterBrand/>
    </div>
  );
};

// ── 3. CrearOFPage ────────────────────────────────────────────────────────────

const EMPTY_BOM_ITEM = () => ({ codigo: '', descripcion: '', cantidad: 1, unidad: 'und', costo_unit: 0, es_material_cliente: false });
const EMPTY_OP       = () => ({ descripcion: '', tecnico: '', horas_est: '', tiempo_estandar_id: null, horas_estandar: null, modificado: false, motivo_modificacion: '' });

export const CrearOFPage = ({ onNav }) => {
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    tienePlanos: null,
    descripcion_problema: '',
    cliente_id: '',
    os_id: '',
    descripcion: '',
    fecha_compromiso: '',
    precio_os: '',
    moneda: 'USD',
    anticipo: '',
    materiales_del_cliente: false,
    tipo_qc: '',
    bom: [],
    operaciones: [],
  });

  const patch = (updates) => setForm(prev => ({ ...prev, ...updates }));

  const addBOMItem = () => setForm(prev => ({ ...prev, bom: [...prev.bom, EMPTY_BOM_ITEM()] }));
  const removeBOMItem = (i) => setForm(prev => ({ ...prev, bom: prev.bom.filter((_, idx) => idx !== i) }));
  const updateBOM = (i, updates) => setForm(prev => ({
    ...prev,
    bom: prev.bom.map((it, idx) => idx === i ? { ...it, ...updates } : it),
  }));

  const addOperacion = () => setForm(prev => ({ ...prev, operaciones: [...prev.operaciones, EMPTY_OP()] }));
  const removeOp = (i) => setForm(prev => ({ ...prev, operaciones: prev.operaciones.filter((_, idx) => idx !== i) }));
  const updateOp = (i, updates) => setForm(prev => ({
    ...prev,
    operaciones: prev.operaciones.map((op, idx) => idx === i ? { ...op, ...updates } : op),
  }));

  const tiempos    = ZAHORY_SAC_DATA.tiempos_estandar || [];
  const criteriosQ = ZAHORY_SAC_DATA.criterios_qc || [];
  const clientes   = ZAHORY_SAC_DATA.clientes || [];
  const tecnicos   = ZAHORY_SAC_DATA.tecnicos || [];

  const totalBOM    = form.bom.reduce((s, it) => s + Number(it.cantidad || 0) * Number(it.costo_unit || 0), 0);
  const horasTotal  = form.operaciones.reduce((s, op) => s + Number(op.horas_est || 0), 0);

  const canNext = () => {
    if (paso === 1) return form.tienePlanos !== null;
    if (paso === 2) return Boolean(form.descripcion && form.fecha_compromiso && form.precio_os);
    return true;
  };

  const STEPS = ['Origen', 'Datos comerciales', 'BOM planificado', 'Operaciones', 'Confirmación'];

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('maestranza-of')}>
          <Icon name="back" size={14}/> Cancelar
        </button>
        <div>
          <h1>Nueva Orden de Fabricación</h1>
          <div className="sub">Paso {paso} de 5 — {STEPS[paso - 1]}</div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: paso > i + 1 ? 'var(--green)' : paso === i + 1 ? 'var(--navy)' : '#EEF2F6',
              color: paso >= i + 1 ? 'white' : 'var(--text-muted)',
              display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
            }}>
              {paso > i + 1 ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: paso > i + 1 ? 'var(--green)' : '#EEF2F6' }}/>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3>{STEPS[paso - 1]}</h3></div>
        <div className="card-body">

          {/* Paso 1 — Origen */}
          {paso === 1 && (
            <div>
              <div style={{ fontSize: 13, marginBottom: 16, color: 'var(--text-muted)' }}>
                ¿El cliente trae especificaciones (plano, muestra o medidas)?
              </div>
              <div className="toggle-pills">
                <button className={`toggle-pill${form.tienePlanos === true ? ' active' : ''}`} onClick={() => patch({ tienePlanos: true })}>
                  ✅ Sí, trae especificaciones
                </button>
                <button className={`toggle-pill${form.tienePlanos === false ? ' active' : ''}`} onClick={() => patch({ tienePlanos: false })}>
                  ❓ No, describe el problema
                </button>
              </div>
              {form.tienePlanos === false && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ padding: '10px 12px', background: 'var(--orange-soft)', borderRadius: 6, borderLeft: '3px solid var(--orange)', fontSize: 12, marginBottom: 12 }}>
                    Se generará una propuesta de ingeniería antes de crear la OF formal.
                  </div>
                  <div className="field">
                    <label>Descripción del problema</label>
                    <textarea className="input" rows={4} style={{ height: 'auto', resize: 'vertical', padding: '8px 10px' }}
                      value={form.descripcion_problema}
                      onChange={e => patch({ descripcion_problema: e.target.value })}
                      placeholder="Describa la falla, síntomas o necesidad del cliente..."/>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 2 — Datos comerciales */}
          {paso === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field">
                <label>Cliente *</label>
                <select className="input" value={form.cliente_id} onChange={e => patch({ cliente_id: e.target.value })}>
                  <option value="">-- Seleccionar --</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
                </select>
              </div>
              <div className="field">
                <label>OS / Contrato vinculado</label>
                <input className="input" value={form.os_id} onChange={e => patch({ os_id: e.target.value })} placeholder="OS-MAE-XXX"/>
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción del trabajo *</label>
                <input className="input" value={form.descripcion} onChange={e => patch({ descripcion: e.target.value })} placeholder="Fabricación de... / Reparación de..."/>
              </div>
              <div className="field">
                <label>Fecha compromiso *</label>
                <input type="date" className="input" value={form.fecha_compromiso} onChange={e => patch({ fecha_compromiso: e.target.value })}/>
              </div>
              <div className="field">
                <label>Tipo de QC</label>
                <select className="input" value={form.tipo_qc} onChange={e => patch({ tipo_qc: e.target.value })}>
                  <option value="">-- Sin tipo QC --</option>
                  {criteriosQ.map(c => <option key={c.id} value={c.id}>{c.tipo_trabajo}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Precio OS (USD) *</label>
                <input type="number" className="input" value={form.precio_os} onChange={e => patch({ precio_os: e.target.value })} placeholder="0"/>
              </div>
              <div className="field">
                <label>Anticipo (USD)</label>
                <input type="number" className="input" value={form.anticipo} onChange={e => patch({ anticipo: e.target.value })} placeholder="0"/>
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.materiales_del_cliente} onChange={e => patch({ materiales_del_cliente: e.target.checked })}/>
                  El cliente aporta materiales (no afectan inventario Zahory)
                </label>
              </div>
            </div>
          )}

          {/* Paso 3 — BOM */}
          {paso === 3 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {form.bom.length} ítem(s) · Total: ${totalBOM.toLocaleString()}
                </span>
                <button className="btn btn-secondary btn-sm" onClick={addBOMItem}>
                  <Icon name="plus" size={12}/> Agregar ítem
                </button>
              </div>
              {form.bom.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>
                  Sin materiales. Haga clic en "Agregar ítem".
                </div>
              ) : form.bom.map((it, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 65px 55px 90px auto', gap: 6, alignItems: 'center', padding: '8px 10px', background: '#F8FAFC', borderRadius: 6, border: '1px solid var(--card-border)', marginBottom: 6 }}>
                  <input className="input" style={{ height: 30, fontSize: 12 }} value={it.codigo} onChange={e => updateBOM(i, { codigo: e.target.value })} placeholder="Código"/>
                  <input className="input" style={{ height: 30, fontSize: 12 }} value={it.descripcion} onChange={e => updateBOM(i, { descripcion: e.target.value })} placeholder="Descripción del material"/>
                  <input type="number" className="input" style={{ height: 30, fontSize: 12 }} value={it.cantidad} onChange={e => updateBOM(i, { cantidad: e.target.value })} placeholder="Cant."/>
                  <input className="input" style={{ height: 30, fontSize: 12 }} value={it.unidad} onChange={e => updateBOM(i, { unidad: e.target.value })} placeholder="Und."/>
                  <input type="number" className="input" style={{ height: 30, fontSize: 12 }} value={it.costo_unit} onChange={e => updateBOM(i, { costo_unit: e.target.value })} placeholder="$ unit"/>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeBOMItem(i)}><Icon name="x" size={12}/></button>
                </div>
              ))}
            </div>
          )}

          {/* Paso 4 — Operaciones */}
          {paso === 4 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {form.operaciones.length} operación(es) · {horasTotal}h estimadas
                </span>
                <button className="btn btn-secondary btn-sm" onClick={addOperacion}>
                  <Icon name="plus" size={12}/> Agregar operación
                </button>
              </div>
              {form.operaciones.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>
                  Sin operaciones. Haga clic en "Agregar operación".
                </div>
              ) : form.operaciones.map((op, i) => (
                <div key={i} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid var(--card-border)', marginBottom: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px auto', gap: 8, alignItems: 'end' }}>
                    <div className="field">
                      <label>Descripción</label>
                      <input className="input" value={op.descripcion}
                        onChange={e => {
                          const desc = e.target.value;
                          const match = desc.length > 3 ? tiempos.find(t => t.operacion.toLowerCase().includes(desc.toLowerCase())) : null;
                          updateOp(i, match && !op.tiempo_estandar_id
                            ? { descripcion: desc, tiempo_estandar_id: match.id, horas_estandar: match.horas, horas_est: String(match.horas), modificado: false }
                            : { descripcion: desc });
                        }}
                        placeholder="Descripción de la operación"/>
                      {op.tiempo_estandar_id && (
                        <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                          <span className="badge cyan" style={{ fontSize: 10 }}>Estándar: {op.horas_estandar}h</span>
                          {op.modificado && <span className="badge orange" style={{ fontSize: 10 }}>Modificado</span>}
                        </div>
                      )}
                    </div>
                    <div className="field">
                      <label>Técnico asignado</label>
                      <select className="input" value={op.tecnico} onChange={e => updateOp(i, { tecnico: e.target.value })}>
                        <option value="">-- Seleccionar --</option>
                        {tecnicos.map(t => <option key={t.nombre} value={t.nombre}>{t.nombre}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Horas est.</label>
                      <input type="number" className="input" value={op.horas_est}
                        onChange={e => updateOp(i, {
                          horas_est: e.target.value,
                          modificado: op.horas_estandar != null && String(e.target.value) !== String(op.horas_estandar),
                        })}
                        placeholder="0"/>
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ marginBottom: 2 }} onClick={() => removeOp(i)}>
                      <Icon name="x" size={12}/>
                    </button>
                  </div>
                  {op.modificado && (
                    <div style={{ marginTop: 8 }}>
                      <input className="input" style={{ fontSize: 12 }} value={op.motivo_modificacion}
                        onChange={e => updateOp(i, { motivo_modificacion: e.target.value })}
                        placeholder="Motivo de modificación de horas respecto al estándar..."/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Paso 5 — Confirmación */}
          {paso === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <MetaRow label="Cliente" value={clientes.find(c => c.id === form.cliente_id)?.razonSocial || '—'}/>
                <MetaRow label="Descripción" value={form.descripcion || '—'}/>
                <MetaRow label="Fecha compromiso" value={form.fecha_compromiso || '—'}/>
                <MetaRow label="Precio OS" value={`$${Number(form.precio_os || 0).toLocaleString()}`}/>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1, padding: '12px 14px', background: '#F8FAFC', borderRadius: 6, border: '1px solid var(--card-border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>BOM — {form.bom.length} ítems</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>${totalBOM.toLocaleString()}</div>
                </div>
                <div style={{ flex: 1, padding: '12px 14px', background: '#F8FAFC', borderRadius: 6, border: '1px solid var(--card-border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Operaciones — {form.operaciones.length} ops.</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{horasTotal}h estimadas</div>
                </div>
              </div>
              <div style={{ padding: '12px 14px', background: 'var(--green-soft)', borderRadius: 6, border: '1px solid #CDE7CE' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1B5E20' }}>
                  Al confirmar se generará el código: <strong>OF-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 900) + 100)}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={() => paso > 1 ? setPaso(paso - 1) : onNav('maestranza-of')}>
            <Icon name="back" size={14}/> {paso === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          {paso < 5 ? (
            <button className="btn btn-primary" onClick={() => setPaso(paso + 1)} disabled={!canNext()}>
              Siguiente <Icon name="arrow" size={14}/>
            </button>
          ) : (
            <button className="btn btn-cyan" onClick={() => onNav('maestranza-of')}>
              <Icon name="check" size={14}/> Crear OF
            </button>
          )}
        </div>
      </div>
      <FooterBrand/>
    </div>
  );
};

// ── 4. DetalleOFPage ──────────────────────────────────────────────────────────

const computeQCResult = (criterio, val) => {
  if (!val?.valor) return null;
  const n = parseFloat(val.valor);
  if (criterio.valor_minimo != null && !isNaN(n)) return n >= criterio.valor_minimo ? 'aprobado' : 'rechazado';
  return val.resultado ?? null;
};

export const DetalleOFPage = ({ onNav, ofId }) => {
  const ofs = ZAHORY_SAC_DATA.ordenes_fabricacion || [];
  const of  = ofs.find(o => o.id === ofId) || ofs[0];

  const [tab, setTab]           = useState('ejecucion');
  const [qcValues, setQcValues] = useState({});

  if (!of) return (
    <div className="page">
      <div className="card"><div className="card-body" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>OF no encontrada</div></div>
    </div>
  );

  const criteriosQC = (() => {
    if (!of.tipo_qc) return [];
    return (ZAHORY_SAC_DATA.criterios_qc || []).find(c => c.id === of.tipo_qc)?.criterios || [];
  })();

  const pasaporte = (ZAHORY_SAC_DATA.pasaportes_componentes || [])
    .find(p => of.componente && p.numero_serie === of.componente.numero_serie);

  const getQV     = (id) => qcValues[id] || { valor: '', resultado: null };
  const setQV     = (id, updates) => setQcValues(prev => ({ ...prev, [id]: { ...getQV(id), ...updates } }));

  const allAprobados = criteriosQC.length > 0 && criteriosQC.every(c => computeQCResult(c, getQV(c.id)) === 'aprobado');

  const bomPlanCost = calcBOMCost(of.bom_planificado);
  const bomRealCost = calcBOMCost(of.bom_real);
  const desviacion  = bomRealCost - bomPlanCost;
  const desviPct    = bomPlanCost > 0 ? Math.round(desviacion / bomPlanCost * 100) : 0;
  const margenReal  = of.precio_os > 0 ? Math.round((of.precio_os - bomRealCost) / of.precio_os * 100) : 0;

  const TABS = [
    { id: 'ejecucion', label: 'Ejecución' },
    { id: 'bom',       label: 'BOM' },
    { id: 'qc',        label: 'Control QC' },
    { id: 'entrega',   label: 'Entrega' },
    { id: 'economico', label: 'Económico' },
    { id: 'pasaporte', label: 'Pasaporte' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('maestranza-of')}>
          <Icon name="back" size={14}/> Volver
        </button>
        <div>
          <h1>{of.codigo}</h1>
          <div className="sub">{of.cliente_nombre} · {of.descripcion}</div>
        </div>
        <div className="spacer"/>
        <OFBadge estado={of.estado}/>
        <SemaforoOF fecha={of.fecha_compromiso}/>
      </div>

      {/* Meta strip */}
      <div className="card" style={{ marginBottom: 14, padding: '12px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          <MetaRow label="Apertura"      value={of.fecha_apertura}/>
          <MetaRow label="Compromiso"    value={of.fecha_compromiso}/>
          <MetaRow label="Jefe Taller"   value={of.jefe_taller}/>
          <MetaRow label="Supervisor QC" value={of.supervisor_qc}/>
          <MetaRow label="Precio OS"     value={`$${(of.precio_os || 0).toLocaleString()}`}/>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <ProgressBar pct={calcOFProgress(of)} color={calcOFProgress(of) >= 80 ? 'var(--green)' : 'var(--cyan)'}/>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─ Tab: Ejecución ─ */}
      {tab === 'ejecucion' && (
        <div className="card">
          <div className="card-header"><h3>Operaciones</h3></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th><th>Descripción</th><th>Técnico</th>
                  <th className="num">H. Est.</th><th className="num">H. Real</th>
                  <th>Estado</th><th>Aprobado por</th>
                </tr>
              </thead>
              <tbody>
                {(of.operaciones || []).map(op => (
                  <tr key={op.id}>
                    <td><span className="mono">{op.id}</span></td>
                    <td>{op.descripcion}</td>
                    <td>{op.tecnico}</td>
                    <td className="num">{op.horas_est}h</td>
                    <td className="num">{op.horas_real > 0 ? `${op.horas_real}h` : '—'}</td>
                    <td>
                      <span className={`badge ${op.estado === 'aprobada' ? 'green' : op.estado === 'en_progreso' ? 'orange' : 'slate'}`}>
                        <span className="dot"/>
                        {op.estado === 'aprobada' ? 'Aprobada' : op.estado === 'en_progreso' ? 'En progreso' : 'Pendiente'}
                      </span>
                    </td>
                    <td>{op.aprobado_por || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─ Tab: BOM ─ */}
      {tab === 'bom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* BOM Planificado */}
          <div className="card">
            <div className="card-header">
              <h3>BOM Planificado</h3>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>Total: ${bomPlanCost.toLocaleString()}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr><th>Código</th><th>Descripción</th><th className="num">Cant.</th><th>Und.</th><th className="num">$/u</th><th className="num">Total</th></tr>
                </thead>
                <tbody>
                  {(of.bom_planificado || []).map((it, i) => (
                    <tr key={i} style={it.es_material_cliente ? { background: 'var(--cyan-soft)' } : {}}>
                      <td><span className="mono">{it.codigo}</span></td>
                      <td>
                        {it.descripcion}
                        {it.es_material_cliente && <span className="badge cyan" style={{ marginLeft: 6, fontSize: 9 }}>Mat. cliente</span>}
                      </td>
                      <td className="num">{it.cantidad}</td>
                      <td>{it.unidad}</td>
                      <td className="num">${it.costo_unit}</td>
                      <td className="num">${(it.cantidad * it.costo_unit).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOM Real */}
          <div className="card">
            <div className="card-header">
              <h3>BOM Real</h3>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                ${bomRealCost.toLocaleString()}
                {desviacion !== 0 && (
                  <span style={{ marginLeft: 6, color: desviacion > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                    ({desviacion > 0 ? '+' : ''}{desviacion.toLocaleString()} / {desviPct > 0 ? '+' : ''}{desviPct}%)
                  </span>
                )}
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr><th>Código</th><th>Descripción</th><th className="num">Cant.</th><th>Und.</th><th className="num">$/u</th><th className="num">Total</th></tr>
                </thead>
                <tbody>
                  {(of.bom_real || []).map((it, i) => {
                    const plan = (of.bom_planificado || []).find(p => p.codigo === it.codigo);
                    const hasDeviation = !plan || plan.cantidad !== it.cantidad;
                    return (
                      <tr key={i} style={hasDeviation ? { background: '#FFFDE7' } : it.es_material_cliente ? { background: 'var(--cyan-soft)' } : {}}>
                        <td><span className="mono">{it.codigo}</span></td>
                        <td>
                          <div>
                            {it.descripcion}
                            {it.es_material_cliente && <span className="badge cyan" style={{ marginLeft: 6, fontSize: 9 }}>Mat. cliente</span>}
                          </div>
                          {it.motivo_desviacion && (
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>↳ {it.motivo_desviacion}</div>
                          )}
                        </td>
                        <td className="num">{it.cantidad}</td>
                        <td>{it.unidad}</td>
                        <td className="num">${it.costo_unit}</td>
                        <td className="num">${(it.cantidad * it.costo_unit).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─ Tab: QC ─ */}
      {tab === 'qc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <h3>Criterios de Aceptación</h3>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{of.tipo_qc || 'Sin tipo QC definido'}</span>
            </div>
            {criteriosQC.length === 0 ? (
              <div className="card-body" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
                No se definió tipo de QC para esta OF.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr><th>Criterio</th><th>Valor mín.</th><th>Método</th><th>Valor registrado</th><th>Resultado</th></tr>
                  </thead>
                  <tbody>
                    {criteriosQC.map(c => {
                      const val    = getQV(c.id);
                      const result = computeQCResult(c, val);
                      return (
                        <tr key={c.id}>
                          <td>{c.descripcion}</td>
                          <td>{c.valor_minimo != null ? `${c.valor_minimo} ${c.unidad || ''}` : '—'}</td>
                          <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.metodo}</td>
                          <td>
                            <input type="number" className="input" style={{ width: 90, height: 28, fontSize: 12 }}
                              value={val.valor}
                              onChange={e => setQV(c.id, { valor: e.target.value })}
                              placeholder="—"/>
                          </td>
                          <td>
                            {result === 'aprobado'  && <span className="badge green"><span className="dot"/>Aprobado</span>}
                            {result === 'rechazado' && <span className="badge red"><span className="dot"/>Rechazado</span>}
                            {result == null         && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Pendiente</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ padding: '12px 18px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="btn btn-cyan" disabled={!allAprobados}>
                <Icon name="check" size={14}/> Aprobar OF
              </button>
              <button className="btn btn-secondary">Marcar como observada</button>
              {criteriosQC.length > 0 && !allAprobados && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hay criterios pendientes o rechazados</span>
              )}
            </div>
          </div>

          {(of.historial_qc || []).length > 0 && (
            <div className="card">
              <div className="card-header"><h3>Historial de Ciclos QC</h3></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {of.historial_qc.map((h, i) => (
                  <div key={i} style={{ padding: '10px 12px', border: '1px solid var(--card-border)', borderRadius: 6, borderLeft: '3px solid var(--red)' }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>{h.fecha}</span><span>·</span><span>{h.supervisor}</span>
                      <span className="badge red" style={{ marginLeft: 'auto' }}><span className="dot"/>Observada</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{h.motivo}</div>
                    {h.items_observados?.length > 0 && (
                      <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>Ítems: {h.items_observados.join(', ')}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─ Tab: Entrega ─ */}
      {tab === 'entrega' && (
        <div className="card">
          <div className="card-header"><h3>Registro de Entrega</h3></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
                Tipo de entrega
              </div>
              <div className="toggle-pills">
                <button className={`toggle-pill${of.tipo_entrega === 'entrega_fisica' ? ' active' : ''}`}>
                  📦 Entrega física al cliente
                </button>
                <button className={`toggle-pill${of.tipo_entrega === 'instalacion_en_equipo' ? ' active' : ''}`}>
                  🔧 Instalación en equipo
                </button>
              </div>
            </div>
            {of.tipo_entrega === 'entrega_fisica' && (
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Guía de remisión</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {(of.bom_real || of.bom_planificado || []).length} materiales incluidos en la guía
                </div>
              </div>
            )}
            {of.tipo_entrega === 'instalacion_en_equipo' && (
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>OT de instalación vinculada</div>
                {of.ot_instalacion_id
                  ? <span className="badge cyan"><span className="dot"/>{of.ot_instalacion_id}</span>
                  : <button className="btn btn-secondary btn-sm"><Icon name="plus" size={12}/> Generar OT de instalación</button>
                }
              </div>
            )}
            {!of.tipo_entrega && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                Disponible cuando la OF esté en estado "Lista para entrega".
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─ Tab: Económico ─ */}
      {tab === 'economico' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><h3>Costo BOM — Planificado vs. Real</h3></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr><th>Concepto</th><th className="num">Planificado</th><th className="num">Real</th><th className="num">Desviación</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Materiales (BOM)</td>
                    <td className="num">${bomPlanCost.toLocaleString()}</td>
                    <td className="num">${bomRealCost.toLocaleString()}</td>
                    <td className="num" style={{ color: desviacion > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
                      {desviacion > 0 ? '+' : ''}{desviacion.toLocaleString()} ({desviPct > 0 ? '+' : ''}{desviPct}%)
                    </td>
                  </tr>
                  <tr className="total-row">
                    <td>Total costo</td>
                    <td className="num">${bomPlanCost.toLocaleString()}</td>
                    <td className="num">${bomRealCost.toLocaleString()}</td>
                    <td className="num">{desviacion > 0 ? '+' : ''}{desviPct}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3>Cierre Comercial</h3></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr><th>Concepto</th><th className="num">USD</th></tr>
                </thead>
                <tbody>
                  <tr><td>Precio OS</td><td className="num">${(of.precio_os || 0).toLocaleString()}</td></tr>
                  <tr><td>Anticipo recibido</td><td className="num" style={{ color: 'var(--green)' }}>− ${(of.anticipo || 0).toLocaleString()}</td></tr>
                  <tr><td>Costo real (BOM)</td><td className="num" style={{ color: 'var(--red)' }}>− ${bomRealCost.toLocaleString()}</td></tr>
                  <tr className="total-row"><td>Margen bruto estimado</td><td className="num">{margenReal}%</td></tr>
                </tbody>
              </table>
            </div>
            {of.estado === 'entregada' && (
              <div style={{ padding: '10px 18px' }}>
                <button className="btn btn-cyan"><Icon name="report" size={14}/> Generar factura</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─ Tab: Pasaporte ─ */}
      {tab === 'pasaporte' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!of.componente ? (
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                Esta OF no tiene un componente identificado por número de serie.
              </div>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="card-header"><h3>Identificación del Componente</h3></div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    <MetaRow label="N° de serie"          value={of.componente.numero_serie}/>
                    <MetaRow label="Descripción"           value={of.componente.descripcion_componente}/>
                    <MetaRow label="Modelo compatible"     value={of.componente.modelo_equipo_compatible}/>
                    <MetaRow label="Tipo"                  value={of.componente.es_componente_nuevo ? 'Fabricación nueva' : 'Reparación'}/>
                    <MetaRow label="Aportado por cliente"  value={of.componente.ingresado_por_cliente ? 'Sí' : 'No'}/>
                    <MetaRow label="Propietario"           value={of.cliente_nombre}/>
                  </div>
                </div>
              </div>
              {pasaporte?.historial?.length > 0 && (
                <div className="card">
                  <div className="card-header"><h3>Historial de Intervenciones</h3></div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="tbl">
                      <thead>
                        <tr><th>OF</th><th>Fecha</th><th>Tipo</th><th>Trabajo realizado</th><th>Técnico</th><th>QC</th></tr>
                      </thead>
                      <tbody>
                        {pasaporte.historial.map((h, i) => (
                          <tr key={i}>
                            <td><span className="ot-code">{h.of_id}</span></td>
                            <td>{h.fecha}</td>
                            <td>{h.tipo}</td>
                            <td>{h.trabajo}</td>
                            <td>{h.tecnico}</td>
                            <td><span className="badge green"><span className="dot"/>Aprobado por {h.qc_aprobado_por}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding: '10px 18px' }}>
                    <button className="btn btn-secondary btn-sm"><Icon name="pdf" size={14}/> Imprimir pasaporte</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};

// ── 5. EstructurasBOM ─────────────────────────────────────────────────────────

export const EstructurasBOM = ({ onNav }) => {
  const ofs = ZAHORY_SAC_DATA.ordenes_fabricacion || [];
  const [search, setSearch]       = useState('');
  const [selectedId, setSelected] = useState(null);

  const filtered = ofs
    .filter(o => (o.bom_planificado || []).length > 0)
    .filter(o => !search || o.descripcion.toLowerCase().includes(search.toLowerCase()) || o.cliente_nombre.toLowerCase().includes(search.toLowerCase()));

  const detail = selectedId ? ofs.find(o => o.id === selectedId) : null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Estructuras BOM</h1>
          <div className="sub">BOMs planificados históricos — reutilizables como base para nuevas OFs</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 1fr' : '1fr', gap: 16 }}>
        <div>
          <div className="toolbar">
            <input className="input" placeholder="Buscar por descripción o cliente..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }}/>
          </div>
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr><th>OF</th><th>Descripción</th><th>Cliente</th><th>Fecha</th><th className="num">Mats.</th><th className="num">Costo Plan.</th><th>Tipo QC</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map(of => (
                    <tr key={of.id} className="clickable"
                      style={selectedId === of.id ? { background: 'var(--cyan-soft)' } : {}}
                      onClick={() => setSelected(of.id === selectedId ? null : of.id)}>
                      <td><span className="ot-code">{of.codigo}</span></td>
                      <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{of.descripcion}</td>
                      <td>{of.cliente_nombre}</td>
                      <td>{of.fecha_apertura}</td>
                      <td className="num">{(of.bom_planificado || []).length}</td>
                      <td className="num">${calcBOMCost(of.bom_planificado || []).toLocaleString()}</td>
                      <td>{of.tipo_qc || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setSelected(of.id); }}>
                          Ver BOM
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Sin resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {detail && (
          <div className="card">
            <div className="card-header">
              <h3>{detail.codigo} — BOM Planificado</h3>
              <button className="btn btn-cyan btn-sm" style={{ marginLeft: 'auto' }} onClick={() => onNav('maestranza-crear-of')}>
                Usar como base
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr><th>Código</th><th>Descripción</th><th className="num">Cant.</th><th>Und.</th><th className="num">$/u</th><th className="num">Total</th></tr>
                </thead>
                <tbody>
                  {(detail.bom_planificado || []).map((it, i) => (
                    <tr key={i}>
                      <td><span className="mono">{it.codigo}</span></td>
                      <td>{it.descripcion}</td>
                      <td className="num">{it.cantidad}</td>
                      <td>{it.unidad}</td>
                      <td className="num">${it.costo_unit}</td>
                      <td className="num">${(it.cantidad * it.costo_unit).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan={5}>Total</td>
                    <td className="num">${calcBOMCost(detail.bom_planificado || []).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {detail.tipo_qc && (
              <div style={{ padding: '10px 18px', borderTop: '1px solid var(--card-border)', fontSize: 12, color: 'var(--text-muted)' }}>
                Tipo QC asociado: <strong style={{ color: 'var(--navy)' }}>{detail.tipo_qc}</strong>
              </div>
            )}
          </div>
        )}
      </div>
      <FooterBrand/>
    </div>
  );
};

// ── 6. ControlDePiso ──────────────────────────────────────────────────────────

export const ControlDePiso = ({ onNav, setCurrentOF }) => {
  const ofs = (ZAHORY_SAC_DATA.ordenes_fabricacion || []).filter(o => o.estado === 'en_ejecucion');

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Control de Piso</h1>
          <div className="sub">Vista operativa del taller — {ofs.length} OF(s) en ejecución</div>
        </div>
      </div>

      {ofs.length === 0 && (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
            Sin OFs en ejecución actualmente.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {ofs.map(of => {
          const pct = calcOFProgress(of);
          return (
            <div key={of.id} className="card" style={{ cursor: 'pointer' }}
              onClick={() => { setCurrentOF(of.id); onNav('maestranza-detalle-of'); }}>
              <div className="card-header">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: 'var(--navy)' }}>{of.codigo}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{of.cliente_nombre}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <SemaforoOF fecha={of.fecha_compromiso}/>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>comp. {of.fecha_compromiso}</span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{of.descripcion}</div>
                <ProgressBar pct={pct} color={pct >= 80 ? 'var(--green)' : 'var(--cyan)'}/>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {(of.operaciones || []).map(op => (
                    <div key={op.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: '#F8FAFC', borderRadius: 6 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: op.estado === 'aprobada' ? 'var(--green)' : op.estado === 'en_progreso' ? 'var(--orange)' : '#D1D5DB',
                      }}/>
                      <span style={{ flex: 1, fontSize: 12 }}>{op.descripcion}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{op.tecnico}</span>
                      {op.estado === 'en_progreso' && (
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px', minHeight: 22 }}
                          onClick={e => e.stopPropagation()}>
                          Aprobar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FooterBrand/>
    </div>
  );
};
