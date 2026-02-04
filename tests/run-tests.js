const path = require('path');
const { execSync } = require('child_process');

console.log('Running refactor tests...');
try {
  // Run the test file with node
  const result = execSync('node tests/refactor.test.js', { stdio: 'inherit' });
  console.log('All tests passed');
  process.exit(0);
} catch (err) {
  console.error('Tests failed');
  process.exit(1);
}
