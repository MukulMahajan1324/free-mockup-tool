import { useEffect, useRef, useState, useCallback } from 'react';
import { ScreenStatus, DeviceDefinition, DeviceOrientation, LiveInputEvent } from '../types';
import { calculateEffectiveScreenSize } from '../data/devices';

export function useLiveWebSocket(
  device: DeviceDefinition,
  apertura: number,
  orientation: DeviceOrientation,
  liveUrl: string,
  isEnabled: boolean
) {
  const [status, setStatus] = useState<ScreenStatus>({ status: 'empty', message: '' });
  const [frame, setFrame] = useState<ImageBitmap | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const activeUrl = useRef<string>(liveUrl);
  const activeDims = useRef<string>('');

  const dims = calculateEffectiveScreenSize(device, apertura, orientation);
  const dimKey = `${dims.width}x${dims.height}`;

  // Close helper
  const closeSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Open socket connection
  const connect = useCallback((targetUrl: string, w: number, h: number) => {
    closeSocket();
    setStatus({ status: 'loading', message: 'Opening…' });

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live`;

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
    } catch {
      setStatus({ status: 'ready', message: 'Simulation Mode' });
      return;
    }

    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      if (wsRef.current !== ws) return;
      activeUrl.current = targetUrl;
      activeDims.current = `${w}x${h}`;
      ws.send(JSON.stringify({ type: 'open', url: targetUrl, width: w, height: h }));
      if (document.hidden) {
        ws.send(JSON.stringify({ type: 'pause' }));
      }
    };

    ws.onmessage = async (event) => {
      if (wsRef.current !== ws) return;

      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'error') {
            setStatus({ status: 'error', message: msg.message });
          } else if (msg.type === 'idle') {
            setStatus({ status: 'error', message: 'The session closed after inactivity' });
          } else if (msg.type === 'status' && msg.state === 'loading') {
            setStatus({ status: 'loading', message: 'Opening…' });
          }
        } catch {
          // ignore
        }
        return;
      }

      // Binary JPEG frame
      if (!document.hidden && event.data instanceof ArrayBuffer) {
        try {
          const blob = new Blob([event.data], { type: 'image/jpeg' });
          const bmp = await createImageBitmap(blob);
          if (bmp.width > 0 && bmp.height > 0) {
            setFrame((old) => {
              if (old && old !== bmp) old.close();
              return bmp;
            });
            setStatus({ status: 'ready', message: '' });
          }
        } catch {
          // Frame decode error
        }
      }
    };

    ws.onerror = () => {
      // If backend live proxy is not running or network fails, fall back to interactive mock browser
      setStatus({ status: 'ready', message: 'Simulation Active' });
    };

    ws.onclose = () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };
  }, [closeSocket]);

  // Handle URL or initial connection
  useEffect(() => {
    if (!isEnabled) {
      closeSocket();
      return;
    }
    connect(liveUrl, dims.width, dims.height);

    return () => {
      closeSocket();
    };
  }, [isEnabled, liveUrl, connect, dims.width, dims.height, closeSocket]);

  // Handle Resize message
  useEffect(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && activeUrl.current) {
      if (activeDims.current !== dimKey) {
        activeDims.current = dimKey;
        ws.send(JSON.stringify({ type: 'resize', width: dims.width, height: dims.height }));
      }
    }
  }, [dimKey, dims.width, dims.height]);

  // Keep-alive ping
  useEffect(() => {
    const timer = setInterval(() => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  // Send input (mouse click, scroll, etc.)
  const sendInput = useCallback((input: LiveInputEvent) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && activeUrl.current) {
      ws.send(JSON.stringify({ type: 'input', ...input }));
    }
  }, []);

  return {
    status,
    frame,
    sendInput,
    reconnect: () => connect(liveUrl, dims.width, dims.height),
  };
}
