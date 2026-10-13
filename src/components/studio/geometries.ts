import * as THREE from 'three';
import { DeviceDefinition } from '../../types';

export const DUO_SPECS = {
  closedWidth: 8.41,
  openWidth: 16.46,
  height: 11.78,
  closedDepth: 1.13,
  openDepth: 0.52,
};
export const DUO_SCALE = 0.325;
export const DUO_OPEN_H = 626;
export const DUO_OPEN_W = 890;
export const DUO_CLOSED_H = 678;
export const DUO_CLOSED_W = 466;

export const ISLAND_SPECS = { width: 126, height: 37, top: 11 };
export const NOTCH_SPECS = { width: 162, height: 33 };

export function isDuoOpen(apertura: number): boolean {
  return apertura > 0.48;
}

export function getDuoViewport(apertura: number) {
  return isDuoOpen(apertura)
    ? { width: 890, height: 626, split: true }
    : { width: 466, height: 678, split: false };
}

export function isDesktopOrLaptop(device: DeviceDefinition): boolean {
  return device.kind === 'laptop' || device.kind === 'desktop';
}

export function getLandscapeStatusInset(device: DeviceDefinition): number {
  return device.kind === 'tablet'
    ? device.topInset
    : 32 * (device.kind === 'phone' || device.kind === 'duo' ? 1 : 0);
}

export function getBackSurfaceZ(depth: number): number {
  const bevel = Math.min(0.03, 0.2 * depth);
  return -(depth / 2 + bevel + 0.008);
}

export function getFrontSurfaceZ(depth: number): number {
  const bevel = Math.min(0.03, 0.2 * depth);
  const extrudeDepth = Math.max(0.04, depth - 2 * bevel);
  return extrudeDepth + bevel - depth / 2 + 0.002;
}

export const MACBOOK_SPECS: Record<string, { width: number; depth: number; thick: number }> = {
  'macbook-air-13': { width: 30.41, depth: 21.5, thick: 1.13 },
  'macbook-air-15': { width: 34.04, depth: 23.76, thick: 1.15 },
  'macbook-pro-14': { width: 31.26, depth: 22.12, thick: 1.55 },
  'macbook-pro-16': { width: 35.57, depth: 24.81, thick: 1.68 },
};

export const CAMERA_BUMPS: Record<string, { minX: number; maxX: number; minY: number; maxY: number }> = {
  'none': { minX: 0, maxX: 0, minY: 0, maxY: 0 },
  'iphone-14': { minX: -0.51, maxX: 0.51, minY: -0.51, maxY: 0.51 },
  'iphone-15': { minX: -0.41, maxX: 0.64, minY: -0.79, maxY: 0.79 },
  'iphone-16': { minX: -0.42, maxX: 0.67, minY: -0.89, maxY: 0.89 },
  'iphone-16-pro': { minX: -0.75, maxX: 0.75, minY: -0.75, maxY: 0.75 },
  'iphone-duo': { minX: -0.49, maxX: 0.75, minY: -0.92, maxY: 0.92 },
  'ipad-pro': { minX: -0.63, maxX: 0.63, minY: -0.28, maxY: 0.28 },
  'ipad-air': { minX: -0.26, maxX: 0.26, minY: -0.26, maxY: 0.26 },
  'ipad': { minX: -0.23, maxX: 0.23, minY: -0.23, maxY: 0.23 },
  'ipad-mini': { minX: -0.41, maxX: 0.41, minY: -0.25, maxY: 0.25 },
};

export function createRoundedRectShape(w: number, h: number, radius: number): THREE.Shape {
  const r = Math.min(Math.max(radius, 0.001), w / 2, h / 2);
  const shape = new THREE.Shape();
  shape.moveTo(r, 0);
  shape.lineTo(w - r, 0);
  shape.absarc(w - r, r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w, h - r);
  shape.absarc(w - r, h - r, r, 0, Math.PI / 2, false);
  shape.lineTo(r, h);
  shape.absarc(r, h - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(0, r);
  shape.absarc(r, r, r, Math.PI, 1.5 * Math.PI, false);
  return shape;
}

export function createRoundedPlaneGeometry(w: number, h: number, radius: number): THREE.ShapeGeometry {
  const shape = createRoundedRectShape(w, h, radius);
  const geo = new THREE.ShapeGeometry(shape, 16);
  geo.translate(-w / 2, -h / 2, 0);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  uv.needsUpdate = true;
  return geo;
}

export function createRoundedBoxGeometry(w: number, h: number, depth: number, radius: number): THREE.ExtrudeGeometry {
  const bevel = Math.min(0.03, 0.2 * depth);
  const shape = createRoundedRectShape(w, h, radius);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.04, depth - 2 * bevel),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 16,
  });
  geo.translate(-w / 2, -h / 2, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

export function createKeycapGeometry(w: number, d: number, thick: number): THREE.ExtrudeGeometry {
  const radius = 0.22 * Math.min(w, d);
  const bevel = Math.min(0.0032, 0.3 * thick);
  const geo = new THREE.ExtrudeGeometry(createRoundedRectShape(w, d, radius), {
    depth: Math.max(0.004, thick - 2 * bevel),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: Math.min(bevel, 0.45 * radius),
    bevelSegments: 1,
    curveSegments: 5,
  });
  geo.translate(-w / 2, -d / 2, -thick / 2);
  geo.rotateX(Math.PI / 2);
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  if (box) {
    geo.translate(
      -(box.min.x + box.max.x) / 2,
      -(box.min.y + box.max.y) / 2,
      -(box.min.z + box.max.z) / 2
    );
  }
  geo.computeVertexNormals();
  return geo;
}

export function createNotchGeometry(w: number, h: number, radius: number): THREE.ShapeGeometry {
  const r = Math.min(Math.max(radius, 0.001), w / 2, h);
  const halfW = w / 2;
  const halfH = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-halfW, halfH);
  shape.lineTo(halfW, halfH);
  shape.lineTo(halfW, -halfH + r);
  shape.absarc(halfW - r, -halfH + r, r, 0, -Math.PI / 2, true);
  shape.lineTo(-halfW + r, -halfH);
  shape.absarc(-halfW + r, -halfH + r, r, -Math.PI / 2, -Math.PI, true);
  shape.closePath();
  return new THREE.ShapeGeometry(shape, 12);
}

