import { redirect } from 'next/navigation';
import { getSession, getSubscription } from '@/app/supabase-server';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';

export default async function StartPage() {

  const [session] = await Promise.all([
    getSession()
  ])

  if(!session) {
    return redirect('/signin');
  }

  // Call the function after confirming the session exists
  await createOrRetrieveCustomer({ email: session.user.email!, uuid: session.user.id });

  return redirect('/events');
}