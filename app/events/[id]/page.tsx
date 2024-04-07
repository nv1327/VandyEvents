import { redirect } from 'next/navigation';
import { getSession, getSubscription } from '@/app/supabase-server';
import { addReport } from '@/app/siteActions';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';
import Link from "next/link";
import EventSignUpButton from './eventsignupbutton.client';
import EventCancelSignupButton from './eventcancelsignupbutton.client';

// Define TypeScript types for the comments
interface CommentType {
    id: number;
    text: string;
    author: string;
    replies: CommentType[];
}

// Dummy comments data
const dummyComments: CommentType[] = [
    {
        id: 1,
        text: "Who's bringing the equipment?",
        author: "User1",
        replies: [
            {
                id: 2,
                text: "I have a net and a ball.",
                author: "User2",
                replies: [
                    {
                        id: 3,
                        text: "I have the rest of the equipment.",
                        author: "User3",
                        replies: [],
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        text: "I'm gonna be a bit late so save me a seat.",
        author: "User4",
        replies: [],
    },
];

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
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id);
    if (eventError) {
        console.error("Error getting event", eventError);
    } else {
        console.log("Event retrieved:", event);
    }

    const { data: ownerData, error: ownerError } = await supabase
        .from('users')
        .select('*')
        .eq('id', event && event[0].user_id);
    if (ownerError) {
        console.error("Error getting owner", ownerError);
    } else {
        console.log("Owner retrieved:", ownerData);
    }

    var isOwner = false; // Default to false
    // Check if ownerData is not null and not empty before accessing its properties
    if (ownerData !== null && ownerData.length > 0) {
        isOwner = user?.id === (ownerData[0].id || null);
    }
    
    const { data: signedUp, error: signupError } = await supabase
        .from('event_signups')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', params.id)
        .single();
    if (ownerError) {
        console.error("Error getting event signup", signupError);
    } else {
        console.log("Signup retrieved:", signedUp);
    }

    // Recursive function to render comments and their replies
    const renderComments = (comments: CommentType[]) => {
        return comments.map((comment) => (
            <div key={comment.id} className="ml-6 mt-4">
                <div className="bg-gray-100 p-4 rounded">
                    <p className="text-sm font-semibold text-gray-700">{comment.author}</p>
                    <p className='text-gray-600'>{comment.text}</p>
                </div>
                {comment.replies.length > 0 && renderComments(comment.replies)}
            </div>
        ));
    };

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
                            <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700" href={"/events/" + (event && event[0].id)}>
                                {event && event[0].name}
                            </a>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="mt-4">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">Select a tab</label>
                    <select id="tabs" name="tabs" className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value="/events/[id]">Overview</option>
                        {isOwner ? <option value="/events/[id]/settings">Settings</option> : null}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <a className="border-indigo-500 text-indigo-600 cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href={"/events/" + (event && event[0].id)}>
                                Overview
                            </a>
                            {isOwner ?
                                <a className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href={"/events/" + (event && event[0].id) + "/settings"}>
                                    Settings
                                </a> : null
                            }
                        </nav>
                    </div>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className='flex flex-row justify-between items-center'>
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{event && event[0].name}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Hosted by {ownerData && ownerData[0].first_name + " " + ownerData[0].last_name}</p>
                        </div>
                        {!isOwner && signedUp == null && event && (
                            <EventSignUpButton eventId={event[0]?.id} />
                        )}
                        {!isOwner && signedUp != null && event && (
                            <EventCancelSignupButton eventId={event[0]?.id} />
                        )}
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{event && event[0].date}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Time</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{event && event[0].start_time} - {event && event[0].end_time}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Location</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{event && event[0].location}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{event && event[0].description}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Equipment Needed</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{event && event[0].equipment}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Number of Spots</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{event && event[0].num_spots}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Comments</h3>
                    <div className="mt-4">
                        {renderComments(dummyComments)}
                    </div>
                </div>
            </div>
        </div>
    );
}