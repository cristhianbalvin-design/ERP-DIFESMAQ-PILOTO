import { useState, useEffect } from 'react';
import { Icon, Sidebar, TopBar, FooterBrand } from './components/shell.jsx';
import { LoginPage, DashboardPage, CostosPage, OTDetallePage } from './pages/pages1.jsx';
import { OTsListadoPage, GestionPartesTallerPage, HistorialMinaPage, SolicitudesPage, CatalogoPage, DocsPage, UsuariosPage, ConsolidadoPage, TecnicoDashboard } from './pages/pages2.jsx';
import { ReporteMinaPage, ParteTallerPage } from './pages/pages3.jsx';
import { BacklogPage } from './pages/BacklogPage.jsx';
import { EquiposPage } from './pages/EquiposPage.jsx';
import { ProyectosTarifasPage } from './pages/ProyectosTarifasPage.jsx';
import { ConfiguracionPage } from './pages/ConfiguracionPage.jsx';
import { ClientesContratosPage } from './pages/ClientesContratosPage.jsx';
import { CrearOTPage } from './pages/CrearOTPage.jsx';
import { FlotaRentalPage, ContratosRentalPage, DespachosRentalPage, LiquidacionRentalPage, DashboardRentalPage } from './pages/AlquileresPages.jsx';

const TWEAKS_DEFAULTS = {
  "accentColor": "#00BCD4",
  "navyColor": "#1A2B4A",
  "density": "comfortable",
  "showFutureModules": true
};

const PAGE_LABELS = {
  "dashboard": { title: "Dashboard", crumb: "Operaciones" },
  "backlog": { title: "Backlog de trabajos", crumb: "Operaciones" },
  "ots": { title: "Órdenes de trabajo", crumb: "Operaciones" },
  "crear-ot": { title: "Nueva Orden de Trabajo", crumb: "Operaciones › OTs" },
  "ot-detalle": { title: "Detalle de OT", crumb: "Operaciones › OTs" },
  "mina": { title: "Reportes de mina", crumb: "Operaciones" },
  "mis-reportes": { title: "Mis reportes", crumb: "Operaciones" },
  "nuevo-reporte": { title: "Nuevo reporte de mina", crumb: "Operaciones › Reportes" },
  "taller":          { title: "Parte diario de taller",      crumb: "Operaciones" },
  "partes-taller":   { title: "Partes Diarios — Taller",     crumb: "Operaciones › Taller y Servicios" },
  "partes-mina":     { title: "Partes Diarios — Mina",       crumb: "Operaciones › Taller y Servicios" },
  "crear-parte-taller": { title: "Nuevo Parte Diario",       crumb: "Operaciones › Partes Taller" },
  "costos": { title: "Costos y rentabilidad", crumb: "Análisis" },
  "consolidado": { title: "Reporte consolidado", crumb: "Análisis" },
  "docs": { title: "Documentos comerciales", crumb: "Clientes" },
  "catalogo": { title: "Catálogo de repuestos", crumb: "Inventario" },
  "solicitudes": { title: "Solicitudes de repuestos", crumb: "Inventario" },
  "usuarios": { title: "Usuarios y roles", crumb: "Configuración" },
  "clientes": { title: "Clientes y Contratos", crumb: "Maestros" },
  "equipos": { title: "Equipos y Activos", crumb: "Maestros" },
  "proyectos": { title: "Proyectos y Tarifas", crumb: "Maestros" },
  "config": { title: "Configuración del sistema", crumb: "Configuración" },
  "flota":            { title: "Panel de Flota",       crumb: "Flota y Alquileres" },
  "contratos-rental": { title: "Contratos y Tarifas",  crumb: "Flota y Alquileres" },
  "checkout":         { title: "Actas / Despachos",    crumb: "Flota y Alquileres" },
  "liquidacion":      { title: "Liquidación y DMR",    crumb: "Flota y Alquileres" },
  // ── Confiabilidad ──────────────────────────────────────────────────────
  "sos-telemetria":     { title: "SOS y Telemetría",      crumb: "Confiabilidad" },
  // ── Transporte Comercial ───────────────────────────────────────────────
  "transporte-viajes":  { title: "Monitor de Viajes",     crumb: "Transporte Comercial" },
  "transporte-ruta":    { title: "Ejecución en Ruta",     crumb: "Transporte Comercial" },
  "transporte-tarifas": { title: "Maestro de Rutas",      crumb: "Transporte Comercial" },
  // ── Maestranza ─────────────────────────────────────────────────────────
  "maestranza-of":             { title: "Órdenes de Fabricación",  crumb: "Maestranza y Fab." },
  "maestranza-bom":            { title: "Estructuras y BOM",       crumb: "Maestranza y Fab." },
  "maestranza-piso":           { title: "Control de Piso",         crumb: "Maestranza y Fab." },
  // Línea: Flota y Alquileres
  "dashboard-rental":          { title: "Dashboard Rental",        crumb: "Flota y Alquileres" },
  // Línea: Transporte Comercial
  "dashboard-transporte":      { title: "Dashboard Transporte",    crumb: "Transporte Comercial" },
  // Línea: Maestranza
  "dashboard-maestranza":      { title: "Dashboard Maestranza",    crumb: "Maestranza y Fab." },
  // Línea: Venta de Repuestos
  "dashboard-repuestos":       { title: "Dashboard Repuestos",     crumb: "Venta de Repuestos" },
  "pedidos-venta":             { title: "Pedidos de Venta",        crumb: "Venta de Repuestos" },
  "catalogo-precios":          { title: "Catálogo y Precios",      crumb: "Venta de Repuestos" },
  "despachos-repuestos":       { title: "Despachos",               crumb: "Venta de Repuestos" },
  // Confiabilidad
  "indicadores-confiabilidad": { title: "Indicadores MTBF/MTTR",   crumb: "Confiabilidad" },
  // Almacén
  "compras-importaciones":     { title: "Compras e Importaciones", crumb: "Almacén y Repuestos" },
  // Comercial y Finanzas
  "proveedores":               { title: "Proveedores",             crumb: "Comercial y Finanzas" },
};

