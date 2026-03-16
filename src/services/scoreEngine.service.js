// src/services/scoreEngine.service.js

const getTrustTier = (score) => {
  if (score >= 90) return 'Platinum';
  if (score >= 75) return 'Gold';
  if (score >= 60) return 'Silver';
  if (score >= 40) return 'Bronze';
  return 'High Risk';
};

const normalize = (value, min, max) => {
  if (max === min) return 1;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

exports.calculateTrustScore = (data) => {
  const {
    completedTransactions = 0,
    failedTransactions = 0,
    disputesCount = 0,
    tradeVolume = 0,
    kycStatus = false
  } = data;

  // 1. Transaction Completion Rate (30%)
  const totalTx = completedTransactions + failedTransactions;
  const completionRate = totalTx > 0 ? completedTransactions / totalTx : 1;
  const txScore = completionRate * 100;

  // 2. Delivery Reliability (20%) → assumed same as completion for now
  const deliveryScore = txScore;

  // 3. Dispute History (20%)
  const disputePenalty = totalTx > 0 ? (disputesCount / totalTx) * 100 : 0;
  const disputeScore = Math.max(0, 100 - disputePenalty);

  // 4. Trade Volume (15%)
  const volumeScore = normalize(tradeVolume, 0, 100000) * 100; // scale to 100k GHS

  // 5. KYC Verification (15%)
  const kycScore = kycStatus ? 100 : 0;

  // Weighted sum
  let rawScore = 
    (txScore * 0.30) +
    (deliveryScore * 0.20) +
    (disputeScore * 0.20) +
    (volumeScore * 0.15) +
    (kycScore * 0.15);

  // Clamp to 0–100
  const finalScore = Math.round(Math.max(0, Math.min(100, rawScore)));
  const tier = getTrustTier(finalScore);

  return { score: finalScore, tier };
};
