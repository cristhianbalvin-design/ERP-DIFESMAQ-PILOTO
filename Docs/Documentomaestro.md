# ZAHORY SAC — Documento Maestro del Proyecto
## ERP Sectorial de Mantenimiento Minero

**Versión:** 5.0
**Fecha:** Mayo 2026
**Estado:** Alcance definido — desarrollo en curso
**Metodología:** Vibe coding (desarrollo incremental asistido por IA)
**Desarrollado por:** TIDEO Tech & Strategy

---

## Índice

1. [Qué es ZAHORY SAC operativamente](#1-qué-es-zahory-sac-operativamente)
2. [Situación actual — AS-IS](#2-situación-actual--as-is)
3. [Diagnóstico: qué está bien y qué está roto](#3-diagnóstico-qué-está-bien-y-qué-está-roto)
4. [Principio rector del ERP](#4-principio-rector-del-erp)
5. [Visión TO-BE — cómo debe funcionar](#5-visión-to-be--cómo-debe-funcionar)
6. [Escenarios operativos del negocio](#6-escenarios-operativos-del-negocio)
7. [Arquitectura general](#7-arquitectura-general)
8. [Usuarios y roles](#8-usuarios-y-roles)
9. [Módulos del sistema — Fase 1](#9-módulos-del-sistema--fase-1) *(incluye Módulo 14 — Gestión de Alquileres)*
10. [Flujo operativo end-to-end](#10-flujo-operativo-end-to-end)
11. [Indicador crítico — DMR](#11-indicador-crítico--dmr)
12. [Cadena de aprobación para facturar](#12-cadena-de-aprobación-para-facturar)
13. [Documentos que genera el sistema](#13-documentos-que-genera-el-sistema)
14. [Reglas de negocio](#14-reglas-de-negocio)
15. [Modelo de datos](#15-modelo-de-datos)
16. [Requisitos técnicos](#16-requisitos-técnicos)
17. [Criterios de aceptación — Fase 1](#17-criterios-de-aceptación--fase-1)
18. [Descripción de fases](#18-descripción-de-fases)
19. [Glosario](#19-glosario)

---

## 1. Qué es ZAHORY SAC operativamente

ZAHORY SAC no es solo una empresa de alquiler de equipos. En la práctica opera como una empresa de **mantenimiento, acondicionamiento, sostenimiento y disponibilidad operativa de equipos mineros**. El alquiler es la cara comercial visible, pero el negocio real se sostiene sobre cuatro motores:

- Acondicionar equipos antes de ponerlos a operar
- Mantenerlos operativos en mina
- Retornarlos a taller cuando requieren intervención mayor
- Cerrar técnica y administrativamente esa operación para cobrarla

**El negocio no empieza cuando la máquina sale a mina.** Empieza cuando el equipo entra al taller, se le invierte tiempo, repuestos, mano de obra y logística, y recién luego se convierte en activo productivo.

El ciclo del activo no es lineal. Es cíclico y repetitivo:

```
Compra / incorporación
    → Acondicionamiento en taller
        → Operación en mina
            → Detección de falla o pendiente
                → Retorno a taller
                    → Reparación
                        → Retorno a mina (repite)
```

---

## 2. Situación actual — AS-IS

### 2.1 Cómo entra el trabajo a la empresa hoy

Los disparadores que activan trabajo en ZAHORY SAC son:

- Contrato u OS del cliente (marco formal del servicio)
- Continuidad del servicio en mina (la operación ya activa)
- Falla detectada en campo
- Backlog operativo (trabajos pendientes informales)
- Programación de mantenimiento preventivo
- Retorno del equipo desde mina
- Compra o incorporación de un equipo propio

**En mina:** el marco es contractual (contrato u OS). La OT del período agrupa los reportes diarios del equipo. El trabajo no es improvisado — tiene cobertura contractual previa.

**En taller:** la dinámica cambia. El trabajo se vincula a una OT formal abierta por intervención, con parte diario por jornada.

### 2.2 Cómo funciona hoy el taller

Cuando un equipo entra al taller:

1. Recepción del equipo o componente
2. Identificación del trabajo a ejecutar
3. Apertura o continuación de OT
4. Asignación de técnicos
5. Ejecución de actividades mecánicas/eléctricas
6. Solicitud de materiales, insumos, herramientas o repuestos
7. Registro del trabajo en parte diario
8. Validación del supervisor/jefe de taller
9. Cierre técnico parcial o total

Hoy el taller gestiona: acondicionamiento inicial, reparación parcial, reparación mayor, atención de retornos programados, atención de emergencias, trabajos sobre activos propios y trabajos para cliente.

**El taller no es una sola línea de producción.** Es una operación multiservicio con distinta urgencia, distinto alcance y distinta trazabilidad.

### 2.3 Cómo funciona hoy la operación en mina

La empresa tiene técnicos destacados en campo, trabajando por guardia. El documento operativo dominante es el reporte diario, pero el negocio se sostiene sobre una OT abierta por período y sobre el contrato u OS que da cobertura.

Hoy el trabajo diario en mina consiste en:
- Inspeccionar el equipo
- Registrar horómetros
- Reportar paradas
- Ejecutar correcciones menores o tareas preventivas
- Identificar necesidades futuras
- Pedir repuestos o insumos
- Informar el estado final del equipo

**Diferencia clave mina vs. taller:** en taller la OT es puntual y acotada por intervención. En mina, la OT funciona como contenedor mensual o periódico de la operación completa del equipo.

### 2.4 Cómo funciona hoy el backlog (aunque no esté formalizado)

Hoy ZAHORY SAC sí trabaja con backlog, pero no como objeto formal del sistema. Existe backlog cuando:

- Un equipo vuelve de mina por programación
- Se identifican trabajos pendientes
- Al cerrar una intervención quedan temas abiertos
- Una falla no puede resolverse de inmediato
- Se necesita programar una intervención posterior

Ese backlog hoy vive disperso: en la memoria del personal, en listas informales, en reportes, en conversaciones operativas, en la experiencia del supervisor.

### 2.5 Cómo funciona hoy logística

**Compras:** actúa como soporte de la operación. Un rasgo propio del negocio: compras no solo compra lo que se pidió, también busca soluciones equivalentes o intermedias para no detener el equipo.

**Transporte:** existe operativamente Lima–mina–Lima, pero no está estructurado con la rigurosidad que necesita el costeo. El costo de transporte todavía no queda imputado de forma sólida a la OT o proyecto.

### 2.6 Cómo funciona hoy almacén

**Lo que sí hace hoy:** atiende requerimientos, entrega insumos y consumibles, revisa stock, ayuda a disparar compras si falta algo.

**Distribución del stock:**
- Repuestos: salen principalmente del almacén central en Lima
- En mina: suele haber insumos y consumibles

**Clasificación operativa de ítems (funcional, no teórica):**
- **Consumibles:** grasas, combustible, aceites — consumo continuo y predecible
- **Insumos:** herramientas y materiales de apoyo
- **Repuestos:** componentes propios del equipo que deben reemplazarse

Esta clasificación tiene impacto directo en costeo, stock, reposición y autorización.

### 2.7 Cómo funciona hoy administración y finanzas

**Administración** es hoy el "pegamento" entre áreas que no están integradas digitalmente: ordena documentación, compila reportes, da soporte a cierres, revisa información para facturar, y arma manualmente el consolidado mensual.

**Finanzas** entra al final del flujo. Dos datos decisivos para el diseño del ERP:

- **Puede haber varias OTs en una sola factura.** El flujo no es 1 OT = 1 factura. Son varias OTs ejecutadas dentro de un período o servicio → 1 factura consolidada.
- **El disparador es contractual** (contrato u OS). Esto obliga a separar cierre técnico de OT, costeo de OT, y agrupación de OTs para valorización/factura.

---

## 3. Diagnóstico: qué está bien y qué está roto

### Lo que sí existe y funciona

- Lógica operativa real y roles diferenciados
- Disciplina técnica en mina y taller
- OTs y partes/reportes como instrumentos operativos
- Criterio operativo para distinguir repuesto, insumo y consumible
- Lógica de ciclo del activo (mina ↔ taller)
- Marco contractual que da cobertura al trabajo

### Lo que hoy está roto o incompleto

- El backlog no es formal — vive en la memoria y en listas dispersas
- La OT no gobierna todo el proceso
- Mina y taller no están realmente unificados en un sistema
- Stock y compras no están conectados a la OT
- El transporte no está imputado con suficiente fuerza al costo
- La información se consolida de manera manual
- Facturación no se soporta sobre costo real confiable
- RRHH participa pero no como parte integrada del flujo transaccional
- Administración hace demasiado trabajo de reconstrucción manual
- No existe visibilidad de margen por OT, proyecto o equipo en tiempo real
- El acondicionamiento inicial de equipos propios no tiene trazabilidad de costo diferenciada

---

## 4. Principio rector del ERP

> **Toda intervención relevante sobre un activo debe quedar trazada a través de una Orden de Trabajo (OT).**

La cadena de genealogía completa es:

```
Contrato / OS
    → Activo / Equipo
        → Backlog
            → OT
                → Ejecución (reportes diarios / partes de taller)
                    → Consumo (materiales, horas, logística)
                        → Costo real (3 versiones)
                            → Valorización
                                → Factura
```

La OT es el objeto central que conecta:
- el activo intervenido y su historial técnico
- el marco contractual (contrato u OS)
- la necesidad detectada (backlog)
- la planificación y programación
- la ejecución técnica y los reportes diarios
- la mano de obra con su costo real
- los repuestos en tres estados: planificados, reservados y consumidos
- los tiempos de parada y su impacto en el DMR
- las evidencias fotográficas y de voz
- el costo operativo en tres versiones
- y en fases posteriores: la valorización y la facturación

**La relación correcta no es Backlog O OT. Es Backlog → OT.**

**La relación correcta tampoco es 1 OT = 1 factura. Es N OTs → 1 valorización → 1 factura por período/contrato.**

---

## 5. Visión TO-BE — cómo debe funcionar

### 5.1 El flujo completo objetivo

```
1.  Se registra contrato u OS
2.  Se activa proyecto y equipos asociados
3.  Si es equipo nuevo → entra a taller para acondicionamiento inicial (OT de tipo Acondicionamiento)
4.  Si el equipo ya está en operación → se sostiene con OT de período + reportes diarios en mina
5.  Backlog y/o OTs se crean según necesidad detectada
6.  Planner analiza backlog, verifica recursos y programa
7.  Almacén reserva materiales; Compras abastece faltantes
8.  Logística mueve materiales, equipos y personas
9.  Taller ejecuta con parte diario vinculado a OT
10. Mina ejecuta con reporte diario vinculado a OT de período
11. Se registran paradas, horómetros, materiales y horas
12. Desde ejecución se generan nuevos backlogs si aplica
13. Supervisor aprueba reportes y partes
14. Sistema calcula DMR y costos en tiempo real
15. Se cierra técnicamente la OT con todos sus requisitos
16. Administración consolida y valida integridad documental
17. Finanzas agrupa OTs del período según contrato y genera valorización
18. Se factura
19. Gerencia ve rentabilidad por OT, proyecto, equipo y técnico
```

### 5.2 Propuesta de valor por usuario

| Usuario | Qué gana |
|---|---|
| Técnico en mina | Registra el reporte diario en el celular sin papel, con dictado de voz. Crea backlog desde el campo. |
| Técnico en taller | Registra el parte diario y el consumo de materiales vinculado a la OT. |
| Planner | Ve el backlog priorizado por score, programa OTs con materiales verificados, controla carga de trabajo. |
| Jefe de Taller | Gestiona OTs de taller, aprueba partes, ve avance de cada intervención. |
| Supervisor | Aprueba reportes y OTs, ve el DMR en tiempo real, recibe alertas de riesgo contractual. |
| Administración | Deja de reconstruir información a mano — valida, consolida y prepara el pase a valorización. |
| Gerente | Ve la rentabilidad por OT, equipo y proyecto en tiempo real, con tres versiones del costo y la desviación. |
| Finanzas | Recibe una base cerrada para facturar, no la arma desde cero. |
| Cliente (indirecto) | Recibe el reporte consolidado mensual con DMR generado automáticamente en PDF. |

---

## 6. Escenarios operativos del negocio

El ERP debe soportar los tres escenarios reales en los que opera ZAHORY SAC. Cada uno tiene una lógica de OT distinta.

### Escenario A — Acondicionamiento inicial de equipo propio

Ocurre cuando ZAHORY SAC compra o incorpora un equipo para operarlo en mina.

```
Flujo:
Compra / incorporación del equipo
    → Ingreso al taller (Carapongo o Lurín)
        → OT de tipo "Acondicionamiento" (activo propio, sin cliente asociado aún)
            → Ejecución con partes diarios
                → Consumo de MO, repuestos, insumos, consumibles
                    → Cierre técnico
                        → Equipo listo para mina
                            → Se activa OT de período en mina
```

**Implicancia para el ERP:** el costo del negocio empieza antes de que exista facturación al cliente. El ERP debe diferenciar OTs sobre activo propio (costo sin ingreso facturable directo) de OTs sobre activo en servicio (costo con ingreso facturable).

### Escenario B — Equipo en operación en mina

Ocurre cuando el equipo ya está en la unidad minera bajo contrato o OS.

```
Flujo continuo:
OT de período abierta (mensual o por período contractual)
    → Reportes diarios por guardia (vinculados a la OT)
        → Horómetros, paradas, MO, materiales, observaciones
            → Supervisor aprueba
                → DMR se recalcula
                    → Al cierre del período: OT se costea
                        → Reporte consolidado al cliente
                            → Valorización → Factura
```

**Si en mina surge una falla mayor:**
```
Técnico crea backlog desde el reporte diario
    → Planner analiza
        → Si se puede resolver en campo: se registra en la OT de período
        → Si requiere mayor intervención: se coordina retorno a taller (Escenario C)
```

### Escenario C — Equipo retorna de mina a taller

Ocurre cuando el equipo que estaba operando vuelve a Lima por programación o emergencia.

```
Flujo:
Detección de falla o pendiente en mina (backlog)
    → Decisión de retorno
        → Coordinación logística Lima ↔ mina
            → Equipo ingresa al taller
                → OT de intervención abierta (puede ser continuación de backlog de mina)
                    → Ejecución con partes diarios
                        → Reparación parcial o mayor
                            → Cierre técnico
                                → Retorno a mina o permanencia en taller según estado
```

**La genealogía debe quedar intacta:** el backlog generado en mina → la OT de taller → los partes diarios → el costo → la imputación al contrato del cliente.

### Escenario D — Reparación para cliente externo

El equipo no es de ZAHORY SAC sino del cliente. El taller presta el servicio.

```
Flujo:
Solicitud del cliente (por contrato, OS o coordinación comercial)
    → Ingreso del equipo o componente al taller
        → OT para cliente (activo del cliente, no de ZAHORY SAC)
            → Ejecución con partes diarios
                → Cierre técnico
                    → Remisión de servicios
                        → Factura al cliente
```

**Implicancia para el ERP:** el sistema debe distinguir claramente dos lógicas:
- **OT sobre activo propio ZAHORY SAC** — costeo interno, sin ingreso facturable directo por la OT
- **OT sobre activo del cliente** — costeo + ingreso facturable + valorización + factura

---

## 7. Arquitectura general

### Stack tecnológico sugerido para vibe coding

| Capa | Tecnología |
|---|---|
| Frontend | Next.js o React |
| Backend / API | Supabase (BaaS) |
| Base de datos | PostgreSQL (vía Supabase) |
| Autenticación | Supabase Auth |
| Almacenamiento | Supabase Storage (fotos, audios, PDFs) |
| Generación PDF | React-PDF o Puppeteer |
| Dictado de voz | Web Speech API del navegador |
| Hosting | Vercel + Supabase |

### Principios de arquitectura

- **Base de datos propia e independiente** — no conectada a la app actual en Fase 1
- **OT como centro transaccional** — toda entidad relevante se relaciona con la OT
- **Backlog como entidad propia** — objeto con ciclo de vida independiente de la OT
- **Tres versiones de costo** — estimado, reservado y real separados desde el modelo
- **Dos lógicas de OT** — activo propio (costo sin factura directa) vs. activo de cliente (costo + factura)
- **N OTs → 1 factura** — el modelo soporta agrupación de OTs por período/contrato para valorización
- **Arquitectura ERP escalable** — sidebar, rutas y permisos diseñados para 20 módulos
- **Multi-contexto** — mina y taller son contextos distintos en la estructura de datos
- **Multi-moneda** — montos almacenados en USD, conversión a PEN al mostrar
- **Multi-proyecto** — todos los registros vinculados a un proyecto o contrato
- **Auditoría completa** — toda modificación crítica registra usuario, fecha, valor anterior y nuevo

---

## 8. Usuarios y roles

### Roles del sistema

| Rol | Descripción | Contexto principal |
|---|---|---|
| `Configurador` | Administrador técnico. Acceso total. Gestiona roles y permisos por pantalla. | Backoffice |
| `Gerente General` | Visibilidad total de rentabilidad, costos y disponibilidad. Solo lectura. | Backoffice |
| `Administrador` | Gestión operativa, catálogo, tarifas, proyectos, stock básico. | Backoffice |
| `Jefe de Proyectos` | Supervisa proyectos en mina, valida reportes, firma consolidados al cliente. | Backoffice / Mina |
| `Planner` | Gestiona backlog, programa OTs, verifica disponibilidad de materiales. | Backoffice |
| `Jefe de Taller` | Gestiona OTs de taller, aprueba partes diarios, firma OTs de taller. | Taller |
| `Supervisor de Mina` | Aprueba reportes diarios, ve DMR de sus equipos, revisa backlog de campo. | Mina |
| `Técnico de Mina` | Crea reportes diarios y backlog desde campo. | Mina |
| `Técnico de Taller` | Crea partes diarios en contexto taller. | Taller |
| `Finanzas` | Ve valorizaciones, OTs listas para facturar, reportes de rentabilidad. | Backoffice |

> Los técnicos pueden rotar entre mina y taller. El sistema permite asignar un técnico a ambos contextos con el rol correspondiente por proyecto.

### Configurador de permisos por pantalla

El `Configurador` puede crear roles personalizados y asignar permisos toggle ON/OFF pantalla por pantalla. Cada módulo nuevo de fases futuras aparece en la matriz como "Próximamente" hasta activarse — sin tocar código.

**Permisos disponibles por módulo:** Ver / Crear / Editar / Aprobar / Exportar / Ver costos / Ver tarifas

---

## 9. Módulos del sistema — Fase 1

---

### Módulo 1 — Maestros base

Todo lo que el sistema necesita antes de operar. Se configura en el onboarding inicial.

#### Clientes y contratos

```
CLIENTE
Razón social *, RUC, contacto, email, teléfono, estado

CONTRATO / OS
Número de contrato u OS *
Cliente *
Tipo (Contrato / OS)
Descripción del servicio
Moneda de facturación * (USD / PEN)
Fecha inicio * / Fecha fin
Estado (Activo / Cerrado / Suspendido)
Condiciones de facturación (por período / por OT / por hito)
Equipos en scope (multiselect)
DMP pactado % (default: 97.92%)
Observaciones contractuales
```

> El contrato es el marco que da cobertura a la OT y que determina cómo se agrupan las OTs para la factura.

#### Activos / Equipos

```
Código interno *, Código cliente/proyecto
Propietario * (ZAHORY SAC / Cliente — define la lógica de costeo y facturación)
Marca *, Modelo *, N° de Serie, Año
Tipo de flota (Jumbo frontonero / Bolter / Scoop-LHD / Otro)
Familia y subfamilia del activo
Criticidad (Alta / Media / Baja)
Proyecto y cliente asignado
Contrato asociado
Centro de operación / Ubicación actual
Estado operativo (Operativo / En mantenimiento / Inoperativo / En taller / En tránsito)
Estado de mantenimiento
Horómetro actual (Motor / Percusión / Eléctrico / Diesel / KM si aplica)
Responsable técnico
Fotos y notas técnicas
Historial de intervenciones (vinculado a OTs cerradas)
```

#### Personal operativo

```
Código personal, Nombres completos
Cargo, Especialidad (Mecánico / Electricista / Mecatrónico / Otro)
Contexto principal (Mina / Taller / Ambos — puede rotar)
Supervisor directo
Proyectos asignados (multiselect)
Turno y guardia habitual
Costo/hora empresa USD (base)
Costo/hora extra USD
Vigencia documental: SCTR, licencias, EMO, inducción de mina
Habilitado para mina (Sí/No — se bloquea automáticamente si vence documentación)
Estado (Activo / Inactivo)
```

#### Catálogos técnicos

Tablas maestras para: sistemas funcionales, subsistemas, componentes, modos de falla, causas probables, tipos de mantenimiento, tipos de parada, prioridades, severidades.

#### Catálogo de repuestos, insumos y consumibles

```
Código interno *, N° de Parte fabricante
Descripción *, Unidad de medida *
Tipo de ítem * (Repuesto / Consumible / Insumo / Herramienta)
  Repuesto: componente que se reemplaza, requiere OT para consumirse
  Consumible: aceites, grasas, combustible — consumo continuo y predecible
  Insumo: herramientas y materiales de apoyo
  Herramienta: asignación o préstamo, no se consume
Sistema y subsistema asociado
Equivalentes o alternativos (lista de códigos)
Precio unitario USD * (→ PEN calculado con tipo de cambio)
Stock actual, Stock mínimo, Stock máximo
Almacén principal, Ubicación física en almacén
Lead time de reposición (días)
Criticidad del ítem (Alta / Media / Baja)
Contexto (Mina / Taller / Ambos)
Activo / Inactivo
```

> **Fase 1 — inventario mínimo integrado:** el catálogo incluye stock actual y mínimo. El Planner verifica disponibilidad antes de programar. El sistema genera solicitudes de reposición automáticas. Sin movimientos de almacén completos ni compras formales — eso llega en Fase 2.

#### Proyectos

```
Nombre *, Cliente *, Contrato asociado
Tipo de servicio (Mina / Taller / Ambos)
Taller asignado (si aplica: Carapongo / Lurín)
Fecha inicio * / Fecha fin
Estado (Activo / Cerrado)
Moneda de facturación
DMP % (default: 97.92%), Horas por guardia (default: 12)
Técnicos asignados (multiselect)
Supervisores asignados
```

#### Maestro de tarifas

```
Por contrato + proyecto + tipo de trabajo + especialidad del técnico:
  Tarifa USD/hora facturable
  Tarifa stand-by USD/hora (las HSB se facturan)
  Vigencia desde / hasta
```

---

### Módulo 2 — Backlog

El backlog es el registro formal de todo trabajo pendiente detectado sobre un activo, antes de convertirse en OT. Resuelve el problema crítico actual: los pendientes se gestionan de memoria.

#### Quién puede crear un backlog

- Técnico de mina desde el formulario de reporte diario (sin salir del formulario)
- Técnico de taller desde el parte diario (sin salir del formulario)
- Planner, Supervisor o Jefe de Taller desde la pantalla de backlog
- Desde la ficha del equipo directamente
- **Automáticamente** cuando una OT cierra con trabajo pendiente (backlog residual)

#### Campos del backlog

```
N° de Backlog (generado: BKL-2026-XXXX)
Fecha y hora de registro
Activo / Equipo *
Propietario del activo (ZAHORY SAC / Cliente) — heredado del activo
Proyecto y contrato asociado
Fuente del backlog * (Reporte diario / Parte taller / Inspección / Reclamo cliente /
                       Preventivo / SSOMAC / Retorno desde mina / Residual de OT anterior)
Sistema * / Subsistema / Componente / Modo de falla
Descripción del hallazgo * (texto + dictado de voz)
Descripción del trabajo requerido *
Prioridad * (Emergencia / Urgente / Normal / Planificable)
Severidad * (Crítica / Alta / Media / Baja)
¿Requiere parada del equipo? (Sí / No)
¿Requiere retorno a taller? (Sí / No) ← nuevo campo del AS-IS
¿Requiere repuestos? (Sí / No → si sí, listar cuáles con cantidad estimada)
¿Requiere servicio de tercero? (Sí / No)
Horas estimadas de trabajo
Personal estimado
Score de prioridad (calculado automáticamente)
Evidencia (foto / audio)
Usuario que registra
```

#### Score de prioridad

```
Score = Severidad (0–4) + Impacto operacional (0–4) + Impacto en seguridad (0–3) +
        Impacto en disponibilidad (0–3) + Antigüedad en días (0–3)
Máximo: 17 puntos
```

#### Ciclo de vida del backlog

```
Nuevo
  → En análisis (Planner revisa)
    → Pendiente de recursos (falta stock o aprobación)
    → Listo para OT
      → Transferido a OT (con referencia BKL-XXXX → OT-XXXX)
      → Cerrado sin OT (se resolvió por otro medio)
      → Descartado (no aplica)
    → Requiere retorno a taller (nuevo estado del AS-IS)
```

#### Reglas del backlog

- Backlog Emergencia → obliga validación inmediata y probable creación directa de OT
- Si requiere material crítico sin stock → pasa a "Pendiente de recursos" + solicitud automática
- Si hay varios backlogs del mismo equipo y sistema → el sistema sugiere agrupación en una OT
- Si "Requiere retorno a taller" → el Planner coordina con logística antes de crear la OT
- Un backlog puede: generar OT nueva, asociarse a OT existente, fusionarse, descartarse
- **Backlog residual:** al cerrar una OT con trabajo pendiente, el sistema crea automáticamente un nuevo backlog con origen "Residual de OT-XXXX"

#### Comportamiento del botón "Crear OT" en la tabla de backlog

El botón de acción en cada fila del backlog tiene dos comportamientos visuales según el estado:

| Estado del backlog | Botón | Comportamiento |
|---|---|---|
| `Listo para OT` | Primario azul navy — "Crear OT" | Navega al selector de origen con el backlog pre-seleccionado. El formulario del Origen 1 se pre-llena automáticamente |
| Cualquier otro estado | Ghost cyan — "OT" | Navega igualmente al selector de origen con el backlog en contexto, pero sin pre-llenar (el usuario puede elegir otro origen si aplica) |

Adicionalmente, si el backlog tiene `requiereRetorno = true`, aparece un segundo botón en la fila:

| Botón | Comportamiento |
|---|---|
| 🔄 "Retorno" (borde cyan) | Navega directamente al flujo del Origen 4 — Coordinación logística, con el backlog cargado como contexto de la Fase 1 |

---

### Módulo 3 — OT de Mantenimiento (Orden de Trabajo)

La OT es el objeto central del sistema. **No puede crearse de forma arbitraria** — siempre nace desde un origen trazable que determina qué datos vienen pre-llenados, qué lógica de costos se activa y qué validaciones aplican.

---

#### 3.1 Los cuatro orígenes de una OT

El botón "+ Nueva OT" nunca abre directamente el formulario. Siempre presenta primero un selector de origen. Esto no es solo UX — es el sistema reforzando el proceso correcto cada vez que alguien crea una OT.

```
┌─────────────────────────────────────────────────────────┐
│ ¿Cómo nace esta OT?                                    │
│                                                         │
│  📋 Desde backlog        ⚡ Correctivo directo          │
│  (Recomendado)           (Solo emergencias)             │
│                                                         │
│  🔧 Acondicionamiento    🔄 Retorno desde mina          │
│  (Equipo nuevo propio)   (Equipo que vuelve a Lima)     │
└─────────────────────────────────────────────────────────┘
```

**ORIGEN 1 — Desde el Backlog** *(origen principal y preferido)*

El Planner revisa el backlog priorizado por score y convierte un ítem en OT. Es el camino correcto porque garantiza que toda intervención tiene una necesidad documentada antes de ejecutarse.

- **Punto de entrada:** botón "Crear OT" en la fila del backlog (solo visible si estado = "Listo para OT") o desde el panel lateral de detalle del backlog
- **Backlogs seleccionables:** solo backlogs cuyo ciclo de vida sea distinto de "Transferido a OT" y distinto de "Descartado". Los backlogs ya transferidos o descartados no aparecen en el selector
- **Datos pre-llenados:** equipo, proyecto, sistema, descripción del hallazgo, trabajo requerido, prioridad, ¿requiere parada? (fondo #E3F2FD como indicador visual de campo pre-llenado)
- **Genealogía:** la referencia `Contrato → Equipo → BKL-XXXX → OT-XXXX` queda grabada de forma inmutable
- **Fusión:** si hay otros backlogs del mismo equipo y sistema listos para OT, el sistema sugiere agruparlos en una sola intervención con botón directo de fusión
- **Verificación de stock:** al planificar materiales, el sistema muestra stock disponible en tiempo real. Si hay stock → reserva automática. Si no hay → la OT pasa a "Pendiente de recursos" y genera solicitud de reposición automática
- **Estado inicial:** "Programada con recursos" si todo el material está disponible. "Pendiente de recursos" si falta alguno
- **Badge en todas las vistas:** 🟢 `Desde backlog`
- **Quién puede crear:** Planner, Supervisor, Jefe de Taller, Admin, Configurador

**ORIGEN 2 — Correctivo directo** *(solo para emergencias sin backlog previo)*

Cuando una falla crítica no da tiempo al ciclo de backlog → análisis → programación. Se permite pero se registra y se mide.

- **Punto de entrada:** selector de origen desde la pantalla de OTs, desde la ficha del equipo ("⚡ Crear OT correctiva"), o desde la tabla del dashboard en equipos con DMR en riesgo
- **Datos pre-llenados:** equipo (si se viene desde la ficha), tipo de OT = Correctiva, prioridad = Urgente
- **Campo obligatorio adicional:** motivo de no registrar backlog previo (Emergencia sin tiempo / Falla detectada en este momento / Instrucción directa del cliente / Otro). Sin este campo el botón "Crear OT" permanece bloqueado
- **Advertencia permanente:** banner naranja visible en el formulario — "Esta OT no tiene hallazgo formal registrado. Se recomienda crear un backlog si hay tiempo."
- **Alerta de proceso:** si el porcentaje de correctivos directos supera el 30% del total de OTs del período, el indicador de salud emite alerta naranja visible en el selector de origen y en el listado de OTs
- **Estado inicial:** "En ejecución" (es emergencia, no hay tiempo de programar)
- **Badge en todas las vistas:** 🟡 `Correctivo directo`
- **Nota en historial del equipo:** "OT creada sin backlog previo"
- **Quién puede crear:** Planner, Supervisor, Jefe de Taller, Admin, Configurador

**ORIGEN 3 — Acondicionamiento de equipo propio** *(equipo nuevo que entra al taller)*

Cuando ZAHORY SAC incorpora un equipo propio y debe prepararlo antes de enviarlo a mina. No hay cliente ni contrato — es una inversión interna.

- **Punto de entrada:** al registrar un equipo nuevo con propietario = ZAHORY SAC y estado = "Ingresado a taller", el sistema propone automáticamente crear la OT de Acondicionamiento. También disponible desde el selector de origen. Solo muestra equipos con propietario = ZAHORY SAC en el selector de activo
- **Datos pre-llenados:** tipo = Acondicionamiento, propietario = ZAHORY SAC, es facturable = NO, ingreso facturable = $0.00
- **Campos bloqueados:** tipo de OT, propietario, "es facturable", ingreso facturable — no son editables
- **Checklist de acondicionamiento obligatorio** (10 ítems con barra de progreso — la OT no puede cerrar hasta completarlos todos):
  1. Limpieza integral del equipo
  2. Verificación de niveles: aceite motor, hidráulico y refrigerante
  3. Inspección del sistema eléctrico, cableado y conectores
  4. Revisión de mangueras, cilindros y componentes hidráulicos
  5. Verificación del sistema neumático y compresor de aire
  6. Prueba del sistema de frenos y freno de emergencia
  7. Revisión de luces, alarmas, bocinas y señalización de seguridad
  8. Calibración del tablero de control e instrumentos de medición
  9. Prueba de carga y ciclo operativo completo (mínimo 30 minutos)
  10. Verificación de documentación técnica y etiquetado de componentes
- **Al cerrar:** el equipo cambia a "Listo para mina". El costo total queda como "costo histórico de acondicionamiento" en la ficha del activo. El sistema solicita asignar el equipo a un proyecto
- **Estado inicial:** "Lista para ejecución"
- **Badge en todas las vistas:** ⬜ `Acondicionamiento`
- **En el dashboard de costos:** Ingreso = $0.00 en gris con etiqueta "inversión", Margen = N/A. No se incluyen en el cálculo del margen global del período
- **Quién puede crear:** Admin, Jefe de Taller, Configurador

**ORIGEN 4 — Retorno desde mina a taller** *(equipo que vuelve a Lima por falla o programación)*

Cuando un equipo en operación debe trasladarse de mina a Lima para intervención mayor.

- **Punto de entrada (tres vías):**
  - El técnico marca "🔵 Retorno a taller requerido" en el reporte diario → sistema alerta al Planner y muestra backlogs activos del equipo para vincular
  - El Planner ve un backlog con flag "Requiere retorno a taller" → botón "Coordinar retorno y crear OT"
  - Desde la ficha del equipo cuando estado = "Retorno requerido"
- **Este origen tiene dos fases secuenciales (stepper visual):**
  - *Fase 1 — Coordinación logística:* se registra equipo, fecha estimada de llegada, responsable del traslado, transportista y notas. En esta fase el sistema muestra como contexto los backlogs del equipo que tienen `requiereRetorno = true`, para que el Planner los vincule a la coordinación antes de crear la OT. No es una OT aún — es la gestión del movimiento físico
  - *Fase 2 — OT en taller:* al confirmar la llegada del equipo al taller, el sistema propone crear la OT de intervención. El equipo se pre-llena desde la Fase 1 (fondo #E0F7FA como indicador visual). La genealogía completa queda grabada: `Contrato → Equipo → BKL(s) de retorno → Coordinación logística → OT nueva`
- **Vinculación al proyecto de mina:** la OT de taller queda vinculada al proyecto de mina para que su costo se acumule correctamente aunque el trabajo físico sea en Lima
- **Estado inicial de la OT:** "Programada con recursos" o "Pendiente de recursos" según stock
- **Badge en todas las vistas:** 🔵 `Retorno desde mina`
- **Quién puede crear Fase 1:** Planner, Supervisor, Admin, Configurador
- **Quién puede crear Fase 2 (OT):** Planner, Jefe de Taller, Admin, Configurador

---

#### 3.2 Indicador de salud del proceso de creación de OTs

Visible en dos lugares: dentro del selector modal de origen (antes de que el usuario elija) y en el header del listado de OTs del Panel C.

**Componente visual:** barra de progreso segmentada con cuatro tramos de color.

```
OTs del período: 47 total

[████████████████████████░░░░░░░░░░░░░░]
🟢 Backlog: 38 (80.9%)  🟡 Correctivo: 7 (14.9%)  ⬜ Acondiciona.: 1 (2.1%)  🔵 Retorno: 1 (2.1%)

Meta: ≥ 70% de OTs desde backlog
```

**Alertas automáticas:**
- Si `% desde backlog < 70%` → badge naranja junto a la barra: "Por debajo de meta — revisar disciplina de registro de hallazgos"
- Si `% correctivo directo > 30%` → badge rojo: "Correctivos > 30% — revisar proceso de backlog"

**Propósito:** este indicador mide la madurez del proceso operativo, no solo registra actividad. Con el tiempo, el equipo puede ver si está mejorando la disciplina de registro formal de hallazgos antes de intervenir.

---

#### 3.3 Tipos de OT

| Tipo | Descripción | Contexto | Origen típico |
|---|---|---|---|
| Correctiva | Responde a una falla o avería | Mina o Taller | Backlog / Correctivo directo |
| Preventiva | Mantenimiento planificado según horómetros o calendario | Mina o Taller | Backlog |
| Predictiva | Basada en monitoreo de condiciones | Mina o Taller | Backlog |
| Programada | Trabajo planificado no urgente | Mina o Taller | Backlog |
| Acondicionamiento | Preparación de equipo propio antes de entrar a mina | Taller | Acondicionamiento |
| Campaña | Intervención mayor de largo plazo | Taller | Backlog / Retorno desde mina |
| Inspección | Evaluación técnica sin intervención directa | Mina o Taller | Backlog |

---

#### 3.4 Cabecera de OT

Fiel al Formato N°002 de OT de Mantenimiento Drilling de ZAHORY SAC:

```
I. DATOS GENERALES
N° OT (generado: OT-2026-XXXX)       Sede / Ubicación *
Centro de Costo
Tipo de Mantenimiento *               Prioridad *
  □ Preventivo □ Correctivo □ Predictivo   □ Normal □ Urgente □ Emergencia
Equipo / Máquina *                    Sistema *
  (vinculado al activo del maestro)     □ Chas □ Elect □ Hidr □ Mot □ Perf □ Tran □ Otro
Sistema Funcional *                   Acarreo □  Perforación □  Otro: ___
  □ Perforación □ Posicionamiento □ Transporte
Componente                            N/S de Componente
¿Programado? □ Sí □ No               Turno: □ D □ N    Subsistema
Supervisor *                          Causa
Origen de la OT * (inmutable)
  □ Desde Backlog  □ Correctivo directo  □ Acondicionamiento  □ Retorno desde mina
Backlog(s) de origen (referencia inmutable, si aplica)
Propietario del activo * (ZAHORY SAC / Cliente)
Contrato / OS asociado (si activo es del cliente)
Es facturable al cliente (Sí / No — derivado del propietario y el contrato)
Descripción detallada (texto + dictado de voz)
Objetivo de la intervención

II. DATOS DE LA EJECUCIÓN
Fecha inicio * / Fecha fin *
Hora inicio * / Hora fin *
Tiempo de parada (minutos) — calculado automáticamente

MOTIVOS DE PARADA (checkboxes múltiples — fiel al formato físico)
□ Por mantenimiento        □ Por cambio de guardia    □ Por traslado
□ Por falta de movilidad   □ Por falta de repuesto    □ Por trabajo simultáneo
□ Por refrigerio           □ Responsabilidad contratista  □ Responsabilidad CÍA u otros

HORÓMETROS (fiel al formato físico)
H. Diesel ini/fin | H. Comp. ini/fin
H. Pos. 1/2/3 ini/fin | H. Per. 1/2/3 ini/fin
```

---

#### 3.5 Secciones internas de la OT

**Descripción del servicio / tareas** (fiel al formato físico — hasta 7 líneas numeradas, expandible):
```
1.- _______________________________________________
2.- _______________________________________________
3.- _______________________________________________
4.- _______________________________________________
5.- _______________________________________________
6.- _______________________________________________
7.- _______________________________________________
```
Campo de dictado de voz disponible para transcripción automática.

**Personal** (fiel al formato físico):
| Nº Parte | Apellidos y Nombres | Tiempo (HH:MM) | Costo/hr snapshot | Subtotal |

La columna **Nº Parte** muestra el ID del Parte Diario de Taller (PT-XXXX) que originó la tarea. Si la tarea no tiene parte vinculado se muestra `—`. El ID es un enlace navegable que abre el parte correspondiente.

**Repuestos y materiales** (fiel al formato físico):
| Nº Parte | N° de Parte / Cód. | Descripción | Cant. | U.M. | Precio unit. | Subtotal |

La columna **Nº Parte** en materiales indica el Parte Diario donde se registró el consumo del insumo, con enlace navegable al parte. Si el material fue planificado sin asociación a un parte se muestra `—`.

**Materiales en tres versiones:**

| Versión | Cuándo se genera | Qué refleja |
|---|---|---|
| Planificados | Al crear la OT | Costo estimado de materiales |
| Reservados | Cuando el stock confirma disponibilidad | Costo comprometido |
| Consumidos | Al registrar el uso real | Costo real de materiales |

**Observaciones o trabajos pendientes** (fiel al formato físico):
Campo de texto libre. Lo que se registra aquí al cerrar la OT **genera automáticamente un backlog residual** — es el mecanismo formal de continuidad operativa que hoy se hace a mano en papel.

**Tiempos de parada:** entidades formales vinculadas a la OT (Módulo 6).

**Evidencias:** fotos y audios adjuntos.

**Checklist de cierre técnico:** requisitos que deben completarse antes de cerrar.

---

#### 3.6 Card de genealogía (visible en el detalle de toda OT)

Cada OT muestra una card al inicio de su detalle que identifica su origen de forma clara e inmutable. El contenido varía según el origen:

```
Origen 1 — Backlog:
  🟢 Origen: BKL-2026-018
  Hallazgo: "Falla hidráulica recurrente en cilindro de avance"
  Reportado por: Miranda B. — 14/04/2026 — Turno Noche
  Score original: 87/100

Origen 2 — Correctivo directo:
  🟡 Origen: Correctivo directo — Sin backlog previo
  Motivo: "Emergencia — no hubo tiempo"
  Creado por: García R. — 15/04/2026 09:23

Origen 3 — Acondicionamiento:
  ⬜ Origen: Acondicionamiento — Activo propio ZAHORY SAC
  Equipo incorporado: 10/04/2026
  Checklist: 8/10 ítems completados

Origen 4 — Retorno desde mina:
  🔵 Origen: Retorno desde mina — Pepas de Oro
  Backlog vinculado: BKL-2026-015
  Llegada al taller: 17/04/2026 14:30
  Estado al salir de mina: Operativo con restricción
```

---

#### 3.7 Resumen de costos de la OT

```
Costo estimado  = MO estimada + Materiales planificados
Costo reservado = MO estimada + Materiales reservados
Costo real      = MO real     + Materiales consumidos + Transporte (prorrateo)

-- Si OT es facturable al cliente (Orígenes 1, 2, 4):
Ingreso facturable = (HT + HSB) × tarifa del contrato según tipo de trabajo
Margen bruto       = Ingreso - Costo real
Margen %           = Margen / Ingreso × 100
Desviación costo   = Costo real - Costo estimado

-- Si OT es de acondicionamiento / activo propio (Origen 3):
Ingreso facturable = $0.00 (es inversión, no servicio facturado)
Costo total        = MO + Materiales + Transporte (costo de puesta en operación)
Margen             = N/A (no aplica)
```

Todo en USD con conversión automática a PEN según tipo de cambio al cierre.

---

#### 3.8 Máquina de estados de la OT

El estado inicial varía según el origen:

```
Origen 1 (Backlog):        Borrador → Programada con recursos / Pendiente de recursos
Origen 2 (Correctivo):     Borrador → En ejecución (emergencia, sin tiempo de programar)
Origen 3 (Acondiciona.):   Borrador → Lista para ejecución
Origen 4 (Retorno mina):   [Fase 1: En tránsito] → Borrador → Programada con recursos

Flujo completo:
Borrador
  → Pendiente de análisis
    → Pendiente de programación
      → Programada sin recursos
        → Programada con recursos
          → Lista para ejecución
            → En ejecución
              → Pendiente de cierre técnico
                → Cerrada técnica
                  → Pendiente validación documental  ← Administración valida
                    → Pendiente de costo
                      → Costeada                    ← Fase 1 llega hasta aquí
                        → Pendiente valorización     ← Fase 2
                          → Valorizada
                            → Facturada             ← Fase 3
                              → Cerrada total
→ Anulada (desde cualquier estado, con trazabilidad obligatoria)
```

> Fase 1 activa todos los estados hasta "Costeada". Los estados posteriores existen en el modelo pero quedan inactivos.

---

#### 3.9 El PDF de la OT — fiel al formato físico existente

El PDF que genera el sistema al cerrar una OT debe ser **el espejo exacto del Formato N°002 — OT de Mantenimiento Drilling de ZAHORY SAC**. El cliente ya reconoce este documento. Un layout diferente genera fricción en la aprobación.

Estructura del PDF:
```
Header: Logo ZAHORY SAC | "FORMATO DE OT DE MANTENIMIENTO" | Código / Versión / Fecha / Página

I. DATOS GENERALES (dos columnas, fiel al formato)
   N° OT | Sede | Centro Costo | Tipo Mtto. | Prioridad | Equipo | Sistema
   Sistema funcional | Acarreo / Perforación | Componente | N/S | Programado | Turno
   Supervisor | Causa | Subsistema

II. DATOS DE LA EJECUCIÓN
   Fecha/hora inicio y fin | Tiempo de parada | Horómetros completos
   Motivos de parada (checkboxes marcados)

   Descripción del servicio / tareas (numerada 1 al 7+)
   Personal (tabla con apellidos y tiempos)
   Repuestos y materiales (tabla con NP, descripción, cant, UM)
   Observaciones o trabajos pendientes

Firmas: TÉCNICO EJECUTOR | SUPERVISOR | REPRESENTANTE DEL CONTRATISTA
   (nombre del usuario que aprobó + fecha y hora del sistema)
```

El PDF es inmutable una vez que la OT está en estado "Cerrada técnica". Se almacena en el sistema y se puede descargar en cualquier momento posterior.

---

#### 3.10 Restricciones por rol para crear OTs

| Origen | Planner | Supervisor | J.Taller | Admin | Config. | Técnico |
|---|---|---|---|---|---|---|
| Desde backlog | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Correctivo directo | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Acondicionamiento | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ |
| Retorno — Fase 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Retorno — Fase 2 OT | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |

> Los técnicos (mina y taller) nunca crean OTs. Crean backlogs y reportes que alimentan las OTs.

---

### Módulo 4 — Reporte Diario de Mina

Reemplaza el formulario en papel. Se llena por guardia (12 horas) para cada equipo en mina.

```
CABECERA
Equipo *, Proyecto *, Contrato asociado (autocompletado)
Fecha *, Turno * (DÍA / NOCHE)
Técnico (pre-llenado), Supervisor del cliente
OT del período vinculada (automática o selección manual)

HORÓMETROS
H. Motor ini/fin | H. Percusión ini/fin | H. Eléctrico ini/fin
(Validación: final ≥ inicial en todos los casos)

HORAS DEL TURNO
Horas trabajadas equipo (HT) | H. Mantto. prev. programado (PRG)
H. Mantto. preventivo (PRV) | H. Reparación accidente/otro (ACC)
H. Reparación correctiva (CTV) | H. Stand-by (HSB)
Total guardia (TOTAL = suma automática)
D.M. del turno % (calculado — alerta si < DMP del contrato)

TIPO DE MANTENIMIENTO
□ Preventivo programado □ Preventivo □ Correctivo □ Accidente

ESTADO FINAL DEL EQUIPO
🟢 Operativo | 🟡 En espera de repuesto | 🔴 Inoperativo | 🔵 Retorno a taller requerido

DESCRIPCIÓN DE TRABAJOS Y ACTIVIDADES
Lista repetible: descripción + tipo de falla (MEC/ELECT/HIDR) + estado final
Campo de texto libre + dictado de voz → transcripción automática
Adjuntar fotos (hasta 5)

REPUESTOS Y MATERIALES UTILIZADOS
Código/NP | Descripción | Sistema | Cantidad
(Descuenta del stock vinculado a la OT)

LUBRICANTES UTILIZADOS (tipos predefinidos)
15W-40 / HD-10W / HD-30 / HD-50 / Refrigerante / Grasa / Auto 527

PEDIDO DE REPUESTOS E INSUMOS
Código/NP | Descripción | Sistema | Cantidad | ⚪ Normal / 🔴 Urgente

REPORTAR HALLAZGO (backlog desde campo)
Botón → modal de backlog simplificado vinculado al equipo y al reporte

COMENTARIOS Y OBSERVACIONES
Texto libre + dictado de voz

FIRMAS
Técnico ZAHORY SAC: [usuario logueado] + botón "Aprobar y firmar"
Supervisor cliente: [nombre] + botón "Aprobado"
```

**Al aprobar un reporte diario:**
- DMR acumulado del mes se recalcula automáticamente
- El consumo de materiales actualiza el stock
- Si DMR < DMP → alerta automática al supervisor y al Jefe de Proyectos
- Los pedidos de repuestos quedan en el panel de solicitudes
- Si estado = "Retorno a taller requerido" → alerta al Planner para coordinar logística

---

### Módulo 5 — Parte Diario de Taller

Registro de la jornada del técnico en taller, obligatoriamente vinculado a una OT.

```
CABECERA
Taller * (Ate / Satipo) | Fecha *
Técnico * | Supervisor / Jefe de Taller *
Especialidad: Mecánico / Eléctrico / Otro

OT ASOCIADA (obligatoria)
Dropdown de OTs abiertas del taller

ACTIVIDADES REALIZADAS (repetible)
OT | Descripción (texto + dictado de voz) | Hora inicio/fin | Horómetro/KM ini/fin

REPUESTOS, MATERIALES E INSUMOS EMPLEADOS
OT | Código/NP | Descripción | Cantidad | UM
(Tipo de ítem visible: Repuesto / Consumible / Insumo)

PEDIDO DE REPUESTOS
Código/NP | Descripción | Cantidad | UM | ⚪ Normal / 🔴 Urgente

ACEITES Y FLUIDOS UTILIZADOS (predefinidos)
Motor 15W40 / Transmisión SAE30 / Hidráulico SAE10
Diferenciales SAE50 / Tren de fuerza 80W90 / Tellus 68
OT | Tipo | Motivo | Cantidad | UM

REPORTAR HALLAZGO ADICIONAL
Botón → backlog vinculado al equipo y a la OT

TRABAJOS PENDIENTES Y OBSERVACIONES
Texto libre + dictado de voz

FIRMAS
Técnico Ejecutor / Jefe de Taller o Supervisor / Administración
```

**Estados del parte diario de taller:**
```
Pendiente → Aprobado
          ↓
       Rechazado → (técnico corrige) → Pendiente
```

---

### Módulo 6 — Gestión de paradas

Las paradas son entidades formales vinculadas a la OT.

```
OT asociada *, Activo *
Tipo de parada * (Correctiva / Preventiva / Programada / Stand-by / Accidente)
Causa de espera (Técnica / Por material / Por mano de obra /
                 Por aprobación / Por logística / Por cliente /
                 Por seguridad / Por retorno a Lima)
Sistema afectado * / Motivo detallado (texto + dictado de voz)
Hora inicio * / Hora fin * / Duración calculada automáticamente
Criticidad / Impacto en operación / Observaciones
```

**Reglas de paradas:**
- Una OT puede tener cero, una o varias paradas
- Las paradas correctivas (H.CTV) y por accidente (H.ACC) penalizan el DMR
- Las paradas por stand-by (HSB) no penalizan el DMR pero se facturan
- "Causa de espera" permite analizar cuellos de botella reales: material, MO, logística, cliente

---

### Módulo 7 — Dashboard operativo y de rentabilidad

#### Panel A — Backlog priorizado

```
KPIs:
Total activos | Emergencia (rojo) | Urgentes (naranja) | Pend. recursos | Listos para OT

Tabla ordenada por score descendente:
BKL | Equipo | Sistema | Hallazgo | Prioridad | Score | Días | Estado | Requiere retorno | Acción
```

El Planner puede: crear OT, fusionar backlogs, marcar retorno a taller, cambiar prioridad, descartar.

#### Panel B — DMR en tiempo real

```
Semáforo por equipo: Verde (≥ DMP) / Naranja (DMP-2% a DMP) / Rojo (< DMP-2%)
DMR acumulado vs. DMP del contrato
Gráfico DMR día a día (tendencia vs. objetivo)
Drill-down: qué guardias bajaron el DMR, causa de la caída
```

#### Panel C — Costos y rentabilidad por OT ⭐ Prioridad gerente

**KPIs del período:**
```
Costo estimado | Costo real | Desviación | Ingreso facturable | Margen bruto | OTs del período
```

**Gráfico 1 — Composición del costo (donut):** MO + Materiales + Transporte

**Gráfico 2 — Costo vs. ingreso por OT (barras agrupadas):** ingreso navy + costo slate por OT

**Gráfico 3 — Margen % por OT (barras horizontales):** de menor a mayor, coloreado rojo/naranja/verde

**Gráfico 4 — Desviación estimado vs. real (barras):** izquierda = ahorro (verde), derecha = exceso (rojo)

**Gráfico 5 — Evolución acumulada del mes (línea doble):** ingreso vs. costo acumulado

**Listado de OTs — especificación completa:**

El listado de OTs es la tabla principal de este panel. Tiene los siguientes elementos:

*Indicador de salud del proceso* (encima de la tabla, siempre visible):
```
Barra segmentada del período:
🟢 Desde backlog: 38 (80.9%)  🟡 Correctivo: 7 (14.9%)  ⬜ Acondiciona.: 1  🔵 Retorno: 1
Meta: ≥ 70% desde backlog
```
Si `% backlog < 70%` → badge naranja "Por debajo de meta". Si `% correctivo > 30%` → badge rojo "Correctivos > 30%".

*Toolbar de filtros:*
Proyecto / Tipo de OT / **Origen** (filtro nuevo: Todos / Desde backlog / Correctivo directo / Acondicionamiento / Retorno desde mina) / Estado / Fecha / Moneda USD-PEN

*Columnas de la tabla:*
| OT | **Origen** | Tipo | Equipo | Propietario | C.Estimado | C.Reservado | C.Real | Desvío | Ingreso | Margen |

La columna **Origen** muestra el badge de color correspondiente:
- 🟢 `Desde backlog`
- 🟡 `Correctivo directo`
- ⬜ `Acondicionamiento`
- 🔵 `Retorno desde mina`

Las OTs de acondicionamiento muestran en la columna **Margen**: `$0 — inversión` en gris, nunca un porcentaje. No entran en el cálculo del margen global del período.

Botón **"+ Nueva OT"** en el header navega directamente al selector modal de los 4 orígenes.

Toggle USD / PEN. Exportar reporte PDF gerencial (incluye la barra de salud del proceso).

#### Panel D — Solicitudes de reposición

```
Tipo (Urgente/Normal) | Ítem | Qty | Stock actual | Solicitado por | Proyecto | Estado
```

#### Panel E — Estado de activos (nuevo en v4)

Vista rápida del estado actual de todos los equipos:

```
Equipo | Proyecto | Propietario | Ubicación actual | Estado operativo | Última OT | Próx. mantto.
JB-DD311 | Pepas de Oro | ZAHORY SAC | Mina | 🟢 Operativo | OT-2026-047 | PM en 120 hrs
JB-24 | Buenaventura | ZAHORY SAC | Mina | 🟢 Operativo | OT-2026-050 | PM en 85 hrs
EQ-TALL-01 | Uchucchacua | Cliente | Taller Ate | 🔧 En taller | OT-2026-051 | —
```

---

### Módulo 8 — Reporte consolidado mensual (entregable al cliente)

PDF generado automáticamente con el formato exacto del documento que hoy se arma en Excel.

```
Encabezado: Logo ZAHORY SAC, Cliente, Contrato/OS, Equipo (Marca/Modelo/Serie/Código), Período

Tabla de guardias:
Turno | Fecha | H.Motor Ini/Fin/HT | H.Percusión Ini/Fin/HT | H.Eléctrico Ini/Fin/HT |
Hr.Trabj | Mantto PRG | Mantto PRV | Rep.ACC | Rep.CTVO | HSB | Total | D.M.% | Observaciones

Totales y resumen del período

Indicadores:
DMP pactado en contrato: XX.XX%
DMR real:                XX.XX%
Factor DMR/DMP:          X.XX
Horas reparación, mantenimiento, trabajadas, stand-by, disponibles

Firma del Jefe de Proyectos ZAHORY SAC
```

---

### Módulo 9 — Documentos comerciales

**Propuesta técnica-económica:** equipos en scope, tarifas propuestas, DMP ofertado, condiciones. Estados: Borrador / Enviada / Aceptada / Rechazada.

**Contrato / OS:** una vez aceptada la propuesta, se formaliza el marco contractual con vigencia, tarifas, DMP pactado, condiciones de facturación y equipos. Vincula el proyecto en el sistema.

**Acta de inicio:** se genera cuando el servicio comienza formalmente. Firma ZAHORY SAC + cliente.

**Remisión de servicios:** generada al cierre del período desde las OTs aprobadas del contrato. Agrupa N OTs en un solo documento de respaldo antes de la factura.

**Checklist de cierre documental (nuevo en v4):** antes de emitir la remisión, administración valida que cada OT tenga: reportes completos, firmas requeridas, consumos registrados, horas cerradas, paradas registradas, evidencia adjunta.

---

### Módulo 10 — Catálogo e inventario mínimo

Ver Módulo 1 — Catálogo. En Fase 1 el inventario mínimo incluye:
- Stock actual visible por ítem (distingue disponible vs. reservado)
- Reserva contra OT cuando el Planner planifica materiales
- Consumo real al aprobar reportes y partes (descuenta del stock)
- Solicitud de reposición automática cuando stock ≤ stock mínimo
- Sin compras formales ni kardex completo — eso llega en Fase 2

---

### Módulo 11 — Importación de datos

- Importación de reportes diarios desde CSV/XLSX (históricos y recurrente)
- Importación del catálogo de repuestos desde Excel actual
- Plantillas descargables con formato exacto
- Validación fila por fila con reporte de errores en español
- Modo "borrador" para revisar antes de confirmar
- Historial de importaciones con estado y errores

---

### Módulo 12 — Administración de usuarios y roles

**Gestión de usuarios:** nombre, email, rol, contexto (mina/taller/ambos), taller asignado, proyectos con acceso, especialidad, costo/hora empresa, estado.

**Configurador de roles por pantalla:** matriz toggle ON/OFF por módulo y acción. Módulos futuros visibles como "Próximamente" con candado. El rol `Configurador` tiene permisos inmutables.

---

### Módulo 13 — Configuración del sistema

Tipo de cambio USD/PEN, umbrales de alerta DMR, flujo de aprobación por proyecto, lubricantes y fluidos predefinidos, datos de empresa para PDFs, plantillas de importación, configuración de tipos de activo y tipos de OT.

---

### Módulo 14 — Gestión de Alquileres (Rental Management)

Módulo dedicado al ciclo completo del equipo bajo contrato de alquiler: desde la disponibilidad de flota hasta la liquidación del período con su reporte de DMR contractual.

**Estructura de navegación (sidebar grupo "Alquileres"):**
- Panel de Flota (`/flota`)
- Contratos y Tarifas (`/contratos-rental`)
- Actas / Despachos (`/checkout`)
- Liquidación y DMR (`/liquidacion`)

---

#### 14.1 Panel de Flota

Vista tipo "fleet board" con tarjeta visual por activo:

```
Tarjeta de equipo:
  [Imagen del equipo] (PNG desde /public/images/)
  Badge de estado superpuesto: Disponible (verde) / En operación (cyan) / En mantenimiento (naranja) / En tránsito (gris)
  Nombre del equipo / modelo
  Código interno | Año
  Horas acumuladas del período
  Proyecto asignado (si está en operación)
  Botón "Ver detalle" | "Crear contrato"
```

**KPI strip en el header:**
```
Total activos | En operación | Disponibles | En mantenimiento
```

**Estados de flota:**
| Estado | Significado |
|---|---|
| Disponible | Equipo sin contrato activo, listo para asignar |
| En operación | Equipo con contrato activo corriendo en campo |
| En mantenimiento | Equipo en taller — no disponible para nuevo contrato |
| En tránsito | Equipo en traslado entre ubicaciones |

Las imágenes de los equipos se sirven desde `public/images/` con nombre de archivo normalizado (ej. `equipo-lhd-01.png`). Si la imagen no existe se muestra un placeholder gris.

---

#### 14.2 Contratos y Tarifas

Lista de contratos de alquiler activos e históricos con modal de creación.

```
Tabla de contratos:
Contrato | Cliente | Equipo | Inicio | Fin | Tarifa/hr | DMP | Estado | Acciones

Modal "Nuevo contrato":
  Cliente * | Equipo * (filtrado a estado = Disponible)
  Fecha inicio * | Fecha fin *
  Tarifa por hora (USD) * | Tarifa stand-by (USD)
  DMP contractual (%) — default 97.92%
  Condiciones especiales (texto libre)
```

**Estados del contrato:**
- Activo — corriendo en el período
- Cerrado — período finalizado y liquidado
- Suspendido — pausa temporal acordada

---

#### 14.3 Actas Digitales / Despachos (Check-in & Check-out)

Formulario de acta de despacho o devolución del equipo. Reemplaza el documento en papel.

```
SECCIÓN 1 — Identificación
Tipo de acta * (Despacho / Devolución)
Equipo * | Contrato asociado * (autocompletado)
Fecha y hora * | Lugar *
Técnico responsable ZAHORY SAC * | Representante del cliente *

SECCIÓN 2 — Estado del equipo
Estado general (toggle-pills: Excelente / Bueno / Regular / Deficiente)
Nivel de combustible (slider 0–100%)
Horómetros al momento del acta (Motor ini/fin, Percusión ini/fin, etc.)

SECCIÓN 3 — Documentación
Accesorios y herramientas incluidos (checklist)
Observaciones y condiciones especiales
Evidencia fotográfica (dropzone — hasta 4 fotos)
Firma digital del técnico ZAHORY SAC
Firma digital del representante del cliente

Botones: "Guardar borrador" | "Emitir acta" | "Volver"
```

Las actas generan un PDF inmutable una vez emitidas.

---

#### 14.4 Liquidación y Reporte DMR

Pantalla de cierre del período de un contrato de alquiler. Muestra el DMR contractual y el resultado económico del período.

**KPI grid (4 indicadores):**
```
Horas facturables (HT + HSB) | DMR promedio del período | Ingresos del período (USD) | Penalidades acumuladas (USD)
```

**Tabla de liquidación por equipo:**
```
Equipo | Hrs. operadas | HSB | H.CTV | DMR real (%) | Meta DMP (%) | Δ DMR | Ingreso (USD) | Penalidad
```

**Lógica de penalidad:**
- Si `DMR real < DMP contractual` → fila se destaca en rojo (`background: #FFEBEE`, `color: #B71C1C`)
- La penalidad económica se calcula según las condiciones específicas del contrato
- Si `DMR real ≥ DMP contractual` → fila normal, sin penalidad

**Reglas de negocio del módulo de alquileres:**

**RN-A1 — Contrato activo bloquea disponibilidad:** Un equipo con contrato activo no puede asignarse a un nuevo contrato hasta que el período cierre.

**RN-A2 — Acta de despacho obliga imagen del estado:** No se puede emitir un acta sin al menos una foto evidenciando el estado del equipo.

**RN-A3 — DMR calculado en tiempo real:** El DMR del módulo de alquileres se alimenta de los mismos reportes diarios del Módulo 4, garantizando una única fuente de verdad.

**RN-A4 — Liquidación requiere acta de devolución:** No se puede cerrar la liquidación del período sin un acta de devolución emitida para cada equipo del contrato.

**RN-A5 — Tarifa stand-by facturable:** Las horas HSB se facturan a la tarifa stand-by del contrato. No penalizan el DMR pero sí generan ingreso.

---

## 10. Flujo operativo end-to-end

### Flujo A — Ciclo completo de punta a punta (Fase 1)

```
1.  Se registra el contrato u OS con sus condiciones
2.  Se activan los equipos del scope — cada uno con su propietario definido
3.  Si el equipo es nuevo → OT de Acondicionamiento en taller antes de ir a mina
4.  Si el equipo ya está en operación:
    └── Se abre OT de período en mina
    └── El técnico registra reporte diario por guardia
    └── El sistema calcula DMR y actualiza stock
5.  Si el técnico detecta un problema → crea backlog desde el reporte
6.  Planner revisa backlog priorizado por score
7.  Planner decide:
    └── ¿Se resuelve en campo? → se registra en la OT de período
    └── ¿Requiere retorno a taller? → coordina con logística → OT en taller
8.  Planner verifica stock antes de programar
    └── Si hay stock → reserva materiales contra la OT
    └── Si no hay → "Pendiente de recursos" + solicitud automática de reposición
9.  OT pasa a "Lista para ejecución"
10. Técnico ejecuta y registra (reporte diario o parte de taller):
    └── Horas reales, materiales consumidos, paradas, fotos, voz
    └── Si detecta algo más → nuevo backlog desde la ejecución
11. Supervisor / Jefe de Taller aprueba
12. Sistema actualiza:
    └── DMR acumulado → alerta si < DMP del contrato
    └── Stock (descuenta consumo real)
    └── Costo real acumulado de la OT
13. Al cierre del período, Supervisor cierra la OT:
    └── Sistema consolida costo real (MO + materiales + transporte)
    └── Calcula ingreso facturable y margen (si OT es facturable)
    └── Compara costo real vs. estimado (desviación)
    └── Si hay trabajo pendiente → genera backlog residual automáticamente
14. OT queda "Cerrada técnica"
15. Administración valida checklist documental → OT queda "Costeada"
16. Gerente ve rentabilidad por OT, equipo y proyecto en el dashboard
17. Administración genera reporte consolidado mensual en PDF para el cliente
18. Administración genera remisión de servicios agrupando las OTs del período
    (remisión es el documento previo a la factura — Fase 2 convierte esto en factura)
```

### Flujo B — Acondicionamiento de equipo nuevo

```
1.  Equipo ingresa al sistema con propietario = ZAHORY SAC
2.  Se crea OT tipo "Acondicionamiento" en taller
    └── Sin contrato cliente asociado (es inversión propia)
    └── Ingreso facturable = 0
3.  Técnicos ejecutan trabajos → partes diarios vinculados
4.  Consumo de materiales, horas y servicios se acumula como "costo de puesta en operación"
5.  Al cerrar la OT: el costo total queda como costo histórico del activo
6.  El equipo cambia de estado a "Listo para mina"
7.  Se asigna al proyecto → se abre OT de período → ciclo normal comienza
```

### Flujo C — Retorno de mina a taller

```
1.  Técnico en mina registra estado "Retorno a taller requerido" en reporte diario
2.  Backlog se crea o ya existe con flag "Requiere retorno a taller"
3.  Planner coordina con logística el traslado
4.  Equipo llega al taller → estado cambia a "En taller"
5.  Se abre OT en taller (con genealogía del backlog de mina)
6.  Técnicos de taller ejecutan → partes diarios
7.  Al cerrar la OT en taller → equipo vuelve a "Listo para mina"
8.  Si el trabajo es facturable al cliente → se agrega a la remisión del período
```

### Flujo D — Alerta de stock bajo

```
1.  Técnico registra consumo en reporte o parte
2.  Stock del ítem se actualiza
3.  Si stock actual ≤ stock mínimo:
    └── Solicitud de reposición automática en panel de Administración
    └── Badge de alerta en el ítem del catálogo
    └── Si OT tiene ese ítem reservado → alerta al Planner
```

---

## 11. Indicador crítico — DMR

### Fórmula

```
Variables por guardia (12 horas estándar):
  HT    = Horas Trabajadas del equipo
  PRG   = Horas Mantenimiento Preventivo Programado
  PRV   = Horas Mantenimiento Preventivo
  ACC   = Horas Reparación por Accidente u Otro
  CTV   = Horas Reparación Correctiva
  HSB   = Horas Stand-by (equipo disponible, mina no lo usa)
  TOTAL = HT + PRG + PRV + ACC + CTV + HSB

D.M. turno = (TOTAL - CTV - ACC) / TOTAL × 100

Acumulado del período:
  HD  = Horas Disponibles del período (definidas en el contrato)
  HR  = Total horas reparación (CTV + ACC)
  HM  = Total horas mantenimiento preventivo
  DMR = (HD - HR - HM) / HD × 100

DMP   = Disponibilidad Mecánica Programada (del contrato, default: 97.92%)
Factor = DMR / DMP  (≥ 1 = cumpliendo el objetivo contractual)
```

### Semáforo DMR

| Estado | Condición | Color |
|---|---|---|
| Cumpliendo | DMR ≥ DMP | Verde #4CAF50 |
| En riesgo | DMP - 2% ≤ DMR < DMP | Naranja #FF9800 |
| Incumpliendo | DMR < DMP - 2% | Rojo #E53935 |

### Reglas DMR

- Las HSB no penalizan el DMR — el equipo estaba disponible, la mina no lo usó
- Las H.CTV y H.ACC sí penalizan el DMR
- Las H.PRG no penalizan si están dentro del plan preventivo
- El DMP se toma del contrato asociado al proyecto — no es un valor fijo global
- La proyección del DMR al final del mes se calcula con la tendencia actual para dar alerta temprana

---

## 12. Cadena de aprobación para facturar

Una OT queda "lista para facturar" solo cuando cumple cuatro cierres. Esta lógica resuelve el problema actual donde finanzas factura sin saber si el trabajo está técnicamente completo.

```
CIERRE 1 — Técnico
  Aprueba: Supervisor de Mina (para OTs de mina) o Jefe de Taller (para OTs de taller)
  Requisitos: trabajo ejecutado, horas registradas, materiales consumidos,
              estado final del equipo, paradas registradas

CIERRE 2 — Documental
  Valida: Administración
  Requisitos: reportes/partes completos, firmas requeridas, evidencia adjunta,
              consistencia con el período del contrato

CIERRE 3 — Costos
  Valida: Sistema automáticamente + Administración/Control de gestión
  Requisitos: horas y costos calculados, materiales con precio snapshot,
              transporte imputado si aplica

CIERRE 4 — Contractual
  Aprueba: Jefe de Proyectos o Administración operativa
  Requisitos: OT dentro del período del contrato/OS,
              tarifa correcta aplicada, sin inconsistencias con el DMP
```

Solo tras estos cuatro cierres la OT pasa a estado "Costeada" y puede incluirse en una remisión de servicios y luego en una factura.

**En Fase 1:** los cierres 1, 2 y 3 están activos. El cierre 4 es manual (botón "Validar para remisión"). La factura en sí llega en Fase 3.

---

## 13. Documentos que genera el sistema

| Documento | Origen | Para quién | Formato |
|---|---|---|---|
| Reporte Diario Mecánico Eléctrico | Módulo 4 | Supervisor cliente + archivo | PDF |
| Parte Diario de Trabajo | Módulo 5 | Jefe de Taller + Administración | PDF |
| OT de Mantenimiento | Módulo 3 | Supervisor + Rep. contratista | PDF |
| Reporte Consolidado Mensual | Módulo 8 | Cliente (mensual) | PDF |
| Reporte de Costos y Rentabilidad | Módulo 7 Panel C | Gerencia | PDF + Excel |
| Solicitudes de reposición pendientes | Módulo 7 Panel D | Administración / Compras | Excel |
| Propuesta técnica-económica | Módulo 9 | Cliente potencial | PDF |
| Contrato / OS (registro) | Módulo 9 | Interno + cliente | PDF |
| Acta de inicio de proyecto | Módulo 9 | Cliente activo | PDF |
| Remisión de servicios | Módulo 9 | Cliente activo | PDF |
| Checklist de cierre documental | Módulo 9 | Administración | PDF |

---

## 14. Reglas de negocio

**RN-01 — Horómetro incremental:** El horómetro final debe ser ≥ al inicial. El sistema bloquea el guardado.

**RN-02 — Sin reporte duplicado:** No puede haber más de un reporte aprobado para el mismo equipo, turno y fecha.

**RN-03 — Costos solo en OT aprobada:** Los cálculos de costo real se ejecutan al aprobar. Antes se muestran como "estimado".

**RN-04 — Precio de repuesto congelado:** El precio se fija al momento de aprobación (snapshot) y no cambia retroactivamente.

**RN-05 — Tipo de cambio congelado:** La conversión USD/PEN se fija al momento de aprobación y no varía.

**RN-06 — HSB se factura:** Las horas de stand-by se incluyen en el ingreso facturable a la tarifa de stand-by del contrato.

**RN-07 — HSB no penaliza DMR:** Las horas de stand-by no cuentan como falla del equipo.

**RN-08 — DMP desde el contrato:** El DMP se toma del contrato asociado al proyecto. Si no hay contrato, se usa el default 97.92%.

**RN-09 — Parte de taller requiere OT:** No se puede crear un parte diario sin asociarlo a una OT abierta.

**RN-10 — Backlog residual automático:** Al cerrar una OT con trabajo pendiente → backlog residual automático.

**RN-11 — Genealogía obligatoria:** Toda OT creada desde un backlog mantiene la referencia visible e inmutable.

**RN-12 — No consumir sin stock o reserva:** No se puede registrar consumo de un ítem sin stock ni reserva sin excepción aprobada y trazada.

**RN-13 — Unicidad de OT activa por backlog:** No puede haber dos OTs activas para el mismo backlog sin autorización del Planner.

**RN-14 — Cierre técnico con requisitos completos:** Una OT no puede cerrar técnicamente sin: trabajo ejecutado, responsable identificado, horas reales, materiales consumidos o declaración de no consumo, estado final del equipo.

**RN-15 — OT de acondicionamiento sin ingreso facturable:** Las OTs de tipo Acondicionamiento sobre activos propios tienen Ingreso = 0. No se incluyen en remisiones al cliente.

**RN-16 — N OTs por factura:** El sistema agrupa OTs por período y contrato para la remisión. No es 1 OT = 1 factura.

**RN-17 — Repuestos requieren OT para consumirse:** Un repuesto no puede salir del stock sin estar vinculado a una OT activa. Los consumibles tienen lógica más flexible pero siempre imputados a proyecto o centro de costo.

**RN-18 — Técnico sin habilitación no asignable a mina:** Si la documentación del técnico venció, el sistema bloquea su asignación a OTs de contexto mina.

**RN-19 — Auditoría inmutable:** Toda modificación crítica registra usuario, fecha, valor anterior, valor nuevo y motivo. Ningún rol puede eliminar este historial.

**RN-20 — Dictado de voz es complementario:** La transcripción va al campo de texto y el técnico puede editarla. El campo siempre acepta texto directo.

**RN-21 — El origen de la OT es inmutable:** Una vez creada la OT, su origen (Backlog / Correctivo directo / Acondicionamiento / Retorno desde mina) no puede modificarse. Queda grabado en la auditoría y es visible en todas las vistas.

**RN-22 — Correctivo directo requiere justificación:** No se puede guardar una OT de origen "Correctivo directo" sin completar el campo "Motivo de no registrar backlog previo". Sin ese campo el formulario no avanza.

**RN-23 — Acondicionamiento no cierra sin checklist completo:** La OT de tipo Acondicionamiento no puede pasar a "Cerrada técnica" hasta que todos los ítems del checklist estén marcados como completados.

**RN-24 — Los técnicos no crean OTs:** Los roles Técnico de Mina y Técnico de Taller no tienen permiso para crear OTs desde ningún origen. Crean backlogs y registros que alimentan las OTs.

---

## 15. Modelo de datos

```sql
-- MAESTROS BASE

clientes (id, razon_social, ruc, contacto, email, telefono, estado)

contratos (id, numero, cliente_id, tipo, descripcion_servicio,
           moneda_facturacion, fecha_inicio, fecha_fin, estado,
           condiciones_facturacion, dmp_pct, observaciones, created_at)

proyectos (id, nombre, cliente_id, contrato_id, ubicacion,
           tipo_servicio, taller_id, fecha_inicio, fecha_fin,
           estado, moneda_facturacion, dmp_pct, horas_guardia,
           horas_disponibles_mes, created_at)

activos (id, codigo_interno, codigo_cliente,
         propietario, -- 'zahory_sac' | 'cliente'
         tipo_equipo, marca, modelo, serie, año,
         proyecto_id, cliente_id, contrato_id,
         ubicacion_actual, estado_operativo, estado_mantenimiento,
         horometro_motor, horometro_percusion, horometro_electrico,
         horometro_diesel, odometro,
         criticidad, familia, subfamilia,
         responsable_id, notas_tecnicas, created_at)

personal (id, codigo, nombres, cargo, especialidad,
          contexto_principal, -- 'mina' | 'taller' | 'ambos'
          supervisor_id, proyectos (array),
          turno, guardia, costo_hora_usd, costo_hora_extra_usd,
          vigencia_sctr, vigencia_licencia, vigencia_emo, vigencia_induccion,
          habilitado_mina, estado, created_at)

catalogos_tecnicos (id, tipo, nombre, descripcion, activo)
-- tipo: sistema / subsistema / componente / modo_falla / causa /
--       tipo_mantenimiento / tipo_parada / prioridad / severidad

repuestos (id, codigo, numero_parte, descripcion,
           tipo_item, -- 'repuesto' | 'consumible' | 'insumo' | 'herramienta'
           unidad_medida, sistema_id, subsistema_id, componente_id,
           equivalentes (array),
           precio_unitario_usd, stock_actual, stock_disponible, stock_reservado,
           stock_minimo, stock_maximo,
           almacen_principal, ubicacion_fisica, proveedor,
           lead_time_dias, criticidad, contexto, activo, created_at)

repuesto_precio_historial (id, repuesto_id, precio_anterior,
                            precio_nuevo, usuario_id, created_at)

tarifas (id, contrato_id, proyecto_id, tipo_trabajo,
         especialidad_tecnico, tarifa_usd_hora,
         tarifa_stanby_usd_hora, vigencia_desde, vigencia_hasta)

tipo_cambio (id, usd_a_pen, fecha, registrado_por_id, created_at)

-- BACKLOG

backlog (id, numero_backlog, fecha_registro, activo_id, proyecto_id,
         contrato_id, propietario_activo,
         fuente_backlog, sistema_id, subsistema_id, componente_id,
         modo_falla_id, descripcion_hallazgo, descripcion_trabajo_requerido,
         prioridad, severidad, requiere_parada, requiere_retorno_taller,
         requiere_repuestos, requiere_servicio_tercero,
         horas_estimadas, personal_estimado,
         score_prioridad, dias_activo, estado_backlog,
         ot_id_destino, backlog_origen_ot_id,
         usuario_registra_id, created_at, updated_at)

backlog_repuestos (id, backlog_id, repuesto_id, cantidad_estimada)
backlog_evidencias (id, backlog_id, tipo, url, created_at)
backlog_auditoria (id, backlog_id, usuario_id, accion,
                   datos_anteriores, datos_nuevos, created_at)

-- ÓRDENES DE TRABAJO

ot (id, numero_ot, tipo_ot, subtipo_ot, estado_ot, prioridad, criticidad,
    activo_id, proyecto_id, cliente_id, contrato_id,
    propietario_activo, -- 'zahory_sac' | 'cliente'
    es_facturable, -- true si hay contrato y activo es del cliente
    ubicacion, centro_costo,
    backlog_ids (array), origen_ot,
    planner_id, supervisor_id,
    descripcion_corta, descripcion_detallada, objetivo,
    requiere_parada, tiempo_parada_estimado, tiempo_parada_real,
    condicion_inicio, condicion_cierre,
    fecha_creacion, fecha_programada, fecha_inicio_real, fecha_fin_real,
    horometros (jsonb), motivos_parada (array),
    -- costos
    costo_mo_estimado_usd, costo_mo_real_usd,
    costo_materiales_estimado_usd, costo_materiales_reservado_usd,
    costo_materiales_real_usd, costo_transporte_usd,
    costo_total_estimado_usd, costo_total_reservado_usd, costo_total_real_usd,
    ingreso_facturable_usd, margen_usd, margen_pct, desviacion_costo_usd,
    tipo_cambio_cierre,
    -- aprobaciones
    aprobado_tecnico_id, aprobado_tecnico_at,
    aprobado_supervisor_id, aprobado_supervisor_at,
    aprobado_contratista_id, aprobado_contratista_at,
    validado_admin_id, validado_admin_at,
    -- control
    origen, created_at, updated_at)

ot_tareas (id, ot_id, descripcion, sistema_id, subsistema_id,
           tiempo_estimado, responsable_id, completada, orden)

ot_personal (id, ot_id, usuario_id, nombre_libre,
             horas_estimadas, horas_reales,
             costo_hora_usd_snapshot, costo_estimado_usd, costo_real_usd)

ot_materiales_plan (id, ot_id, repuesto_id, descripcion_libre,
                    cantidad_planificada, precio_usd, costo_estimado_usd)

ot_materiales_reserva (id, ot_id, repuesto_id, cantidad_reservada,
                        precio_usd, costo_reservado_usd, reservado_at)

ot_materiales_consumo (id, ot_id, repuesto_id, descripcion_libre,
                        tipo_item, cantidad_real,
                        precio_unitario_usd_snapshot, subtotal_usd,
                        registrado_por_id, created_at)

ot_pedidos (id, ot_id, repuesto_id, descripcion_libre,
            numero_parte, cantidad, unidad_medida,
            tipo_pedido, estado_pedido)

ot_auditoria (id, ot_id, usuario_id, accion, datos_anteriores,
              datos_nuevos, motivo, created_at)

-- REPORTES DIARIOS DE MINA

reportes_mina (id, codigo, equipo_id, proyecto_id, contrato_id,
               tecnico_id, ot_id, fecha, turno, supervisor_cliente,
               horometro_motor_ini, horometro_motor_fin, ht_motor,
               horometro_percusion_ini, horometro_percusion_fin, ht_percusion,
               horometro_electrico_ini, horometro_electrico_fin, ht_electrico,
               horas_trabajadas, horas_mantto_prg, horas_mantto_prv,
               horas_rep_acc, horas_rep_ctvo, horas_stanby,
               total_horas, dm_pct, tipo_mantenimiento (array),
               estado_equipo_cierre, -- incluye 'retorno_taller_requerido'
               observaciones, estado,
               aprobado_tecnico_at, aprobado_supervisor_at,
               nombre_supervisor_cliente, origen, created_at, updated_at)

reporte_mina_actividades (id, reporte_id, descripcion, tipo_falla,
                           estado_final, orden)
reporte_mina_repuestos (id, reporte_id, repuesto_id, tipo_item,
                         cantidad, precio_usd_snapshot, subtotal_usd)
reporte_mina_lubricantes (id, reporte_id, tipo_lubricante_id,
                           cantidad, unidad_medida)
reporte_mina_pedidos (id, reporte_id, repuesto_id, descripcion_libre,
                       numero_parte, cantidad, unidad_medida,
                       tipo_pedido, sistema_id, estado_pedido)

-- PARTES DIARIOS DE TALLER

partes_taller (id, codigo, taller_id, tecnico_id, proyecto_id,
               fecha, supervisor_id, especialidad,
               observaciones_pendientes, estado,
               aprobado_supervisor_at, aprobado_admin_at,
               created_at, updated_at)

parte_taller_actividades (id, parte_id, ot_id, descripcion,
                           hora_inicio, hora_fin,
                           horometro_km_ini, horometro_km_fin, orden)
parte_taller_repuestos (id, parte_id, ot_id, repuesto_id, tipo_item,
                         numero_parte, descripcion_libre,
                         cantidad, unidad_medida,
                         precio_usd_snapshot, subtotal_usd)
parte_taller_fluidos (id, parte_id, ot_id, tipo_fluido_id,
                       motivo, cantidad, unidad_medida)
parte_taller_pedidos (id, parte_id, ot_id, repuesto_id,
                       descripcion_libre, cantidad, unidad_medida,
                       tipo_pedido, estado_pedido)

-- PARADAS

paradas (id, ot_id, activo_id, tipo_parada, causa_espera,
         sistema_id, motivo, hora_inicio, hora_fin,
         duracion_horas, criticidad, impacto_operacion,
         observaciones, created_at)

-- ALMACÉN E INVENTARIO (estructura completa para escalar en Fase 2)

almacenes (id, nombre, tipo, ubicacion, activo)
-- tipo: 'central_lima' | 'carapongo' | 'lurin' | 'mina' | 'transito'

repuesto_stock_por_almacen (id, repuesto_id, almacen_id,
                             stock_actual, stock_disponible,
                             stock_reservado, updated_at)
-- En Fase 1: solo almacén central. En Fase 2: múltiples almacenes.

solicitudes_reposicion (id, repuesto_id, cantidad_solicitada,
                         tipo_pedido, proyecto_id, ot_id,
                         solicitado_por_id, origen,
                         estado, created_at)

-- ARCHIVOS Y EVIDENCIAS

evidencias (id, tabla_origen, registro_id, tipo,
            url, nombre_original, tamaño_bytes, created_at)

-- DOCUMENTOS COMERCIALES

propuestas (id, numero, cliente_id, proyecto_ref, fecha,
            vigencia, monto_estimado_usd, dmp_propuesto,
            estado, created_at)

actas_inicio (id, proyecto_id, contrato_id, propuesta_id,
              fecha_inicio, condiciones (jsonb), estado, created_at)

remisiones (id, numero, proyecto_id, contrato_id,
            periodo_desde, periodo_hasta,
            ot_ids (array), total_usd, estado,
            validado_admin_id, validado_admin_at, created_at)

checklist_cierre (id, ot_id, item, completado, validado_por_id,
                  validado_at, observacion)

-- CONFIGURACIÓN Y AUDITORÍA

talleres (id, nombre, ubicacion, activo)
tipos_lubricante (id, nombre, unidad_medida, contexto, activo)
tipos_fluido (id, nombre, unidad_medida, contexto, activo)
roles (id, nombre, permisos (jsonb), created_at)
usuarios (id, nombre, email, rol_id, contexto_principal,
          taller_id, especialidad, costo_hora_usd, activo, created_at)

importaciones (id, tipo, archivo, total_filas, filas_ok,
               filas_error, estado, usuario_id, created_at)

auditoria_general (id, tabla, registro_id, usuario_id, accion,
                   datos_anteriores (jsonb), datos_nuevos (jsonb),
                   motivo, created_at)
```

---

## 16. Requisitos técnicos

### Funcionales
- Plataforma 100% web, sin instalación
- Responsive — formularios usables en celular con una mano (mobile-first)
- Dictado de voz via Web Speech API con fallback a texto
- Adjuntar fotos desde cámara y galería
- Generación de PDF en el servidor
- Importación CSV y XLSX con validación fila por fila
- Exportación a CSV y PDF
- Cálculos de horómetros, DMR y costos en tiempo real en el formulario

### No funcionales
- Dashboard carga en < 3 segundos
- Formularios validan en tiempo real
- Mensajes de error en español, sin jerga técnica
- Sesiones expiran en 8 horas (configurable)
- Contraseñas: mínimo 8 caracteres, al menos una mayúscula y un número

### Seguridad
- Autenticación requerida para todas las rutas excepto login
- Cada usuario solo ve proyectos asignados
- Costos internos (costo/hora del técnico) solo visibles para Admin y Configurador
- Tarifas del contrato solo visibles para Admin, Configurador y Finanzas
- Auditoría inmutable — ningún rol puede borrar el historial

---

## 17. Criterios de aceptación — Fase 1

### Maestros y contratos
- [ ] Se puede registrar un contrato u OS con su DMP y equipos en scope
- [ ] El activo tiene campo "Propietario" que determina si la OT es facturable
- [ ] El personal tiene vigencia documental con bloqueo automático si vence

### Backlog
- [ ] El técnico puede crear un backlog desde el reporte diario sin salir del formulario
- [ ] El backlog tiene campo "Requiere retorno a taller" con alerta al Planner
- [ ] El score de prioridad se calcula automáticamente
- [ ] El Planner puede fusionar backlogs del mismo equipo y sistema en una OT
- [ ] Al cerrar una OT con trabajo pendiente → backlog residual automático
- [ ] La genealogía BKL → OT es visible e inmutable

### OT
- [ ] La OT tiene campo "Es facturable" derivado del propietario del activo y el contrato
- [ ] Las OTs de acondicionamiento (activo propio) muestran Ingreso = 0
- [ ] Los materiales tienen tres estados: planificado, reservado, consumido
- [ ] El sistema verifica stock antes de reservar materiales
- [ ] Los costos se calculan en tres versiones con desviación visible

### Reporte diario de mina
- [ ] El técnico puede marcar "Retorno a taller requerido" como estado del equipo
- [ ] El DMR del turno se calcula al completar los horómetros
- [ ] El consumo de materiales descuenta del stock al aprobar
- [ ] El DMP se toma del contrato del proyecto, no de un valor global

### Dashboard
- [ ] Panel de estado de activos muestra ubicación actual y propietario de cada equipo
- [ ] Las OTs de acondicionamiento se diferencian visualmente en el dashboard de costos
- [ ] El DMR usa el DMP del contrato para el semáforo, no un valor fijo
- [ ] El gráfico de desviación muestra ahorro vs. exceso por OT
- [ ] El toggle USD/PEN convierte todos los gráficos y números

### Cadena de aprobación
- [ ] Una OT no puede quedar "Costeada" sin los tres cierres completados
- [ ] La remisión de servicios agrupa N OTs del mismo período y contrato
- [ ] El checklist documental de administración bloquea el avance si hay ítems pendientes

---

## 18. Descripción de fases

### FASE 1 — El núcleo operativo con inteligencia de costos
**Duración estimada: 10–12 semanas**

Fase 1 digitaliza el ciclo técnico completo de ZAHORY SAC y le da al gerente visibilidad de rentabilidad en tiempo real.

**Lo que se construye:**

Los maestros base completos incluyendo el catálogo de contratos/OS, la ficha del activo con su propietario (ZAHORY SAC vs. cliente), el catálogo de repuestos con la clasificación funcional (repuesto/consumible/insumo/herramienta) y el inventario mínimo con stock actual.

El backlog como entidad formal con ciclo de vida propio, score automático de prioridad, flag de retorno a taller y generación automática de backlog residual al cerrar OTs con trabajo pendiente.

La OT con cuatro tipos nuevos respecto a versiones anteriores: Acondicionamiento para equipos propios antes de entrar a mina, y la distinción entre OTs facturables (activo del cliente + contrato) y OTs de inversión (activo propio).

El flujo de aprobación en cuatro cierres: técnico, documental, costos y contractual. Solo tras los cuatro, la OT queda "Costeada" y puede incluirse en una remisión.

Los formularios de campo digitales con dictado de voz, el nuevo estado "Retorno a taller requerido" en el reporte de mina, y el DMR calculado contra el DMP del contrato específico del equipo.

El dashboard gerencial con el panel de estado de activos, los cinco gráficos de costos, la diferenciación visual de OTs de acondicionamiento y el panel de backlog priorizado por score.

La remisión de servicios que agrupa N OTs por período y contrato como documento previo a la factura.

**Qué NO incluye Fase 1:** compras formales a proveedores, kardex completo, múltiples almacenes con movimientos, planner visual de turnos, liquidación de planilla, factura electrónica, contabilidad, MTTR/MTBF.

---

### FASE 2 — Almacén completo, compras, logística, planner visual y RRHH operativo
**Duración estimada: 8–10 semanas post Fase 1**

Fase 2 completa el ciclo logístico y operativo.

**Almacén completo:** múltiples almacenes (Lima central, Carapongo, Lurín, almacén en mina, stock en tránsito), entradas por compra, salidas por OT con documento de despacho, kardex por ítem, transferencias entre almacenes, ajustes con trazabilidad.

**Compras técnicas:** las solicitudes de reposición de Fase 1 se convierten en órdenes de compra formales con proveedor, precio, plazo y recepción. Evaluación de equivalentes o alternativas (rasgo propio del negocio ZAHORY SAC que hoy hace manualmente). Lead time visible para anticipar quiebres.

**Logística y transporte:** registro formal de viajes Lima–mina–Lima con técnicos transportados, materiales enviados, costo del viaje y prorrateo automático entre OTs del período. Documentos de remisión de carga.

**Planner visual:** calendario de OTs por equipo y técnico, vistas semanal y mensual, arrastrar y soltar con trazabilidad, alertas por conflicto de agenda. La regla de bloqueo por vigencia documental se activa plenamente.

**RRHH operativo:** ficha completa con certificaciones (SCTR, licencias, EMO, inducción), alertas de vencimiento, control de asistencia por guardia y proyecto, horas normales y extra para liquidación. Control de rotación mina/taller.

**Seguridad y SSOMAC:** checklist de permisos de trabajo vinculados a OT, registro de incidentes, clasificación de causas de espera para análisis de cuellos de botella.

**Contratos con penalidades:** las condiciones del contrato (DMP, penalidades por incumplimiento) quedan activas en el sistema. Las alertas de penalidad por DMR se vuelven contractualmente precisas.

**Valorización:** al cierre del período, el sistema genera la prefactura desde las OTs costeadas del contrato. El supervisor valida, el Jefe de Proyectos aprueba.

**MTTR:** con los datos de Fase 1, se calcula el tiempo medio de reparación por equipo y sistema.

---

### FASE 3 — ERP financiero completo e inteligencia operativa
**Duración estimada: 10–12 semanas post Fase 2**

Fase 3 cierra el ciclo económico y convierte la plataforma en un ERP sectorial completo.

**Facturación y cobranzas:** las valorizaciones de Fase 2 generan facturas electrónicas con integración al sistema de emisión. Control de cuentas por cobrar, seguimiento de pagos, alertas de vencimiento.

**Contabilidad de costos:** cada OT aporta a la contabilidad con clasificación por cuenta, centro de costo y proyecto. Asientos automáticos. Diferenciación entre costos de OTs facturables y costos de OTs de inversión.

**Presupuesto vs. real:** el Planner carga el presupuesto operativo por proyecto. El sistema compara en tiempo real costo real vs. presupuestado con alertas de desviación.

**RRHH administrativo completo:** liquidación de planilla, beneficios sociales, integración bancaria, vacaciones y licencias.

**MTTR y MTBF:** con dos fases de datos, el sistema calcula tiempo medio entre fallas y entre reparaciones. Habilita mantenimiento predictivo basado en datos reales de ZAHORY SAC.

**BI ejecutivo:** márgenes por cliente y contrato, tendencias de rentabilidad, eficiencia por técnico, ranking de equipos por costo de mantenimiento, costo de acondicionamiento histórico por activo, proyección de disponibilidad.

**Integración con app Zahory SAC Control:** migración o sincronización de los registros históricos.

**IA operativa:** clasificación automática del backlog, detección de backlogs duplicados, sugerencia de prioridad por historial de fallas, resumen técnico de OT desde los reportes, generación de borrador de OT desde descripción libre, alerta predictiva de mantenimiento por horómetros.

---

**La cadena completa del ERP ZAHORY SAC:**

```
Contrato / OS
    ↓
Activo (ZAHORY SAC o Cliente)
    ↓
Fase 1: Backlog → OT (facturable o inversión) → Ejecución →
        Consumo (stock) → Costo (3 versiones) → Remisión → Dashboard
    ↓
Fase 2: + Almacén real → Compras → Logística → RRHH → Valorización → MTTR
    ↓
Fase 3: + Facturación → Contabilidad → Presupuesto → MTBF → IA → BI integral
```

---

## 19. Glosario

| Término | Definición |
|---|---|
| **OT** | Orden de Trabajo. Objeto central del sistema. Conecta activo, contrato, backlog, personal, materiales, costos y documentos. |
| **OT facturable** | OT cuyo costo se traslada al cliente mediante valorización y factura. Aplica cuando el activo es del cliente y hay contrato vigente. |
| **OT de inversión / acondicionamiento** | OT sobre activo propio ZAHORY SAC. Ingreso facturable = 0. El costo es inversión para poner el activo en operación. |
| **Backlog** | Registro formal de trabajo pendiente detectado sobre un activo. Antecede a la OT y la alimenta. |
| **Score de prioridad** | Valor calculado: Severidad + Impacto Operacional + Seguridad + Disponibilidad + Antigüedad (máx. 17 pts). |
| **Backlog residual** | Backlog creado automáticamente cuando una OT cierra con trabajo pendiente. |
| **Genealogía** | Trazabilidad completa: Contrato → Backlog → OT → Reporte → Consumo → Costo → Remisión. |
| **Costo estimado** | Costo calculado al planificar: MO estimada + materiales planificados. |
| **Costo reservado** | Costo cuando el stock confirma los materiales y se comprometen contra la OT. |
| **Costo real** | Costo al cerrar: MO real + materiales consumidos + transporte. |
| **Desviación** | Diferencia entre costo real y costo estimado. Indicador de precisión del planeamiento. |
| **Contrato / OS** | Marco contractual que da cobertura al servicio y determina tarifas, DMP y condiciones de facturación. |
| **Propietario del activo** | ZAHORY SAC (activo propio, ciclo de inversión) o Cliente (activo de cliente, ciclo de facturación). |
| **N OTs → 1 factura** | Varias OTs ejecutadas en un período pueden agruparse en una sola factura consolidada por contrato. |
| **Remisión de servicios** | Documento que agrupa N OTs de un período y contrato como respaldo formal antes de la factura. |
| **Acondicionamiento** | Tipo de OT para preparar un equipo propio antes de entrar a mina. No genera ingreso facturable directo. |
| **Retorno a taller** | Estado del equipo que indica que debe trasladarse de mina a Lima para intervención mayor. |
| **Reporte Diario de Mina** | Registro por guardia. Alimenta horómetros, DMR, consumo de stock y backlog. |
| **Parte Diario de Taller** | Registro de jornada en taller, vinculado obligatoriamente a una OT. |
| **Horómetro** | Contador de horas de operación (Motor, Percusión, Eléctrico, Diesel, KM si aplica). |
| **HT** | Horas Trabajadas del equipo en la guardia. |
| **HSB** | Horas Stand-by. Equipo disponible pero la mina no lo usa. Se facturan y no penalizan el DMR. |
| **H.CTV** | Horas de reparación Correctiva. Penalizan el DMR. |
| **H.PRG** | Horas de Mantenimiento Preventivo Programado. No penalizan el DMR. |
| **DMR** | Disponibilidad Mecánica Real. KPI contractual. |
| **DMP** | Disponibilidad Mecánica Programada. Objetivo del contrato. Default: 97.92%. |
| **Factor DMR/DMP** | DMR ÷ DMP. Factor ≥ 1 = cumpliendo el objetivo contractual. |
| **Planner** | Responsable de analizar el backlog, verificar recursos y programar las OTs. |
| **MO** | Mano de Obra. Costo = horas × costo/hora empresa. |
| **Consumible** | Ítem de consumo continuo (aceites, grasas, combustible). Lógica de stock más flexible. |
| **Repuesto** | Componente del equipo que se reemplaza. Requiere OT para consumirse. |
| **Insumo** | Material de apoyo (herramientas). Puede controlarse como asignación o préstamo. |
| **MTTR** | Mean Time To Repair. Tiempo medio de reparación. Fase 2. |
| **MTBF** | Mean Time Between Failures. Tiempo medio entre fallas. Fase 3. |
| **Vibe coding** | Metodología de desarrollo asistida por IA donde el desarrollador dirige y la IA genera código. |
| **Acta de Despacho** | Documento digital que registra el estado del equipo y las condiciones en el momento de su entrega al cliente (check-out) o devolución (check-in). |
| **Contrato de Alquiler** | Marco contractual específico del módulo Rental que vincula un equipo, un cliente, un período, una tarifa por hora y un DMP contractual. |
| **DMR Contractual** | DMR calculado para el módulo de alquileres. Misma fórmula que el DMR operativo pero evaluado contra el DMP pactado en el contrato de alquiler para efecto de penalidades. |
| **Tarifa Stand-by** | Tarifa por hora HSB acordada en el contrato de alquiler. Se factura cuando el equipo está disponible pero la mina no lo usa. |
| **Liquidación de Período** | Proceso de cierre del mes de un contrato de alquiler: consolida horas operadas, HSB, DMR real, ingreso facturable y penalidades si el DMR incumplió el DMP contractual. |
| **Penalidad DMR** | Descuento o cargo económico aplicado cuando el DMR real del período cae por debajo del DMP acordado en el contrato de alquiler. |
| **Panel de Flota** | Vista tipo fleet board del módulo Rental que muestra todos los activos con su estado actual (Disponible / En operación / En mantenimiento / En tránsito) e imagen representativa. |
| **Parte Diario (Taller)** | Documento de jornada en taller con ID PT-XXXX. Vinculado obligatoriamente a una OT. Generado en talleres Ate o Satipo. |
| **Parte Diario (Mina)** | Reporte de campo con ID PM-XXXX. Registrado por guardia (turno Día / Noche) para cada equipo en operación en mina. |

---

*Documento Maestro v5.0 — Mayo 2026*
*Desarrollado por TIDEO Tech & Strategy*

*Cambios v5.0 vs v4.2 (sesión de desarrollo Mayo 2026):*
*— Módulo 14 nuevo: Gestión de Alquileres (Rental Management) con 4 sub-módulos*
*— 14.1 Panel de Flota: fleet board con tarjetas visuales, imágenes PNG de equipos desde /public/images/, badge de estado superpuesto, KPI strip*
*— 14.2 Contratos y Tarifas: listado de contratos + modal de creación con filtro de equipos disponibles*
*— 14.3 Actas Digitales / Despachos: formulario de check-in/check-out con toggle-pills de estado, slider de combustible, dropzone de evidencia fotográfica y firma digital*
*— 14.4 Liquidación y DMR: KPI grid + tabla con detección automática de incumplimiento DMR (filas rojas cuando DMR < DMP contractual)*
*— Sidebar: grupo Alquileres desbloqueado — todos sus 4 ítems navegables (antes bloqueados)*
*— Módulo 5: talleres renombrados Carapongo → Ate, Lurín → Satipo*
*— Módulo 5: estados del parte simplificados — Pendiente / Aprobado / Rechazado (antes: Borrador/Enviado/Aprobado Supervisor/Aprobado Administración)*
*— Sidebar estructural: Partes Diarios (Taller) y Partes Diarios (Mina) movidos de "Confiabilidad y Monitoreo" a "Taller y Servicios". Confiabilidad retiene solo Backlogs, SOS y Telemetría*
*— OT Detalle — trazabilidad ascendente: columna "Nº Parte" añadida en tab Tareas y Personal (vincula tarea → PT-XXXX que la originó)*
*— OT Detalle — trazabilidad ascendente: columna "Nº Parte" añadida en tab Materiales e Insumos (vincula consumo → PT-XXXX o PM-XXXX que lo registró)*
*— UI estandarizada para ambas pantallas de Partes Diarios: tabs Todos/Pendientes/Aprobados/Rechazados, columnas idénticas (Nº Parte | Fecha | Técnico | OT Vinculada | Horas Totales | Estado | Acciones), toolbar unificado con búsqueda y rango de fechas*
*— Reglas de negocio del módulo Alquileres: RN-A1 a RN-A5 documentadas*
*— Glosario actualizado con 9 términos nuevos del módulo Rental y Partes Diarios*
*— Próximo paso: implementar backend con Supabase — modelo de datos de Alquileres.*

*Cambios v4.1 vs v4.0:*
*— Módulo 3 completamente reescrito con los cuatro orígenes formales de la OT*
*— Selector modal de origen obligatorio antes de abrir el formulario de nueva OT*
*— Origen 1: pre-llenado de campos, fusión de backlogs, verificación de stock, genealogía inmutable*
*— Origen 2: campo obligatorio de justificación, banner de advertencia, estado inicial "En ejecución"*
*— Origen 3: checklist de acondicionamiento, bloqueo de cierre hasta completarlo, costo como inversión (ingreso = $0)*
*— Origen 4: dos fases separadas (traslado + OT de taller), genealogía completa mina→taller*
*— Indicador de salud del proceso: % de OTs por origen con meta del 70% desde backlog*
*— Badge de origen visible en todas las vistas de OT*
*— Estado inicial diferenciado por origen*
*— Restricciones de rol por origen documentadas en tabla*
*— Cabecera de OT alineada campo por campo con el Formato N°002 físico de ZAHORY SAC*
*— Motivos de parada alineados con los checkboxes del formato físico*
*— Sección de tareas numeradas del 1 al 7 (fiel al formato físico)*
*— Especificación del PDF de OT: debe ser espejo exacto del Formato N°002*
*— "Observaciones o trabajos pendientes" formalmente declarado como semilla del backlog residual*
*— Card de genealogía con contenido diferenciado según el origen de la OT*

*Cambios v4.2 vs v4.1 (revisión técnica del flujo de creación de OT):*
*— Origen 1: regla de selectabilidad — solo backlogs con cicloVida ≠ "Transferido a OT" y ≠ "Descartado" son seleccionables*
*— Origen 1: genealogía extendida a Contrato → Equipo → BKL-XXXX → OT-XXXX*
*— Origen 1: indicador visual fondo #E3F2FD en campos pre-llenados*
*— Origen 2: campo de motivo bloquea el botón "Crear" (no solo el guardado)*
*— Origen 2: alerta visible cuando correctivos directos supera el 30% del período*
*— Origen 3: checklist actualizado con los 10 ítems operativos específicos con barra de progreso*
*— Origen 3: selector de activo filtra solo equipos con propietario = ZAHORY SAC*
*— Origen 3: columna Margen muestra "$0 — inversión" (etiqueta más clara)*
*— Origen 4: Fase 1 muestra backlogs con requiereRetorno = true como contexto*
*— Origen 4: equipo pre-llenado desde Fase 1 con indicador visual fondo #E0F7FA*
*— Origen 4: genealogía completa Contrato → Equipo → BKL(s) → Coordinación → OT nueva*
*— Módulo 2: botón "Crear OT" diferenciado por ciclo de vida (primario navy si "Listo para OT", ghost cyan en otros estados)*
*— Módulo 2: botón adicional "🔄 Retorno" en filas con requiereRetorno = true*
*— Módulo 7 Panel C: columna "Origen" con badge de color en tabla de OTs*
*— Módulo 7 Panel C: filtro por origen en el toolbar*
*— Módulo 7 Panel C: indicador de salud como barra segmentada encima de la tabla*
*— Módulo 7 Panel C: botón "+ Nueva OT" navega al selector de los 4 orígenes*
*— Indicador de salud: visible en selector modal y en header del listado de OTs*
*Próximo paso: actualizar prompt de Lovable con los cambios de v4.2.*