document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('adminLoginForm');
  const loginBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', function() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!email.endsWith('@limu.edu.ly')) {
      alert('Please use a valid university email.');
      return;
    }
    alert('Login successful! Redirecting...');
    window.location.href = 'dashboard.html';
  });
});
