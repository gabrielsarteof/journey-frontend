/**
 * Error Message Catalog - Domain Layer
 *
 * Catálogo de mensagens de erro localizadas em português
 * Implementa o padrão Strategy para mensagens contextualizadas
 *
 * @pattern Strategy, i18n
 * @layer Domain
 */

import { AuthErrorCodes, type AuthErrorCode } from './AuthErrorCodes';

export interface ErrorMessageStrategy {
  readonly title: string;
  readonly message: string;
  readonly actionHint?: string;
}

/**
 * Mapeia códigos de erro para mensagens amigáveis em português
 * Aplica o princípio SRP: uma única responsabilidade de fornecer mensagens
 */
export const AuthErrorMessages: Record<AuthErrorCode, ErrorMessageStrategy> = {
  // Authentication Errors
  [AuthErrorCodes.INVALID_CREDENTIALS]: {
    title: 'Ops, algo não está certo',
    message: 'Email ou senha incorretos',
    actionHint: 'Confira seus dados e tente novamente',
  },

  [AuthErrorCodes.EMAIL_ALREADY_EXISTS]: {
    title: 'Esse email já está em uso',
    message: 'Parece que você já tem uma conta conosco',
    actionHint: 'Que tal fazer login?',
  },

  [AuthErrorCodes.UNAUTHORIZED]: {
    title: 'Acesso negado',
    message: 'Você precisa estar logado para continuar',
    actionHint: 'Faça login para acessar',
  },

  [AuthErrorCodes.USER_NOT_FOUND]: {
    title: 'Hmm, não encontramos você',
    message: 'Esse usuário não existe',
    actionHint: 'Verifique os dados ou crie uma conta',
  },

  [AuthErrorCodes.TOO_MANY_LOGIN_ATTEMPTS]: {
    title: 'Calma lá!',
    message: 'Muitas tentativas de login',
    actionHint: 'Aguarde 15 minutos e tente novamente',
  },

  // Token Errors
  [AuthErrorCodes.TOKEN_INVALID]: {
    title: 'Sessão inválida',
    message: 'Sua sessão não é mais válida',
    actionHint: 'Faça login novamente',
  },

  [AuthErrorCodes.TOKEN_EXPIRED]: {
    title: 'Sua sessão expirou',
    message: 'Por segurança, você foi desconectado',
    actionHint: 'Faça login para continuar',
  },

  // Session Errors
  [AuthErrorCodes.SESSION_NOT_FOUND]: {
    title: 'Sessão não encontrada',
    message: 'Não conseguimos encontrar sua sessão',
    actionHint: 'Faça login novamente',
  },

  // Validation Errors
  [AuthErrorCodes.VALIDATION_FAILED]: {
    title: 'Verifique seus dados',
    message: 'Alguns campos precisam ser corrigidos',
    actionHint: 'Corrija os erros e tente novamente',
  },

  // Network Errors
  [AuthErrorCodes.REQUEST_TIMEOUT]: {
    title: 'Demorou demais',
    message: 'A conexão está muito lenta',
    actionHint: 'Verifique sua internet e tente de novo',
  },

  [AuthErrorCodes.NETWORK_ERROR]: {
    title: 'Sem conexão',
    message: 'Não conseguimos conectar ao servidor',
    actionHint: 'Verifique sua internet e tente novamente',
  },

  // Generic
  [AuthErrorCodes.UNKNOWN_ERROR]: {
    title: 'Ops, algo deu errado',
    message: 'Tivemos um problema inesperado',
    actionHint: 'Tente novamente em alguns instantes',
  },
};
