# Free Mockup Tool

A high-fidelity 3D interactive device mockup studio. Open any site on a 3D device and browse it live, or upload your own mobile and desktop UI screenshots with end-to-end display fitting.

Built with **React**, **Three.js**, **@react-three/fiber**, **@react-three/drei**, **Tailwind CSS**, and **WebSocket screencasting**.

---

## ✨ Features

### 1. 📱 16 Procedural 3D Device Models
- **Mobile**:
  - iPhone 14 (with Notch cutout, Midnight, Purple, Starlight, Red, Blue, Yellow finishes)
  - iPhone 15 (with Dynamic Island, Black, Blue, Green, Yellow, Pink finishes)
  - iPhone 16 (with Dynamic Island, Black, White, Pink, Teal, Ultramarine finishes)
  - iPhone 16 Pro (with Black, White, Natural, and Desert Titanium finishes)
  - iPhone Duo (Foldable dual-screen book-style device with live dual displays)
- **Tablet**:
  - iPad Pro 13" & 11" (Silver, Space Black)
  - iPad Air 13" & 11" (Blue, Purple, Starlight, Space Gray)
  - iPad (Silver, Blue, Pink, Yellow)
  - iPad mini (Blue, Purple, Starlight, Space Gray)
- **Laptop**:
  - MacBook Air 13" & 15" (Sky Blue, Silver, Starlight, Midnight)
  - MacBook Pro 14" & 16" (Space Black, Silver)
  - *Dynamic lid opening angle control (`apertura` slider: 0° to 112°)*
- **Desktop**:
  - iMac 24" (Blue, Green, Pink, Silver, Yellow, Orange, Purple)

### 2. 🌐 Dual Screen Sources
- **Live URL**:
  - Browse websites live directly on the 3D device!
  - Real-time WebSocket connection to `/api/live` streaming screencast frames.
  - Interactive fallback web simulation with pre-configured high-res presets (Apple, Stripe, Linear).
  - Raycaster click & scroll interaction directly from 3D device screen.
- **Design / Upload**:
  - Drag and drop or upload your own PNG/JPG mobile and desktop UI screenshots.
  - Pixel-perfect mapping with native aspect ratios and device bezels.

### 3. 🎨 Backgrounds & Wallpapers
- **Solid**: Studio White (`#ffffff`), Mist (`#e8e8e8`), Deep Black (`#111111`).
- **Curated Gradient Presets**:
  - **Kiln**: 30 Vibrant Vista gradient compositions.
  - **Laurel**: 30 Green Glory radiant gradients.
  - **Velvet**: 30 Deep Dusk twilight/aurora gradients.
- **Custom Wallpaper**: Upload your own image for the backdrop.
- **Transparent Canvas**: Toggle transparent background for transparent PNG exports.

### 4. 💡 Studio Lighting & Cinematics
- **Studio Lights**: Multi-point directional, hemisphere, and ambient lighting with an intensity slider (0.2x – 1.5x).
- **Illuminated Apple Logo**: Toggle glowing Apple logo on the rear casing.
- **Auto-rotate Turntable**: Smooth continuous 3D turntable spin.
- **Cinematic Camera Choreography**:
  - `Pull back`: Camera pulls back smoothly from screen to hero angle.
  - `Push in`: Dynamic zoom directly towards the display.
  - `Orbit`: 360° rotation around the 3D device.
  - `Reveal`: Graceful upward tilt from overhead to horizon.
  - `Settle`: Gentle deceleration into standard studio view.

### 5. 📸 Export Studio
- High-resolution PNG image exporter:
  - **Standard**: Full canvas resolution.
  - **Transparent**: Device isolated on transparent background.
  - **Square (1:1)**: Optimized for Instagram and social media feeds.
  - **Story (9:16)**: Formatted for TikTok, Reels, and mobile stories.

---

## 🚀 Getting Started

### 1. Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Production Build & Server
```bash
npm run build
npm start
```
Starts the full-stack server on [http://localhost:3000](http://localhost:3000) with static asset hosting and WebSocket proxy.

---

## 📁 Project Structure

```
livemockup-replica/
├── public/
│   ├── icons/
│   │   ├── positivo.svg      # Live Mockup M brand icon (dark)
│   │   └── negativo.svg      # Live Mockup M brand icon (light)
│   ├── apple-logo.png        # Apple logo texture for rear casing
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── studio/
│   │   │   ├── StudioCanvas.tsx       # Main 3D Canvas stage & lights
│   │   │   ├── PhoneTabletMesh.tsx    # iPhone & iPad 3D models
│   │   │   ├── LaptopMesh.tsx         # MacBook 3D models with opening lid
│   │   │   ├── DesktopMesh.tsx        # iMac 24" 3D model
│   │   │   ├── DuoMesh.tsx            # Foldable iPhone Duo dual-screen 3D model
│   │   │   ├── CameraAndDetails.tsx   # Lenses, flash, LiDAR, Apple logo & buttons
│   │   │   ├── GroundShadow.tsx       # Soft radial ground contact shadow
│   │   │   ├── CinematicController.tsx# Camera choreography animator
│   │   │   └── geometries.ts          # Procedural 3D rounded extrusion math
│   │   └── ui/
│   │       ├── BrandPill.tsx          # Top-left expandable brand badge
│   │       └── Shell.tsx              # Control panel (Expanded / Rail / Icon)
│   ├── data/
│   │   ├── devices.ts                 # 16 devices and finish specs
│   │   └── backgrounds.ts             # 93 background gradient presets
│   ├── utils/
│   │   ├── screenTexture.ts           # Dynamic screen canvas texture & status bar
│   │   ├── mockBrowser.ts             # Interactive fallback web simulation
│   │   └── useLiveWebSocket.ts        # WebSocket client hook for /api/live
│   ├── types.ts                       # TypeScript definitions
│   ├── App.tsx                        # Root application orchestrator
│   └── main.tsx                       # Entry point
├── server.js                          # Express & WebSocket proxy server
├── vite.config.ts                     # Vite + Tailwind v4 configuration
└── package.json
```
