'use client';

import { useState } from 'react';
import { useSupabase } from '@/app/supabase-provider';

export default function CommentPostButton({ eventId }: { eventId: number }) {
    const { supabase } = useSupabase();
    const [text, setText] = useState('');

    async function addComment(text: string, eventId: number, parentId: number | null = null) {
        const { data: user, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return { error: "User not found. Please log in." };
        }
        
        const userId = user.user.id;
        if (!userId) {
            return { error: "No user ID found. Please log in." };
        }

        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    event_id: eventId,
                    text: text,
                    user_id: userId,
                    parent_id: parentId
                },
            ])
            .select('*');
    
        if (error) {
            console.error("Error adding comment:", error);
            return { error: error.message };
        }
        return { data };
    }

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  // Prevent form submission from reloading the page
        if (!text.trim()) return;

        const result = await addComment(text, eventId);
        if (result.error) {
            alert('Error posting comment: ' + result.error);
        } else {
            setText('');  // Clear the input field if successful
            // Optionally trigger a state update to re-render the comments list
        }
    };

    return (
        <div>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
                <textarea
                    className="text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Add a comment..."
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                ></textarea>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Post Comment
                </button>
            </form>
        </div>
    );
}
