require('dotenv').config();
const userModel = require('./src/models/userModel');

async function testUserModel() {
  try {
    console.log('Testing User Model...\n');

    // Test 1: Check if admin email exists
    console.log('1. Checking if admin@purplemerit.com exists...');
    const exists = await userModel.emailExists('admin@purplemerit.com');
    console.log('   Result:', exists ? '✅ Exists' : '❌ Not found');

    // Test 2: Find admin user
    console.log('\n2. Finding admin user...');
    const admin = await userModel.findByEmail('admin@purplemerit.com');
    if (admin) {
      console.log('   ✅ Found:', admin.full_name, `(${admin.role})`);
    } else {
      console.log('   ❌ Admin not found');
    }

    console.log('\n✅ User Model tests complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
}

testUserModel();
