const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();
require('./config/db');

const app = express();

app.use(helmet());
app.use(cors({ origin: /\.onrender\.com$/ }));
app.use(express.json());

// ✅ Mount trust routes under /api/trust
app.use('/api/trust', require('./routes/trust.routes'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KS1 TRUST] Running on port ${PORT}`);
});
