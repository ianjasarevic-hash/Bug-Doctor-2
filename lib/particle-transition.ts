// Particle burst that plays while the browser smooth-scrolls to a
// page section.
//
// On click of an element with `data-particle-target="#section-id"`,
// we spawn a burst of glowing particles at the button's center.
// Each particle gets a velocity in the general direction of the
// target (with a random spread), a random lifespan (~1s, roughly
// matching the smooth-scroll duration), a small gravity pull, and
// fades out as it ages. The browser handles the actual scrolling
// via the `html { scroll-behavior: smooth }` rule in globals.css
// — this module only adds the visual layer on top.
//
// Why a canvas, not DOM nodes?
// ────────────────────────────
// 30–60 particles per click × multiple clicks in flight = hundreds
// of elements. A canvas keeps the layout/paint cost flat regardless
// of how many particles are alive. DPR-aware so the particles stay
// crisp on retina displays.
//
// Why a single persistent canvas, not one per burst?
// ──────────────────────────────────────────────────
// Re-using one canvas avoids DOM thrash on every click. The
// animation loop only runs while particles are alive; when the
// last particle dies, the rAF loop is cancelled and the canvas
// idles (fully transparent) until the next burst.
//
// Why not use the existing section-focus vacuum on top of this?
// ──────────────────────────────────────────────────────────────
// The vacuum scales the entire page wrapper. The particle canvas
// is a separate fixed-position layer — they don't conflict, and
// stacking them is fine (vacuum is subtle, particles are the
// star). If you want to disable the vacuum on particle-target
// buttons, the `data-particle-target` selector is the hook.

"use client";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // ms remaining
  maxLife: number; // ms at spawn
  size: number; // base radius in px
  hue: number; // 190–220 = blue/cyan range, matches the site accent
  glow: number; // shadowBlur amount
};

export type BurstOptions = {
  count?: number;
  spread?: number; // radians of angular spread around the aim direction
  life?: number; // ms, base lifespan (each particle gets ±40% jitter)
  speed?: number; // px/s, base speed (each particle gets 50–130% jitter)
  gravity?: number; // px/s² downward
  shockwave?: boolean; // emit an expanding ring at the burst point
};

const DEFAULTS = {
  count: 55,
  spread: Math.PI / 2.4, // ~75° total cone — wide enough to feel like a burst, narrow enough to read as directional
  life: 1000,
  speed: 700,
  gravity: 180,
  shockwave: true,
};

// Module-level state. A single canvas + a single rAF loop, shared
// across all bursts.
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let cssW = 0;
let cssH = 0;
let dpr = 1;
let particles: Particle[] = [];
let shockwaves: { x: number; y: number; r: number; life: number; maxLife: number }[] = [];
let rafId: number | null = null;
let lastFrame = 0;
let installed = false;
let resizeHandler: (() => void) | null = null;
let visibilityHandler: (() => void) | null = null;

function ensureCanvas(): void {
  if (canvas || typeof document === "undefined") return;

  canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  canvas.setAttribute("aria-hidden", "true");
  // pointer-events: none so the canvas never swallows clicks. z-50
  // keeps it above page content but below any modal/dialog.
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50;";
  document.body.appendChild(canvas);

  const c = canvas.getContext("2d");
  if (!c) return;
  ctx = c;

  resizeHandler = resize;
  visibilityHandler = () => {
    // When the tab is hidden, the rAF loop pauses anyway. When it
    // comes back, reset lastFrame so we don't apply a huge dt and
    // teleport every particle across the screen.
    lastFrame = performance.now();
  };
  window.addEventListener("resize", resizeHandler);
  document.addEventListener("visibilitychange", visibilityHandler);

  resize();
}

