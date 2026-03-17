'use strict';
const express = require('express');
const router  = express.Router();
const reportsController = require('../controllers/reportsController');

// Puppet agent posts a report here (configured via reporturl in puppet.conf)
router.post('/',            reportsController.receiveReport);

// Dashboard queries
router.get('/',             reportsController.getAllReports);
router.get('/:id',          reportsController.getReportById);
router.get('/node/:node',   reportsController.getReportsByNode);
router.delete('/:id',       reportsController.deleteReport);

module.exports = router;
