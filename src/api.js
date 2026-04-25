import { supabase } from './supabase';

// --- AUTH & PROFILE ---
export const getMyProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  return data;
}

export const updateMyProfile = async (updates) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
  if (error) throw error;
}

// --- CHILDREN ---
export const getMyChildren = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return [];
  const { data: links, error: linkError } = await supabase.from('child_guardians').select('child_id, relationship').eq('profile_id', user.id);
  if (linkError) throw linkError;
  const childIds = links.map(l => l.child_id);
  if (!childIds.length) return [];
  const { data, error } = await supabase.from('children').select('*').in('id', childIds);
  if (error) throw error;
  // Add relationship back to child object for convenience
  return data.map(c => ({
    ...c,
    relationship: links.find(l => l.child_id === c.id)?.relationship
  }));
}

export const addChild = async (name, birth_date, gender, relationship, photo_url) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error('Not authenticated');
  
  const { data: child, error: childError } = await supabase.from('children').insert([{ name, birth_date, gender, photo_url }]).select().maybeSingle();
  if (childError) throw childError;
  
  const { error: linkError } = await supabase.from('child_guardians').insert([{ child_id: child.id, profile_id: user.id, relationship }]);
  if (linkError) throw linkError;
  return child;
}

export const updateChild = async (id, updates) => {
  const { error } = await supabase.from('children').update(updates).eq('id', id);
  if (error) throw error;
}

export const joinChild = async (childId, relationship) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('child_guardians').insert([{ child_id: childId, profile_id: user.id, relationship }]);
  if (error) throw error;
}

export const getChildGuardians = async (childId) => {
  const { data, error } = await supabase.from('child_guardians').select('*, profiles(*)').eq('child_id', childId);
  if (error) throw error;
  return data;
}

export const updateRelationship = async (childId, profileId, relationship) => {
  const { error } = await supabase.from('child_guardians').update({ relationship }).match({ child_id: childId, profile_id: profileId });
  if (error) throw error;
}

export const uploadChildPhoto = async (file) => {
  const fileName = `child-${Date.now()}.jpg`;
  const { error: uploadError } = await supabase.storage.from('urban-tribe-assets').upload(`children/${fileName}`, file);
  if (uploadError) throw uploadError;
  const { data: { publicUrl } } = supabase.storage.from('urban-tribe-assets').getPublicUrl(`children/${fileName}`);
  return publicUrl;
}

// --- PROVIDERS ---
export const getMyProvider = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'provider') return null;
  const { data: provider, error: pErr } = await supabase.from('providers').select('*').eq('owner_id', user.id).maybeSingle();
  if (pErr && pErr.code !== 'PGRST116') throw pErr;
  return provider;
}

export const createProvider = async (business_name, description) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const { data, error } = await supabase.from('providers').insert([{ owner_id: user.id, business_name, description }]).select().maybeSingle();
  if (error) throw error;
  // Update user role to provider
  await supabase.from('profiles').update({ role: 'provider' }).eq('id', user.id);
  return data;
}

export const updateProvider = async (id, updates) => {
  const { error } = await supabase.from('providers').update(updates).eq('id', id);
  if (error) throw error;
}

export const fetchAllProviders = async () => {
  const { data, error } = await supabase.from('providers').select('*');
  if (error) throw error;
  return data;
}

// --- ACTIVITIES ---
export const getActivities = async () => {
  const { data, error } = await supabase.from('activities').select('*, providers(business_name), activity_likes(user_id), comments(id)');
  if (error) throw error;
  return data;
}

export const getAllBookings = async () => {
  const { data, error } = await supabase.from('invoices').select('activity_id, event_date, child_id, adult_count, status');
  if (error) throw error;
  return data;
}

