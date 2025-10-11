/**
 * UserRole Value Object
 * Sincronizado com backend: JUNIOR → PLENO → SENIOR → TECH_LEAD → ARCHITECT
 */
export enum UserRoleEnum {
  JUNIOR = 'JUNIOR',
  PLENO = 'PLENO',
  SENIOR = 'SENIOR',
  TECH_LEAD = 'TECH_LEAD',
  ARCHITECT = 'ARCHITECT'
}

export class UserRole {
  private static readonly ROLE_HIERARCHY = [
    UserRoleEnum.JUNIOR,
    UserRoleEnum.PLENO,
    UserRoleEnum.SENIOR,
    UserRoleEnum.TECH_LEAD,
    UserRoleEnum.ARCHITECT
  ];

  private constructor(private readonly value: UserRoleEnum) {}

  static create(value: string): UserRole {
    const upperValue = value.toUpperCase() as UserRoleEnum;
    if (!Object.values(UserRoleEnum).includes(upperValue)) {
      throw new Error(`Invalid UserRole: ${value}`);
    }
    return new UserRole(upperValue);
  }

  static default(): UserRole {
    return new UserRole(UserRoleEnum.JUNIOR);
  }

  getValue(): UserRoleEnum {
    return this.value;
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  isSeniorOrAbove(): boolean {
    const currentIndex = UserRole.ROLE_HIERARCHY.indexOf(this.value);
    const seniorIndex = UserRole.ROLE_HIERARCHY.indexOf(UserRoleEnum.SENIOR);
    return currentIndex >= seniorIndex;
  }

  canMentor(): boolean {
    return this.value !== UserRoleEnum.JUNIOR;
  }

  canLeadTeam(): boolean {
    return this.value === UserRoleEnum.TECH_LEAD || this.value === UserRoleEnum.ARCHITECT;
  }

  getDisplayName(): string {
    const names: Record<UserRoleEnum, string> = {
      [UserRoleEnum.JUNIOR]: 'Júnior',
      [UserRoleEnum.PLENO]: 'Pleno',
      [UserRoleEnum.SENIOR]: 'Sênior',
      [UserRoleEnum.TECH_LEAD]: 'Tech Lead',
      [UserRoleEnum.ARCHITECT]: 'Arquiteto'
    };
    return names[this.value];
  }
}
