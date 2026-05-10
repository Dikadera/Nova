export const LoginView = () => {
  return `
    <div class="container flex-center" style="min-height: 100vh;">
      <div class="glass-panel animate-fade-in" style="width: 100%; max-width: 400px; padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <a href="/" class="navbar-brand flex-center" style="margin-bottom: 1rem; justify-content: center;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </a>
          <h2>Welcome Back</h2>
          <p class="text-muted">Sign in to your Nova Bank account</p>
        </div>
        
        <form id="loginForm">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="email" class="form-control" required placeholder="name@example.com">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="password" class="form-control" required placeholder="••••••••">
          </div>
          <div id="errorMessage" class="text-danger" style="margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
          <button type="submit" class="btn btn-primary" style="width: 100%;" id="submitBtn">Sign In</button>
        </form>
        
        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem;">
          <p class="text-muted">Don't have an account? <a href="/register" data-link style="color: var(--primary); text-decoration: none;">Register here</a></p>
        </div>
      </div>
    </div>
  `;
};
