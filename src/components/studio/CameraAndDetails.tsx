import React, { useMemo, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { CAMERA_BUMPS, createRoundedBoxGeometry, getFrontSurfaceZ } from './geometries';

export function RoundedBoxMesh({
  width,
  height,
  depth,
  radius,
  color,
  metalness = 0.4,
  roughness = 0.38,
}: {
  width: number;
  height: number;
  depth: number;
  radius: number;
  color: string;
  metalness?: number;
  roughness?: number;
}) {
  const geo = useMemo(
    () => createRoundedBoxGeometry(width, height, depth, radius),
    [width, height, depth, radius]
  );
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

export function CameraLens({ position, radius }: { position: [number, number, number]; radius: number }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[1.16 * radius, 32]} />
        <meshStandardMaterial color="#c5c9d0" metalness={0.88} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.006]}>
        <circleGeometry args={[radius, 28]} />
        <meshStandardMaterial color="#07080c" metalness={0.62} roughness={0.16} />
      </mesh>
      <mesh position={[0.32 * radius, 0.32 * radius, 0.01]}>
        <circleGeometry args={[Math.max(0.012, 0.14 * radius), 12]} />
        <meshBasicMaterial color="#f7f8fa" />
      </mesh>
    </group>
  );
}

export function Flash({ position, radius }: { position: [number, number, number]; radius: number }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[radius, 20]} />
        <meshStandardMaterial color="#f3eee4" metalness={0.08} roughness={0.32} />
      </mesh>
      <mesh position={[0.2 * radius, 0, 0.004]}>
        <circleGeometry args={[0.38 * radius, 14]} />
        <meshStandardMaterial color="#e7c98a" metalness={0.12} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function Lidar({
  position,
  radius,
  color = '#1a1c20',
}: {
  position: [number, number, number];
  radius: number;
  color?: string;
}) {
  return (
    <mesh position={position}>
      <circleGeometry args={[radius, 16]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.35} />
    </mesh>
  );
}

export function CameraPlate({
  children,
  plate,
  rim,
}: {
  children?: React.ReactNode;
  plate: { width: number; height: number; radius: number };
  rim?: { width: number; height: number; radius: number };
}) {
  return (
    <group>
      {rim ? (
        <group position={[0, 0, -0.01]}>
          <RoundedBoxMesh
            width={rim.width}
            height={rim.height}
            depth={0.03}
            radius={rim.radius}
            color="#b7bec6"
            metalness={0.8}
            roughness={0.28}
          />
        </group>
      ) : null}
      <RoundedBoxMesh
        width={plate.width}
        height={plate.height}
        depth={0.055}
        radius={plate.radius}
        color="#12141a"
      />
      <group position={[0, 0, 0.045]}>{children}</group>
    </group>
  );
}

