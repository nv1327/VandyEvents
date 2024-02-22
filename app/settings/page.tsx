import LogoutButton from "@/components/ui/Dashboard/Settings/logout.component";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

import { redirect } from 'next/navigation';
import { getSession } from '@/app/supabase-server';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';


export default async function SettingsPage() {

    const [session] = await Promise.all([
        getSession()
    ]);

    if (!session) {
        return redirect('/signin');
    }

    const user = session?.user;

    console.log(user);

    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id);
    if (error) {
        console.error("Error getting sites", error);
    } else {
        console.log("Events retrieved:", data);
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                    {/*
                    <form>
                        <h2 className="mt-6 text-lg font-medium leading-6 text-gray-900">Account</h2>
                        <div className="mt-6 col-span-12">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <input type="text" name="name" id="name" className="block w-full rounded-md pr-10 focus:outline-none sm:text-sm border-gray-300 text-gray-900 placeholder-gray-300 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none" placeholder="Drafthorse AI" aria-invalid="false" aria-describedby="name-error" value="j" data-twofas-input-listener="true" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 hover:bg-indigo-700 focus:ring-indigo-500">Update</button>
                        </div>
                    </form>
                    <div className="w-full border-t border-gray-300 mt-6"></div>
    */}
                    <form>
                        <h2 className="mt-6 text-lg font-medium leading-6 text-gray-900">Profile</h2>
                        <div className="mt-6 grid grid-cols-12 gap-6">
                            <div className="col-span-12 sm:col-span-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First name</label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input type="text" name="first_name" id="first_name" placeholder={data?.[0]?.first_name || 'John'} className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" data-twofas-input-listener="true" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last name</label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input type="text" name="last_name" id="last_name" placeholder={data?.[0]?.last_name || 'Smith'} className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" data-twofas-input-listener="true" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input type="email" name="email" id="email" placeholder={data?.[0]?.email || 'nick@google.com'} className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" data-twofas-input-listener="true" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                                    <div className="relative mt-2 rounded-md shadow-sm border border-black pl-2 block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <select name="grade_level" id="grade_level" className="w-full" value={data?.[0]?.grade_level || 'Select Grade Level'}>
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