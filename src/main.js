import './style.css'
import Cropper from 'cropperjs'
import { supabase } from './supabase'
import {
  signOut,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  updatePassword,
  getSession
} from './auth'
import {
  getMyChildren, addChild, getActivities, enrollChild, getMyInvoices, updateInvoice, getChildEnrollments, getMyProvider, createProvider, updateProvider, addActivity, getProviderActivities, getChildGuardians, updateChild, updateRelationship, uploadChildPhoto, uploadActivityPhoto, getMyProfile, updateMyProfile, updateActivity, joinChild, getNews, addNews, updateNews, addPoll, getActivityInvoices, getProviderNews, toggleActivityLike, toggleNewsLike,
  getComments, addComment, getConversations, getProviderPermissions, saveProviderPermission, deleteProviderPermission, getProviderComments, updateCommentStatus, deleteComment, deleteThread, getThreadComments, uploadAttachment, getUnreadMessageCount, markThreadAsRead,
  adminGetStats, adminGetAllUsers, adminUpdateUserRole, adminGetAllActivities, adminGetAllInvoices, adminGetAllNews, adminDeleteAllMessages, adminGetAllProviders,
  sendFriendRequest, getFriendRequests, respondToFriendRequest, getFriends, getFriendsActivities, updateSharingPreference, searchProfiles, getAllParentFriendships, fetchAllProviders,
  submitInterestRegistration, adminGetNewsletterSignups, addToWaitingList, getAllBookings,
  isActivityFull, joinWaitlist, getWaitlist, removeFromWaitlist, notifyWaitlistEntry, getWaitlistCountForActivity
} from './api'

import logo from './assets/logo.png'

window.handleLogout = async () => {
  try {
    await signOut();
    renderLogin();
  } catch (err) {
    alert('Logout failed: ' + err.message);
  }
};

window.renderLogin = () => renderLogin();
window.renderSignUp = () => renderSignUp();
window.renderAddActivityForm = (pid, act) => renderAddActivityForm(pid, act);

window.viewSignedWaiver = (encAdult, encMinors, date) => {
  const adult = decodeURIComponent(encAdult);
  const minors = decodeURIComponent(encMinors);
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '1500';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px; width: 90%; background: #fff; border-radius: 20px; padding: 2.5rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto;">
      <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem; font-weight: 800; color: #1e293b; text-align: center;">Participant Waiver & Release of Liability</h2>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem; text-align: center;">SIGNED COPY</p>
      
      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #475569; margin-bottom: 1.5rem;">
        <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem;">1. Participant Information</h4>
        <p style="margin-bottom: 10px;"><strong>Adult Participant Name:</strong> <span style="border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 200px;">${adult}</span></p>
        <p style="margin-bottom: 15px;"><strong>Minor(s) Names (under 18):</strong> <span style="border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 200px;">${minors}</span></p>
        
        <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">2. Acknowledgment of Risks</h4>
        <p>I understand that participating in activities at Urban Tribe (including but not limited to inflatables, obstacle courses, and group games) involves inherent risks. These risks include, but are not limited to, trips, falls, collisions with other participants, and physical exertion. I acknowledge that these activities can result in physical injury, such as scratches, bruises, sprains, or more serious injuries.</p>

        <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">3. Physical Health & Safety</h4>
        <ul style="padding-left: 20px; margin-bottom: 1rem;">
          <li style="margin-bottom: 4px;"><strong>Fitness to Participate:</strong> I certify that I (and the minors listed above) am in good physical health and do not have any medical conditions that would make participation unsafe.</li>
          <li style="margin-bottom: 4px;"><strong>Safety Rules:</strong> I agree to follow all posted rules and verbal instructions from Urban Tribe staff. I have watched (or will watch) the required safety briefing before entering the activity zones.</li>
          <li style="margin-bottom: 4px;"><strong>Supervision:</strong> I understand that while Urban Tribe staff monitor the equipment, I am responsible for the supervision of the minors listed on this form at all times.</li>
        </ul>

        <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">4. Release of Liability</h4>
        <p>In consideration of being allowed to use the facilities, I hereby release, waive, and discharge Urban Tribe Ltd., its owners, employees, and agents from any and all claims, liabilities, or causes of action arising out of my participation or the participation of the minors listed above, except in cases of gross negligence or willful misconduct by the company.</p>

        <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">5. Media Release</h4>
        <p style="margin-bottom: 1rem;">I consent to Urban Tribe taking photos or videos of me/my children for marketing and social media purposes. I understand no personal names will be used without further specific consent.</p>

        <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">6. Signature</h4>
        <p>I have read this waiver in its entirety and understand that I am signing it on behalf of myself and the minors listed above.</p>
        <p style="margin-top: 10px;"><strong>Date Signed:</strong> <span style="border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 100px;">${date}</span></p>
      </div>

      <div style="background: #ecfdf5; border: 1px solid #d1fae5; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; text-align: center;">
        <p style="color: #059669; font-weight: 800; font-size: 0.95rem;">✅ Digitally Signed by ${adult} on ${date}</p>
      </div>

      <button onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-primary" style="width: 100%;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
};

function renderBottomNav(activeTab, profile = null) {
  const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : '?';
  return `
    <nav class="bottom-nav">
      <button class="nav-item ${activeTab === 'dash' ? 'active' : ''}" id="nav-dash">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
        <span>Dash</span>
      </button>
      <button class="nav-item ${activeTab === 'activities' ? 'active' : ''}" id="nav-activities-parent">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" />
        </svg>
        <span>Activities</span>
      </button>
      <button class="nav-item ${activeTab === 'news' ? 'active' : ''}" id="nav-news">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
        <span>News</span>
      </button>
      <button class="nav-item" id="nav-more-parent">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <span>More</span>
      </button>
    </nav>

    <!-- Parent More Menu Overlay -->
    <div id="parent-more-menu" class="admin-more-overlay">
      <button class="overlay-close" id="parent-close-more">&times;</button>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 2rem;">Menu</h2>
      <div class="admin-overlay-grid">
        <div class="overlay-item" id="over-nav-friends">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 8px;"><path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
          Friends
        </div>
        <div class="overlay-item" id="over-nav-chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 8px;"><path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028Z" /></svg>
          Chat
        </div>
        <div class="overlay-item" id="over-nav-profile">
          ${profile?.photo_url ? `<img src="${profile.photo_url}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-bottom: 8px;">` : `<div style="width: 24px; height: 24px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.7rem; margin-bottom: 8px; color: var(--primary-color);">${initial}</div>`}
          You
        </div>
        <div class="overlay-item" id="over-nav-logout" style="color: #ef4444;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 8px;"><path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
          Exit
        </div>
      </div>
    </div>
  `;
}

function renderProviderBottomNav(activeTab) {
  return `
    <nav class="bottom-nav">
      <button class="nav-item ${activeTab === 'dash' ? 'active' : ''}" id="tab-prov-dash">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 2px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
        Dash
      </button>
      <button class="nav-item ${activeTab === 'act' ? 'active' : ''}" id="tab-prov-act">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 2px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" />
        </svg>
        Activities
      </button>
      <button class="nav-item ${activeTab === 'news' ? 'active' : ''}" id="tab-prov-news">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 2px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5" />
        </svg>
        News
      </button>
      <button class="nav-item ${activeTab === 'others' ? 'active' : ''}" id="tab-prov-others">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 2px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        More
      </button>
    </nav>
  `;
}

function attachNavEvents() {
  document.getElementById('nav-dash')?.addEventListener('click', () => renderDashboard('dash'));
  document.getElementById('nav-activities-parent')?.addEventListener('click', () => renderDashboard('activities'));
  document.getElementById('nav-news')?.addEventListener('click', renderNewsTab);

  // More Menu Toggle
  document.getElementById('nav-more-parent')?.addEventListener('click', () => {
    document.getElementById('parent-more-menu').classList.add('open');
  });
  document.getElementById('parent-close-more')?.addEventListener('click', () => {
    document.getElementById('parent-more-menu').classList.remove('open');
  });

  // More Menu Items
  document.getElementById('over-nav-friends')?.addEventListener('click', () => {
    document.getElementById('parent-more-menu').classList.remove('open');
    window.renderFriendsTab();
  });
  document.getElementById('over-nav-chat')?.addEventListener('click', () => {
    document.getElementById('parent-more-menu').classList.remove('open');
    renderMessagesTab();
  });
  document.getElementById('over-nav-profile')?.addEventListener('click', () => {
    document.getElementById('parent-more-menu').classList.remove('open');
    renderMyProfile();
  });
  document.getElementById('over-nav-logout')?.addEventListener('click', async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      window.location.reload();
    }
  });
}

window.showAboutSection = (sectionId, encodedChild, encodedEnrollments) => {
  const child = JSON.parse(decodeURIComponent(encodedChild));
  const enrollments = encodedEnrollments ? JSON.parse(decodeURIComponent(encodedEnrollments)) : [];
  const metadata = child.metadata || {};
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '1100';

  let title = '';
  let fieldsHtml = '';

  if (sectionId === 'basic') {
    title = 'Basic info';
    fieldsHtml = `
      <div class="form-group"><label>Name / Middle Name / Surname</label><input type="text" id="m-name" value="${child.name || ''}" required></div>
      <div class="form-group"><label>Gender</label><select id="m-gender" class="form-select"><option value="Male" ${child.gender === 'Male' ? 'selected' : ''}>Male</option><option value="Female" ${child.gender === 'Female' ? 'selected' : ''}>Female</option><option value="Other" ${child.gender === 'Other' ? 'selected' : ''}>Other</option></select></div>
      <div class="form-group"><label>Date of birth</label><input type="date" id="m-dob" value="${child.birth_date || ''}"></div>
      <div class="form-group"><label>Nationality</label><input type="text" id="m-nat" value="${metadata.nationality || ''}"></div>
      <div class="form-group"><label>Language</label><input type="text" id="m-lang" value="${metadata.language || ''}"></div>
      <div class="form-group"><label>Birthplace</label><input type="text" id="m-bp" value="${metadata.birthplace || ''}"></div>
      <div class="form-group"><label>Lives With</label><input type="text" id="m-lw" value="${metadata.lives_with || ''}"></div>
      <div class="form-group"><label>Parental responsibility</label><input type="text" id="m-pr" value="${metadata.parental_responsibility || ''}"></div>
      <div class="form-group"><label>Special notes</label><textarea id="m-sn" rows="3" style="width:100%; border:1px solid #e2e8f0; border-radius:8px; padding:0.5rem;">${metadata.special_notes || ''}</textarea></div>
    `;
  } else if (sectionId === 'health') {
    title = 'Health';
    fieldsHtml = `
      <h4 style="margin-top:1rem; margin-bottom:0.5rem; color:var(--primary-color);">Health details</h4>
      <div class="form-group"><label>Allergy</label><input type="text" id="m-allergy" value="${metadata.allergy || ''}"></div>
      <div class="form-group"><label>Tolerates penicillin</label><select id="m-pen" class="form-select"><option value="Yes" ${metadata.penicillin === 'Yes' ? 'selected' : ''}>Yes</option><option value="No" ${metadata.penicillin === 'No' ? 'selected' : ''}>No</option><option value="Unknown" ${metadata.penicillin === 'Unknown' ? 'selected' : ''}>Unknown</option></select></div>
      <div class="form-group"><label>Special dietary considerations</label><input type="text" id="m-diet" value="${metadata.diet || ''}"></div>
      <div class="form-group"><label>Vaccines</label><input type="text" id="m-vac" value="${metadata.vaccines || ''}"></div>
      
      <h4 style="margin-top:1.5rem; margin-bottom:0.5rem; color:var(--primary-color);">Doctor</h4>
      <div class="form-group"><label>Name</label><input type="text" id="m-doc-n" value="${metadata.doctor_name || ''}"></div>
      <div class="form-group"><label>Phone</label><input type="tel" id="m-doc-p" value="${metadata.doctor_phone || ''}"></div>
      <div class="form-group"><label>Address</label><input type="text" id="m-doc-a" value="${metadata.doctor_address || ''}"></div>
      
      <h4 style="margin-top:1.5rem; margin-bottom:0.5rem; color:var(--primary-color);">Dentist</h4>
      <div class="form-group"><label>Name</label><input type="text" id="m-den-n" value="${metadata.dentist_name || ''}"></div>
      <div class="form-group"><label>Phone</label><input type="tel" id="m-den-p" value="${metadata.dentist_phone || ''}"></div>
      <div class="form-group"><label>Address</label><input type="text" id="m-den-a" value="${metadata.dentist_address || ''}"></div>
    `;
  } else if (sectionId === 'sensitive') {
    title = 'Sensitive information';
    fieldsHtml = `
      <div class="form-group"><label>Religion</label><input type="text" id="m-rel" value="${metadata.religion || ''}"></div>
      <div class="form-group"><label>Ethnicity</label><input type="text" id="m-eth" value="${metadata.ethnicity || ''}"></div>
    `;
  } else if (sectionId === 'docs') {
    title = 'Documents';
    const docs = enrollments.filter(e => e.metadata);
    if (docs.length) {
      fieldsHtml = `
        <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 1.25rem;">Signed documents and waivers for ${child.name}:</p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${docs.map(d => {
        const date = new Date(d.created_at).toLocaleDateString();
        const adultName = d.metadata.first_name + ' ' + d.metadata.last_name;
        const actName = d.activities?.name || 'Activity Booking';
        return `
              <div onclick="window.viewSignedWaiver('${encodeURIComponent(adultName).replace(/'/g, "%27")}', '${encodeURIComponent(child.name).replace(/'/g, "%27")}', '${date}')" style="padding: 1rem; background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 40px; height: 40px; background: #dcfce7; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">📄</div>
                  <div>
                    <p style="font-weight: 700; color: #166534; font-size: 0.95rem; margin: 0;">Waiver: ${actName}</p>
                    <p style="font-size: 0.75rem; color: #15803d; margin: 0;">Signed on ${date}</p>
                  </div>
                </div>
                <span style="color: #10b981; font-weight: 800; font-size: 0.75rem; background: #fff; padding: 4px 8px; border-radius: 6px; border: 1px solid #bbf7d0;">VIEW</span>
              </div>
            `;
      }).join('')}
        </div>
      `;
    } else {
      fieldsHtml = `<div style="text-align: center; padding: 3rem; background: #f8fafc; border-radius: 20px; border: 2px dashed #e2e8f0; color: #64748b;"><p style="font-size: 2rem; margin-bottom: 1rem;">📂</p><p style="font-weight: 600;">No documents found.</p><p style="font-size: 0.8rem; margin-top: 4px;">Waivers will appear here after booking activities.</p></div>`;
    }
  } else if (sectionId === 'permissions') {
    title = 'Permissions';
    const permsList = [
      { id: 'p_animals', label: 'Animals', desc: 'I give permission for my child to handle, stroke and learn about animals on visits to farms and other educational settings, or touch, handle and stroke animals we have invited into the setting (where risk assessments are in place).' },
      { id: 'p_piriton', label: 'Antihistamine (Piriton)', desc: 'I give permission for my child to be administered piriton antihistamine if needed – parents would be informed prior to administration of piriton.' },
      { id: 'p_calpol', label: 'Calpol', desc: 'I give permission for my child to be administered calpol if needed - parents would be informed prior to administration of calpol.' },
      { id: 'p_emergency', label: 'Emergency Medical Treatment', desc: 'In the event of an emergency, I give permission for you to seek medical/hospital assistance in our absence as appropriate.' },
      { id: 'p_firstaid', label: 'First Aid', desc: 'I give permission for First Aid trained staff to administer first aid assistance to my child as and when necessary.' },
      { id: 'p_medicine', label: 'Medicines', desc: 'I give permission for my child to be administered medicine – a medicine form will be completed on Urban Tribe and the medication provided by the parent in line with our Medication Policy.' },
      { id: 'p_photo_other', label: 'Other photographs', desc: 'Photos may be used for ‘other’ purposes which will be openly accessible by the public such as presentations, website, posters, flyers, educational material, and advertising.' },
      { id: 'p_photographer', label: 'Photographer', desc: 'I give permission for a photographer to take photos of my child for professional use.' },
      { id: 'p_photo_ut', label: 'Photos & Videos on Urban Tribe', desc: 'Permission for your child to have photos & videos posted on Urban Tribe, these will be seen by other parents/carers of the setting also.' },
      { id: 'p_photo_social', label: 'Photos on Social Media', desc: 'I give permission for my child’s photos to be used on social media where their face is visible (Facebook & Instagram).' },
      { id: 'p_video_social', label: 'Videos on social media', desc: 'I give permission for videos with my child in to be used on social media where their face is visible (Facebook & Instagram).' },
      { id: 'p_plasters', label: 'Plasters', desc: 'I give permission for my child to have a plaster applied.' },
      { id: 'p_playground', label: 'Playground Equipment', desc: 'During trips and outings children may have the opportunity to access playground equipment. They will be supervised and a check of the area and its equipment will be carried out before use. I give permission for my child to play on equipment in various playgrounds which Urban Tribe staff deem safe and appropriate for my child.' },
      { id: 'p_transport', label: 'Public Transport', desc: 'I give permission for my child to ride on public transport including trains, buses and trams.' },
      { id: 'p_safeguarding', label: 'Safeguarding', desc: 'I understand that if there is a concern as to my child’s welfare/safety, the setting will follow their safeguarding policy and child protection procedures.' },
      { id: 'p_sharing', label: 'Sharing information with other professionals', desc: 'I give permission for Urban Tribe to share and discuss relevant information with other professionals such as Health and Language professionals and others.' },
      { id: 'p_suncream', label: 'Suncream', desc: 'I give permission for sun cream to be applied to my child in the setting. Where I have not provided my own sun cream, I give permission for Urban Tribe to apply their own sun cream (usually Boots own brand).' },
      { id: 'p_trips', label: 'Trips & Outings', desc: 'I give permission for my child to go on trips accessing places such as parks, farms, woodland, museums, libraries and galleries (this list is not extensive).' }
    ];

    fieldsHtml = `
      <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 1.25rem;">Set global permissions for ${child.name}. These will be shared with activity providers when you book.</p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${permsList.map(p => {
      const val = metadata.permissions?.[p.id] || 'No';
      return `
            <div style="padding: 1.25rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; transition: all 0.2s;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <label style="font-weight: 800; color: #1e293b; font-size: 0.95rem;">${p.label}</label>
                <div style="display: flex; background: #f1f5f9; padding: 3px; border-radius: 8px;">
                  <button type="button" onclick="window.setPermValue('${p.id}', 'Yes')" id="btn-yes-${p.id}" style="padding: 4px 12px; border-radius: 6px; border: none; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; ${val === 'Yes' ? 'background: #10b981; color: white; box-shadow: 0 2px 4px rgba(16,185,129,0.2);' : 'background: transparent; color: #64748b;'}">YES</button>
                  <button type="button" onclick="window.setPermValue('${p.id}', 'No')" id="btn-no-${p.id}" style="padding: 4px 12px; border-radius: 6px; border: none; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; ${val === 'No' ? 'background: #ef4444; color: white; box-shadow: 0 2px 4px rgba(239,68,68,0.2);' : 'background: transparent; color: #64748b;'}">NO</button>
                </div>
              </div>
              <p style="font-size: 0.8rem; color: #64748b; line-height: 1.4; margin: 0;">${p.desc}</p>
              <input type="hidden" id="perm-${p.id}" value="${val}">
            </div>
          `;
    }).join('')}
      </div>
    `;

    window.setPermValue = (pid, val) => {
      document.getElementById('perm-' + pid).value = val;
      const yesBtn = document.getElementById('btn-yes-' + pid);
      const noBtn = document.getElementById('btn-no-' + pid);
      if (val === 'Yes') {
        yesBtn.style.background = '#10b981'; yesBtn.style.color = 'white'; yesBtn.style.boxShadow = '0 2px 4px rgba(16,185,129,0.2)';
        noBtn.style.background = 'transparent'; noBtn.style.color = '#64748b'; noBtn.style.boxShadow = 'none';
      } else {
        noBtn.style.background = '#ef4444'; noBtn.style.color = 'white'; noBtn.style.boxShadow = '0 2px 4px rgba(239,68,68,0.2)';
        yesBtn.style.background = 'transparent'; yesBtn.style.color = '#64748b'; yesBtn.style.boxShadow = 'none';
      }
    };
  } else {
    title = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    fieldsHtml = `<p style="text-align:center; padding:2rem; color:#64748b;">Section ${title} is under development.</p>`;
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 95%; background: #fff; border-radius: 24px; padding: 2rem; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.15);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0;">${title}</h2>
        <button onclick="this.closest('.cropper-modal-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer;">×</button>
      </div>
      <form id="about-section-form">
        ${fieldsHtml}
        <div style="display: flex; gap: 12px; margin-top: 2rem;">
          <button type="button" onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-outline" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex: 1;">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('about-section-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const newMetadata = { ...metadata };
      const updates = {};

      if (sectionId === 'basic') {
        updates.name = document.getElementById('m-name').value;
        updates.gender = document.getElementById('m-gender').value;
        updates.birth_date = document.getElementById('m-dob').value;
        newMetadata.nationality = document.getElementById('m-nat').value;
        newMetadata.language = document.getElementById('m-lang').value;
        newMetadata.birthplace = document.getElementById('m-bp').value;
        newMetadata.lives_with = document.getElementById('m-lw').value;
        newMetadata.parental_responsibility = document.getElementById('m-pr').value;
        newMetadata.special_notes = document.getElementById('m-sn').value;
      } else if (sectionId === 'permissions') {
        if (!newMetadata.permissions) newMetadata.permissions = {};
        const pids = ['p_animals', 'p_piriton', 'p_calpol', 'p_emergency', 'p_firstaid', 'p_medicine', 'p_photo_other', 'p_photographer', 'p_photo_ut', 'p_photo_social', 'p_video_social', 'p_plasters', 'p_playground', 'p_transport', 'p_safeguarding', 'p_sharing', 'p_suncream', 'p_trips'];
        pids.forEach(pid => {
          const el = document.getElementById('perm-' + pid);
          if (el) newMetadata.permissions[pid] = el.value;
        });
      } else if (sectionId === 'health') {
        newMetadata.allergy = document.getElementById('m-allergy').value;
        newMetadata.penicillin = document.getElementById('m-pen').value;
        newMetadata.diet = document.getElementById('m-diet').value;
        newMetadata.vaccines = document.getElementById('m-vac').value;
        newMetadata.doctor_name = document.getElementById('m-doc-n').value;
        newMetadata.doctor_phone = document.getElementById('m-doc-p').value;
        newMetadata.doctor_address = document.getElementById('m-doc-a').value;
        newMetadata.dentist_name = document.getElementById('m-den-n').value;
        newMetadata.dentist_phone = document.getElementById('m-den-p').value;
        newMetadata.dentist_address = document.getElementById('m-den-a').value;
      } else if (sectionId === 'sensitive') {
        newMetadata.religion = document.getElementById('m-rel').value;
        newMetadata.ethnicity = document.getElementById('m-eth').value;
      }

      updates.metadata = newMetadata;
      await updateChild(child.id, updates);
      modal.remove();
      // Re-fetch child data to update the UI
      const allChildren = await getMyChildren();
      const updatedChild = allChildren.find(c => c.id === child.id);
      renderChildForm(updatedChild);
    } catch (err) {
      alert('Failed to save: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    }
  };
};

window.renderMessagesTab = renderMessagesTab;
async function renderMessagesTab() {
  const profile = await getMyProfile().catch(() => ({}));
  app.innerHTML = `
    <div class="container" style="padding-bottom: 80px;">
      <header style="display: flex; flex-direction: column; align-items: center; margin-top: 1.5rem; margin-bottom: 2rem; gap: 12px;">
        <img src="${logo}" alt="Urban Tribe" style="height: 40px;">
        <h1 style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">Messages</h1>
        <button id="btn-new-message" class="btn btn-primary" style="width: auto; padding: 0.6rem 1.5rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(139, 195, 74, 0.3); margin-top: 5px;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 18px; height: 18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Message
        </button>
      </header>
      <main id="messages-content">
        <div style="text-align: center; padding: 2rem;"><p style="color: var(--text-muted);">Loading conversations...</p></div>
      </main>
    </div>
    ${profile?.role === 'provider' ? renderProviderBottomNav('messages') : renderBottomNav('messages', profile)}
    <div id="new-message-modal-container"></div>
  `;
  attachNavEvents();

  document.getElementById('btn-new-message').onclick = () => window.renderNewMessageModal(profile);



  if (profile?.role === 'provider') {
    document.getElementById('tab-prov-act')?.addEventListener('click', renderProviderDashboard);
    document.getElementById('tab-prov-news')?.addEventListener('click', () => { renderProviderDashboard(); });
    document.getElementById('tab-prov-messages')?.addEventListener('click', renderMessagesTab);
    document.getElementById('tab-prov-others')?.addEventListener('click', () => { renderProviderDashboard(); });
  } else {
    attachNavEvents();
  }

  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out after 10s')), 10000));
    const conversations = await Promise.race([getConversations(), timeout]);
    const content = document.getElementById('messages-content');
    if (!content) return;

    if (conversations.length === 0) {
      content.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
          <div style="background: #f1f5f9; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 32px; height: 32px; color: #94a3b8;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028Z" />
            </svg>
          </div>
          <h3 style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">No messages yet</h3>
          <p style="color: #64748b;">Comments on activities and news will appear here.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = conversations.map(c => {
      const lastMsg = c.lastComment;
      const date = new Date(lastMsg.created_at).toLocaleDateString();
      const unreadDot = c.isUnread ? `<div style="width: 10px; height: 10px; border-radius: 50%; background: #3b82f6; position: absolute; right: 1rem; bottom: 1rem;"></div>` : '';
      const targetUserIdParam = (profile?.role === 'admin' || profile?.role === 'provider') ? c.userId : '';
      return `
        <div class="card" onclick="window.renderMessageThread('${c.type}', '${c.id}', '${targetUserIdParam}', '${c.threadId}')" style="cursor: pointer; padding: 1.25rem; margin-bottom: 0.75rem; border: 1px solid ${c.isUnread ? '#3b82f6' : '#f1f5f9'}; background: ${c.isUnread ? '#eff6ff' : '#fff'}; transition: all 0.2s; position: relative; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          ${unreadDot}
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="width: 54px; height: 54px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary-color); font-size: 1.4rem; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              ${c.title[0]}
            </div>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h4 style="font-weight: 800; color: #1e293b; margin: 0; font-size: 1.05rem;">${c.title}</h4>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">${date}</span>
                  <button onclick="event.stopPropagation(); window.handleDeleteConversation('${c.type}', '${c.id}', '${targetUserIdParam}', '${c.threadId}')" style="background: #fee2e2; border: none; padding: 6px; border-radius: 8px; cursor: pointer; color: #ef4444; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'" title="Delete Conversation">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 14px; height: 14px;">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              <p style="font-size: 0.8rem; color: var(--primary-color); margin-bottom: 0.25rem; font-weight: 700;">${c.subtitle || ''}</p>
              <p style="font-size: 0.9rem; color: #64748b; margin: 0; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">
                <b style="color: #475569;">${lastMsg.profiles?.full_name?.split(' ')[0] || 'User'}:</b> ${lastMsg.content}
              </p>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error(error);
    const c = document.getElementById('messages-content');
    if (c) c.innerHTML = `<div style="text-align:center;padding:2rem;"><p style="color:#ef4444;font-weight:700;">Failed to load messages</p><p style="font-size:0.85rem;color:#64748b;margin-top:0.5rem;">${error.message}</p><button onclick="renderMessagesTab()" class="btn" style="margin-top:1rem;padding:8px 20px;">Try Again</button></div>`;
  }
}

window.renderMessageThread = renderMessageThread;
async function renderMessageThread(type, id, userId = null, threadId = null) {
  markThreadAsRead(type, id, userId);
  updateUnreadBadges();

  const profile = await getMyProfile().catch(() => ({}));
  const container = document.getElementById('messages-content');
  if (!container) return;

  container.innerHTML = '<div style="text-align: center; padding: 2rem;"><p style="color: var(--text-muted);">Loading conversation...</p></div>';

  try {
    const comments = await getThreadComments(type, id, userId, threadId);

    // Find title
    let title = 'Conversation';
    if (comments.length > 0) {
      const c = comments[0];
      // Check for title in content
      const titleMatch = c.content.match(/🔒 \[TITLE: (.*?)\]/);
      title = titleMatch ? titleMatch[1] : (c.activities?.name || c.news?.title || title);
    }

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
        <button onclick="renderMessagesTab()" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 24px; height: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 style="font-weight: 800; color: #1e293b; margin: 0;">${title}</h3>
      </div>
      
      <div id="thread-history" style="max-height: calc(100vh - 350px); overflow-y: auto; padding-right: 8px; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 12px;">
        ${comments.map(c => {
      const isMine = c.user_id === profile?.id;
      const isMessage = c.content.includes('🔒 [PRIVATE_MESSAGE]');
      let displayContent = c.content.replace(/🔒 \[TITLE:.*?\] /g, '').replace(/🔒 \[FOR:.*?\] /g, '').replace('🔒 [PRIVATE_MESSAGE] ', '');

      // Detect URLs and render images if they look like Supabase storage links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      displayContent = displayContent.replace(urlRegex, (url) => {
        if (url.match(/\.(jpeg|jpg|gif|png|webp)/i) || url.includes('storage')) {
          return `<img src="${url}" style="max-width: 100%; border-radius: 12px; margin-top: 8px; display: block;" />`;
        }
        return `<a href="${url}" target="_blank" style="color: inherit; text-decoration: underline;">${url}</a>`;
      });

      return `
            <div style="max-width: 85%; align-self: ${isMine ? 'flex-end' : 'flex-start'};">
              <div style="display: flex; flex-direction: column; align-items: ${isMine ? 'flex-end' : 'flex-start'}; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-direction: ${isMine ? 'row-reverse' : 'row'};">
                  <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 600;">${isMine ? 'You' : (c.profiles?.full_name || 'User')} ${isMessage ? '🔒' : '💬'}</span>
                  ${isMine ? `
                    <button onclick="window.handleDeleteMessage('${c.id}', '${type}', '${id}', '${userId}', '${threadId}')" style="background: none; border: none; padding: 4px; cursor: pointer; color: #94a3b8; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'" title="Delete Message">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  ` : ''}
                </div>
                <div style="padding: 12px 16px; border-radius: 18px; font-size: 0.9rem; line-height: 1.4; ${isMine ? 'background: var(--primary-color); color: #fff; border-bottom-right-radius: 4px;' :
          'background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px;'
        }">
                  ${displayContent}
                </div>
              </div>
            </div>
          `;
    }).join('')}
      </div>

      <div style="background: #f8fafc; border-radius: 24px; padding: 0.75rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 8px;">
        <textarea id="thread-reply-input" placeholder="Write a private message..." style="width: 100%; min-height: 80px; padding: 0.75rem; border: none; background: transparent; font-size: 0.95rem; resize: none; outline: none; font-family: inherit; color: #1e293b;"></textarea>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.25rem;">
          <input type="file" id="thread-file-input" style="display: none;" accept="image/*" />
          <button id="btn-thread-attach" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e2e8f0; background: #fff; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
          <button id="btn-send-thread-reply" class="btn btn-primary" style="width: auto; padding: 8px 24px; border-radius: 12px; font-weight: 700;">Send</button>
        </div>
      </div>
    `;

    const history = document.getElementById('thread-history');
    history.scrollTop = history.scrollHeight;

    const fileInput = document.getElementById('thread-file-input');
    const attachBtn = document.getElementById('btn-thread-attach');
    attachBtn.onclick = () => fileInput.click();

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      attachBtn.disabled = true;
      attachBtn.innerHTML = '<span style="font-size: 0.6rem;">...</span>';
      try {
        const url = await uploadAttachment(file);
        const textarea = document.getElementById('thread-reply-input');
        textarea.value += (textarea.value ? '\n' : '') + url;
        attachBtn.innerHTML = '✅';
      } catch (err) {
        alert('Upload failed: ' + err.message);
      } finally {
        attachBtn.disabled = false;
        setTimeout(() => {
          attachBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>`;
        }, 2000);
      }
    };

    document.getElementById('btn-send-thread-reply').onclick = async () => {
      const input = document.getElementById('thread-reply-input');
      const content = input.value.trim();
      if (!content) return;

      const btn = document.getElementById('btn-send-thread-reply');
      btn.disabled = true;
      btn.textContent = '...';

      try {
        // Recipient selection logic: ensures the reply is tagged for the correct person
        let target = null;
        if (profile?.role === 'admin' || profile?.role === 'provider') {
          target = userId;
        } else if (comments.length > 0) {
          // Parents replying back to the person who started the thread (Admin or Provider)
          target = comments[0].user_id;
        }

        // Use the first message ID as parentId to keep the thread together
        const parentId = threadId || (comments.length > 0 ? (comments[0].parent_id || comments[0].id) : null);
        await addComment(type, id, content, parentId, true, '', target);
        renderMessageThread(type, id, userId, parentId);
      } catch (err) {
        alert('Error: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Send';
      }
    };

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p style="color: red; text-align: center;">Error loading conversation: ${error.message}</p>`;
  }
}


window.handleDeleteConversation = async (type, id, userId, threadId) => {
  if (!confirm('Are you sure you want to delete this entire conversation?')) return;
  try {
    await deleteThread(type, id, threadId);
    renderMessagesTab();
  } catch (err) {
    alert('Delete failed: ' + err.message);
  }
};

window.handleDeleteMessage = async (commentId, type, id, userId, threadId) => {
  if (!confirm('Are you sure you want to delete this message?')) return;
  try {
    await deleteComment(commentId);
    renderMessageThread(type, id, userId, threadId);
  } catch (err) {
    alert('Delete failed: ' + err.message);
  }
};

window.renderNewMessageModal = async (profile) => {
  const container = document.getElementById('new-message-modal-container');
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '1200';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 95%; background: #fff; border-radius: 24px; padding: 2rem; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0;">New Message</h2>
        <button onclick="this.closest('.cropper-modal-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer;">×</button>
      </div>
      
      <div id="new-msg-step-1">
        <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.25rem;">Who would you like to message?</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${profile.role === 'parent' ? `
            <button id="btn-msg-family" class="btn btn-outline" style="justify-content: flex-start; padding: 1rem; border-radius: 16px; border-color: #e2e8f0;">
              <span style="font-size: 1.2rem; margin-right: 12px;">🏠</span>
              <div style="text-align: left;">
                <p style="font-weight: 700; color: #1e293b; margin: 0;">Family Members</p>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Message other parents in your family</p>
              </div>
            </button>
            <button id="btn-msg-staff" class="btn btn-outline" style="justify-content: flex-start; padding: 1rem; border-radius: 16px; border-color: #e2e8f0;">
              <span style="font-size: 1.2rem; margin-right: 12px;">🏢</span>
              <div style="text-align: left;">
                <p style="font-weight: 700; color: #1e293b; margin: 0;">Management Groups</p>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Contact activity providers & management</p>
              </div>
            </button>
          ` : `
            <button id="btn-msg-activity-broadcast" class="btn btn-outline" style="justify-content: flex-start; padding: 1rem; border-radius: 16px; border-color: #e2e8f0;">
              <span style="font-size: 1.2rem; margin-right: 12px;">📢</span>
              <div style="text-align: left;">
                <p style="font-weight: 700; color: #1e293b; margin: 0;">Activity Broadcast (BCC)</p>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Send a message to all participants of a specific activity date</p>
              </div>
            </button>
            <button id="btn-msg-individual-parent" class="btn btn-outline" style="justify-content: flex-start; padding: 1rem; border-radius: 16px; border-color: #e2e8f0;">
              <span style="font-size: 1.2rem; margin-right: 12px;">👤</span>
              <div style="text-align: left;">
                <p style="font-weight: 700; color: #1e293b; margin: 0;">Individual Parent</p>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Send a private message to a specific parent</p>
              </div>
            </button>
          `}
        </div>
      </div>
      
      <div id="new-msg-step-2" style="display: none;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1rem;">
          <button id="btn-msg-back" style="background: none; border: none; color: var(--primary-color); cursor: pointer; font-weight: 700; font-size: 0.85rem;">← Back</button>
          <span id="recipient-type-label" style="font-weight: 700; color: #64748b; font-size: 0.85rem; text-transform: uppercase;">Select Recipient</span>
        </div>
        <div id="recipient-list-container" style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          <p style="text-align: center; color: #94a3b8; padding: 2rem;">Loading...</p>
        </div>
      </div>

      <div id="new-msg-step-3" style="display: none;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1rem;">
          <button id="btn-msg-back-to-2" style="background: none; border: none; color: var(--primary-color); cursor: pointer; font-weight: 700; font-size: 0.85rem;">← Back</button>
          <span id="final-recipient-label" style="font-weight: 700; color: #64748b; font-size: 0.85rem; text-transform: uppercase;">Message to: User</span>
        </div>

        <div style="margin-bottom: 1rem;">
          <input type="text" id="new-msg-title" placeholder="Message Title" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; outline: none; font-family: inherit; color: #1e293b; background: #f8fafc;" required />
        </div>
        
        <div style="background: #f8fafc; border-radius: 24px; padding: 0.5rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 8px;">
          <textarea id="new-msg-content" placeholder="Write a message..." style="width: 100%; min-height: 120px; padding: 1rem; border: none; background: transparent; font-size: 0.95rem; resize: none; outline: none; font-family: inherit; color: #1e293b;"></textarea>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem;">
             <input type="file" id="new-msg-file-input" style="display: none;" accept="image/*" />
             <button id="btn-attach-new-msg" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid #e2e8f0; background: #fff; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </button>
            <button id="btn-send-new-msg" style="padding: 10px 30px; background: #c4b5fd; border: none; border-radius: 12px; color: #fff; font-weight: 700; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 6px rgba(196,181,253,0.3);">Send</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const step1 = modal.querySelector('#new-msg-step-1');
  const step2 = modal.querySelector('#new-msg-step-2');
  const step3 = modal.querySelector('#new-msg-step-3');
  const listContainer = modal.querySelector('#recipient-list-container');
  const label = modal.querySelector('#recipient-type-label');

  let selectedRecipient = null;
  let selectedType = ''; // 'family', 'staff', 'broadcast', 'parent'

  const showStep2 = async (type) => {
    selectedType = type;
    step1.style.display = 'none';
    step2.style.display = 'block';
    listContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 2rem;">Loading...</p>';

    try {
      if (type === 'family') {
        label.textContent = 'Select Family Member';
        const children = await getMyChildren();
        const guardians = [];
        for (const child of children) {
          const g = await getChildGuardians(child.id);
          guardians.push(...g);
        }
        // Unique guardians excluding self
        const unique = Array.from(new Map(guardians.map(g => [g.profiles.email, g])).values()).filter(g => g.profiles.email !== profile.email);

        listContainer.innerHTML = unique.map(g => `
          <button class="recipient-item" data-id="${g.profiles.id}" data-name="${g.profiles.full_name}" style="display: flex; align-items: center; gap: 12px; padding: 0.75rem; border: 1px solid #f1f5f9; border-radius: 12px; background: #fff; cursor: pointer; text-align: left;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary-color);">${g.profiles.full_name[0]}</div>
            <div>
              <p style="font-weight: 700; color: #1e293b; margin: 0; font-size: 0.9rem;">${g.profiles.full_name}</p>
              <p style="font-size: 0.7rem; color: #64748b; margin: 0;">${g.relationship}</p>
            </div>
          </button>
        `).join('') || '<p style="text-align: center; color: #94a3b8; padding: 2rem;">No family members found.</p>';
      }
      else if (type === 'staff') {
        label.textContent = 'Select Management Group';
        const providers = await fetchAllProviders();

        listContainer.innerHTML = providers.map(p => `
          <button class="recipient-item" data-id="${p.id}" data-name="${p.business_name}" style="display: flex; align-items: center; gap: 12px; padding: 0.75rem; border: 1px solid #f1f5f9; border-radius: 12px; background: #fff; cursor: pointer; text-align: left;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary-color);">🏢</div>
            <div>
              <p style="font-weight: 700; color: #1e293b; margin: 0; font-size: 0.9rem;">${p.business_name}</p>
              <p style="font-size: 0.7rem; color: #64748b; margin: 0;">Management / Provider</p>
            </div>
          </button>
        `).join('') || '<p style="text-align: center; color: #94a3b8; padding: 2rem;">No management groups found.</p>';
      }
      else if (type === 'broadcast') {
        label.textContent = 'Select Activity for Broadcast';
        const provider = await getMyProvider();
        const activities = await getProviderActivities(provider.id);

        listContainer.innerHTML = activities.map(a => `
          <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #f1f5f9; border-radius: 16px;">
            <p style="font-weight: 800; color: #1e293b; margin-bottom: 8px;">${a.name}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${(a.event_dates || []).map(date => `
                <button class="recipient-item" data-id="${a.id}" data-date="${date}" data-name="${a.name} (${date})" style="padding: 6px 12px; background: #f1f5f9; border-radius: 8px; border: none; font-size: 0.75rem; font-weight: 700; color: #475569; cursor: pointer;">${date}</button>
              `).join('')}
            </div>
          </div>
        `).join('') || '<p style="text-align: center; color: #94a3b8; padding: 2rem;">No activities found.</p>';
      }

      modal.querySelectorAll('.recipient-item').forEach(btn => {
        btn.onclick = () => {
          selectedRecipient = {
            id: btn.dataset.id,
            name: btn.dataset.name,
            date: btn.dataset.date
          };
          step2.style.display = 'none';
          step3.style.display = 'block';
          modal.querySelector('#final-recipient-label').textContent = `Message to: ${selectedRecipient.name}`;
        };
      });

    } catch (err) {
      listContainer.innerHTML = `<p style="color: red; text-align: center;">${err.message}</p>`;
    }
  };

  if (profile.role === 'parent') {
    modal.querySelector('#btn-msg-family').onclick = () => showStep2('family');
    modal.querySelector('#btn-msg-staff').onclick = async () => {
      const providers = await fetchAllProviders();
      const ut = providers.find(p => p.business_name === 'Urban Tribe') || providers[0];
      if (ut) {
        selectedType = 'staff';
        selectedRecipient = { id: ut.id, name: ut.business_name };
        step1.style.display = 'none';
        step3.style.display = 'block';
        modal.querySelector('#final-recipient-label').textContent = `Message to: ${selectedRecipient.name}`;
      } else {
        showStep2('staff');
      }
    };
  } else {
    modal.querySelector('#btn-msg-activity-broadcast').onclick = () => showStep2('broadcast');
    modal.querySelector('#btn-msg-individual-parent').onclick = () => showStep2('parent');
  }

  modal.querySelector('#btn-msg-back').onclick = () => { step2.style.display = 'none'; step1.style.display = 'block'; };
  modal.querySelector('#btn-msg-back-to-2').onclick = () => { step3.style.display = 'none'; step2.style.display = 'block'; };

  const newMsgFileInput = modal.querySelector('#new-msg-file-input');
  const newMsgAttachBtn = modal.querySelector('#btn-attach-new-msg');
  newMsgAttachBtn.onclick = () => newMsgFileInput.click();

  newMsgFileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    newMsgAttachBtn.disabled = true;
    newMsgAttachBtn.innerHTML = '<span style="font-size: 0.6rem;">...</span>';
    try {
      const url = await uploadAttachment(file);
      const textarea = modal.querySelector('#new-msg-content');
      textarea.value += (textarea.value ? '\n' : '') + url;
      newMsgAttachBtn.innerHTML = '✅';
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      newMsgAttachBtn.disabled = false;
      setTimeout(() => {
        newMsgAttachBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>`;
      }, 2000);
    }
  };

  modal.querySelector('#btn-send-new-msg').onclick = async () => {
    const title = modal.querySelector('#new-msg-title').value.trim();
    const content = modal.querySelector('#new-msg-content').value.trim();
    if (!title) return alert('Please enter a message title.');
    if (!content) return alert('Please enter your message.');

    const btn = modal.querySelector('#btn-send-new-msg');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      if (selectedType === 'broadcast') {
        const attendees = await getActivityInvoices(selectedRecipient.id);
        const uniqueParents = Array.from(new Set(attendees.filter(i => i.event_date === selectedRecipient.date).map(i => i.parent_id)));

        for (const pid of uniqueParents) {
          await addComment('activity', selectedRecipient.id, content, null, true, title);
        }
      } else if (selectedType === 'staff') {
        const acts = await getProviderActivities(selectedRecipient.id);
        const providerOwnerId = selectedRecipient.owner_id;
        if (acts && acts.length > 0) {
          await addComment('activity', acts[0].id, content, null, true, title, providerOwnerId);
        } else {
          const newsItems = await getProviderNews(selectedRecipient.id);
          if (newsItems && newsItems.length > 0) {
            await addComment('news', newsItems[0].id, content, null, true, title);
          } else {
            throw new Error('This provider has no public activities or news to message.');
          }
        }
      } else {
        await addComment('activity', selectedRecipient.id, content, null, true, title);
      }

      alert('Message sent successfully!');
      modal.remove();
      renderMessagesTab();
    } catch (err) {
      alert('Error: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  };
};

window.navigateToConversation = async (type, id) => {
  if (type === 'activity') {
    await initApp();
    const el = document.getElementById(`comments-act-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.style.boxShadow = '0 0 0 2px var(--primary-color)';
      setTimeout(() => el.style.boxShadow = 'none', 2000);
      if (el.style.display === 'none') {
        window.toggleComments('activity', id, `comments-act-${id}`);
      }
    }
  } else {
    await renderNewsTab();
    const el = document.getElementById(`comments-news-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.style.boxShadow = '0 0 0 2px var(--primary-color)';
      setTimeout(() => el.style.boxShadow = 'none', 2000);
      if (el.style.display === 'none') {
        window.toggleComments('news', id, `comments-news-${id}`);
      }
    }
  }
};

async function renderCommentSection(entityType, entityId, comments, user, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const commentsHtml = comments.map(c => {
    const isMyComment = c.user_id === user?.id;
    return `
      <div style="margin-bottom: 1rem; ${c.parent_id ? 'margin-left: 2rem; border-left: 2px solid #f1f5f9; padding-left: 1rem;' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span style="font-size: 0.8rem; font-weight: 700; color: ${isMyComment ? 'var(--primary-color)' : '#1e293b'};">${c.profiles?.full_name || 'User'}</span>
          <span style="font-size: 0.7rem; color: #94a3b8;">${new Date(c.created_at).toLocaleDateString()}</span>
        </div>
        <p style="font-size: 0.85rem; color: #475569; margin-top: 0.25rem;">${c.content}</p>
        ${!c.parent_id ? `<button onclick="window.startReply('${entityType}', '${entityId}', '${c.id}', '${containerId}')" style="background: none; border: none; color: #94a3b8; font-size: 0.75rem; font-weight: 600; cursor: pointer; padding: 0; margin-top: 0.25rem;">Reply</button>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="background: #ffffff; border-radius: 20px; padding: 1.25rem; margin-top: 1rem; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      <h4 style="font-size: 0.9rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 18px; height: 18px; color: var(--primary-color);">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028Z" />
        </svg>
        Comments (${comments.length})
      </h4>
      <div style="max-height: 300px; overflow-y: auto; margin-bottom: 1.5rem; padding-right: 5px;">
        ${comments.length === 0 ? '<p style="font-size: 0.85rem; color: #94a3b8; text-align: center; padding: 2rem 0;">No comments yet. Be the first!</p>' : commentsHtml}
      </div>
      
      <div id="reply-to-info-${entityId}" style="display: none; background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 12px; margin-bottom: 0.75rem; font-size: 0.75rem; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0;">
        <span style="font-weight: 600; color: var(--primary-color);">Replying to message...</span>
        <button onclick="window.cancelReply('${entityId}')" style="background: #fff; border: none; color: #ef4444; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-size: 1.2rem;">×</button>
      </div>

      <div style="background: #f8fafc; border-radius: 24px; padding: 0.5rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 8px;">
        <p style="font-size: 0.7rem; color: #94a3b8; margin: 0.5rem 1rem 0 1rem; font-style: italic; line-height: 1.2;">Note: To keep our community safe, comments are reviewed before being published.</p>
        <textarea id="comment-input-${entityId}" placeholder="Write a message..." style="width: 100%; min-height: 80px; padding: 1rem; border: none; background: transparent; font-size: 0.95rem; resize: none; outline: none; font-family: inherit; color: #1e293b;"></textarea>
        
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem;">
          <div style="position: relative;">
            <button onclick="window.toggleAttachmentMenu('${entityId}')" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid #e2e8f0; background: #fff; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
            <div id="attachment-menu-${entityId}" style="display: none; position: absolute; bottom: 55px; left: 0; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 180px; z-index: 100; overflow: hidden; border: 1px solid #f1f5f9; animation: slideUp 0.3s ease;">
              <div onclick="window.triggerFileSelect('${entityId}', 'camera')" style="padding: 12px 16px; font-size: 0.9rem; font-weight: 600; color: #1e293b; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px;">📸 Take picture</div>
              <div onclick="window.triggerFileSelect('${entityId}', 'library')" style="padding: 12px 16px; font-size: 0.9rem; font-weight: 600; color: #1e293b; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px;">🖼️ Photo Library</div>
              <div onclick="window.triggerFileSelect('${entityId}', 'document')" style="padding: 12px 16px; font-size: 0.9rem; font-weight: 600; color: #1e293b; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px;">📄 Document</div>
              <div onclick="window.toggleAttachmentMenu('${entityId}')" style="padding: 12px 16px; font-size: 0.9rem; font-weight: 700; color: #2563eb; cursor: pointer; text-align: center; background: #f8fafc;">Cancel</div>
            </div>
            <input type="file" id="file-input-${entityId}" style="display: none;" onchange="window.handleFileSelect(event, '${entityId}')">
          </div>
          
          <div style="display: flex; background: #c4b5fd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(196,181,253,0.3);">
            <button onclick="window.handlePostComment('${entityType}', '${entityId}', '${containerId}')" style="padding: 10px 24px; background: transparent; border: none; color: #fff; font-weight: 700; cursor: pointer; font-size: 0.95rem;">Send</button>
            <div style="width: 1px; background: rgba(255,255,255,0.3); margin: 6px 0;"></div>
            <button style="padding: 10px 12px; background: transparent; border: none; color: #fff; cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 16px; height: 16px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.toggleAttachmentMenu = (entityId) => {
  const menu = document.getElementById(`attachment-menu-${entityId}`);
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
};

window.triggerFileSelect = (entityId, type) => {
  const input = document.getElementById(`file-input-${entityId}`);
  if (type === 'camera') input.setAttribute('capture', 'environment');
  else input.removeAttribute('capture');

  if (type === 'document') input.setAttribute('accept', '*/*');
  else input.setAttribute('accept', 'image/*');

  input.click();
  window.toggleAttachmentMenu(entityId);
};

window.handleFileSelect = (event, entityId) => {
  const file = event.target.files[0];
  if (file) {
    alert(`File selected: ${file.name}. (Storage integration coming soon)`);
  }
};

let activeReplyId = {};
window.startReply = (type, entityId, commentId, containerId) => {
  activeReplyId[entityId] = commentId;
  const info = document.getElementById(`reply-to-info-${entityId}`);
  info.style.display = 'flex';
  document.getElementById(`comment-input-${entityId}`).focus();
};
window.cancelReply = (entityId) => {
  activeReplyId[entityId] = null;
  const info = document.getElementById(`reply-to-info-${entityId}`);
  if (info) info.style.display = 'none';
};
window.handlePostComment = async (type, entityId, containerId) => {
  const input = document.getElementById(`comment-input-${entityId}`);
  const btnContainer = input?.nextElementSibling?.querySelector('div[style*="background: #c4b5fd"]');
  const sendBtn = btnContainer?.querySelector('button');

  const content = input.value.trim();
  if (!content) return;

  const prevText = sendBtn ? sendBtn.textContent : 'Send';
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
  }

  try {
    const parentId = activeReplyId[entityId] || null;
    if (!type || !entityId) throw new Error('Missing comment context');

    await addComment(type, entityId, content, parentId);

    alert('Thank you for your comment! To ensure a safe community for everyone, your message will be reviewed by the provider before it becomes visible.');

    input.value = '';
    window.cancelReply(entityId);

    const comments = await getComments(type, entityId);
    const { data: { user } } = await supabase.auth.getUser();
    renderCommentSection(type, entityId, comments, user, containerId);
  } catch (err) {
    console.error('Comment submission error:', err);
    alert('Failed to post comment: ' + err.message);
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = prevText;
    }
  }
};

window.toggleComments = async (type, id, containerId) => {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (el.style.display === 'none' || el.style.display === '') {
    el.style.display = 'block';
    el.innerHTML = '<div style="text-align: center; padding: 1.5rem; color: #94a3b8; font-size: 0.85rem;"><span class="spinner" style="display: inline-block; width: 16px; height: 16px; border: 2px solid #f1f5f9; border-top-color: var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px; vertical-align: middle;"></span>Loading comments...</div>';

    try {
      const comments = await getComments(type, id);
      const { data: { user } } = await supabase.auth.getUser();
      renderCommentSection(type, id, comments, user, containerId);
    } catch (err) {
      console.error('Error toggling comments:', err);
      el.innerHTML = `<div style="text-align: center; padding: 1.5rem; color: #ef4444; font-size: 0.85rem; background: #fef2f2; border-radius: 12px; margin-top: 1rem;">Failed to load comments: ${err.message}</div>`;
    }
  } else {
    el.style.display = 'none';
    el.innerHTML = '';
  }
};

let authListenerAttached = false;
window.renderLandingPage = async () => {
  console.log('Rendering Premium Kiddin-style Landing Page...');
  app.innerHTML = `
    <div class="lp-container" style="background: #fff; position: relative; overflow: hidden;">
      <div class="lp-blob-bg"></div>
      
      <nav class="lp-header fade-up">
        <img src="${logo}" alt="Urban Tribe" style="height: 42px; object-fit: contain;">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button id="lp-login" class="btn btn-outline" style="width: auto; padding: 0.6rem 1.5rem; border-radius: 100px; font-size: 0.9rem; border-width: 2px;">Sign In</button>
        </div>
      </nav>

      <header class="lp-hero fade-up" style="animation-delay: 0.1s;">
        <div class="lp-hero-text">
          <span class="lp-badge">Rebuilding Childhood</span>
          <h1>Screen Free Socials for the <span style="color: var(--primary-color);">Modern Tribe</span>.</h1>
          <p style="font-size: 1.25rem; line-height: 1.6; margin-bottom: 2.5rem;">Childhood has quietly shifted — more screens, more structure and less real play.<br><br>Urban Tribe brings back what’s been missing - freedom, friendship, and a local community where kids thrive and parents reconnect.</p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <button id="hero-register" class="btn btn-primary" style="width: auto; padding: 1.2rem 2.5rem; border-radius: 100px; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(166,206,57,0.4);">✉️ Register Your Interest</button>
          </div>
          <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 1rem;">We're coming soon — register to be the first to hear when we launch.</p>
        </div>
        <div class="lp-hero-image" style="border-radius: 60px; transform: rotate(-2deg); border: 8px solid #fff;">
          <img src="/hero.png" alt="Happy Kids">
        </div>
      </header>

      <section class="lp-section" style="background: #fff;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; max-width: 1200px; margin: 0 auto;">
          <div style="position: relative;">
            <img src="/about_kids.png" alt="Creative Kids" style="width: 100%; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.1);">
            <div style="position: absolute; bottom: -20px; right: -20px; background: var(--primary-color); color: #1e293b; padding: 1.5rem 2rem; border-radius: 30px; text-align: center; box-shadow: 0 20px 40px rgba(166,206,57,0.3);">
              <h4 style="font-size: 1.75rem; margin: 0; font-weight: 900;">Screen-Free</h4>
              <p style="margin: 0; font-weight: 700; font-size: 0.9rem;">Every Session</p>
            </div>
          </div>
          <div>
            <span class="lp-badge" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">Why It Matters</span>
            <h2 style="font-size: 2.75rem; font-weight: 900; line-height: 1.2; margin-bottom: 1.5rem;">Childhood Has Changed. <br>We're <span style="color: #8b5cf6;">Changing It Back.</span></h2>
            <p style="font-size: 1.1rem; color: #64748b; margin-bottom: 2rem;">Research shows a steep decline in unstructured play — the kind that builds resilience, problem-solving, and social confidence. And rates of childhood anxiety are rising.<br><br>Parents are feeling it too — under pressure to supervise, schedule, and entertain more than ever, often without the support of a wider community.<br><br>Urban Tribe is the antidote: free play, real friendships, and a local community where children can thrive — and parents can finally breathe.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <div style="background: #fef2f2; color: #ef4444; padding: 10px; border-radius: 12px; font-size: 1.5rem;">🧠</div>
                <div><h4 style="margin: 0;">Science-Backed</h4><p style="font-size: 0.85rem; margin: 0;">Grounded in child development research.</p></div>
              </div>
              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <div style="background: #f0fdf4; color: #22c55e; padding: 10px; border-radius: 12px; font-size: 1.5rem;">🏘️</div>
                <div><h4 style="margin: 0;">Community First</h4><p style="font-size: 0.85rem; margin: 0;">A modern village for real families.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- What it Looks Like -->
      <section class="lp-section fade-up" style="background: #f8fafc; padding: 40px 5%;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <span class="lp-badge">Picture it like this</span>
          <h2 style="font-size: 2.75rem; font-weight: 900; color: #1e293b; margin-bottom: 1rem;">A Space Alive With <span style="color: var(--primary-color);">Energy And Joy………</span></h2>
          <p style="font-size: 1.1rem; color: #64748b; max-width: 800px; margin: 0 auto 3rem;">Kids bustle between open-ended play — building, creating, running, exploring, making up games with friends. No one tells them where to go. Their curiosity leads the way.<br><br>Some days it’s outdoors, with space to roam and climb. Other days it’s indoors, filled with creativity and buzz.<br><br>Nearby, parents sit with a drink and a biscuit, chatting, reading, or simply watching. No pressure. No hosting. Just space to breathe — and to see their children come alive.</p>
          <div class="lp-feature-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; text-align: left;">
            ${[['🏗️', 'Child-Led Play', 'No scripts, no schedules — just curiosity and freedom to explore.'], ['🤝', 'Real Connection', 'Mixed-age friendships and face-to-face interaction that screens can never replace.'], ['🌿', 'Healthy Risks', 'Small adventures that build confidence, resilience, and independence.'], ['☕', 'Parents Too', 'A space to exhale — chat over tea, relax on the sidelines, feel supported.']].map(([icon, title, desc]) => `
            <div class="lp-card-premium fade-up" style="animation-delay: 0.2s;">
              <div class="lp-feature-header">
                <div class="lp-feature-icon">${icon}</div>
                <h3 class="lp-feature-title">${title}</h3>
              </div>
              <p class="lp-feature-desc">${desc}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- Founder Story -->
      <section class="lp-section" style="background: #1e293b; padding: 40px 5%;">
        <div style="max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: auto 1fr; gap: 3rem; align-items: center;">
          <div style="width: 140px; height: 140px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 4rem; flex-shrink: 0;">👩‍🔬</div>
          <div>
            <span class="lp-badge" style="background: rgba(166,206,57,0.15); color: var(--primary-color);">Our Founder</span>
            <h2 style="color: #fff; font-size: 2rem; font-weight: 900; margin: 0.75rem 0 1rem;">Built by a Leader, a Parent & a Scientist.</h2>
            <p style="color: rgba(255,255,255,0.75); font-size: 1rem; line-height: 1.8; margin-bottom: 1rem;">With over 20 years as a Brownie leader, a PhD in science, and a parent navigating today's pressures firsthand — Urban Tribe is the natural meeting point of everything I've learned. I've watched childhood change up close. Kids are more anxious, more scheduled, and too often disconnected from the joy of simple play.</p>
            <p style="color: rgba(255,255,255,0.75); font-size: 1rem; line-height: 1.8; margin: 0;">They say it takes a village to raise a child. Urban Tribe is that village — rebuilt for modern families. A place to give children back their freedom, connection, and resilience. And parents back their community.</p>
          </div>
        </div>
      </section>

      <div class="lp-wave-divider"></div>

      <section class="lp-section" style="background: #fff; padding: 40px 5%;">
        <div class="lp-split-section" style="max-width: 1200px; margin: 0 auto;">
          <div class="lp-split-col">
            <div class="lp-section-title" style="text-align: left; margin-bottom: 2rem;">
              <span class="lp-badge">Upcoming Sessions</span>
              <h2 style="font-size: 2.5rem;">What's On Near You</h2>
              <p>All-weather, screen-free sessions for children to play freely and parents to breathe.</p>
            </div>
            <div id="lp-activity-list" style="display: grid; gap: 2rem;">
              <p style="text-align: center; color: var(--text-muted);">Finding sessions...</p>
            </div>
          </div>

          <div class="lp-cta-banner lp-split-col" style="margin: 0; padding: 60px 40px; border-radius: 50px; text-align: left; background: #1e293b; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: var(--primary-color); opacity: 0.2; border-radius: 50%;"></div>
            <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">Find Your <br>Village.</h2>
            <p style="color: rgba(255,255,255,0.7); font-size: 1.1rem; margin-bottom: 1.5rem;">Urban Tribe isn't childcare and it isn't a club. It's a community ecosystem — a modern village where kids gain independence and confidence, and parents finally feel connected again.</p>
            <button id="cta-bottom" class="btn btn-primary" style="width: auto; padding: 1.2rem 3rem; border-radius: 100px; font-size: 1.1rem;">Join the Tribe</button>
          </div>
        </div>
      </section>

      <footer class="lp-footer">
        <div class="lp-footer-container">
          <div class="lp-footer-col">
            <img src="${logo}" alt="Urban Tribe" style="height: 48px; margin-bottom: 2rem;">
            <p style="font-size: 1.1rem; line-height: 1.8;">Rebuilding childhood from the ground up — strengthening wellbeing, restoring community, and giving families back something priceless.</p>
          </div>
          <div class="lp-footer-col">
            <h4>For Families</h4>
            <a href="#" class="lp-footer-link">Find Sessions</a>
            <a href="#" class="lp-footer-link">For Providers</a>
            <a href="#" class="lp-footer-link">Our Mission</a>
            <a href="#" class="lp-footer-link">The Research</a>
          </div>
          <div class="lp-footer-col">
            <h4>Community</h4>
            <a href="#privacy" id="f-privacy" class="lp-footer-link">Privacy Policy</a>
            <a href="#terms" id="f-terms" class="lp-footer-link">Terms of Service</a>
            <a href="#" class="lp-footer-link">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  document.getElementById('lp-login').onclick = () => renderLogin();
  document.getElementById('cta-bottom').onclick = () => window.showInterestModal();
  document.getElementById('hero-register').onclick = () => window.showInterestModal();
  document.getElementById('f-privacy').onclick = (e) => { e.preventDefault(); renderPrivacyPolicy(); };
  document.getElementById('f-terms').onclick = (e) => { e.preventDefault(); renderTerms(); };

  try {
    console.log('Fetching activities for LP...');
    const activities = await getActivities();
    console.log('Fetched activities:', activities);
    const list = document.getElementById('lp-activity-list');
    if (!list) {
      console.warn('lp-activity-list element not found');
      return;
    }
    if (!activities || activities.length === 0) {
      list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No upcoming sessions found yet. Check back soon!</p>';
    } else {
      list.innerHTML = activities.slice(0, 2).map(a => `
        <div class="lp-card-premium" style="display: flex; gap: 1.5rem; align-items: center; padding: 1.25rem;">
          <div style="width: 140px; height: 140px; background: #e2e8f0; border-radius: 24px; overflow: hidden; flex-shrink: 0;">
            ${a.photo_url ? `<img src="${a.photo_url}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">🎨</div>`}
          </div>
          <div style="flex: 1;">
            <p style="font-size: 0.75rem; font-weight: 800; color: var(--primary-color); text-transform: uppercase; margin-bottom: 0.4rem;">${a.category || 'Workshop'}</p>
            <h3 style="margin-bottom: 0.4rem; font-size: 1.3rem; font-weight: 800;">${a.name}</h3>
            <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1rem;">${a.providers?.business_name || 'Urban Tribe'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.1rem; font-weight: 900; color: #1e293b;">£${a.price || '0'}</span>
              <button onclick="window.renderLogin()" class="btn btn-primary" style="width: auto; padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.85rem;">Book Now</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error fetching LP activities:', err);
    const list = document.getElementById('lp-activity-list');
    if (list) list.innerHTML = `<p style="text-align: center; color: #ef4444; font-size: 0.85rem;">Failed to load sessions. Please try again later.</p>`;
  }
};

window.showInterestModal = () => {
  const existing = document.getElementById('interest-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'interest-modal-overlay';
  overlay.className = 'cropper-modal-overlay';
  overlay.style.display = 'flex';
  overlay.style.zIndex = '2000';
  overlay.innerHTML = `
    <div style="max-width:520px;width:95%;background:#fff;border-radius:28px;padding:2.5rem;position:relative;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.2);">
      <button onclick="document.getElementById('interest-modal-overlay').remove()" style="position:absolute;top:1.25rem;right:1.25rem;background:none;border:none;font-size:1.5rem;color:#94a3b8;cursor:pointer;">×</button>
      <div style="text-align:center;margin-bottom:1.75rem;">
        <div style="font-size:2.5rem;margin-bottom:0.5rem;">👋</div>
        <h2 style="font-size:1.5rem;font-weight:900;color:#1e293b;margin:0 0 0.5rem;">Register Your Interest</h2>
        <p style="color:#64748b;font-size:0.95rem;margin:0;">Be the first to know when Urban Tribe launches in your area.</p>
      </div>
      <form id="interest-form">
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" id="ri-name" placeholder="e.g. Sarah Johnson" required style="border-radius:12px;">
        </div>
        <div class="form-group">
          <label>Email Address *</label>
          <input type="email" id="ri-email" placeholder="your@email.com" required style="border-radius:12px;">
        </div>
        <div class="form-group">
          <label>Postcode *</label>
          <input type="text" id="ri-postcode" placeholder="e.g. SW1A 1AA" required style="border-radius:12px;">
        </div>
        <div class="form-group">
          <label>Number of Children *</label>
          <select id="ri-num-children" required style="border-radius:12px;border:1px solid #e2e8f0;width:100%;padding:0.75rem;font-size:1rem;background:#fff;">
            <option value="">Select...</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div id="ri-ages-container"></div>
        <p id="ri-error" style="color:#ef4444;font-size:0.85rem;display:none;margin-bottom:0.75rem;"></p>
        <button type="submit" id="ri-submit" class="btn btn-primary" style="border-radius:100px;font-size:1rem;margin-top:0.5rem;">Send My Interest ✉️</button>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  // Dynamic age fields
  document.getElementById('ri-num-children').onchange = function () {
    const n = parseInt(this.value) || 0;
    const container = document.getElementById('ri-ages-container');
    container.innerHTML = '';
    for (let i = 1; i <= n; i++) {
      container.innerHTML += `
        <div class="form-group">
          <label>Age of Child ${i} *</label>
          <select id="ri-age-${i}" required style="border-radius:12px;border:1px solid #e2e8f0;width:100%;padding:0.75rem;font-size:1rem;background:#fff;">
            <option value="">Select age...</option>
            ${Array.from({ length: 17 }, (_, i) => `<option value="${i + 1}">${i + 1} year${i > 0 ? 's' : ''} old</option>`).join('')}
          </select>
        </div>`;
    }
  };

  document.getElementById('interest-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('ri-submit');
    const errEl = document.getElementById('ri-error');
    const numChildren = parseInt(document.getElementById('ri-num-children').value) || 0;
    const ages = [];
    for (let i = 1; i <= numChildren; i++) {
      const v = document.getElementById('ri-age-' + i)?.value;
      if (!v) { errEl.textContent = 'Please select an age for each child.'; errEl.style.display = 'block'; return; }
      ages.push(parseInt(v));
    }
    if (numChildren === 0) { errEl.textContent = 'Please select the number of children.'; errEl.style.display = 'block'; return; }
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      await submitInterestRegistration({
        full_name: document.getElementById('ri-name').value.trim(),
        email: document.getElementById('ri-email').value.trim(),
        postcode: document.getElementById('ri-postcode').value.trim().toUpperCase(),
        num_children: numChildren,
        children_ages: ages
      });
      overlay.innerHTML = `
        <div style="max-width:520px;width:95%;background:#fff;border-radius:28px;padding:3rem 2.5rem;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,0.2);">
          <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
          <h2 style="font-size:1.5rem;font-weight:900;color:#1e293b;margin-bottom:0.75rem;">You're on the list!</h2>
          <p style="color:#64748b;margin-bottom:2rem;">Thank you for registering your interest. We'll be in touch as soon as Urban Tribe launches near you.</p>
          <button onclick="document.getElementById('interest-modal-overlay').remove()" class="btn btn-primary" style="width:auto;padding:0.9rem 2.5rem;border-radius:100px;">Close</button>
        </div>`;
    } catch (err) {
      console.error('Interest registration error:', err);
      errEl.textContent = 'Something went wrong: ' + err.message;
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Send My Interest ✉️';
    }
  };
};

async function initApp() {
  console.log('--- initApp Started ---');
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Session status:', session ? 'Logged in' : 'Logged out');

  if (!authListenerAttached) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY') { renderUpdatePasswordForm() }
      else if (session) {
        // Only perform profile check and re-render for major auth events
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          await ensureProfile(session.user);
          renderDashboard('dash');
        }
      }
      else {
        if (event !== 'INITIAL_SESSION') renderLandingPage();
      }
    });
    authListenerAttached = true;
  }

  const hash = window.location.hash;
  if (session) {
    await ensureProfile(session.user);
    renderDashboard('dash');
  } else {
    if (hash === '#privacy') renderPrivacyPolicy();
    else if (hash === '#terms') renderTerms();
    else renderLandingPage();
  }
}

// Global router for deep links
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (!supabase.auth.getSession()) return; // Don't route if not loaded

  if (hash === '#privacy') renderPrivacyPolicy();
  else if (hash === '#terms') renderTerms();
  else if (hash === '' || hash === '#home') renderLandingPage();
});