export function RearCameraModule({
  rear,
  bodyW,
  bodyH,
  depth,
  radius,
}: {
  rear: string;
  bodyW: number;
  bodyH: number;
  depth: number;
  radius: number;
}) {
  if (rear === 'none') return null;

  const scale = rear === 'iphone-duo' ? 0.72 : 1;
  const s = CAMERA_BUMPS[rear] ?? CAMERA_BUMPS['none'];
  const o = s.minX * scale;
  const l = s.maxX * scale;
  const u = s.minY * scale;
  const c = s.maxY * scale;
  const h = Math.max(0.09, 0.32 * radius);
  const d = bodyW / 2 - h;
  const p = bodyH / 2 - h;
  let f = d - l;
  let m = p - c;
  if (f + o < -d) f = -(o + l) / 2;
  if (m + u < -p) m = -(u + c) / 2;

  return (
    <group position={[f, m, -depth / 2 - 0.09]} rotation={[0, Math.PI, 0]} scale={scale}>
      {rear === 'iphone-14' ? (
        <CameraPlate
          plate={{ width: 0.92, height: 0.92, radius: 0.22 }}
          rim={{ width: 0.98, height: 0.98, radius: 0.24 }}
        >
          <CameraLens position={[-0.2, 0.2, 0]} radius={0.16} />
          <CameraLens position={[0.2, -0.2, 0]} radius={0.17} />
          <Flash position={[0.24, 0.24, 0]} radius={0.055} />
          <Lidar position={[-0.26, -0.26, 0]} radius={0.028} />
        </CameraPlate>
      ) : rear === 'iphone-15' ? (
        <group>
          <CameraPlate
            plate={{ width: 0.72, height: 1.48, radius: 0.34 }}
            rim={{ width: 0.78, height: 1.54, radius: 0.36 }}
          >
            <CameraLens position={[0, 0.32, 0]} radius={0.175} />
            <CameraLens position={[0, -0.32, 0]} radius={0.175} />
          </CameraPlate>
          <Flash position={[0.56, 0.42, 0.04]} radius={0.06} />
          <Lidar position={[0.56, 0.18, 0.04]} radius={0.028} />
        </group>
      ) : rear === 'iphone-16' ? (
        <group>
          <CameraPlate
            plate={{ width: 0.74, height: 1.68, radius: 0.36 }}
            rim={{ width: 0.8, height: 1.74, radius: 0.38 }}
          >
            <CameraLens position={[0, 0.4, 0]} radius={0.18} />
            <CameraLens position={[0, -0.4, 0]} radius={0.18} />
          </CameraPlate>
          <Flash position={[0.58, 0.12, 0.04]} radius={0.062} />
          <Lidar position={[0.58, -0.16, 0.04]} radius={0.026} />
        </group>
      ) : rear === 'iphone-16-pro' ? (
        <CameraPlate
          plate={{ width: 1.38, height: 1.38, radius: 0.32 }}
          rim={{ width: 1.46, height: 1.46, radius: 0.34 }}
        >
          <CameraLens position={[-0.32, 0.32, 0]} radius={0.2} />
          <CameraLens position={[0.32, 0.32, 0]} radius={0.18} />
          <CameraLens position={[-0.32, -0.3, 0]} radius={0.22} />
          <Flash position={[0.3, -0.05, 0]} radius={0.07} />
          <Lidar position={[0.32, -0.32, 0]} radius={0.055} color="#0c0e12" />
          <Lidar position={[0.32, -0.32, 0.008]} radius={0.02} color="#3a3e46" />
        </CameraPlate>
      ) : rear === 'iphone-duo' ? (
        <group>
          <CameraPlate
            plate={{ width: 0.86, height: 1.72, radius: 0.4 }}
            rim={{ width: 0.94, height: 1.8, radius: 0.42 }}
          >
            <CameraLens position={[0, 0.38, 0]} radius={0.2} />
            <CameraLens position={[0, -0.38, 0]} radius={0.2} />
          </CameraPlate>
          <Flash position={[0.66, 0.05, 0.04]} radius={0.07} />
        </group>
      ) : rear === 'ipad-pro' ? (
        <CameraPlate
          plate={{ width: 1.15, height: 0.46, radius: 0.2 }}
          rim={{ width: 1.22, height: 0.52, radius: 0.22 }}
        >
          <CameraLens position={[-0.34, 0, 0]} radius={0.13} />
          <Lidar position={[-0.02, 0.02, 0]} radius={0.055} color="#0c0e12" />
          <Lidar position={[-0.02, 0.02, 0.008]} radius={0.02} color="#3a3e46" />
          <Flash position={[0.26, 0.06, 0]} radius={0.045} />
          <Lidar position={[0.42, 0.08, 0]} radius={0.018} />
          <Lidar position={[0.42, -0.08, 0]} radius={0.014} color="#2a2418" />
        </CameraPlate>
      ) : rear === 'ipad-air' ? (
        <CameraPlate
          plate={{ width: 0.42, height: 0.42, radius: 0.12 }}
          rim={{ width: 0.48, height: 0.48, radius: 0.14 }}
        >
          <CameraLens position={[0, 0, 0]} radius={0.12} />
        </CameraPlate>
      ) : rear === 'ipad' ? (
        <CameraPlate
          plate={{ width: 0.36, height: 0.36, radius: 0.18 }}
          rim={{ width: 0.42, height: 0.42, radius: 0.21 }}
        >
          <CameraLens position={[0, 0, 0]} radius={0.11} />
        </CameraPlate>
      ) : (
        <CameraPlate
          plate={{ width: 0.72, height: 0.4, radius: 0.16 }}
          rim={{ width: 0.78, height: 0.46, radius: 0.18 }}
        >
          <CameraLens position={[-0.14, 0, 0]} radius={0.11} />
          <Flash position={[0.18, 0, 0]} radius={0.045} />
        </CameraPlate>
      )}
    </group>
  );
}

