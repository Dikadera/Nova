import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Resend Button to UI
const oldUI = '                <button class="btn btn-secondary" id="verificationLogoutBtn" style="width: 100%;">Sign Out</button>';
const newUI = `                   <div id="otpMsg" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
                   <button type="submit" class="btn btn-primary" id="verifyOtpBtn" style="width: 100%; margin-bottom: 1rem;">Verify Code</button>
                 </form>
                 <div style="margin-bottom: 2rem;">
                    <span class="text-muted" style="font-size: 0.85rem;">Didn't receive the code?</span>
                    <button id="resendOtpBtn" style="background:none; border:none; color:var(--primary); cursor:pointer; font-size:0.85rem; font-weight:600; text-decoration:underline; margin-left:5px;">Resend Email</button>
                 </div>
                 <button class="btn btn-secondary" id="verificationLogoutBtn" style="width: 100%;">Sign Out</button>`;

content = content.replace(oldUI, newUI);

// 2. Add Auto-send and Resend logic
const oldLogic = "setTimeout(() => {";
const newLogic = `setTimeout(() => {
             // Auto-send on first load
             const lastSent = sessionStorage.getItem(\`otp_sent_\${currentUser.uid}\`);
             if (!lastSent) {
                sendVerificationEmail(currentUser.email, userProfile.fullName, userProfile.verificationCode);
                sessionStorage.setItem(\`otp_sent_\${currentUser.uid}\`, Date.now());
             }

             document.getElementById('resendOtpBtn')?.addEventListener('click', async (e) => {
                const btn = e.target;
                const msg = document.getElementById('otpMsg');
                btn.disabled = true;
                btn.textContent = 'Sending...';
                const res = await sendVerificationEmail(currentUser.email, userProfile.fullName, userProfile.verificationCode);
                if (res.error) {
                   msg.textContent = "Failed to resend: " + res.error;
                   msg.className = "text-danger";
                   msg.style.display = "block";
                } else {
                   msg.textContent = "A new verification code has been dispatched to your inbox.";
                   msg.className = "text-success";
                   msg.style.display = "block";
                }
                btn.disabled = false;
                btn.textContent = 'Resend Email';
             });`;

// We only want to replace the FIRST occurrence which is inside the OTP block
content = content.replace(oldLogic, newLogic);

// 3. Update registration flow
const oldReg = /if \(profileRes\.verificationCode\) \{[\s\S]*?emailjs\.init[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}/;
const newReg = `if (profileRes.verificationCode) {
                sendVerificationEmail(email, fullName, profileRes.verificationCode);
                sessionStorage.setItem(\`otp_sent_\${res.user.uid}\`, Date.now());
             }
          }`;

content = content.replace(oldReg, newReg);

fs.writeFileSync(filePath, content);
console.log("Successfully updated main.js");
