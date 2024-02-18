"use client";

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const { supabase } = useSupabase();
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/signin");
    };

    return (
        <button onClick={handleLogout} className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="-ml-1 mr-3 h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75">
                </path>
            </svg>
            Logout
        </button>
    );
}