const registerForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.redirected) {
            window.location.href = response.url; 
        } else {
            const data = await response.json();
            errorMessage.textContent = data.error; 
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.textContent = 'An error occurred during registration';
    }
});
