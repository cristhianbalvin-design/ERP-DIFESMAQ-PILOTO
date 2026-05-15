import { useState as useS3 } from 'react';
import { Icon, FooterBrand } from '../components/shell.jsx';

const MicField = ({ defaultValue = "", placeholder }) => {
  const [rec, setRec] = useS3(false);
  const [val, setVal] = useS3(defaultValue);
  return (
    <div className={"mic-field-wrap " + (rec ? "recording" : "")}>
      <textarea value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder}/>
      {rec && <span className="rec-dot"/>}
      <button className={"mic-btn " + (rec ? "rec" : "")} onClick={() => setRec(!rec)} title="Dictar por voz">
        <Icon name="mic" size={18}/>
      </button>
    </div>
  );
};

const Accordion = ({ title, icon, defaultOpen = false, children, badge }) => {
  const [open, setOpen] = useS3(defaultOpen);
  return (
    <div className={"accordion " + (open ? "open" : "")}>
      <button className="accordion-head" onClick={() => setOpen(!open)}>
        {icon && <Icon name={icon} size={14}/>}
        <span>{title}</span>
        {badge}
        <Icon name="chev" size={14} />
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
};

const BacklogModal = ({ onClose }) => {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 400, animation: "fadeInUp 0.2s ease-out" }}>
        <div className="card-header" style={{ background: "var(--navy)", color: "white", borderRadius: "8px 8px 0 0" }}>
          <h3>Reportar hallazgo (Backlog)</h3>
          <div className="spacer"/>
          <button className="icon-btn" onClick={onClose} style={{ color: "white" }}><Icon name="x" size={16}/></button>
        </div>
        <div className="card-body">
          <div className="field"><label>Sistema afectado *</label>
            <select className="select"><option>Motor</option><option>Hidráulico</option><option>Eléctrico</option><option>Percusión</option><option>Estructura</option></select>
          </div>
          <div className="field mt-md"><label>Descripción del hallazgo *</label>
            <MicField placeholder="Dicta o escribe el problema detectado..."/>
          </div>
          <div className="field mt-md"><label>Prioridad sugerida</label>
            <select className="select"><option>Normal</option><option>Urgente</option><option>Emergencia</option></select>
          </div>
          <div className="field mt-md">
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox"/> Requiere repuestos
            </label>
          </div>
          <div className="field mt-sm">
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox"/> Requiere parada del equipo
            </label>
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Guardar en Backlog</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Reporte diario de mina ----------
export const ReporteMinaPage = ({ onNav }) => {
  const [turno, setTurno] = useS3("DIA");
  const [equipo, setEquipo] = useS3("JB-DD311");
  const [tipoMant, setTipoMant] = useS3({ prg: false, prv: true, ctvo: true, acc: false });
  const [estado, setEstado] = useS3('operativo');
  const [motivoRetorno, setMotivoRetorno] = useS3('');
  const [repuestos, setRepuestos] = useS3([{ cod: "REP-4412-HYD", desc: "Filtro hidráulico EPIROC", sis: "Hidráulico", cant: 1 }]);
  const [pedidos, setPedidos] = useS3([
    { cant: 1, cod: "REP-KIT-DRV", desc: "Kit de drives", sis: "Mecánico", urg: true },
    { cant: 1, cod: "INS-LCK-001", desc: "Lock tite", sis: "Consumibles", urg: true },
  ]);

  const [showBacklogModal, setShowBacklogModal] = useS3(false);

  const toggleTipo = (k) => setTipoMant({ ...tipoMant, [k]: !tipoMant[k] });

  // HT calc mock
  const htTurno = 2.10;
  const dmTurno = 98.5;

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => onNav("partes-mina")}><Icon name="back" size={14}/> Volver</button>
        <div>
          <h1>Nuevo reporte de mina</h1>
          <div className="sub">Parte diario · uso en campo</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 440px) 1fr", gap: 20, alignItems: "start" }}>
        <div className="phone-wrap">
          <div className="phone-header">
            <Icon name="mine" size={16}/>
            <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 13 }}>Reporte de mina</div>
            <Icon name="x" size={16}/>
          </div>
          <div className="phone-body">

            {/* Cabecera */}
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Equipo *</label>
                <select className="select input-lg" value={equipo} onChange={e => setEquipo(e.target.value)}>
                  <option>JB-DD311</option><option>JB-24</option><option>JB-26</option><option>SC-701</option>
                </select>
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Fecha *</label>
                <input className="input input-lg" type="date" defaultValue="2026-04-20"/>
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Turno *</label>
                <div className="toggle-pills">
                  <button className={"toggle-pill " + (turno === "DIA" ? "active" : "")} onClick={() => setTurno("DIA")}>☀️ DÍA</button>
                  <button className={"toggle-pill " + (turno === "NOCHE" ? "active" : "")} onClick={() => setTurno("NOCHE")}>🌙 NOCHE</button>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Técnico</label>
                <input className="input input-lg" defaultValue="Miranda Barra, Sandro" readOnly style={{ background: "#F5F7FB" }}/>
              </div>
              <div className="field">
                <label>Supervisor del cliente</label>
                <input className="input input-lg" placeholder="Nombre del supervisor"/>
              </div>
            </div>

            <Accordion title="Horómetros" icon="rates" defaultOpen={true}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div className="field"><label>H.Motor Inicial</label><input className="input input-lg" defaultValue="3588.30"/></div>
                <div className="field"><label>H.Motor Final</label><input className="input input-lg" defaultValue="3590.40"/></div>
                <div className="field"><label>H.Percusión Ini</label><input className="input input-lg" defaultValue="2099.70"/></div>
                <div className="field"><label>H.Percusión Fin</label><input className="input input-lg" defaultValue="2101.40"/></div>
                <div className="field"><label>H.Eléctrico Ini</label><input className="input input-lg" defaultValue="3908.10"/></div>
                <div className="field"><label>H.Eléctrico Fin</label><input className="input input-lg" defaultValue="3910.20"/></div>
              </div>
              <div style={{ marginTop: 12, padding: 12, background: dmTurno >= 97.92 ? "var(--green-soft)" : "var(--orange-soft)", border: "1px solid " + (dmTurno >= 97.92 ? "#CDE7CE" : "#FFD9A8"), borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="check" size={18} stroke={3}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>Resultado</div>
                  <div><b>Horas trabajadas:</b> <span className="mono">{htTurno.toFixed(2)} hrs</span> · <b>D.M.:</b> <span className="mono">{dmTurno.toFixed(1)}%</span> ✓</div>
                </div>
              </div>
            </Accordion>

            <Accordion title="Horas del turno" icon="rates">
              <div className="grid-2" style={{ gap: 10 }}>
                <div className="field"><label>Horas trabajadas equipo</label><input className="input" defaultValue="2.10"/></div>
                <div className="field"><label>Mantto. prev. programado</label><input className="input" defaultValue="0.00"/></div>
                <div className="field"><label>Mantto. preventivo</label><input className="input" defaultValue="0.25"/></div>
                <div className="field"><label>Reparación acc./otro</label><input className="input" defaultValue="0.00"/></div>
                <div className="field"><label>Reparación correctiva</label><input className="input" defaultValue="0.00"/></div>
                <div className="field"><label>Stand-by</label><input className="input" defaultValue="9.65"/></div>
              </div>
              <div style={{ marginTop: 12, padding: 10, background: "#F5F7FB", borderRadius: 6, fontSize: 13 }}>Total: <b className="mono">12.00 hrs</b></div>
            </Accordion>

            <Accordion title="Tipo de mantenimiento" icon="cog" defaultOpen={true}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { k: "prg", l: "Prev. programado" },
                  { k: "prv", l: "Preventivo" },
                  { k: "ctvo", l: "Correctivo" },
                  { k: "acc", l: "Accidente" },
                ].map(t => (
                  <button key={t.k}
                    onClick={() => toggleTipo(t.k)}
                    style={{
                      height: 48, border: "1.5px solid " + (tipoMant[t.k] ? "var(--navy)" : "var(--card-border)"),
                      background: tipoMant[t.k] ? "#F5F7FB" : "white",
                      borderRadius: 8, fontSize: 12, fontWeight: 600,
                      color: tipoMant[t.k] ? "var(--navy)" : "var(--text-muted)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                    <span style={{ width: 18, height: 18, border: "1.5px solid " + (tipoMant[t.k] ? "var(--navy)" : "var(--slate-2)"), borderRadius: 4, display: "grid", placeItems: "center", background: tipoMant[t.k] ? "var(--navy)" : "white", color: "white" }}>
                      {tipoMant[t.k] && <Icon name="check" size={12} stroke={3}/>}
                    </span>
                    {t.l}
                  </button>
                ))}
              </div>
            </Accordion>

            <Accordion title="Estado final del equipo" icon="equipment" defaultOpen={true}>
              <div className="status-cards">
                <button className={'status-card ' + (estado === 'operativo' ? 'active green' : '')} onClick={() => setEstado('operativo')}>
                  <span className="big">🟢</span>Operativo
                </button>
                <button className={'status-card ' + (estado === 'espera' ? 'active orange' : '')} onClick={() => setEstado('espera')}>
                  <span className="big">🟡</span>En espera
                </button>
                <button className={'status-card ' + (estado === 'inop' ? 'active red' : '')} onClick={() => setEstado('inop')}>
                  <span className="big">🔴</span>Inoperativo
                </button>
                <button className={'status-card ' + (estado === 'retorno' ? 'active red' : '')} onClick={() => setEstado('retorno')}
                  style={{ borderColor: estado === 'retorno' ? '#1565C0' : '', background: estado === 'retorno' ? '#E3F2FD' : '' }}>
                  <span className="big">🔵</span>Retorno a taller
                </button>
              </div>
              {estado === 'retorno' && (
                <div style={{ marginTop: 10, padding: 12, background: '#E3F2FD', border: '1px solid #1565C0', borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, color: '#0D47A1', fontSize: 12, marginBottom: 6 }}>🔵 Retorno a taller requerido</div>
                  <div style={{ fontSize: 11, color: '#1565C0', marginBottom: 8 }}>Se generará una alerta al Planner para coordinar logística Lima ↔ mina. Indica el motivo:</div>
                  <textarea
                    className="input"
                    rows={2}
                    style={{ fontSize: 12, resize: 'none' }}
                    placeholder="Describe la causa del retorno (falla, programación, etc.)..."
                    value={motivoRetorno}
                    onChange={e => setMotivoRetorno(e.target.value)}/>
                </div>
              )}
            </Accordion>

            <Accordion title="Descripción de trabajos" icon="edit" defaultOpen={true}>
              <MicField defaultValue="Se inspeccionó equipo al inicio de guardia. Se reguló cable de avance y retorno. Se aumentó aceite de lubricación. Se realizó engrase de partes móviles." placeholder="Describe los trabajos realizados..."/>
              <div className="muted" style={{ fontSize: 11, marginTop: 6 }}>Toca el 🎤 para dictar por voz.</div>
            </Accordion>

            <Accordion title="Repuestos utilizados" icon="box">
              {repuestos.map((r, i) => (
                <div key={i} style={{ border: "1px solid var(--card-border)", borderRadius: 6, padding: 10, marginBottom: 8, position: "relative" }}>
                  <div style={{ position: "absolute", top: 6, right: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setRepuestos(repuestos.filter((_, j) => j !== i))}><Icon name="x" size={12}/></button>
                  </div>
                  <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4 }}>ÍTEM #{i + 1}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{r.cod} — {r.desc}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{r.sis} · Cant: <b className="mono">{r.cant}</b></div>
                </div>
              ))}
              <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setRepuestos([...repuestos, { cod: "—", desc: "Nuevo ítem", sis: "—", cant: 1 }])}>
                <Icon name="plus" size={14}/> Agregar repuesto
              </button>
            </Accordion>

            <Accordion title="Lubricantes utilizados" icon="parts">
              <table className="tbl" style={{ fontSize: 12 }}>
                <thead><tr><th>Tipo</th><th>UM</th><th className="num">Cant</th></tr></thead>
                <tbody>
                  <tr><td>15W-40</td><td>GAL</td><td><input className="input" style={{ height: 32, width: 56 }} defaultValue="—"/></td></tr>
                  <tr><td>HD-10W</td><td>GAL</td><td><input className="input" style={{ height: 32, width: 56 }} defaultValue="—"/></td></tr>
                  <tr><td>HD-30</td><td>GAL</td><td><input className="input" style={{ height: 32, width: 56 }} defaultValue="—"/></td></tr>
                  <tr><td>HD-50</td><td>GAL</td><td><input className="input" style={{ height: 32, width: 56 }} defaultValue="—"/></td></tr>
                  <tr><td>Refrigerante</td><td>GAL</td><td><input className="input" style={{ height: 32, width: 56 }} defaultValue="—"/></td></tr>
                  <tr><td>Grasa</td><td>LB</td><td><input className="input" style={{ height: 32, width: 56 }} defaultValue="1/4"/></td></tr>
                  <tr><td>Auto 527</td><td>GAL</td><td><input className="input" style={{ height: 32, width: 56 }} defaultValue="2"/></td></tr>
                </tbody>
              </table>
            </Accordion>

            <Accordion title="Pedido de repuestos" icon="parts" badge={<span className="badge solid-red" style={{ marginLeft: 8 }}>{pedidos.filter(p => p.urg).length} urgentes</span>}>
              {pedidos.map((p, i) => (
                <div key={i} style={{ border: "1px solid var(--card-border)", borderRadius: 6, padding: 10, marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span className="muted" style={{ fontSize: 10, fontWeight: 700 }}>#{i + 1}</span>
                    <span className="bold" style={{ fontSize: 13, flex: 1 }}>{p.desc}</span>
                    {p.urg ? <span className="badge solid-red">URGENTE</span> : <span className="badge orange"><span className="dot"/>Normal</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 11 }}>{p.cod} · {p.sis} · Cant: <b className="mono">{p.cant}</b></div>
                </div>
              ))}
              <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setPedidos([...pedidos, { cant: 1, cod: "—", desc: "Nuevo pedido", sis: "—", urg: false }])}>
                <Icon name="plus" size={14}/> Agregar pedido
              </button>
            </Accordion>

            <Accordion title="Fotos" icon="camera">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div className="thumb-placeholder">FOTO<br/>equipo_01.jpg</div>
                <div className="thumb-placeholder">FOTO<br/>repuesto_02.jpg</div>
                <button className="btn btn-secondary" style={{ height: 88, width: 88, flexDirection: "column", gap: 4 }}>
                  <Icon name="camera" size={22}/>
                  <span style={{ fontSize: 10 }}>Tomar foto</span>
                </button>
              </div>
            </Accordion>

            <Accordion title="Backlog desde campo" icon="orders" badge={<span className="badge cyan" style={{ marginLeft: 8 }}>Nuevo</span>}>
              <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>Registra cualquier hallazgo o trabajo pendiente para futuras OTs.</div>
              <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", color: "var(--cyan)", borderColor: "var(--cyan)" }} onClick={() => setShowBacklogModal(true)}>
                <Icon name="plus" size={14}/> Reportar hallazgo
              </button>
            </Accordion>

            <Accordion title="Comentarios finales" icon="edit">
              <MicField defaultValue="Equipo operativo desde inicio de guardia. Equipo trabajó con normalidad. No registra paradas." placeholder="Comentarios..."/>
            </Accordion>

          </div>
          <div className="phone-footer">
            <button className="btn btn-secondary" onClick={() => onNav("partes-mina")}>Guardar borrador</button>
            <button className="btn btn-primary" onClick={() => onNav("partes-mina")}>Enviar</button>
          </div>
        </div>

        {showBacklogModal && <BacklogModal onClose={() => setShowBacklogModal(false)}/>}

        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-header"><h3>Preview en vivo</h3><span className="hint">Lo que verá el supervisor</span></div>
            <div className="card-body">
              <div style={{ marginBottom: 12 }}>
                <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>Equipo · Turno · Fecha</div>
                <div className="bold" style={{ fontSize: 15, fontFamily: "ui-monospace, monospace" }}>{equipo} · {turno} · 20/04/2026</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>Tipo de mantenimiento</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {tipoMant.prg && <span className="chip">Prev. programado</span>}
                  {tipoMant.prv && <span className="chip">Preventivo</span>}
                  {tipoMant.ctvo && <span className="chip">Correctivo</span>}
                  {tipoMant.acc && <span className="chip">Accidente</span>}
                  {!Object.values(tipoMant).some(Boolean) && <span className="muted" style={{ fontSize: 12 }}>Ninguno seleccionado</span>}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>Estado final</div>
                <div style={{ marginTop: 4 }}>
                  {estado === "operativo" && <span className="badge green"><span className="dot"/>🟢 Operativo</span>}
                  {estado === "espera" && <span className="badge orange"><span className="dot"/>🟡 En espera de repuesto</span>}
                  {estado === "inop" && <span className="badge red"><span className="dot"/>🔴 Inoperativo</span>}
                </div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>Pedidos urgentes</div>
                <div style={{ marginTop: 4 }}>
                  {pedidos.filter(p => p.urg).length > 0
                    ? pedidos.filter(p => p.urg).map((p, i) => (
                      <div key={i} style={{ fontSize: 13, padding: "4px 0" }}>
                        <span className="badge solid-red" style={{ marginRight: 6 }}>URGENTE</span> {p.desc}
                      </div>
                    ))
                    : <span className="muted" style={{ fontSize: 12 }}>Ninguno</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3>Tips</h3></div>
            <div className="card-body muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
              <div>• Todos los campos grandes son tocables cómodamente con el pulgar (48px mínimo).</div>
              <div>• Usa el micrófono 🎤 en cyan para dictar descripciones — el campo se pone en cyan con un punto rojo parpadeante mientras graba.</div>
              <div>• Los pedidos "Urgentes" se envían al gerente en tiempo real.</div>
            </div>
          </div>
        </div>
      </div>

      <FooterBrand/>
    </div>
  );
};

