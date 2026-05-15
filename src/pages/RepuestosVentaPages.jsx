import { useState } from 'react';
import { Icon, FooterBrand, fmt2 } from '../components/shell.jsx';
import { ZAHORY_SAC_DATA } from '../data.js';

const TODAY = '2026-05-15';

const PV_STATES = {
  borrador:         { label: 'Borrador',          badge: 'slate'  },
  confirmado:       { label: 'Confirmado',         badge: 'cyan'   },
  en_preparacion:   { label: 'En preparación',     badge: 'cyan'   },
  despacho_parcial: { label: 'Despacho parcial',   badge: 'orange' },
  despachado:       { label: 'Despachado',          badge: 'green'  },
  facturado:        { label: 'Facturado',           badge: 'green'  },
  cerrado:          { label: 'Cerrado',             badge: 'green'  },
  cancelado:        { label: 'Cancelado',           badge: 'red'    },
};

const daysLeft = (fecha) => Math.ceil((new Date(fecha) - new Date(TODAY)) / 86400000);

const fmtUSD = (n) => '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PVBadge = ({ estado }) => {
  const s = PV_STATES[estado] || { label: estado, badge: 'slate' };
  return <span className={`badge ${s.badge}`}><span className="dot"/>{s.label}</span>;
};

const SemaforoPV = ({ fecha }) => {
  const d = daysLeft(fecha);
  const color = d > 2 ? 'var(--green)' : d >= 0 ? 'var(--orange)' : 'var(--red)';
  const label = d > 0 ? `${d}d` : d === 0 ? 'Hoy' : `${Math.abs(d)}d venc.`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }}/>
      <span style={{ color, fontWeight: 700 }}>{label}</span>
    </span>
  );
};

const DisponibilidadBadge = ({ disp }) => {
  if (disp === 'stock') return <span className="badge green"><span className="dot"/>En stock</span>;
  if (disp === 'a_pedido') return <span className="badge orange"><span className="dot"/>A pedido</span>;
  return <span className="badge slate"><span className="dot"/>Despachado</span>;
};

const StockSemaforo = ({ actual, minimo, reservado = 0 }) => {
  const disponible = actual - reservado;
  if (disponible <= 0) return <span className="badge red"><span className="dot"/>Sin stock</span>;
  if (disponible <= minimo) return <span className="badge orange"><span className="dot"/>Crítico</span>;
  return <span className="badge green"><span className="dot"/>Normal</span>;
};

const MetaRow = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
  </div>
);

// ── 1. DashboardRepuestos ─────────────────────────────────────────────────────

