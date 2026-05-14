export const RegisterView = () => {
  return `
    <div class="container flex-center" style="min-height: 100vh; padding: 2rem 0;">
      <div class="glass-panel animate-fade-in" style="width: 100%; max-width: 450px; padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <a href="/" class="navbar-brand flex-center" style="margin-bottom: 1rem; justify-content: center;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </a>
          <h2>Open an Account</h2>
          <p class="text-muted">Join the premium banking experience</p>
        </div>
        
        <form id="registerForm">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="fullName" class="form-control" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="email" class="form-control" required placeholder="name@example.com">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="password" class="form-control" required placeholder="Minimum 6 characters" minlength="6">
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" id="confirmPassword" class="form-control" required placeholder="Repeat password">
          </div>
          <div id="errorMessage" class="text-danger" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
          <button type="submit" class="btn btn-primary" style="width: 100%;" id="submitBtn">Create Account</button>
        </form>

        <div style="display: flex; align-items: center; margin: 1.5rem 0;">
          <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
          <div style="padding: 0 1rem; color: var(--text-muted); font-size: 0.85rem;">OR</div>
          <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
        </div>

        <button type="button" class="btn btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);" id="googleRegisterBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" stroke="none"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" stroke="none"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" stroke="none"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" stroke="none"/></svg>
          Sign up with Google
        </button>
        
        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem;">
          <p class="text-muted">Already have an account? <a href="/login" data-link style="color: var(--primary); text-decoration: none;">Sign in</a></p>
        </div>
    </div>
  `;
};

