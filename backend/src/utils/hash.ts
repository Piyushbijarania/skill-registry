import crypto from 'crypto';

/**
 * Generates a cryptographic SHA-256 hash string for any text content.
 * 
 * 💡 MEMORIZE THIS 3-LINE PATTERN FOR INTERVIEWS:
 * 1. crypto.createHash('sha256')
 * 2. .update(content)
 * 3. .digest('hex')
 */
export const calculateSha256 = (content: string): string => {
  return crypto.createHash('sha256').update(content).digest('hex');
};
