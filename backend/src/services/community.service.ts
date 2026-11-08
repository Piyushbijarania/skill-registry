import { prisma } from '../config/db';
import {
  SubmitReviewInput,
  CreateCollectionInput,
} from '../types/community.types';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors';

export class CommunityService {
  /**
   * Submits or updates a user review (SRS FR-009).
   * Enforces 1 review per user per skill via atomic upsert.
   */
  async submitReview(userId: string, slug: string, input: SubmitReviewInput) {
    const skill = await prisma.skill.findUnique({
      where: { slug },
    });

    if (!skill) {
      throw new NotFoundError('Skill', slug);
    }

    // Atomic Upsert: Updates if user already reviewed, inserts if first time
    const review = await prisma.review.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id,
        },
      },
      update: {
        rating: input.rating,
        comment: input.comment || null,
      },
      create: {
        userId,
        skillId: skill.id,
        rating: input.rating,
        comment: input.comment || null,
      },
      include: {
        user: { select: { id: true, displayName: true } },
      },
    });

    // Compute updated aggregate statistics in database engine
    const stats = await prisma.review.aggregate({
      where: { skillId: skill.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      review,
      aggregate: {
        averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : null,
        totalReviews: stats._count.rating,
      },
    };
  }

  /**
   * Lists reviews for a specific skill with pagination
   */
  async listReviews(slug: string, page = 1, limit = 10) {
    const skill = await prisma.skill.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!skill) {
      throw new NotFoundError('Skill', slug);
    }

    const skip = (page - 1) * limit;

    const [reviews, totalCount, stats] = await Promise.all([
      prisma.review.findMany({
        where: { skillId: skill.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, displayName: true } },
        },
      }),
      prisma.review.count({ where: { skillId: skill.id } }),
      prisma.review.aggregate({
        where: { skillId: skill.id },
        _avg: { rating: true },
      }),
    ]);

    return {
      reviews,
      summary: {
        averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : null,
        totalReviews: totalCount,
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Casts or updates an upvote (+1) or downvote (-1) on a skill.
   * Enforces 1 vote per user per skill via atomic upsert.
   */
  async voteSkill(userId: string, slug: string, voteValue: number) {
    const skill = await prisma.skill.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!skill) {
      throw new NotFoundError('Skill', slug);
    }

    // Atomic Upsert using @@unique([userId, skillId])
    await prisma.vote.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id,
        },
      },
      update: { voteValue },
      create: {
        userId,
        skillId: skill.id,
        voteValue,
      },
    });

    // Compute net score and breakdown
    const [upvotes, downvotes] = await Promise.all([
      prisma.vote.count({ where: { skillId: skill.id, voteValue: 1 } }),
      prisma.vote.count({ where: { skillId: skill.id, voteValue: -1 } }),
    ]);

    return {
      userVote: voteValue,
      upvotes,
      downvotes,
      netScore: upvotes - downvotes,
    };
  }

  /**
   * Creates a new personal collection (SRS FR-010)
   */
  async createCollection(userId: string, input: CreateCollectionInput) {
    return prisma.collection.create({
      data: {
        ownerId: userId,
        name: input.name,
        description: input.description || null,
        visibility: input.visibility || 'public',
      },
    });
  }

  /**
   * Lists collections owned by the authenticated user
   */
  async listUserCollections(userId: string) {
    return prisma.collection.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { items: true } },
        items: {
          include: {
            skill: {
              select: { id: true, name: true, slug: true, description: true },
            },
          },
        },
      },
    });
  }

  /**
   * Adds a skill to a personal collection
   */
  async addSkillToCollection(userId: string, collectionId: string, skillId: string) {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundError('Collection', collectionId);
    }

    if (collection.ownerId !== userId) {
      throw new ForbiddenError('You can only add skills to your own collections');
    }

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundError('Skill', skillId);
    }

    // Check if already in collection
    const existing = await prisma.collectionItem.findUnique({
      where: {
        collectionId_skillId: {
          collectionId,
          skillId,
        },
      },
    });

    if (existing) {
      throw new ConflictError('This skill is already in your collection');
    }

    return prisma.collectionItem.create({
      data: {
        collectionId,
        skillId,
      },
      include: {
        skill: { select: { id: true, name: true, slug: true } },
      },
    });
  }
}

export const communityService = new CommunityService();
