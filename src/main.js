import './style.css';
import { subscribeToAuthChanges, registerUser, loginUser, logoutUser, adminCreateUser } from './services/auth.js';
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

  // Route Protection logic
  if (match.route.auth === 'authenticated' && !currentUser) {
    return navigateTo('/login');
  }
  
  // Email Verification Block
  if (match.route.auth === 'authenticated' && currentUser) {
     // Allow admins to bypass this for testing purposes, but strict block for customers
     if (!currentUser.emailVerified && !currentUser.email.includes('admin')) {
        const app = document.querySelector("#app");
        app.innerHTML = `
          <div class="container animate-fade-in" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 80vh; text-align: center;">
             <div class="glass-panel" style="padding: 3rem; max-width: 500px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="margin-bottom: 1.5rem;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                <h2 style="color: var(--danger); margin-bottom: 1rem;">Verification Required</h2>
                <p class="text-muted" style="margin-bottom: 2rem; line-height: 1.6;">
                   We've sent a secure verification link to <strong>${currentUser.email}</strong>.<br><br>
                   For your security, you must click the link in that email to activate your account before you can access the Nova Bank dashboard.
                </p>
                <button class="btn btn-primary" onclick="window.location.reload()" style="width: 100%; margin-bottom: 1rem;">I have verified my email</button>
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
        }, 100);
        return; // Halt routing
     }
  }

  if (match.route.auth === 'unauthenticated' && currentUser) {
    return navigateTo('/dashboard');
  }
  if (match.route.auth === 'admin') {
    if (!currentUser) return navigateTo('/login');
    // Fetch profile to verify admin role
    const profileRes = await getUserProfile(currentUser.uid);
    if (!profileRes.data || profileRes.data.role !== 'admin') {
      alert("Access Denied: You must be a verified Master Admin to view this page. You are currently logged in as a " + (profileRes.data ? profileRes.data.role : "unknown") + ".");
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
        await createUserProfile(res.user.uid, email, fullName);
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
      document.getElementById('userGreeting').textContent = `Hello, ${profileRes.data.fullName.split(' ')[0]}`;
      document.getElementById('accountNumber').textContent = profileRes.data.accountNumber;
      
      // Admin redirect
      if (profileRes.data.role === 'admin') {
        navigateTo('/admin');
        return;
      }

      // Check for incomplete profile
      const user = profileRes.data;
      
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
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); padding: 1rem 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: var(--danger); margin-bottom: 0.25rem;">⚠️ Action Required: Incomplete Profile</h4>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">Please complete your account verification to ensure uninterrupted access.</p>
                </div>
                <button class="btn btn-primary" id="openCompleteProfileBtn" style="background: var(--danger); border: none;">Complete Profile</button>
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
            document.getElementById('userProfileModal').style.display = 'flex';
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
                  if(alertContainer) alertContainer.innerHTML = ''; // Remove banner dynamically
               }, 1000);
            }
            msg.style.display = 'block';
            btn.disabled = false;
         });
      }
    }

    // Subscribe to balance
    profileUnsubscribe = subscribeToProfile(currentUser.uid, (data) => {
      document.getElementById('totalBalance').textContent = parseFloat(data.balance).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    });

    // Subscribe to transactions
    txUnsubscribe = subscribeToTransactions(currentUser.uid, (txs) => {
      const list = document.getElementById('transactionsList');
      if (txs.length === 0) {
        list.innerHTML = '<div class="text-muted" style="text-align: center; padding: 2rem;">No recent transactions.</div>';
      } else {
        list.innerHTML = txs.map(tx => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-light);">
            <div>
              <div style="font-weight: 500;">
                ${tx.type === 'transfer' ? 'Transfer to ' + tx.recipientAccount : 'System Credit/Debit'}
              </div>
              <div class="text-muted" style="font-size: 0.875rem;">
                ${tx.description || ''} • ${tx.timestamp ? new Date(tx.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                ${tx.status === 'on-hold' ? '<span class="text-danger" style="margin-left: 5px; border: 1px solid var(--danger); padding: 0 4px; border-radius: 4px; font-size: 0.7rem;">ON HOLD</span>' : ''}
              </div>
            </div>
            <div class="${tx.amount < 0 ? 'text-danger' : 'text-success'}" style="font-weight: 600;">
              ${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}
            </div>
          </div>
        `).join('');
      }
    });

    // Transfer Form
    const transferForm = document.getElementById('transferForm');
    const transferBtn = document.getElementById('transferBtn');
    const transferMsg = document.getElementById('transferMessage');
    
    transferForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      transferBtn.disabled = true;
      transferMsg.style.display = 'none';
      
      const account = document.getElementById('transferAccount').value;
      const amount = parseFloat(document.getElementById('transferAmount').value);
      const desc = document.getElementById('transferDescription').value;
      
      const res = await createTransaction(currentUser.uid, amount, account, desc);
      
      if (res.error) {
        transferMsg.textContent = res.error;
        transferMsg.className = 'text-danger';
      } else {
        transferMsg.textContent = 'Transfer successful!';
        transferMsg.className = 'text-success';
        transferForm.reset();
      }
      transferMsg.style.display = 'block';
      transferBtn.disabled = false;
    });
  }
  
  if (path === '/admin') {
     const logoutBtn = document.getElementById('logoutBtn');
     if(logoutBtn) logoutBtn.addEventListener('click', () => logoutUser());
     
     // --- SIDEBAR & TAB LOGIC ---
     const menuItems = document.querySelectorAll('.menu-item');
     const tabContents = document.querySelectorAll('.tab-content');
     
     menuItems.forEach(item => {
        item.addEventListener('click', () => {
           // Remove active from all tabs and menus
           menuItems.forEach(m => m.classList.remove('active'));
           tabContents.forEach(t => t.classList.remove('active'));
           
           // Add active to clicked menu and corresponding tab
           item.classList.add('active');
           const tabId = item.getAttribute('data-tab');
           document.getElementById(tabId).classList.add('active');
           
           // Close sidebar on mobile after clicking
           if (window.innerWidth <= 768) {
              document.getElementById('adminSidebar').classList.remove('open');
           }
        });
     });
     
     const closeSidebarBtn = document.getElementById('closeSidebarBtn');
     if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
           document.getElementById('adminSidebar').classList.remove('open');
        });
     }
     // ----------------------------
     
     // Form: Create User
     const createForm = document.getElementById('adminCreateUserForm');
     const createBtn = document.getElementById('createUserBtn');
     const createMsg = document.getElementById('createUserMessage');
     
     createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        createBtn.disabled = true;
        createMsg.style.display = 'none';
        
        const name = document.getElementById('newFullName').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        
        const res = await adminCreateUser(email, password);
        if (res.error) {
           createMsg.textContent = res.error;
           createMsg.className = 'text-danger';
        } else {
           const profileRes = await createUserProfile(res.user.uid, email, name, 'customer');
           if(profileRes.error) {
              createMsg.textContent = "Auth success but DB Error: " + profileRes.error;
              createMsg.className = 'text-danger';
           } else {
              createMsg.textContent = 'Customer account created successfully!';
              createMsg.className = 'text-success';
              createForm.reset();
           }
        }
        createMsg.style.display = 'block';
        createBtn.disabled = false;
     });

     // Modals
     const balanceModal = document.getElementById('balanceModal');
     const editModal = document.getElementById('editUserModal');
     const backdrop = document.getElementById('modalBackdrop');
     const closeBalanceBtn = document.getElementById('closeModalBtn');
     const closeEditBtn = document.getElementById('closeEditModalBtn');
     const balanceForm = document.getElementById('balanceForm');
     const editForm = document.getElementById('editUserForm');
     
     const closeModals = () => {
        if(balanceModal) balanceModal.style.display = 'none';
        if(editModal) editModal.style.display = 'none';
        if(backdrop) backdrop.style.display = 'none';
        if(balanceForm) balanceForm.reset();
        if(editForm) {
            editForm.reset();
            document.getElementById('editUserMsg').style.display = 'none';
        }
     };
     
     if(closeBalanceBtn) closeBalanceBtn.addEventListener('click', closeModals);
     if(closeEditBtn) closeEditBtn.addEventListener('click', closeModals);
     if(backdrop) backdrop.addEventListener('click', closeModals);

     // Handle Global Clicks for Admin Actions (Delegation)
     document.addEventListener('click', async (e) => {
        // Delete User
        if (e.target.closest('.delete-user-btn')) {
           const uid = e.target.closest('.delete-user-btn').dataset.uid;
           if(confirm('Are you sure you want to delete this account?')) {
              await deleteUserProfile(uid);
           }
        }
        
        // Open Credit/Debit Modal
        if (e.target.closest('.adjust-balance-btn')) {
           const btn = e.target.closest('.adjust-balance-btn');
           document.getElementById('modalUserId').value = btn.dataset.uid;
           document.getElementById('modalType').value = btn.dataset.type;
           document.getElementById('modalTitle').textContent = btn.dataset.type === 'credit' ? 'Credit Account' : 'Debit Account';
           document.getElementById('confirmBalanceBtn').className = btn.dataset.type === 'credit' ? 'btn btn-primary' : 'btn btn-secondary';
           balanceModal.style.display = 'block';
           backdrop.style.display = 'block';
        }
        
        // Open Edit User Modal
        if (e.target.closest('.edit-user-btn')) {
           const btn = e.target.closest('.edit-user-btn');
           const uid = btn.getAttribute('data-uid');
           
           const originalText = btn.textContent;
           btn.textContent = '...';
           
           const profileRes = await getUserProfile(uid);
           btn.textContent = originalText;
           
           if(profileRes.error) {
               alert("Error fetching user data: " + profileRes.error);
               return;
           }
           const user = profileRes.data;

           document.getElementById('editUserId').value = uid;
           document.getElementById('editFullName').value = user.fullName || '';
           document.getElementById('editAccountNum').value = user.accountNumber || '';
           document.getElementById('editRole').value = user.role || 'customer';
           
           // Questionnaire Fields
           document.getElementById('editPhone').value = user.phone || '';
           document.getElementById('editDob').value = user.dob || '';
           document.getElementById('editAddress').value = user.address || '';
           document.getElementById('editCity').value = user.city || '';
           document.getElementById('editState').value = user.state || '';
           document.getElementById('editZip').value = user.zip || '';
           document.getElementById('editSsn').value = user.ssn || '';
           document.getElementById('editStatus').value = user.status || 'active';
           document.getElementById('editAccountType').value = user.accountType || 'checking';

           editModal.style.display = 'flex';
           backdrop.style.display = 'block';
        }
        
        // Toggle Hold Status
        if (e.target.closest('.toggle-hold-btn')) {
           const btn = e.target.closest('.toggle-hold-btn');
           const txId = btn.dataset.txid;
           const newStatus = btn.dataset.status === 'completed' ? 'on-hold' : 'completed';
           await updateTransactionStatus(txId, newStatus);
        }
     });

     if(balanceForm) {
        balanceForm.addEventListener('submit', async (e) => {
           e.preventDefault();
           const uid = document.getElementById('modalUserId').value;
           const type = document.getElementById('modalType').value;
           const amount = document.getElementById('modalAmount').value;
           
           const confirmBtn = document.getElementById('confirmBalanceBtn');
           confirmBtn.disabled = true;
           await adminUpdateBalance(uid, amount, type);
           confirmBtn.disabled = false;
           closeModals();
        });
     }
     
     if(editForm) {
        editForm.addEventListener('submit', async (e) => {
           e.preventDefault();
           const btn = document.getElementById('saveEditBtn');
           const msg = document.getElementById('editUserMessage');
           
           btn.disabled = true;
           msg.style.display = 'none';

           const uid = document.getElementById('editUserId').value;
           const updatedData = {
              fullName: document.getElementById('editFullName').value,
              accountNumber: document.getElementById('editAccountNum').value,
              role: document.getElementById('editRole').value,
              phone: document.getElementById('editPhone').value,
              dob: document.getElementById('editDob').value,
              address: document.getElementById('editAddress').value,
              city: document.getElementById('editCity').value,
              state: document.getElementById('editState').value,
              zip: document.getElementById('editZip').value,
              ssn: document.getElementById('editSsn').value,
              status: document.getElementById('editStatus').value,
              accountType: document.getElementById('editAccountType').value,
           };
           
           const res = await adminUpdateUserProfile(uid, updatedData);
           
           if (res.error) {
              msg.textContent = res.error;
              msg.className = 'text-danger';
           } else {
              msg.textContent = 'Profile updated successfully!';
              msg.className = 'text-success';
              setTimeout(() => {
                 document.getElementById('editUserModal').style.display = 'none';
                 backdrop.style.display = 'none';
              }, 1000);
           }
           
           msg.style.display = 'block';
           btn.disabled = false;
        });
     }

     // Handle Error Form
     const adminErrorForm = document.getElementById('adminErrorForm');
     if (adminErrorForm) {
        adminErrorForm.addEventListener('submit', async (e) => {
           e.preventDefault();
           const btn = document.getElementById('sendErrorBtn');
           const msg = document.getElementById('errorFormMsg');
           btn.disabled = true;
           msg.style.display = 'none';

           const uid = document.getElementById('errorTargetUser').value;
           const subject = document.getElementById('errorSubject').value;
           const message = document.getElementById('errorMessageBody').value;
           
           if(!uid) {
              msg.textContent = 'Please select a user.';
              msg.className = 'text-danger';
              msg.style.display = 'block';
              btn.disabled = false;
              return;
           }

           const { restrictUserAccount } = await import('./services/db.js');
           const res = await restrictUserAccount(uid, subject, message);

           if (res.error) {
              msg.textContent = res.error;
              msg.className = 'text-danger';
           } else {
              msg.textContent = 'Account successfully restricted!';
              msg.className = 'text-success';
              adminErrorForm.reset();
           }
           msg.style.display = 'block';
           btn.disabled = false;
        });
     }

     // Sendmail Logic
     const sendmailForm = document.getElementById('adminSendmailForm');
     if (sendmailForm) {
        sendmailForm.addEventListener('submit', (e) => {
           e.preventDefault();
           const to = document.getElementById('sendmailRecipient').value;
           const subject = document.getElementById('sendmailSubject').value;
           const message = document.getElementById('sendmailMessage').value;
           const msgContainer = document.getElementById('sendmailMsg');
           
           let link = '';
           if (to.toLowerCase() === 'all') {
              // Extract all emails from cache
              const allEmails = adminUsersCache.map(u => u.email).join(',');
              link = `mailto:?bcc=${allEmails}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
           } else {
              link = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
           }
           
           window.location.href = link;
           
           msgContainer.textContent = 'Opening your mail client...';
           msgContainer.className = 'text-success';
           msgContainer.style.display = 'block';
           sendmailForm.reset();
        });
     }

     // Load Data via Subscriptions
     let adminUsersCache = [];
     let adminTxsCache = [];

     const renderTxs = () => {
         const list = document.getElementById('adminTransactionsList');
         if (!list) return;
         if (adminTxsCache.length === 0) {
            list.innerHTML = '<tr><td colspan="7" style="padding: 2rem; text-align: center;" class="text-muted">No transactions found.</td></tr>';
            return;
         }
         list.innerHTML = adminTxsCache.map(tx => {
            const user = adminUsersCache.find(u => u.id === tx.userId) || {};
            return `
               <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1rem; font-weight: 500;">${user.fullName || 'Unknown'}</td>
                  <td style="padding: 1rem; font-family: monospace;">${user.accountNumber || 'Unknown'}</td>
                  <td style="padding: 1rem; font-size: 0.875rem;">${tx.description || 'N/A'}</td>
                  <td style="padding: 1rem;">${tx.type || 'transfer'}</td>
                  <td style="padding: 1rem; font-weight: 600; color: ${tx.amount < 0 ? 'var(--danger)' : 'var(--success)'}">
                     ${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td style="padding: 1rem;">
                     <span style="color: ${tx.status === 'on-hold' ? 'var(--danger)' : 'var(--success)'}">
                        ${(tx.status || 'completed').toUpperCase()}
                     </span>
                  </td>
                  <td style="padding: 1rem; text-align: right;">
                     <button class="btn toggle-hold-btn" data-txid="${tx.id}" data-status="${tx.status}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: ${tx.status === 'completed' ? 'var(--secondary)' : 'var(--success)'}; color: white; border: none;">
                        ${tx.status === 'completed' ? 'Put On-Hold' : 'Approve'}
                     </button>
                  </td>
               </tr>
            `;
         }).join('');
     };

     adminUsersUnsub = subscribeToAllUsers((users) => {
        adminUsersCache = users;
        renderTxs();
        
        const errorDropdown = document.getElementById('errorTargetUser');
        if (errorDropdown) {
           const currentValue = errorDropdown.value;
           errorDropdown.innerHTML = '<option value="">Select a user...</option>' + 
              users.map(u => `<option value="${u.id}">${u.email} (${u.fullName || 'No Name'})</option>`).join('');
           if(users.find(u => u.id === currentValue)) errorDropdown.value = currentValue;
        }

        const totalUsersEl = document.getElementById('totalUsersCount');
        if (totalUsersEl) totalUsersEl.textContent = users.length;
        
        const list = document.getElementById('adminUsersList');
        if (list) {
            if (users.length === 0) {
               list.innerHTML = '<tr><td colspan="5" style="padding: 2rem; text-align: center;" class="text-muted">No users found.</td></tr>';
            } else {
               list.innerHTML = users.map(u => `
                  <tr style="border-bottom: 1px solid var(--border-light);">
                     <td style="padding: 1rem;">${u.email}</td>
                     <td style="padding: 1rem; font-family: monospace;">${u.accountNumber || 'N/A'}</td>
                     <td style="padding: 1rem;">
                        <span style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${u.role}</span>
                     </td>
                     <td style="padding: 1rem; font-weight: 600;">$${parseFloat(u.balance || 0).toFixed(2)}</td>
                     <td style="padding: 1rem; text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button class="btn adjust-balance-btn" data-type="credit" data-uid="${u.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: var(--success); color: white;">Credit</button>
                        <button class="btn adjust-balance-btn" data-type="debit" data-uid="${u.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: var(--text-muted); color: white;">Debit</button>
                        <button class="btn edit-user-btn" data-uid="${u.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: var(--secondary); color: white;">Edit</button>
                        <button class="btn delete-user-btn" data-uid="${u.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: var(--danger); color: white;">Delete</button>
                     </td>
                  </tr>
               `).join('');
            }
        }
     }, (err) => {
        const list = document.getElementById('adminUsersList');
        if (list) list.innerHTML = `<tr><td colspan="5" class="text-danger" style="padding: 2rem; text-align: center;">Error: ${err.message}. Please check your Firebase Firestore rules.</td></tr>`;
     });

     adminTxsUnsub = subscribeToAllTransactions((txs) => {
        adminTxsCache = txs;
        renderTxs();
        
        const totalVol = txs.reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || 0)), 0);
        const totalVolEl = document.getElementById('totalVolumeCount');
        if(totalVolEl) totalVolEl.textContent = `$${totalVol.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
     }, (err) => {
        const list = document.getElementById('adminTransactionsList');
        if (list) list.innerHTML = `<tr><td colspan="7" class="text-danger" style="padding: 2rem; text-align: center;">Error: ${err.message}. Please check your Firebase Firestore rules.</td></tr>`;
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
