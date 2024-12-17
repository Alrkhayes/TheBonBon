const express = require('express');
const router = express.Router();
const Data = require('../models/data'); // Import the Data schema
const User = require('../models/user'); // Import the User schema

const API_KEY = "vnoa62an4gp4i3bs8eszdx"; 

// POST /data - Handles incoming data from the Particle device
router.post('/', async (req, res) => {
    const {
        API_Key,
        event,
        data,
        temp1: avgBPM,
        temp2: spO2,
        coreid,
        published_at: publishedAt,
        useried: device,
        fw_version: firmwareVersion,
        public: isPublic
    } = req.body;

    // Validate API Key
    const isValidApiKey = API_Key === API_KEY;
    if (!isValidApiKey) {
        console.log('Invalid API Key');
        return res.status(403).json({ message: 'Invalid API Key' });
    }

    try {
        // Match the useried (device) to the user in the database
        const user = await User.findOne({ device });
        if (!user) {
            console.log(`No user found for device: ${device}`);
            return res.status(404).json({ message: 'Device not associated with any user.' });
        }

        // Create a new Data record
        const newData = new Data({
            userId: user._id,
            event,
            data,
            avgBPM: parseFloat(avgBPM),
            spO2: parseFloat(spO2),
            coreId: coreid,
            publishedAt: new Date(publishedAt),
            firmwareVersion,
            isPublic: isPublic === 'true',
        });

        // Save the record in MongoDB
        await newData.save();

        // Log success and respond
        console.log('Data saved successfully:', newData);
        res.status(201).json({ message: 'Data saved successfully.', data: newData });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// GET /data/user/:userId - Fetch the 10 most recent data points for a specific user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch the 10 most recent data points for the user
        const userData = await Data.find({ userId })
            .sort({ publishedAt: -1 }) // Sort by latest first
            .limit(10);               // Limit to the 10 most recent

        if (!userData.length) {
            return res.status(404).json({ message: 'No data found for this user.' });
        }

        res.status(200).json(userData.reverse()); // Reverse for chronological order
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// GET /data/user/:userId/summary - Fetch summary for the last 7 days
router.get('/user/:userId/summary', async (req, res) => {
    const { userId } = req.params;

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch data for the last 7 days
        const userData = await Data.find({
            userId,
            publishedAt: { $gte: sevenDaysAgo }
        }).sort({ publishedAt: 1 });

        if (!userData.length) {
            return res.status(404).json({ message: 'No data found for the last 7 days.' });
        }

        // Calculate summary statistics
        const avgBPM = userData.map(d => d.avgBPM);
        const spO2 = userData.map(d => d.spO2);

        const summary = {
            avgHeartRate: avgBPM.reduce((a, b) => a + b, 0) / avgBPM.length,
            minHeartRate: Math.min(...avgBPM),
            maxHeartRate: Math.max(...avgBPM),
            avgSpO2: spO2.reduce((a, b) => a + b, 0) / spO2.length,
            minSpO2: Math.min(...spO2),
            maxSpO2: Math.max(...spO2),
        };

        res.status(200).json(summary);
    } catch (err) {
        console.error('Error generating summary:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
