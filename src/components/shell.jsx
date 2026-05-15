import { useState, useEffect } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
export const Icon = ({ name, size = 16, stroke = 2 }) => {
  const s = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
    orders:    <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    mine:      <><path d="M2 20h20"/><path d="M4 20l4-10 4 4 4-8 4 14"/></>,
    workshop:  <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9L6.6 21a2.1 2.1 0 1 1-3-3l6.6-7.1a6 6 0 0 1 7.9-7.9l-3.7 3.7z"/></>,
    chart:     <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></>,
    report:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></>,
    clients:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    box:       <><path d="M21 8V21H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></>,
    parts:     <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    cog:       <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    equipment: <><rect x="2" y="7" width="20" height="12" rx="2"/><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></>,
    rates:     <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
    lock:      <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></>,
    bell:      <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
    download:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>,
    plus:      <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    arrow:     <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    back:      <><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></>,
    filter:    <><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    chev:      <><path d="m9 18 6-6-6-6"/></>,
    chevDown:  <><path d="m6 9 6 6 6-6"/></>,
    mic:       <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><path d="M12 19v3"/></>,
    camera:    <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    upload:    <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></>,
    check:     <><path d="M20 6 9 17l-5-5"/></>,
    x:         <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    edit:      <><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></>,
    pdf:       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    alert:     <><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></>,
    menu:      <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>,
    sun:       <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
    moon:      <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    // DDD group icons
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M8 14h8"/></>,
    activity:  <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    package:   <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  };
  return <svg {...s} viewBox="0 0 24 24">{paths[name] || null}</svg>;
};

// ─── Formatters ───────────────────────────────────────────────────────────────
export const fmt = (n, currency = "USD", fx = 3.745) => {
  const v = currency === "PEN" ? n * fx : n;
  const sym = currency === "USD" ? "$" : "S/ ";
  return sym + v.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 });
};
export const fmt2 = (n, currency = "USD", fx = 3.745) => {
  const v = currency === "PEN" ? n * fx : n;
  const sym = currency === "USD" ? "$" : "S/ ";
  return sym + v.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
};

