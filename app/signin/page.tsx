import { getSession } from '@/app/supabase-server';
import AuthUI from './AuthUI';

import { redirect } from 'next/navigation';

export default async function SignIn() {

  const session = await getSession();

  if (session) {
    return redirect('/sites');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <div className="flex items-center px-4">
            <img className="h-11 rounded-xl" src="/logo.jpg" alt="TypeMule AI" />
            <p className="ml-4 text-black text-center w-full text-2xl font-normal">TypeMule AI</p>
          </div>
        </div>
        <AuthUI />
        <p className='text-white text-center font-bold bg-gray-800 rounded-lg p-2'>On initial signup, a confirmation email will be sent to your email address.</p>
      </div>
    </div>
  );
}
