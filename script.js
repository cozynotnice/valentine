const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.querySelector(".buttons");
const celebrate = document.getElementById("celebrate");
const fxLayer = document.getElementById("fxLayer");

let scale = 1;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* ---------- NO runs away + YES grows ---------- */
function growYes() {
  scale = clamp(scale + 0.12, 1, 3);
  yesBtn.style.transform = `scale(${scale})`;
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
  noBtn.style.transform = "translate(-50%, -50%)";
}

noBtn.addEventListener("mouseenter", (e) => {
  growYes();
  moveNoAway(e.clientX, e.clientY);
});
noBtn.addEventListener("mousemove", (e) => moveNoAway(e.clientX, e.clientY));
noBtn.addEventListener("click", (e) => {
  growYes();
  moveNoAway(e.clientX, e.clientY);
});

/* ---------- Celebration FX (INSIDE CARD ONLY) ---------- */
const LOVE = ["💖","💗","💘","💕","💞","❤️","✨","🌸","🥰","😘","💝","🎉"];

function spawnFX(count = 70) {
  const rect = fxLayer.getBoundingClientRect();

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "fx";
    el.textContent = LOVE[(Math.random() * LOVE.length) | 0];

    const startX = Math.random() * rect.width;
    const startY = rect.height + 20;
    const driftX = (Math.random() * 240 - 120);
    const duration = 900 + Math.random() * 700;
    const size = 16 + Math.random() * 18;
    const rot = (Math.random() * 360 - 180);

    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;
    el.style.fontSize = `${size}px`;
    el.style.opacity = "1";

    fxLayer.appendChild(el);

    el.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${driftX}px, -${rect.height + 120}px) rotate(${rot}deg)`, opacity: 0 }
      ],
      { duration, easing: "ease-out", fill: "forwards" }
    );

    setTimeout(() => el.remove(), duration + 50);
  }
}

/* ---------- YES click ---------- */
yesBtn.addEventListener("click", () => {
  // hide question + hint + buttons
  const question = document.getElementById("question");
  if (question) question.style.display = "none";

  const hint = document.querySelector(".hint");
  if (hint) hint.style.display = "none";

  yesBtn.style.display = "none";
  noBtn.style.display = "none";

  // show yay
  celebrate.classList.remove("hidden");

  // run FX after UI updates (no perceived delay)
  requestAnimationFrame(() => spawnFX(90));
});
