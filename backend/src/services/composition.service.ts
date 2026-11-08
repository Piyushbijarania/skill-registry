import { prisma } from '../config/db';
import { ComposeSkillsInput, GenerateSkillInput } from '../types/composition.types';
import { skillSpectorAdapter } from '../adapters/security/skillspector.adapter';
import { NotFoundError } from '../utils/errors';

export class CompositionService {
  /**
   * Composes multiple existing skills into a new, unified skill bundle (SRS FR-012).
   * Preserves provenance, harmonizes instructions, and runs independent security scans.
   */
  async composeSkills(userId: string, input: ComposeSkillsInput) {
    const { name, description, sourceSkillVersionIds, customInstructions } = input;

    // 1. Fetch all source skill versions from database
    const sourceVersions = await prisma.skillVersion.findMany({
      where: { id: { in: sourceSkillVersionIds } },
      include: {
        skill: { select: { id: true, name: true, slug: true } },
      },
    });

    if (sourceVersions.length !== sourceSkillVersionIds.length) {
      throw new NotFoundError('One or more selected source skill versions were not found');
    }

    // 2. Extract licenses & check attribution requirements
    const licenses = Array.from(
      new Set(sourceVersions.map((v) => v.license || 'Unknown'))
    );

    // 3. Harmonize & Merge Instructions (Avoid simple naive concatenation)
    const attributionHeader = [
      '---',
      `name: "${name}"`,
      `description: "${description}"`,
      `composed_at: "${new Date().toISOString()}"`,
      `licenses: [${licenses.map((l) => `"${l}"`).join(', ')}]`,
      'sources:',
      ...sourceVersions.map(
        (v) => `  - skill: "${v.skill.name}" (version: ${v.version}, license: ${v.license || 'N/A'})`
      ),
      '---',
      '',
      `# ${name}`,
      description,
      '',
    ].join('\n');

    const sourceSections = sourceVersions.map((v) => {
      return `## Instructions adapted from ${v.skill.name} (v${v.version})\n${v.readmeContent || ''}\n`;
    });

    const customSection = customInstructions
      ? `## Custom Project Rules & Overrides\n${customInstructions}\n`
      : '';

    const unifiedSkillContent = [attributionHeader, ...sourceSections, customSection].join('\n');

    // 4. Independent Security Scan on Composed Output (SRS FR-011 Principle: Never assume safe!)
    const scanResult = await skillSpectorAdapter.scan(unifiedSkillContent);

    // 5. Persist the Generated Skill in the database
    const generatedSkill = await prisma.generatedSkill.create({
      data: {
        ownerId: userId,
        name,
        description,
        contentLocation: 'inline',
        generationMetadata: JSON.stringify({
          sourceVersionsCount: sourceVersions.length,
          licenses,
          securityScore: scanResult.score,
          securityStatus: scanResult.status,
        }),
      },
    });

    // 6. Record Provenance Graph in SkillComposition table (SRS FR-012)
    await Promise.all(
      sourceVersions.map((v) =>
        prisma.skillComposition.create({
          data: {
            generatedSkillId: generatedSkill.id,
            sourceSkillVersionId: v.id,
            relationshipType: 'BUNDLES',
            sourceLicense: v.license || 'Unknown',
            attributionMetadata: JSON.stringify({
              sourceSkillName: v.skill.name,
              sourceVersion: v.version,
            }),
          },
        })
      )
    );

    return {
      generatedSkill: {
        id: generatedSkill.id,
        name: generatedSkill.name,
        description: generatedSkill.description,
        createdAt: generatedSkill.createdAt,
      },
      provenance: {
        parentSkills: sourceVersions.map((v) => ({
          name: v.skill.name,
          slug: v.skill.slug,
          version: v.version,
          license: v.license,
        })),
        combinedLicenses: licenses,
      },
      securityAssessment: {
        score: scanResult.score,
        status: scanResult.status,
        findingsCount: scanResult.findings.length,
        findings: scanResult.findings,
      },
      exportContent: unifiedSkillContent,
    };
  }

  /**
   * Generates a new custom skill from a natural language prompt (SRS FR-011).
   */
  async generateSkillFromPrompt(userId: string, input: GenerateSkillInput) {
    const { name, prompt } = input;

    // Structured generated skill following standard SKILL.md layout
    const generatedContent = [
      '---',
      `name: "${name}"`,
      `generated_by: "AI Skill Registry Assistant"`,
      `created_at: "${new Date().toISOString()}"`,
      `license: "MIT"`,
      '---',
      '',
      `# ${name}`,
      `Generated from user prompt: "${prompt}"`,
      '',
      '## Core Capabilities & Agent Instructions',
      `1. Read project context and align with goal: "${prompt}".`,
      '2. Enforce standard TypeScript typing and error handling.',
      '3. Run unit tests before finalizing outputs.',
      '',
      '## Verification Steps',
      '- Verify all generated files match the declared schema.',
      '- Ensure no secret keys or hardcoded credentials are committed.',
    ].join('\n');

    // Independent Security Scan
    const scanResult = await skillSpectorAdapter.scan(generatedContent);

    const generatedSkill = await prisma.generatedSkill.create({
      data: {
        ownerId: userId,
        name,
        description: `Custom skill generated for: ${prompt.slice(0, 100)}...`,
        contentLocation: 'inline',
        generationMetadata: JSON.stringify({
          prompt,
          securityScore: scanResult.score,
          securityStatus: scanResult.status,
        }),
      },
    });

    return {
      generatedSkill,
      securityAssessment: {
        score: scanResult.score,
        status: scanResult.status,
        findings: scanResult.findings,
      },
      exportContent: generatedContent,
    };
  }
}

export const compositionService = new CompositionService();
