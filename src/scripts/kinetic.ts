import { services } from "../data/business";
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let paused = false;
const motionOff = () => reduced.matches || paused;
const slider = document.querySelector<HTMLInputElement>("#journey-slider");
slider?.addEventListener("input", () => {
  const index = Number(slider.value);
  const s = services[index];
  slider.setAttribute("aria-valuetext", s.label);
  document.querySelector("[data-journey-label]")!.textContent = s.label;
  document.querySelector("[data-journey-title]")!.textContent = s.short;
  document.querySelector("[data-journey-copy]")!.textContent = s.description;
  document.querySelector(".journey-number")!.textContent = `0${index + 1}`;
  (
    document.querySelector("[data-journey-cta]") as HTMLElement
  ).dataset.interest = s.label;
  (
    document.querySelector("[data-journey-planet]") as SVGElement
  ).style.transform = `rotate(${index * 72}deg)`;
  if (!motionOff())
    document.querySelector(".journey-window-copy")?.animate(
      [
        { opacity: 0.25, transform: "translateY(14px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 400, easing: "ease-out" },
    );
});
const hero = document.querySelector<HTMLElement>(".kinetic-hero")!;
const canvas = document.querySelector<HTMLCanvasElement>(".moment-field")!;
const ctx = canvas.getContext("2d");
let width = 0,
  height = 0,
  visible = true,
  frame = 0;
let pointer = { x: -500, y: -500 };
const dots = Array.from({ length: 42 }, (_, i) => ({
  x: ((i * 97) % 101) / 101,
  y: ((i * 53) % 97) / 97,
  phase: i * 0.73,
}));
function resize() {
  const r = hero.getBoundingClientRect();
  width = r.width;
  height = r.height;
  const dpr = Math.min(devicePixelRatio, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}
new ResizeObserver(resize).observe(hero);
hero.addEventListener("pointermove", (e) => {
  const r = hero.getBoundingClientRect();
  pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
});
hero.addEventListener("pointerleave", () => (pointer = { x: -500, y: -500 }));
function draw(t: number) {
  frame = 0;
  if (!ctx || motionOff() || !visible || document.hidden) {
    ctx?.clearRect(0, 0, width, height);
    return;
  }
  ctx.clearRect(0, 0, width, height);
  const points = dots.map((dot) => {
    let x = dot.x * width + Math.sin(t * 0.0002 + dot.phase) * 18;
    let y = dot.y * height + Math.cos(t * 0.00015 + dot.phase) * 20;
    const dx = x - pointer.x,
      dy = y - pointer.y,
      distance = Math.hypot(dx, dy);
    if (distance < 120 && distance > 0) {
      x += (dx / distance) * (120 - distance) * 0.25;
      y += (dy / distance) * (120 - distance) * 0.25;
    }
    return { x, y };
  });
  ctx.fillStyle = "#b83f2a";
  ctx.strokeStyle = "#b83f2a";
  for (const p of points) {
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    for (const q of points) {
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d > 0 && d < 85) {
        ctx.globalAlpha = (1 - d / 85) * 0.09;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }
  frame = requestAnimationFrame(draw);
}
function start() {
  if (!frame && !motionOff() && visible && !document.hidden)
    frame = requestAnimationFrame(draw);
}
new IntersectionObserver(
  (entries) => {
    visible = entries[0].isIntersecting;
    if (visible) start();
    else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  },
  { threshold: 0 },
).observe(hero);
reduced.addEventListener("change", () => {
  if (motionOff()) {
    cancelAnimationFrame(frame);
    frame = 0;
    ctx?.clearRect(0, 0, width, height);
  } else start();
});
document.addEventListener("visibilitychange", start);
const photo = document.querySelector<HTMLElement>("[data-kinetic-photo]");
const type = document.querySelector<HTMLElement>("[data-scroll-type]");
let scrollFrame = 0;
function scrollScene() {
  scrollFrame = 0;
  if (motionOff()) return;
  hero.style.setProperty("--flower-turn", `${scrollY * 0.08}deg`);
  if (photo) {
    const r = photo.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) {
      const p = Math.max(
        -1,
        Math.min(1, (r.top - innerHeight * 0.3) / innerHeight),
      );
      photo.style.setProperty("--photo-turn", `${p * 5}deg`);
      photo.style.setProperty("--photo-rise", `${p * -15}px`);
    }
  }
  if (type) {
    const r = type.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight)
      type.style.transform = `translateX(${-80 - (innerHeight - r.top) * 0.2}px)`;
  }
}
addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollScene);
  },
  { passive: true },
);
resize();
start();
scrollScene();
if (!motionOff()) {
  document.querySelectorAll(".kinetic-line").forEach((line, index) =>
    line.animate(
      [
        { transform: "translateY(65px) rotate(2deg)", opacity: 0 },
        { transform: "translateY(0) rotate(0)", opacity: 1 },
      ],
      {
        duration: 900,
        delay: index * 140,
        easing: "cubic-bezier(.2,.7,.2,1)",
        fill: "backwards",
      },
    ),
  );
}

const motionToggle = document.querySelector<HTMLButtonElement>(
  "[data-motion-toggle]",
);
motionToggle?.addEventListener("click", () => {
  paused = !paused;
  motionToggle.setAttribute("aria-pressed", String(paused));
  motionToggle.textContent = paused ? "Resume motion" : "Pause motion";
  document.body.classList.toggle("motion-paused", paused);
  if (paused) {
    cancelAnimationFrame(frame);
    frame = 0;
    ctx?.clearRect(0, 0, width, height);
    document.getAnimations().forEach((animation) => {
      if (animation.effect?.getTiming().iterations !== Infinity)
        animation.finish();
    });
  } else {
    start();
    scrollScene();
  }
});
