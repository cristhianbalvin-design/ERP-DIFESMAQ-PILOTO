# Documento Maestro - ERP Operativo Minero

**Proyecto:** ERP - DIFESMAQ / ZAHORY SAC  
**Fecha de auditoria:** 15 de mayo de 2026  
**Estado real:** prototipo frontend en React + Vite, con datos mock en memoria  
**Objetivo de este documento:** que cualquier agente pueda entender rapidamente que existe hoy en la plataforma, que esta simulado, que esta pendiente y donde debe tocar el codigo.

---

## 1. Resumen Ejecutivo

La plataforma actual es un prototipo operativo de ERP minero enfocado en mantenimiento, ordenes de trabajo, backlog, partes diarios, activos, contratos, inventario basico y alquileres de equipos.

El sistema ya tiene una experiencia navegable con roles, sidebar por modulos, dashboard gerencial, formularios y tablas funcionales. Sin embargo, todavia no tiene backend conectado, autenticacion real, persistencia de datos, integracion con Supabase ni generacion real de PDFs. La mayor parte de la informacion vive en `src/data.js` como mock data.

La arquitectura actual permite validar flujos y pantallas. No debe tratarse como ERP productivo todavia.

---

## 2. Stack Actual

| Capa | Estado actual |
|---|---|
| Frontend | React 18 + Vite |
| Estilos | CSS global en `src/index.css` |
| Navegacion | Estado local en `App.jsx`, sin React Router |
| Datos | Mock data centralizada en `src/data.js` |
| Estado persistido | `localStorage` para rol y pagina actual |
| Backend | No implementado |
| Base de datos | No conectada; existe un script SQL de referencia |
| Autenticacion | Simulada en pantalla de login |
| PDFs / archivos | Simulados en UI, sin generacion ni almacenamiento real |

Comandos disponibles:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 3. Estructura del Repositorio

```text
src/
  main.jsx
  App.jsx
  index.css
  data.js
  components/
    shell.jsx
    charts.jsx
  pages/
    pages1.jsx
    pages2.jsx
    pages3.jsx
    BacklogPage.jsx
    CrearOTPage.jsx
    ClientesContratosPage.jsx
    EquiposPage.jsx
    ProyectosTarifasPage.jsx
    ConfiguracionPage.jsx
    AlquileresPages.jsx
  schemas/
    otSchema.js
Docs/
  Documentomaestro.md
  dbs-maintenance-upgrade.sql
public/images/
  imagenes PNG de equipos para rental/flota
```

Archivos principales:

| Archivo | Funcion |
|---|---|
| `src/main.jsx` | Monta React en `#root` e importa estilos globales. |
| `src/App.jsx` | Controla rol, pagina actual, labels, placeholders y renderizado de modulos. |
| `src/components/shell.jsx` | Iconos SVG, sidebar, topbar, footer y formatters monetarios. |
| `src/data.js` | Fuente principal de datos simulados. |
| `src/schemas/otSchema.js` | Reglas y calculos del formulario DBS de OT. |
| `src/index.css` | Sistema visual global: layout, cards, tablas, botones, forms, badges, tabs. |
| `Docs/dbs-maintenance-upgrade.sql` | Script de referencia para migrar OT al modelo DBS. No esta conectado a la app. |

---

## 4. Arquitectura de Navegacion

La app no usa rutas URL. La navegacion se resuelve con el estado `current` en `App.jsx`.

Estados persistidos:

| Key localStorage | Uso |
|---|---|
| `zahory_sac_role` | Rol actual: `login`, `gerente` o `tecnico`. |
| `zahory_sac_page` | Pagina actual seleccionada. |

Roles actuales:

| Rol | Estado |
|---|---|
| `login` | Muestra pantalla de acceso simulado. |
| `gerente` | Acceso principal a la mayoria de modulos implementados. |
| `tecnico` | Acceso reducido. Tiene dashboard propio y algunas rutas, pero hay desalineacion con el sidebar. |

Importante: el sidebar muestra algunos items para `tecnico` que `App.jsx` todavia no renderiza como paginas reales. En esos casos cae en `PlaceholderPage`.

