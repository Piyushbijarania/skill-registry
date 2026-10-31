import { prisma } from '../config/db';
import { RegisterInput, LoginInput, AuthUser } from '../types/auth.types';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
    createdAt: Date;
  };
  token: string;
}

export class AuthService {
  /**
   * Registers a new user account.
   * Enforces email uniqueness and secure password storage.
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const normalizedEmail = input.email.toLowerCase().trim();

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictError('A user with this email address already exists');
    }

    // Hash password using bcrypt
    const passwordHash = await hashPassword(input.password);

    // Persist new user record
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        displayName: input.displayName.trim(),
        role: input.role || 'DEVELOPER',
      },
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role as AuthUser['role'],
    };

    const token = signAccessToken(authUser);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Authenticates a user with email and password.
   * Returns signed JWT on success. Uses generic error message to prevent user enumeration.
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const normalizedEmail = input.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role as AuthUser['role'],
    };

    const token = signAccessToken(authUser);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Retrieves profile data and activity statistics for the currently logged-in user.
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            publishedSkills: true,
            collections: true,
            reviews: true,
            votes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    return user;
  }
}

export const authService = new AuthService();

