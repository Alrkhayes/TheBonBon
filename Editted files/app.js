const express = require('express');
const cors = require('cors'); // Import CORS middleware
const app = express();

// Generate a random API Key
const API_KEY = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log(`Generated API Key: ${API_KEY}`); // Print the generated API Key on server startup

// Enable CORS
app.use(cors());
app.use(express.json());

// POST route: /activity
app.post('/activity', (req, res) => {
    const { API_Key } = req.body; // Extract only the API_Key from the request body

    // Check if API Key is valid
    const isValidApiKey = API_Key === API_KEY;

    // Log the request body and validation result
    console.log('Received JSON:', JSON.stringify(req.body, null, 4));
    console.log('Validation Result:', isValidApiKey ? 'Success' : 'Failure');

    // Respond with the original JSON and validation result
    if (isValidApiKey) {
        res.status(200).json({
            message: 'Success!',
            received: req.body, // Echo back the full received JSON
        });
    } else {
        res.status(403).json({
            message: 'Failure: Invalid API Key',
            received: req.body, // Echo back the full received JSON
        });
    }
});

// Start the server
const PORT = 3000; // Use port 80
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
