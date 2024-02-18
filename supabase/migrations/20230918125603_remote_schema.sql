create policy "Enable insert for users based on user_id"
on "public"."user_sites"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."user_sites"
as permissive
for select
to public
using (true);



