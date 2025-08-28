const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const appointmentRoutes = require('./appointment.routes');
const chatRoutes = require('./chat.routes');
const formRoutes = require('./form.routes.js');
const dashboardRoutes = require('./dashboard.routes.js');
const settingsRoutes = require('./settingsRoutes.js');
const studentRoutes = require('./studentRoutes.js');
const resourceRoutes = require('./resourceRoutes.js');
const announcementRoutes = require('./announcementRoutes.js');

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/chat', chatRoutes);
router.use('/forms', formRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/students', studentRoutes);
router.use('/resources', resourceRoutes);
router.use('/announcements', announcementRoutes);

module.exports = router;
