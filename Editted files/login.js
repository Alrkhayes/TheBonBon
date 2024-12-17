async function loginUser(email, password) {
    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Store userId and email in localStorage
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('email', data.email);

            console.log('Login successful:', data);
            window.location.href = '/myaccount.html'; // Redirect to account page
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Server error. Please try again.');
    }
}

// Example usage
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
});
