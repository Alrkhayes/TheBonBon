document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Show/Hide Password Functionality
        const passwordInput = document.getElementById('password');
        const showPasswordCheckbox = document.getElementById('show-password');

        showPasswordCheckbox.addEventListener('change', () => {
            if (showPasswordCheckbox.checked) {
                passwordInput.type = 'text'; // Show password
            } else {
                passwordInput.type = 'password'; // Hide password
            }
        });

    // Get form values
    const email = document.getElementById('username').value; // Change `username` to `email`
    const password = document.getElementById('password').value;

    try {
        // Send login request
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }), // Use `email`
        });

        if (response.ok) {
            window.location.href = 'myaccount.html'; // Redirect on success
        } else {
            alert('Invalid Username/Password. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    }
});
