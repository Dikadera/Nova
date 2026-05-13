import fs from 'fs';

const filePath = 'c:/Users/hp/.gemini/antigravity/scratch/nova-bank/src/views/Dashboard.js';
let content = fs.readFileSync(filePath, 'utf8');

// The issue: tab-transfer is closed too early.
// We need to remove the extra </div> that closes id="tab-transfer" before the <form id="transferForm">

const oldBlock = `<div id="tab-transfer" class="tab-content">
    <div class="glass-panel" style="padding: 2rem; margin-bottom: 2rem;">`;

// I'll search for the form and the divs above it.
const searchPattern = /<div id="tab-transfer" class="tab-content">[\s\S]*?<form id="transferForm">/;
const match = content.match(searchPattern);

if (match) {
    let block = match[0];
    // Find the premature closing tag. 
    // Usually it looks like:
    // </div>
    // </div>
    // <form...
    
    const fixedBlock = block.replace(/<\/div>\s*<\/div>\s*<form id="transferForm">/, '</div>\n\n              <form id="transferForm">');
    content = content.replace(block, fixedBlock);
    fs.writeFileSync(filePath, content);
    console.log("FIXED: Moved transferForm inside tab-transfer.");
} else {
    console.log("ERROR: Could not find the pattern.");
}
