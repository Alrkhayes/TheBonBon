document.addEventListener('DOMContentLoaded', async () => {
    const userId = '675d3102b90c4034406438a5';

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

            // Group data by day of the week
            const weeklySummary = calculateWeeklySummary(userData);

            plotAvgBPM(timestamps, avgBPM);
            plotSpO2(timestamps, spO2);
            plotWeeklySummary(weeklySummary);
        } catch (err) {
            console.error('Error fetching user data:', err);
            alert('Failed to load data. Please try again later.');
        }
    }

    // Group data by day of the week and calculate metrics
    function calculateWeeklySummary(userData) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const groupedData = {};
        userData.forEach(data => {
            const day = daysOfWeek[new Date(data.publishedAt).getDay()];
            if (!groupedData[day]) {
                groupedData[day] = [];
            }
            groupedData[day].push(data.avgBPM);
        });

        // Calculate metrics for each day
        const summary = daysOfWeek.map(day => {
            const data = groupedData[day] || [];
            return {
                day,
                avg: data.length ? data.reduce((a, b) => a + b, 0) / data.length : 0,
                max: data.length ? Math.max(...data) : 0,
                min: data.length ? Math.min(...data) : 0,
            };
        });

        return summary;
    }

    // Plot AvgBPM vs. time
    function plotAvgBPM(timestamps, avgBPM) {
        const ctx = document.getElementById('avgBPMChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Heart Rate (BPM)',
                        data: avgBPM,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Heart Rate (BPM) Over Time (Recent 10)' },
                },
                scales: {
                    x: { title: { display: true, text: 'Time' } },
                    y: { title: { display: true, text: 'Heart Rate (BPM)' } },
                },
            },
        });
    }

    // Plot SpO2 vs. time
    function plotSpO2(timestamps, spO2) {
        const ctx = document.getElementById('spO2Chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Blood Oxygen (SpO2)',
                        data: spO2,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Blood Oxygen (SpO2) Over Time (Recent 10)' },
                },
                scales: {
                    x: { title: { display: true, text: 'Time' } },
                    y: { title: { display: true, text: 'SpO2 (%)' } },
                },
            },
        });
    }

    // Plot weekly summary with three bars for each day
    function plotWeeklySummary(weeklySummary) {
        const ctx = document.getElementById('weeklySummaryChart').getContext('2d');

        const labels = weeklySummary.map(d => d.day);
        const avgData = weeklySummary.map(d => d.avg);
        const maxData = weeklySummary.map(d => d.max);
        const minData = weeklySummary.map(d => d.min);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Avg AvgBPM',
                        data: avgData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Max AvgBPM',
                        data: maxData,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Min AvgBPM',
                        data: minData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Weekly Summary (Avg, Max, Min AvgBPM)' },
                },
                scales: {
                    x: { title: { display: true, text: 'Days' } },
                    y: { title: { display: true, text: 'BPM' } },
                },
            },
        });
    }

    // Dropdown functionality
    document.getElementById('chart-selector').addEventListener('change', (event) => {
        document.getElementById('avgBPMGraph').style.display = 'none';
        document.getElementById('spO2Graph').style.display = 'none';
        document.getElementById('weeklySummaryGraph').style.display = 'none';

        const selectedChart = event.target.value;
        if (selectedChart === 'avgBPM') {
            document.getElementById('avgBPMGraph').style.display = 'block';
        } else if (selectedChart === 'spO2') {
            document.getElementById('spO2Graph').style.display = 'block';
        } else if (selectedChart === 'weeklySummary') {
            document.getElementById('weeklySummaryGraph').style.display = 'block';
        }
    });

    fetchUserData();
});
