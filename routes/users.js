const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const router = express.Router();
const User = require('../models/user'); // Import User model

// User registration route
router.post('/register', async (req, res) => {
    const { email, password, device } = req.body;

    // Validate the inputs
    if (!email || !password || !device) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user with the hashed password
        const newUser = new User({ email, password: hashedPassword, device });
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully.' });
    } catch (err) {
        console.error('Error saving user:', err);

        // Handle duplicate email error
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        res.status(500).json({ message: 'Error creating account.' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Username/Password.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Username/Password.' });
        }

        res.status(200).json({ message: 'Login successful.' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// Update user information (device and password)
router.put('/update/:id', async (req, res) => {
    const { password, device } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (device) user.device = device;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.status(200).json({ message: 'User information updated successfully.' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Error updating user information.' });
    }
});


module.exports = router;
