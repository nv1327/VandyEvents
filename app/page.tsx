import { redirect } from 'next/navigation';
import { getSession, getSubscription } from '@/app/supabase-server';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';

export default async function StartPage() {

  const [session] = await Promise.all([
    getSession()
  ])

  if (!session) {
    return redirect('/signin');
  }

  const user = session?.user;

  console.log(user);

  //check for vanderbilt email using this
  function getSecondPart(str: string) {
    return str.split('@')[1];
  }

  if (user && user.email) {
    if (getSecondPart(user.email) != "vanderbilt.edu") {
      console.log("Not a Vandy email");
      return redirect('/invalidemail');
    }
  } else {
    console.log("User or user.email is undefined");
  }

  //---- vanderbilt email check function above

  const supabase = createServerActionClient<Database>({ cookies });
  const { data: user_name, error: error_name } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id);
  if (error_name) {
    console.error("Error getting users", error_name);
    // Call the function after confirming the session exists
    await createOrRetrieveCustomer({ email: session.user.email!, uuid: session.user.id });
  } else {
    console.log("Users retrieved:", user_name[0].first_name + " " + user_name[0].last_name);
    if(user_name[0]?.first_name == "" || user_name[0]?.last_name == "") {
      return redirect('/onboarding');
    }
  }

  return redirect('/events');
}