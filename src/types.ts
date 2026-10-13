export interface DeviceFinish {
  id: string;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
}

export type DeviceKind = 'phone' | 'duo' | 'tablet' | 'laptop' | 'desktop';

export interface DeviceDefinition {
  id: string;
  label: string;
  width: number;
  height: number;
  cutout: 'notch' | 'island' | 'none';
  finishes: DeviceFinish[];
  kind: DeviceKind;
  topInset: number;
  bottomInset: number;
  camera: 'none' | 'top' | 'right';
  rear: string;
  buttons: 'switch' | 'action' | 'duo' | 'ipad' | 'mini' | 'none';
}

export interface DeviceCategory {
  id: 'mobile' | 'tablet' | 'laptop' | 'desktop';
  label: string;
  defaultId: string;
}

export interface BackgroundPreset {
  id: string;
  label: string;
  color: string | null;
  css: string;
}

export type CinematicShot = 'pull-back' | 'push-in' | 'orbit' | 'reveal' | 'settle';

export type ShellMode = 'expanded' | 'rail' | 'icon';

export type ScreenSourceMode = 'live' | 'design';

export type ScreenFitMode = 'cover' | 'fill' | 'contain';

export type ExportMode = 'standard' | 'transparent' | 'square' | 'story';

export interface ScreenStatus {
  status: 'empty' | 'loading' | 'ready' | 'error';
  message: string;
}

export type DeviceOrientation = 'portrait' | 'landscape';

export interface LiveInputEvent {
  event: 'click' | 'mousedown' | 'mouseup' | 'mousemove' | 'wheel' | 'keydown' | 'keyup';
  x: number;
  y: number;
  button?: number;
  deltaX?: number;
  deltaY?: number;
  key?: string;
}
