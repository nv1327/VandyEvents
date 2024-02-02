# Vandy Events

A project for CS 4279 Spring 2024

### /events

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient'; // Import your Supabase client

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        let { data: events, error } = await supabase
            .from('events')
            .select('*');
        if (error) console.log('error', error);
        else setEvents(events);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <div key={event.id} className="border p-4 rounded-lg">
                        <h2 className="text-xl font-semibold">{event.title}</h2>
                        <p>{event.description}</p>
                        {/* Add more event details here */}
                    </div>
                ))}
            </div>
        </div>
    );
}

### /events/new

import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function CreateEvent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('events')
            .insert([{ title, description }]);
        if (error) console.error(error);
        else console.log(data);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Create Event</button>
            </form>
        </div>
    );
}


### /events/[id]

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Event() {
    const router = useRouter();
    const { id } = router.query;
    const [event, setEvent] = useState(null);

    useEffect(() => {
        if (id) fetchEvent(id);
    }, [id]);

    const fetchEvent = async (id) => {
        let { data: event, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();
        if (error) console.error(error);
        else setEvent(event);
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
            <p>{event.description}</p>
            {/* Display more event details and comments here */}
        </div>
    );
}


### /profile

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const user = supabase.auth.user();
        if (user) {
            let { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error) console.error(error);
            else setProfile(profile);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            {/* Display more profile information here */}
        </div>
    );
}