export function FrontCamera({
  edge,
  bodyW,
  bodyH,
  bezel,
  depth,
}: {
  edge: 'top' | 'right';
  bodyW: number;
  bodyH: number;
  bezel: number;
  depth: number;
}) {
  const a = Math.min(0.032, Math.max(0.018, 0.42 * bezel));
  const frontZ = getFrontSurfaceZ(depth) + 0.003;
  const pos: [number, number, number] =
    edge === 'top'
      ? [0, bodyH / 2 - 0.5 * bezel, frontZ]
      : [bodyW / 2 - 0.5 * bezel, 0, frontZ];

  return (
    <group position={pos}>
      <mesh>
        <circleGeometry args={[a, 28]} />
        <meshStandardMaterial color="#121316" metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <circleGeometry args={[0.52 * a, 24]} />
        <meshStandardMaterial color="#050506" metalness={0.7} roughness={0.18} />
      </mesh>
      <mesh position={[0.18 * a, 0.18 * a, 0.008]}>
        <circleGeometry args={[0.12 * a, 12]} />
        <meshBasicMaterial color="#9fd0ff" />
      </mesh>
    </group>
  );
}

// Apple Logo Texture Cache & Processor (exact port of hN, hD, hU, hO, hF, hz, hB)
interface LogoTextures {
  mask: THREE.CanvasTexture;
  core: THREE.CanvasTexture;
  halo: THREE.CanvasTexture;
  aspect: number;
}

let cachedLogo: LogoTextures | null = null;
let loadingLogoPromise: Promise<LogoTextures> | null = null;

function createLinearTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function drawScaledLogo(img: HTMLImageElement, scaleDivisor: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.max(1, Math.round(512 * (img.height / img.width)));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const w = canvas.width / scaleDivisor;
  const h = w * (img.height / img.width);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  return canvas;
}

function blurCanvas(source: HTMLCanvasElement, blurPx: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.filter = `blur(${blurPx}px)`;
    ctx.drawImage(source, 0, 0);
    ctx.filter = 'none';
  }
  return canvas;
}

