-- Proposa database schema
-- Run this in your Supabase SQL editor to set up the tables

-- Signals table: stores all tracking events
create table if not exists signals (
  id bigint generated always as identity primary key,
  event text not null,
  properties jsonb not null default '{}',
  session_id text not null,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_signals_event on signals (event);
create index if not exists idx_signals_session_id on signals (session_id);
create index if not exists idx_signals_created_at on signals (created_at desc);

-- Waitlist table: stores email signups
create table if not exists waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  feature text,
  source text not null default 'landing',
  created_at timestamptz not null default now()
);

create index if not exists idx_waitlist_email on waitlist (email);

-- Proposals table: stores generated proposals for analytics and history
create table if not exists proposals (
  id bigint generated always as identity primary key,
  session_id text not null,
  company_name text not null,
  industry text,
  services text,
  tone text,
  language text,
  client_name text,
  brief_text text,
  budget text,
  deadline text,
  proposal_text text not null,
  source text not null default 'ai',
  created_at timestamptz not null default now()
);

create index if not exists idx_proposals_session_id on proposals (session_id);
create index if not exists idx_proposals_created_at on proposals (created_at desc);
create index if not exists idx_proposals_industry on proposals (industry);

-- Enable Row Level Security (but allow all access via service role key for MVP)
alter table signals enable row level security;
alter table waitlist enable row level security;
alter table proposals enable row level security;

-- Permissive policies for MVP (restrict later with auth)
create policy "Allow all signal inserts" on signals for insert with check (true);
create policy "Allow all signal reads" on signals for select using (true);

create policy "Allow all waitlist inserts" on waitlist for insert with check (true);
create policy "Allow all waitlist reads" on waitlist for select using (true);

create policy "Allow all proposal inserts" on proposals for insert with check (true);
create policy "Allow all proposal reads" on proposals for select using (true);
