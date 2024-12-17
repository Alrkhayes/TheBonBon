const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User schema

// Admin route: Create a new user
router.post('/create', async (req, res) => {
    const { email, password, device } = req.body;

    if (!email || !password || !device) {
        return res.status(400).json({ message: 'All fields (email, password, device) are required.' });
    }

    try {
        const newUser = new User({ email, password, device });
        await newUser.save();
        res.status(201).json({ message: `User (${email}) created successfully.` });
    } catch (err) {
        console.error('Error creating user:', err);
        if (err.code === 11000) {
            res.status(409).json({ message: 'Email already exists.' });
        } else {
            res.status(500).json({ message: 'Error creating user.' });
        }
    }
});

// Admin route: Get user details by email
router.post('/read', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required to search.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `No user found with email: ${email}` });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error reading user:', err);
        res.status(500).json({ message: 'Error reading user.' });
    }
});

// Admin route: Delete user by email
router.post('/delete', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required to delete.' });
    }

    try {
        const result = await User.deleteOne({ email });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `No user found with email: ${email}` });
        }
        res.status(200).json({ message: `User (${email}) deleted successfully.` });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Error deleting user.' });
    }
});

// Admin route: Fetch all users
router.get('/readAll', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching all users:', err);
        res.status(500).json({ message: 'Error fetching all users.' });
    }
});

module.exports = router;
