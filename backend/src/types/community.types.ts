import { z } from 'zod';

/**
 * Zod schema for submitting/updating a rating and review (1 to 5 stars)
 */
export const submitReviewSchema = z.object({
  rating: z
    .number({ required_error: 'Rating is required' })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),

  comment: z
    .string()
    .max(1000, 'Comment cannot exceed 1000 characters')
    .optional(),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

/**
 * Zod schema for upvoting (+1) or downvoting (-1)
 */
export const voteSkillSchema = z.object({
  voteValue: z
    .number({ required_error: 'Vote value is required' })
    .refine((val) => val === 1 || val === -1, {
      message: 'Vote value must be either 1 (Upvote) or -1 (Downvote)',
    }),
});

export type VoteSkillInput = z.infer<typeof voteSkillSchema>;

/**
 * Zod schema for creating a personal collection
 */
export const createCollectionSchema = z.object({
  name: z
    .string({ required_error: 'Collection name is required' })
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  visibility: z.enum(['public', 'private']).default('public'),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;

/**
 * Zod schema for adding a skill to a collection
 */
export const addSkillToCollectionSchema = z.object({
  skillId: z.string({ required_error: 'Skill ID is required' }),
});

export type AddSkillToCollectionInput = z.infer<typeof addSkillToCollectionSchema>;

