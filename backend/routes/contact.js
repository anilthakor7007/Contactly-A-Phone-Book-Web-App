const express = require('express');
const Contact = require("../models/Contact");
const { createContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new contact
router.post('/create', authMiddleware, createContact);


// Get all contacts for the logged-in user
router.get('/', authMiddleware, getContacts);

// Update a contact by ID
router.put('/:id', authMiddleware, updateContact);

// Delete a contact by ID
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;