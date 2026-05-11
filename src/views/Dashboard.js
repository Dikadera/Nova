export const DashboardView = () => {
  const countries = [
    "AFGHANISTAN", "ALBANIA", "ALGERIA", "ANDORRA", "ANGOLA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN",
    "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BHUTAN", "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRUNEI", "BULGARIA", "BURKINA FASO", "BURUNDI",
    "CABO VERDE", "CAMBODIA", "CAMEROON", "CANADA", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "COLOMBIA", "COMOROS", "CONGO", "COSTA RICA", "CROATIA", "CUBA", "CYPRUS", "CZECH REPUBLIC",
    "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ESWATINI", "ETHIOPIA",
    "FIJI", "FINLAND", "FRANCE", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GREECE", "GRENADA", "GUATEMALA", "GUINEA", "GUINEA-BISSAU", "GUYANA",
    "HAITI", "HONDURAS", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN", "IRAQ", "IRELAND", "ISRAEL", "ITALY", "JAMAICA", "JAPAN", "JORDAN",
    "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOREA, NORTH", "KOREA, SOUTH", "KOSOVO", "KUWAIT", "KYRGYZSTAN", "LAOS", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG",
    "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MAURITANIA", "MAURITIUS", "MEXICO", "MICRONESIA", "MOLDOVA", "MONACO", "MONGOLIA", "MONTENEGRO", "MOROCCO", "MOZAMBIQUE", "MYANMAR",
    "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NORTH MACEDONIA", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PALESTINE", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND", "PORTUGAL",
    "QATAR", "ROMANIA", "RUSSIA", "RWANDA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH SUDAN", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWEDEN", "SWITZERLAND", "SYRIA",
    "TAIWAN", "TAJIKISTAN", "TANZANIA", "THAILAND", "TIMOR-LESTE", "TOGO", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TUVALU",
    "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "URUGUAY", "UZBEKISTAN", "VANUATU", "VATICAN CITY", "VENEZUELA", "VIETNAM", "YEMEN", "ZAMBIA", "ZIMBABWE"
  ];

  return `
    <div class="admin-layout animate-fade-in">
      
      <!-- Sidebar -->
      <aside class="admin-sidebar" id="userSidebar">
        <div class="sidebar-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h2 style="font-size: 1.1rem;">Nova Bank</h2>
          </div>
          <button id="closeUserSidebarBtn" style="background:none; border:none; color:var(--primary); cursor:pointer;" class="mobile-only">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        </div>
        
        <ul class="sidebar-menu">
          <li class="menu-item active" data-tab="tab-dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </li>
          <li class="menu-item" data-tab="tab-transfer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3v18M17 3l-4 4M17 3l4 4M7 21V3M7 21l-4-4M7 21l4-4"/></svg>
            Transfer Funds
          </li>
          <li class="menu-item" data-tab="tab-loans">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Loan Request
          </li>
          <li class="menu-item" data-tab="tab-statement">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Account Statement
          </li>
          <li class="menu-item" data-tab="tab-cards">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Cards Request
          </li>
          <li class="menu-item" data-tab="tab-password">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Security
          </li>
          <li class="menu-item" data-tab="tab-profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            My Profile
          </li>
        </ul>

        <div style="padding: 1.5rem; border-top: 1px solid var(--border-light);">
          <button id="logoutBtn" class="btn btn-secondary" style="width: 100%; justify-content: flex-start; gap: 0.5rem; border: none; background: rgba(239, 68, 68, 0.1); color: var(--danger);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="admin-main">
        <header class="admin-topbar" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 1rem;">
             <button id="openUserSidebarBtn" class="mobile-only" style="background:none; border:none; color:var(--text-main); cursor:pointer;">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
             </button>
             <div style="display: flex; flex-direction: column;">
                <h3 id="currentTabTitle" style="margin: 0;">Dashboard</h3>
                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: var(--success);">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--success)"><circle cx="12" cy="12" r="10"/></svg>
                   Secure 256-bit AES Session
                </div>
             </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
             <div style="text-align: right; margin-right: 1rem;" class="desktop-only">
               <div class="text-muted" style="font-size: 0.75rem;">Account Number</div>
               <div id="topbarAccountNum" style="font-family: monospace; font-weight: 600; letter-spacing: 1px;">---</div>
             </div>
             <div class="profile-avatar-container" id="navAvatarContainer"></div>
             <span id="userGreeting" class="text-muted" style="font-weight: 500;"></span>
          </div>
        </header>

        <div class="admin-content-area">
          <div id="restrictionAlertContainer"></div>
          <div id="profileAlertContainer"></div>

          <!-- TAB: Dashboard Overview -->
          <div id="tab-dashboard" class="tab-content active">
            <div style="display: grid; grid-template-columns: 1fr 400px; gap: 2rem;">
              <div>
                <div class="glass-panel" style="padding: 2.5rem; margin-bottom: 2rem; background: linear-gradient(135deg, rgba(20,26,40,0.8) 0%, rgba(0,210,255,0.1) 100%); position: relative; overflow: hidden;">
                  <!-- Background Pattern -->
                  <div style="position: absolute; top: -20%; right: -10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(0,210,255,0.05) 0%, transparent 70%); pointer-events: none;"></div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 2;">
                      <div>
                          <h3 class="text-muted" style="margin-bottom: 0.5rem; font-weight: 400;">Total Balance</h3>
                          <h1 style="margin-bottom: 0.5rem; font-size: 3.5rem;">$<span class="sync-balance">0.00</span></h1>
                          <div style="display: flex; gap: 1.5rem; align-items: center;">
                             <div style="font-size: 0.85rem; color: var(--text-muted);">
                                Available: <span style="color: var(--text-main); font-weight: 600;">$<span class="sync-balance">0.00</span></span>
                             </div>
                             <div style="font-size: 0.85rem; color: var(--primary); display: flex; align-items: center; gap: 0.4rem; background: rgba(0,210,255,0.1); padding: 0.2rem 0.6rem; border-radius: 4px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                <span>850 Nova Points</span>
                             </div>
                          </div>
                      </div>
                      <div class="text-success" style="font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; background: rgba(34, 197, 94, 0.1); padding: 0.5rem 1rem; border-radius: 20px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px var(--success);"></div> Active
                      </div>
                  </div>
                </div>

                <!-- AI Insights / Rewards Widgets -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                   <div class="glass-panel" style="padding: 1.5rem;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                         <h4 style="font-size: 0.9rem;">Smart Savings Goal</h4>
                         <span class="text-muted" style="font-size: 0.7rem;">Travel Fund</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
                         <span style="font-weight: 700;">$12,450 / $15,000</span>
                         <span class="text-primary" style="font-size: 0.8rem; font-weight: 600;">83%</span>
                      </div>
                      <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px;">
                         <div style="width: 83%; height: 100%; background: var(--primary); border-radius: 3px; box-shadow: 0 0 10px var(--primary);"></div>
                      </div>
                   </div>
                   <div class="glass-panel" style="padding: 1.5rem; background: rgba(16, 185, 129, 0.03);">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                         <h4 style="font-size: 0.9rem;">AI Spending Insight</h4>
                         <div style="width: 20px; height: 20px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                         </div>
                      </div>
                      <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">"You saved <span style="color: var(--success); font-weight: 600;">$142.00</span> this month by optimizing your recurring subscriptions!"</p>
                   </div>
                </div>

                <div class="glass-panel" style="padding: 2rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3>Recent Transactions</h3>
                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" id="dashboardViewAllTxBtn">View All</button>
                  </div>
                  <div id="transactionsList">
                    <div class="text-muted" style="text-align: center; padding: 2rem;">Loading transactions...</div>
                  </div>
                </div>
              </div>

              <div>
                <div id="mastercardContainer" style="margin-bottom: 2rem;"></div>
                <div class="glass-panel" style="padding: 1.5rem; background: rgba(0, 210, 255, 0.03); margin-bottom: 2rem;">
                  <h4 style="margin-bottom: 1rem; color: var(--primary); font-size: 0.9rem;">Quick Services</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <button class="btn btn-secondary" style="flex-direction: column; gap: 0.5rem; padding: 1rem; border-color: rgba(255,255,255,0.05);" id="quickTransferBtn">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M17 3v18M17 3l-4 4M17 3l4 4M7 21V3M7 21l-4-4M7 21l4-4"/></svg>
                       <span style="font-size: 0.8rem;">Transfer</span>
                    </button>
                    <button class="btn btn-secondary" style="flex-direction: column; gap: 0.5rem; padding: 1rem; border-color: rgba(255,255,255,0.05);" id="quickLoanBtn">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                       <span style="font-size: 0.8rem;">Loans</span>
                    </button>
                  </div>
                </div>
                
                <div class="glass-panel" style="padding: 1.5rem; background: linear-gradient(to bottom, rgba(165,180,252,0.1), transparent);">
                   <h4 style="margin-bottom: 1rem; font-size: 0.9rem;">Platinum Loyalty</h4>
                   <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">Unlock premium lounge access and 2% cashback by maintaining a balance above $50k.</p>
                   <button class="btn btn-primary" style="width: 100%; font-size: 0.8rem;">Explore Perks</button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: External Transfer Funds -->
          <div id="tab-transfer" class="tab-content">
            <div class="glass-panel" style="padding: 2.5rem; margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.5rem;">
                <div>
                   <h2 style="margin-bottom: 0.5rem;">External Transfer Fund</h2>
                   <p style="color: #eab308; font-size: 0.9rem; font-weight: 500;">⚠️ Please note that every successful transfer is not reversible</p>
                </div>
                <div style="text-align: right;">
                   <div style="margin-bottom: 1rem;">
                      <span class="text-muted" style="font-size: 0.8rem;">Total Balance</span>
                      <div style="font-size: 1.5rem; font-weight: 700;">$<span class="sync-balance">0.00</span> USD</div>
                   </div>
                   <div>
                      <span class="text-muted" style="font-size: 0.8rem;">Available Balance</span>
                      <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">$<span class="sync-balance">0.00</span> USD</div>
                   </div>
                </div>
              </div>

              <form id="transferForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                   <div class="form-group">
                      <label class="form-label">Bank Name</label>
                      <input type="text" id="transferBankName" class="form-control" required placeholder="Enter recipient bank name">
                   </div>
                   <div class="form-group">
                      <label class="form-label">Account Number</label>
                      <input type="text" id="transferAccount" class="form-control" required placeholder="Enter recipient account number">
                   </div>
                   <div class="form-group">
                      <label class="form-label">Account Name</label>
                      <input type="text" id="transferAccountName" class="form-control" required placeholder="Enter recipient account name">
                   </div>
                   <div class="form-group">
                      <label class="form-label">Amount</label>
                      <div style="display: flex; gap: 0.5rem;">
                         <select id="transferCurrency" class="form-control" style="width: 100px;">
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CAD">CAD</option>
                         </select>
                         <input type="number" id="transferAmount" class="form-control" required placeholder="0.00" min="1" step="0.01">
                      </div>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Swift Code / Routing Number / BIC</label>
                      <input type="text" id="transferSwift" class="form-control" required placeholder="SWIFT/BIC/Routing">
                   </div>
                   <div class="form-group">
                      <label class="form-label">IBAN Number</label>
                      <input type="text" id="transferIban" class="form-control" required placeholder="International Bank Account Number">
                   </div>
                   <div class="form-group">
                      <label class="form-label">Receiver Email (optional)</label>
                      <input type="email" id="transferReceiverEmail" class="form-control" placeholder="recipient@example.com">
                   </div>
                   <div class="form-group">
                      <label class="form-label">Country</label>
                      <select id="transferCountry" class="form-control" required>
                         ${countries.map(c => `<option value="${c}" ${c === 'UNITED STATES' ? 'selected' : ''}>${c}</option>`).join('')}
                      </select>
                   </div>
                   <div class="form-group" style="grid-column: 1 / -1;">
                      <label class="form-label">Description (optional)</label>
                      <textarea id="transferDescription" class="form-control" rows="2" placeholder="Transfer purpose or memo"></textarea>
                   </div>
                </div>

                <div style="margin: 1.5rem 0; display: flex; align-items: center; gap: 0.75rem;">
                   <input type="checkbox" id="transferAgreement" required style="width: 18px; height: 18px; cursor: pointer;">
                   <label for="transferAgreement" style="font-size: 0.9rem; color: var(--text-muted); cursor: pointer;">I agree to the terms and conditions and authorize this transaction.</label>
                </div>

                <div id="transferMessage" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;" id="transferBtn">Authorize & Finalize Transfer</button>
              </form>
            </div>
          </div>

          <!-- TAB: Advanced Loan Request -->
          <div id="tab-loans" class="tab-content">
            <div class="glass-panel" style="padding: 2.5rem; max-width: 800px;">
              <h3 style="margin-bottom: 0.5rem;">Instant Credit Application</h3>
              <p class="text-muted" style="margin-bottom: 2rem;">Get approved for credit limits up to $250,000 based on your account standing.</p>
              
              <form id="loanForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                   <div class="form-group">
                      <label class="form-label">Loan Type</label>
                      <select class="form-control" required>
                         <option>Personal Loan</option>
                         <option>Business Expansion</option>
                         <option>Home Mortgage</option>
                         <option>Vehicle Financing</option>
                      </select>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Desired Amount ($)</label>
                      <input type="number" class="form-control" required placeholder="e.g. 50000">
                   </div>
                   <div class="form-group">
                      <label class="form-label">Monthly Net Income ($)</label>
                      <input type="number" class="form-control" required placeholder="Enter your take-home pay">
                   </div>
                   <div class="form-group">
                      <label class="form-label">Employment Status</label>
                      <select class="form-control" required>
                         <option>Full-Time Employee</option>
                         <option>Self-Employed / Business Owner</option>
                         <option>Contractor</option>
                         <option>Retired</option>
                      </select>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Loan Duration</label>
                      <select class="form-control" required>
                         <option>12 Months (Fixed 4.5%)</option>
                         <option>24 Months (Fixed 5.2%)</option>
                         <option>36 Months (Fixed 6.0%)</option>
                         <option>60 Months (Fixed 7.5%)</option>
                      </select>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Purpose of Loan</label>
                      <input type="text" class="form-control" required placeholder="e.g. Debt consolidation">
                   </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;">Submit Formal Application</button>
              </form>
            </div>
          </div>

          <!-- TAB: Account Statement with Filtering -->
          <div id="tab-statement" class="tab-content">
             <div class="glass-panel" style="padding: 2.5rem;">
               <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
                 <div>
                    <h3>Detailed Account Statement</h3>
                    <p class="text-muted" style="font-size: 0.9rem;">Review and export your historical transaction data.</p>
                 </div>
                 <div style="display: flex; gap: 1rem;">
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                       <input type="date" class="form-control" style="width: 150px; font-size: 0.8rem;">
                       <span class="text-muted">to</span>
                       <input type="date" class="form-control" style="width: 150px; font-size: 0.8rem;">
                    </div>
                    <button class="btn btn-secondary" style="gap: 0.5rem;" onclick="window.print()">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      Generate Report
                    </button>
                 </div>
               </div>
               <div id="fullTransactionsList"></div>
             </div>
          </div>

          <!-- TAB: Cards Center -->
          <div id="tab-cards" class="tab-content">
            <h3 style="margin-bottom: 2rem;">Manage Your Cards</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
              <div class="glass-panel" style="padding: 2rem; border-left: 4px solid var(--primary);">
                 <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                    <div style="background: rgba(0,210,255,0.1); width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    </div>
                    <span class="text-success" style="font-size: 0.75rem; font-weight: 700; background: rgba(16, 185, 129, 0.1); padding: 0.25rem 0.5rem; border-radius: 4px;">ACTIVE</span>
                 </div>
                 <h4>Virtual Platinum Mastercard</h4>
                 <p class="text-muted" style="margin: 1rem 0; font-size: 0.9rem;">Unlimited online transactions with real-time fraud protection.</p>
                 <button class="btn btn-secondary" style="width: 100%; font-size: 0.85rem;">View Card Details</button>
              </div>

              <div class="glass-panel" style="padding: 2rem; border: 1px solid #d4af37; background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%);">
                 <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                    <div style="background: rgba(212, 175, 55, 0.1); width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #d4af37;">PREMIUM TIER</span>
                 </div>
                 <h4>Gold Credit Card</h4>
                 <ul style="margin: 1rem 0; padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-muted);">
                    <li>0% APR for the first 6 months</li>
                    <li>Up to $50,000 credit limit</li>
                    <li>Exclusive travel rewards</li>
                 </ul>
                 <button class="btn btn-primary" style="width: 100%; background: #d4af37; border: none; color: #1a1a1a;" id="applyGoldBtn">Apply for Gold Credit</button>
              </div>
            </div>
          </div>

          <!-- TAB: Security & Settings -->
          <div id="tab-password" class="tab-content">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
               <div class="glass-panel" style="padding: 2rem;">
                 <h3 style="margin-bottom: 1.5rem;">Security Credentials</h3>
                 <form id="changePasswordForm">
                   <div class="form-group">
                     <label class="form-label">Current Password</label>
                     <input type="password" class="form-control" placeholder="••••••••">
                   </div>
                   <div class="form-group">
                     <label class="form-label">New Password</label>
                     <input type="password" class="form-control" required placeholder="Min 8 characters">
                   </div>
                   <div class="form-group">
                     <label class="form-label">Confirm New Password</label>
                     <input type="password" class="form-control" required placeholder="••••••••">
                   </div>
                   <button type="submit" class="btn btn-primary" style="width: 100%;">Update Security Credentials</button>
                 </form>
               </div>

               <div class="glass-panel" style="padding: 2rem;">
                 <h3 style="margin-bottom: 1.5rem;">Account Preferences</h3>
                 <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                       <div>
                          <div style="font-weight: 500;">Two-Factor Authentication</div>
                          <div class="text-muted" style="font-size: 0.8rem;">Add an extra layer of security to your account.</div>
                       </div>
                       <div style="width: 48px; height: 24px; background: var(--success); border-radius: 12px; position: relative; cursor: pointer;">
                          <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>
                       </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                       <div>
                          <div style="font-weight: 500;">Email Notifications</div>
                          <div class="text-muted" style="font-size: 0.8rem;">Get alerts for every transaction via email.</div>
                       </div>
                       <div style="width: 48px; height: 24px; background: var(--success); border-radius: 12px; position: relative; cursor: pointer;">
                          <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>
                       </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                       <div>
                          <div style="font-weight: 500;">Marketing Emails</div>
                          <div class="text-muted" style="font-size: 0.8rem;">Receive news about products and offers.</div>
                       </div>
                       <div style="width: 48px; height: 24px; background: rgba(255,255,255,0.1); border-radius: 12px; position: relative; cursor: pointer;">
                          <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; left: 2px; top: 2px;"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <!-- TAB: My Profile -->
          <div id="tab-profile" class="tab-content">
            <div class="glass-panel" style="padding: 2.5rem;">
              <div style="display: flex; gap: 2.5rem; align-items: center; margin-bottom: 4rem;">
                <div class="profile-avatar-container" style="width: 140px; height: 140px; font-size: 3.5rem; box-shadow: 0 0 20px rgba(0,210,255,0.2);" id="profileViewAvatar"></div>
                <div>
                  <h1 id="profileViewName" style="margin-bottom: 0.25rem;">---</h1>
                  <p class="text-muted" id="profileViewEmail" style="font-size: 1.1rem; margin-bottom: 1.5rem;">---</p>
                  <div style="display: flex; gap: 1rem;">
                     <button class="btn btn-primary" style="padding: 0.5rem 1.5rem; font-size: 0.85rem;" id="triggerEditProfile">Edit Profile</button>
                     <button class="btn btn-secondary" style="padding: 0.5rem 1.5rem; font-size: 0.85rem;">Account Limits</button>
                  </div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;">
                 <div>
                    <h4 style="margin-bottom: 2rem; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">Identity Information</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                       <div>
                          <label class="text-muted" style="font-size: 0.75rem; display: block; margin-bottom: 0.5rem;">Account Number</label>
                          <div id="profileViewAccountNum" style="font-weight: 600; font-family: monospace; font-size: 1.1rem;">---</div>
                       </div>
                       <div>
                          <label class="text-muted" style="font-size: 0.75rem; display: block; margin-bottom: 0.5rem;">Official Status</label>
                          <div id="profileViewStatus" style="font-weight: 600; text-transform: capitalize; color: var(--success);">---</div>
                       </div>
                       <div>
                          <label class="text-muted" style="font-size: 0.75rem; display: block; margin-bottom: 0.5rem;">Phone Number</label>
                          <div id="profileViewPhone" style="font-weight: 600;">---</div>
                       </div>
                       <div>
                          <label class="text-muted" style="font-size: 0.75rem; display: block; margin-bottom: 0.5rem;">Date of Birth</label>
                          <div id="profileViewDob" style="font-weight: 600;">---</div>
                       </div>
                    </div>
                 </div>
                 <div>
                    <h4 style="margin-bottom: 2rem; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">Residential Address</h4>
                    <div id="profileViewAddress" style="font-weight: 500; line-height: 1.8; font-size: 1.1rem;">---</div>
                    <div class="text-muted" style="margin-top: 1rem; font-size: 0.85rem;">Verified residential address on file since account opening.</div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- AI Assistant Floating Bubble -->
      <div id="openAiAssistant" style="position: fixed; bottom: 2rem; right: 2rem; width: 60px; height: 60px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 25px rgba(0,210,255,0.3); z-index: 1000; animation: bounce 2s infinite;">
         <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
         <div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; background: #eab308; border-radius: 50%; border: 2px solid white;"></div>
      </div>

      <!-- AI Assistant Panel -->
      <div id="aiAssistantPanel" class="glass-panel" style="display: none; position: fixed; bottom: 6rem; right: 2rem; width: 350px; height: 500px; flex-direction: column; overflow: hidden; z-index: 1001; animation: slideUp 0.3s ease;">
         <div style="padding: 1.5rem; background: var(--primary); color: white; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
               <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
               </div>
               <div>
                  <div style="font-weight: 700; font-size: 0.9rem;">Nova AI Co-pilot</div>
                  <div style="font-size: 0.7rem; opacity: 0.8;">Online • Financial Advisor</div>
               </div>
            </div>
            <button id="closeAiAssistant" style="background: none; border: none; color: white; cursor: pointer;">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
         </div>
         <div style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; font-size: 0.85rem; align-self: flex-start; max-width: 85%;">
               Hello! I'm your Nova AI co-pilot. I've analyzed your recent spending and notice you could save <strong>$45.00</strong> this month by switching to a weekly grocery budget.
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; font-size: 0.85rem; align-self: flex-start; max-width: 85%;">
               Would you like me to set up a new "Grocery" savings goal for you?
            </div>
         </div>
         <div style="padding: 1rem; border-top: 1px solid var(--border-light); display: flex; gap: 0.5rem;">
            <input type="text" class="form-control" placeholder="Ask Nova AI..." style="font-size: 0.85rem; padding: 0.5rem 1rem;">
            <button class="btn btn-primary" style="padding: 0.5rem;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
         </div>
      </div>

      <!-- Transaction Receipt Modal -->
      <div id="receiptModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; justify-content: center; align-items: center; backdrop-filter: blur(8px);">
         <div class="receipt-container animate-fade-in" style="background: white; width: 90%; max-width: 500px; border-radius: 12px; overflow: hidden; color: #333; position: relative;">
            <button id="closeReceiptBtn" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #eee; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div id="receiptContent">
               <!-- Content populated by main.js -->
            </div>
            <div style="padding: 1.5rem; background: #f9f9f9; border-top: 1px dashed #ddd; display: flex; gap: 1rem;">
               <button class="btn" style="flex: 1; background: #333; color: white;" onclick="window.print()">Download PDF</button>
               <button class="btn" style="flex: 1; background: #eee; color: #333;" id="shareReceiptBtn">Share Receipt</button>
            </div>
         </div>
      </div>

      <!-- Edit User Profile Modal -->
      <div id="userProfileModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
        <div class="glass-panel" style="padding: 2rem; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
          <h3 style="margin-bottom: 1.5rem;">Update Your Information</h3>
          <form id="userProfileForm">
            <!-- Profile Picture Upload -->
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem;">
              <div class="profile-avatar-container" style="width: 100px; height: 100px; margin-bottom: 1rem; cursor: pointer;" id="modalAvatarContainer"></div>
              <label for="profilePicInput" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem;">
                Change Photo
              </label>
              <input type="file" id="profilePicInput" accept="image/*" style="display: none;">
              <input type="hidden" id="profilePicBase64">
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" id="userEditDob" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" id="userEditPhone" class="form-control" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label">SSN / ID Number</label>
                <input type="text" id="userEditSsn" class="form-control" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label">Street Address</label>
                <input type="text" id="userEditAddress" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">City</label>
                <input type="text" id="userEditCity" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">State</label>
                <input type="text" id="userEditState" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">Zip Code</label>
                <input type="text" id="userEditZip" class="form-control" required>
              </div>
            </div>
            
            <div id="userProfileMessage" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
              <button type="button" class="btn" id="closeUserProfileModal" style="background: rgba(255,255,255,0.1); color: white;">Cancel</button>
              <button type="submit" class="btn btn-primary" id="saveUserProfileBtn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};