async function ensureProfile(user) {
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!data) { await supabase.from('profiles').insert([{ id: user.id, full_name: user.email.split('@')[0], role: 'parent' }]) }
}

function renderLogin() {
  app.innerHTML = `
    <div class="container fade-up" style="max-width: 440px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 2rem;">
      <header style="text-align: center; margin-bottom: 2.5rem;">
        <img src="${logo}" alt="Urban Tribe" style="width: 180px; margin-bottom: 1rem;">
        <p style="font-weight: 700; color: var(--primary-color); font-size: 0.95rem; letter-spacing: 0.05em; text-transform: uppercase;">A Joyful Reset</p>
      </header>
      
      <div class="card" style="padding: 2.5rem;">
        <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; text-align: center;">Welcome back</h2>
        <p style="text-align: center; color: #64748b; margin-bottom: 2rem; font-size: 0.95rem;">Sign in to manage your tribe</p>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
          <button id="g-login" class="btn btn-outline" style="background: #fff; border-color: #e2e8f0; font-weight: 700; font-size: 0.9rem; color: #1e293b;">
            <img src="https://www.google.com/favicon.ico" style="width: 18px; margin-right: 12px;"> Continue with Google
          </button>
        </div>

        <div class="divider" style="margin: 1.5rem 0; color: #cbd5e1; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">or continue with email</div>

        <form id="l-form">
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label style="font-weight: 700; color: #475569; font-size: 0.85rem; margin-bottom: 0.5rem;">Email Address</label>
            <input type="email" id="l-email" placeholder="name@example.com" required style="border-radius: 12px;">
          </div>
          <div class="form-group" style="margin-bottom: 1.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <label style="font-weight: 700; color: #475569; font-size: 0.85rem; margin: 0;">Password</label>
              <a href="#" id="f-pass" style="font-size: 0.8rem; color: var(--primary-color); font-weight: 700; text-decoration: none;">Forgot?</a>
            </div>
            <input type="password" id="l-password" placeholder="••••••••" required style="border-radius: 12px;">
          </div>
          <button type="submit" id="l-btn" class="btn btn-primary" style="padding: 1rem;">Sign In</button>
        </form>
      </div>

      <p style="text-align: center; margin-top: 2rem; color: #64748b; font-size: 0.95rem; font-weight: 600;">
        New to Urban Tribe? <a href="#" id="s-signup" style="color: var(--primary-color); font-weight: 800; text-decoration: none; margin-left: 4px;">Create an account</a>
      </p>
    </div>
  `;
  document.getElementById('g-login').onclick = signInWithGoogle;
  document.getElementById('f-pass').onclick = (e) => { e.preventDefault(); renderForgotPassword(); };
  document.getElementById('s-signup').onclick = (e) => { e.preventDefault(); renderSignUp(); };
  document.getElementById('l-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('l-btn');
    btn.disabled = true; btn.textContent = '...';
    try {
      await signInWithEmail(document.getElementById('l-email').value, document.getElementById('l-password').value);
    } catch (error) {
      alert(error.message);
      btn.disabled = false; btn.textContent = 'Sign In';
    }
  };
}

function renderForgotPassword() {
  app.innerHTML = `<div class="container text-center"><header class="mt-4"><img src="${logo}" alt="Urban Tribe" style="width: 150px; margin-bottom: 0.5rem;"><p>Reset Your Password</p></header><div class="card mt-4"><p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">Enter your email and we'll send you a link to reset your password.</p><form id="f-form"><div class="form-group"><label>Email</label><input type="email" id="f-email" required></div><button type="submit" id="f-btn" class="btn btn-primary">Send Reset Link</button></form><p class="mt-4"><a href="#" id="back-to-login">Back to Sign In</a></p></div></div>`
  document.getElementById('back-to-login').onclick = (e) => { e.preventDefault(); renderLogin(); }
  document.getElementById('f-form').onsubmit = async (e) => { e.preventDefault(); const btn = document.getElementById('f-btn'); btn.disabled = true; btn.textContent = 'Sending...'; try { await resetPassword(document.getElementById('f-email').value); alert('Check your email!'); renderLogin(); } catch (error) { alert(error.message); btn.disabled = false; btn.textContent = 'Send Reset Link' } }
}

function renderUpdatePasswordForm() {
  app.innerHTML = `<div class="container text-center"><header class="mt-4"><img src="${logo}" alt="Urban Tribe" style="width: 150px; margin-bottom: 0.5rem;"><p>Set New Password</p></header><div class="card mt-4"><form id="u-form"><div class="form-group"><label>New Password</label><input type="password" id="u-pass" required minlength="6"></div><button type="submit" id="u-btn" class="btn btn-primary">Update Password</button></form></div></div>`
  document.getElementById('u-form').onsubmit = async (e) => { e.preventDefault(); const btn = document.getElementById('u-btn'); btn.disabled = true; try { await updatePassword(document.getElementById('u-pass').value); alert('Success!'); initApp(); } catch (error) { alert(error.message); btn.disabled = false; } }
}

function renderSignUp() {
  app.innerHTML = `
    <div class="container fade-up" style="max-width: 440px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 2rem;">
      <header style="text-align: center; margin-bottom: 2.5rem;">
        <img src="${logo}" alt="Urban Tribe" style="width: 180px; margin-bottom: 1rem;">
        <p style="font-weight: 700; color: var(--primary-color); font-size: 0.95rem; letter-spacing: 0.05em; text-transform: uppercase;">Join the tribe</p>
      </header>

      <div class="card" style="padding: 2.5rem;">
        <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; text-align: center;">Get Started</h2>
        <p style="text-align: center; color: #64748b; margin-bottom: 2rem; font-size: 0.95rem;">Create a joyful reset for your family</p>

        <form id="s-form">
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label style="font-weight: 700; color: #475569; font-size: 0.85rem; margin-bottom: 0.5rem;">Email Address</label>
            <input type="email" id="s-email" placeholder="name@example.com" required style="border-radius: 12px;">
          </div>
          <div class="form-group" style="margin-bottom: 1.75rem;">
            <label style="font-weight: 700; color: #475569; font-size: 0.85rem; margin-bottom: 0.5rem;">Choose Password</label>
            <input type="password" id="s-password" placeholder="At least 6 characters" required minlength="6" style="border-radius: 12px;">
          </div>
          <button type="submit" id="s-btn" class="btn btn-primary" style="padding: 1rem;">Create Account</button>
        </form>
      </div>

      <p style="text-align: center; margin-top: 2rem; color: #64748b; font-size: 0.95rem; font-weight: 600;">
        Already have an account? <a href="#" id="s-login" style="color: var(--primary-color); font-weight: 800; text-decoration: none; margin-left: 4px;">Sign in instead</a>
      </p>
    </div>
  `;
  document.getElementById('s-login').onclick = (e) => { e.preventDefault(); renderLogin(); };
  document.getElementById('s-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('s-btn');
    btn.disabled = true; btn.textContent = '...';
    try {
      await signUpWithEmail(document.getElementById('s-email').value, document.getElementById('s-password').value);
      alert('Account created! Please check your email or sign in.');
      renderLogin();
    } catch (error) {
      alert(error.message);
      btn.disabled = false; btn.textContent = 'Create Account';
    }
  };
}

function renderPrivacyPolicy() {
  window.scrollTo(0, 0);
  app.innerHTML = `
    <div class="container fade-up" style="max-width: 800px; padding: 4rem 1rem;">
      <button onclick="renderLandingPage()" class="btn btn-outline" style="margin-bottom: 2rem; border-radius: 100px;">← Back to Home</button>
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #1e293b; margin-bottom: 1.5rem;">Privacy Policy</h1>
      <p style="color: #64748b; margin-bottom: 2rem;">Last Updated: April 2024</p>
      
      <div class="card" style="padding: 2.5rem; line-height: 1.8; color: #334155;">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">1. Introduction</h2>
          <p>Welcome to Urban Tribe. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">2. The Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul>
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
            <li><strong>Profile Data:</strong> includes your interests, preferences, feedback and survey responses.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          </ul>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>To register you as a new customer/member.</li>
            <li>To process and deliver your activity bookings.</li>
            <li>To manage our relationship with you.</li>
            <li>To enable you to partake in a prize draw, competition or complete a survey.</li>
          </ul>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">4. Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">5. Contact Us</h2>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: <strong>hello@urbantribe.co.uk</strong></p>
        </section>
      </div>
    </div>
  `;
}

