import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Environment Variables Schema Definition
 * Enforces strict typing, defaults, and format validation.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 65535, {
      message: 'PORT must be a valid port number between 1 and 65535',
    }),

  HOST: z.string().default('0.0.0.0'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  JWT_SECRET: z
    .string()
    .min(32, { message: 'JWT_SECRET must be at least 32 characters long for security' })
    .default('development-jwt-secret-key-at-least-32-characters-long'),

  JWT_EXPIRES_IN: z.string().default('7d'),

  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/skill_marketplace?schema=public'),

  AI_PROVIDER: z.enum(['mock', 'openai', 'anthropic']).default('mock'),
  OPENAI_API_KEY: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables.
 * Fails fast: terminates the process if required variables are missing or malformed.
 */
const parseEnv = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ FATAL: Invalid environment variables detected at startup:');
    result.error.issues.forEach((issue) => {
      console.error(`  - [${issue.path.join('.')}]: ${issue.message}`);
    });
    process.exit(1);
  }

  return Object.freeze(result.data);
};

export const env = parseEnv();
