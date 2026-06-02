-- Kontor Business Club - Initial-Schema
-- Drei Tabellen fuer die oeffentlichen Formulare.
-- Inserts laufen ausschliesslich serverseitig ueber den service_role-Key,
-- der RLS umgeht. Daher: RLS aktiv, aber KEINE public select/insert-Policy.

-- Mitgliedsanfragen
create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pending',
  name        text not null,
  firma       text not null,
  email       text not null,
  telefon     text not null,        -- Pflichtfeld
  nachricht   text not null,
  branche     text not null,
  website     text                  -- optional
);

-- Event-Anmeldungen
create table if not exists public.event_registrations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'pending',
  name          text not null,
  firma         text not null,
  email         text not null,
  telefon       text not null,      -- Pflichtfeld
  nachricht     text not null,
  event_name    text not null,
  anzahl_gaeste integer not null default 0,
  vertreter     boolean not null default false,
  ist_mitglied  boolean not null default false
);

-- Allgemeine Kontaktanfragen
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pending',
  name        text not null,
  firma       text not null,
  email       text not null,
  telefon     text not null,        -- Pflichtfeld
  nachricht   text not null
);

-- RLS aktivieren. Ohne Policy ist fuer anon/authenticated alles gesperrt;
-- nur der service_role-Key (serverseitig) darf schreiben/lesen.
alter table public.applications        enable row level security;
alter table public.event_registrations enable row level security;
alter table public.contact_submissions enable row level security;
