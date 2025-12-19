const bcrypt = require('bcryptjs');

async function testPasswords() {
  const password = 'freelancer123';
  const hash1 = '$2b$10$H0KLV8w7u5fJ5rZ8XqF6EO5gKF.qp1kXZYLK7zXLY.7N8BqQYdZ0q';
  
  // Test if password matches the hash
  const match = await bcrypt.compare(password, hash1);
  console.log(`Password '${password}' matches hash: ${match}`);
  
  // Generate new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log(`New hash for '${password}': ${newHash}`);
  
  // Test various passwords
  const passwords = ['freelancer123', 'admin123', 'client123'];
  for (const pwd of passwords) {
    const hash = await bcrypt.hash(pwd, 10);
    console.log(`${pwd}: ${hash}`);
  }
}

testPasswords().catch(console.error);
