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

// ─── Module Profiles (Selector de Rol/Módulo) ─────────────────────────────────
//
// TypeScript equivalent:
// type ModuleProfile = { id: string; label: string; emoji: string; description: string }
//
const MODULE_PROFILES = [
  { id: 'todos',         label: 'Vista General',       emoji: '🗂️', description: 'Todos los módulos' },
  { id: 'taller',        label: 'Taller y Servicios',  emoji: '🛠️', description: 'OTs, partes, dispatch' },
  { id: 'confiabilidad', label: 'Confiabilidad',        emoji: '📈', description: 'SOS, backlogs, mina' },
  { id: 'rental',        label: 'Alquileres',           emoji: '🚜', description: 'Flota pesada y liviana' },
  { id: 'maestranza',    label: 'Maestranza',           emoji: '⚙️', description: 'Fabricación, materia prima' },
];

// ─── Nav Groups (Domain-Driven Design) ───────────────────────────────────────
//
// TypeScript equivalent:
// type NavItem  = { id: string; label: string; icon: string; badge?: string; locked?: boolean; future?: boolean }
// type NavGroup = { id: string; label: string; icon: string; accent: string; profiles: string[];
//                   macrozone?: string;  items: NavItem[] }
//
// macrozone: if present, renders a visual section label above this group.
//
const NAV_GROUPS = [
  {
    id: 'core',
    label: 'Core y Comercial',
    icon: 'briefcase',
    accent: '#00BCD4',
    macrozone: 'CORE Y COMERCIAL',
    profiles: ['todos', 'taller', 'confiabilidad', 'rental', 'maestranza'],
    items: [
      { id: 'dashboard',    label: 'Dashboard Directivo',      icon: 'dashboard' },
      { id: 'clientes',     label: 'Clientes y Contratos',     icon: 'clients'   },
      { id: 'docs',         label: 'Documentos comerciales',   icon: 'report'    },
      { id: 'proyectos',    label: 'Proyectos y Tarifas',      icon: 'rates'     },
      { id: 'cotizaciones', label: 'Cotizaciones de servicio', icon: 'pdf',    future: true },
      { id: 'venta-rep',    label: 'Venta de Repuestos',       icon: 'box',    future: true },
    ],
  },
  {
    id: 'taller-sv',
    label: 'Taller y Servicios',
    icon: 'workshop',
    accent: '#60A5FA',
    macrozone: 'OPERACIONES TÉCNICAS',
    profiles: ['todos', 'taller'],
    items: [
      { id: 'ots',          label: 'Gestión de OTs',             icon: 'orders'   },
      { id: 'partes-taller', label: 'Partes Diarios (Taller)',   icon: 'report'   },
      { id: 'partes-mina',  label: 'Partes Diarios (Mina)',      icon: 'mine'     },
      { id: 'dispatch',     label: 'Programación / Dispatch',    icon: 'users',   future: true },
    ],
  },
  {
    id: 'confiab',
    label: 'Confiabilidad y Monitoreo',
    icon: 'activity',
    accent: '#34D399',
    profiles: ['todos', 'taller', 'confiabilidad'],
    items: [
      { id: 'backlog',    label: 'Gestión de Backlogs',     icon: 'orders' },
      { id: 'sos',        label: 'Monitoreo SOS / Fluidos', icon: 'chart', future: true },
      { id: 'telemetria', label: 'Telemetría de equipos',   icon: 'rates', future: true },
    ],
  },
  {
    id: 'maestranza',
    label: 'Maestranza y Fabricación',
    icon: 'cog',
    accent: '#FB923C',
    macrozone: 'PRODUCCIÓN Y FLOTA',
    profiles: ['todos', 'maestranza'],
    items: [
      { id: 'fabricacion', label: 'Órdenes de Fabricación',   icon: 'parts', locked: true },
      { id: 'materia',     label: 'Control de Materia Prima', icon: 'box',   locked: true },
    ],
  },
  {
    id: 'rental',
    label: 'Gestión de Alquileres',
    icon: 'equipment',
    accent: '#A78BFA',
    profiles: ['todos', 'rental'],
    items: [
      { id: 'flota',             label: 'Panel de Flota',       icon: 'equipment' },
      { id: 'contratos-rental',  label: 'Contratos y Tarifas',  icon: 'report'    },
      { id: 'checkout',          label: 'Actas / Despachos',    icon: 'check'     },
      { id: 'liquidacion',       label: 'Liquidación y DMR',    icon: 'chart'     },
    ],
  },
  {
    id: 'backoffice',
    label: 'Backoffice',
    macrozone: 'BACKOFFICE Y SOPORTE',
    icon: 'package',
    accent: '#94A3B8',
    profiles: ['todos', 'taller', 'confiabilidad', 'rental', 'maestranza'],
    items: [
      { id: 'catalogo',    label: 'Catálogo de repuestos',    icon: 'box'                       },
      { id: 'solicitudes', label: 'Solicitudes de repuestos', icon: 'parts'                     },
      { id: 'costos',      label: 'Costos y rentabilidad',    icon: 'chart',  badge: 'NUEVO'    },
      { id: 'consolidado', label: 'Reporte consolidado',      icon: 'report'                    },
      { id: 'equipos',     label: 'Equipos y Activos',        icon: 'equipment'                 },
      { id: 'usuarios',    label: 'Usuarios y Roles',         icon: 'users'                     },
      { id: 'config',      label: 'Configuración',            icon: 'cog'                       },
    ],
  },
];