export const DashboardRepuestos = ({ onNav, setCurrentPV }) => {
  const pedidos = ZAHORY_SAC_DATA.pedidos_venta || [];
  const repuestos = ZAHORY_SAC_DATA.repuestos_catalogo || [];

  const ACTIVE_STATES = ['confirmado', 'en_preparacion', 'despacho_parcial'];
  const pedidosActivos = pedidos.filter(p => ACTIVE_STATES.includes(p.estado));
  const facturacionMes = pedidos
    .filter(p => p.estado === 'facturado' || p.estado === 'cerrado')
    .reduce((s, p) => s + (p.total || 0), 0);
  const stockCritico = repuestos.filter(r => {
    const disp = (r.stock_actual || r.stock || 0) - (r.stock_reservado || 0);
    return disp <= (r.stock_minimo || r.min || 0);
  });
  const aPedidoTransito = pedidos.filter(p =>
    ACTIVE_STATES.includes(p.estado) &&
    (p.items || []).some(it => it.disponibilidad === 'a_pedido')
  ).length;

  const pedidosVencidos = pedidosActivos.filter(p => daysLeft(p.fecha_entrega_comprometida) < 0);

  const KPI_DARK = { background: 'linear-gradient(135deg,#0f172a,#1e2d45)', border: 'none' };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard Venta de Repuestos</h1>
          <div className="sub">Pedidos activos · Stock · Facturación del mes</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan" onClick={() => onNav('repuestos-crear-pedido')}>
          <Icon name="plus" size={14}/> Nuevo pedido
        </button>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi navy" style={KPI_DARK}>
          <div className="label">Pedidos activos</div>
          <div className="value">{pedidosActivos.length}</div>
          <div className="sub">Confirmados + En prep. + Parc.</div>
        </div>
        <div className="kpi">
          <div className="label">Facturación del mes</div>
          <div className="value">{fmtUSD(facturacionMes)}</div>
          <div className="sub">Mayo 2026</div>
        </div>
        <div className={`kpi ${stockCritico.length > 0 ? 'red-soft' : 'green-soft'}`}>
          <div className="label">Stock crítico</div>
          <div className="value">{stockCritico.length}</div>
          <div className="sub">Repuestos bajo mínimo</div>
        </div>
        <div className="kpi">
          <div className="label">A pedido en tránsito</div>
          <div className="value">{aPedidoTransito}</div>
          <div className="sub">Importaciones vinculadas a PVs</div>
        </div>
      </div>

      {(pedidosVencidos.length > 0 || stockCritico.length > 0) && (
        <div className="card" style={{ marginBottom: 16, borderColor: '#F8D7D5' }}>
          <div className="card-header" style={{ background: '#FFEBEE' }}>
            <Icon name="alert" size={14} style={{ color: 'var(--red)' }}/>
            <h3 style={{ color: 'var(--red)' }}>Alertas</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pedidosVencidos.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--red-soft)', borderRadius: 6, fontSize: 13 }}>
                <Icon name="alert" size={14}/>
                <span>Pedido <strong>{p.id}</strong> — {p.cliente_nombre} — entrega vencida ({Math.abs(daysLeft(p.fecha_entrega_comprometida))}d)</span>
                <div className="spacer"/>
                <button className="btn btn-sm btn-ghost" onClick={() => { setCurrentPV(p.id); onNav('repuestos-detalle-pedido'); }}>Ver</button>
              </div>
            ))}
            {stockCritico.slice(0, 3).map(r => (
              <div key={r.codigo || r.cod} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--orange-soft)', borderRadius: 6, fontSize: 13 }}>
                <Icon name="box" size={14}/>
                <span>Stock crítico: <strong>{r.descripcion || r.desc}</strong> — {(r.stock_actual || r.stock || 0) - (r.stock_reservado || 0)} und. disponibles / mínimo {r.stock_minimo || r.min}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Pedidos activos</h3>
          <div className="spacer"/>
          <button className="btn btn-sm btn-ghost" onClick={() => onNav('pedidos-venta')}>
            Ver todos <Icon name="arrow" size={12}/>
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Ítems</th>
                <th className="num">Total</th>
                <th>Estado</th>
                <th>Entrega</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pedidosActivos.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Sin pedidos activos</td></tr>
              )}
              {pedidosActivos.map(p => (
                <tr key={p.id} className="clickable" onClick={() => { setCurrentPV(p.id); onNav('repuestos-detalle-pedido'); }}>
                  <td className="mono">{p.id}</td>
                  <td>{p.cliente_nombre}</td>
                  <td>{(p.items || []).length} ítem{(p.items || []).length !== 1 ? 's' : ''}</td>
                  <td className="num">{p.tipo_cliente === 'interno' ? <span className="muted">—</span> : fmtUSD(p.total)}</td>
                  <td><PVBadge estado={p.estado}/></td>
                  <td><SemaforoPV fecha={p.fecha_entrega_comprometida}/></td>
                  <td>
                    {p.tipo_entrega === 'despacho_a_destino'
                      ? <span className="chip">Despacho</span>
                      : <span className="chip">Retiro taller</span>}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-sm btn-ghost" onClick={() => { setCurrentPV(p.id); onNav('repuestos-detalle-pedido'); }}>
                      Ver
                    </button>
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

// ── 2. PedidosVenta ───────────────────────────────────────────────────────────

export const PedidosVenta = ({ onNav, setCurrentPV }) => {
  const pedidos = ZAHORY_SAC_DATA.pedidos_venta || [];
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const filtered = pedidos.filter(p => {
    const matchEstado = filtroEstado === 'todos' ? true
      : filtroEstado === 'activos' ? ['confirmado', 'en_preparacion', 'despacho_parcial'].includes(p.estado)
      : p.estado === filtroEstado;
    const matchTipo = filtroTipo === 'todos' ? true : p.tipo_cliente === filtroTipo;
    const q = busqueda.toLowerCase();
    const matchQ = !q || p.id.toLowerCase().includes(q) || p.cliente_nombre.toLowerCase().includes(q);
    return matchEstado && matchTipo && matchQ;
  });

  const contadores = {
    todos: pedidos.length,
    activos: pedidos.filter(p => ['confirmado', 'en_preparacion', 'despacho_parcial'].includes(p.estado)).length,
    despachado: pedidos.filter(p => p.estado === 'despachado').length,
    facturado: pedidos.filter(p => p.estado === 'facturado').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pedidos de Venta</h1>
          <div className="sub">{pedidos.length} pedidos registrados</div>
        </div>
        <div className="spacer"/>
        <button className="btn btn-cyan" onClick={() => onNav('repuestos-crear-pedido')}>
          <Icon name="plus" size={14}/> Nuevo pedido
        </button>
      </div>

      <div className="toolbar" style={{ marginBottom: 12 }}>
        <div className="ot-quick-tabs">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'activos', label: 'Activos' },
            { key: 'despachado', label: 'Despachados' },
            { key: 'facturado', label: 'Facturados' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`ot-qtab ${filtroEstado === key ? 'active' : ''}`}
              onClick={() => setFiltroEstado(key)}
            >
              {label}
              <span className="qtab-count">{contadores[key] ?? pedidos.filter(p => p.estado === key).length}</span>
            </button>
          ))}
        </div>
        <div className="spacer"/>
        <select className="select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ width: 160 }}>
          <option value="todos">Todos los tipos</option>
          <option value="contrato">Contrato</option>
          <option value="esporadico">Esporádico</option>
          <option value="interno">Interno Zahory</option>
        </select>
        <input
          className="input"
          placeholder="Buscar PV o cliente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Código PV</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th className="num">Ítems</th>
                <th className="num">Total</th>
                <th>Estado</th>
                <th>Entrega</th>
                <th>Tipo entrega</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                  Sin pedidos que coincidan con los filtros
                </td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="clickable" onClick={() => { setCurrentPV(p.id); onNav('repuestos-detalle-pedido'); }}>
                  <td className="mono">{p.id}</td>
                  <td>{p.cliente_nombre}</td>
                  <td>
                    {p.tipo_cliente === 'contrato' && <span className="badge cyan"><span className="dot"/>Contrato</span>}
                    {p.tipo_cliente === 'esporadico' && <span className="badge slate"><span className="dot"/>Esporádico</span>}
                    {p.tipo_cliente === 'interno' && <span className="badge purple"><span className="dot"/>Interno</span>}
                  </td>
                  <td className="num">{(p.items || []).length}</td>
                  <td className="num">{p.tipo_cliente === 'interno' ? <span className="muted">—</span> : fmtUSD(p.total)}</td>
                  <td><PVBadge estado={p.estado}/></td>
                  <td><SemaforoPV fecha={p.fecha_entrega_comprometida}/></td>
                  <td>
                    {p.tipo_entrega === 'despacho_a_destino' ? 'Despacho' : 'Retiro taller'}
                  </td>
                  <td onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => { setCurrentPV(p.id); onNav('repuestos-detalle-pedido'); }}>
                      Ver
                    </button>
                    {p.estado === 'borrador' && (
                      <button className="btn btn-sm btn-cyan">Confirmar</button>
                    )}
                    {p.estado === 'confirmado' && (
                      <button className="btn btn-sm btn-secondary">Preparar</button>
                    )}
                    {(p.estado === 'despachado' && p.tipo_cliente !== 'interno') && (
                      <button className="btn btn-sm btn-primary">Facturar</button>
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

// ── 3. CrearPedidoPage ────────────────────────────────────────────────────────

export const CrearPedidoPage = ({ onNav }) => {
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    tipo_cliente: 'esporadico',
    cliente_nombre: '',
    lista_precio_id: 'LP-002',
    es_interno: false,
    vinculo_tipo: 'ot',
    vinculo_id: '',
    items: [],
    tipo_entrega: 'retiro_taller',
    destino: '',
    tipo_transporte: 'propio',
    fecha_entrega: TODAY,
  });
  const [itemBusqueda, setItemBusqueda] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  const repuestos = ZAHORY_SAC_DATA.repuestos_catalogo || [];
  const listasPrecios = ZAHORY_SAC_DATA.listas_precio || [];

  const repuestosFiltrados = repuestos.filter(r => {
    if (!itemBusqueda) return true;
    const q = itemBusqueda.toLowerCase();
    return (r.codigo || r.cod || '').toLowerCase().includes(q)
      || (r.descripcion || r.desc || '').toLowerCase().includes(q)
      || (r.modelos_compatibles || []).some(m => m.toLowerCase().includes(q));
  });

  const lista = listasPrecios.find(l => l.id === form.lista_precio_id);

  const calcPrecioFinal = (precioBase) => {
    if (!lista || lista.tipo === 'precio_base') return precioBase;
    if (lista.tipo === 'descuento_porcentual') return precioBase * (1 - lista.descuento_pct / 100);
    if (lista.tipo === 'margen_sobre_costo') return precioBase;
    return precioBase;
  };

  const addItem = (rep) => {
    const existe = form.items.find(it => (it.codigo || it.cod) === (rep.codigo || rep.cod));
    if (existe) return;
    const precioBase = rep.precio_base || rep.usd || 0;
    const precioFinal = calcPrecioFinal(precioBase);
    const disponible = (rep.stock_actual || rep.stock || 0) - (rep.stock_reservado || 0);
    setForm(f => ({
      ...f,
      items: [...f.items, {
        codigo: rep.codigo || rep.cod,
        descripcion: rep.descripcion || rep.desc,
        modelos_compatibles: rep.modelos_compatibles || [],
        qty_pedida: 1,
        precio_base: precioBase,
        descuento_pct: lista?.descuento_pct || 0,
        precio_final: precioFinal,
        disponibilidad: disponible > 0 ? 'stock' : 'a_pedido',
        plazo_importacion_dias: rep.plazo_importacion_dias || null,
        stock_disponible: disponible,
      }]
    }));
    setItemBusqueda('');
  };

  const removeItem = (codigo) => setForm(f => ({ ...f, items: f.items.filter(it => it.codigo !== codigo) }));

  const updateQty = (codigo, qty) => setForm(f => ({
    ...f,
    items: f.items.map(it => it.codigo === codigo ? { ...it, qty_pedida: Math.max(1, Number(qty)) } : it)
  }));

  const subtotal = form.items.reduce((s, it) => s + it.precio_final * it.qty_pedida, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const iteamAPedido = form.items.filter(it => it.disponibilidad === 'a_pedido');

  if (confirmado) {
    return (
      <div className="page">
        <div style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Icon name="check" size={28}/>
          </div>
          <h2 style={{ margin: '0 0 8px', color: 'var(--navy)' }}>Pedido confirmado</h2>
          <div className="muted" style={{ marginBottom: 24 }}>
            PV-2026-003 creado correctamente.
            {iteamAPedido.length > 0 && <> Se generó solicitud de compra para {iteamAPedido.length} ítem(s) a pedido.</>}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => onNav('pedidos-venta')}>
              Ver pedidos
            </button>
            <button className="btn btn-cyan" onClick={() => { setConfirmado(false); setPaso(1); setForm({ tipo_cliente: 'esporadico', cliente_nombre: '', lista_precio_id: 'LP-002', es_interno: false, vinculo_tipo: 'ot', vinculo_id: '', items: [], tipo_entrega: 'retiro_taller', destino: '', tipo_transporte: 'propio', fecha_entrega: TODAY }); }}>
              Nuevo pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  const PASOS = ['Cliente', 'Ítems', 'Entrega', 'Confirmar'];

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('pedidos-venta')}>
          <Icon name="back" size={14}/> Volver
        </button>
        <div>
          <h1>Nuevo Pedido de Venta</h1>
          <div className="sub">Paso {paso} de 4 — {PASOS[paso - 1]}</div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        {PASOS.map((p, i) => {
          const num = i + 1;
          const active = num === paso;
          const done = num < paso;
          return (
            <div key={p} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: done ? 'var(--cyan)' : active ? 'var(--navy)' : '#EEF2F6',
                  color: done || active ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, marginBottom: 4
                }}>
                  {done ? <Icon name="check" size={14}/> : num}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: active ? 'var(--navy)' : 'var(--text-muted)' }}>{p}</div>
              </div>
              {i < PASOS.length - 1 && (
                <div style={{ height: 2, flex: 1, background: num < paso ? 'var(--cyan)' : '#EEF2F6', marginBottom: 20, minWidth: 20 }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* Paso 1: Cliente */}
      {paso === 1 && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header"><h3>Datos del cliente</h3></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`toggle-pill ${!form.es_interno ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, es_interno: false, tipo_cliente: 'esporadico' }))}
              >
                Cliente externo
              </button>
              <button
                className={`toggle-pill ${form.es_interno ? 'active cyan' : ''}`}
                onClick={() => setForm(f => ({ ...f, es_interno: true, tipo_cliente: 'interno' }))}
              >
                Uso interno Zahory
              </button>
            </div>

            {!form.es_interno ? (
              <>
                <div className="field">
                  <label>Tipo de cliente</label>
                  <select className="select" value={form.tipo_cliente} onChange={e => setForm(f => ({ ...f, tipo_cliente: e.target.value }))}>
                    <option value="contrato">Cliente con contrato</option>
                    <option value="esporadico">Cliente esporádico</option>
                  </select>
                </div>
                <div className="field">
                  <label>Nombre / Razón social</label>
                  <input className="input" value={form.cliente_nombre} onChange={e => setForm(f => ({ ...f, cliente_nombre: e.target.value }))} placeholder="Buscar cliente..."/>
                </div>
                <div className="field">
                  <label>Lista de precio</label>
                  <select className="select" value={form.lista_precio_id} onChange={e => setForm(f => ({ ...f, lista_precio_id: e.target.value }))}>
                    {listasPrecios.map(l => (
                      <option key={l.id} value={l.id}>{l.nombre}</option>
                    ))}
                  </select>
                  {lista && (
                    <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--cyan-soft)', borderRadius: 6, fontSize: 12 }}>
                      <span className="badge cyan" style={{ marginRight: 8 }}>Lista: {lista.nombre}</span>
                      {lista.descuento_pct > 0 && <span>{lista.descuento_pct}% de descuento sobre precio base</span>}
                      {lista.tipo === 'precio_base' && <span>Precio base sin descuento</span>}
                      {lista.tipo === 'margen_sobre_costo' && <span>Margen {lista.margen_pct}% sobre costo</span>}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: '10px 12px', background: 'var(--orange-soft)', borderRadius: 6, fontSize: 13 }}>
                  Consumo interno. No se generará factura ni CxC. El pedido se registrará como gasto operativo.
                </div>
                <div className="field">
                  <label>Vincular a</label>
                  <select className="select" value={form.vinculo_tipo} onChange={e => setForm(f => ({ ...f, vinculo_tipo: e.target.value }))}>
                    <option value="ot">Orden de Trabajo (OT)</option>
                    <option value="of">Orden de Fabricación (OF)</option>
                  </select>
                </div>
                <div className="field">
                  <label>Código de {form.vinculo_tipo === 'ot' ? 'OT' : 'OF'} (obligatorio)</label>
                  <input className="input" value={form.vinculo_id} onChange={e => setForm(f => ({ ...f, vinculo_id: e.target.value }))} placeholder={form.vinculo_tipo === 'ot' ? 'OT-2026-XXX' : 'OF-2026-XXX'}/>
                </div>
              </>
            )}
          </div>
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-cyan" onClick={() => setPaso(2)} disabled={!form.es_interno && !form.cliente_nombre}>
              Siguiente <Icon name="arrow" size={14}/>
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Ítems */}
      {paso === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><h3>Buscador de repuestos</h3></div>
            <div className="card-body">
              <input
                className="input" style={{ width: '100%', marginBottom: 12 }}
                placeholder="Buscar por código, descripción o modelo compatible (ej: R1600G)..."
                value={itemBusqueda}
                onChange={e => setItemBusqueda(e.target.value)}
              />
              {itemBusqueda && (
                <div style={{ border: '1px solid var(--card-border)', borderRadius: 6, overflow: 'hidden' }}>
                  {repuestosFiltrados.slice(0, 6).map(r => {
                    const disponible = (r.stock_actual || r.stock || 0) - (r.stock_reservado || 0);
                    const precioFinal = calcPrecioFinal(r.precio_base || r.usd || 0);
                    return (
                      <div
                        key={r.codigo || r.cod}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}
                        onClick={() => addItem(r)}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--cyan-soft)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--navy)', fontWeight: 700, minWidth: 110 }}>{r.codigo || r.cod}</div>
                        <div style={{ flex: 1, fontSize: 13 }}>{r.descripcion || r.desc}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(r.modelos_compatibles || []).join(', ')}</div>
                        <StockSemaforo actual={r.stock_actual || r.stock || 0} minimo={r.stock_minimo || r.min || 0} reservado={r.stock_reservado || 0}/>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{fmtUSD(precioFinal)}</div>
                        <Icon name="plus" size={14}/>
                      </div>
                    );
                  })}
                  {repuestosFiltrados.length === 0 && (
                    <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>Sin resultados</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Ítems del pedido</h3>
              <span className="hint">{form.items.length} ítem(s)</span>
            </div>
            {form.items.length === 0 ? (
              <div className="card-body muted" style={{ textAlign: 'center', padding: 40 }}>
                Usa el buscador para agregar repuestos
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Disponibilidad</th>
                        <th className="num">Precio base</th>
                        <th className="num">Dto. %</th>
                        <th className="num">Precio final</th>
                        <th className="num">Qty</th>
                        <th className="num">Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map(it => (
                        <tr key={it.codigo}>
                          <td className="mono">{it.codigo}</td>
                          <td>{it.descripcion}</td>
                          <td><DisponibilidadBadge disp={it.disponibilidad}/></td>
                          <td className="num">{form.es_interno ? '—' : fmtUSD(it.precio_base)}</td>
                          <td className="num">{form.es_interno ? '—' : `${it.descuento_pct}%`}</td>
                          <td className="num">{form.es_interno ? '—' : fmtUSD(it.precio_final)}</td>
                          <td className="num">
                            <input type="number" min={1} value={it.qty_pedida}
                              onChange={e => updateQty(it.codigo, e.target.value)}
                              className="input" style={{ width: 60, textAlign: 'right', padding: '0 6px' }}/>
                          </td>
                          <td className="num">{form.es_interno ? '—' : fmtUSD(it.precio_final * it.qty_pedida)}</td>
                          <td>
                            <button className="btn btn-sm btn-ghost" onClick={() => removeItem(it.codigo)}>
                              <Icon name="x" size={12}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!form.es_interno && (
                  <div style={{ padding: '12px 18px', background: 'var(--row-alt)', borderTop: '1px solid var(--card-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end', gap: 4, fontSize: 13 }}>
                      <div style={{ display: 'flex', gap: 24 }}><span className="muted">Subtotal:</span><strong>{fmtUSD(subtotal)}</strong></div>
                      <div style={{ display: 'flex', gap: 24 }}><span className="muted">IGV (18%):</span><strong>{fmtUSD(igv)}</strong></div>
                      <div style={{ display: 'flex', gap: 24, fontSize: 16 }}><span>Total:</span><strong style={{ color: 'var(--navy)' }}>{fmtUSD(total)}</strong></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setPaso(1)}>
              <Icon name="back" size={14}/> Anterior
            </button>
            <button className="btn btn-cyan" onClick={() => setPaso(3)} disabled={form.items.length === 0}>
              Siguiente <Icon name="arrow" size={14}/>
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Entrega */}
      {paso === 3 && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header"><h3>Datos de entrega</h3></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>Modalidad de entrega</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`toggle-pill ${form.tipo_entrega === 'retiro_taller' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, tipo_entrega: 'retiro_taller' }))}>
                  Cliente retira en taller
                </button>
                <button className={`toggle-pill ${form.tipo_entrega === 'despacho_a_destino' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, tipo_entrega: 'despacho_a_destino' }))}>
                  Despacho a destino
                </button>
              </div>
            </div>

            {form.tipo_entrega === 'despacho_a_destino' && (
              <>
                <div className="field">
                  <label>Destino</label>
                  <input className="input" value={form.destino} onChange={e => setForm(f => ({ ...f, destino: e.target.value }))} placeholder="Ej: Unidad Minera La Oroya"/>
                </div>
                <div className="field">
                  <label>Tipo de transporte</label>
                  <select className="select" value={form.tipo_transporte} onChange={e => setForm(f => ({ ...f, tipo_transporte: e.target.value }))}>
                    <option value="propio">Transporte propio Zahory</option>
                    <option value="tercero">Transporte tercerizado</option>
                    <option value="cliente">Transporte del cliente</option>
                  </select>
                </div>
              </>
            )}

            <div className="field">
              <label>Fecha de entrega comprometida</label>
              <input type="date" className="input" value={form.fecha_entrega} onChange={e => setForm(f => ({ ...f, fecha_entrega: e.target.value }))}/>
            </div>
          </div>
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setPaso(2)}>
              <Icon name="back" size={14}/> Anterior
            </button>
            <button className="btn btn-cyan" onClick={() => setPaso(4)}>
              Siguiente <Icon name="arrow" size={14}/>
            </button>
          </div>
        </div>
      )}

      {/* Paso 4: Confirmación */}
      {paso === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 }}>
          <div className="card">
            <div className="card-header"><h3>Resumen del pedido</h3></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <MetaRow label="Cliente" value={form.es_interno ? 'Interno Zahory' : form.cliente_nombre || '—'}/>
              <MetaRow label="Tipo" value={form.tipo_cliente === 'contrato' ? 'Con contrato' : form.tipo_cliente === 'interno' ? 'Interno' : 'Esporádico'}/>
              <MetaRow label="Entrega" value={form.tipo_entrega === 'retiro_taller' ? 'Retiro en taller' : `Despacho → ${form.destino || '—'}`}/>
              <MetaRow label="Fecha comprometida" value={form.fecha_entrega}/>
              {form.es_interno && <MetaRow label="Vínculo" value={`${form.vinculo_tipo.toUpperCase()} ${form.vinculo_id}`}/>}
              {!form.es_interno && lista && <MetaRow label="Lista de precio" value={lista.nombre}/>}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Ítems ({form.items.length})</h3></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Qty</th>
                    <th>Disponibilidad</th>
                    {!form.es_interno && <th className="num">Total</th>}
                  </tr>
                </thead>
                <tbody>
                  {form.items.map(it => (
                    <tr key={it.codigo}>
                      <td className="mono">{it.codigo}</td>
                      <td>{it.descripcion}</td>
                      <td>{it.qty_pedida}</td>
                      <td><DisponibilidadBadge disp={it.disponibilidad}/></td>
                      {!form.es_interno && <td className="num">{fmtUSD(it.precio_final * it.qty_pedida)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!form.es_interno && (
              <div style={{ padding: '12px 18px', background: 'var(--row-alt)', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end', gap: 24, fontSize: 13 }}>
                <span className="muted">Subtotal: {fmtUSD(subtotal)}</span>
                <span className="muted">IGV: {fmtUSD(igv)}</span>
                <strong style={{ fontSize: 15 }}>Total: {fmtUSD(total)}</strong>
              </div>
            )}
          </div>

          {iteamAPedido.length > 0 && (
            <div style={{ padding: '12px 16px', background: 'var(--orange-soft)', border: '1px solid #FFD9A8', borderRadius: 8, fontSize: 13 }}>
              <Icon name="alert" size={14}/>&nbsp;
              <strong>{iteamAPedido.length} ítem(s) a pedido</strong> — se generará solicitud automática al módulo de Compras al confirmar.
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setPaso(3)}>
              <Icon name="back" size={14}/> Anterior
            </button>
            <button className="btn btn-cyan" style={{ minWidth: 160 }} onClick={() => setConfirmado(true)}>
              <Icon name="check" size={14}/> Confirmar pedido
            </button>
          </div>
        </div>
      )}
      <FooterBrand/>
    </div>
  );
};

// ── 4. DetallePedidoPage ──────────────────────────────────────────────────────

export const DetallePedidoPage = ({ onNav, pvId }) => {
  const [tab, setTab] = useState('items');
  const [registrandoDespacho, setRegistrandoDespacho] = useState(false);
  const [despachoForm, setDespachoForm] = useState({ guia: '', transportista: '' });

  const pedidos = ZAHORY_SAC_DATA.pedidos_venta || [];
  const pv = pedidos.find(p => p.id === pvId) || pedidos[0];

  if (!pv) return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('pedidos-venta')}><Icon name="back" size={14}/> Volver</button>
        <h1>Pedido no encontrado</h1>
      </div>
    </div>
  );

  const hayPendientes = (pv.items || []).some(it => it.qty_pedida > (it.qty_despachada || 0) && it.disponibilidad === 'stock');

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('pedidos-venta')}>
          <Icon name="back" size={14}/> Pedidos
        </button>
        <div>
          <h1 style={{ fontFamily: 'monospace' }}>{pv.id}</h1>
          <div className="sub">{pv.cliente_nombre} · {pv.fecha_pedido}</div>
        </div>
        <div className="spacer"/>
        <PVBadge estado={pv.estado}/>
        {pv.estado === 'borrador' && <button className="btn btn-cyan">Confirmar pedido</button>}
        {pv.estado === 'confirmado' && <button className="btn btn-primary">Preparar despacho</button>}
        {pv.estado === 'despachado' && pv.tipo_cliente !== 'interno' && <button className="btn btn-cyan">Generar factura</button>}
      </div>

      {/* Cabecera */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <MetaRow label="Cliente" value={pv.cliente_nombre}/>
          <MetaRow label="Tipo cliente" value={pv.tipo_cliente === 'contrato' ? 'Contrato' : pv.tipo_cliente === 'interno' ? 'Interno Zahory' : 'Esporádico'}/>
          <MetaRow label="Fecha pedido" value={pv.fecha_pedido}/>
          <MetaRow label="Entrega comprometida" value={
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {pv.fecha_entrega_comprometida} <SemaforoPV fecha={pv.fecha_entrega_comprometida}/>
            </span>
          }/>
          <MetaRow label="Tipo entrega" value={pv.tipo_entrega === 'despacho_a_destino' ? `Despacho → ${pv.destino}` : 'Retiro en taller'}/>
          {pv.lista_precio_id && <MetaRow label="Lista de precio" value={pv.lista_precio_id}/>}
          {pv.vinculo_id && <MetaRow label="Vínculo" value={`${(pv.vinculo_tipo || '').toUpperCase()} ${pv.vinculo_id}`}/>}
          {pv.tipo_cliente !== 'interno' && <MetaRow label="Total" value={<strong style={{ fontSize: 16 }}>{fmtUSD(pv.total)}</strong>}/>}
          {pv.notas && <div style={{ gridColumn: '1/-1' }}><MetaRow label="Notas" value={pv.notas}/></div>}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'items', label: 'Ítems' },
          { key: 'despachos', label: 'Despachos' },
          { key: 'documentos', label: 'Documentos' },
        ].map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Ítems */}
      {tab === 'items' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Modelos compatibles</th>
                  <th className="num">Qty pedida</th>
                  <th className="num">Qty despachada</th>
                  <th className="num">Pendiente</th>
                  <th>Disponibilidad</th>
                  {pv.tipo_cliente !== 'interno' && <th className="num">Precio final</th>}
                  {pv.tipo_cliente !== 'interno' && <th className="num">Subtotal</th>}
                  <th>Compra vinculada</th>
                </tr>
              </thead>
              <tbody>
                {(pv.items || []).map((it, i) => {
                  const pendiente = it.qty_pedida - (it.qty_despachada || 0);
                  return (
                    <tr key={i}>
                      <td className="mono">{it.codigo}</td>
                      <td>{it.descripcion}</td>
                      <td>{(it.modelos_compatibles || []).map(m => <span key={m} className="chip" style={{ marginRight: 4, fontSize: 10 }}>{m}</span>)}</td>
                      <td className="num">{it.qty_pedida}</td>
                      <td className="num">{it.qty_despachada || 0}</td>
                      <td className="num">
                        <span style={{ color: pendiente > 0 ? 'var(--orange)' : 'var(--green)', fontWeight: 700 }}>
                          {pendiente}
                        </span>
                      </td>
                      <td><DisponibilidadBadge disp={it.qty_pedida === (it.qty_despachada || 0) ? 'despachado' : it.disponibilidad}/></td>
                      {pv.tipo_cliente !== 'interno' && <td className="num">{fmtUSD(it.precio_final)}</td>}
                      {pv.tipo_cliente !== 'interno' && <td className="num">{fmtUSD(it.precio_final * it.qty_pedida)}</td>}
                      <td>
                        {it.compra_generada_id
                          ? <span className="badge orange"><span className="dot"/>{it.compra_generada_id}</span>
                          : <span className="muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pv.tipo_cliente !== 'interno' && (
            <div style={{ padding: '12px 18px', background: 'var(--row-alt)', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end', gap: 24, fontSize: 13 }}>
              <span className="muted">Subtotal: {fmtUSD(pv.subtotal)}</span>
              <span className="muted">IGV: {fmtUSD(pv.igv)}</span>
              <strong style={{ fontSize: 15 }}>Total: {fmtUSD(pv.total)} {pv.moneda}</strong>
            </div>
          )}
        </div>
      )}

      {/* Tab Despachos */}
      {tab === 'despachos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pv.estado === 'despachado' && (
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <MetaRow label="Fecha de despacho" value={pv.fecha_entrega_comprometida}/>
                  <MetaRow label="Ítems despachados" value={`${(pv.items || []).filter(it => it.qty_despachada > 0).length} de ${(pv.items || []).length}`}/>
                  <MetaRow label="Estado" value={<PVBadge estado={pv.estado}/>}/>
                </div>
                <div className="sep"/>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Todos los ítems fueron despachados. Guía de remisión GR-2026-001.</div>
              </div>
            </div>
          )}

          {pv.estado === 'en_preparacion' && (
            <>
              {!registrandoDespacho ? (
                <div className="card">
                  <div className="card-body" style={{ textAlign: 'center', padding: 40 }}>
                    <div className="muted" style={{ marginBottom: 16 }}>Pedido en preparación. Registra el despacho cuando los ítems estén listos.</div>
                    {hayPendientes && (
                      <button className="btn btn-cyan" onClick={() => setRegistrandoDespacho(true)}>
                        <Icon name="download" size={14}/> Registrar despacho
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-header"><h3>Registrar despacho</h3></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ overflowX: 'auto', marginBottom: 8 }}>
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Ubicación</th>
                            <th className="num">Qty pendiente</th>
                            <th className="num">Qty a despachar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(pv.items || []).filter(it => it.disponibilidad === 'stock' && it.qty_pedida > (it.qty_despachada || 0)).map((it, i) => (
                            <tr key={i}>
                              <td className="mono">{it.codigo}</td>
                              <td>{it.descripcion}</td>
                              <td><span className="chip" style={{ fontFamily: 'monospace', fontSize: 11 }}>A-03-12</span></td>
                              <td className="num">{it.qty_pedida - (it.qty_despachada || 0)}</td>
                              <td className="num">
                                <input type="number" min={1} max={it.qty_pedida - (it.qty_despachada || 0)}
                                  defaultValue={it.qty_pedida - (it.qty_despachada || 0)}
                                  className="input" style={{ width: 70, textAlign: 'right', padding: '0 6px' }}/>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid-2">
                      <div className="field">
                        <label>Número de guía de remisión</label>
                        <input className="input" value={despachoForm.guia} onChange={e => setDespachoForm(f => ({ ...f, guia: e.target.value }))} placeholder="GR-2026-XXX"/>
                      </div>
                      <div className="field">
                        <label>Transportista (si aplica)</label>
                        <input className="input" value={despachoForm.transportista} onChange={e => setDespachoForm(f => ({ ...f, transportista: e.target.value }))} placeholder="Nombre o empresa"/>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-ghost" onClick={() => setRegistrandoDespacho(false)}>Cancelar</button>
                      <button className="btn btn-cyan">
                        <Icon name="check" size={14}/> Confirmar despacho
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!['en_preparacion', 'despachado'].includes(pv.estado) && (
            <div className="card">
              <div className="card-body muted" style={{ textAlign: 'center', padding: 40 }}>
                Sin despachos registrados aún. El pedido debe estar en preparación para registrar despachos.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Documentos */}
      {tab === 'documentos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pv.estado === 'despachado' && (
            <div className="card">
              <div className="card-header"><h3>Guías de remisión</h3></div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                  <Icon name="pdf" size={16}/>
                  <span style={{ flex: 1, fontSize: 13 }}>GR-2026-001 — Despacho completo · {pv.fecha_entrega_comprometida}</span>
                  <button className="btn btn-sm btn-ghost"><Icon name="download" size={13}/> Descargar</button>
                </div>
              </div>
            </div>
          )}

          {pv.tipo_cliente !== 'interno' && (
            <div className="card">
              <div className="card-header">
                <h3>Facturas</h3>
                {pv.estado === 'despachado' && (
                  <div className="spacer" style={{ flex: 1 }}/>
                )}
                {pv.estado === 'despachado' && (
                  <button className="btn btn-sm btn-cyan"><Icon name="pdf" size={13}/> Generar factura</button>
                )}
              </div>
              <div className="card-body">
                {pv.estado !== 'facturado' && pv.estado !== 'cerrado' ? (
                  <div className="muted" style={{ textAlign: 'center', padding: 20 }}>
                    Sin facturas emitidas. {pv.estado === 'despachado' ? 'El pedido está listo para facturar.' : 'La factura se generará cuando el pedido esté despachado.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                    <Icon name="pdf" size={16}/>
                    <span style={{ flex: 1, fontSize: 13 }}>FAC-2026-001 · {fmtUSD(pv.total)} USD</span>
                    <button className="btn btn-sm btn-ghost"><Icon name="download" size={13}/> Descargar</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <FooterBrand/>
    </div>
  );
};

// ── 5. CatalogoPrecios ────────────────────────────────────────────────────────

export const CatalogoPrecios = () => {
  const [tab, setTab] = useState('catalogo');
  const [filtroMarca, setFiltroMarca] = useState('todas');
  const [filtroStock, setFiltroStock] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [repSeleccionado, setRepSeleccionado] = useState(null);
  const [listaSeleccionada, setListaSeleccionada] = useState(null);

  const repuestos = ZAHORY_SAC_DATA.repuestos_catalogo || [];
  const listasPrecios = ZAHORY_SAC_DATA.listas_precio || [];

  const marcas = ['todas', ...new Set(repuestos.map(r => r.marca).filter(Boolean))];

  const filteredReps = repuestos.filter(r => {
    const disponible = (r.stock_actual || r.stock || 0) - (r.stock_reservado || 0);
    const minimo = r.stock_minimo || r.min || 0;
    const matchMarca = filtroMarca === 'todas' || r.marca === filtroMarca;
    const matchStock = filtroStock === 'todos' ? true
      : filtroStock === 'critico' ? (disponible > 0 && disponible <= minimo)
      : filtroStock === 'sin_stock' ? disponible <= 0
      : disponible > minimo;
    const q = busqueda.toLowerCase();
    const matchQ = !q
      || (r.codigo || r.cod || '').toLowerCase().includes(q)
      || (r.descripcion || r.desc || '').toLowerCase().includes(q)
      || (r.modelos_compatibles || []).some(m => m.toLowerCase().includes(q));
    return matchMarca && matchStock && matchQ;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Catálogo y Precios</h1>
          <div className="sub">{repuestos.length} repuestos · {listasPrecios.length} listas de precio</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'catalogo' ? 'active' : ''}`} onClick={() => setTab('catalogo')}>Catálogo</button>
        <button className={`tab ${tab === 'listas' ? 'active' : ''}`} onClick={() => setTab('listas')}>Listas de precio</button>
      </div>

      {tab === 'catalogo' && (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="toolbar">
              <input className="input" placeholder="Buscar código, descripción o modelo..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: 280 }}/>
              <select className="select" value={filtroMarca} onChange={e => setFiltroMarca(e.target.value)} style={{ width: 160 }}>
                {marcas.map(m => <option key={m} value={m}>{m === 'todas' ? 'Todas las marcas' : m}</option>)}
              </select>
              <div className="seg">
                {[
                  { key: 'todos', label: 'Todos' },
                  { key: 'normal', label: 'Normal' },
                  { key: 'critico', label: 'Crítico' },
                  { key: 'sin_stock', label: 'Sin stock' },
                ].map(({ key, label }) => (
                  <button key={key} className={filtroStock === key ? 'active' : ''} onClick={() => setFiltroStock(key)}>{label}</button>
                ))}
              </div>
              <div className="spacer"/>
              <span className="muted" style={{ fontSize: 12 }}>{filteredReps.length} resultado(s)</span>
            </div>
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Marca</th>
                      <th>Modelos</th>
                      <th className="num">Stock</th>
                      <th className="num">Reservado</th>
                      <th className="num">Disponible</th>
                      <th>Estado stock</th>
                      <th className="num">Precio base</th>
                      <th className="num">Margen %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReps.length === 0 && (
                      <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Sin resultados</td></tr>
                    )}
                    {filteredReps.map(r => {
                      const stock = r.stock_actual || r.stock || 0;
                      const reservado = r.stock_reservado || 0;
                      const disponible = stock - reservado;
                      const minimo = r.stock_minimo || r.min || 0;
                      return (
                        <tr key={r.codigo || r.cod} className="clickable" onClick={() => setRepSeleccionado(r)}>
                          <td className="mono">{r.codigo || r.cod}</td>
                          <td>{r.descripcion || r.desc}</td>
                          <td>{r.marca || '—'}</td>
                          <td style={{ fontSize: 11 }}>{(r.modelos_compatibles || []).join(', ') || '—'}</td>
                          <td className="num">{stock}</td>
                          <td className="num" style={{ color: reservado > 0 ? 'var(--orange)' : '' }}>{reservado}</td>
                          <td className="num"><strong>{disponible}</strong></td>
                          <td><StockSemaforo actual={stock} minimo={minimo} reservado={reservado}/></td>
                          <td className="num">{r.precio_base ? fmtUSD(r.precio_base) : (r.usd ? fmtUSD(r.usd) : '—')}</td>
                          <td className="num">{r.margen_estandar_pct != null ? `${r.margen_estandar_pct}%` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel lateral repuesto */}
          {repSeleccionado && (
            <div className="card" style={{ width: 320, flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
              <div className="card-header">
                <h3 style={{ fontFamily: 'monospace' }}>{repSeleccionado.codigo || repSeleccionado.cod}</h3>
                <div className="spacer"/>
                <button className="btn btn-ghost btn-sm" onClick={() => setRepSeleccionado(null)}><Icon name="x" size={12}/></button>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <MetaRow label="Descripción" value={repSeleccionado.descripcion || repSeleccionado.desc}/>
                <MetaRow label="Marca" value={repSeleccionado.marca || '—'}/>
                <MetaRow label="Modelos compatibles" value={
                  (repSeleccionado.modelos_compatibles || []).length
                    ? (repSeleccionado.modelos_compatibles || []).map(m => <span key={m} className="chip" style={{ marginRight: 4, fontSize: 10 }}>{m}</span>)
                    : '—'
                }/>
                <MetaRow label="Unidad" value={repSeleccionado.unidad || repSeleccionado.um}/>
                <div className="sep"/>
                <MetaRow label="Stock actual" value={repSeleccionado.stock_actual || repSeleccionado.stock || 0}/>
                <MetaRow label="Stock reservado" value={repSeleccionado.stock_reservado || 0}/>
                <MetaRow label="Stock mínimo" value={repSeleccionado.stock_minimo || repSeleccionado.min || 0}/>
                <MetaRow label="Ubicación" value={repSeleccionado.ubicacion_fisica || '—'}/>
                <div className="sep"/>
                <MetaRow label="Costo aterrizado" value={repSeleccionado.costo_aterrizado ? fmtUSD(repSeleccionado.costo_aterrizado) : '—'}/>
                <MetaRow label="Margen estándar" value={repSeleccionado.margen_estandar_pct != null ? `${repSeleccionado.margen_estandar_pct}%` : '—'}/>
                <MetaRow label="Precio base" value={repSeleccionado.precio_base ? fmtUSD(repSeleccionado.precio_base) : (repSeleccionado.usd ? fmtUSD(repSeleccionado.usd) : '—')}/>
                {repSeleccionado.es_importado && (
                  <>
                    <div className="sep"/>
                    <MetaRow label="Proveedor habitual" value={repSeleccionado.proveedor_habitual || '—'}/>
                    <MetaRow label="Plazo importación" value={repSeleccionado.plazo_importacion_dias ? `${repSeleccionado.plazo_importacion_dias} días` : '—'}/>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'listas' && (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="toolbar">
              <div className="spacer"/>
              <button className="btn btn-cyan"><Icon name="plus" size={14}/> Nueva lista</button>
            </div>
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Descuento / Margen</th>
                      <th>Clientes asignados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listasPrecios.map(l => (
                      <tr key={l.id} className="clickable" onClick={() => setListaSeleccionada(l)}>
                        <td className="mono">{l.id}</td>
                        <td><strong>{l.nombre}</strong></td>
                        <td>
                          {l.tipo === 'precio_base' && <span className="badge slate"><span className="dot"/>Precio base</span>}
                          {l.tipo === 'descuento_porcentual' && <span className="badge cyan"><span className="dot"/>Descuento %</span>}
                          {l.tipo === 'margen_sobre_costo' && <span className="badge purple"><span className="dot"/>Margen s/costo</span>}
                        </td>
                        <td>
                          {l.descuento_pct > 0 ? `-${l.descuento_pct}%`
                            : l.margen_pct ? `+${l.margen_pct}% margen`
                            : 'Sin descuento'}
                        </td>
                        <td>{l.clientes_asignados?.length || 0} cliente(s)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel lateral lista */}
          {listaSeleccionada && (
            <div className="card" style={{ width: 320, flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
              <div className="card-header">
                <h3>{listaSeleccionada.nombre}</h3>
                <div className="spacer"/>
                <button className="btn btn-ghost btn-sm" onClick={() => setListaSeleccionada(null)}><Icon name="x" size={12}/></button>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <MetaRow label="ID" value={listaSeleccionada.id}/>
                <MetaRow label="Descripción" value={listaSeleccionada.descripcion}/>
                <MetaRow label="Tipo" value={listaSeleccionada.tipo}/>
                {listaSeleccionada.descuento_pct > 0 && <MetaRow label="Descuento" value={`${listaSeleccionada.descuento_pct}% sobre precio base`}/>}
                {listaSeleccionada.margen_pct && <MetaRow label="Margen" value={`${listaSeleccionada.margen_pct}% sobre costo aterrizado`}/>}
                <div className="sep"/>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
                    Clientes asignados ({(listaSeleccionada.clientes_asignados || []).length})
                  </div>
                  {(listaSeleccionada.clientes_asignados || []).length === 0
                    ? <div className="muted" style={{ fontSize: 12 }}>Sin clientes asignados (aplica a todos)</div>
                    : (listaSeleccionada.clientes_asignados || []).map(c => (
                      <div key={c} style={{ padding: '4px 0', fontSize: 13, fontFamily: 'monospace' }}>{c}</div>
                    ))
                  }
                </div>
                <button className="btn btn-secondary btn-sm"><Icon name="plus" size={12}/> Asignar cliente</button>
              </div>
            </div>
          )}
        </div>
      )}
      <FooterBrand/>
    </div>
  );
};

// ── 6. DespachosRepuestos ─────────────────────────────────────────────────────

export const DespachosRepuestos = ({ onNav, setCurrentPV }) => {
  const pedidos = ZAHORY_SAC_DATA.pedidos_venta || [];
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [despachoForm, setDespachoForm] = useState({ guia: '', transportista: '', foto: false });
  const [despachado, setDespachado] = useState(false);

  const preparando = pedidos.filter(p => ['en_preparacion', 'despacho_parcial'].includes(p.estado));

  const handleDespachar = () => {
    setDespachado(true);
    setTimeout(() => { setDespachado(false); setPedidoActivo(null); setDespachoForm({ guia: '', transportista: '', foto: false }); }, 2200);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Despachos de Repuestos</h1>
          <div className="sub">{preparando.length} pedido(s) pendientes de despacho</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {preparando.length === 0 && (
            <div className="card">
              <div className="card-body muted" style={{ textAlign: 'center', padding: 60 }}>
                <Icon name="check" size={32}/>
                <div style={{ marginTop: 12 }}>No hay pedidos pendientes de despacho.</div>
              </div>
            </div>
          )}
          {preparando.map(p => {
            const itemsStock = (p.items || []).filter(it => it.disponibilidad === 'stock' && it.qty_pedida > (it.qty_despachada || 0));
            const isActive = pedidoActivo?.id === p.id;
            return (
              <div key={p.id} className="card" style={{ marginBottom: 14, border: isActive ? '2px solid var(--cyan)' : undefined }}>
                <div className="card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--navy)' }}>{p.id}</span>
                      <PVBadge estado={p.estado}/>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                      {p.cliente_nombre} · {p.tipo_entrega === 'despacho_a_destino' ? `Despacho → ${p.destino}` : 'Retiro en taller'}
                      · Entrega: {p.fecha_entrega_comprometida}
                    </div>
                  </div>
                  <div className="spacer"/>
                  <SemaforoPV fecha={p.fecha_entrega_comprometida}/>
                  <button className="btn btn-sm btn-ghost" onClick={() => { setCurrentPV(p.id); onNav('repuestos-detalle-pedido'); }}>
                    <Icon name="report" size={13}/> Ver PV
                  </button>
                  <button
                    className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-cyan'}`}
                    onClick={() => setPedidoActivo(isActive ? null : p)}
                  >
                    {isActive ? 'Cancelar' : 'Preparar despacho'}
                  </button>
                </div>

                {/* Items a despachar */}
                <div style={{ overflowX: 'auto' }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Ubicación</th>
                        <th className="num">Pedida</th>
                        <th className="num">Despachada</th>
                        <th className="num">Pendiente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsStock.map((it, i) => (
                        <tr key={i}>
                          <td className="mono">{it.codigo}</td>
                          <td>{it.descripcion}</td>
                          <td><span className="chip" style={{ fontFamily: 'monospace', fontSize: 11 }}>A-03-12</span></td>
                          <td className="num">{it.qty_pedida}</td>
                          <td className="num">{it.qty_despachada || 0}</td>
                          <td className="num"><strong style={{ color: 'var(--orange)' }}>{it.qty_pedida - (it.qty_despachada || 0)}</strong></td>
                        </tr>
                      ))}
                      {itemsStock.length === 0 && (
                        <tr><td colSpan={6} style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>
                          Ítems pendientes están a pedido (sin stock disponible)
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel de registro de despacho */}
        {pedidoActivo && (
          <div className="card" style={{ width: 340, flexShrink: 0, position: 'sticky', top: 80 }}>
            <div className="card-header">
              <h3>Registrar despacho</h3>
              <span className="hint">{pedidoActivo.id}</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {despachado ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ color: 'var(--green)', fontSize: 32, marginBottom: 8 }}>✓</div>
                  <div style={{ fontWeight: 700 }}>Despacho registrado</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Stock descontado · PV actualizado</div>
                </div>
              ) : (
                <>
                  <div className="field">
                    <label>N° Guía de remisión *</label>
                    <input className="input" value={despachoForm.guia} onChange={e => setDespachoForm(f => ({ ...f, guia: e.target.value }))} placeholder="GR-2026-XXX"/>
                  </div>
                  <div className="field">
                    <label>Transportista</label>
                    <input className="input" value={despachoForm.transportista} onChange={e => setDespachoForm(f => ({ ...f, transportista: e.target.value }))} placeholder="Nombre o empresa (si aplica)"/>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    <input type="checkbox" id="foto-packing" checked={despachoForm.foto} onChange={e => setDespachoForm(f => ({ ...f, foto: e.target.checked }))}/>
                    <label htmlFor="foto-packing">Adjuntar foto de packing (opcional)</label>
                  </div>
                  {despachoForm.foto && (
                    <div className="thumb-placeholder">📷<br/>Seleccionar foto</div>
                  )}
                  <div className="sep"/>
                  <div style={{ padding: '8px 10px', background: 'var(--orange-soft)', borderRadius: 6, fontSize: 12 }}>
                    Al confirmar: el stock se descontará del inventario y el PV actualizará su estado.
                  </div>
                  <button className="btn btn-cyan" disabled={!despachoForm.guia} onClick={handleDespachar}>
                    <Icon name="check" size={14}/> Confirmar despacho
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <FooterBrand/>
    </div>
  );
};
