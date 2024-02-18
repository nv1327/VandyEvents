set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_subscription_periods()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE 
    sub public.subscriptions%rowtype;
BEGIN
    FOR sub IN
        SELECT s.*
        FROM public.subscriptions s
        JOIN public.prices p ON s.price_id = p.id
        JOIN public.products pr ON p.product_id = pr.id
        WHERE s.current_period_end <= now() AND (pr.name = 'Hobby' OR pr.name = 'Growth' or pr.name = 'Professional')
    LOOP
        UPDATE public.subscriptions
        SET current_period_start = CASE WHEN pr.name = 'Hobby' THEN sub.current_period_end ELSE current_period_start END,
            current_period_end = CASE WHEN pr.name = 'Hobby' THEN sub.current_period_end + interval '1 month' ELSE current_period_end END,
            available_one_time_keywords = CASE 
                                          WHEN pr.name = 'Hobby' THEN 2
                                          WHEN pr.name = 'Growth' THEN 50
                                          WHEN pr.name = 'Professional' THEN 200
                                          END
        WHERE id = sub.id;
    END LOOP;
END;
$function$
;


