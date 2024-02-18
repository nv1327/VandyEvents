alter table "public"."subscriptions" alter column "available_recurring_keywords" drop default;

alter table "public"."subscriptions" alter column "available_recurring_keywords" drop not null;


