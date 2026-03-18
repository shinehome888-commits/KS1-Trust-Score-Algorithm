const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('✅ MongoDB connected – KS1 Trust Score');
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  }
};

connectDB();
