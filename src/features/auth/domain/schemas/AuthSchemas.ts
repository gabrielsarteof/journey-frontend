import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Você deve aceitar os termos e condições',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
})

export type RegisterDTO = z.infer<typeof RegisterSchema>
export type LoginDTO = z.infer<typeof LoginSchema>
export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>

export type ApiResult<TData> =
  | { success: true; data: TData }
  | { success: false; error: ApiError }

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface ApiError {
  error: string
  code: string
  message: string
  statusCode: number
}

export type AuthLoginResult = ApiResult<import('../entities/User').AuthResult>
export type AuthRegisterResult = ApiResult<import('../entities/User').AuthResult>
export type AuthUserResult = ApiResult<import('../entities/User').User>
export type AuthLogoutResult = ApiResult<void>