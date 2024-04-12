// EventSignUpButton.client.tsx
'use client';

import { useState } from 'react';
import { useSupabase } from '@/app/supabase-provider';

export default function EventSignUpButton({ eventId }: { eventId: number }) {
    const { supabase } = useSupabase();
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEventSignUp = async () => {
        setIsLoading(true);

        if (!eventId) {
            console.error("Event ID is missing");
            return;
        }

        // Await the resolution of getUser()
        const response = await supabase.auth.getUser();
        const user = response.data.user;

        if (!user) {
            console.error("No user is logged in.");
            return;
        }

        // Check if the event has available spots
        const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('num_spots')
            .eq('id', eventId)
            .single();

        if (eventError || !eventData) {
            console.error("Error fetching event details:", eventError?.message);
            return { error: eventError };
        }

        if (eventData.num_spots === null) {
            console.error("Event num_spots is null, which is unexpected.");
            return { error: { message: "Invalid event state: num_spots is null" } };
        }

        if (parseInt(eventData.num_spots) <= 0) {
            console.error("No spots available for this event.");
            return { error: { message: "No spots available" } };
        }

        // Check if the user has already signed up for the event
        const { data: signupData, error: signupError } = await supabase
            .from('event_signups')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', user.id);

        if (signupError) {
            console.error("Error checking existing signup:", signupError.message);
            return { error: signupError };
        }

        if (signupData.length > 0) {
            console.error("User has already signed up for this event.");
            return { error: { message: "Already signed up" } };
        }

        // Proceed with the event signup
        const { data: newSignup, error: newSignupError } = await supabase
            .from('event_signups')
            .insert([{ user_id: user.id, event_id: eventId }]);

        if (newSignupError) {
            console.error("Error signing up for event:", newSignupError.message);
            return { error: newSignupError };
        }

        // Decrement the available spots
        const newNumSpots = parseInt(eventData.num_spots) - 1;
        const { error: updateError, count } = await supabase
            .from('events')
            .update({ num_spots: newNumSpots.toString() })
            .eq('id', eventId);

        if (updateError) {
            console.error("Error updating event spots:", updateError.message);
        } else if (count === 0) {
            console.error("No rows updated. Check RLS policies or query conditions.");
        } else {
            console.log(`Successfully updated spots for event ${eventId}. New spots: ${newNumSpots}`);
        }

        setIsLoading(false);

        return { data: newSignup, error: null };
    };

    return (
        <button
            onClick={handleEventSignUp}
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 mr-8 rounded">
            {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
    );
}
