document.addEventListener('DOMContentLoaded', async () => {
    const userId = '675d3102b90c4034406438a5'; // Replace with dynamic user ID

    // Fetch user data and plot graphs
    async function fetchUserData() {
        try {
            const response = await fetch(`/data/user/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user data');

            const userData = await response.json();
            console.log('Fetched User Data (recent 10):', userData);

            const timestamps = userData.map(d =>
                new Date(d.publishedAt).toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
            const avgBPM = userData.map(d => d.avgBPM);
            const spO2 = userData.map(d => d.spO2);

            if (!timestamps.length || !avgBPM.length || !spO2.length) {
                alert('No data available to plot.');
                return;
            }

            const weeklySummary = calculateWeeklySummary(userData);
            plotAvgBPM(timestamps, avgBPM);
            plotSpO2(timestamps, spO2);
            plotWeeklySummary(weeklySummary);
            fetchTodaysSummary(userData);
        } catch (err) {
            console.error('Error fetching user data:', err);
            alert('Failed to load data. Please try again later.');
        }
    }

    // Fetch Today's Max and Min Heart Rate
    function fetchTodaysSummary(userData) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day

        const todaysData = userData.filter(d => {
            const publishedDate = new Date(d.publishedAt);
            return publishedDate >= today;
        });

        if (!todaysData.length) {
            document.getElementById('maxHeartRate').innerText = 'No data';
            document.getElementById('minHeartRate').innerText = 'No data';
            return;
        }

        const heartRates = todaysData.map(d => d.avgBPM);
        document.getElementById('maxHeartRate').innerText = Math.max(...heartRates);
        document.getElementById('minHeartRate').innerText = Math.min(...heartRates);
    }

    // Calculate Weekly Summary
    function calculateWeeklySummary(userData) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const groupedData = {};

        userData.forEach(data => {
            const day = daysOfWeek[new Date(data.publishedAt).getDay()];
            if (!groupedData[day]) groupedData[day] = [];
            groupedData[day].push(data.avgBPM);
        });

        return daysOfWeek.map(day => {
            const data = groupedData[day] || [];
            return {
                day,
                avg: data.length ? data.reduce((a, b) => a + b, 0) / data.length : 0,
                max: data.length ? Math.max(...data) : 0,
                min: data.length ? Math.min(...data) : 0,
            };
        });
    }

    // Plot Avg BPM
    function plotAvgBPM(timestamps, avgBPM) {
        const ctx = document.getElementById('avgBPMChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Heart Rate (BPM)',
                    data: avgBPM,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                }],
            },
            options: { responsive: true, plugins: { title: { display: true, text: 'Heart Rate (BPM) Over Time (Recent 10)' } } },
        });
    }

    // Plot SpO2
    function plotSpO2(timestamps, spO2) {
        const ctx = document.getElementById('spO2Chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Blood Oxygen (SpO2)',
                    data: spO2,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                }],
            },
            options: { responsive: true, plugins: { title: { display: true, text: 'Blood Oxygen (SpO2) Over Time (Recent 10)' } } },
        });
    }

    // Plot Weekly Summary
    function plotWeeklySummary(weeklySummary) {
        const ctx = document.getElementById('weeklySummaryChart').getContext('2d');
        const labels = weeklySummary.map(d => d.day);
        const avgData = weeklySummary.map(d => d.avg);
        const maxData = weeklySummary.map(d => d.max);
        const minData = weeklySummary.map(d => d.min);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Avg AvgBPM', data: avgData, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
                    { label: 'Max AvgBPM', data: maxData, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
                    { label: 'Min AvgBPM', data: minData, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
                ],
            },
            options: { responsive: true, plugins: { title: { display: true, text: 'Weekly Summary (Avg, Max, Min AvgBPM)' } } },
        });
    }

    // Dropdown for Switching Graphs
    document.getElementById('chart-selector').addEventListener('change', (event) => {
        const graphs = ['avgBPMGraph', 'spO2Graph', 'weeklySummaryGraph'];
        graphs.forEach(id => document.getElementById(id).style.display = 'none');

        const selectedGraph = event.target.value + 'Graph';
        document.getElementById(selectedGraph).style.display = 'block';
    });

    // Form Submission for Updating User Information
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

    // Fetch user data when the page loads
    fetchUserData();
});
