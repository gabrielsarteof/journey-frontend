export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Estratégia unificada de retry com backoff exponencial
 * Suporta jitter para evitar thundering herd problem em retry storms
 */
export class RetryStrategy {
  async execute<T>(operation: () => Promise<T>, config: RetryConfig): Promise<T> {
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const isLastAttempt = attempt === config.maxAttempts;
        const shouldNotRetry = config.shouldRetry && !config.shouldRetry(error);

        if (isLastAttempt || shouldNotRetry) {
          throw error;
        }

        const delay = this.calculateDelay(attempt, config);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Retry failed: maxAttempts reached');
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    const baseDelay = config.delayMs;
    const multiplier = config.backoffMultiplier || 1;

    let delay = baseDelay * Math.pow(multiplier, attempt - 1);

    if (config.jitter) {
      const jitterAmount = Math.random() * 0.1 * delay;
      delay += jitterAmount;
    }

    if (config.maxDelayMs) {
      delay = Math.min(delay, config.maxDelayMs);
    }

    return delay;
  }
}
