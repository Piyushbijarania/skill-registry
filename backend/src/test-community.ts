import { createApp } from './app';
import { prisma } from './config/db';
import { Server } from 'http';

async function runCommunityTests() {
  console.log('🧪 Starting Community Reviews, Voting & Collections Integration Tests...\n');

  const app = createApp();
  let server: Server;
  const PORT = 5560;

  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`📡 Test server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  const BASE_URL = `http://localhost:${PORT}/api/v1/community`;

  try {
    // 1. Authenticate user
    console.log('1️⃣ Authenticating test reviewer...');
    const regRes = await fetch(`http://localhost:${PORT}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `community_user_${Date.now()}@registry.dev`,
        password: 'Password123!',
        displayName: 'Dev Community Reviewer',
        role: 'DEVELOPER',
      }),
    });
    const regData = (await regRes.json()) as any;
    const token = regData.data.token;
    console.log('   Authenticated! Token acquired.');

    const targetSlug = 'nextjs-fullstack-dev';

    // 2. Test Submitting a Review (POST /skills/:slug/reviews)
    console.log('\n2️⃣ Testing POST /skills/:slug/reviews (Submit 5-star review)...');
    const rev1Res = await fetch(`${BASE_URL}/skills/${targetSlug}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: 5,
        comment: 'Amazing Next.js 15 guidelines. Zero hydration errors in production!',
      }),
    });
    const rev1Data = (await rev1Res.json()) as any;
    console.log(`   Status: ${rev1Res.status}`);
    console.log(`   User Rating: ${rev1Data.data?.review?.rating} Stars`);
    console.log(`   New Skill Avg Rating: ${rev1Data.data?.aggregate?.averageRating}`);
    if (rev1Res.status !== 201 || rev1Data.data?.review?.rating !== 5) {
      throw new Error('Review submission test failed');
    }

    // 3. Test Updating the same review (Upsert verification)
    console.log('\n3️⃣ Testing updating existing review (Atomic Upsert to 4 stars)...');
    const rev2Res = await fetch(`${BASE_URL}/skills/${targetSlug}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: 4,
        comment: 'Updated: Still great, but waiting for Next.js 16 updates.',
      }),
    });
    const rev2Data = (await rev2Res.json()) as any;
    console.log(`   Status: ${rev2Res.status}`);
    console.log(`   Updated Rating: ${rev2Data.data?.review?.rating} Stars`);
    if (rev2Res.status !== 201 || rev2Data.data?.review?.rating !== 4) {
      throw new Error('Review upsert test failed');
    }

    // 4. Test Voting (+1 Upvote)
    console.log('\n4️⃣ Testing POST /skills/:slug/vote (+1 Upvote)...');
    const vote1Res = await fetch(`${BASE_URL}/skills/${targetSlug}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ voteValue: 1 }),
    });
    const vote1Data = (await vote1Res.json()) as any;
    console.log(`   Status: ${vote1Res.status}`);
    console.log(`   Upvotes: ${vote1Data.data?.upvotes}`);
    console.log(`   Net Score: ${vote1Data.data?.netScore}`);
    if (vote1Res.status !== 200 || vote1Data.data?.userVote !== 1) {
      throw new Error('Upvote test failed');
    }

    // 5. Test Switching Vote to -1 Downvote (Atomic Upsert)
    console.log('\n5️⃣ Testing switching vote to -1 Downvote (Atomic Upsert)...');
    const vote2Res = await fetch(`${BASE_URL}/skills/${targetSlug}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ voteValue: -1 }),
    });
    const vote2Data = (await vote2Res.json()) as any;
    console.log(`   Status: ${vote2Res.status}`);
    console.log(`   User Vote Updated to: ${vote2Data.data?.userVote}`);
    console.log(`   Downvotes Count: ${vote2Data.data?.downvotes}`);
    if (vote2Res.status !== 200 || vote2Data.data?.userVote !== -1) {
      throw new Error('Vote switch test failed');
    }

    // 6. Test Creating Personal Collection (POST /collections)
    console.log('\n6️⃣ Testing POST /collections (Create personal collection)...');
    const colRes = await fetch(`${BASE_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'My Production Stack 2026',
        description: 'Skills verified and tested for production services.',
        visibility: 'public',
      }),
    });
    const colData = (await colRes.json()) as any;
    const collectionId = colData.data?.id;
    console.log(`   Status: ${colRes.status}`);
    console.log(`   Collection Created: ${colData.data?.name}`);
    if (colRes.status !== 201 || !collectionId) {
      throw new Error('Collection creation test failed');
    }

    // 7. Test Adding Skill to Collection
    console.log('\n7️⃣ Testing POST /collections/:id/skills (Add skill to collection)...');
    const targetSkill = await prisma.skill.findUnique({ where: { slug: targetSlug } });
    const addItemRes = await fetch(`${BASE_URL}/collections/${collectionId}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skillId: targetSkill!.id }),
    });
    const addItemData = (await addItemRes.json()) as any;
    console.log(`   Status: ${addItemRes.status}`);
    console.log(`   Skill Added: ${addItemData.data?.skill?.name}`);
    if (addItemRes.status !== 201) {
      throw new Error('Add to collection test failed');
    }

    // 8. Test Duplicate Collection Item Prevention (Expect 409 Conflict)
    console.log('\n8️⃣ Testing duplicate skill in collection (Expect 409 Conflict)...');
    const dupItemRes = await fetch(`${BASE_URL}/collections/${collectionId}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skillId: targetSkill!.id }),
    });
    const dupItemData = (await dupItemRes.json()) as any;
    console.log(`   Status: ${dupItemRes.status} (Expected 409)`);
    console.log(`   Error Code: ${dupItemData.error?.code}`);
    if (dupItemRes.status !== 409) {
      throw new Error('Collection duplicate prevention failed');
    }

    // 9. Test GET /collections/me (List my collections)
    console.log('\n9️⃣ Testing GET /collections/me (List user collections)...');
    const myColsRes = await fetch(`${BASE_URL}/collections/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const myColsData = (await myColsRes.json()) as any;
    console.log(`   Status: ${myColsRes.status}`);
    console.log(`   User Collections Count: ${myColsData.data?.length}`);
    console.log(`   Items in First Collection: ${myColsData.data?.[0]?.items?.length}`);
    if (myColsRes.status !== 200 || !myColsData.data?.length) {
      throw new Error('List collections test failed');
    }

    console.log('\n🎉 ALL 9 COMMUNITY REVIEWS, VOTING & COLLECTIONS TESTS PASSED PERFECTLY!\n');
  } finally {
    server!.close();
  }
}

runCommunityTests().catch((err) => {
  console.error('❌ Community test error:', err);
  process.exit(1);
});

