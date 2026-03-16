const mongoose = require('mongoose');

const TrustScoreSchema = new mongoose.Schema({
  smeId: { type: String, required: true, unique: true, index: true },
  tradeId: { type: String, default: null },
  trustScore: { type: Number, min: 0, max: 100, default: 50 },
  trustTier: { 
    type: String, 
    enum: ['Platinum', 'Gold', 'Silver', 'Bronze', 'High Risk'],
    default: 'Bronze'
  },
  completedTransactions: { type: Number, default: 0 },
  failedTransactions: { type: Number, default: 0 },
  disputesCount: { type: Number, default: 0 },
  tradeVolume: { type: Number, default: 0 }, // in GHS or USD
  kycStatus: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('TrustScore', TrustScoreSchema);
