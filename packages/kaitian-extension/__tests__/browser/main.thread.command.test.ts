import { Emitter, CommandRegistry, CommandRegistryImpl, ILoggerManagerClient } from '@ali/ide-core-common';
import { createBrowserInjector } from '../../../../tools/dev-tool/src/injector-helper';
import { Injector } from '@ali/common-di';
import { RPCProtocol } from '@ali/ide-connection/lib/common/rpcProtocol';
import { MainThreadCommands } from '../../src/browser/vscode/api/main.thread.commands';
import { ExtHostCommands } from '../../src/hosted/api/vscode/ext.host.command';
import { ExtHostAPIIdentifier, MainThreadAPIIdentifier } from '../../src/common/vscode';
import { MockLoggerManagerClient } from '../__mock__/loggermanager';
import { ICommandServiceToken } from '@ali/ide-monaco/lib/browser/contrib/command';
import { MonacoCommandService } from '@ali/ide-editor/lib/browser/monaco-contrib/command/command.service';

describe('MainThreadCommandAPI Test Suites ', () => {
  let extHostCommands: ExtHostCommands;
  let mainThreadCommands: MainThreadCommands;
  const injector = createBrowserInjector([], new Injector([{
    token: ILoggerManagerClient,
    useClass: MockLoggerManagerClient,
  }, {
    token: ICommandServiceToken,
    useClass: MonacoCommandService,
  }, {
    token: CommandRegistry,
    useClass: CommandRegistryImpl,
  }]));

  const emitterA = new Emitter<any>();
  const emitterB = new Emitter<any>();

  const mockClientA = {
    send: (msg) => emitterB.fire(msg),
    onMessage: emitterA.event,
  };
  const mockClientB = {
    send: (msg) => emitterA.fire(msg),
    onMessage: emitterB.event,
  };

  const rpcProtocolExt = new RPCProtocol(mockClientA);

  const rpcProtocolMain = new RPCProtocol(mockClientB);

  beforeAll((done) => {
    extHostCommands = new ExtHostCommands(rpcProtocolExt);
    rpcProtocolExt.set(ExtHostAPIIdentifier.ExtHostCommands, extHostCommands);
    mainThreadCommands = rpcProtocolMain.set(MainThreadAPIIdentifier.MainThreadCommands, injector.get(MainThreadCommands, [rpcProtocolMain]));
    done();
  });

  afterAll(() => {
    mainThreadCommands.dispose();
  });

  it('register a command', (done) => {
    extHostCommands.registerCommand(true, 'test', jest.fn());
    setTimeout(() => {
      // 插件进程注册的命令会注册一份到前端
      const command = mainThreadCommands.commandRegistry.getCommand('test');
      expect(command?.id).toEqual('test');
      done();
    }, 50);
  });

  it('execute a main command', (done) => {
    const commandId = 'main_command';
    const commandHandle = jest.fn();
    mainThreadCommands.commandRegistry.registerCommand({ id: commandId }, {
      execute: commandHandle,
    });
    extHostCommands.executeCommand(commandId);
    setTimeout(() => {
      // 插件进程可以执行前端的命令
      expect(commandHandle).toBeCalledTimes(1);
      done();
    }, 50);
  });

  it('override a command', (done) => {
    const commandId = 'can_override_command';
    const mainCommandHandle = jest.fn();
    const extCommandHandle = jest.fn();
    // 前端注册命令
    mainThreadCommands.commandRegistry.registerCommand({ id: commandId }, {
      execute: mainCommandHandle,
    });
    // 插件进程可以覆盖前端的命令
    extHostCommands.registerCommand(true, commandId, extCommandHandle);
    extHostCommands.executeCommand(commandId);
    setTimeout(() => {
      // 插件进程执行命令时，会覆盖前端注册的命令
      expect(mainCommandHandle).toBeCalledTimes(0);
      expect(extCommandHandle).toBeCalledTimes(1);
      done();
    }, 50);
  });

});