// ---------- Parte diario de taller ----------
export const ParteTallerPage = ({ onNav }) => {
  const [esp, setEsp] = useS3("mec");
  const [taller, setTaller] = useS3("Ate");
  const [showBacklogModal, setShowBacklogModal] = useS3(false);
  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => onNav("partes-taller")}><Icon name="back" size={14}/> Volver</button>
        <div>
          <h1>Parte diario de taller</h1>
          <div className="sub">Mecánico / Eléctrico · Ate o Satipo</div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header"><h3>Cabecera</h3></div>
          <div className="card-body">
            <div className="grid-2">
              <div className="field"><label>Taller *</label>
                <div className="toggle-pills">
                  <button className={"toggle-pill " + (taller === "Ate"    ? "active" : "")} onClick={() => setTaller("Ate")}>Ate</button>
                  <button className={"toggle-pill " + (taller === "Satipo" ? "active" : "")} onClick={() => setTaller("Satipo")}>Satipo</button>
                </div>
              </div>
              <div className="field"><label>Especialidad</label>
                <div className="toggle-pills">
                  <button className={"toggle-pill " + (esp === "mec" ? "active" : "")} onClick={() => setEsp("mec")}>⚙️ Mecánico</button>
                  <button className={"toggle-pill " + (esp === "elc" ? "active" : "")} onClick={() => setEsp("elc")}>⚡ Eléctrico</button>
                </div>
              </div>
              <div className="field"><label>Fecha *</label><input className="input input-lg" type="date" defaultValue="2026-04-20"/></div>
              <div className="field"><label>Técnico *</label><input className="input input-lg" defaultValue="López Vargas, Carlos" readOnly style={{ background: "#F5F7FB" }}/></div>
              <div className="field"><label>Supervisor *</label><input className="input input-lg" placeholder="Supervisor del taller"/></div>
            </div>
            <div className="field mt-md" style={{ padding: 14, border: "2px solid var(--navy)", borderRadius: 8, background: "#F5F7FB", position: "relative" }}>
              <label style={{ color: "var(--navy)", fontWeight: 700 }}>OT asociada *</label>
              <select className="select input-lg"><option>OT-2026-0847 — JB-24 | Buenaventura</option><option>OT-2026-0848 — JB-26 | Antapaccay</option></select>
              <div style={{ marginTop: 6 }}><span className="badge cyan"><span className="dot"/>Vinculado</span></div>
            </div>
          </div>
        </div>

        <Accordion title="Actividades realizadas" icon="workshop" defaultOpen={true} badge={<span className="chip" style={{ marginLeft: 8 }}>2 actividades</span>}>
          {[
            { desc: "Desmontaje de sistema hidráulico. Cambio de sellos internos y prueba de presión.", hi: "08:00", hf: "11:30", kmIni: 3450, kmFin: 3453 },
            { desc: "Engrase general del equipo. Limpieza de filtros y reemplazo de bandas.", hi: "13:00", hf: "17:00", kmIni: 3453, kmFin: 3458 },
          ].map((a, i) => (
            <div key={i} style={{ border: "1px solid var(--card-border)", borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4 }}>ACTIVIDAD #{i + 1}</div>
              <div className="mic-field-wrap" style={{ marginTop: 6 }}>
                <textarea defaultValue={a.desc}/>
                <button className="mic-btn"><Icon name="mic" size={18}/></button>
              </div>
              <div className="grid-2" style={{ marginTop: 10 }}>
                <div className="field"><label>Hora inicio</label><input className="input" type="time" defaultValue={a.hi}/></div>
                <div className="field"><label>Hora fin</label><input className="input" type="time" defaultValue={a.hf}/></div>
                <div className="field"><label>Horómetro/KM inicio</label><input className="input" defaultValue={a.kmIni}/></div>
                <div className="field"><label>Horómetro/KM fin</label><input className="input" defaultValue={a.kmFin}/></div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}><Icon name="plus" size={14}/> Agregar actividad</button>
        </Accordion>

        <Accordion title="Repuestos, materiales e insumos" icon="box">
          <table className="tbl">
            <thead><tr><th>Código</th><th>Descripción</th><th>Sistema</th><th className="num">Cant</th><th></th></tr></thead>
            <tbody>
              <tr><td className="ot-code">REP-4412-HYD</td><td>Filtro hidráulico</td><td>Hidráulico</td><td className="num">1</td><td><Icon name="x" size={12}/></td></tr>
              <tr><td className="ot-code">INS-0088-AH5</td><td>Aceite hidráulico 5L</td><td>Lubricantes</td><td className="num">2</td><td><Icon name="x" size={12}/></td></tr>
            </tbody>
          </table>
          <button className="btn btn-secondary btn-sm mt-md"><Icon name="plus" size={12}/> Agregar ítem</button>
        </Accordion>

        <Accordion title="Pedido de repuestos" icon="parts">
          <div className="muted" style={{ fontSize: 12 }}>No hay pedidos registrados. Usa "+ Agregar pedido" cuando necesites solicitar stock.</div>
          <button className="btn btn-secondary btn-sm mt-md"><Icon name="plus" size={12}/> Agregar pedido</button>
        </Accordion>

        <Accordion title="Aceites y fluidos utilizados" icon="parts">
          <table className="tbl">
            <thead><tr><th>OT</th><th>Tipo</th><th>Motivo</th><th className="num">Cant</th><th>UM</th></tr></thead>
            <tbody>
              <tr><td className="ot-code">OT-2026-0847</td><td>Motor 15W40</td><td>Cambio de aceite</td><td className="num">5</td><td>L</td></tr>
              <tr><td className="ot-code">OT-2026-0847</td><td>Hidráulico SAE10</td><td>Relleno</td><td className="num">2</td><td>L</td></tr>
            </tbody>
          </table>
          <div className="muted" style={{ fontSize: 11, marginTop: 8 }}>Tipos disponibles: Motor 15W40 / Transmisión SAE30 / Hidráulico SAE10 / Diferenciales SAE50 / Tren de fuerza 80W90 / Tellus 68.</div>
        </Accordion>

        <Accordion title="Trabajos pendientes y observaciones" icon="edit">
          <MicField defaultValue="Pendiente revisión del sistema eléctrico del cargador frontal. Solicitar conector 440V."/>
        </Accordion>

        <Accordion title="Backlog desde taller" icon="orders" badge={<span className="badge cyan" style={{ marginLeft: 8 }}>Nuevo</span>}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>Registra cualquier hallazgo o trabajo pendiente para futuras OTs.</div>
          <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", color: "var(--cyan)", borderColor: "var(--cyan)" }} onClick={() => setShowBacklogModal(true)}>
            <Icon name="plus" size={14}/> Reportar hallazgo adicional
          </button>
        </Accordion>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onNav("partes-taller")}>Guardar borrador</button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onNav("partes-taller")}>Enviar para aprobación</button>
        </div>
      </div>
      {showBacklogModal && <BacklogModal onClose={() => setShowBacklogModal(false)}/>}
      <FooterBrand/>
    </div>
  );
};

