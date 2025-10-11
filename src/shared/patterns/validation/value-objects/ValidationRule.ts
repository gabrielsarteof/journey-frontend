// Value Object para regra de validação - imutável e sem identidade
export class ValidationRule {
  private constructor(
    private readonly _name: string,
    private readonly _validator: (value: any) => boolean | Promise<boolean>,
    private readonly _message: string,
    private readonly _severity: 'error' | 'warning' | 'info' = 'error'
  ) {}

  static create(
    name: string,
    validator: (value: any) => boolean | Promise<boolean>,
    message: string,
    severity: 'error' | 'warning' | 'info' = 'error'
  ): ValidationRule {
    if (!name?.trim()) {
      throw new Error('Nome da regra é obrigatório');
    }
    if (!validator) {
      throw new Error('Validator é obrigatório');
    }
    if (!message?.trim()) {
      throw new Error('Mensagem é obrigatória');
    }

    return new ValidationRule(name, validator, message, severity);
  }

  get name(): string {
    return this._name;
  }

  get message(): string {
    return this._message;
  }

  get severity(): 'error' | 'warning' | 'info' {
    return this._severity;
  }

  async validate(value: any): Promise<boolean> {
    try {
      return await this._validator(value);
    } catch (error) {
      console.error(`Erro na validação da regra ${this._name}:`, error);
      return false;
    }
  }

  equals(other: ValidationRule): boolean {
    return this._name === other._name &&
           this._message === other._message &&
           this._severity === other._severity;
  }
}