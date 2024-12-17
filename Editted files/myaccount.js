document.getElementById('updateForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = '675d3102b90c4034406438a5'; // Replace with dynamic user ID
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
        console.error('Error:', err);
        document.getElementById('updateMessage').innerText = 'Server error. Try again.';
        document.getElementById('updateMessage').style.color = 'red';
    }
});