---

## 5. Modulos Implementados o Navegables

### 5.1 Login

Archivo: `src/pages/pages1.jsx`

Existe una pantalla de login visual con acceso rapido como Gerente o Tecnico. No valida credenciales contra servidor.

### 5.2 Shell general

Archivo: `src/components/shell.jsx`

Incluye:

- Sidebar tipo acordeon por grupos funcionales.
- Topbar con breadcrumb, titulo, buscador visual, pill de rol y notificaciones.
- Cambio rapido de rol Gerente/Tecnico desde la topbar.
- Footer de marca.
- Iconos SVG propios.
- Formatters `fmt` y `fmt2` para USD/PEN usando FX mock.

Grupos visibles para gerente:

| Grupo | Items |
|---|---|
| Inicio | Dashboard |
| Gestion de Alquileres | Panel de Flota, Contratos y Tarifas, Actas / Despachos, Liquidacion y DMR |
| Gestion de OTs | Bandeja Maestra, Aperturar OT (DBS) |
| Ejecucion | Partes Taller, Reportes Mina |
| Confiabilidad | Backlog Operativo, Analisis SOS |
| Transporte Comercial | Monitor Viajes, Hoja de Ruta, Maestro Rutas |
| Maestranza y Fabricacion | Ordenes Fab., Estructuras BOM, Control de Piso |
| Almacen y Soporte | Catalogo e Inventario, Solicitudes Repo. |
| Configuracion y Cierres | Consolidado Facturacion, Clientes y Activos, Usuarios y Roles, Parametros Globales |

Items actualmente placeholder para gerente:

- `sos-telemetria`
- `transporte-viajes`
- `transporte-ruta`
- `transporte-tarifas`
- `maestranza-of`
- `maestranza-bom`
- `maestranza-piso`

### 5.3 Dashboard Gerencial

Archivo: `src/pages/pages1.jsx`

Pantalla principal para gerente. Usa datos mock y graficos SVG/React.

Incluye:

- KPIs ejecutivos: facturacion proyectada, DMR global, capital detenido, utilizacion de flota.
- Alertas criticas con navegacion a modulos relacionados.
- Visualizaciones de ingresos, costos, margen y disponibilidad.
- Accesos a reporte gerencial, configuracion y nueva OT.

No existe calculo backend; los numeros estan hardcodeados o derivan de `src/data.js`.

### 5.4 Costos y Rentabilidad

Archivo: `src/pages/pages1.jsx`

Vista gerencial sobre costos de OTs. Usa componentes de `src/components/charts.jsx`.

Incluye:

- Graficos de costos por categoria.
- Margenes por OT.
- Conversion visual USD/PEN con FX mock.
- Navegacion hacia detalle de OT.

### 5.5 Detalle de OT

Archivo: `src/pages/pages1.jsx`

Vista de consulta de una OT seleccionada mediante `currentOT`.

Incluye informacion tecnica y financiera simulada. No consulta un registro real por API; usa datos mock de `src/data.js`.

### 5.6 Tablero de OTs

Archivo: `src/pages/pages2.jsx`

Pagina `ots`.

Incluye:

- Centro de control operativo de OTs.
- Barra de salud operativa por estado.
- Quick filters: activas, taller, mina, espera repuestos, retrabajos.
- Busqueda por OT/equipo y filtro por tecnico.
- Badges por tipo de trabajo y cargo financiero.
- Menu de acciones por fila.
- Navegacion a detalle de OT y creacion de OT.

Modelo conceptual vigente: la OT ya no se gobierna por "origen de OT"; ahora se modela con matriz DBS:

```text
Tipo de Trabajo x Cargo Financiero
```

### 5.7 Crear OT (DBS)

Archivo: `src/pages/CrearOTPage.jsx`  
Reglas: `src/schemas/otSchema.js`

Este es uno de los modulos mas avanzados del prototipo.

Incluye:

