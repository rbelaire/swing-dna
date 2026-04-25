-- Create profiles table to track user roles (admin, student, coach)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
-- Users can read their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can read all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Users can update their own profile (except is_admin)
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and is_admin = false);

-- Admins can insert profiles (for creating admin users)
create policy "Admins can insert profiles"
  on profiles for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create a trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, false);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
