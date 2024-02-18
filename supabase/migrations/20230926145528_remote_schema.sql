create table "public"."articles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "status" text not null,
    "keyword" text,
    "value" text,
    "report_id" uuid not null,
    "top_list" text,
    "outline" text,
    "refresh_keyword" text,
    "unsplash_url" text,
    "unsplash_credit" text
);


alter table "public"."articles" enable row level security;

CREATE UNIQUE INDEX articles_pkey ON public.articles USING btree (id);

alter table "public"."articles" add constraint "articles_pkey" PRIMARY KEY using index "articles_pkey";

alter table "public"."articles" add constraint "articles_report_id_fkey" FOREIGN KEY (report_id) REFERENCES reports(id) not valid;

alter table "public"."articles" validate constraint "articles_report_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."articles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."articles"
as permissive
for select
to authenticated
using (true);



