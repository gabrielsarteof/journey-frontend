import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { UserName } from '../value-objects/UserName';
import { Level } from '../value-objects/Level';
import { Experience } from '../value-objects/Experience';
import { Streak } from '../value-objects/Streak';
import { UserRole } from '../value-objects/UserRole';
import { DomainEvent } from '@/shared/kernel/domain/events/DomainEvent';
import { UserLeveledUp } from '../events/UserLeveledUp';
import { UserRegistered } from '../events/UserRegistered';

/**
 * User Entity (DDD)
 * Aggregate Root com Value Objects e Domain Events
 */
export class User {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    readonly id: UserId,
    readonly email: Email,
    private name: UserName,
    private level: Level,
    private xp: Experience,
    private streak: Streak,
    private role: UserRole,
    private _avatarUrl: string | null,
    private _position: string | null,
    private _yearsOfExperience: number,
    private _preferredLanguages: string[],
    private _githubUsername: string | null,
    private _companyId: string | null,
    private _teamId: string | null,
    private _emailVerified: boolean,
    private _onboardingCompleted: boolean,
    readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(props: {
    email: string;
    name: string;
    role?: string;
  }): User {
    const user = new User(
      UserId.generate(),
      Email.create(props.email),
      UserName.create(props.name),
      Level.initial(),
      Experience.initial(),
      Streak.initial(),
      props.role ? UserRole.create(props.role) : UserRole.default(),
      null,
      null,
      0,
      [],
      null,
      null,
      null,
      false,
      false,
      new Date(),
      new Date()
    );

    user.recordEvent(new UserRegistered(
      user.id.getValue(),
      user.email.getValue(),
      user.name.getValue()
    ));

    return user;
  }

  static reconstitute(props: {
    id: UserId;
    email: Email;
    name: UserName;
    level: Level;
    xp: Experience;
    streak: Streak;
    role: UserRole;
    avatarUrl: string | null;
    position: string | null;
    yearsOfExperience: number;
    preferredLanguages: string[];
    githubUsername: string | null;
    companyId: string | null;
    teamId: string | null;
    emailVerified: boolean;
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      props.email,
      props.name,
      props.level,
      props.xp,
      props.streak,
      props.role,
      props.avatarUrl,
      props.position,
      props.yearsOfExperience,
      props.preferredLanguages,
      props.githubUsername,
      props.companyId,
      props.teamId,
      props.emailVerified,
      props.onboardingCompleted,
      props.createdAt,
      props.updatedAt
    );
  }

  addExperience(amount: number): void {
    const oldLevel = this.level;
    this.xp = this.xp.add(amount);

    if (this.xp.shouldLevelUp(this.level)) {
      this.level = this.level.increment();
      this.recordEvent(new UserLeveledUp(
        this.id.getValue(),
        oldLevel,
        this.level,
        this.xp.getValue()
      ));
    }

    this.updatedAt = new Date();
  }

  incrementStreak(): void {
    this.streak = this.streak.increment();
    this.updatedAt = new Date();
  }

  resetStreak(): void {
    this.streak = this.streak.reset();
    this.updatedAt = new Date();
  }

  canAccessPremiumFeatures(): boolean {
    return this.level.canAccessPremiumFeatures();
  }

  getName(): string {
    return this.name.getValue();
  }

  getLevel(): number {
    return this.level.getValue();
  }

  getXP(): number {
    return this.xp.getValue();
  }

  getStreak(): number {
    return this.streak.getValue();
  }

  getRole(): string {
    return this.role.getValue();
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  private recordEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  toPlainObject() {
    return {
      id: this.id.getValue(),
      email: this.email.getValue(),
      name: this.name.getValue(),
      role: this.role.getValue(),
      currentLevel: this.level.getValue(),
      totalXp: this.xp.getValue(),
      currentStreak: this.streak.getValue(),
      avatarUrl: this._avatarUrl,
      position: this._position,
      yearsOfExperience: this._yearsOfExperience,
      preferredLanguages: this._preferredLanguages,
      githubUsername: this._githubUsername,
      companyId: this._companyId,
      teamId: this._teamId,
      emailVerified: this._emailVerified,
      onboardingCompleted: this._onboardingCompleted,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResult {
  user: User
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}