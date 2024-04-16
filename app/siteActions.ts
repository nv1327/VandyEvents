import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { getSession } from '@/app/supabase-server';


export async function addComment(formData: FormData, cookies: any, eventId: number, parentId: number | null = null) {
    const text = formData.get('text') as string;
    const userId = formData.get('userId') as string;  // Assuming the user's ID is passed in the form

    if (!text || text.trim().length === 0) {
        console.error("Error: Comment text is required.");
        return { error: "Comment text is required." };
    }

    const supabase = createServerActionClient<Database>({ cookies });

    const { data, error } = await supabase
        .from('comments')
        .insert([
            {
                event_id: eventId,
                text: text,
                user_id: userId,
                parent_id: parentId  // This can be null if it's not a reply to another comment
            },
        ])
        .select('*');

    if (error) {
        console.error("Error adding comment:", error);
        return { error: error.message };
    } else {
        console.log("Comment added successfully:", data);
        return { data };
    }
}



export async function addSite(formData: FormData, cookies: any) {
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const equipment = formData.get('equipment') as string;
    const numSpots = formData.get('numSpots') as string;

    console.log(formData);


    const session = await getSession();

    const user = session?.user;

    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase
        .from('events')
        .insert([
            {
                user_id: user?.id ?? "",
                date: date,
                name: title,
                start_time: startTime,
                end_time: endTime,
                location: location,
                description: description,
                equipment: equipment,
                num_spots: numSpots
            },
        ])
        .select('*');
    if (error) {
        console.error("Error adding event:", error);
    } else {
        console.log("Event added successfully:", data);
        return data;
    }
}

export async function updateProfile(formData: FormData, cookies: any) {
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    //const email = formData.get('email') as string;
    const grade_level = formData.get('grade_level') as string;

    console.log(formData);


    const session = await getSession();

    const user = session?.user;

    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase
        .from('users')
        .update(
            {
                first_name: first_name,
                last_name: last_name,
                grade_level: grade_level
            },
        )
        .eq('id', user?.id ?? "");
    if (error) {
        console.error("Error updating user:", error);
    } else {
        console.log("User updated successfully:", data);
        return data;
    }
}


export async function updateSite(eventId: string, formData: FormData, cookies: any) {
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const equipment = formData.get('equipment') as string;
    const numSpots = formData.get('numSpots') as string;

    console.log(formData);

    const session = await getSession();
    const user = session?.user;

    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase
        .from('events')
        .update({
            user_id: user?.id ?? "",
            date: date,
            name: title,
            start_time: startTime,
            end_time: endTime,
            location: location,
            description: description,
            equipment: equipment,
            num_spots: numSpots
        })
        .match({ id: eventId }) // This is how you specify which record to update
        .select('*');

    if (error) {
        console.error("Error updating site:", error);
    } else {
        console.log("Site updated successfully:", data);
        return data;
    }
}


export async function addReport(formData: FormData, cookies: any, site_id: string, total_tokens: number, subscription: any) {
    "use server"

    const formDataEntries = Array.from(formData.entries());
    let keywords = [];

    for (let [name, value] of formDataEntries) {
        if (name.startsWith('keywords[') && typeof value === 'string') {
            keywords.push(value);
        }
    }

    //remove any null keywords.
    // Clean the keywords array by removing any null or empty values
    keywords = keywords.filter(keyword => keyword && keyword.trim().length > 0);

    // Validate the cleaned keywords array
    if (keywords.length === 0) {
        console.error("Error: No valid keywords provided.");
        return; // Exit the function early
    }

    const report_name = formData.get('name')?.toString();

    if (!report_name || report_name.trim().length === 0) {
        console.error("Error: Report name is required.");
        return; // Exit the function early
    }

    if (keywords.length > (total_tokens || 0)) {
        console.error("Error: Exceeded allowed keyword limit.");
        console.log(total_tokens);
        return; // Exit the function early if they've exceeded their allowed limit.
    }

    //here i create a new report

    const supabase = createServerActionClient<Database>({ cookies });
    const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .insert([
            {
                site_id: site_id,
                status: "Not Generated",
                name: report_name,
                report_type: "Keyword"
            },
        ])
        .select('*');
    if (reportError) {
        console.error("Error adding report:", reportError);
    } else {
        console.log("Report added successfully:", reportData);

        // Now, we'll insert the keywords into the 'articles' table.
        const report_id = reportData[0].id;
        const articlesToInsert = keywords.map(keyword => ({
            report_id: report_id,
            status: "Not Generated",
            keyword: keyword,
            value: null,
            top_list: null,
            outline: null,
            refresh_keyword: null,
            unsplash_url: null,
            unsplash_credit: null
        }));

        const { error: articlesError } = await supabase.from('articles').insert(articlesToInsert);

        if (articlesError) {
            console.error("Error inserting articles:", articlesError);
        } else {
            console.log("Articles inserted successfully");
            try {
                await updateSubscriptionKeywords(subscription, keywords.length);
            } catch (error) {
                console.error('Error updating subscription keywords:', error);
                return;
            }

        }


        return report_id;
    }

    async function updateSubscriptionKeywords(subscription: any, requestedKeywords: number) {
        console.log('Subscription before update:', subscription);
        console.log('Requested keywords:', requestedKeywords);

        let remainingKeywords = requestedKeywords;

        if (subscription.custom_amount_keywords >= remainingKeywords) {
            subscription.custom_amount_keywords -= remainingKeywords;
            remainingKeywords = 0;
        } else {
            remainingKeywords -= subscription.custom_amount_keywords;
            subscription.custom_amount_keywords = 0;
        }

        if (remainingKeywords > 0 && subscription.available_one_time_keywords >= remainingKeywords) {
            subscription.available_one_time_keywords -= remainingKeywords;
            remainingKeywords = 0;
        } else if (remainingKeywords > 0) {
            remainingKeywords -= subscription.available_one_time_keywords;
            subscription.available_one_time_keywords = 0;
        }

        if (remainingKeywords > 0 && subscription.available_recurring_keywords >= remainingKeywords) {
            subscription.available_recurring_keywords -= remainingKeywords;
            remainingKeywords = 0;
        } else if (remainingKeywords > 0) {
            remainingKeywords -= subscription.available_recurring_keywords;
            subscription.available_recurring_keywords = 0;
        }

        if (remainingKeywords > 0) {
            throw new Error('Not enough keywords available in the subscription');
        }

        // Update the subscription in the database
        const { error } = await supabase
            .from('subscriptions')
            .update({
                custom_amount_keywords: subscription.custom_amount_keywords,
                available_one_time_keywords: subscription.available_one_time_keywords,
                available_recurring_keywords: subscription.available_recurring_keywords
            })
            .eq('id', subscription.id);

        if (error) {
            console.error('Error updating subscription:', error);
            throw error;
        }
        console.log('Subscription after update:', subscription);
        console.log('Update query result:', error);
    }

}