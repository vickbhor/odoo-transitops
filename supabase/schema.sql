create extension if not exists pgcrypto;

create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  role text check (role in ('Fleet Manager','Driver','Safety Officer','Financial Analyst')) not null,
  created_at timestamp default now()
);

create table vehicles (
  id uuid default gen_random_uuid() primary key,
  registration_number text unique not null,
  name_model text,
  type text,
  max_load_capacity numeric,
  odometer numeric default 0,
  acquisition_cost numeric,
  region text,
  status text check (status in ('Available','On Trip','In Shop','Retired')) default 'Available',
  created_at timestamp default now()
);

create table drivers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  license_number text unique not null,
  license_category text,
  license_expiry_date date,
  contact_number text,
  safety_score numeric default 100,
  status text check (status in ('Available','On Trip','Off Duty','Suspended')) default 'Available',
  created_at timestamp default now()
);

create table trips (
  id uuid default gen_random_uuid() primary key,
  source text,
  destination text,
  vehicle_id uuid references vehicles(id),
  driver_id uuid references drivers(id),
  cargo_weight numeric,
  planned_distance numeric,
  actual_distance numeric,
  fuel_consumed numeric,
  status text check (status in ('Draft','Dispatched','Completed','Cancelled')) default 'Draft',
  created_at timestamp default now(),
  dispatched_at timestamp,
  completed_at timestamp
);

create table maintenance_logs (
  id uuid default gen_random_uuid() primary key,
  vehicle_id uuid references vehicles(id),
  description text,
  cost numeric,
  status text check (status in ('Active','Closed')) default 'Active',
  created_at timestamp default now(),
  closed_at timestamp
);

create table fuel_logs (
  id uuid default gen_random_uuid() primary key,
  vehicle_id uuid references vehicles(id),
  liters numeric,
  cost numeric,
  log_date date default current_date
);

create table expenses (
  id uuid default gen_random_uuid() primary key,
  vehicle_id uuid references vehicles(id),
  type text,
  amount numeric,
  expense_date date default current_date,
  description text
);