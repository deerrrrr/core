import { localize } from '@ali/ide-core-common';
import { registerColor } from '../color-registry';
import { Color } from '../../common/color';
import { contrastBorder } from './base';
import { ACTIVITY_BAR_BADGE_BACKGROUND, ACTIVITY_BAR_BADGE_FOREGROUND } from './activity-bar';

// < --- Status --- >

export const STATUS_BAR_FOREGROUND = registerColor('statusBar.foreground', {
  dark: '#FFFFFF',
  light: '#FFFFFF',
  hc: '#FFFFFF',
}, localize('statusBarForeground', 'Status bar foreground color when a workspace is opened. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_NO_FOLDER_FOREGROUND = registerColor('statusBar.noFolderForeground', {
  dark: STATUS_BAR_FOREGROUND,
  light: STATUS_BAR_FOREGROUND,
  hc: STATUS_BAR_FOREGROUND,
}, localize('statusBarNoFolderForeground', 'Status bar foreground color when no folder is opened. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_BACKGROUND = registerColor('statusBar.background', {
  dark: '#007ACC',
  light: '#007ACC',
  hc: null,
}, localize('statusBarBackground', 'Status bar background color when a workspace is opened. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_NO_FOLDER_BACKGROUND = registerColor('statusBar.noFolderBackground', {
  dark: '#68217A',
  light: '#68217A',
  hc: null,
}, localize('statusBarNoFolderBackground', 'Status bar background color when no folder is opened. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_BORDER = registerColor('statusBar.border', {
  dark: null,
  light: null,
  hc: contrastBorder,
}, localize('statusBarBorder', 'Status bar border color separating to the sidebar and editor. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_NO_FOLDER_BORDER = registerColor('statusBar.noFolderBorder', {
  dark: STATUS_BAR_BORDER,
  light: STATUS_BAR_BORDER,
  hc: STATUS_BAR_BORDER,
}, localize('statusBarNoFolderBorder', 'Status bar border color separating to the sidebar and editor when no folder is opened. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_ITEM_ACTIVE_BACKGROUND = registerColor('statusBarItem.activeBackground', {
  dark: Color.white.transparent(0.18),
  light: Color.white.transparent(0.18),
  hc: Color.white.transparent(0.18),
}, localize('statusBarItemActiveBackground', 'Status bar item background color when clicking. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.hoverBackground', {
  dark: Color.white.transparent(0.12),
  light: Color.white.transparent(0.12),
  hc: Color.white.transparent(0.12),
}, localize('statusBarItemHoverBackground', 'Status bar item background color when hovering. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_PROMINENT_ITEM_FOREGROUND = registerColor('statusBarItem.prominentForeground', {
  dark: STATUS_BAR_FOREGROUND,
  light: STATUS_BAR_FOREGROUND,
  hc: STATUS_BAR_FOREGROUND,
}, localize('statusBarProminentItemForeground', 'Status bar prominent items foreground color. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_PROMINENT_ITEM_BACKGROUND = registerColor('statusBarItem.prominentBackground', {
  dark: Color.black.transparent(0.5),
  light: Color.black.transparent(0.5),
  hc: Color.black.transparent(0.5),
}, localize('statusBarProminentItemBackground', 'Status bar prominent items background color. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window.'));

export const STATUS_BAR_PROMINENT_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.prominentHoverBackground', {
  dark: Color.black.transparent(0.3),
  light: Color.black.transparent(0.3),
  hc: Color.black.transparent(0.3),
}, localize('statusBarProminentItemHoverBackground', 'Status bar prominent items background color when hovering. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window.'));

// < --- Remote --- >

export const STATUS_BAR_HOST_NAME_BACKGROUND = registerColor('statusBarItem.remoteBackground', {
  dark: ACTIVITY_BAR_BADGE_BACKGROUND,
  light: ACTIVITY_BAR_BADGE_BACKGROUND,
  hc: ACTIVITY_BAR_BADGE_BACKGROUND,
}, localize('statusBarItemHostBackground', 'Background color for the remote indicator on the status bar.'));

export const STATUS_BAR_HOST_NAME_FOREGROUND = registerColor('statusBarItem.remoteForeground', {
  dark: ACTIVITY_BAR_BADGE_FOREGROUND,
  light: ACTIVITY_BAR_BADGE_FOREGROUND,
  hc: ACTIVITY_BAR_BADGE_FOREGROUND,
}, localize('statusBarItemHostForeground', 'Foreground color for the remote indicator on the status bar.'));

export const EXTENSION_BADGE_REMOTE_BACKGROUND = registerColor('extensionBadge.remoteBackground', {
  dark: ACTIVITY_BAR_BADGE_BACKGROUND,
  light: ACTIVITY_BAR_BADGE_BACKGROUND,
  hc: ACTIVITY_BAR_BADGE_BACKGROUND,
}, localize('extensionBadge.remoteBackground', 'Background color for the remote badge in the extensions view'));

export const EXTENSION_BADGE_REMOTE_FOREGROUND = registerColor('extensionBadge.remoteForeground', {
  dark: ACTIVITY_BAR_BADGE_FOREGROUND,
  light: ACTIVITY_BAR_BADGE_FOREGROUND,
  hc: ACTIVITY_BAR_BADGE_FOREGROUND,
}, localize('extensionBadge.remoteForeground', 'Foreground color for the remote badge in the extensions view'));
