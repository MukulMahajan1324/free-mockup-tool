import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { DeviceFinish } from '../../types';
import {
  DUO_SPECS,
  DUO_SCALE,
  DUO_OPEN_H,
  DUO_OPEN_W,
  DUO_CLOSED_H,
  DUO_CLOSED_W,
  ISLAND_SPECS,
  isDuoOpen,
  createRoundedBoxGeometry,
  createRoundedPlaneGeometry,
  createDuoHalfGeometry,
  getBackSurfaceZ,
} from './geometries';
import { RearCameraModule, AppleLogo, DeviceButtons } from './CameraAndDetails';

function getDuoScreenUserData(
  panel: string,
  screenWidth: number,
  screenHeight: number,
  screen: boolean,
  glassWidth: number
) {
  return {
    screen,
    panel,
    screenWidth,
    screenHeight,
    glassWidth,
    topInset: 59,
    bottomInset: 34,
    cutout: 'island',
    landscapeStatus: 32,
  };
}

export interface DuoMeshProps {
  texture: THREE.Texture | null;
  leftTexture: THREE.Texture | null;
  rightTexture: THREE.Texture | null;
  apertura: number;
  finish: DeviceFinish;
  logoLight?: boolean;
}

export function DuoMesh({
  texture,
  leftTexture,
  rightTexture,
  apertura,
  finish,
  logoLight = false,
}: DuoMeshProps) {
  const o = DUO_SPECS.closedWidth * DUO_SCALE;
  const l = DUO_SPECS.height * DUO_SCALE;
  const u = DUO_SPECS.openDepth * DUO_SCALE;
  const c = 0.65 * DUO_SCALE;
  const bezel = 0.045;
  const h = o - 2 * bezel;
  const d = l - 2 * bezel;
  const p = l - 2 * bezel;
  const f = o - 1.6 * bezel;
  const m = isDuoOpen(apertura);

  const bodyGeo = useMemo(() => createRoundedBoxGeometry(o, l, u, c), [o, l, u, c]);
  useEffect(() => () => bodyGeo.dispose(), [bodyGeo]);

  const frontGlassGeo = useMemo(() => createRoundedPlaneGeometry(o, l, c), [o, l, c]);
  useEffect(() => () => frontGlassGeo.dispose(), [frontGlassGeo]);

  const innerHalfScreenGeo = useMemo(
    () => createRoundedPlaneGeometry(f, p, Math.max(0.04, c - bezel)),
    [f, p, c, bezel]
  );
  useEffect(() => () => innerHalfScreenGeo.dispose(), [innerHalfScreenGeo]);

  const coverScreenGeo = useMemo(
    () => createRoundedPlaneGeometry(h, d, Math.max(0.04, c - bezel)),
    [h, d, c, bezel]
  );
  useEffect(() => () => coverScreenGeo.dispose(), [coverScreenGeo]);

  const coverIslandGeo = useMemo(() => {
    const e = d * (ISLAND_SPECS.height / DUO_CLOSED_H);
    return createRoundedPlaneGeometry(h * (ISLAND_SPECS.width / DUO_CLOSED_W), e, e / 2);
  }, [d, h]);
  useEffect(() => () => coverIslandGeo.dispose(), [coverIslandGeo]);

  const innerIslands = useMemo(() => {
    const e = p * (ISLAND_SPECS.height / DUO_OPEN_H);
    const t = (2 * f * (ISLAND_SPECS.width / DUO_OPEN_W)) / 2;
    return {
      height: e,
      width: t,
      left: createDuoHalfGeometry(t, e, 'left'),
      right: createDuoHalfGeometry(t, e, 'right'),
    };
  }, [p, f]);

  useEffect(
    () => () => {
      innerIslands.left.dispose();
      innerIslands.right.dispose();
    },
    [innerIslands]
  );

  const b = Math.min(0.03, 0.2 * u);
  const S = u / 2 - b + 0.002;
  const M = -(u / 2 + b) - 0.002;
  const E = 0.045 * apertura;
  const A = (o / 2) * (1 - apertura);
  const C = (u + 0.07) * (1 - apertura);
  const R = (o - f) / 2;
  const P = d * (ISLAND_SPECS.height / DUO_CLOSED_H);
  const I = d / 2 - d * (ISLAND_SPECS.top / DUO_CLOSED_H) - P / 2;
  const L = p / 2 - p * (ISLAND_SPECS.top / DUO_OPEN_H) - innerIslands.height / 2;
  const N = 0.04 * innerIslands.width;

  return (
    <group position={[A, 0, 0]}>
      <mesh position={[0.02, 0, -0.02]}>
        <cylinderGeometry args={[0.036, 0.036, 0.82 * l, 28]} />
        <meshStandardMaterial color="#c5ccd4" metalness={0.88} roughness={0.22} />
      </mesh>

      <group position={[-o / 2, 0, 0]}>
        <mesh geometry={bodyGeo}>
          <meshStandardMaterial
            color={finish.color}
            metalness={finish.metalness}
            roughness={finish.roughness}
          />
        </mesh>

        {m ? (
          <mesh geometry={frontGlassGeo} position={[0, 0, S - 0.001]}>
            <meshStandardMaterial color="#08080a" roughness={0.28} metalness={0.15} />
          </mesh>
        ) : null}

        <mesh
          geometry={innerHalfScreenGeo}
          position={[R, 0, S + 0.001]}
          visible={m}
          userData={getDuoScreenUserData('left', DUO_OPEN_W / 2, DUO_OPEN_H, m, DUO_OPEN_W)}
        >
          <meshBasicMaterial map={leftTexture} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>

        {m ? (
          <mesh geometry={innerIslands.left} position={[R + f / 2, L, S + 0.004]}>
            <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
          </mesh>
        ) : null}

        <RearCameraModule rear="iphone-duo" bodyW={o} bodyH={l} depth={u} radius={c} />

        <AppleLogo
          size={0.16 * Math.min(o, l)}
          position={[0, 0, getBackSurfaceZ(u)]}
          lit={logoLight}
          finish={finish.color}
        />

        <DeviceButtons layout="duo" bodyW={o} bodyH={l} color={finish.color} edge="left" />
      </group>

      <group position={[0, 0, 0]} rotation={[0, (1 - apertura) * Math.PI, 0]}>
        <group position={[o / 2 + E, 0, -C]}>
          <mesh geometry={bodyGeo}>
            <meshStandardMaterial
              color={finish.color}
              metalness={finish.metalness}
              roughness={finish.roughness}
            />
          </mesh>

          {m ? (
            <mesh geometry={frontGlassGeo} position={[0, 0, S - 0.001]}>
              <meshStandardMaterial color="#08080a" roughness={0.28} metalness={0.15} />
            </mesh>
          ) : null}

          <mesh
            geometry={innerHalfScreenGeo}
            position={[-R, 0, S + 0.001]}
            visible={m}
            userData={getDuoScreenUserData('right', DUO_OPEN_W / 2, DUO_OPEN_H, m, DUO_OPEN_W)}
          >
            <meshBasicMaterial map={rightTexture} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>

          {m ? (
            <mesh geometry={innerIslands.right} position={[-R - f / 2, L, S + 0.004]}>
              <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
            </mesh>
          ) : null}

          <group position={[0, 0, M]} rotation={[0, Math.PI, 0]}>
            {!m ? (
              <mesh geometry={frontGlassGeo} position={[0, 0, -0.001]}>
                <meshStandardMaterial color="#08080a" roughness={0.28} metalness={0.15} />
              </mesh>
            ) : null}
            <mesh
              geometry={coverScreenGeo}
              position={[0, 0, 0.001]}
              visible={!m}
              userData={getDuoScreenUserData('single', DUO_CLOSED_W, DUO_CLOSED_H, !m, DUO_CLOSED_W)}
            >
              <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            {m ? null : (
              <mesh geometry={coverIslandGeo} position={[0, I, 0.004]}>
                <meshBasicMaterial color="#050505" />
              </mesh>
            )}
          </group>

          <DeviceButtons layout="duo" bodyW={o} bodyH={l} color={finish.color} edge="right" />
        </group>
      </group>
    </group>
  );
}
