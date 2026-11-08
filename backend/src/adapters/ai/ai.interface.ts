/**
 * Discovered Skill Recommendation
 */
export interface SkillRecommendation {
  skillId: string;
  slug: string;
  name: string;
  confidenceScore: number; // 0.0 to 1.0 match relevance
  reason: string; // Grounded explanation of why this skill fits the user prompt
  potentialConflicts?: string[]; // Any warnings, overlaps, or limitations
}

/**
 * AI Skill Discovery Result
 */
export interface DiscoveryResult {
  parsedIntent: {
    primaryGoal: string;
    identifiedTechnologies: string[];
    taskCategories: string[];
  };
  recommendations: SkillRecommendation[];
  explanation: string;
  providerUsed: string;
}

/**
 * 💡 ADAPTER PATTERN FOR AI PROVIDERS (SRS Section 6.4)
 * Allows switching between Mock, OpenAI, Anthropic, or Gemini seamlessly.
 */
export interface IAiProvider {
  readonly providerName: string;

  /**
   * Discovers matching skills from an indexed catalog based on natural language prompt.
   *
   * @param userPrompt - Natural language project or task description
   * @param candidateSkills - Real skills retrieved from database (Grounding)
   */
  discoverSkills(
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
  ): Promise<DiscoveryResult>;
}

