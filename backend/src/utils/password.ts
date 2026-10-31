import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt with an adaptive salt work factor.
 *
 * @param password - Plain-text password to hash
 * @returns Cryptographically salted and hashed password string
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain-text candidate password against a stored bcrypt hash in constant time.
 * Prevents timing attacks.
 *
 * @param password - Plain-text password to check
 * @param hash - Stored bcrypt hash from database
 * @returns Boolean indicating whether password matches
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

