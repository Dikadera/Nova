import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix admin creation logic
const oldReg = /await createUserProfile\(authRes\.user\.uid, \{[\s\S]*?isEmailVerified: true\s*\}\);/;
const newReg = `await createUserProfile(authRes.user.uid, data.email, data.fullName);
                   const { adminUpdateUserProfile } = await import('./services/db.js');
                   await adminUpdateUserProfile(authRes.user.uid, {
                      balance: data.balance,
                      role: 'customer',
                      isEmailVerified: false
                   });`;

content = content.replace(oldReg, newReg);

fs.writeFileSync(filePath, content);
console.log("Successfully fixed admin creation logic in main.js");
