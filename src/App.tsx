import { useState, useRef } from 'react';
import { DEVICES, getDeviceById } from './data/devices';
import { BACKGROUNDS } from './data/backgrounds';
import {
  DeviceDefinition,
  DeviceFinish,
  DeviceOrientation,
  CinematicShot,
  ScreenSourceMode,
  ScreenFitMode,
  ExportMode,
} from './types';
import { StudioCanvas, StudioCanvasHandle } from './components/studio/StudioCanvas';
import { Shell } from './components/ui/Shell';
import { BrandPill } from './components/ui/BrandPill';
import { useLiveWebSocket } from './utils/useLiveWebSocket';

export default function App() {
  const defaultDevice = getDeviceById('iphone-16');
  const [device, setDevice] = useState<DeviceDefinition>(defaultDevice);
  const [finish, setFinish] = useState<DeviceFinish>(defaultDevice.finishes[0]);
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [apertura, setApertura] = useState<number>(0.85);

  // Background state
  const [selectedBgId, setSelectedBgId] = useState<string>('blanco');
  const [isTransparentBg, setIsTransparentBg] = useState<boolean>(false);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);

  // Scene state
  const [lightIntensity, setLightIntensity] = useState<number>(1.0);
  const [logoLight, setLogoLight] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cinematic, setCinematic] = useState<CinematicShot | null>(null);

  // Screen source state
  const [screenSource, setScreenSource] = useState<ScreenSourceMode>('live');
  const [screenFit, setScreenFit] = useState<ScreenFitMode>('fill');
  const [liveUrl, setLiveUrl] = useState<string>('https://www.apple.com');
  const [designImage, setDesignImage] = useState<HTMLImageElement | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const canvasRef = useRef<StudioCanvasHandle | null>(null);

  // Live WebSocket stream
  const { status, frame, sendInput } = useLiveWebSocket(
    device,
    apertura,
    orientation,
    liveUrl,
    screenSource === 'live'
  );

  // Device selection
  const handleSelectDevice = (newDevice: DeviceDefinition) => {
    setDevice(newDevice);
    setFinish(newDevice.finishes[0]);
    if (newDevice.kind === 'laptop' || newDevice.kind === 'desktop') {
      setOrientation('portrait');
    }
  };

  // Background selection
  const handleSelectBg = (bgId: string) => {
    setSelectedBgId(bgId);
    setIsTransparentBg(false);
    setWallpaperUrl(null);
  };

  const activeBg = BACKGROUNDS.find((b) => b.id === selectedBgId) || BACKGROUNDS[0];

  // Wallpaper file upload
  const handleUploadWallpaper = (file: File) => {
    const url = URL.createObjectURL(file);
    setWallpaperUrl(url);
    setIsTransparentBg(false);
  };

  // Design screenshot upload
  const handleUploadDesignImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setDesignImage(img);
      setScreenSource('design');
    };
    img.src = url;
  };

  // Export Screenshot
  const handleExport = async (mode: ExportMode) => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await canvasRef.current.exportScreenshot(mode);
      const link = document.createElement('a');
      link.download = `mockup-${device.id}-${mode}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-white font-sans text-neutral-950">
      {/* Top Left Branding Pill */}
      <BrandPill isDark={selectedBgId === 'blanco' || selectedBgId === 'niebla'} />

      {/* Floating Status Indicator on Top Center (when opening or streaming) */}
      {screenSource === 'live' && status.status === 'loading' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200/80 shadow-sm text-xs font-medium text-neutral-600 animate-pulse">
          <span className="size-2 rounded-full bg-blue-500 animate-ping" />
          <span>{status.message || 'Opening live session…'}</span>
        </div>
      )}

      {/* 3D Studio Canvas */}
      <StudioCanvas
        ref={canvasRef}
        device={device}
        finish={finish}
        orientation={orientation}
        apertura={apertura}
        lightIntensity={lightIntensity}
        logoLight={logoLight}
        autoRotate={autoRotate}
        cinematic={cinematic}
        onCinematicEnd={() => setCinematic(null)}
        backgroundCss={activeBg.css}
        isTransparentBg={isTransparentBg}
        backgroundImageUrl={wallpaperUrl}
        screenSource={screenSource}
        screenFit={screenFit}
        liveUrl={liveUrl}
        designImage={designImage}
        liveBitmap={frame}
        onScreenInput={(x, y) => sendInput({ event: 'click', x, y })}
      />

      {/* Floating Shell Sidebar */}
      <Shell
        device={device}
        onSelectDevice={handleSelectDevice}
        finish={finish}
        onSelectFinish={setFinish}
        orientation={orientation}
        onChangeOrientation={setOrientation}
        apertura={apertura}
        onChangeApertura={setApertura}
        selectedBgId={selectedBgId}
        onSelectBg={handleSelectBg}
        isTransparentBg={isTransparentBg}
        onToggleTransparentBg={setIsTransparentBg}
        onUploadWallpaper={handleUploadWallpaper}
        lightIntensity={lightIntensity}
        onChangeLightIntensity={setLightIntensity}
        logoLight={logoLight}
        onToggleLogoLight={setLogoLight}
        autoRotate={autoRotate}
        onToggleAutoRotate={setAutoRotate}
        onTriggerCinematic={(shot) => setCinematic(shot)}
        screenSource={screenSource}
        onChangeScreenSource={setScreenSource}
        screenFit={screenFit}
        onChangeScreenFit={setScreenFit}
        liveUrl={liveUrl}
        onChangeLiveUrl={setLiveUrl}
        onSubmitLiveUrl={(url) => setLiveUrl(url)}
        isConnecting={status.status === 'loading'}
        onUploadDesignImage={handleUploadDesignImage}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </main>
  );
}
