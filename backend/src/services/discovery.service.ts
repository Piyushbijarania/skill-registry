import { prisma } from '../config/db';
import { IAiProvider, DiscoveryResult } from '../adapters/ai/ai.interface';
import { mockAiProvider } from '../adapters/ai/mock.provider';

export class DiscoveryService {
  private aiProvider: IAiProvider;

  /**
   * Dependency Injection: Easily plug in OpenAI, Gemini, or Mock providers
   */
  constructor(aiProvider: IAiProvider = mockAiProvider) {
    this.aiProvider = aiProvider;
  }

  /**
   * Discovers skills based on user's natural language goal.
   * Grounded in real, indexed database records (SRS FR-003).
   *
   * @param prompt - Natural language description of what user wants to build
   */
  async discover(prompt: string): Promise<DiscoveryResult> {
    // 1. Fetch public indexed skills from database with their latest versions
    const candidateSkills = await prisma.skill.findMany({
      where: { visibility: 'public' },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        versions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            version: true,
            securityAssessment: {
              select: { score: true, status: true },
            },
            qualityAssessment: {
              select: { score: true },
            },
          },
        },
      },
    });

    // 2. Delegate to the AI Provider to rank and generate explanations
    return this.aiProvider.discoverSkills(prompt, candidateSkills);
  }
}

export const discoveryService = new DiscoveryService();

