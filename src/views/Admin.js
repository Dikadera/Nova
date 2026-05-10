export const AdminView = () => {
  return `
    <div class="admin-layout animate-fade-in">
      
      <!-- Sidebar -->
      <aside class="admin-sidebar" id="adminSidebar">
        <div class="sidebar-header">
          <h2>NOVA Bank</h2>
          <button id="closeSidebarBtn" style="background:none; border:none; color:#a5b4fc; cursor:pointer;" class="mobile-only">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        </div>
        
        <ul class="sidebar-menu">
          <li class="menu-item active" data-tab="tab-dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </li>
          <li class="menu-item" data-tab="tab-transfers">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3v18M17 3l-4 4M17 3l4 4M7 21V3M7 21l-4-4M7 21l4-4"/></svg>
            Transfers
          </li>
          <li class="menu-item" data-tab="tab-loans">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Loan Requests
          </li>
          <li class="menu-item" data-tab="tab-errors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
            Error Message
          </li>
          <li class="menu-item" data-tab="tab-create-user">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Create New User
          </li>
          <li class="menu-item" data-tab="tab-wallet">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Wallet
          </li>
          <li class="menu-item" data-tab="tab-users">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Users
          </li>
          <li class="menu-item" data-tab="tab-sendmail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Sendmail
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <header class="admin-topbar">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <button id="logoutBtn" class="btn btn-secondary" style="padding: 0.5rem 1rem; border-radius: 50px; background: rgba(165,180,252,0.1); color: #a5b4fc; border: none;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Sign Out
            </button>
          </div>
        </header>

        <div class="admin-content-area">
          
          <!-- TAB: Dashboard -->
          <div id="tab-dashboard" class="tab-content active">
            <h3 style="margin-bottom: 1.5rem;">System Overview</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
              <div class="glass-panel" style="padding: 1.5rem;">
                <div class="text-muted" style="margin-bottom: 0.5rem;">Total Users</div>
                <h2 id="totalUsersCount">0</h2>
              </div>
              <div class="glass-panel" style="padding: 1.5rem;">
                <div class="text-muted" style="margin-bottom: 0.5rem;">System Volume</div>
                <h2 id="totalVolumeCount">$0.00</h2>
              </div>
            </div>
          </div>

          <!-- TAB: Transfers -->
          <div id="tab-transfers" class="tab-content">
            <h3 style="margin-bottom: 1.5rem;">All Platform Transfers</h3>
            <div class="glass-panel" style="padding: 1rem; overflow-x: auto;">
              <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-light);">
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">User Name</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Account #</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Description</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Type</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Amount</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Status</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500; text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="adminTransactionsList">
                  <tr><td colspan="5" style="padding: 2rem; text-align: center;" class="text-muted">Loading transactions...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB: Loan Requests -->
          <div id="tab-loans" class="tab-content">
            <h3 style="margin-bottom: 1.5rem;">Loan Requests</h3>
            <div class="glass-panel" style="padding: 2rem; text-align: center;">
              <p class="text-muted">No active loan requests pending.</p>
            </div>
          </div>

          <!-- TAB: Error Message -->
          <div id="tab-errors" class="tab-content">
            <h3 style="margin-bottom: 1.5rem;">Restrict Account / Trigger Error Message</h3>
            <div class="glass-panel" style="padding: 2rem; max-width: 600px;">
              <form id="adminErrorForm">
                <div class="form-group">
                  <label class="form-label">Target User</label>
                  <select id="errorTargetUser" class="form-control" required>
                    <option value="">Select a user...</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Error Subject</label>
                  <input type="text" id="errorSubject" class="form-control" required placeholder="e.g. Account Restricted">
                </div>
                <div class="form-group">
                  <label class="form-label">Message Body</label>
                  <textarea id="errorMessageBody" class="form-control" rows="4" required placeholder="Your account has been restricted..."></textarea>
                </div>
                <div id="errorFormMsg" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
                <button type="submit" class="btn btn-primary" id="sendErrorBtn">Restrict User & Send Error</button>
              </form>
            </div>
          </div>

          <!-- TAB: Create New User -->
          <div id="tab-create-user" class="tab-content">
            <h3 style="margin-bottom: 1.5rem;">Create New Account</h3>
            <div class="glass-panel" style="padding: 2rem; max-width: 600px;">
              <form id="adminCreateUserForm">
                 <div class="form-group">
                   <input type="text" id="newFullName" class="form-control" required placeholder="Full Name">
                 </div>
                 <div class="form-group">
                   <input type="email" id="newEmail" class="form-control" required placeholder="Email Address">
                 </div>
                 <div class="form-group">
                   <input type="password" id="newPassword" class="form-control" required placeholder="Password">
                 </div>
                 <div id="createUserMessage" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
                 <button type="submit" class="btn btn-primary" style="width: 100%;" id="createUserBtn">Create Customer Account</button>
              </form>
            </div>
          </div>

          <!-- TAB: Wallet -->
          <div id="tab-wallet" class="tab-content">
            <h3 style="margin-bottom: 1.5rem;">System Wallet</h3>
            <div class="glass-panel" style="padding: 2rem;">
              <h4 class="text-muted">Master Liquidity</h4>
              <h1 style="color: var(--success); font-size: 4rem; margin: 1rem 0;">$1,000,000.00</h1>
              <p class="text-muted">This represents the simulated master holding wallet for BCLYS Bank.</p>
            </div>
          </div>

          <!-- TAB: Users -->
          <div id="tab-users" class="tab-content">
            <h3 style="margin-bottom: 1.5rem;">Manage Users</h3>
            <div class="glass-panel" style="padding: 1rem; overflow-x: auto;">
              <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-light);">
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Email</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Account #</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Role</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Balance</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500; text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="adminUsersList">
                  <tr><td colspan="4" style="padding: 2rem; text-align: center;" class="text-muted">Loading users...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB: Sendmail -->
          <div id="tab-sendmail" class="tab-content">
            <h3 style="margin-bottom: 1.5rem;">Send Email to Users</h3>
            <div class="glass-panel" style="padding: 2rem; max-width: 600px;">
              <div class="text-muted" style="margin-bottom: 2rem; font-style: italic;">
                Email dispatch system. This will securely launch your native mail client (Outlook, Mail, etc.) to dispatch the message.
              </div>
              <form id="adminSendmailForm">
                <div class="form-group">
                  <label class="form-label">Recipient (or 'all' for broadcast)</label>
                  <input type="text" id="sendmailRecipient" class="form-control" placeholder="user@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Subject</label>
                  <input type="text" id="sendmailSubject" class="form-control" placeholder="Important Account Update" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Message</label>
                  <textarea id="sendmailMessage" class="form-control" rows="6" placeholder="Write your email content here..." required></textarea>
                </div>
                <div id="sendmailMsg" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
                <button type="submit" id="sendmailBtn" class="btn btn-primary">Dispatch Email</button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <!-- Modal for Credit/Debit -->
      <div id="balanceModal" class="glass-panel" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; padding: 2rem; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
         <h3 id="modalTitle" style="margin-bottom: 1rem;">Adjust Balance</h3>
         <form id="balanceForm">
            <input type="hidden" id="modalUserId">
            <input type="hidden" id="modalType">
            <div class="form-group">
               <label class="form-label">Amount ($)</label>
               <input type="number" id="modalAmount" class="form-control" required min="0.01" step="0.01">
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
               <button type="button" class="btn btn-secondary" style="flex: 1;" id="closeModalBtn">Cancel</button>
               <button type="submit" class="btn btn-primary" style="flex: 1;" id="confirmBalanceBtn">Confirm</button>
            </div>
         </form>
      </div>

      <!-- Edit User Modal -->
      <div id="editUserModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
        <div class="glass-panel" style="padding: 2rem; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto;">
          <h3 style="margin-bottom: 1.5rem;">Edit Customer Profile</h3>
          <form id="editUserForm">
            <input type="hidden" id="editUserId">
            
            <h4 style="margin-bottom: 1rem; color: var(--primary); font-size: 1.1rem;">Basic Information</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Full Name</label>
                <input type="text" id="editFullName" class="form-control" required>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Date of Birth</label>
                <input type="date" id="editDob" class="form-control">
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Phone Number</label>
                <input type="tel" id="editPhone" class="form-control">
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">SSN / ID Number</label>
                <input type="text" id="editSsn" class="form-control">
              </div>
            </div>

            <h4 style="margin-bottom: 1rem; color: var(--primary); font-size: 1.1rem;">Address Details</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Street Address</label>
                <input type="text" id="editAddress" class="form-control">
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">City</label>
                <input type="text" id="editCity" class="form-control">
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">State/Province</label>
                <input type="text" id="editState" class="form-control">
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Zip/Postal Code</label>
                <input type="text" id="editZip" class="form-control">
              </div>
            </div>

            <h4 style="margin-bottom: 1rem; color: var(--primary); font-size: 1.1rem;">Account Settings</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Account Number</label>
                <input type="text" id="editAccountNum" class="form-control" required>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">System Role</label>
                <select id="editRole" class="form-control">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Account Status</label>
                <select id="editStatus" class="form-control">
                  <option value="active">Active</option>
                  <option value="frozen">Frozen</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Account Type</label>
                <select id="editAccountType" class="form-control">
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>
            </div>
            
            <div id="editUserMessage" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
              <button type="button" class="btn" id="closeEditModalBtn" style="background: rgba(255,255,255,0.1); color: white;">Cancel</button>
              <button type="submit" class="btn btn-primary" id="saveEditBtn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
      <div id="modalBackdrop" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; backdrop-filter: blur(4px);"></div>

    </div>
  `;
};
