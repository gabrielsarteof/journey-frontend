import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * Difficulty Value Object
 *
 * Representa os níveis de dificuldade dos desafios.
 * Alinhado com o backend (Difficulty enum).
 */

export type DifficultyValue = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'

export class Difficulty extends ValueObject<DifficultyValue> {
  private static readonly VALID_DIFFICULTIES: ReadonlyArray<DifficultyValue> = [
    'EASY',
    'MEDIUM',
    'HARD',
    'EXPERT'
  ] as const

  private constructor(difficulty: DifficultyValue) {
    super(difficulty)
  }

  static create(difficulty: DifficultyValue): Difficulty {
    return new Difficulty(difficulty)
  }

  // Factory methods
  static easy(): Difficulty {
    return new Difficulty('EASY')
  }

  static medium(): Difficulty {
    return new Difficulty('MEDIUM')
  }

  static hard(): Difficulty {
    return new Difficulty('HARD')
  }

  static expert(): Difficulty {
    return new Difficulty('EXPERT')
  }

  protected validate(): void {
    if (!Difficulty.VALID_DIFFICULTIES.includes(this.value)) {
      throw new DomainError(
        'Nível de dificuldade inválido',
        'difficulty',
        'INVALID_DIFFICULTY'
      )
    }
  }

  // Type guards
  isEasy(): boolean {
    return this.value === 'EASY'
  }

  isMedium(): boolean {
    return this.value === 'MEDIUM'
  }

  isHard(): boolean {
    return this.value === 'HARD'
  }

  isExpert(): boolean {
    return this.value === 'EXPERT'
  }

  /**
   * Retorna o nível necessário para desbloquear
   */
  getRequiredLevel(): number {
    const requiredLevels: Record<DifficultyValue, number> = {
      EASY: 1,
      MEDIUM: 3,
      HARD: 5,
      EXPERT: 8
    }
    return requiredLevels[this.value]
  }

  /**
   * Retorna o nome traduzido da dificuldade
   */
  getDisplayName(): string {
    const names: Record<DifficultyValue, string> = {
      EASY: 'Fácil',
      MEDIUM: 'Médio',
      HARD: 'Difícil',
      EXPERT: 'Expert'
    }
    return names[this.value]
  }

  /**
   * Retorna a cor associada à dificuldade
   */
  getColor(): string {
    const colors: Record<DifficultyValue, string> = {
      EASY: '#10b981',   // Verde
      MEDIUM: '#f59e0b', // Amarelo
      HARD: '#ef4444',   // Vermelho
      EXPERT: '#8b5cf6'  // Roxo
    }
    return colors[this.value]
  }

  /**
   * Retorna o peso numérico da dificuldade (para ordenação)
   */
  getWeight(): number {
    const weights: Record<DifficultyValue, number> = {
      EASY: 1,
      MEDIUM: 2,
      HARD: 3,
      EXPERT: 4
    }
    return weights[this.value]
  }

  /**
   * Compara dificuldades
   */
  isHarderThan(other: Difficulty): boolean {
    return this.getWeight() > other.getWeight()
  }

  isEasierThan(other: Difficulty): boolean {
    return this.getWeight() < other.getWeight()
  }

  equals(other: Difficulty): boolean {
    return this.value === other.value
  }
}
