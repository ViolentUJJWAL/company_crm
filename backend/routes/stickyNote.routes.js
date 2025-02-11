const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const checkActiveStatus = require('../middleware/checkActiveStatus');
const { addStickyNote, deleteStickyNote } = require('../controllers/stickyNote.controller');
const router = express.Router();

// Routes for task management
router.post('/add', authMiddleware, checkActiveStatus, checkRole("CompanyAdmin", "Employee"), addStickyNote);
router.delete('/delete/:noteId', authMiddleware, checkActiveStatus, checkRole("CompanyAdmin", "Employee"), deleteStickyNote);

module.exports = router;
