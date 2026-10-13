import { useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { DeviceDefinition, DeviceFinish } from '../../types';
import {
  getLaptopDimensions,
  createRoundedBoxGeometry,
  createRoundedPlaneGeometry,
  createNotchGeometry,
  createKeycapGeometry,
  getScreenUserData,
} from './geometries';
import { AppleLogo } from './CameraAndDetails';

const KEY_WIDTHS: (number | null)[][] = [
  [1, null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.15],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.85],
  [2.15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.35, 1],
  [1.15, 1.15, 1.2, 1.3, 4.7, 1.3, 1.15, 1, 1, 1],
];

const KEY_LABELS: (string | null)[][] = [
  ['esc', null, '☀', '☾', '□', '⌕', '♪', '◐', '◀', '▶', '»', '○', '−', '+', ''],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'del'],
  ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'return'],
  ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift', '↑'],
  ['fn', 'ctrl', 'opt', 'cmd', '', 'cmd', 'opt', '←', '↓', '→'],
];

interface KeyDef {
  x: number;
  z: number;
  w: number;
  d: number;
  role: 'key' | 'space' | 'id';
  label: string;
}

function LaptopKeyboardAndTrackpad({
  width,
  depth,
  deckTop,
  dark,
  finish,
  model,
}: {
  width: number;
  depth: number;
  deckTop: number;
  dark: boolean;
  finish: string;
  model: string;
}) {
  const instancedRef = useRef<THREE.InstancedMesh | null>(null);
  const isPro = model.includes('pro');
  const isLarge = model.endsWith('15') || model.endsWith('16');

  const layout = useMemo(() => {
    const rowSum = (row: (number | null)[]) => row.reduce<number>((acc, v) => acc + (v ?? 0.5), 0);
    const maxUnits = Math.max(...KEY_WIDTHS.map(rowSum));
    const unit = (width * (isLarge ? 0.8 : 0.86)) / maxUnits;
    const gap = 0.15 * unit;
    const keyD = 0.7 * unit;
    const rowStep = 0.9 * unit;

    const keys: KeyDef[] = [];
    const rowIndices: number[] = [];
    let currentZ = -depth / 2 + 0.07 * depth + keyD / 2;

    KEY_WIDTHS.forEach((row, rIdx) => {
      let curX = -(rowSum(row) * unit) / 2;
      row.forEach((mult, cIdx) => {
        const wSpan = (mult ?? 0.5) * unit;
        if (mult !== null) {
          const role: 'key' | 'space' | 'id' =
            rIdx === 5 && mult > 3
              ? 'space'
              : rIdx === 0 && cIdx === row.length - 1
              ? 'id'
              : 'key';
          keys.push({
            x: curX + wSpan / 2,
            z: currentZ,
            w: Math.max(0.02, wSpan - gap),
            d: keyD,
            role,
            label: KEY_LABELS[rIdx]?.[cIdx] ?? '',
          });
          rowIndices.push(rIdx);
        }
        curX += wSpan;
      });
      currentZ += rowStep + (rIdx === 0 ? 0.22 * unit : 0);
    });

    const row5Keys = keys.filter((_, i) => rowIndices[i] === 5);
    const row4Keys = keys.filter((_, i) => rowIndices[i] === 4);
    const downArrow = row5Keys[row5Keys.length - 2];
    const upArrow = row4Keys[row4Keys.length - 1];
    if (upArrow && downArrow) {
      upArrow.x = downArrow.x;
    }

    const regular = keys.filter((k) => k.role === 'key');
    const space = keys.find((k) => k.role === 'space') ?? null;
    const touchId = keys.find((k) => k.role === 'id') ?? null;

    const minX = Math.min(...keys.map((k) => k.x - k.w / 2));
    const maxX = Math.max(...keys.map((k) => k.x + k.w / 2));
    const minZ = Math.min(...keys.map((k) => k.z - k.d / 2));
    const maxZ = Math.max(...keys.map((k) => k.z + k.d / 2));
    const trackTopZ = maxZ + 0.28 * unit;
    const deckFrontZ = depth / 2 - 0.055 * depth;
    const trackD = Math.min(depth * (isPro ? 0.27 : 0.23), Math.max(0.4, (deckFrontZ - trackTopZ) * 0.78));

    return {
      keys,
      regular,
      space,
      touchId,
      unit,
      well: {
        w: maxX - minX + 0.42 * unit,
        d: maxZ - minZ + 0.34 * unit,
        x: (minX + maxX) / 2,
        z: (minZ + maxZ) / 2,
      },
      track: {
        w: width * (isPro ? (isLarge ? 0.4 : 0.46) : isLarge ? 0.36 : 0.4),
        d: trackD,
        z: trackTopZ + (deckFrontZ - trackTopZ) / 2,
      },
    };
  }, [width, depth, isPro, isLarge]);

  const { regular, space, touchId } = layout;
  const baseKey = regular[0];
  const keyTopY = deckTop + 0.0055 + 0.002;

  const regularKeyGeo = useMemo(
    () => createKeycapGeometry(baseKey?.w ?? 0.2, baseKey?.d ?? 0.16, 0.011),
    [baseKey?.w, baseKey?.d]
  );
  useEffect(() => () => regularKeyGeo.dispose(), [regularKeyGeo]);

  const spaceKeyGeo = useMemo(
    () => (space ? createKeycapGeometry(space.w, space.d, 0.011) : new THREE.BoxGeometry(0.01, 0.01, 0.01)),
    [space]
  );
  useEffect(() => () => spaceKeyGeo.dispose(), [spaceKeyGeo]);

  const touchIdGeo = useMemo(
    () => (touchId ? createKeycapGeometry(touchId.w, touchId.d, 0.011) : new THREE.BoxGeometry(0.01, 0.01, 0.01)),
    [touchId]
  );
  useEffect(() => () => touchIdGeo.dispose(), [touchIdGeo]);

  const wellGeo = useMemo(
    () => createRoundedPlaneGeometry(layout.well.w, layout.well.d, Math.min(0.08, 0.22 * layout.unit)),
    [layout.well.w, layout.well.d, layout.unit]
  );
  useEffect(() => () => wellGeo.dispose(), [wellGeo]);

  const trackGeo = useMemo(
    () => createRoundedPlaneGeometry(layout.track.w, layout.track.d, 0.16 * Math.min(layout.track.d, layout.track.w)),
    [layout.track.w, layout.track.d]
  );
  useEffect(() => () => trackGeo.dispose(), [trackGeo]);

  const wellColor = useMemo(() => {
    const c = new THREE.Color(finish);
    c.multiplyScalar(dark ? 0.78 : 0.9);
    return `#${c.getHexString()}`;
  }, [dark, finish]);

  const trackColor = useMemo(() => {
    const c = new THREE.Color(finish);
    c.multiplyScalar(dark ? 1.12 : 0.8);
    return `#${c.getHexString()}`;
  }, [dark, finish]);

  const labelTexture = useMemo(() => {
    const texW = Math.max(64, Math.ceil(1100 * layout.well.w));
    const texH = Math.max(64, Math.ceil(1100 * layout.well.d));
    const canvas = document.createElement('canvas');
    canvas.width = texW;
    canvas.height = texH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, texW, texH);
    ctx.fillStyle = dark ? 'rgba(236, 238, 242, 0.94)' : 'rgba(210, 212, 216, 0.92)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const leftEdge = layout.well.x - layout.well.w / 2;
    const topEdge = layout.well.z - layout.well.d / 2;

    for (const k of layout.keys) {
      if (!k.label) continue;
      const px = ((k.x - leftEdge) / layout.well.w) * texW;
      const py = ((k.z - topEdge) / layout.well.d) * texH;
      const isWord = k.label.length > 3;
      const fontSize = Math.max(11, 1100 * Math.min(k.w, k.d) * (isWord ? 0.22 : 0.46));
      ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(k.label, px, py);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, [layout, dark]);

  useEffect(() => () => labelTexture?.dispose(), [labelTexture]);

  useLayoutEffect(() => {
    const mesh = instancedRef.current;
    if (!mesh || !baseKey) return;
    const dummy = new THREE.Object3D();
    regular.forEach((k, idx) => {
      dummy.position.set(k.x, keyTopY, k.z);
      dummy.scale.set(k.w / baseKey.w, 1, k.d / baseKey.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.computeBoundingBox();
  }, [keyTopY, regular, baseKey]);

  const keycapColor = dark ? '#4a4d55' : '#1b1c20';

  return (
    <group>
      {/* Keyboard Well */}
      <mesh
        geometry={wellGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[layout.well.x, deckTop + 0.0015, layout.well.z]}
      >
        <meshStandardMaterial color={wellColor} roughness={0.62} metalness={0.18} />
      </mesh>

      {/* Instanced 3D Keycaps */}
      <instancedMesh
        ref={instancedRef}
        args={[regularKeyGeo, undefined, Math.max(1, regular.length)]}
      >
        <meshStandardMaterial color={keycapColor} roughness={0.48} metalness={0.16} />
      </instancedMesh>

      {/* Spacebar */}
      {space ? (
        <mesh geometry={spaceKeyGeo} position={[space.x, keyTopY, space.z]}>
          <meshStandardMaterial color={keycapColor} roughness={0.48} metalness={0.16} />
        </mesh>
      ) : null}

      {/* Touch ID Button & Ring */}
      {touchId ? (
        <group position={[touchId.x, keyTopY, touchId.z]}>
          <mesh geometry={touchIdGeo}>
            <meshStandardMaterial color={dark ? '#3a3d44' : '#121316'} roughness={0.42} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16 * touchId.d, 0.24 * touchId.d, 24]} />
            <meshStandardMaterial color={dark ? '#8e929a' : '#6d7076'} roughness={0.35} metalness={0.4} />
          </mesh>
        </group>
      ) : null}

      {/* Key Labels Texture Plane */}
      {labelTexture ? (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[layout.well.x, keyTopY + 0.0055 + 0.0014, layout.well.z]}
        >
          <planeGeometry args={[layout.well.w, layout.well.d]} />
          <meshBasicMaterial map={labelTexture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}

      {/* Force Touch Trackpad */}
      <mesh
        geometry={trackGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, deckTop + 0.0025, layout.track.z]}
      >
        <meshStandardMaterial color={trackColor} roughness={0.28} metalness={0.42} />
      </mesh>
    </group>
  );
}

export interface LaptopMeshProps {
  device: DeviceDefinition;
  texture: THREE.Texture | null;
  apertura: number;
  finish: DeviceFinish;
  logoLight?: boolean;
}

export function LaptopMesh({
  device,
  texture,
  apertura,
  finish,
  logoLight = false,
}: LaptopMeshProps) {
  const o = useMemo(() => getLaptopDimensions(device, Math.min(1, Math.max(0, apertura))), [device, apertura]);

  const isDarkFinish = useMemo(() => {
    const hex = finish.color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;
  }, [finish.color]);

  const deckGeo = useMemo(
    () => createRoundedBoxGeometry(o.w, o.d, o.deck, o.radius),
    [o.w, o.d, o.deck, o.radius]
  );
  useEffect(() => () => deckGeo.dispose(), [deckGeo]);

  const lidW = 0.992 * o.w;
  const lidD = 0.992 * o.d;
  const lidR = 0.92 * o.radius;

  const lidGeo = useMemo(
    () => createRoundedBoxGeometry(lidW, lidD, o.lid, lidR),
    [lidW, lidD, o.lid, lidR]
  );
  useEffect(() => () => lidGeo.dispose(), [lidGeo]);

  const sideBezel = 0.018 * Math.min(lidW, lidD);
  const topBezel = 0.024 * Math.min(lidW, lidD);
  const bottomChin = 0.032 * Math.min(lidW, lidD);
  const p = lidW - 2 * sideBezel;
  const f = lidD - topBezel - bottomChin;

  const screenGeo = useMemo(
    () => createRoundedPlaneGeometry(p, f, Math.max(0.03, lidR - sideBezel)),
    [p, f, lidR, sideBezel]
  );
  useEffect(() => () => screenGeo.dispose(), [screenGeo]);

  const bezelGeo = useMemo(
    () => createRoundedPlaneGeometry(lidW, lidD, lidR),
    [lidW, lidD, lidR]
  );
  useEffect(() => () => bezelGeo.dispose(), [bezelGeo]);

  const notchW = 0.13 * p;
  const notchH = Math.min(f * (30 / device.height), f * (device.topInset / device.height) * 0.82);
  const notchGeo = useMemo(() => createNotchGeometry(notchW, notchH, 0.42 * notchH), [notchW, notchH]);
  useEffect(() => () => notchGeo.dispose(), [notchGeo]);

  const deckTop = o.deck + Math.min(0.03, 0.2 * o.deck);
  const lidBevel = Math.min(0.03, 0.2 * o.lid);
  const lidExtrude = Math.max(0.04, o.lid - 2 * lidBevel);
  const lidInnerY = o.lid - lidExtrude - lidBevel;
  const bezelZ = lidD / 2;
  const S = lidD / 2 + (bottomChin - topBezel) / 2;
  const M = S + f / 2 - notchH / 2;
  const camRadius = Math.max(0.016, 0.24 * notchH);

  return (
    <group position={[0, -o.height / 2 + o.lift, -o.centerZ]}>
      <mesh geometry={deckGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, o.deck / 2, 0]}>
        <meshStandardMaterial
          color={finish.color}
          metalness={finish.metalness}
          roughness={finish.roughness}
        />
      </mesh>

      <LaptopKeyboardAndTrackpad
        width={o.w}
        depth={o.d}
        deckTop={deckTop}
        dark={isDarkFinish}
        finish={finish.color}
        model={device.id}
      />

      <mesh position={[0, o.hingeY - 0.01, -o.d / 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55 * o.lid, 0.55 * o.lid, 0.72 * o.w, 20]} />
        <meshStandardMaterial
          color={isDarkFinish ? '#3a3b40' : '#b7b8bc'}
          metalness={0.8}
          roughness={0.28}
        />
      </mesh>

      <group position={[0, o.hingeY, -o.d / 2]} rotation={[o.angle, 0, 0]}>
        <mesh
          geometry={lidGeo}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, o.lid / 2, bezelZ]}
        >
          <meshStandardMaterial
            color={finish.color}
            metalness={finish.metalness}
            roughness={finish.roughness}
          />
        </mesh>

        <mesh geometry={bezelGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, lidInnerY - 0.0015, bezelZ]}>
          <meshStandardMaterial color="#0c0c0e" roughness={0.32} metalness={0.18} />
        </mesh>

        <mesh
          geometry={screenGeo}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, lidInnerY - 0.003, S]}
          userData={getScreenUserData(device)}
        >
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        <mesh geometry={notchGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, lidInnerY - 0.0045, M]}>
          <meshBasicMaterial color="#0a0a0c" />
        </mesh>

        <AppleLogo
          size={0.16 * Math.min(o.w, o.d)}
          position={[0, o.lid + lidBevel + 0.006, bezelZ]}
          rotation={[-Math.PI / 2, 0, Math.PI]}
          lit={logoLight}
          finish={finish.color}
        />

        <group position={[0, lidInnerY - 0.006, M]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[camRadius, 24]} />
            <meshStandardMaterial color="#050506" metalness={0.7} roughness={0.18} />
          </mesh>
          <mesh position={[0.3 * camRadius, -0.001, 0.3 * camRadius]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.28 * camRadius, 12]} />
            <meshBasicMaterial color="#9fd0ff" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
