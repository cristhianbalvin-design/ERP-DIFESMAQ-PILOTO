import React, { useState } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';
import { ZAHORY_SAC_DATA } from '../data.js';

const EQUIPOS_FULL = [
  { cod: 'JB-DD311',   marca: 'SANDVIK DD311-40',  tipo: 'Jumbo',  flota: 'Jumbo frontonero', propietario: 'DIFESMAQ', proyecto: 'Pepas de Oro',  contrato: 'CT-2026-PEP-003', ubicacion: 'Mina',             horometro: 3590.4, percusion: 2101.4, electrico: 3910.2, criticidad: 'A', estadoOp: 'Operativo',        serie: 'DD311-PE-2019-01', anio: 2019 },
  { cod: 'JB-24',      marca: 'EPIROC SIMBA S7D',  tipo: 'Simba',  flota: 'Simba de cable',   propietario: 'DIFESMAQ', proyecto: 'Buenaventura',  contrato: 'CT-2025-BUE-001', ubicacion: 'Mina',             horometro: 5420.1, percusion: 3150.0, electrico: 5100.0, criticidad: 'A', estadoOp: 'Operativo',        serie: 'S7D-BU-2018-02',   anio: 2018 },
  { cod: 'JB-26',      marca: 'EPIROC SIMBA S7D',  tipo: 'Simba',  flota: 'Simba de cable',   propietario: 'DIFESMAQ', proyecto: 'Antapaccay',    contrato: 'OS-2026-APC-011', ubicacion: 'Mina',             horometro: 1250.5, percusion:  840.2, electrico: 1200.0, criticidad: 'A', estadoOp: 'En mantenimiento', serie: 'S7D-AP-2022-01',   anio: 2022 },
  { cod: 'SC-701',     marca: 'SANDVIK',            tipo: 'Scoop',  flota: 'Scoop-LHD',        propietario: 'Cliente',  proyecto: 'Buenaventura',  contrato: 'CT-2025-BUE-001', ubicacion: 'Mina',             horometro: 8900.0, percusion:    0,   electrico:    0,   criticidad: 'B', estadoOp: 'En mantenimiento', serie: 'SK-BU-2016-01',    anio: 2016 },
  { cod: 'EQ-TALL-01', marca: 'CATERPILLAR R1600', tipo: 'Scoop',  flota: 'Scoop-LHD',        propietario: 'Cliente',  proyecto: 'Uchucchacua',   contrato: 'OS-2025-VOL-008', ubicacion: 'Taller Carapongo', horometro:12050.8, percusion:    0,   electrico:    0,   criticidad: 'C', estadoOp: 'En taller',        serie: 'R16-UC-2014-01',   anio: 2014 },
  { cod: 'JB-NEW-01',  marca: 'EPIROC BOOMER S2',  tipo: 'Jumbo',  flota: 'Jumbo frontonero', propietario: 'DIFESMAQ', proyecto: '—',              contrato: '—',               ubicacion: 'Taller Carapongo', horometro:    0,   percusion:    0,   electrico:    0,   criticidad: 'A', estadoOp: 'Acondicionamiento',serie: 'BS2-LI-2026-01',  anio: 2026 },
];

const HISTORIAL = {
  'JB-DD311': [
    { ot: 'OT-2026-047', tipo: 'Preventivo', fecha: '13/04/2026', costo: 1250 },
    { ot: 'OT-2026-039', tipo: 'Correctivo', fecha: '28/03/2026', costo: 2800 },
    { ot: 'OT-2026-031', tipo: 'Preventivo', fecha: '10/03/2026', costo: 980  },
  ],
  'JB-24': [
    { ot: 'OT-2026-050', tipo: 'Correctivo', fecha: '16/04/2026', costo: 772  },
    { ot: 'OT-2026-041', tipo: 'Preventivo', fecha: '01/04/2026', costo: 1100 },
  ],
};

const ESTADO_COLOR = {
  'Operativo': 'green', 'En mantenimiento': 'orange',
  'En taller': 'slate', 'Acondicionamiento': 'cyan', 'Inoperativo': 'red',
};