- Codigo nuevo mock: `OT-2026-055`.
- Cabecera DBS.
- Seleccion jerarquica cliente -> contrato -> equipo.
- Lugar de ejecucion: `Campo_Mina` o `Taller`.
- Tipo de trabajo:
  - `Preventivo_PM`
  - `Correctivo`
  - `Acondicionamiento`
  - `Overhaul`
- Cargo financiero:
  - `Cliente_Contrato`
  - `Interno_DIFESMAQ`
  - `Garantia_Fabrica`
  - `Reclamo_Rework`
- Validaciones de combinaciones no permitidas.
- Motivo obligatorio para `Reclamo_Rework`.
- Ingreso facturable forzado a cero para cargos no facturables.
- Segmentos de OT.
- Operaciones por segmento.
- Estimacion por tabs: mano de obra, repuestos y terceros.
- Calculo de totales por segmento y total general.
- Drawer para vincular backlogs como adjuntos tecnicos.
- Barra inferior fija con totales, margen y boton de guardado.
- Pantalla de confirmacion al guardar.

Limitacion importante: guardar una OT solo actualiza estado local del componente. No persiste en `src/data.js`, base de datos ni localStorage.

### 5.8 Backlog Operativo

Archivo: `src/pages/BacklogPage.jsx`

Incluye:

- KPIs de emergencia, urgentes, pendientes de recursos, listos para OT y retorno a taller.
- Filtro por prioridad.
- Toggle de "Retorno a taller".
- Tabla de backlog.
- Acciones visuales para crear OT, retorno, fusionar y descartar.
- Modal/drawer de nuevo backlog.
- Soporte visual para fuente SOS Feedback y carga de archivo.

Limitacion: las acciones son mayormente simuladas; no hay persistencia real.

### 5.9 Reportes Mina y Partes Taller

Archivos:

- `src/pages/pages3.jsx`
- `src/pages/pages2.jsx`

Pantallas:

| Pagina | Funcion |
|---|---|
| `nuevo-reporte` | Formulario movil de reporte diario de mina. |
| `partes-mina` | Gestion/listado de reportes de mina. |
| `taller` / `crear-parte-taller` | Formulario de parte diario de taller. |
| `partes-taller` | Gestion/listado de partes de taller. |

Incluyen UI tipo telefono, acordeones, botones de microfono, fotos y guardado de borrador.

Limitaciones:

- El microfono es visual; no hay integracion real con Web Speech API.
- La carga de fotos es visual/local; no hay storage.
- Los reportes no se persisten.

### 5.10 Almacen, Repuestos y Solicitudes

Archivo: `src/pages/pages2.jsx`

Pantallas:

| Pagina | Estado |
|---|---|
| `catalogo` | Catalogo de repuestos con stock, minimos, categoria y contexto. |
| `solicitudes` | Solicitudes de repuestos desde mina/taller, con estados visuales. |

No existe kardex, movimientos reales, reservas ni compras conectadas.

### 5.11 Clientes y Contratos

Archivo: `src/pages/ClientesContratosPage.jsx`

Incluye:

- Tabs de Contratos/OS y Clientes.
- KPIs de contratos activos y DMP promedio.
- Filtro por estado de contrato.
- Modal de contrato.
- Modal de cliente.
- Campos de DMP, moneda, fechas, condicion de facturacion y observaciones.

Limitacion: los modales no persisten cambios fuera del estado visual.

### 5.12 Equipos y Activos

Archivo: `src/pages/EquiposPage.jsx`

Incluye:

- Lista de equipos.
- Panel de detalle.
- Tabs: ficha tecnica, horometros, historial OTs.
- Propietario del activo: Cliente o ZAHORY SAC.
- Indicacion de OT facturable vs OT de inversion.
- Estado de acondicionamiento.

### 5.13 Proyectos y Tarifas

Archivo: `src/pages/ProyectosTarifasPage.jsx`

Vista simple de proyectos, DMP y tarifas. Es mas maqueta que modulo transaccional.

### 5.14 Usuarios y Roles

Archivo: `src/pages/pages2.jsx`

Incluye gestion visual de cuentas, permisos y personal operativo. No hay backend de usuarios ni permisos reales.

### 5.15 Configuracion

