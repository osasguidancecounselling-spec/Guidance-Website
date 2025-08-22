const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const appointmentRoutes = require('./appointment.routes');
const chatRoutes = require('./chat.routes');
const formRoutes = require('./formRoutes.js');

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/chat', chatRoutes);
router.use('/forms', formRoutes);

module.exports = router;