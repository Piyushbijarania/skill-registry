import { IAiProvider, DiscoveryResult, SkillRecommendation } from './ai.interface';

/**
 * Deterministic, Grounded AI Discovery Provider.
 * Allows full local testing without requiring paid API keys or external network calls.
 * Complies with SRS FR-003: Grounded in real records, zero hallucinated skills.
 */
export class MockAiProvider implements IAiProvider {
  public readonly providerName = 'mock-grounded-discovery';

  async discoverSkills(
    userPrompt: string,
    candidateSkills: Array<{
      id: string;
      slug: string;
      name: string;
      description: string;
      versions: Array<{
        version: string;
        securityAssessment?: { score: number | null; status: string } | null;
        qualityAssessment?: { score: number | null } | null;
      }>;
    }>
  ): Promise<DiscoveryResult> {
    const promptLower = userPrompt.toLowerCase();

    // 1. Extract technology keywords from prompt
    const techDictionary = [
      'next.js',
      'react',
      'typescript',
      'python',
      'fastapi',
      'postgres',
      'postgresql',
      'tailwind',
      'security',
      'audit',
      'docker',
      'testing',
    ];

    const identifiedTech = techDictionary.filter((tech) =>
      promptLower.includes(tech)
    );

    // 2. Rank candidates based on keyword relevance & security score
    const scoredRecommendations: SkillRecommendation[] = [];

    for (const skill of candidateSkills) {
      let matchCount = 0;
      const matchedTerms: string[] = [];

      const skillText = `${skill.name} ${skill.description} ${skill.slug}`.toLowerCase();

      for (const tech of identifiedTech) {
        if (skillText.includes(tech)) {
          matchCount += 1;
          matchedTerms.push(tech);
        }
      }

      // Also match generic words from prompt
      const promptWords = promptLower
        .split(/\s+/)
        .filter((w) => w.length > 3 && !['with', 'need', 'help', 'building', 'project'].includes(w));

      for (const word of promptWords) {
        if (skillText.includes(word) && !matchedTerms.includes(word)) {
          matchCount += 0.5;
          matchedTerms.push(word);
        }
      }

      if (matchCount > 0) {
        const latestVersion = skill.versions[0];
        const secScore = latestVersion?.securityAssessment?.score ?? 50;

        // Confidence formula: normalized match count (70%) + security score (30%)
        const matchFactor = Math.min(1.0, matchCount / Math.max(1, identifiedTech.length));
        const securityFactor = secScore / 100;
        const confidenceScore = Math.round((matchFactor * 0.7 + securityFactor * 0.3) * 100) / 100;

        scoredRecommendations.push({
          skillId: skill.id,
          slug: skill.slug,
          name: skill.name,
          confidenceScore,
          reason: `Matches requirements for [${matchedTerms.join(', ')}]. Latest version security score: ${secScore}/100.`,
          potentialConflicts:
            secScore < 70
              ? ['Notice: This skill has security findings that should be reviewed before deployment.']
              : [],
        });
      }
    }

    // Sort descending by confidence score
    scoredRecommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);

    return {
      parsedIntent: {
        primaryGoal: userPrompt.slice(0, 150),
        identifiedTechnologies: identifiedTech,
        taskCategories: identifiedTech.includes('security') ? ['Security & Auditing'] : ['Fullstack Development'],
      },
      recommendations: scoredRecommendations,
      explanation:
        scoredRecommendations.length > 0
          ? `Found ${scoredRecommendations.length} indexed skills matching your project stack (${identifiedTech.join(', ') || 'general'}).`
          : 'No directly matching skills found in the current registry catalog for these specific requirements.',
      providerUsed: this.providerName,
    };
  }
}

export const mockAiProvider = new MockAiProvider();

