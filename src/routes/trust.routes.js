const express = require('express');
const router = express.Router();
const trustController = require('../controllers/trust.controller');

router.get('/stats', trustController.getStats);

module.exports = router;