export function createDuoHalfGeometry(w: number, h: number, side: 'left' | 'right'): THREE.ShapeGeometry {
  const width = Math.max(w, 0.001);
  const height = Math.max(h, 0.001);
  const r = Math.min(height / 2, width);
  const shape = new THREE.Shape();
  if (side === 'left') {
    shape.moveTo(0, height / 2);
    shape.lineTo(0, -height / 2);
    shape.lineTo(-width + r, -height / 2);
    shape.absarc(-width + r, 0, r, -Math.PI / 2, Math.PI / 2, true);
  } else {
    shape.moveTo(0, height / 2);
    shape.lineTo(0, -height / 2);
    shape.lineTo(width - r, -height / 2);
    shape.absarc(width - r, 0, r, -Math.PI / 2, Math.PI / 2, false);
  }
  shape.closePath();
  return new THREE.ShapeGeometry(shape, 16);
}

export function getDeviceDimensions(width: number, height: number, kind: 'phone' | 'tablet' = 'phone') {
  const aspect = width / height;
  const screenH = kind === 'tablet' ? 4.15 : 4.72;
  const screenW = screenH * aspect;
  const bezel = kind === 'tablet' ? Math.max(0.042, 0.016 * Math.min(screenW, screenH)) : Math.max(0.036, 0.016 * screenW);
  const bodyW = screenW + 2 * bezel;
  const bodyH = screenH + 2 * bezel;
  const depth = kind === 'tablet' ? 0.08 : 0.15;
  const radius = kind === 'tablet' ? 0.045 * Math.min(screenW, screenH) : Math.min(0.18 * bodyW, 0.38);
  return { screenW, screenH, bodyW, bodyH, depth, radius, aspect, bezel };
}

export function rotatePoint(y: number, z: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { y: y * cos - z * sin, z: y * sin + z * cos };
}

export function getLaptopDimensions(device: DeviceDefinition, apertura: number = 0) {
  const spec = MACBOOK_SPECS[device.id] ?? MACBOOK_SPECS['macbook-air-13'];
  const w = 0.2 * spec.width;
  const d = 0.2 * spec.depth;
  const thick = 0.2 * spec.thick;
  const deck = 0.62 * thick;
  const lid = Math.max(0.045, 0.38 * thick);
  const radius = 0.055 * Math.min(w, d);
  const angle = -1.95 * Math.min(1, Math.max(0, apertura));
  const hingeY = deck + 0.012;

  const points = [
    rotatePoint(0, d, angle),
    rotatePoint(lid, d, angle),
    rotatePoint(0, 0, angle),
    rotatePoint(lid, 0, angle),
  ];

  let maxY = hingeY + lid;
  let minY = 0;
  let minZ = -d / 2;
  let maxZ = d / 2;

  for (const pt of points) {
    maxY = Math.max(maxY, hingeY + pt.y);
    minY = Math.min(minY, hingeY + pt.y);
    minZ = Math.min(minZ, -d / 2 + pt.z);
    maxZ = Math.max(maxZ, -d / 2 + pt.z);
  }

  const height = maxY - minY;
  const span = Math.max(w, height, maxZ - minZ);

  return {
    kind: 'laptop' as const,
    w,
    d,
    deck,
    lid,
    radius,
    gap: 0.012,
    angle,
    hingeY,
    height,
    span,
    centerZ: (minZ + maxZ) / 2,
    lift: -minY,
  };
}

export function getDesktopDimensions(device: DeviceDefinition) {
  const screenH = (53.15 * 0.15) / (device.width / device.height);
  const screenW = 53.15 * 0.15;
  const panelW = screenW + 0.216;
  const chin = 0.5325;
  const topBezel = 0.1575;
  const sideBezel = 0.108;
  const panelH = screenH + topBezel + chin;
  const thick = 0.1575;
  const neckH = 0.6225;
  const footH = 0.048;
  const footW = 0.36 * panelW;
  const footD = 14.7 * 0.15;
  const height = panelH + neckH + footH;
  const span = Math.max(panelW, height, footD);

  return {
    kind: 'desktop' as const,
    w: panelW,
    d: footD,
    deck: 0,
    lid: 0,
    radius: 0.045 * panelW,
    gap: 0,
    angle: 0,
    hingeY: 0,
    height,
    span,
    centerZ: 0,
    lift: 0,
    screenW,
    screenH,
    sideBezel,
    topBezel,
    chin,
    panelW,
    panelH,
    thick,
    neckH,
    footH,
    footW,
    footD,
  };
}

export function getScreenUserData(device: DeviceDefinition) {
  return {
    screen: true,
    panel: 'single',
    screenWidth: device.width,
    screenHeight: device.height,
    glassWidth: device.width,
    topInset: device.topInset,
    bottomInset: device.bottomInset,
    cutout: device.cutout,
    landscapeStatus: 0,
  };
}
