type Constructor<T = object> = new (...args: unknown[]) => T
type Factory<T> = () => T
type ServiceKey = string | symbol

interface ServiceDefinition<T> {
  factory: Factory<T>
  singleton: boolean
  instance?: T
}

export class DIContainer {
  private services = new Map<ServiceKey, ServiceDefinition<unknown>>()

  register<T>(
    key: ServiceKey,
    factory: Factory<T>,
    options: { singleton?: boolean } = {}
  ): void {
    this.services.set(key, {
      factory,
      singleton: options.singleton ?? false
    })
  }

  registerClass<T>(
    key: ServiceKey,
    constructor: Constructor<T>,
    dependencies: ServiceKey[] = [],
    options: { singleton?: boolean } = {}
  ): void {
    const factory = () => {
      const deps = dependencies.map(dep => this.resolve(dep))
      return new constructor(...deps)
    }

    this.register(key, factory, options)
  }

  resolve<T>(key: ServiceKey): T {
    const service = this.services.get(key)

    if (!service) {
      throw new Error(`Service ${String(key)} not registered`)
    }

    if (service.singleton) {
      if (!service.instance) {
        service.instance = service.factory()
      }
      return service.instance as T
    }

    return service.factory() as T
  }

  has(key: ServiceKey): boolean {
    return this.services.has(key)
  }

  clear(): void {
    this.services.clear()
  }
}

export const container = new DIContainer()