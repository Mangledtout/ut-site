import { supabase } from './supabase'
import logo from './assets/logo.png'
import { 
  adminGetStats, adminGetAllUsers, adminUpdateUserRole, adminGetAllActivities, adminGetAllInvoices, adminGetAllNews, 
  adminGetAllProviders, getProviderPermissions, saveProviderPermission, deleteProviderPermission, 
  updateCommentStatus, deleteComment, adminGetNewsletterSignups, getSettings, updateSetting, getMyProfile,
  fetchAllProviders, updateProvider, getWaitlistCountForActivity, getProviderActivities, uploadAttachment,
  addComment, getAllParentFriendships, adminCreateUser, adminSaveActivity, adminSaveNews, getUnreadMessageCount,
  getProviderComments, getMyProvider
} from './api'

// --- SHARED UI HELPERS (Temporarily here, will move to shared.js) ---
function renderBookingCardHtml(g) {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-radius: 16px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🎟️</div>
        <div>
          <p style="font-size: 0.9rem; font-weight: 800; margin: 0; color: #1e293b;">${g.name}</p>
          <p style="font-size: 0.75rem; color: #94a3b8; margin: 2px 0 0 0;">${g.parent} • ${g.date}</p>
        </div>
      </div>
      <span style="font-size: 0.7rem; font-weight: 800; color: #10b981; background: #f0fdf4; padding: 4px 8px; border-radius: 8px;">£${g.amount}</span>
    </div>
  `;
}

// --- ADMIN DASHBOARD RENDERER ---
export async function renderAdminDashboard() {
  const profile = await getMyProfile().catch(() => ({ role: 'admin' }));
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="admin-layout" style="display: flex; min-height: 100vh; background: #f8fafc; font-family: 'Outfit', sans-serif;">
      <!-- Sidebar (Desktop) -->
      <aside class="admin-sidebar" style="width: 280px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; z-index: 100;">
        <div style="padding: 2.5rem 2rem 1.5rem 2rem; border-bottom: 1px solid #f1f5f9;">
          <img src="${logo}" alt="Urban Tribe" style="height: 35px; margin-bottom: 0.75rem; display: block;">
          <span style="font-weight: 900; font-size: 1.4rem; color: #1e293b; letter-spacing: -0.5px; display: block; line-height: 1;">Console</span>
        </div>
        
        <nav style="flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 6px; overflow-y: auto;">
          <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 1rem 0 0.75rem 0.75rem;">Main Menu</p>
          <button class="tab-btn active" data-tab="dashboard" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>
            Overview
          </button>
          <button class="tab-btn" data-tab="users" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-3.833-6.248 3 3 0 0 0-4.885-3.133 3 3 0 0 0-4.885 3.133 4.125 4.125 0 0 0-3.833 6.248 9.337 9.337 0 0 0 4.121.952 9.38 9.38 0 0 0 2.625-.372" /></svg>
            Users
          </button>
          <button class="tab-btn" data-tab="providers" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21" /></svg>
            Providers
          </button>
          <button class="tab-btn" data-tab="activities" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" /></svg>
            Activities
          </button>
          <button class="tab-btn" data-tab="news" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5" /></svg>
            News & Polls
          </button>
          <button class="tab-btn" data-tab="friends" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21" /></svg>
            Friends
          </button>
          <button class="tab-btn" data-tab="invoices" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5" /></svg>
            Bookings
          </button>
          <button class="tab-btn" data-tab="newsletter" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75" /></svg>
            Interest List
          </button>
          <button class="tab-btn" data-tab="permissions" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
            Permissions
          </button>
          <button class="tab-btn" data-tab="google" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            Google Analytics
          </button>
          
          <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 2rem 0 0.75rem 0.75rem;">System</p>
          <button id="side-nav-logout" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px; color: #ef4444; background: none; border: none; cursor: pointer; font-weight: 700;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
            Exit Console
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main id="admin-main-content" style="flex: 1; padding: 2.5rem; overflow-y: auto; height: 100vh; position: relative;">
        <!-- Header -->
        <header style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
          <div>
            <h1 style="margin: 0; font-size: 1.85rem; font-weight: 900; color: #1e293b; letter-spacing: -1px;">Platform Overview</h1>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 0.9rem; font-weight: 600;">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button onclick="window.loadAdminSummary()" class="btn btn-secondary" style="width: auto; padding: 10px 16px; display: flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
              Refresh
            </button>
          </div>
        </header>

        <div class="admin-stats-grid" id="admin-stats-container" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div class="stat-card card" style="padding: 1rem;"><div class="stat-label" style="font-size: 0.75rem;">Total Users</div><div id="stat-users" class="stat-value" style="font-size: 1.25rem;">...</div></div>
          <div class="stat-card card" style="padding: 1rem;"><div class="stat-label" style="font-size: 0.75rem;">Providers</div><div id="stat-providers" class="stat-value" style="font-size: 1.25rem;">...</div></div>
          <div class="stat-card card" style="padding: 1rem;"><div class="stat-label" style="font-size: 0.75rem;">Activities</div><div id="stat-activities" class="stat-value" style="font-size: 1.25rem;">...</div></div>
          <div class="stat-card card" style="padding: 1rem;"><div class="stat-label" style="font-size: 0.75rem;">Bookings</div><div id="stat-bookings" class="stat-value" style="font-size: 1.25rem;">...</div></div>
          <div class="stat-card card" onclick="window.switchAdminTab('waitlist')" style="padding: 1rem; cursor: pointer;"><div class="stat-label" style="font-size: 0.75rem;">Waitlist</div><div id="stat-waitlist" class="stat-value" style="font-size: 1.25rem;">...</div></div>
          <div class="stat-card card" onclick="window.switchAdminTab('news')" style="padding: 1rem; cursor: pointer;"><div class="stat-label" style="font-size: 0.75rem;">News</div><div id="stat-news" class="stat-value" style="font-size: 1.25rem;">...</div></div>
        </div>
        
        <div id="admin-tab-content" class="fade-up"></div>
      </main>

      <!-- Mobile Bottom Nav -->
      <nav class="admin-bottom-nav">
        <button class="admin-nav-item active" data-tab="dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>
          <span>Dash</span>
        </button>
        <button class="admin-nav-item" data-tab="activities">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" /></svg>
          <span>Activities</span>
        </button>
        <button class="admin-nav-item" data-tab="news">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5" /></svg>
          <span>News</span>
        </button>
        <button class="admin-nav-item" id="admin-more-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          <span>More</span>
        </button>
      </nav>

      <!-- More Menu Overlay -->
      <div id="admin-more-menu" class="admin-more-overlay">
        <button class="overlay-close" id="admin-close-more">&times;</button>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 2rem;">System Menu</h2>
        <div class="admin-overlay-grid">
          <div class="overlay-item" data-tab="users">Users</div>
          <div class="overlay-item" data-tab="providers">Providers</div>
          <div class="overlay-item" data-tab="friends">Friends</div>
          <div class="overlay-item" data-tab="invoices">Bookings</div>
          <div class="overlay-item" data-tab="newsletter">Interest List</div>
          <div class="overlay-item" data-tab="permissions">Permissions</div>
          <div class="overlay-item" data-tab="google">Google</div>
          <div class="overlay-item" id="over-nav-logout" style="color: #ef4444;">Exit Console</div>
        </div>
      </div>
    </div>
  `;

  // Re-attach Tab logic
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(t => {
    t.onclick = () => {
      const tab = t.dataset.tab;
      const statsContainer = document.getElementById('admin-stats-container');
      if (statsContainer) {
        statsContainer.style.display = (tab === 'dashboard') ? 'grid' : 'none';
      }

      // Close overlay if open
      document.getElementById('admin-more-menu')?.classList.remove('open');
      
      document.querySelectorAll('[data-tab]').forEach(btn => btn.classList.remove('active'));
      t.classList.add('active');
      
      if (tab === 'dashboard') window.loadAdminSummary();
      else if (tab === 'users') window.loadAdminUsers();
      else if (tab === 'providers') window.loadAdminProviders();
      else if (tab === 'activities') window.loadAdminActivities();
      else if (tab === 'news') window.loadAdminNewsAndPolls();
      else if (tab === 'friends') window.loadAdminFriends();
      else if (tab === 'invoices') window.loadAdminInvoices();
      else if (tab === 'newsletter') window.loadAdminNewsletter();
      else if (tab === 'permissions') window.loadAdminPermissions();
      else if (tab === 'google') window.loadAdminGoogleSettings();
    };
  });

  document.getElementById('admin-more-btn')?.addEventListener('click', () => {
    document.getElementById('admin-more-menu')?.classList.add('open');
  });
  document.getElementById('admin-close-more')?.addEventListener('click', () => {
    document.getElementById('admin-more-menu')?.classList.remove('open');
  });
  document.getElementById('over-nav-logout')?.addEventListener('click', () => window.handleLogout());

  document.getElementById('side-nav-logout')?.addEventListener('click', () => window.handleLogout());
  window.loadAdminStats();
  window.loadAdminSummary();
}

