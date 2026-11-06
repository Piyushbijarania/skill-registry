import { prisma } from '../config/db';
import { CreateSkillInput, PublishVersionInput, ListSkillsQuery } from '../types/skill.types';
import { calculateSha256 } from '../utils/hash';
import { ConflictError, NotFoundError, ForbiddenError } from '../utils/errors';

export class SkillService {
  /**
   * 1. List skills with search and pagination (GET /api/v1/skills)
   */
  async listSkills(query: ListSkillsQuery) {
    const { search, page, limit } = query;
    const skip = (page - 1) * limit;

    // Search filter: matches name, description, or slug
    const whereClause: any = {
      visibility: 'public',
    };

    if (search && search.trim() !== '') {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    // Run query and count in parallel using Promise.all for maximum speed
    const [skills, totalCount] = await Promise.all([
      prisma.skill.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          publisher: {
            select: { id: true, displayName: true, email: true },
          },
          versions: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              version: true,
              license: true,
              createdAt: true,
              securityAssessment: {
                select: { status: true, score: true },
              },
              qualityAssessment: {
                select: { score: true },
              },
            },
          },
          _count: {
            select: { reviews: true, votes: true },
          },
        },
      }),
      prisma.skill.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      skills,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * 2. Get single skill by slug (GET /api/v1/skills/:slug)
   */
  async getSkillBySlug(slug: string) {
    const skill = await prisma.skill.findUnique({
      where: { slug },
      include: {
        publisher: {
          select: { id: true, displayName: true, email: true },
        },
        versions: {
          orderBy: { createdAt: 'desc' },
          include: {
            securityAssessment: true,
            qualityAssessment: true,
          },
        },
        reviews: {
          include: {
            user: { select: { id: true, displayName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true, votes: true },
        },
      },
    });

    if (!skill) {
      throw new NotFoundError('Skill', slug);
    }

    return skill;
  }

  /**
   * 3. Create a new skill (POST /api/v1/skills)
   */
  async createSkill(publisherId: string, input: CreateSkillInput) {
    // Check if slug already exists
    const existing = await prisma.skill.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError(`A skill with slug '${input.slug}' already exists`);
    }

    return prisma.skill.create({
      data: {
        ...input,
        publisherId,
      },
    });
  }

  /**
   * 4. Publish a new version of an existing skill (POST /api/v1/skills/:slug/versions)
   */
  async publishVersion(
    userId: string,
    userRole: string,
    slug: string,
    input: PublishVersionInput
  ) {
    // 1. Find the parent skill
    const skill = await prisma.skill.findUnique({
      where: { slug },
    });

    if (!skill) {
      throw new NotFoundError('Skill', slug);
    }

    // 2. Only the publisher who owns it (or an ADMIN) can publish new versions
    if (skill.publisherId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You can only publish versions for your own skills');
    }

    // 3. Check if this version number was already published
    const existingVersion = await prisma.skillVersion.findUnique({
      where: {
        skillId_version: {
          skillId: skill.id,
          version: input.version,
        },
      },
    });

    if (existingVersion) {
      throw new ConflictError(
        `Version '${input.version}' for skill '${slug}' already exists. Version numbers are immutable.`
      );
    }

    // 4. Calculate cryptographic SHA-256 content hash
    const contentHash = calculateSha256(input.readmeContent);

    // 5. Store the immutable version snapshot
    return prisma.skillVersion.create({
      data: {
        skillId: skill.id,
        version: input.version,
        sourceCommit: input.sourceCommit || null,
        contentHash,
        contentLocation: input.contentLocation,
        readmeContent: input.readmeContent,
        license: input.license,
      },
    });
  }
}

export const skillService = new SkillService();