function normalizeAlphaMask(
  canvas: HTMLCanvasElement,
  maxAlpha: number,
  subtractCanvas: HTMLCanvasElement | null
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const subData =
    subtractCanvas?.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height) ?? null;
  const weights = new Float32Array(imgData.data.length / 4);
  let maxVal = 1;

  for (let i = 0; i < weights.length; i++) {
    let a = imgData.data[4 * i + 3];
    if (subData) {
      a *= Math.pow(1 - subData.data[4 * i + 3] / 255, 0.72);
    }
    weights[i] = a;
    if (a > maxVal) maxVal = a;
  }

  for (let i = 0; i < weights.length; i++) {
    const alpha = Math.round((weights[i] / maxVal) * maxAlpha);
    const idx = 4 * i;
    imgData.data[idx] = 255;
    imgData.data[idx + 1] = 255;
    imgData.data[idx + 2] = 255;
    imgData.data[idx + 3] = alpha < 3 ? 0 : alpha;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export function AppleLogo({
  size,
  position,
  rotation = [0, Math.PI, 0],
  lit = false,
  finish = '#111111',
}: {
  size: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  lit?: boolean;
  finish?: string;
}) {
  const [logoData, setLogoData] = useState<LogoTextures | null>(cachedLogo);
  const maskRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const coreRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const haloRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const currentGlow = useRef<number>(lit ? 1 : 0);
  const targetLit = useRef<boolean>(lit);
  const invalidate = useThree((s) => s.invalidate);

  const darkFinishTint = useMemo(() => {
    const c = new THREE.Color(finish);
    c.multiplyScalar(0.08);
    return `#${c.getHexString()}`;
  }, [finish]);

  useEffect(() => {
    targetLit.current = lit;
    invalidate();
  }, [lit, invalidate]);

  useEffect(() => {
    let mounted = true;
    const promise = cachedLogo
      ? Promise.resolve(cachedLogo)
      : (loadingLogoPromise ??= new Promise<LogoTextures>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const maskCanvas = normalizeAlphaMask(blurCanvas(drawScaledLogo(img, 1), 1.4), 255, null);
            const coreCanvas = normalizeAlphaMask(blurCanvas(drawScaledLogo(img, 1.62), 12), 158, null);
            const baseHalo = drawScaledLogo(img, 3.05);
            const haloCanvas = normalizeAlphaMask(blurCanvas(baseHalo, 34), 104, blurCanvas(baseHalo, 2));
            cachedLogo = {
              mask: createLinearTexture(maskCanvas),
              core: createLinearTexture(coreCanvas),
              halo: createLinearTexture(haloCanvas),
              aspect: img.width / img.height,
            };
            resolve(cachedLogo);
          };
          img.onerror = () => reject(new Error('Failed to load apple-logo.png'));
          img.src = `${import.meta.env.BASE_URL}apple-logo.png`;
        }));

    promise.then((res) => {
      if (mounted) {
        setLogoData(res);
        invalidate();
      }
    });

    return () => {
      mounted = false;
    };
  }, [invalidate]);

  useFrame((_, delta) => {
    const target = targetLit.current ? 1 : 0;
    const next = currentGlow.current + (target - currentGlow.current) * (1 - Math.exp(-3.1 * delta));
    const settled = Math.abs(target - next) < 0.004;
    currentGlow.current = settled ? target : next;
    const val = currentGlow.current;

    if (maskRef.current) maskRef.current.opacity = 1 - 0.94 * val;
    if (coreRef.current) coreRef.current.opacity = val;
    if (haloRef.current) haloRef.current.opacity = val;

    if (!settled) invalidate();
  });

  if (!logoData) return null;

  const w = size * logoData.aspect;

  return (
    <group position={position} rotation={rotation}>
      <mesh renderOrder={2}>
        <planeGeometry args={[w, size]} />
        <meshBasicMaterial
          ref={maskRef}
          map={logoData.mask}
          color={darkFinishTint}
          transparent
          depthWrite={false}
          opacity={lit ? 0.06 : 1}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.001]} renderOrder={3}>
        <planeGeometry args={[3.05 * w, 3.05 * size]} />
        <meshBasicMaterial
          ref={haloRef}
          map={logoData.halo}
          color="#ffffff"
          transparent
          depthWrite={false}
          opacity={lit ? 1 : 0}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.002]} renderOrder={4}>
        <planeGeometry args={[1.62 * w, 1.62 * size]} />
        <meshBasicMaterial
          ref={coreRef}
          map={logoData.core}
          color="#ffffff"
          transparent
          depthWrite={false}
          opacity={lit ? 1 : 0}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function SideButtonItem({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={0.62} roughness={0.32} />
    </mesh>
  );
}

