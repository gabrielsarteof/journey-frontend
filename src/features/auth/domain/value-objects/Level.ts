/**
 * Level Value Object
 * Sincronizado com backend: 10 níveis com títulos e thresholds
 */
export class Level {
  private static readonly LEVELS = [
    { level: 1, title: 'Iniciante', minXP: 0 },
    { level: 2, title: 'Aprendiz', minXP: 100 },
    { level: 3, title: 'Praticante', minXP: 300 },
    { level: 4, title: 'Competente', minXP: 600 },
    { level: 5, title: 'Proficiente', minXP: 1000 },
    { level: 6, title: 'Avançado', minXP: 1500 },
    { level: 7, title: 'Especialista', minXP: 2500 },
    { level: 8, title: 'Mestre', minXP: 4000 },
    { level: 9, title: 'Grão-Mestre', minXP: 6000 },
    { level: 10, title: 'Lenda', minXP: 10000 }
  ];

  private constructor(private readonly value: number) {
    if (!this.isValid(value)) {
      throw new Error(`Level must be between 1 and ${Level.LEVELS.length}`);
    }
  }

  static create(value: number): Level {
    return new Level(value);
  }

  static initial(): Level {
    return new Level(1);
  }

  static fromXP(totalXP: number): Level {
    for (let i = Level.LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= Level.LEVELS[i].minXP) {
        return new Level(Level.LEVELS[i].level);
      }
    }
    return Level.initial();
  }

  getValue(): number {
    return this.value;
  }

  getTitle(): string {
    return Level.LEVELS[this.value - 1].title;
  }

  getMinXP(): number {
    return Level.LEVELS[this.value - 1].minXP;
  }

  equals(other: Level): boolean {
    return this.value === other.value;
  }

  increment(): Level {
    if (this.isMaxLevel()) {
      return this;
    }
    return new Level(this.value + 1);
  }

  isMaxLevel(): boolean {
    return this.value === Level.LEVELS.length;
  }

  canAccessPremiumFeatures(): boolean {
    return this.value >= 5;
  }

  private isValid(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= Level.LEVELS.length;
  }
}