export const getProviderActivities = async (providerId) => {
  const { data, error } = await supabase.from('activities').select('*, activity_likes(user_id), comments(id)').eq('provider_id', providerId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const addActivity = async (providerId, activityData) => {
  const { data, error } = await supabase.from('activities').insert([{ ...activityData, provider_id: providerId }]).select().maybeSingle();
  if (error) throw error;
  return data;
}

export const updateActivity = async (id, updates) => {
  const { data, error } = await supabase.from('activities').update(updates).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data;
}

export const uploadActivityPhoto = async (file) => {
  const fileName = `act-${Date.now()}.jpg`;
  const { error: uploadError } = await supabase.storage.from('urban-tribe-assets').upload(`activities/${fileName}`, file);
  if (uploadError) throw uploadError;
  const { data: { publicUrl } } = supabase.storage.from('urban-tribe-assets').getPublicUrl(`activities/${fileName}`);
  return publicUrl;
}

export const toggleActivityLike = async (activityId, userId, isLiked) => {
  if (isLiked) {
    await supabase.from('activity_likes').delete().match({ activity_id: activityId, user_id: userId });
  } else {
    await supabase.from('activity_likes').insert([{ activity_id: activityId, user_id: userId }]);
  }
}

// --- NEWS ---
export const getNews = async () => {
  const { data, error } = await supabase.from('news').select('*, providers(business_name), news_likes(user_id), comments(id, content, user_id)').eq('status', 'published').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const getProviderNews = async (providerId) => {
  const { data, error } = await supabase.from('news').select('*, news_likes(user_id), comments(id, content, user_id, profiles(full_name))').eq('provider_id', providerId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const addNews = async (providerId, newsData) => {
  const { data, error } = await supabase.from('news').insert([{ ...newsData, provider_id: providerId, type: newsData.type || 'news' }]).select().maybeSingle();
  if (error) throw error;
  return data;
}

export const updateNews = async (id, newsData) => {
  const { data, error } = await supabase.from('news').update(newsData).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data;
}

export const addPoll = async (providerId, pollData) => {
  const { data, error } = await supabase.from('news').insert([{ 
    ...pollData, 
    description: pollData.description || 'Community Poll',
    provider_id: providerId, 
    type: 'poll' 
  }]).select().maybeSingle();
  if (error) throw error;
  return data;
}

export const toggleNewsLike = async (newsId, userId, isLiked) => {
  if (isLiked) {
    await supabase.from('news_likes').delete().match({ news_id: newsId, user_id: userId });
  } else {
    await supabase.from('news_likes').insert([{ news_id: newsId, user_id: userId }]);
  }
}

// --- BOOKINGS & INVOICES ---
export const enrollChild = async (enrollmentData) => {
  const { data, error } = await supabase.from('invoices').insert([enrollmentData]).select().maybeSingle();
  if (error) throw error;
  return data;
}

export const updateInvoice = async (id, updates) => {
  const { error } = await supabase.from('invoices').update(updates).eq('id', id);
  if (error) throw error;
}

export const getMyInvoices = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const { data, error } = await supabase.from('invoices').select('*, activities(*, providers(business_name)), children(name), profiles:parent_id(full_name)').eq('parent_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const getChildEnrollments = async (childId) => {
  const { data, error } = await supabase.from('invoices').select('*, activities(*)').eq('child_id', childId).order('event_date', { ascending: false });
  if (error) throw error;
  return data;
}

export const getActivityInvoices = async (activityId) => {
  const { data, error } = await supabase.from('invoices').select('*, profiles:parent_id(full_name, email), children(name, photo_url), activities(name, start_time, end_time)').eq('activity_id', activityId).order('event_date', { ascending: true });
  if (error) throw error;
  return data;
}

// --- COMMENTS ---
export const getComments = async (type, id) => {
  const column = type === 'activity' ? 'activity_id' : 'news_id';
  const { data, error } = await supabase.from('comments').select('*, profiles(full_name)').eq(column, id).eq('entity_type', type).eq('status', 'approved').order('created_at', { ascending: true });
  if (error) throw error;
  // Filter out private messages from public view
  return data.filter(c => !c.content.includes('🔒 [PRIVATE_MESSAGE]'));
}

export const getThreadComments = async (type, id, targetUserId = null, threadId = null) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const column = type === 'activity' ? 'activity_id' : 'news_id';
  
  let query = supabase.from('comments')
    .select('*, profiles(full_name)')
    .eq(column, id);

  if (threadId) {
    query = query.or(`id.eq.${threadId},parent_id.eq.${threadId}`);
  }
    
  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) throw error;
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  
  return data.filter(c => {
    const isPrivate = c.content.includes('🔒 [PRIVATE_MESSAGE]');
    if (!isPrivate && c.status === 'approved') return true;
    
    // Private message logic
    if (isPrivate) {
      const targetMatch = c.content.match(/🔒 \[FOR: (.*?)\]/);
      const targetId = targetMatch ? targetMatch[1] : null;

      // Admin sees everything
      if (profile?.role === 'admin') return true;
      
      // Others only see if sender or recipient
      const isFromMe = c.user_id === user.id;
      const isForMe = targetId === user.id;
      return isFromMe || isForMe;
    }
    return false;
  });
}

export const addComment = async (type, id, content, parentId = null, isPrivate = false, title = '', targetUserId = null) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const column = type === 'activity' ? 'activity_id' : 'news_id';
  
  let status = isPrivate ? 'approved' : 'pending';
  if (!isPrivate) {
    try {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role === 'provider' || profile?.role === 'admin') status = 'approved';
    } catch (err) {
      console.error('Error checking role for auto-approval:', err);
    }
  }

  let finalContent = isPrivate ? `🔒 [PRIVATE_MESSAGE] ${content}` : content;
  if (title && isPrivate) {
    finalContent = `🔒 [TITLE: ${title}] ${finalContent}`;
  }
  if (targetUserId && isPrivate) {
    finalContent = `🔒 [FOR: ${targetUserId}] ${finalContent}`;
  }

  const { error } = await supabase.from('comments').insert([{ 
    [column]: id, 
    user_id: user.id, 
    content: finalContent, 
    parent_id: parentId, 
    entity_type: type, 
    status 
  }]);
  if (error) throw error;
}

export const getConversations = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return [];

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  let query = supabase.from('comments').select('*, activities(id, name), news(id, title), profiles(full_name)');
  
  if (profile?.role === 'provider') {
    const { data: provider } = await supabase.from('providers').select('id').eq('owner_id', user.id).maybeSingle();
    if (provider) {
      const { data: acts } = await supabase.from('activities').select('id').eq('provider_id', provider.id);
      const { data: news } = await supabase.from('news').select('id').eq('provider_id', provider.id);
      
      const actIds = (acts || []).map(a => a.id);
      const newsIds = (news || []).map(n => n.id);
      
      let filter = `user_id.eq.${user.id}`;
      if (actIds.length > 0) filter += `,activity_id.in.(${actIds.join(',')})`;
      if (newsIds.length > 0) filter += `,news_id.in.(${newsIds.join(',')})`;
      
      query = query.or(filter);
    } else {
      query = query.or(`user_id.eq.${user.id}`);
    }
  } else if (profile?.role === 'admin') {
    // SuperAdmin sees all private messages
    query = query.filter('content', 'ilike', '%🔒 [PRIVATE_MESSAGE]%');
  } else {
    // Parents see messages they sent, or private messages intended FOR them
    query = query.or(`user_id.eq.${user.id},content.ilike.%🔒 [FOR: ${user.id}]%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  
  const groups = {};
  data.forEach(c => {
    const isPrivate = c.content.includes('🔒 [PRIVATE_MESSAGE]');
    const key = c.activity_id ? `activity_${c.activity_id}` : `news_${c.news_id}`;
    
    // Advanced grouping for private messages
    let conversationUserId = c.user_id;
    let targetId = null;
    if (isPrivate) {
      const forMatch = c.content.match(/🔒 \[FOR: (.*?)\]/);
      if (forMatch) {
        targetId = forMatch[1];
        conversationUserId = targetId;
      }
      
      // STRICT FILTERING: If not admin, only see if I'm sender or recipient
      if (profile?.role !== 'admin') {
        const isFromMe = c.user_id === user.id;
        const isForMe = targetId === user.id;
        if (!isFromMe && !isForMe) return;
      }
    }
    
    // Group by (context, user, root_message_id)
    const threadId = c.parent_id || c.id;
    const groupKey = (profile?.role === 'admin' || profile?.role === 'provider') 
      ? `${key}_${conversationUserId}_${threadId}` 
      : `${key}_${threadId}`;

    if (!groups[groupKey]) {
      // Extract custom title if exists
      let customTitle = '';
      const titleMatch = c.content.match(/🔒 \[TITLE: (.*?)\]/);
      if (titleMatch) customTitle = titleMatch[1];

      // Unread check
      const lastRead = localStorage.getItem(`last_read_${groupKey}`) || '0';
      const isUnread = c.user_id !== user.id && new Date(c.created_at) > new Date(lastRead);

      groups[groupKey] = {
        type: c.activity_id ? 'activity' : 'news',
        id: c.activity_id || c.news_id,
        title: customTitle || c.activities?.name || c.news?.title || 'Unknown',
        subtitle: isPrivate ? (profile?.role === 'admin' || profile?.role === 'provider' ? `Chat with: ${c.profiles?.full_name}` : 'Private Message') : 'Public Discussion',
        lastComment: {
          ...c,
          content: c.content.replace(/🔒 \[TITLE:.*?\] /g, '').replace(/🔒 \[FOR:.*?\] /g, '').replace('🔒 [PRIVATE_MESSAGE] ', '')
        },
        isUnread,
        userId: conversationUserId,
        threadId: threadId
      };
    }
  });
  return Object.values(groups);
}

export const getUnreadMessageCount = async () => {
  try {
    const conversations = await getConversations();
    return conversations.filter(c => c.isUnread).length;
  } catch (err) {
    console.error('Error getting unread count:', err);
    return 0;
  }
}

export const markThreadAsRead = (type, id, userId = null) => {
  const key = type === 'activity' ? `activity_${id}` : `news_${id}`;
  const groupKey = userId ? `${key}_${userId}` : key;
  localStorage.setItem(`last_read_${groupKey}`, new Date().toISOString());
}

export const getProviderComments = async (providerId) => {
  // If providerId is null and user is admin, get all comments for moderation
  let query = supabase.from('comments').select('*, profiles(full_name), activities(name), news(title)');
  
  if (providerId) {
    const { data: acts } = await supabase.from('activities').select('id').eq('provider_id', providerId);
    const { data: news } = await supabase.from('news').select('id').eq('provider_id', providerId);
    
    const actIds = (acts || []).map(a => a.id);
    const newsIds = (news || []).map(n => n.id);
    
    if (actIds.length === 0 && newsIds.length === 0) return [];

    let orFilter = [];
    if (actIds.length > 0) orFilter.push(`activity_id.in.(${actIds.join(',')})`);
    if (newsIds.length > 0) orFilter.push(`news_id.in.(${newsIds.join(',')})`);
    
    query = query.or(orFilter.join(','));
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;

  // Filter out private messages from moderation queue
  return (data || []).filter(c => !c.content.includes('🔒 [PRIVATE_MESSAGE]'));
}

export const updateCommentStatus = async (id, status) => {
  const { data, error } = await supabase.from('comments').update({ status }).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export const deleteComment = async (id) => {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) throw error;
}


export const deleteThread = async (type, id, threadId) => {
  const column = type === 'activity' ? 'activity_id' : 'news_id';
  let query = supabase.from('comments').delete().eq(column, id);
  if (threadId) {
    query = query.or(`id.eq.${threadId},parent_id.eq.${threadId}`);
  }
  const { error } = await query;
  if (error) throw error;
}

// --- ADMIN FUNCTIONS ---
export const adminGetStats = async () => {
  const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: providers } = await supabase.from('providers').select('*', { count: 'exact', head: true });
  const { count: activities } = await supabase.from('activities').select('*', { count: 'exact', head: true });
  const { count: bookings } = await supabase.from('invoices').select('*', { count: 'exact', head: true });
  
  return { users, providers, activities, bookings };
}

export const adminGetAllUsers = async () => {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const adminUpdateUserRole = async (userId, role) => {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) throw error;
}

export const adminGetAllActivities = async () => {
  const { data, error } = await supabase.from('activities').select('*, providers(business_name), activity_likes(count), comments(count)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const adminGetAllInvoices = async () => {
  const { data, error } = await supabase.from('invoices').select('*, activities(name, start_time, end_time), profiles:parent_id(full_name), children(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const adminGetAllNews = async () => {
  const { data, error } = await supabase.from('news').select('*, providers(business_name), news_likes(count), comments(count)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const adminGetAllProviders = async () => {
  const { data, error } = await supabase.from('providers').select('*').order('business_name', { ascending: true });
  if (error) throw error;
  return data;
}

export const adminCreateUser = async (profileData) => {
  const { error } = await supabase.from('profiles').insert([profileData]);
  if (error) throw error;
}

export const adminSaveActivity = async (activity) => {
  if (activity.id) {
    const { error } = await supabase.from('activities').update(activity).eq('id', activity.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('activities').insert([activity]);
    if (error) throw error;
  }
}

export const adminSaveNews = async (news) => {
  if (news.id) {
    const { error } = await supabase.from('news').update(news).eq('id', news.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('news').insert([news]);
    if (error) throw error;
  }
}

export const adminDeleteAllMessages = async () => {
  const { error } = await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}

// --- PERMISSIONS ---
export const getProviderPermissions = async (providerId) => {
  const { data, error } = await supabase.from('provider_permissions').select('*').eq('provider_id', providerId);
  if (error) throw error;
  return data;
}

export const saveProviderPermission = async (providerId, data) => {
  if (data.id) {
    const { error } = await supabase.from('provider_permissions').update(data).eq('id', data.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('provider_permissions').insert([{ ...data, provider_id: providerId }]);
    if (error) throw error;
  }
}

export const deleteProviderPermission = async (id) => {
  const { error } = await supabase.from('provider_permissions').delete().eq('id', id);
  if (error) throw error;
}

// --- FRIENDS & SOCIAL ---
export const sendFriendRequest = async (parentId) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error('Not authenticated');
  if (user.id === parentId) throw new Error('You cannot connect with yourself');
  const { error } = await supabase.from('parent_connections').insert([{ requester_id: user.id, receiver_id: parentId, status: 'pending' }]);
  if (error) throw error;
}

export const getFriendRequests = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return [];
  const { data: conns, error } = await supabase.from('parent_connections').select('*').eq('receiver_id', user.id).eq('status', 'pending');
  if (error) throw error;
  
  const requesterIds = conns.map(c => c.requester_id);
  if (!requesterIds.length) return conns;
  
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, full_name, photo_url').in('id', requesterIds);
  if (pErr) throw pErr;
  
  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));
  return conns.map(c => ({
    ...c,
    requester: profileMap[c.requester_id]
  }));
}

export const respondToFriendRequest = async (requestId, status) => {
  const { error } = await supabase.from('parent_connections').update({ status }).eq('id', requestId);
  if (error) throw error;
}

export const getFriends = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return [];
  const { data: conns, error } = await supabase.from('parent_connections').select('*').or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`).eq('status', 'active');
  if (error) throw error;
  
  const friendIds = conns.map(f => f.requester_id === user.id ? f.receiver_id : f.requester_id);
  if (!friendIds.length) return [];
  
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, full_name, photo_url').in('id', friendIds);
  if (pErr) throw pErr;
  
  return profiles;
}

export const getFriendsActivities = async () => {
  const friends = await getFriends();
  const friendIds = friends.map(f => f.id);
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('invoices').select('*, activities(*, providers(business_name)), children(id, name), profiles:parent_id(full_name)').in('parent_id', friendIds).gte('event_date', today).eq('status', 'paid').order('event_date', { ascending: true });
  if (error) throw error;
  return data;
}

export const updateSharingPreference = async (enabled) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const { error } = await supabase.from('parent_connections').update({ sharing_enabled: enabled }).or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);
  if (error) throw error;
}