Archivo: `src/pages/ConfiguracionPage.jsx`

Incluye:

- Tipo de cambio configurable en estado local.
- Umbrales de margen.
- Checkboxes de alertas.
- Boton guardar con feedback visual.

Limitacion: los cambios no persisten globalmente ni afectan toda la app.

### 5.16 Consolidado

Archivo: `src/pages/pages2.jsx`

Muestra reporte consolidado mensual para cliente usando `consolidadoJB_DD311`.

### 5.17 Documentos Comerciales

Archivo: `src/pages/pages2.jsx`

Muestra propuestas, actas y remisiones mock. No genera documentos reales.

---

## 6. Modulo de Alquileres

Archivo: `src/pages/AlquileresPages.jsx`

Este modulo esta bastante desarrollado a nivel UI y simulacion.

### 6.1 Panel de Flota

Pagina `flota`.

Incluye:

- Fleet board visual.
- Tarjetas de equipo con imagen PNG desde `public/images`.
- Estados de flota.
- Filtros por tab.
- Modal para registrar equipo o cambios de estado.
- Toast de confirmacion simulado.

### 6.2 Contratos y Tarifas Rental

Pagina `contratos-rental`.

Incluye:

- Listado de contratos de alquiler.
- Estado de contrato calculado por vencimiento.
- Tarifa, minimo, meta DMR.
- Modal de nuevo contrato.
- Preview tipo PDF de contrato.

Limitacion: el PDF es preview en pantalla, no archivo generado.

### 6.3 Actas / Despachos

Pagina `checkout`.

Incluye:

- Formulario de acta de despacho/recepcion.
- Tipo salida/retorno.
- Contrato, equipo, operador, combustible, condiciones y evidencia.
- Boton de generar acta PDF simulado.

### 6.4 Liquidacion y DMR

Pagina `liquidacion`.

Incluye:

- KPIs de liquidacion.
- Tabla de equipos/contratos.
- Calculo mock de horas facturables, DMR, penalidad y total.
- Detalle por equipo con grafico de disponibilidad diaria.
- Modal de cierre de liquidacion.

Regla mock actual:

```text
penalidad = ((metaDMR - dmr) / 100) * horasContrato * tarifa * 0.5
```

Solo aplica cuando `dmr < metaDMR`.

---

## 7. Datos Mock Disponibles

Archivo: `src/data.js`

Colecciones principales:

| Key | Contenido |
|---|---|
| `fx` | Tipo de cambio mock. |
| `projects` | Lista de proyectos. |
| `clientes` | Clientes mineros. |
| `contratos` | Contratos y OS. |
| `activosEstado` | Estado operativo de activos. |
| `equipos` | Equipos simplificados para formularios. |
| `tecnicos` | Tecnicos simplificados. |
| `standardJobs` | Trabajos estandar. |
| `otSegmentos` | Segmentos mock de OT. |
| `otOperaciones` | Operaciones mock de OT. |
| `confiabilidad` | Datos de confiabilidad. |
| `dmrByEquipo` | DMR por equipo. |
| `otsDashboard` | OTs resumidas para dashboard. |
| `otsCostos` | OTs con costos, ingresos y fechas DBS. |
| `historialMina` | Reportes diarios de mina. |
| `repuestos` | Catalogo e inventario basico. |
| `personalOperativo` | Tecnicos con costos y vigencias. |
| `propuestas` | Documentos comerciales mock. |
| `remisiones` | Remisiones mock. |
| `consolidadoJB_DD311` | Consolidado mensual para reporte. |
| `monthDaily` | Serie diaria acumulada para graficos. |
| `backlog` | Backlog operativo y SOS Feedback. |

Todo esto es estatico y se carga en memoria al iniciar la app.

---

## 8. Modelo DBS de OT

Archivo: `src/schemas/otSchema.js`

El modelo vigente de OT se basa en:

```text
Tipo de Trabajo:
- Preventivo_PM
- Correctivo
- Acondicionamiento
- Overhaul

Cargo Financiero:
- Cliente_Contrato
- Interno_DIFESMAQ
- Garantia_Fabrica
- Reclamo_Rework
```

