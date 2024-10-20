import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function trackEvent(userId, eventType, eventData) {
  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export async function getUserAnalytics(userId) {
  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return [];
  }
}