export function DeviceButtons({
  layout,
  bodyW,
  bodyH,
  color,
  edge = 'both',
}: {
  layout: string;
  bodyW: number;
  bodyH: number;
  color: string;
  edge?: 'left' | 'right' | 'both';
}) {
  if (layout === 'none') return null;

  const sideX = (dir: number, btnW: number) => dir * (bodyW / 2 + btnW / 2 - 0.008);
  const topBotY = (dir: number, btnH: number) => dir * (bodyH / 2 + btnH / 2 - 0.008);
  const topOffset = 0.32 * bodyH;

  if (layout === 'ipad') {
    return (
      <group>
        <SideButtonItem position={[sideX(1, 0.018), topOffset, 0]} size={[0.018, 0.22, 0.032]} color={color} />
        <SideButtonItem position={[sideX(1, 0.018), topOffset - 0.32, 0]} size={[0.018, 0.22, 0.032]} color={color} />
        <SideButtonItem position={[sideX(1, 0.016), topOffset - 0.78, 0]} size={[0.016, 0.16, 0.03]} color={color} />
        <SideButtonItem position={[0, topBotY(-1, 0.012), 0]} size={[0.16, 0.012, 0.028]} color="#1a1c20" />
      </group>
    );
  }

  if (layout === 'mini') {
    return (
      <group>
        <SideButtonItem position={[sideX(-1, 0.016), topOffset, 0]} size={[0.016, 0.2, 0.03]} color={color} />
        <SideButtonItem position={[sideX(-1, 0.016), topOffset - 0.28, 0]} size={[0.016, 0.2, 0.03]} color={color} />
        <SideButtonItem position={[0.22 * bodyW, topBotY(1, 0.016), 0]} size={[0.18, 0.016, 0.03]} color={color} />
        <SideButtonItem position={[0, topBotY(-1, 0.012), 0]} size={[0.14, 0.012, 0.026]} color="#1a1c20" />
      </group>
    );
  }

  if (layout === 'duo') {
    return (
      <group>
        {edge !== 'right' ? (
          <>
            <SideButtonItem position={[sideX(-1, 0.02), 0.55, 0]} size={[0.02, 0.26, 0.042]} color={color} />
            <SideButtonItem position={[sideX(-1, 0.02), 0.18, 0]} size={[0.02, 0.26, 0.042]} color={color} />
          </>
        ) : null}
        {edge !== 'left' ? (
          <SideButtonItem position={[sideX(1, 0.02), 0.42, 0]} size={[0.02, 0.38, 0.042]} color={color} />
        ) : null}
      </group>
    );
  }

  const topLeftSize: [number, number, number] =
    layout === 'switch' ? [0.016, 0.12, 0.036] : [0.02, 0.22, 0.042];

  return (
    <group>
      <SideButtonItem position={[sideX(-1, topLeftSize[0]), topOffset + 0.15, 0]} size={topLeftSize} color={color} />
      <SideButtonItem position={[sideX(-1, 0.02), topOffset - 0.28, 0]} size={[0.02, 0.28, 0.044]} color={color} />
      <SideButtonItem position={[sideX(-1, 0.02), topOffset - 0.66, 0]} size={[0.02, 0.28, 0.044]} color={color} />
      <SideButtonItem position={[sideX(1, 0.02), topOffset - 0.05, 0]} size={[0.02, 0.46, 0.044]} color={color} />
      {layout === 'action' ? (
        <SideButtonItem position={[sideX(1, 0.016), topOffset - 1.15, 0]} size={[0.016, 0.52, 0.036]} color={color} />
      ) : null}
      <SideButtonItem position={[0, topBotY(-1, 0.014), 0]} size={[0.14, 0.014, 0.03]} color="#14161a" />
      <SideButtonItem position={[sideX(-1, 0.008), -(0.22 * bodyH), 0]} size={[0.008, 0.14, 0.02]} color="#0c0d10" />
      <SideButtonItem position={[sideX(-1, 0.008), 0.08 * bodyH, 0]} size={[0.008, 0.14, 0.02]} color="#0c0d10" />
      <SideButtonItem position={[sideX(1, 0.008), -(0.22 * bodyH), 0]} size={[0.008, 0.14, 0.02]} color="#0c0d10" />
      <SideButtonItem position={[sideX(1, 0.008), 0.08 * bodyH, 0]} size={[0.008, 0.14, 0.02]} color="#0c0d10" />
    </group>
  );
}
