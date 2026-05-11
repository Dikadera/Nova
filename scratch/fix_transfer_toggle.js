import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add toggle listener to attachEventListeners
const oldAttach = /const attachEventListeners = async \(path\) => \{/;
const newToggleLogic = `const attachEventListeners = async (path) => {
   if (path === '/dashboard') {
      document.querySelectorAll('.transfer-type-btn').forEach(btn => {
         btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            document.querySelectorAll('.transfer-type-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById('transferType').value = type;
            document.getElementById('transferViewTitle').textContent = type === 'external' ? 'External Transfer Fund' : 'Internal Transfer Fund';
            
            // Hide/Show external fields
            const externalFields = ['transferBankName', 'transferSwift', 'transferIban', 'transferCountry'];
            externalFields.forEach(id => {
               const group = document.getElementById(id).closest('.form-group');
               if (type === 'internal') {
                  group.style.display = 'none';
                  document.getElementById(id).removeAttribute('required');
               } else {
                  group.style.display = 'block';
                  document.getElementById(id).setAttribute('required', '');
               }
            });
         });
      });
   }`;

content = content.replace(oldAttach, newToggleLogic);

// 2. Update pendingTransfer to include type
const oldPending = /window\.pendingTransfer = \{[\s\S]*?description: `External Transfer to \${bankName} \(\${country}\) - \${desc \|\| 'No Memo'}`\s*\};/;
const newPending = `const type = document.getElementById('transferType').value;
            window.pendingTransfer = {
               uid: currentUser.uid,
               amount,
               account,
               type,
               description: type === 'external' 
                  ? \`External Transfer to \${bankName} (\${country}) - \${desc || 'No Memo'}\`
                  : \`Internal Transfer to Nova Acc: \${account} - \${desc || 'No Memo'}\`
            };`;

content = content.replace(oldPending, newPending);

// 3. Update createTransaction call
const oldCreate = /const res = await createTransaction\(\s*window\.pendingTransfer\.uid,\s*window\.pendingTransfer\.amount,\s*window\.pendingTransfer\.account,\s*window\.pendingTransfer\.description\s*\);/;
const newCreate = `const res = await createTransaction(
                  window.pendingTransfer.uid, 
                  window.pendingTransfer.amount, 
                  window.pendingTransfer.account, 
                  window.pendingTransfer.description,
                  window.pendingTransfer.type
               );`;

content = content.replace(oldCreate, newCreate);

fs.writeFileSync(filePath, content);
console.log("Successfully implemented Internal/External transfer toggle logic in main.js");
