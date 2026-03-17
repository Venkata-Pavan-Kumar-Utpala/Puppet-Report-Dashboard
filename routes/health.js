'use strict';
const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status:    'UP',
    timestamp: new Date().toISOString(),
    service:   'puppet-report-dashboard',
    version:   '1.0.0',
  });
});

module.exports = router;
