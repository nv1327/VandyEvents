'use client';

import Button from '@/components/ui/Button';
import { postData } from '@/utils/helpers';

import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Props {
  session: Session;
}

export default function ManageSubscriptionButton({ session }: Props) {
  const router = useRouter();
  const redirectToCustomerPortal = async () => {
    try {
      const { url } = await postData({
        url: '/api/create-portal-link'
      });
      router.push(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <button
        className='group relative flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 w-full hover:bg-green-700 focus:ring-green-500 mt-4'
        disabled={!session}
        onClick={redirectToCustomerPortal}
      >
        Manage Plan
      </button>
    </div>
  );
}
