import { DeviceDefinition, DeviceOrientation, ScreenFitMode } from '../types';
import { isDesktopOrLaptop, getLandscapeStatusInset } from '../components/studio/geometries';

interface RGB {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_BG: RGB = { r: 243, g: 243, b: 243 };
let sampleCanvas: HTMLCanvasElement | null = null;
let sampleCtx: CanvasRenderingContext2D | null = null;

export function sampleRegionColor(
  source: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number
): RGB {
  if (typeof document === 'undefined') return DEFAULT_BG;
  sampleCanvas ??= document.createElement('canvas');
  sampleCtx ??= sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sampleCtx) return DEFAULT_BG;
  sampleCanvas.width = 1;
  sampleCanvas.height = 1;
  try {
    sampleCtx.drawImage(source, sx, sy, Math.max(1, sw), Math.max(1, sh), 0, 0, 1, 1);
    const data = sampleCtx.getImageData(0, 0, 1, 1).data;
    return { r: data[0], g: data[1], b: data[2] };
  } catch {
    return DEFAULT_BG;
  }
}

export function rgbToCss({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function isColorDark({ r, g, b }: RGB): boolean {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 145;
}

export function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  sw: number,
  sh: number
) {
  const scale = Math.min(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  ctx.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
}

export function drawCoveredImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  sw: number,
  sh: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();
  const scale = Math.max(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  ctx.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
  ctx.restore();
}

export function drawFittedImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  sw: number,
  sh: number,
  fitMode: ScreenFitMode = 'cover'
) {
  if (fitMode === 'fill') {
    ctx.drawImage(img, dx, dy, dw, dh);
    return;
  }
  if (fitMode === 'contain') {
    const topCol = sampleRegionColor(img, 0, 0, sw, Math.max(1, Math.round(0.03 * sh)));
    const botCol = sampleRegionColor(img, 0, Math.max(0, sh - 2), sw, 2);
    const grad = ctx.createLinearGradient(dx, dy, dx, dy + dh);
    grad.addColorStop(0, rgbToCss(topCol));
    grad.addColorStop(1, rgbToCss(botCol));
    ctx.fillStyle = grad;
    ctx.fillRect(dx, dy, dw, dh);
    drawContainedImage(ctx, img, dx, dy, dw, dh, sw, sh);
    return;
  }
  drawCoveredImage(ctx, img, dx, dy, dw, dh, sw, sh);
}

function getFontFamily(): string {
  if (typeof document === 'undefined') return 'Inter, sans-serif';
  return getComputedStyle(document.body).fontFamily || 'Inter, sans-serif';
}

export function drawStatusRightIcons(
  ctx: CanvasRenderingContext2D,
  rightX: number,
  centerY: number,
  scale: number
) {
  const battX = rightX - 27 * scale;
  const battW = 24 * scale;
  const battH = 11.5 * scale;

  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = 1.25 * scale;
  drawRoundedRectPath(ctx, battX, centerY - battH / 2, battW, battH, 2.5 * scale);
  ctx.stroke();
  ctx.fillRect(battX + battW + 0.6 * scale, centerY - 2.2 * scale, 1.6 * scale, 4.4 * scale);
  ctx.fillRect(battX + 1.6 * scale, centerY - battH / 2 + 1.5 * scale, 0.62 * battW, battH - 3 * scale);

  // Wi-Fi arcs
  const wifiX = rightX - 46 * scale;
  const wifiY = centerY + scale;
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = 1.6 * scale;
  ctx.lineCap = 'round';
  for (let r = 0; r < 3; r += 1) {
    const rad = (3.2 + 3.1 * r) * scale;
    ctx.beginPath();
    ctx.arc(wifiX, wifiY, rad, 1.16 * Math.PI, 1.84 * Math.PI);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(wifiX, wifiY, 1.15 * scale, 0, 2 * Math.PI);
  ctx.fill();

  // Cellular signal bars
  const cellX = rightX - 78 * scale;
  const cellY = centerY + 5 * scale;
  const barW = 3 * scale;
  const gap = 1.6 * scale;
  for (let s = 0; s < 4; s += 1) {
    const barH = (4 + 2.4 * s) * scale;
    ctx.fillRect(cellX + s * (barW + gap), cellY - barH, barW, barH);
  }
}

export function renderDeviceScreenCanvas({
  canvas,
  device,
  sourceImage,
  sourceW,
  sourceH,
  viewportW,
  viewportH,
  orientation = 'portrait',
  time = '9:41',
  isDesignMode = false,
  screenFit = 'cover',
}: {
  canvas: HTMLCanvasElement;
  device: DeviceDefinition;
  sourceImage: CanvasImageSource | null;
  sourceW: number;
  sourceH: number;
  viewportW: number;
  viewportH: number;
  orientation?: DeviceOrientation;
  time?: string;
  isDesignMode?: boolean;
  screenFit?: ScreenFitMode;
}): boolean {
  const p = Math.max(2, Math.round(2 * viewportW));
  const f = Math.max(2, Math.round(2 * viewportH));
  let resized = false;
  if (canvas.width !== p) {
    canvas.width = p;
    resized = true;
  }
  if (canvas.height !== f) {
    canvas.height = f;
    resized = true;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return resized;

  const isLandscape = orientation === 'landscape' && !isDesktopOrLaptop(device);

  if (isDesignMode) {
    ctx.clearRect(0, 0, p, f);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, p, f);
    if (sourceImage && sourceW > 0 && sourceH > 0) {
      if (isLandscape) {
        ctx.save();
        ctx.translate(p / 2, f / 2);
        ctx.rotate(Math.PI / 2);
        drawFittedImage(ctx, sourceImage, -f / 2, -p / 2, f, p, sourceW, sourceH, screenFit);
        ctx.restore();
      } else {
        drawFittedImage(ctx, sourceImage, 0, 0, p, f, sourceW, sourceH, screenFit);
      }
    }
    return resized;
  }

  const topInsetVal = isLandscape && device.cutout === 'none' ? 0 : device.topInset;
  const sideInsetVal = isLandscape ? getLandscapeStatusInset(device) : 0;
  const y = 2 * topInsetVal;
  const x = 2 * device.bottomInset;
  const b = 2 * sideInsetVal;
  const S = p - b;
  const M = f - y - x;

  let topSample = DEFAULT_BG;
  let botSample = DEFAULT_BG;
  let hasValidSource = false;

  if (sourceImage && sourceW > 0 && sourceH > 0) {
    try {
      topSample = sampleRegionColor(sourceImage, 0, 0, sourceW, Math.max(1, Math.round(0.02 * sourceH)));
      botSample = sampleRegionColor(sourceImage, 0, Math.max(0, sourceH - 2), sourceW, 2);
      hasValidSource = true;
    } catch {
      hasValidSource = false;
    }
  }

  const statusTextColor = isColorDark(topSample) ? '#f5f5f5' : '#111111';
  const homeBarColor = isColorDark(botSample) ? 'rgba(245,245,245,0.92)' : 'rgba(17,17,17,0.88)';

  if (y > 0) {
    ctx.fillStyle = rgbToCss(topSample);
    ctx.fillRect(0, 0, p, y);
  }
  if (x > 0) {
    ctx.fillStyle = rgbToCss(botSample);
    ctx.fillRect(0, f - x, p, x);
  }
  if (b > 0) {
    ctx.fillStyle = rgbToCss(topSample);
    ctx.fillRect(S, 0, b, f);
  }

  ctx.fillStyle = '#f7f7f7';
  ctx.fillRect(0, y, S, M);

  if (hasValidSource && sourceImage) {
    ctx.save();
    if (isLandscape) {
      ctx.beginPath();
      ctx.rect(0, y, S, M);
      ctx.clip();
      ctx.translate(S / 2, y + M / 2);
      ctx.rotate(Math.PI / 2);
      drawCoveredImage(ctx, sourceImage, -M / 2, -S / 2, M, S, sourceW, sourceH);
    } else {
      drawCoveredImage(ctx, sourceImage, 0, y, S, M, sourceW, sourceH);
    }
    ctx.restore();
  }

  // Laptop / Desktop macOS Menu Bar
  if (isDesktopOrLaptop(device)) {
    ctx.fillStyle = isColorDark(topSample) ? 'rgba(28,28,30,0.94)' : 'rgba(246,246,246,0.96)';
    ctx.fillRect(0, 0, p, 2 * device.topInset);
    if (device.topInset > 0) {
      const barH = 2 * device.topInset;
      const font = getFontFamily();
      ctx.fillStyle = statusTextColor;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.font = `500 26px ${font}`;
      let curX = 36;
      for (const item of ['File', 'Edit', 'View']) {
        ctx.fillText(item, curX, barH / 2);
        curX += ctx.measureText(item).width + 36;
      }
      ctx.textAlign = 'right';
      ctx.fillText(time, 2 * viewportW - 36, barH / 2);
    }
    return resized;
  }

  // Phone / Tablet Status Bar
  if (isLandscape) {
    const s = getLandscapeStatusInset(device);
    if (s > 0) {
      const o = 2 * s;
      const l = 2 * viewportH;
      const u = 2 * viewportW - o;
      ctx.save();
      ctx.beginPath();
      ctx.rect(u, 0, o, l);
      ctx.clip();
      ctx.fillStyle = statusTextColor;
      ctx.strokeStyle = statusTextColor;
      ctx.translate(u + o / 2, 0);
      ctx.rotate(Math.PI / 2);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.font = `600 26px ${getFontFamily()}`;
      ctx.fillText(time, 44, 0);
      drawStatusRightIcons(ctx, l - 32, 0, 2);
      ctx.restore();
    }
  } else if (device.topInset > 0) {
    const barH = 2 * device.topInset;
    ctx.fillStyle = statusTextColor;
    ctx.strokeStyle = statusTextColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.font = `600 30px ${getFontFamily()}`;
    ctx.fillText(time, 44, barH / 2);
    drawStatusRightIcons(ctx, 2 * viewportW - 32, barH / 2, 2);
  }

  // Bottom Home Indicator Pill
  if (device.bottomInset > 0) {
    const pillW = (device.kind === 'tablet' ? 0.13 * viewportW : Math.min(134, 0.34 * viewportW)) * 2;
    const pillBottomOffset = (device.kind === 'tablet' ? 7 : 10) * 2;
    ctx.fillStyle = homeBarColor;
    drawRoundedRectPath(ctx, (2 * viewportW - pillW) / 2, 2 * viewportH - pillBottomOffset - 10, pillW, 10, 5);
    ctx.fill();
  }

  return resized;
}

export function splitCanvasHalf(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  side: 'left' | 'right'
): boolean {
  const halfW = Math.max(1, Math.floor(sourceCanvas.width / 2));
  const sx = side === 'right' ? sourceCanvas.width - halfW : 0;
  let resized = false;
  if (targetCanvas.width !== halfW) {
    targetCanvas.width = halfW;
    resized = true;
  }
  if (targetCanvas.height !== sourceCanvas.height) {
    targetCanvas.height = sourceCanvas.height;
    resized = true;
  }
  const ctx = targetCanvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(sourceCanvas, sx, 0, halfW, sourceCanvas.height, 0, 0, halfW, sourceCanvas.height);
  }
  return resized;
}
