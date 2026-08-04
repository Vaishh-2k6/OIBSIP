const API_BASE_URL = '/api';

async function requestJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.errors?.general || data.message || 'Request failed');
  }

  return data;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.className = 'toast';
  }, 2600);
}

function setLoading(button, isLoading) {
  const label = button.querySelector('.btn-text');
  const spinner = button.querySelector('.spinner');
  if (!label || !spinner) return;

  if (isLoading) {
    label.hidden = true;
    spinner.hidden = false;
    button.disabled = true;
  } else {
    label.hidden = false;
    spinner.hidden = true;
    button.disabled = false;
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    const icon = toggle.querySelector('.toggle-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('vaishnavi-auth-theme') || 'dark';
  applyTheme(savedTheme);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('vaishnavi-auth-theme', current);
      applyTheme(current);
    });
  }
}

function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      const nextType = input.type === 'password' ? 'text' : 'password';
      input.type = nextType;
      button.textContent = nextType === 'password' ? 'Show' : 'Hide';
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPasswordToggles();
});
