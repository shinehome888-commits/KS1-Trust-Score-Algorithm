const express = require('express');
const { 
  recalculateTrustScore,
  getTrustScore,
  getTrustTier
} = require('../controllers/trust.controller');

const router = express.Router();

router.post('/recalculate', recalculateTrustScore);
router.get('/score/:smeId', getTrustScore);
router.get('/tier/:smeId', getTrustTier);

module.exports = router;
