import { Injectable, Autowired, INJECTOR_TOKEN, Injector } from '@opensumi/di';
import { WSChannelHandler } from '@opensumi/ide-connection/lib/browser';

import { BackendAdapter } from '../../browser-module';

@Injectable()
export class NodeBackend extends BackendAdapter {
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
    return this.injector.get(WSChannelHandler).clientId;
  }
}
