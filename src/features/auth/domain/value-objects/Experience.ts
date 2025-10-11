import { Level } from './Level';

/**
 * Experience Value Object
 * Encapsula lógica de XP e progressão de nível
 */
export class Experience {
  private constructor(private readonly value: number) {
    if (!this.isValid(value)) {
      throw new Error('Experience must be non-negative integer');
    }
  }

  static create(value: number): Experience {
    return new Experience(value);
  }

  static initial(): Experience {
    return new Experience(0);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Experience): boolean {
    return this.value === other.value;
  }

  add(amount: number): Experience {
    if (amount < 0) {
      throw new Error('Cannot add negative XP');
    }
    return new Experience(this.value + amount);
  }

  shouldLevelUp(currentLevel: Level): boolean {
    if (currentLevel.isMaxLevel()) {
      return false;
    }
    const nextLevel = currentLevel.increment();
    return this.value >= nextLevel.getMinXP();
  }

  calculateLevel(): Level {
    return Level.fromXP(this.value);
  }

  getProgressToNextLevel(currentLevel: Level): {
    progress: number;
    xpToNext: number;
    currentXP: number;
    nextLevelXP: number;
  } {
    if (currentLevel.isMaxLevel()) {
      return {
        progress: 100,
        xpToNext: 0,
        currentXP: this.value,
        nextLevelXP: this.value
      };
    }

    const nextLevel = currentLevel.increment();
    const currentLevelMinXP = currentLevel.getMinXP();
    const nextLevelMinXP = nextLevel.getMinXP();

    const xpInCurrentLevel = this.value - currentLevelMinXP;
    const xpNeededForNextLevel = nextLevelMinXP - currentLevelMinXP;
    const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    return {
      progress: Math.min(Math.round(progress * 100) / 100, 100),
      xpToNext: nextLevelMinXP - this.value,
      currentXP: this.value,
      nextLevelXP: nextLevelMinXP
    };
  }

  private isValid(value: number): boolean {
    return Number.isInteger(value) && value >= 0;
  }
}
