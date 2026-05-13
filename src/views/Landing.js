export const LandingView = (user) => {
  return `
    <div class="landing-page animate-fade-in">
      <nav class="navbar glass-panel" style="position: fixed; top: 1.5rem; left: 50%; transform: translateX(-50%); width: 90%; max-width: 1200px; z-index: 1000; border-radius: 40px; padding: 0.8rem 2rem;">
        <a href="/" class="navbar-brand" style="display: flex; align-items: center; gap: 0.8rem;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span style="font-weight: 800; font-size: 1.4rem; letter-spacing: -0.5px;">Nova Bank</span>
        </a>
        <div class="nav-links" style="display: flex; align-items: center; gap: 0.5rem;">
          ${user ? `
            <a href="/dashboard" class="btn btn-primary" data-link style="border-radius: 30px; padding: 0.5rem 1.5rem; font-size: 0.85rem;">Dashboard</a>
          ` : `
            <a href="/login" class="btn" style="color: var(--text-main); font-weight: 600; font-size: 0.85rem; padding: 0.5rem 0.8rem;">Login</a>
            <a href="/register" class="btn btn-primary" data-link style="border-radius: 30px; padding: 0.5rem 1rem; font-size: 0.85rem;">Open Account</a>
          `}
        </div>
      </nav>

      <section class="hero-section flex-center" style="min-height: 100vh; padding-top: 100px;">
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
            <a href="#features" class="btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 1.1rem; padding: 1.2rem 2.5rem; border-radius: 40px;">Explore Features</a>
          </div>
        </div>
      </section>

      <section id="features" class="section-padding" style="padding: 100px 0;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem;">Engineered for <span class="text-gradient">Excellence</span></h2>
            <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Everything you need to manage your finances with speed, security, and intelligence.</p>
          </div>
          <div class="responsive-grid-3">
            <div class="glass-panel" style="padding: 3rem 2rem; text-align: center; border-bottom: 3px solid var(--primary);">
              <div style="width: 60px; height: 60px; background: rgba(0,210,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 style="margin-bottom: 1.5rem;">Secure by Design</h3>
              <p class="text-muted">Enterprise-grade encryption and real-time biometric fraud monitoring systems.</p>
            </div>
            <div class="glass-panel" style="padding: 3rem 2rem; text-align: center; border-bottom: 3px solid var(--secondary);">
              <div style="width: 60px; height: 60px; background: rgba(58, 123, 213, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 style="margin-bottom: 1.5rem;">Instant Transfers</h3>
              <p class="text-muted">Send money globally in seconds with ultra-low latency transaction processing.</p>
            </div>
            <div class="glass-panel" style="padding: 3rem 2rem; text-align: center; border-bottom: 3px solid var(--accent);">
              <div style="width: 60px; height: 60px; background: rgba(240, 195, 48, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <h3 style="margin-bottom: 1.5rem;">Smart Insights</h3>
              <p class="text-muted">AI-powered predictive analytics to track, optimize and grow your wealth automatically.</p>
            </div>
          </div>
        </div>
      </section>

      <section style="padding: 100px 0; background: rgba(255,255,255,0.02);">
        <div class="container">
          <div class="responsive-grid-2" style="align-items: center; gap: 5rem;">
            <div>
              <h2 style="font-size: 3rem; margin-bottom: 1.5rem;">The <span class="text-gradient">Nova Card</span> Experience</h2>
              <p class="text-muted" style="font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.8;">Elevate your spending with our premium metal cards. Integrated with world-class security features and exclusive lifestyle rewards.</p>
              <ul style="list-style: none; padding: 0;">
                <li style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Real-time transaction alerts</span>
                </li>
                <li style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Zero international transaction fees</span>
                </li>
                <li style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Complimentary airport lounge access</span>
                </li>
              </ul>
            </div>
            <div style="perspective: 1000px;">
              <div class="mastercard" style="transform: rotateY(-20deg) rotateX(10deg); margin: 0 auto; box-shadow: 0 30px 60px rgba(0,0,0,0.5);">
                 <div class="card-inner">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem;">
                       <div style="font-weight: 800; font-size: 1.2rem; letter-spacing: 2px;">NOVA <span style="font-weight: 300;">PLATINUM</span></div>
                       <svg width="45" height="35" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="7" fill="rgba(255,255,255,0.8)"/><circle cx="17" cy="12" r="7" fill="rgba(255,255,255,0.4)"/></svg>
                    </div>
                    <div style="margin-bottom: 2.5rem;">
                       <div style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; margin-bottom: 0.5rem; letter-spacing: 1.5px;">Card Holder</div>
                       <div style="font-size: 1.4rem; font-weight: 700; letter-spacing: 1px;">VALUED MEMBER</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style="padding: 5rem 0; border-top: 1px solid var(--border-light); text-align: center;">
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