// ─── Sidebar Zones — v5.3 Business Lines Architecture ────────────────────────
// type 'flat'             → zone label + simple items
// type 'business-lines'  → zone label + accordion sub-groups (each line is a group)
// type 'shared-resources'→ zone label + always-visible labeled sub-groups
const SIDEBAR_ZONES = [
  {
    id: 'gerencial', label: 'Gerencial', type: 'flat',
    roles: ['gerente', 'tecnico'],
    items: [
      { id: 'dashboard', label: 'Dashboard General', icon: 'dashboard' },
    ],
  },
  {
    id: 'lineas', label: 'Líneas de Negocio', type: 'business-lines',
    roles: ['gerente'],
    groups: [
      {
        id: 'flota-alquileres', label: 'Flota y Alquileres', emoji: '🚜',
        items: [
          { id: 'dashboard-rental', label: 'Dashboard Rental',   icon: 'dashboard' },
          { id: 'flota',            label: 'Panel de Flota',     icon: 'equipment' },
          { id: 'contratos-rental', label: 'Contratos y Tarifas',icon: 'report'    },
          { id: 'checkout',         label: 'Actas / Despachos',  icon: 'check'     },
          { id: 'liquidacion',      label: 'Liquidación y DMR',  icon: 'chart'     },
        ],
      },
      {
        id: 'transporte', label: 'Transporte Comercial', emoji: '🚚',
        items: [
          { id: 'dashboard-transporte',   label: 'Dashboard Transporte', icon: 'dashboard' },
          { id: 'transporte-viajes',     label: 'Monitor Viajes',       icon: 'mine'      },
          { id: 'transporte-ruta',       label: 'Hoja de Ruta',         icon: 'arrow'     },
          { id: 'transporte-tarifas',    label: 'Maestro Rutas',        icon: 'rates'     },
          { id: 'transporte-liquidacion',label: 'Liquidación',          icon: 'chart'     },
        ],
      },
      {
        id: 'maestranza', label: 'Maestranza y Fab.', emoji: '🏭',
        items: [
          { id: 'dashboard-maestranza', label: 'Dashboard Maestranza', icon: 'dashboard' },
          { id: 'maestranza-of',        label: 'Órdenes de Fab. (OF)', icon: 'parts'     },
          { id: 'maestranza-bom',       label: 'Estructuras BOM',      icon: 'package'   },
          { id: 'maestranza-piso',      label: 'Control de Piso',      icon: 'activity'  },
        ],
      },
      {
        id: 'venta-repuestos', label: 'Venta de Repuestos', emoji: '🛒',
        items: [
          { id: 'dashboard-repuestos', label: 'Dashboard Repuestos', icon: 'dashboard' },
          { id: 'pedidos-venta',       label: 'Pedidos de Venta',    icon: 'orders'    },
          { id: 'catalogo-precios',    label: 'Catálogo y Precios',  icon: 'box'       },
          { id: 'despachos-repuestos', label: 'Despachos',           icon: 'download'  },
        ],
      },
    ],
  },
  {
    id: 'recursos', label: 'Recursos Compartidos', type: 'shared-resources',
    roles: ['gerente', 'tecnico'],
    groups: [
      {
        id: 'taller-ots', label: 'Taller y OTs',
        roles: ['gerente', 'tecnico'],
        items: [
          { id: 'ots',          label: 'Bandeja de OTs',  icon: 'orders',   roles: ['gerente'] },
          { id: 'crear-ot',     label: 'Nueva OT (DBS)',  icon: 'plus',     roles: ['gerente'] },
          { id: 'partes-taller',label: 'Partes Taller',   icon: 'workshop', roles: ['gerente', 'tecnico'] },
          { id: 'partes-mina',  label: 'Reportes Mina',   icon: 'mine',     roles: ['gerente', 'tecnico'] },
        ],
      },
      {
        id: 'confiabilidad', label: 'Confiabilidad',
        roles: ['gerente', 'tecnico'],
        items: [
          { id: 'backlog',                   label: 'Backlog Operativo',    icon: 'orders',   roles: ['gerente', 'tecnico'] },
          { id: 'sos-telemetria',            label: 'Análisis SOS',         icon: 'activity', roles: ['gerente'] },
          { id: 'indicadores-confiabilidad', label: 'Indicadores MTBF/MTTR',icon: 'chart',    roles: ['gerente'] },
        ],
      },
      {
        id: 'almacen', label: 'Almacén y Repuestos',
        roles: ['gerente'],
        items: [
          { id: 'catalogo',              label: 'Inventario',          icon: 'box'      },
          { id: 'solicitudes',           label: 'Solicitudes (SOLPE)', icon: 'parts'    },
          { id: 'compras-importaciones', label: 'Compras e Import.',   icon: 'download' },
        ],
      },
    ],
  },
  {
    id: 'comercial', label: 'Comercial y Finanzas', type: 'flat',
    roles: ['gerente'],
    items: [
      { id: 'clientes',    label: 'Clientes',              icon: 'clients', altIds: ['equipos', 'proyectos'] },
      { id: 'proveedores', label: 'Proveedores',           icon: 'clients' },
      { id: 'consolidado', label: 'Facturación',           icon: 'report'  },
      { id: 'costos',      label: 'Costos y Rentabilidad', icon: 'chart'   },
    ],
  },
  {
    id: 'configuracion', label: 'Configuración', type: 'flat',
    roles: ['gerente'],
    items: [
      { id: 'usuarios', label: 'Usuarios y Roles',    icon: 'users' },
      { id: 'config',   label: 'Parámetros Globales', icon: 'cog'   },
    ],
  },
];

