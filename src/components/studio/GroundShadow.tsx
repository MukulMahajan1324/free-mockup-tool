import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function GroundShadow({
  y,
  strength,
  width,
}: {
  y: number;
  strength: number;
  width: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    if (!ctx) return tex;

    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
    grad.addColorStop(0, 'rgba(0,0,0,0.5)');
    grad.addColorStop(0.32, 'rgba(0,0,0,0.2)');
    grad.addColorStop(0.68, 'rgba(0,0,0,0.05)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0.05]}>
      <planeGeometry args={[Math.max(3.2, width), 1.55]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        opacity={Math.min(Math.max(strength, 0), 1)}
        toneMapped={false}
      />
    </mesh>
  );
}
