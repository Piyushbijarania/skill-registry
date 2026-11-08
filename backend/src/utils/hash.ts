import crypto from 'crypto';

/**
 * Generates a cryptographic SHA-256 hash string for any text content.
 */
export const calculateSha256 = (content: string): string => {
  return crypto.createHash('sha256').update(content).digest('hex');
};
