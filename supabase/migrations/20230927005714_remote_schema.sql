alter table "public"."subscriptions" add column "available_one_time_keywords" bigint not null default '0'::bigint;

alter table "public"."subscriptions" add column "available_recurring_keywords" bigint not null default '0'::bigint;

alter table "public"."subscriptions" add column "custom_amount_keywords" bigint not null default '0'::bigint;

alter table "public"."users" drop column "full_name";

alter table "public"."users" add column "first_name" text;

alter table "public"."users" add column "last_name" text;


