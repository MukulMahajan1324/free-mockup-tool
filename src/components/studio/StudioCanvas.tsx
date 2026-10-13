import { useRef, useMemo, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  DeviceDefinition,
  DeviceFinish,
  DeviceOrientation,
  CinematicShot,
  ExportMode,
  ScreenFitMode,
} from '../../types';
import { calculateEffectiveScreenSize } from '../../data/devices';
import { PhoneTabletMesh } from './PhoneTabletMesh';
import { LaptopMesh } from './LaptopMesh';
import { DesktopMesh } from './DesktopMesh';
import { DuoMesh } from './DuoMesh';
import { GroundShadow } from './GroundShadow';
import { CinematicController } from './CinematicController';
import {
  getLaptopDimensions,
  getDesktopDimensions,
  getDeviceDimensions,
  getDuoViewport,
  isDuoOpen,
  isDesktopOrLaptop,
  DUO_SPECS,
  DUO_SCALE,
} from './geometries';
import { renderDeviceScreenCanvas, splitCanvasHalf } from '../../utils/screenTexture';
import { renderMockWebpage } from '../../utils/mockBrowser';

function createScreenCanvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function CameraFramer({ span, insetLeft = 0 }: { span: number; insetLeft?: number }) {
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const controls = useThree((s) => s.controls as any);

  useEffect(() => {
    const s = size.width < 900 ? Math.min(insetLeft, 0.5 * size.width) : 0;
    const o = Math.max(150, size.width - s - (s > 0 ? (s > 120 ? 24 : 8) : 0));
    const l = Math.max(13.6, 2.75 * span) * (s > 0 ? size.width / o : 1);
    camera.position.set(0.5810351605373051 * l, 0.2 * l, 0.8138784566625339 * l);
    camera.lookAt(0, 0, 0);
    if (s > 0 && size.height > 0) {
      camera.setViewOffset(size.width, size.height, -s, 0, size.width, size.height);
    } else {
      camera.clearViewOffset();
    }
    if (controls) {
      controls.maxDistance = Math.max(26, l + 2);
      controls.target.set(0, 0, 0);
      controls.update();
    }
    invalidate();
  }, [camera, controls, insetLeft, invalidate, size.height, size.width, span]);

  return null;
}

export interface StudioCanvasProps {
  device: DeviceDefinition;
  finish: DeviceFinish;
  orientation: DeviceOrientation;
  apertura: number;
  lightIntensity: number;
  logoLight: boolean;
  autoRotate: boolean;
  cinematic: CinematicShot | null;
  onCinematicEnd: () => void;
  backgroundCss: string;
  isTransparentBg: boolean;
  backgroundImageUrl: string | null;
  screenSource: 'live' | 'design';
  screenFit?: ScreenFitMode;
  liveUrl: string;
  designImage: HTMLImageElement | null;
  liveBitmap: ImageBitmap | null;
  onScreenInput?: (x: number, y: number, type: string) => void;
}

export interface StudioCanvasHandle {
  exportScreenshot: (mode: ExportMode) => Promise<string>;
}

