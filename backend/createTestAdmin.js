const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: 'testadmin@shopez.com' });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      user = new User({
        name: 'Test Admin',
        email: 'testadmin@shopez.com',
        password: hashedPassword,
        isAdmin: true
      });
      await user.save();
      console.log('Test admin created.');
    } else {
      user.isAdmin = true;
      user.password = await bcrypt.hash('password123', 10);
      await user.save();
      console.log('Test admin updated.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
