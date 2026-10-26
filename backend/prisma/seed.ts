import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * Computes SHA-256 hash of content string.
 * Used for immutable skill version fingerprinting (SRS FR-004 & FR-005).
 */
const sha256 = (content: string): string => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing records in reverse dependency order
  await prisma.skillComposition.deleteMany();
  await prisma.generatedSkill.deleteMany();
  await prisma.collectionItem.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.review.deleteMany();
  await prisma.securityAssessment.deleteMany();
  await prisma.qualityAssessment.deleteMany();
  await prisma.skillVersion.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 1. Seed Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@registry.dev',
      displayName: 'Registry Admin',
      role: 'ADMIN',
      passwordHash: 'argon2id$mock_hash_admin',
    },
  });

  const publisher = await prisma.user.create({
    data: {
      email: 'alex@nvidia.com',
      displayName: 'Alex Rivers',
      role: 'PUBLISHER',
      passwordHash: 'argon2id$mock_hash_publisher',
    },
  });

  const developer = await prisma.user.create({
    data: {
      email: 'sarah@developer.io',
      displayName: 'Sarah Chen',
      role: 'DEVELOPER',
      passwordHash: 'argon2id$mock_hash_developer',
    },
  });

  console.log('👤 Created users: Admin, Publisher, Developer');

  // 2. Seed Skills & Versions

  // Skill 1: Next.js Fullstack Architecture Skill
  const nextjsReadme = `# Next.js Fullstack Architecture Skill
Enforces clean Next.js 15 App Router architecture, TypeScript strict typing, server actions, and PostgreSQL data access patterns.
## Features
- Server Actions with Zod validation
- Tailwind CSS responsive layouts
- Clean layered repository patterns`;

  const skill1 = await prisma.skill.create({
    data: {
      slug: 'nextjs-fullstack-dev',
      name: 'Next.js 15 Fullstack Architect',
      description: 'Expert agent skill for building production Next.js 15 applications with App Router, Tailwind, and PostgreSQL.',
      publisherId: publisher.id,
      sourceType: 'github',
      sourceUrl: 'https://github.com/vercel/next.js',
      sourcePath: 'skills/nextjs-architect',
      visibility: 'public',
      versions: {
        create: [
          {
            version: '1.0.0',
            sourceCommit: 'a1b2c3d4e5f67890123456789abcdef012345678',
            contentHash: sha256(nextjsReadme),
            contentLocation: 'skills/nextjs-fullstack-dev/1.0.0/SKILL.md',
            readmeContent: nextjsReadme,
            license: 'MIT',
            securityAssessment: {
              create: {
                scannerName: 'skillspector',
                scannerVersion: '1.2.0',
                status: 'CLEAN',
                score: 95,
                findings: JSON.stringify([
                  {
                    severity: 'LOW',
                    title: 'Outbound HTTP fetch',
                    description: 'Skill contains standard API fetch instructions with user-provided endpoints.',
                    recommendation: 'Ensure external URLs are whitelisted in your agent network policy.',
                  },
                ]),
                limitations: 'Static rule-based scan covering bash scripts and prompt injections.',
                completedAt: new Date(),
              },
            },
            qualityAssessment: {
              create: {
                evaluatorType: 'rule_based',
                evaluatorVersion: '1.0.0',
                score: 92,
                criteria: JSON.stringify({
                  instructionClarity: 95,
                  agentCompatibility: 90,
                  reproducibility: 90,
                }),
                evidence: JSON.stringify({
                  testCasesPassed: 10,
                  totalTestCases: 10,
                }),
                completedAt: new Date(),
              },
            },
          },
        ],
      },
    },
  });

  // Skill 2: NVIDIA SkillSpector Security Auditor
  const securityReadme = `# NVIDIA SkillSpector Security Auditor
Performs static analysis on agent skills, detecting dangerous shell commands, prompt injection, and credential exfiltration.`;

  const skill2 = await prisma.skill.create({
    data: {
      slug: 'skillspector-security-auditor',
      name: 'NVIDIA SkillSpector Security Auditor',
      description: 'Automated security analysis pipeline detecting suspicious shell commands, credential leaks, and supply chain risks.',
      publisherId: publisher.id,
      sourceType: 'github',
      sourceUrl: 'https://github.com/NVIDIA/skillspector',
      sourcePath: 'skills/security-auditor',
      visibility: 'public',
      versions: {
        create: [
          {
            version: '1.0.0',
            sourceCommit: 'f9e8d7c6b5a43210987654321fedcba098765432',
            contentHash: sha256(securityReadme),
            contentLocation: 'skills/skillspector-security-auditor/1.0.0/SKILL.md',
            readmeContent: securityReadme,
            license: 'Apache-2.0',
            securityAssessment: {
              create: {
                scannerName: 'skillspector',
                scannerVersion: '1.2.0',
                status: 'CLEAN',
                score: 98,
                findings: JSON.stringify([]),
                limitations: 'Self-audit verification passed.',
                completedAt: new Date(),
              },
            },
            qualityAssessment: {
              create: {
                evaluatorType: 'rule_based',
                evaluatorVersion: '1.0.0',
                score: 96,
                criteria: JSON.stringify({
                  instructionClarity: 98,
                  agentCompatibility: 95,
                  reproducibility: 95,
                }),
                completedAt: new Date(),
              },
            },
          },
        ],
      },
    },
  });

  // 3. Seed Reviews & Votes
  await prisma.review.create({
    data: {
      skillId: skill1.id,
      userId: developer.id,
      rating: 5,
      comment: 'Excellent Next.js 15 guidelines. Helped prevent hydration mismatches in our project!',
    },
  });

  await prisma.vote.create({
    data: {
      skillId: skill1.id,
      userId: developer.id,
      voteValue: 1, // Upvote
    },
  });

  await prisma.vote.create({
    data: {
      skillId: skill2.id,
      userId: developer.id,
      voteValue: 1, // Upvote
    },
  });

  // 4. Seed Collections
  const collection = await prisma.collection.create({
    data: {
      ownerId: developer.id,
      name: 'Essential Production Skills',
      description: 'Curated skills for fullstack web development and security auditing.',
      visibility: 'public',
      items: {
        create: [
          { skillId: skill1.id },
          { skillId: skill2.id },
        ],
      },
    },
  });

  console.log('⭐ Created reviews, votes, and collection:', collection.name);
  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
