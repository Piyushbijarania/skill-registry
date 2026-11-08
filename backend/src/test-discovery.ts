import { createApp } from './app';
import { Server } from 'http';

async function runDiscoveryTests() {
  console.log('🧪 Starting AI Skill Discovery Integration Tests...\n');

  const app = createApp();
  let server: Server;
  const PORT = 5558;

  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`📡 Test server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  const BASE_URL = `http://localhost:${PORT}/api/v1/discovery`;

  try {
    // 1. Test Natural Language Query for Next.js stack
    console.log('1️⃣ Testing natural language query for Next.js + PostgreSQL...');
    const nextjsPrompt =
      'I am building a Next.js fullstack application with Postgres and need help with architecture, testing, and production deployment.';

    const res1 = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: nextjsPrompt }),
    });

    const data1 = (await res1.json()) as any;
    console.log(`   Status: ${res1.status}`);
    console.log(`   Provider: ${data1.data?.providerUsed}`);
    console.log(`   Identified Technologies: ${data1.data?.parsedIntent?.identifiedTechnologies?.join(', ')}`);
    console.log(`   Recommendations Count: ${data1.data?.recommendations?.length}`);

    const topRec1 = data1.data?.recommendations?.[0];
    console.log(`   Top Recommendation: ${topRec1?.name} (${topRec1?.slug})`);
    console.log(`   Confidence Score: ${topRec1?.confidenceScore}`);
    console.log(`   Explanation Reason: ${topRec1?.reason}`);

    if (res1.status !== 200 || !topRec1 || topRec1.slug !== 'nextjs-fullstack-dev') {
      throw new Error('Next.js discovery test failed');
    }

    // 2. Test Natural Language Query for Security & Auditing
    console.log('\n2️⃣ Testing natural language query for security audit...');
    const secPrompt =
      'I need an automated security tool to scan agent skills, audit bash commands, and find credential leaks.';

    const res2 = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: secPrompt }),
    });

    const data2 = (await res2.json()) as any;
    console.log(`   Status: ${res2.status}`);
    const topRec2 = data2.data?.recommendations?.[0];
    console.log(`   Top Recommendation: ${topRec2?.name} (${topRec2?.slug})`);
    console.log(`   Confidence Score: ${topRec2?.confidenceScore}`);
    console.log(`   Explanation Reason: ${topRec2?.reason}`);

    if (res2.status !== 200 || !topRec2 || topRec2.slug !== 'skillspector-security-auditor') {
      throw new Error('Security discovery test failed');
    }

    // 3. Test Invalid Prompt Validation (< 5 characters)
    console.log('\n3️⃣ Testing input validation for too-short prompt (Expect 400)...');
    const res3 = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'hi' }),
    });

    const data3 = (await res3.json()) as any;
    console.log(`   Status: ${res3.status} (Expected 400)`);
    console.log(`   Error Code: ${data3.error?.code}`);
    if (res3.status !== 400 || data3.error?.code !== 'VALIDATION_ERROR') {
      throw new Error('Validation rejection test failed');
    }

    console.log('\n🎉 ALL 3 AI SKILL DISCOVERY TESTS PASSED PERFECTLY!\n');
  } finally {
    server!.close();
  }
}

runDiscoveryTests().catch((err) => {
  console.error('❌ Discovery test error:', err);
  process.exit(1);
});

