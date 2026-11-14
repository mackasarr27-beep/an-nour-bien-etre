const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(path, mocks = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'module', 'exports', code)((name) => name === 'server-only' ? {} : name in mocks ? mocks[name] : require(name), module, module.exports);
  return module.exports;
}
test('Cloudinary configuration validates URL and prefers a complete explicit set without disclosing credentials', () => {
  const keys = ['CLOUDINARY_URL','CLOUDINARY_CLOUD_NAME','NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET'];
  const before = keys.map(k => process.env[k]);
  try {
    keys.forEach(k => delete process.env[k]);
    const config = load('lib/cloudinary-config.ts');
    assert.throws(() => config.getCloudinaryCredentials(), config.CloudinaryConfigurationError);
    process.env.CLOUDINARY_URL = 'cloudinary://test-key:test-secret@test-cloud';
    assert.equal(config.getCloudinaryCredentials().cloud_name, 'test-cloud');
    process.env.CLOUDINARY_CLOUD_NAME = 'explicit'; process.env.CLOUDINARY_API_KEY = 'key'; process.env.CLOUDINARY_API_SECRET = 'secret';
    assert.equal(config.getCloudinaryCredentials().cloud_name, 'explicit');
    assert.ok(!JSON.stringify(config.safeCloudinaryError({http_code:401,message:'PRIVATE_KEY_MUST_NOT_APPEAR'})).includes('PRIVATE_KEY'));
  } finally { keys.forEach((k,i) => before[i] === undefined ? delete process.env[k] : process.env[k] = before[i]); }
});
test('Admin authorization rejects missing, malformed, non-admin and revoked tokens; preserves outages as 503', async () => {
  let mode = 'admin';
  const auth = load('lib/admin-api-auth.ts', {
    './admin-emails': { ADMIN_EMAILS: ['admin@example.test'] },
    './firebase-admin': { FirebaseAdminConfigurationError: class extends Error {}, FirebaseAdminInitializationError: class extends Error {},
      getFirebaseAdminAuth: async () => ({ verifyIdToken: async (_, checkRevoked) => {
        assert.equal(checkRevoked, true);
        if (mode === 'revoked') throw {code:'auth/id-token-revoked'};
        if (mode === 'outage') throw {code:'auth/internal-error'};
        return {uid:'test',email:mode === 'admin' ? 'admin@example.test' : 'visitor@example.test'};
      } }) }
  });
  const request = token => new Request('https://example.test', {headers: token ? {Authorization:`Bearer ${token}`} : {}});
  assert.equal((await auth.authorizeAdminRequest(request())).status,401);
  assert.equal((await auth.authorizeAdminRequest(request('bad'))).status,401);
  assert.equal((await auth.authorizeAdminRequest(request('a.b.c'))).authorized,true);
  mode='visitor'; assert.equal((await auth.authorizeAdminRequest(request('a.b.c'))).status,403);
  mode='revoked'; assert.equal((await auth.authorizeAdminRequest(request('a.b.c'))).status,401);
  mode='outage'; assert.equal((await auth.authorizeAdminRequest(request('a.b.c'))).status,503);
});
