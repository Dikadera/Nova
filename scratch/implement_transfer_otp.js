import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace transferForm handler
const oldTransfer = /if \(transferForm\) \{[\s\S]*?\}\s*\}\s*\}\);\s*\}/;
const newTransfer = `if (transferForm) {
         transferForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const agreement = document.getElementById('transferAgreement');
            if (agreement && !agreement.checked) {
               alert('You must agree to the terms and conditions.');
               return;
            }

            const btn = document.getElementById('transferBtn');
            btn.disabled = true;
            btn.textContent = 'Generating OTP...';

            const amount = parseFloat(document.getElementById('transferAmount').value);
            const account = document.getElementById('transferAccount').value;
            const bankName = document.getElementById('transferBankName').value;
            const country = document.getElementById('transferCountry').value;
            const desc = document.getElementById('transferDescription').value;

            const otpRes = await generateTransactionOTP(currentUser.uid);
            if (otpRes.error) {
               alert("Security Error: Could not generate authorization code.");
               btn.disabled = false;
               btn.textContent = 'Transfer Funds';
               return;
            }

            await sendVerificationEmail(currentUser.email, globalProfileData.fullName, otpRes.code);
            openModal('transferOtpModal');
            btn.disabled = false;
            btn.textContent = 'Transfer Funds';

            window.pendingTransfer = {
               uid: currentUser.uid,
               amount,
               account,
               description: \`External Transfer to \${bankName} (\${country}) - \${desc || 'No Memo'}\`
            };
         });

         document.getElementById('transferOtpForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('confirmTransferBtn');
            const msg = document.getElementById('transferOtpMsg');
            const code = document.getElementById('transferOtpInput').value;
            
            if (!window.pendingTransfer) return;

            btn.disabled = true;
            btn.textContent = 'Verifying...';
            msg.style.display = 'none';

            const verifyRes = await verifyTransactionOTP(window.pendingTransfer.uid, code);
            if (verifyRes.error) {
               msg.textContent = verifyRes.error;
               msg.className = 'text-danger';
               msg.style.display = 'block';
               btn.disabled = false;
               btn.textContent = 'Confirm Transaction';
            } else {
               msg.textContent = 'Authorized! Processing...';
               msg.className = 'text-success';
               msg.style.display = 'block';

               const res = await createTransaction(
                  window.pendingTransfer.uid, 
                  window.pendingTransfer.amount, 
                  window.pendingTransfer.account, 
                  window.pendingTransfer.description
               );

               if (res.error) {
                  alert("Transaction Failed: " + res.error);
                  btn.disabled = false;
               } else {
                  setTimeout(() => {
                     closeModals();
                     document.getElementById('transferForm').reset();
                     window.pendingTransfer = null;
                     alert("Transfer Successful!");
                  }, 1500);
               }
            }
         });
      }`;

content = content.replace(oldTransfer, newTransfer);

fs.writeFileSync(filePath, content);
console.log("Successfully implemented Transfer OTP logic in main.js");