export const searchProfiles = async (query) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, photo_url, metadata')
    .ilike('full_name', `%${query}%`)
    .neq('id', user?.id)
    .limit(10);
  if (error) throw error;
  
  // Filter in JS to handle null metadata and the 'discoverable' flag
  return data.filter(p => p.metadata?.discoverable !== 'no').slice(0, 5);
}

export const getAllParentFriendships = async () => {
  const { data: conns, error: err1 } = await supabase.from('parent_connections').select('*').eq('status', 'active').order('created_at', { ascending: false });
  if (err1) throw err1;
  const profileIds = [...new Set([...conns.map(c => c.requester_id), ...conns.map(c => c.receiver_id)])];
  const { data: profiles, error: err2 } = await supabase.from('profiles').select('id, full_name, photo_url').in('id', profileIds);
  if (err2) throw err2;
  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));
  return conns.map(c => ({
    ...c,
    requester: profileMap[c.requester_id],
    receiver: profileMap[c.receiver_id]
  }));
}

// --- INTEREST REGISTRATION ---
export const submitInterestRegistration = async (data) => {
  const { error } = await supabase.from('interest_submissions').insert([data]);
  if (error) throw error;
}

// --- WAITING LIST ---
export const addToWaitingList = async (data) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error('Not authenticated');
  
  // Calculate next position for waitlist
  const { count } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .eq('activity_id', data.activity_id)
    .eq('event_date', data.event_date);
  
  const position = (count || 0) + 1;
  const { error } = await supabase.from('waitlist').insert([{ 
    ...data, 
    parent_id: user.id,
    position: position,
    status: 'waiting'
  }]);
  if (error) throw error;
}

