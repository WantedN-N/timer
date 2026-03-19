/* ══════════════════════════════════════════════════
   renderer.js  —  타이머 핵심 로직 + 테마 렌더링
   ══════════════════════════════════════════════════ */

const TOTAL_SECONDS = 600;
let remaining   = TOTAL_SECONDS;
let intervalId  = null;
let isOver      = false;
let activeTheme = 'penguin';

/* ── DOM 참조 ───────────────────────────────────── */
const $strip    = document.getElementById('strip');
const $target   = document.getElementById('targetWrap');
const $targetEm = document.getElementById('targetEmoji');
const $group    = document.getElementById('actorGroup');
const $timer    = document.getElementById('timerDisplay');
const $overlay  = document.getElementById('timeoverOverlay');
const $msg      = document.getElementById('timeoverMsg');
const $root     = document.documentElement;

/* ══ 배우 요소 생성 (이모지 또는 SVG img) ══════════ */
function createActorEl(t) {
  const el = document.createElement(t.actor.imgSrc ? 'img' : 'span');
  el.className = 'actor';

  if (t.actor.imgSrc) {
    el.src = t.actor.imgSrc;
    el.style.width  = t.actor.width || '56px';
    el.style.height = 'auto';
    el.draggable    = false;
  } else {
    el.textContent   = t.actor.emoji;
    el.style.fontSize = t.actor.size || '48px';
  }

  el.style.animationName = t.actor.animation;
  return el;
}

/* ══ 테마 적용 ══════════════════════════════════════ */
function applyTheme(id) {
  const t = THEMES[id];
  if (!t) return;
  activeTheme = id;

  /* CSS 변수 */
  $root.style.setProperty('--glow',            t.timerGlow);
  $root.style.setProperty('--glow-warn',        t.timerWarnGlow);
  $root.style.setProperty('--timeover-color',  t.timeoverColor);
  $root.style.setProperty('--timeover-shadow', t.timeoverShadow);

  /* 배경 스트립 */
  $strip.style.height      = t.stripHeight;
  $strip.style.background  = t.background;
  $strip.style.borderTop   = t.stripBorderTop;

  /* 목표물 */
  $targetEm.textContent    = t.target.emoji;
  $targetEm.style.fontSize = t.target.size;
  $target.style.bottom     = t.targetBottom;

  /* 배우 그룹 재생성 */
  $group.innerHTML = '';
  $group.style.bottom = t.actorBottom;

  for (let i = 0; i < t.actor.count; i++) {
    const el = createActorEl(t);
    /* 짝수 배우는 박자 살짝 오프셋 */
    if (i % 2 === 1) el.style.animationDuration = '0.58s';
    $group.appendChild(el);
  }

  $msg.textContent = t.timeoverMsg;
  updateActorPosition();
}

/* ══ 배우 위치 계산 ═════════════════════════════════ */
function updateActorPosition() {
  if (isOver) return;
  const elapsed  = TOTAL_SECONDS - remaining;
  const progress = elapsed / TOTAL_SECONDS;
  const groupW   = $group.getBoundingClientRect().width || 260;
  const maxX     = window.innerWidth - 148 - groupW - 16;
  $group.style.transform = `translateX(${Math.round(progress * maxX)}px)`;
}

/* ══ 타임오버 ════════════════════════════════════════ */
function handleTimeover() {
  isOver = true;
  clearInterval(intervalId);

  /* 배우 → 목표물 위치로 스냅 */
  const tRect = $target.getBoundingClientRect();
  const gW    = $group.getBoundingClientRect().width || 260;
  $group.style.transition = 'transform 0.4s ease-out';
  $group.style.transform  = `translateX(${tRect.left - gW - 4}px)`;
  $targetEm.style.animation = 'none';

  $msg.textContent = THEMES[activeTheme].timeoverMsg;
  $overlay.classList.add('active');
  $timer.style.display = 'none';
}

/* ══ tick ═══════════════════════════════════════════ */
function tick() {
  remaining--;
  $timer.textContent = formatTime(remaining);
  updateActorPosition();
  if (remaining < 60) $timer.classList.add('warning');
  if (remaining <= 0) handleTimeover();
}

/* ══ 시작 / 재시작 ══════════════════════════════════ */
function startTimer() {
  clearInterval(intervalId);
  remaining = TOTAL_SECONDS;
  isOver    = false;

  $timer.textContent   = formatTime(remaining);
  $timer.style.display = '';
  $timer.classList.remove('warning');
  $overlay.classList.remove('active');
  $targetEm.style.animation  = '';
  $group.style.transition    = 'transform 0.95s linear';

  applyTheme(activeTheme);
  intervalId = setInterval(tick, 1000);
}

/* ══ 유틸 ══════════════════════════════════════════ */
function formatTime(s) {
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

/* ══ IPC 수신 ══════════════════════════════════════ */
window.electronAPI.onThemeChange((id) => {
  const wasOver = isOver;
  applyTheme(id);
  // 종료 상태가 아니었다면 위치 재계산만
  if (wasOver) handleTimeover();
});

window.electronAPI.onTimerRestart(() => startTimer());

/* ══ 우클릭 → 메뉴 ══════════════════════════════════ */
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  window.electronAPI.openMenu();
});

/* ══ 초기화 ═════════════════════════════════════════ */
startTimer();