const PlaceholderPage = ({ title }) => (
  <div className="page">
    <div className="page-header"><div><h1>{title}</h1><div className="sub">Módulo en construcción</div></div></div>
    <div className="card"><div className="card-body muted" style={{ textAlign: "center", padding: 60 }}>
      <Icon name="cog" size={32}/>
      <div style={{ marginTop: 12, fontSize: 14 }}>Este módulo estará disponible próximamente.</div>
    </div></div>
    <FooterBrand/>
  </div>
);

const TweaksPanel = ({ tweaks, setTweaks, onClose }) => (
  <div className="tweaks-panel">
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      <h4 style={{ margin: 0, flex: 1 }}>Tweaks</h4>
      <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={12}/></button>
    </div>
    <div className="tw-row"><label>Color navy</label><input type="color" value={tweaks.navyColor} onChange={e => setTweaks({ ...tweaks, navyColor: e.target.value })}/></div>
    <div className="tw-row"><label>Color acento</label><input type="color" value={tweaks.accentColor} onChange={e => setTweaks({ ...tweaks, accentColor: e.target.value })}/></div>
    <div className="tw-row"><label>Densidad</label>
      <div className="seg">
        <button className={tweaks.density === "compact" ? "active" : ""} onClick={() => setTweaks({ ...tweaks, density: "compact" })}>Compacto</button>
        <button className={tweaks.density === "comfortable" ? "active" : ""} onClick={() => setTweaks({ ...tweaks, density: "comfortable" })}>Cómodo</button>
      </div>
    </div>
    <div className="tw-row"><label>Módulos "Próximamente"</label>
      <input type="checkbox" checked={tweaks.showFutureModules} onChange={e => setTweaks({ ...tweaks, showFutureModules: e.target.checked })}/>
    </div>
    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8, borderTop: "1px solid var(--card-border)", paddingTop: 8 }}>
      Presets de rol en la barra superior · click en píldora cyan.
    </div>
  </div>
);