export const StudioCanvas = forwardRef<StudioCanvasHandle, StudioCanvasProps>(function StudioCanvas(
  {
    device,
    finish,
    orientation,
    apertura,
    lightIntensity,
    logoLight,
    autoRotate,
    cinematic,
    onCinematicEnd,
    backgroundCss,
    isTransparentBg,
    backgroundImageUrl,
    screenSource,
    screenFit = 'cover',
    liveUrl,
    designImage,
    liveBitmap,
    onScreenInput,
  },
  ref
) {
  const [scrollY, setScrollY] = useState(0);

  const [mainCanvas] = useState(() => document.createElement('canvas'));
  const [leftCanvas] = useState(() => document.createElement('canvas'));
  const [rightCanvas] = useState(() => document.createElement('canvas'));
  const [webSimCanvas] = useState(() => document.createElement('canvas'));

  const mainTexture = useMemo(() => createScreenCanvasTexture(mainCanvas), [mainCanvas]);
  const leftTexture = useMemo(() => createScreenCanvasTexture(leftCanvas), [leftCanvas]);
  const rightTexture = useMemo(() => createScreenCanvasTexture(rightCanvas), [rightCanvas]);

  useEffect(
    () => () => {
      mainTexture.dispose();
      leftTexture.dispose();
      rightTexture.dispose();
    },
    [mainTexture, leftTexture, rightTexture]
  );

  const duoViewport = useMemo(
    () =>
      device.id === 'iphone-duo'
        ? getDuoViewport(apertura)
        : { width: device.width, height: device.height, split: false },
    [device.id, device.width, device.height, apertura]
  );

  // Render 2x Retina Screen Canvas + Status Bar / Menu Bar + Home Indicator
  useEffect(() => {
    const vpW = duoViewport.width;
    const vpH = duoViewport.height;
    const effectiveOrientation = isDesktopOrLaptop(device) ? 'portrait' : orientation;

    let sourceImg: CanvasImageSource | null = null;
    let sourceW = 0;
    let sourceH = 0;

    if (screenSource === 'design' && designImage && designImage.naturalWidth > 0) {
      sourceImg = designImage;
      sourceW = designImage.naturalWidth;
      sourceH = designImage.naturalHeight;
    } else if (screenSource === 'live' && liveBitmap && liveBitmap.width > 0) {
      sourceImg = liveBitmap;
      sourceW = liveBitmap.width;
      sourceH = liveBitmap.height;
    } else {
      const eff = calculateEffectiveScreenSize(device, apertura, effectiveOrientation);
      renderMockWebpage(webSimCanvas, liveUrl, eff.width, eff.height, scrollY);
      sourceImg = webSimCanvas;
      sourceW = eff.width;
      sourceH = eff.height;
    }

    const mainResized = renderDeviceScreenCanvas({
      canvas: mainCanvas,
      device,
      sourceImage: sourceImg,
      sourceW,
      sourceH,
      viewportW: vpW,
      viewportH: vpH,
      orientation: effectiveOrientation,
      time: '9:41',
      isDesignMode: screenSource === 'design' && !!designImage,
      screenFit,
    });

    if (duoViewport.split) {
      const leftResized = splitCanvasHalf(mainCanvas, leftCanvas, 'left');
      const rightResized = splitCanvasHalf(mainCanvas, rightCanvas, 'right');
      if (leftResized) leftTexture.dispose();
      if (rightResized) rightTexture.dispose();
      leftTexture.needsUpdate = true;
      rightTexture.needsUpdate = true;
    } else {
      if (mainResized) mainTexture.dispose();
      mainTexture.needsUpdate = true;
    }
  }, [
    device,
    apertura,
    duoViewport,
    screenSource,
    screenFit,
    designImage,
    liveBitmap,
    liveUrl,
    scrollY,
    orientation,
    mainCanvas,
    leftCanvas,
    rightCanvas,
    webSimCanvas,
    mainTexture,
    leftTexture,
    rightTexture,
  ]);

  // Exact span & height calculations (X, q, Y, Z from dD)
  const spanX = useMemo(() => {
    if (device.kind === 'desktop') return getDesktopDimensions(device).span;
    if (device.kind === 'laptop') return getLaptopDimensions(device, apertura).span;
    if (device.id === 'iphone-duo') {
      return Math.max(
        (isDuoOpen(apertura) ? DUO_SPECS.openWidth : DUO_SPECS.closedWidth) * DUO_SCALE,
        DUO_SPECS.height * DUO_SCALE
      );
    }
    const kind = device.kind === 'tablet' ? 'tablet' : 'phone';
    return getDeviceDimensions(device.width, device.height, kind).bodyH;
  }, [device, apertura]);

  const heightQ = useMemo(() => {
    if (device.kind === 'desktop') return getDesktopDimensions(device).height;
    if (device.kind === 'laptop') return getLaptopDimensions(device, apertura).height;
    if (device.id === 'iphone-duo') {
      return (
        (orientation === 'landscape'
          ? isDuoOpen(apertura)
            ? DUO_SPECS.openWidth
            : DUO_SPECS.closedWidth
          : DUO_SPECS.height) * DUO_SCALE
      );
    }
    const kind = device.kind === 'tablet' ? 'tablet' : 'phone';
    const r = getDeviceDimensions(device.width, device.height, kind);
    return orientation === 'landscape' ? r.bodyW : r.bodyH;
  }, [device, orientation, apertura]);

  const isLandscapeRotated = orientation === 'landscape' && !isDesktopOrLaptop(device);
  const shadowWidthZ = isDesktopOrLaptop(device)
    ? Math.max(4.4, 0.9 * spanX)
    : device.id === 'iphone-duo' && isDuoOpen(apertura)
    ? 6.2
    : 3.6;

  // Expose Screenshot Export Handler
  useImperativeHandle(ref, () => ({
    exportScreenshot: async (mode: ExportMode) => {
      const glCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!glCanvas) throw new Error('3D Canvas not found');

      if (mode === 'square') {
        const size = Math.min(glCanvas.width, glCanvas.height);
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = size;
        cropCanvas.height = size;
        const cCtx = cropCanvas.getContext('2d');
        if (cCtx) {
          cCtx.drawImage(
            glCanvas,
            (glCanvas.width - size) / 2,
            (glCanvas.height - size) / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );
          return cropCanvas.toDataURL('image/png');
        }
      } else if (mode === 'story') {
        const targetW = 1080;
        const targetH = 1920;
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = targetW;
        cropCanvas.height = targetH;
        const cCtx = cropCanvas.getContext('2d');
        if (cCtx) {
          cCtx.drawImage(glCanvas, 0, 0, targetW, targetH);
          return cropCanvas.toDataURL('image/png');
        }
      }

      return glCanvas.toDataURL('image/png');
    },
  }));

  // @ts-expect-error Three.js pointer event
  const handleScreenPointerDown = (e) => {
    if (e.object?.userData?.screen && e.uv) {
      const x = Math.round(e.uv.x * device.width);
      const y = Math.round((1 - e.uv.y) * device.height);
      onScreenInput?.(x, y, 'click');
      setScrollY((prev) => (prev + 120) % Math.max(120, Math.round(device.height * 0.6)));
    }
  };

  const bgStyle = useMemo(() => {
    if (isTransparentBg) return { background: 'transparent' };
    if (backgroundImageUrl) {
      return {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: backgroundCss,
    };
  }, [isTransparentBg, backgroundImageUrl, backgroundCss]);

  return (
    <div className="relative w-full h-full transition-all duration-500 ease-out" style={bgStyle}>
      <Canvas
        camera={{ position: [7.6, 2.6, 10.4], fov: 28 }}
        dpr={[1, 2]}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.domElement.style.touchAction = 'none';
        }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      >
        <CameraFramer span={spanX} />

        <CinematicController
          shot={cinematic}
          device={device}
          apertura={apertura}
          orientation={orientation}
          onEnd={onCinematicEnd}
        />

        <ambientLight intensity={0.55 * lightIntensity} />
        <hemisphereLight args={['#f4f4f2', '#d5d5d2', 0.4 * lightIntensity]} />
        <directionalLight position={[3.4, 5.2, 4.2]} intensity={1.25 * lightIntensity} />
        <directionalLight position={[-3.2, 2.4, 2.2]} intensity={0.38 * lightIntensity} />
        <directionalLight position={[-1.6, 3.2, -5.4]} intensity={0.9 * lightIntensity} />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={7}
          maxDistance={26}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          autoRotate={autoRotate && !cinematic}
          autoRotateSpeed={1.6}
        />

        <group
          rotation={[0, 0, isLandscapeRotated ? Math.PI / 2 : 0]}
          onPointerDown={handleScreenPointerDown}
        >
          {device.id === 'iphone-duo' ? (
            <DuoMesh
              texture={mainTexture}
              leftTexture={leftTexture}
              rightTexture={rightTexture}
              apertura={apertura}
              finish={finish}
              logoLight={logoLight}
            />
          ) : device.kind === 'laptop' ? (
            <LaptopMesh
              device={device}
              texture={mainTexture}
              apertura={apertura}
              finish={finish}
              logoLight={logoLight}
            />
          ) : device.kind === 'desktop' ? (
            <DesktopMesh
              device={device}
              texture={mainTexture}
              finish={finish}
              logoLight={logoLight}
            />
          ) : (
            <PhoneTabletMesh
              device={device}
              texture={mainTexture}
              finish={finish}
              logoLight={logoLight}
            />
          )}
        </group>

        <GroundShadow
          y={-heightQ / 2 - 0.012}
          strength={0.9 * Math.min(Math.max(lightIntensity, 0), 1.3)}
          width={shadowWidthZ}
        />
      </Canvas>
    </div>
  );
});
