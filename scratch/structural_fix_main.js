import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// Identify the start and end of the attachEventListeners dashboard logic
const startMarker = "if (path === '/dashboard') {";
const endMarker = "if (path === '/admin') {";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const dashboardLogic = `if (path === '/dashboard') {
      const user = globalProfileData;
      if (user) {
         // Restriction Logic
         if (user.status === 'restricted') {
            const container = document.getElementById('restrictionAlertContainer');
            if (container) {
               container.innerHTML = \`
                  <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; gap: 1.5rem;">
                     <div style="background: var(--danger); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                     </div>
                     <div>
                        <h4 style="color: var(--danger); margin-bottom: 0.25rem;">Account Restricted</h4>
                        <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">Your account has been temporarily restricted for security reasons. Please contact support or your account manager to restore full access.</p>
                     </div>
                  </div>
               \`;
            }
            const transferSection = document.getElementById('tab-transfer');
            if (transferSection) transferSection.style.display = 'none';
         }

         // Profile Completion Logic
         const isProfileComplete = user.dob && user.phone && user.ssn && user.address && user.city && user.state && user.zip;
         const alertContainer = document.getElementById('profileAlertContainer');
         if (!isProfileComplete && alertContainer) {
            alertContainer.innerHTML = \`
               <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid #eab308; padding: 1rem 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                     <h4 style="color: #eab308; margin-bottom: 0.25rem;">⚠️ Action Required: Incomplete Profile</h4>
                     <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">Please complete your account verification to ensure uninterrupted access.</p>
                  </div>
                  <button class="btn btn-primary" id="openCompleteProfileBtn" style="background: #eab308; color: #1a1a1a; font-weight: 600; border: none;">Complete Profile</button>
               </div>
            \`;
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

         // Image Upload
         const picInput = document.getElementById('profilePicInput');
         if (picInput) {
            picInput.addEventListener('change', (e) => {
               const file = e.target.files[0];
               if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                     document.getElementById('profilePicBase64').value = event.target.result;
                     document.getElementById('modalAvatarContainer').innerHTML = \`<img src="\${event.target.result}" class="profile-avatar" alt="Preview">\`;
                  };
                  reader.readAsDataURL(file);
               }
            });
         }

         const closeUserModalBtn = document.getElementById('closeUserProfileModal');
         if (closeUserModalBtn) closeUserModalBtn.addEventListener('click', () => document.getElementById('userProfileModal').style.display = 'none');

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
               if (res.error) {
                  msg.textContent = res.error; msg.className = 'text-danger';
               } else {
                  msg.textContent = 'Profile updated successfully!'; msg.className = 'text-success';
                  setTimeout(() => document.getElementById('userProfileModal').style.display = 'none', 1000);
               }
               msg.style.display = 'block'; btn.disabled = false;
            });
         }

         // Subscriptions
         profileUnsubscribe = subscribeToProfile(currentUser.uid, (data) => {
            const bal = parseFloat(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.querySelectorAll('.sync-balance').forEach(el => el.textContent = bal);
            populateProfileView(data);
         });

         txUnsubscribe = subscribeToTransactions(currentUser.uid, (txs) => {
            window.userTransactions = txs;
            const renderTxList = (txArray, container) => {
               if (!container) return;
               container.innerHTML = txArray.length === 0 ? '<div class="text-muted" style="text-align: center; padding: 2rem;">No recent transactions.</div>' : txArray.map(tx => {
                  const isDebit = tx.amount < 0;
                  return \`
                     <div class="transaction-item" data-txid="\${tx.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-light); cursor: pointer;">
                        <div>
                           <div style="font-weight: 500;">\${tx.description || (isDebit ? 'Transfer Out' : 'Inward Transfer')}</div>
                           <div class="text-muted" style="font-size: 0.8rem;">\${tx.timestamp?.toDate().toLocaleDateString() || 'Pending...'}</div>
                        </div>
                        <div style="text-align: right;">
                           <div style="font-weight: 600; color: \${isDebit ? 'var(--danger)' : 'var(--success)'};">\${isDebit ? '-' : '+'}$\${Math.abs(tx.amount).toFixed(2)}</div>
                           <div class="text-muted" style="font-size: 0.7rem;">\${tx.status || 'completed'}</div>
                        </div>
                     </div>
                  \`;
               }).join('');
               container.querySelectorAll('.transaction-item').forEach(item => {
                  item.addEventListener('click', () => {
                     const tx = txArray.find(t => t.id === item.dataset.txid);
                     if (tx) {
                        const receiptContent = document.getElementById('receiptContent');
                        receiptContent.innerHTML = \`<div class="receipt-header"><h3>Receipt</h3><div class="status-badge">\${tx.status}</div><h2>$\${Math.abs(tx.amount).toFixed(2)}</h2></div>\`;
                        document.getElementById('receiptModal').style.display = 'flex';
                     }
                  });
               });
            };
            renderTxList(txs.slice(0, 5), document.getElementById('transactionsList'));
            renderTxList(txs, document.getElementById('fullTransactionsList'));
         });

         // Transfer Logic
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

         const transferForm = document.getElementById('transferForm');
         if (transferForm) {
            transferForm.addEventListener('submit', async (e) => {
               e.preventDefault();
               const btn = document.getElementById('transferBtn');
               const type = document.getElementById('transferType').value;
               btn.disabled = true;
               const amount = parseFloat(document.getElementById('transferAmount').value);
               const account = document.getElementById('transferAccount').value;
               const otpRes = await generateTransactionOTP(currentUser.uid);
               if (otpRes.error) return alert("OTP Error");
               await sendVerificationEmail(currentUser.email, globalProfileData.fullName, otpRes.code);
               openModal('transferOtpModal');
               btn.disabled = false;
               window.pendingTransfer = { uid: currentUser.uid, amount, account, type, description: type === 'external' ? 'External Transfer' : 'Internal Transfer' };
            });
         }

         document.getElementById('transferOtpForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('confirmTransferBtn');
            const code = document.getElementById('transferOtpInput').value;
            if (!window.pendingTransfer) return;
            btn.disabled = true;
            const verifyRes = await verifyTransactionOTP(window.pendingTransfer.uid, code);
            if (verifyRes.error) {
               alert(verifyRes.error); btn.disabled = false;
            } else {
               const res = await createTransaction(window.pendingTransfer.uid, window.pendingTransfer.amount, window.pendingTransfer.account, window.pendingTransfer.description, window.pendingTransfer.type);
               if (res.error) alert(res.error); else { alert("Success!"); window.location.reload(); }
            }
         });
      }
   }
   `;
    content = content.substring(0, startIndex) + dashboardLogic + content.substring(endIndex);
    fs.writeFileSync(filePath, content);
    console.log("CRITICAL STRUCTURE FIX: Restored main.js architecture.");
} else {
    console.error("Could not find markers in main.js");
}
