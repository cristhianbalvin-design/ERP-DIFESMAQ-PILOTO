-- ZAHORY SAC ERP - DBS work order pivot
-- Reemplaza el modelo de 4 origenes por Tipo de Trabajo x Cargo Financiero.

alter table ot
  drop column if exists origen_ot,
  drop column if exists es_facturable;

alter table ot
  add column if not exists tipo_trabajo text not null default 'Correctivo'
    check (tipo_trabajo in ('Preventivo_PM', 'Correctivo', 'Acondicionamiento', 'Overhaul')),
  add column if not exists tipo_cargo text not null default 'Cliente_Contrato'
    check (tipo_cargo in ('Cliente_Contrato', 'Interno_DIFESMAQ', 'Garantia_Fabrica', 'Reclamo_Rework')),
  add column if not exists fecha_aprobacion_comercial timestamptz,
  add column if not exists fecha_programada_inicio date not null default current_date,
  add column if not exists fecha_primer_labor_real timestamptz,
  add column if not exists motivo_retrabajo text;

-- RN-01: estos cargos no generan ingreso facturable.
update ot
set ingreso_facturable_usd = 0,
    margen_usd = -coalesce(costo_total_real_usd, 0),
    margen_pct = null
where tipo_cargo in ('Interno_DIFESMAQ', 'Garantia_Fabrica', 'Reclamo_Rework');

alter table ot
  add constraint ot_rework_motivo_required
  check (tipo_cargo <> 'Reclamo_Rework' or nullif(trim(coalesce(motivo_retrabajo, '')), '') is not null);

alter table ot
  add constraint ot_dbs_valid_work_charge_matrix
  check (
    not (tipo_trabajo = 'Preventivo_PM' and tipo_cargo = 'Garantia_Fabrica') and
    not (tipo_trabajo = 'Preventivo_PM' and tipo_cargo = 'Reclamo_Rework') and
    not (tipo_trabajo = 'Overhaul' and tipo_cargo = 'Reclamo_Rework')
  );

-- RN-DBS-02 se recomienda reforzar con trigger al cerrar tecnicamente:
-- tipo_cargo = Cliente_Contrato requiere fecha_aprobacion_comercial antes de pasar a Cerrada tecnica.

create table if not exists standard_jobs (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  descripcion text not null,
  sistema_id uuid references catalogos_tecnicos(id),
  horas_estimadas_mo numeric(10,2) not null default 0,
  repuestos_default jsonb not null default '[]'::jsonb
);

create table if not exists ot_segmentos (
  id uuid primary key default gen_random_uuid(),
  ot_id uuid not null references ot(id) on delete cascade,
  numero_segmento text not null,
  descripcion text not null,
  standard_job_id uuid references standard_jobs(id),
  unique (ot_id, numero_segmento)
);

create table if not exists ot_operaciones (
  id uuid primary key default gen_random_uuid(),
  segmento_id uuid not null references ot_segmentos(id) on delete cascade,
  numero_operacion text not null,
  descripcion text not null,
  unique (segmento_id, numero_operacion)
);

alter table ot_tareas
  add column if not exists segmento_id uuid references ot_segmentos(id);

alter table ot_personal
  add column if not exists segmento_id uuid references ot_segmentos(id);

alter table ot_materiales_consumo
  add column if not exists segmento_id uuid references ot_segmentos(id);

alter table backlog
  add column if not exists nivel_alerta_sos text check (nivel_alerta_sos in ('Normal', 'Monitorear', 'Critico')),
  add column if not exists reporte_laboratorio_url text;
