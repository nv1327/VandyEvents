import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { getSession } from '@/app/supabase-server';


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
        console.error("Error adding site:", error);
    } else {
        console.log("Site added successfully:", data);
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