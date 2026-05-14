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
          <button type="button" class="btn btn-primary" style="width: 100%;" id="submitBtn">Create Account</button>
        </form>
        
        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem;">
          <p class="text-muted">Already have an account? <a href="/login" data-link style="color: var(--primary); text-decoration: none;">Sign in</a></p>
        </div>
    </div>
  `;
};

