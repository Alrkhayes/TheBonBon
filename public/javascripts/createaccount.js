document.getElementById('create-account-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    // Collect form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const device = document.getElementById('device').value;

    // Validate inputs
    if (!email || !password || !device) {
        alert('Please fill in all fields.');
        return;
    }

    // Validate password strength
    if (!isPasswordStrong(password)) {
        alert('Your password is not strong enough. Please use a stronger password.');
        return;
    }

    try {
        const response = await fetch('/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, device }),
        });

        if (response.ok) {
            alert('Account created successfully!');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (err) {
        console.error('Error creating account:', err);
        alert('An error occurred. Please try again.');
    }
});

// Password strength checker
const passwordInput = document.getElementById('password');
const passwordStrength = document.getElementById('password-strength');

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    passwordStrength.classList.remove('short', 'weak', 'strong');

    if (value.length < 8) {
        passwordStrength.textContent = 'Password too short';
        passwordStrength.classList.add('short');
    } else if (!/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*]/.test(value)) {
        passwordStrength.textContent = 'Weak Password (add uppercase, number, and symbol)';
        passwordStrength.classList.add('weak');
    } else {
        passwordStrength.textContent = 'Strong Password';
        passwordStrength.classList.add('strong');
    }
});

// Helper function to check if a password is strong
function isPasswordStrong(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
}
