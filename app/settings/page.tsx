import LogoutButton from "@/components/ui/Dashboard/Settings/logout.component";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

import { redirect } from 'next/navigation';
import { getSession } from '@/app/supabase-server';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';

import { updateProfile } from '@/app/siteActions';

export default async function SettingsPage() {

    const [session] = await Promise.all([
        getSession()
    ]);

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
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id);
    if (error) {
        console.error("Error getting user", error);
    } else {
        console.log("User retrieved:", data);
    }

    const handleUpdateProfile = async (formData: FormData) => {
        "use server"

        const data = await updateProfile(formData, cookies);
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                    <form action={handleUpdateProfile}>
                        <h2 className="mt-6 text-lg font-medium leading-6 text-gray-900">Profile</h2>
                        <div className="mt-6 grid grid-cols-12 gap-6">
                            <div className="col-span-12 sm:col-span-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First name</label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input type="text" name="first_name" id="first_name" placeholder={data?.[0]?.first_name || 'John'} className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" data-twofas-input-listener="true" required/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last name</label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input type="text" name="last_name" id="last_name" placeholder={data?.[0]?.last_name || 'Smith'} className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" data-twofas-input-listener="true" required/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input type="email" name="email" id="email" placeholder={data?.[0]?.email || 'nick@google.com'} className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" data-twofas-input-listener="true" readOnly disabled/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Grade Level: {data?.[0]?.grade_level}</label>
                                    <div className="relative mt-2 rounded-md shadow-sm border border-black pl-2 block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <select name="grade_level" id="grade_level" className="w-full" placeholder={data?.[0]?.grade_level || ''}>
                                            <option selected disabled>Select Grade Level</option>
                                            <option value="Freshman">Freshman</option>
                                            <option value="Sophomore">Sophomore</option>
                                            <option value="Junior">Junior</option>
                                            <option value="Senior">Senior</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 hover:bg-indigo-700 focus:ring-indigo-500">Update</button>
                        </div>
                    </form>
                    <div className="w-full border-t border-gray-300 mt-6">
                    </div>
                    <div className="w-full flex mt-6">
                        <LogoutButton/>
                    </div>
                </div>
            </div>
        </div>
    );
}