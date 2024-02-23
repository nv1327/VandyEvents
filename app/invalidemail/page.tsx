import LogoutButton from "@/components/ui/Dashboard/Settings/logout.component";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

import { redirect } from 'next/navigation';
import { getSession } from '@/app/supabase-server';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';


export default async function InvalidEmailPage() {

    const [session] = await Promise.all([
        getSession()
    ]);

    if (!session) {
        return redirect('/signin');
    }

    const user = session?.user;

    console.log(user);

    return (
        <div className="flex flex-col justify-center text-center align-middle">
            <h1 className="text-2xl font-semibold text-gray-900">Your email is not a Vanderbilt email.</h1>
            <h2 className="text-xl font-semibold text-gray-900">Please log out and register with a Vanderbilt-approved email.</h2>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                    <div className="w-full flex mt-6">
                        <LogoutButton/>
                    </div>
                </div>
            </div>
        </div>
    );
}