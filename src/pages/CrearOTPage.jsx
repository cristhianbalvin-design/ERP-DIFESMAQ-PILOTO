import { useMemo, useState } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';
import { ZAHORY_SAC_DATA } from '../data.js';
import {
  NON_BILLABLE_CARGOS,
  getBlockedCargoReason,
  isCargoDisabledForTrabajo,
  validateOTForm,
  makeSegmento,
  makeOperacion,
  makeMOItem,
  makeRepuestoItem,
  makeTerceroItem,
  ESPECIALIDADES,
  calcSegmentoMO,
  calcSegmentoRepuestos,
  calcSegmentoTerceros,
  calcOTTotals,
} from '../schemas/otSchema.js';

const D = ZAHORY_SAC_DATA;
const NEW_OT_CODE = 'OT-2026-055';
const TODAY = new Date().toISOString().slice(0, 10);

export const OT_FORM_SCHEMA = {
  tipo_trabajo: ['Preventivo_PM', 'Correctivo', 'Acondicionamiento', 'Overhaul'],
  tipo_cargo: ['Cliente_Contrato', 'Interno_DIFESMAQ', 'Garantia_Fabrica', 'Reclamo_Rework'],
  required: ['cliente_id', 'contrato_id', 'equipo', 'lugar_ejecucion', 'tipo_trabajo', 'tipo_cargo', 'tecnico', 'descripcion'],
  conditional: {
    motivo_retrabajo: "required when tipo_cargo === 'Reclamo_Rework'",
    ingreso_facturable_usd: "forced to 0 when tipo_cargo in NON_BILLABLE_CARGOS",
  },
};

const TIPO_TRABAJO = [
  ['Preventivo_PM', 'Preventivo PM'],
  ['Correctivo', 'Correctivo'],
  ['Acondicionamiento', 'Acondicionamiento'],
  ['Overhaul', 'Overhaul'],
];

const TIPO_CARGO = [
  ['Cliente_Contrato', 'Cliente / Contrato'],
  ['Interno_DIFESMAQ', 'Interno DIFESMAQ'],
  ['Garantia_Fabrica', 'Garantia Fabrica'],
  ['Reclamo_Rework', 'Reclamo Rework'],
];

const LUGAR_EJECUCION = [
  ['Campo_Mina', 'Campo / Mina'],
  ['Taller', 'Taller'],
];

const cargoLabel = (v) => TIPO_CARGO.find(([c]) => c === v)?.[1] || v;
const trabajoLabel = (v) => TIPO_TRABAJO.find(([t]) => t === v)?.[1] || v;
const noFacturable = (cargo) => NON_BILLABLE_CARGOS.includes(cargo);

const inferUnidadMinera = (contrato) => {
  if (!contrato) return '';
  const m = contrato.descripcion?.match(/Unidad\s+(.+)$/i);
  if (m) return m[1].trim();
  return contrato.descripcion?.split('–').pop()?.trim() || contrato.cliente || '';
};

const hasValidSegment = (segs) =>
  segs.length > 0 && segs.every(s => s.descripcion && s.ot_operaciones.some(op => op.descripcion));

// ── Drawer de backlogs ─────────────────────────────────────────────────────

const BacklogDrawer = ({ open, equipo, selected, onClose, onToggle }) => {
  const rows = D.backlog.filter(b => !equipo || b.eq === equipo);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.35)', zIndex: 40, display: 'flex', justifyContent: 'flex-end' }}>
      <aside className="card" style={{ width: 460, maxWidth: '96vw', height: '100vh', borderRadius: 0, overflow: 'auto' }}>
        <div className="card-header" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <h3>Vincular Hallazgos / Backlog</h3>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={onClose}><Icon name="x" size={12}/></button>
        </div>
        <div style={{ padding: 14 }}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
            El backlog es adjunto técnico — ya no define el origen de la OT.
          </div>
          {rows.map(b => (
            <label key={b.bkl} style={{ display: 'block', border: '1px solid var(--card-border)', borderRadius: 8, padding: 10, marginBottom: 8, cursor: 'pointer', background: selected.includes(b.bkl) ? 'var(--green-soft)' : 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={selected.includes(b.bkl)} onChange={() => onToggle(b.bkl)} />
                <span className="ot-code">{b.bkl}</span>
                <span className="chip">{b.sistema}</span>
                <span className="badge" style={{ marginLeft: 'auto', background: b.prioridad === 'Emergencia' ? '#E53935' : 'var(--navy)', color: 'white' }}>{b.score}</span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.45, marginTop: 6 }}>{b.hallazgo}</div>
            </label>
          ))}
          {rows.length === 0 && <div className="muted" style={{ textAlign: 'center', padding: 30 }}>No hay backlogs para este equipo.</div>}
        </div>
      </aside>
    </div>
  );
};


