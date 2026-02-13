const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.querySelector(".buttons");
const celebrate = document.getElementById("celebrate");

let scale = 1;

/* ---------------- Utility ---------------- */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* ---------------- YES grows ---------------- */
function growYes() {
  scale = clamp(scale + 0.12, 1, 3);
  yesBtn.style.transform = `scale(${scale})`;
}

/* ---------------- NO shrink + dodge ---------------- */
function updateNoScale(clientX, clientY) {
  const r = noBtn.getBoundingClientRect();
  const cx = (r.left + r.right) / 2;
  const cy = (r.top + r.bottom) / 2;

  const dist = Math.hypot(clientX - cx, clientY - cy);
  const t = clamp(dist / 220, 0, 1);
  const s = clamp(0.45 + 0.55 * t, 0.45, 1);

  noBtn.style.transform = `translate(-50%, -50%) scale(${s})`;
}

function moveNoAway(clientX, clientY) {
  const container = buttons.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  const mx = clientX - container.left;
  const my = clientY - container.top;

  const cx = (noRect.left + noRect.right) / 2 - container.left;
  const cy = (noRect.top + noRect.bottom) / 2 - container.top;

  let vx = cx - mx;
  let vy = cy - my;

  const len = Math.hypot(vx, vy) || 1;
  vx /= len;
  vy /= len;

  const push = 420;

  let nx = cx + vx * push;
  let ny = cy + vy * push;

  const pad = 8;
  const halfW = noRect.width / 2;
  const halfH = noRect.height / 2;

  nx = clamp(nx, pad + halfW, container.width - pad - halfW);
  ny = clamp(ny, pad + halfH, container.height - pad - halfH);

  noBtn.style.left = `${nx}px`;
  noBtn.style.top = `${ny}px`;
}

buttons.addEventListener("mousemove", (e) => {
  updateNoScale(e.clientX, e.clientY);
});

noBtn.addEventListener("mouseenter", (e) => {
  growYes();
  moveNoAway(e.clientX, e.clientY);
});

noBtn.addEventListener("mousemove", (e) => {
  updateNoScale(e.clientX, e.clientY);
  moveNoAway(e.clientX, e.clientY);
});

/* ---------------- PERFECT INFINITE LOVE ENGINE ---------------- */

let canvas, ctx;
let particles = [];
let animationRunning = false;

const EMOJIS = ["💖","💗","💘","💕","💞","❤️","✨","🌸","🥰","😘"];
const PARTICLE_COUNT = 140; // fills whole screen evenly

function initCanvas() {
  canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9998";
  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 18 + Math.random() * 22,
      speed: 0.5 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.4,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    });
  }
}

function update() {
  if (!animationRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let p of particles) {
    p.y -= p.speed;
    p.x += p.drift;

    // recycle instantly when leaving top
    if (p.y < -40) {
      p.y = canvas.height + 40;
      p.x = Math.random() * canvas.width; // random across entire width
    }

    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.emoji, p.x, p.y);
  }

  requestAnimationFrame(update);
}

function startLoveEngine() {
  if (animationRunning) return;

  initCanvas();
  createParticles();
  animationRunning = true;
  requestAnimationFrame(update);
}

/* ---------------- YES CLICK ---------------- */

yesBtn.addEventListener("click", () => {

  const question = document.getElementById("question");
  if (question) question.style.display = "none";

  const hint = document.querySelector(".hint");
  if (hint) hint.style.display = "none";

  yesBtn.style.display = "none";
  noBtn.style.display = "none";

  celebrate.classList.remove("hidden");

  startLoveEngine();
});
