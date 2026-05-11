import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/main.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update toggle logic in attachEventListeners
const oldToggle = /if \(path === '\/dashboard'\) \{[\s\S]*?\}\s*\}\);\s*\}\s*\}/;
const newToggle = `if (path === '/dashboard') {
      const switchBtn = document.getElementById('transferSwitchBtn');
      if (switchBtn) {
         switchBtn.addEventListener('click', () => {
            const currentType = document.getElementById('transferType').value;
            const newType = currentType === 'external' ? 'internal' : 'external';
            
            // Update State
            document.getElementById('transferType').value = newType;
            
            // Update UI
            document.getElementById('transferViewTitle').textContent = newType === 'external' ? 'External Transfer Fund' : 'Internal Transfer Fund';
            switchBtn.textContent = newType === 'external' ? 'Switch to Internal Transfer' : 'Switch to External Transfer';
            
            // Toggle Fields
            const externalFields = ['transferBankName', 'transferSwift', 'transferIban', 'transferCountry'];
            externalFields.forEach(id => {
               const el = document.getElementById(id);
               if (!el) return;
               const group = el.closest('.form-group');
               if (newType === 'internal') {
                  group.style.display = 'none';
                  el.removeAttribute('required');
               } else {
                  group.style.display = 'block';
                  el.setAttribute('required', '');
               }
            });
         });
      }
   }`;

content = content.replace(oldToggle, newToggle);

fs.writeFileSync(filePath, content);
console.log("Successfully updated transfer switch logic in main.js");