Combinaciones bloqueadas:

| Tipo trabajo | Cargo financiero | Motivo |
|---|---|---|
| `Preventivo_PM` | `Garantia_Fabrica` | Un PM es desgaste natural; garantia no cubre desgaste. |
| `Preventivo_PM` | `Reclamo_Rework` | Un retrabajo debe ser correctivo. |
| `Overhaul` | `Reclamo_Rework` | Overhaul es reconstruccion planificada, no retrabajo. |

Cargos no facturables:

```text
Interno_DIFESMAQ
Garantia_Fabrica
Reclamo_Rework
```

Estos deben mostrar ingreso facturable igual a cero.

Validaciones actuales del formulario:

- Cliente obligatorio.
- Contrato/proyecto obligatorio.
- Equipo obligatorio.
- Lugar de ejecucion obligatorio.
- Unidad minera obligatoria si el lugar es `Campo_Mina`.
- Tipo de trabajo obligatorio.
- Cargo financiero obligatorio.
- Fecha programada de inicio obligatoria.
- Tecnico obligatorio.
- Descripcion obligatoria.
- Motivo obligatorio para retrabajo.
- Al menos un segmento con descripcion y una operacion.

Calculadoras existentes:

- `calcSegmentoMO`
- `calcSegmentoRepuestos`
- `calcSegmentoTerceros`
- `calcOTTotals`

---

## 9. SQL de Referencia

Archivo: `Docs/dbs-maintenance-upgrade.sql`

El script propone:

- Eliminar `origen_ot` y `es_facturable` de `ot`.
- Agregar `tipo_trabajo`, `tipo_cargo`, fechas DBS y `motivo_retrabajo`.
- Forzar ingreso y margen para cargos no facturables.
- Crear constraints de combinaciones validas.
- Crear:
  - `standard_jobs`
  - `ot_segmentos`
  - `ot_operaciones`
- Agregar `segmento_id` a tareas, personal y materiales.
- Agregar campos SOS a backlog.

Importante: este SQL asume que ya existen tablas como `ot`, `backlog`, `ot_tareas`, `ot_personal`, `ot_materiales_consumo` y `catalogos_tecnicos`. No hay conexion real desde React hacia esta base.

---

## 10. Estado Real vs. Simulacion

| Area | Estado real |
|---|---|
| Login | Simulado. |
| Roles | Estado local, no permisos reales. |
| Navegacion | Funcional via estado React. |
| Dashboard | UI funcional con datos mock. |
| CRUD | Mayormente simulado; no persiste. |
| OT DBS | Formulario avanzado, validacion y calculos locales. |
| Backlog | Listado, filtros y modal visual. |
| Alquileres | UI avanzada, calculos mock y modales. |
| PDFs | Preview o botones visuales, sin archivo generado. |
| Fotos / archivos | Inputs visuales, sin storage. |
| Microfono | Boton visual, sin dictado real. |
| Buscadores | Algunos filtran, otros son solo UI. |
| Backend | Pendiente. |
| Supabase | Pendiente. |
| Tests | No hay suite de tests identificada. |

---

## 11. Deuda Tecnica y Riesgos Actuales

1. Hay textos con problemas de encoding/mojibake en varios archivos fuente. Ejemplos visibles: caracteres como `Ã³`, `â€”`, `Â·`. Antes de seguir ampliando UI conviene normalizar a UTF-8.

2. La marca no esta completamente consistente. El repo y SQL mencionan DIFESMAQ, la UI muestra ZAHORY SAC y el cargo financiero usa `Interno_DIFESMAQ`.

3. `showFutureModules` existe en `App.jsx`, pero no esta integrado claramente al sidebar.

4. Algunas rutas aparecen en sidebar pero no tienen render real para el rol tecnico.

5. Hay CSS para componentes que no parecen estar activos, por ejemplo module selector y macrozonas.

6. Muchos botones dicen exportar, PDF, editar, guardar o aprobar, pero solo cierran modales o cambian estado local.

