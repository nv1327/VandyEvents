import { redirect } from 'next/navigation';
import { getSession, getSubscription } from '@/app/supabase-server';
import { addReport } from '@/app/siteActions';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';
import Link from "next/link";

import { updateSite } from '@/app/siteActions';

// Define TypeScript types for the comments
interface CommentType {
    id: number;
    text: string;
    author: string;
    replies: CommentType[];
}

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

    const handleUpdateSite = async (formData: FormData) => {
        "use server"

        const data = await updateSite(event_id, formData, cookies);
        if (data) {
            redirect("/events/" + data[0].id);
        }
    }
 

    if (ownerData?.[0]?.id == user.id){
    return (
        <div className="font-black">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Event</h1>
        </div>
        <form action={handleUpdateSite}>
            <div className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mt-4">Title</label>
                    <input type="text" name="title" id="title" placeholder={event?.[0]?.name || 'title'} className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" value={event?.[0]?.date || 'date'} className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input type="time" name="startTime" id="startTime" value={event?.[0]?.start_time || 'start time'}  className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input type="time" name="endTime" id="endTime" value={event?.[0]?.end_time || 'end time'} className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" name="location" id="location" placeholder={event?.[0]?.location || 'Location'}  className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows={4} placeholder={event?.[0]?.description || 'Description'}  className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Spots</label>
                    <input type="number" name="numSpots" id="numSpots" placeholder={event?.[0]?.num_spots || 'Number of Spots'} className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Equipment</label>
                    <input type="text" name="equipment" id="equipment" placeholder={event?.[0]?.equipment || 'Equipment'} className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <button type="submit" className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 hover:bg-indigo-700 focus:ring-indigo-500 w-full sm:max-w-md rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Update Event</button>
            </div>
        </form>
    </div>
    )
    } else {
        return (
            <div className="font-black">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Not the Owner of This Event</h1>
        </div>
        </div>
        )
    }
}