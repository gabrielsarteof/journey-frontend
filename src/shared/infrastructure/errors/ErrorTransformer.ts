/**
 * Normaliza erros desconhecidos garantindo stack trace completo
 * Type narrowing progressivo: Error > string > object > unknown
 */
export class ErrorTransformer {
  transform(error: unknown, context: string, operation: string): Error {
    if (error instanceof Error) {
      return error;
    }

    const errorMessage = this.extractErrorMessage(error);
    return new Error(`[${context}] Operation '${operation}' failed: ${errorMessage}`);
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return String(error);
  }
}