function renderTerms() {
  window.scrollTo(0, 0);
  app.innerHTML = `
    <div class="container fade-up" style="max-width: 800px; padding: 4rem 1rem;">
      <button onclick="renderLandingPage()" class="btn btn-outline" style="margin-bottom: 2rem; border-radius: 100px;">← Back to Home</button>
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #1e293b; margin-bottom: 1.5rem;">Terms & Conditions</h1>
      <p style="color: #64748b; margin-bottom: 2rem;">Last Updated: April 2024</p>
      
      <div class="card" style="padding: 2.5rem; line-height: 1.8; color: #334155;">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">1. Acceptance of Terms</h2>
          <p>By accessing and using Urban Tribe, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">2. Activity Bookings</h2>
          <p>All activities booked through the platform are subject to availability. Urban Tribe reserves the right to cancel or reschedule activities. In the event of a cancellation by Urban Tribe, a full refund or credit will be provided.</p>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">3. Safety & Liability</h2>
          <p>Parents and guardians are responsible for the supervision of their children at all times while participating in Urban Tribe activities, unless otherwise stated for specific "drop-off" sessions. You agree to follow all safety instructions provided by staff and partners.</p>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">4. User Conduct</h2>
          <p>Urban Tribe is a community-focused platform. We expect all users to behave with respect and kindness towards other members, children, and staff. We reserve the right to terminate access for any user who violates our community standards.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">5. Changes to Terms</h2>
          <p>Urban Tribe reserves the right to change these conditions from time to time as it sees fit and your continued use of the site will signify your acceptance of any adjustment to these terms.</p>
        </section>
      </div>
    </div>
  `;
}

function formatReactors(likes, currentUserId) {
  if (!likes || likes.length === 0) return '';
  const names = likes.map(l => l.user_id === currentUserId ? 'You' : (l.profiles?.full_name || l.profiles?.name || 'Someone')).filter(Boolean);
  const uniqueNames = [...new Set(names)];
  if (uniqueNames.includes('You')) {
    uniqueNames.splice(uniqueNames.indexOf('You'), 1);
    uniqueNames.unshift('You');
  }
  const count = uniqueNames.length;
  if (count === 0) return '';
  let text = '';
  if (count === 1) text = `<b>${uniqueNames[0]}</b>`;
  else if (count === 2) text = `<b>${uniqueNames[0]}</b> and <b>${uniqueNames[1]}</b>`;
  else if (count === 3) text = `<b>${uniqueNames[0]}</b>, <b>${uniqueNames[1]}</b> and <b>${uniqueNames[2]}</b>`;
  else text = `<b>${uniqueNames[0]}</b>, <b>${uniqueNames[1]}</b>, <b>${uniqueNames[2]}</b> and <b>${count - 3} others</b>`;
  return `<div class="reactors-text" style="font-size: 0.825rem; color: #475569; margin-top: 0.75rem; display: flex; align-items: flex-start; gap: 6px; padding-top: 0.75rem; border-top: 1px solid #f1f5f9;">
    <span style="color: var(--primary-color); font-size: 1rem; line-height: 1;">❤</span> <span>${text} reacted to this</span>
  </div>`;
}

window.renderDashboard = renderDashboard;
async function renderDashboard(activeTab = 'dash') {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return renderLogin();

  // Handle Stripe Redirects
  const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
  if (params.get('success')) {
    alert('Payment Successful! Your booking is being processed.');
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash.split('?')[0]);
  } else if (params.get('canceled')) {
    alert('Payment Canceled.');
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash.split('?')[0]);
  }

  let profile = {};
  try {
    profile = await getMyProfile();
  } catch (err) {
    profile = { role: 'parent' };
  }

  if (user.email === 'hakan1723@hotmail.com' || profile?.role === 'admin') {
    return renderAdminDashboard();
  }
  if (user.email === 'adele@mangledtout.com' || profile?.role === 'provider') {
    return renderProviderDashboard();
  }

  const isBusiness = user.email === 'adele@mangledtout.com' || profile?.role === 'provider' || user.email === 'hakan1723@hotmail.com' || profile?.role === 'admin';
  if (!isBusiness) {
    const children = await getMyChildren();
    if (children.length === 0) return renderOnboarding();
  }

  app.innerHTML = `
    <div class="container" style="padding-bottom: 100px; background: #f8fafc; min-height: 100vh;">
      <header style="display: flex; flex-direction: column; align-items: center; margin-top: 1.5rem; margin-bottom: 2rem; gap: 12px;">
        <img src="${logo}" alt="Urban Tribe" style="height: 40px;">
        <h1 style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">${activeTab === 'dash' ? 'Dash' : 'Activities'}</h1>
      </header>
      <main class="fade-up">
        ${activeTab === 'dash' ? `
          <!-- DASH TAB -->
          <section>
            <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem;">Upcoming</h2>
            <div id="ledger-list">Loading...</div>
          </section>
          <section class="mt-4">
            <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem;">Friends Feed</h2>
            <div id="friends-feed" style="display: flex; flex-direction: column; gap: 1rem;">Loading feed...</div>
          </section>
          <section class="mt-4">
            <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem;">Community News</h2>
            <div id="news-summary-list" style="display: flex; flex-direction: column; gap: 0.75rem;">Loading news...</div>
          </section>
        ` : `
          <!-- ACTIVITIES TAB -->
          <section>
            <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem;">Explore Activities</h2>
            <div id="a-list">Loading...</div>
          </section>
        `}
      </main>
    </div>
    ${renderBottomNav(activeTab, profile)}
  `;

  updateUnreadBadges();
  attachNavEvents();

  if (activeTab === 'dash') {
    renderUpcomingBookings();
    renderSocialFeed();
    renderNewsSummary();
  } else {
    renderActivities();
  }

  app.insertAdjacentHTML('beforeend', '<div id="enroll-modal" class="cropper-modal-overlay" style="display:none;"></div>');
}

// --- DASHBOARD SUB-RENDERERS ---

async function renderNewsSummary() {
  try {
    const news = await getNews();
    const newsEl = document.getElementById('news-summary-list');
    if (!newsEl) return;
    if (!news.length) {
      newsEl.innerHTML = '<p style="color: #64748b; font-size: 0.85rem; text-align: center; padding: 1rem; background: #f8fafc; border-radius: 12px;">No news yet.</p>';
      return;
    }
    newsEl.innerHTML = news.slice(0, 3).map(n => `
      <div class="card" onclick="window.renderNewsTab()" style="padding: 1rem; margin-bottom: 0; cursor: pointer; display: flex; align-items: center; gap: 1rem; border: 1px solid #f1f5f9; box-shadow: none;">
        ${n.photo_url ? `<img src="${n.photo_url}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">` : `<div style="width: 50px; height: 50px; border-radius: 10px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">${n.type === 'poll' ? '📊' : '📰'}</div>`}
        <div style="flex: 1;">
          <p style="font-weight: 700; color: #1e293b; font-size: 0.9rem; margin-bottom: 4px;">${n.title || 'Community Update'}</p>
          <p style="font-size: 0.75rem; color: #64748b;">by ${n.providers?.business_name || 'Urban Tribe'}</p>
        </div>
        <span style="color: #94a3b8;">→</span>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    if (document.getElementById('news-summary-list')) {
      document.getElementById('news-summary-list').innerHTML = '<p style="color: #ef4444; font-size: 0.8rem;">Failed to load news.</p>';
    }
  }
}

async function renderSocialFeed() {
  try {
    const rawFeed = await getFriendsActivities();
    const grouped = {};
    rawFeed.forEach(item => {
      const key = `${item.parent_id}_${item.activity_id}_${item.event_date}`;
      if (!grouped[key]) {
        grouped[key] = { ...item, attendeeNames: [] };
      }
      const name = item.children?.name || item.profiles?.full_name;
      if (name && !grouped[key].attendeeNames.includes(name)) {
        grouped[key].attendeeNames.push(name);
      }
    });
    const feed = Object.values(grouped);

    const feedEl = document.getElementById('friends-feed');
    if (!feedEl) return;
    if (!feed.length) {
      feedEl.innerHTML = `
        <div style="min-width: 280px; background: #f8fafc; padding: 1.5rem; border-radius: 20px; border: 2px dashed #e2e8f0; text-align: center;">
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">👋</p>
          <p style="font-size: 0.85rem; color: #64748b; font-weight: 600;">No friend updates yet.</p>
          <button onclick="window.renderFriendsTab()" style="margin-top: 10px; background: none; border: none; color: var(--primary-color); font-weight: 700; font-size: 0.8rem; cursor: pointer; text-decoration: underline;">Connect with others to start</button>
        </div>
      `;
      return;
    }
    const invoices = await getMyInvoices();
    const mySessions = new Set(invoices.map(i => `${i.activity_id}-${i.event_date}`));

    feedEl.innerHTML = feed.map(item => {
      const namesStr = item.attendeeNames.map(name => `<span style="color: var(--primary-color); font-weight: 800;">${name}</span>`).join(' <span style="color: #94a3b8; font-weight: 400;">&</span> ');
      const verb = item.attendeeNames.length > 1 ? 'are' : 'is';
      const isJoined = mySessions.has(`${item.activity_id}-${item.event_date}`);

      return `
      <div class="card" style="margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #e0f2fe; color: #0369a1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; border: 1px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow: hidden;">
            ${item.profiles?.photo_url ? `<img src="${item.profiles.photo_url}" style="width:100%; height:100%; object-fit:cover;">` : (item.profiles?.full_name?.[0] || '?')}
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">${item.profiles?.full_name || 'Someone'}</span>
        </div>
        <p style="font-size: 0.85rem; color: #64748b; line-height: 1.4; margin-bottom: 12px;">
          ${namesStr} ${verb} attending <span style="font-weight: 700; color: #1e293b;">${item.activities?.name}</span>
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <span style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; background: #f8fafc; padding: 4px 10px; border-radius: 6px;">🗓️ ${item.event_date}</span>
          ${isJoined ? `
            <div style="color: #059669; font-weight: 800; font-size: 0.75rem; background: #f0fdf4; padding: 4px 12px; border-radius: 8px; border: 1px solid #dcfce7; display: flex; align-items: center; gap: 4px;">
              Joined ✅
            </div>
          ` : `
            <button onclick='window.joinFriendActivity(${JSON.stringify(item.activities)}, "${item.event_date}")' class="btn btn-primary" style="width: auto; padding: 6px 16px; border-radius: 10px; font-size: 0.8rem;">Join Them</button>
          `}
        </div>
      </div>
    `}).join('');
  } catch (err) {
    console.error(err);
    if (document.getElementById('friends-feed')) {
      document.getElementById('friends-feed').innerHTML = '<p style="color: #ef4444; font-size: 0.8rem;">Failed to load feed.</p>';
    }
  }
}

async function renderActivities() {
  try {
    const [allActivities, bookings] = await Promise.all([getActivities(), getAllBookings()]);
    const today = new Date().toISOString().split('T')[0];
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    const activities = allActivities.filter(a => {
      if (a.recurrence) return true;
      if (!a.event_dates || a.event_dates.length === 0) return true;
      return a.event_dates.some(d => d >= today);
    });

    const listEl = document.getElementById('a-list');
    if (!listEl) return;

    listEl.innerHTML = activities.length ? activities.map(a => `
      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-radius: 24px; margin-bottom: 1.5rem;">
        ${a.photo_url ? `<img src="${a.photo_url}" style="width: 100%; height: 200px; object-fit: cover; display: block;">` : `<div style="width: 100%; height: 140px; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 0.9rem;">No Image Available</div>`}
        <div style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem;">
            <div style="flex: 1;">
              <h3 style="font-size: 1.35rem; font-weight: 900; color: #1e293b; margin: 0 0 4px 0; line-height: 1.2;">${a.name}</h3>
              <p style="font-size: 0.85rem; color: var(--primary-color); font-weight: 800; margin: 0;">by ${a.providers?.business_name || 'Urban Tribe'}</p>
            </div>
            <div style="background: #f0fdf4; padding: 0.5rem 0.75rem; border-radius: 12px; border: 1px solid #dcfce7; text-align: right; min-width: 90px;">
              <div style="font-size: 0.95rem; font-weight: 900; color: #059669; line-height: 1.1;"><span style="font-size: 0.6rem; text-transform: uppercase; margin-right: 4px; font-weight: 700; color: #64748b;">Child</span>£${a.price_child}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #475569; margin-top: 4px; line-height: 1.1;"><span style="font-size: 0.6rem; text-transform: uppercase; margin-right: 4px; font-weight: 700; color: #94a3b8;">Adult</span>£${a.price_adult}</div>
            </div>
          </div>
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
            <button id="like-act-${a.id}" onclick='window.handleToggleActivityLike("${a.id}", "like-act-${a.id}", "count-act-${a.id}", "reactors-act-${a.id}")' data-liked="${a.activity_likes?.some(l => l.user_id === user?.id) || false}" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0;">
              ${a.activity_likes?.some(l => l.user_id === user?.id) ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 18px; height: 18px; color: #ef4444;"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 18px; height: 18px; color: #64748b;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`}
              <span style="font-size: 0.8rem; color: #64748b; font-weight: 700;">${a.activity_likes?.length || 0}</span>
            </button>
            <button onclick='window.handleViewActivitySocial(${JSON.stringify(a).replace(/'/g, "&apos;")})' style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 18px; height: 18px; color: #64748b;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028Z" />
              </svg>
              <span style="font-size: 0.8rem; color: #64748b; font-weight: 700;">${a.comments?.length || 0}</span>
            </button>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 4px;">🕒 ${a.start_time?.slice(0, 5)} - ${a.end_time?.slice(0, 5)}</span>
            <span style="font-size: 0.75rem; background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 4px;">📍 ${a.location_type}</span>
          </div>
          <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${a.description || 'No description provided.'}</p>
          <button onclick='window.renderActivityDateSelection(${JSON.stringify(a).replace(/'/g, "&apos;")})' class="btn btn-primary" style="width: 100%; padding: 1rem; font-weight: 800; border-radius: 16px; font-size: 1rem; box-shadow: 0 8px 25px rgba(166, 206, 57, 0.3);">Purchase Ticket</button>
        </div>
      </div>
    `).join('') : '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No activities available yet.</p>';

    window.renderActivityDateSelection = async (activity) => {
      const modal = document.createElement('div');
      modal.className = 'cropper-modal-overlay';
      modal.style.display = 'flex';
      modal.style.zIndex = '3000';
      modal.style.padding = '1rem';
      const today = new Date().toISOString().split('T')[0];
      const dates = (activity.event_dates || []).filter(d => d >= today).sort();
      const capacity = activity.max_children || 20;

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; width: 100%; background: #fff; border-radius: 24px; padding: 2rem; text-align: center; position: relative; max-height: 90vh; overflow-y: auto;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem;">Select a Date</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">${activity.name}</p>
          <div id="calendar-grid" style="display: grid; grid-template-columns: 1fr; gap: 12px;">
            <div style="text-align: center; padding: 2rem;"><p style="color: #64748b;">Checking availability...</p></div>
          </div>
          <button onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-outline" style="margin-top: 2rem; width: 100%;">Cancel</button>
        </div>
      `;
      document.body.appendChild(modal);

      const grid = modal.querySelector('#calendar-grid');
      const actStr = JSON.stringify(activity).replace(/'/g, "&apos;");
      const bookings = await getAllBookings();
      const dateButtons = await Promise.all(dates.map(async (d) => {
        const taken = bookings.filter(b => b.activity_id === activity.id && b.event_date === d && b.status === 'paid').length;
        const isFull = taken >= capacity;
        return `
          <button onclick='this.closest(".cropper-modal-overlay").remove(); ${isFull ? `window.openWaitlistModal(${actStr}, "${d}")` : `window.openEnrollModal(${actStr}, "${d}")`}' 
                  style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border-radius: 16px; border: 2px solid ${isFull ? '#fee2e2' : '#dcfce7'}; background: ${isFull ? '#fef2f2' : '#f0fdf4'}; cursor: pointer; transition: transform 0.1s; text-align: left;">
            <div>
              <div style="font-weight: 800; color: #1e293b; font-size: 1rem;">${new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">${activity.start_time?.slice(0, 5)} - ${activity.end_time?.slice(0, 5)}</div>
            </div>
            <div style="text-align: right;">
              <div style="padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; background: ${isFull ? '#ef4444' : '#22c55e'}; color: #fff; margin-bottom: 4px;">
          </button>
        `;
      }));
      grid.innerHTML = dateButtons.join('') || '<p style="color: #64748b; padding: 2rem;">No upcoming dates found.</p>';
    };
  } catch (err) {
    console.error(err);
  }
}

// --- SHARED UI COMPONENTS ---
function renderBookingCardHtml(g) {
  const namesSet = new Set();
  let totalAdults = 0;
  let totalAmount = 0;
  let isPaid = false;

  g.items.forEach(item => {
    if (item.children?.name) namesSet.add(item.children.name);
    totalAdults += (item.adult_count || 0);
    totalAmount += (item.amount || 0);
    if (item.status === 'paid') isPaid = true;
  });

  const names = Array.from(namesSet);
  if (totalAdults > 0) names.push(`${totalAdults} Adult${totalAdults > 1 ? 's' : ''}`);
  const namesHtml = names.map(name => `<span style="color: var(--primary-color); font-weight: 800;">${name}</span>`).join(' <span style="color: #94a3b8; font-weight: 400;">&</span> ');

  const activityName = g.activities?.name || g.name || 'Activity';
  const startTime = g.activities?.start_time || g.startTime || '00:00';
  const endTime = g.activities?.end_time || g.endTime || '00:00';

  return `
    <div class="booking-card" style="position: relative; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border-left: 6px solid var(--primary-color); transition: transform 0.2s; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
        <div style="flex: 1;">
          <h4 style="font-weight: 900; color: #1e293b; font-size: 1.2rem; margin: 0 0 6px 0;">${activityName}</h4>
          <p style="font-size: 0.95rem; color: #64748b; margin: 0; line-height: 1.4;">
            ${namesHtml}
          </p>
        </div>
        <div style="text-align: right; min-width: 90px;">
          <p style="font-weight: 900; color: #1e293b; margin: 0; font-size: 1.1rem;">£${totalAmount.toFixed(2)}</p>
          <div style="display: inline-block; font-size: 0.65rem; font-weight: 800; color: ${isPaid ? 'var(--success)' : 'var(--warning)'}; background: ${isPaid ? '#f0fdf4' : '#fffbeb'}; padding: 2px 8px; border-radius: 6px; border: 1px solid ${isPaid ? '#dcfce7' : '#fef3c7'}; margin-top: 4px; text-transform: uppercase;">
            ${isPaid ? 'Paid' : 'Pending'}
          </div>
          <button onclick='alert("Editing is coming soon!")' class="btn btn-outline" style="display: block; width: 100%; margin-top: 12px; padding: 4px; font-size: 0.75rem; border-radius: 8px;">Edit</button>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 0.85rem; font-weight: 700; background: #f8fafc; padding: 6px 14px; border-radius: 12px; border: 1px solid #f1f5f9;">
          <span>🗓️</span> ${g.event_date || g.date}
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 0.85rem; font-weight: 700; background: #f8fafc; padding: 6px 14px; border-radius: 12px; border: 1px solid #f1f5f9;">
          <span>⏰</span> ${startTime} - ${endTime}
        </div>
      </div>
    </div>
  `;
}

async function renderUpcomingBookings() {
  try {
    const invoices = await getMyInvoices();
    console.log('Fetched Invoices Details:', invoices.map(i => ({ id: i.id, date: i.event_date, status: i.status, activity: i.activities?.name })));
    const ledgerEl = document.getElementById('ledger-list');
    if (!ledgerEl) return;

    const groupedBookings = invoices.reduce((acc, i) => {
      const key = `${i.activity_id}-${i.event_date}`;
      if (!acc[key]) {
        acc[key] = { ...i, items: [i] };
      } else {
        acc[key].items.push(i);
        if (i.status === 'paid' && acc[key].status !== 'paid') {
          acc[key].status = 'paid';
        }
      }
      return acc;
    }, {});

    const bookingsArr = Object.values(groupedBookings);
    if (!bookingsArr.length) {
      ledgerEl.innerHTML = '<div class="card" style="text-align: center; padding: 2.5rem; border: 2px dashed #e2e8f0; background: #f8fafc; border-radius: 24px;"><p style="color: #94a3b8; font-weight: 600; font-size: 0.9rem;">No bookings found yet.</p></div>';
      return;
    }

    ledgerEl.innerHTML = bookingsArr.map(g => renderBookingCardHtml(g)).join('');
  } catch (err) {
    console.error('Error in renderUpcoming:', err);
  }
}

window.renderNewsTab = renderNewsTab;
async function renderNewsTab() {
  const profile = await getMyProfile().catch(() => ({}));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-news').classList.add('active');

  app.innerHTML = `<div class="container" style="padding-bottom: 80px;">
    <header style="display: flex; flex-direction: column; align-items: center; margin-top: 1.5rem; margin-bottom: 2rem; gap: 12px;">
      <img src="${logo}" alt="Urban Tribe" style="height: 40px;">
      <h1 style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">Community News</h1>
    </header>
    <main>
      <div id="news-list" style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="text-align: center; padding: 2rem;"><p style="color: var(--text-muted);">Loading news...</p></div>
      </div>
    </main>
  </div>
    ${renderBottomNav('news', profile)}
  `;
  attachNavEvents();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const newsData = await getNews();
    const listEl = document.getElementById('news-list');

    if (!newsData.length) {
      listEl.innerHTML = `<div class="card" style="text-align: center; padding: 3rem;"><p style="color: var(--text-muted);">No news posted yet.</p></div>`;
      return;
    }
    listEl.innerHTML = newsData.map(n => {
      const providerName = n.providers?.business_name || 'Urban Tribe Provider';
      const dateStr = new Date(n.created_at).toLocaleDateString();
      const isPoll = n.type === 'poll';
      const options = n.metadata?.options || [];
      const votes = n.comments?.filter(c => c.content?.startsWith('[VOTE:')) || [];
      const totalVotes = votes.length;
      const voteCounts = options.map((_, i) => votes.filter(v => v.content === `[VOTE:${i}]`).length);

      return `
        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1rem;">
          ${n.photo_url ? `<img src="${n.photo_url}" style="width: 100%; height: 200px; object-fit: cover; display: block;">` : ''}
          <div style="padding: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <p style="font-size: 0.75rem; color: var(--primary-color); font-weight: 800; margin: 0; text-transform: uppercase;">${providerName} ${isPoll ? '<span style="background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-size: 0.65rem;">POLL</span>' : ''}</p>
              <div style="display: flex; align-items: center; gap: 16px;">
                <button id="like-news-${n.id}" onclick='window.handleToggleNewsLike("${n.id}", "like-news-${n.id}", "count-news-${n.id}", "reactors-news-${n.id}")' data-liked="${n.news_likes?.some(l => l.user_id === user?.id) || false}" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0;">
                  ${n.news_likes?.some(l => l.user_id === user?.id) ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; color: #ef4444;"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`}
                  <span style="font-size: 0.8rem; color: #64748b; font-weight: 500;">Like</span>
                </button>
                <button onclick='window.handleViewNewsSocial(${JSON.stringify(n).replace(/'/g, "&apos;")})' style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px; color: #64748b;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028Z" />
                  </svg>
                  <span style="font-size: 0.8rem; color: #64748b; font-weight: 500;">Comment</span>
                </button>
              </div>
            </div>
            
            <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: #1e293b; font-weight: 800;">${n.title}</h3>
            
            ${isPoll ? `
              <div id="poll-ui-${n.id}" style="background: #f8fafc; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; border: 1px solid #f1f5f9;">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${options.map((opt, idx) => {
        const count = voteCounts[idx] || 0;
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        const hasVoted = votes.some(v => v.user_id === user?.id);
        return `
                      <button onclick="window.handleVote('${n.id}', ${idx})" class="btn btn-outline" style="width: 100%; text-align: left; background: #fff; justify-content: space-between; padding: 10px 16px; border-radius: 10px; font-weight: 600; font-size: 0.9rem; position: relative; overflow: hidden; border: 1px solid ${hasVoted ? '#8b5cf6' : '#e2e8f0'};">
                        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${percent}%; background: rgba(139, 92, 246, 0.1); transition: width 0.3s; pointer-events: none;"></div>
                        <span style="position: relative; z-index: 1;">${opt}</span>
                        <span style="position: relative; z-index: 1; color: #64748b; font-weight: 400; font-size: 0.8rem;">${percent}%</span>
                      </button>
                    `;
      }).join('')}
                </div>
                <p style="font-size: 0.7rem; color: #94a3b8; margin-top: 10px; text-align: center;">${totalVotes} votes total</p>
              </div>
            ` : `
              <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; white-space: pre-line;">${n.description}</p>
            `}
            
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #94a3b8;">
              <div id="reactors-news-${n.id}">${formatReactors(n.news_likes, user?.id)}</div>
              <span>${dateStr}</span>
            </div>
            <div id="comments-news-${n.id}" style="display: none; margin-top: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1rem;"></div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error(error);
    document.getElementById('news-list').innerHTML = `<p style="color: red; text-align: center;">Error loading news.</p>`;
  }
}