// ─── Tecnico nav (simplified, unchanged) ─────────────────────────────────────
const NAV_TECNICO = [
  { id: 'dashboard',     label: 'Dashboard',                icon: 'dashboard' },
  { id: 'nuevo-reporte', label: 'Nuevo reporte',            icon: 'plus'      },
  { id: 'mis-reportes',  label: 'Mis reportes',             icon: 'report'    },
  { id: 'solicitudes',   label: 'Solicitudes de repuestos', icon: 'parts'     },
];

const findGroupForPage = (pageId) => {
  for (const g of NAV_GROUPS) {
    if (g.items.some(it => it.id === pageId)) return g.id;
  }
  return 'core';
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export const Sidebar = ({ current, onNav, role, onLogout }) => {
  const [moduleProfile, setModuleProfile] = useState('todos');
  const [profileOpen, setProfileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(
    () => new Set(NAV_GROUPS.map(g => g.id))
  );

  useEffect(() => {
    const gid = findGroupForPage(current);
    setOpenGroups(prev => { const s = new Set(prev); s.add(gid); return s; });
  }, [current]);

  const toggleGroup = (gid) => setOpenGroups(prev => {
    const s = new Set(prev);
    if (s.has(gid)) s.delete(gid); else s.add(gid);
    return s;
  });

  const user = role === 'tecnico'
    ? { name: 'Miranda Barra, S.', role: 'Técnico de Mina',       initials: 'MB' }
    : { name: 'A. Castro',          role: 'Gerente de Operaciones', initials: 'AC' };

  const activeProfile = MODULE_PROFILES.find(p => p.id === moduleProfile) ?? MODULE_PROFILES[0];

  // ── Tecnico: simplified flat nav ──────────────────────────────────────────
  if (role === 'tecnico') {
    return (
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="mark">D</div>
          <div className="wordmark">ZAHORY SAC<small>ERP Operativo Minero</small></div>
        </div>
        <div className="sidebar-scroll">
          {NAV_TECNICO.map(it => (
            <button key={it.id} className={"nav-item " + (current === it.id ? "active" : "")} onClick={() => onNav(it.id)}>
              <Icon name={it.icon} size={15}/>
              <span className="label">{it.label}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="avatar">{user.initials}</div>
          <div className="meta"><div className="name">{user.name}</div><div className="role">{user.role}</div></div>
          <button className="logout" onClick={onLogout} title="Cerrar sesión"><Icon name="logout" size={15}/></button>
        </div>
      </aside>
    );
  }

  // ── Gerente: DDD grouped nav ───────────────────────────────────────────────
  const visibleGroups = NAV_GROUPS.filter(g => g.profiles.includes(moduleProfile));

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="mark">D</div>
        <div className="wordmark">ZAHORY SAC<small>ERP Operativo Minero</small></div>
      </div>

      {/* Module / Role Selector */}
      <div className="module-selector">
        <button
          className={"module-sel-head" + (profileOpen ? " open" : "")}
          onClick={() => setProfileOpen(p => !p)}
        >
          <span className="ms-emoji">{activeProfile.emoji}</span>
          <span className="ms-label">{activeProfile.label}</span>
          <span className="ms-chev"><Icon name="chevDown" size={11}/></span>
        </button>

        {profileOpen && (
          <div className="module-sel-body">
            {MODULE_PROFILES.map(p => (
              <button
                key={p.id}
                className={"module-profile-btn" + (p.id === moduleProfile ? " active" : "")}
                onClick={() => { setModuleProfile(p.id); setProfileOpen(false); }}
              >
                <span className="mp-emoji">{p.emoji}</span>
                <div className="mp-text">
                  <div className="mp-label">{p.label}</div>
                  <div className="mp-desc">{p.description}</div>
                </div>
                {p.id === moduleProfile && <Icon name="check" size={11}/>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DDD Nav Groups */}
      <div className="sidebar-scroll">
        {visibleGroups.map(group => {
          const isOpen = openGroups.has(group.id);
          const hasActive = group.items.some(it => it.id === current);

          return (
            <div key={group.id}>
              {group.macrozone && (
                <div className="nav-macrozone">{group.macrozone}</div>
              )}
              <div className={"nav-group" + (isOpen ? " open" : "")}>

                <button
                  className={"nav-group-head" + (hasActive ? " has-active" : "")}
                  onClick={() => toggleGroup(group.id)}
                  title={group.label}
                >
                  <span className="g-icon" style={{ color: group.accent }}>
                    <Icon name={group.icon} size={14}/>
                  </span>
                  <span className="g-label">{group.label}</span>
                  <span className="g-chev"><Icon name="chev" size={11}/></span>
                </button>

                <div className="nav-group-body">
                  {group.items.map(it => {
                    if (it.locked) {
                      return (
                        <div key={it.id} className="nav-item locked">
                          <Icon name={it.icon} size={14}/>
                          <span className="label">{it.label}</span>
                          <Icon name="lock" size={11}/>
                        </div>
                      );
                    }
                    return (
                      <button
                        key={it.id}
                        className={"nav-item" + (current === it.id ? " active" : "") + (it.future ? " future" : "")}
                        onClick={() => onNav(it.id)}
                      >
                        <Icon name={it.icon} size={14}/>
                        <span className="label">{it.label}</span>
                        {it.badge  && <span className="badge-new">{it.badge}</span>}
                        {it.future && <span className="badge-soon">Beta</span>}
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
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
  <div className="footer-brand">Desarrollado por TIDEO Tech & Strategy · ZAHORY SAC Platform v2 · 2026</div>
);