function resize(): void {
  if (!canvas || !ctx) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2 — 3+ is overkill for dots
  cssW = window.innerWidth;
  cssH = window.innerHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  // Reset transform then scale for DPR. The scale persists across
  // frames — every draw call is in CSS pixels.
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawn(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  options: BurstOptions = {},
): void {
  if (typeof window === "undefined") return;
  ensureCanvas();
  if (!ctx) return;

  const opts = { ...DEFAULTS, ...options };
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.hypot(dx, dy) || 1;
  const aim = Math.atan2(dy, dx);

  for (let i = 0; i < opts.count; i++) {
    // Cone of directions around the aim angle.
    const angle = aim + (Math.random() - 0.5) * opts.spread;
    // Speed jitter: 50–130% of base. Faster particles overshoot
    // the target line; slower ones fall short. Together they
    // form a spray rather than a single beam.
    const spd = opts.speed * (0.5 + Math.random() * 0.8);
    const maxLife = opts.life * (0.6 + Math.random() * 0.8);
    particles.push({
      x: fromX,
      y: fromY,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: maxLife,
      maxLife,
      size: 1.2 + Math.random() * 2.4,
      // Hue jitter inside the brand blue/cyan band (190–225°).
      hue: 190 + Math.random() * 35,
      glow: 6 + Math.random() * 10,
    });
  }

  if (opts.shockwave) {
    shockwaves.push({
      x: fromX,
      y: fromY,
      r: 0,
      life: 450,
      maxLife: 450,
    });
  }

  if (rafId === null) {
    lastFrame = performance.now();
    rafId = requestAnimationFrame(loop);
  }
}

function loop(now: number): void {
  if (!ctx) return;

  const dt = Math.min((now - lastFrame) / 1000, 0.05); // cap dt at 50ms (tab-switch guard)
  lastFrame = now;

  ctx.clearRect(0, 0, cssW, cssH);

  // ── Particles ───────────────────────────────────────────────
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt * 1000;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    // Mild gravity so the burst settles rather than flying in a
    // perfectly straight line. Light enough that it doesn't fight
    // the directional intent.
    p.vy += DEFAULTS.gravity * dt;

    const lifeRatio = p.life / p.maxLife; // 1 → 0
    const alpha = lifeRatio * lifeRatio; // squared falloff = snappy fade
    const size = p.size * (0.4 + lifeRatio * 0.6);

    ctx.save();
    ctx.globalCompositeOperation = "lighter"; // additive — overlapping particles brighten
    ctx.shadowColor = `hsla(${p.hue}, 95%, 70%, ${alpha})`;
    ctx.shadowBlur = p.glow * lifeRatio;
    ctx.fillStyle = `hsla(${p.hue}, 95%, 75%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Shockwave rings ─────────────────────────────────────────
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const s = shockwaves[i];
    s.life -= dt * 1000;
    if (s.life <= 0) {
      shockwaves.splice(i, 1);
      continue;
    }
    const t = 1 - s.life / s.maxLife; // 0 → 1
    s.r = 8 + t * 120;
    const alpha = (1 - t) * 0.5;
    ctx.save();
    ctx.strokeStyle = `hsla(205, 95%, 70%, ${alpha})`;
    ctx.lineWidth = 2 * (1 - t * 0.5);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (particles.length > 0 || shockwaves.length > 0) {
    rafId = requestAnimationFrame(loop);
  } else {
    rafId = null;
    // Final clear so the last frame doesn't leave a ghost.
    ctx.clearRect(0, 0, cssW, cssH);
  }
}

/**
 * Spawn a particle burst at `fromEl` aimed at the element matched
 * by `toSelector`. Safe to call when the target doesn't exist
 * (warns and returns). Coordinates are read at call time — the
 * target is the section as it sits right now, before any scroll.
 */
export function spawnParticleBurst(
  fromEl: HTMLElement,
  toSelector: string,
  options?: BurstOptions,
): void {
  const target = document.querySelector(toSelector) as HTMLElement | null;
  if (!target) {
    console.warn(`[particle-transition] target not found: ${toSelector}`);
    return;
  }

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = target.getBoundingClientRect();
  const fromX = fromRect.left + fromRect.width / 2;
  const fromY = fromRect.top + fromRect.height / 2;
  const toX = toRect.left + toRect.width / 2;
  const toY = toRect.top + toRect.height / 2;

  spawn(fromX, fromY, toX, toY, options);
}

/** Install the global click listener. Idempotent. */
export function installParticleListeners(): () => void {
  if (installed || typeof document === "undefined") {
    return () => {};
  }
  installed = true;

  const onClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest<HTMLElement>("[data-particle-target]");
    if (!trigger) return;
    const dest = trigger.getAttribute("data-particle-target");
    if (!dest) return;
    // Don't preventDefault — let the link's normal behavior fire
    // (Next.js <Link> will route, plain <a href="#…"> will jump).
    // The particles are a visual layer on top of whatever scroll
    // the browser/router does.
    spawnParticleBurst(trigger, dest);
  };

  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    installed = false;
    if (resizeHandler) window.removeEventListener("resize", resizeHandler);
    if (visibilityHandler) document.removeEventListener("visibilitychange", visibilityHandler);
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null;
    ctx = null;
    particles = [];
    shockwaves = [];
    rafId = null;
    resizeHandler = null;
    visibilityHandler = null;
  };
}
