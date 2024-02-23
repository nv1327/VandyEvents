import { redirect } from 'next/navigation';
import { getSession, getSubscription } from '@/app/supabase-server';
import { addReport } from '@/app/siteActions';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';
import Link from "next/link";

export default async function EventsIndividualPage({ params }: { params: { id: string } }) {

    const [session, subscription] = await Promise.all([
        getSession(),
        getSubscription()
    ])

    if (!session) {
        return redirect('/signin');
    }

    const user = session?.user;
    const event_id = params.id;

    const supabase = createServerActionClient<Database>({ cookies });
    const { data: siteData, error: siteError } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id);
    if (siteError) {
        console.error("Error getting event", siteError);
    } else {
        console.log("Event retrieved:", siteData);
    }

    return (
        <div>
            <nav className="flex" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-4">
                    <li>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400"><path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd">
                            </path>
                            </svg>
                            <span className="sr-only">Home</span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="h-5 w-5 flex-shrink-0 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z">
                                </path>
                            </svg>
                            <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 " href="/events">
                                Events
                            </a>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="h-5 w-5 flex-shrink-0 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z">
                                </path>
                            </svg>
                            <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700" href={"/events/" + (siteData && siteData[0].id)}>
                                {siteData && siteData[0].name}
                            </a>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="mt-4">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">Select a tab</label>
                    <select id="tabs" name="tabs" className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value="/events/[id]">Article Reports</option>
                        <option value="/events/[id]/settings">Settings</option>
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <a className="border-indigo-500 text-indigo-600 cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href={"/events/" + (siteData && siteData[0].id)}>
                                Article Reports
                            </a>
                            <a className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href={"/events/" + (siteData && siteData[0].id) + "/settings"}>
                                Settings
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}