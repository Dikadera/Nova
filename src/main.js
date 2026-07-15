import { subscribeToAuthChanges, registerUser, loginUser, logoutUser, adminCreateUser, changeUserPassword, loginWithGoogle } from './services/auth.js';
import {
   createUserProfile, getUserProfile, subscribeToProfile,
   createTransaction, subscribeToTransactions,
   subscribeToAllUsers, subscribeToAllTransactions,
   deleteUserProfile, adminUpdateBalance, updateTransactionStatus,
   adminUpdateUserProfile, updateUserProfile, resetUserVerification, verifyUserOTP,
   generateTransactionOTP, verifyTransactionOTP,
   adminEditTransaction, restrictUserAccount, updateCardRequestStatus, updateLoanStatus,
   incrementUserRewards
} from './services/db.js';
import { LandingView } from './views/Landing.js';
import { LoginView } from './views/Login.js';
import { RegisterView } from './views/Register.js';
import { DashboardView } from './views/Dashboard.js';
import { AdminView } from './views/Admin.js';

// State
let currentUser = null;
let profileUnsubscribe = null;
let txUnsubscribe = null;
let adminUsersUnsub = null;
let adminTxsUnsub = null;
window.allUsers = [];
window.allTransactions = [];
window.currentUserProfile = null;
window.userTransactions = [];
let globalProfileUnsub = null;
let globalProfileData = null;

// --- INACTIVITY & COOKIE LOGIC ---
let inactivityTimer;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 Minutes

const resetInactivityTimer = () => {
   if (inactivityTimer) clearTimeout(inactivityTimer);
   if (currentUser) {
      inactivityTimer = setTimeout(async () => {
         await logoutUser();
         showNotification("Session expired due to inactivity.", "info");
         setTimeout(() => window.location.reload(), 1500);
      }, INACTIVITY_TIMEOUT);
   }
};

const initCookieConsent = () => {
   if (!localStorage.getItem('nova_cookie_consent')) {
      const banner = document.createElement('div');
      banner.id = 'cookieBanner';
      banner.className = 'cookie-banner';
      banner.innerHTML = `
         <div class="cookie-banner-content">
            <div class="cookie-banner-title">Premium Experience & Cookies</div>
            <div class="cookie-banner-text">Nova Bank uses cookies to provide a secure and seamless banking environment. By continuing, you agree to our security protocols.</div>
         </div>
         <div class="cookie-banner-actions">
            <button id="acceptCookies" class="btn btn-primary" style="padding: 0.5rem 1.5rem; font-size: 0.85rem; font-weight: 600;">Accept</button>
         </div>
      `;
      document.body.appendChild(banner);
      setTimeout(() => banner.classList.add('show'), 2000);

      document.getElementById('acceptCookies').addEventListener('click', () => {
         localStorage.setItem('nova_cookie_consent', 'true');
         banner.classList.remove('show');
         setTimeout(() => banner.remove(), 600);
      });
   }
};

// Bind Activity Listeners
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(name => {
   document.addEventListener(name, resetInactivityTimer, true);
});

// Run Cookie Check
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
   initCookieConsent();
}


// --- GLOBAL EVENT DELEGATION ---
document.addEventListener('click', (e) => {
   // Modal Backdrop or Close Buttons
   if (e.target.id === 'modalBackdrop' || e.target.closest('.close-btn')) {
      closeModals();
   }

   // Sidebar Tab Switching (Admin & User)
   const menuItem = e.target.closest('.menu-item');
   if (menuItem) {
      const tabId = menuItem.dataset.tab;
      if (!tabId) return;

      if (globalProfileData?.status === 'restricted' && tabId === 'tab-transfer') {
         if (window.showAlertModal) {
            window.showAlertModal("Account Restricted", "Transfers are currently disabled for your account. Please contact support for further assistance.");
         }
         return; // Prevent tab switch
      }

      const container = menuItem.closest('.admin-wrapper, .admin-layout');
      if (!container) return;

      container.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

      const targetTab = document.getElementById(tabId);
      if (targetTab) targetTab.classList.add('active');
      menuItem.classList.add('active');

      const titleEl = document.getElementById('adminTabTitle') || document.getElementById('currentTabTitle');
      if (titleEl) titleEl.textContent = menuItem.textContent.trim();

      // Auto-close sidebars
      document.getElementById('userSidebar')?.classList.remove('open');
      document.getElementById('adminSidebar')?.classList.remove('open');
      
      // Scroll to top of the page (useful for mobile)
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }

   // Sidebar Toggles
   if (e.target.closest('#openSidebarBtn, #openUserSidebarBtn')) {
      document.getElementById('adminSidebar')?.classList.add('open');
      document.getElementById('userSidebar')?.classList.add('open');
   }
   if (e.target.closest('#closeSidebarBtn, #closeUserSidebarBtn, #closeAdminSidebarBtn')) {
      document.getElementById('adminSidebar')?.classList.remove('open');
      document.getElementById('userSidebar')?.classList.remove('open');
   }

   // Admin Back to Portal
   if (e.target.closest('#backToUserDashboard')) {
      navigateTo('/dashboard');
   }
});

// Utilities & Global Helpers
const showNotification = (message, type = 'success') => {
   const container = document.getElementById('notificationContainer');
   if (!container) return;
   const notif = document.createElement('div');
   notif.className = `notification ${type}`;
   let icon = '✓';
   if (type === 'error') icon = '✕';
   if (type === 'info') icon = 'ℹ';
   notif.innerHTML = `
      <div style="font-weight: 800; font-size: 1.2rem;">${icon}</div>
      <div style="font-size: 0.9rem; font-weight: 500;">${message}</div>
   `;
   container.appendChild(notif);
   setTimeout(() => {
      notif.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => notif.remove(), 300);
   }, 4000);
};
window.showNotification = showNotification;

