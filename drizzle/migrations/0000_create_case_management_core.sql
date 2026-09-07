-- =============================================================
-- Kümmer – Kernschema: Rollen, Profile, Fälle, Kommunikation,
-- Dokumente, Termine, Nachrichten, interne Notizen, Audit-Log
-- =============================================================

-- ---------- Enums ----------
create type public.app_role as enum ('customer', 'employee', 'admin');

create type public.case_status as enum (
  'created',              -- Ticket erstellt
  'reviewing',            -- Informationen werden geprüft
  'call_pending',         -- Persönliches Gespräch ausstehend
  'accepted',             -- Fall angenommen
  'contacting_provider',  -- Dienstleister wird kontaktiert
  'awaiting_provider',    -- Rückmeldung des Dienstleisters ausstehend
  'negotiating',          -- Lösung wird verhandelt
  'agreement_reached',    -- Vereinbarung erzielt
  'closed',               -- Fall abgeschlossen
  'no_agreement',         -- Keine Einigung erzielt
  'escalated'             -- Weitere Unterstützung erforderlich
);

create type public.case_priority as enum ('low', 'normal', 'high', 'urgent');

create type public.problem_type as enum (
  'no_response', 'unreachable', 'delayed', 'unfinished', 'missed_appointment', 'other'
);

create type public.contact_channel as enum ('phone', 'email', 'sms', 'whatsapp', 'in_person', 'letter', 'other');

create type public.contact_author as enum ('customer', 'staff');

create type public.appointment_status as enum ('requested', 'confirmed', 'completed', 'cancelled');

-- ---------- Profile ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  preferred_contact contact_channel default 'phone',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- ---------- Rollen (separate Tabelle – niemals im Profil!) ----------
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select, insert on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

-- Mitarbeiter ODER Admin
create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('employee', 'admin')
  )
$$;

-- ---------- Fälle ----------
create sequence public.case_number_seq;

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  customer_id uuid not null references auth.users(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,

  status case_status not null default 'created',
  priority case_priority not null default 'normal',
  next_step text,
  deadline_at timestamptz,

  problem_types problem_type[] not null default '{}',

  -- Dienstleister
  provider_company text not null,
  provider_contact_person text,
  provider_phone text,
  provider_email text,
  provider_website text,
  provider_address text,

  -- Auftrag
  service_type text,
  order_description text,
  order_date date,
  agreed_start date,
  agreed_end date,
  agreed_deadline_note text,
  agreed_price_cents bigint,
  paid_cents bigint,
  invoice_number text,
  order_number text,

  -- Problem
  problem_description text not null,
  what_was_agreed text,
  what_happened text,
  what_is_not_working text,
  problem_since date,
  last_contact_at date,
  contact_attempts integer,
  provider_reacted boolean,
  desired_outcome text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create index cases_customer_idx on public.cases(customer_id);
create index cases_status_idx on public.cases(status);
create index cases_deadline_idx on public.cases(deadline_at);

grant select, insert, update on public.cases to authenticated;
grant all on public.cases to service_role;
alter table public.cases enable row level security;

-- Ticketnummer automatisch: #WK-JJJJ-00001
create or replace function public.set_ticket_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.ticket_number is null or new.ticket_number = '' then
    new.ticket_number := 'WK-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.case_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

create trigger cases_set_ticket_number
  before insert on public.cases
  for each row execute function public.set_ticket_number();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger cases_touch before update on public.cases
  for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------- Kommunikationshistorie ----------
create table public.case_contacts (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  author contact_author not null default 'customer',
  created_by uuid references auth.users(id) on delete set null,
  channel contact_channel not null,
  occurred_at timestamptz not null default now(),
  contact_person text,
  outcome text,
  note text,
  next_step text,
  created_at timestamptz not null default now()
);

create index case_contacts_case_idx on public.case_contacts(case_id);
grant select, insert, update, delete on public.case_contacts to authenticated;
grant all on public.case_contacts to service_role;
alter table public.case_contacts enable row level security;

-- ---------- Dokumente ----------
create table public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create index case_documents_case_idx on public.case_documents(case_id);
grant select, insert, delete on public.case_documents to authenticated;
grant all on public.case_documents to service_role;
alter table public.case_documents enable row level security;

-- ---------- Termine (Telefongespräch) ----------
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  scheduled_at timestamptz not null,
  status appointment_status not null default 'confirmed',
  -- Vorbereitung für spätere Kalender-Integration (Google/Outlook/Calendly)
  external_provider text,
  external_event_id text,
  note text,
  created_at timestamptz not null default now()
);

create index appointments_case_idx on public.appointments(case_id);
grant select, insert, update on public.appointments to authenticated;
grant all on public.appointments to service_role;
alter table public.appointments enable row level security;

-- ---------- Nachrichten Kunde <-> Unternehmen ----------
create table public.case_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  from_staff boolean not null default false,
  body text not null,
  created_at timestamptz not null default now()
);

create index case_messages_case_idx on public.case_messages(case_id);
grant select, insert on public.case_messages to authenticated;
grant all on public.case_messages to service_role;
alter table public.case_messages enable row level security;