const findLineForPage = (pageId) => {
  const linesZone = SIDEBAR_ZONES.find(z => z.id === 'lineas');
  if (!linesZone) return null;
  for (const g of linesZone.groups) {
    if (g.items.some(it => it.id === pageId)) return g.id;
  }
  return null;
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export const Sidebar = ({ current, onNav, role, onLogout }) => {
  const [openLines, setOpenLines] = useState(() => {
    const s = new Set(['flota-alquileres']);
    const line = findLineForPage(current);
    if (line) s.add(line);
    return s;
  });

  useEffect(() => {
    const line = findLineForPage(current);
    if (line) setOpenLines(prev => { const s = new Set(prev); s.add(line); return s; });
  }, [current]);

  const toggleLine = (id) => setOpenLines(prev => {
    const s = new Set(prev);
    if (s.has(id)) s.delete(id); else s.add(id);
    return s;
  });

  const roleStr  = role === 'tecnico' ? 'tecnico' : 'gerente';
  const canSee   = (roles) => !roles || roles.includes(roleStr);
  const isActive = (it) => it.id === current || (it.altIds?.includes(current) ?? false);

  const user = role === 'tecnico'
    ? { name: 'Miranda Barra, S.', role: 'Técnico de Mina',       initials: 'MB' }
    : { name: 'A. Parado',          role: 'Gerente de Operaciones', initials: 'AC' };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="mark">Z</div>
        <div className="wordmark">DIFESMAQ<small>ERP Operativo Minero</small></div>
      </div>

      <div className="sidebar-scroll">
        {SIDEBAR_ZONES.filter(z => canSee(z.roles)).map(zone => {

          // ── Flat zone ────────────────────────────────────────────────────
          if (zone.type === 'flat') {
            const vis = zone.items.filter(it => canSee(it.roles));
            if (!vis.length) return null;
            return (
              <div key={zone.id}>
                <div className="nav-section-label"><span className="dot"/>{zone.label}</div>
                {vis.map(it => (
                  <button key={it.id} className={"nav-item" + (isActive(it) ? " active" : "")} onClick={() => onNav(it.id)}>
                    <Icon name={it.icon} size={14}/><span className="label">{it.label}</span>
                  </button>
                ))}
              </div>
            );
          }

          // ── Business-lines zone (accordion sub-groups) ───────────────────
          if (zone.type === 'business-lines') {
            return (
              <div key={zone.id}>
                <div className="nav-section-label"><span className="dot"/>{zone.label}</div>
                {zone.groups.map(g => {
                  const isOpen    = openLines.has(g.id);
                  const hasActive = g.items.some(it => isActive(it));
                  return (
                    <div key={g.id} className={"nav-group" + (isOpen ? " open" : "")}>
                      <button
                        className={"nav-group-head" + (hasActive ? " has-active" : "")}
                        onClick={() => toggleLine(g.id)}
                      >
                        <span className="g-icon" style={{ fontSize: 13 }}>{g.emoji}</span>
                        <span className="g-label">{g.label}</span>
                        <span className="g-chev"><Icon name="chev" size={11}/></span>
                      </button>
                      <div className="nav-group-body">
                        {g.items.map(it => (
                          <button key={it.id} className={"nav-item" + (isActive(it) ? " active" : "")} onClick={() => onNav(it.id)}>
                            <Icon name={it.icon} size={14}/><span className="label">{it.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // ── Shared-resources zone (always-visible labeled sub-groups) ────
          if (zone.type === 'shared-resources') {
            const visGroups = zone.groups.filter(g => canSee(g.roles));
            if (!visGroups.length) return null;
            return (
              <div key={zone.id}>
                <div className="nav-section-label"><span className="dot"/>{zone.label}</div>
                {visGroups.map(g => {
                  const visItems = g.items.filter(it => canSee(it.roles));
                  if (!visItems.length) return null;
                  return (
                    <div key={g.id}>
                      <div style={{ padding: '7px 12px 3px 16px', fontSize: 10, fontWeight: 700, color: 'var(--slate-2)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                        {g.label}
                      </div>
                      {visItems.map(it => (
                        <button key={it.id} className={"nav-item" + (isActive(it) ? " active" : "")} style={{ paddingLeft: 26 }} onClick={() => onNav(it.id)}>
                          <Icon name={it.icon} size={14}/><span className="label">{it.label}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="sidebar-footer">
        <div className="avatar">{user.initials}</div>
        <div className="meta">
          <div className="name">{user.name}</div>
          <div className="role">{user.role}</div>
        </div>
        <button className="logout" onClick={onLogout} title="Cerrar sesión">
          <Icon name="logout" size={15}/>
        </button>
      </div>

    </aside>
  );
};

// ─── TopBar ───────────────────────────────────────────────────────────────────
export const TopBar = ({ title, crumb, role, onRoleSwap }) => (
  <div className="topbar">
    <div>
      <div className="crumb">{crumb}</div>
      <div className="title">{title}</div>
    </div>
    <div className="spacer"/>
    <input className="search" placeholder="Buscar OTs, equipos, técnicos..."/>
    <button className="role-pill" onClick={onRoleSwap} title="Cambiar rol">
      <Icon name="users" size={12}/>
      {role === "gerente" ? "Gerente" : "Técnico"}
    </button>
    <button className="icon-btn" title="Notificaciones">
      <Icon name="bell" size={17}/>
    </button>
  </div>
);

export const FooterBrand = () => (
  <div className="footer-brand">Desarrollado por TIDEO Tech & Strategy · DIFESMAQ Platform v2 · 2026</div>
);
