import { z } from 'zod';

/**
 * Validation schema for creating a new Skill
 */
export const createSkillSchema = z.object({
  name: z
    .string({ required_error: 'Skill name is required' })
    .min(3, 'Name must be at least 3 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  slug: z
    .string({ required_error: 'Slug is required' })
    .min(3, 'Slug must be at least 3 characters long')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase and contain only letters, numbers, and hyphens (e.g., my-agent-skill)',
    })
    .trim(),

  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description cannot exceed 500 characters')
    .trim(),

  sourceType: z.enum(['github', 'manual', 'generated']).default('manual'),
  sourceUrl: z.string().url('Source URL must be a valid URL').optional(),
  sourcePath: z.string().optional(),
  visibility: z.enum(['public', 'unlisted', 'private']).default('public'),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;

/**
 * Validation schema for releasing a new Skill Version
 */
export const publishVersionSchema = z.object({
  version: z
    .string({ required_error: 'Version is required' })
    .regex(/^\d+\.\d+\.\d+$/, {
      message: 'Version must follow semantic versioning format (e.g. 1.0.0, 1.2.3)',
    }),

  readmeContent: z
    .string({ required_error: 'Readme or instruction content is required' })
    .min(20, 'Skill instructions must be at least 20 characters long'),

  contentLocation: z
    .string()
    .default('inline'),

  license: z
    .string()
    .default('MIT'),

  sourceCommit: z
    .string()
    .optional(),
});

export type PublishVersionInput = z.infer<typeof publishVersionSchema>;

/**
 * Validation schema for listing & searching skills
 */
export const listSkillsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListSkillsQuery = z.infer<typeof listSkillsQuerySchema>;
