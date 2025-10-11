// Metadata para armazenar validações
export const VALIDATION_METADATA_KEY = Symbol('validation');

export interface ValidationRule {
  validator: (value: any, target: any) => boolean | Promise<boolean>;
  message: string;
  propertyKey: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  params?: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  infos: ValidationError[];
}

export interface ValidationError {
  property: string;
  message: string;
  value: any;
  severity: 'error' | 'warning' | 'info';
  code?: string;
}

// Função para obter metadata de validação
function getValidationMetadata(target: any): ValidationRule[] {
  return Reflect.getMetadata(VALIDATION_METADATA_KEY, target) || [];
}

// Função para definir metadata de validação
function defineValidationMetadata(target: any, rule: ValidationRule): void {
  const existingRules = getValidationMetadata(target);
  existingRules.push(rule);
  Reflect.defineMetadata(VALIDATION_METADATA_KEY, existingRules, target);
}

// Decorator base para validação
function createValidationDecorator(
  validator: (value: any, params?: any) => boolean | Promise<boolean>,
  message: string,
  severity: 'error' | 'warning' | 'info' = 'error',
  params?: Record<string, any>
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const rule: ValidationRule = {
      validator: (value, _target) => validator(value, params),
      message,
      propertyKey: String(propertyKey),
      severity,
      params
    };
    defineValidationMetadata(target, rule);
  };
}

// Decorators de validação básicos

export function Required(message: string = 'Campo obrigatório'): PropertyDecorator {
  return createValidationDecorator(
    (value) => value !== null && value !== undefined && value !== '',
    message,
    'error'
  );
}

export function MinLength(min: number, message?: string): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (typeof value !== 'string') return true;
      return value.length >= min;
    },
    message || `Deve ter pelo menos ${min} caracteres`,
    'error',
    { min }
  );
}

export function MaxLength(max: number, message?: string): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (typeof value !== 'string') return true;
      return value.length <= max;
    },
    message || `Deve ter no máximo ${max} caracteres`,
    'error',
    { max }
  );
}

export function Email(message: string = 'Formato de email inválido'): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
    'error'
  );
}

export function Pattern(regex: RegExp, message: string): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (!value) return true;
      return regex.test(value);
    },
    message,
    'error',
    { regex: regex.source }
  );
}

export function Min(min: number, message?: string): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (typeof value !== 'number') return true;
      return value >= min;
    },
    message || `Deve ser maior ou igual a ${min}`,
    'error',
    { min }
  );
}

export function Max(max: number, message?: string): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (typeof value !== 'number') return true;
      return value <= max;
    },
    message || `Deve ser menor ou igual a ${max}`,
    'error',
    { max }
  );
}

export function IsPositive(message: string = 'Deve ser um número positivo'): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (typeof value !== 'number') return true;
      return value > 0;
    },
    message,
    'error'
  );
}

export function IsUrl(message: string = 'Deve ser uma URL válida'): PropertyDecorator {
  return createValidationDecorator(
    (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
    'error'
  );
}

// Decorators de validação customizada
export function Custom(
  validator: (value: any, target: any) => boolean | Promise<boolean>,
  message: string,
  severity: 'error' | 'warning' | 'info' = 'error'
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const rule: ValidationRule = {
      validator,
      message,
      propertyKey: String(propertyKey),
      severity
    };
    defineValidationMetadata(target, rule);
  };
}

export function ValidateIf(
  condition: (target: any) => boolean,
  validator: (value: any) => boolean,
  message: string
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const rule: ValidationRule = {
      validator: (value, targetInstance) => {
        if (!condition(targetInstance)) {
          return true;
        }
        return validator(value);
      },
      message,
      propertyKey: String(propertyKey),
      severity: 'error'
    };
    defineValidationMetadata(target, rule);
  };
}

// Decorator para validação assíncrona
export function AsyncValidation(
  validator: (value: any) => Promise<boolean>,
  message: string,
  severity: 'error' | 'warning' | 'info' = 'error'
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const rule: ValidationRule = {
      validator: async (value) => await validator(value),
      message,
      propertyKey: String(propertyKey),
      severity
    };
    defineValidationMetadata(target, rule);
  };
}

// Decorator para validação com warning
export function Warning(
  validator: (value: any) => boolean,
  message: string
): PropertyDecorator {
  return createValidationDecorator(validator, message, 'warning');
}

// Decorator para informação
export function Info(
  validator: (value: any) => boolean,
  message: string
): PropertyDecorator {
  return createValidationDecorator(validator, message, 'info');
}

// Pipeline de validação
export class ValidationPipeline {
  async validate(target: any): Promise<ValidationResult> {
    const rules = getValidationMetadata(target.constructor.prototype);
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const infos: ValidationError[] = [];

    for (const rule of rules) {
      try {
        const value = target[rule.propertyKey];
        const isValid = await rule.validator(value, target);

        if (!isValid) {
          const error: ValidationError = {
            property: rule.propertyKey,
            message: rule.message,
            value,
            severity: rule.severity,
            code: rule.code
          };

          switch (rule.severity) {
            case 'error':
              errors.push(error);
              break;
            case 'warning':
              warnings.push(error);
              break;
            case 'info':
              infos.push(error);
              break;
          }
        }
      } catch (error) {
        errors.push({
          property: rule.propertyKey,
          message: `Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          value: target[rule.propertyKey],
          severity: 'error'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      infos
    };
  }

  // Validação rápida apenas para errors
  async isValid(target: any): Promise<boolean> {
    const result = await this.validate(target);
    return result.isValid;
  }

  // Validação de propriedade específica
  async validateProperty(target: any, propertyKey: string): Promise<ValidationError[]> {
    const rules = getValidationMetadata(target.constructor.prototype)
      .filter(rule => rule.propertyKey === propertyKey);

    const errors: ValidationError[] = [];

    for (const rule of rules) {
      try {
        const value = target[propertyKey];
        const isValid = await rule.validator(value, target);

        if (!isValid) {
          errors.push({
            property: propertyKey,
            message: rule.message,
            value,
            severity: rule.severity,
            code: rule.code
          });
        }
      } catch (error) {
        errors.push({
          property: propertyKey,
          message: `Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          value: target[propertyKey],
          severity: 'error'
        });
      }
    }

    return errors;
  }
}

// Instância global do pipeline
export const validationPipeline = new ValidationPipeline();