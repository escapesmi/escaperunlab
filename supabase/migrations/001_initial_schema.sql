-- supabase/migrations/001_initial_schema.sql
-- Echo Stride Club — Full Database Schema
-- Run this in Supabase SQL Editor

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────────────────────
create table public.users (
  id                  uuid references auth.users on delete cascade primary key,
  name                text,
  email               text unique not null,
  avatar_url          text,
  age                 integer,
  gender              text check (gender in ('male', 'female', 'other')),
  height              numeric(5,1),           -- cm
  weight              numeric(5,1),           -- kg
  experience_level    text not null default 'beginner'
                      check (experience_level in ('beginner', 'intermediate', 'advanced')),
  current_pace        text default '8:00',    -- min/km
  goal                text default '5k',
  days_per_week       integer default 3 check (days_per_week between 2 and 6),
  injury_history      text default 'none',
  pronation           text default 'neutral',
  onboarding_complete boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── TRAINING PLANS ──────────────────────────────────────────────────────────
create table public.training_plans (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.users on delete cascade not null,
  plan_type      text not null check (plan_type in ('30day', '8week', '12week')),
  duration_weeks integer not null,
  goal           text not null,
  start_date     date not null default current_date,
  end_date       date,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ─── WORKOUTS ────────────────────────────────────────────────────────────────
create table public.workouts (
  id             uuid primary key default uuid_generate_v4(),
  plan_id        uuid references public.training_plans on delete cascade not null,
  week           integer not null,
  day            integer not null check (day between 1 and 7),
  type           text not null check (type in (
                   'easy','walkrun','interval','tempo',
                   'longrun','recovery','strength','rest'
                 )),
  distance       numeric(5,2),               -- km
  duration       integer,                    -- minutes
  target_pace    text,                       -- min/km
  target_hr      text,                       -- e.g. "Zone 2 (130–145 bpm)"
  rpe            text,                       -- e.g. "3–4"
  status         text not null default 'planned'
                 check (status in ('planned','upcoming','completed','skipped')),
  warmup         text,
  cooldown       text,
  notes          text,
  scheduled_date date,
  is_deload      boolean not null default false,
  created_at     timestamptz not null default now()
);

-- ─── WORKOUT LOGS ─────────────────────────────────────────────────────────────
create table public.workout_logs (
  id               uuid primary key default uuid_generate_v4(),
  workout_id       uuid references public.workouts on delete cascade not null,
  user_id          uuid references public.users on delete cascade not null,
  actual_distance  numeric(5,2),
  actual_pace      text,
  actual_hr        integer,
  fatigue          integer check (fatigue between 1 and 10),
  soreness         integer check (soreness between 1 and 10),
  notes            text,
  completed_at     timestamptz not null default now()
);

-- ─── SHOES ───────────────────────────────────────────────────────────────────
create table public.shoes (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.users on delete cascade not null,
  brand        text not null,
  model        text not null,
  color        text default '#00E5A0',
  mileage      numeric(7,1) not null default 0,
  max_mileage  numeric(7,1) not null default 500,
  status       text not null default 'active' check (status in ('active', 'retired')),
  added_date   date not null default current_date,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
create index idx_training_plans_user_id on public.training_plans(user_id);
create index idx_workouts_plan_id       on public.workouts(plan_id);
create index idx_workouts_scheduled     on public.workouts(scheduled_date);
create index idx_workout_logs_user_id   on public.workout_logs(user_id);
create index idx_workout_logs_workout   on public.workout_logs(workout_id);
create index idx_shoes_user_id          on public.shoes(user_id);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger on_shoes_updated
  before update on public.shoes
  for each row execute procedure public.handle_updated_at();

-- ─── AUTO-CREATE USER PROFILE ON SIGN-UP ────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table public.users          enable row level security;
alter table public.training_plans enable row level security;
alter table public.workouts       enable row level security;
alter table public.workout_logs   enable row level security;
alter table public.shoes          enable row level security;

-- Users: only read/write own profile
create policy "Users can view own profile"   on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Training plans: own data only
create policy "Plans: own data" on public.training_plans for all using (auth.uid() = user_id);

-- Workouts: via plan ownership
create policy "Workouts: own data" on public.workouts for all
  using (exists (
    select 1 from public.training_plans p
    where p.id = workouts.plan_id and p.user_id = auth.uid()
  ));

-- Workout logs: own data only
create policy "Logs: own data" on public.workout_logs for all using (auth.uid() = user_id);

-- Shoes: own data only
create policy "Shoes: own data" on public.shoes for all using (auth.uid() = user_id);

-- ─── HELPER VIEWS ────────────────────────────────────────────────────────────
-- Weekly stats view
create or replace view public.weekly_stats as
select
  wl.user_id,
  date_trunc('week', wl.completed_at) as week_start,
  count(*)                             as total_workouts,
  sum(wl.actual_distance)              as total_distance,
  avg(wl.fatigue)                      as avg_fatigue,
  avg(wl.actual_hr)                    as avg_hr
from public.workout_logs wl
group by wl.user_id, date_trunc('week', wl.completed_at);
