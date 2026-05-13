import { subscribeToAuthChanges, registerUser, loginUser, logoutUser, adminCreateUser, changeUserPassword } from './services/auth.js';
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

const sendEmail = async (templateId, params) => {
   try {
      emailjs.init("2cMSe5uwOFplxXRys");
      await emailjs.send("service_26i6l5c", templateId, params);
      return { success: true };
   } catch (e) {
      console.error("Email Error:", e);
      return { error: e.text || e.message || "Network Error" };
   }
};

const openModal = (id) => {
   const el = document.getElementById(id);
   const backdrop = document.getElementById('modalBackdrop');
   if (el) el.style.display = 'flex';
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
   document.getElementById('receiptAmount').textContent = `$${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
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
   document.getElementById('stBalance').textContent = `$${parseFloat(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
   document.getElementById('stPeriod').textContent = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

   const body = document.getElementById('stBody');
   body.innerHTML = transactions.map(tx => `
      <tr>
         <td style="padding:10px; border-bottom:1px solid #eee;">${tx.timestamp?.toDate().toLocaleDateString()}</td>
         <td style="padding:10px; border-bottom:1px solid #eee;">${tx.description}</td>
         <td style="padding:10px; border-bottom:1px solid #eee; text-align:right; font-weight:700;">${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}</td>
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

   if ((match.route.auth === 'authenticated' || match.route.auth === 'admin') && !currentUser) return navigateTo('/login');

   if (currentUser) {
      if (!globalProfileData) {
         document.querySelector("#app").innerHTML = `<div style="display:flex; justify-content:center; align-items:center; min-height:80vh; color:var(--primary); font-weight:600; letter-spacing:2px;">SECURE CONNECTION ESTABLISHED...</div>`;
         return;
      }
   }
   if (match.route.auth === 'unauthenticated' && currentUser) return navigateTo('/dashboard');
   if (match.route.auth === 'admin' && (!globalProfileData || globalProfileData.role !== 'admin')) return navigateTo('/dashboard');

   document.querySelector("#app").innerHTML = match.route.view(currentUser);
   attachEventListeners(match.route.path);

   // Safely remove preloader only after the view is fully rendered
   const preloader = document.getElementById('preloader');
   if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => preloader.remove(), 500);
   }
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
         if (container) container.innerHTML = `<div class="alert alert-danger">Account Restricted. Please contact support.</div>`;
         document.getElementById('tab-transfer').style.display = 'none';
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

      // Subscriptions
      profileUnsubscribe = subscribeToProfile(currentUser.uid, (data) => {
         document.querySelectorAll('.sync-balance').forEach(el => el.textContent = parseFloat(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));
         populateProfileView(data);
         renderMastercard(data);
      });

      txUnsubscribe = subscribeToTransactions(currentUser.uid, (txs) => {
         window.userTransactions = txs;
         const render = (arr, id) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = arr.length === 0 ? '<div class="text-muted">No transactions.</div>' : arr.map(tx => `
               <div class="transaction-item" style="display:flex; justify-content:space-between; padding: 1rem 0; border-bottom: 1px solid var(--border-light);">
                  <div><div>${tx.description}</div><div class="text-muted" style="font-size:0.8rem;">${tx.timestamp?.toDate().toLocaleDateString()}</div></div>
                  <div style="font-weight:700; color:${tx.amount < 0 ? 'var(--danger)' : 'var(--success)'};">${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}</div>
               </div>
            `).join('');
         };
         render(txs.slice(0, 5), 'transactionsList');
         render(txs, 'fullTransactionsList');
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
         await sendEmail("template_2h8yapk", {
            to_email: currentUser.email,
            to_name: user.fullName,
            passcode: otpRes.code,
            time: expiryTime,
            amount: amount.toFixed(2),
            currency: document.getElementById('transferCurrency').value
         });

         openModal('transferOtpModal');
         btn.disabled = false;
         window.pendingTransfer = { uid: currentUser.uid, amount, account, type, description: type === 'external' ? `External Transfer to ${bank}` : `Internal Transfer to Nova Acc: ${account}` };
      });

      document.getElementById('transferOtpForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const res = await verifyTransactionOTP(window.pendingTransfer.uid, document.getElementById('transferOtpInput').value);
         if (res.error) showNotification(res.error, "error");
         else {
            const txRes = await createTransaction(window.pendingTransfer.uid, window.pendingTransfer.amount, window.pendingTransfer.account, window.pendingTransfer.description, window.pendingTransfer.type);
            if (txRes.error) showNotification(txRes.error, "error");
            else {
               showNotification("Transfer Successful!", "success");
               setTimeout(() => window.location.reload(), 2000);
            }
         }
      });

      // Quick Action Buttons
      document.getElementById('quickTransferBtn')?.addEventListener('click', () => {
         document.querySelector('[data-tab="tab-transfer"]').click();
      });
      document.getElementById('quickLoanBtn')?.addEventListener('click', () => {
         document.querySelector('[data-tab="tab-loans"]').click();
      });

      // Other listeners
      document.getElementById('logoutBtn')?.addEventListener('click', () => logoutUser().then(() => window.location.reload()));
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
      document.getElementById('adminLogoutBtn')?.addEventListener('click', () => logoutUser().then(() => window.location.reload()));

      // Forms
      document.getElementById('createUserForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const btn = document.getElementById('confirmCreateBtn');
         const msg = document.getElementById('createUserMsg');
         btn.disabled = true;

         const email = document.getElementById('createEmail').value;
         const pass = document.getElementById('createPassword').value;
         const name = document.getElementById('createFullName').value;
         const balance = parseFloat(document.getElementById('createBalance').value) || 0;

         const res = await adminCreateUser(email, pass, name);
         if (res.error) {
            msg.textContent = res.error;
            msg.style.display = 'block';
            msg.style.color = 'var(--danger)';
         } else {
            await adminUpdateBalance(res.uid, balance, 'credit', 'Opening Balance');
            showNotification("Customer account created successfully!", "success");
            closeModals();
            e.target.reset();
         }
         btn.disabled = false;
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

         const res = await adminUpdateBalance(uid, amount, type, desc);
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
               <td data-label="BALANCE" style="font-weight:700;">$${parseFloat(u.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
                  <td data-label="AMOUNT" style="font-weight:700; color:${tx.amount < 0 ? 'var(--danger)' : 'var(--success)'};">${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}</td>
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
         const btn = document.getElementById('submitBtn');
         const err = document.getElementById('errorMessage');
         btn.disabled = true;
         const res = await loginUser(document.getElementById('email').value, document.getElementById('password').value);
         if (res.error) { err.textContent = res.error; err.style.display = 'block'; btn.disabled = false; }
         else {
            await incrementUserRewards(res.user.uid);
            navigateTo('/dashboard');
         }
      });
   }

   if (path === '/register') {
      document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
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
            const profileRes = await createUserProfile(res.user.uid, email, name);
            // Send Welcome Email
            await sendEmail("template_f2e9dta", {
               to_email: email,
               to_name: name,
               account_number: profileRes.accountNumber || "Generating..."
            });
            navigateTo('/dashboard');
         }
      });
   }
};

// Popstate
window.addEventListener("popstate", router);

// Auth Observer
subscribeToAuthChanges(async (user) => {
   currentUser = user;
   if (profileUnsubscribe) profileUnsubscribe();
   if (txUnsubscribe) txUnsubscribe();
   if (globalProfileUnsub) globalProfileUnsub();

   if (user) {
      router(); // Render loading state immediately
      globalProfileUnsub = subscribeToProfile(user.uid, (profile) => {
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
