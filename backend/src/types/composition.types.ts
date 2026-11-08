import { z } from 'zod';

/**
 * Validation schema for composing multiple existing skills into a new unified skill
 */
export const composeSkillsSchema = z.object({
  name: z
    .string({ required_error: 'Composed skill name is required' })
    .min(3, 'Name must be at least 3 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description cannot exceed 500 characters')
    .trim(),

  sourceSkillVersionIds: z
    .array(z.string().uuid('Invalid source skill version ID'))
    .min(2, 'At least 2 source skills are required for composition')
    .max(5, 'Cannot compose more than 5 skills in a single bundle'),

  customInstructions: z
    .string()
    .max(2000, 'Custom instructions cannot exceed 2000 characters')
    .optional(),
});

export type ComposeSkillsInput = z.infer<typeof composeSkillsSchema>;

/**
 * Validation schema for generating a custom skill from a natural language prompt
 */
export const generateSkillSchema = z.object({
  prompt: z
    .string({ required_error: 'Prompt is required' })
    .min(10, 'Prompt must be at least 10 characters long')
    .max(1000, 'Prompt cannot exceed 1000 characters')
    .trim(),

  name: z
    .string({ required_error: 'Skill name is required' })
    .min(3, 'Name must be at least 3 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
});

export type GenerateSkillInput = z.infer<typeof generateSkillSchema>;
