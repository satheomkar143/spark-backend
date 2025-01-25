const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { username, password, accessKey } = req.body;

    if(accessKey !== process.env.ACCESS_KEY){
        res.status(400).json({message:'Unauthorised request'});
        return;
    }
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({message:'User created successfully.'});
    } catch (err) {
        res.status(400).json({message:'Error creating user: ' + err.message});
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({message:'Invalid username or password'});


        // Compare the password entered by the user with the stored hash
    user.comparePassword(password, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({message:'Error comparing passwords'});
        }
  
        if (isMatch) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
            res.json({message:"Login successful", token });
        } else {
          res.status(400).json({message:'Invalid username or password'});
        }
    })

       
    } catch (err) {
        res.status(500).json({message:'Error logging in: ' + err.message});
    }
});

module.exports = router;
