create table "public"."user_sites" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "site_name" text not null,
    "site_url" text not null,
    "cms" jsonb
);


alter table "public"."user_sites" enable row level security;

CREATE UNIQUE INDEX user_sites_pkey ON public.user_sites USING btree (id);

alter table "public"."user_sites" add constraint "user_sites_pkey" PRIMARY KEY using index "user_sites_pkey";

alter table "public"."user_sites" add constraint "user_sites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_sites" validate constraint "user_sites_user_id_fkey";


