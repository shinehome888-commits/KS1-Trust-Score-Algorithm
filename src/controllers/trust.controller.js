const TrustScore = require('../models/TrustScore.model');

// ... other functions (recalculateTrustScore, etc.)

// ✅ getStats MUST be here
const getStats = async (req, res) => {
  try {
    const scores = await TrustScore.find().select('trustScore');
    const avg = scores.length 
      ? parseFloat((scores.reduce((sum, s) => sum + s.trustScore, 0) / scores.length).toFixed(1))
      : 50;
    res.json({ average: avg });
  } catch (err) {
    res.status(500).json({ average: 50 });
  }
};

// ✅ EXPORT IT
module.exports = {
  recalculateTrustScore,
  getTrustScore,
  getLeaderboard,
  getStats  // ← must be exported
};
