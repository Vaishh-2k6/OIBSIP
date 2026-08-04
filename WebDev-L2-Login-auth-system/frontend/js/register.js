document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const button = document.getElementById('registerButton');
  const strengthBars = document.querySelectorAll('.strength-meter span');

  const fields = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
  };

  fields.password.addEventListener('input', () => {
    updateStrength(fields.password.value);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setLoading(button, true);
    clearErrors();

    try {
      const payload = {
        username: fields.username.value,
        email: fields.email.value,
        password: fields.password.value,
        confirmPassword: fields.confirmPassword.value,
      };

      const response = await requestJson('/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      showToast('Account created successfully. Please log in.', 'success');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1200);
    } catch (error) {
      showToast(error.message || 'Unable to create account', 'error');
      const errorData = error.message || '';
      if (errorData.includes('email')) {
        document.querySelector('[data-error-for="email"]').textContent = 'An account with that email already exists';
      }
    } finally {
      setLoading(button, false);
    }
  });

  function updateStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthBars.forEach((bar, index) => {
      bar.classList.toggle('active', index < Math.min(strength, 3));
    });
  }

  function clearErrors() {
    Object.values(fields).forEach((field) => {
      field.classList.remove('error');
    });
    document.querySelectorAll('.helper-text').forEach((el) => {
      el.textContent = '';
    });
  }
});
