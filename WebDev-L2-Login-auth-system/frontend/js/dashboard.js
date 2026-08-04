document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await requestJson('/dashboard');
    const user = response.user;
    document.getElementById('welcomeText').textContent = `Welcome, ${user.username} 👋`;
    document.getElementById('userName').textContent = user.username;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('avatarInitial').textContent = user.username.charAt(0).toUpperCase();
    document.getElementById('loginTimestamp').textContent = `Joined ${new Date(user.created_at).toLocaleDateString()}`;
  } catch (error) {
    window.location.href = '/index.html';
  }

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        await requestJson('/logout', { method: 'POST' });
        window.location.href = '/index.html';
      } catch (error) {
        showToast('Logout failed', 'error');
      }
    });
  }
});