window.handleVote = async (newsId, optionIdx) => {
  console.log('handleVote called', { newsId, optionIdx });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert('Please sign in to vote');
  try {
    const { data: existing, error: checkErr } = await supabase.from('comments').select('id').eq('news_id', newsId).eq('user_id', user.id).ilike('content', '[VOTE:%]');
    if (checkErr) throw checkErr;
    if (existing?.length) return alert('You have already voted in this poll');

    console.log('Inserting vote...');
    const { error: insErr } = await supabase.from('comments').insert([{
      news_id: newsId,
      user_id: user.id,
      content: `[VOTE:${optionIdx}]`,
      entity_type: 'news'
    }]);
    if (insErr) throw insErr;

    console.log('Vote inserted, re-rendering...');
    renderNewsTab();
  } catch (err) {
    console.error('Vote error:', err);
    alert(err.message);
  }
};
window.openWaitlistModal = async (activity, selectedDate) => {
  const [children, profile] = await Promise.all([
    getMyChildren(),
    getMyProfile().catch(() => ({}))
  ]);
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '3000';
  modal.style.padding = '1rem';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 100%; background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto;">
      <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem; font-weight: 800; color: #1e293b;">Join Waiting List</h2>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem;">${activity.name} - ${selectedDate}</p>

      <div style="background: #fff8f1; padding: 1.25rem; border-radius: 16px; margin-bottom: 1.5rem; border: 1px solid #ffedd5; color: #9a3412; font-size: 0.85rem; font-weight: 600; line-height: 1.4;">
        ⚠️ This session is currently full. Join the waitlist and we'll notify you if a spot opens up!
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 700; color: #1e293b; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 10px;">Select Children</label>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${children.length ? children.map(c => `
            <label style="display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer;">
              <input type="checkbox" class="waitlist-child" value="${c.name}" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
              <span style="font-weight: 700; color: #1e293b;">${c.name}</span>
            </label>
          `).join('') : '<p style="color: #64748b; font-size: 0.85rem;">No children found. Add them in your profile.</p>'}
        </div>
      </div>

      <div style="margin-bottom: 1.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9;">
        <label style="display: block; font-weight: 700; color: #1e293b; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 10px;">Adults Joining</label>
        <select id="waitlist-adults" class="form-select" style="width: 100%; padding: 0.75rem; border-radius: 12px;">
          <option value="0">0 Adults</option>
          <option value="1">1 Adult</option>
          <option value="2">2 Adults</option>
          <option value="3">3 Adults</option>
        </select>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 2rem;">
        <button onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-outline" style="flex: 1; padding: 0.875rem; border-radius: 16px; font-weight: 800;">Cancel</button>
        <button id="btn-submit-waitlist" class="btn btn-primary" style="flex: 1; padding: 0.875rem; border-radius: 16px; font-weight: 800;">Join List</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('btn-submit-waitlist').onclick = async () => {
    const selectedChildren = Array.from(document.querySelectorAll('.waitlist-child:checked')).map(cb => cb.value);
    const adultCount = parseInt(document.getElementById('waitlist-adults').value);

    if (selectedChildren.length === 0 && adultCount === 0) {
      alert('Please select at least one person to join the waiting list.');
      return;
    }

    const btn = document.getElementById('btn-submit-waitlist');
    btn.disabled = true;
    btn.textContent = 'Joining...';

    try {
      await addToWaitingList({
        activity_id: activity.id,
        event_date: selectedDate,
        metadata: {
          children: selectedChildren,
          adult_count: adultCount,
          parent_name: profile.full_name || 'Parent',
          timestamp: new Date().toISOString()
        }
      });
      alert('Success! 🎉 You have been added to the waiting list. We will contact you if a space becomes available.');
      modal.remove();
    } catch (err) {
      alert('Failed to join waitlist: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Join List';
    }
  };
};

window.openEnrollModal = async (activity, preSelectedDate = null) => {
  const [children, profile, providerPerms] = await Promise.all([
    getMyChildren(),
    getMyProfile().catch(() => ({})),
    getProviderPermissions(activity.provider_id).catch(() => [])
  ]);
  const modal = document.getElementById('enroll-modal')
  const availableDates = activity.event_dates || (activity.recurrence ? [activity.recurrence] : ['TBD'])

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 90%; background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto;">
      <div id="enroll-step-1">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem; font-weight: 800; color: #1e293b;">Purchase Tickets</h2>
        <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem;">${activity.name}</p>

        <div style="background: #f0fdf4; padding: 1.25rem; border-radius: 16px; margin-bottom: 1.5rem; border: 1px solid #dcfce7;">
          <label style="display: block; font-weight: 700; color: #166534; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">1. Select Date</label>
          <select id="enroll-date" class="form-select" style="background: #fff; padding: 0.75rem; border-radius: 10px; border-color: #bbf7d0; font-weight: 600;">
            <option value="">Choose a date...</option>
            ${(() => {
      const dates = (activity.event_dates || []).filter(d => d >= new Date().toISOString().split('T')[0]);
      if (preSelectedDate && !dates.includes(preSelectedDate)) {
        dates.push(preSelectedDate);
        dates.sort();
      }
      return dates.map(d => `<option value="${d}">${d}</option>`).join('');
    })()}
            ${(!activity.event_dates && activity.recurrence && activity.recurrence !== preSelectedDate) ? `<option value="${activity.recurrence}">${activity.recurrence}</option>` : ''}
          </select>
          <div id="capacity-indicator" style="margin-top: 10px; display: none;"></div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-weight: 700; margin-bottom: 12px; color: #1e293b; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">2. Select Children (£${activity.price_child} ea)</label>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${children.map(c => `
              <label style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #fff; border: 1px solid #f1f5f9; border-radius: 14px; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${c.photo_url || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                  <span style="font-weight: 700; color: #1e293b;">${c.name}</span>
                </div>
                <input type="checkbox" name="select-kid" value="${c.id}" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
              </label>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: 1.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <label style="font-weight: 700; color: #1e293b; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">3. Adults (£${activity.price_adult} ea)</label>
            <select id="adult-count" class="form-select" style="width: 80px; padding: 0.5rem; border-radius: 10px;">
              ${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}</option>`).join('')}
            </select>
          </div>
          <div id="adult-names-container"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding: 1.25rem; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
          <span style="font-weight: 700; color: #64748b;">Total Amount:</span>
          <span id="enroll-total" style="font-size: 1.5rem; font-weight: 900; color: var(--primary-color);">£0.00</span>
        </div>
        <p id="adult-warning" style="display: none; color: #dc2626; font-size: 0.75rem; font-weight: 600; margin-bottom: 1.5rem; text-align: center;">⚠️ At least one adult is required for child bookings.</p>

        <div style="display: flex; gap: 12px;">
          <button id="enroll-cancel" class="btn btn-outline" style="flex: 1;">Cancel</button>
          <button id="go-to-contact" class="btn btn-primary" style="flex: 1;" disabled>Continue</button>
        </div>
      </div>

      <div id="enroll-step-2" style="display: none;">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem; font-weight: 800; color: #1e293b;">Contact Details</h2>
        <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem;">Where should we send your confirmation?</p>
        
        <div class="enroll-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div class="form-group" style="margin:0"><label style="font-size:0.75rem; font-weight:700; color:#1e293b; text-transform:uppercase;">First name *</label><input type="text" id="c-fname" value="${profile.metadata?.first_name || ''}" required style="padding:0.75rem; border-radius:10px; border:1px solid #e2e8f0;"></div>
          <div class="form-group" style="margin:0"><label style="font-size:0.75rem; font-weight:700; color:#1e293b; text-transform:uppercase;">Last name *</label><input type="text" id="c-lname" value="${profile.metadata?.last_name || ''}" required style="padding:0.75rem; border-radius:10px; border:1px solid #e2e8f0;"></div>
        </div>
        <div class="form-group"><label style="font-size:0.75rem; font-weight:700; color:#1e293b; text-transform:uppercase;">Email *</label><input type="email" id="c-email" value="${profile.email || ''}" required style="padding:0.75rem; border-radius:10px; border:1px solid #e2e8f0;"></div>
        <div class="enroll-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
          <div class="form-group" style="margin:0"><label style="font-size:0.75rem; font-weight:700; color:#1e293b; text-transform:uppercase;">Mobile number *</label><input type="tel" id="c-phone" value="${profile.phone || ''}" required style="padding:0.75rem; border-radius:10px; border:1px solid #e2e8f0;"></div>
          <div class="form-group" style="margin:0"><label style="font-size:0.75rem; font-weight:700; color:#1e293b; text-transform:uppercase;">Postcode *</label><input type="text" id="c-postcode" value="${profile.metadata?.postcode || ''}" required style="padding:0.75rem; border-radius:10px; border:1px solid #e2e8f0;"></div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">
          <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 0.85rem; color: #475569;">
            <input type="checkbox" id="c-subscribe" style="margin-top: 3px; width: 16px; height: 16px; accent-color: var(--primary-color);">
            I would like to subscribe to updates from ${activity.providers?.business_name || 'the provider'}
          </label>
          <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 0.85rem; color: #475569;">
            <input type="checkbox" id="c-terms" required style="margin-top: 3px; width: 16px; height: 16px; accent-color: var(--primary-color);">
            <span>I have read and accept the <a href="#" onclick="event.preventDefault(); window.openTermsModal('${encodeURIComponent(activity.providers?.terms_and_conditions || '').replace(/'/g, '%27')}')" style="color: #2563eb; text-decoration: underline;">${activity.providers?.business_name || 'the provider'}'s terms and conditions</a> <span style="color: #ef4444;">*</span></span>
          </label>
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="back-to-step-1" class="btn btn-outline" style="flex: 1; background: #f1f5f9; border: none; color: #1e293b; font-weight: 700;">Back</button>
          <button id="go-to-next-after-contact" class="btn btn-primary" style="flex: 1; font-weight: 700;">Continue</button>
        </div>
      </div>

      <div id="enroll-step-permissions" style="display: none;">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem; font-weight: 800; color: #1e293b;">Activity Permissions</h2>
        <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem;">Please review and confirm the following permissions required by ${activity.providers?.business_name || 'the provider'}:</p>
        
        <div id="permissions-container" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
          <!-- Will be injected dynamically to handle pre-filling -->
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="back-to-step-contact" class="btn btn-outline" style="flex: 1; background: #f1f5f9; border: none; color: #1e293b; font-weight: 700;">Back</button>
          <button id="go-to-waiver-final" class="btn btn-primary" style="flex: 1; font-weight: 700;">Continue</button>
        </div>
      </div>

      <div id="enroll-step-3" style="display: none;">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem; font-weight: 800; color: #1e293b;">Participant Waiver & Release of Liability</h2>
        <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem;">PLEASE READ THIS DOCUMENT CAREFULLY. BY SIGNING THIS, YOU ARE GIVING UP CERTAIN LEGAL RIGHTS.</p>
        
        <div style="background: #f8fafc; padding: 1rem; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #475569; margin-bottom: 1.5rem; max-height: 40vh; overflow-y: auto;">
          <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem;">1. Participant Information</h4>
          <p style="margin-bottom: 10px;"><strong>Adult Participant Name:</strong> <span id="w-adult-name" style="border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 200px;"></span></p>
          <p style="margin-bottom: 15px;"><strong>Minor(s) Names (under 18):</strong> <span id="w-minor-names" style="border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 200px;"></span></p>
          
          <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">2. Acknowledgment of Risks</h4>
          <p>I understand that participating in activities at Urban Tribe (including but not limited to inflatables, obstacle courses, and group games) involves inherent risks. These risks include, but are not limited to, trips, falls, collisions with other participants, and physical exertion. I acknowledge that these activities can result in physical injury, such as scratches, bruises, sprains, or more serious injuries.</p>

          <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">3. Physical Health & Safety</h4>
          <ul style="padding-left: 20px; margin-bottom: 1rem;">
            <li style="margin-bottom: 4px;"><strong>Fitness to Participate:</strong> I certify that I (and the minors listed above) am in good physical health and do not have any medical conditions that would make participation unsafe.</li>
            <li style="margin-bottom: 4px;"><strong>Safety Rules:</strong> I agree to follow all posted rules and verbal instructions from Urban Tribe staff. I have watched (or will watch) the required safety briefing before entering the activity zones.</li>
            <li style="margin-bottom: 4px;"><strong>Supervision:</strong> I understand that while Urban Tribe staff monitor the equipment, I am responsible for the supervision of the minors listed on this form at all times.</li>
          </ul>

          <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">4. Release of Liability</h4>
          <p>In consideration of being allowed to use the facilities, I hereby release, waive, and discharge Urban Tribe Ltd., its owners, employees, and agents from any and all claims, liabilities, or causes of action arising out of my participation or the participation of the minors listed above, except in cases of gross negligence or willful misconduct by the company.</p>

          <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">5. Media Release</h4>
          <p style="margin-bottom: 1rem;">I consent to Urban Tribe taking photos or videos of me/my children for marketing and social media purposes. I understand no personal names will be used without further specific consent.</p>

          <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem;">6. Signature</h4>
          <p>I have read this waiver in its entirety and understand that I am signing it on behalf of myself and the minors listed above.</p>
          <p style="margin-top: 10px;"><strong>Date:</strong> <span id="w-date" style="border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 100px;"></span></p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">
          <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 0.85rem; color: #475569;">
            <input type="checkbox" id="w-accept" required style="margin-top: 3px; width: 16px; height: 16px; accent-color: var(--primary-color);">
            <span style="font-weight: bold;">I have read this waiver in its entirety and accept it. <span style="color: #ef4444;">*</span></span>
          </label>
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="back-to-step-2" class="btn btn-outline" style="flex: 1; background: #f1f5f9; border: none; color: #1e293b; font-weight: 700;">Back</button>
          <button id="enroll-confirm" class="btn btn-primary" style="flex: 1; font-weight: 700;">Confirm Booking</button>
        </div>
      </div>
    </div>
  `

  // Pre-fill contact info from profile
  if (profile.full_name) {
    const parts = profile.full_name.split(' ');
    document.getElementById('c-fname').value = parts[0] || '';
    document.getElementById('c-lname').value = parts.slice(1).join(' ') || '';
  }
  if (profile.email) document.getElementById('c-email').value = profile.email;
  if (profile.phone) document.getElementById('c-phone').value = profile.phone;

  const enrollDateSelect = document.getElementById('enroll-date');
  if (preSelectedDate && enrollDateSelect) {
    enrollDateSelect.value = preSelectedDate;
    setTimeout(() => {
      updateCapacityIndicator(preSelectedDate);
    }, 100);
  }

  modal.style.display = 'flex'
  const checkboxes = modal.querySelectorAll('input[name="select-kid"]')
  const adultCountSelect = document.getElementById('adult-count')
  const adultNamesContainer = document.getElementById('adult-names-container')
  const continueBtn = document.getElementById('go-to-contact')
  const continueToWaiverBtn = document.getElementById('go-to-waiver')
  const confirmBtn = document.getElementById('enroll-confirm')
  const totalEl = document.getElementById('enroll-total')
  const warningEl = document.getElementById('adult-warning')
  const step1 = document.getElementById('enroll-step-1')
  const step2 = document.getElementById('enroll-step-2')
  const step3 = document.getElementById('enroll-step-3')
  const stepPerm = document.getElementById('enroll-step-permissions')
  let selectedPermissionsAnswers = {};

  const updateTotal = () => {
    const selectedKidsCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const adultCount = parseInt(adultCountSelect.value);
    const dateSelected = enrollDateSelect.value !== "";
    const total = (selectedKidsCount * activity.price_child) + (adultCount * activity.price_adult);
    totalEl.textContent = `£${total.toFixed(2)}`;

    const adultNames = Array.from(document.querySelectorAll('.adult-name'));
    const allAdultNamesFilled = adultNames.every(input => input.value.trim() !== '');

    const needsAdult = selectedKidsCount > 0 && adultCount === 0;
    if (needsAdult) {
      warningEl.style.display = 'block';
      continueBtn.disabled = true;
    } else {
      warningEl.style.display = 'none';
      const somethingSelected = selectedKidsCount > 0 || adultCount > 0;
      // Allow button to be enabled so we can show validation errors on click
      continueBtn.disabled = !dateSelected || !somethingSelected;
    }
  }

  let capacityStatus = { full: false, booked: 0, max: null };

  const updateCapacityIndicator = async (date) => {
    const indicator = document.getElementById('capacity-indicator');
    if (!indicator) return;
    if (!date) { indicator.style.display = 'none'; return; }
    indicator.style.display = 'block';
    indicator.innerHTML = '<span style="font-size: 0.8rem; color: #64748b;">Checking availability...</span>';
    try {
      capacityStatus = await isActivityFull(activity.id, date);
      if (capacityStatus.max === null) {
        indicator.innerHTML = '<span style="font-size: 0.8rem; color: #10b981; font-weight: 700;">✅ Open – no limit set</span>';
      } else if (capacityStatus.full) {
        indicator.innerHTML = `<span style="font-size: 0.85rem; font-weight: 700; color: #ef4444;">🔴 Full (${capacityStatus.booked}/${capacityStatus.max}) — you can join the waitlist</span>`;
      } else {
        indicator.innerHTML = `<span style="font-size: 0.85rem; font-weight: 700; color: #10b981;">🟢 ${capacityStatus.max - capacityStatus.booked} spot(s) left (${capacityStatus.booked}/${capacityStatus.max})</span>`;
      }
    } catch (e) {
      indicator.style.display = 'none';
    }
    updateTotal();
  };

  enrollDateSelect.onchange = () => { updateTotal(); updateCapacityIndicator(enrollDateSelect.value); };
  checkboxes.forEach(cb => cb.onchange = updateTotal);
  adultCountSelect.onchange = () => {
    const count = parseInt(adultCountSelect.value)
    adultNamesContainer.innerHTML = Array.from({ length: count }).map((_, i) => `
      <div class="form-group" style="margin-bottom: 12px;">
        <input type="text" class="adult-name" placeholder="Adult ${i + 1} Name & Surname" style="padding: 0.5rem; width: 100%;" required>
        <div class="adult-name-error" style="color: #ef4444; font-size: 0.7rem; font-weight: 700; margin-top: 4px; display: none;">Mandatory field</div>
      </div>
    `).join('')
    // Add listeners to new inputs to hide error on type
    document.querySelectorAll('.adult-name').forEach(input => {
      input.oninput = (e) => {
        e.target.parentElement.querySelector('.adult-name-error').style.display = 'none';
        updateTotal();
      };
    });
    updateTotal()
  }

  document.getElementById('enroll-cancel').onclick = () => modal.remove()
  continueBtn.onclick = async () => {
    const adultNames = Array.from(document.querySelectorAll('.adult-name'));
    let allValid = true;
    adultNames.forEach(input => {
      const errorDiv = input.parentElement.querySelector('.adult-name-error');
      if (!input.value.trim()) {
        errorDiv.style.display = 'block';
        allValid = false;
      } else {
        errorDiv.style.display = 'none';
      }
    });

    if (!allValid) return;

    // If activity is full, offer waitlist instead
    if (capacityStatus.full) {
      const selectedKidIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
      const eventDate = enrollDateSelect.value;
      if (selectedKidIds.length === 0) { alert('Please select at least one child to join the waitlist.'); return; }
      if (!confirm(`This session is full. Would you like to join the waitlist for ${selectedKidIds.length} child(ren) on ${eventDate}?`)) return;
      continueBtn.disabled = true; continueBtn.textContent = 'Joining waitlist...';
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const parentId = session.user.id;
        let results = [];
        for (const kidId of selectedKidIds) {
          const result = await joinWaitlist(activity.id, kidId, parentId, eventDate);
          results.push(result);
        }
        alert(`You've been added to the waitlist! Your position: #${results[results.length - 1].position}. We'll send you a message when a spot opens.`);
        modal.remove();
      } catch (err) {
        alert('Failed to join waitlist: ' + err.message);
        continueBtn.disabled = false; continueBtn.textContent = 'Continue';
      }
      return;
    }

    step1.style.display = 'none';
    step2.style.display = 'block';
  }
  document.getElementById('back-to-step-1').onclick = () => { step2.style.display = 'none'; step1.style.display = 'block' }

  document.getElementById('go-to-next-after-contact').onclick = () => {
    const contact = {
      first_name: document.getElementById('c-fname').value,
      last_name: document.getElementById('c-lname').value,
      email: document.getElementById('c-email').value,
      phone: document.getElementById('c-phone').value,
      postcode: document.getElementById('c-postcode').value
    }
    const termsCheckbox = document.getElementById('c-terms');
    if (termsCheckbox && !termsCheckbox.checked) { alert('Please accept the terms and conditions.'); return; }
    if (!contact.first_name || !contact.last_name || !contact.email || !contact.phone) { alert('Please fill in required contact details.'); return; }

    if (activity.required_permissions && activity.required_permissions.length > 0) {
      const selectedKidIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
      const firstChild = children.find(c => c.id === selectedKidIds[0]);
      const globalPerms = firstChild?.metadata?.permissions || {};

      const permMapping = {
        'Animals': 'p_animals',
        'Antihistamine (Piriton)': 'p_piriton',
        'Calpol': 'p_calpol',
        'Emergency Medical Treatment': 'p_emergency',
        'First Aid': 'p_firstaid',
        'Medicines': 'p_medicine',
        'Other photographs': 'p_photo_other',
        'Photographer': 'p_photographer',
        'Photos & Videos on Urban Tribe': 'p_photo_ut',
        'Photos on Social Media': 'p_photo_social',
        'Videos on social media': 'p_video_social',
        'Plasters': 'p_plasters',
        'Playground Equipment': 'p_playground',
        'Public Transport': 'p_transport',
        'Safeguarding': 'p_safeguarding',
        'Sharing information with other professionals': 'p_sharing',
        'Suncream': 'p_suncream',
        'Trips & Outings': 'p_trips'
      };

      const container = document.getElementById('permissions-container');
      container.innerHTML = activity.required_permissions.map((p, i) => {
        const globalId = permMapping[p];
        const globalVal = globalId ? globalPerms[globalId] : null;
        const fullPerm = providerPerms.find(fp => fp.label === p);

        return `
          <div style="background: #f8fafc; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; position: relative;">
            <p style="font-weight: 700; color: #1e293b; margin-bottom: 4px; font-size: 0.95rem;">${p}</p>
            ${fullPerm ? `<p style="font-size: 0.8rem; color: #64748b; margin-bottom: 12px; line-height: 1.4;">${fullPerm.description}</p>` : ''}
            ${globalVal ? `<p style="font-size: 0.7rem; color: #059669; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 4px;">✨ Pre-filled from ${firstChild.name}'s profile</p>` : '<div style="height: 10px;"></div>'}
            <div style="display: flex; gap: 20px;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; color: #166534; font-weight: 600;">
                <input type="radio" name="perm-${i}" value="Yes" required style="width: 18px; height: 18px; accent-color: #10b981;" ${globalVal === 'Yes' ? 'checked' : ''}>
                Yes, I agree
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; color: #991b1b; font-weight: 600;">
                <input type="radio" name="perm-${i}" value="No" required style="width: 18px; height: 18px; accent-color: #ef4444;" ${globalVal === 'No' ? 'checked' : ''}>
                No, I decline
              </label>
            </div>
          </div>
        `;
      }).join('');

      step2.style.display = 'none';
      stepPerm.style.display = 'block';
    } else {
      goToStep3(contact);
    }
  }

  document.getElementById('back-to-step-contact').onclick = () => {
    stepPerm.style.display = 'none';
    step2.style.display = 'block';
  }

  document.getElementById('go-to-waiver-final').onclick = () => {
    const perms = activity.required_permissions || [];
    const answers = {};
    for (let i = 0; i < perms.length; i++) {
      const selected = modal.querySelector(`input[name="perm-${i}"]:checked`);
      if (!selected) { alert('Please answer all permission questions.'); return; }
      answers[perms[i]] = selected.value;
    }
    selectedPermissionsAnswers = answers;

    const contact = {
      first_name: document.getElementById('c-fname').value,
      last_name: document.getElementById('c-lname').value,
      email: document.getElementById('c-email').value,
      phone: document.getElementById('c-phone').value,
      postcode: document.getElementById('c-postcode').value
    };
    goToStep3(contact);
  }

  function goToStep3(contact) {
    const fullName = (contact.first_name || '') + ' ' + (contact.last_name || '');
    const displayAdult = fullName.trim() || profile.full_name || 'Guardian';
    document.getElementById('w-adult-name').textContent = displayAdult;
    const selectedKidNames = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.closest('label').querySelector('span').textContent);
    document.getElementById('w-minor-names').textContent = selectedKidNames.length ? selectedKidNames.join(', ') : 'None';
    document.getElementById('w-date').textContent = new Date().toLocaleDateString();

    step2.style.display = 'none';
    stepPerm.style.display = 'none';
    step3.style.display = 'block';
  }

  document.getElementById('back-to-step-2').onclick = () => {
    step3.style.display = 'none';
    if (activity.required_permissions && activity.required_permissions.length > 0) {
      stepPerm.style.display = 'block';
    } else {
      step2.style.display = 'block';
    }
  }

  confirmBtn.onclick = async () => {
    const waiverAccept = document.getElementById('w-accept');
    if (!waiverAccept.checked) { alert('You must accept the waiver to continue.'); return; }

    const eventDate = enrollDateSelect.value;
    const selectedKidIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    const adultCount = parseInt(adultCountSelect.value);

    const contact = {
      first_name: document.getElementById('c-fname').value,
      last_name: document.getElementById('c-lname').value,
      email: document.getElementById('c-email').value,
      phone: document.getElementById('c-phone').value,
      postcode: document.getElementById('c-postcode').value,
      permissions: selectedPermissionsAnswers
    };

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Preparing Payment...';

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in to book.');

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
        body: {
          activity,
          selectedKidIds,
          adultCount,
          eventDate,
          contact
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create payment session.');
      }

    } catch (error) {
      console.error('Payment error detail:', error);
      let errorMsg = error.message;

      // Try to extract the specific error from the function response
      if (error.context) {
        try {
          const body = await error.context.json();
          if (body.error) errorMsg = body.error;
        } catch (e) {
          console.error('Failed to parse error body:', e);
        }
      }

      alert('Payment Error: ' + errorMsg);
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm & Pay';
    }
  }
}

function renderJoinFamilyForm(fromOnboarding = false) {
  window.scrollTo(0, 0);
  app.innerHTML = `
    <div class="container fade-up" style="max-width: 500px; padding: 4rem 1rem;">
      <header style="margin-bottom: 2.5rem;">
        <button id="b-back" class="btn btn-outline" style="width: auto; border-radius: 100px;">← Back</button>
      </header>
      
      <div class="card" style="padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 64px; height: 64px; background: #f0fdf4; color: #16a34a; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1.5rem;">
            🤝
          </div>
          <h1 style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin-bottom: 0.5rem;">Join a Family</h1>
          <p style="color: #64748b; font-size: 0.95rem;">Enter the Family Code shared by your partner.</p>
        </div>

        <form id="j-form">
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label style="font-weight: 700; color: #475569; font-size: 0.85rem; margin-bottom: 0.5rem;">Family Code (ID)</label>
            <input type="text" id="j-code" placeholder="e.g. 550e8400-e29b..." required style="border-radius: 12px;">
          </div>
          <div class="form-group" style="margin-bottom: 2rem;">
            <label style="font-weight: 700; color: #475569; font-size: 0.85rem; margin-bottom: 0.5rem;">Your Relationship</label>
            <select id="j-rel" class="form-select" style="border-radius: 12px;">
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" id="j-btn" class="btn btn-primary" style="padding: 1rem;">Join Family</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('b-back').onclick = () => fromOnboarding ? renderOnboarding() : initApp();

  document.getElementById('j-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('j-btn');
    const code = document.getElementById('j-code').value.trim();
    const rel = document.getElementById('j-rel').value;

    btn.disabled = true;
    btn.textContent = 'Joining...';

    try {
      await joinChild(code, rel);
      alert('Welcome to the family! 🎉');
      initApp();
    } catch (error) {
      console.error('Join error:', error);
      alert('Error: Family code not found. Please double check the ID.');
      btn.disabled = false;
      btn.textContent = 'Join Family';
    }
  }
}

async function renderOnboarding() {
  window.scrollTo(0, 0);
  app.innerHTML = `
    <div class="container fade-up" style="max-width: 500px; padding: 4rem 1rem; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <img src="${logo}" alt="Urban Tribe" style="width: 100%; max-width: 280px; margin-bottom: 2.5rem; object-fit: contain;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #1e293b; margin-bottom: 1rem;">Welcome to Urban Tribe</h1>
        <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6;">Before we start, let's connect you to your tribe.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Option 1: Join Existing -->
        <div id="join-card" class="card" style="padding: 1.5rem; cursor: pointer; transition: all 0.3s; border: 2px solid transparent;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 54px; height: 54px; background: #f0fdf4; color: #16a34a; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              🤝
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">Join a Family</h3>
              <p style="color: #64748b; font-size: 0.9rem; margin: 0;">My partner already set up our children.</p>
            </div>
          </div>
        </div>

        <!-- Option 2: Create New -->
        <div id="create-card" class="card" style="padding: 1.5rem; cursor: pointer; transition: all 0.3s; border: 2px solid transparent;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 54px; height: 54px; background: #eff6ff; color: #2563eb; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              🌱
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">Start Your Tribe</h3>
              <p style="color: #64748b; font-size: 0.9rem; margin: 0;">I'm the first one here. Add my children.</p>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 3rem; text-align: center;">
        <button onclick="handleLogout()" style="background: none; border: none; color: #94a3b8; font-weight: 600; cursor: pointer; text-decoration: underline;">Sign Out</button>
      </div>
    </div>
  `;

  // Interaction: Hover effects
  const cards = ['join-card', 'create-card'];
  cards.forEach(id => {
    const el = document.getElementById(id);
    el.onmouseenter = () => el.style.borderColor = 'var(--primary-color)';
    el.onmouseleave = () => el.style.borderColor = 'transparent';
  });

  // Action listeners
  document.getElementById('join-card').onclick = () => renderJoinFamilyForm(true);
  document.getElementById('create-card').onclick = () => renderChildForm(null, true);
}

// Helper to check if coming from onboarding
let isOnboarding = false;

async function renderChildForm(child = null, fromOnboarding = false) {
  isOnboarding = fromOnboarding;
  const isEdit = !!child; let croppedBlob = null;
  let enrollments = [];
  let guardians = [];
  let siblings = [];

  if (isEdit) {
    try {
      const allInvoices = await getMyInvoices();
      enrollments = allInvoices.filter(inv => inv.child_id === child.id);
      guardians = await getChildGuardians(child.id);
      const allMyChildren = await getMyChildren();
      siblings = allMyChildren.filter(c => c.id !== child.id);
    } catch (err) {
      console.warn('Could not fetch data:', err);
    }
  }

  let pastActivities = [];
  let futureActivities = [];
  if (isEdit) {
    const today = new Date().toISOString().split('T')[0];
    enrollments.forEach(e => {
      const dateStr = e.event_date || (e.activities?.event_dates ? e.activities.event_dates[0] : '9999-12-31');
      if (dateStr < today) pastActivities.push(e); else futureActivities.push(e);
    });
  }

  const renderCard = (e) => {
    const status = (e.status || 'unpaid').toLowerCase();
    const statusColor = status === 'paid' ? '#059669' : '#f59e0b';
    const statusBg = status === 'paid' ? '#ecfdf5' : '#fffbeb';
    const statusBorder = status === 'paid' ? '#d1fae5' : '#fef3c7';
    const actName = e.activities?.name || 'Activity';
    const provName = e.activities?.providers?.business_name || 'Urban Tribe';
    const amt = e.amount || '0';
    const time = e.activities?.start_time?.slice(0, 5) || 'TBD';
    const date = e.event_date || (e.activities?.event_dates ? e.activities.event_dates[0] : (e.activities?.recurrence || 'TBD'));
    return '<div class="card" style="margin-bottom: 0.75rem; border-left: 4px solid ' + statusColor + '; background: #ffffff;"><div style="display: flex; justify-content: space-between; align-items: center;"><div style="flex: 1;"><div style="display: flex; justify-content: space-between; align-items: flex-start;"><div><p style="font-weight: 700; color: #1e293b; font-size: 1rem;">' + actName + '</p><p style="font-size: 0.8rem; color: #64748b;">by ' + provName + '</p></div><div style="text-align: right;"><p style="font-weight: 800; color: #1e293b; font-size: 0.9rem;">£' + amt + '</p><span style="font-size: 0.65rem; font-weight: 700; color: ' + statusColor + '; border: 1px solid ' + statusBorder + '; background: ' + statusBg + '; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">' + status + '</span></div></div><div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; border-top: 1px dotted #f1f5f9; padding-top: 0.5rem;"><span style="font-size: 0.7rem; color: #64748b; display: flex; align-items: center; gap: 4px;">🕒 ' + time + '</span><span style="font-size: 0.7rem; color: #64748b; display: flex; align-items: center; gap: 4px;">📅 ' + date + '</span></div></div></div></div>';
  };

  let html = '<div class="container" style="padding-bottom: 100px;">';
  html += '<header style="display: flex; flex-direction: column; align-items: center; margin-top: 1.5rem; margin-bottom: 2rem; gap: 15px;">';
  html += '<img src="' + logo + '" alt="Urban Tribe" style="height: 40px;">';
  html += '<div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">';
  html += '<button id="b-dash" class="btn btn-outline" style="width: auto;">← Back</button>';
  html += '<div style="display: flex; gap: 8px;">';
  if (isEdit) {
    html += '<button id="share-id-btn" class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #fff; border: 1px solid #e2e8f0; color: var(--primary-color);">Share Family ID</button>';
  }
  html += '</div></div></header>';

  if (isEdit) {
    html += '<div class="mt-4" style="text-align: center; background: #fff; padding: 2rem; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">';
    html += '<div style="position: relative; width: 100px; height: 100px; margin: 0 auto 1rem;">';
    html += '<img src="' + (child.photo_url || 'https://via.placeholder.com/100') + '" id="p-img-summary" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">';
    html += '</div>';
    html += '<h1 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">' + child.name + '</h1>';
    html += '<p style="color: #64748b; font-size: 0.85rem;">' + (child.birth_date ? new Date(child.birth_date).toLocaleDateString() : '') + ' | ' + (child.gender || '') + '</p>';
    html += '</div>';

    html += '<div style="display: flex; gap: 10px; margin-top: 1.5rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">';
    html += '<button id="tab-activities-btn" style="flex: 1; padding: 10px; background: none; border: none; font-weight: 800; color: var(--primary-color); border-bottom: 3px solid var(--primary-color); cursor: pointer; font-size: 1rem;">Activities</button>';
    html += '<button id="tab-family-btn" style="flex: 1; padding: 10px; background: none; border: none; font-weight: 600; color: #94a3b8; cursor: pointer; font-size: 1rem;">Family</button>';
    html += '<button id="tab-about-btn" style="flex: 1; padding: 10px; background: none; border: none; font-weight: 600; color: #94a3b8; cursor: pointer; font-size: 1rem;">About</button>';
    html += '</div>';

    html += '<div id="tab-activities-content" class="mt-4">';
    html += '<h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: #1e293b; font-weight: 700;">Future Activities</h3>';
    html += '<div style="margin-bottom: 2rem;">' + (futureActivities.length ? futureActivities.map(renderCard).join('') : '<p style="color: #94a3b8; font-size: 0.85rem; text-align: center; padding: 1rem; background: #f8fafc; border-radius: 12px;">No future activities booked.</p>') + '</div>';
    html += '<h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: #1e293b; font-weight: 700;">Previous Activities</h3>';
    html += '<div>' + (pastActivities.length ? pastActivities.map(renderCard).join('') : '<p style="color: #94a3b8; font-size: 0.85rem; text-align: center; padding: 1rem; background: #f8fafc; border-radius: 12px;">No past activities found.</p>') + '</div>';
    html += '</div>';

    html += '<div id="tab-family-content" class="mt-4" style="display: none;">';
    html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">';
    html += '<h3 style="font-size: 1.1rem; margin: 0; color: #1e293b; font-weight: 700;">Contacts</h3>';
    html += '<button class="btn btn-outline" style="width: auto; font-size: 0.8rem; padding: 4px 12px;">Add Contact</button>';
    html += '</div>';
    html += '<div style="margin-bottom: 2rem;">' + (guardians.length ? guardians.map(g => {
      const name = g.profiles?.full_name || 'Unknown';
      const initial = name[0] ? name[0].toUpperCase() : '?';
      let phoneHtml = g.profiles?.phone ? '<p style="font-size: 0.85rem; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;"><span style="color: #64748b;">📞</span> <a href="tel:' + g.profiles.phone + '" style="color: #0284c7; text-decoration: none;">' + g.profiles.phone + '</a></p>' : '';
      let emailHtml = g.profiles?.email ? '<p style="font-size: 0.85rem; margin-bottom: 0; display: flex; align-items: center; gap: 8px;"><span style="color: #64748b;">✉️</span> <a href="mailto:' + g.profiles.email + '" style="color: #0284c7; text-decoration: none;">' + g.profiles.email + '</a></p>' : '';
      let noContactHtml = !g.profiles?.phone && !g.profiles?.email ? '<p style="font-size: 0.75rem; color: #94a3b8; font-style: italic;">Contact info not provided</p>' : '';
      let avatarHtml = g.profiles?.photo_url ? '<img src="' + g.profiles.photo_url + '" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">' : '<div style="width: 50px; height: 50px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary-color); font-size: 1.2rem; flex-shrink: 0;">' + initial + '</div>';

      return '<div style="margin-bottom: 1rem; background: transparent; display: flex; justify-content: space-between; align-items: flex-start; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;"><div style="display: flex; gap: 1rem; flex: 1;">' + avatarHtml + '<div style="flex: 1;"><p style="font-weight: 700; color: #1e293b; font-size: 1rem; display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">' + name + '<span style="color: #10b981; font-size: 0.8rem;">👤</span></p><p style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">' + (g.relationship || 'Guardian') + '</p>' + phoneHtml + emailHtml + noContactHtml + '</div></div><div style="color: #cbd5e1; font-weight: bold; font-size: 1.5rem; display: flex; align-items: center;">›</div></div>';
    }).join('') : '<p style="color: #94a3b8; font-size: 0.85rem; text-align: center; padding: 1rem; background: #f8fafc; border-radius: 12px;">No family members found.</p>') + '</div>';
    html += '<h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: #1e293b; font-weight: 700;">Siblings</h3>';
    if (siblings.length) {
      html += '<div style="display: flex; flex-direction: column; gap: 0.75rem;">' + siblings.map(s => {
        const sInitial = s.name[0]?.toUpperCase() || '?';
        const sPhoto = s.photo_url ? '<img src="' + s.photo_url + '" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">' : '<div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary-color); font-size: 0.9rem;">' + sInitial + '</div>';
        return '<div onclick=\'window.handleEditChild(' + JSON.stringify(s).replace(/'/g, "\\'") + ')\' style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #fff; border-radius: 12px; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s;"><div style="display: flex; align-items: center; gap: 12px;">' + sPhoto + '<span style="font-weight: 700; color: #1e293b;">' + s.name + '</span></div><span style="color: #cbd5e1; font-weight: bold; font-size: 1.2rem;">›</span></div>';
      }).join('') + '</div>';
    } else {
      html += '<p style="color: #64748b; font-size: 0.85rem; text-align: center; padding: 2rem 1rem;">Connect siblings to each other and get an overview of the entire family</p>';
    }
    html += '</div>';

    html += '<div id="tab-about-content" class="mt-4" style="display: none;">';
    const sections = [
      { id: 'basic', label: 'Basic info' },
      { id: 'health', label: 'Health' },
      { id: 'sensitive', label: 'Sensitive information' },
      { id: 'registration', label: 'Registration & Room Moves' },
      { id: 'docs', label: 'Documents' },
      { id: 'permissions', label: 'Permissions' }
    ];
    html += '<div style="display: flex; flex-direction: column; gap: 1px; background: #f1f5f9; border-radius: 20px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">';
    sections.forEach(s => {
      html += `
        <div onclick="window.showAboutSection('${s.id}', '${encodeURIComponent(JSON.stringify(child)).replace(/'/g, "%27")}', '${encodeURIComponent(JSON.stringify(enrollments)).replace(/'/g, "%27")}')" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; background: #fff; cursor: pointer; transition: background 0.2s;">
          <span style="font-weight: 600; color: #1e293b; font-size: 1rem;">${s.label}</span>
          <span style="color: #cbd5e1; font-weight: bold; font-size: 1.2rem;">›</span>
        </div>
      `;
    });
    html += '</div>';
    html += '<button id="tab-profile-edit-btn" class="btn btn-outline" style="margin-top: 1.5rem; width: 100%; font-size: 0.9rem; font-weight: 700;">Edit Profile Settings</button>';
    html += '</div>';
  }

  html += '<div id="edit-form-container" style="' + (isEdit ? 'display: none;' : 'display: block;') + '" class="mt-4">';
  html += '<h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: #1e293b; font-weight: 700;">' + (isEdit ? 'Update Details' : 'Add New Family Member') + '</h3>';
  html += '<div class="card" style="border: 1px solid #e2e8f0; ' + (isEdit ? 'background: #f8fafc;' : '') + '">';
  html += '<form id="c-form">';
  if (!isEdit) {
    html += '<div class="form-group text-center"><div id="photo-preview-container" style="width: 100px; height: 100px; border-radius: 50%; background: #f1f5f9; margin: 0 auto 1rem; border: 2px dashed var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden;"><span id="photo-placeholder" style="color: var(--text-muted); font-size: 0.75rem;">Add Photo</span><img id="photo-preview" src="" style="display:none; width: 100%; height: 100%; object-fit: cover;"></div><p style="font-size: 0.75rem; color: var(--text-muted);">Click to change photo</p></div>';
  }
  html += '<input type="file" id="photo-input" accept="image/*" capture="environment" style="display: none;">';
  html += '<div class="form-group"><label>Name</label><input type="text" id="cn" value="' + (isEdit ? child.name : '') + '" required></div>';
  html += '<div class="form-group"><label>Birth Date</label><input type="date" id="cd" value="' + (isEdit ? child.birth_date : '') + '" required></div>';
  html += '<div class="form-group"><label>Gender</label><select id="cg" class="form-select"><option value="Male" ' + (isEdit && child.gender === 'Male' ? 'selected' : '') + '>Male</option><option value="Female" ' + (isEdit && child.gender === 'Female' ? 'selected' : '') + '>Female</option><option value="Other" ' + (isEdit && child.gender === 'Other' ? 'selected' : '') + '>Other</option></select></div>';
  html += '<div class="form-group"><label>Relationship</label><select id="cr" class="form-select">';
  html += '<option value="Child" ' + (isEdit && child.relationship === 'Child' ? 'selected' : '') + '>Child</option>';
  html += '<option value="Mother" ' + (isEdit && child.relationship === 'Mother' ? 'selected' : '') + '>Mother</option>';
  html += '<option value="Father" ' + (isEdit && child.relationship === 'Father' ? 'selected' : '') + '>Father</option>';
  html += '<option value="Other" ' + (isEdit && (child.relationship !== 'Child' && child.relationship !== 'Mother' && child.relationship !== 'Father') ? 'selected' : '') + '>Other</option>';
  html += '</select></div>';
  html += '<div id="other-rel-group" class="form-group" style="display: ' + (isEdit && (child.relationship !== 'Child' && child.relationship !== 'Mother' && child.relationship !== 'Father') ? 'block' : 'none') + ';"><label>Specify Relationship</label><input type="text" id="other-rel" value="' + (isEdit ? child.relationship : '') + '"></div>';
  html += '<button type="submit" id="save-child-btn" class="btn btn-primary">' + (isEdit ? 'Update Profile' : 'Save') + '</button>';
  html += '</form></div></div></div>';
  html += '<div id="cropper-modal" class="cropper-modal-overlay crop-circle" style="display:none;"><div class="cropper-container-box"><h3>Adjust Photo</h3><div class="cropper-wrapper"><img id="cropper-image" style="display: block; max-width: 100%;"></div><div class="cropper-actions"><button id="crop-cancel" class="btn btn-outline">Cancel</button><button id="crop-save" class="btn btn-primary">Apply</button></div></div></div>';

  app.innerHTML = html;

  if (isEdit) {
    const tabActBtn = document.getElementById('tab-activities-btn');
    const tabFamBtn = document.getElementById('tab-family-btn');
    const tabAbtBtn = document.getElementById('tab-about-btn');
    const tabEditBtn = document.getElementById('tab-profile-edit-btn');
    const tabActContent = document.getElementById('tab-activities-content');
    const tabFamContent = document.getElementById('tab-family-content');
    const tabAbtContent = document.getElementById('tab-about-content');
    const tabEditContent = document.getElementById('edit-form-container');

    const resetTabs = () => {
      tabActContent.style.display = 'none';
      tabFamContent.style.display = 'none';
      tabAbtContent.style.display = 'none';
      tabEditContent.style.display = 'none';
      tabActBtn.style.color = '#94a3b8'; tabActBtn.style.borderBottom = 'none'; tabActBtn.style.fontWeight = '600';
      tabFamBtn.style.color = '#94a3b8'; tabFamBtn.style.borderBottom = 'none'; tabFamBtn.style.fontWeight = '600';
      tabAbtBtn.style.color = '#94a3b8'; tabAbtBtn.style.borderBottom = 'none'; tabAbtBtn.style.fontWeight = '600';
    };

    tabActBtn.onclick = () => {
      resetTabs();
      tabActContent.style.display = 'block';
      tabActBtn.style.color = 'var(--primary-color)'; tabActBtn.style.borderBottom = '3px solid var(--primary-color)'; tabActBtn.style.fontWeight = '800';
    };

    tabFamBtn.onclick = () => {
      resetTabs();
      tabFamContent.style.display = 'block';
      tabFamBtn.style.color = 'var(--primary-color)'; tabFamBtn.style.borderBottom = '3px solid var(--primary-color)'; tabFamBtn.style.fontWeight = '800';
    };

    tabAbtBtn.onclick = () => {
      resetTabs();
      tabAbtContent.style.display = 'block';
      tabAbtBtn.style.color = 'var(--primary-color)'; tabAbtBtn.style.borderBottom = '3px solid var(--primary-color)'; tabAbtBtn.style.fontWeight = '800';
    };

    tabEditBtn.onclick = () => {
      resetTabs();
      tabEditContent.style.display = 'block';
    };

    document.getElementById('share-id-btn').onclick = () => {
      navigator.clipboard.writeText(child.id);
      alert('Family ID copied to clipboard: ' + child.id + '\\nShare this code with the other parent to join your family!');
    };
  }
  const photoInput = document.getElementById('photo-input'); const photoPreview = document.getElementById('photo-preview'); const cropperModal = document.getElementById('cropper-modal'); const cropperImage = document.getElementById('cropper-image')
  if (isEdit) {
    const summaryImg = document.getElementById('p-img-summary');
    summaryImg.style.cursor = 'pointer';
    summaryImg.title = 'Click to change photo';
    summaryImg.onclick = () => photoInput.click();
  } else {
    document.getElementById('photo-preview-container').onclick = () => photoInput.click();
  }
  photoInput.onchange = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (re) => { cropperImage.src = re.target.result; cropperModal.style.display = 'flex'; if (cropper) cropper.destroy(); setTimeout(() => { cropper = new Cropper(cropperImage, { aspectRatio: 1, viewMode: 1, dragMode: 'move', guides: false, autoCropArea: 0.8, cropBoxMovable: false, cropBoxResizable: false, background: false, modal: false }) }, 300) }; reader.readAsDataURL(file) } }
  document.getElementById('crop-save').onclick = () => { if (cropper) { const canvas = cropper.getCroppedCanvas({ width: 500, height: 500 }); const dataUrl = canvas.toDataURL('image/jpeg'); if (!isEdit && photoPreview) { photoPreview.src = dataUrl; photoPreview.style.display = 'block'; const ph = document.getElementById('photo-placeholder'); if (ph) ph.style.display = 'none'; } if (isEdit) { const summaryImg = document.getElementById('p-img-summary'); if (summaryImg) summaryImg.src = dataUrl; } canvas.toBlob((blob) => { croppedBlob = blob }, 'image/jpeg'); cropperModal.style.display = 'none' } }
  document.getElementById('crop-cancel').onclick = () => { cropperModal.style.display = 'none'; photoInput.value = '' };

  const profile = await getMyProfile().catch(() => ({}));
  app.innerHTML += renderBottomNav(null, profile);
  attachNavEvents();

  const relSelect = document.getElementById('cr');
  const otherRelGroup = document.getElementById('other-rel-group');
  if (relSelect && otherRelGroup) {
    relSelect.onchange = (e) => {
      otherRelGroup.style.display = e.target.value === 'Other' ? 'block' : 'none';
    };
  }

  document.getElementById('b-dash').onclick = () => {
    if (isOnboarding) return renderOnboarding();
    initApp();
  };
  document.getElementById('c-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-child-btn');
    btn.disabled = true;
    try {
      let photoUrl = isEdit ? child.photo_url : null;
      if (croppedBlob) {
        const file = new File([croppedBlob], `child-${Date.now()}.jpg`, { type: 'image/jpeg' });
        try {
          photoUrl = await uploadChildPhoto(file);
        } catch (uploadErr) {
          console.error('Child photo upload failed, using fallback:', uploadErr);
          if (cropper) {
            const lowResCanvas = cropper.getCroppedCanvas({ width: 400, height: 400 });
            photoUrl = lowResCanvas.toDataURL('image/jpeg', 0.5);
          } else {
            photoUrl = document.getElementById('photo-preview')?.src || (isEdit ? child.photo_url : null);
          }
        }
      }
      const relValue = document.getElementById('cr').value === 'Other' ? document.getElementById('other-rel').value : document.getElementById('cr').value;
      if (isEdit) {
        await updateChild(child.id, {
          name: document.getElementById('cn').value,
          birth_date: document.getElementById('cd').value,
          gender: document.getElementById('cg').value,
          photo_url: photoUrl
        });
        const { data: { user } } = await supabase.auth.getUser();
        await updateRelationship(child.id, user.id, relValue)
      } else {
        await addChild(
          document.getElementById('cn').value,
          document.getElementById('cd').value,
          document.getElementById('cg').value,
          relValue,
          photoUrl
        )
      }
      initApp();
    } catch (error) { alert(error.message); btn.disabled = false; }
  }
}

async function handleFetchWeather(location) {
  const resultsEl = document.getElementById('weather-results');
  resultsEl.innerHTML = '<div style="text-align: center; padding: 3rem;"><p style="color: var(--text-muted);">Fetching weather data...</p></div>';

  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error('Location not found');

    const { lat, lon, display_name } = geoData[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
    const weatherData = await weatherRes.json();

    if (!weatherData.daily) throw new Error('Could not fetch weather data');

    const weatherCodes = {
      0: 'Sunny ☀️', 1: 'Mainly Clear 🌤️', 2: 'Partly Cloudy ⛅', 3: 'Overcast ☁️',
      45: 'Foggy 🌫️', 48: 'Depositing Rime Fog 🌫️',
      51: 'Light Drizzle 🌦️', 53: 'Moderate Drizzle 🌦️', 55: 'Dense Drizzle 🌦️',
      61: 'Slight Rain 🌧️', 63: 'Moderate Rain 🌧️', 65: 'Heavy Rain 🌧️',
      71: 'Slight Snow ❄️', 73: 'Moderate Snow ❄️', 75: 'Heavy Snow ❄️',
      95: 'Thunderstorm ⛈️'
    };

    let html = `
      <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
        <h4 style="color: #1e293b; font-weight: 700; margin-bottom: 4px;">${display_name.split(',')[0]}</h4>
        <p style="font-size: 0.8rem; color: #64748b;">${display_name}</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
    `;

    weatherData.daily.time.forEach((date, i) => {
      const dayName = new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      const maxTemp = weatherData.daily.temperature_2m_max[i];
      const minTemp = weatherData.daily.temperature_2m_min[i];
      const rain = weatherData.daily.precipitation_sum[i];
      const code = weatherData.daily.weathercode[i];
      const desc = weatherCodes[code] || 'Cloudy ☁️';

      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; transition: transform 0.2s;">
          <div style="flex: 1;">
            <p style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">${dayName}</p>
            <p style="font-size: 0.85rem; color: #64748b; font-weight: 600;">${desc}</p>
          </div>
          <div style="text-align: right; display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 0.85rem; color: #475569;">
              <p style="margin-bottom: 2px;">Max: <span style="font-weight: 800; color: #ef4444;">${maxTemp}°C</span></p>
              <p>Min: <span style="font-weight: 800; color: #3b82f6;">${minTemp}°C</span></p>
            </div>
            <div style="min-width: 60px; font-size: 0.75rem; font-weight: 800; background: #f0f9ff; color: #0369a1; padding: 6px 10px; border-radius: 10px; border: 1px solid #e0f2fe;">
              💧 ${rain}mm
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    resultsEl.innerHTML = html;
  } catch (err) {
    resultsEl.innerHTML = `<div style="text-align: center; padding: 3rem; color: #ef4444; background: #fef2f2; border-radius: 16px; border: 1px solid #fee2e2;"><p style="font-weight: 800;">Oops! Something went wrong.</p><p style="font-size: 0.85rem; margin-top: 4px;">${err.message}</p></div>`;
  }
}

window.renderProviderDashboard = renderProviderDashboard;
async function smartDashboardRedirect() {
  const profile = await getMyProfile();
  if (profile?.role === 'admin') {
    renderAdminDashboard();
  } else if (profile?.role === 'provider') {
    renderProviderDashboard();
  } else {
    initApp();
  }
}

async function renderProviderDashboard() {
  console.log('--- renderProviderDashboard Started ---');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found in renderProviderDashboard');
      return renderLogin();
    }
    console.log('User for Provider Dashboard:', user.email);

    let provider = await getMyProvider();
    console.log('Provider found in DB:', provider);

    if (!provider) {
      console.warn('Redirecting to Create Provider form');
      return renderCreateProviderForm();
    }

    app.innerHTML = `<div class="container" style="padding-bottom: 80px; padding-top: 0; min-height: 100vh; background: #f8fafc;">
      <header style="display: flex; justify-content: center; align-items: center; margin-top: 0; padding-top: 5px;"><img src="${logo}" alt="Urban Tribe" style="height: 40px;"></header>
      <main class="mt-4">
        
        <!-- DASHBOARD STATS (Persistent) -->
        <div id="prov-stats-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div class="card" style="text-align: center; padding: 1.25rem 0.5rem; border-radius: 20px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-bottom: 0;">
            <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">Users</p>
            <p id="p-stat-users" style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">-</p>
          </div>
          <div class="card" style="text-align: center; padding: 1.25rem 0.5rem; border-radius: 20px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-bottom: 0;">
            <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">Activities</p>
            <p id="p-stat-acts" style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">-</p>
          </div>
          <div class="card" style="text-align: center; padding: 1.25rem 0.5rem; border-radius: 20px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-bottom: 0;">
            <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">Bookings</p>
            <p id="p-stat-bookings" style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">-</p>
          </div>
        </div>

        <!-- DASHBOARD / OVERVIEW FEED -->
        <div id="prov-dash-content">
          <p style="text-align:center; padding: 2rem; color: #64748b;">Loading feed...</p>
        </div>

        <div id="prov-act-content" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;"><h2 style="font-size: 1.1rem; margin: 0;">My Activities</h2><button id="a-act" class="btn btn-primary" style="width: auto; padding: 4px 12px; font-size: 0.8rem; min-height: unset; height: 32px;">+ Add Activity</button></div>
          <div id="my-a-list">Loading...</div>
        </div>
        <div id="prov-news-content" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h2 style="font-size: 1.1rem; margin: 0;">My News</h2>
            <div style="display: flex; gap: 8px;">
              <button id="a-news" class="btn btn-primary" style="width: auto; padding: 4px 12px; font-size: 0.8rem; min-height: unset; height: 32px;">+ Add News</button>
              <button id="a-poll" class="btn btn-primary" style="width: auto; padding: 4px 12px; font-size: 0.8rem; min-height: unset; height: 32px; background: #8b5cf6; border-color: #7c3aed;">+ Add Poll</button>
            </div>
          </div>
          <div id="my-news-list">Loading...</div>
        </div>
        
        <!-- OTHERS TAB CONTENT -->
        <div id="prov-others-content" style="display: none;">
          <h2 style="margin-bottom: 1.5rem;">More Options</h2>
          <div style="display: grid; gap: 1rem;">
            <div class="card" id="btn-others-settings" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
              <div style="background: #eff6ff; color: #3b82f6; padding: 10px; border-radius: 12px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.099-.074.218-.114.341-.114h2.632c.123 0 .242.04.341.114l.318.238a4.25 4.25 0 0 0 5.11 0l.318-.238c.099-.074.218-.114.341-.114h2.632c.123 0 .242.04.341.114l.318.238a4.25 4.25 0 0 0 5.11 0l.318-.238c.099-.074.218-.114.341-.114h2.632c.123 0 .242.04.341.114l.318.238a4.25 4.25 0 0 0 5.11 0l.318-.238c.099-.074.218-.114.341-.114h2.632c.123 0 .242.04.341.114" /></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem;">Business Settings</h3>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Manage your brand and info</p>
              </div>
            </div>

            <div class="card" id="btn-others-perms" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
              <div style="background: #f0fdf4; color: #22c55e; padding: 10px; border-radius: 12px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem;">Permissions</h3>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Consent and liability forms</p>
              </div>
            </div>

            <div class="card" id="btn-others-weather" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
              <div style="background: #fefce8; color: #eab308; padding: 10px; border-radius: 12px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 0-7.5h-.75a5.25 5.25 0 0 0-10.233-2.33 3 3 0 0 0-3.758 3.848 5.25 5.25 0 0 0-1.009 1.482Z" /></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem;">Weather</h3>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Plan your outdoor activities</p>
              </div>
            </div>

            <div class="card" onclick="window.renderMyProfile()" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
              <div style="background: #fdf2f8; color: #ec4899; padding: 10px; border-radius: 12px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem;">My Profile</h3>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Edit your personal details</p>
              </div>
            </div>
            
            <div class="card" onclick="window.handleLogout()" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border: 1px solid #fee2e2;">
              <div style="background: #fef2f2; color: #ef4444; padding: 10px; border-radius: 12px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem; color: #ef4444;">Logout</h3>
                <p style="margin: 0; font-size: 0.85rem; color: #991b1b;">Exit your account</p>
              </div>
            </div>
          </div>
        </div>
      <div id="prov-set-content" style="display: none;">
        <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Business Settings</h2>
        <div class="card">
          <form id="prov-settings-form">
            <div class="form-group"><label>Business Name</label><input type="text" id="prov-name" value="${provider.business_name || ''}" required></div>
            <div class="form-group"><label>Terms and Conditions</label><textarea id="prov-terms" rows="8" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color); padding: 0.75rem;" placeholder="Enter your terms and conditions here...">${provider.terms_and_conditions || ''}</textarea></div>
            <button type="submit" id="save-prov-btn" class="btn btn-primary">Save Settings</button>
          </form>
        </div>
      </div>
      <div id="prov-perms-content" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;"><h2>Activity Permissions</h2><button id="a-perm" class="btn btn-primary" style="width: auto;">+ New</button></div>
        <div id="my-p-list">Loading...</div>
      </div>
      <div id="prov-weather-content" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;"><h2>Weather Forecast</h2></div>
        <div class="card">
          <div style="display: flex; gap: 10px; margin-bottom: 1rem;">
            <input type="text" id="weather-location" placeholder="Enter city name (e.g. London)" style="flex: 1; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 12px; font-size: 1rem;">
            <button id="get-weather-btn" class="btn btn-primary" style="width: auto;">Check</button>
          </div>
          <div id="weather-results" style="min-height: 200px;">
            <div style="text-align: center; padding: 3rem; color: #64748b; background: #f8fafc; border-radius: 16px; border: 2px dashed #e2e8f0;">
              <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Ready to check the weather?</p>
              <p style="font-size: 0.9rem;">Enter your location to plan your outdoor activities better.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderProviderBottomNav('dash')}
  `;
    document.getElementById('a-act').onclick = () => renderAddActivityForm(provider.id);
    document.getElementById('a-news').onclick = () => renderAddNewsForm(provider.id);
    document.getElementById('a-poll').onclick = () => renderAddPollForm(provider.id);

    const hideAllProvContent = () => {
      ['prov-dash-content', 'prov-act-content', 'prov-news-content', 'prov-messages-content', 'prov-set-content', 'prov-perms-content', 'prov-weather-content', 'prov-others-content'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    };

    document.getElementById('tab-prov-dash').onclick = (e) => {
      hideAllProvContent();
      e.currentTarget.classList.add('active');
      document.getElementById('prov-dash-content').style.display = 'block';
      loadProviderSummary(provider.id);
    }
    document.getElementById('tab-prov-act').onclick = (e) => { hideAllProvContent(); e.currentTarget.classList.add('active'); document.getElementById('prov-act-content').style.display = 'block'; }
    document.getElementById('tab-prov-news').onclick = (e) => { hideAllProvContent(); e.currentTarget.classList.add('active'); document.getElementById('prov-news-content').style.display = 'block'; }
    document.getElementById('tab-prov-others').onclick = (e) => { hideAllProvContent(); e.currentTarget.classList.add('active'); document.getElementById('prov-others-content').style.display = 'block'; }

    // Others Sub-Buttons
    document.getElementById('btn-others-settings').onclick = () => { hideAllProvContent(); document.getElementById('tab-prov-others').classList.add('active'); document.getElementById('prov-set-content').style.display = 'block'; }
    document.getElementById('btn-others-perms').onclick = () => { hideAllProvContent(); document.getElementById('tab-prov-others').classList.add('active'); document.getElementById('prov-perms-content').style.display = 'block'; }
    document.getElementById('btn-others-weather').onclick = () => { hideAllProvContent(); document.getElementById('tab-prov-others').classList.add('active'); document.getElementById('prov-weather-content').style.display = 'block'; }

    document.getElementById('get-weather-btn').onclick = async () => {
      const loc = document.getElementById('weather-location').value.trim();
      if (!loc) return alert('Please enter a location');
      await handleFetchWeather(loc);
    };

    document.getElementById('prov-settings-form').onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('save-prov-btn');
      const prevText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        await updateProvider(provider.id, { business_name: document.getElementById('prov-name').value, terms_and_conditions: document.getElementById('prov-terms').value });
        btn.textContent = 'Settings Updated!';
        btn.style.backgroundColor = '#10b981';
        setTimeout(() => { btn.disabled = false; btn.textContent = prevText; btn.style.backgroundColor = ''; }, 2000);
      } catch (err) {
        btn.textContent = 'Error!';
        btn.style.backgroundColor = '#ef4444';
        alert('Failed to save: ' + (err?.message || 'Unknown error'));
        setTimeout(() => { btn.disabled = false; btn.textContent = prevText; btn.style.backgroundColor = ''; }, 3000);
      }
    }

    loadProviderStats(provider.id);
    document.getElementById('tab-prov-dash').click();

    const myActs = await getProviderActivities(provider.id);
    document.getElementById('my-a-list').innerHTML = myActs.length ? myActs.map(a => `
      <div class="card" style="padding: 1.25rem; margin-bottom: 1rem; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;">
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
          <div style="position: relative; width: 70px; height: 70px; flex-shrink: 0;">
            ${a.photo_url ? `<img src="${a.photo_url}" onclick='window.handleViewActivitySocial(${JSON.stringify(a).replace(/'/g, "&apos;")})' style="width: 100%; height: 100%; border-radius: 14px; object-fit: cover; cursor: pointer; border: 2px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">` : `<div style="width: 100%; height: 100%; background: #f1f5f9; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 1.5rem;">📷</div>`}
          </div>
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-weight: 800; color: #1e293b; margin: 0; font-size: 1.15rem;">${a.name}</h3>
            <p style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">£${a.price_child} • ${a.location_type}</p>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick='window.handleViewActivityBookings(${JSON.stringify(a).replace(/'/g, "&apos;")})' class="btn btn-outline" style="flex: 1; font-size: 0.8rem;">Bookings</button>
          <button onclick='window.handleEditActivity(${JSON.stringify(a).replace(/'/g, "&apos;")})' class="btn btn-outline" style="flex: 1; font-size: 0.8rem;">Edit</button>
        </div>
      </div>
    `).join('') : '<p>No activities yet.</p>';

    const newsData = await getProviderNews(provider.id);
    document.getElementById('my-news-list').innerHTML = newsData.length ? newsData.map(n => `
      <div class="card" style="padding: 12px 1rem; margin-bottom: 4px; border-radius: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <p style="font-weight: 800; color: var(--primary-color); margin: 0;">${n.title}</p>
          <button onclick='window.handleEditNews(${JSON.stringify(n).replace(/'/g, "&apos;")})' class="btn btn-outline" style="width: auto; padding: 4px 10px; font-size: 0.7rem;">Edit</button>
        </div>
      </div>
    `).join('') : '<p>No news yet.</p>';

    await renderPermissionsManager(provider);

  } catch (err) {
    console.error('Fatal error in renderProviderDashboard:', err);
    app.innerHTML = `<div class="container"><div class="card mt-4" style="border: 1px solid red; color: #ef4444; padding: 2rem; text-align: center;">
      <h2 style="margin-bottom: 1rem;">Oops! Something went wrong</h2>
      <p style="margin-bottom: 1.5rem; font-size: 0.9rem; opacity: 0.8;">${err.message || 'Unknown error occurred while loading your dashboard.'}</p>
      <button onclick="location.reload()" class="btn btn-primary" style="width: auto; margin: 0 auto;">Refresh Page</button>
    </div></div>`;
  }
}

async function renderPermissionsManager(provider) {
  const standardPerms = [
    { label: 'Animals', description: 'I give permission for my child to handle, stroke and learn about animals on visits to farms and other educational settings, or touch, handle and stroke animals we have invited into the setting (where risk assessments are in place).' },
    { label: 'Antihistamine (Piriton)', description: 'I give permission for my child to be administered piriton antihistamine if needed – parents would be informed prior to administration of piriton.' },
    { label: 'Calpol', description: 'I give permission for my child to be administered calpol if needed - parents would be informed prior to administration of calpol.' },
    { label: 'Emergency Medical Treatment', description: 'In the event of an emergency, I give permission for you to seek medical/hospital assistance in our absence as appropriate.' },
    { label: 'First Aid', description: 'I give permission for First Aid trained staff to administer first aid assistance to my child as and when necessary.' },
    { label: 'Medicines', description: 'I give permission for my child to be administered medicine – a medicine form will be completed on Urban Tribe and the medication provided by the parent in line with our Medication Policy.' },
    { label: 'Other photographs', description: 'Photos may be used for ‘other’ purposes which will be openly accessible by the public such as presentations, website, posters, flyers, educational material, and advertising.' },
    { label: 'Photographer', description: 'I give permission for a photographer to take photos of my child for professional use.' },
    { label: 'Photos & Videos on Urban Tribe', description: 'Permission for your child to have photos & videos posted on Urban Tribe, these will be seen by other parents/carers of the setting also.' },
    { label: 'Photos on Social Media', description: 'I give permission for my child’s photos to be used on social media where their face is visible (Facebook & Instagram).' },
    { label: 'Videos on social media', description: 'I give permission for videos with my child in to be used on social media where their face is visible (Facebook & Instagram).' },
    { label: 'Plasters', description: 'I give permission for my child to have a plaster applied.' },
    { label: 'Playground Equipment', description: 'During trips and outings children may have the opportunity to access playground equipment. They will be supervised and a check of the area and its equipment will be carried out before use. I give permission for my child to play on equipment in various playgrounds which Urban Tribe staff deem safe and appropriate for my child.' },
    { label: 'Public Transport', description: 'I give permission for my child to ride on public transport including trains, buses and trams.' },
    { label: 'Safeguarding', description: 'I understand that if there is a concern as to my child’s welfare/safety, the setting will follow their safeguarding policy and child protection procedures.' },
    { label: 'Sharing information with other professionals', description: 'I give permission for Urban Tribe to share and discuss relevant information with other professionals such as Health and Language professionals and others.' },
    { label: 'Suncream', description: 'I give permission for sun cream to be applied to my child in the setting. Where I have not provided my own sun cream, I give permission for Urban Tribe to apply their own sun cream (usually Boots own brand).' },
    { label: 'Trips & Outings', description: 'I give permission for my child to go on trips accessing places such as parks, farms, woodland, museums, libraries and galleries (this list is not extensive).' }
  ];

  try {
    let perms = await getProviderPermissions(provider.id);
    if (perms.length === 0) {
      console.log('Seeding standard permissions...');
      for (const p of standardPerms) await saveProviderPermission(provider.id, p);
      perms = await getProviderPermissions(provider.id);
    }
    perms = Array.from(new Map(perms.map(p => [p.label, p])).values());
    document.getElementById('my-p-list').innerHTML = perms.map(p => `
      <div class="card" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; border: 1px solid #e2e8f0; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <h3 style="font-size: 1rem; color: #1e293b; margin-bottom: 6px;">${p.label}</h3>
          <p style="font-size: 0.8rem; color: #64748b; line-height: 1.4; margin: 0;">${p.description}</p>
        </div>
        <button onclick='window.handleEditPermission(${JSON.stringify(p).replace(/'/g, "\\'")})' class="btn btn-outline" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.8rem;">Edit</button>
      </div>
    `).join('');
    document.getElementById('a-perm').onclick = () => renderPermissionForm(provider.id);
  } catch (err) {
    document.getElementById('my-p-list').innerHTML = `<p style="color:red; text-align:center;">Error loading permissions.</p>`;
  }
}

async function loadProviderStats(providerId) {
  try {
    const { data: acts } = await supabase.from('activities').select('id').eq('provider_id', providerId);
    const actIds = acts.map(a => a.id);
    const { data: invs } = await supabase.from('invoices').select('parent_id').in('activity_id', actIds);
    const uniqueCustomers = new Set(invs.map(i => i.parent_id)).size;
    document.getElementById('p-stat-users').textContent = uniqueCustomers || 0;
    document.getElementById('p-stat-acts').textContent = acts.length || 0;
    document.getElementById('p-stat-bookings').textContent = invs.length || 0;
  } catch (err) { console.error(err); }
}

async function loadProviderSummary(providerId) {
  const container = document.getElementById('prov-dash-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align:center; padding: 2rem; color: #64748b;">Generating summary...</p>';
  try {
    const { data: acts } = await supabase.from('activities').select('id, name, photo_url, price_child, location_type').eq('provider_id', providerId).order('created_at', { ascending: false }).limit(3);
    const actIds = acts.map(a => a.id);
    const { data: bookings } = await supabase.from('invoices').select('*, activities(name, start_time, end_time), profiles:parent_id(full_name), children(name)').in('activity_id', actIds).order('created_at', { ascending: false }).limit(30);

    const bookingGroups = {};
    bookings.forEach(inv => {
      const timeKey = new Date(inv.created_at).toISOString().substring(0, 16);
      const key = `${inv.parent_id}_${inv.activity_id}_${inv.event_date}_${timeKey}`;
      if (!bookingGroups[key]) {
        bookingGroups[key] = {
          ...inv,
          name: inv.activities?.name || 'Session',
          parent: inv.profiles?.full_name || 'Parent',
          date: inv.event_date,
          startTime: inv.activities?.start_time,
          endTime: inv.activities?.end_time,
          items: [inv]
        };
      } else {
        bookingGroups[key].items.push(inv);
      }
    });

    const consolidatedBookings = Object.values(bookingGroups).slice(0, 5);
    const { data: comments } = await supabase.from('comments').select('*, profiles:user_id(full_name), activities(name)').in('activity_id', actIds).eq('status', 'pending').limit(5);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- BOOKINGS SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; font-weight: 800;">
            <span style="background: #f0fdf4; padding: 8px; border-radius: 12px; font-size: 1.2rem;">🎟️</span>
            Upcoming Bookings
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
            ${consolidatedBookings.map(g => renderBookingCardHtml(g)).join('') || '<p style="text-align:center; color:#94a3b8; padding: 1rem;">No recent bookings</p>'}
          </div>
          <button onclick="document.getElementById('tab-prov-act').click()" class="btn btn-outline" style="width: 100%; border-radius: 16px; font-weight: 700; color: #1e293b; border-color: #e2e8f0; background: #fff;">Manage Bookings</button>
        </div>

        <!-- ACTIVITIES SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem;">
            <span style="background: #f1f5f9; padding: 8px; border-radius: 12px; font-size: 1.2rem;">🎨</span>
            <h3 style="font-size: 1.1rem; margin: 0; font-weight: 800;">Latest Activities</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
            ${acts.map(a => `
              <div style="display: flex; align-items: center; gap: 16px; padding: 1rem; border-radius: 16px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="width: 50px; height: 50px; border-radius: 12px; background: #f1f5f9; overflow: hidden; flex-shrink: 0;">
                  ${a.photo_url ? `<img src="${a.photo_url}" style="width:100%; height:100%; object-fit:cover;">` : ''}
                </div>
                <div style="flex: 1;">
                  <p style="font-size: 0.95rem; font-weight: 800; margin: 0; color: #1e293b;">${a.name}</p>
                  <p style="font-size: 0.8rem; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">By Urban Tribe</p>
                </div>
              </div>
            `).join('') || '<p style="text-align:center; color:#94a3b8; padding: 1rem;">No activities found</p>'}
          </div>
          <button onclick="document.getElementById('tab-prov-act').click()" class="btn btn-outline" style="width: 100%; border-radius: 16px; font-weight: 700; color: #1e293b; border-color: #e2e8f0; background: #fff;">Manage Activities</button>
        </div>

        <!-- MODERATION SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #fee2e2; background: #fff5f5;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; font-weight: 800; color: #991b1b;">
            <span style="font-size: 1.2rem;">⚠️</span>
            Moderation
          </h3>
          <div style="margin-bottom: 1.5rem;">
            <p style="font-size: 0.95rem; color: #c53030; margin-bottom: 8px; font-weight: 600;">There are <span style="font-weight: 900;">${comments.length}</span> pending items requiring attention.</p>
          </div>
          <button onclick="document.getElementById('tab-prov-news').click()" class="btn" style="width: 100%; border-radius: 16px; font-weight: 700; background: #e11d48; color: #fff; border: none; padding: 12px;">Open Moderation Center</button>
        </div>
      </div>
    `;
  } catch (err) { console.error(err); }
}

