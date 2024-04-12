// EventCancelSignupButton.client.tsx
'use client';

import { useState } from 'react';
import { useSupabase } from '@/app/supabase-provider';

export default function EventCancelSignupButton({ eventId }: { eventId: number }) {
    const { supabase } = useSupabase();
    const [isLoading, setIsLoading] = useState(false);

    const handleEventSignOff = async () => {
        setIsLoading(true); // Start loading

        if (!eventId) {
            console.error("Event ID is missing");
            setIsLoading(false);
            return;
        }

        // Await the resolution of getUser() to ensure a user is logged in
        const response = await supabase.auth.getUser();
        const user = response.data.user;

        if (!user) {
            console.error("No user is logged in.");
            setIsLoading(false);
            return;
        }

        // Delete the user's signup from the event_signups table
        const { error: deleteError } = await supabase
            .from('event_signups')
            .delete()
            .match({ user_id: user.id, event_id: eventId });

        if (deleteError) {
            console.error("Error removing event signup:", deleteError.message);
            setIsLoading(false);
            return;
        }

        // Optionally, increment the available spots for the event
        const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('num_spots')
            .eq('id', eventId)
            .single();

        if (eventError || !eventData || eventData.num_spots === null) {
            console.error("Error fetching event details or num_spots is null.");
            setIsLoading(false);
            return;
        }

        const newNumSpots = parseInt(eventData.num_spots) + 1;

        const { error: updateError } = await supabase
            .from('events')
            .update({ num_spots: newNumSpots.toString() })
            .eq('id', eventId);

        if (updateError) {
            console.error("Error updating event spots:", updateError.message);
        } else {
            console.log(`Successfully updated spots for event ${eventId}. New spots: ${newNumSpots}`);
        }

        setIsLoading(false); // End loading
    };

    return (
        <div>
            <button
                onClick={handleEventSignOff}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 mr-8 rounded">
                {isLoading ? 'Cancelling...' : 'Cancel Signup'}
            </button>
        </div>
    );
}