const formatCurrency = (amount, currency = 'USD') => {
   const symbolMap = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
   };
   const symbol = symbolMap[currency] || '$';
   return `${symbol}${parseFloat(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
window.formatCurrency = formatCurrency;

const sendEmail = async (templateId, params) => {
   try {
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      emailjs.init(publicKey);
      await emailjs.send(serviceId, templateId, params);
      return { success: true };
   } catch (e) {
      console.error("Email Error:", e);
      return { error: e.text || e.message || "Network Error" };
   }
};

const sendLoginOtp = async (uid, email) => {
   try {
      const profileRes = await getUserProfile(uid);
      if (profileRes.data?.role === 'admin') {
         sessionStorage.setItem('otp_verified_user', uid);
         if (window.router) window.router();
         return { success: true };
      }
      const name = profileRes.data?.fullName || "Valued Member";
      const otpRes = await resetUserVerification(uid);
      if (otpRes.error) throw new Error(otpRes.error);
      
      const expiryTime = new Date(Date.now() + 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const templateId = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID;
      await sendEmail(templateId, {
         to_email: email,
         to_name: name,
         passcode: otpRes.verificationCode,
         time: expiryTime
      });
      sessionStorage.setItem('otp_sent', 'true');
      showNotification("A login verification code has been sent to your email.", "info");
      return { success: true };
   } catch (e) {
      console.error("OTP Send Error:", e);
      showNotification("Error sending verification code: " + e.message, "error");
      return { error: e.message };
   }
};
window.sendLoginOtp = sendLoginOtp;

const openModal = (id) => {
   const el = document.getElementById(id);
   const backdrop = document.getElementById('modalBackdrop');
   if (el) {
      // Move modal to body to escape any parent CSS transforms that break position:fixed
      if (el.parentNode !== document.body) {
         document.body.appendChild(el);
      }
      el.style.display = 'flex';
      // Reset internal scroll position so it's always at the top
      const scrollable = el.querySelector('.glass-panel');
      if (scrollable) scrollable.scrollTop = 0;
      el.scrollTop = 0;
   }
   if (backdrop) backdrop.style.display = 'block';
};
window.openModal = openModal;

const closeModals = () => {
   document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
   const backdrop = document.getElementById('modalBackdrop');
   if (backdrop) backdrop.style.display = 'none';
};
window.closeModals = closeModals;

// --- GLOBAL ADMIN HANDLERS ---

window.handleAdminManage = (uid) => {
   const user = window.allUsers.find(u => u.id === uid);
   if (!user) return showNotification("Customer profile not found.", "error");

   const modal = document.getElementById('editUserModal');
   if (!modal) return;

   document.getElementById('editUserId').value = uid;
   document.getElementById('editFullName').value = user.fullName || '';
   document.getElementById('editAccountNum').value = user.accountNumber || '';
   document.getElementById('editDob').value = user.dob || '';
   document.getElementById('editSsn').value = user.ssn || '';
   document.getElementById('editPhone').value = user.phoneNumber || '';
   document.getElementById('editAddress').value = user.address || '';
   document.getElementById('editCity').value = user.city || '';
   document.getElementById('editCountry').value = user.country || '';
   document.getElementById('editKin').value = user.nextOfKin || '';
   document.getElementById('editOccupation').value = user.occupation || '';
   document.getElementById('editVerified').value = user.isVerified?.toString() || 'false';
   document.getElementById('editStatus').value = user.status || 'active';
   document.getElementById('otpStatus').textContent = user.transactionOTP || '000000';

   const preview = document.getElementById('editAvatarPreview');
   if (preview) {
      preview.innerHTML = user.profilePicture
         ? `<img src="${user.profilePicture}" style="width:100%; height:100%; object-fit:cover;">`
         : `<div style="width:100%; height:100%; background:var(--primary); color:#1a1a1a; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.5rem;">${user.fullName[0]}</div>`;
   }

   openModal('editUserModal');
};

window.handleAdminBalance = (uid, name, type) => {
   document.getElementById('modalUserLabel').textContent = `Customer: ${name}`;
   document.getElementById('modalUserId').value = uid;
   document.getElementById('modalType').value = type;
   document.getElementById('modalTitle').textContent = type === 'credit' ? 'Credit Account' : 'Debit Account';
   openModal('balanceModal');
};

window.showConfirmModal = (message) => {
   return new Promise((resolve) => {
      const existing = document.getElementById('customConfirmModal');
      if (existing) existing.remove();

      const modalHtml = `
            <div id="customConfirmModal" class="modal-overlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
                <div class="glass-panel animate-fade-in" style="padding: 2.5rem; max-width: 400px; width: 90%; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3);">
                    <div style="background: rgba(239, 68, 68, 0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                    <h3 style="margin-bottom: 1rem; color: white; font-size: 1.2rem;">Confirm Action</h3>
                    <p class="text-muted" style="margin-bottom: 2rem; font-size: 0.9rem;">${message}</p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button id="confirmCancelBtn" class="btn btn-secondary" style="flex: 1; padding: 0.8rem;">Cancel</button>
                        <button id="confirmProceedBtn" class="btn btn-primary" style="flex: 1; padding: 0.8rem; background: var(--danger); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);">Proceed</button>
                    </div>
                </div>
            </div>
        `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      document.getElementById('confirmCancelBtn').onclick = () => {
         document.getElementById('customConfirmModal').remove();
         resolve(false);
      };

      document.getElementById('confirmProceedBtn').onclick = () => {
         document.getElementById('customConfirmModal').remove();
         resolve(true);
      };
   });
};

window.showAlertModal = (title, message) => {
   const existing = document.getElementById('customAlertModal');
   if (existing) existing.remove();

   const modalHtml = `
         <div id="customAlertModal" class="modal-overlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
             <div class="glass-panel animate-fade-in" style="padding: 2.5rem; max-width: 400px; width: 90%; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3);">
                 <div style="background: rgba(239, 68, 68, 0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                 </div>
                 <h3 style="margin-bottom: 1rem; color: white; font-size: 1.2rem;">${title}</h3>
                 <p class="text-muted" style="margin-bottom: 2rem; font-size: 0.9rem;">${message}</p>
                 <button id="alertCloseBtn" class="btn btn-primary" style="width: 100%; padding: 0.8rem; background: var(--danger); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);">Close</button>
             </div>
         </div>
     `;

   document.body.insertAdjacentHTML('beforeend', modalHtml);

   document.getElementById('alertCloseBtn').onclick = () => {
      document.getElementById('customAlertModal').remove();
   };
};

window.handleAdminDelete = async (uid, name) => {
   const isConfirmed = await window.showConfirmModal(`Are you sure you want to permanently delete customer ${name}? This action cannot be undone.`);
   if (isConfirmed) {
      const res = await deleteUserProfile(uid);
      if (res.error) showNotification(res.error, "error");
      else showNotification("Customer account deleted successfully.", "success");
   }
};

window.handleEditTx = (txId) => {
   const tx = window.allTransactions.find(t => t.id === txId);
   if (!tx) return;
   document.getElementById('editTxId').value = txId;
   document.getElementById('editTxDescription').value = tx.description || '';
   document.getElementById('editTxCurrency').value = tx.currency || 'USD';
   document.getElementById('editTxAmount').value = Math.abs(tx.amount || 0);
   document.getElementById('editTxStatus').value = tx.status || 'completed';
   openModal('editTxModal');
};

window.handleViewReceipt = (txId) => {
   const tx = window.allTransactions.find(t => t.id === txId);
   if (!tx) return;
   const user = window.allUsers.find(u => u.id === tx.userId);

   document.getElementById('receiptStatus').textContent = (tx.status || 'COMPLETED').toUpperCase();
   document.getElementById('receiptStatus').className = `receipt-status-badge ${tx.status || 'completed'}`;
   document.getElementById('receiptAmount').textContent = formatCurrency(Math.abs(tx.amount), tx.currency);
   document.getElementById('receiptDate').textContent = tx.timestamp?.toDate().toLocaleString() || '--';
   document.getElementById('receiptRef').textContent = txId.toUpperCase();
   document.getElementById('receiptDesc').textContent = tx.description || 'System Transaction';
   document.getElementById('receiptBeneficiary').textContent = user?.fullName || 'Unknown Customer';
   document.getElementById('receiptAccount').textContent = user?.accountNumber || '----------';

   openModal('receiptModal');
};

window.handleApproveCard = async (id) => {
   await updateCardRequestStatus(id, 'approved');
   showNotification("Card application approved.", "success");
};

window.handleRejectCard = async (id) => {
   await updateCardRequestStatus(id, 'rejected');
   showNotification("Card application rejected.", "info");
};

window.handleApproveLoan = async (id) => {
   await updateLoanStatus(id, 'approved');
   showNotification("Loan application approved.", "success");
};

window.handleRejectLoan = async (id) => {
   await updateLoanStatus(id, 'rejected');
   showNotification("Loan application rejected.", "info");
};

// PDF / Statement Logic
const populateStatement = (user, transactions) => {
   if (!user || !document.getElementById('statementTemplate')) return;
   document.getElementById('stName').textContent = user.fullName;
   document.getElementById('stEmail').textContent = user.email;
   document.getElementById('stAccNum').textContent = user.accountNumber;
   
   const usdEl = document.getElementById('stBalanceUsd');
   const eurEl = document.getElementById('stBalanceEur');
   const gbpEl = document.getElementById('stBalanceGbp');
   if (usdEl) usdEl.textContent = formatCurrency(user.balance, 'USD');
   if (eurEl) eurEl.textContent = formatCurrency(user.balance_eur || 0, 'EUR');
   if (gbpEl) gbpEl.textContent = formatCurrency(user.balance_gbp || 0, 'GBP');

   document.getElementById('stPeriod').textContent = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

   const body = document.getElementById('stBody');
   body.innerHTML = transactions.map(tx => `
      <tr>
         <td style="padding:10px; border-bottom:1px solid #eee;">${tx.timestamp?.toDate().toLocaleDateString()}</td>
         <td style="padding:10px; border-bottom:1px solid #eee;">${tx.description}</td>
         <td style="padding:10px; border-bottom:1px solid #eee; text-align:right; font-weight:700;">${tx.amount < 0 ? '-' : '+'}${formatCurrency(Math.abs(tx.amount), tx.currency)}</td>
         <td style="padding:10px; border-bottom:1px solid #eee; text-align:right; text-transform:uppercase; font-size:10px;">${tx.status || 'completed'}</td>
      </tr>
   `).join('');
};



// Premium Card Rendering
const renderMastercard = (user) => {
   const container = document.getElementById('mastercardContainer');
   if (!container || !user) return;

   const cardNum = user.accountNumber || '0000000000000000';
   // Mask card number: xxxx xxxx xxxx 1234
   const maskedNum = 'xxxx xxxx xxxx ' + cardNum.slice(-4);

   container.innerHTML = `
      <div class="mastercard animate-float">
         <div class="card-inner">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem;">
               <div style="font-weight: 800; font-size: 1.2rem; letter-spacing: 2px;">NOVA <span style="font-weight: 300;">PLATINUM</span></div>
               <svg width="45" height="35" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="7" fill="rgba(255,255,255,0.8)"/><circle cx="17" cy="12" r="7" fill="rgba(255,255,255,0.4)"/></svg>
            </div>
            <div style="margin-bottom: 2.5rem;">
               <div style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; margin-bottom: 0.5rem; letter-spacing: 1.5px;">Card Holder</div>
               <div style="font-size: 1.4rem; font-weight: 700; letter-spacing: 1px;">${user.fullName || 'Valued Member'}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
               <div>
                  <div style="font-family: 'Courier New', Courier, monospace; font-size: 1.2rem; letter-spacing: 3px;">${maskedNum}</div>
               </div>
               <div style="text-align: right;">
                  <div style="font-size: 0.6rem; opacity: 0.8; margin-bottom: 0.2rem;">VALID THRU</div>
                  <div style="font-size: 0.9rem; font-weight: 600;">12/28</div>
               </div>
            </div>
         </div>
      </div>
   `;
};

const populateProfileView = (user) => {
   if (!user) return;
   const greeting = document.getElementById('userGreeting');
   if (greeting) greeting.textContent = `Hello, ${user.fullName.split(' ')[0]}`;
   const topbarAcc = document.getElementById('topbarAccountNum');
   if (topbarAcc) topbarAcc.textContent = user.accountNumber;

   const navAvatar = document.getElementById('navAvatarContainer');
   if (navAvatar) {
      navAvatar.innerHTML = user.profilePicture
         ? `<img src="${user.profilePicture}" class="profile-avatar" alt="User">`
         : `<div class="profile-avatar" style="background: var(--primary); color: #1a1a1a; display: flex; align-items: center; justify-content: center; font-weight: 800;">${user.fullName[0]}</div>`;
   }

   // Update Profile Tab Fields
   const setField = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || 'Not set';
   };

   setField('profileViewName', user.fullName);
   setField('profileViewEmail', user.email);
   setField('profileViewAccountNum', user.accountNumber);
   setField('profileViewStatus', user.status);
   setField('profileViewPhone', user.phoneNumber);
   setField('profileViewDob', user.dob);

   const addrEl = document.getElementById('profileViewAddress');
   if (addrEl) {
      addrEl.innerHTML = user.address
         ? `${user.address}<br>${user.city || ''}, ${user.state || ''} ${user.zip || ''}`
         : 'No address on file';
   }

   renderAvatar(user, 'profileViewAvatar');
};

const renderAvatar = (user, containerId) => {
   const container = document.getElementById(containerId);
   if (!container) return;
   container.innerHTML = user.profilePicture
      ? `<img src="${user.profilePicture}" class="profile-avatar" alt="Avatar">`
      : `<div class="profile-avatar" style="background: var(--primary); color: #1a1a1a; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 2rem;">${user.fullName[0]}</div>`;
};

// Router
const navigateTo = (url) => {
   try {
      history.pushState(null, null, url);
   } catch(e) {
      console.warn("pushState error:", e);
   }
   router();
};

const router = async () => {
   const routes = [
      { path: "/", view: LandingView, auth: 'public' },
      { path: "/login", view: LoginView, auth: 'unauthenticated' },
      { path: "/register", view: RegisterView, auth: 'unauthenticated' },
      { path: "/dashboard", view: DashboardView, auth: 'authenticated' },
      { path: "/admin", view: AdminView, auth: 'admin' }
   ];

   const potentialMatches = routes.map(route => ({ route, isMatch: location.pathname === route.path }));
   let match = potentialMatches.find(m => m.isMatch) || { route: routes[0], isMatch: true };
   const isOtpVerified = currentUser && sessionStorage.getItem('otp_verified_user') === currentUser.uid;
   console.log("[Router] Path:", location.pathname, "User ID:", currentUser?.uid, "Verified User in Session:", sessionStorage.getItem('otp_verified_user'), "isOtpVerified:", isOtpVerified);

   if ((match.route.auth === 'authenticated' || match.route.auth === 'admin') && !currentUser) {
      console.log("[Router] No user. Redirecting to /login");
      return navigateTo('/login');
   }

   if (currentUser && !isOtpVerified) {
      if (location.pathname !== '/login') {
         console.log("[Router] Redirecting unverified user to /login from:", location.pathname);
         return navigateTo('/login');
      }
   }

   if (currentUser) {
      if (!globalProfileData) {
         document.querySelector("#app").innerHTML = `<div style="display:flex; justify-content:center; align-items:center; min-height:80vh; color:var(--primary); font-weight:600; letter-spacing:2px;">SECURE CONNECTION ESTABLISHED...</div>`;
         return;
      }
   }
   if (match.route.auth === 'unauthenticated' && currentUser) {
      if (isOtpVerified) {
         console.log("[Router] Verified user. Redirecting to dashboard/admin:", globalProfileData?.role);
         return navigateTo(globalProfileData?.role === 'admin' ? '/admin' : '/dashboard');
      }
   }
   if (match.route.path === '/dashboard' && globalProfileData?.role === 'admin') {
      return navigateTo('/admin');
   }
   if (match.route.auth === 'admin' && (!globalProfileData || globalProfileData.role !== 'admin')) return navigateTo('/dashboard');

   if (window.ratesInterval) {
      clearInterval(window.ratesInterval);
      window.ratesInterval = null;
   }
   if (window.testimonialInterval) {
      clearInterval(window.testimonialInterval);
      window.testimonialInterval = null;
   }
   if (window.activeGlowListener) {
      window.removeEventListener('mousemove', window.activeGlowListener);
      window.activeGlowListener = null;
   }

   document.querySelector("#app").innerHTML = match.route.view(currentUser);
   attachEventListeners(match.route.path);

   // Safely remove preloader only after the view is fully rendered
   const preloader = document.getElementById('preloader');
   if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => preloader.remove(), 500);
   }

   // Inject Tawk.to Live Chat safely without disrupting the initial network payload
   setTimeout(() => {
      if (!window.tawkLoaded) {
         window.tawkLoaded = true;
         var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
         var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
         s1.async=true;
         s1.src='https://embed.tawk.to/6a3656c79b11ab1d453544f1/1jri45uvr';
         s1.charset='UTF-8';
         s1.setAttribute('crossorigin','*');
         if(s0 && s0.parentNode) s0.parentNode.insertBefore(s1,s0);
         else document.head.appendChild(s1);
      }
   }, 1500);
};

const attachEventListeners = async (path) => {
   if (path === '/dashboard') {
      const user = globalProfileData;
      if (!user) return;

      // Initial state
      const initialTab = 'tab-dashboard';
      document.getElementById(initialTab)?.classList.add('active');
      document.querySelector(`[data-tab="${initialTab}"]`)?.classList.add('active');

      // Mastercard & Profile Init
      renderMastercard(user);
      populateProfileView(user);

      // Restriction UI
      if (user.status === 'restricted') {
         const container = document.getElementById('restrictionAlertContainer');
         if (container) container.innerHTML = `<div class="alert alert-danger" style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger); color: var(--danger); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;"><strong>Security Alert:</strong> Your account is currently restricted. Transfers are disabled. Please contact support.</div>`;
         const quickBtn = document.getElementById('quickTransferBtn');
         if (quickBtn) quickBtn.style.opacity = '0.5';
         const tForm = document.getElementById('transferForm');
         if (tForm) {
            tForm.querySelectorAll('input, select, button').forEach(f => f.disabled = true);
         }
      }

      // Profile Completion Warning
      const profileAlert = document.getElementById('profileAlertContainer');
      if (profileAlert) {
         if (!user.dob || !user.phoneNumber || !user.address) {
            profileAlert.innerHTML = `<div class="alert" style="background: rgba(234, 179, 8, 0.1); border-left: 4px solid #eab308; color: #eab308; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem;">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
               <strong>Action Required:</strong> Please complete your profile information to gain full access to all banking features.
            </div>`;
         } else {
            profileAlert.innerHTML = '';
         }
      }

      window.showReceiptModal = (tx, shouldReloadOnClose = false) => {
         const isCredit = tx.amount > 0;
         const amountFmt = (isCredit ? '+' : '-') + formatCurrency(Math.abs(tx.amount), tx.currency);
         
         let dateStr = '--';
         if (tx.timestamp) {
            const dt = tx.timestamp.toDate ? tx.timestamp.toDate() : new Date(tx.timestamp);
            dateStr = dt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
         }

         let bankName = '--';
         if (tx.description && tx.description.includes('External Transfer to ')) {
            bankName = tx.description.replace('External Transfer to ', '');
         } else if (!isCredit) {
            bankName = 'Nova Bank';
         } else if (tx.senderAccount) {
            bankName = 'Nova Bank';
         }

         const refId = tx.refId || tx.referenceId || ('NVB-' + (tx.id || '').substring(0, 8).toUpperCase());

         const amtEl = document.getElementById('userReceiptAmount');
         if (amtEl) {
            amtEl.textContent = amountFmt;
            if (isCredit) {
               amtEl.style.background = 'none';
               amtEl.style.webkitTextFillColor = 'var(--success)';
               amtEl.style.color = 'var(--success)';
            } else {
               amtEl.style.background = 'none';
               amtEl.style.webkitTextFillColor = 'var(--danger)';
               amtEl.style.color = 'var(--danger)';
            }
         }

         document.getElementById('userReceiptDate').textContent    = dateStr;
         document.getElementById('userReceiptRef').textContent     = refId;
         
         let transferType = 'Internal Bank Transfer';
         if (tx.type === 'deposit') {
            transferType = 'Inward Transfer';
         } else if (tx.description && tx.description.includes('External Transfer')) {
            transferType = 'External Wire Transfer';
         }
         
         document.getElementById('userReceiptType').textContent    = transferType;
         document.getElementById('userReceiptAccount').textContent = tx.recipientAccount || tx.senderAccount || '--';
         document.getElementById('userReceiptBank').textContent    = bankName;
         document.getElementById('userReceiptDesc').textContent    = tx.description || '--';
         
         let senderName = '--';
         if (!isCredit) {
            senderName = (window.currentUserProfile?.fullName) || '--';
         } else if (tx.senderAccount) {
            senderName = 'Account No: ' + tx.senderAccount;
         } else {
            senderName = 'External Sender';
         }
         document.getElementById('userReceiptSender').textContent  = senderName;
         
         const statusEl = document.getElementById('userReceiptStatus');
         if (statusEl) {
            const status = (tx.status || 'completed').toUpperCase();
            statusEl.textContent = status;
            statusEl.className = 'receipt-status-badge ' + status.toLowerCase();
         }

         const modal = document.getElementById('userReceiptModal');
         if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
         }

         const pdfBtn = document.getElementById('userReceiptPdfBtn');
         if (pdfBtn) {
            const newPdfBtn = pdfBtn.cloneNode(true);
            pdfBtn.replaceWith(newPdfBtn);
            newPdfBtn.addEventListener('click', () => {
               window.print();
            });
         }

         const closeBtn = document.getElementById('userReceiptCloseBtn');
         if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.replaceWith(newCloseBtn);
            newCloseBtn.addEventListener('click', () => {
               const m = document.getElementById('userReceiptModal');
               if (m) m.style.display = 'none';
               document.body.style.overflow = '';
               if (shouldReloadOnClose) {
                  window.location.reload();
               }
            });
         }
      };

      window.viewTxDetailById = (id) => {
         const tx = (window.userTransactions || []).find(t => t.id === id);
         if (tx) {
            window.showReceiptModal(tx, false);
         }
      };

      profileUnsubscribe = subscribeToProfile(currentUser.uid, (data) => {
         const usdEl = document.getElementById('balance-usd');
         const eurEl = document.getElementById('balance-eur');
         const gbpEl = document.getElementById('balance-gbp');
         if (usdEl) usdEl.textContent = parseFloat(data.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
         if (eurEl) eurEl.textContent = parseFloat(data.balance_eur || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
         if (gbpEl) gbpEl.textContent = parseFloat(data.balance_gbp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

         const updateTransferBalance = () => {
            const selectVal = document.getElementById('transferCurrency')?.value || 'USD';
            const balDisplay = document.getElementById('transferAvailableBalanceDisplay');
            if (balDisplay) {
               let avail = data.balance || 0;
               if (selectVal === 'EUR') avail = data.balance_eur || 0;
               if (selectVal === 'GBP') avail = data.balance_gbp || 0;
               balDisplay.textContent = formatCurrency(avail, selectVal) + ' ' + selectVal;
            }
         };
         updateTransferBalance();
         
         const selectCur = document.getElementById('transferCurrency');
         if (selectCur && !selectCur.dataset.listenerAttached) {
            selectCur.addEventListener('change', updateTransferBalance);
            selectCur.dataset.listenerAttached = 'true';
         }

         populateProfileView(data);
         renderMastercard(data);
      });

      txUnsubscribe = subscribeToTransactions(currentUser.uid, (txs) => {
         window.userTransactions = txs;

         // --- Recent (dashboard, last 5) ---
         const recentEl = document.getElementById('transactionsList');
         if (recentEl) {
            if (txs.length === 0) {
               recentEl.innerHTML = `<div class="text-muted" style="text-align:center; padding:2rem; opacity:0.6;">No transactions yet.</div>`;
            } else {
               recentEl.innerHTML = txs.slice(0, 5).map(tx => {
                  const isCredit = tx.amount > 0;
                  const icon = isCredit
                     ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`
                     : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
                  const dateStr = tx.timestamp?.toDate().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) || '--';
                  return `
                  <div onclick="window.viewTxDetailById('${tx.id}')" style="display:flex; align-items:center; gap:1rem; padding:0.9rem 0; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                     <div style="width:40px; height:40px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:${isCredit ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'};"> ${icon}</div>
                     <div style="flex:1; min-width:0;">
                        <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tx.description || 'Transaction'}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">${dateStr}</div>
                     </div>
                     <div style="font-weight:700; font-size:0.95rem; flex-shrink:0; color:${isCredit ? 'var(--success)' : 'var(--danger)'};"> ${isCredit ? '+' : '-'}${formatCurrency(Math.abs(tx.amount), tx.currency)}</div>
                  </div>`;
               }).join('');
            }
         }

         // --- Full history (statement tab) ---
         window.renderFullHistory = () => {
            const histEl = document.getElementById('fullTransactionsList');
            if (!histEl) return;
            const search = (document.getElementById('txSearchInput')?.value || '').toLowerCase();
            const filter = document.getElementById('txFilterType')?.value || 'all';
            const filtered = txs.filter(tx => {
               const matchSearch = !search || (tx.description || '').toLowerCase().includes(search);
               const matchFilter = filter === 'all' || (filter === 'credit' ? tx.amount > 0 : tx.amount < 0);
               return matchSearch && matchFilter;
            });
            if (filtered.length === 0) {
               histEl.innerHTML = `<div class="text-muted" style="text-align:center; padding:3rem; opacity:0.6;">No transactions match your filter.</div>`;
               return;
            }
            histEl.innerHTML = filtered.map(tx => {
               const isCredit = tx.amount > 0;
               const dateStr = tx.timestamp?.toDate().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) || '--';
               const icon = isCredit
                  ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`
                  : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
               const statusColor = tx.status === 'completed' ? 'var(--success)' : tx.status === 'pending' ? '#f59e0b' : 'var(--danger)';
               return `
               <div onclick="window.viewTxDetailById('${tx.id}')" style="display:flex; align-items:center; gap:1rem; padding:1.1rem 0.5rem; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                  <div style="width:38px; height:38px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:${isCredit ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'};"> ${icon}</div>
                  <div style="flex:1; min-width:0;">
                     <div style="font-weight:600; font-size:0.88rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tx.description || 'Transaction'}</div>
                     <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.15rem;">${dateStr}</div>
                  </div>
                  <span style="font-size:0.65rem; font-weight:700; color:${statusColor}; background:${isCredit ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'}; padding:0.2rem 0.55rem; border-radius:20px; text-transform:uppercase; flex-shrink:0;">${tx.status || 'completed'}</span>
                  <div style="font-weight:700; font-size:0.95rem; flex-shrink:0; text-align:right; min-width:80px; color:${isCredit ? 'var(--success)' : 'var(--danger)'};"> ${isCredit ? '+' : '-'}${formatCurrency(Math.abs(tx.amount), tx.currency)}</div>
               </div>`;
            }).join('');
         };
         window.renderFullHistory();
      });

      // Transfer Switching
      const switchBtn = document.getElementById('transferSwitchBtn');
      if (switchBtn) {
         switchBtn.addEventListener('click', () => {
            const typeEl = document.getElementById('transferType');
            const titleEl = document.getElementById('transferViewTitle');
            const newType = typeEl.value === 'external' ? 'internal' : 'external';
            typeEl.value = newType;
            titleEl.textContent = newType === 'external' ? 'External Transfer Fund' : 'Internal Transfer Fund';
            switchBtn.textContent = newType === 'external' ? 'Switch to Internal Transfer' : 'Switch to External Transfer';
            ['transferBankName', 'transferSwift', 'transferIban', 'transferCountry'].forEach(id => {
               const el = document.getElementById(id);
               if (el) {
                  el.closest('.form-group').style.display = newType === 'internal' ? 'none' : 'block';
                  if (newType === 'internal') el.removeAttribute('required'); else el.setAttribute('required', '');
               }
            });
         });
      }

      // Transfer Submit
      document.getElementById('transferForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const btn = document.getElementById('transferBtn');
         btn.disabled = true;
         const amount = parseFloat(document.getElementById('transferAmount').value);
         const account = document.getElementById('transferAccount').value;
         const type = document.getElementById('transferType').value;
         const bank = document.getElementById('transferBankName').value || 'Nova Bank';
         const otpRes = await generateTransactionOTP(currentUser.uid);
         if (otpRes.error) return showNotification("OTP Error", "error");

         const expiryTime = new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
         const transferTemplateId = import.meta.env.VITE_EMAILJS_TRANSFER_TEMPLATE_ID;
         await sendEmail(transferTemplateId, {
            to_email: currentUser.email,
            to_name: user.fullName,
            passcode: otpRes.code,
            time: expiryTime,
            amount: amount.toFixed(2),
            currency: document.getElementById('transferCurrency').value
         });

         openModal('transferOtpModal');
         btn.disabled = false;
         window.pendingTransfer = { uid: currentUser.uid, amount, account, type, bank, currency: document.getElementById('transferCurrency').value, description: type === 'external' ? `External Transfer to ${bank}` : `Internal Transfer to Nova Acc: ${account}` };
      });

      document.getElementById('transferOtpForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const res = await verifyTransactionOTP(window.pendingTransfer.uid, document.getElementById('transferOtpInput').value);
         if (res.error) {
            showNotification(res.error, "error");
         } else {
            const txRes = await createTransaction(window.pendingTransfer.uid, window.pendingTransfer.amount, window.pendingTransfer.account, window.pendingTransfer.description, window.pendingTransfer.type, window.pendingTransfer.currency);
            if (txRes.error) {
               showNotification(txRes.error, "error");
            } else {
               // Close OTP modal
               closeModals();

               // Show receipt modal using the new helper
               const pt = window.pendingTransfer;
               const now = new Date();
               const refId = 'NVB-' + now.getTime().toString(36).toUpperCase();
               
               window.showReceiptModal({
                  amount: -pt.amount,
                  timestamp: now,
                  refId: refId,
                  type: pt.type,
                  recipientAccount: pt.account,
                  bank: pt.bank,
                  description: pt.description,
                  currency: pt.currency,
                  status: 'completed'
               }, true);

               showNotification('Transfer Successful! Receipt generated.', 'success');
            }
         }
      });

      document.getElementById('quickTransferBtn')?.addEventListener('click', () => {
         if (globalProfileData?.status === 'restricted') {
             if (window.showAlertModal) {
                 window.showAlertModal("Account Restricted", "Transfers are currently disabled for your account. Please contact support for further assistance.");
             }
             return;
         }
         document.querySelector('[data-tab="tab-transfer"]').click();
      });
      document.getElementById('quickLoanBtn')?.addEventListener('click', () => {
         document.querySelector('[data-tab="tab-loans"]').click();
      });

      // "View All" button on dashboard navigates to the history tab
      document.getElementById('dashboardViewAllTxBtn')?.addEventListener('click', () => {
         document.querySelector('[data-tab="tab-statement"]')?.click();
      });

      // Search & filter listeners for history tab
      document.getElementById('txSearchInput')?.addEventListener('input', () => window.renderFullHistory?.());
      document.getElementById('txFilterType')?.addEventListener('change', () => window.renderFullHistory?.());

      // Other listeners
      document.getElementById('logoutBtn')?.addEventListener('click', () => {
         sessionStorage.removeItem('otp_verified_user');
         sessionStorage.removeItem('otp_sent');
         logoutUser().then(() => window.location.reload());
      });
      document.getElementById('loanForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         showNotification("Loan application submitted for review.", "info");
         e.target.reset();
      });
      document.getElementById('cardsForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         showNotification("Card request submitted.", "info");
      });
      document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const res = await changeUserPassword(document.getElementById('newPassword').value);
         if (res.error) showNotification(res.error, "error");
         else showNotification("Password updated successfully!", "success");
      });

      // Edit Profile Modal
      document.getElementById('triggerEditProfile')?.addEventListener('click', () => {
         document.getElementById('userEditDob').value = user.dob || '';
         document.getElementById('userEditPhone').value = user.phoneNumber || '';
         document.getElementById('userEditSsn').value = user.ssn || '';
         document.getElementById('userEditAddress').value = user.address || '';
         document.getElementById('userEditCity').value = user.city || '';
         document.getElementById('userEditState').value = user.state || '';
         document.getElementById('userEditZip').value = user.zip || '';
         openModal('userProfileModal');
      });

      document.getElementById('closeUserProfileModal')?.addEventListener('click', () => {
         closeModals();
      });

      document.getElementById('userProfileForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const btn = document.getElementById('saveUserProfileBtn');
         const msg = document.getElementById('userProfileMessage');
         btn.disabled = true;

         const data = {
            dob: document.getElementById('userEditDob').value,
            phoneNumber: document.getElementById('userEditPhone').value,
            ssn: document.getElementById('userEditSsn').value,
            address: document.getElementById('userEditAddress').value,
            city: document.getElementById('userEditCity').value,
            state: document.getElementById('userEditState').value,
            zip: document.getElementById('userEditZip').value
         };

         const res = await updateUserProfile(currentUser.uid, data);
         btn.disabled = false;

         if (res.error) {
            msg.textContent = res.error;
            msg.style.display = 'block';
            msg.style.color = 'var(--danger)';
         } else {
            showNotification("Profile updated successfully!", "success");
            closeModals();
            setTimeout(() => window.location.reload(), 1000);
         }
      });
   }

   if (path === '/admin') {
      // Modals
      document.getElementById('openCreateUserModal')?.addEventListener('click', () => openModal('createUserModal'));
      document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
         sessionStorage.removeItem('otp_verified_user');
         sessionStorage.removeItem('otp_sent');
         logoutUser().then(() => window.location.reload());
      });

      // Forms
      document.getElementById('createUserForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const btn = document.getElementById('confirmCreateBtn');
         const msg = document.getElementById('createUserMsg');
         btn.disabled = true;

         const email = document.getElementById('createEmail').value;
         const pass = document.getElementById('createPassword').value;
         const name = document.getElementById('createFullName').value;
         const dob = document.getElementById('createDob').value;
         const ssn = document.getElementById('createSsn').value;
         const address = document.getElementById('createAddress').value;
         const city = document.getElementById('createCity').value;
         const country = document.getElementById('createCountry').value;
         const accountType = document.getElementById('createAccountType').value;
         const balance = parseFloat(document.getElementById('createBalance').value) || 0;

         const res = await adminCreateUser(email, pass);
         if (res.error) {
            msg.textContent = res.error;
            msg.style.display = 'block';
            msg.style.color = 'var(--danger)';
            btn.disabled = false;
         } else {
            const profileRes = await createUserProfile(res.user.uid, email, name);
            if (profileRes.error) {
               msg.textContent = profileRes.error;
               msg.style.display = 'block';
               msg.style.color = 'var(--danger)';
               btn.disabled = false;
            } else {
               const extraData = {
                  dob: dob || "",
                  ssn: ssn || "",
                  address: address || "",
                  city: city || "",
                  country: country || "",
                  accountType: accountType || "Savings Account",
                  isVerified: true
               };
               await adminUpdateUserProfile(res.user.uid, extraData);

               if (balance > 0) {
                  await adminUpdateBalance(res.user.uid, balance, 'credit', 'Opening Balance');
               }

               showNotification("Customer account created successfully!", "success");
               closeModals();
               e.target.reset();
               btn.disabled = false;
            }
         }
      });

      document.getElementById('editUserForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const uid = document.getElementById('editUserId').value;
         const data = {
            fullName: document.getElementById('editFullName').value,
            accountNumber: document.getElementById('editAccountNum').value,
            dob: document.getElementById('editDob').value,
            ssn: document.getElementById('editSsn').value,
            phoneNumber: document.getElementById('editPhone').value,
            address: document.getElementById('editAddress').value,
            city: document.getElementById('editCity').value,
            country: document.getElementById('editCountry').value,
            nextOfKin: document.getElementById('editKin').value,
            occupation: document.getElementById('editOccupation').value,
            isVerified: document.getElementById('editVerified').value === 'true',
            status: document.getElementById('editStatus').value
         };

         const res = await adminUpdateUserProfile(uid, data);
         if (res.error) showNotification(res.error, "error");
         else {
            showNotification("Profile updated successfully!", "success");
            closeModals();
         }
      });

      document.getElementById('confirmBalanceBtn')?.addEventListener('click', async () => {
         const uid = document.getElementById('modalUserId').value;
         const amount = document.getElementById('modalAmount').value;
         const type = document.getElementById('modalType').value;
         const desc = document.getElementById('modalDescription').value;
         const currency = document.getElementById('modalCurrency').value;

         const res = await adminUpdateBalance(uid, amount, type, desc, currency);
         if (res.error) showNotification(res.error, "error");
         else {
            showNotification(`Account ${type}ed successfully!`, "success");
            closeModals();
         }
      });

      document.getElementById('saveTxBtn')?.addEventListener('click', async () => {
         const id = document.getElementById('editTxId').value;
         const data = {
            description: document.getElementById('editTxDescription').value,
            currency: document.getElementById('editTxCurrency').value,
            amount: parseFloat(document.getElementById('editTxAmount').value),
            status: document.getElementById('editTxStatus').value
         };
         const res = await adminEditTransaction(id, data);
         if (res.error) showNotification(res.error, "error");
         else {
            showNotification("Transaction updated.", "success");
            closeModals();
         }
      });

      document.getElementById('adminErrorForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const uid = document.getElementById('errorTargetUser').value;
         const sub = document.getElementById('errorSubject').value;
         const msg = document.getElementById('errorMessageBody').value;
         const res = await restrictUserAccount(uid, sub, msg);
         if (res.error) showNotification(res.error, "error");
         else showNotification("Security restriction applied.", "info");
      });

      // Global Search Filtering
      document.getElementById('adminGlobalSearch')?.addEventListener('input', (e) => {
         const term = e.target.value.toLowerCase();
         const activeTab = document.querySelector('.tab-content.active');
         if (!activeTab) return;

         const rows = activeTab.querySelectorAll('tbody tr');
         rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
         });
      });

      document.getElementById('fabCreateUser')?.addEventListener('click', () => {
         openModal('createUserModal');
      });

      document.getElementById('backToUserDashboard')?.addEventListener('click', () => {
         navigateTo('/dashboard');
      });

      // Subscriptions
      adminUsersUnsub = subscribeToAllUsers((users) => {
         window.allUsers = users;
         document.getElementById('totalUsersCount').textContent = users.length;

         const tbody = document.getElementById('usersTableBody');
         if (tbody) tbody.innerHTML = users.map(u => `
            <tr>
               <td data-label="IDENTITY">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                     <div style="width:32px; height:32px; border-radius:50%; overflow:hidden; background:rgba(255,255,255,0.1);">
                        ${u.profilePicture ? `<img src="${u.profilePicture}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--primary);">${u.fullName[0]}</div>`}
                     </div>
                     <div style="display:flex; flex-direction:column;">
                        <div style="font-weight:600; font-size:0.9rem;">${u.fullName}</div>
                        <div style="font-size:0.65rem; font-family:monospace; color:var(--primary); opacity:0.7; letter-spacing:1px;">ACC: ${u.accountNumber}</div>
                     </div>
                  </div>
               </td>
               <td data-label="EMAIL" style="font-size:0.8rem; color:var(--text-muted);">${u.email}</td>
               <td data-label="STATUS"><span class="status-badge ${u.status === 'active' ? 'status-successful' : 'status-pending'}" style="font-size:0.65rem;">${(u.status || 'active').toUpperCase()}</span></td>
               <td data-label="BALANCE">
                  <div style="font-size:0.75rem; font-weight:700; display:flex; flex-direction:column; gap:0.15rem; color: #fff;">
                     <span>USD: $${parseFloat(u.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                     <span>EUR: €${parseFloat(u.balance_eur || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                     <span>GBP: £${parseFloat(u.balance_gbp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
               </td>
               <td data-label="ACTIONS">
                  <div style="display:flex; gap:0.5rem; flex-wrap:wrap; min-width:200px;">
                     <button class="btn btn-primary" style="padding:0.4rem 0.8rem; font-size:0.7rem;" onclick="window.handleAdminManage('${u.id}')">MANAGE</button>
                     <button class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.7rem;" onclick="window.handleAdminBalance('${u.id}', '${u.fullName}', 'credit')">CREDIT</button>
                     <button class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.7rem;" onclick="window.handleAdminBalance('${u.id}', '${u.fullName}', 'debit')">DEBIT</button>
                     <button class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.7rem; color:var(--danger); border-color:rgba(239, 68, 68, 0.3);" onclick="window.handleAdminDelete('${u.id}', '${u.fullName}')">DELETE</button>
                  </div>
               </td>
            </tr>
         `).join('');

         const select = document.getElementById('errorTargetUser');
         if (select) select.innerHTML = users.map(u => `<option value="${u.id}">${u.fullName} [${u.accountNumber}] (${u.email})</option>`).join('');
      });

      adminTxsUnsub = subscribeToAllTransactions((txs) => {
         window.allTransactions = txs;
         const tbody = document.getElementById('allTransactionsTableBody');
         if (tbody) tbody.innerHTML = txs.map(tx => {
            const user = window.allUsers.find(u => u.id === tx.userId);
            return `
               <tr class="clickable-tx">
                  <td data-label="DATE" style="font-size:0.75rem;">${tx.timestamp?.toDate().toLocaleDateString()}</td>
                  <td data-label="SENDER">
                     <div style="font-weight:600; font-size:0.85rem;">${user?.fullName || 'System'}</div>
                     ${user ? `<div style="font-size:0.65rem; color:var(--primary); opacity:0.7; font-family:monospace;">ACC: ${user.accountNumber}</div>` : ''}
                  </td>
                  <td data-label="DESCRIPTION" style="font-size:0.8rem;">${tx.description}</td>
                  <td data-label="AMOUNT" style="font-weight:700; color:${tx.amount < 0 ? 'var(--danger)' : 'var(--success)'};">${tx.amount < 0 ? '-' : '+'}${formatCurrency(Math.abs(tx.amount), tx.currency)}</td>
                  <td data-label="STATUS"><span class="status-badge ${tx.status || 'completed'}" style="font-size:0.65rem;">${(tx.status || 'completed').toUpperCase()}</span></td>
                  <td data-label="ACTIONS">
                     <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.65rem;" onclick="window.handleEditTx('${tx.id}')">OVERRIDE</button>
                        <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.65rem;" onclick="window.handleViewReceipt('${tx.id}')">RECEIPT</button>
                     </div>
                  </td>
               </tr>
            `;
         }).join('');
      });

      subscribeToAllCardRequests((reqs) => {
         const tbody = document.getElementById('cardRequestsTableBody');
         if (tbody) tbody.innerHTML = reqs.map(r => {
            const user = window.allUsers.find(u => u.id === r.userId);
            return `
               <tr>
                  <td data-label="DATE">${r.timestamp?.toDate().toLocaleDateString()}</td>
                  <td data-label="CUSTOMER">${user?.fullName || 'Unknown'}</td>
                  <td data-label="CARD TIER">${r.cardType}</td>
                  <td data-label="STATUS"><span class="status-badge ${r.status}">${r.status.toUpperCase()}</span></td>
                  <td data-label="ACTIONS">
                     <div style="display:flex; gap:0.5rem; flex-wrap:wrap; min-width: 120px;">
                        ${r.status === 'pending' ? `
                           <button class="btn btn-primary" style="padding:0.3rem 0.6rem; font-size:0.65rem;" onclick="window.handleApproveCard('${r.id}')">APPROVE</button>
                           <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.65rem;" onclick="window.handleRejectCard('${r.id}')">REJECT</button>
                        ` : '--'}
                     </div>
                  </td>
               </tr>
            `;
         }).join('');
      });

      subscribeToAllLoans((loans) => {
         const tbody = document.getElementById('loanRequestsTableBody');
         if (tbody) tbody.innerHTML = loans.map(l => {
            const user = window.allUsers.find(u => u.id === l.userId);
            return `
               <tr>
                  <td data-label="DATE">${l.timestamp?.toDate().toLocaleDateString()}</td>
                  <td data-label="CUSTOMER">${user?.fullName || 'Unknown'}</td>
                  <td data-label="AMOUNT">$${parseFloat(l.amount).toLocaleString()}</td>
                  <td data-label="PURPOSE">${l.purpose}</td>
                  <td data-label="STATUS"><span class="status-badge ${l.status}">${l.status.toUpperCase()}</span></td>
                  <td data-label="ACTIONS">
                     <div style="display:flex; gap:0.5rem; flex-wrap:wrap; min-width: 120px;">
                        ${l.status === 'pending' ? `
                           <button class="btn btn-primary" style="padding:0.3rem 0.6rem; font-size:0.65rem;" onclick="window.handleApproveLoan('${l.id}')">APPROVE</button>
                           <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.65rem;" onclick="window.handleRejectLoan('${l.id}')">REJECT</button>
                        ` : '--'}
                     </div>
                  </td>
               </tr>
            `;
         }).join('');
      });

    }

   if (path === '/login') {
      document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         sessionStorage.removeItem('otp_verified_user');
         sessionStorage.removeItem('otp_sent');
         
         const btn = document.getElementById('submitBtn');
         const err = document.getElementById('errorMessage');
         btn.disabled = true;
         const res = await loginUser(document.getElementById('email').value, document.getElementById('password').value);
         if (res.error) { 
            let msg = res.error;
            if (msg.includes("network-request-failed")) {
               msg = "Network Error: Please turn off any VPN/Adblockers, or try using Cellular Data instead of Wi-Fi.";
            }
            err.textContent = msg; 
            err.style.display = 'block'; 
            btn.disabled = false; 
         }
      });

      document.getElementById('googleLoginBtn')?.addEventListener('click', async () => {
         sessionStorage.removeItem('otp_verified_user');
         sessionStorage.removeItem('otp_sent');
         const btn = document.getElementById('googleLoginBtn');
         const err = document.getElementById('errorMessage');
         btn.disabled = true;
         const res = await loginWithGoogle();
         if (res.error) {
            err.textContent = res.error;
            err.style.display = 'block';
            btn.disabled = false;
         } else {
            const profile = await getUserProfile(res.user.uid);
            if (!profile?.data) {
                const name = res.user.displayName || "Google User";
                const email = res.user.email;
                await createUserProfile(res.user.uid, email, name);
            }
         }
      });

      document.getElementById('otpForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const code = document.getElementById('otpInput').value;
         const btn = document.getElementById('verifyOtpBtn');
         const err = document.getElementById('otpErrorMessage');
         btn.disabled = true;
         
         const res = await verifyUserOTP(currentUser.uid, code);
         if (res.error) {
            err.textContent = res.error;
            err.style.display = 'block';
            btn.disabled = false;
         } else {
            sessionStorage.setItem('otp_verified_user', currentUser.uid);
            await incrementUserRewards(currentUser.uid);
            const profile = await getUserProfile(currentUser.uid);
            navigateTo(profile?.data?.role === 'admin' ? '/admin' : '/dashboard');
         }
      });

      document.getElementById('resendOtpBtn')?.addEventListener('click', async (e) => {
         e.preventDefault();
         const res = await sendLoginOtp(currentUser.uid, currentUser.email);
         if (!res.error) {
            showNotification("Verification code resent successfully.", "success");
         }
      });
   }

   if (path === '/register') {
      document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         sessionStorage.removeItem('otp_verified_user');
         sessionStorage.removeItem('otp_sent');

         const btn = document.getElementById('submitBtn');
         const err = document.getElementById('errorMessage');
         const name = document.getElementById('fullName').value;
         const email = document.getElementById('email').value;
         const pass = document.getElementById('password').value;
         const confirm = document.getElementById('confirmPassword').value;

         if (pass !== confirm) { err.textContent = "Passwords do not match"; err.style.display = 'block'; return; }

         btn.disabled = true;
         const res = await registerUser(email, pass);
         if (res.error) { err.textContent = res.error; err.style.display = 'block'; btn.disabled = false; }
         else {
            await createUserProfile(res.user.uid, email, name);
         }
      });

      document.getElementById('googleRegisterBtn')?.addEventListener('click', async () => {
         sessionStorage.removeItem('otp_verified_user');
         sessionStorage.removeItem('otp_sent');
         const btn = document.getElementById('googleRegisterBtn');
         const err = document.getElementById('errorMessage');
         btn.disabled = true;
         const res = await loginWithGoogle();
         if (res.error) {
            err.textContent = res.error;
            err.style.display = 'block';
            btn.disabled = false;
         } else {
            const profile = await getUserProfile(res.user.uid);
            if (!profile?.data) {
                const name = res.user.displayName || "Google User";
                const email = res.user.email;
                await createUserProfile(res.user.uid, email, name);
            }
         }
      });
   }

   if (path === '/') {
      // --- Phase 2: Dynamic Cursor follow glow ---
      const glowBlob = document.getElementById('interactiveCursorGlow');
      if (glowBlob) {
         let hasFadedIn = false;
         const trackGlow = (e) => {
            if (!hasFadedIn) {
               glowBlob.style.opacity = '1';
               hasFadedIn = true;
            }
            glowBlob.style.left = `${e.clientX}px`;
            glowBlob.style.top = `${e.clientY}px`;
         };
         window.addEventListener('mousemove', trackGlow);
         
         // Keep listener reference to cleanup if route changes
         window.activeGlowListener = trackGlow;
      }

      // --- Phase 2: Scroll Reveal Intersection Observer ---
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if (revealElements.length > 0) {
         if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
               entries.forEach(entry => {
                  if (entry.isIntersecting) {
                     entry.target.classList.add('revealed');
                     obs.unobserve(entry.target);
                  }
               });
            }, {
               threshold: 0.08,
               rootMargin: '0px 0px -40px 0px'
            });
            revealElements.forEach(el => observer.observe(el));
         } else {
            revealElements.forEach(el => el.classList.add('revealed'));
         }
      }

      // --- Phase 2: 3D Feature Cards Tilt ---
      document.querySelectorAll('.interactive-feature-card').forEach(card => {
         const inner = card.querySelector('.interactive-feature-card-inner');
         if (inner) {
            card.addEventListener('mousemove', (e) => {
               const rect = card.getBoundingClientRect();
               const x = e.clientX - rect.left;
               const y = e.clientY - rect.top;
               const w = rect.width;
               const h = rect.height;
               
               const rY = ((x - w / 2) / (w / 2)) * 8; // Max 8 degrees
               const rX = -((y - h / 2) / (h / 2)) * 8;
               
               inner.style.transform = `rotateY(${rY}deg) rotateX(${rX}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
               inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
            });
         }
      });

      // --- Wealth Simulator Elements ---
      const initialSlider = document.getElementById('initialSlider');
      const monthlySlider = document.getElementById('monthlySlider');
      const yearsSlider = document.getElementById('yearsSlider');
      
      const initialValue = document.getElementById('initialValue');
      const monthlyValue = document.getElementById('monthlyValue');
      const yearsValue = document.getElementById('yearsValue');
      
      const simTotalBalance = document.getElementById('simTotalBalance');
      const simPrincipalVal = document.getElementById('simPrincipalVal');
      const simInterestVal = document.getElementById('simInterestVal');
      
      const simBarPrincipal = document.getElementById('simBarPrincipal');
      const simBarInterest = document.getElementById('simBarInterest');
      
      // Tracking state for counting values
      let currentValTotal = 10000;
      let currentValPrincipal = 10000;
      let currentValInterest = 0;
      
      const animateValue = (element, start, end, duration, prefix = '', isFloat = false) => {
         if (!element) return;
         if (start === end) {
            element.textContent = prefix + Math.round(end).toLocaleString('en-US', isFloat ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {});
            return;
         }
         
         const startTime = performance.now();
         const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeProgress = progress * (2 - progress); // Ease Out Quad
            const current = start + easeProgress * (end - start);
            
            element.textContent = prefix + Math.round(current).toLocaleString('en-US', isFloat ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {});
            
            if (progress < 1) {
               window.requestAnimationFrame(step);
            }
         };
         window.requestAnimationFrame(step);
      };
      
      const calculateWealth = (animate = true) => {
         if (!initialSlider || !monthlySlider || !yearsSlider) return;
         
         const P = parseFloat(initialSlider.value);
         const PMT = parseFloat(monthlySlider.value);
         const t = parseInt(yearsSlider.value);
         
         const selectedPlan = document.querySelector('.plan-card-option.selected');
         const rate = parseFloat(selectedPlan ? selectedPlan.dataset.rate : 4.5) / 100;
         
         const n = 12;
         const totalMonths = n * t;
         const monthlyRate = rate / n;
         
         let total = 0;
         let principal = P + (PMT * totalMonths);
         
         if (monthlyRate === 0) {
            total = principal;
         } else {
            const fvInitial = P * Math.pow(1 + monthlyRate, totalMonths);
            const fvContributions = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
            total = fvInitial + fvContributions;
         }
         
         const interest = Math.max(0, total - principal);
         
         if (animate) {
            animateValue(simTotalBalance, currentValTotal, total, 350, '$', true);
            animateValue(simPrincipalVal, currentValPrincipal, principal, 350, '$', false);
            animateValue(simInterestVal, currentValInterest, interest, 350, '$', false);
         } else {
            if (simTotalBalance) simTotalBalance.textContent = '$' + Math.round(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            if (simPrincipalVal) simPrincipalVal.textContent = '$' + Math.round(principal).toLocaleString('en-US');
            if (simInterestVal) simInterestVal.textContent = '$' + Math.round(interest).toLocaleString('en-US');
         }
         
         // Update trackers
         currentValTotal = total;
         currentValPrincipal = principal;
         currentValInterest = interest;
         
         const principalRatio = (principal / total) * 100;
         const interestRatio = 100 - principalRatio;
         
         if (simBarPrincipal) simBarPrincipal.style.width = `${principalRatio}%`;
         if (simBarInterest) simBarInterest.style.width = `${interestRatio}%`;
      };
      
      if (initialSlider) {
         initialSlider.addEventListener('input', () => {
            if (initialValue) initialValue.textContent = '$' + parseInt(initialSlider.value).toLocaleString('en-US');
            calculateWealth();
         });
      }
      
      if (monthlySlider) {
         monthlySlider.addEventListener('input', () => {
            if (monthlyValue) monthlyValue.textContent = '$' + parseInt(monthlySlider.value).toLocaleString('en-US');
            calculateWealth();
         });
      }
      
      if (yearsSlider) {
         yearsSlider.addEventListener('input', () => {
            if (yearsValue) yearsValue.textContent = yearsSlider.value + (yearsSlider.value === '1' ? ' Year' : ' Years');
            calculateWealth();
         });
      }
      
      document.querySelectorAll('.plan-card-option').forEach(card => {
         card.addEventListener('click', () => {
            document.querySelectorAll('.plan-card-option').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            calculateWealth();
         });
      });
      
      // Initialize Simulator without count animation on load
      calculateWealth(false);
      
      // --- Card Customizer Logic ---
      const customizerNameInput = document.getElementById('customizerNameInput');
      const cardNameDisplay = document.getElementById('cardNameDisplay');
      const previewCard = document.getElementById('previewCard');
      const cardGlare = document.getElementById('cardGlare');
      
      if (customizerNameInput && cardNameDisplay) {
         customizerNameInput.addEventListener('input', (e) => {
            let val = e.target.value.trim().toUpperCase();
            if (!val) val = "YOUR NAME";
            cardNameDisplay.textContent = val;
         });
      }
      
      if (previewCard) {
         previewCard.addEventListener('mousemove', (e) => {
            const rect = previewCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const width = rect.width;
            const height = rect.height;
            
            const rotateY = ((x - width / 2) / (width / 2)) * 12;
            const rotateX = -((y - height / 2) / (height / 2)) * 12;
            
            previewCard.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
            
            if (cardGlare) {
               const percentX = (x / width) * 100;
               const percentY = (y / height) * 100;
               cardGlare.style.backgroundPosition = `${percentX}% ${percentY}%`;
            }
         });
         
         previewCard.addEventListener('mouseleave', () => {
            previewCard.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
            if (cardGlare) {
               cardGlare.style.backgroundPosition = '0% 0%';
            }
         });
      }
      
      document.querySelectorAll('.style-selector-btn').forEach(btn => {
         btn.addEventListener('click', () => {
            document.querySelectorAll('.style-selector-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.dataset.theme;
            if (previewCard) {
               previewCard.className = `custom-card card-theme-${theme}`;
            }
         });
      });
      
      // --- Live Exchange Rates Ticker Logic ---
      const ratesData = {
         eurusd: { val: 1.0842, precision: 4 },
         gbpusd: { val: 1.2678, precision: 4 },
         jpyusd: { val: 151.42, precision: 2 },
         btcusd: { val: 67420.50, precision: 2 },
         ethusd: { val: 3542.80, precision: 2 },
         xauusd: { val: 2178.45, precision: 2 }
      };
      
      if (window.ratesInterval) {
         clearInterval(window.ratesInterval);
      }
      
      window.ratesInterval = setInterval(() => {
         const keys = Object.keys(ratesData);
         const randomKey = keys[Math.floor(Math.random() * keys.length)];
         const pair = ratesData[randomKey];
         
         const maxDev = (randomKey === 'btcusd' || randomKey === 'ethusd') ? 0.002 : 0.0005;
         const changePct = (Math.random() * 2 - 1) * maxDev;
         const delta = pair.val * changePct;
         pair.val += delta;
         
         const direction = changePct >= 0 ? 'up' : 'down';
         const formattedVal = pair.val.toLocaleString('en-US', { minimumFractionDigits: pair.precision, maximumFractionDigits: pair.precision });
         
         const valEl = document.getElementById(`val-${randomKey}`);
         const chgEl = document.getElementById(`chg-${randomKey}`);
         const cardEl = document.getElementById(`rate-${randomKey}`);
         
         if (valEl && chgEl && cardEl) {
            valEl.textContent = formattedVal;
            
            const absPct = (Math.abs(changePct) * 100).toFixed(2);
            const sign = direction === 'up' ? '+' : '-';
            const chevron = direction === 'up' 
               ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>`
               : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            
            chgEl.className = `rate-change ${direction}`;
            chgEl.innerHTML = `${chevron} <span>${sign}${absPct}%</span>`;
            
            const pulseClass = direction === 'up' ? 'rate-pulse-up' : 'rate-pulse-down';
            cardEl.classList.remove('rate-pulse-up', 'rate-pulse-down');
            void cardEl.offsetWidth; // Force Reflow
            cardEl.classList.add(pulseClass);
         }
      }, 3000);
      
      // --- Testimonials Carousel ---
      const dots = document.querySelectorAll('.carousel-dot');
      const slides = document.querySelectorAll('.testimonial-slide');
      let currentTestimonialIndex = 0;
      
      dots.forEach((dot, index) => {
         dot.addEventListener('click', () => {
            if (window.testimonialInterval) {
               clearInterval(window.testimonialInterval);
               window.testimonialInterval = null;
            }
            dots.forEach(d => d.classList.remove('active'));
            slides.forEach(s => s.classList.remove('active'));
            
            dot.classList.add('active');
            const targetSlide = document.querySelector(`.testimonial-slide[data-index="${index}"]`);
            if (targetSlide) targetSlide.classList.add('active');
            currentTestimonialIndex = index;
         });
      });
      
      if (window.testimonialInterval) {
         clearInterval(window.testimonialInterval);
      }
      
      if (slides.length > 0) {
         window.testimonialInterval = setInterval(() => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % slides.length;
            const targetDot = document.querySelector(`.carousel-dot[data-index="${currentTestimonialIndex}"]`);
            if (targetDot) {
               dots.forEach(d => d.classList.remove('active'));
               slides.forEach(s => s.classList.remove('active'));
               targetDot.classList.add('active');
               const targetSlide = document.querySelector(`.testimonial-slide[data-index="${currentTestimonialIndex}"]`);
               if (targetSlide) targetSlide.classList.add('active');
            }
         }, 7000);
      }
      
      // --- FAQs Accordion ---
      document.querySelectorAll('.faq-trigger').forEach(trigger => {
         trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const content = item.querySelector('.faq-content');
            const isOpen = item.classList.contains('open');
            
            document.querySelectorAll('.faq-item').forEach(otherItem => {
               if (otherItem !== item) {
                  otherItem.classList.remove('open');
                  const otherContent = otherItem.querySelector('.faq-content');
                  if (otherContent) otherContent.style.maxHeight = '0';
               }
            });
            
            if (isOpen) {
               item.classList.remove('open');
               if (content) content.style.maxHeight = '0';
            } else {
               item.classList.add('open');
               if (content) content.style.maxHeight = content.scrollHeight + 'px';
            }
         });
      });
   }
};

