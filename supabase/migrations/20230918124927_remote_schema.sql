alter table "public"."user_sites" drop constraint "user_sites_site_url_key";

alter table "public"."user_sites" drop constraint "user_sites_user_id_fkey";

alter table "public"."user_sites" drop constraint "user_sites_pkey";

drop index if exists "public"."user_sites_pkey";

drop index if exists "public"."user_sites_site_url_key";

drop table "public"."user_sites";


