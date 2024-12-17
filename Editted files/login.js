document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form values
    const email = document.getElementById('username').value; // Change `username` to `email`
    const password = document.getElementById('password').value;

    try {
        // Send login request
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json(); // Parse response JSON

        if (response.ok) {
            // Store userId and email in localStorage
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('email', data.email);

            console.log('Login successful. User ID:', data.userId);

            // Redirect to myaccount.html
            window.location.href = 'myaccount.html';
        } else {
            // Display an error message from the server
            alert(data.message || 'Invalid Username/Password. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    }
});
