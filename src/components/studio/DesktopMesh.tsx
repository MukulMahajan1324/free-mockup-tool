import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { DeviceDefinition, DeviceFinish } from '../../types';
import {
  getDesktopDimensions,
  createRoundedBoxGeometry,
  createRoundedPlaneGeometry,
  getFrontSurfaceZ,
  getScreenUserData,
} from './geometries';
import { AppleLogo } from './CameraAndDetails';

export interface DesktopMeshProps {
  device: DeviceDefinition;
  texture: THREE.Texture | null;
  finish: DeviceFinish;
  logoLight?: boolean;
}

export function DesktopMesh({
  device,
  texture,
  finish,
  logoLight = false,
}: DesktopMeshProps) {
  const r = useMemo(() => getDesktopDimensions(device), [device]);

  const panelGeo = useMemo(
    () => createRoundedBoxGeometry(r.panelW, r.panelH, r.thick, r.radius),
    [r.panelW, r.panelH, r.thick, r.radius]
  );
  useEffect(() => () => panelGeo.dispose(), [panelGeo]);

  const screenGeo = useMemo(
    () => createRoundedPlaneGeometry(r.screenW, r.screenH, 0.35 * r.radius),
    [r.screenW, r.screenH, r.radius]
  );
  useEffect(() => () => screenGeo.dispose(), [screenGeo]);

  const bezelGeo = useMemo(
    () =>
      createRoundedPlaneGeometry(
        r.screenW + 1.8 * r.sideBezel,
        r.screenH + 1.5 * r.topBezel,
        0.4 * r.radius
      ),
    [r.screenW, r.screenH, r.sideBezel, r.topBezel, r.radius]
  );
  useEffect(() => () => bezelGeo.dispose(), [bezelGeo]);

  const footGeo = useMemo(
    () => createRoundedBoxGeometry(r.footW, r.footD, r.footH, 0.45 * r.footW),
    [r.footW, r.footD, r.footH]
  );
  useEffect(() => () => footGeo.dispose(), [footGeo]);

  const u = r.footH + r.neckH + r.panelH / 2;
  const c = r.chin + r.screenH / 2 - r.panelH / 2;
  const h = c + 0.15 * r.topBezel;
  const d = getFrontSurfaceZ(r.thick);

  return (
    <group position={[0, -r.height / 2, 0]}>
      <mesh geometry={footGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, r.footH / 2, 0.08 * r.footD]}>
        <meshStandardMaterial
          color={finish.color}
          metalness={finish.metalness}
          roughness={finish.roughness}
        />
      </mesh>

      <mesh position={[0, r.footH + r.neckH / 2, -(0.15 * r.thick)]}>
        <boxGeometry args={[0.045 * r.panelW, r.neckH, 0.72 * r.thick]} />
        <meshStandardMaterial
          color={finish.color}
          metalness={finish.metalness}
          roughness={finish.roughness}
        />
      </mesh>

      <mesh geometry={panelGeo} position={[0, u, 0]}>
        <meshStandardMaterial
          color={finish.color}
          metalness={finish.metalness}
          roughness={finish.roughness}
        />
      </mesh>

      <AppleLogo
        size={0.09 * r.panelW}
        position={[0, u, -(r.thick / 2 + Math.min(0.03, 0.2 * r.thick) + 0.01)]}
        lit={logoLight}
        finish={finish.color}
      />

      <mesh geometry={bezelGeo} position={[0, u + h, d]}>
        <meshStandardMaterial color="#0c0c0e" roughness={0.35} metalness={0.15} />
      </mesh>

      <mesh
        geometry={screenGeo}
        position={[0, u + c, d + 0.002]}
        userData={getScreenUserData(device)}
      >
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <group position={[0, u + c + r.screenH / 2 + 0.45 * r.topBezel, d + 0.004]}>
        <mesh>
          <circleGeometry args={[0.036, 24]} />
          <meshStandardMaterial color="#121316" metalness={0.55} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <circleGeometry args={[0.018, 20]} />
          <meshStandardMaterial color="#050506" metalness={0.7} roughness={0.16} />
        </mesh>
        <mesh position={[0.007, 0.007, 0.004]}>
          <circleGeometry args={[0.005, 12]} />
          <meshBasicMaterial color="#9fd0ff" />
        </mesh>
      </group>
    </group>
  );
}
