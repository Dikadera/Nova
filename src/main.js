import './style.css';
import { subscribeToAuthChanges, registerUser, loginUser, logoutUser, adminCreateUser, changeUserPassword } from './services/auth.js';
import {
   createUserProfile, getUserProfile, subscribeToProfile,
   createTransaction, subscribeToTransactions,
   subscribeToAllUsers, subscribeToAllTransactions,
   deleteUserProfile, adminUpdateBalance, updateTransactionStatus,
   adminUpdateUserProfile, updateUserProfile
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

// Router
const navigateTo = (url) => {
   history.pushState(null, null, url);
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

   const potentialMatches = routes.map(route => {
      return {
         route: route,
         isMatch: location.pathname === route.path
      };
   });

   let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

   if (!match) {
      match = { route: routes[0], isMatch: true };
   }

   // Global Profile Fetch for Route Guards
   let userProfile = null;
   if (currentUser) {
      const profileRes = await getUserProfile(currentUser.uid);
      userProfile = profileRes.data;
   }

   // Route Protection logic
   if (match.route.auth === 'authenticated' && !currentUser) {
      return navigateTo('/login');
   }

   // Custom 6-Digit OTP Block
   if (match.route.auth === 'authenticated' && userProfile) {
      if (!userProfile.isEmailVerified) {
         const app = document.querySelector("#app");
         app.innerHTML = `
          <div class="container animate-fade-in" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 80vh; text-align: center;">
             <div class="glass-panel" style="padding: 3rem; max-width: 500px; width: 100%;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin-bottom: 1.5rem;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h2 style="color: var(--primary); margin-bottom: 1rem;">Enter Verification Code</h2>
                <p class="text-muted" style="margin-bottom: 2rem; line-height: 1.6;">
                   We've sent a secure 6-digit code to <strong>${currentUser.email}</strong>.<br>
                   Please enter it below to activate your dashboard.
                </p>
                <form id="otpVerificationForm">
                  <div class="form-group" style="text-align: left;">
                     <input type="text" id="otpInput" class="form-control" style="font-size: 2rem; text-align: center; letter-spacing: 10px; font-weight: 600;" placeholder="000000" maxlength="6" required autocomplete="off">
                  </div>
                  <div id="otpMsg" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
                  <button type="submit" class="btn btn-primary" id="verifyOtpBtn" style="width: 100%; margin-bottom: 1rem;">Verify Code</button>
                </form>
                <button class="btn btn-secondary" id="verificationLogoutBtn" style="width: 100%;">Sign Out</button>
             </div>
          </div>
        `;
         setTimeout(() => {
            document.getElementById('verificationLogoutBtn')?.addEventListener('click', () => {
               import('./services/auth.js').then(module => {
                  module.logoutUser().then(() => window.location.reload());
               });
            });
            document.getElementById('otpVerificationForm')?.addEventListener('submit', async (e) => {
               e.preventDefault();
               const btn = document.getElementById('verifyOtpBtn');
               const msg = document.getElementById('otpMsg');
               const code = document.getElementById('otpInput').value;
               btn.disabled = true;
               msg.style.display = 'none';

               const { verifyUserOTP } = await import('./services/db.js');
               const res = await verifyUserOTP(currentUser.uid, code);
               if (res.error) {
                  msg.textContent = res.error;
                  msg.className = 'text-danger';
                  msg.style.display = 'block';
                  btn.disabled = false;
               } else {
                  msg.textContent = 'Verification successful! Loading dashboard...';
                  msg.className = 'text-success';
                  msg.style.display = 'block';
                  setTimeout(() => { window.location.reload(); }, 1000);
               }
            });
         }, 100);
         return; // Halt routing
      }
   }

   if (match.route.auth === 'unauthenticated' && currentUser) {
      return navigateTo('/dashboard');
   }
   if (match.route.auth === 'admin') {
      if (!currentUser) return navigateTo('/login');
      if (!userProfile || userProfile.role !== 'admin') {
         alert("Access Denied: You must be a verified Master Admin to view this page. You are currently logged in as a " + (userProfile ? userProfile.role : "unknown") + ".");
         return navigateTo('/dashboard');
      }
   }

   const app = document.querySelector("#app");
   app.innerHTML = match.route.view();

   // Attach event listeners after rendering
   attachEventListeners(match.route.path);
};

// Event Binding
const attachEventListeners = async (path) => {
   // Global link interception
   document.querySelectorAll('[data-link]').forEach(link => {
      link.addEventListener("click", e => {
         e.preventDefault();
         navigateTo(e.target.href || e.target.closest('a').href);
      });
   });

   // Login Form
   if (path === '/login') {
      const form = document.getElementById('loginForm');
      const btn = document.getElementById('submitBtn');
      const err = document.getElementById('errorMessage');

      form.addEventListener('submit', async (e) => {
         e.preventDefault();
         btn.disabled = true;
         btn.textContent = 'Signing in...';
         err.style.display = 'none';

         const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;

         const res = await loginUser(email, password);
         if (res.error) {
            err.textContent = res.error;
            err.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Sign In';
         }
      });
   }

   // Register Form
   if (path === '/register') {
      const form = document.getElementById('registerForm');
      const btn = document.getElementById('submitBtn');
      const err = document.getElementById('errorMessage');

      form.addEventListener('submit', async (e) => {
         e.preventDefault();
         btn.disabled = true;
         btn.textContent = 'Creating account...';
         err.style.display = 'none';

         const fullName = document.getElementById('fullName').value;
         const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;
         const confirmPassword = document.getElementById('confirmPassword').value;

         if (password !== confirmPassword) {
            err.textContent = 'Passwords do not match';
            err.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Create Account';
            return;
         }

         const res = await registerUser(email, password);
         if (res.error) {
            err.textContent = res.error;
            err.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Create Account';
         } else {
            // Create user profile in Firestore
            const profileRes = await createUserProfile(res.user.uid, email, fullName);

            if (profileRes.verificationCode) {
               // Send EmailJS
               try {
                  emailjs.init("2cMSe5uwOFplxXRys");
                  await emailjs.send("service_26i6l5c", "template_f2e9dta", {
                     to_email: email,
                     to_name: fullName,
                     otp_code: profileRes.verificationCode,
                     reply_to: "admin@novabank.com"
                  });
               } catch (e) {
                  console.error("EmailJS failed:", e);
                  alert("EmailJS Error: " + (e.text || e.message || JSON.stringify(e)) + "\n\nPlease make sure your EmailJS Template is configured correctly.");
               }
            }
         }
      });
   }

   // Dashboard
   if (path === '/dashboard') {
      const logoutBtn = document.getElementById('logoutBtn');
      logoutBtn.addEventListener('click', () => logoutUser());

      // Load profile
      const profileRes = await getUserProfile(currentUser.uid);
      if (profileRes.data) {
         const user = profileRes.data;
         
         // Render Avatar
         const renderAvatar = (userData, containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            if (userData.profilePicture) {
               container.innerHTML = `<img src="${userData.profilePicture}" class="profile-avatar" alt="Profile">`;
            } else {
               const initials = userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
               container.innerHTML = `<div class="profile-avatar-placeholder">${initials}</div>`;
            }
         };

         renderAvatar(user, 'navAvatarContainer');
         renderAvatar(user, 'modalAvatarContainer');

         document.getElementById('userGreeting').textContent = `Hello, ${user.fullName.split(' ')[0]}`;
         const topbarAcc = document.getElementById('topbarAccountNum');
         if (topbarAcc) topbarAcc.textContent = user.accountNumber;

         // Render Mastercard
         const mcContainer = document.getElementById('mastercardContainer');
         if (mcContainer) {
            const maskedNum = user.accountNumber ? `${user.accountNumber.slice(0, 4)} xxxx xxxx xxxx` : 'xxxx xxxx xxxx xxxx';
            mcContainer.innerHTML = `
               <div class="mastercard animate-fade-in delay-100" style="position: relative;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 10;">
                     <div style="font-weight: 700; font-size: 1.1rem; letter-spacing: 2px; color: rgba(255,255,255,0.9);">NOVA BANK</div>
                     <div style="text-align: right;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
                        <div style="font-size: 0.5rem; opacity: 0.5; margin-top: 2px; letter-spacing: 1px;">WIRELESS PAY</div>
                     </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0; z-index: 10;">
                     <div class="card-chip"></div>
                     <div style="font-size: 0.6rem; opacity: 0.4; letter-spacing: 1px; font-weight: 700;">PLATINUM VIRTUAL</div>
                  </div>

                  <div class="card-number" style="margin: 0.5rem 0; font-size: 1.5rem; letter-spacing: 4px; z-index: 10; font-family: 'Courier New', monospace;">${maskedNum}</div>
                  
                  <div style="display: flex; gap: 2rem; margin-bottom: 1rem; z-index: 10; font-size: 0.6rem; color: rgba(255,255,255,0.6);">
                     <div>
                        <div style="opacity: 0.5; margin-bottom: 0.1rem;">VALID FROM</div>
                        <div>XX/XX</div>
                     </div>
                     <div>
                        <div style="opacity: 0.5; margin-bottom: 0.1rem;">VALID THRU</div>
                        <div>XX/XX</div>
                     </div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: flex-end; z-index: 10;">
                     <div class="card-holder">
                        <div class="card-holder-name" style="font-size: 1rem; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 400;">${user.fullName}</div>
                     </div>
                     <div class="card-brand" style="position: relative; bottom: 0; right: 0;">
                        <div class="mc-circle mc-red" style="width: 30px; height: 30px;"></div>
                        <div class="mc-circle mc-yellow" style="width: 30px; height: 30px; margin-left: -12px;"></div>
                     </div>
                  </div>
               </div>
               <div style="margin-top: 1rem; text-align: center;">
                  <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.4rem 1rem; border-style: dashed; width: 100%;" id="applyPhysicalBtn">Apply for Physical Card</button>
               </div>
            `;
         }

         // Tab Switching Logic
         const sidebarItems = document.querySelectorAll('#userSidebar .menu-item');
         const tabContents = document.querySelectorAll('.tab-content');
         const tabTitle = document.getElementById('currentTabTitle');

         sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
               const tabId = item.dataset.tab;
               
               // Update Sidebar UI
               sidebarItems.forEach(i => i.classList.remove('active'));
               item.classList.add('active');

               // Update Content UI
               tabContents.forEach(content => {
                  content.classList.remove('active');
                  if (content.id === tabId) {
                     content.classList.add('active');
                     tabTitle.textContent = item.textContent.trim();
                  }
               });

               // Mobile sidebar auto-close
               const sidebar = document.getElementById('userSidebar');
               if (window.innerWidth <= 768) {
                  sidebar.classList.remove('open');
               }
            });
         });

         // Mobile Sidebar Toggle
         const openSidebarBtn = document.getElementById('openUserSidebarBtn');
         const closeSidebarBtn = document.getElementById('closeUserSidebarBtn');
         const sidebar = document.getElementById('userSidebar');

         if (openSidebarBtn) openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
         if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

         // Quick Action buttons
         const quickTransferBtn = document.getElementById('quickTransferBtn');
         const quickLoanBtn = document.getElementById('quickLoanBtn');
         const dashboardViewAllTxBtn = document.getElementById('dashboardViewAllTxBtn');

         if (quickTransferBtn) quickTransferBtn.addEventListener('click', () => document.querySelector('[data-tab="tab-transfer"]').click());
         if (quickLoanBtn) quickLoanBtn.addEventListener('click', () => document.querySelector('[data-tab="tab-loans"]').click());
         if (dashboardViewAllTxBtn) dashboardViewAllTxBtn.addEventListener('click', () => document.querySelector('[data-tab="tab-statement"]').click());

         // Populate Profile View
         const populateProfileView = (userData) => {
            document.getElementById('profileViewName').textContent = userData.fullName;
            document.getElementById('profileViewEmail').textContent = userData.email;
            document.getElementById('profileViewAccountNum').textContent = userData.accountNumber;
            document.getElementById('profileViewStatus').textContent = userData.status;
            document.getElementById('profileViewPhone').textContent = userData.phone || 'Not provided';
            document.getElementById('profileViewDob').textContent = userData.dob || 'Not provided';
            document.getElementById('profileViewAddress').textContent = `${userData.address || ''}, ${userData.city || ''}, ${userData.state || ''} ${userData.zip || ''}`.trim() || 'Not provided';
            renderAvatar(userData, 'profileViewAvatar');
         };
         populateProfileView(user);

         // Trigger Edit Profile from Profile Tab
         const triggerEditBtn = document.getElementById('triggerEditProfile');
         if (triggerEditBtn) {
            triggerEditBtn.addEventListener('click', () => {
               document.getElementById('openCompleteProfileBtn').click();
            });
         }

         // Admin redirect
         if (profileRes.data.role === 'admin') {
            navigateTo('/admin');
            return;
         }

         // Check for incomplete profile


         // Check for Restriction
         const restrictionContainer = document.getElementById('restrictionAlertContainer');
         const transferSection = document.getElementById('transferSection');
         if (user.status === 'frozen') {
            if (restrictionContainer) {
               restrictionContainer.innerHTML = `
              <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid var(--danger); padding: 2rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="margin-bottom: 1rem;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                  <h2 style="color: var(--danger); margin-bottom: 0.5rem;">${user.alertSubject || 'Account Restricted'}</h2>
                  <p style="color: var(--text-muted); font-size: 1.1rem; margin: 0;">${user.alertMessage || 'Please contact support for further assistance.'}</p>
              </div>
            `;
            }
            if (transferSection) {
               transferSection.style.display = 'none';
            }
         }

         const isProfileComplete = user.dob && user.phone && user.ssn && user.address && user.city && user.state && user.zip;
         const alertContainer = document.getElementById('profileAlertContainer');

         if (!isProfileComplete && alertContainer) {
            alertContainer.innerHTML = `
            <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid #eab308; padding: 1rem 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #eab308; margin-bottom: 0.25rem;">⚠️ Action Required: Incomplete Profile</h4>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">Please complete your account verification to ensure uninterrupted access.</p>
                </div>
                <button class="btn btn-primary" id="openCompleteProfileBtn" style="background: #eab308; color: #1a1a1a; font-weight: 600; border: none;">Complete Profile</button>
            </div>
         `;

            document.getElementById('openCompleteProfileBtn').addEventListener('click', () => {
               document.getElementById('userEditDob').value = user.dob || '';
               document.getElementById('userEditPhone').value = user.phone || '';
               document.getElementById('userEditSsn').value = user.ssn || '';
               document.getElementById('userEditAddress').value = user.address || '';
               document.getElementById('userEditCity').value = user.city || '';
               document.getElementById('userEditState').value = user.state || '';
               document.getElementById('userEditZip').value = user.zip || '';
               document.getElementById('profilePicBase64').value = user.profilePicture || '';
               renderAvatar(user, 'modalAvatarContainer');
               document.getElementById('userProfileModal').style.display = 'flex';
            });
         }

         // Image Upload Handler
         const picInput = document.getElementById('profilePicInput');
         const picBase64 = document.getElementById('profilePicBase64');
         if (picInput) {
            picInput.addEventListener('change', (e) => {
               const file = e.target.files[0];
               if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                     const base64 = event.target.result;
                     picBase64.value = base64;
                     document.getElementById('modalAvatarContainer').innerHTML = `<img src="${base64}" class="profile-avatar" alt="Preview">`;
                  };
                  reader.readAsDataURL(file);
               }
            });
         }

         // Setup close modal button
         const closeUserModalBtn = document.getElementById('closeUserProfileModal');
         if (closeUserModalBtn) {
            closeUserModalBtn.addEventListener('click', () => {
               document.getElementById('userProfileModal').style.display = 'none';
            });
         }

         // Setup User Profile Save Form
         const userProfileForm = document.getElementById('userProfileForm');
         if (userProfileForm) {
            userProfileForm.addEventListener('submit', async (e) => {
               e.preventDefault();
               const btn = document.getElementById('saveUserProfileBtn');
               const msg = document.getElementById('userProfileMessage');
               btn.disabled = true;
               msg.style.display = 'none';

               const updatedData = {
                  dob: document.getElementById('userEditDob').value,
                  phone: document.getElementById('userEditPhone').value,
                  ssn: document.getElementById('userEditSsn').value,
                  address: document.getElementById('userEditAddress').value,
                  city: document.getElementById('userEditCity').value,
                  state: document.getElementById('userEditState').value,
                  zip: document.getElementById('userEditZip').value,
                  profilePicture: document.getElementById('profilePicBase64').value || user.profilePicture || ""
               };

               const res = await updateUserProfile(currentUser.uid, updatedData);
               if (res.error) {
                  msg.textContent = res.error;
                  msg.className = 'text-danger';
               } else {
                  msg.textContent = 'Profile updated successfully!';
                  msg.className = 'text-success';
                  setTimeout(() => {
                     document.getElementById('userProfileModal').style.display = 'none';
                     if (alertContainer) alertContainer.innerHTML = ''; // Remove banner dynamically
                  }, 1000);
               }
               msg.style.display = 'block';
               btn.disabled = false;
            });
         }
      }

      // Subscribe to balance
      profileUnsubscribe = subscribeToProfile(currentUser.uid, (data) => {
         const bal = parseFloat(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
         document.querySelectorAll('.sync-balance').forEach(el => el.textContent = bal);
         // Sync profile data if it changes
         populateProfileView(data);
      });

      // Subscribe to transactions
      txUnsubscribe = subscribeToTransactions(currentUser.uid, (txs) => {
         const list = document.getElementById('transactionsList');
         const fullList = document.getElementById('fullTransactionsList');
         
         const renderTxList = (txArray, container) => {
            if (!container) return;
            if (txArray.length === 0) {
               container.innerHTML = '<div class="text-muted" style="text-align: center; padding: 2rem;">No recent transactions.</div>';
            } else {
               container.innerHTML = txArray.map(tx => {
                  const isDebit = tx.amount < 0;
                  const absAmount = Math.abs(tx.amount).toFixed(2);
                  const statusLabel = isDebit ? 'DEBIT' : 'CREDIT';
                  const amountColor = isDebit ? 'var(--danger)' : 'var(--success)';
                  const sign = isDebit ? '-' : '+';

                  return `
                <div class="transaction-item" data-txid="${tx.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-light); cursor: pointer; transition: background 0.2s;">
                  <div>
                    <div style="font-weight: 500;">${tx.description || (isDebit ? 'Transfer Out' : 'Inward Transfer')}</div>
                    <div class="text-muted" style="font-size: 0.8rem;">${tx.timestamp?.toDate().toLocaleDateString() || 'Pending...'} • ${statusLabel}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 600; color: ${amountColor};">
                      ${sign}$${absAmount}
                    </div>
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase;">${tx.status || 'completed'}</div>
                  </div>
                </div>
              `;
               }).join('');

               // Add click listeners
               container.querySelectorAll('.transaction-item').forEach(item => {
                  item.addEventListener('click', () => {
                     const txId = item.dataset.txid;
                     const tx = txArray.find(t => t.id === txId);
                     if (tx) openTransactionReceipt(tx);
                  });
               });
            }
         };

         const openTransactionReceipt = (tx) => {
            const receiptModal = document.getElementById('receiptModal');
            const receiptContent = document.getElementById('receiptContent');
            if (!receiptModal || !receiptContent) return;

            const isDebit = tx.amount < 0;
            const statusClass = tx.status === 'completed' ? 'status-successful' : (tx.status === 'pending' ? 'status-pending' : 'status-failed');
            const refId = tx.id.slice(0, 16).toUpperCase();
            const date = tx.timestamp?.toDate().toLocaleString() || 'N/A';

            receiptContent.innerHTML = `
               <div class="receipt-header">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                     <span style="font-weight: 800; font-size: 1.2rem; letter-spacing: 1px;">NOVA BANK</span>
                  </div>
                  <div class="status-badge ${statusClass}">${tx.status || 'Successful'}</div>
                  <div style="font-size: 2.2rem; font-weight: 800; margin-top: 1rem;">${isDebit ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}</div>
                  <div class="text-muted" style="font-size: 0.8rem; margin-top: 0.5rem;">${date}</div>
               </div>
               <div class="receipt-body">
                  <div class="receipt-section-title">Transfer Details</div>
                  <div class="receipt-row"><span class="receipt-label">Reference ID</span><span class="receipt-value" style="font-family: monospace;">${refId}</span></div>
                  <div class="receipt-row"><span class="receipt-label">Transfer Type</span><span class="receipt-value">${isDebit ? 'Overseas Fund Transfer' : 'Inward Deposit'}</span></div>
                  <div class="receipt-row"><span class="receipt-label">Description</span><span class="receipt-value">${tx.description || 'N/A'}</span></div>
                  
                  <div class="receipt-section-title">Beneficiary Details</div>
                  <div class="receipt-row"><span class="receipt-label">Bank Name</span><span class="receipt-value">${tx.bankName || 'Nova Internal'}</span></div>
                  <div class="receipt-row"><span class="receipt-label">Account Name</span><span class="receipt-value">${tx.accountName || 'System'}</span></div>
                  <div class="receipt-row"><span class="receipt-label">Account Number</span><span class="receipt-value">${tx.recipientAccount || '---'}</span></div>
                  <div class="receipt-row"><span class="receipt-label">Swift / BIC</span><span class="receipt-value">${tx.swift || 'N/A'}</span></div>
                  <div class="receipt-row"><span class="receipt-label">IBAN</span><span class="receipt-value">${tx.iban || 'N/A'}</span></div>
               </div>
               <div style="padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.7rem; font-weight: 500;">
                  © Nova Bank Inc. All Rights Reserved. This is a computer-generated document.
               </div>
            `;

            receiptModal.style.display = 'flex';
         };

         document.getElementById('closeReceiptBtn')?.addEventListener('click', () => {
            document.getElementById('receiptModal').style.display = 'none';
         });

         renderTxList(txs.slice(0, 5), list);
         renderTxList(txs, fullList);
      });

      const transferForm = document.getElementById('transferForm');
      const transferBtn = document.getElementById('transferBtn');
      const transferMsg = document.getElementById('transferMessage');

      if (transferForm) {
         transferForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const agreement = document.getElementById('transferAgreement');
            if (agreement && !agreement.checked) {
               alert('You must agree to the terms and conditions.');
               return;
            }

            transferBtn.disabled = true;
            transferMsg.style.display = 'none';

            const account = document.getElementById('transferAccount').value;
            const amount = parseFloat(document.getElementById('transferAmount').value);
            const desc = document.getElementById('transferDescription').value;
            const bankName = document.getElementById('transferBankName').value;
            const accountName = document.getElementById('transferAccountName').value;
            const swift = document.getElementById('transferSwift').value;
            const iban = document.getElementById('transferIban').value;
            const country = document.getElementById('transferCountry').value;

            // In a real app, you'd send all these fields. 
            // For our simulator, we'll focus on the core transaction record.
            const fullDesc = `External Transfer to ${bankName} (${country}) - ${desc || 'No Memo'}`;
            
            const res = await createTransaction(currentUser.uid, amount, account, fullDesc);

            if (res.error) {
               transferMsg.textContent = res.error;
               transferMsg.className = 'text-danger';
            } else {
               transferMsg.textContent = 'Transfer Authorized. Funds are being dispatched via interbank clearing.';
               transferMsg.className = 'text-success';
               transferForm.reset();
               // Redirect to dashboard tab after a short delay
               setTimeout(() => {
                  document.querySelector('[data-tab="tab-dashboard"]').click();
               }, 3000);
            }
            transferMsg.style.display = 'block';
            transferBtn.disabled = false;
         });
      }

      // Change Password Form
      const passwordForm = document.getElementById('changePasswordForm');
      if (passwordForm) {
         passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = passwordForm.querySelectorAll('input');
            const pass = inputs[0].value;
            const confirm = inputs[1].value;
            const btn = passwordForm.querySelector('button');

            if (pass !== confirm) {
               alert('Passwords do not match!');
               return;
            }

            btn.disabled = true;
            const res = await changeUserPassword(pass);
            if (res.error) {
               alert('Error: ' + res.error);
            } else {
               alert('Password updated successfully!');
               passwordForm.reset();
            }
            btn.disabled = false;
         });
      }

      // Loan Form
      const loanForm = document.getElementById('loanForm');
      if (loanForm) {
         loanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const { applyForLoan } = await import('./services/db.js');
            const amount = document.getElementById('loanAmount').value;
            const purpose = document.getElementById('loanPurpose').value;
            const duration = document.getElementById('loanDuration').value;
            
            const btn = loanForm.querySelector('button');
            btn.disabled = true;
            
            const res = await applyForLoan(currentUser.uid, amount, purpose, duration);
            if (res.error) {
               alert('Error: ' + res.error);
            } else {
               alert('Your loan application for $' + amount + ' has been submitted for review.');
               loanForm.reset();
            }
            btn.disabled = false;
         });
      }

      // AI Assistant Toggle
      const aiBtn = document.getElementById('openAiAssistant');
      const aiPanel = document.getElementById('aiAssistantPanel');
      if (aiBtn && aiPanel) {
         aiBtn.addEventListener('click', () => {
            const isVisible = aiPanel.style.display === 'flex';
            aiPanel.style.display = isVisible ? 'none' : 'flex';
         });
      }

      const closeAiBtn = document.getElementById('closeAiAssistant');
      if (closeAiBtn) {
         closeAiBtn.addEventListener('click', () => {
            aiPanel.style.display = 'none';
         });
      }

      // Handle Apply Gold Card
      document.getElementById('applyGoldBtn')?.addEventListener('click', async () => {
         const { applyForCard } = await import('./services/db.js');
         const res = await applyForCard(currentUser.uid, 'Gold Credit Card', ['0% APR (6 Months)', '$50k Limit', 'Travel Rewards']);
         if (res.error) {
            alert('Error: ' + res.error);
         } else {
            alert('Your Gold Credit Card application has been submitted! Our premium services team will review it shortly.');
         }
      });
   }

   if (path === '/admin') {
      const { 
         subscribeToAllUsers, adminUpdateBalance, adminUpdateUserProfile, 
         subscribeToAllTransactions, subscribeToAllCardRequests, updateCardRequestStatus, 
         adminEditTransaction, restrictUserAccount, subscribeToAllLoans, updateLoanStatus, resetVerificationCode 
      } = await import('./services/db.js');

      let allUsers = [];
      let allTransactions = [];

      // Modal Helpers
      const openModal = (id) => {
         document.getElementById(id).style.display = 'flex';
         document.getElementById('modalBackdrop').style.display = 'block';
      };

      const closeModals = () => {
         document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
         document.getElementById('modalBackdrop').style.display = 'none';
      };

      // Tab Navigation
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
         item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            
            document.getElementById(tabId).classList.add('active');
            item.classList.add('active');
            document.getElementById('adminTabTitle').textContent = item.textContent.trim();
         });
      });

      // Subscriptions
      subscribeToAllUsers((users) => {
         allUsers = users;
         const tbody = document.getElementById('usersTableBody');
         if (tbody) {
            tbody.innerHTML = users.map(user => `
            <tr>
              <td>
                <div style="display:flex; align-items:center; gap:0.8rem;">
                  <div style="width:36px; height:36px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; color:#1a1a1a; font-weight:800; font-size:0.8rem;">
                    ${(user.fullName || 'U').split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style="display:flex; flex-direction:column;">
                     <span style="font-weight:700;">${user.fullName}</span>
                     <span class="text-muted" style="font-size:0.7rem; font-family:monospace;">${user.accountNumber}</span>
                  </div>
                </div>
              </td>
              <td><span class="status-badge ${user.status === 'active' ? 'status-successful' : 'status-pending'}" style="font-size:0.65rem;">${(user.status || 'active').toUpperCase()}</span></td>
              <td style="font-weight:700; color:var(--primary); font-family:monospace;">$${parseFloat(user.balance || 0).toFixed(2)}</td>
              <td>
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-secondary edit-user-btn" data-uid="${user.uid}" style="padding:0.4rem 0.8rem; font-size:0.7rem;">MANAGE</button>
                  <button class="btn btn-primary credit-btn" data-uid="${user.uid}" data-name="${user.fullName}" style="padding:0.4rem 0.8rem; font-size:0.7rem;">CREDIT</button>
                  <button class="btn btn-secondary debit-btn" data-uid="${user.uid}" data-name="${user.fullName}" style="padding:0.4rem 0.8rem; font-size:0.7rem; color:var(--danger);">DEBIT</button>
                </div>
              </td>
            </tr>
          `).join('');
         }

         const count = document.getElementById('totalUsersCount');
         if (count) count.textContent = users.length;

         const select = document.getElementById('errorTargetUser');
         if (select) {
            const currentVal = select.value;
            select.innerHTML = '<option value="">Select Target Customer...</option>' + users.map(u => `
            <option value="${u.uid}">${u.fullName} (${u.accountNumber})</option>
          `).join('');
            select.value = currentVal;
         }
      });

      subscribeToAllTransactions((transactions) => {
         allTransactions = transactions;
         const tbody = document.getElementById('allTransactionsTableBody');
         if (tbody) {
            tbody.innerHTML = transactions.map(tx => {
               const user = allUsers.find(u => u.uid === tx.userId);
               return `
              <tr class="clickable-tx" data-txid="${tx.id}" style="cursor:pointer;">
                <td style="font-size:0.75rem;">${tx.timestamp?.toDate().toLocaleString() || 'N/A'}</td>
                <td style="font-weight:600;">${user ? user.fullName : 'Unknown'}</td>
                <td class="text-muted" style="font-size:0.75rem;">${tx.description || 'Transfer'}</td>
                <td style="color:${tx.amount < 0 ? 'var(--danger)' : 'var(--success)'}; font-weight:700; font-family:monospace;">
                  ${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}
                </td>
                <td><span class="status-badge ${tx.status === 'completed' ? 'status-successful' : 'status-pending'}">${tx.status || 'pending'}</span></td>
                <td>
                   <button class="btn btn-secondary edit-tx-btn" data-txid="${tx.id}" style="padding:0.3rem 0.6rem; font-size:0.65rem;">OVERRIDE</button>
                </td>
              </tr>
            `;
            }).join('');
         }
      });

      subscribeToAllCardRequests((requests) => {
         const tbody = document.getElementById('cardRequestsTableBody');
         if (tbody) {
            tbody.innerHTML = requests.map(req => {
               const user = allUsers.find(u => u.uid === req.userId);
               return `
              <tr>
                <td style="font-size:0.75rem;">${req.timestamp?.toDate().toLocaleDateString() || 'N/A'}</td>
                <td>${user ? user.fullName : 'Unknown'}</td>
                <td style="font-weight:600; color:var(--primary);">${req.cardType}</td>
                <td><span class="status-badge ${req.status === 'approved' ? 'status-successful' : 'status-pending'}">${req.status.toUpperCase()}</span></td>
                <td>
                   <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-primary approve-card-btn" data-id="${req.id}" style="padding:0.3rem 0.6rem; font-size:0.7rem;">APPROVE</button>
                      <button class="btn btn-secondary reject-card-btn" data-id="${req.id}" style="padding:0.3rem 0.6rem; font-size:0.7rem; color:var(--danger);">REJECT</button>
                   </div>
                </td>
              </tr>
            `;
            }).join('');
         }
      });

      subscribeToAllLoans((loans) => {
         const tbody = document.getElementById('loanRequestsTableBody');
         if (tbody) {
            tbody.innerHTML = loans.map(loan => {
               const user = allUsers.find(u => u.uid === loan.userId);
               return `
              <tr>
                <td style="font-size:0.75rem;">${loan.timestamp?.toDate().toLocaleDateString() || 'N/A'}</td>
                <td>${user ? user.fullName : 'Unknown'}</td>
                <td style="font-weight:700;">$${parseFloat(loan.amount).toFixed(2)}</td>
                <td class="text-muted" style="font-size:0.75rem;">${loan.purpose}</td>
                <td><span class="status-badge ${loan.status === 'approved' ? 'status-successful' : (loan.status === 'rejected' ? 'status-failed' : 'status-pending')}">${loan.status.toUpperCase()}</span></td>
                <td>
                   <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-primary approve-loan-btn" data-id="${loan.id}" style="padding:0.3rem 0.6rem; font-size:0.7rem;">APPROVE</button>
                      <button class="btn btn-secondary reject-loan-btn" data-id="${loan.id}" style="padding:0.3rem 0.6rem; font-size:0.7rem; color:var(--danger);">REJECT</button>
                   </div>
                </td>
              </tr>
            `;
            }).join('');
         }
      });

      // Static Event Listeners
      document.getElementById('openCreateUserModal')?.addEventListener('click', () => openModal('createUserModal'));

      document.addEventListener('click', async (e) => {
         const backdrop = document.getElementById('modalBackdrop');
         
         // Manage User
         if (e.target.closest('.edit-user-btn')) {
            const uid = e.target.closest('.edit-user-btn').dataset.uid;
            const user = allUsers.find(u => u.uid === uid);
            if (user) {
               document.getElementById('editUserId').value = uid;
               document.getElementById('editFullName').value = user.fullName || '';
               document.getElementById('editAccountNum').value = user.accountNumber || '';
               document.getElementById('editRole').value = user.role || 'user';
               document.getElementById('editPhone').value = user.phone || '';
               document.getElementById('editStatus').value = user.status || 'active';
               document.getElementById('editVerified').value = String(user.isEmailVerified || false);
               document.getElementById('otpStatus').textContent = user.verificationCode || 'No active code';
               openModal('editUserModal');
            }
         }

         // Balance Adjustment
         if (e.target.closest('.credit-btn') || e.target.closest('.debit-btn')) {
            const btn = e.target.closest('.credit-btn') || e.target.closest('.debit-btn');
            const isCredit = btn.classList.contains('credit-btn');
            document.getElementById('modalTitle').textContent = isCredit ? 'Credit Account' : 'Debit Account';
            document.getElementById('modalUserLabel').textContent = `Customer: ${btn.dataset.name}`;
            document.getElementById('modalUserId').value = btn.dataset.uid;
            document.getElementById('modalType').value = isCredit ? 'credit' : 'debit';
            openModal('balanceModal');
         }

         // Receipt
         if (e.target.closest('.clickable-tx')) {
            const txId = e.target.closest('.clickable-tx').dataset.txid;
            const tx = allTransactions.find(t => t.id === txId);
            const user = allUsers.find(u => u.uid === tx.userId);
            if (tx) {
               document.getElementById('receiptAmount').textContent = `$${Math.abs(tx.amount).toFixed(2)}`;
               document.getElementById('receiptDate').textContent = tx.timestamp?.toDate().toLocaleString() || 'N/A';
               document.getElementById('receiptRef').textContent = tx.id.toUpperCase();
               document.getElementById('receiptDesc').textContent = tx.description || 'General Transfer';
               document.getElementById('receiptBeneficiary').textContent = user ? user.fullName : 'External Entity';
               document.getElementById('receiptAccount').textContent = user ? user.accountNumber : 'N/A';
               document.getElementById('receiptStatus').textContent = (tx.status || 'COMPLETED').toUpperCase();
               openModal('receiptModal');
            }
         }

         // OTP Reset
         if (e.target.id === 'resetOtpBtn') {
            const uid = document.getElementById('editUserId').value;
            const res = await resetVerificationCode(uid);
            if (!res.error) {
               document.getElementById('otpStatus').textContent = res.code + ' (RESET)';
               alert('Verification code has been reset to: ' + res.code);
            }
         }

         // Override Transaction
         if (e.target.closest('.edit-tx-btn')) {
            e.stopPropagation();
            const txId = e.target.closest('.edit-tx-btn').dataset.txid;
            const tx = allTransactions.find(t => t.id === txId);
            if (tx) {
               document.getElementById('editTxId').value = txId;
               document.getElementById('editTxDescription').value = tx.description || '';
               document.getElementById('editTxAmount').value = tx.amount;
               document.getElementById('editTxStatus').value = tx.status || 'pending';
               openModal('editTxModal');
            }
         }

         // Approvals
         if (e.target.closest('.approve-card-btn')) await updateCardRequestStatus(e.target.closest('.approve-card-btn').dataset.id, 'approved');
         if (e.target.closest('.reject-card-btn')) await updateCardRequestStatus(e.target.closest('.reject-card-btn').dataset.id, 'rejected');
         if (e.target.closest('.approve-loan-btn')) await updateLoanStatus(e.target.closest('.approve-loan-btn').dataset.id, 'approved');
         if (e.target.closest('.reject-loan-btn')) await updateLoanStatus(e.target.closest('.reject-loan-btn').dataset.id, 'rejected');

         // Global Modal Close
         if (e.target.id === 'modalBackdrop' || e.target.id === 'closeModalBtn' || e.target.closest('.close-btn')) {
            closeModals();
         }
      });

      // Forms
      document.getElementById('createUserForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const { adminCreateUser } = await import('./services/auth.js');
         const { createUserProfile } = await import('./services/db.js');
         
         const email = document.getElementById('createEmail').value;
         const password = document.getElementById('createPassword').value;
         const fullName = document.getElementById('createFullName').value;
         const accType = document.getElementById('createAccountType').value;
         const balance = parseFloat(document.getElementById('createBalance').value || 0);
         const msg = document.getElementById('createUserMsg');
         
         const btn = document.getElementById('confirmCreateBtn');
         btn.disabled = true;
         msg.style.display = 'block';
         msg.textContent = 'Creating account...';
         msg.style.color = 'var(--primary)';

         const authRes = await adminCreateUser(email, password);
         if (authRes.error) {
            msg.textContent = 'Auth Error: ' + authRes.error;
            msg.style.color = 'var(--danger)';
         } else {
            const profileRes = await createUserProfile(authRes.user.uid, {
               fullName,
               email,
               balance,
               accountType: accType,
               accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
               role: 'user',
               status: 'active',
               isEmailVerified: true
            });
            if (profileRes.error) {
               msg.textContent = 'Profile Error: ' + profileRes.error;
               msg.style.color = 'var(--danger)';
            } else {
               alert('Customer created successfully!');
               closeModals();
               e.target.reset();
            }
         }
         btn.disabled = false;
      });

      document.getElementById('confirmBalanceBtn')?.addEventListener('click', async () => {
         const uid = document.getElementById('modalUserId').value;
         const type = document.getElementById('modalType').value;
         const amount = document.getElementById('modalAmount').value;
         const desc = document.getElementById('modalDescription').value;
         await adminUpdateBalance(uid, amount, type, desc);
         closeModals();
      });

      document.getElementById('saveTxBtn')?.addEventListener('click', async () => {
         const txId = document.getElementById('editTxId').value;
         const data = {
            description: document.getElementById('editTxDescription').value,
            amount: parseFloat(document.getElementById('editTxAmount').value),
            status: document.getElementById('editTxStatus').value
         };
         await adminEditTransaction(txId, data);
         closeModals();
      });

      document.getElementById('editUserForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const uid = document.getElementById('editUserId').value;
         const data = {
            fullName: document.getElementById('editFullName').value,
            accountNumber: document.getElementById('editAccountNum').value,
            role: document.getElementById('editRole').value,
            phone: document.getElementById('editPhone').value,
            status: document.getElementById('editStatus').value,
            isEmailVerified: document.getElementById('editVerified').value === 'true'
         };
         await adminUpdateUserProfile(uid, data);
         closeModals();
      });

      document.getElementById('adminErrorForm')?.addEventListener('submit', async (e) => {
         e.preventDefault();
         const uid = document.getElementById('errorTargetUser').value;
         const subject = document.getElementById('errorSubject').value;
         const message = document.getElementById('errorMessageBody').value;
         await restrictUserAccount(uid, subject, message);
         alert('Restriction applied successfully.');
         e.target.reset();
      });
   }
};

// Listen for popstate
window.addEventListener("popstate", router);

// Auth Observer
subscribeToAuthChanges((user) => {
   currentUser = user;

   // Cleanup listeners
   if (profileUnsubscribe) profileUnsubscribe();
   if (txUnsubscribe) txUnsubscribe();
   if (adminUsersUnsub) adminUsersUnsub();
   if (adminTxsUnsub) adminTxsUnsub();

   // Reroute based on auth state
   router();
});
