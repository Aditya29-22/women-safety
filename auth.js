document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const statusMsg = document.getElementById('auth-status');

    // redirect to index if already logged in
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) window.location.href = 'index.html';
    });

    const handleAuth = async (action) => {
        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (!email || !password) {
            statusMsg.style.color = 'var(--danger)';
            statusMsg.textContent = "Please enter both email and password.";
            return;
        }
        
        loginBtn.disabled = true;
        signupBtn.disabled = true;
        statusMsg.textContent = "Working...";
        statusMsg.style.color = 'var(--text-muted)';
        
        try {
            let result;
            if (action === 'login') {
                result = await supabaseClient.auth.signInWithPassword({ email, password });
            } else {
                result = await supabaseClient.auth.signUp({ email, password });
            }
            
            if (result.error) throw result.error;
            
            if (action === 'signup' && result.data.user && !result.data.session) {
                 statusMsg.style.color = '#4ade80';
                 statusMsg.textContent = "Sign up successful! Please check your email to verify if required, or simply log in.";
            } else {
                 window.location.href = 'index.html';
            }
        } catch (error) {
            statusMsg.style.color = 'var(--danger)';
            statusMsg.textContent = error.message;
        } finally {
            loginBtn.disabled = false;
            signupBtn.disabled = false;
        }
    };

    loginBtn.addEventListener('click', () => handleAuth('login'));
    signupBtn.addEventListener('click', () => handleAuth('signup'));
});