// Popstate
window.addEventListener("popstate", router);

// Auth Observer
subscribeToAuthChanges(async (user) => {
   currentUser = user;
   resetInactivityTimer(); // Start/Reset timer on auth change

   if (profileUnsubscribe) profileUnsubscribe();
   if (txUnsubscribe) txUnsubscribe();
   if (globalProfileUnsub) globalProfileUnsub();

   if (user) {
      if (sessionStorage.getItem('otp_verified_user') !== user.uid && !sessionStorage.getItem('otp_sent')) {
         sendLoginOtp(user.uid, user.email);
      }
      router(); // Render loading state immediately
      globalProfileUnsub = subscribeToProfile(user.uid, (profile) => {
         if (profile.role === 'admin') {
            sessionStorage.setItem('otp_verified_user', user.uid);
         }
         if (profile.status === 'suspended') {
            logoutUser();
            
            if (window.showAlertModal) {
               window.showAlertModal("Access Denied", "Your account has been suspended. Please contact support.");
            } else {
               showNotification("Your account has been suspended.", "error");
            }

            if (location.pathname !== '/login') {
               navigateTo('/login');
            }

            // Re-enable the login button if it was disabled during the login attempt
            const loginBtn = document.getElementById('submitBtn');
            if (loginBtn) loginBtn.disabled = false;

            globalProfileData = null;
            return;
         }

         globalProfileData = profile;
         window.currentUserProfile = profile;

         // Statement Data Sync
         if (window.userTransactions) {
            populateStatement(profile, window.userTransactions);
         }

         router();
      });
   } else {
      if (adminUsersUnsub) adminUsersUnsub();
      if (adminTxsUnsub) adminTxsUnsub();
      globalProfileData = null;
      router();
   }
});

// Preloader is now managed securely inside the router() function to prevent blank screens.

// Failsafe: If Firebase Auth hangs or is blocked by an extension, force the router to run after 3 seconds
setTimeout(() => {
   const preloader = document.getElementById('preloader');
   if (preloader && preloader.style.visibility !== 'hidden') {
      console.warn("Firebase Auth timeout. Forcing router initialization.");
      router();
   }
}, 3000);