export const EquiposPage = () => {
  const [selected, setSelected] = useState(EQUIPOS_FULL[0]);
  const [detailTab, setDetailTab] = useState('ficha');

  const propBadge = (p) => p === 'DIFESMAQ'
    ? <span className="badge navy"><span className="dot"/>DIFESMAQ</span>
    : <span className="badge cyan"><span className="dot"/>Cliente</span>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Equipos y Activos</h1>
          <div className="sub">Maestro de activos · Propietario · Horómetros · Estado operativo</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-primary"><Icon name="plus" size={13}/> Nuevo equipo</button>
      </div>

      <div className="toolbar">
        <select className="select"><option>Proyecto: Todos</option></select>
        <select className="select">
          <option>Propietario: Todos</option>
          <option>DIFESMAQ</option>
          <option>Cliente</option>
        </select>
        <select className="select"><option>Estado: Todos</option></select>
        <div className="spacer"/>
        <input className="input" placeholder="Buscar equipo..." style={{ width: 250 }}/>
      </div>

      <div className="grid-2">
        {/* Lista de equipos */}
        <div className="card">
          <div className="card-header">
            <h3>Listado de activos</h3>
            <span className="chip" style={{ marginLeft: 'auto' }}>{EQUIPOS_FULL.length} equipos</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Código</th><th>Marca / Modelo</th><th>Propietario</th>
                <th>Proyecto</th><th>Ubicación</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {EQUIPOS_FULL.map(eq => (
                <tr key={eq.cod}
                  className="clickable"
                  style={{ background: selected.cod === eq.cod ? 'var(--cyan-soft)' : '' }}
                  onClick={() => { setSelected(eq); setDetailTab('ficha'); }}>
                  <td className="bold" style={{ color: 'var(--cyan)' }}>{eq.cod}</td>
                  <td>
                    {eq.marca}
                    <br/><span className="muted" style={{ fontSize: 11 }}>{eq.tipo} · {eq.flota}</span>
                  </td>
                  <td>{propBadge(eq.propietario)}</td>
                  <td style={{ fontSize: 12 }}>{eq.proyecto}</td>
                  <td style={{ fontSize: 12 }}>{eq.ubicacion}</td>
                  <td>
                    <span className={`badge ${ESTADO_COLOR[eq.estadoOp] || 'slate'}`}>
                      <span className="dot"/>{eq.estadoOp}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm"><Icon name="edit" size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel de detalle */}
        <div>
          <div className="card mb-md">
            <div className="card-header" style={{ background: 'var(--navy)', color: 'white', borderRadius: '8px 8px 0 0' }}>
              <h3>Ficha: {selected.cod}</h3>
              <div className="spacer"/>
              {propBadge(selected.propietario)}
              <span className={`badge ${ESTADO_COLOR[selected.estadoOp] || 'slate'}`} style={{ marginLeft: 6 }}>
                <span className="dot"/>{selected.estadoOp}
              </span>
            </div>

            {/* Sub-tabs del detalle */}
            <div className="tabs" style={{ borderTop: 'none' }}>
              <div className={'tab ' + (detailTab === 'ficha' ? 'active' : '')} onClick={() => setDetailTab('ficha')}>Ficha técnica</div>
              <div className={'tab ' + (detailTab === 'hora'  ? 'active' : '')} onClick={() => setDetailTab('hora')}>Horómetros</div>
              <div className={'tab ' + (detailTab === 'hist'  ? 'active' : '')} onClick={() => setDetailTab('hist')}>Historial OTs</div>
            </div>

            {/* Tab: Ficha técnica */}
            {detailTab === 'ficha' && (
              <div className="card-body">
                <div className="grid-2" style={{ gap: 12, fontSize: 13 }}>
                  {[
                    ['Marca / Modelo',     selected.marca],
                    ['Tipo de flota',      selected.flota],
                    ['N° Serie',           selected.serie],
                    ['Año de fabricación', selected.anio],
                    ['Proyecto asignado',  selected.proyecto],
                    ['Contrato / OS',      selected.contrato],
                    ['Ubicación actual',   selected.ubicacion],
                    ['Criticidad',
                      <span className={`badge ${selected.criticidad === 'A' ? 'solid-red' : selected.criticidad === 'B' ? 'orange' : 'slate'}`}>
                        {selected.criticidad} — {selected.criticidad === 'A' ? 'Crítico' : selected.criticidad === 'B' ? 'Alto' : 'Bajo'}
                      </span>
                    ],
                    ['Propietario del activo', propBadge(selected.propietario)],
                    ['OT facturable al cliente',
                      <span className={`badge ${selected.propietario === 'Cliente' ? 'green' : 'slate'}`}>
                        {selected.propietario === 'Cliente' ? 'Sí — OT facturable' : 'No — OT de inversión'}
                      </span>
                    ],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</div>
                      <div className="bold" style={{ marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                {selected.estadoOp === 'Acondicionamiento' && (
                  <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--cyan-soft)', borderRadius: 6, fontSize: 12, color: 'var(--navy)', border: '1px solid var(--cyan)' }}>
                    <strong>OT de Acondicionamiento activa:</strong> OT-2026-054 · Ingreso facturable = $0.<br/>
                    El costo acumulado es la inversión de puesta en operación del activo propio DIFESMAQ.
                  </div>
                )}
              </div>
            )}

            {/* Tab: Horómetros */}
            {detailTab === 'hora' && (
              <div className="card-body">
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['Motor', selected.horometro], ['Percusión', selected.percusion], ['Eléctrico', selected.electrico]].map(([l, v]) => (
                    <div key={l} style={{ flex: 1, padding: 16, background: '#F5F7FB', borderRadius: 8, textAlign: 'center' }}>
                      <Icon name={l === 'Motor' ? 'cog' : l === 'Percusión' ? 'mine' : 'workshop'} size={24}/>
                      <div className="muted" style={{ fontSize: 11, marginTop: 8, textTransform: 'uppercase' }}>H. {l}</div>
                      <div className="mono" style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
                        {v > 0 ? v.toLocaleString('es-PE', { minimumFractionDigits: 1 }) : '—'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 12, textAlign: 'center' }}>
                  Última actualización: 20/04/2026 · Reporte Diario de Mina
                </div>
                <div style={{ marginTop: 16, padding: '10px 14px', background: '#F5F7FB', borderRadius: 6, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Próximo mantenimiento preventivo</div>
                  <div className="muted">
                    {selected.estadoOp === 'Acondicionamiento'
                      ? 'El equipo está en acondicionamiento — sin PM programado aún.'
                      : `PM programado a las ${(Math.ceil(selected.horometro / 250) * 250).toLocaleString()} hrs motor · Faltan ~${Math.ceil((Math.ceil(selected.horometro/250)*250) - selected.horometro)} hrs`}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Historial OTs */}
            {detailTab === 'hist' && (
              <div className="card-body" style={{ padding: 0 }}>
                {!(HISTORIAL[selected.cod] || []).length
                  ? <div className="muted" style={{ textAlign: 'center', padding: 40, fontSize: 13 }}>Sin historial de OTs registradas para este equipo.</div>
                  : <table className="tbl">
                      <thead>
                        <tr><th>OT</th><th>Tipo</th><th>Fecha</th><th className="num">Costo USD</th><th>Estado</th></tr>
                      </thead>
                      <tbody>
                        {(HISTORIAL[selected.cod] || []).map(h => (
                          <tr key={h.ot}>
                            <td className="ot-code">{h.ot}</td>
                            <td><span className="chip">{h.tipo}</span></td>
                            <td style={{ fontSize: 12 }}>{h.fecha}</td>
                            <td className="num mono">${h.costo.toLocaleString()}</td>
                            <td><span className="badge green"><span className="dot"/>Cerrada</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>}
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterBrand/>
    </div>
  );
};
