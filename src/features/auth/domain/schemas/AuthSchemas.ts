import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Hmm, esse email não parece válido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Sua senha precisa ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Adicione pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Adicione pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Adicione pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Adicione pelo menos um caractere especial'),
  confirmPassword: z
    .string()
    .min(1, 'Por favor, confirme sua senha'),
  name: z
    .string()
    .min(2, 'Seu nome precisa ter pelo menos 2 caracteres')
    .max(100, 'Ops! O nome está muito longo')
    .trim()
    .regex(/^[A-ZÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝŸ]/, 'Comece seu nome com letra maiúscula')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Use apenas letras e espaços no nome')
    .refine((val) => val.split(' ').length >= 2, {
      message: 'Precisamos do seu nome completo',
    }),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Aceite os termos para continuar',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Hmm, esse email não parece válido')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Por favor, digite sua senha'),
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