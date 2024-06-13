// login.js
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.redirected) {
      window.location.href = response.url; // Redirect to the main page on success
    } else {
      const data = await response.json();
      errorMessage.textContent = data.error; // Display error message
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = 'An error occurred during login';
  }
});
