import { Disposable, positionToRange } from '@ali/ide-core-common';
import { Injectable, Autowired } from '@ali/common-di';
import { DebugEditor } from '../../common';
import { DebugBreakpointZoneWidget, DebugBreakpointWidgetContext } from './debug-breakpoint-zone-widget';
import { BreakpointWidgetInputFocus } from '../contextkeys';

export enum TopStackType {
  exception,
  debugger,
}

@Injectable()
export class DebugBreakpointWidget extends Disposable {

  @Autowired(DebugEditor)
  private readonly editor: DebugEditor;

  @Autowired(BreakpointWidgetInputFocus)
  private readonly breakpointWidgetInputFocus: BreakpointWidgetInputFocus;

  static LINE_HEIGHT_NUMBER = 2;

  protected zone: DebugBreakpointZoneWidget;

  private _position: monaco.Position | undefined;

  constructor() {
    super();
  }

  get position() {
    return this._position;
  }

  get values() {
    return this.zone?.values;
  }

  show(position: monaco.Position, contexts?: DebugBreakpointWidgetContext, defaultContext: DebugBreakpointZoneWidget.Context = 'condition') {
    this.dispose();
    this._position = position;
    this.addDispose(this.zone = new DebugBreakpointZoneWidget(this.editor, { ...contexts }, defaultContext));
    this.addDispose(this.zone.onDidChangeBreakpoint(({ context, value }) => {
      if (contexts) {
        contexts[context] = value;
      }
    }));
    this.addDispose(this.zone.onFocus(() => {
      this.breakpointWidgetInputFocus.set(true);
    }));
    this.addDispose(this.zone.onBlur(() => {
      this.breakpointWidgetInputFocus.set(false);
    }));
    this.addDispose(this.zone.onDispose(() => {
      this._position = undefined;
      this.breakpointWidgetInputFocus.set(false);
    }));
    this.zone.show(positionToRange(position), DebugBreakpointWidget.LINE_HEIGHT_NUMBER);
  }

  hide() {
    this.zone?.dispose();
  }
}
