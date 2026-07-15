-- Nexa UI v1.4 Supabase schema
-- Run in Supabase SQL Editor or with `supabase db push`.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'viewer' check (role in ('admin','manager','operator','viewer')),
  status text not null default 'active' check (status in ('active','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name, role)
  values(new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), coalesce(new.raw_user_meta_data->>'role','viewer'))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'viewer');
$$;

create table if not exists public.clients (
  id text primary key,
  name text not null,
  email text not null default '',
  phone text not null default '',
  company text not null default '',
  status text not null default 'active' check (status in ('active','vip','inactive')),
  joined_at date not null default current_date,
  note text not null default '',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(14,2) not null default 0,
  description text not null default '',
  status text not null default 'active' check (status in ('active','inactive')),
  icon text not null default '◈',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  client_id text references public.clients(id) on delete set null,
  client_name text not null,
  client_email text not null default '',
  service_id text references public.services(id) on delete set null,
  service_name text not null,
  amount numeric(14,2) not null default 0,
  status text not null default 'new' check (status in ('new','working','review','done','cancelled')),
  progress integer not null default 0 check (progress between 0 and 100),
  order_date date not null default current_date,
  note text not null default '',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  order_id text references public.orders(id) on delete set null,
  client_name text not null,
  amount numeric(14,2) not null default 0,
  method text not null default 'bank' check (method in ('cash','card','bank')),
  status text not null default 'pending' check (status in ('paid','partial','pending','overdue')),
  payment_date date not null default current_date,
  reference text not null default '',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id text primary key,
  order_id text references public.orders(id) on delete set null,
  client_name text not null,
  client_email text not null default '',
  service_name text not null,
  subtotal numeric(14,2) not null default 0,
  tax numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','paid')),
  issued_at date not null default current_date,
  due_at date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo','progress','review','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  assignee text not null default '',
  due_date date,
  order_id text references public.orders(id) on delete set null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calendar_events (
  id text primary key,
  title text not null,
  type text not null default 'meeting' check (type in ('task','meeting','payment','order')),
  event_date date not null,
  event_time time,
  description text not null default '',
  linked_id text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id text primary key,
  name text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  storage_path text not null unique,
  order_id text references public.orders(id) on delete set null,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now()
);

create table if not exists public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null default 'system',
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text not null default '',
  action text not null,
  entity text not null,
  entity_id text not null,
  summary text not null,
  changes jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','clients','services','orders','invoices','tasks','calendar_events'] loop
    execute format('drop trigger if exists touch_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger touch_%I_updated_at before update on public.%I for each row execute procedure public.touch_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.tasks enable row level security;
alter table public.calendar_events enable row level security;
alter table public.documents enable row level security;
alter table public.app_notifications enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (id = auth.uid() or public.current_user_role() = 'admin');
drop policy if exists profiles_admin_manage on public.profiles;
create policy profiles_admin_manage on public.profiles for all to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

do $$
declare table_name text;
begin
  foreach table_name in array array['clients','services','orders','payments','invoices','tasks','calendar_events','documents'] loop
    execute format('drop policy if exists %I_read on public.%I', table_name, table_name);
    execute format('create policy %I_read on public.%I for select to authenticated using (true)', table_name, table_name);
  end loop;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array['clients','services','orders','payments','invoices','documents'] loop
    execute format('drop policy if exists %I_manage on public.%I', table_name, table_name);
    execute format('create policy %I_manage on public.%I for all to authenticated using (public.current_user_role() in (''admin'',''manager'',''operator'')) with check (public.current_user_role() in (''admin'',''manager'',''operator''))', table_name, table_name);
  end loop;
end $$;

drop policy if exists tasks_manage on public.tasks;
create policy tasks_manage on public.tasks for all to authenticated using (public.current_user_role() in ('admin','manager','operator')) with check (public.current_user_role() in ('admin','manager','operator'));
drop policy if exists calendar_events_manage on public.calendar_events;
create policy calendar_events_manage on public.calendar_events for all to authenticated using (public.current_user_role() in ('admin','manager','operator')) with check (public.current_user_role() in ('admin','manager','operator'));

drop policy if exists notifications_read on public.app_notifications;
create policy notifications_read on public.app_notifications for select to authenticated using (user_id = auth.uid() or public.current_user_role() = 'admin');
drop policy if exists notifications_manage on public.app_notifications;
create policy notifications_manage on public.app_notifications for all to authenticated using (user_id = auth.uid() or public.current_user_role() = 'admin') with check (user_id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists audit_read on public.audit_logs;
create policy audit_read on public.audit_logs for select to authenticated using (public.current_user_role() in ('admin','manager'));
drop policy if exists audit_insert on public.audit_logs;
create policy audit_insert on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('nexa-documents','nexa-documents',false,8388608,array['image/png','image/jpeg','image/webp','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists nexa_documents_read on storage.objects;
create policy nexa_documents_read on storage.objects for select to authenticated using (bucket_id='nexa-documents');
drop policy if exists nexa_documents_insert on storage.objects;
create policy nexa_documents_insert on storage.objects for insert to authenticated with check (bucket_id='nexa-documents' and public.current_user_role() in ('admin','manager','operator'));
drop policy if exists nexa_documents_update on storage.objects;
create policy nexa_documents_update on storage.objects for update to authenticated using (bucket_id='nexa-documents' and public.current_user_role() in ('admin','manager','operator')) with check (bucket_id='nexa-documents' and public.current_user_role() in ('admin','manager','operator'));
drop policy if exists nexa_documents_delete on storage.objects;
create policy nexa_documents_delete on storage.objects for delete to authenticated using (bucket_id='nexa-documents' and public.current_user_role() in ('admin','manager','operator'));

grant usage on schema public to authenticated;
grant select,insert,update,delete on public.profiles,public.clients,public.services,public.orders,public.payments,public.invoices,public.tasks,public.calendar_events,public.documents,public.app_notifications to authenticated;
grant select,insert on public.audit_logs to authenticated;

do $$
begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='tasks') then alter publication supabase_realtime add table public.tasks; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='calendar_events') then alter publication supabase_realtime add table public.calendar_events; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='app_notifications') then alter publication supabase_realtime add table public.app_notifications; end if;
end $$;
