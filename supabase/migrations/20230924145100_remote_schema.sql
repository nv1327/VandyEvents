create table "public"."reports" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "status" text,
    "name" text,
    "report_type" text,
    "site_id" uuid not null,
    "contents" jsonb[]
);


alter table "public"."reports" enable row level security;

CREATE UNIQUE INDEX reports_pkey ON public.reports USING btree (id);

alter table "public"."reports" add constraint "reports_pkey" PRIMARY KEY using index "reports_pkey";

alter table "public"."reports" add constraint "reports_site_id_fkey" FOREIGN KEY (site_id) REFERENCES user_sites(id) not valid;

alter table "public"."reports" validate constraint "reports_site_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."reports"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."reports"
as permissive
for select
to authenticated
using (true);