async function renderProviderActivities(providerId) {
  document.querySelectorAll('#prov-tab-content > div').forEach(d => d.style.display = 'none');
  document.getElementById('prov-act-content').style.display = 'block';
}

async function renderProviderNews(providerId) {
  document.querySelectorAll('#prov-tab-content > div').forEach(d => d.style.display = 'none');
  document.getElementById('prov-news-content').style.display = 'block';
}

async function renderProviderMoreOptions(provider) {
  document.querySelectorAll('#prov-tab-content > div').forEach(d => d.style.display = 'none');
  document.getElementById('prov-others-content').style.display = 'block';
}



window.handleToggleActivityLike = async (activityId, btnId, countId, reactorsId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert('You must be logged in to like.');
  const btn = document.getElementById(btnId);
  const isLiked = btn.getAttribute('data-liked') === 'true';
  const newStatus = !isLiked;
  const countSpan = document.getElementById(countId);
  let count = parseInt(countSpan.textContent) || 0;

  btn.setAttribute('data-liked', newStatus.toString());
  count += newStatus ? 1 : -1;
  countSpan.textContent = count;
  btn.innerHTML = newStatus ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; color: #ef4444;"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`;

  try {
    await toggleActivityLike(activityId, user.id, isLiked);
    // Simple UI update for reactors text: refresh the dashboard/news list to get latest names
    // For now, let's just re-fetch to keep it simple and accurate
    if (reactorsId.includes('prov')) renderProviderDashboard(); else initApp();
  } catch (err) {
    if (err.code === '42P01') alert('Lütfen veritabanında "activity_likes" tablosunu oluşturun.');
    console.error(err);
  }
}

window.handleToggleNewsLike = async (newsId, btnId, countId, reactorsId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert('You must be logged in to like.');
  const btn = document.getElementById(btnId);
  const isLiked = btn.getAttribute('data-liked') === 'true';
  const newStatus = !isLiked;
  const countSpan = document.getElementById(countId);
  let count = parseInt(countSpan.textContent) || 0;

  btn.setAttribute('data-liked', newStatus.toString());
  count += newStatus ? 1 : -1;
  countSpan.textContent = count;
  btn.innerHTML = newStatus ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; color: #ef4444;"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`;

  try {
    await toggleNewsLike(newsId, user.id, isLiked);
    if (reactorsId.includes('prov')) renderProviderDashboard(); else renderNewsTab();
  } catch (err) {
    if (err.code === '42P01') alert('Lütfen veritabanında "news_likes" tablosunu oluşturun.');
    console.error(err);
  }
}

window.handleEditNews = (news) => {
  if (news.type === 'poll') window.renderAddPollForm(news.provider_id, news);
  else window.renderAddNewsForm(news.provider_id, news);
};

