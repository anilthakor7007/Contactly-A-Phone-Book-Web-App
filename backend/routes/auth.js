const express = require('express');
const {signup, login} = require('../controllers/authController');


const router = express.Router();

//signpu route
router.post('/signup', signup);

//login route 
router.post('/login',login);

module.exports = router;