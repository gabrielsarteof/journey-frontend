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
    title: 'Credenciais Inválidas',
    message: 'O email ou senha informados estão incorretos.',
    actionHint: 'Verifique suas credenciais e tente novamente.',
  },

  [AuthErrorCodes.EMAIL_ALREADY_EXISTS]: {
    title: 'Email Já Cadastrado',
    message: 'Este email já está registrado em nossa plataforma.',
    actionHint: 'Tente fazer login ou use outro email para se cadastrar.',
  },

  [AuthErrorCodes.UNAUTHORIZED]: {
    title: 'Acesso Não Autorizado',
    message: 'Você não possui permissão para acessar este recurso.',
    actionHint: 'Faça login novamente para continuar.',
  },

  [AuthErrorCodes.USER_NOT_FOUND]: {
    title: 'Usuário Não Encontrado',
    message: 'Não foi possível localizar o usuário solicitado.',
    actionHint: 'Verifique os dados ou entre em contato com o suporte.',
  },

  [AuthErrorCodes.TOO_MANY_LOGIN_ATTEMPTS]: {
    title: 'Muitas Tentativas de Login',
    message: 'Você excedeu o número de tentativas permitidas.',
    actionHint: 'Por favor, aguarde 15 minutos antes de tentar novamente.',
  },

  // Token Errors
  [AuthErrorCodes.TOKEN_INVALID]: {
    title: 'Sessão Inválida',
    message: 'Sua sessão é inválida ou foi comprometida.',
    actionHint: 'Por favor, faça login novamente.',
  },

  [AuthErrorCodes.TOKEN_EXPIRED]: {
    title: 'Sessão Expirada',
    message: 'Sua sessão expirou por motivos de segurança.',
    actionHint: 'Faça login novamente para continuar.',
  },

  // Session Errors
  [AuthErrorCodes.SESSION_NOT_FOUND]: {
    title: 'Sessão Não Encontrada',
    message: 'Não foi possível localizar sua sessão ativa.',
    actionHint: 'Inicie uma nova sessão fazendo login.',
  },

  // Validation Errors
  [AuthErrorCodes.VALIDATION_FAILED]: {
    title: 'Dados Inválidos',
    message: 'Os dados fornecidos não atendem aos requisitos necessários.',
    actionHint: 'Corrija os campos destacados e tente novamente.',
  },

  // Network Errors
  [AuthErrorCodes.REQUEST_TIMEOUT]: {
    title: 'Tempo Esgotado',
    message: 'A requisição demorou muito para ser processada.',
    actionHint: 'Verifique sua conexão e tente novamente.',
  },

  [AuthErrorCodes.NETWORK_ERROR]: {
    title: 'Erro de Conexão',
    message: 'Não foi possível conectar ao servidor.',
    actionHint: 'Verifique sua conexão com a internet e tente novamente.',
  },

  // Generic
  [AuthErrorCodes.UNKNOWN_ERROR]: {
    title: 'Erro Inesperado',
    message: 'Ocorreu um erro inesperado durante a operação.',
    actionHint: 'Tente novamente. Se o problema persistir, contate o suporte.',
  },
};