window.togglePollDetailsAccordion = (pollId) => {
  const el = document.getElementById(`poll-details-${pollId}`);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.handleEditBooking = async (enrollments) => {
  const activity = enrollments[0].activities;
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '1200';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 95%; background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
      <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 800; color: #1e293b;">Edit Booking</h2>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem;">${activity.name} - ${enrollments[0].event_date}</p>
      
      <div id="edit-booking-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${enrollments.map((e, idx) => `
          <div style="background: #f8fafc; padding: 1.25rem; border-radius: 16px; border: 1px solid #f1f5f9;">
            <p style="font-weight: 800; color: var(--primary-color); margin-bottom: 12px; font-size: 0.95rem;">${e.children?.name || e.profiles?.full_name || 'Child ' + (idx + 1)}</p>
            ${(activity.required_permissions || []).map(pLabel => {
    const currentVal = e.metadata?.permissions?.[pLabel] || 'No';
    return `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: #fff; padding: 10px; border-radius: 12px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 0.85rem; font-weight: 600; color: #334155;">${pLabel}</span>
                  <div style="display: flex; background: #f1f5f9; padding: 3px; border-radius: 8px;">
                    <button type="button" onclick="window.updateBookingPerm('${e.id}', '${pLabel}', 'Yes')" id="btn-edit-yes-${e.id}-${pLabel}" style="padding: 4px 12px; border-radius: 6px; border: none; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: all 0.2s; ${currentVal === 'Yes' ? 'background: #10b981; color: white;' : 'background: transparent; color: #64748b;'}">YES</button>
                    <button type="button" onclick="window.updateBookingPerm('${e.id}', '${pLabel}', 'No')" id="btn-edit-no-${e.id}-${pLabel}" style="padding: 4px 12px; border-radius: 6px; border: none; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: all 0.2s; ${currentVal === 'No' ? 'background: #ef4444; color: white;' : 'background: transparent; color: #64748b;'}">NO</button>
                  </div>
                  <input type="hidden" id="ans-${e.id}-${pLabel}" value="${currentVal}">
                </div>
              `;
  }).join('') || '<p style="font-size: 0.8rem; color: #94a3b8; font-style: italic;">No permissions required.</p>'}
          </div>
        `).join('')}
      </div>

      <div style="display: flex; gap: 12px; margin-top: 2rem;">
        <button id="edit-booking-cancel" class="btn btn-outline" style="flex: 1;">Cancel</button>
        <button id="edit-booking-save" class="btn btn-primary" style="flex: 1;">Update All</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  window.updateBookingPerm = (eid, label, val) => {
    document.getElementById(`ans-${eid}-${label}`).value = val;
    const yesBtn = document.getElementById(`btn-edit-yes-${eid}-${label}`);
    const noBtn = document.getElementById(`btn-edit-no-${eid}-${label}`);
    if (val === 'Yes') {
      yesBtn.style.background = '#10b981'; yesBtn.style.color = 'white';
      noBtn.style.background = 'transparent'; noBtn.style.color = '#64748b';
    } else {
      noBtn.style.background = '#ef4444'; noBtn.style.color = 'white';
      yesBtn.style.background = 'transparent'; yesBtn.style.color = '#64748b';
    }
  };

  document.getElementById('edit-booking-cancel').onclick = () => modal.remove();
  document.getElementById('edit-booking-save').onclick = async () => {
    const btn = document.getElementById('edit-booking-save');
    btn.disabled = true; btn.textContent = 'Updating...';
    try {
      const updates = enrollments.map(e => {
        const newAnswers = {};
        (activity.required_permissions || []).forEach(pLabel => {
          newAnswers[pLabel] = document.getElementById(`ans-${e.id}-${pLabel}`).value;
        });
        const newMetadata = { ...(e.metadata || {}), permissions: newAnswers };
        return updateInvoice(e.id, { metadata: newMetadata });
      });

      await Promise.all(updates);
      alert('Booking updated successfully! 🎉');
      modal.remove();
      initApp();
    } catch (err) {
      alert('Update failed: ' + err.message);
      btn.disabled = false; btn.textContent = 'Update All';
    }
  };
};

window.handleViewActivitySocial = async (a) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    let backCall = 'renderDashboard()';
    const profile = await getMyProfile().catch(() => null);
    if (profile?.role === 'provider') backCall = 'renderProviderDashboard()';

    const isProvider = profile?.role === 'provider';

    app.innerHTML = `
    <div class="container" style="padding-bottom: 100px;">
      <div class="mt-4">
        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${a.photo_url ? `<img src="${a.photo_url}" style="width: 100%; height: 180px; object-fit: cover;">` : `<div style="width: 100%; height: 120px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">No Photo</div>`}
          <div style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <div style="flex: 1;">
                <div style="display: flex; justify-content: flex-end; gap: 12px; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem; padding-right: 4px;">
                  <span>${a.activity_likes?.length || 0} likes</span>
                  <span>${a.comments?.length || 0} comments</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #f1f5f9;">
                  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0;">${a.name}</h3>
                </div>
                <p style="font-size: 0.85rem; color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem;">by ${a.providers?.business_name || 'Urban Tribe'}</p>
              </div>
            </div>
            <p style="font-size: 0.9rem; color: #64748b; line-height: 1.5; margin-bottom: 1.25rem;">${a.description || 'No description provided.'}</p>
            <div id="social-comments-act-${a.id}"></div>
          </div>
        </div>
      </div>
    </div>
    ${isProvider ? renderProviderBottomNav('act') : renderBottomNav('home', profile)}
  `;
    // Auto-show comments
    try {
      const comments = await getComments('activity', a.id);
      renderCommentSection('activity', a.id, comments, user, `social-comments-act-${a.id}`);
    } catch (err) {
      console.error('Error loading comments:', err);
      const container = document.getElementById(`social-comments-act-${a.id}`);
      if (container) container.innerHTML = `<p style="color: red; font-size: 0.8rem; padding: 1rem;">Failed to load comments: ${err.message}</p>`;
    }
  } catch (err) {
    alert('Error opening activity: ' + err.message);
  }
}

window.handleViewNewsSocial = async (n) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    let backCall = 'renderDashboard()';
    const profile = await getMyProfile().catch(() => null);
    if (profile?.role === 'provider') backCall = 'renderProviderDashboard()';

    const isProvider = profile?.role === 'provider';
    const providerName = n.providers?.business_name || 'Urban Tribe Provider';
    const dateStr = new Date(n.created_at).toLocaleDateString();

    app.innerHTML = `
    <div class="container" style="padding-bottom: 100px;">
      <div class="mt-4">
        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 12px;">
          ${n.photo_url ? `<img src="${n.photo_url}" style="width: 100%; height: 200px; object-fit: cover; display: block;">` : ''}
          <div style="padding: 1.25rem;">
            <div style="display: flex; justify-content: flex-end; gap: 12px; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem; padding-right: 4px;">
              <span>${n.news_likes?.length || 0} likes</span>
              <span>${n.comments?.length || 0} comments</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #f1f5f9; margin-bottom: 8px;">
              <p style="font-size: 0.75rem; color: var(--primary-color); font-weight: 800; margin: 0; text-transform: uppercase;">${providerName}</p>
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: #1e293b;">${n.title}</h3>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; white-space: pre-line;">${n.description}</p>
            <p style="font-size: 0.75rem; color: #94a3b8; text-align: right;">${dateStr}</p>
            <div id="social-comments-news-${n.id}"></div>
          </div>
        </div>
      </div>
    </div>
    ${isProvider ? renderProviderBottomNav('news') : renderBottomNav('news', profile)}
  `;

    updateUnreadBadges();
    // Auto-show comments
    try {
      const comments = await getComments('news', n.id);
      renderCommentSection('news', n.id, comments, user, `social-comments-news-${n.id}`);
    } catch (err) {
      console.error('Error loading comments:', err);
      const container = document.getElementById(`social-comments-news-${n.id}`);
      if (container) container.innerHTML = `<p style="color: red; font-size: 0.8rem; padding: 1rem;">Failed to load comments: ${err.message}</p>`;
    }
  } catch (err) {
    alert('Error opening news: ' + err.message);
  }
}

window.handleViewActivityBookings = async (activity) => {
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

    const sortedDates = Object.keys(grouped).sort();
    window.currentActivityAttendees = grouped;
    window.currentActivityDetails = activity;

    app.innerHTML = `
      <div class="container">
        <header class="mt-4"><button id="b-p-dash" class="btn btn-outline" style="width: auto;">← Back to My Activities</button></header>
        <div class="mt-4">
          <div style="display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 2rem; background: #fff; padding: 1.5rem; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            ${activity.photo_url ? `<img src="${activity.photo_url}" style="width: 100px; height: 100px; border-radius: 12px; object-fit: cover;">` : ''}
            <div>
              <h1 style="font-size: 1.5rem; margin-bottom: 0.25rem; font-weight: 800;">${activity.name}</h1>
              <p style="color: var(--text-muted); font-size: 0.9rem;">${activity.location_type} | £${activity.price_child} Child | £${activity.price_adult} Adult</p>
              <div style="margin-top: 0.75rem; display: flex; gap: 1rem;">
                <span style="font-size: 0.75rem; background: #f0f9ff; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-weight: 600;">Total: ${invoices.length} Bookings</span>
              </div>
            </div>
          </div>
          
          <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Attendee Records</h2>
          
          <div id="attendee-list">
            ${sortedDates.length ? sortedDates.map(date => {
      const families = grouped[date];

      // Calculate daily totals
      let dailyChildren = 0;
      let dailyAdults = 0;
      Object.values(families).forEach(familyInvoices => {
        dailyChildren += familyInvoices.filter(i => i.child_id).length;
        dailyAdults += familyInvoices.reduce((sum, i) => sum + (i.adult_count || 0), 0);
      });

      return `
              <div style="margin-bottom: 2.5rem;">
                <div style="background: #f8fafc; padding: 0.75rem 1.25rem; border-radius: 12px; border-left: 5px solid var(--primary-color); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 800; color: #1e293b; font-size: 1.1rem;">📅 ${date}</span>
                  <div style="display: flex; gap: 15px; align-items: center;">
                    <span style="font-size: 0.75rem; font-weight: 700; background: #fff; color: #64748b; padding: 4px 12px; border-radius: 8px; border: 1px solid #e2e8f0;">👦 ${dailyChildren} Children</span>
                    <span style="font-size: 0.75rem; font-weight: 700; background: #fff; color: #64748b; padding: 4px 12px; border-radius: 8px; border: 1px solid #e2e8f0;">🧔 ${dailyAdults} Adults</span>
                    <button onclick="window.printAttendees('${date}')" class="btn btn-outline" style="padding: 2px 6px; width: auto; font-size: 1.1rem; border: 1px solid #e2e8f0; background: #fff; border-radius: 6px;" title="Print Attendees List">🖨️</button>
                  </div>
                </div>
                
                ${Object.keys(families).map(familyKey => {
        const [pId, pName] = familyKey.split('_');
        const familyInvoices = families[familyKey];
        const childTickets = familyInvoices.filter(i => i.child_id).length;
        const adultTickets = familyInvoices.reduce((sum, i) => sum + (i.adult_count || 0), 0);
        const totalAmount = familyInvoices.reduce((sum, i) => sum + parseFloat(i.amount), 0);
        const isFullyPaid = familyInvoices.every(i => i.status === 'paid');

        return `
                  <div class="card" style="margin-bottom: 1rem; padding: 0; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: none;">
                    <div onclick="window.toggleFamilyGroup('${date}_${pId}')" style="padding: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: #fff; transition: background 0.2s;">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--primary-color); font-size: 1.1rem;">${pName[0]}</div>
                        <div>
                          <p style="font-weight: 700; color: #1e293b;">${pName}</p>
                          <p style="font-size: 0.75rem; color: #64748b;">${childTickets} Children, ${adultTickets} Adults</p>
                        </div>
                      </div>
                      <div style="text-align: right; display: flex; align-items: center; gap: 1rem;">
                        <div>
                          <p style="font-weight: 800; color: #1e293b; font-size: 0.95rem;">£${totalAmount.toFixed(2)}</p>
                          <span style="font-size: 0.65rem; font-weight: 700; color: ${isFullyPaid ? '#059669' : '#f59e0b'}; text-transform: uppercase;">${isFullyPaid ? 'ALL PAID' : 'PENDING'}</span>
                        </div>
                        <span id="chevron_${date}_${pId}" style="transition: transform 0.3s; color: #94a3b8;">▼</span>
                      </div>
                    </div>
                    
                    <div id="details_${date}_${pId}" style="display: none; padding: 0 1rem 1rem; background: #fafafa; border-top: 1px solid #f1f5f9;">
                      <!-- Primary Contact Section -->
                      <div style="margin-top: 1rem; padding: 1rem; background: #fff; border-radius: 12px; border: 1px solid #f1f5f9; display: flex; gap: 20px; flex-wrap: wrap;">
                        <div style="font-size: 0.8rem; color: #64748b;">
                          <span style="font-weight: 700; color: #1e293b; display: block; margin-bottom: 2px; font-size: 0.7rem; text-transform: uppercase;">Primary Contact</span>
                          ${familyInvoices[0].metadata?.first_name || familyInvoices[0].profiles?.full_name || 'N/A'} ${familyInvoices[0].metadata?.last_name || ''}
                        </div>
                        <div style="font-size: 0.8rem; color: #64748b;">
                          <span style="font-weight: 700; color: #1e293b; display: block; margin-bottom: 2px; font-size: 0.7rem; text-transform: uppercase;">Email</span>
                          <a href="mailto:${familyInvoices[0].metadata?.email || familyInvoices[0].profiles?.email}" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">${familyInvoices[0].metadata?.email || familyInvoices[0].profiles?.email || 'N/A'}</a>
                        </div>
                        <div style="font-size: 0.8rem; color: #64748b;">
                          <span style="font-weight: 700; color: #1e293b; display: block; margin-bottom: 2px; font-size: 0.7rem; text-transform: uppercase;">Mobile</span>
                          <a href="tel:${familyInvoices[0].metadata?.phone}" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">${familyInvoices[0].metadata?.phone || 'N/A'}</a>
                        </div>
                        <div style="font-size: 0.8rem; color: #64748b; margin-left: auto; text-align: right;">
                          <span style="font-weight: 700; color: #1e293b; display: block; margin-bottom: 2px; font-size: 0.7rem; text-transform: uppercase;">Waiver Status</span>
                          ${(() => {
            if (!familyInvoices[0].metadata) return `<span style="color: #94a3b8; font-weight: 800; background: #f1f5f9; padding: 2px 8px; border-radius: 6px; border: 1px solid #e2e8f0;">Pending</span>`;
            const m = familyInvoices[0].metadata;
            let adultName = m?.first_name ? (m.first_name + ' ' + (m.last_name || '')) : (familyInvoices[0].profiles?.full_name || 'N/A');
            if (adultName.includes('undefined')) adultName = familyInvoices[0].profiles?.full_name || 'N/A';

            const minorNames = familyInvoices.map(inv => inv.children?.name).filter(Boolean).join(', ') || 'None';
            const signedDate = new Date(familyInvoices[0].created_at).toLocaleDateString();
            return `<span onclick="event.stopPropagation(); window.viewSignedWaiver('${encodeURIComponent(adultName).replace(/'/g, "%27")}', '${encodeURIComponent(minorNames).replace(/'/g, "%27")}', '${signedDate}')" style="color: #059669; font-weight: 800; background: #ecfdf5; padding: 2px 8px; border-radius: 6px; border: 1px solid #d1fae5; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; text-decoration: underline;" title="View Signed Waiver">✅ Signed (View)</span>`;
          })()}
                        </div>
                      </div>

                      <div style="margin-top: 1rem;">
                        <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase; padding-left: 0.25rem;">Attendees</p>
                        ${familyInvoices.map(inv => {
            const statusColor = inv.status === 'paid' ? '#059669' : '#f59e0b';
            const attendeeName = inv.children ? inv.children.name : (inv.adult_attendees ? `Adults: ${inv.adult_attendees.join(', ')}` : 'N/A');
            const metadataStr = encodeURIComponent(JSON.stringify(inv.metadata || {}));
            const isAttended = inv.metadata?.attended ? 'checked' : '';
            return `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #fff; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid #f1f5f9;">
                              <div style="display: flex; align-items: center; gap: 0.5rem;">
                                ${inv.children?.photo_url ? `<img src="${inv.children.photo_url}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">` : ''}
                                <span style="font-size: 0.85rem; font-weight: 600;">${attendeeName}</span>
                                ${inv.metadata?.permission_answers ? `<button onclick="event.stopPropagation(); window.viewPermissionAnswers('${encodeURIComponent(JSON.stringify(inv.metadata.permission_answers)).replace(/'/g, "%27")}', '${attendeeName.replace(/'/g, "\\'")}')" style="margin-left: 8px; font-size: 0.65rem; background: #f1f5f9; color: #64748b; padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1; cursor: pointer; font-weight: 700; transition: all 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">📋 Permissions</button>` : ''}
                              </div>
                              <div style="display: flex; align-items: center; gap: 10px;">
                                <label style="display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #475569; font-weight: 600; cursor: pointer;">
                                  <input type="checkbox" onchange="window.toggleAttendance('${inv.id}', this.checked, '${metadataStr}')" ${isAttended} style="width: 16px; height: 16px; accent-color: var(--primary-color);">
                                  Attended
                                </label>
                                <span style="font-size: 0.65rem; font-weight: 700; color: ${statusColor}; background: ${statusColor}11; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${inv.status}</span>
                              </div>
                            </div>
                          `;
          }).join('')}
                      </div>
                    </div>
                  </div>
                  `;
      }).join('')}
              </div>
            `;
    }).join('') : '<div class="card" style="text-align: center; padding: 3rem;"><p style="color: var(--text-muted);">No bookings found for this activity.</p></div>'}
          </div>
          
          <div id="waitlist-section" style="margin-top: 3rem; border-top: 2px dashed #e2e8f0; padding-top: 2rem;">
            <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px;">
              ⏳ Waitlist Entries
              <span id="waitlist-count-badge" style="font-size: 0.75rem; background: #fef3c7; color: #d97706; padding: 4px 12px; border-radius: 20px; font-weight: 700;">Loading...</span>
            </h2>
            <div id="waitlist-container">
              <p style="color: #64748b; font-size: 0.9rem;">Loading waitlist...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Load Waitlist Data
    const loadWaitlistData = async () => {
      const waitlistContainer = document.getElementById('waitlist-container');
      const waitlistBadge = document.getElementById('waitlist-count-badge');
      try {
        const waitlist = await getWaitlist(activity.id);
        waitlistBadge.textContent = `${waitlist.length} Waiting`;

        if (waitlist.length === 0) {
          waitlistContainer.innerHTML = `<div style="background: #f8fafc; padding: 2rem; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0;"><p style="color: #94a3b8; font-weight: 600;">No one is on the waitlist for this activity.</p></div>`;
          return;
        }

        waitlistContainer.innerHTML = `
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Child</th>
                  <th>Parent</th>
                  <th>Session Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${waitlist.map(w => `
                  <tr>
                    <td style="font-weight: 800; color: var(--primary-color);">#${w.position}</td>
                    <td style="font-weight: 700;">${w.children?.name || 'N/A'}</td>
                    <td>
                      <div style="font-weight: 600;">${w.profiles?.full_name || 'N/A'}</div>
                      <div style="font-size: 0.75rem; color: #64748b;">${w.profiles?.email || ''}</div>
                    </td>
                    <td style="font-weight: 600;">${w.event_date}</td>
                    <td>
                      <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; ${w.status === 'notified' ? 'background: #dcfce7; color: #166534;' : 'background: #f1f5f9; color: #475569;'}">
                        ${w.status}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; gap: 8px;">
                        <button onclick="window.handleNotifyWaitlist('${encodeURIComponent(JSON.stringify(w))}', '${activity.name.replace(/'/g, "&apos;")}')" class="btn btn-primary" style="width: auto; padding: 4px 10px; font-size: 0.75rem; background: #10b981;">Notify</button>
                        <button onclick="window.handleRemoveWaitlist('${w.id}')" class="btn" style="width: auto; padding: 4px 10px; font-size: 0.75rem; background: #fee2e2; color: #ef4444; border: 1px solid #fecaca;">Remove</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } catch (err) {
        waitlistContainer.innerHTML = `<p style="color: #ef4444;">Failed to load waitlist: ${err.message}</p>`;
      }
    };

    window.handleNotifyWaitlist = async (entryStr, actName) => {
      if (!confirm('Send a private message to this parent letting them know a spot is open?')) return;
      try {
        const entry = JSON.parse(decodeURIComponent(entryStr));
        await notifyWaitlistEntry(entry, actName);
        alert('Notification sent!');
        loadWaitlistData();
      } catch (err) {
        alert('Failed to notify: ' + err.message);
      }
    };

    window.handleRemoveWaitlist = async (id) => {
      if (!confirm('Remove this entry from the waitlist?')) return;
      try {
        await removeFromWaitlist(id);
        loadWaitlistData();
      } catch (err) {
        alert('Failed to remove: ' + err.message);
      }
    };

    loadWaitlistData();

    document.getElementById('b-p-dash').onclick = renderProviderDashboard;

    window.toggleFamilyGroup = (groupId) => {
      const el = document.getElementById('details_' + groupId);
      const chev = document.getElementById('chevron_' + groupId);
      if (el.style.display === 'none') {
        el.style.display = 'block';
        chev.style.transform = 'rotate(180deg)';
      } else {
        el.style.display = 'none';
        chev.style.transform = 'rotate(0deg)';
      }
    };



    window.toggleAttendance = async (invoiceId, attended, metadataStr) => {
      try {
        const metadata = JSON.parse(decodeURIComponent(metadataStr));
        metadata.attended = attended;
        const { error } = await supabase.from('invoices').update({ metadata }).eq('id', invoiceId);
        if (error) throw error;
      } catch (err) {
        console.error(err);
        alert('Failed to update attendance: ' + err.message);
      }
    };

    window.printAttendees = (date) => {
      const families = window.currentActivityAttendees[date];
      const activity = window.currentActivityDetails;
      if (!families) return;
      const newWin = window.open('', '_blank');
      let html = '<html><head><title>Attendee List - ' + activity.name + ' - ' + date + '</title>';
      html += '<style>body { font-family: sans-serif; padding: 20px; color: #333; } h1 { font-size: 24px; margin-bottom: 5px; } h2 { font-size: 18px; margin-bottom: 20px; color: #666; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 10px; text-align: left; } th { background-color: #f8fafc; } @media print { button { display: none; } }</style></head><body>';
      html += '<div style="display:flex; justify-content:space-between; align-items:center;"><div><h1>' + activity.name + '</h1><h2>Date: ' + date + '</h2></div>';
      html += '<button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #8bc34a; color: white; border: none; border-radius: 8px;">Print</button></div>';
      html += '<table><thead><tr><th>Parent / Contact</th><th>Contact Info</th><th>Children</th><th>Adults</th><th>Status</th></tr></thead><tbody>';

      Object.keys(families).forEach(familyKey => {
        const familyInvoices = families[familyKey];
        const pName = familyKey.split('_')[1];
        const children = familyInvoices.filter(i => i.child_id).map(i => i.children?.name).filter(Boolean);
        let adults = [];
        familyInvoices.forEach(i => {
          if (i.adult_attendees && i.adult_attendees.length > 0) {
            adults.push(...i.adult_attendees);
          } else if (i.adult_count > 0) {
            adults.push(i.adult_count + ' Adult(s)');
          }
        });
        const isFullyPaid = familyInvoices.every(i => i.status === 'paid');
        const email = familyInvoices[0].metadata?.email || familyInvoices[0].profiles?.email || 'N/A';
        const phone = familyInvoices[0].metadata?.phone || 'N/A';

        html += '<tr>';
        html += '<td>' + pName + '</td>';
        html += '<td>Email: ' + email + '<br>Phone: ' + phone + '</td>';
        html += '<td>' + (children.length ? children.join(', ') : 'None') + '</td>';
        html += '<td>' + (adults.length ? adults.join(', ') : 'None') + '</td>';
        html += '<td style="color: ' + (isFullyPaid ? 'green' : 'red') + '; font-weight: bold;">' + (isFullyPaid ? 'PAID' : 'PENDING') + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table></body></html>';
      newWin.document.write(html);
      newWin.document.close();
    };

  } catch (error) {
    console.error('Error opening activity details:', error);
    alert('Could not open activity details: ' + error.message);
  }
}

window.handleEditActivity = (a) => { getMyProvider().then(p => renderAddActivityForm(p.id, a)) }

function renderCreateProviderForm() {
  app.innerHTML = `<div class="container"><div class="card mt-4"><form id="p-form"><div class="form-group"><label>Business Name</label><input type="text" id="bn" required></div><button type="submit" class="btn btn-primary">Create</button></form></div></div>`
  document.getElementById('p-form').onsubmit = async (e) => { e.preventDefault(); try { await createProvider(document.getElementById('bn').value, ''); smartDashboardRedirect(); } catch (error) { alert(error.message) } }
}

async function renderAddActivityForm(providerId, activity = null) {
  let cropper = null;
  let croppedBlob = null;
  let perms = await getProviderPermissions(providerId);
  // Filter unique permissions by label
  perms = Array.from(new Map(perms.map(p => [p.label, p])).values());
  const isEdit = !!activity; let selectedDates = isEdit && activity.event_dates ? [...activity.event_dates] : [];
  app.innerHTML = `
    <div class="container">
      <header class="mt-4"><button id="b-p-dash" class="btn btn-outline" style="width: auto;">← Back</button><h1>${isEdit ? 'Edit' : 'New'} Activity</h1></header>
      <div class="card mt-4">
        <div id="act-step-1">
          <form id="ac-form">
            <div class="form-group text-center"><label>Activity Photo</label><div id="photo-preview-container" style="width: 100%; height: 180px; border-radius: 12px; background: #f1f5f9; margin: 0.5rem auto 1rem; border: 2px dashed var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden;"><span id="photo-placeholder" style="color: var(--text-muted); font-size: 0.875rem; ${isEdit && activity.photo_url ? 'display:none' : ''}">Click to Add Event Image</span><img id="photo-preview" src="${isEdit && activity.photo_url ? activity.photo_url : ''}" style="${isEdit && activity.photo_url ? 'display:block' : 'display:none'}; width: 100%; height: 100%; object-fit: cover;"></div><input type="file" id="photo-input" accept="image/*" style="display: none;"></div>
            <div class="form-group"><label>Activity Title</label><input type="text" id="an" value="${isEdit ? activity.name : ''}" required></div>
            <div class="form-group"><label>Status</label><select id="act-status" class="form-select"><option value="published" ${isEdit && activity.status === 'published' ? 'selected' : ''}>Published</option><option value="draft" ${isEdit && activity.status === 'draft' ? 'selected' : ''}>Draft</option><option value="delete" ${isEdit && activity.status === 'delete' ? 'selected' : ''}>Delete</option></select></div>
            <div class="form-group"><label>Description</label><textarea id="ad" rows="4" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color); padding: 0.75rem;" placeholder="Please describe event details">${isEdit ? (activity.description || '') : ''}</textarea></div>
            <div class="form-group"><label>Venue Address</label><input type="text" id="av" value="${isEdit ? (activity.location || '') : ''}" placeholder="Enter venue address" required></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"><div class="form-group"><label>Venue Type</label><select id="al" class="form-select"><option value="Indoor" ${isEdit && activity.location_type === 'Indoor' ? 'selected' : ''}>Indoor</option><option value="Outdoor" ${isEdit && activity.location_type === 'Outdoor' ? 'selected' : ''}>Outdoor</option></select></div><div class="form-group"><label>Age Groups</label><div style="display: flex; gap: 0.5rem; flex-wrap: wrap;"><label style="font-size: 0.75rem;"><input type="checkbox" name="age" value="0-3" ${isEdit && activity.age_groups?.includes('0-3') ? 'checked' : ''}> 0-3</label><label style="font-size: 0.75rem;"><input type="checkbox" name="age" value="4+" ${isEdit && activity.age_groups?.includes('4+') ? 'checked' : ''}> 4+</label><label style="font-size: 0.75rem;"><input type="checkbox" name="age" value="0-12" ${isEdit && activity.age_groups?.includes('0-12') ? 'checked' : ''}> 0-12</label></div></div></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"><div class="form-group"><label>Child Price (£)</label><input type="number" id="apc" value="${isEdit ? activity.price_child : 0}" step="0.01" required></div><div class="form-group"><label>Adult Price (£)</label><input type="number" id="apa" value="${isEdit ? activity.price_adult : 0}" step="0.01" required></div></div>
            <div class="form-group"><label style="display:flex; align-items:center; gap:6px;">Max Children per Session <span style="font-size:0.72rem; color:#94a3b8; font-weight:400;">(leave blank = unlimited)</span></label><input type="number" id="a-max-children" value="${isEdit && activity.max_children ? activity.max_children : ''}" placeholder="e.g. 12" min="1"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"><div class="form-group"><label>Start Time</label><input type="time" id="as" value="${isEdit ? activity.start_time : ''}" required></div><div class="form-group"><label>End Time</label><input type="time" id="ae" value="${isEdit ? activity.end_time : ''}" required></div></div>
            <div class="form-group"><label>Schedule Mode</label><select id="sch-mode" class="form-select" onchange="window.toggleSchedule(this.value)"><option value="specific" ${isEdit && !activity.recurrence ? 'selected' : ''}>Specific Dates</option><option value="Everyday" ${isEdit && activity.recurrence === 'Everyday' ? 'selected' : ''}>Everyday</option><option value="Weekdays" ${isEdit && activity.recurrence === 'Weekdays' ? 'selected' : ''}>Weekdays Only</option><option value="Weekends" ${isEdit && activity.recurrence === 'Weekends' ? 'selected' : ''}>Weekends Only</option></select></div>
            <div id="date-picker-div" class="form-group" style="display: ${isEdit && !activity.recurrence ? 'block' : 'none'}"><label>Add Specific Dates</label><div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;"><input type="date" id="event-date-input"><button type="button" id="add-date-btn" class="btn btn-outline" style="width: auto;">+ Add Date</button></div><div id="date-list" style="display: flex; gap: 0.4rem; flex-wrap: wrap;"></div></div>
            <div class="form-group">
              <label style="font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; display: block;">Facilities</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #fff; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                ${[
      { val: 'Toilet 🚻', label: 'Toilet', icon: '🚻' },
      { val: 'Cafe ☕', label: 'Cafe', icon: '☕' },
      { val: 'Baby Changing 👶', label: 'Baby Changing', icon: '👶' },
      { val: 'Breastfeeding Room 🤱', label: 'Breastfeeding Room', icon: '🤱' },
      { val: 'High Chairs 🪑', label: 'High Chairs', icon: '🪑' },
      { val: 'Soft Play 🧸', label: 'Soft Play', icon: '🧸' },
      { val: 'Wifi 📶', label: 'Wifi', icon: '📶' },
      { val: 'Parking 🅿️', label: 'Parking', icon: '🅿️' },
      { val: 'Accessible Toilet ♿', label: 'Accessible Toilet', icon: '♿' },
      { val: 'First Aid 🚑', label: 'First Aid', icon: '🚑' }
    ].map(f => `
                  <label style="display: flex; align-items: center; gap: 12px; font-size: 0.85rem; cursor: pointer; padding: 4px; transition: all 0.2s;">
                    <input type="checkbox" name="fac" value="${f.val}" ${isEdit && activity.facilities?.includes(f.val) ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary-color);">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="font-size: 1.1rem;">${f.icon}</span>
                      <span style="color: #475569; font-weight: 500;">${f.label}</span>
                    </div>
                  </label>
                `).join('')}
              </div>
            </div>
            <button type="submit" id="save-act-btn-1" class="btn btn-primary">Continue to Step 2</button>
          </form>
        </div>
        
        <div id="act-step-2" style="display: none;">
          <h2 style="font-size: 1.1rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; text-align: center;">Do you need permission form(s) for this activity?</h2>
          <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
            <button id="p-no-btn" class="btn btn-outline" style="flex: 1;">No, No Permission Needed</button>
            <button id="p-yes-btn" class="btn btn-primary" style="flex: 1;">Yes, Need Permissions</button>
          </div>
          
          <div id="permission-list-div" style="display: none; background: #f8fafc; padding: 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 2rem;">
            <p style="font-weight: 700; color: #1e293b; margin-bottom: 1rem; font-size: 0.9rem;">Select Required Permissions:</p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${perms.map(p => `
                <label style="display: flex; flex-direction: column; gap: 4px; padding: 0.75rem; background: #fff; border-radius: 12px; border: 1px solid #f1f5f9; cursor: pointer;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" name="req-p" value="${p.label}" ${isEdit && activity.required_permissions?.includes(p.label) ? 'checked' : ''} style="width: 18px; height: 18px;">
                    <span style="font-weight: 700; color: #1e293b;">${p.label}</span>
                  </div>
                  <p style="margin: 0 0 0 28px; font-size: 0.75rem; color: #64748b; line-height: 1.3;">${p.description}</p>
                </label>
              `).join('')}
            </div>
          </div>
          
          <button id="final-save-btn" class="btn btn-primary" style="width: 100%; display: none;">${isEdit ? 'Update' : 'Save'} Activity</button>
        </div>
      </div>
    </div>
    </div>
    <div id="cropper-modal" class="cropper-modal-overlay crop-rounded" style="display:none;"><div class="cropper-container-box"><h3>Adjust Image</h3><div class="cropper-wrapper"><img id="cropper-image" style="display: block; max-width: 100%;"></div><div class="cropper-actions"><button id="crop-cancel" class="btn btn-outline">Cancel</button><button id="crop-save" class="btn btn-primary">Apply</button></div></div></div>
  `
  const photoInput = document.getElementById('photo-input'); const photoPreview = document.getElementById('photo-preview'); const photoPlaceholder = document.getElementById('photo-placeholder'); const cropperModal = document.getElementById('cropper-modal'); const cropperImage = document.getElementById('cropper-image')
  document.getElementById('photo-preview-container').onclick = () => photoInput.click()
  photoInput.onchange = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (re) => { cropperImage.src = re.target.result; cropperModal.style.display = 'flex'; if (cropper) cropper.destroy(); setTimeout(() => { cropper = new Cropper(cropperImage, { aspectRatio: 16 / 9, viewMode: 1, dragMode: 'move', guides: false, autoCropArea: 0.8, cropBoxMovable: false, cropBoxResizable: false, background: false, modal: false }) }, 300) }; reader.readAsDataURL(file) } }
  document.getElementById('crop-save').onclick = () => { if (cropper) { const canvas = cropper.getCroppedCanvas({ width: 800, height: 450 }); photoPreview.src = canvas.toDataURL('image/jpeg'); photoPreview.style.display = 'block'; photoPlaceholder.style.display = 'none'; canvas.toBlob((blob) => { croppedBlob = blob }, 'image/jpeg'); cropperModal.style.display = 'none' } }
  document.getElementById('crop-cancel').onclick = () => { cropperModal.style.display = 'none'; photoInput.value = '' }
  const dateListDiv = document.getElementById('date-list'); const dateInput = document.getElementById('event-date-input')
  const updateDateList = () => { dateListDiv.innerHTML = selectedDates.map((d, i) => `<span style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; display: flex; align-items: center; gap: 4px;">${d} <span onclick="window.removeDate(${i})" style="cursor:pointer; font-weight: bold;">×</span></span>`).join('') }
  document.getElementById('add-date-btn').onclick = () => { if (dateInput.value && !selectedDates.includes(dateInput.value)) { selectedDates.push(dateInput.value); updateDateList() } }
  window.removeDate = (i) => { selectedDates.splice(i, 1); updateDateList() }
  if (isEdit) updateDateList()
  window.toggleSchedule = (mode) => { document.getElementById('date-picker-div').style.display = mode === 'specific' ? 'block' : 'none' }
  document.getElementById('b-p-dash').onclick = () => smartDashboardRedirect()
  document.getElementById('ac-form').onsubmit = (e) => {
    e.preventDefault();
    document.getElementById('act-step-1').style.display = 'none';
    document.getElementById('act-step-2').style.display = 'block';
  }

  document.getElementById('p-no-btn').onclick = () => {
    document.querySelectorAll('input[name="req-p"]').forEach(cb => cb.checked = false);
    document.getElementById('final-save-btn').click();
  };

  document.getElementById('p-yes-btn').onclick = () => {
    document.getElementById('permission-list-div').style.display = 'block';
    document.getElementById('final-save-btn').style.display = 'block';
  };

  document.getElementById('final-save-btn').onclick = async () => {
    const btn = document.getElementById('final-save-btn');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
      let photoUrl = isEdit ? activity.photo_url : null;
      if (croppedBlob) {
        const file = new File([croppedBlob], `act-${Date.now()}.jpg`, { type: 'image/jpeg' });
        try {
          photoUrl = await uploadActivityPhoto(file);
        } catch (uploadErr) {
          console.error('Upload failed, using Base64 fallback:', uploadErr);
          if (cropper) {
            const lowResCanvas = cropper.getCroppedCanvas({ width: 400, height: 225 });
            photoUrl = lowResCanvas.toDataURL('image/jpeg', 0.4);
          } else {
            photoUrl = document.getElementById('photo-preview').src;
          }
        }
      }
      const ageGroups = Array.from(document.querySelectorAll('input[name="age"]:checked')).map(cb => cb.value)
      const facilities = Array.from(document.querySelectorAll('input[name="fac"]:checked')).map(cb => cb.value)
      const reqPermissions = Array.from(document.querySelectorAll('input[name="req-p"]:checked')).map(cb => cb.value)
      const mode = document.getElementById('sch-mode').value
      const data = {
        name: document.getElementById('an').value,
        description: document.getElementById('ad').value,
        location: document.getElementById('av').value,
        location_type: document.getElementById('al').value,
        price_child: document.getElementById('apc').value,
        price_adult: document.getElementById('apa').value,
        start_time: document.getElementById('as').value,
        end_time: document.getElementById('ae').value,
        age_groups: ageGroups,
        facilities: facilities,
        required_permissions: reqPermissions,
        recurrence: mode === 'specific' ? null : mode,
        event_dates: mode === 'specific' ? selectedDates : null,
        photo_url: photoUrl,
        status: document.getElementById('act-status').value,
        max_children: document.getElementById('a-max-children')?.value ? parseInt(document.getElementById('a-max-children').value) : null
      }
      if (isEdit) { await updateActivity(activity.id, data) } else { await addActivity(providerId, data) }
      smartDashboardRedirect();
    } catch (error) { console.error(error); alert('Save failed: ' + error.message); btn.disabled = false; btn.textContent = isEdit ? 'Update Activity' : 'Save Activity'; }
  }
}