const FinancialImpactBadge = ({ tipoCargo }) => {
  const internal = noFacturable(tipoCargo);
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 8,
      border: internal ? '1px solid #FFD9A8' : '1px solid #C8E6C9',
      background: internal ? 'var(--orange-soft)' : 'var(--green-soft)',
      fontSize: 12, fontWeight: 700,
      color: internal ? '#C15D00' : '#1B5E20',
    }}>
      <Icon name={internal ? 'alert' : 'check'} size={13}/>
      {' '}
      {internal ? 'Ingreso a facturar: $0.00 (Costo asumido internamente)' : 'Trabajo Facturable / Cubierto por Contrato'}
    </div>
  );
};

// ── Barra inferior fija (Sticky Bottom Bar) ────────────────────────────────

const StickyTotals = ({ segmentos, tipoCargo, ingreso, valid, onCancel, onSave }) => {
  const totals = useMemo(() => calcOTTotals(segmentos), [segmentos]);
  const ingresoNum = noFacturable(tipoCargo) ? 0 : Number(ingreso || 0);
  const margen = totals.total > 0 && ingresoNum > 0
    ? ((ingresoNum - totals.total) / ingresoNum * 100).toFixed(1)
    : null;
  const isInternal = noFacturable(tipoCargo);

  const Col = ({ label, value, color, text }) => (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '0 20px', borderRight: '1px solid var(--card-border)', minWidth: 0,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
      {text
        ? <div style={{ fontSize: 15, fontWeight: 700, color }}>{text}</div>
        : <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: color || (value > 0 ? 'var(--navy)' : 'var(--text-muted)') }}>${Number(value).toFixed(0)}</div>
      }
    </div>
  );

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 'var(--sidebar-w)', right: 0, zIndex: 50,
      background: 'white',
      borderTop: '1px solid var(--card-border)',
      boxShadow: '0 -10px 15px -3px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'stretch', height: 62,
    }}>

      {/* Columnas de desglose — cada una ocupa flex:1 */}
      <Col label="Mano de Obra"      value={totals.mo} />
      <Col label="Repuestos"         value={totals.repuestos} />
      <Col label="Terceros"          value={totals.terceros} />
      <Col
        label="Ingreso facturable"
        value={ingresoNum}
        color={isInternal ? 'var(--text-muted)' : 'var(--green)'}
        text={isInternal ? '—' : undefined}
      />
      {margen !== null && (
        <Col
          label="Margen"
          text={`${margen}%`}
          color={Number(margen) >= 0 ? 'var(--green)' : '#E53935'}
        />
      )}

      {/* Gran Total + badge + botones */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', flexShrink: 0,
        borderLeft: '2px solid var(--card-border)',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Gran Total OT</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>${totals.total.toFixed(0)}</div>
        </div>
        <div style={{
          padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
          background: isInternal ? 'var(--orange-soft)' : 'var(--green-soft)',
          color: isInternal ? '#C15D00' : '#1B5E20',
          border: isInternal ? '1px solid #FFD9A8' : '1px solid #C8E6C9',
          whiteSpace: 'nowrap',
        }}>
          <Icon name={isInternal ? 'alert' : 'check'} size={11}/>
          {' '}{isInternal ? 'Pérdida / Inversión' : 'Facturable'}
        </div>
        <div style={{ width: 1, height: 36, background: 'var(--card-border)' }} />
        <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary" disabled={!valid} onClick={onSave}>
          <Icon name="check" size={13}/> Guardar OT
        </button>
      </div>
    </div>
  );
};

// ── SegmentoCard: accordion con 3 tabs de estimación ──────────────────────

