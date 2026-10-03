-- Café Rojo — PostgreSQL schema (Supabase). Run once in the Supabase SQL editor,
-- then open /admin/products and choose "Load Starter Catalog".

create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  subtitle text not null,
  type text not null,
  roast text not null,
  origin text not null default 'Colombia',
  region text,
  availability text not null default 'In Stock',
  tasting_notes text[] not null default '{}',
  profile jsonb not null default '{}',
  short text,
  description text,
  process text,
  variety text,
  altitude text,
  brew_methods text[] not null default '{}',
  bag text not null default 'burgundy',
  image text,
  rating numeric,
  review_count int not null default 0,
  seo_title text,
  seo_description text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists variants (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  size text not null,
  price_cents int not null check (price_cents >= 0),
  inventory int not null default 0
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  address jsonb,
  stripe_customer_id text,
  cart jsonb,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  name text,
  phone text,
  shipping_address jsonb,
  subtotal_cents int not null default 0,
  shipping_cents int not null default 0,
  tax_cents int not null default 0,
  discount_cents int not null default 0,
  total_cents int not null default 0,
  payment_status text not null default 'paid',
  fulfillment_status text not null default 'unfulfilled',
  carrier text,
  tracking_number text,
  stripe_session_id text unique,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);
create sequence if not exists order_number_seq start 1001;

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  variant_id text,
  name text not null,
  size text,
  quantity int not null,
  unit_cents int not null,
  total_cents int not null
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  stripe_subscription_id text unique not null,
  stripe_customer_id text,
  status text not null default 'active',
  interval_weeks int not null,
  items jsonb not null default '[]',
  amount_cents int not null default 0,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  percent_off int not null check (percent_off between 1 and 100),
  stripe_coupon_id text,
  stripe_promotion_code_id text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  email text primary key,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text, email text, message text,
  created_at timestamptz not null default now()
);

-- New auth users get a profile row.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, first_name, last_name)
  values (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create or replace function next_order_number() returns text language sql as $$
  select 'CR-' || nextval('order_number_seq')::text
$$;

create or replace function decrement_inventory(v_id text, qty int) returns void language sql as $$
  update variants set inventory = greatest(inventory - qty, 0) where id = v_id
$$;

-- Row-level security: customers see only their own rows. The storefront reads the
-- catalog and writes orders through the server (service role), which bypasses RLS.
alter table products enable row level security;
alter table variants enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscriptions enable row level security;
alter table discount_codes enable row level security;
alter table newsletter_subscribers enable row level security;
alter table contact_messages enable row level security;

create policy "catalog is public" on products for select using (active);
create policy "variants are public" on variants for select using (true);
create policy "own profile read" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "own orders" on orders for select using (auth.uid() = user_id);
create policy "own order items" on order_items for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "own subscriptions" on subscriptions for select using (auth.uid() = user_id);

-- Product image uploads from the admin dashboard.
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;
