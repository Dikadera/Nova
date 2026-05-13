export const AdminView = () => {
   return `
    <div class="admin-wrapper animate-fade-in">
      
      <!-- Corporate Sidebar -->
      <aside class="admin-sidebar" id="adminSidebar">
        <div class="sidebar-header" style="display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 1rem;">
            <button id="backToUserDashboard" class="btn" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--primary); flex: 1; justify-content: flex-start; gap: 0.6rem; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 700; border-radius: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              BACK TO PORTAL
            </button>
            <button id="closeAdminSidebarBtn" class="mobile-only" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="logo-area" style="display: flex; align-items: center; gap: 0.8rem;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <div style="display: flex; flex-direction: column;">
               <span style="font-weight: 800; font-size: 1rem; letter-spacing: 1px; color: #fff; line-height: 1;">NOVA BANK</span>
               <span style="font-size: 0.55rem; color: var(--primary); letter-spacing: 1.5px; font-weight: 700; margin-top: 0.2rem;">ADMIN CONTROL</span>
            </div>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <li class="menu-item" style="border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 0.5rem; color: var(--primary);">
            <a href="/" data-link style="display: flex; align-items: center; gap: 0.8rem; color: inherit; text-decoration: none; width: 100%;">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               Back to Home
            </a>
          </li>
          <div class="nav-section">MAIN MANAGEMENT</div>
          <li class="menu-item active" data-tab="tab-users">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Customers
          </li>
          <li class="menu-item" data-tab="tab-all-transactions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Global Ledger
          </li>
          <div class="nav-section">SERVICE REQUESTS</div>
          <li class="menu-item" data-tab="tab-card-requests">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Card Applications
          </li>
          <li class="menu-item" data-tab="tab-loan-requests">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Loan Approvals
          </li>
          <div class="nav-section">SECURITY & OPS</div>
          <li class="menu-item" data-tab="tab-errors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Account Restrictions
          </li>
        </nav>

        <div class="sidebar-footer">
          <button id="adminLogoutBtn" class="btn-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Sign Out System
          </button>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="admin-workspace">
        <header class="workspace-header">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <button id="openSidebarBtn" class="mobile-toggle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 id="adminTabTitle">Customer Management</h2>
          </div>
          <div class="header-stats" style="display: flex; align-items: center; gap: 1.5rem;">
             
             <div class="admin-search-area">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="adminGlobalSearch" placeholder="Filter records..." class="admin-search-input">
             </div>

             <div class="mini-stat desktop-only">
                <span class="stat-label">Active Users</span>
                <span class="stat-value" id="totalUsersCount">0</span>
             </div>
             <button id="openCreateUserModal" class="btn btn-primary desktop-only" style="padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.8rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                NEW CUSTOMER
             </button>
          </div>
        </header>

        <div class="workspace-content">
          
          <!-- TAB: Customers -->
          <div id="tab-users" class="tab-content active">
             <div class="table-container">
                <table class="corporate-table">
                   <thead>
                      <tr>
                         <th>CUSTOMER IDENTITY</th>
                         <th>EMAIL ADDRESS</th>
                         <th>ACCOUNT STATUS</th>
                         <th>LEDGER BALANCE</th>
                         <th>ACTIONS</th>
                      </tr>
                   </thead>
                   <tbody id="usersTableBody"></tbody>
                </table>
             </div>
          </div>

          <!-- TAB: Global Ledger -->
          <div id="tab-all-transactions" class="tab-content">
             <div class="table-container">
                <table class="corporate-table">
                   <thead>
                      <tr>
                         <th>DATE</th>
                         <th>SENDER</th>
                         <th>DESCRIPTION</th>
                         <th>AMOUNT</th>
                         <th>STATUS</th>
                         <th>ACTION</th>
                      </tr>
                   </thead>
                   <tbody id="allTransactionsTableBody"></tbody>
                </table>
             </div>
          </div>

          <!-- TAB: Card Applications -->
          <div id="tab-card-requests" class="tab-content">
             <div class="table-container">
                <table class="corporate-table">
                   <thead>
                      <tr>
                         <th>DATE</th>
                         <th>CUSTOMER</th>
                         <th>CARD TIER</th>
                         <th>STATUS</th>
                         <th>ACTIONS</th>
                      </tr>
                   </thead>
                   <tbody id="cardRequestsTableBody"></tbody>
                </table>
             </div>
          </div>

          <!-- TAB: Loan Approvals -->
          <div id="tab-loan-requests" class="tab-content">
             <div class="table-container">
                <table class="corporate-table">
                   <thead>
                      <tr>
                         <th>DATE</th>
                         <th>CUSTOMER</th>
                         <th>AMOUNT</th>
                         <th>PURPOSE</th>
                         <th>STATUS</th>
                         <th>ACTIONS</th>
                      </tr>
                   </thead>
                   <tbody id="loanRequestsTableBody"></tbody>
                </table>
             </div>
          </div>

          <!-- TAB: Restrictions -->
          <div id="tab-errors" class="tab-content">
             <div class="glass-panel" style="max-width: 600px; margin: 0 auto; padding: 2rem;">
                <h3 style="margin-top: 0;">Account Control Center</h3>
                <p class="text-muted">Issue security alerts or restrict account access globally.</p>
                <form id="adminErrorForm">
                   <div class="form-group">
                      <label class="form-label">Target Customer</label>
                      <select id="errorTargetUser" class="form-control" required></select>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Action Subject</label>
                      <input type="text" id="errorSubject" class="form-control" placeholder="e.g. Account Security Alert" required>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Detailed Message</label>
                      <textarea id="errorMessageBody" class="form-control" rows="4" placeholder="This message will block their dashboard access..." required></textarea>
                   </div>
                   <button type="submit" class="btn btn-primary" style="width: 100%;">Apply Restriction</button>
                </form>
             </div>
          </div>

        </div>
      </main>

      <!-- Create User Modal -->
      <div id="createUserModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
        <div class="glass-panel" style="padding: 2.5rem; width: 90%; max-width: 500px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--primary);">Onboard New Customer</h3>
          <form id="createUserForm">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1rem;">
               <div class="form-group">
                  <label class="form-label">Full Legal Name</label>
                  <input type="text" id="createFullName" class="form-control" required placeholder="John Doe">
               </div>
               <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" id="createEmail" class="form-control" required placeholder="john@example.com">
               </div>
               <div class="form-group">
                  <label class="form-label">Temporary Password</label>
                  <input type="password" id="createPassword" class="form-control" required placeholder="********">
               </div>
               <div class="form-group">
                  <label class="form-label">Date of Birth</label>
                  <input type="date" id="createDob" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">SSN / Tax ID</label>
                  <input type="text" id="createSsn" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Home Address</label>
                  <input type="text" id="createAddress" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">City</label>
                  <input type="text" id="createCity" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Country</label>
                  <input type="text" id="createCountry" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Account Type</label>
                  <select id="createAccountType" class="form-control">
                     <option value="Savings Account">Savings Account</option>
                     <option value="Current Account">Current Account</option>
                     <option value="Business Account">Business Account</option>
                     <option value="Fixed Deposit">Fixed Deposit</option>
                  </select>
               </div>
               <div class="form-group">
                  <label class="form-label">Opening Balance ($)</label>
                  <input type="number" id="createBalance" class="form-control" value="0.00" step="0.01">
               </div>
            </div>
            <div id="createUserMsg" style="margin-top: 1rem; font-size: 0.85rem; display: none; padding: 0.5rem; border-radius: 4px; background: rgba(0,0,0,0.2);"></div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
              <button type="button" class="btn btn-secondary close-btn">CANCEL</button>
              <button type="submit" class="btn btn-primary" style="flex: 1;" id="confirmCreateBtn">CREATE ACCOUNT</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit User Modal -->
      <div id="editUserModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
        <div class="glass-panel" style="padding: 2.5rem; width: 95%; max-width: 750px; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
             <h3 style="margin: 0; color: var(--primary);">Global Customer Management</h3>
             <button type="button" class="close-btn" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
          </div>
          <form id="editUserForm">
            <input type="hidden" id="editUserId">
            
            <!-- Avatar Management -->
            <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2.5rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 16px;">
               <div id="editAvatarPreview" style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid var(--primary); background: #1a1a1a;">
                  <img src="" style="width: 100%; height: 100%; object-fit: cover;" alt="Avatar">
               </div>
               <div style="flex: 1;">
                  <label class="form-label">Profile Identity Picture</label>
                  <input type="file" id="editAvatarInput" class="form-control" accept="image/*" style="font-size: 0.8rem;">
                  <input type="hidden" id="editAvatarBase64">
               </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1.5rem;">
               <div class="form-group">
                  <label class="form-label">Full Legal Name</label>
                  <input type="text" id="editFullName" class="form-control" required>
               </div>
               <div class="form-group">
                  <label class="form-label">Assigned Account #</label>
                  <input type="text" id="editAccountNum" class="form-control" required>
               </div>
               <div class="form-group">
                  <label class="form-label">Date of Birth</label>
                  <input type="date" id="editDob" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">SSN / Tax ID</label>
                  <input type="text" id="editSsn" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Mobile Contact</label>
                  <input type="text" id="editPhone" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Home Address</label>
                  <input type="text" id="editAddress" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">City</label>
                  <input type="text" id="editCity" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Country of Residence</label>
                  <input type="text" id="editCountry" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Next of Kin</label>
                  <input type="text" id="editKin" class="form-control" placeholder="Name & Contact">
               </div>
               <div class="form-group">
                  <label class="form-label">Occupation</label>
                  <input type="text" id="editOccupation" class="form-control">
               </div>
               <div class="form-group">
                  <label class="form-label">Identity Verification</label>
                  <select id="editVerified" class="form-control">
                     <option value="true">Verified / Active</option>
                     <option value="false">Pending / Unverified</option>
                  </select>
               </div>
               <div class="form-group">
                  <label class="form-label">Account Status</label>
                  <select id="editStatus" class="form-control">
                     <option value="active">Active (Full Access)</option>
                     <option value="restricted">Restricted (No Transfers)</option>
                     <option value="suspended">Suspended (Locked)</option>
                  </select>
               </div>
            </div>

            <!-- OTP Control Section -->
            <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid rgba(0,210,255,0.1); display: flex; justify-content: space-between; align-items: center;">
               <div>
                  <div style="font-size: 0.7rem; color: var(--primary); font-weight: 800; letter-spacing: 1px;">AUTHENTICATION OVERRIDE</div>
                  <div id="otpStatus" style="font-size: 1.4rem; font-weight: 800; font-family: monospace; letter-spacing: 4px; margin-top: 0.5rem;">000000</div>
                  <div style="font-size: 0.65rem; color: #6b7280; margin-top: 0.3rem;">Current 6-Digit Security Code</div>
               </div>
               <button type="button" id="resetOtpBtn" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.7rem;">RESET SECURITY CODE</button>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2.5rem;">
               <button type="button" class="btn btn-secondary close-btn" style="padding: 0.8rem 2rem;">CANCEL</button>
               <button type="submit" class="btn btn-primary" style="padding: 0.8rem 2rem;">SAVE PROFILE CHANGES</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Balance Adjustment -->
      <div id="balanceModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
         <div class="glass-panel" style="padding: 2rem; width: 90%; max-width: 400px; border: 1px solid rgba(0,210,255,0.2);">
            <h3 id="modalTitle" style="margin-top: 0; color: var(--primary);">Fund Management</h3>
            <p id="modalUserLabel" style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1.5rem;"></p>
            <input type="hidden" id="modalUserId">
            <input type="hidden" id="modalType">
            
            <div class="form-group">
               <label class="form-label">Transaction Amount ($)</label>
               <input type="number" id="modalAmount" class="form-control" required min="0.01" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
               <label class="form-label">Internal Reference / Description</label>
               <input type="text" id="modalDescription" class="form-control" placeholder="e.g. Deposit" required>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
               <button type="button" class="btn btn-secondary close-btn" style="flex: 1;">CANCEL</button>
               <button type="button" class="btn btn-primary" style="flex: 1;" id="confirmBalanceBtn">EXECUTE</button>
            </div>
         </div>
      </div>

      <!-- Modal: Edit Transaction -->
      <div id="editTxModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
         <div class="glass-panel" style="padding: 2rem; width: 90%; max-width: 500px;">
            <h3>Override Transaction</h3>
            <input type="hidden" id="editTxId">
            <div class="form-group">
               <label class="form-label">Description</label>
               <input type="text" id="editTxDescription" class="form-control">
            </div>
            <div class="form-group">
               <label class="form-label">Amount ($)</label>
               <input type="number" id="editTxAmount" class="form-control" step="0.01">
            </div>
            <div class="form-group">
               <label class="form-label">Status</label>
               <select id="editTxStatus" class="form-control">
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
               </select>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
               <button type="button" class="btn btn-secondary close-btn" style="flex: 1;">CANCEL</button>
               <button type="button" class="btn btn-primary" style="flex: 1;" id="saveTxBtn">UPDATE</button>
            </div>
         </div>
      </div>

      <!-- Transaction Receipt Modal -->
      <div id="receiptModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
         <div class="modal-content receipt-card" style="max-width: 450px;">
            <div class="receipt-header">
               <div class="receipt-logo">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  <span>NOVA BANK</span>
               </div>
               <div class="receipt-status-badge success" id="receiptStatus">COMPLETED</div>
            </div>
            
            <div class="receipt-body">
               <div class="receipt-amount-area">
                  <div class="receipt-label">Transaction Amount</div>
                  <div class="receipt-amount" id="receiptAmount">$0.00</div>
               </div>
               
               <div class="receipt-details">
                  <div class="receipt-row"><span class="receipt-label">Date & Time</span><span class="receipt-value" id="receiptDate">--</span></div>
                  <div class="receipt-row"><span class="receipt-label">Reference ID</span><span class="receipt-value" id="receiptRef" style="font-family: monospace;">--</span></div>
                  <div class="receipt-row"><span class="receipt-label">Description</span><span class="receipt-value" id="receiptDesc">--</span></div>
                  <div class="receipt-row"><span class="receipt-label">Beneficiary</span><span class="receipt-value" id="receiptBeneficiary">--</span></div>
                  <div class="receipt-row"><span class="receipt-label">Account Number</span><span class="receipt-value" id="receiptAccount" style="font-family: monospace;">--</span></div>
               </div>
            </div>
            
            <div style="display: flex; gap: 1rem; padding: 1.5rem; background: rgba(0,0,0,0.2);">
               <button class="btn btn-secondary" style="flex: 1;" onclick="window.print()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; vertical-align: middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  DOWNLOAD PDF
               </button>
               <button class="btn btn-primary close-btn" style="flex: 1;">DISMISS</button>
            </div>
         </div>
      </div>

      <!-- Hidden Statement Template for Print -->
      <div id="statementTemplate" class="print-statement">
         <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
               <h1 style="margin: 0; font-size: 24px; color: #000;">NOVA BANK ENTERPRISE</h1>
               <p style="margin: 5px 0; color: #666;">Global Digital Statement</p>
            </div>
            <div style="text-align: right;">
               <p style="margin: 0; font-weight: 700; color: #000;">Statement Period</p>
               <p id="stPeriod" style="margin: 5px 0; color: #000;">--</p>
            </div>
         </div>
         
         <div style="margin-bottom: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
               <h3 style="font-size: 12px; text-transform: uppercase; color: #888; margin-bottom: 10px;">Account Holder</h3>
               <p id="stName" style="font-size: 18px; font-weight: 700; margin: 0; color: #000;">--</p>
               <p id="stEmail" style="margin: 5px 0; color: #000;">--</p>
               <p id="stAccNum" style="font-family: monospace; color: #000;">--</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: right;">
               <h3 style="font-size: 12px; text-transform: uppercase; color: #888; margin-bottom: 10px;">Available Balance</h3>
               <p id="stBalance" style="font-size: 28px; font-weight: 800; margin: 0; color: #000;">$0.00</p>
            </div>
         </div>

         <table style="width: 100%; border-collapse: collapse;">
            <thead>
               <tr style="background: #f1f5f9;">
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #000; color: #000;">Date</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #000; color: #000;">Description</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #000; color: #000;">Amount</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #000; color: #000;">Status</th>
               </tr>
            </thead>
            <tbody id="stBody" style="color: #000;"></tbody>
         </table>

         <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 10px; color: #999;">
            <p>This is a computer-generated statement and does not require a physical signature.</p>
            <p>Nova Bank is regulated by the Global Financial Authority. All rights reserved.</p>
         </div>
      </div>

      <div id="modalBackdrop" class="modal-backdrop"></div>
      
      <!-- Floating Action Button for Mobile -->
      <button id="fabCreateUser" class="fab mobile-only">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
  `;
};
