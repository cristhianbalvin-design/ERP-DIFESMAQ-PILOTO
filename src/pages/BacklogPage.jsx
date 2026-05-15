import React, { useState } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';
import { ZAHORY_SAC_DATA } from '../data.js';

const CICLO_COLOR = {
  'Nuevo': 'cyan', 'En análisis': 'orange', 'Pendiente recursos': 'orange',
  'Listo para OT': 'green', 'Transferido a OT': 'slate', 'Descartado': 'slate',
  'Requiere retorno a taller': 'red',
};

export const BacklogPage = ({ onNav }) => {
  const D = ZAHORY_SAC_DATA;
  const [filterPrio, setFilterPrio] = useState('Todos');
  const [filterRetorno, setFilterRetorno] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newBkl, setNewBkl] = useState({ fuente: 'Reporte diario', nivelAlertaSos: 'Normal', score: 0, prioridad: 'Normal' });

  const updNew = (k, v) => {
    const patch = { [k]: v };
    if (k === 'nivelAlertaSos' && v === 'Critico') {
      patch.score = 17;
      patch.prioridad = 'Emergencia';
    }
    setNewBkl(b => ({ ...b, ...patch }));
  };

  const backlogs = [...D.backlog]
    .filter(b => filterPrio === 'Todos' || b.prioridad === filterPrio)
    .filter(b => !filterRetorno || b.requiereRetorno)
    .sort((a, b) => b.score - a.score);

  const kpis = {
    total: D.backlog.length,
    emergencia: D.backlog.filter(b => b.prioridad === 'Emergencia').length,
    urgentes: D.backlog.filter(b => b.prioridad === 'Urgente').length,
    pendRecursos: D.backlog.filter(b => b.estado === 'Pend. Recursos').length,
    listosOT: D.backlog.filter(b => b.estado === 'Listo para OT').length,
    requierenRetorno: D.backlog.filter(b => b.requiereRetorno).length,
  };

  const prioridadBadge = (p) => {
    if (p === 'Emergencia') return <span className="badge solid-red">EMERGENCIA</span>;
    if (p === 'Urgente')    return <span className="badge orange"><span className="dot"/>Urgente</span>;
    if (p === 'Normal')     return <span className="badge cyan"><span className="dot"/>Normal</span>;
    return <span className="badge slate"><span className="dot"/>Planificable</span>;
  };

  const estadoBadge = (b) => {
    const st = b.cicloVida || b.estado;
    const c = CICLO_COLOR[st] || 'slate';
    return <span className={`badge ${c}`}><span className="dot"/>{st}</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Backlog de trabajos</h1>
          <div className="sub">Hallazgos formales ordenados por score · Genealogía BKL → OT</div>
        </div>
        <div className="spacer"/>
        {kpis.requierenRetorno > 0 && (
          <div style={{ padding: '6px 12px', background: 'var(--red-soft)', border: '1px solid #FFCDD2', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#D32F2F', marginRight: 10 }}>
            <Icon name="alert" size={13}/> {kpis.requierenRetorno} equipo{kpis.requierenRetorno > 1 ? 's requieren' : ' requiere'} retorno a taller
          </div>
        )}
        <button className="btn btn-cyan" onClick={() => setShowNew(true)}><Icon name="plus" size={13}/> Nuevo Backlog</button>
      </div>

      {/* KPIs */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
        <div className="kpi" style={{ padding: 12 }}>
          <div className="label">Total activos</div>
          <div className="value" style={{ fontSize: 22 }}>{kpis.total}</div>
        </div>
        <div className="kpi" style={{ padding: 12, background: 'var(--red-soft)', borderColor: '#FFCDD2' }}>
          <div className="label" style={{ color: '#D32F2F' }}>Emergencia</div>
          <div className="value" style={{ fontSize: 22, color: '#D32F2F' }}>{kpis.emergencia} <Icon name="alert" size={16}/></div>
        </div>
        <div className="kpi" style={{ padding: 12, background: 'var(--orange-soft)', borderColor: '#FFD9A8' }}>
          <div className="label" style={{ color: '#C15D00' }}>Urgentes</div>
          <div className="value" style={{ fontSize: 22, color: '#C15D00' }}>{kpis.urgentes}</div>
        </div>
        <div className="kpi" style={{ padding: 12 }}>
          <div className="label">Pend. recursos</div>
          <div className="value" style={{ fontSize: 22 }}>{kpis.pendRecursos}</div>
        </div>
        <div className="kpi" style={{ padding: 12 }}>
          <div className="label">Listos para OT</div>
          <div className="value" style={{ fontSize: 22, color: 'var(--green)' }}>{kpis.listosOT}</div>
        </div>
        <div className="kpi" style={{ padding: 12, background: 'var(--red-soft)', borderColor: '#FFCDD2' }}>
          <div className="label" style={{ color: '#D32F2F' }}>Retorno taller</div>
          <div className="value" style={{ fontSize: 22, color: '#D32F2F' }}>{kpis.requierenRetorno}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="seg">
          {['Todos', 'Emergencia', 'Urgente', 'Normal', 'Planificable'].map(p => (
            <button key={p} className={filterPrio === p ? 'active' : ''} onClick={() => setFilterPrio(p)}>{p}</button>
          ))}
        </div>
        <button
          className={'btn btn-sm ' + (filterRetorno ? 'btn-primary' : 'btn-secondary')}
          onClick={() => setFilterRetorno(r => !r)}
          title="Mostrar solo backlogs que requieren retorno a taller">
          <Icon name="alert" size={12}/> Retorno a taller {filterRetorno ? 'ON' : 'OFF'}
        </button>
        <div className="spacer"/>
        <input className="input" placeholder="Buscar hallazgo..." style={{ width: 260 }}/>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>BKL</th>
              <th>Fecha</th>
              <th>Equipo</th>
              <th>Sistema</th>
              <th style={{ width: '26%' }}>Hallazgo</th>
              <th>Fuente</th>
              <th>Prioridad</th>
              <th className="num">Score</th>
              <th className="num">Días</th>
              <th>Estado ciclo</th>
              <th style={{ textAlign: 'center' }}>Retorno</th>
              <th>Acciones Planner</th>
            </tr>
          </thead>
          <tbody>
            {backlogs.map(b => (
              <tr key={b.bkl}
                style={{ background: b.requiereRetorno ? 'rgba(229,57,53,0.04)' : '' }}
                className={selected === b.bkl ? 'selected' : ''}>
                <td className="ot-code">{b.bkl}</td>
                <td style={{ fontSize: 12 }}>{b.fecha.slice(0, 10)}</td>
                <td className="bold">{b.eq}</td>
                <td><span className="chip">{b.sistema}</span></td>
                <td style={{ fontSize: 12.5, lineHeight: 1.45 }}>{b.hallazgo}</td>
                <td style={{ fontSize: 11 }}><span className="chip">{b.fuente}</span></td>
                <td>{prioridadBadge(b.prioridad)}</td>
                <td className="num">
                  <span className="badge" style={{ background: b.nivelAlertaSos === 'Critico' ? '#E53935' : 'var(--navy)', color: 'white', padding: '4px 8px', fontSize: 13 }}>{b.score}</span>
                  {b.nivelAlertaSos && <div style={{ fontSize: 10, color: b.nivelAlertaSos === 'Critico' ? '#E53935' : 'var(--text-muted)', marginTop: 3 }}>SOS {b.nivelAlertaSos}</div>}
                </td>
                <td className="num mono">{b.dias}</td>
                <td>{estadoBadge(b)}</td>
                <td style={{ textAlign: 'center' }}>
                  {b.requiereRetorno
                    ? <span className="badge solid-red" title="Requiere retorno a taller Lima"><Icon name="alert" size={11}/> Sí</span>
                    : <span className="muted" style={{ fontSize: 12 }}>—</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'nowrap' }}>
                    <button
                      className={`btn btn-sm ${b.cicloVida === 'Listo para OT' ? 'btn-primary' : 'btn-ghost'}`}
                      title="Crear OT desde este backlog"
                      style={{ fontSize: 11, ...(b.cicloVida !== 'Listo para OT' ? { color: 'var(--cyan)' } : {}) }}
                      onClick={() => {
                        sessionStorage.setItem('zahory_sac_crear_ot_bkl', b.bkl);
                        onNav && onNav('crear-ot');
                      }}>
                      <Icon name="orders" size={12}/> {b.cicloVida === 'Listo para OT' ? 'Crear OT' : 'OT'}
                    </button>
                    {b.requiereRetorno && (
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Coordinar retorno a taller"
                        style={{ color: '#E53935', fontSize: 11 }}
                        onClick={() => {
                          sessionStorage.setItem('zahory_sac_crear_ot_bkl', b.bkl);
                          onNav && onNav('crear-ot');
                        }}>
                        <Icon name="alert" size={12}/> Retorno
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm" title="Fusionar con otro backlog" style={{ fontSize: 11 }}>
                      Fusionar
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Descartar backlog" style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                      <Icon name="x" size={11}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda de ciclo de vida */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><h3>Ciclo de vida del backlog</h3><span className="hint">Según Documento Maestro v4.0</span></div>
        <div style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
          {[
            ['Nuevo', 'cyan'], ['En análisis', 'orange'], ['Pendiente recursos', 'orange'],
            ['Listo para OT', 'green'], ['Transferido a OT', 'slate'],
            ['Requiere retorno a taller', 'red'], ['Cerrado sin OT', 'slate'], ['Descartado', 'slate'],
          ].map(([label, color]) => (
            <span key={label} className={`badge ${color}`}><span className="dot"/>{label}</span>
          ))}
        </div>
        <div style={{ padding: '0 20px 14px', fontSize: 11, color: 'var(--text-muted)' }}>
          Un backlog de <b>Emergencia</b> obliga validación inmediata. Al cerrar una OT con trabajo pendiente, el sistema crea automáticamente un <b>backlog residual</b>.
        </div>
      </div>

      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.35)', display: 'grid', placeItems: 'center', zIndex: 30 }}>
          <div className="card" style={{ width: 620, maxWidth: '92vw' }}>
            <div className="card-header">
              <h3>Nuevo backlog</h3>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowNew(false)}><Icon name="x" size={12}/></button>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div className="label" style={{ fontSize: 12 }}>Fuente del backlog</div>
                <select className="input" value={newBkl.fuente} onChange={e => updNew('fuente', e.target.value)} style={{ marginTop: 4 }}>
                  {['Reporte diario', 'Parte taller', 'Inspeccion', 'Preventivo', 'Retorno desde mina', 'SOS Feedback (Analisis de fluidos)'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <div className="label" style={{ fontSize: 12 }}>Prioridad</div>
                <input className="input" value={newBkl.prioridad} readOnly style={{ marginTop: 4, background: newBkl.prioridad === 'Emergencia' ? 'var(--red-soft)' : '#F8FAFC' }} />
              </div>
              {newBkl.fuente === 'SOS Feedback (Analisis de fluidos)' && (
                <>
                  <div>
                    <div className="label" style={{ fontSize: 12 }}>Reporte de laboratorio *</div>
                    <input className="input" type="file" accept=".pdf,.jpg,.png" style={{ marginTop: 4 }} />
                  </div>
                  <div>
                    <div className="label" style={{ fontSize: 12 }}>Nivel alerta SOS *</div>
                    <select className="input" value={newBkl.nivelAlertaSos} onChange={e => updNew('nivelAlertaSos', e.target.value)} style={{ marginTop: 4 }}>
                      <option>Normal</option>
                      <option>Monitorear</option>
                      <option>Critico</option>
                    </select>
                    {newBkl.nivelAlertaSos === 'Critico' && (
                      <div style={{ fontSize: 11, color: '#E53935', marginTop: 5 }}>
                        Score forzado a 17 y prioridad Emergencia por alerta critica SOS.
                      </div>
                    )}
                  </div>
                </>
              )}
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="label" style={{ fontSize: 12 }}>Hallazgo</div>
                <textarea className="input" rows={3} style={{ marginTop: 4, resize: 'vertical', width: '100%' }} placeholder="Describe hallazgo tecnico o resultado del laboratorio..." />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge" style={{ background: 'var(--navy)', color: 'white' }}>Score {newBkl.score}</span>
              <button className="btn btn-primary" onClick={() => setShowNew(false)}><Icon name="check" size={13}/> Guardar borrador</button>
            </div>
          </div>
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};
