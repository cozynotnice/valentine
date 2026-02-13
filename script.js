const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.querySelector(".buttons");
const celebrate = document.getElementById("celebrate");

let scale = 1;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

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

yesBtn.addEventListener("click", () => {
  const question = document.getElementById("question");
  if (question) question.style.display = "none";

  const hint = document.querySelector(".hint");
  if (hint) hint.style.display = "none";

  yesBtn.style.display = "none";
  noBtn.style.display = "none";

  celebrate.classList.remove("hidden");
});
