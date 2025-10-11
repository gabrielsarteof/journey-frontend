/**
 * Streak Value Object
 * Representa sequência de dias consecutivos de atividade
 * Backend tem StreakEntity completa, aqui é simplificado
 */
export class Streak {
  private constructor(private readonly value: number) {
    if (!this.isValid(value)) {
      throw new Error('Streak must be non-negative integer');
    }
  }

  static create(value: number): Streak {
    return new Streak(value);
  }

  static initial(): Streak {
    return new Streak(0);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Streak): boolean {
    return this.value === other.value;
  }

  increment(): Streak {
    return new Streak(this.value + 1);
  }

  reset(): Streak {
    return Streak.initial();
  }

  isActive(): boolean {
    return this.value > 0;
  }

  getMilestoneProgress(): { nextMilestone: number; progress: number } {
    const milestones = [7, 14, 30, 60, 100, 365];
    const nextMilestone = milestones.find(m => m > this.value) || milestones[milestones.length - 1];
    const previousMilestone = milestones.filter(m => m < this.value).pop() || 0;

    const progress = previousMilestone === nextMilestone
      ? 100
      : ((this.value - previousMilestone) / (nextMilestone - previousMilestone)) * 100;

    return {
      nextMilestone,
      progress: Math.round(progress * 100) / 100
    };
  }

  private isValid(value: number): boolean {
    return Number.isInteger(value) && value >= 0;
  }
}
