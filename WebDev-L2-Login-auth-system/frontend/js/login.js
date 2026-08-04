document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const button = document.getElementById('loginButton');
  const fields = {
    identifier: document.getElementById('identifier'),
    password: document.getElementById('password'),
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setLoading(button, true);
    clearErrors();

    try {
      const payload = {
        identifier: fields.identifier.value,
        password: fields.password.value,
      };

      const response = await requestJson('/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      showToast('Login successful. Redirecting...', 'success');
      window.location.href = '/dashboard.html';
    } catch (error) {
      showToast(error.message || 'Unable to sign in', 'error');
      if (error.message.includes('Invalid')) {
        document.querySelector('[data-error-for="identifier"]').textContent = 'Invalid username/email or password';
        document.querySelector('[data-error-for="password"]').textContent = 'Invalid username/email or password';
      }
    } finally {
      setLoading(button, false);
    }
  });

  function clearErrors() {
    Object.values(fields).forEach((field) => {
      field.classList.remove('error');
    });
    document.querySelectorAll('.helper-text').forEach((el) => {
      el.textContent = '';
    });
  }
});
