import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add missing Helper Functions
const helpers = `
// Premium Card Rendering
const renderMastercard = (user) => {
   const container = document.getElementById('mastercardContainer');
   if (!container || !user) return;
   
   const formattedBalance = parseFloat(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
   const cardNum = user.accountNumber || '0000 0000 0000 0000';
   
   container.innerHTML = \`
      <div class="mastercard animate-float">
         <div class="card-inner">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
               <div style="font-weight: 800; font-size: 1.2rem; letter-spacing: 2px;">NOVA <span style="font-weight: 300;">PLATINUM</span></div>
               <svg width="45" height="35" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="7" fill="rgba(255,255,255,0.8)"/><circle cx="17" cy="12" r="7" fill="rgba(255,255,255,0.4)"/></svg>
            </div>
            <div style="margin-bottom: 2rem;">
               <div style="font-size: 0.7rem; text-transform: uppercase; opacity: 0.8; margin-bottom: 0.5rem; letter-spacing: 1px;">Current Balance</div>
               <div style="font-size: 1.8rem; font-weight: 700;">$\${formattedBalance}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
               <div>
                  <div style="font-family: 'Courier New', Courier, monospace; font-size: 1.1rem; letter-spacing: 2px; margin-bottom: 0.5rem;">\${cardNum.replace(/(.{4})/g, '$1 ')}</div>
                  <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">\${user.fullName || 'Valued Member'}</div>
               </div>
               <div style="text-align: right;">
                  <div style="font-size: 0.6rem; opacity: 0.8; margin-bottom: 0.2rem;">VALID THRU</div>
                  <div style="font-size: 0.9rem; font-weight: 600;">12/28</div>
               </div>
            </div>
         </div>
      </div>
   \`;
};

const populateProfileView = (user) => {
   if (!user) return;
   const greeting = document.getElementById('userGreeting');
   if (greeting) greeting.textContent = \`Hello, \${user.fullName.split(' ')[0]}\`;
   
   const topbarAcc = document.getElementById('topbarAccountNum');
   if (topbarAcc) topbarAcc.textContent = user.accountNumber;

   // Render Nav Avatar
   const navAvatar = document.getElementById('navAvatarContainer');
   if (navAvatar) {
      navAvatar.innerHTML = user.profilePicture 
         ? \`<img src="\${user.profilePicture}" class="profile-avatar" alt="User">\`
         : \`<div class="profile-avatar" style="background: var(--primary); color: #1a1a1a; display: flex; align-items: center; justify-content: center; font-weight: 800;">\${user.fullName[0]}</div>\`;
   }
};

const renderAvatar = (user, containerId) => {
   const container = document.getElementById(containerId);
   if (!container) return;
   container.innerHTML = user.profilePicture 
      ? \`<img src="\${user.profilePicture}" class="profile-avatar" alt="Avatar">\`
      : \`<div class="profile-avatar" style="background: var(--primary); color: #1a1a1a; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 2rem;">\${user.fullName[0]}</div>\`;
};
`;

content = content.replace("// State", helpers + "\n// State");

