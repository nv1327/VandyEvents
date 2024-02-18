alter table "public"."subscriptions" alter column "available_recurring_keywords" set default '0'::bigint;

alter table "public"."subscriptions" alter column "available_recurring_keywords" set not null;