7. No hay separacion entre datos mock, reglas de negocio y capa de persistencia. Cuando se conecte backend, `src/data.js` debe convertirse en seeds, fixtures o fallback.

8. No hay test automatizado para las reglas DBS de OT, que son candidatas claras a tests unitarios.

---

## 12. Prioridades Recomendadas

### Prioridad 1 - Estabilizar base tecnica

- Normalizar encoding UTF-8 de archivos fuente.
- Definir nombre oficial de producto/empresa: DIFESMAQ, ZAHORY SAC o ambos con roles claros.
- Separar mocks por dominio o preparar una capa `services`.
- Agregar tests unitarios para `src/schemas/otSchema.js`.

### Prioridad 2 - Persistencia real

- Crear backend/Supabase.
- Implementar tablas base: clientes, contratos, equipos, OT, segmentos, operaciones, backlog, repuestos, personal.
- Conectar Crear OT a insercion real.
- Conectar listado de OTs a datos reales.

### Prioridad 3 - Flujos criticos

- Persistir backlog y permitir convertir/vincular backlog a OT.
- Persistir partes diarios de mina y taller.
- Hacer que consumos de repuestos afecten inventario.
- Implementar aprobaciones reales.

### Prioridad 4 - Documentos y evidencias

- Generar PDF real de OT, acta, contrato y liquidacion.
- Subir fotos/evidencias a storage.
- Implementar firma o conformidad digital.

---

## 13. Reglas Para Agentes Futuros

- No revivir secciones antiguas del documento si no estan respaldadas por codigo actual.
- Antes de documentar un modulo, verificar su archivo correspondiente en `src/pages`.
- Distinguir siempre entre "implementado", "simulado" y "pendiente".
- Mantener el modelo DBS de OT como modelo vigente, salvo que el usuario pida cambiarlo.
- Si se toca `CrearOTPage.jsx`, revisar tambien `src/schemas/otSchema.js`.
- Si se agrega una pagina nueva, actualizar:
  - `src/App.jsx`
  - `PAGE_LABELS`
  - `NAV_GROUPS` en `src/components/shell.jsx`
  - Este documento maestro
- Si se conecta backend, no eliminar `src/data.js` de golpe; migrarlo gradualmente a seeds/fixtures.
- Respetar el diseño actual: UI densa, operativa, de ERP, sin landing page ni pantallas comerciales.

---

## 14. Glosario Vigente

| Termino | Definicion |
|---|---|
| OT | Orden de Trabajo. Entidad operativa central. |
| DBS | Modelo de apertura/clasificacion de OT por Tipo de Trabajo x Cargo Financiero. |
| Tipo de Trabajo | Clasifica la naturaleza tecnica: preventivo, correctivo, acondicionamiento u overhaul. |
| Cargo Financiero | Define quien absorbe el costo o si es facturable. |
| Backlog | Hallazgo o trabajo pendiente que puede vincularse a una OT. |
| Segmento | Bloque tecnico dentro de una OT. |
| Operacion | Actividad especifica dentro de un segmento. |
| DMR | Disponibilidad Mecanica Real. |
| DMP | Disponibilidad Mecanica Programada o meta contractual. |
| Rework | Retrabajo/reclamo; no facturable y exige justificacion. |
| Rental | Modulo de alquileres: flota, contratos, actas y liquidacion. |
| Mock data | Datos estaticos de prueba usados por el frontend. |

---

## 15. Fotografia Final

La plataforma esta en una etapa de prototipo frontend avanzado. Ya comunica bien la vision operativa del ERP y contiene pantallas ricas para validar procesos con usuarios. El mayor avance real esta en:

- Navegacion y shell del ERP.
- Dashboard gerencial.
- Modelo DBS de OT.
- Formulario avanzado de creacion de OT.
- Backlog operativo.
- Modulo Rental/Alquileres.
- Maestros visuales de clientes, contratos, equipos, repuestos y usuarios.

El siguiente salto no es agregar mas pantallas: es conectar persistencia real, limpiar encoding, estabilizar nomenclatura y convertir los flujos simulados en transacciones reales.

