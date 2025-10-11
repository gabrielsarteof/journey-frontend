import { createElement } from 'react';
import type { ComponentType, ReactElement } from 'react';

// Múltiplas implementações: SyncComponentFactory, ValidatedComponentFactory, LazyComponentFactory
export interface ComponentFactory {
  create(props?: Record<string, any>): ReactElement | null | Promise<ReactElement | null>;
  getMetadata(): ComponentMetadata;
  canCreate(props?: Record<string, any>): boolean;
}

export class ComponentMetadata {
  constructor(
    public readonly name: string,
    public readonly category: string,
    public readonly permissions: string[] = [],
    public readonly dependencies: string[] = [],
    public readonly defaultProps: Record<string, any> = {}
  ) {}

  hasPermission(userPermissions: string[]): boolean {
    if (this.permissions.length === 0) return true;
    return this.permissions.some(permission => userPermissions.includes(permission));
  }

  areDependenciesSatisfied(availableComponents: Set<string>): boolean {
    return this.dependencies.every(dep => availableComponents.has(dep));
  }
}

export abstract class BaseComponentFactory implements ComponentFactory {
  constructor(
    protected component: ComponentType<any>,
    protected metadata: ComponentMetadata
  ) {}

  abstract create(props?: Record<string, any>): ReactElement | null | Promise<ReactElement | null>;

  getMetadata(): ComponentMetadata {
    return this.metadata;
  }

  canCreate(_props?: Record<string, any>): boolean {
    return true;
  }

  protected mergeProps(props: Record<string, any> = {}): Record<string, any> {
    return { ...this.metadata.defaultProps, ...props };
  }
}

export class SyncComponentFactory extends BaseComponentFactory {
  create(props?: Record<string, any>): ReactElement | null {
    if (!this.canCreate(props)) {
      return null;
    }

    try {
      const mergedProps = this.mergeProps(props);
      return createElement(this.component, mergedProps);
    } catch (error) {
      console.error(`Error creating component ${this.metadata.name}:`, error);
      return null;
    }
  }
}

export class ValidatedComponentFactory extends BaseComponentFactory {
  constructor(
    component: ComponentType<any>,
    metadata: ComponentMetadata,
    private propValidator?: (props: any) => boolean
  ) {
    super(component, metadata);
  }

  canCreate(props?: Record<string, any>): boolean {
    return !this.propValidator || this.propValidator(props);
  }

  create(props?: Record<string, any>): ReactElement | null {
    if (!this.canCreate(props)) {
      console.warn(`Invalid props for component ${this.metadata.name}`);
      return null;
    }

    const mergedProps = this.mergeProps(props);
    return createElement(this.component, mergedProps);
  }
}

// Lazy loading com cache de componente carregado
export class LazyComponentFactory extends BaseComponentFactory {
  private loadedComponent: ComponentType<any> | null = null;
  private loadingPromise: Promise<ComponentType<any>> | null = null;

  constructor(
    private componentLoader: () => Promise<ComponentType<any>>,
    metadata: ComponentMetadata
  ) {
    super(null as any, metadata);
  }

  async create(props?: Record<string, any>): Promise<ReactElement | null> {
    try {
      const component = await this.getComponent();
      const mergedProps = this.mergeProps(props);
      return createElement(component, mergedProps);
    } catch (error) {
      console.error(`Error loading component ${this.metadata.name}:`, error);
      return null;
    }
  }

  private async getComponent(): Promise<ComponentType<any>> {
    if (this.loadedComponent) {
      return this.loadedComponent;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.componentLoader();
    this.loadedComponent = await this.loadingPromise;
    this.loadingPromise = null;

    return this.loadedComponent;
  }
}

export class ComponentRegistry {
  private factories = new Map<string, ComponentFactory>();

  register(name: string, factory: ComponentFactory): void {
    if (this.factories.has(name)) {
      console.warn(`Component ${name} is being overridden`);
    }
    this.factories.set(name, factory);
  }

  unregister(name: string): boolean {
    return this.factories.delete(name);
  }

  has(name: string): boolean {
    return this.factories.has(name);
  }

  getFactory(name: string): ComponentFactory | null {
    return this.factories.get(name) || null;
  }

  listComponents(): string[] {
    return Array.from(this.factories.keys());
  }

  listByCategory(category: string): string[] {
    return Array.from(this.factories.entries())
      .filter(([, factory]) => factory.getMetadata().category === category)
      .map(([name]) => name);
  }
}

export interface ComponentFilter {
  canResolve(metadata: ComponentMetadata, context: ResolverContext): boolean;
}

export interface ResolverContext {
  userPermissions: string[];
  availableComponents: Set<string>;
}

export class PermissionFilter implements ComponentFilter {
  canResolve(metadata: ComponentMetadata, context: ResolverContext): boolean {
    return metadata.hasPermission(context.userPermissions);
  }
}

export class DependencyFilter implements ComponentFilter {
  canResolve(metadata: ComponentMetadata, context: ResolverContext): boolean {
    return metadata.areDependenciesSatisfied(context.availableComponents);
  }
}

export class ComponentResolver {
  private filters: ComponentFilter[] = [];

  constructor(
    private registry: ComponentRegistry,
    private context: ResolverContext
  ) {
    this.filters = [
      new PermissionFilter(),
      new DependencyFilter()
    ];
  }

  resolve(name: string, props?: Record<string, any>): ReactElement | null | Promise<ReactElement | null> {
    const factory = this.registry.getFactory(name);
    if (!factory) {
      console.error(`Component ${name} not found`);
      return null;
    }

    const metadata = factory.getMetadata();

    const canResolve = this.filters.every(filter =>
      filter.canResolve(metadata, this.context)
    );

    if (!canResolve) {
      console.warn(`Component ${name} cannot be resolved due to filters`);
      return null;
    }

    return factory.create(props);
  }

  addFilter(filter: ComponentFilter): void {
    this.filters.push(filter);
  }
}

export class ComponentSystemBuilder {
  private registry = new ComponentRegistry();
  private userPermissions: string[] = [];

  withPermissions(permissions: string[]): this {
    this.userPermissions = permissions;
    return this;
  }

  registerSync(
    name: string,
    component: ComponentType<any>,
    category: string,
    options: {
      permissions?: string[];
      dependencies?: string[];
      defaultProps?: Record<string, any>;
      propValidator?: (props: any) => boolean;
    } = {}
  ): this {
    const metadata = new ComponentMetadata(
      name,
      category,
      options.permissions,
      options.dependencies,
      options.defaultProps
    );

    const factory = options.propValidator
      ? new ValidatedComponentFactory(component, metadata, options.propValidator)
      : new SyncComponentFactory(component, metadata);

    this.registry.register(name, factory);
    return this;
  }

  registerLazy(
    name: string,
    loader: () => Promise<ComponentType<any>>,
    category: string,
    options: {
      permissions?: string[];
      dependencies?: string[];
      defaultProps?: Record<string, any>;
    } = {}
  ): this {
    const metadata = new ComponentMetadata(
      name,
      category,
      options.permissions,
      options.dependencies,
      options.defaultProps
    );

    const factory = new LazyComponentFactory(loader, metadata);
    this.registry.register(name, factory);
    return this;
  }

  build(): ComponentResolver {
    const availableComponents = new Set(this.registry.listComponents());
    const context: ResolverContext = {
      userPermissions: this.userPermissions,
      availableComponents
    };

    return new ComponentResolver(this.registry, context);
  }

  getRegistry(): ComponentRegistry {
    return this.registry;
  }
}

export const componentSystemBuilder = new ComponentSystemBuilder();