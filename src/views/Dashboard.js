export const DashboardView = () => {
  return `
    <div class="container animate-fade-in" style="padding-top: 2rem;">
      <nav class="navbar" style="padding: 0 0 2rem 0; border-bottom: 1px solid var(--border-light); margin-bottom: 2rem;">
        <a href="/" class="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Nova Bank
        </a>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <span class="text-muted" id="userGreeting">Loading...</span>
          <button id="logoutBtn" class="btn btn-secondary" style="padding: 0.5rem 1rem;">Logout</button>
        </div>
      </nav>
      </nav>

      <div id="restrictionAlertContainer"></div>
      <div id="profileAlertContainer"></div>

      <div style="display: grid; grid-template-columns: 1fr 350px; gap: 2rem;">
        <div>
          <!-- Balance Card -->
          <div class="glass-panel" style="padding: 2.5rem; margin-bottom: 2rem; background: linear-gradient(135deg, rgba(20,26,40,0.8) 0%, rgba(0,210,255,0.1) 100%);">
            <h3 class="text-muted" style="margin-bottom: 0.5rem; font-weight: 400;">Total Balance</h3>
            <h1 style="margin-bottom: 1rem; font-size: 3.5rem;">$<span id="totalBalance">0.00</span></h1>
            <div style="display: flex; gap: 2rem;">
              <div>
                <span class="text-muted" style="font-size: 0.875rem;">Account Number</span>
                <div id="accountNumber" style="font-family: monospace; font-size: 1.125rem;">---</div>
              </div>
              <div>
                <span class="text-muted" style="font-size: 0.875rem;">Status</span>
                <div class="text-success" style="font-size: 1.125rem; display: flex; align-items: center; gap: 0.25rem;">
                  <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--success);"></div> Active
                </div>
              </div>
            </div>
          </div>

          <!-- Transactions List -->
          <div class="glass-panel" style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3>Recent Transactions</h3>
            </div>
            <div id="transactionsList">
              <div class="text-muted" style="text-align: center; padding: 2rem;">Loading transactions...</div>
            </div>
          </div>
        </div>

        <!-- Transfer Funds -->
        <div id="transferSection">
          <div class="glass-panel" style="padding: 2rem;">
            <h3 style="margin-bottom: 1.5rem;">Transfer Funds</h3>
            <form id="transferForm">
              <div class="form-group">
                <label class="form-label">Recipient Account</label>
                <input type="text" id="transferAccount" class="form-control" required placeholder="Account number">
              </div>
              <div class="form-group">
                <label class="form-label">Amount ($)</label>
                <input type="number" id="transferAmount" class="form-control" required placeholder="0.00" min="1" step="0.01">
              </div>
              <div class="form-group">
                <label class="form-label">Description (Optional)</label>
                <input type="text" id="transferDescription" class="form-control" placeholder="What's this for?">
              </div>
              <div id="transferMessage" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
              <button type="submit" class="btn btn-primary" style="width: 100%;" id="transferBtn">Send Money</button>
            </form>
          </div>
        </div>
      </div>

      <!-- User Profile Settings Modal -->
      <div id="userProfileModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
        <div class="glass-panel" style="padding: 2rem; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
          <h3 style="margin-bottom: 1.5rem;">Complete Your Profile</h3>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">Please provide the following information to verify your account and unlock all banking features.</p>
          <form id="userProfileForm">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Date of Birth</label>
                <input type="date" id="userEditDob" class="form-control" required>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Phone Number</label>
                <input type="tel" id="userEditPhone" class="form-control" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">SSN / ID Number</label>
                <input type="text" id="userEditSsn" class="form-control" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Street Address</label>
                <input type="text" id="userEditAddress" class="form-control" required>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">City</label>
                <input type="text" id="userEditCity" class="form-control" required>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">State/Province</label>
                <input type="text" id="userEditState" class="form-control" required>
              </div>
              <div class="form-group">
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; display: block;">Zip/Postal Code</label>
                <input type="text" id="userEditZip" class="form-control" required>
              </div>
            </div>
            
            <div id="userProfileMessage" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
              <button type="button" class="btn" id="closeUserProfileModal" style="background: rgba(255,255,255,0.1); color: white;">Cancel</button>
              <button type="submit" class="btn btn-primary" id="saveUserProfileBtn">Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};
