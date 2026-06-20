export const LandingView = (user) => {
  return `
    <div class="landing-page animate-fade-in" style="position: relative; overflow: hidden;">
      <!-- Interactive Cursor Follower Glow -->
      <div class="interactive-cursor-glow" id="interactiveCursorGlow"></div>

      <!-- Navbar -->
      <nav class="navbar glass-panel" style="position: fixed; top: 1.5rem; left: 50%; transform: translateX(-50%); width: 90%; max-width: 1200px; z-index: 1000; border-radius: 40px; padding: 0.8rem 2rem;">
        <a href="/" class="navbar-brand" style="display: flex; align-items: center; gap: 0.8rem;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span style="font-weight: 800; font-size: 1.4rem; letter-spacing: -0.5px;">Nova Bank</span>
        </a>
        <div class="nav-links" style="display: flex; align-items: center; gap: 0.5rem;">
          ${user ? `
            <a href="${window.currentUserProfile?.role === 'admin' ? '/admin' : '/dashboard'}" class="btn btn-primary" data-link style="border-radius: 30px; padding: 0.5rem 1.5rem; font-size: 0.85rem;">
               ${window.currentUserProfile?.role === 'admin' ? 'Admin Portal' : 'Dashboard'}
            </a>
          ` : `
            <a href="/login" class="btn" style="color: var(--text-main); font-weight: 600; font-size: 0.85rem; padding: 0.5rem 0.8rem;">Login</a>
            <a href="/register" class="btn btn-primary" data-link style="border-radius: 30px; padding: 0.5rem 1rem; font-size: 0.85rem;">Open Account</a>
          `}
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero-section flex-center" style="min-height: 100vh; padding-top: 120px; padding-bottom: 50px; position: relative; z-index: 2;">
        <div class="hero-content" style="text-align: center; max-width: 1000px; padding: 0 1rem;">
          <div class="badge animate-fade-in" style="display: inline-block; padding: 0.5rem 1.2rem; background: rgba(0,210,255,0.1); border: 1px solid rgba(0,210,255,0.2); border-radius: 30px; color: var(--primary); font-size: 0.85rem; font-weight: 700; margin-bottom: 2rem; letter-spacing: 1px;">
             SECURE • FAST • BORDERLESS
          </div>
          <h1 class="hero-title animate-fade-in" style="margin-bottom: 1.5rem; font-size: clamp(2.5rem, 8vw, 5rem); line-height: 1.1; font-weight: 800;">
            The Future of <span class="text-gradient">Premium Banking</span> is Here
          </h1>
          <p class="hero-subtitle text-muted animate-fade-in" style="font-size: clamp(1rem, 4vw, 1.35rem); max-width: 700px; margin: 0 auto 3rem; line-height: 1.6;">
            Experience unparalleled security, lightning-fast transactions, and a beautifully crafted interface designed for the modern financial world.
          </p>
          <div class="hero-btns animate-fade-in" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/register" class="btn btn-primary" data-link style="font-size: 1.1rem; padding: 1.2rem 2.5rem; border-radius: 40px; box-shadow: 0 10px 30px rgba(0,210,255,0.3);">Get Started Now</a>
            <a href="#simulator" class="btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 1.1rem; padding: 1.2rem 2.5rem; border-radius: 40px;">Wealth Simulator</a>
          </div>
        </div>
      </section>

      <!-- Standard Features Grid -->
      <section id="features" class="section-padding reveal-on-scroll" style="padding: 100px 0; position: relative; z-index: 2;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem;">Engineered for <span class="text-gradient">Excellence</span></h2>
            <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Everything you need to manage your finances with speed, security, and intelligence.</p>
          </div>
          <div class="responsive-grid-3">
            
            <!-- Feature Card 1 -->
            <div class="interactive-feature-card">
              <div class="interactive-feature-card-inner glass-panel" style="padding: 3rem 2rem; text-align: center; border-bottom: 3px solid var(--primary); border-radius: 20px; height: 100%;">
                <div style="width: 60px; height: 60px; background: rgba(0,210,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 style="margin-bottom: 1.5rem; font-weight: 700;">Secure by Design</h3>
                <p class="text-muted">Enterprise-grade encryption and real-time biometric fraud monitoring systems.</p>
              </div>
            </div>

            <!-- Feature Card 2 -->
            <div class="interactive-feature-card">
              <div class="interactive-feature-card-inner glass-panel" style="padding: 3rem 2rem; text-align: center; border-bottom: 3px solid var(--secondary); border-radius: 20px; height: 100%;">
                <div style="width: 60px; height: 60px; background: rgba(58, 123, 213, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <h3 style="margin-bottom: 1.5rem; font-weight: 700;">Instant Transfers</h3>
                <p class="text-muted">Send money globally in seconds with ultra-low latency transaction processing.</p>
              </div>
            </div>

            <!-- Feature Card 3 -->
            <div class="interactive-feature-card">
              <div class="interactive-feature-card-inner glass-panel" style="padding: 3rem 2rem; text-align: center; border-bottom: 3px solid var(--accent); border-radius: 20px; height: 100%;">
                <div style="width: 60px; height: 60px; background: rgba(240, 195, 48, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <h3 style="margin-bottom: 1.5rem; font-weight: 700;">Smart Insights</h3>
                <p class="text-muted">AI-powered predictive analytics to track, optimize and grow your wealth automatically.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Wealth Simulator Section -->
      <section id="simulator" class="section-padding reveal-on-scroll" style="padding: 100px 0; background: rgba(255,255,255,0.01); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); position: relative; z-index: 2;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem;">Project Your <span class="text-gradient">Wealth Growth</span></h2>
            <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Interact with our wealth simulator and see how high-yield plans can compound your wealth over time.</p>
          </div>
          
          <div class="simulator-container">
            <div class="simulator-controls glass-panel" style="padding: 2.5rem; border-radius: 20px;">
              
              <!-- Initial Deposit Slider -->
              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-label">Initial Deposit</span>
                  <span id="initialValue" class="slider-value">$10,000</span>
                </div>
                <input type="range" id="initialSlider" class="custom-range-slider" min="1000" max="100000" step="1000" value="10000">
              </div>

              <!-- Monthly Savings Slider -->
              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-label">Monthly Contribution</span>
                  <span id="monthlyValue" class="slider-value">$500</span>
                </div>
                <input type="range" id="monthlySlider" class="custom-range-slider" min="0" max="5000" step="50" value="500">
              </div>

              <!-- Time Horizon Slider -->
              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-label">Time Horizon</span>
                  <span id="yearsValue" class="slider-value">10 Years</span>
                </div>
                <input type="range" id="yearsSlider" class="custom-range-slider" min="1" max="30" step="1" value="10">
              </div>

              <!-- Interest Rates Plan Choice -->
              <div class="slider-group" style="margin-top: 0.5rem;">
                <span class="slider-label">Select Growth Strategy</span>
                <div class="plan-cards-grid">
                  <div class="plan-card-option selected" data-rate="4.5" id="planSavings">
                    <div class="plan-card-name">Premium Yield</div>
                    <div class="plan-card-rate">4.5% <span style="font-size: 0.8rem; font-weight: 500;">APY</span></div>
                  </div>
                  <div class="plan-card-option" data-rate="8.5" id="planBalanced">
                    <div class="plan-card-name">Balanced Growth</div>
                    <div class="plan-card-rate">8.5% <span style="font-size: 0.8rem; font-weight: 500;">APY</span></div>
                  </div>
                  <div class="plan-card-option" data-rate="12.0" id="planAggressive">
                    <div class="plan-card-name">Elite Equity</div>
                    <div class="plan-card-rate">12.0% <span style="font-size: 0.8rem; font-weight: 500;">APY</span></div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Results Output -->
            <div class="simulator-results glass-panel" style="padding: 2.5rem; border-radius: 20px;">
              <div class="results-header">
                <div class="results-title">Projected Wealth</div>
                <div id="simTotalBalance" class="results-total" style="transition: text-content 0.3s ease;">$102,400.00</div>
              </div>

              <div class="results-breakdown-details">
                <!-- Principal Contribution Row -->
                <div class="breakdown-row">
                  <div class="breakdown-label">
                    <div class="breakdown-dot" style="background: var(--secondary);"></div>
                    <span>Total Invested Principal</span>
                  </div>
                  <div id="simPrincipalVal" class="breakdown-val">$70,000.00</div>
                </div>

                <!-- Interest Compounded Row -->
                <div class="breakdown-row">
                  <div class="breakdown-label">
                    <div class="breakdown-dot" style="background: var(--primary);"></div>
                    <span>Interest Compounded</span>
                  </div>
                  <div id="simInterestVal" class="breakdown-val">$32,400.00</div>
                </div>
              </div>

              <!-- Breakdown Bar Chart -->
              <div class="wealth-breakdown-bar">
                <div id="simBarPrincipal" class="bar-principal" style="width: 70%;"></div>
                <div id="simBarInterest" class="bar-interest" style="width: 30%;"></div>
              </div>

              <div style="margin-top: auto; padding-top: 1.5rem;">
                <a href="/register" class="btn btn-primary" data-link style="width: 100%; padding: 1.1rem; border-radius: 30px; font-weight: 700; font-size: 0.95rem;">Lock In This Rate Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Card Experience & Customizer Section -->
      <section id="card-customizer" class="section-padding reveal-on-scroll" style="padding: 100px 0; position: relative; z-index: 2;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem;">Design Your <span class="text-gradient">Nova Platinum Card</span></h2>
            <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Select your premium finishes, personalize with your name, and feel the tactile luxury of our high-grade metal cards.</p>
          </div>

          <div class="customizer-container">
            <!-- 3D Card Preview -->
            <div class="tilt-card-container">
              <div class="custom-card card-theme-obsidian" id="previewCard">
                <div class="card-hologram-glare" id="cardGlare"></div>
                <div class="card-layer-3d" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; z-index: 5; position: relative;">
                  <!-- Top Logo and Chip -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="font-weight: 800; font-size: 1.25rem; letter-spacing: 2px;">NOVA <span style="font-weight: 300;">PLATINUM</span></div>
                    <svg width="45" height="35" viewBox="0 0 24 24" fill="none" style="opacity: 0.95;">
                      <circle cx="7" cy="12" r="7" fill="rgba(255,255,255,0.85)"/>
                      <circle cx="17" cy="12" r="7" fill="rgba(255,255,255,0.45)"/>
                    </svg>
                  </div>
                  
                  <!-- Chip -->
                  <div style="margin-top: 1rem;">
                    <div class="card-chip"></div>
                  </div>

                  <!-- Card Number Masked -->
                  <div style="margin-top: 1.5rem; margin-bottom: auto;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 1.4rem; letter-spacing: 3px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                      4532  8892  1020  7749
                    </div>
                  </div>

                  <!-- Name and Valid Thru -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                      <div style="font-size: 0.65rem; text-transform: uppercase; opacity: 0.7; margin-bottom: 0.3rem; letter-spacing: 1px;">Card Holder</div>
                      <div id="cardNameDisplay" style="font-size: 1.15rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; min-height: 1.4rem;">YOUR NAME</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 0.55rem; opacity: 0.7; margin-bottom: 0.2rem; letter-spacing: 1px;">VALID THRU</div>
                      <div style="font-size: 0.85rem; font-weight: 600;">12/28</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customizer Options Controls -->
            <div class="customizer-options">
              <!-- Name Input -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="customizerNameInput" style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.75rem;">Engrave Your Name</label>
                <input type="text" id="customizerNameInput" class="form-control" placeholder="YOUR NAME" maxlength="20" style="padding: 1rem 1.25rem; font-size: 1rem; border-radius: 12px; background: rgba(0,0,0,0.3); border-color: var(--border-light);">
              </div>

              <!-- Card Style Select -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.75rem;">Select Metal Finish</label>
                <div class="style-selector-grid">
                  <div class="style-selector-btn active" data-theme="obsidian">
                    <div class="style-preview-dot obsidian"></div>
                    <div class="style-name">Midnight Obsidian</div>
                  </div>
                  <div class="style-selector-btn" data-theme="nebula">
                    <div class="style-preview-dot nebula"></div>
                    <div class="style-name">Cyber Nebula</div>
                  </div>
                  <div class="style-selector-btn" data-theme="aurora">
                    <div class="style-preview-dot aurora"></div>
                    <div class="style-name">Solar Aurora</div>
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                <p class="text-muted" style="font-size: 0.85rem; line-height: 1.5;">Metal cards are available to all users with active balances above $1,000. Features contactless payments, priority lounge support, and zero exchange fees.</p>
              </div>

              <div style="margin-top: 1rem;">
                <a href="/register" class="btn btn-primary" data-link style="padding: 1.1rem 2.5rem; border-radius: 30px; font-weight: 700;">Claim Your Design</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Live Currency Rates Section -->
      <section id="rates" class="section-padding reveal-on-scroll" style="padding: 100px 0; background: rgba(255,255,255,0.01); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); position: relative; z-index: 2;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem;">Live <span class="text-gradient">Market Exchange</span></h2>
            <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Nova Bank provides institutional grade exchange rates with real-time liquidity and zero hidden spreads.</p>
          </div>

          <!-- Currency Rates Grid -->
          <div class="rates-grid" id="marketRatesContainer">
            <!-- EUR/USD Card -->
            <div class="rate-card glass-panel" id="rate-eurusd">
              <div class="rate-header">
                <span class="rate-pair">EUR / USD</span>
                <span class="rate-icon">€</span>
              </div>
              <div class="rate-value" id="val-eurusd">1.0842</div>
              <div class="rate-change up" id="chg-eurusd">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>+0.12%</span>
              </div>
            </div>

            <!-- GBP/USD Card -->
            <div class="rate-card glass-panel" id="rate-gbpusd">
              <div class="rate-header">
                <span class="rate-pair">GBP / USD</span>
                <span class="rate-icon">£</span>
              </div>
              <div class="rate-value" id="val-gbpusd">1.2678</div>
              <div class="rate-change down" id="chg-gbpusd">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <span>-0.08%</span>
              </div>
            </div>

            <!-- JPY/USD Card -->
            <div class="rate-card glass-panel" id="rate-jpyusd">
              <div class="rate-header">
                <span class="rate-pair">USD / JPY</span>
                <span class="rate-icon">¥</span>
              </div>
              <div class="rate-value" id="val-jpyusd">151.42</div>
              <div class="rate-change up" id="chg-jpyusd">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>+0.22%</span>
              </div>
            </div>

            <!-- BTC/USD Card -->
            <div class="rate-card glass-panel" id="rate-btcusd">
              <div class="rate-header">
                <span class="rate-pair">BTC / USD</span>
                <span class="rate-icon">₿</span>
              </div>
              <div class="rate-value" id="val-btcusd">67,420.50</div>
              <div class="rate-change up" id="chg-btcusd">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>+1.45%</span>
              </div>
            </div>

            <!-- ETH/USD Card -->
            <div class="rate-card glass-panel" id="rate-ethusd">
              <div class="rate-header">
                <span class="rate-pair">ETH / USD</span>
                <span class="rate-icon">Ξ</span>
              </div>
              <div class="rate-value" id="val-ethusd">3,542.80</div>
              <div class="rate-change down" id="chg-ethusd">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <span>-0.54%</span>
              </div>
            </div>

            <!-- Gold Card -->
            <div class="rate-card glass-panel" id="rate-xauusd">
              <div class="rate-header">
                <span class="rate-pair">XAU / USD</span>
                <span class="rate-icon">Au</span>
              </div>
              <div class="rate-value" id="val-xauusd">2,178.45</div>
              <div class="rate-change up" id="chg-xauusd">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>+0.35%</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Client Testimonials Section -->
      <section id="testimonials" class="section-padding reveal-on-scroll" style="padding: 100px 0; position: relative; z-index: 2;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem;">Endorsed by <span class="text-gradient">Innovators</span></h2>
            <p class="text-muted" style="max-width: 600px; margin: 0 auto;">See how global leaders and builders scale their capital using Nova Bank's premium platform.</p>
          </div>

          <div class="testimonials-container glass-panel" style="padding: 3.5rem; border-radius: 24px;">
            <!-- Slide 1 -->
            <div class="testimonial-slide active" data-index="0">
              <p class="testimonial-quote">"Nova Bank completely redesigned my banking experience. The metal card design is gorgeous, but the real magic is the zero foreign conversion fee and the lightning-fast international transfers that run in seconds."</p>
              <div class="testimonial-author">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" alt="Sarah Jenkins" class="author-image">
                <div class="author-info">
                  <div class="author-name">Sarah Jenkins</div>
                  <div class="author-title">CFO, Alpha Ventures</div>
                </div>
              </div>
            </div>

            <!-- Slide 2 -->
            <div class="testimonial-slide" data-index="1">
              <p class="testimonial-quote">"As a tech founder operating across three continents, traditional banking was a logistical nightmare. Nova's borderless accounts and biometric validation let me handle transactions on-the-fly safely."</p>
              <div class="testimonial-author">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Marcus Vance" class="author-image">
                <div class="author-info">
                  <div class="author-name">Marcus Vance</div>
                  <div class="author-title">Co-Founder, Chrono Labs</div>
                </div>
              </div>
            </div>

            <!-- Slide 3 -->
            <div class="testimonial-slide" data-index="2">
              <p class="testimonial-quote">"The Wealth Simulator was my first step. Seeing exact APY projections motivated me to consolidate my capital. Nova Bank yields have given my portfolio unmatched passive return stability."</p>
              <div class="testimonial-author">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt="Elena Rostova" class="author-image">
                <div class="author-info">
                  <div class="author-name">Elena Rostova</div>
                  <div class="author-title">Principal Partner, Zenith Capital</div>
                </div>
              </div>
            </div>

            <!-- Navigation Dots -->
            <div class="carousel-dots">
              <button class="carousel-dot active" data-index="0"></button>
              <button class="carousel-dot" data-index="1"></button>
              <button class="carousel-dot" data-index="2"></button>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="section-padding reveal-on-scroll" style="padding: 100px 0; background: rgba(255,255,255,0.01); border-top: 1px solid var(--border-light); position: relative; z-index: 2;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem;">Frequently Asked <span class="text-gradient">Questions</span></h2>
            <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Answers to commonly asked questions about our security, accounts, and investment yields.</p>
          </div>

          <div class="faq-accordion-list">
            <!-- FAQ 1 -->
            <div class="faq-item glass-panel">
              <button class="faq-trigger" id="faq-trigger-1">
                <span>How secure is my money with Nova Bank?</span>
                <svg class="faq-icon-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="faq-content" id="faq-content-1">
                <div class="faq-content-inner">
                  Nova Bank implements bank-grade security protocols including AES-256 ledger encryption, dual-factor biometric authorization, multi-signature transaction verification, and instant push notification tracking for every single ledger action. Your security is our highest priority.
                </div>
              </div>
            </div>

            <!-- FAQ 2 -->
            <div class="faq-item glass-panel">
              <button class="faq-trigger" id="faq-trigger-2">
                <span>What are the requirements to receive a physical metal card?</span>
                <svg class="faq-icon-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="faq-content" id="faq-content-2">
                <div class="faq-content-inner">
                  All Nova Bank customers with a combined account balance exceeding $1,000 are eligible to apply for a complimentary luxury metal card. There are no additional issuance or customization fees. You can design your card using our dynamic visual customizer.
                </div>
              </div>
            </div>

            <!-- FAQ 3 -->
            <div class="faq-item glass-panel">
              <button class="faq-trigger" id="faq-trigger-3">
                <span>How does the transaction OTP system protect me?</span>
                <svg class="faq-icon-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="faq-content" id="faq-content-3">
                <div class="faq-content-inner">
                  Every outward transfer (internal or external wire transfer) triggers a secure, time-sensitive One-Time Passcode (OTP) delivered to your registered email address. Transactions remain pending in state until this code is correctly verified inside the web app portal, ensuring unauthorized access is fully blocked.
                </div>
              </div>
            </div>

            <!-- FAQ 4 -->
            <div class="faq-item glass-panel">
              <button class="faq-trigger" id="faq-trigger-4">
                <span>Are there international wire transfer charges?</span>
                <svg class="faq-icon-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="faq-content" id="faq-content-4">
                <div class="faq-content-inner">
                  Nova Bank supports fully borderless banking. External wire transfers to supported global partners operate with flat zero service fees. External currencies use mid-market conversion rates directly with no hidden commission marks, saving you up to 8% compared to traditional banks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Section -->
      <footer style="padding: 5rem 0; border-top: 1px solid var(--border-light); text-align: center; position: relative; z-index: 2;">
        <div class="container">
          <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 1rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span style="font-weight: 800; font-size: 1.4rem;">Nova Bank</span>
          </div>
          <p class="text-muted" style="margin-bottom: 2rem;">&copy; 2026 Nova Financial Group. All rights reserved.</p>
          <div style="display: flex; gap: 2rem; justify-content: center;">
            <a href="#" class="text-muted" style="font-size: 0.9rem;">Terms</a>
            <a href="#" class="text-muted" style="font-size: 0.9rem;">Privacy</a>
            <a href="#" class="text-muted" style="font-size: 0.9rem;">Security</a>
          </div>
        </div>
      </footer>
    </div>
  `;
};