export const getMyWaitingList = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return [];
  const { data, error } = await supabase
    .from('waitlist')
    .select('*, activities(name)')
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const adminGetNewsletterSignups = async () => {
  const { data, error } = await supabase.from('interest_submissions').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export const uploadAttachment = async (file) => {
  const fileName = `attach-${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from('urban-tribe-assets').upload(`attachments/${fileName}`, file);
  if (uploadError) throw uploadError;
  const { data: { publicUrl } } = supabase.storage.from('urban-tribe-assets').getPublicUrl(`attachments/${fileName}`);
  return publicUrl;
}

// --- CAPACITY & WAITLIST ---

export const getActivityBookedCount = async (activityId, eventDate) => {
  const { count, error } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .eq('activity_id', activityId)
    .eq('event_date', eventDate)
    .eq('status', 'paid');
  if (error) throw error;
  return count || 0;
}

export const isActivityFull = async (activityId, eventDate) => {
  const { data: activity, error } = await supabase
    .from('activities')
    .select('max_children')
    .eq('id', activityId)
    .maybeSingle();
  if (error) throw error;
  if (!activity || !activity.max_children) return { full: false, booked: 0, max: null };
  const booked = await getActivityBookedCount(activityId, eventDate);
  return { full: booked >= activity.max_children, booked, max: activity.max_children };
}

export const joinWaitlist = async (activityId, childId, parentId, eventDate) => {
  // Check if already on waitlist
  const { data: existing } = await supabase
    .from('waitlist')
    .select('id')
    .eq('activity_id', activityId)
    .eq('child_id', childId)
    .eq('event_date', eventDate)
    .maybeSingle();
  if (existing) throw new Error('This child is already on the waitlist for this session.');

  // Get next position
  const { count } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .eq('activity_id', activityId)
    .eq('event_date', eventDate)
    .eq('status', 'waiting');

  const position = (count || 0) + 1;
  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ activity_id: activityId, parent_id: parentId, child_id: childId, event_date: eventDate, position, status: 'waiting' }])
    .select()
    .maybeSingle();
  if (error) throw error;
  return { ...data, position };
}

export const getWaitlist = async (activityId, eventDate = null) => {
  let query = supabase
    .from('waitlist')
    .select('*, profiles:parent_id(full_name, email), children(name)')
    .eq('activity_id', activityId)
    .order('event_date', { ascending: true })
    .order('position', { ascending: true });
  if (eventDate) query = query.eq('event_date', eventDate);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export const removeFromWaitlist = async (waitlistId) => {
  const { error } = await supabase.from('waitlist').delete().eq('id', waitlistId);
  if (error) throw error;
}

export const notifyWaitlistEntry = async (waitlistEntry, activityName) => {
  // Send private message to the parent via the Urban Tribe provider activity
  const { data: utProvider } = await supabase.from('providers').select('id').eq('business_name', 'Urban Tribe').maybeSingle();
  if (!utProvider) throw new Error('Urban Tribe provider not found.');
  const { data: acts } = await supabase.from('activities').select('id').eq('provider_id', utProvider.id).limit(1);
  if (!acts || acts.length === 0) throw new Error('No activity context found for Urban Tribe.');

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const eventFormatted = new Date(waitlistEntry.event_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const title = `A spot just opened! 🎉`;
  const content = `Great news! A spot has opened for **${activityName}** on **${eventFormatted}**. You're next on the waitlist — head to the app and book your place before it's taken!`;
  const fullContent = `🔒 [FOR: ${waitlistEntry.parent_id}] 🔒 [TITLE: ${title}] 🔒 [PRIVATE_MESSAGE] ${content}`;

  const { error } = await supabase.from('comments').insert([{
    activity_id: acts[0].id,
    user_id: user.id,
    content: fullContent,
    entity_type: 'activity',
    status: 'approved'
  }]);
  if (error) throw error;

  // Update status to notified
  await supabase.from('waitlist').update({ status: 'notified' }).eq('id', waitlistEntry.id);
}

export const getWaitlistCountForActivity = async (activityId) => {
  const { count, error } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .eq('activity_id', activityId)
    .eq('status', 'waiting');
  if (error) return 0;
  return count || 0;
}

export const getSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) throw error;
  return data || [];
};

export const updateSetting = async (key, value) => {
  const { error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date() });
  if (error) throw error;
};
