import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Move Auth check to global level
const oldGuard = /if \(match\.route\.auth === 'authenticated' \|\| match\.route\.auth === 'admin'\) \{[\s\S]*?if \(!currentUser\) return navigateTo\('\/login'\);/;
const newGuard = `if (match.route.auth === 'authenticated' || match.route.auth === 'admin') {
       if (!currentUser) return navigateTo('/login');
    }

    if (currentUser) {`;

content = content.replace(oldGuard, newGuard);

// 2. Adjust loading check
const oldLoad = /if \(!userProfile\) \{/;
const newLoad = `if (!globalProfileData) {`;
content = content.replace(oldLoad, newLoad);

// 3. Adjust Wall check
const oldWall = /if \(userProfile\.role !== 'admin' && userProfile\.isEmailVerified !== true\) \{/;
const newWall = `if (globalProfileData && globalProfileData.role !== 'admin' && globalProfileData.isEmailVerified !== true) {
          const userProfile = globalProfileData;`;

content = content.replace(oldWall, newWall);

fs.writeFileSync(filePath, content);
console.log("Successfully globalized OTP wall in main.js");
