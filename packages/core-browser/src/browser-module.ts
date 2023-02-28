import { Injector, Autowired } from '@opensumi/di';
import { BasicModule, CommandRegistry, Deferred } from '@opensumi/ide-core-common';

import { AppConfig } from './react-providers/config-provider';

export const IClientApp = Symbol('CLIENT_APP_TOKEN');

export interface IClientApp {
  appInitialized: Deferred<void>;
  browserModules: BrowserModule<any>[];
  injector: Injector;
  config: AppConfig;
  commandRegistry: CommandRegistry;
  fireOnReload: (forcedReload?: boolean) => void;
}

export abstract class BrowserModule<T = any> extends BasicModule {
  @Autowired(IClientApp)
  protected app: IClientApp;
  public preferences?: (inject: Injector) => void;
  public component?: React.ComponentType<T>;
  // 脱离于layout渲染的模块
  public isOverlay?: boolean;
}

export abstract class BackendAdapter {
  abstract get clientId(): string;

  abstract getExtensionConfig(): {
    extensionCandidate: Record<string, string>;
    // 当前是否为插件开发宿主模式
    extensionDevelopmentHost: boolean;
  };
  // abstract initConnection(): Promise<RPCMessageConnection>;
  // abstract getOS(): Promise<OS>;
  abstract onWindowClosed(): void;
  abstract onBrowserUnload(): void;
  abstract onBrowserBeforeUnload(): void;
}
