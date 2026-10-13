import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CinematicShot, DeviceDefinition, DeviceOrientation } from '../../types';
import {
  getLaptopDimensions,
  getDesktopDimensions,
  getDeviceDimensions,
  isDuoOpen,
  DUO_OPEN_W,
  DUO_OPEN_H,
  DUO_CLOSED_W,
  DUO_CLOSED_H,
  DUO_SPECS,
  DUO_SCALE,
} from './geometries';

function clampDistance(d: number): number {
  return Math.min(25.6, Math.max(7.15, d));
}

interface SphericalPose {
  theta: number;
  phi: number;
  radius: number;
}

function applySphericalPose(
  camera: THREE.Camera,
  controls: any,
  pose: SphericalPose
) {
  const target = controls?.target ?? new THREE.Vector3();
  target.set(0, 0, 0);
  const sinPhi = Math.sin(pose.phi);
  camera.position.set(
    pose.radius * sinPhi * Math.sin(pose.theta),
    pose.radius * Math.cos(pose.phi),
    pose.radius * sinPhi * Math.cos(pose.theta)
  );
  camera.lookAt(target);
}

export interface CinematicControllerProps {
  shot: CinematicShot | null;
  device: DeviceDefinition;
  apertura: number;
  orientation: DeviceOrientation;
  onEnd?: () => void;
}

export function CinematicController({
  shot,
  device,
  apertura,
  orientation,
  onEnd,
}: CinematicControllerProps) {
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const controls = useThree((s) => s.controls as any);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  const animRef = useRef<{ from: SphericalPose; to: SphericalPose; elapsed: number } | null>(null);
  const controlsRef = useRef(controls);
  const onEndRef = useRef(onEnd);
  const stateRef = useRef({
    device,
    orientation,
    apertura,
    width: size.width,
    height: size.height,
  });

  controlsRef.current = controls;
  onEndRef.current = onEnd;
  stateRef.current = {
    device,
    orientation,
    apertura,
    width: size.width,
    height: size.height,
  };

  useEffect(() => {
    if (!shot) {
      animRef.current = null;
      if (controlsRef.current) controlsRef.current.enableDamping = true;
      return;
    }

    const m = stateRef.current;
    const screenSize = (() => {
      if (m.device.kind === 'desktop') {
        const d = getDesktopDimensions(m.device);
        return { width: d.screenW, height: d.screenH };
      }
      if (m.device.kind === 'laptop') {
        const n = getLaptopDimensions(m.device, m.apertura);
        const margin = 0.028 * Math.min(n.w, n.d);
        const aspect = m.device.width / Math.max(1, m.device.height);
        let a = n.w - 2 * margin;
        let s = a / aspect;
        const maxH = n.d - 2.6 * margin;
        if (s > maxH) {
          s = maxH;
          a = s * aspect;
        }
        return { width: a, height: s };
      }
      if (m.device.id === 'iphone-duo') {
        const open = isDuoOpen(m.apertura);
        const wPx = open ? DUO_OPEN_W : DUO_CLOSED_W;
        const hPx = open ? DUO_OPEN_H : DUO_CLOSED_H;
        const h3d = DUO_SPECS.height * DUO_SCALE * (open ? 0.86 : 0.9);
        const w3d = (wPx / hPx) * h3d;
        return m.orientation === 'landscape'
          ? { width: h3d, height: w3d }
          : { width: w3d, height: h3d };
      }
      const kind = m.device.kind === 'tablet' ? 'tablet' : 'phone';
      const r = getDeviceDimensions(m.device.width, m.device.height, kind);
      return m.orientation === 'landscape'
        ? { width: r.screenH, height: r.screenW }
        : { width: r.screenW, height: r.screenH };
    })();

    const viewportAspect = m.height > 0 ? m.width / m.height : 1.4;
    const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360);
    const tanHalfHoriz = tanHalfFov * Math.max(viewportAspect, 0.6);
    const closeDist = clampDistance(
      Math.max(
        (1.05 * screenSize.height) / (2 * tanHalfFov),
        (1.05 * screenSize.width) / (2 * tanHalfHoriz)
      )
    );
    const wideDist = clampDistance(
      Math.max(
        closeDist + 3.4,
        1.7 * closeDist,
        2.7 * Math.max(screenSize.width, screenSize.height)
      )
    );

    const closePose: SphericalPose = { theta: 0.04, phi: 1.5, radius: closeDist };
    const widePose: SphericalPose = { theta: 0.66, phi: 1.3, radius: wideDist };

    const trajectory =
      shot === 'pull-back'
        ? { from: closePose, to: widePose }
        : shot === 'push-in'
        ? { from: widePose, to: closePose }
        : shot === 'orbit'
        ? {
            from: { theta: 0.04, phi: 1.28, radius: wideDist },
            to: { theta: 0.04 + Math.PI, phi: 1.28, radius: wideDist },
          }
        : shot === 'reveal'
        ? {
            from: {
              theta: Math.PI,
              phi: 1.16,
              radius: clampDistance(Math.min(wideDist, 1.55 * closeDist)),
            },
            to: {
              theta: 0.04,
              phi: 1.48,
              radius: clampDistance(Math.min(0.82 * wideDist, 1.16 * closeDist)),
            },
          }
        : {
            from: { theta: 0.18, phi: 1.52, radius: clampDistance(0.94 * wideDist) },
            to: widePose,
          };

    animRef.current = { from: trajectory.from, to: trajectory.to, elapsed: 0 };
    applySphericalPose(camera, controlsRef.current, trajectory.from);
    invalidate();
  }, [shot, camera, invalidate]);

  useEffect(() => {
    const dom = gl.domElement;
    const cancelOnPointer = () => {
      if (animRef.current) {
        animRef.current = null;
        if (controlsRef.current) controlsRef.current.enableDamping = true;
        onEndRef.current?.();
      }
    };
    dom.addEventListener('pointerdown', cancelOnPointer);
    return () => dom.removeEventListener('pointerdown', cancelOnPointer);
  }, [gl]);

  useFrame((_, delta) => {
    const s = animRef.current;
    const o = controlsRef.current;
    if (!s || !o) return;

    o.enableDamping = false;
    o.autoRotate = false;
    s.elapsed += Math.min(delta, 0.05);

    const done = s.elapsed >= 5;
    const r = Math.min(1, Math.max(0, s.elapsed / 5));
    const p = done ? 1 : r * r * r * (r * (6 * r - 15) + 10);

    applySphericalPose(camera, o, {
      theta: s.from.theta + (s.to.theta - s.from.theta) * p,
      phi: s.from.phi + (s.to.phi - s.from.phi) * p,
      radius: s.from.radius + (s.to.radius - s.from.radius) * p,
    });
    invalidate();

    if (done) {
      animRef.current = null;
      o.enableDamping = true;
      onEndRef.current?.();
    }
  });

  return null;
}
