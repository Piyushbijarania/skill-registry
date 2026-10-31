import { createApp } from './app';
import { Server } from 'http';

async function runAuthTests() {
  console.log('🧪 Starting Authentication Integration Tests...\n');

  const app = createApp();
  let server: Server;
  const PORT = 5555;

  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`📡 Test server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  const BASE_URL = `http://localhost:${PORT}/api/v1/auth`;

  try {
    const testEmail = `tester_${Date.now()}@registry.dev`;
    const testPassword = 'Password123!';

    // Test 1: Register User
    console.log('1️⃣ Testing POST /auth/register...');
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        displayName: 'Test Engineer',
        role: 'DEVELOPER',
      }),
    });

    const regData = (await regRes.json()) as any;
    console.log(`   Status: ${regRes.status}`);
    console.log(`   Success: ${regData.success}`);
    console.log(`   Token received: ${!!regData.data?.token}`);
    if (regRes.status !== 201) throw new Error('Registration test failed');

    // Test 2: Duplicate Registration (Expect 409 Conflict)
    console.log('\n2️⃣ Testing duplicate registration (Expect 409 Conflict)...');
    const dupRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        displayName: 'Test Engineer Duplicate',
      }),
    });
    const dupData = (await dupRes.json()) as any;
    console.log(`   Status: ${dupRes.status} (Expected 409)`);
    console.log(`   Error Code: ${dupData.error?.code}`);
    if (dupRes.status !== 409) throw new Error('Duplicate prevention test failed');

    // Test 3: Login with correct credentials
    console.log('\n3️⃣ Testing POST /auth/login with valid credentials...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginData = (await loginRes.json()) as any;
    const token = loginData.data?.token;
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Token obtained: ${!!token}`);
    if (loginRes.status !== 200 || !token) throw new Error('Login test failed');

    // Test 4: Login with bad password (Expect 401 Unauthorized)
    console.log('\n4️⃣ Testing POST /auth/login with invalid password (Expect 401)...');
    const badLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword!',
      }),
    });
    const badLoginData = (await badLoginRes.json()) as any;
    console.log(`   Status: ${badLoginRes.status} (Expected 401)`);
    console.log(`   Error Code: ${badLoginData.error?.code}`);
    if (badLoginRes.status !== 401) throw new Error('Bad password rejection failed');

    // Test 5: Protected route /auth/me without token (Expect 401)
    console.log('\n5️⃣ Testing GET /auth/me without Bearer token (Expect 401)...');
    const noTokenRes = await fetch(`${BASE_URL}/me`);
    const noTokenData = (await noTokenRes.json()) as any;
    console.log(`   Status: ${noTokenRes.status} (Expected 401)`);
    console.log(`   Error Code: ${noTokenData.error?.code}`);
    if (noTokenRes.status !== 401) throw new Error('Unauthorized route test failed');

    // Test 6: Protected route /auth/me with valid Bearer token
    console.log('\n6️⃣ Testing GET /auth/me with valid Bearer token...');
    const meRes = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = (await meRes.json()) as any;
    console.log(`   Status: ${meRes.status}`);
    console.log(`   User Email: ${meData.data?.email}`);
    console.log(`   User Role: ${meData.data?.role}`);
    if (meRes.status !== 200 || meData.data?.email !== testEmail) {
      throw new Error('Get profile test failed');
    }

    console.log('\n🎉 ALL 6 AUTHENTICATION TESTS PASSED PERFECTLY!\n');
  } finally {
    server!.close();
  }
}

runAuthTests().catch((err) => {
  console.error('❌ Test execution error:', err);
  process.exit(1);
});

