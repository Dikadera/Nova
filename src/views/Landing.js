export const LandingView = () => {
  return `
    <div class="container animate-fade-in">
      <nav class="navbar">
        <a href="/" class="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Nova Bank
        </a>
        <div class="nav-links">
          <a href="/login" class="btn btn-secondary" data-link>Login</a>
          <a href="/register" class="btn btn-primary" data-link style="margin-left: 10px;">Open Account</a>
        </div>
      </nav>

      <div class="hero flex-center" style="min-height: 80vh; flex-direction: column; text-align: center;">
        <h1 class="delay-100 animate-fade-in" style="margin-bottom: 1rem; max-width: 800px; font-size: 4rem;">
          The Future of <span class="text-gradient">Premium Banking</span> is Here
        </h1>
        <p class="text-muted delay-200 animate-fade-in" style="font-size: 1.25rem; max-width: 600px; margin-bottom: 2rem;">
          Experience unparalleled security, lightning-fast transactions, and a beautifully crafted interface designed for the modern world.
        </p>
        <div class="delay-300 animate-fade-in">
          <a href="/register" class="btn btn-primary" data-link style="font-size: 1.125rem; padding: 1rem 2rem;">Get Started Today</a>
        </div>
        
        <div class="features glass-panel delay-300 animate-fade-in" style="margin-top: 4rem; display: flex; gap: 2rem; padding: 2rem; width: 100%; max-width: 900px; text-align: left;">
          <div style="flex: 1;">
            <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Secure by Design</h3>
            <p class="text-muted">Enterprise-grade encryption and real-time fraud monitoring.</p>
          </div>
          <div style="flex: 1;">
            <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">Instant Transfers</h3>
            <p class="text-muted">Send money globally in seconds with zero hidden fees.</p>
          </div>
          <div style="flex: 1;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Smart Insights</h3>
            <p class="text-muted">AI-powered analytics to track and grow your wealth.</p>
          </div>
        </div>
      </div>
    </div>
  `;
};