// 2. Update attachEventListeners Dashboard path to include Tabs and missing logic
const dashboardOld = /if \(path === '\/dashboard'\) \{[\s\S]*?\}\s*\}\s*if \(path === '\/admin'\)/;
const dashboardNew = \`if (path === '/dashboard') {
      const user = globalProfileData;
      if (user) {
         // Tab Switching
         const menuItems = document.querySelectorAll('.menu-item');
         menuItems.forEach(item => {
            item.addEventListener('click', () => {
               const tabId = item.dataset.tab;
               document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
               document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
               document.getElementById(tabId).classList.add('active');
               item.classList.add('active');
               document.getElementById('currentTabTitle').textContent = item.textContent.trim();
            });
         });

         // Quick Action Buttons
         document.getElementById('quickTransferBtn')?.addEventListener('click', () => {
            document.querySelector('[data-tab="tab-transfer"]').click();
         });
         document.getElementById('quickLoanBtn')?.addEventListener('click', () => {
            document.querySelector('[data-tab="tab-loans"]').click();
         });

         // Restriction & Profile Alert Logic
         if (user.status === 'restricted') {
            const container = document.getElementById('restrictionAlertContainer');
            if (container) {
               container.innerHTML = \\\`
                  <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; gap: 1.5rem;">
                     <div style="background: var(--danger); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                     </div>
                     <div>
                        <h4 style="color: var(--danger); margin-bottom: 0.25rem;">Account Restricted</h4>
                        <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">Your account has been temporarily restricted for security reasons. Please contact support or your account manager to restore full access.</p>
                     </div>
                  </div>
               \\\`;
            }
            const transferSection = document.getElementById('tab-transfer');
            if (transferSection) transferSection.style.display = 'none';
         }

         const isProfileComplete = user.dob && user.phone && user.ssn && user.address && user.city && user.state && user.zip;
         const alertContainer = document.getElementById('profileAlertContainer');
         if (!isProfileComplete && alertContainer) {
            alertContainer.innerHTML = \\\`
               <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid #eab308; padding: 1rem 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                     <h4 style="color: #eab308; margin-bottom: 0.25rem;">⚠️ Action Required: Incomplete Profile</h4>
                     <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">Please complete your account verification to ensure uninterrupted access.</p>
                  </div>
                  <button class="btn btn-primary" id="openCompleteProfileBtn" style="background: #eab308; color: #1a1a1a; font-weight: 600; border: none;">Complete Profile</button>
               </div>
            \\\`;
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

         // Image Upload & Profile Save
         const picInput = document.getElementById('profilePicInput');
         if (picInput) {
            picInput.addEventListener('change', (e) => {
               const file = e.target.files[0];
               if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                     document.getElementById('profilePicBase64').value = event.target.result;
                     document.getElementById('modalAvatarContainer').innerHTML = \\\`<img src="\\\${event.target.result}" class="profile-avatar" alt="Preview">\\\`;
                  };
                  reader.readAsDataURL(file);
               }
            });
         }
         document.getElementById('closeUserProfileModal')?.addEventListener('click', () => document.getElementById('userProfileModal').style.display = 'none');
         
         const userProfileForm = document.getElementById('userProfileForm');
         if (userProfileForm) {
            userProfileForm.addEventListener('submit', async (e) => {
               e.preventDefault();
               const btn = document.getElementById('saveUserProfileBtn');
               const msg = document.getElementById('userProfileMessage');
               btn.disabled = true;
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
               if (res.error) { msg.textContent = res.error; msg.className = 'text-danger'; }
               else { msg.textContent = 'Success!'; msg.className = 'text-success'; setTimeout(() => document.getElementById('userProfileModal').style.display = 'none', 1000); }
               msg.style.display = 'block'; btn.disabled = false;
            });
         }

         // Subscriptions (Dynamic Balance & Card Rendering)
         profileUnsubscribe = subscribeToProfile(currentUser.uid, (data) => {
            const bal = parseFloat(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.querySelectorAll('.sync-balance').forEach(el => el.textContent = bal);
            populateProfileView(data);
            renderMastercard(data);
         });

         txUnsubscribe = subscribeToTransactions(currentUser.uid, (txs) => {
            window.userTransactions = txs;
            const list = document.getElementById('transactionsList');
            const fullList = document.getElementById('fullTransactionsList');
            const renderTx = (txArray, container) => {
               if (!container) return;
               container.innerHTML = txArray.length === 0 ? '<div class="text-muted" style="text-align: center; padding: 2rem;">No recent transactions.</div>' : txArray.map(tx => \\\`
                  <div class="transaction-item" data-txid="\\\${tx.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-light); cursor: pointer;">
                     <div>
                        <div style="font-weight: 500;">\\\${tx.description || 'Transfer Out'}</div>
                        <div class="text-muted" style="font-size: 0.8rem;">\\\${tx.timestamp?.toDate().toLocaleDateString() || 'Pending...'}</div>
                     </div>
                     <div style="text-align: right;">
                        <div style="font-weight: 600; color: \\\${tx.amount < 0 ? 'var(--danger)' : 'var(--success)'};">\\\${tx.amount < 0 ? '-' : '+'}$\\\${Math.abs(tx.amount).toFixed(2)}</div>
                        <div class="text-muted" style="font-size: 0.7rem;">\\\${tx.status || 'completed'}</div>
                     </div>
                  </div>
               \\\`).join('');
            };
            renderTx(txs.slice(0, 5), list);
            renderTx(txs, fullList);
         });

         // Transfer Switching & Logic
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
                  if (el) { el.closest('.form-group').style.display = newType === 'internal' ? 'none' : 'block'; if (newType === 'internal') el.removeAttribute('required'); else el.setAttribute('required', ''); }
               });
            });
         }

         const transferForm = document.getElementById('transferForm');
         if (transferForm) {
            transferForm.addEventListener('submit', async (e) => {
               e.preventDefault();
               const btn = document.getElementById('transferBtn');
               btn.disabled = true;
               const amount = parseFloat(document.getElementById('transferAmount').value);
               const account = document.getElementById('transferAccount').value;
               const type = document.getElementById('transferType').value;
               const bank = document.getElementById('transferBankName').value;
               const country = document.getElementById('transferCountry').value;
               const otpRes = await generateTransactionOTP(currentUser.uid);
               if (otpRes.error) return alert("OTP Failed");
               await sendVerificationEmail(currentUser.email, user.fullName, otpRes.code);
               openModal('transferOtpModal');
               btn.disabled = false;
               window.pendingTransfer = { uid: currentUser.uid, amount, account, type, description: type === 'external' ? \\\`External Transfer to \\\${bank} (\\\${country})\\\` : \\\`Internal Transfer to Nova Acc: \\\${account}\\\` };
            });
         }

         document.getElementById('transferOtpForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('confirmTransferBtn');
            const code = document.getElementById('transferOtpInput').value;
            if (!window.pendingTransfer) return;
            btn.disabled = true;
            const verifyRes = await verifyTransactionOTP(window.pendingTransfer.uid, code);
            if (verifyRes.error) { alert(verifyRes.error); btn.disabled = false; }
            else {
               const res = await createTransaction(window.pendingTransfer.uid, window.pendingTransfer.amount, window.pendingTransfer.account, window.pendingTransfer.description, window.pendingTransfer.type);
               if (res.error) alert(res.error); else { alert("Success!"); window.location.reload(); }
            }
         });

         // Security & Loan
         document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPass = document.getElementById('newPassword').value;
            const res = await changeUserPassword(newPass);
            alert(res.error || "Password updated!");
         });

         document.getElementById('loanForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const { requestLoan } = await import('./services/db.js');
            const amount = parseFloat(e.target.querySelector('input[type="number"]').value);
            const purpose = e.target.querySelector('select').value;
            await requestLoan(currentUser.uid, amount, purpose);
            alert("Loan application submitted!");
            e.target.reset();
         });
         
         document.getElementById('cardsForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const { requestCard } = await import('./services/db.js');
            const cardType = document.getElementById('cardTypeSelect').value;
            await requestCard(currentUser.uid, cardType);
            alert("Card request submitted!");
         });

         document.getElementById('logoutBtn')?.addEventListener('click', () => logoutUser().then(() => window.location.reload()));
      }
   }
   if (path === '/admin')`;

content = content.replace(dashboardOld, dashboardNew);

fs.writeFileSync(filePath, content);
console.log("CRITICAL RESTORE: Re-implemented Mastercard, Tabs, and Form listeners in main.js");
`;

content = content.replace(dashboardOld, dashboardNew);

fs.writeFileSync(filePath, content);
console.log("CRITICAL RESTORE: Re-implemented Mastercard, Tabs, and Form listeners in main.js");