const SegmentoCard = ({ seg, isOnly, onPatch, onRemove, repuestosDB }) => {
  const [tab, setTab] = useState('mo');

  const patchEst = (tipo, idx, patch) =>
    onPatch({ [tipo]: seg[tipo].map((item, i) => i === idx ? { ...item, ...patch } : item) });
  const addEst = (tipo, factory) =>
    onPatch({ [tipo]: [...seg[tipo], factory()] });
  const removeEst = (tipo, idx) =>
    onPatch({ [tipo]: seg[tipo].filter((_, i) => i !== idx) });

  const addOp = () =>
    onPatch({ ot_operaciones: [...seg.ot_operaciones, makeOperacion(seg.ot_operaciones.length + 1)] });
  const removeOp = (oi) =>
    onPatch({ ot_operaciones: seg.ot_operaciones.filter((_, i) => i !== oi) });
  const patchOp = (oi, k, v) =>
    onPatch({ ot_operaciones: seg.ot_operaciones.map((op, i) => i === oi ? { ...op, [k]: v } : op) });

  const totalMO  = calcSegmentoMO(seg);
  const totalRep = calcSegmentoRepuestos(seg);
  const totalTer = calcSegmentoTerceros(seg);
  const totalSeg = totalMO + totalRep + totalTer;

  const TABS = [
    { id: 'mo',        label: 'MO',        total: totalMO  },
    { id: 'repuestos', label: 'Repuestos', total: totalRep },
    { id: 'terceros',  label: 'Terceros',  total: totalTer },
  ];

  const tabBtn = (t) => ({
    padding: '7px 14px', fontSize: 12, border: 'none', cursor: 'pointer', background: 'none',
    fontWeight: tab === t.id ? 700 : 400,
    borderBottom: tab === t.id ? '2px solid var(--cyan)' : '2px solid transparent',
    color: tab === t.id ? 'var(--cyan)' : 'var(--text-muted)',
  });

  return (
    <div style={{ border: '1px solid var(--card-border)', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>

      {/* ── Cabecera del segmento ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '66px 1fr auto auto', gap: 8, padding: '8px 12px', background: '#F0F4F8', borderBottom: '1px solid var(--card-border)', alignItems: 'center' }}>
        <input className="input" value={seg.codigo} placeholder="01"
          onChange={e => onPatch({ codigo: e.target.value })}
          style={{ textAlign: 'center', fontSize: 12, padding: 5 }} />
        <input className="input" value={seg.descripcion} placeholder="Descripción del segmento *"
          onChange={e => onPatch({ descripcion: e.target.value })}
          style={{ fontSize: 13 }} />
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, minWidth: 80, textAlign: 'right', color: totalSeg > 0 ? 'var(--navy)' : 'var(--text-muted)' }}>
          ${totalSeg.toFixed(0)}
        </span>
        {!isOnly && (
          <button className="btn btn-ghost btn-sm" style={{ color: '#E53935' }} onClick={onRemove} title="Eliminar segmento">
            <Icon name="x" size={12}/>
          </button>
        )}
      </div>

      {/* ── Operaciones ── */}
      <div style={{ padding: '8px 12px 6px', background: '#FAFCFF', borderBottom: '1px solid var(--card-border)' }}>
        {seg.ot_operaciones.map((op, oi) => (
          <div key={oi} style={{ display: 'grid', gridTemplateColumns: '16px 60px 1fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>↳</span>
            <input className="input" value={op.codigo} placeholder="01"
              onChange={e => patchOp(oi, 'codigo', e.target.value)}
              style={{ textAlign: 'center', fontSize: 12, padding: '4px 6px' }} />
            <input className="input" value={op.descripcion} placeholder="Descripción de la operación *"
              onChange={e => patchOp(oi, 'descripcion', e.target.value)}
              style={{ fontSize: 12, padding: '4px 8px' }} />
            {seg.ot_operaciones.length > 1 && (
              <button className="btn btn-ghost btn-sm" style={{ color: '#E53935', padding: '4px 6px' }}
                onClick={() => removeOp(oi)} title="Eliminar operación">
                <Icon name="x" size={11}/>
              </button>
            )}
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--cyan)' }} onClick={addOp}>
          <Icon name="plus" size={11}/> Agregar Operación
        </button>
      </div>

      {/* ── Tabs de estimación ── */}
      <div>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: '#F8FAFC' }}>
          {TABS.map(t => (
            <button key={t.id} style={tabBtn(t)} onClick={() => setTab(t.id)}>
              {t.label}
              <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.85 }}>${t.total.toFixed(0)}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: 12, minHeight: 80 }}>

          {/* MO Tab */}
          {tab === 'mo' && (
            <div>
              {seg.estimacion_mano_obra.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 64px 80px 24px', gap: 6, marginBottom: 4, fontSize: 11, color: 'var(--text-muted)', padding: '0 2px' }}>
                  <span>Especialidad</span>
                  <span style={{ textAlign: 'center' }}>Técnicos</span>
                  <span style={{ textAlign: 'center' }}>Horas</span>
                  <span style={{ textAlign: 'right' }}>Subtotal</span>
                  <span/>
                </div>
              )}
              {seg.estimacion_mano_obra.map((item, i) => {
                const esp = ESPECIALIDADES.find(e => e.id === item.especialidad_id);
                const costo = (esp?.tarifaUSD || 0) * Number(item.cantidad_tecnicos || 1) * Number(item.horas_estimadas || 0);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 56px 64px 80px 24px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <select className="input" value={item.especialidad_id}
                      onChange={e => patchEst('estimacion_mano_obra', i, { especialidad_id: e.target.value })}
                      style={{ fontSize: 12, padding: '4px 6px' }}>
                      <option value="">-- Especialidad --</option>
                      {ESPECIALIDADES.map(e => (
                        <option key={e.id} value={e.id}>{e.label} · ${e.tarifaUSD}/h</option>
                      ))}
                    </select>
                    <input type="number" className="input" min={1} value={item.cantidad_tecnicos}
                      onChange={e => patchEst('estimacion_mano_obra', i, { cantidad_tecnicos: e.target.value })}
                      style={{ fontSize: 12, padding: '4px 4px', textAlign: 'center' }} title="Cantidad de técnicos" />
                    <input type="number" className="input" min={0.5} step={0.5} value={item.horas_estimadas}
                      onChange={e => patchEst('estimacion_mano_obra', i, { horas_estimadas: e.target.value })}
                      style={{ fontSize: 12, padding: '4px 4px', textAlign: 'center' }} title="Horas estimadas" />
                    <span className="mono" style={{ fontSize: 12, textAlign: 'right', fontWeight: 600, color: costo > 0 ? 'var(--navy)' : 'var(--text-muted)' }}>
                      ${costo.toFixed(0)}
                    </span>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#E53935', padding: '3px 5px' }}
                      onClick={() => removeEst('estimacion_mano_obra', i)}>
                      <Icon name="x" size={10}/>
                    </button>
                  </div>
                );
              })}
              {seg.estimacion_mano_obra.length === 0 && (
                <div className="muted" style={{ fontSize: 12, paddingBottom: 8 }}>Sin líneas de MO. Agrega las especialidades requeridas.</div>
              )}
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--cyan)' }}
                onClick={() => addEst('estimacion_mano_obra', makeMOItem)}>
                <Icon name="plus" size={11}/> Agregar especialidad
              </button>
            </div>
          )}

          {/* Repuestos Tab */}
          {tab === 'repuestos' && (
            <div>
              {seg.estimacion_repuestos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px 80px 24px', gap: 6, marginBottom: 4, fontSize: 11, color: 'var(--text-muted)', padding: '0 2px' }}>
                  <span>Repuesto</span>
                  <span style={{ textAlign: 'center' }}>Cant.</span>
                  <span style={{ textAlign: 'right' }}>Precio unit.</span>
                  <span style={{ textAlign: 'right' }}>Total</span>
                  <span/>
                </div>
              )}
              {seg.estimacion_repuestos.map((item, i) => {
                const linTotal = Number(item.precio_unitario || 0) * Number(item.cantidad || 0);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px 80px 24px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <select className="input" value={item.repuesto_id}
                      onChange={e => {
                        const rep = repuestosDB?.find(r => r.cod === e.target.value);
                        patchEst('estimacion_repuestos', i, {
                          repuesto_id: e.target.value,
                          precio_unitario: rep ? rep.usd : item.precio_unitario,
                        });
                      }}
                      style={{ fontSize: 12, padding: '4px 6px' }}>
                      <option value="">-- Repuesto --</option>
                      {repuestosDB?.map(r => (
                        <option key={r.cod} value={r.cod}>{r.cod} · {r.desc} (disp. {r.stock})</option>
                      ))}
                    </select>
                    <input type="number" className="input" min={1} value={item.cantidad}
                      onChange={e => patchEst('estimacion_repuestos', i, { cantidad: e.target.value })}
                      style={{ fontSize: 12, padding: '4px 4px', textAlign: 'center' }} />
                    <input type="number" className="input" min={0} step={0.01} value={item.precio_unitario}
                      onChange={e => patchEst('estimacion_repuestos', i, { precio_unitario: e.target.value })}
                      style={{ fontSize: 12, padding: '4px 4px', textAlign: 'right' }} />
                    <span className="mono" style={{ fontSize: 12, textAlign: 'right', fontWeight: 600, color: linTotal > 0 ? 'var(--navy)' : 'var(--text-muted)' }}>
                      ${linTotal.toFixed(0)}
                    </span>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#E53935', padding: '3px 5px' }}
                      onClick={() => removeEst('estimacion_repuestos', i)}>
                      <Icon name="x" size={10}/>
                    </button>
                  </div>
                );
              })}
              {seg.estimacion_repuestos.length === 0 && (
                <div className="muted" style={{ fontSize: 12, paddingBottom: 8 }}>Sin repuestos estimados para este segmento.</div>
              )}
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--cyan)' }}
                onClick={() => addEst('estimacion_repuestos', makeRepuestoItem)}>
                <Icon name="plus" size={11}/> Agregar repuesto
              </button>
            </div>
          )}

          {/* Terceros Tab */}
          {tab === 'terceros' && (
            <div>
              {seg.estimacion_terceros.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 24px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <input className="input" value={item.descripcion_servicio}
                    placeholder="Servicio de tercero o subcontrato..."
                    onChange={e => patchEst('estimacion_terceros', i, { descripcion_servicio: e.target.value })}
                    style={{ fontSize: 12, padding: '4px 8px' }} />
                  <input type="number" className="input" min={0} step={10} value={item.costo_estimado}
                    onChange={e => patchEst('estimacion_terceros', i, { costo_estimado: e.target.value })}
                    style={{ fontSize: 12, padding: '4px 6px', textAlign: 'right' }} placeholder="$ USD" />
                  <button className="btn btn-ghost btn-sm" style={{ color: '#E53935', padding: '3px 5px' }}
                    onClick={() => removeEst('estimacion_terceros', i)}>
                    <Icon name="x" size={10}/>
                  </button>
                </div>
              ))}
              {seg.estimacion_terceros.length === 0 && (
                <div className="muted" style={{ fontSize: 12, paddingBottom: 8 }}>Sin servicios de terceros o subcontratos.</div>
              )}
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--cyan)' }}
                onClick={() => addEst('estimacion_terceros', makeTerceroItem)}>
                <Icon name="plus" size={11}/> Agregar tercero
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Página principal ───────────────────────────────────────────────────────

