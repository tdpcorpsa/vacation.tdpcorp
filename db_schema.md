```sql
-- Schema: public

CREATE TABLE public.api_keys (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    key_hash text NOT NULL,
    plain_key text,
    created_at timestamptz,
    expires_at timestamptz,
    last_used_at timestamptz,
    revoked_at timestamptz
);

CREATE TABLE public.apps (
    id uuid NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    url text,
    subdomain text,
    perms jsonb,
    created_by uuid,
    updated_by uuid,
    created_at timestamptz,
    update_at timestamptz
);

CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY,
    email text,
    first_name text,
    last_name text,
    birth_date date,
    phone text,
    address text,
    avatar_url text,
    is_superuser boolean DEFAULT false,
    created_at timestamptz,
    updated_at timestamptz
);

CREATE TABLE public.role_app_perms (
    id uuid NOT NULL PRIMARY KEY,
    role_id uuid NOT NULL REFERENCES public.roles(id),
    app_id uuid NOT NULL REFERENCES public.apps(id),
    perms jsonb NOT NULL,
    created_at timestamptz,
    updated_at timestamptz
);

CREATE TABLE public.roles (
    id uuid NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_by uuid,
    updated_by uuid,
    created_at timestamptz,
    updated_at timestamptz
);

CREATE TABLE public.user_roles (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id), -- Also references users_view
    role_id uuid NOT NULL REFERENCES public.roles(id),
    created_at timestamptz
);

-- View: users_view
-- CREATE VIEW public.users_view AS SELECT ...;

-- Schema: vacation

CREATE TYPE vacation.request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE vacation.labor_regime (
    id uuid NOT NULL PRIMARY KEY,
    name text NOT NULL,
    is_active boolean NOT NULL,
    policies jsonb,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE TABLE vacation.employees (
    id uuid NOT NULL PRIMARY KEY,
    labor_regime_id uuid NOT NULL REFERENCES vacation.labor_regime(id),
    manager_id uuid REFERENCES vacation.employees(id),
    hire_date date,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE TABLE vacation.vacation_periods (
    id uuid NOT NULL PRIMARY KEY,
    employee_id uuid NOT NULL REFERENCES vacation.employees(id),
    period_label text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days integer NOT NULL,
    available_days integer NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz
);

CREATE TABLE vacation.vacation_requests (
    id uuid NOT NULL PRIMARY KEY,
    employee_id uuid NOT NULL REFERENCES vacation.employees(id),
    vacation_period_id uuid NOT NULL REFERENCES vacation.vacation_periods(id),
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days integer NOT NULL,
    status vacation.request_status NOT NULL,
    request_note text,
    response_note text,
    decided_by uuid,
    decided_at timestamptz,
    created_by uuid NOT NULL,
    submitted_at timestamptz,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);
```