// Helper to switch tabs
window.switchAdminTab = (tab) => {
  const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"], .admin-nav-item[data-tab="${tab}"], .overlay-item[data-tab="${tab}"]`);
  if (tabBtn) tabBtn.click();
};

// --- ADMIN LOGIC ---
window.loadAdminStats = async () => {
  try {
    const stats = await adminGetStats();
    document.getElementById('stat-users').textContent = stats.users;
    document.getElementById('stat-providers').textContent = stats.providers;
    document.getElementById('stat-activities').textContent = stats.activities;
    document.getElementById('stat-bookings').textContent = stats.bookings;
  } catch (err) { console.error('Stats error:', err); }
};

window.loadAdminSummary = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = `<div style="text-align: center; padding: 3rem;"><p>Gathering platform overview...</p></div>`;
  try {
    const [usersRes, providersRes, activitiesRes, bookingsRes, waitlistRes, newsRes, newsletterRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('providers').select('*').limit(5),
      supabase.from('activities').select('*, providers(business_name)').limit(5),
      supabase.from('invoices').select('*, activities(name), profiles:parent_id(full_name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('waitlist').select('*, activities(name), profiles:parent_id(full_name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('news').select('*, providers(business_name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('interest_submissions').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    const totalRevenue = (bookingsRes.data || []).reduce((sum, b) => sum + (b.amount || 0), 0);

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        
        <!-- Platform Vitals -->
        <div class="card" style="grid-column: 1 / -1; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border: 1px solid #dcfce7;">
          <h3 style="margin-top: 0; font-weight: 800; color: #166534;">Platform Pulse</h3>
          <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
             <div><p style="margin: 0; font-size: 0.75rem; color: #15803d; text-transform: uppercase; font-weight: 700;">Recent Revenue</p><p style="margin: 4px 0 0 0; font-size: 1.5rem; font-weight: 900; color: #1e293b;">£${totalRevenue}</p></div>
             <div><p style="margin: 0; font-size: 0.75rem; color: #15803d; text-transform: uppercase; font-weight: 700;">Waitlist Volume</p><p style="margin: 4px 0 0 0; font-size: 1.5rem; font-weight: 900; color: #1e293b;">${(waitlistRes.data || []).length} active</p></div>
             <div><p style="margin: 0; font-size: 0.75rem; color: #15803d; text-transform: uppercase; font-weight: 700;">Newsletter Growth</p><p style="margin: 4px 0 0 0; font-size: 1.5rem; font-weight: 900; color: #1e293b;">+${(newsletterRes.data || []).length} new</p></div>
          </div>
        </div>

        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="margin: 0; font-weight: 800; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='inherit'" onclick="window.switchAdminTab('users')">Recent Members</h3>
            <button onclick="window.switchAdminTab('users')" style="background: #f1f5f9; border: none; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer;">Manage</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${(usersRes.data || []).map(u => `
              <div style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="window.switchAdminTab('users')">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #64748b;">${(u.full_name || u.email || '?')[0].toUpperCase()}</div>
                <div><p style="margin:0; font-weight: 700;">${u.full_name || u.email}</p><p style="margin:0; font-size: 0.7rem; color: #94a3b8;">Joined ${new Date(u.created_at).toLocaleDateString()}</p></div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="margin: 0; font-weight: 800; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='inherit'" onclick="window.switchAdminTab('invoices')">Recent Bookings</h3>
            <button onclick="window.switchAdminTab('invoices')" style="background: #f1f5f9; border: none; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer;">Manage</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${(bookingsRes.data || []).map(b => `
              <div style="font-size: 0.85rem; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="window.switchAdminTab('invoices')">
                <p style="margin:0; font-weight: 700;">${b.profiles?.full_name}</p>
                <p style="margin:0; font-size: 0.75rem; color: #64748b;">${b.activities?.name} • £${b.amount}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="margin: 0; font-weight: 800; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='inherit'" onclick="window.switchAdminTab('newsletter')">Waitlist Activity</h3>
            <button onclick="window.switchAdminTab('newsletter')" style="background: #f1f5f9; border: none; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer;">Manage</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${(waitlistRes.data || []).map(w => `
              <div style="font-size: 0.85rem; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="window.switchAdminTab('newsletter')">
                <p style="margin:0; font-weight: 700;">${w.profiles?.full_name}</p>
                <p style="margin:0; font-size: 0.75rem; color: #64748b;">Waiting for: ${w.activities?.name}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="margin: 0; font-weight: 800; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='inherit'" onclick="window.switchAdminTab('news')">Recent News</h3>
            <button onclick="window.switchAdminTab('news')" style="background: #f1f5f9; border: none; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer;">Manage</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${(newsRes.data || []).map(n => `
              <div style="font-size: 0.85rem; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="window.switchAdminTab('news')">
                <p style="margin:0; font-weight: 700;">${n.title}</p>
                <p style="margin:0; font-size: 0.75rem; color: #64748b;">${n.providers?.business_name} • ${new Date(n.created_at).toLocaleDateString()}</p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  } catch (err) { 
    console.error(err);
    container.innerHTML = `<p style="color: #ef4444; padding: 2rem;">Error loading summary. Please ensure RLS policies are applied.</p>`; 
  }
};

window.loadAdminUsers = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<p>Loading users...</p>';
  try {
    const users = await adminGetAllUsers();
    container.innerHTML = `
      <div class="admin-table-container">
        <table class="admin-table">
          <thead><tr><th>User</th><th>Email</th><th>Status</th><th>Role</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.full_name || 'No Name'}</td>
                <td>${u.email}</td>
                <td>${u.is_verified ? 'Verified' : 'Unverified'}</td>
                <td><span class="role-badge role-${u.role}">${u.role}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.handleAdminUserRoleChange = async (userId, newRole) => {
  if (!confirm(`Change role to ${newRole}?`)) return;
  try {
    await adminUpdateUserRole(userId, newRole);
    window.showToast('Role updated!');
    window.loadAdminUsers();
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminGoogleSettings = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<h3>Google Analytics</h3><p>Loading...</p>';
  try {
    const settings = await getSettings();
    const gaId = settings.find(s => s.key === 'google_analytics_id')?.value || '';
    container.innerHTML = `
      <div class="card" style="max-width: 500px;">
        <label>GA4 Measurement ID</label>
        <input type="text" id="ga-id-input" value="${gaId}" placeholder="G-XXXXXXXXXX" class="form-control" style="margin: 1rem 0;">
        <button onclick="window.saveAdminGaSettings()" class="btn btn-primary">Save Settings</button>
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.saveAdminGaSettings = async () => {
  const val = document.getElementById('ga-id-input').value.trim();
  try {
    await updateSetting('google_analytics_id', val);
    window.showToast('Settings updated! Please refresh.');
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminProviders = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading providers...</div>';
  try {
    const providers = await adminGetAllProviders();
    container.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-weight: 800;">Provider Management</h3>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f1f5f9;">
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Business</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Owner</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Verified</th>
              </tr>
            </thead>
            <tbody>
              ${providers.map(p => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px;">
                    <div style="font-weight: 700; color: #1e293b;">${p.business_name}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${p.location || 'No location'}</div>
                  </td>
                  <td style="padding: 12px;">
                    <div style="font-size: 0.85rem;">${p.profiles?.full_name || 'Unknown'}</div>
                  </td>
                  <td style="padding: 12px;">
                    <span style="background: ${p.is_verified ? '#dcfce7' : '#fee2e2'}; color: ${p.is_verified ? '#15803d' : '#ef4444'}; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800;">
                      ${p.is_verified ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminActivities = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading activities...</div>';
  try {
    const activities = await adminGetAllActivities();
    container.innerHTML = `
      <div class="card">
        <h3 style="margin-bottom: 1.5rem; font-weight: 800;">Activity Oversight</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f1f5f9;">
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Activity</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Provider</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Bookings</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${activities.map(a => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px;">
                    <div style="font-weight: 700; color: #1e293b;">${a.name}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${a.category} • £${a.price}</div>
                  </td>
                  <td style="padding: 12px;">
                    <div style="font-size: 0.85rem;">${a.providers?.business_name || 'N/A'}</div>
                  </td>
                  <td style="padding: 12px;">
                    <div style="font-weight: 700;">${a.bookings_count || 0}</div>
                  </td>
                  <td style="padding: 12px; text-align: right; display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick='window.handleAdminViewActivityBookings(${JSON.stringify(a).replace(/'/g, "&apos;")})' class="btn btn-primary" style="width: auto; padding: 6px 12px; font-size: 0.75rem; font-weight: 700;">
                      View
                    </button>
                    <button onclick="window.editAdminActivity('${a.id}')" class="btn btn-secondary" style="width: auto; padding: 6px 12px; font-size: 0.75rem; font-weight: 700;">
                      Edit
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminNewsAndPolls = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading news...</div>';
  try {
    const news = await adminGetAllNews();
    container.innerHTML = `
      <div class="card">
        <h3 style="margin-bottom: 1.5rem; font-weight: 800;">Community News & Polls</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${news.map(n => `
            <div style="padding: 1rem; border: 1px solid #f1f5f9; border-radius: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--primary-color);">${n.type || 'NEWS'}</span>
                  <h4 style="margin: 4px 0; font-weight: 700;">${n.title}</h4>
                </div>
                <button onclick="window.editAdminNews('${n.id}')" class="btn btn-secondary" style="width: auto; padding: 4px 8px; font-size: 0.75rem;">Edit</button>
              </div>
              <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;">${n.content?.substring(0, 100)}...</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminFriends = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading social graph...</div>';
  try {
    const [connections, users] = await Promise.all([
      getAllParentFriendships(),
      adminGetAllUsers()
    ]);

    // Calculate friend counts
    const friendCounts = {};
    users.forEach(u => friendCounts[u.id] = 0);
    connections.forEach(c => {
      if (c.status === 'active' || c.status === 'accepted') {
        if (friendCounts[c.requester_id] !== undefined) friendCounts[c.requester_id]++;
        if (friendCounts[c.receiver_id] !== undefined) friendCounts[c.receiver_id]++;
      }
    });

    // Sort users by friend count
    const sortedUsers = [...users].sort((a, b) => (friendCounts[b.id] || 0) - (friendCounts[a.id] || 0));

    container.innerHTML = `
      <div class="card" style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1.5rem; font-weight: 800;">Social Connections</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f1f5f9;">
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">User A</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">User B</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Status</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Connected On</th>
              </tr>
            </thead>
            <tbody>
              ${connections.length === 0 ? '<tr><td colspan="4" style="padding: 2rem; text-align: center; color: #94a3b8;">No connections found</td></tr>' : connections.map(c => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      ${c.requester?.photo_url ? `<img src="${c.requester.photo_url}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">` : `<div style="width: 24px; height: 24px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800;">${c.requester?.full_name?.[0] || '?'}</div>`}
                      <span>${c.requester?.full_name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td style="padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      ${c.receiver?.photo_url ? `<img src="${c.receiver.photo_url}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">` : `<div style="width: 24px; height: 24px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800;">${c.receiver?.full_name?.[0] || '?'}</div>`}
                      <span>${c.receiver?.full_name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td style="padding: 12px;">
                    <span style="font-size: 0.7rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; background: ${c.status === 'active' || c.status === 'accepted' ? '#dcfce7' : '#fef3c7'}; color: ${c.status === 'active' || c.status === 'accepted' ? '#15803d' : '#d97706'};">
                      ${c.status.toUpperCase()}
                    </span>
                  </td>
                  <td style="padding: 12px; font-size: 0.85rem; color: #64748b;">${new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom: 1.5rem; font-weight: 800;">Influence Ranking</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Number of friends per user across the platform.</p>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 400px;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f1f5f9;">
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">User</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; text-align: center;">Friends Count</th>
              </tr>
            </thead>
            <tbody>
              ${sortedUsers.map(u => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      ${u.photo_url ? `<img src="${u.photo_url}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">` : `<div style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary-color);">${u.full_name?.[0] || '?'}</div>`}
                      <div>
                        <p style="font-weight: 700; color: #1e293b; margin: 0; font-size: 0.9rem;">${u.full_name || 'Unnamed User'}</p>
                        <p style="font-size: 0.7rem; color: #94a3b8; margin: 0;">${u.role?.toUpperCase() || 'PARENT'}</p>
                      </div>
                    </div>
                  </td>
                  <td style="padding: 12px; text-align: center;">
                    <span style="font-size: 1rem; font-weight: 900; color: var(--primary-color); background: #f1f8e9; padding: 4px 12px; border-radius: 20px;">
                      ${friendCounts[u.id] || 0}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminInvoices = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading invoices...</div>';
  try {
    const invoices = await adminGetAllInvoices();
    
    // Group by Date, then by Activity
    const grouped = invoices.reduce((acc, inv) => {
      const date = inv.event_date || 'No Date';
      if (!acc[date]) acc[date] = {};
      const actName = inv.activities?.name || 'Deleted Activity';
      if (!acc[date][actName]) acc[date][actName] = [];
      acc[date][actName].push(inv);
      return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        ${sortedDates.map(date => `
          <div class="card">
            <h3 style="margin-bottom: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
              <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 8px; font-size: 1rem;">📅</span>
              ${date === 'No Date' ? 'Date Not Specified' : new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              ${Object.keys(grouped[date]).map(actName => {
                const items = grouped[date][actName];
                const totalAmount = items.reduce((sum, i) => sum + parseFloat(i.amount), 0);
                return `
                  <div style="border: 1px solid #f1f5f9; border-radius: 12px; padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px dashed #e2e8f0; padding-bottom: 0.5rem;">
                      <h4 style="margin: 0; font-weight: 800; color: var(--primary-color);">${actName}</h4>
                      <span style="font-weight: 800; font-size: 0.9rem; color: #1e293b;">Total: £${totalAmount.toFixed(2)}</span>
                    </div>
                    <div style="overflow-x: auto;">
                      <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                          <tr style="text-align: left; font-size: 0.7rem; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                            <th style="padding: 8px;">Parent</th>
                            <th style="padding: 8px;">Time</th>
                            <th style="padding: 8px;">Amount</th>
                            <th style="padding: 8px;">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${items.map(i => `
                            <tr style="border-bottom: 1px solid #f8fafc;">
                              <td style="padding: 8px; font-size: 0.85rem;">${i.profiles?.full_name || 'Unknown'}</td>
                              <td style="padding: 8px; font-size: 0.8rem; color: #64748b;">${i.activities?.start_time || ''} - ${i.activities?.end_time || ''}</td>
                              <td style="padding: 8px; font-size: 0.85rem; font-weight: 700;">£${i.amount}</td>
                              <td style="padding: 8px;">
                                <span style="background: ${i.status==='paid'?'#dcfce7':'#fef3c7'}; color: ${i.status==='paid'?'#15803d':'#d97706'}; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 800;">
                                  ${i.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminNewsletter = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading interest list...</div>';
  try {
    const signups = await adminGetNewsletterSignups();
    container.innerHTML = `
      <div class="card">
        <h3 style="margin-bottom: 1.5rem; font-weight: 800;">Interest List Signups</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f1f5f9;">
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Email</th>
                <th style="padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: #64748b;">Joined</th>
              </tr>
            </thead>
            <tbody>
              ${signups.map(s => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px; font-weight: 600;">${s.email}</td>
                  <td style="padding: 12px; color: #64748b;">${new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.loadAdminPermissions = async () => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading permissions...</div>';
  try {
    const providers = await adminGetAllProviders();
    if (providers.length === 0) {
      container.innerHTML = '<div class="card">No providers found.</div>';
      return;
    }

    // Default to Urban Tribe or the first provider
    const mainProvider = providers.find(p => p.business_name.toLowerCase().includes('urban tribe')) || providers[0];
    
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin: 0;">Activity Permissions</h2>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            <span style="font-size: 0.85rem; color: #64748b;">Managing for: </span>
            <select id="admin-perm-provider-select" style="padding: 4px 8px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.85rem; background: white; font-weight: 600;">
              ${providers.map(p => `<option value="${p.id}" ${p.id === mainProvider.id ? 'selected' : ''}>${p.business_name}</option>`).join('')}
            </select>
          </div>
        </div>
        <button id="admin-add-perm" class="btn btn-primary" style="width: auto;">+ New Permission</button>
      </div>
      
      <div id="admin-p-list">Loading...</div>
    `;

    const select = document.getElementById('admin-perm-provider-select');
    select.onchange = (e) => {
      window.renderPermissionsManager(e.target.value, 'admin-p-list', 'admin-add-perm');
    };

    window.renderPermissionsManager(mainProvider.id, 'admin-p-list', 'admin-add-perm');
  } catch (err) { window.showToast(err.message, 'error'); }
};

window.editAdminActivity = async (activityId) => {
  const { data: activity, error } = await supabase.from('activities').select('*').eq('id', activityId).single();
  if (error) {
    window.showToast('Error fetching activity', 'error');
    return;
  }
  
  if (typeof window.renderAddActivityForm === 'function') {
    window.renderAddActivityForm(activity.provider_id, activity);
  } else {
    window.showToast('Edit form not available', 'error');
  }
};

window.editAdminNews = async (newsId) => {
  const { data: news, error } = await supabase.from('news').select('*').eq('id', newsId).single();
  if (error) {
    window.showToast('Error fetching news', 'error');
    return;
  }
  
  if (news.type === 'poll') {
    if (typeof window.renderAddPollForm === 'function') {
      window.renderAddPollForm(news.provider_id, news);
    } else {
      window.showToast('Poll form not available', 'error');
    }
  } else {
    if (typeof window.renderAddNewsForm === 'function') {
      window.renderAddNewsForm(news.provider_id, news);
    } else {
      window.showToast('News form not available', 'error');
    }
  }
};

window.handleAdminViewActivityBookings = async (activity) => {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = '<div class="loader-p">Loading attendee records...</div>';
  try {
    const invoices = await getActivityInvoices(activity.id);

    // Group invoices by Date, then by Parent
    const grouped = invoices.reduce((acc, inv) => {
      const d = inv.event_date || 'No Date Specified';
      if (!acc[d]) acc[d] = {};
      const parentName = inv.profiles?.full_name || 'Unknown Parent';
      const parentId = inv.parent_id;
      const key = `${parentId}_${parentName}`;
      if (!acc[d][key]) acc[d][key] = [];
      acc[d][key].push(inv);
      return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;">
        <button onclick="window.loadAdminActivities()" class="btn btn-outline" style="width: auto; padding: 8px 16px;">&larr; Back to Activities</button>
        <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800;">${activity.name} Attendees</h2>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${sortedDates.map(date => {
          const families = grouped[date];
          let dailyChildren = 0;
          let dailyAdults = 0;
          Object.values(families).forEach(familyInvoices => {
            dailyChildren += familyInvoices.filter(i => i.child_id).length;
            dailyAdults += familyInvoices.reduce((sum, i) => sum + (i.adult_count || 0), 0);
          });

          return `
            <div class="card" style="margin-bottom: 0;">
              <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border-left: 5px solid var(--primary-color); margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 800; color: #1e293b; font-size: 1rem;">📅 ${date}</span>
                <div style="display: flex; gap: 10px;">
                  <span style="font-size: 0.7rem; font-weight: 700; background: #fff; color: #64748b; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">👦 ${dailyChildren} Children</span>
                  <span style="font-size: 0.7rem; font-weight: 700; background: #fff; color: #64748b; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">🧔 ${dailyAdults} Adults</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${Object.keys(families).map(familyKey => {
                  const [pId, pName] = familyKey.split('_');
                  const familyInvoices = families[familyKey];
                  const childTickets = familyInvoices.filter(i => i.child_id).length;
                  const adultTickets = familyInvoices.reduce((sum, i) => sum + (i.adult_count || 0), 0);
                  const isFullyPaid = familyInvoices.every(i => i.status === 'paid');

                  return `
                    <div style="padding: 1rem; border: 1px solid #f1f5f9; border-radius: 12px; background: #fff;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--primary-color); font-size: 0.9rem;">${pName[0]}</div>
                          <div>
                            <p style="font-weight: 700; color: #1e293b; margin: 0; font-size: 0.9rem;">${pName}</p>
                            <p style="font-size: 0.75rem; color: #64748b; margin: 0;">${childTickets} Children, ${adultTickets} Adults</p>
                          </div>
                        </div>
                        <span style="font-size: 0.65rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; background: ${isFullyPaid ? '#dcfce7' : '#fee2e2'}; color: ${isFullyPaid ? '#15803d' : '#b91c1c'};">
                          ${isFullyPaid ? 'FULLY PAID' : 'PENDING'}
                        </span>
                      </div>
                      
                      <div style="margin-top: 1rem; border-top: 1px dashed #f1f5f9; padding-top: 0.5rem;">
                        ${familyInvoices.map(inv => `
                          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 4px 0;">
                            <span>${inv.children?.name || 'Adult Ticket'}</span>
                            <span style="font-weight: 700;">£${inv.amount}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('') || '<p style="text-align:center; padding: 2rem; color: #94a3b8;">No attendees found for this activity.</p>'}
      </div>
    `;
  } catch (err) { window.showToast(err.message, 'error'); }
};