export const CrearOTPage = ({ onNav }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [segmentos, setSegmentos] = useState([makeSegmento()]);
  const [backlogs, setBacklogs] = useState([]);
  const [creada, setCreada] = useState(null);
  const [form, setForm] = useState({
    clienteId: '',
    contratoId: '',
    equipo: '',
    lugarEjecucion: 'Campo_Mina',
    unidadMinera: '',
    tipoTrabajo: 'Correctivo',
    tipoCargo: 'Cliente_Contrato',
    tecnico: '',
    descripcion: '',
    motivoRetrabajo: '',
    fechaProgramadaInicio: TODAY,
    fechaAprobacionComercial: '',
    ingreso: 0,
  });

  const cliente = useMemo(() => D.clientes.find(c => c.id === form.clienteId), [form.clienteId]);
  const contratosFiltrados = useMemo(() => D.contratos.filter(c => c.clienteId === form.clienteId), [form.clienteId]);
  const contrato = useMemo(() => D.contratos.find(c => c.id === form.contratoId), [form.contratoId]);
  const equiposFiltrados = useMemo(() => {
    if (!contrato) return [];
    return D.equipos.filter(e => contrato.equiposScope?.includes(e.cod));
  }, [contrato]);
  const equipo = useMemo(() => D.equipos.find(e => e.cod === form.equipo), [form.equipo]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setCliente = (clienteId) => {
    setForm(f => ({ ...f, clienteId, contratoId: '', equipo: '', unidadMinera: '' }));
    setBacklogs([]);
  };
  const setContrato = (contratoId) => {
    const next = D.contratos.find(c => c.id === contratoId);
    setForm(f => ({ ...f, contratoId, equipo: '', unidadMinera: inferUnidadMinera(next) }));
    setBacklogs([]);
  };
  const setLugarEjecucion = (lugarEjecucion) =>
    setForm(f => ({
      ...f, lugarEjecucion,
      unidadMinera: lugarEjecucion === 'Campo_Mina' ? (f.unidadMinera || inferUnidadMinera(contrato)) : '',
    }));
  const setTipoTrabajo = (tipoTrabajo) =>
    setForm(f => ({
      ...f, tipoTrabajo,
      tipoCargo: isCargoDisabledForTrabajo(tipoTrabajo, f.tipoCargo) ? 'Cliente_Contrato' : f.tipoCargo,
    }));
  const toggleBacklog = (bkl) => setBacklogs(list => list.includes(bkl) ? list.filter(x => x !== bkl) : [...list, bkl]);
  const registrarAprobacion = () => set('fechaAprobacionComercial', new Date().toISOString().slice(0, 16));

  const addSegmento = () => setSegmentos(list => [...list, makeSegmento(list.length + 1)]);
  const removeSegmento = (i) => setSegmentos(list => list.filter((_, idx) => idx !== i));
  const patchSegmento = (i, patch) => setSegmentos(list => list.map((s, idx) => idx === i ? { ...s, ...patch } : s));

  const validation = validateOTForm({ ...form, hasValidSegment: hasValidSegment(segmentos) });
  const fieldErrors = validation.fieldErrors;
  const blockedCargoOptions = TIPO_CARGO.filter(([cargo]) => isCargoDisabledForTrabajo(form.tipoTrabajo, cargo));
  const valid = validation.success;

  if (creada) {
    const t = calcOTTotals(creada.segmentos);
    return (
      <div className="page">
        <div style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F5E9', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--green)' }}>
            <Icon name="check" size={28}/>
          </div>
          <h2>OT creada correctamente</h2>
          <div className="sub" style={{ marginBottom: 18 }}>
            <b>{NEW_OT_CODE}</b> · {trabajoLabel(creada.tipoTrabajo)} · {cargoLabel(creada.tipoCargo)}
          </div>
          <div className="card" style={{ padding: 16, textAlign: 'left', marginBottom: 18 }}>
            <div><span className="muted">Equipo:</span> <b>{creada.equipo}</b></div>
            <div><span className="muted">Segmentos:</span> <b>{creada.segmentos.length}</b></div>
            <div><span className="muted">Costo total estimado:</span> <b className="mono">${t.total.toFixed(0)}</b></div>
            <div><span className="muted">Ingreso facturable:</span> <b>{noFacturable(creada.tipoCargo) ? '$0.00' : `$${Number(creada.ingreso || 0).toFixed(0)}`}</b></div>
            <div><span className="muted">Backlogs vinculados:</span> <b>{creada.backlogs.length || 'Ninguno'}</b></div>
          </div>
          <button className="btn btn-primary" onClick={() => onNav('ots')}>Ver OTs</button>
        </div>
        <FooterBrand/>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Nueva Orden de Trabajo · {NEW_OT_CODE}</h1>
          <div className="sub">Creacion directa DBS · Tipo de Trabajo × Cargo Financiero</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-secondary" onClick={registrarAprobacion}>
          <Icon name="check" size={13}/> Registrar Aprobacion Comercial
        </button>
      </div>

      <div>

          {/* ── Cabecera DBS ── */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-header"><h3>Cabecera DBS</h3><span className="hint">Jerarquia comercial · Matriz Trabajo × Cargo</span></div>
            <div className="ot-form-body">

              <section className="ot-form-section">
                <div className="ot-form-section-title">1. Contexto comercial</div>
                <div className="ot-form-grid commercial">
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Cliente *</div>
                    <select className="input" value={form.clienteId} onChange={e => setCliente(e.target.value)}
                      style={{ marginTop: 4, borderColor: fieldErrors.clienteId ? '#E53935' : undefined }}>
                      <option value="">-- Seleccionar cliente --</option>
                      {D.clientes.filter(c => c.estado === 'Activo').map(c => (
                        <option key={c.id} value={c.id}>{c.razonSocial}</option>
                      ))}
                    </select>
                    {fieldErrors.clienteId?.[0] && <div style={{ fontSize: 11, color: '#E53935', marginTop: 4 }}>{fieldErrors.clienteId[0]}</div>}
                  </div>
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Contrato / Proyecto *</div>
                    <select className="input" value={form.contratoId} disabled={!form.clienteId} onChange={e => setContrato(e.target.value)}
                      style={{ marginTop: 4, background: !form.clienteId ? '#ECEFF1' : undefined, borderColor: fieldErrors.contratoId ? '#E53935' : undefined }}>
                      <option value="">{form.clienteId ? '-- Seleccionar contrato --' : 'Seleccione primero un cliente'}</option>
                      {contratosFiltrados.map(c => <option key={c.id} value={c.id}>{c.numero} · {c.descripcion}</option>)}
                    </select>
                    {fieldErrors.contratoId?.[0] && <div style={{ fontSize: 11, color: '#E53935', marginTop: 4 }}>{fieldErrors.contratoId[0]}</div>}
                  </div>
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Activo / Equipo *</div>
                    <select className="input" value={form.equipo} disabled={!form.contratoId}
                      onChange={e => { set('equipo', e.target.value); setBacklogs([]); }}
                      style={{ marginTop: 4, background: !form.contratoId ? '#ECEFF1' : undefined, borderColor: fieldErrors.equipo ? '#E53935' : undefined }}>
                      <option value="">{form.contratoId ? '-- Seleccionar equipo --' : 'Seleccione primero un contrato'}</option>
                      {equiposFiltrados.map(eq => <option key={eq.cod} value={eq.cod}>{eq.cod} · {eq.marca} · {eq.proyecto}</option>)}
                    </select>
                    {fieldErrors.equipo?.[0] && <div style={{ fontSize: 11, color: '#E53935', marginTop: 4 }}>{fieldErrors.equipo[0]}</div>}
                  </div>
                </div>
              </section>

              <section className="ot-form-section">
                <div className="ot-form-section-title">2. Lugar de ejecución</div>
                <div className="ot-form-grid execution">
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Lugar de Ejecucion *</div>
                    <select className="input" value={form.lugarEjecucion} disabled={!form.clienteId} onChange={e => setLugarEjecucion(e.target.value)}
                      style={{ marginTop: 4, background: !form.clienteId ? '#ECEFF1' : undefined }}>
                      {LUGAR_EJECUCION.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                    </select>
                  </div>
                  {form.lugarEjecucion === 'Campo_Mina' ? (
                    <div className="ot-form-field">
                      <div className="label" style={{ fontSize: 12 }}>Unidad Minera *</div>
                      <input className="input" value={form.unidadMinera} disabled={!form.contratoId}
                        onChange={e => set('unidadMinera', e.target.value)}
                        placeholder={form.contratoId ? 'Unidad minera' : 'Seleccione primero un contrato'}
                        style={{ marginTop: 4, background: !form.contratoId ? '#ECEFF1' : undefined, borderColor: fieldErrors.unidadMinera ? '#E53935' : undefined }} />
                      {fieldErrors.unidadMinera?.[0] && <div style={{ fontSize: 11, color: '#E53935', marginTop: 4 }}>{fieldErrors.unidadMinera[0]}</div>}
                    </div>
                  ) : (
                    <div className="ot-form-field">
                      <div className="label" style={{ fontSize: 12 }}>Taller / Sede</div>
                      <input className="input" value="Taller principal" readOnly style={{ marginTop: 4, background: '#F8FAFC' }} />
                    </div>
                  )}
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Contexto comercial</div>
                    <div className="ot-context-box" style={{ marginTop: 4 }}>
                      {cliente ? cliente.razonSocial : <span className="muted">Sin cliente</span>}
                      {contrato && <><br/><span className="muted">{contrato.numero}</span></>}
                    </div>
                  </div>
                </div>
              </section>

              <section className="ot-form-section">
                <div className="ot-form-section-title">3. Matriz DBS</div>
                <div className="ot-form-grid dbs">
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Tipo de Trabajo *</div>
                    <select className="input" value={form.tipoTrabajo} onChange={e => setTipoTrabajo(e.target.value)} style={{ marginTop: 4 }}>
                      {TIPO_TRABAJO.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                    </select>
                  </div>
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Cargo A (Finanzas) *</div>
                    <select className="input" value={form.tipoCargo} onChange={e => set('tipoCargo', e.target.value)}
                      style={{ marginTop: 4, borderColor: fieldErrors.tipoCargo ? '#E53935' : undefined }}>
                      {TIPO_CARGO.map(([v, label]) => {
                        const reason = getBlockedCargoReason(form.tipoTrabajo, v);
                        return <option key={v} value={v} disabled={Boolean(reason)} title={reason}>{label}{reason ? ' - bloqueado' : ''}</option>;
                      })}
                    </select>
                    {fieldErrors.tipoCargo?.[0] && <div style={{ fontSize: 11, color: '#E53935', marginTop: 4 }}>{fieldErrors.tipoCargo[0]}</div>}
                  </div>
                  {blockedCargoOptions.length > 0 && (
                    <div className="ot-guard-note ot-form-full">
                      {blockedCargoOptions.map(([cargo]) => (
                        <div key={cargo}><b>{cargoLabel(cargo)}</b>: {getBlockedCargoReason(form.tipoTrabajo, cargo)}</div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="ot-form-section">
                <div className="ot-form-section-title">4. Responsable y fechas</div>
                <div className="ot-form-grid operations">
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Técnico responsable *</div>
                    <select className="input" value={form.tecnico} onChange={e => set('tecnico', e.target.value)} style={{ marginTop: 4 }}>
                      <option value="">-- Seleccionar técnico --</option>
                      {D.tecnicos.map(t => <option key={t.nombre} value={t.nombre}>{t.nombre}</option>)}
                    </select>
                  </div>
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Fecha Programada de Inicio *</div>
                    <input type="date" className="input" value={form.fechaProgramadaInicio}
                      onChange={e => set('fechaProgramadaInicio', e.target.value)}
                      style={{ marginTop: 4, borderColor: fieldErrors.fechaProgramadaInicio ? '#E53935' : undefined }} />
                    {fieldErrors.fechaProgramadaInicio?.[0] && <div style={{ fontSize: 11, color: '#E53935', marginTop: 4 }}>{fieldErrors.fechaProgramadaInicio[0]}</div>}
                  </div>
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Ingreso facturable USD</div>
                    <input type="number" className="input" value={noFacturable(form.tipoCargo) ? 0 : form.ingreso}
                      disabled={noFacturable(form.tipoCargo)} onChange={e => set('ingreso', e.target.value)}
                      style={{ marginTop: 4, background: noFacturable(form.tipoCargo) ? '#ECEFF1' : undefined }} />
                  </div>
                  <div className="ot-form-full">
                    <div className="label" style={{ fontSize: 12, marginBottom: 4 }}>Impacto financiero</div>
                    <FinancialImpactBadge tipoCargo={form.tipoCargo} />
                  </div>
                  <div className="ot-form-field">
                    <div className="label" style={{ fontSize: 12 }}>Aprobacion comercial</div>
                    <input type="datetime-local" className="input" value={form.fechaAprobacionComercial}
                      onChange={e => set('fechaAprobacionComercial', e.target.value)} style={{ marginTop: 4 }} />
                  </div>
                </div>
              </section>

              {form.tipoCargo === 'Reclamo_Rework' && (
                <section className="ot-form-section" style={{ borderColor: '#FFCDD2', background: 'var(--red-soft)' }}>
                  <div className="ot-form-section-title" style={{ color: '#B71C1C', background: 'rgba(255,255,255,0.6)' }}>Justificación del Retrabajo</div>
                  <div style={{ padding: 12 }}>
                    <textarea className="input" rows={3} value={form.motivoRetrabajo} onChange={e => set('motivoRetrabajo', e.target.value)}
                      placeholder="Causa raiz, evidencia, responsable del retrabajo y accion correctiva..."
                      style={{ resize: 'vertical', width: '100%', borderColor: !form.motivoRetrabajo ? '#E53935' : undefined }} />
                    {fieldErrors.motivoRetrabajo?.[0] && <div style={{ fontSize: 11, color: '#B71C1C', marginTop: 4 }}>{fieldErrors.motivoRetrabajo[0]}</div>}
                  </div>
                </section>
              )}

              <section className="ot-form-section">
                <div className="ot-form-section-title">5. Descripción técnica</div>
                <div style={{ padding: 12 }}>
                  <textarea className="input" rows={4} value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
                    style={{ resize: 'vertical', width: '100%' }}
                    placeholder={equipo ? `Describe el trabajo sobre ${equipo.cod}...` : 'Selecciona un equipo y describe el trabajo...'} />
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} disabled={!form.equipo} onClick={() => setDrawerOpen(true)}>
                    <Icon name="orders" size={12}/> Vincular Hallazgos/Backlog {backlogs.length ? `(${backlogs.length})` : ''}
                  </button>
                </div>
              </section>

            </div>
          </div>

          {/* ── Estructura del trabajo ── */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-header">
              <h3>Estructura del trabajo</h3>
              <span className="hint">Segmentos → Operaciones + estimación MO / Repuestos / Terceros</span>
            </div>
            <div style={{ padding: 14 }}>
              {segmentos.map((seg, si) => (
                <SegmentoCard
                  key={si}
                  seg={seg}
                  isOnly={segmentos.length === 1}
                  onPatch={(patch) => patchSegmento(si, patch)}
                  onRemove={() => removeSegmento(si)}
                  repuestosDB={D.repuestos}
                />
              ))}
              <button className="btn btn-secondary btn-sm" onClick={addSegmento}>
                <Icon name="plus" size={12}/> Agregar Segmento
              </button>
            </div>
          </div>

      </div>

      {!valid && (
        <div style={{ color: '#E53935', fontSize: 12, marginTop: 12 }}>
          <Icon name="alert" size={12}/> Completa los campos obligatorios y las validaciones DBS.
          {validation.issues.map((issue, i) => <div key={i} style={{ marginTop: 3 }}>- {issue.message}</div>)}
        </div>
      )}

      <div style={{ height: 88 }} />

      <StickyTotals
        segmentos={segmentos}
        tipoCargo={form.tipoCargo}
        ingreso={form.ingreso}
        valid={valid}
        onCancel={() => onNav('ots')}
        onSave={() => setCreada({ ...form, backlogs, segmentos, fechaPrimerLaborReal: null, ingreso: noFacturable(form.tipoCargo) ? 0 : form.ingreso })}
      />
      <BacklogDrawer open={drawerOpen} equipo={form.equipo} selected={backlogs} onToggle={toggleBacklog} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};
