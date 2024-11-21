const User = require("../models/User");
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
// Signup logic
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Received signup data:', { username, email, password });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }


        // Create new user with hashed password
        const newUser = new User({ username, email, password: password });
        await newUser.save();

        // Create a token with user details
        const token = jwt.sign( 
            { user: { id: newUser._id, username: newUser.username, email: newUser.email } }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        console.log('User created successfully, sending token and user data...');
        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: 'Server Error hai bhai kuch gadbad hai' });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Looking for user with email: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'User not found' });
        }

        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Password does not match' });
        }

        console.log('Generating JWT token...');
        const token = jwt.sign(
            { user: { id: user._id, username: user.username, email: user.email } }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        console.log('Login successful, sending token and user data...');
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
        console.log('token and user data sent');
        console.log(token);
        console.log(user.id);
        console.log(user.username);
        console.log(user.email);

    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
