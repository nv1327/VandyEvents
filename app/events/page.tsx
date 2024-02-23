import Link from 'next/link'

import { redirect } from 'next/navigation';
import { getSession, getSubscription } from '@/app/supabase-server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';

export default async function EventsMainPage() {

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
    const { data, error } = await supabase
        .from('events')
        .select('*');
    if (error) {
        console.error("Error getting sites", error);
    } else {
        console.log("Events retrieved:", data);
    }

    const { data: user_name, error: error_name } = await supabase
        .from('users')
        .select('*');
    if (error_name) {
        console.error("Error getting users", error_name);
    } else {
        console.log("Users retrieved:", user_name);
    }

    // Map user IDs to user names for easier lookup
    const userIdToName: { [key: string]: string } = (user_name || []).reduce<{ [key: string]: string }>((acc, user) => {
        acc[user.id] = user.first_name + " " + user.last_name; // Assuming 'id' and 'name' are the fields in your users table
        return acc;
    }, {});

    // Add user names to events data
    const eventsWithUserNames = data?.map(event => ({
        ...event,
        userName: event.user_id != null ? userIdToName[event.user_id] : 'Unknown User'
    }));

    return (
        <div>
            <nav className="flex" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-4">
                    <li>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400">
                                <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd">
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
                            <p className="ml-4 text-sm font-medium text-gray-500">Events</p>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="mx-auto max-w-7xl mt-4 space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
                <p className="text-md font-normal text-gray-600">See all events on campus available here.</p>
                <div className="flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 bg-white md:rounded-lg">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[25%]">Name</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Organizer</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Event Date</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" href="/events/new">Create new</a>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 overflow-y-auto">
                                        {eventsWithUserNames && eventsWithUserNames.map(event => (
                                            <tr key={event.id} className="group hover:bg-gray-100">
                                                <td className="text-ellipsis overflow-hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <a className="inline-block w-full">{event.name}</a>
                                                </td>
                                                <td className="text-ellipsis overflow-hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <a className="inline-block w-full">{event.userName}</a>
                                                </td>
                                                <td className="text-ellipsis overflow-hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <a className="inline-block w-full">{event.location}</a>
                                                </td>
                                                <td className="text-ellipsis overflow-hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <a className="inline-block w-full">{event.date}</a> {/* format this */}
                                                </td>
                                                <td className="whitespace-nowrap px-3 text-sm text-gray-500">
                                                    <Link href={`/event/${event.id}`} className="inline-block w-full hidden group-hover:flex justify-start items-center font-semibold">
                                                        View
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" aria-hidden="true" className="ml-2 h-4 w-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                                                        </svg>

                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tbody className="divide-y divide-gray-200 overflow-y-auto hidden"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
