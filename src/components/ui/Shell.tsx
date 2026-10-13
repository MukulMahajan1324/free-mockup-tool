import React, { useState } from 'react';
import {
  Link2,
  Smartphone,
  Palette,
  Image as ImageIcon,
  Sun,
  Video,
  Download,
  ChevronLeft,
  ChevronRight,
  Upload,
  RefreshCw,
  Sparkles,
  RotateCw,
  Check,
} from 'lucide-react';
import {
  DeviceDefinition,
  DeviceFinish,
  DeviceCategory,
  DeviceOrientation,
  CinematicShot,
  ShellMode,
  ScreenSourceMode,
  ScreenFitMode,
  ExportMode,
} from '../../types';
import { DEVICES, CATEGORIES } from '../../data/devices';
import { BACKGROUNDS, BACKGROUND_COLLECTIONS } from '../../data/backgrounds';

export interface ShellProps {
  // Device & Finish
  device: DeviceDefinition;
  onSelectDevice: (device: DeviceDefinition) => void;
  finish: DeviceFinish;
  onSelectFinish: (finish: DeviceFinish) => void;
  orientation: DeviceOrientation;
  onChangeOrientation: (o: DeviceOrientation) => void;
  apertura: number;
  onChangeApertura: (v: number) => void;

  // Background
  selectedBgId: string;
  onSelectBg: (id: string) => void;
  isTransparentBg: boolean;
  onToggleTransparentBg: (val: boolean) => void;
  onUploadWallpaper: (file: File) => void;

  // Scene & Cinematics
  lightIntensity: number;
  onChangeLightIntensity: (v: number) => void;
  logoLight: boolean;
  onToggleLogoLight: (v: boolean) => void;
  autoRotate: boolean;
  onToggleAutoRotate: (v: boolean) => void;
  onTriggerCinematic: (shot: CinematicShot) => void;

  // Screen Source & Live
  screenSource: ScreenSourceMode;
  onChangeScreenSource: (source: ScreenSourceMode) => void;
  screenFit?: ScreenFitMode;
  onChangeScreenFit?: (fit: ScreenFitMode) => void;
  liveUrl: string;
  onChangeLiveUrl: (url: string) => void;
  onSubmitLiveUrl: (url: string) => void;
  isConnecting: boolean;
  onUploadDesignImage: (file: File) => void;

  // Export
  onExport: (mode: ExportMode) => void;
  isExporting: boolean;
}

