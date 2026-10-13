import { DeviceDefinition, DeviceCategory } from '../types';

export const DEVICES: DeviceDefinition[] = [
  {
    "id": "iphone-14",
    "label": "iPhone 14",
    "width": 390,
    "height": 844,
    "cutout": "notch",
    "finishes": [
      {
        "id": "medianoche",
        "label": "Midnight",
        "color": "#1c1d21",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "purpura",
        "label": "Purple",
        "color": "#5c4e72",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "blanco-estelar",
        "label": "Starlight",
        "color": "#f1ece3",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "red",
        "label": "Red",
        "color": "#c4122f",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "azul",
        "label": "Blue",
        "color": "#2f6d94",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "amarillo",
        "label": "Yellow",
        "color": "#f0d56a",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "phone",
    "topInset": 47,
    "bottomInset": 34,
    "camera": "none",
    "rear": "iphone-14",
    "buttons": "switch"
  },
  {
    "id": "iphone-15",
    "label": "iPhone 15",
    "width": 393,
    "height": 852,
    "cutout": "island",
    "finishes": [
      {
        "id": "negro",
        "label": "Black",
        "color": "#2a2a2e",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "azul",
        "label": "Blue",
        "color": "#c5d4e4",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "verde",
        "label": "Green",
        "color": "#d4e3c6",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "amarillo",
        "label": "Yellow",
        "color": "#f3e4bc",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "rosa",
        "label": "Pink",
        "color": "#f3d2d6",
        "metalness": 0.32,
        "roughness": 0.46
      }
    ],
    "kind": "phone",
    "topInset": 59,
    "bottomInset": 34,
    "camera": "none",
    "rear": "iphone-15",
    "buttons": "switch"
  },
  {
    "id": "iphone-16",
    "label": "iPhone 16",
    "width": 393,
    "height": 852,
    "cutout": "island",
    "finishes": [
      {
        "id": "negro",
        "label": "Black",
        "color": "#3a3a3c",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "blanco",
        "label": "White",
        "color": "#f4f4f6",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "rosa",
        "label": "Pink",
        "color": "#f2b7c4",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "verde-azulado",
        "label": "Teal",
        "color": "#62b8ae",
        "metalness": 0.32,
        "roughness": 0.46
      },
      {
        "id": "ultramarino",
        "label": "Ultramarine",
        "color": "#3a4fd0",
        "metalness": 0.32,
        "roughness": 0.46
      }
    ],
    "kind": "phone",
    "topInset": 59,
    "bottomInset": 34,
    "camera": "none",
    "rear": "iphone-16",
    "buttons": "action"
  },
  {
    "id": "iphone-16-pro",
    "label": "iPhone 16 Pro",
    "width": 402,
    "height": 874,
    "cutout": "island",
    "finishes": [
      {
        "id": "titanio-negro",
        "label": "Black titanium",
        "color": "#3a3a3c",
        "metalness": 0.74,
        "roughness": 0.32
      },
      {
        "id": "titanio-blanco",
        "label": "White titanium",
        "color": "#f1f0ec",
        "metalness": 0.74,
        "roughness": 0.32
      },
      {
        "id": "titanio-natural",
        "label": "Natural titanium",
        "color": "#c4bbae",
        "metalness": 0.74,
        "roughness": 0.32
      },
      {
        "id": "titanio-desierto",
        "label": "Desert titanium",
        "color": "#c4a27a",
        "metalness": 0.74,
        "roughness": 0.32
      }
    ],
    "kind": "phone",
    "topInset": 59,
    "bottomInset": 34,
    "camera": "none",
    "rear": "iphone-16-pro",
    "buttons": "action"
  },
  {
    "id": "iphone-duo",
    "label": "iPhone Duo",
    "width": 466,
    "height": 678,
    "cutout": "island",
    "finishes": [
      {
        "id": "cielo-nocturno",
        "label": "Night sky",
        "color": "#1a2433",
        "metalness": 0.72,
        "roughness": 0.34
      },
      {
        "id": "blanco-estelar",
        "label": "Star white",
        "color": "#f3efe4",
        "metalness": 0.46,
        "roughness": 0.4
      }
    ],
    "kind": "duo",
    "topInset": 59,
    "bottomInset": 34,
    "camera": "none",
    "rear": "iphone-duo",
    "buttons": "duo"
  },
  {
    "id": "ipad-pro-13",
    "label": "iPad Pro 13\"",
    "width": 1032,
    "height": 1376,
    "cutout": "none",
    "finishes": [
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e4e5e8",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "negro-espacial",
        "label": "Space black",
        "color": "#1c1c1e",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "tablet",
    "topInset": 24,
    "bottomInset": 20,
    "camera": "right",
    "rear": "ipad-pro",
    "buttons": "ipad"
  },
  {
    "id": "ipad-pro-11",
    "label": "iPad Pro 11\"",
    "width": 834,
    "height": 1210,
    "cutout": "none",
    "finishes": [
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e4e5e8",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "negro-espacial",
        "label": "Space black",
        "color": "#1c1c1e",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "tablet",
    "topInset": 24,
    "bottomInset": 20,
    "camera": "right",
    "rear": "ipad-pro",
    "buttons": "ipad"
  },
  {
    "id": "ipad-air-13",
    "label": "iPad Air 13\"",
    "width": 1024,
    "height": 1366,
    "cutout": "none",
    "finishes": [
      {
        "id": "azul",
        "label": "Blue",
        "color": "#6e93b8",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "purpura",
        "label": "Purple",
        "color": "#a394c2",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "blanco-estelar",
        "label": "Starlight",
        "color": "#f1ece3",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "gris-espacial",
        "label": "Space gray",
        "color": "#7a7c80",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "tablet",
    "topInset": 24,
    "bottomInset": 20,
    "camera": "right",
    "rear": "ipad-air",
    "buttons": "ipad"
  },
  {
    "id": "ipad-air-11",
    "label": "iPad Air 11\"",
    "width": 820,
    "height": 1180,
    "cutout": "none",
    "finishes": [
      {
        "id": "azul",
        "label": "Blue",
        "color": "#6e93b8",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "purpura",
        "label": "Purple",
        "color": "#a394c2",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "blanco-estelar",
        "label": "Starlight",
        "color": "#f1ece3",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "gris-espacial",
        "label": "Space gray",
        "color": "#7a7c80",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "tablet",
    "topInset": 24,
    "bottomInset": 20,
    "camera": "right",
    "rear": "ipad-air",
    "buttons": "ipad"
  },
  {
    "id": "ipad",
    "label": "iPad",
    "width": 820,
    "height": 1180,
    "cutout": "none",
    "finishes": [
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e6e7ea",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "azul",
        "label": "Blue",
        "color": "#2f78c4",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "rosa",
        "label": "Pink",
        "color": "#f0a8b8",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "amarillo",
        "label": "Yellow",
        "color": "#f2d15a",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "tablet",
    "topInset": 24,
    "bottomInset": 20,
    "camera": "right",
    "rear": "ipad",
    "buttons": "ipad"
  },
  {
    "id": "ipad-mini",
    "label": "iPad mini",
    "width": 744,
    "height": 1133,
    "cutout": "none",
    "finishes": [
      {
        "id": "azul",
        "label": "Blue",
        "color": "#7f9bb5",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "purpura",
        "label": "Purple",
        "color": "#9a8cb4",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "blanco-estelar",
        "label": "Starlight",
        "color": "#f0ebe2",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "gris-espacial",
        "label": "Space gray",
        "color": "#6e7074",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "tablet",
    "topInset": 24,
    "bottomInset": 20,
    "camera": "top",
    "rear": "ipad-mini",
    "buttons": "mini"
  },
  {
    "id": "macbook-air-13",
    "label": "MacBook Air 13\"",
    "width": 1280,
    "height": 832,
    "cutout": "notch",
    "finishes": [
      {
        "id": "azul-cielo",
        "label": "Sky blue",
        "color": "#9ec4d6",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e3e4e6",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "blanco-estelar",
        "label": "Starlight",
        "color": "#f0ebe4",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "medianoche",
        "label": "Midnight",
        "color": "#2c2e33",
        "metalness": 0.55,
        "roughness": 0.34
      }
    ],
    "kind": "laptop",
    "topInset": 37,
    "bottomInset": 0,
    "camera": "top",
    "rear": "none",
    "buttons": "none"
  },
  {
    "id": "macbook-air-15",
    "label": "MacBook Air 15\"",
    "width": 1440,
    "height": 932,
    "cutout": "notch",
    "finishes": [
      {
        "id": "azul-cielo",
        "label": "Sky blue",
        "color": "#9ec4d6",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e3e4e6",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "blanco-estelar",
        "label": "Starlight",
        "color": "#f0ebe4",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "medianoche",
        "label": "Midnight",
        "color": "#2c2e33",
        "metalness": 0.55,
        "roughness": 0.34
      }
    ],
    "kind": "laptop",
    "topInset": 37,
    "bottomInset": 0,
    "camera": "top",
    "rear": "none",
    "buttons": "none"
  },
  {
    "id": "macbook-pro-14",
    "label": "MacBook Pro 14\"",
    "width": 1512,
    "height": 982,
    "cutout": "notch",
    "finishes": [
      {
        "id": "negro-espacial",
        "label": "Space black",
        "color": "#2a2b2e",
        "metalness": 0.58,
        "roughness": 0.32
      },
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e4e5e8",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "laptop",
    "topInset": 37,
    "bottomInset": 0,
    "camera": "top",
    "rear": "none",
    "buttons": "none"
  },
  {
    "id": "macbook-pro-16",
    "label": "MacBook Pro 16\"",
    "width": 1728,
    "height": 1117,
    "cutout": "notch",
    "finishes": [
      {
        "id": "negro-espacial",
        "label": "Space black",
        "color": "#2a2b2e",
        "metalness": 0.58,
        "roughness": 0.32
      },
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e4e5e8",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "laptop",
    "topInset": 37,
    "bottomInset": 0,
    "camera": "top",
    "rear": "none",
    "buttons": "none"
  },
  {
    "id": "imac-24",
    "label": "iMac 24\"",
    "width": 2240,
    "height": 1260,
    "cutout": "none",
    "finishes": [
      {
        "id": "azul",
        "label": "Blue",
        "color": "#5b92c9",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "verde",
        "label": "Green",
        "color": "#8eae7a",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "rosa",
        "label": "Pink",
        "color": "#f0b3c2",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "plata",
        "label": "Silver",
        "color": "#e3e4e6",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "amarillo",
        "label": "Yellow",
        "color": "#f3d56a",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "naranja",
        "label": "Orange",
        "color": "#f0a05a",
        "metalness": 0.5,
        "roughness": 0.38
      },
      {
        "id": "purpura",
        "label": "Purple",
        "color": "#a98bc4",
        "metalness": 0.5,
        "roughness": 0.38
      }
    ],
    "kind": "desktop",
    "topInset": 24,
    "bottomInset": 0,
    "camera": "top",
    "rear": "none",
    "buttons": "none"
  }
];

export const CATEGORIES: DeviceCategory[] = [
  { id: 'mobile', label: 'Mobile', defaultId: 'iphone-16' },
  { id: 'tablet', label: 'Tablet', defaultId: 'ipad-pro-13' },
  { id: 'laptop', label: 'Laptop', defaultId: 'macbook-pro-14' },
  { id: 'desktop', label: 'Desktop', defaultId: 'imac-24' },
];

export function getDeviceById(id: string): DeviceDefinition {
  return DEVICES.find(d => d.id === id) || DEVICES[0];
}

export function getCategoryForDevice(device: DeviceDefinition): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
  if (device.kind === 'tablet') return 'tablet';
  if (device.kind === 'laptop') return 'laptop';
  if (device.kind === 'desktop') return 'desktop';
  return 'mobile';
}

export function calculateEffectiveScreenSize(
  device: DeviceDefinition,
  apertura: number = 0,
  orientation: 'portrait' | 'landscape' = 'portrait'
) {
  const isDuo = device.id === 'iphone-duo';
  const isFoldOpen = apertura > 0.48;
  const baseWidth = isDuo ? (isFoldOpen ? 890 : 466) : device.width;
  const baseHeight = isDuo ? (isFoldOpen ? 626 : 678) : device.height;

  if (orientation !== 'landscape') {
    return {
      width: baseWidth,
      height: Math.max(1, baseHeight - device.topInset - device.bottomInset),
    };
  } else {
    const topInset = device.cutout === 'none' ? 0 : device.topInset;
    const sideInset = device.kind === 'tablet' ? device.topInset : 32 * (device.kind === 'phone' || device.kind === 'duo' ? 1 : 0);
    return {
      width: Math.max(1, baseHeight - topInset - device.bottomInset),
      height: Math.max(1, baseWidth - sideInset),
    };
  }
}
