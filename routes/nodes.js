'use strict';
const express = require('express');
const router  = express.Router();
const nodesController = require('../controllers/nodesController');

router.get('/',              nodesController.getAllNodes);
router.get('/:nodename',     nodesController.getNodeDetail);
router.get('/:nodename/history', nodesController.getNodeHistory);

module.exports = router;
