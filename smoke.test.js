const fs = require('fs');
const path = require('path');
const assert = require('assert');

const requiredFiles = ['index.html', 'workspace.html', 'app.js', 'styles.css', 'service-worker.js'];

requiredFiles.forEach(file => {
  const target = path.join(__dirname, file);
  assert.ok(fs.existsSync(target), `${file} should exist`);
  const contents = fs.readFileSync(target, 'utf8');
  assert.ok(contents.trim().length > 0, `${file} should not be empty`);
});

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert.ok(html.includes('Agent 13'), 'index page should mention Agent 13');
assert.ok(html.includes('persona') && html.includes('overlay'), 'index page should include persona and overlay controls');

const workspace = fs.readFileSync(path.join(__dirname, 'workspace.html'), 'utf8');
assert.ok(workspace.toLowerCase().includes('recents'), 'workspace should surface saved chats');
assert.ok(workspace.includes('Continue with Google'), 'workspace should allow Google sign-in');

const serviceWorker = fs.readFileSync(path.join(__dirname, 'service-worker.js'), 'utf8');
assert.ok(/CACHE_NAME/i.test(serviceWorker), 'service worker should define a cache name');

console.log('Smoke tests passed.');