-- ---------- Interne Notizen (NIEMALS für Kunden sichtbar) ----------
create table public.case_internal_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index case_internal_notes_case_idx on public.case_internal_notes(case_id);
grant select, insert, update, delete on public.case_internal_notes to authenticated;
grant all on public.case_internal_notes to service_role;
alter table public.case_internal_notes enable row level security;

-- ---------- Audit-Log ----------
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  case_id uuid references public.cases(id) on delete cascade,
  action text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

grant select, insert on public.audit_log to authenticated;
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;

-- =============================================================
-- RLS Policies
-- =============================================================

-- Profile
create policy "own profile select" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_staff(auth.uid()));
create policy "own profile insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Rollen: eigene Rollen lesbar, Staff sieht alle; Selbstregistrierung nur als Kunde
create policy "roles select own" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "roles self customer insert" on public.user_roles
  for insert to authenticated with check (user_id = auth.uid() and role = 'customer');

-- Fälle
create policy "cases select own or staff" on public.cases
  for select to authenticated using (customer_id = auth.uid() or public.is_staff(auth.uid()));
create policy "cases insert own" on public.cases
  for insert to authenticated with check (customer_id = auth.uid());
create policy "cases update staff" on public.cases
  for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Kommunikationshistorie
create policy "contacts select own or staff" on public.case_contacts
  for select to authenticated using (
    public.is_staff(auth.uid())
    or exists (select 1 from public.cases c where c.id = case_id and c.customer_id = auth.uid())
  );
create policy "contacts insert own or staff" on public.case_contacts
  for insert to authenticated with check (
    (public.is_staff(auth.uid()) and author = 'staff')
    or (author = 'customer' and exists (
      select 1 from public.cases c where c.id = case_id and c.customer_id = auth.uid()))
  );
create policy "contacts staff update" on public.case_contacts
  for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "contacts staff delete" on public.case_contacts
  for delete to authenticated using (public.is_staff(auth.uid()));

-- Dokumente
create policy "documents select own or staff" on public.case_documents
  for select to authenticated using (
    public.is_staff(auth.uid())
    or exists (select 1 from public.cases c where c.id = case_id and c.customer_id = auth.uid())
  );
create policy "documents insert own or staff" on public.case_documents
  for insert to authenticated with check (
    public.is_staff(auth.uid())
    or exists (select 1 from public.cases c where c.id = case_id and c.customer_id = auth.uid())
  );
create policy "documents delete own or staff" on public.case_documents
  for delete to authenticated using (
    public.is_staff(auth.uid()) or uploaded_by = auth.uid()
  );

-- Termine
create policy "appointments select own or staff" on public.appointments
  for select to authenticated using (customer_id = auth.uid() or public.is_staff(auth.uid()));
create policy "appointments insert own" on public.appointments
  for insert to authenticated with check (
    customer_id = auth.uid()
    and exists (select 1 from public.cases c where c.id = case_id and c.customer_id = auth.uid())
  );
create policy "appointments update own or staff" on public.appointments
  for update to authenticated using (customer_id = auth.uid() or public.is_staff(auth.uid()))
  with check (customer_id = auth.uid() or public.is_staff(auth.uid()));

-- Nachrichten
create policy "messages select own or staff" on public.case_messages
  for select to authenticated using (
    public.is_staff(auth.uid())
    or exists (select 1 from public.cases c where c.id = case_id and c.customer_id = auth.uid())
  );
create policy "messages insert own or staff" on public.case_messages
  for insert to authenticated with check (
    sender_id = auth.uid() and (
      (from_staff = true and public.is_staff(auth.uid()))
      or (from_staff = false and exists (
        select 1 from public.cases c where c.id = case_id and c.customer_id = auth.uid()))
    )
  );

-- Interne Notizen: ausschließlich Staff
create policy "internal notes staff only select" on public.case_internal_notes
  for select to authenticated using (public.is_staff(auth.uid()));
create policy "internal notes staff only insert" on public.case_internal_notes
  for insert to authenticated with check (public.is_staff(auth.uid()) and author_id = auth.uid());
create policy "internal notes staff only update" on public.case_internal_notes
  for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "internal notes staff only delete" on public.case_internal_notes
  for delete to authenticated using (public.is_staff(auth.uid()));

-- Audit-Log: nur Admin lesen, alle Angemeldeten schreiben
create policy "audit admin select" on public.audit_log
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "audit insert authenticated" on public.audit_log
  for insert to authenticated with check (actor_id = auth.uid());

-- =============================================================
-- Werktags-Frist (2 Werktage), Wochenenden werden übersprungen
-- =============================================================
create or replace function public.add_business_days(_from timestamptz, _days integer)
returns timestamptz
language plpgsql
immutable
as $$
declare
  d timestamptz := _from;
  added integer := 0;
begin
  while added < _days loop
    d := d + interval '1 day';
    if extract(isodow from d) < 6 then
      added := added + 1;
    end if;
  end loop;
  return d;
end;
$$;
