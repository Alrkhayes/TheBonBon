document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('You must log in first.');
        window.location.href = '/login.html'; // Redirect to login page
        return;
    }

    console.log('User ID:', userId); // Debugging

    // Fetch and display user data
    async function fetchUserData() {
        try {
            const response = await fetch(`/data/user/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user data.');

            const userData = await response.json();
            console.log('User Data:', userData);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    }

    fetchUserData();

    // Handle Update Form Submission
    document.getElementById('updateForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const device = document.getElementById('device').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`/users/update/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device, password }),
            });

            const result = await response.json();
            const messageEl = document.getElementById('updateMessage');
            if (response.ok) {
                messageEl.innerText = result.message;
                messageEl.style.color = 'green';
            } else {
                messageEl.innerText = result.message || 'Update failed.';
                messageEl.style.color = 'red';
            }
        } catch (err) {
            console.error('Error updating user information:', err);
            document.getElementById('updateMessage').innerText = 'Server error. Try again.';
            document.getElementById('updateMessage').style.color = 'red';
        }
    });
});
