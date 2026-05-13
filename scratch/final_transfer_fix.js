import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. REWRITE the entire transferForm block to include BOTH Toggle and OTP logic correctly
const oldHandler = /if \(transferForm\) \{[\s\S]*?\}\s*\}\);\s*\}/;
const newHandler = `if (transferForm) {
         // Switch Button Logic
         const switchBtn = document.getElementById('transferSwitchBtn');
         if (switchBtn) {
            switchBtn.addEventListener('click', () => {
               const typeEl = document.getElementById('transferType');
               const titleEl = document.getElementById('transferViewTitle');
               const currentType = typeEl.value;
               const newType = currentType === 'external' ? 'internal' : 'external';
               
               typeEl.value = newType;
               titleEl.textContent = newType === 'external' ? 'External Transfer Fund' : 'Internal Transfer Fund';
               switchBtn.textContent = newType === 'external' ? 'Switch to Internal Transfer' : 'Switch to External Transfer';
               
               const extFields = ['transferBankName', 'transferSwift', 'transferIban', 'transferCountry'];
               extFields.forEach(id => {
                  const el = document.getElementById(id);
                  if (el) {
                     el.closest('.form-group').style.display = newType === 'internal' ? 'none' : 'block';
                     if (newType === 'internal') el.removeAttribute('required');
                     else el.setAttribute('required', '');
                  }
               });
            });
         }

         transferForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const agreement = document.getElementById('transferAgreement');
            if (agreement && !agreement.checked) return alert('You must agree to the terms.');

            const btn = document.getElementById('transferBtn');
            const type = document.getElementById('transferType').value;
            btn.disabled = true;
            btn.textContent = 'Generating OTP...';

            const amount = parseFloat(document.getElementById('transferAmount').value);
            const account = document.getElementById('transferAccount').value;
            const bankName = document.getElementById('transferBankName').value;
            const country = document.getElementById('transferCountry').value;

            // Generate Transaction OTP
            const otpRes = await generateTransactionOTP(currentUser.uid);
            if (otpRes.error) {
               alert("Security Error: OTP failed.");
               btn.disabled = false;
               return;
            }

            await sendVerificationEmail(currentUser.email, globalProfileData.fullName, otpRes.code);
            openModal('transferOtpModal');
            btn.disabled = false;
            btn.textContent = 'Authorize & Finalize Transfer';

            window.pendingTransfer = {
               uid: currentUser.uid, amount, account, type,
               description: type === 'external' 
                  ? \`External Transfer to \${bankName} (\${country})\`
                  : \`Internal Transfer to Nova Acc: \${account}\`
            };
         });

         // Handle Transfer OTP Submission
         document.getElementById('transferOtpForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('confirmTransferBtn');
            const msg = document.getElementById('transferOtpMsg');
            const code = document.getElementById('transferOtpInput').value;
            
            if (!window.pendingTransfer) return;
            btn.disabled = true;
            msg.style.display = 'none';

            const verifyRes = await verifyTransactionOTP(window.pendingTransfer.uid, code);
            if (verifyRes.error) {
               msg.textContent = verifyRes.error;
               msg.className = 'text-danger';
               msg.style.display = 'block';
               btn.disabled = false;
            } else {
               const res = await createTransaction(
                  window.pendingTransfer.uid, 
                  window.pendingTransfer.amount, 
                  window.pendingTransfer.account, 
                  window.pendingTransfer.description,
                  window.pendingTransfer.type
               );

               if (res.error) {
                  alert("Transaction Failed: " + res.error);
                  btn.disabled = false;
               } else {
                  closeModals();
                  document.getElementById('transferForm').reset();
                  alert("Transfer Successful!");
                  window.location.reload();
               }
            }
         });
      }`;

content = content.replace(oldHandler, newHandler);

fs.writeFileSync(filePath, content);
console.log("CRITICAL FIX: Overhauled transfer logic with BOTH external support and OTP verification.");