export const App = () => {
  const [role, setRole] = useState(() => localStorage.getItem("zahory_sac_role") || "login");
  const [current, setCurrent] = useState(() => localStorage.getItem("zahory_sac_page") || "dashboard");
  const [currentOT, setCurrentOT] = useState("OT-2026-050");
  const [tweaks, setTweaks] = useState(TWEAKS_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => { if (role !== "login") localStorage.setItem("zahory_sac_role", role); }, [role]);
  useEffect(() => { localStorage.setItem("zahory_sac_page", current); }, [current]);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Apply tweaks to CSS vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--navy", tweaks.navyColor);
    r.style.setProperty("--cyan", tweaks.accentColor);
  }, [tweaks]);

  if (role === "login") {
    return <LoginPage onLogin={(r) => { setRole(r); setCurrent("dashboard"); }}/>;
  }

  const label = PAGE_LABELS[current] || { title: current, crumb: "" };

  let content;
  if (role === "tecnico") {
    if (current === "dashboard") content = <TecnicoDashboard onNav={setCurrent}/>;
    else if (current === "nuevo-reporte") content = <ReporteMinaPage onNav={setCurrent}/>;
    else if (current === "mis-reportes") content = <HistorialMinaPage/>;
    else if (current === "solicitudes") content = <SolicitudesPage/>;
    else content = <PlaceholderPage title={label.title}/>;
  } else {
    switch (current) {
      case "dashboard": content = <DashboardPage onNav={setCurrent} setCurrentOT={setCurrentOT}/>; break;
      case "backlog": content = <BacklogPage onNav={setCurrent}/>; break;
      case "costos": content = <CostosPage onNav={setCurrent} setCurrentOT={setCurrentOT}/>; break;
      case "ots": content = <OTsListadoPage onNav={setCurrent} setCurrentOT={setCurrentOT}/>; break;
      case "crear-ot": content = <CrearOTPage onNav={setCurrent}/>; break;
      case "ot-detalle": content = <OTDetallePage onNav={setCurrent} code={currentOT}/>; break;
      case "mina": content = <HistorialMinaPage/>; break;
      case "nuevo-reporte": content = <ReporteMinaPage onNav={setCurrent}/>; break;
      case "taller":             content = <ParteTallerPage onNav={setCurrent}/>; break;
      case "partes-taller":      content = <GestionPartesTallerPage onNav={setCurrent}/>; break;
      case "partes-mina":        content = <HistorialMinaPage onNav={setCurrent}/>; break;
      case "crear-parte-taller": content = <ParteTallerPage onNav={setCurrent}/>; break;
      case "consolidado": content = <ConsolidadoPage/>; break;
      case "catalogo": content = <CatalogoPage/>; break;
      case "solicitudes": content = <SolicitudesPage/>; break;
      case "docs": content = <DocsPage/>; break;
      case "usuarios": content = <UsuariosPage/>; break;
      case "clientes": content = <ClientesContratosPage/>; break;
      case "equipos": content = <EquiposPage/>; break;
      case "proyectos": content = <ProyectosTarifasPage/>; break;
      case "config":            content = <ConfiguracionPage/>; break;
      case "dashboard-rental":  content = <DashboardRentalPage onNav={setCurrent}/>; break;
      case "flota":             content = <FlotaRentalPage onNav={setCurrent}/>; break;
      case "contratos-rental":  content = <ContratosRentalPage/>; break;
      case "checkout":          content = <DespachosRentalPage onNav={setCurrent}/>; break;
      case "liquidacion":       content = <LiquidacionRentalPage onNav={setCurrent} setCurrentOT={setCurrentOT}/>; break;
      default: content = <PlaceholderPage title={label.title}/>;
    }
  }

  return (
    <div className="app-shell" data-screen-label={current}>
      <Sidebar current={current} onNav={setCurrent} role={role} onLogout={() => setRole("login")}/>
      <div className="main">
        <TopBar title={label.title} crumb={label.crumb} role={role} onRoleSwap={() => { setRole(role === "gerente" ? "tecnico" : "gerente"); setCurrent("dashboard"); }}/>
        {content}
      </div>
      {tweaksOpen && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setTweaksOpen(false)}/>}
    </div>
  );
};
