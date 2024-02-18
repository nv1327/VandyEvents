drop policy "Enable read access for all users" on "public"."user_sites";

drop policy "Enable insert for users based on user_id" on "public"."user_sites";

create policy "Enable read access for the specific user"
on "public"."user_sites"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Enable insert for users based on user_id"
on "public"."user_sites"
as permissive
for insert
to public
with check ((auth.uid() = user_id));



