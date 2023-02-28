import { Injectable, Autowired, INJECTOR_TOKEN, Injector } from '@opensumi/di';

import { BackendAdapter } from '../../browser-module';
import { electronEnv } from '../../utils/electron';

@Injectable()
export class ElectronBackend extends BackendAdapter {
  @Autowired(INJECTOR_TOKEN)
  private readonly injector: Injector;

  getExtensionConfig(): { extensionCandidate: Record<string, string>; extensionDevelopmentHost: boolean } {
    throw new Error('Method not implemented.');
  }

  onWindowClosed(): void {
    throw new Error('Method not implemented.');
  }
  onBrowserUnload(): void {
    throw new Error('Method not implemented.');
  }
  onBrowserBeforeUnload(): void {
    throw new Error('Method not implemented.');
  }
  get clientId() {
    return electronEnv.metadata.windowClientId as string;
  }
}
