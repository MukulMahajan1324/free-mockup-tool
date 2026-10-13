export interface PresetSite {
  url: string;
  title: string;
  domain: string;
  badge: string;
  primaryColor: string;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    cta: string;
    features: { title: string; desc: string }[];
  };
}

export const PRESET_SITES: Record<string, PresetSite> = {
  'apple.com': {
    url: 'https://www.apple.com',
    title: 'Apple',
    domain: 'apple.com',
    badge: 'iPhone 16 Pro',
    primaryColor: '#0071e3',
    content: {
      heroTitle: 'iPhone 16 Pro',
      heroSubtitle: 'Hello, Apple Intelligence. Built for generative creativity and speed.',
      cta: 'Learn more',
      features: [
        { title: 'A18 Pro Chip', desc: 'Industry-leading efficiency and 6-core GPU with hardware ray tracing.' },
        { title: 'Camera Control', desc: 'Instant access to optical zoom, exposure, and depth of field.' },
        { title: 'Grade 5 Titanium', desc: 'Remarkably strong yet lighter with the thinnest borders ever.' },
      ],
    },
  },
  'stripe.com': {
    url: 'https://stripe.com',
    title: 'Stripe',
    domain: 'stripe.com',
    badge: 'Financial Infrastructure',
    primaryColor: '#635bff',
    content: {
      heroTitle: 'Financial infrastructure for the internet',
      heroSubtitle: 'Millions of companies of all sizes use Stripe to accept payments and manage businesses online.',
      cta: 'Start now',
      features: [
        { title: 'Global Payments', desc: 'Accept 135+ currencies and local payment methods with dynamic routing.' },
        { title: 'Billing & Subscriptions', desc: 'Automate usage-based billing, tax calculation, and invoicing.' },
        { title: 'Radar Fraud AI', desc: 'Machine learning trained on billions of charges blocks fraud in real time.' },
      ],
    },
  },
  'linear.app': {
    url: 'https://linear.app',
    title: 'Linear',
    domain: 'linear.app',
    badge: 'Issue Tracking',
    primaryColor: '#5e6ad2',
    content: {
      heroTitle: 'Linear is a better way to build software',
      heroSubtitle: 'Meet the system for modern software development. Streamline issues, projects, and product roadmaps.',
      cta: 'Get started',
      features: [
        { title: 'Built for speed', desc: 'Sub-50ms interactions, sync engine, and full offline support.' },
        { title: 'Engineered workflows', desc: 'Cycle analytics, automated triage, and bi-directional GitHub sync.' },
        { title: 'Insights & Initiatives', desc: 'Connect project roadmaps with executive-level progress reporting.' },
      ],
    },
  },
};

export function renderMockWebpage(
  canvas: HTMLCanvasElement,
  url: string,
  width: number,
  height: number,
  scrollY: number = 0
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clean domain name
  let cleanDomain = 'apple.com';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    cleanDomain = parsed.hostname.replace('www.', '');
  } catch {
    cleanDomain = 'apple.com';
  }

  const preset = PRESET_SITES[cleanDomain] || {
    url: url,
    title: cleanDomain.toUpperCase(),
    domain: cleanDomain,
    badge: 'Web Application',
    primaryColor: '#2563eb',
    content: {
      heroTitle: cleanDomain.toUpperCase(),
      heroSubtitle: `Live browsing preview for ${url}. High-fidelity 3D device simulation.`,
      cta: 'Explore site',
      features: [
        { title: 'High Performance', desc: '60 FPS WebGL rendering with real-time anisotropic filtering.' },
        { title: 'Responsive Viewport', desc: `Rendered at native resolution ${width}x${height} with full pixel ratio.` },
        { title: 'Interactive Surface', desc: 'Direct interaction with custom textures, shadows, and camera paths.' },
      ],
    },
  };

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(0, -scrollY);

  // Top Webpage Nav Bar
  const navH = Math.max(54, Math.round(height * 0.065));
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, navH);

  // Subtle bottom border on nav
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, navH);
  ctx.lineTo(width, navH);
  ctx.stroke();

  // Brand Name
  ctx.fillStyle = '#111827';
  ctx.font = `bold ${Math.round(navH * 0.36)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(preset.title, 24, navH / 2);

  // Nav Links
  ctx.font = `500 ${Math.round(navH * 0.26)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillStyle = '#4b5563';
  const navItems = ['Products', 'Solutions', 'Developers', 'Pricing'];
  let navX = width > 600 ? 160 : width - 100;
  if (width > 600) {
    for (const item of navItems) {
      ctx.fillText(item, navX, navH / 2);
      navX += 90;
    }
  }

  // Hero Section
  const heroTop = navH + 40;

  // Badge pill
  const badgeH = 28;
  const badgeW = 180;
  ctx.fillStyle = `${preset.primaryColor}15`;
  roundRect(ctx, width / 2 - badgeW / 2, heroTop, badgeW, badgeH, 14);
  ctx.fill();
  ctx.fillStyle = preset.primaryColor;
  ctx.font = '600 13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(preset.badge, width / 2, heroTop + badgeH / 2);

  // Main Hero Title
  ctx.fillStyle = '#0f172a';
  const titleSize = Math.max(28, Math.round(width * 0.055));
  ctx.font = `800 ${titleSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(preset.content.heroTitle, width / 2, heroTop + 85);

  // Hero Subtitle (multiline wrap)
  ctx.fillStyle = '#475569';
  const subSize = Math.max(14, Math.round(width * 0.024));
  ctx.font = `400 ${subSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  wrapText(ctx, preset.content.heroSubtitle, width / 2, heroTop + 135, width * 0.8, subSize * 1.5);

  // CTA Button
  const btnW = 160;
  const btnH = 44;
  const btnY = heroTop + 200;
  ctx.fillStyle = preset.primaryColor;
  roundRect(ctx, width / 2 - btnW / 2, btnY, btnW, btnH, 10);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 15px -apple-system, sans-serif';
  ctx.fillText(preset.content.cta, width / 2, btnY + btnH / 2);

  // Feature Cards
  const cardsY = btnY + 80;
  const cardW = width > 700 ? (width - 80) / 3 : width - 48;
  const cardH = 150;

  preset.content.features.forEach((feat, idx) => {
    const cardX = width > 700 ? 24 + idx * (cardW + 16) : 24;
    const cardCurrentY = width > 700 ? cardsY : cardsY + idx * (cardH + 16);

    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    roundRect(ctx, cardX, cardCurrentY, cardW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    // Feature title
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.font = '700 16px -apple-system, sans-serif';
    ctx.fillText(feat.title, cardX + 18, cardCurrentY + 34);

    // Feature desc
    ctx.fillStyle = '#64748b';
    ctx.font = '400 13px -apple-system, sans-serif';
    wrapText(ctx, feat.desc, cardX + 18, cardCurrentY + 65, cardW - 36, 18);
  });

  ctx.restore();
}

function roundRect(
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

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
