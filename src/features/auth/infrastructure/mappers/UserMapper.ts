import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/value-objects/UserId';
import { Email } from '../../domain/value-objects/Email';
import { UserName } from '../../domain/value-objects/UserName';
import { Level } from '../../domain/value-objects/Level';
import { Experience } from '../../domain/value-objects/Experience';
import { Streak } from '../../domain/value-objects/Streak';
import { UserRole } from '../../domain/value-objects/UserRole';
import type { UserResource } from '../repositories/ApiAuthRepository';

/**
 * UserMapper - Anti-Corruption Layer
 * Converte entre camada de infraestrutura (UserResource) e domínio (User Entity)
 * Garante que regras de domínio não vazem para infraestrutura
 */
export class UserMapper {
  static toDomain(resource: UserResource): User {
    return User.reconstitute({
      id: UserId.create(resource.id),
      email: Email.create(resource.email),
      name: UserName.create(resource.name),
      level: Level.create(resource.currentLevel || 1),
      xp: Experience.create(resource.totalXp || 0),
      streak: Streak.create(resource.currentStreak || 0),
      role: UserRole.create(resource.roles?.[0] || 'JUNIOR'),
      avatarUrl: resource.avatarUrl || null,
      position: null,
      yearsOfExperience: 0,
      preferredLanguages: [],
      githubUsername: null,
      companyId: null,
      teamId: null,
      emailVerified: resource.isActive || false,
      onboardingCompleted: false,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt)
    });
  }

  static toPersistence(user: User): Partial<UserResource> {
    const plain = user.toPlainObject();
    return {
      id: plain.id,
      email: plain.email,
      name: plain.name,
      roles: [plain.role],
      isActive: plain.emailVerified,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }

  static toPlainObject(user: User) {
    return user.toPlainObject();
  }
}
