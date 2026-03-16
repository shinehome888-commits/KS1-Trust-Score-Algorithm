const TrustScore = require('../models/TrustScore.model');
const { calculateTrustScore } = require('../services/scoreEngine.service');

// Recalculate trust score after event
const recalculateTrustScore = async (req, res) => {
  try {
    const { smeId, eventType, eventData } = req.body;

    if (!smeId) {
      return res.status(400).json({ message: 'smeId required' });
    }

    // Get or create record
    let trust = await TrustScore.findOne({ smeId });
    if (!trust) {
      trust = new TrustScore({ smeId });
    }

    // Update based on event type
    switch (eventType) {
      case 'transaction.completed':
        trust.completedTransactions += 1;
        trust.tradeVolume += eventData.amount || 0;
        break;
      case 'transaction.failed':
        trust.failedTransactions += 1;
        break;
      case 'dispute.opened':
        trust.disputesCount += 1;
        break;
      case 'kyc.verified':
        trust.kycStatus = true;
        break;
      default:
        return res.status(400).json({ message: 'Unknown event type' });
    }

    // Recalculate score
    const { score, tier } = calculateTrustScore({
      completedTransactions: trust.completedTransactions,
      failedTransactions: trust.failedTransactions,
      disputesCount: trust.disputesCount,
      tradeVolume: trust.tradeVolume,
      kycStatus: trust.kycStatus
    });

    trust.trustScore = score;
    trust.trustTier = tier;
    trust.lastUpdated = new Date();

    await trust.save();

    // Log high performers
    if (score >= 90) {
      console.log(`🌟 PLATINUM TRUST: ${smeId} | Tier: ${tier} | Score: ${score}`);
    }

    res.json({ success: true, score, tier, smeId });
  } catch (err) {
    console.error('Trust Score Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current trust score
const getTrustScore = async (req, res) => {
  try {
    const trust = await TrustScore.findOne({ smeId: req.params.smeId });
    if (!trust) {
      return res.status(404).json({ message: 'SME not found' });
    }
    res.json({
      smeId: trust.smeId,
      trustScore: trust.trustScore,
      trustTier: trust.trustTier,
      lastUpdated: trust.lastUpdated
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get trust tier only
const getTrustTier = async (req, res) => {
  try {
    const trust = await TrustScore.findOne({ smeId: req.params.smeId });
    if (!trust) {
      return res.status(404).json({ message: 'SME not found' });
    }
    res.json({ smeId: trust.smeId, trustTier: trust.trustTier });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  recalculateTrustScore,
  getTrustScore,
  getTrustTier
};
