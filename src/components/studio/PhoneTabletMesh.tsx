import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { DeviceDefinition, DeviceFinish } from '../../types';
import {
  getDeviceDimensions,
  createRoundedBoxGeometry,
  createRoundedPlaneGeometry,
  createNotchGeometry,
  ISLAND_SPECS,
  NOTCH_SPECS,
  getBackSurfaceZ,
  getFrontSurfaceZ,
  getLandscapeStatusInset,
} from './geometries';
import { RearCameraModule, FrontCamera, AppleLogo, DeviceButtons } from './CameraAndDetails';

export interface PhoneTabletMeshProps {
  device: DeviceDefinition;
  texture: THREE.Texture | null;
  finish: DeviceFinish;
  logoLight?: boolean;
}

export function PhoneTabletMesh({
  device,
  texture,
  finish,
  logoLight = false,
}: PhoneTabletMeshProps) {
  const a = device.kind === 'tablet' ? 'tablet' : 'phone';
  const s = useMemo(
    () => getDeviceDimensions(device.width, device.height, a),
    [device.width, device.height, a]
  );

  const bodyGeo = useMemo(
    () => createRoundedBoxGeometry(s.bodyW, s.bodyH, s.depth, s.radius),
    [s.bodyW, s.bodyH, s.depth, s.radius]
  );
  useEffect(() => () => bodyGeo.dispose(), [bodyGeo]);

  const frontGlassGeo = useMemo(
    () => createRoundedPlaneGeometry(s.bodyW, s.bodyH, s.radius),
    [s.bodyW, s.bodyH, s.radius]
  );
  useEffect(() => () => frontGlassGeo.dispose(), [frontGlassGeo]);

  const screenGeo = useMemo(
    () =>
      createRoundedPlaneGeometry(
        s.screenW,
        s.screenH,
        Math.max(0.04, s.radius - s.bezel)
      ),
    [s.screenW, s.screenH, s.radius, s.bezel]
  );
  useEffect(() => () => screenGeo.dispose(), [screenGeo]);

  const islandGeo = useMemo(() => {
    const t = s.screenW * (ISLAND_SPECS.width / device.width);
    const n = s.screenH * (ISLAND_SPECS.height / device.height);
    return createRoundedPlaneGeometry(t, n, n / 2);
  }, [s.screenW, s.screenH, device.width, device.height]);
  useEffect(() => () => islandGeo.dispose(), [islandGeo]);

  const notchGeo = useMemo(() => {
    const t = s.screenW * (NOTCH_SPECS.width / device.width);
    const n = s.screenH * (NOTCH_SPECS.height / device.height);
    return createNotchGeometry(t, n, 0.42 * n);
  }, [s.screenW, s.screenH, device.width, device.height]);
  useEffect(() => () => notchGeo.dispose(), [notchGeo]);

  const frontZ = getFrontSurfaceZ(s.depth);
  const h = frontZ + 0.002;
  const d = s.screenH * (ISLAND_SPECS.height / device.height);
  const p = s.screenH / 2 - s.screenH * (ISLAND_SPECS.top / device.height) - d / 2;
  const f = s.screenH * (NOTCH_SPECS.height / device.height);
  const m = s.screenH / 2 - f / 2;

  return (
    <group>
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial
          color={finish.color}
          metalness={finish.metalness}
          roughness={finish.roughness}
        />
      </mesh>

      <mesh geometry={frontGlassGeo} position={[0, 0, frontZ]}>
        <meshStandardMaterial color="#08080a" roughness={0.28} metalness={0.15} />
      </mesh>

      <mesh
        geometry={screenGeo}
        position={[0, 0, h]}
        userData={{
          screen: true,
          panel: 'single',
          screenWidth: device.width,
          screenHeight: device.height,
          glassWidth: device.width,
          topInset: device.topInset,
          bottomInset: device.bottomInset,
          cutout: device.cutout,
          landscapeStatus: getLandscapeStatusInset(device),
        }}
      >
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {device.cutout === 'island' ? (
        <mesh geometry={islandGeo} position={[0, p, h + 0.003]}>
          <meshBasicMaterial color="#050505" />
        </mesh>
      ) : null}

      {device.cutout === 'notch' ? (
        <mesh geometry={notchGeo} position={[0, m, h + 0.003]}>
          <meshBasicMaterial color="#050505" />
        </mesh>
      ) : null}

      {device.camera === 'none' ? null : (
        <FrontCamera
          edge={device.camera}
          bodyW={s.bodyW}
          bodyH={s.bodyH}
          bezel={s.bezel}
          depth={s.depth}
        />
      )}

      <RearCameraModule
        rear={device.rear}
        bodyW={s.bodyW}
        bodyH={s.bodyH}
        depth={s.depth}
        radius={s.radius}
      />

      <AppleLogo
        size={Math.min(s.bodyW, s.bodyH) * (a === 'tablet' ? 0.16 : 0.22)}
        position={[0, 0, getBackSurfaceZ(s.depth)]}
        lit={logoLight}
        finish={finish.color}
      />

      <DeviceButtons
        layout={device.buttons}
        bodyW={s.bodyW}
        bodyH={s.bodyH}
        color={finish.color}
      />
    </group>
  );
}
