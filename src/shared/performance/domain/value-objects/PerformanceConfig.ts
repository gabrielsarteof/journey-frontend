export interface PerformanceConfigProps {
  readonly delay?: number
  readonly maxWait?: number
  readonly leading?: boolean
  readonly trailing?: boolean
  readonly cacheSize?: number
  readonly ttl?: number
}

/**
 * Encapsula configurações de performance seguindo princípios de Value Object.
 * Garante imutabilidade e equality baseada em valor.
 */
export class PerformanceConfig {
  private readonly props: Required<PerformanceConfigProps>

  constructor(props: Required<PerformanceConfigProps>) {
    this.props = props
  }

  static create(config: PerformanceConfigProps): PerformanceConfig {
    const defaults: Required<PerformanceConfigProps> = {
      delay: config.delay ?? 300,
      maxWait: config.maxWait ?? 1000,
      leading: config.leading ?? false,
      trailing: config.trailing ?? true,
      cacheSize: config.cacheSize ?? 50,
      ttl: config.ttl ?? 300000
    }

    return new PerformanceConfig(defaults)
  }

  get delay(): number { return this.props.delay }
  get maxWait(): number { return this.props.maxWait }
  get leading(): boolean { return this.props.leading }
  get trailing(): boolean { return this.props.trailing }
  get cacheSize(): number { return this.props.cacheSize }
  get ttl(): number { return this.props.ttl }

  // Value Objects são comparados por valor, não por referência
  equals(other: PerformanceConfig): boolean {
    return (
      this.props.delay === other.props.delay &&
      this.props.maxWait === other.props.maxWait &&
      this.props.leading === other.props.leading &&
      this.props.trailing === other.props.trailing &&
      this.props.cacheSize === other.props.cacheSize &&
      this.props.ttl === other.props.ttl
    )
  }

  // Métodos para criar novas instâncias preservando imutabilidade
  withDelay(delay: number): PerformanceConfig {
    return PerformanceConfig.create({ ...this.props, delay })
  }

  withCacheSize(cacheSize: number): PerformanceConfig {
    return PerformanceConfig.create({ ...this.props, cacheSize })
  }

  withTtl(ttl: number): PerformanceConfig {
    return PerformanceConfig.create({ ...this.props, ttl })
  }
}