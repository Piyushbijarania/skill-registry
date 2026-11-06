import { createApp } from './app';
import { Server } from 'http';

async function runSkillTests() {
  console.log('🧪 Starting Skill Catalog & Versioning Integration Tests...\n');

  const app = createApp();
  let server: Server;
  const PORT = 5556;

  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`📡 Test server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  const BASE_URL = `http://localhost:${PORT}/api/v1`;

  try {
    // 1. First, register a publisher user and obtain JWT token
    console.log('1️⃣ Authenticating test publisher...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `publisher_${Date.now()}@registry.dev`,
        password: 'Password123!',
        displayName: 'Skill Publisher Test',
        role: 'PUBLISHER',
      }),
    });
    const regData = (await regRes.json()) as any;
    const publisherToken = regData.data.token;
    console.log('   Authenticated! Token acquired.');

    // 2. Test GET /api/v1/skills (Catalog listing + pagination)
    console.log('\n2️⃣ Testing GET /api/v1/skills (List catalog with pagination)...');
    const listRes = await fetch(`${BASE_URL}/skills?page=1&limit=5`);
    const listData = (await listRes.json()) as any;
    console.log(`   Status: ${listRes.status}`);
    console.log(`   Total skills in catalog: ${listData.meta?.totalCount}`);
    console.log(`   Items returned on page 1: ${listData.data?.length}`);
    if (listRes.status !== 200 || !listData.data?.length) {
      throw new Error('List skills test failed');
    }

    // 3. Test GET /api/v1/skills/:slug (Single skill detail)
    console.log('\n3️⃣ Testing GET /api/v1/skills/nextjs-fullstack-dev (Skill detail by slug)...');
    const detailRes = await fetch(`${BASE_URL}/skills/nextjs-fullstack-dev`);
    const detailData = (await detailRes.json()) as any;
    console.log(`   Status: ${detailRes.status}`);
    console.log(`   Skill Name: ${detailData.data?.name}`);
    console.log(`   Versions available: ${detailData.data?.versions?.length}`);
    console.log(`   Security Status: ${detailData.data?.versions?.[0]?.securityAssessment?.status}`);
    if (detailRes.status !== 200 || detailData.data?.slug !== 'nextjs-fullstack-dev') {
      throw new Error('Get skill detail test failed');
    }

    // 4. Test POST /api/v1/skills (Create new skill as publisher)
    console.log('\n4️⃣ Testing POST /api/v1/skills (Create new skill)...');
    const testSlug = `python-data-agent-${Date.now()}`;
    const createRes = await fetch(`${BASE_URL}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publisherToken}`,
      },
      body: JSON.stringify({
        name: 'Python Data Analyst Agent',
        slug: testSlug,
        description: 'Automates data analysis, statistical tests, and chart generation using Pandas.',
        sourceType: 'manual',
        visibility: 'public',
      }),
    });
    const createData = (await createRes.json()) as any;
    console.log(`   Status: ${createRes.status}`);
    console.log(`   Created Slug: ${createData.data?.slug}`);
    if (createRes.status !== 201) throw new Error('Create skill test failed');

    // 5. Test POST /api/v1/skills/:slug/versions (Publish immutable version)
    console.log('\n5️⃣ Testing POST /api/v1/skills/:slug/versions (Publish version 1.0.0)...');
    const versionRes = await fetch(`${BASE_URL}/skills/${testSlug}/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publisherToken}`,
      },
      body: JSON.stringify({
        version: '1.0.0',
        readmeContent: '# Python Data Analyst\nInstructions for reading CSV files, running regression models, and generating plots.',
        license: 'MIT',
      }),
    });
    const versionData = (await versionRes.json()) as any;
    console.log(`   Status: ${versionRes.status}`);
    console.log(`   Published Version: ${versionData.data?.version}`);
    console.log(`   SHA-256 Content Hash: ${versionData.data?.contentHash}`);
    if (versionRes.status !== 201 || !versionData.data?.contentHash) {
      throw new Error('Publish version test failed');
    }

    // 6. Test duplicate version publication (Must reject with 409 Conflict)
    console.log('\n6️⃣ Testing duplicate version release (Expect 409 Conflict)...');
    const dupVerRes = await fetch(`${BASE_URL}/skills/${testSlug}/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publisherToken}`,
      },
      body: JSON.stringify({
        version: '1.0.0',
        readmeContent: 'Attempting to overwrite version 1.0.0 with different text.',
      }),
    });
    const dupVerData = (await dupVerRes.json()) as any;
    console.log(`   Status: ${dupVerRes.status} (Expected 409)`);
    console.log(`   Error Code: ${dupVerData.error?.code}`);
    if (dupVerRes.status !== 409) throw new Error('Version immutability test failed');

    // 7. Test Search Filter
    console.log('\n7️⃣ Testing search query (GET /api/v1/skills?search=Python)...');
    const searchRes = await fetch(`${BASE_URL}/skills?search=Python`);
    const searchData = (await searchRes.json()) as any;
    console.log(`   Status: ${searchRes.status}`);
    console.log(`   Matching skills found: ${searchData.data?.length}`);
    if (searchRes.status !== 200 || searchData.data?.length === 0) {
      throw new Error('Search filter test failed');
    }

    console.log('\n🎉 ALL 7 SKILL REGISTRY TESTS PASSED PERFECTLY!\n');
  } finally {
    server!.close();
  }
}

runSkillTests().catch((err) => {
  console.error('❌ Skill test error:', err);
  process.exit(1);
});
