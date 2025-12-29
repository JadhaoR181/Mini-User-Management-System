require('dotenv').config();
const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const password = 'Admin@123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Admin Password Hash Generated:\n');
    console.log('Password:', password);
    console.log('\nHash:', hash);
    console.log('\n📋 Copy this hash and update your database!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

generateHash();