export function Shell({
  device,
  onSelectDevice,
  finish,
  onSelectFinish,
  orientation,
  onChangeOrientation,
  apertura,
  onChangeApertura,
  selectedBgId,
  onSelectBg,
  isTransparentBg,
  onToggleTransparentBg,
  onUploadWallpaper,
  lightIntensity,
  onChangeLightIntensity,
  logoLight,
  onToggleLogoLight,
  autoRotate,
  onToggleAutoRotate,
  onTriggerCinematic,
  screenSource,
  onChangeScreenSource,
  screenFit = 'cover',
  onChangeScreenFit,
  liveUrl,
  onChangeLiveUrl,
  onSubmitLiveUrl,
  isConnecting,
  onUploadDesignImage,
  onExport,
  isExporting,
}: ShellProps) {
  const [mode, setMode] = useState<ShellMode>('expanded');
  const [activeTab, setActiveTab] = useState<string>('page');
  const [deviceCategory, setDeviceCategory] = useState<string>('mobile');
  const [bgCollection, setBgCollection] = useState<string>('solids');
  const [urlInput, setUrlInput] = useState(liveUrl);

  const TABS = [
    { id: 'page', label: 'Screen', icon: Link2 },
    { id: 'device', label: 'Device', icon: Smartphone },
    { id: 'finish', label: 'Finish', icon: Palette },
    { id: 'background', label: 'Background', icon: ImageIcon },
    { id: 'scene', label: 'Scene', icon: Sun },
    { id: 'cinematics', label: 'Cinematics', icon: Video },
    { id: 'export', label: 'Export', icon: Download },
  ];

  const filteredDevices = DEVICES.filter((d) => {
    if (deviceCategory === 'mobile') return d.kind === 'phone' || d.kind === 'duo';
    return d.kind === deviceCategory;
  });

  const activeBgGroup = BACKGROUND_COLLECTIONS.find((g) => g.id === bgCollection) || BACKGROUND_COLLECTIONS[0];
  const filteredBackgrounds = BACKGROUNDS.filter(activeBgGroup.filter);

  const isLaptopOrDuo = device.kind === 'laptop' || device.id === 'iphone-duo';

  return (
    <div className="absolute top-16 left-4 bottom-4 z-30 flex gap-2 pointer-events-none">
      {/* 1. Icon Rail */}
      <div className="pointer-events-auto flex flex-col bg-white/80 backdrop-blur-xl border border-neutral-200/80 rounded-2xl shadow-lg p-1.5 w-13 h-fit items-center gap-1 transition-all">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && mode !== 'icon';
          return (
            <button
              key={tab.id}
              title={tab.label}
              onClick={() => {
                if (activeTab === tab.id && mode === 'expanded') {
                  setMode('rail');
                } else {
                  setActiveTab(tab.id);
                  setMode('expanded');
                }
              }}
              className={`relative size-10 flex items-center justify-center rounded-xl transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
              }`}
            >
              <Icon className="size-4.5" />
            </button>
          );
        })}

        <div className="w-6 h-px bg-neutral-200/80 my-1" />

        {/* Toggle Collapse */}
        <button
          title={mode === 'expanded' ? 'Collapse panel' : 'Expand panel'}
          onClick={() => setMode(mode === 'expanded' ? 'rail' : 'expanded')}
          className="size-9 flex items-center justify-center rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100/60 transition-all"
        >
          {mode === 'expanded' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      </div>

      {/* 2. Flyout Sub-panel (when expanded) */}
      {mode === 'expanded' && (
        <div className="pointer-events-auto flex flex-col w-80 max-h-full bg-white/90 backdrop-blur-2xl border border-neutral-200/80 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <span className="text-sm font-semibold text-neutral-900">
              {TABS.find((t) => t.id === activeTab)?.label}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {device.label}
            </span>
          </div>

          {/* Panel Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-[13px]">
            {/* TAB: PAGE / SCREEN SOURCE */}
            {activeTab === 'page' && (
              <div className="space-y-4">
                {/* Segmented control: Live vs Design */}
                <div className="flex p-0.5 bg-neutral-100 rounded-lg">
                  <button
                    onClick={() => onChangeScreenSource('live')}
                    className={`flex-1 py-1.5 text-center font-medium rounded-md transition-all ${
                      screenSource === 'live'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Live URL
                  </button>
                  <button
                    onClick={() => onChangeScreenSource('design')}
                    className={`flex-1 py-1.5 text-center font-medium rounded-md transition-all ${
                      screenSource === 'design'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Design / Upload
                  </button>
                </div>

                {screenSource === 'live' ? (
                  <div className="space-y-3">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSubmitLiveUrl(urlInput);
                      }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-medium text-neutral-500">
                        Paste site URL to browse live
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://www.apple.com"
                          className="flex-1 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs outline-none focus:border-neutral-900 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={isConnecting}
                          className="px-3 py-1.5 bg-neutral-900 text-white font-medium text-xs rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                          {isConnecting ? <RefreshCw className="size-3 animate-spin" /> : 'Open'}
                        </button>
                      </div>
                    </form>

                    {/* Presets */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                        Quick Suggestions
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['apple.com', 'stripe.com', 'linear.app'].map((site) => (
                          <button
                            key={site}
                            onClick={() => {
                              const full = `https://${site}`;
                              setUrlInput(full);
                              onChangeLiveUrl(full);
                              onSubmitLiveUrl(full);
                            }}
                            className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors"
                          >
                            {site}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-neutral-500">
                      Upload UI Screenshot (PNG / JPG)
                    </label>
                    <label
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) onUploadDesignImage(file);
                      }}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-xl p-6 cursor-pointer hover:border-neutral-400 hover:bg-neutral-50/50 transition-all"
                    >
                      <Upload className="size-6 text-neutral-400 mb-2" />
                      <span className="text-xs font-medium text-neutral-700">
                        Click or drag image here
                      </span>
                      <span className="text-[11px] text-neutral-400 mt-0.5">
                        Fits end-to-end at native 2x Retina resolution
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onUploadDesignImage(file);
                        }}
                      />
                    </label>

                    {onChangeScreenFit && (
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-600 font-medium">Screen Fit</span>
                        <div className="flex bg-neutral-100 rounded-lg p-0.5">
                          {(
                            [
                              { id: 'fill', label: 'Fill' },
                              { id: 'cover', label: 'Cover' },
                              { id: 'contain', label: 'Contain' },
                            ] as { id: ScreenFitMode; label: string }[]
                          ).map((item) => (
                            <button
                              key={item.id}
                              onClick={() => onChangeScreenFit(item.id)}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                                screenFit === item.id
                                  ? 'bg-white text-neutral-900 shadow-xs'
                                  : 'text-neutral-500 hover:text-neutral-900'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: DEVICE */}
            {activeTab === 'device' && (
              <div className="space-y-4">
                {/* Category Picker */}
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-neutral-100 rounded-lg">
                  {CATEGORIES.map((cat: DeviceCategory) => (
                    <button
                      key={cat.id}
                      onClick={() => setDeviceCategory(cat.id)}
                      className={`py-1 text-xs font-medium rounded-md transition-all ${
                        deviceCategory === cat.id
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Device List */}
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {filteredDevices.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onSelectDevice(d)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                        device.id === d.id
                          ? 'bg-neutral-900 text-white'
                          : 'hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-xs">{d.label}</div>
                        <div className={`text-[11px] ${device.id === d.id ? 'text-neutral-400' : 'text-neutral-400'}`}>
                          {d.width} × {d.height}
                        </div>
                      </div>
                      {device.id === d.id && <Check className="size-4" />}
                    </button>
                  ))}
                </div>

                {/* Orientation & Aperture options */}
                <div className="pt-2 border-t border-neutral-100 space-y-3">
                  {device.kind !== 'laptop' && device.kind !== 'desktop' && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600 font-medium">Orientation</span>
                      <div className="flex bg-neutral-100 rounded-lg p-0.5">
                        <button
                          onClick={() => onChangeOrientation('portrait')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                            orientation === 'portrait' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                          }`}
                        >
                          Portrait
                        </button>
                        <button
                          onClick={() => onChangeOrientation('landscape')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                            orientation === 'landscape' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                          }`}
                        >
                          Landscape
                        </button>
                      </div>
                    </div>
                  )}

                  {isLaptopOrDuo && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-600 font-medium">Lid / Opening Angle</span>
                        <span className="text-neutral-400 font-mono">{Math.round(apertura * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={apertura}
                        onChange={(e) => onChangeApertura(parseFloat(e.target.value))}
                        className="w-full accent-neutral-900"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: FINISH */}
            {activeTab === 'finish' && (
              <div className="space-y-3">
                <span className="text-xs font-medium text-neutral-500">
                  {device.label} Finishes
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {device.finishes.map((f) => {
                    const isSelected = finish.id === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => onSelectFinish(f)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                            : 'border-neutral-200/80 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <span
                          className="size-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: f.color }}
                        />
                        <span className="text-xs font-medium text-neutral-800 truncate">
                          {f.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: BACKGROUND */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                {/* Background Collection Tabs */}
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-neutral-100 rounded-lg">
                  {BACKGROUND_COLLECTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setBgCollection(c.id)}
                      className={`py-1 text-xs font-medium rounded-md transition-all ${
                        bgCollection === c.id
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Swatches Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto p-1">
                  {filteredBackgrounds.map((bg) => {
                    const isSelected = selectedBgId === bg.id && !isTransparentBg;
                    return (
                      <button
                        key={bg.id}
                        title={bg.label}
                        onClick={() => onSelectBg(bg.id)}
                        className={`size-11 rounded-xl border transition-all ${
                          isSelected ? 'ring-2 ring-neutral-900 scale-105' : 'border-neutral-200/70 hover:scale-102'
                        }`}
                        style={{ background: bg.css }}
                      />
                    );
                  })}
                </div>

                {/* Upload Custom Wallpaper / Transparent */}
                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-600 font-medium">Transparent Canvas</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isTransparentBg}
                      onClick={() => onToggleTransparentBg(!isTransparentBg)}
                      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                        isTransparentBg ? 'bg-neutral-900' : 'bg-neutral-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
                          isTransparentBg ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <label className="flex items-center justify-center gap-2 p-2 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors">
                    <Upload className="size-3.5 text-neutral-400" />
                    <span>Upload Custom Wallpaper</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUploadWallpaper(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB: SCENE */}
            {activeTab === 'scene' && (
              <div className="space-y-4">
                {/* Light Intensity Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 font-medium">Studio Light Intensity</span>
                    <span className="text-neutral-400 font-mono">{(lightIntensity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.05"
                    value={lightIntensity}
                    onChange={(e) => onChangeLightIntensity(parseFloat(e.target.value))}
                    className="w-full accent-neutral-900"
                  />
                </div>

                {/* Logo Light Switch */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div>
                    <div className="text-xs font-medium text-neutral-700">Logo light</div>
                    <div className="text-[11px] text-neutral-400">Illuminated Apple logo on rear</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={logoLight}
                    onClick={() => onToggleLogoLight(!logoLight)}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                      logoLight ? 'bg-neutral-900' : 'bg-neutral-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
                        logoLight ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Rotate Switch */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div>
                    <div className="text-xs font-medium text-neutral-700">Auto-rotate</div>
                    <div className="text-[11px] text-neutral-400">Continuous 3D turntable spin</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoRotate}
                    onClick={() => onToggleAutoRotate(!autoRotate)}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                      autoRotate ? 'bg-neutral-900' : 'bg-neutral-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
                        autoRotate ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: CINEMATICS */}
            {activeTab === 'cinematics' && (
              <div className="space-y-3">
                <span className="text-xs font-medium text-neutral-500">
                  Camera Choreography
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: 'pull-back', label: 'Pull back', desc: 'Smooth zoom-out from screen to hero' },
                    { id: 'push-in', label: 'Push in', desc: 'Dynamic camera zoom directly into display' },
                    { id: 'orbit', label: 'Orbit', desc: '360° sweeping rotation around 3D device' },
                    { id: 'reveal', label: 'Reveal', desc: 'Graceful tilt-up from top view to horizon' },
                    { id: 'settle', label: 'Settle', desc: 'Gentle deceleration into studio perspective' },
                  ].map((shot) => (
                    <button
                      key={shot.id}
                      onClick={() => onTriggerCinematic(shot.id as CinematicShot)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-neutral-800 group-hover:text-neutral-950">
                          {shot.label}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {shot.desc}
                        </div>
                      </div>
                      <Sparkles className="size-4 text-neutral-300 group-hover:text-neutral-800 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: EXPORT */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <span className="text-xs font-medium text-neutral-500">
                  Export Studio Quality PNG
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'standard', label: 'Standard', desc: 'Full canvas viewport' },
                    { id: 'transparent', label: 'Transparent', desc: 'No background PNG' },
                    { id: 'square', label: 'Square 1:1', desc: 'Instagram / Feed' },
                    { id: 'story', label: 'Story 9:16', desc: 'TikTok / Reel' },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      disabled={isExporting}
                      onClick={() => onExport(exp.id as ExportMode)}
                      className="flex flex-col p-3 rounded-xl border border-neutral-200/80 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all"
                    >
                      <span className="text-xs font-semibold text-neutral-800">
                        {exp.label}
                      </span>
                      <span className="text-[11px] text-neutral-400 mt-0.5">
                        {exp.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
