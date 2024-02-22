import { redirect } from 'next/navigation';
import { getSession, getSubscription } from '@/app/supabase-server';
import { cookies } from 'next/headers';

import { addSite } from '@/app/siteActions';

export default async function NewPage() {

    const [session] = await Promise.all([
        getSession()
    ])

    if (!session) {
        return redirect('/signin');
    }

    const user = session?.user;

    if (!user) return;

    const handleAddSite = async (formData: FormData) => {
        "use server"

        const data = await addSite(formData, cookies);
        if (data) {
            redirect("/events/" + data[0].id);
        }
    }

    return (
        <div className="font-black">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Create Event</h1>
        </div>
        <form action={handleAddSite}>
            <div className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mt-4">Title</label>
                    <input type="text" name="title" id="title" placeholder="Event Title" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input type="time" name="startTime" id="startTime" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input type="time" name="endTime" id="endTime" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" name="location" id="location" placeholder="Event Location" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows={4} placeholder="Event Description" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Spots</label>
                    <input type="number" name="numSpots" id="numSpots" placeholder="Number of Spots" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Equipment</label>
                    <input type="text" name="equipment" id="equipment" placeholder="Required Equipment" className="font-normal pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <button type="submit" className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 hover:bg-indigo-700 focus:ring-indigo-500 w-full sm:max-w-md rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Event</button>
            </div>
        </form>
    </div>
    )
}