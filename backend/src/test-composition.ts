import { createApp } from './app';
import { prisma } from './config/db';
import { Server } from 'http';

async function runCompositionTests() {
  console.log('🧪 Starting Skill Composition & Generation Integration Tests...\n');

  const app = createApp();
  let server: Server;
  const PORT = 5559;

  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`📡 Test server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  const BASE_URL = `http://localhost:${PORT}/api/v1`;

  try {
    // 1. Authenticate user
    console.log('1️⃣ Authenticating test creator...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `composer_${Date.now()}@registry.dev`,
        password: 'Password123!',
        displayName: 'Skill Composer Engineer',
        role: 'DEVELOPER',
      }),
    });
    const regData = (await regRes.json()) as any;
    const token = regData.data.token;
    console.log('   Authenticated! Token acquired.');

    // 2. Fetch the 2 seeded skill versions to compose
    console.log('\n2️⃣ Fetching source skill versions for composition...');
    const sourceVersions = await prisma.skillVersion.findMany({
      take: 2,
      select: { id: true, version: true, skill: { select: { name: true } } },
    });

    console.log(`   Source 1: ${sourceVersions[0]?.skill.name} (v${sourceVersions[0]?.version})`);
    console.log(`   Source 2: ${sourceVersions[1]?.skill.name} (v${sourceVersions[1]?.version})`);
    if (sourceVersions.length < 2) {
      throw new Error('Need at least 2 versions seeded in DB for composition test');
    }

    // 3. Test POST /api/v1/composition/compose
    console.log('\n3️⃣ Testing POST /composition/compose (Composing 2 skills)...');
    const composeRes = await fetch(`${BASE_URL}/composition/compose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Enterprise Secure Next.js Stack',
        description: 'Next.js 15 App Router architecture with integrated NVIDIA SkillSpector audits.',
        sourceSkillVersionIds: [sourceVersions[0].id, sourceVersions[1].id],
        customInstructions: 'Always verify API responses with Zod schemas and enforce strict CORS.',
      }),
    });

    const composeData = (await composeRes.json()) as any;
    console.log(`   Status: ${composeRes.status}`);
    console.log(`   Composed Skill ID: ${composeData.data?.generatedSkill?.id}`);
    console.log(`   Combined Licenses: ${composeData.data?.provenance?.combinedLicenses?.join(', ')}`);
    console.log(`   Security Score: ${composeData.data?.securityAssessment?.score}/100`);
    console.log(`   Export Preview:\n${composeData.data?.exportContent?.slice(0, 220)}...\n`);

    if (composeRes.status !== 201 || !composeData.data?.provenance?.parentSkills?.length) {
      throw new Error('Skill composition test failed');
    }

    // 4. Test POST /api/v1/composition/generate (Generate from prompt)
    console.log('\n4️⃣ Testing POST /composition/generate (AI skill generation from prompt)...');
    const genRes = await fetch(`${BASE_URL}/composition/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'React Accessibility Enforcer',
        prompt: 'Enforce WCAG 2.1 accessible UI patterns and aria tags in React components.',
      }),
    });

    const genData = (await genRes.json()) as any;
    console.log(`   Status: ${genRes.status}`);
    console.log(`   Generated Skill Name: ${genData.data?.generatedSkill?.name}`);
    console.log(`   Security Status: ${genData.data?.securityAssessment?.status}`);
    if (genRes.status !== 201 || !genData.data?.generatedSkill?.id) {
      throw new Error('Skill generation test failed');
    }

    console.log('\n🎉 ALL 4 SKILL COMPOSITION & GENERATION TESTS PASSED PERFECTLY!\n');
  } finally {
    server!.close();
  }
}

runCompositionTests().catch((err) => {
  console.error('❌ Composition test error:', err);
  process.exit(1);
});