window.renderMyProfile = renderMyProfile;
async function renderMyProfile() {
  const profile = await getMyProfile();
  let cropper = null;
  let croppedBlob = null;

  app.innerHTML = `
    <div class="container">
      <header style="display: flex; flex-direction: column; align-items: center; margin-top: 1.5rem; margin-bottom: 2rem; gap: 15px;">
        <img src="${logo}" alt="Urban Tribe" style="height: 40px;">
        <h1 style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">My Profile</h1>
      </header>

      <div class="mt-4" style="text-align: center; background: #fff; padding: 2rem; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <div style="position: relative; width: 100px; height: 100px; margin: 0 auto 1rem;">
          <img src="${profile.photo_url || 'https://via.placeholder.com/100'}" id="p-img-summary" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer;" title="Click to change photo">
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted);">Click to change photo</p>
      </div>

      <div class="card mt-4">
        <form id="profile-form">
          <input type="file" id="photo-input" accept="image/*" capture="environment" style="display: none;">
          <h3 style="font-size: 0.9rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;">Personal Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" id="p-first-name" value="${profile.metadata?.first_name || ''}" placeholder="John">
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" id="p-last-name" value="${profile.metadata?.last_name || ''}" placeholder="Doe">
            </div>
          </div>
          <div class="form-group">
            <label>Full Display Name</label>
            <input type="text" id="p-name" value="${profile.full_name || ''}" required>
          </div>
          <div class="form-group">
            <label>Mobile Number</label>
            <input type="tel" id="p-phone" value="${profile.phone || ''}" placeholder="07123 456789">
          </div>
          <div class="form-group">
            <label>Postcode</label>
            <input type="text" id="p-postcode" value="${profile.metadata?.postcode || ''}" placeholder="SW1A 1AA">
          </div>
          <div class="form-group" style="background: #fdf2f2; padding: 1.25rem; border-radius: 16px; border: 1px solid #fee2e2; margin-bottom: 1.5rem;">
            <label style="color: #991b1b; font-weight: 800; margin-bottom: 8px; display: block;">Can other parents connect with you?</label>
            <p style="font-size: 0.75rem; color: #b91c1c; margin-bottom: 12px; line-height: 1.4;">If you select 'No', your name won't appear when other parents search for you.</p>
            <select id="p-discoverable" class="form-select" style="background: #fff; border-color: #fecaca; font-weight: 700;">
              <option value="yes" ${profile.metadata?.discoverable !== 'no' ? 'selected' : ''}>Yes, let parents find me</option>
              <option value="no" ${profile.metadata?.discoverable === 'no' ? 'selected' : ''}>No, keep me private</option>
            </select>
          </div>
          <button type="submit" id="save-profile-btn" class="btn btn-primary">Save Profile</button>
        </form>
      </div>

      <div class="card mt-4" style="border-top: 4px solid var(--primary-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;">
          <h3 style="font-size: 0.9rem; font-weight: 800; color: #1e293b; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Family Members</h3>
          <div style="display: flex; gap: 0.5rem;">
            <button id="j-family" class="btn btn-outline" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.7rem; border-radius: 10px;">Join</button>
            <button id="a-child" class="btn btn-primary" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.7rem; border-radius: 10px;">+ Add</button>
          </div>
        </div>
        <div id="c-list">Loading children...</div>
      </div>

      <div class="card mt-4" style="border-top: 4px solid #c4b5fd;">
        <h3 style="font-size: 0.9rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Security</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Manage your account security and password.</p>
        <button id="btn-change-password" class="btn btn-outline" style="width: 100%; border-color: #e2e8f0; color: #1e293b; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 18px; height: 18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
          Change Account Password
        </button>
      </div>
    </div>
    <div id="cropper-modal" class="cropper-modal-overlay crop-circle" style="display:none;"><div class="cropper-container-box"><h3>Adjust Photo</h3><div class="cropper-wrapper"><img id="cropper-image" style="display: block; max-width: 100%;"></div><div class="cropper-actions"><button id="crop-cancel" class="btn btn-outline">Cancel</button><button id="crop-save" class="btn btn-primary">Apply</button></div></div></div>
    <div id="password-modal-container"></div>
    ${renderBottomNav('profile', profile)}
  `;
  attachNavEvents();

  // Render children in profile
  const children = await getMyChildren();
  const cListEl = document.getElementById('c-list');
  if (cListEl) {
    cListEl.innerHTML = children.length ? children.map(c => `
      <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border: 1px solid #f1f5f9; box-shadow: none; margin-bottom: 0.5rem;">
        <div onclick='window.handleEditChild(${JSON.stringify(c)})' style="display: flex; align-items: center; gap: 1rem; cursor: pointer; flex: 1;">
          ${c.photo_url ? `<img src="${c.photo_url}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : `<div style="width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">${c.name[0]}</div>`}
          <div>
            <p style="font-weight: 700; color: var(--primary-color); font-size: 0.85rem; text-decoration: underline;">${c.name}</p>
            <p style="font-size: 0.7rem; color: var(--text-muted);">${c.relationship}</p>
          </div>
        </div>
        <button onclick='window.handleEditChild(${JSON.stringify(c)})' class="btn btn-outline" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.7rem; border-radius: 8px;">Edit</button>
      </div>
    `).join('') : '<p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 1rem;">No children added.</p>';
  }

  document.getElementById('a-child').onclick = () => renderChildForm();
  document.getElementById('j-family').onclick = () => renderJoinFamilyForm();

  const photoInput = document.getElementById('photo-input');
  const cropperModal = document.getElementById('cropper-modal');
  const cropperImage = document.getElementById('cropper-image');
  const summaryImg = document.getElementById('p-img-summary');

  summaryImg.onclick = () => photoInput.click();

  photoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        cropperImage.src = re.target.result;
        cropperModal.style.display = 'flex';
        if (cropper) cropper.destroy();
        setTimeout(() => {
          cropper = new Cropper(cropperImage, { aspectRatio: 1, viewMode: 1, dragMode: 'move', guides: false, autoCropArea: 0.8, cropBoxMovable: false, cropBoxResizable: false, background: false, modal: false })
        }, 300)
      };
      reader.readAsDataURL(file)
    }
  }

  document.getElementById('crop-save').onclick = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({ width: 500, height: 500 });
      const dataUrl = canvas.toDataURL('image/jpeg');
      summaryImg.src = dataUrl;
      canvas.toBlob((blob) => { croppedBlob = blob }, 'image/jpeg');
      cropperModal.style.display = 'none'
    }
  }

  document.getElementById('crop-cancel').onclick = () => {
    cropperModal.style.display = 'none';
    photoInput.value = ''
  };

  document.getElementById('b-dash').onclick = () => initApp();

  document.getElementById('btn-change-password').onclick = () => renderChangePasswordModal();

  document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-profile-btn');
    btn.disabled = true;
    try {
      let photoUrl = profile.photo_url || null;
      if (croppedBlob) {
        const file = new File([croppedBlob], `profile-${Date.now()}.jpg`, { type: 'image/jpeg' });
        try {
          photoUrl = await uploadChildPhoto(file);
        } catch (uploadErr) {
          console.error('Profile photo upload failed, using fallback:', uploadErr);
          if (cropper) {
            const lowResCanvas = cropper.getCroppedCanvas({ width: 400, height: 400 });
            photoUrl = lowResCanvas.toDataURL('image/jpeg', 0.5);
          } else {
            photoUrl = summaryImg.src;
          }
        }
      }

      const updatedMetadata = {
        ...(profile.metadata || {}),
        first_name: document.getElementById('p-first-name').value,
        last_name: document.getElementById('p-last-name').value,
        postcode: document.getElementById('p-postcode').value,
        discoverable: document.getElementById('p-discoverable').value
      };

      await updateMyProfile({
        full_name: document.getElementById('p-name').value,
        phone: document.getElementById('p-phone').value,
        email: document.getElementById('p-email').value,
        photo_url: photoUrl,
        metadata: updatedMetadata
      });
      alert('Profile updated successfully!');
      initApp();
    } catch (err) {
      if (err.code === '42703' || err.code === 'PGRST204' || (err.message && err.message.includes('schema cache'))) {
        alert('Eksik Veritabanı Alanları! Lütfen az önce verdiğim SQL komutunu Supabase SQL Editor üzerinden çalıştırın (email, phone ve photo_url alanlarını eklemek için).');
      } else {
        alert('Error updating profile: ' + err.message);
      }
      btn.disabled = false;
    }
  };
}

function renderChangePasswordModal() {
  const container = document.getElementById('password-modal-container');
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '1500';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px; width: 90%; background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
      <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem;">Update Password</h2>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.85rem;">Enter a new strong password for your account.</p>
      
      <form id="change-pass-form">
        <div class="form-group">
          <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; text-transform: uppercase;">New Password</label>
          <input type="password" id="new-pass" required minlength="6" placeholder="Min. 6 characters" style="padding: 0.75rem; border-radius: 10px; border: 1px solid #e2e8f0; width: 100%;">
        </div>
        
        <div class="form-group">
          <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; text-transform: uppercase;">Confirm New Password</label>
          <input type="password" id="confirm-pass" required minlength="6" placeholder="Repeat password" style="padding: 0.75rem; border-radius: 10px; border: 1px solid #e2e8f0; width: 100%;">
        </div>

        <div style="display: flex; gap: 12px; margin-top: 1.5rem;">
          <button type="button" onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-outline" style="flex: 1;">Cancel</button>
          <button type="submit" id="save-pass-btn" class="btn btn-primary" style="flex: 1;">Update</button>
        </div>
      </form>
    </div>
  `;
  container.appendChild(modal);

  document.getElementById('change-pass-form').onsubmit = async (e) => {
    e.preventDefault();
    const newPass = document.getElementById('new-pass').value;
    const confirmPass = document.getElementById('confirm-pass').value;

    if (newPass !== confirmPass) {
      alert('Passwords do not match!');
      return;
    }

    const btn = document.getElementById('save-pass-btn');
    btn.disabled = true;
    btn.textContent = 'Updating...';

    try {
      console.log('Starting password update...');
      // Refresh session first to be sure
      await getSession();

      await updatePassword(newPass);
      console.log('Password update successful!');
      alert('Password updated successfully!');
      modal.remove();
    } catch (err) {
      console.error('Password update error:', err);
      alert('Error updating password: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Update';
    } finally {
      // Just in case, ensure button is not stuck after a long wait
      setTimeout(() => {
        if (btn.disabled && btn.textContent === 'Updating...') {
          btn.disabled = false;
          btn.textContent = 'Update';
        }
      }, 5000);
    }
  };
}

window.openTermsModal = (termsEncoded) => {
  const terms = decodeURIComponent(termsEncoded) || 'No terms and conditions provided by the business.';
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay crop-rounded';
  modal.style.display = 'flex';
  modal.style.zIndex = '9999';
  modal.innerHTML = `
    <div class="cropper-container-box" style="max-width: 600px; width: 90%; max-height: 80vh; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0;">
        <h3 style="margin: 0; font-weight: 800; color: #1e293b;">Terms and Conditions</h3>
        <button onclick="this.closest('.cropper-modal-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
      </div>
      <div style="overflow-y: auto; padding-right: 0.5rem; white-space: pre-wrap; font-size: 0.9rem; color: #475569; line-height: 1.6;">${terms}</div>
      <div style="margin-top: 1.5rem; text-align: right;">
        <button onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-primary" style="width: auto;">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

window.renderAddNewsForm = async (providerId, news = null) => {
  const isEdit = !!news;
  let cropper = null;
  let croppedBlob = null;
  app.innerHTML = `
    <div class="container" style="padding-bottom: 80px;">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
        <button id="b-p-dash" class="btn btn-outline" style="width: auto;">← Back</button>
        <h2 style="font-size: 1.25rem;">${isEdit ? 'Edit' : 'Add'} News</h2>
        <div style="width: 60px;"></div>
      </header>
      <div class="mt-4 card">
        <form id="ac-form">
          <input type="file" id="photo-input" accept="image/*" capture="environment" style="display: none;">
          <div class="form-group" style="text-align: center; margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #1e293b;">News Photo</label>
            <div id="photo-preview-container" style="width: 100%; height: 200px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;">
              <img id="photo-preview" src="${isEdit && news.photo_url ? news.photo_url : ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${isEdit && news.photo_url ? 'block' : 'none'};">
              <span id="photo-placeholder" style="color: #64748b; font-weight: 600; display: ${isEdit && news.photo_url ? 'none' : 'block'};">Click to Add News Image</span>
            </div>
          </div>
          <div class="form-group"><label style="font-weight: bold; color: #1e293b;">News Title</label><input type="text" id="an" value="${isEdit ? news.title : ''}" required></div>
          <div class="form-group"><label style="font-weight: bold; color: #1e293b;">Status</label><select id="news-status" class="form-select"><option value="published" ${isEdit && news.status === 'published' ? 'selected' : ''}>Published</option><option value="draft" ${isEdit && news.status === 'draft' ? 'selected' : ''}>Draft</option><option value="delete" ${isEdit && news.status === 'delete' ? 'selected' : ''}>Delete</option></select></div>
          <div class="form-group"><label style="font-weight: bold; color: #1e293b;">Description</label><textarea id="ad" rows="6" maxlength="2500" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color); padding: 0.75rem;" placeholder="Please describe news details" required>${isEdit ? (news.description || '') : ''}</textarea></div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" id="save-act-btn" class="btn btn-primary" style="flex: 1;">${isEdit ? 'Update' : 'Post'} News</button>
          </div>
          <p id="news-error-msg" style="color: red; font-size: 0.85rem; margin-top: 1rem; text-align: center; display: none;"></p>
          <div id="debug-log" style="margin-top: 10px; font-size: 12px; color: #666; font-family: monospace;"></div>
        </form>
      </div>
    </div>
    <div id="cropper-modal" class="cropper-modal-overlay crop-rounded" style="display:none;"><div class="cropper-container-box"><h3>Adjust Image</h3><div class="cropper-wrapper"><img id="cropper-image" style="display: block; max-width: 100%;"></div><div class="cropper-actions"><button id="crop-cancel" class="btn btn-outline">Cancel</button><button id="crop-save" class="btn btn-primary">Apply</button></div></div></div>
  `;
  const photoInput = document.getElementById('photo-input'); const photoPreview = document.getElementById('photo-preview'); const photoPlaceholder = document.getElementById('photo-placeholder'); const cropperModal = document.getElementById('cropper-modal'); const cropperImage = document.getElementById('cropper-image');
  document.getElementById('photo-preview-container').onclick = () => photoInput.click();
  photoInput.onchange = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (re) => { cropperImage.src = re.target.result; cropperModal.style.display = 'flex'; if (cropper) cropper.destroy(); setTimeout(() => { cropper = new Cropper(cropperImage, { aspectRatio: 16 / 9, viewMode: 1, dragMode: 'move', guides: false, autoCropArea: 0.8, cropBoxMovable: false, cropBoxResizable: false, background: false, modal: false }) }, 300) }; reader.readAsDataURL(file) } }
  document.getElementById('crop-save').onclick = () => { if (cropper) { const canvas = cropper.getCroppedCanvas({ width: 800, height: 450 }); photoPreview.src = canvas.toDataURL('image/jpeg'); photoPreview.style.display = 'block'; photoPlaceholder.style.display = 'none'; canvas.toBlob((blob) => { croppedBlob = blob }, 'image/jpeg'); cropperModal.style.display = 'none' } }
  document.getElementById('crop-cancel').onclick = () => { cropperModal.style.display = 'none'; photoInput.value = '' }
  document.getElementById('b-p-dash').onclick = () => smartDashboardRedirect();
  document.getElementById('ac-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-act-btn');
    const errorMsg = document.getElementById('news-error-msg');
    const debugLog = document.getElementById('debug-log');
    const log = (msg) => { debugLog.innerHTML += `<div>[${new Date().toLocaleTimeString()}] ${msg}</div>`; console.log(msg); };

    btn.disabled = true;
    btn.textContent = 'Saving...';
    errorMsg.style.display = 'none';
    debugLog.innerHTML = '';

    try {
      log('Started saving...');
      let photoUrl = isEdit ? news.photo_url : null;
      if (croppedBlob) {
        log('Uploading photo to Supabase...');
        const file = new File([croppedBlob], `news-${Date.now()}.jpg`, { type: 'image/jpeg' });

        // Timeout için Promise.race kullanıyoruz (3 saniye)
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('timeout'), 3000));
        const uploadResult = await Promise.race([
          uploadActivityPhoto(file).catch(err => ({ error: err })),
          timeoutPromise
        ]);

        if (uploadResult === 'timeout' || (uploadResult && uploadResult.error)) {
          log('Storage upload failed or timed out! Using Base64 fallback...');
          // Çok güçlü bir sıkıştırma uygulayarak ağ engelini aşmayı deniyoruz (Kalite 0.3, Boyut 400x225)
          if (cropper) {
            const lowResCanvas = cropper.getCroppedCanvas({ width: 400, height: 225 });
            photoUrl = lowResCanvas.toDataURL('image/jpeg', 0.3);
            log('Compressed Base64 generated. Length: ' + photoUrl.length);
          } else {
            photoUrl = document.getElementById('photo-preview').src;
          }
        } else {
          photoUrl = uploadResult;
          log('Photo uploaded: ' + photoUrl);
        }
      } else {
        log('No photo to upload.');
      }

      if (isEdit) {
        log('Updating news record...');
        await updateNews(news.id, {
          title: document.getElementById('an').value,
          description: document.getElementById('ad').value,
          photo_url: photoUrl,
          status: document.getElementById('news-status').value
        });
        log('News record updated!');
      } else {
        log('Adding news record...');
        await addNews(providerId, {
          title: document.getElementById('an').value,
          description: document.getElementById('ad').value,
          photo_url: photoUrl,
          status: document.getElementById('news-status').value
        });
        log('News record added!');
      }

      log('Rendering dashboard...');
      await smartDashboardRedirect();
    } catch (error) {
      log('ERROR: ' + error.message);
      console.error(error);
      errorMsg.textContent = 'Save failed: ' + (error.message || 'Unknown error') + '. Lütfen veritabanınızı (news tablosunu) kontrol edin.';
      errorMsg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = isEdit ? 'Update News' : 'Post News';
    }
  }
}

window.renderAddPollForm = async (providerId, poll = null) => {
  const isEdit = !!poll;
  app.innerHTML = `
    <div class="container" style="padding-bottom: 80px;">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
        <button id="b-p-dash-poll" class="btn btn-outline" style="width: auto;">← Back</button>
        <h2 style="font-size: 1.25rem;">${isEdit ? 'Edit' : 'Add'} Poll</h2>
        <div style="width: 60px;"></div>
      </header>
      <div class="mt-4 card">
        <form id="poll-form">
          <div class="form-group">
            <label style="font-weight: bold; color: #1e293b;">Poll Question</label>
            <input type="text" id="pq" value="${isEdit ? poll.title : ''}" placeholder="e.g. What is your favorite color?" required>
          </div>
          <div class="form-group">
            <label style="font-weight: bold; color: #1e293b;">Options</label>
            <div id="poll-options-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
            <button type="button" id="add-opt-btn" class="btn btn-outline" style="margin-top: 8px; font-size: 0.8rem; height: 32px;">+ Add Option</button>
          </div>
          <div class="form-group">
            <label style="font-weight: bold; color: #1e293b;">Status</label>
            <select id="poll-status" class="form-select">
              <option value="published" ${isEdit && poll.status === 'published' ? 'selected' : ''}>Published</option>
              <option value="draft" ${isEdit && poll.status === 'draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
          <button type="submit" id="save-poll-btn" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">${isEdit ? 'Update' : 'Post'} Poll</button>
        </form>
      </div>
    </div>
  `;

  const container = document.getElementById('poll-options-container');
  const addOption = (val = '') => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.innerHTML = `
      <input type="text" class="poll-opt" value="${val}" placeholder="Option" required style="flex: 1;">
      <button type="button" class="btn btn-outline rem-opt" style="width: auto; padding: 0 10px; color: red;">×</button>
    `;
    div.querySelector('.rem-opt').onclick = () => div.remove();
    container.appendChild(div);
  };

  if (isEdit && poll.metadata?.options) {
    poll.metadata.options.forEach(o => addOption(o));
  } else {
    addOption();
    addOption();
  }

  document.getElementById('add-opt-btn').onclick = () => addOption();
  document.getElementById('b-p-dash-poll').onclick = () => renderProviderDashboard();

  document.getElementById('poll-form').onsubmit = async (e) => {
    e.preventDefault();
    console.log('Poll form submitted');
    const btn = document.getElementById('save-poll-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const options = Array.from(document.querySelectorAll('.poll-opt')).map(i => i.value.trim()).filter(v => v);
      console.log('Options collected:', options);
      if (options.length < 2) {
        alert('Please add at least 2 options');
        btn.disabled = false;
        btn.textContent = isEdit ? 'Update Poll' : 'Post Poll';
        return;
      }

      const pollData = {
        title: document.getElementById('pq').value,
        description: document.getElementById('pq').value, // Use question as description
        status: document.getElementById('poll-status').value,
        metadata: { options },
        type: 'poll'
      };

      console.log('Sending poll data:', pollData);
      if (isEdit) await updateNews(poll.id, pollData);
      else await addPoll(providerId, pollData);
      console.log('Poll saved successfully, rendering dashboard...');
      await renderProviderDashboard();
    } catch (err) {
      console.error('Poll save error:', err);
      alert('Save failed: ' + err.message);
      btn.disabled = false;
      btn.textContent = isEdit ? 'Update Poll' : 'Post Poll';
    }
  };
}

window.handleEditPermission = (permission) => {
  renderPermissionForm(permission.provider_id, permission);
}

function renderPermissionForm(providerId, permission = null) {
  const isEdit = !!permission;
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 90%; background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
      <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 800; color: #1e293b;">${isEdit ? 'Edit' : 'New'} Permission</h2>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem;">Define the consent wording parents will see.</p>
      
      <div class="form-group">
        <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; text-transform: uppercase;">Label (e.g. Photo Release)</label>
        <input type="text" id="p-label" value="${isEdit ? (permission.label || '') : ''}" placeholder="Short title" style="padding: 0.75rem; border-radius: 10px; border: 1px solid #e2e8f0; width: 100%;">
      </div>
      
      <div class="form-group">
        <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; text-transform: uppercase;">Description / Legal Wording</label>
        <textarea id="p-desc" rows="5" style="width: 100%; border-radius: 10px; border: 1px solid #e2e8f0; padding: 0.75rem; font-size: 0.9rem;" placeholder="I give permission for...">${isEdit ? (permission.description || '') : ''}</textarea>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 1rem;">
        <button id="p-cancel" class="btn btn-outline" style="flex: 1;">Cancel</button>
        <button id="p-save" class="btn btn-primary" style="flex: 1;">Save Permission</button>
      </div>
      ${isEdit ? `<button id="p-delete" style="width: 100%; margin-top: 12px; background: none; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 700; cursor: pointer; text-decoration: underline;">Delete Permission</button>` : ''}
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('p-cancel').onclick = () => modal.remove();

  document.getElementById('p-save').onclick = async () => {
    const label = document.getElementById('p-label').value.trim();
    const description = document.getElementById('p-desc').value.trim();
    if (!label || !description) return alert('Please fill in both fields.');

    const btn = document.getElementById('p-save');
    btn.disabled = true; btn.textContent = 'Saving...';

    try {
      const data = { label, description };
      if (isEdit) data.id = permission.id;
      await saveProviderPermission(providerId, data);
      modal.remove();
      if (document.getElementById('admin-tab-content')) {
        loadAdminPermissions();
      } else {
        renderProviderDashboard();
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
      btn.disabled = false; btn.textContent = 'Save Permission';
    }
  };

  if (isEdit) {
    document.getElementById('p-delete').onclick = async () => {
      if (!confirm('Are you sure you want to delete this permission? Activities using it will still show the name but may lose details.')) return;
      try {
        await deleteProviderPermission(permission.id);
        modal.remove();
        renderProviderDashboard();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    };
  }
}

window.viewPermissionAnswers = (encAnswers, childName) => {
  const answers = JSON.parse(decodeURIComponent(encAnswers));
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 90%; background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-height: 80vh; overflow-y: auto;">
      <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 800; color: #1e293b;">Activity Permissions</h2>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.85rem;">Consent status for <strong>${childName}</strong></p>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
        ${Object.entries(answers).map(([label, value]) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;">
            <span style="font-size: 0.9rem; font-weight: 600; color: #334155;">${label}</span>
            <span style="font-size: 0.8rem; font-weight: 800; color: ${value === 'Yes' ? '#059669' : '#ef4444'}; background: ${value === 'Yes' ? '#ecfdf5' : '#fef2f2'}; padding: 4px 10px; border-radius: 8px; border: 1px solid ${value === 'Yes' ? '#d1fae5' : '#fee2e2'};">
              ${value === 'Yes' ? '✅ YES' : '❌ NO'}
            </span>
          </div>
        `).join('')}
      </div>
      
      <button onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-primary" style="width: 100%;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
};

// Social & Proximity Booking UI Functions
window.joinFriendActivity = async (activity, date) => {
  await openEnrollModal(activity, date);
  const dateSelect = document.getElementById('enroll-date');
  if (dateSelect) {
    dateSelect.value = date;
    // Trigger the total calculation
    dateSelect.dispatchEvent(new Event('change'));
  }
}

window.renderFriendsTab = async () => {
  const profile = await getMyProfile().catch(() => ({}));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-friends')?.classList.add('active');

  app.innerHTML = `
    <div class="container" style="padding-bottom: 100px;">
      <header style="display: flex; flex-direction: column; align-items: center; margin-top: 1.5rem; margin-bottom: 2rem; gap: 12px;">
        <img src="${logo}" alt="Urban Tribe" style="height: 40px;">
        <h1 style="font-size: 1.75rem; font-weight: 900; color: #1e293b; margin: 0;">Friends</h1>
        <div onclick="window.renderQRModal('${profile.id}')" style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 5px;">
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-align: right; max-width: 140px; line-height: 1.2;">Want to connect to another parent?</span>
          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px; color: var(--primary-color);">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
            </svg>
          </div>
        </div>
      </header>

      <section style="margin-bottom: 2rem;">
        <div style="background: #f8fafc; border-radius: 20px; padding: 4px; display: flex; border: 1px solid #e2e8f0; margin-bottom: 1.5rem;">
          <button id="friends-tab-list" style="flex: 1; padding: 12px; border-radius: 16px; border: none; background: #fff; color: #1e293b; font-weight: 800; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">My Friends</button>
          <button id="friends-tab-search" style="flex: 1; padding: 12px; border-radius: 16px; border: none; background: transparent; color: #64748b; font-weight: 700; cursor: pointer;">Find People</button>
        </div>

        <div id="friends-content-area">
          <div style="text-align: center; padding: 2rem;"><p style="color: #94a3b8;">Loading...</p></div>
        </div>
      </section>
      
      <section id="pending-requests-section" style="display: none; margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
          Pending Requests <span id="pending-count" style="background: #ef4444; color: #fff; font-size: 0.65rem; padding: 2px 8px; border-radius: 10px;">0</span>
        </h3>
        <div id="pending-requests-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
      </section>
    </div>
    ${renderBottomNav('friends', profile)}
  `;
  attachNavEvents();

  const contentArea = document.getElementById('friends-content-area');
  const pendingSection = document.getElementById('pending-requests-section');
  const pendingListEl = document.getElementById('pending-requests-list');
  const pendingCountEl = document.getElementById('pending-count');

  const showFriendsList = async () => {
    document.getElementById('friends-tab-list').style.background = '#fff';
    document.getElementById('friends-tab-list').style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    document.getElementById('friends-tab-search').style.background = 'transparent';
    document.getElementById('friends-tab-search').style.boxShadow = 'none';

    contentArea.innerHTML = '<p style="text-align: center; color: #94a3b8;">Loading friends...</p>';
    const friends = await getFriends();
    if (!friends.length) {
      contentArea.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; background: #fff; border-radius: 24px; border: 1px solid #f1f5f9;">
          <p style="font-size: 2.5rem; margin-bottom: 1rem;">🏘️</p>
          <h4 style="color: #1e293b; font-weight: 800; margin-bottom: 8px;">Build Your Community</h4>
          <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">Connect with parents to see what activities their kids are attending.</p>
          <button onclick="document.getElementById('friends-tab-search').click()" class="btn btn-primary" style="width: auto; padding: 0.6rem 1.5rem;">Find Friends</button>
        </div>
      `;
    } else {
      contentArea.innerHTML = friends.map(f => `
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary-color);">
              ${f.photo_url ? `<img src="${f.photo_url}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : f.full_name[0]}
            </div>
            <div>
              <p style="font-weight: 700; color: #1e293b;">${f.full_name}</p>
              <p style="font-size: 0.75rem; color: #94a3b8;">Active connection</p>
            </div>
          </div>
          <button onclick="alert('Profile view coming soon!')" class="btn btn-outline" style="width: auto; padding: 6px 12px; font-size: 0.75rem;">Profile</button>
        </div>
      `).join('');
    }

    const requests = await getFriendRequests();
    if (requests.length > 0) {
      pendingSection.style.display = 'block';
      pendingCountEl.textContent = requests.length;
      pendingListEl.innerHTML = requests.map(r => `
        <div style="background: #fff; padding: 1rem; border-radius: 16px; border: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem;">${r.requester?.full_name[0]}</div>
            <span style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">${r.requester?.full_name}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.handleFriendResponse('${r.id}', 'active')" style="background: #10b981; color: #fff; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer;">✓</button>
            <button onclick="window.handleFriendResponse('${r.id}', 'blocked')" style="background: #f1f5f9; color: #64748b; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer;">×</button>
          </div>
        </div>
      `).join('');
    } else {
      pendingSection.style.display = 'none';
    }
  }

  const showSearch = () => {
    document.getElementById('friends-tab-search').style.background = '#fff';
    document.getElementById('friends-tab-search').style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    document.getElementById('friends-tab-list').style.background = 'transparent';
    document.getElementById('friends-tab-list').style.boxShadow = 'none';

    contentArea.innerHTML = `
      <div style="position: relative; margin-bottom: 1.5rem;">
        <input type="text" id="friend-search-input" placeholder="Search by name..." style="width: 100%; padding: 1rem 1rem 1rem 3rem; border-radius: 16px; border: 1px solid #e2e8f0; font-size: 1rem; outline: none; transition: border-color 0.2s;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #94a3b8;">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <div id="search-results-area">
        <p style="text-align: center; color: #94a3b8; font-size: 0.9rem;">Type to search for parents you know.</p>
      </div>
    `;

    document.getElementById('friend-search-input').oninput = async (e) => {
      const q = e.target.value.trim();
      if (q.length < 2) return;
      const results = await searchProfiles(q);
      const resultsArea = document.getElementById('search-results-area');
      if (!results.length) {
        resultsArea.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 1rem;">No people found matching your search.</p>';
      } else {
        resultsArea.innerHTML = results.map(p => `
          <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary-color); border: 1px solid #e2e8f0;">
                ${p.photo_url ? `<img src="${p.photo_url}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : p.full_name[0]}
              </div>
              <span style="font-weight: 700; color: #1e293b;">${p.full_name}</span>
            </div>
            <button onclick="window.handleSendFriendRequest('${p.id}', this)" class="btn btn-primary" style="width: auto; padding: 6px 16px; font-size: 0.75rem;">Connect</button>
          </div>
        `).join('');
      }
    };
  }

  document.getElementById('friends-tab-list').onclick = showFriendsList;
  document.getElementById('friends-tab-search').onclick = showSearch;

  showFriendsList();
}

window.handleFriendResponse = async (requestId, status) => {
  try {
    await respondToFriendRequest(requestId, status);
    window.renderFriendsTab();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

window.handleSendFriendRequest = async (parentId, btn) => {
  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    await sendFriendRequest(parentId);
    btn.textContent = 'Sent ✅';
    btn.style.background = '#f1f5f9';
    btn.style.color = '#64748b';
  } catch (err) {
    alert('Error: ' + err.message);
    btn.disabled = false;
    btn.textContent = 'Connect';
  }
}

window.renderQRModal = (userId) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=urban-tribe://connect/${userId}&size=250x250&margin=10`;
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '2000';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px; width: 90%; background: #fff; border-radius: 30px; padding: 2.5rem; text-align: center; box-shadow: 0 30px 60px rgba(0,0,0,0.25);">
      <h2 style="font-size: 1.5rem; font-weight: 900; color: #1e293b; margin-bottom: 0.5rem;">Connect Instantly</h2>
      <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">Show this QR code to another parent to let them add you instantly.</p>
      
      <div style="background: #f8fafc; padding: 2rem; border-radius: 24px; border: 1px solid #f1f5f9; display: inline-block; margin-bottom: 2rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);">
        <img src="${qrUrl}" crossorigin="anonymous" style="width: 200px; height: 200px; border-radius: 12px; display: block;" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?data=urban-tribe://connect/${userId}&size=250x250'">
      </div>
      
      <button onclick="this.closest('.cropper-modal-overlay').remove()" class="btn btn-primary" style="width: 100%; padding: 1rem; border-radius: 16px; font-weight: 800;">Close</button>
      
      <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9;">
        <button onclick="window.renderQRScannerModal()" style="background: none; border: none; color: var(--primary-color); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; justify-content: center; width: 100%;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
          Scan a QR Code
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

window.renderQRScannerModal = async () => {
  // 1. Ensure scanner library is loaded
  if (typeof Html5Qrcode === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/html5-qrcode";
    script.onload = () => window.renderQRScannerModal();
    document.head.appendChild(script);
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '3000';
  modal.style.padding = '1rem';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 100%; background: #fff; border-radius: 24px; padding: 1.5rem; text-align: center; position: relative;">
      <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem;">Scan QR Code</h2>
      <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 1.5rem;">Point your camera at another parent's QR code.</p>
      
      <div id="reader" style="width: 100%; overflow: hidden; border-radius: 16px; background: #f1f5f9; min-height: 250px; border: 1px solid #e2e8f0;"></div>
      
      <div id="scanner-result" style="margin-top: 1rem; font-weight: 700; color: var(--primary-color);"></div>

      <button id="close-scanner" class="btn btn-outline" style="margin-top: 1.5rem; width: 100%;">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);

  const html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  const onScanSuccess = async (decodedText) => {
    console.log(`Code scanned = ${decodedText}`);
    // Check if it's an Urban Tribe connect link
    if (decodedText.startsWith('urban-tribe://connect/')) {
      const targetUserId = decodedText.split('/').pop();

      // Prevent self-connection
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id === targetUserId) {
        document.getElementById('scanner-result').innerHTML = "⚠️ This is your own code! You cannot connect with yourself.";
        return;
      }

      document.getElementById('scanner-result').innerHTML = "✨ Connection found! Processing...";

      try {
        await html5QrCode.stop();
        await sendFriendRequest(targetUserId);
        alert('Connection request sent! 🎉');
        modal.remove();
        window.renderFriendsTab();
      } catch (err) {
        document.getElementById('scanner-result').innerHTML = "❌ Error: " + err.message;
        console.error(err);
      }
    } else {
      document.getElementById('scanner-result').innerHTML = "⚠️ Not a valid Urban Tribe code.";
    }
  };

  try {
    await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess);
  } catch (err) {
    console.error("Camera error:", err);
    document.getElementById('reader').innerHTML = `
      <div style="padding: 2rem; color: #ef4444; font-size: 0.9rem;">
        <p><strong>Camera Access Denied</strong></p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Please ensure you have granted camera permissions in your browser settings and that you are using HTTPS.</p>
      </div>
    `;
  }

  document.getElementById('close-scanner').onclick = async () => {
    try { await html5QrCode.stop(); } catch (e) { }
    modal.remove();
  };
}
window.toggleConnectionAccordion = (parentId) => {
  const el = document.getElementById(`acc-${parentId}`);
  if (el) {
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }
};

window.renderProviderFriendsTab = renderProviderFriendsTab;
async function renderProviderFriendsTab() {
  const listEl = document.getElementById('my-friends-list');
  const contentEl = document.getElementById('prov-friends-content');
  if (!listEl || !contentEl) return;

  contentEl.style.display = 'block';
  listEl.innerHTML = '<div style="text-align: center; padding: 2rem;"><p style="color: #64748b; font-weight: 600;">Loading community connections...</p></div>';

  try {
    console.log("Fetching friendships...");
    const friendships = await getAllParentFriendships();
    console.log("Friendships fetched:", friendships?.length);

    // Group connections by parent
    const parentStats = {};
    const seenPairs = new Set();
    (friendships || []).forEach(f => {
      const r = f.requester;
      const rv = f.receiver;

      if (r?.full_name && rv?.full_name) {
        // Avoid processing the same pair twice
        const pairKey = [f.requester_id, f.receiver_id].sort().join(':');
        if (seenPairs.has(pairKey)) return;
        seenPairs.add(pairKey);

        if (!parentStats[f.requester_id]) parentStats[f.requester_id] = { name: r.full_name, photo: r.photo_url, connections: [] };
        if (!parentStats[f.receiver_id]) parentStats[f.receiver_id] = { name: rv.full_name, photo: rv.photo_url, connections: [] };

        parentStats[f.requester_id].connections.push({ name: rv.full_name, date: f.created_at });
        parentStats[f.receiver_id].connections.push({ name: r.full_name, date: f.created_at });
      }
    });

    const parents = Object.entries(parentStats).sort((a, b) => b[1].connections.length - a[1].connections.length);

    if (!parents.length) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem; background: #fff; border-radius: 20px; border: 1px solid #f1f5f9;">
          <p style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">No parent connections found</p>
          <p style="font-size: 0.85rem; color: #64748b;">Active connections between parents will appear here in a table format.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = `
      <div style="background: #fff; border-radius: 20px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: inherit;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #f1f5f9;">
              <th style="padding: 1.25rem 1rem; font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em;">Isim Soyad</th>
              <th style="padding: 1.25rem 1rem; font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em; text-align: center;">Connections</th>
            </tr>
          </thead>
          <tbody>
            ${parents.map(([id, p]) => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 1.25rem 1rem;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: #e0f2fe; color: #0369a1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      ${p.photo ? `<img src="${p.photo}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : p.name[0]}
                    </div>
                    <span style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">${p.name}</span>
                  </div>
                </td>
                <td style="padding: 1.25rem 1rem; text-align: center;">
                  <button onclick="window.toggleConnectionAccordion('${id}')" style="background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;">
                    ${p.connections.length} People
                  </button>
                  <div id="acc-${id}" style="display: none; margin-top: 1rem; text-align: left; background: #f8fafc; border-radius: 16px; padding: 1rem; border: 1px solid #e2e8f0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                    <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.75rem; letter-spacing: 0.05em;">Connected with:</p>
                    ${p.connections.map(c => `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #edf2f7;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: #334155;">👤 ${c.name}</span>
                        <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 600;">${new Date(c.date).toLocaleDateString()}</span>
                      </div>
                    `).join('')}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  } catch (error) {
    console.error('Error rendering community connections:', error);
    listEl.innerHTML = `<div style="background: #fee2e2; color: #991b1b; padding: 1.5rem; border-radius: 16px; text-align: center; border: 1px solid #fecaca;">
      <p style="font-weight: 800; font-size: 0.9rem; margin-bottom: 4px;">Failed to load connections</p>
      <p style="font-size: 0.8rem;">${error.message}</p>
    </div>`;
  }
}

window.renderAdminDashboard = renderAdminDashboard;
async function renderAdminDashboard() {
  const profile = await getMyProfile().catch(() => ({ role: 'admin' }));
  app.innerHTML = `
    <div class="admin-layout" style="display: flex; min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif;">
      <!-- Sidebar -->
      <aside class="admin-sidebar" style="width: 280px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; z-index: 100;">
        <div style="padding: 2rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #f1f5f9;">
          <img src="${logo}" alt="Urban Tribe" style="height: 35px;">

        </div>
        
        <nav style="flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 6px; overflow-y: auto;">
          <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 1rem 0 0.75rem 0.75rem;">Main Menu</p>
          <button class="tab-btn active" data-tab="dashboard" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>
            Overview
          </button>
          <button class="tab-btn" data-tab="users" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-3.833-6.248 3 3 0 0 0-4.885-3.133 3 3 0 0 0-4.885 3.133 4.125 4.125 0 0 0-3.833 6.248 9.337 9.337 0 0 0 4.121.952 9.38 9.38 0 0 0 2.625-.372" /></svg>
            Users
          </button>
          <button class="tab-btn" data-tab="providers" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72L4.318 3.44A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>
            Providers
          </button>
          <button class="tab-btn" data-tab="activities" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 3h.008v.008H12V18Zm-3-6h.008v.008H9v-.008ZM9 15h.008v.008H9V15Zm0 3h.008v.008H9V18Zm6-6h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008V15Zm0 3h.008v.008h-.008V18Z" /></svg>
            Activities
          </button>
          <button class="tab-btn" data-tab="news" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>
            News & Polls
          </button>
          <button class="tab-btn" data-tab="friends" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a5.97 5.97 0 0 0-.94 3.197m0 0a5.97 5.97 0 0 0 3.198 5.311M12 12.75a3.375 3.375 0 1 1 0-6.75 3.375 3.375 0 0 1 0 6.75Zm6.375-2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0ZM7.5 10.5a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
            Friends
          </button>
          <button class="tab-btn" data-tab="invoices" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            Bookings
          </button>
          <button class="tab-btn" data-tab="newsletter" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
            Interest List
          </button>
          <button class="tab-btn" data-tab="permissions" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
            Permissions
          </button>
          
          <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 2rem 0 0.75rem 0.75rem;">System</p>
          <button class="tab-btn" id="side-nav-messages" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028Z" /></svg>
            Messages
          </button>
          <button class="tab-btn" id="side-nav-mod" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
            Moderation
          </button>
          <button class="tab-btn" id="side-nav-logout" style="text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; border-radius: 12px; padding: 12px 16px; color: #ef4444;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
            Exit Console
          </button>
        </nav>
        
        <div style="padding: 1.5rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; background: #fafafa;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; box-shadow: 0 4px 10px rgba(166, 206, 57, 0.3);">A</div>
          <div style="min-width: 0;">
            <p style="font-size: 0.85rem; font-weight: 800; color: #1e293b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Adele</p>
            <p style="font-size: 0.7rem; color: #64748b; margin: 0;">Super Admin</p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main id="admin-main-content" style="flex: 1; padding: 2.5rem; overflow-y: auto; height: 100vh; position: relative;">
        <div class="admin-stats-grid" id="admin-stats-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
          <div class="stat-card card" style="margin-bottom: 0;">
            <div class="stat-label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">Total Users</div>
            <div id="stat-users" class="stat-value" style="font-size: 1.75rem; font-weight: 900; color: #1e293b;">...</div>
          </div>
          <div class="stat-card card" style="margin-bottom: 0;">
            <div class="stat-label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">Providers</div>
            <div id="stat-providers" class="stat-value" style="font-size: 1.75rem; font-weight: 900; color: #1e293b;">...</div>
          </div>
          <div class="stat-card card" style="margin-bottom: 0;">
            <div class="stat-label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">Activities</div>
            <div id="stat-activities" class="stat-value" style="font-size: 1.75rem; font-weight: 900; color: #1e293b;">...</div>
          </div>
          <div class="stat-card card" style="margin-bottom: 0;">
            <div class="stat-label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">Bookings</div>
            <div id="stat-bookings" class="stat-value" style="font-size: 1.75rem; font-weight: 900; color: #1e293b;">...</div>
          </div>
        </div>
        
        <div id="admin-tab-content" class="fade-up" style="animation-delay: 0.1s;">
           <div id="admin-users-list">
             <div style="text-align: center; padding: 5rem 2rem; color: #94a3b8;">
               <div style="font-size: 2.5rem; margin-bottom: 1.5rem;">🔍</div>
               <p style="font-weight: 600;">Loading administrative data...</p>
             </div>
           </div>
        </div>
      </main>

      <!-- NEW: Mobile Bottom Nav -->
      <nav class="admin-bottom-nav">
        <button class="admin-nav-item active" data-tab="dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>
          <span>Dash</span>
        </button>
        <button class="admin-nav-item" data-tab="activities">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" /></svg>
          <span>Activities</span>
        </button>
        <button class="admin-nav-item" data-tab="news">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5" /></svg>
          <span>News</span>
        </button>
        <button class="admin-nav-item" id="admin-more-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          <span>More</span>
        </button>
      </nav>

      <!-- NEW: More Menu Overlay -->
      <div id="admin-more-menu" class="admin-more-overlay">
        <button class="overlay-close" id="admin-close-more">&times;</button>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 2rem;">System Menu</h2>
        <div class="admin-overlay-grid">
          <div class="overlay-item" data-tab="users">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 8px;"><path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-3.833-6.248 3 3 0 0 0-4.885-3.133 3 3 0 0 0-4.885 3.133 4.125 4.125 0 0 0-3.833 6.248 9.337 9.337 0 0 0 4.121.952 9.38 9.38 0 0 0 2.625-.372" /></svg>
            Users
          </div>
          <div class="overlay-item" data-tab="providers">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; margin-bottom: 8px;"><path d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21" /></svg>
            Providers
          </div>
          <div class="overlay-item" data-tab="friends">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21" /></svg>
            Friends
          </div>
          <div class="overlay-item" data-tab="invoices">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5" /></svg>
            Bookings
          </div>
          <div class="overlay-item" data-tab="newsletter">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75" /></svg>
            Interest List
          </div>
          <div class="overlay-item" data-tab="permissions">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12.75 11.25 15 15 9.75m-3-7.036" /></svg>
            Permissions
          </div>
          <div class="overlay-item" id="over-nav-messages">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7.5 8.25h9m-9 3H12" /></svg>
            Messages
          </div>
          <div class="overlay-item" id="over-nav-mod">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            Moderation
          </div>
          <div class="overlay-item" id="over-nav-logout" style="color: #ef4444;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6" /></svg>
            Exit Console
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Events
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(t => {
    t.onclick = () => {
      // Close overlay if open
      document.getElementById('admin-more-menu').classList.remove('open');

      // Update active state
      document.querySelectorAll('[data-tab]').forEach(btn => btn.classList.remove('active'));
      t.classList.add('active');

      const tab = t.dataset.tab;
      const content = document.getElementById('admin-tab-content');
      content.classList.remove('fade-up');
      void content.offsetWidth;
      content.classList.add('fade-up');

      if (tab === 'dashboard') loadAdminSummary();
      else if (tab === 'users') loadAdminUsers();
      else if (tab === 'providers') loadAdminProviders();
      else if (tab === 'activities') loadAdminActivities();
      else if (tab === 'news') loadAdminNewsAndPolls();
      else if (tab === 'friends') loadAdminFriends();
      else if (tab === 'invoices') loadAdminInvoices();
      else if (tab === 'newsletter') loadAdminNewsletter();
      else if (tab === 'permissions') loadAdminPermissions();
    };
  });

  // Mobile More Toggle
  document.getElementById('admin-more-btn').onclick = () => {
    document.getElementById('admin-more-menu').classList.add('open');
  };
  document.getElementById('admin-close-more').onclick = () => {
    document.getElementById('admin-more-menu').classList.remove('open');
  };

  document.getElementById('side-nav-messages')?.addEventListener('click', () => renderMessagesTab());
  document.getElementById('over-nav-messages')?.addEventListener('click', () => {
    document.getElementById('admin-more-menu').classList.remove('open');
    renderMessagesTab();
  });

  document.getElementById('side-nav-mod')?.addEventListener('click', () => loadAdminModeration());
  document.getElementById('over-nav-mod')?.addEventListener('click', () => {
    document.getElementById('admin-more-menu').classList.remove('open');
    loadAdminModeration();
  });

  document.getElementById('side-nav-logout')?.addEventListener('click', () => handleLogout());
  document.getElementById('over-nav-logout')?.addEventListener('click', () => handleLogout());

  loadAdminStats();
  loadAdminSummary();
}

function renderAdminBottomNav(activeTab) {
  return `
    <nav class="bottom-nav">
      <button class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" id="nav-admin-dash">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
        <span>Home</span>
      </button>
      <button class="nav-item ${activeTab === 'messages' ? 'active' : ''}" id="nav-admin-messages" style="position: relative;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028Z" />
        </svg>
        <span>Chat</span>
        <div id="msg-badge" style="display: none; position: absolute; top: 4px; right: 20%; background: #ef4444; color: white; font-size: 0.65rem; font-weight: 800; min-width: 16px; height: 16px; border-radius: 8px; align-items: center; justify-content: center; padding: 0 4px; border: 2px solid #fff;"></div>
      </button>
      <button class="nav-item ${activeTab === 'moderation' ? 'active' : ''}" id="nav-admin-mod">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span>Mod</span>
      </button>
      <button class="nav-item" id="nav-logout-admin">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        <span>Exit</span>
      </button>
    </nav>
  `;
}

function attachAdminNavEvents() {
  document.getElementById('nav-admin-dash')?.addEventListener('click', () => renderAdminDashboard());
  document.getElementById('nav-admin-messages')?.addEventListener('click', () => renderMessagesTab());
  document.getElementById('nav-admin-mod')?.addEventListener('click', () => loadAdminModeration());
  document.getElementById('nav-logout-admin')?.addEventListener('click', () => handleLogout());
}

async function loadAdminStats() {
  try {
    const stats = await adminGetStats();
    document.getElementById('stat-users').textContent = stats.users;
    document.getElementById('stat-providers').textContent = stats.providers;
    document.getElementById('stat-activities').textContent = stats.activities;
    document.getElementById('stat-bookings').textContent = stats.bookings;
  } catch (err) {
    console.error('Error loading admin stats:', err);
  }
}

async function loadAdminModeration() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;

  // Visually deselect all tab buttons and highlight Mod in bottom nav
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.color = '#64748b';
    btn.style.fontWeight = '600';
    btn.style.borderBottom = 'none';
  });

  container.innerHTML = '<div style="text-align:center;padding:2rem;color:#64748b;">Loading moderation queue...</div>';
  try {
    // Admin sees ALL comments (pass null for providerId)
    const comments = await getProviderComments(null);

    if (!comments || !comments.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:4rem 2rem;">
          <div style="font-size:2.5rem;margin-bottom:1rem;">✅</div>
          <p style="font-weight:700;color:#1e293b;">All clear!</p>
          <p style="font-size:0.85rem;color:#64748b;">No comments pending moderation.</p>
        </div>`;
      return;
    }

    container.innerHTML = `
      <h3 style="font-weight:800;color:#1e293b;margin-bottom:1rem;">Moderation Queue <span style="font-size:0.8rem;background:#fef9c3;color:#854d0e;padding:2px 10px;border-radius:20px;">${comments.length}</span></h3>
      <div id="mod-comments-list">
        ${comments.map(c => `
          <div class="card" style="margin-bottom:1rem;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <div style="background:#f1f5f9;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#64748b;font-size:0.8rem;">
                  ${(c.profiles?.full_name || 'U').charAt(0)}
                </div>
                <div>
                  <p style="font-weight:700;font-size:0.9rem;margin:0;color:#1e293b;">${c.profiles?.full_name || 'Anonymous'}</p>
                  <p style="font-size:0.75rem;color:#64748b;margin:0;">On: ${c.activities?.name || c.news?.title || 'Unknown'}</p>
                </div>
              </div>
              <div style="text-align:right;">
                <span style="font-size:0.65rem;padding:2px 8px;border-radius:12px;font-weight:800;text-transform:uppercase;${c.status === 'approved' ? 'background:#dcfce7;color:#166534;' :
        c.status === 'rejected' ? 'background:#fee2e2;color:#991b1b;' :
          'background:#fef9c3;color:#854d0e;'
      }">${c.status || 'pending'}</span>
                <p style="font-size:0.7rem;color:#94a3b8;margin:4px 0 0 0;">${new Date(c.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <p style="font-size:0.9rem;color:#334155;line-height:1.5;margin:0 0 1rem 0;background:#f8fafc;padding:0.75rem;border-radius:8px;">${c.content}</p>
            <div style="display:flex;justify-content:flex-end;gap:0.5rem;">
              <select onchange="window.handleAdminCommentModeration('${c.id}', this.value)" style="padding:4px 8px;border-radius:6px;font-size:0.75rem;border:1px solid #cbd5e1;outline:none;background:#fff;cursor:pointer;">
                <option value="">Actions...</option>
                <option value="approved" ${c.status === 'approved' ? 'disabled' : ''}>Publish</option>
                <option value="pending" ${c.status === 'pending' ? 'disabled' : ''}>Unpublish</option>
                <option value="delete">Delete Forever</option>
              </select>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color:red;text-align:center;padding:2rem;">Failed to load moderation queue: ${err.message}</p>`;
  }
}

window.handleAdminCommentModeration = async (commentId, action) => {
  if (!action) return;
  if (action === 'delete') {
    if (!confirm('Delete this comment forever?')) return;
    try { await deleteComment(commentId); loadAdminModeration(); } catch (err) { alert('Delete failed: ' + err.message); }
    return;
  }
  try {
    await updateCommentStatus(commentId, action);
    loadAdminModeration();
  } catch (err) { alert('Update failed: ' + err.message); }
};

async function loadAdminProviders() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading providers...</p>';
  try {
    const providers = await fetchAllProviders();
    container.innerHTML = `
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Owner ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${providers.map(p => `
              <tr>
                <td style="font-weight: 600;">${p.business_name}</td>
                <td style="font-size: 0.7rem; color: #64748b;">${p.owner_id}</td>
                <td>
                  <button onclick='window.renderEditProviderModal(${JSON.stringify(p).replace(/'/g, "&apos;")})' class="btn" style="width: auto; padding: 4px 8px; font-size: 0.7rem; background: #f1f5f9; color: #475569;">Edit</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: red;">Failed to load providers: ${err.message}</p>`;
  }
}

window.renderEditProviderModal = (provider) => {
  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '1500';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 95%; background: #fff; border-radius: 24px; padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0;">Edit Provider</h2>
        <button onclick="this.closest('.cropper-modal-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer;">×</button>
      </div>
      <form id="admin-edit-prov-form">
        <div class="form-group"><label>Business Name</label><input type="text" id="edit-p-name" value="${provider.business_name}" required></div>
        <div class="form-group"><label>Description</label><textarea id="edit-p-desc" rows="3">${provider.description || ''}</textarea></div>
        <div class="form-group"><label>Terms & Conditions</label><textarea id="edit-p-terms" rows="5">${provider.terms_and_conditions || ''}</textarea></div>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#admin-edit-prov-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    try {
      await updateProvider(provider.id, {
        business_name: document.getElementById('edit-p-name').value,
        description: document.getElementById('edit-p-desc').value,
        terms_and_conditions: document.getElementById('edit-p-terms').value
      });
      alert('Provider updated!');
      modal.remove();
      loadAdminProviders();
    } catch (err) {
      alert('Update failed: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    }
  };
};

async function loadAdminSummary() {
  const container = document.getElementById('admin-tab-content');
  container.innerHTML = `<div style="text-align: center; padding: 3rem;"><div class="spinner"></div><p class="mt-4">Gathering platform overview...</p></div>`;

  try {
    const [usersRes, providersRes, activitiesRes, newsRes, reportsRes, bookingsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('*').eq('role', 'provider').order('created_at', { ascending: false }).limit(5),
      supabase.from('activities').select('*, providers(business_name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('invoices').select('*, activities(name, start_time, end_time), profiles:parent_id(full_name), children(name)').order('created_at', { ascending: false }).limit(20)
    ]);

    const users = usersRes.data || [];
    const providers = providersRes.data || [];
    const activities = activitiesRes.data || [];
    const news = newsRes.data || [];
    const reportsCount = reportsRes.count || 0;

    // Group bookings for the summary card too
    const bookingGroups = {};
    (bookingsRes.data || []).forEach(inv => {
      const timeKey = new Date(inv.created_at).toISOString().substring(0, 16);
      const key = `${inv.parent_id}_${inv.activity_id}_${inv.event_date}_${timeKey}`;
      if (!bookingGroups[key]) {
        bookingGroups[key] = {
          ...inv,
          name: inv.activities?.name || 'Session',
          parent: inv.profiles?.full_name || 'Parent',
          date: inv.event_date,
          startTime: inv.activities?.start_time,
          endTime: inv.activities?.end_time,
          items: [inv]
        };
      } else {
        bookingGroups[key].items.push(inv);
      }
    });
    const consolidatedBookings = Object.values(bookingGroups).slice(0, 5);

    container.innerHTML = `
      <div class="admin-summary-view" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
        
        <!-- NEW MEMBERS SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; font-weight: 800;">
            <span style="background: rgba(166, 206, 57, 0.1); padding: 8px; border-radius: 12px; font-size: 1.2rem;">👥</span>
            Recent New Members
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
            ${users.map(u => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-radius: 16px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 800; color: #64748b;">${u.full_name?.[0] || '?'}</div>
                  <div>
                    <p style="font-size: 0.9rem; font-weight: 800; margin: 0; color: #1e293b;">${u.full_name || 'Anonymous'}</p>
                    <p style="font-size: 0.75rem; color: #94a3b8; margin: 2px 0 0 0;">Joined ${new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span class="role-badge role-${u.role}" style="font-size: 0.65rem; padding: 4px 8px; border-radius: 8px;">${u.role}</span>
              </div>
            `).join('') || '<p style="text-align:center; color:#94a3b8; padding: 1rem;">No users found</p>'}
          </div>
          <button class="btn btn-outline" style="width: 100%; border-radius: 16px; font-weight: 700; color: #1e293b; border-color: #e2e8f0; background: #fff; padding: 12px;" onclick="document.querySelector('[data-tab=users]').click()">View All Users</button>
        </div>

        <!-- BOOKINGS SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; font-weight: 800;">
            <span style="background: #f0fdf4; padding: 8px; border-radius: 12px; font-size: 1.2rem;">🎟️</span>
            Upcoming Bookings
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
            ${consolidatedBookings.map(g => renderBookingCardHtml(g)).join('') || '<p style="text-align:center; color:#94a3b8; padding: 1rem;">No recent bookings</p>'}
          </div>
          <button class="btn btn-outline" style="width: 100%; border-radius: 16px; font-weight: 700; color: #1e293b; border-color: #e2e8f0; background: #fff; padding: 12px;" onclick="document.querySelector('[data-tab=invoices]').click()">Manage Bookings</button>
        </div>

        <!-- ACTIVITIES SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; font-weight: 800;">
            <span style="background: #f1f5f9; padding: 8px; border-radius: 12px; font-size: 1.2rem;">🎨</span>
            Latest Activities
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
            ${activities.map(a => `
              <div style="display: flex; align-items: center; gap: 16px; padding: 1rem; border-radius: 16px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="width: 50px; height: 50px; border-radius: 12px; background: #f1f5f9; overflow: hidden; flex-shrink: 0;">
                  ${a.photo_url ? `<img src="${a.photo_url}" style="width:100%; height:100%; object-fit:cover;">` : ''}
                </div>
                <div style="flex: 1;">
                  <p style="font-size: 0.95rem; font-weight: 800; margin: 0; color: #1e293b;">${a.title || a.name || 'Untitled'}</p>
                  <p style="font-size: 0.8rem; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">By ${a.providers?.business_name || 'Urban Tribe'}</p>
                </div>
              </div>
            `).join('') || '<p style="text-align:center; color:#94a3b8; padding: 1rem;">No activities yet</p>'}
          </div>
          <button class="btn btn-outline" style="width: 100%; border-radius: 16px; font-weight: 700; color: #1e293b; border-color: #e2e8f0; background: #fff; padding: 12px;" onclick="document.querySelector('[data-tab=activities]').click()">Manage Activities</button>
        </div>

        <!-- MODERATION SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #fee2e2; background: #fff5f5;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; font-weight: 800; color: #991b1b;">
            <span style="font-size: 1.2rem;">⚠️</span>
            Moderation
          </h3>
          <div style="margin-bottom: 1.5rem;">
            <p style="font-size: 0.95rem; color: #c53030; margin-bottom: 8px; font-weight: 600;">There are <span style="font-weight: 900;">${reportsCount}</span> pending items requiring attention.</p>
          </div>
          <button class="btn" style="width: 100%; border-radius: 16px; font-weight: 700; background: #e11d48; color: #fff; border: none; padding: 12px;" onclick="loadAdminModeration()">Open Moderation Center</button>
        </div>

        <!-- PROVIDERS SECTION -->
        <div class="card" style="margin-bottom: 0; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; font-weight: 800;">
            <span style="background: rgba(139, 92, 246, 0.1); padding: 8px; border-radius: 12px; font-size: 1.2rem;">🏪</span>
            Recent Providers
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
            ${providers.map(p => `
              <div style="display: flex; align-items: center; gap: 12px; padding: 1rem; border-radius: 16px; background: #fff; border: 1px solid #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></div>
                <div style="flex: 1;">
                  <p style="font-size: 0.9rem; font-weight: 800; margin: 0; color: #1e293b;">${p.full_name}</p>
                  <p style="font-size: 0.75rem; color: #94a3b8; margin: 2px 0 0 0; font-weight: 500;">Joined ${new Date(p.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            `).join('') || '<p style="text-align:center; color:#94a3b8; padding: 1rem;">No providers yet</p>'}
          </div>
          <button class="btn btn-outline" style="width: 100%; border-radius: 16px; font-weight: 700; color: #1e293b; border-color: #e2e8f0; background: #fff; padding: 12px;" onclick="document.querySelector('[data-tab=providers]').click()">Manage Providers</button>
        </div>

      </div>
    `;
  } catch (err) {
    console.error('Error loading admin summary:', err);
    container.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 2rem;">Error loading summary: ${err.message}</p>`;
  }
}

async function loadAdminUsers() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading users...</p>';
  try {
    const users = await adminGetAllUsers();
    container.innerHTML = `
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
        <button onclick="window.renderAdminAddUserForm()" class="btn btn-primary" style="width: auto; padding: 0.5rem 1.5rem; font-size: 0.9rem;">+ Add User</button>
      </div>
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;"><input type="checkbox" id="select-all-users" style="cursor: pointer;"></th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td style="text-align: center;"><input type="checkbox" class="user-select-checkbox" data-user-id="${u.id}" data-user-name="${u.full_name || u.email}" style="cursor: pointer;"></td>
                <td style="font-weight: 600;">${u.full_name || 'No Name'}</td>
                <td style="font-size: 0.8rem; color: #64748b;">${u.email || 'N/A'}</td>
                <td><span class="role-badge role-${u.role}">${u.role}</span></td>
                <td>
                  <select onchange="window.handleAdminUserRoleChange('${u.id}', this.value)" style="padding: 4px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #e2e8f0; outline: none; cursor: pointer;">
                    <option value="">Change...</option>
                    <option value="parent" ${u.role === 'parent' ? 'disabled' : ''}>Parent</option>
                    <option value="provider" ${u.role === 'provider' ? 'disabled' : ''}>Provider</option>
                    <option value="admin" ${u.role === 'admin' ? 'disabled' : ''}>Admin</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="admin-broadcast-box" class="card" style="margin-top: 2rem; border: 2px solid var(--primary-color); background: #fdfdfd; padding: 2rem; border-radius: 24px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
          <div style="background: #ecfdf5; color: #10b981; padding: 10px; border-radius: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.062.51.114.769.155L12.75 21.38V15.75c.34-.031.677-.071 1.01-.12m-1.01-9.38c.34.031.677.071 1.01.12V3.38l-1.641 5.385c-.26.04-.516.092-.77.155m7.313 3.752a6 6 0 0 1-3.21 5.193m3.21-5.193a5.998 5.998 0 0 0-3.21-5.193m3.21 5.193H19.5" /></svg>
          </div>
          <div>
            <h3 style="font-weight: 800; color: #1e293b; margin: 0; font-size: 1.25rem;">Broadcast Message</h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">Compose a message to send to selected users individually.</p>
          </div>
        </div>
        
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; text-transform: uppercase; margin-bottom: 6px; display: block;">Message Title</label>
          <input type="text" id="bc-title" placeholder="e.g. Welcome to Urban Tribe!" style="border-radius: 12px; padding: 0.85rem; border: 1px solid #e2e8f0; width: 100%;">
        </div>
        
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; text-transform: uppercase; margin-bottom: 6px; display: block;">Message Body</label>
          <textarea id="bc-content" rows="5" placeholder="Write your message here..." style="border-radius: 12px; padding: 0.85rem; border: 1px solid #e2e8f0; width: 100%; font-family: inherit; resize: vertical;"></textarea>
        </div>

        <div class="form-group" style="margin-bottom: 1.5rem;">
          <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; text-transform: uppercase; margin-bottom: 6px; display: block;">Attach Images (Optional)</label>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <input type="file" id="bc-files" multiple accept="image/*" style="font-size: 0.85rem; width: 100%;">
            <p style="font-size: 0.75rem; color: #94a3b8; margin: 0;">Each selected user will receive an individual private message with these attachments.</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem;">
          <div id="bc-selection-summary" style="font-size: 0.9rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 8px 16px; border-radius: 10px;">No users selected</div>
          <button id="btn-send-broadcast" class="btn btn-primary" style="width: auto; padding: 12px 35px; border-radius: 14px; font-weight: 800; box-shadow: 0 4px 12px rgba(166, 206, 57, 0.3);">
            Send Individual Messages
          </button>
        </div>
      </div>
    `;

    // Attach Selection Logic
    const selectAll = document.getElementById('select-all-users');
    const checkboxes = document.querySelectorAll('.user-select-checkbox');
    const summary = document.getElementById('bc-selection-summary');

    const updateSummary = () => {
      const selected = Array.from(checkboxes).filter(cb => cb.checked);
      summary.textContent = selected.length === 0 ? 'No users selected' : `${selected.length} user(s) selected`;
      if (selected.length === checkboxes.length) selectAll.checked = true;
      else if (selected.length === 0) selectAll.checked = false;
    };

    selectAll.onchange = () => {
      checkboxes.forEach(cb => cb.checked = selectAll.checked);
      updateSummary();
    };

    checkboxes.forEach(cb => cb.onchange = updateSummary);

    // Attach Send Logic
    document.getElementById('btn-send-broadcast').onclick = async () => {
      const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => ({ id: cb.dataset.userId, name: cb.dataset.userName }));
      const title = document.getElementById('bc-title').value.trim();
      const content = document.getElementById('bc-content').value.trim();
      const fileInput = document.getElementById('bc-files');

      if (selected.length === 0) return alert('Please select at least one user from the list.');
      if (!title || !content) return alert('Please provide both a title and message content.');

      const btn = document.getElementById('btn-send-broadcast');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        console.log('Starting broadcast to:', selected.length, 'users');
        const providers = await adminGetAllProviders();
        if (!providers || providers.length === 0) {
          throw new Error('No providers found. Please create at least one provider (Urban Tribe) first.');
        }

        const utProvider = providers.find(p => p.business_name === 'Urban Tribe') || providers[0];
        console.log('Using sender provider:', utProvider.business_name);

        const acts = await getProviderActivities(utProvider.id);
        if (!acts || acts.length === 0) {
          throw new Error(`Sender "${utProvider.business_name}" has no activities. This messaging system requires at least one activity to serve as a context for private threads.`);
        }
        const activityId = acts[0].id;
        console.log('Using activity context ID:', activityId);

        // Upload images if any
        let attachments = [];
        if (fileInput.files.length > 0) {
          btn.textContent = 'Uploading files...';
          for (let i = 0; i < fileInput.files.length; i++) {
            console.log('Uploading file:', fileInput.files[i].name);
            try {
              const url = await uploadAttachment(fileInput.files[i]);
              attachments.push(url);
            } catch (uErr) {
              console.error('File upload failed:', uErr);
              throw new Error(`Failed to upload "${fileInput.files[i].name}". Ensure the storage bucket "urban-tribe-assets" exists and is public.`);
            }
          }
        }

        // Send messages sequentially
        let successCount = 0;
        for (const user of selected) {
          btn.textContent = `Sending (${successCount + 1}/${selected.length})...`;
          console.log(`Sending to ${user.name} (${user.id})...`);

          let finalContent = content;
          if (attachments.length > 0) {
            finalContent += "\n\n" + attachments.map(url => `![Image](${url})`).join("\n");
          }

          await addComment('activity', activityId, finalContent, null, true, title, user.id);
          successCount++;
        }

        console.log('Broadcast complete. Sent:', successCount);
        alert(`Successfully sent individual messages to ${successCount} users.`);

        // Reset form
        document.getElementById('bc-title').value = '';
        document.getElementById('bc-content').value = '';
        document.getElementById('bc-files').value = '';
        checkboxes.forEach(cb => cb.checked = false);
        selectAll.checked = false;
        updateSummary();
      } catch (err) {
        console.error('Broadcast error:', err);
        alert('Broadcast failed: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    };
  } catch (err) {
    container.innerHTML = `<p style="color: red;">Failed to load users: ${err.message}</p>`;
  }
}

window.handleAdminUserRoleChange = async (userId, newRole) => {
  if (!newRole) return;
  if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
  try {
    await adminUpdateUserRole(userId, newRole);
    alert('User role updated successfully!');
    loadAdminUsers();
  } catch (err) {
    alert('Failed to update role: ' + err.message);
  }
}

async function loadAdminActivities() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading activities...</p>';
  try {
    const activities = await adminGetAllActivities();

    // Fetch all invoices to calculate sold counts per activity
    const { data: allInvoices } = await supabase
      .from('invoices')
      .select('activity_id, child_id, adult_count')
      .eq('status', 'paid');

    // Build a map: activityId -> { children, adults }
    const soldMap = {};
    (allInvoices || []).forEach(inv => {
      if (!inv.activity_id) return;
      if (!soldMap[inv.activity_id]) soldMap[inv.activity_id] = { children: 0, adults: 0 };
      if (inv.child_id) soldMap[inv.activity_id].children++;
      soldMap[inv.activity_id].adults += (inv.adult_count || 0);
    });

    container.innerHTML = `
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
        <button onclick="window.renderAdminAddActivityForm()" class="btn btn-primary" style="width: auto; padding: 0.5rem 1.5rem; font-size: 0.9rem;">+ Add Activity</button>
      </div>
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Provider</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Sold</th>
              <th>Waitlist</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${await Promise.all(activities.map(async a => {
      const likes = a.activity_likes?.[0]?.count || 0;
      const comments = a.comments?.[0]?.count || 0;
      const sold = soldMap[a.id] || { children: 0, adults: 0 };
      const waiting = await getWaitlistCountForActivity(a.id);
      return `
              <tr>
                <td onclick='window.handleViewActivitySocial(${JSON.stringify(a).replace(/'/g, "&apos;")})' style="font-weight: 600; cursor: pointer; color: var(--primary-color); text-decoration: underline;">${a.name}</td>
                <td style="font-size: 0.85rem;">${a.providers?.business_name || 'N/A'}</td>
                <td style="text-align: center;"><span style="font-size: 0.75rem; background: #fdf2f2; color: #ef4444; padding: 2px 8px; border-radius: 12px; font-weight: 700;">❤️ ${likes}</span></td>
                <td style="text-align: center;"><span style="font-size: 0.75rem; background: #f0fdf4; color: #10b981; padding: 2px 8px; border-radius: 12px; font-weight: 700;">💬 ${comments}</span></td>
                <td style="text-align: center;">
                  <div style="display: flex; flex-direction: column; gap: 3px; align-items: center;">
                    <span style="font-size: 0.72rem; background: #eff6ff; color: #3b82f6; padding: 2px 8px; border-radius: 10px; font-weight: 700;">👧 ${sold.children} kids</span>
                    <span style="font-size: 0.72rem; background: #f5f3ff; color: #7c3aed; padding: 2px 8px; border-radius: 10px; font-weight: 700;">🧑 ${sold.adults} adults</span>
                  </div>
                </td>
                <td style="text-align: center;">
                  <span style="font-size: 0.75rem; background: #fffbeb; color: #d97706; padding: 4px 10px; border-radius: 12px; font-weight: 700; cursor: pointer;" onclick='window.handleViewActivityBookings(${JSON.stringify(a).replace(/'/g, "&apos;")})'>
                    ⏳ ${waiting}
                  </span>
                </td>
                <td style="text-align: center; font-weight: 700; color: #64748b; font-size: 0.85rem;">
                  ${a.max_children || '∞'}
                </td>
                <td><span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: ${a.status === 'published' ? '#10b981' : '#94a3b8'};">${a.status}</span></td>
                <td>
                  <button onclick='renderAddActivityForm("${a.provider_id}", ${JSON.stringify(a).replace(/'/g, "&apos;")})' class="btn" style="width: auto; padding: 4px 8px; font-size: 0.7rem; background: #f1f5f9; color: #475569;">Edit</button>
                </td>
              </tr>
            `;
    })).then(rows => rows.join(''))}
          </tbody>

        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: red;">Failed to load activities: ${err.message}</p>`;
  }
}

async function loadAdminNewsAndPolls() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading news...</p>';
  try {
    const news = await adminGetAllNews();
    // Get all comments for polls to count votes — guard against empty array
    const pollIds = news.filter(n => n.type === 'poll').map(n => n.id);
    let allComments = [];
    if (pollIds.length > 0) {
      const { data } = await supabase.from('comments').select('*, profiles(full_name)').in('news_id', pollIds);
      allComments = data || [];
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-bottom: 1rem;">
        <button onclick="window.renderAdminAddPollForm()" class="btn btn-primary" style="width: auto; padding: 0.5rem 1.5rem; font-size: 0.9rem; background: #8b5cf6;">+ Add Poll</button>
        <button onclick="window.renderAdminAddNewsForm()" class="btn btn-primary" style="width: auto; padding: 0.5rem 1.5rem; font-size: 0.9rem;">+ Add News</button>
      </div>
      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title/Question</th>
              <th>Provider</th>
              <th>Likes</th>
              <th>Comments/Votes</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${news.map(n => {
      const likes = n.news_likes?.[0]?.count || 0;
      const comments = n.comments?.[0]?.count || 0;
      const pollComments = allComments.filter(c => c.news_id === n.id);
      return `
              <tr>
                <td onclick='window.handleViewNewsSocial(${JSON.stringify(n).replace(/'/g, "&apos;")})' style="font-weight: 600; cursor: pointer; color: var(--primary-color); text-decoration: underline;">${n.title || n.description || 'N/A'}</td>
                <td style="font-size: 0.85rem;">${n.providers?.business_name || 'N/A'}</td>
                <td style="text-align: center;"><span style="font-size: 0.75rem; background: #fdf2f2; color: #ef4444; padding: 2px 8px; border-radius: 12px; font-weight: 700;">❤️ ${likes}</span></td>
                <td style="text-align: center;"><span style="font-size: 0.75rem; background: #f0fdf4; color: #10b981; padding: 2px 8px; border-radius: 12px; font-weight: 700;">${n.type === 'poll' ? '🗳️' : '💬'} ${comments}</span></td>
                <td><span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: ${n.type === 'poll' ? '#8b5cf6' : '#3b82f6'};">${n.type || 'news'}</span></td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    ${n.type === 'poll'
          ? `<button onclick='window.renderAddPollForm("${n.provider_id}", ${JSON.stringify(n).replace(/'/g, "&apos;")})' class="btn" style="width: auto; padding: 4px 8px; font-size: 0.7rem; background: #f1f5f9; color: #475569;">Edit</button>
                         <button onclick='window.renderPollResults(${JSON.stringify(n).replace(/'/g, "&apos;")}, ${JSON.stringify(pollComments).replace(/'/g, "&apos;")})' class="btn" style="width: auto; padding: 4px 8px; font-size: 0.7rem; background: #eff6ff; color: #3b82f6;">Result</button>`
          : `<button onclick='window.renderAddNewsForm("${n.provider_id}", ${JSON.stringify(n).replace(/'/g, "&apos;")})' class="btn" style="width: auto; padding: 4px 8px; font-size: 0.7rem; background: #f1f5f9; color: #475569;">Edit</button>`
        }
                  </div>
                </td>
              </tr>
            `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: red;">Failed to load news: ${err.message}</p>`;
  }
}

window.renderPollResults = (poll, comments) => {
  const votes = comments.filter(c => c.content?.startsWith('[VOTE:'));
  const options = poll.metadata?.options || [];

  const modal = document.createElement('div');
  modal.className = 'cropper-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '1500';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px; width: 95%; background: #fff; border-radius: 24px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0;">Poll Results</h2>
        <button onclick="this.closest('.cropper-modal-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer;">×</button>
      </div>
      <h3 style="font-size: 1rem; margin-bottom: 1.5rem; color: #475569;">${poll.title}</h3>
      
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${options.map((opt, idx) => {
    const optVotes = votes.filter(v => v.content === `[VOTE:${idx}]`);
    const percentage = votes.length > 0 ? (optVotes.length / votes.length * 100).toFixed(0) : 0;
    return `
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #1e293b;">${opt}</span>
                <span style="font-weight: 800; color: var(--primary-color);">${optVotes.length} votes (${percentage}%)</span>
              </div>
              <div style="height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
                <div style="height: 100%; background: var(--primary-color); width: ${percentage}%;"></div>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${optVotes.map(v => `<span style="font-size: 0.65rem; background: #f8fafc; color: #64748b; padding: 2px 8px; border-radius: 20px; border: 1px solid #e2e8f0;">${v.profiles?.full_name || 'Anonymous'}</span>`).join('') || '<span style="font-size: 0.65rem; color: #94a3b8; font-style: italic;">No votes yet</span>'}
              </div>
            </div>
          `;
  }).join('')}
      </div>
      
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 0.8rem;">
        Total Votes: ${votes.length}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

async function loadAdminFriends() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading friendships...</p>';
  try {
    const connections = await getAllParentFriendships();

    // Sort friendships by Parent 1 name
    const sortedConnections = [...connections].sort((a, b) =>
      (a.requester?.full_name || '').localeCompare(b.requester?.full_name || '')
    );

    // Calculate friend counts per user
    const counts = {};
    connections.forEach(c => {
      counts[c.requester_id] = (counts[c.requester_id] || 0) + 1;
      counts[c.receiver_id] = (counts[c.receiver_id] || 0) + 1;
    });

    // Prepare sorted count entries
    const sortedCounts = Object.entries(counts).map(([userId, count]) => {
      const profile = connections.find(c => c.requester_id === userId)?.requester || connections.find(c => c.receiver_id === userId)?.receiver;
      return { name: profile?.full_name || 'Unknown', count };
    }).sort((a, b) => a.name.localeCompare(b.name));

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; margin-bottom: 1rem;">Active Friendships</h3>
        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Parent 1</th>
                <th>Parent 2</th>
                <th>Connected Since</th>
              </tr>
            </thead>
            <tbody>
              ${sortedConnections.map(c => `
                <tr>
                  <td style="font-weight: 600;">${c.requester?.full_name || 'N/A'}</td>
                  <td style="font-weight: 600;">${c.receiver?.full_name || 'N/A'}</td>
                  <td style="font-size: 0.75rem; color: #64748b;">${new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 style="font-size: 1rem; margin-bottom: 1rem;">Friend Counts</h3>
        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Parent Name</th>
                <th>Total Friends</th>
              </tr>
            </thead>
            <tbody>
              ${sortedCounts.map(item => `
                <tr>
                  <td style="font-weight: 600;">${item.name}</td>
                  <td><span class="role-badge role-provider" style="background: #eff6ff; color: #3b82f6; font-size: 0.75rem; font-weight: 800;">${item.count} friends</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: red;">Failed to load friends: ${err.message}</p>`;
  }
}

async function loadAdminInvoices() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Consolidating booking data...</p>';
  try {
    const rawInvoices = await adminGetAllInvoices();

    // Group invoices by a unique booking key: Parent + Activity + Event Date + Created At (truncated to minute)
    const groups = {};
    rawInvoices.forEach(inv => {
      const timeKey = new Date(inv.created_at).toISOString().substring(0, 16); // Group by minute
      const key = `${inv.parent_id}_${inv.activity_id}_${inv.event_date}_${timeKey}`;

      if (!groups[key]) {
        groups[key] = {
          parent: inv.profiles?.full_name || 'N/A',
          activity: inv.activities?.name || 'N/A',
          date: inv.event_date,
          amount: 0,
          children: [],
          adults: inv.adult_attendees || [],
          adultCount: inv.adult_count || 0,
          status: inv.status,
          contact: inv.metadata || {}
        };
      }

      if (inv.child_id && inv.children?.name) {
        if (!groups[key].children.includes(inv.children.name)) {
          groups[key].children.push(inv.children.name);
        }
      }
      // Sum amounts if they are separate rows, but handle potential summary rows
      // (Simplified: using the max amount or summing based on logic)
      groups[key].amount = Math.max(groups[key].amount, inv.amount || 0);
    });

    const consolidated = Object.values(groups);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3 style="font-weight: 800; margin: 0;">Platform Bookings <span style="font-size: 0.8rem; background: #f1f5f9; padding: 4px 12px; border-radius: 20px; color: #64748b;">${consolidated.length} transactions</span></h3>
      </div>
      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Parent</th>
              <th>Activity</th>
              <th style="text-align: center;">Size</th>
              <th>Attendees</th>
              <th>Event Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${consolidated.map(g => `
              <tr>
                <td>
                  <div style="font-weight: 700;">${g.parent}</div>
                  <div style="font-size: 0.7rem; color: #94a3b8;">${g.contact.email || ''}</div>
                </td>
                <td style="font-size: 0.85rem; font-weight: 600;">${g.activity}</td>
                <td style="text-align: center;">
                  <div style="font-size: 0.85rem; font-weight: 800;">${g.children.length + g.adultCount}</div>
                  <div style="font-size: 0.65rem; color: #64748b;">(${g.children.length}K, ${g.adultCount}A)</div>
                </td>
                <td>
                  <div style="font-size: 0.75rem; color: #475569;">
                    ${g.children.length ? `<strong>Kids:</strong> ${g.children.join(', ')}` : ''}
                    ${g.adults.length ? `<br><strong>Adults:</strong> ${g.adults.join(', ')}` : ''}
                  </div>
                </td>
                <td style="font-size: 0.75rem; white-space: nowrap;">${g.date}</td>
                <td style="font-weight: 800; color: #1e293b;">£${g.amount}</td>
                <td>
                  <span class="role-badge" style="background: ${g.status === 'paid' ? '#dcfce7' : '#fee2e2'}; color: ${g.status === 'paid' ? '#166534' : '#991b1b'}; font-size: 0.65rem;">
                    ${g.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: red;">Failed to load bookings: ${err.message}</p>`;
  }
}

async function loadAdminNewsletter() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align:center;padding:2rem;color:#64748b;">Loading registrations...</p>';
  try {
    const signups = await adminGetNewsletterSignups();
    if (!signups || signups.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:4rem 2rem;">
          <div style="font-size:2.5rem;margin-bottom:1rem;">✉️</div>
          <p style="font-weight:700;color:#1e293b;">No registrations yet</p>
          <p style="font-size:0.85rem;color:#64748b;">Interest registrations from the landing page will appear here.</p>
        </div>`;
      return;
    }
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <h3 style="font-weight:800;color:#1e293b;margin:0;">Interest Registrations <span style="font-size:0.8rem;background:#dcfce7;color:#166534;padding:2px 10px;border-radius:20px;font-weight:700;">${signups.length} total</span></h3>
      </div>
      <div style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Postcode</th>
              <th style="text-align:center;">Children</th>
              <th>Children's Ages</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            ${signups.map(s => `
              <tr>
                <td style="font-weight:600;">${s.full_name || 'N/A'}</td>
                <td style="font-size:0.85rem;"><a href="mailto:${s.email}" style="color:var(--primary-color);text-decoration:none;">${s.email || 'N/A'}</a></td>
                <td style="font-size:0.85rem;font-weight:600;">${s.postcode || 'N/A'}</td>
                <td style="text-align:center;"><span style="background:#eff6ff;color:#3b82f6;padding:2px 10px;border-radius:12px;font-weight:800;font-size:0.85rem;">${s.num_children || 0}</span></td>
                <td style="font-size:0.8rem;color:#475569;">${(s.children_ages || []).map((a, i) => `Child ${i + 1}: ${a}yr`).join(', ') || '—'}</td>
                <td style="font-size:0.75rem;color:#94a3b8;">${new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (err) {
    container.innerHTML = `<p style="color:red;text-align:center;padding:2rem;">Failed to load registrations: ${err.message}</p>`;
  }
}

window.renderProviderCommentsTab = renderProviderCommentsTab;
async function renderProviderCommentsTab() {
  const listEl = document.getElementById('my-comments-list');
  const contentEl = document.getElementById('prov-comments-content');
  if (!listEl || !contentEl) return;

  contentEl.style.display = 'block';
  listEl.innerHTML = '<div class="text-center" style="padding: 2rem;" id="comment-status">Initializing...</div>';
  const statusEl = document.getElementById('comment-status');

  try {
    statusEl.textContent = 'Verifying identity...';
    const profile = await getMyProfile().catch(() => ({}));
    let provider = null;

    if (profile.role !== 'admin') {
      const providerPromise = getMyProvider();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out after 30s')), 30000));
      provider = await Promise.race([providerPromise, timeoutPromise]);
      if (!provider) {
        listEl.innerHTML = '<div class="card" style="padding: 2rem; text-align: center; color: #ef4444;">Business profile not found. Please ensure you are logged in correctly.</div>';
        return;
      }
    }

    statusEl.textContent = 'Fetching comments...';
    const comments = await getProviderComments(provider?.id || null);

    if (!comments || !comments.length) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem;">
          <p style="font-weight: 600; color: #1e293b;">No comments found</p>
          <p style="font-size: 0.85rem; color: #64748b;">Community comments on your activities and news will appear here for moderation.</p>
        </div>
      `;
      return;
    }

    statusEl.textContent = 'Finalizing view...';
    listEl.innerHTML = comments.map(c => `
      <div class="card" style="margin-bottom: 1rem; padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="background: #f1f5f9; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #64748b; font-size: 0.8rem;">
              ${(c.profiles?.full_name || 'U').charAt(0)}
            </div>
            <div>
              <p style="font-weight: 700; font-size: 0.9rem; margin: 0; color: #1e293b;">${c.profiles?.full_name || 'Anonymous'}</p>
              <p style="font-size: 0.75rem; color: #64748b; margin: 0;">On ${c.activities?.name || c.news?.title || 'Unknown'}</p>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.65rem; padding: 2px 8px; border-radius: 12px; font-weight: 800; text-transform: uppercase; ${c.status === 'approved' ? 'background: #dcfce7; color: #166534;' :
        c.status === 'rejected' ? 'background: #fee2e2; color: #991b1b;' :
          'background: #fef9c3; color: #854d0e;'
      }">
              ${c.status || 'pending'}
            </span>
            <p style="font-size: 0.7rem; color: #94a3b8; margin: 4px 0 0 0;">${new Date(c.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <p style="font-size: 0.9rem; color: #334155; line-height: 1.5; margin: 0 0 1rem 0; background: #f8fafc; padding: 0.75rem; border-radius: 8px;">
          ${c.content}
        </p>

        <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
          <select onchange="window.handleCommentModeration('${c.id}', this.value)" style="padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; border: 1px solid #cbd5e1; outline: none; background: #fff; cursor: pointer;">
            <option value="">Actions...</option>
            <option value="approved" ${c.status === 'approved' ? 'disabled' : ''}>Publish</option>
            <option value="pending" ${c.status === 'pending' ? 'disabled' : ''}>Unpublish</option>
            <option value="delete">Delete Forever</option>
          </select>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error rendering comments tab:', error);
    listEl.innerHTML = `<div class="card" style="color: #ef4444; padding: 1rem; text-align: center;">
      <p style="font-size: 0.85rem;">${error.message}</p>
      <button onclick="window.renderProviderCommentsTab()" class="btn" style="margin-top: 1rem; padding: 8px 16px;">Try Again</button>
    </div>`;
  }
}
window.handleCommentModeration = async (commentId, action) => {
  if (!action) return;

  if (action === 'delete') {
    if (!confirm('Are you sure you want to delete this comment forever?')) return;
    try {
      await deleteComment(commentId);
      renderProviderCommentsTab();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
    return;
  }

  try {
    await updateCommentStatus(commentId, action);
    alert('Comment status updated to ' + action + '!');
    renderProviderCommentsTab();
  } catch (err) {
    alert('Moderation failed: ' + err.message);
  }
}

initApp()

async function updateUnreadBadges() {
  const count = await getUnreadMessageCount();
  const badge = document.getElementById('msg-badge');
  const badgeProv = document.getElementById('msg-badge-prov');

  if (badge) {
    if (count > 0) {
      badge.style.display = 'flex';
      badge.textContent = count > 9 ? '9+' : count;
    } else {
      badge.style.display = 'none';
    }
  }

  if (badgeProv) {
    if (count > 0) {
      badgeProv.style.display = 'flex';
      badgeProv.textContent = count > 9 ? '9+' : count;
    } else {
      badgeProv.style.display = 'none';
    }
  }
}

setInterval(updateUnreadBadges, 60000);

window.renderAdminAddUserForm = () => {
  const modal = document.createElement('div');
  modal.id = 'admin-form-overlay';
  modal.style = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;';
  modal.innerHTML = `
    <div style="background: #fff; width: 100%; max-width: 500px; border-radius: 24px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
      <h2 style="margin-bottom: 1.5rem; font-weight: 800; color: #1e293b;">Add New User</h2>
      <form id="admin-user-form" style="display: grid; gap: 1.25rem;">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="auf-name" required placeholder="John Doe">
        </div>
        <div class="form-group">
          <label>Email (Optional)</label>
          <input type="email" id="auf-email" placeholder="john@example.com">
        </div>
        <div class="form-group">
          <label>Role</label>
          <select id="auf-role" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px;">
            <option value="parent">Parent</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button type="button" onclick="this.closest('#admin-form-overlay').remove()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Create User</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Creating...';
    try {
      await adminCreateUser({
        full_name: document.getElementById('auf-name').value,
        email: document.getElementById('auf-email').value,
        role: document.getElementById('auf-role').value
      });
      modal.remove();
      loadAdminUsers();
    } catch (err) {
      alert('Error: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Create User';
    }
  };
};

window.renderAdminAddActivityForm = async () => {
  const providers = await adminGetAllProviders();
  const modal = document.createElement('div');
  modal.id = 'admin-form-overlay';
  modal.style = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;';
  modal.innerHTML = `
    <div style="background: #fff; width: 100%; max-width: 600px; border-radius: 24px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-height: 90vh; overflow-y: auto;">
      <h2 style="margin-bottom: 1.5rem; font-weight: 800; color: #1e293b;">Add New Activity</h2>
      <form id="admin-act-form" style="display: grid; gap: 1.25rem;">
        <div class="form-group">
          <label>Select Provider</label>
          <select id="aaf-provider" required style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px;">
            <option value="">Choose a business...</option>
            ${providers.map(p => `<option value="${p.id}">${p.business_name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Activity Name</label>
          <input type="text" id="aaf-name" required placeholder="e.g., Chess Workshop">
        </div>
        <div class="form-group">
          <label>Price (£)</label>
          <input type="number" id="aaf-price" step="0.01" required value="0">
        </div>
        <div class="form-group">
          <label>Category</label>
          <input type="text" id="aaf-cat" placeholder="e.g., Workshop, Sports">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button type="button" onclick="this.closest('#admin-form-overlay').remove()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Activity</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      await adminSaveActivity({
        provider_id: document.getElementById('aaf-provider').value,
        name: document.getElementById('aaf-name').value,
        price: document.getElementById('aaf-price').value,
        category: document.getElementById('aaf-cat').value,
        status: 'published'
      });
      modal.remove();
      loadAdminActivities();
    } catch (err) {
      alert('Error: ' + err.message);
      btn.disabled = false;
    }
  };
};

window.renderAdminAddNewsForm = async () => {
  const providers = await adminGetAllProviders();
  const modal = document.createElement('div');
  modal.id = 'admin-form-overlay';
  modal.style = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;';
  modal.innerHTML = `
    <div style="background: #fff; width: 100%; max-width: 600px; border-radius: 24px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
      <h2 style="margin-bottom: 1.5rem; font-weight: 800; color: #1e293b;">Add News Post</h2>
      <form id="admin-news-form" style="display: grid; gap: 1.25rem;">
        <div class="form-group">
          <label>Provider</label>
          <select id="anf-provider" required style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px;">
            ${providers.map(p => `<option value="${p.id}">${p.business_name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="anf-title" required placeholder="News title">
        </div>
        <div class="form-group">
          <label>Content</label>
          <textarea id="anf-content" required style="height: 100px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px;"></textarea>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button type="button" onclick="this.closest('#admin-form-overlay').remove()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Post News</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await adminSaveNews({
        provider_id: document.getElementById('anf-provider').value,
        title: document.getElementById('anf-title').value,
        description: document.getElementById('anf-content').value,
        type: 'news'
      });
      modal.remove();
      loadAdminNewsAndPolls();
    } catch (err) { alert(err.message); }
  };
};

window.renderAdminAddPollForm = async () => {
  const providers = await adminGetAllProviders();
  const modal = document.createElement('div');
  modal.id = 'admin-form-overlay';
  modal.style = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;';
  modal.innerHTML = `
    <div style="background: #fff; width: 100%; max-width: 600px; border-radius: 24px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
      <h2 style="margin-bottom: 1.5rem; font-weight: 800; color: #1e293b;">Create New Poll</h2>
      <form id="admin-poll-form" style="display: grid; gap: 1.25rem;">
        <div class="form-group">
          <label>Provider</label>
          <select id="apf-provider" required style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px;">
            ${providers.map(p => `<option value="${p.id}">${p.business_name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Question</label>
          <input type="text" id="apf-title" required placeholder="What would you like to see next?">
        </div>
        <div class="form-group">
          <label>Options (comma separated)</label>
          <input type="text" id="apf-opts" required placeholder="Option 1, Option 2, Option 3">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button type="button" onclick="this.closest('#admin-form-overlay').remove()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary" style="background: #8b5cf6;">Create Poll</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const opts = document.getElementById('apf-opts').value.split(',').map(s => s.trim()).filter(s => s);
    try {
      await adminSaveNews({
        provider_id: document.getElementById('apf-provider').value,
        title: document.getElementById('apf-title').value,
        type: 'poll',
        metadata: { options: opts }
      });
      modal.remove();
      loadAdminNewsAndPolls();
    } catch (err) { alert(err.message); }
  };
};

async function loadAdminPermissions() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;
  container.innerHTML = '<p style="text-align:center;padding:2rem;color:#64748b;">Loading permissions...</p>';
  try {
    const providers = await adminGetAllProviders();
    const utProvider = providers.find(p => p.business_name === 'Urban Tribe') || providers[0];

    if (!utProvider) {
      container.innerHTML = '<p style="text-align:center;padding:2rem;color:#ef4444;">No providers found to manage permissions.</p>';
      return;
    }

    const perms = await getProviderPermissions(utProvider.id);

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <div>
          <h2 style="font-weight:800;color:#1e293b;margin:0;font-size:1.25rem;">Global Permissions</h2>
          <p style="font-size:0.85rem;color:#64748b;margin:4px 0 0 0;">Managing permissions for: ${utProvider.business_name}</p>
        </div>
        <button onclick="window.renderPermissionForm('${utProvider.id}')" class="btn btn-primary" style="width:auto;padding:8px 20px;border-radius:12px;font-weight:700;display:flex;align-items:center;gap:8px;font-size:0.85rem;">
          + New Permission
        </button>
      </div>

      <div style="display:grid;gap:1rem;">
        ${perms.map(p => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; border: 1px solid #f1f5f9; padding:1.5rem;">
            <div style="flex: 1;">
              <h3 style="font-size: 1.1rem; color: #1e293b; margin-bottom: 6px; font-weight:800;">${p.label}</h3>
              <p style="font-size: 0.85rem; color: #64748b; line-height: 1.4; margin: 0;">${p.description || 'No description provided.'}</p>
            </div>
            <button onclick='window.handleEditPermission(${JSON.stringify(p).replace(/'/g, "&apos;")})' class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem; font-size: 0.8rem; font-weight:700;">Edit</button>
          </div>
        `).join('') || '<div style="text-align:center;padding:3rem;background:#f8fafc;border-radius:24px;border:2px dashed #e2e8f0;"><p style="color:#94a3b8;margin:0;">No permissions defined for this provider yet.</p></div>'}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color:red;text-align:center;padding:2rem;">Failed to load permissions: ${err.message}</p>`;
  }
}

// Remove the old separate admin form functions as we now use the unified one
window.renderAdminAddPermissionForm = null;
window.handleAdminDeletePermission = null;
