/* ══════════════════════════════════════════════════
   renderer.js  —  타이머 핵심 로직 + 테마 렌더링
   ══════════════════════════════════════════════════ */

const TOTAL_SECONDS = 600;
const TARGET_GAP    = 52;   // 배우 앞 타겟까지 간격(px)
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

  /* targetFollows 테마: left 기준 / 아니면 right 고정 */
  if (t.targetFollows) {
    $target.style.right     = 'auto';
    $target.style.left      = '0';
    $target.style.transition = 'bottom 0.3s, transform 0.95s linear';
  } else {
    $target.style.left      = 'auto';
    $target.style.right     = '148px';
    $target.style.transform = '';
    $target.style.transition = 'bottom 0.3s';
  }

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
  const t        = THEMES[activeTheme];
  const elapsed  = TOTAL_SECONDS - remaining;
  const progress = elapsed / TOTAL_SECONDS;
  const groupW   = $group.getBoundingClientRect().width || 60;

  if (t.targetFollows) {
    /* 타겟이 배우 바로 앞에서 같이 이동 */
    const targetW = $target.getBoundingClientRect().width || 50;
    const maxX    = window.innerWidth - 148 - groupW - TARGET_GAP - targetW;
    const actorX  = Math.round(progress * maxX);
    $group.style.transform  = `translateX(${actorX}px)`;
    $target.style.transform = `translateX(${actorX + groupW + TARGET_GAP}px)`;
  } else {
    const maxX = window.innerWidth - 148 - groupW - 16;
    $group.style.transform = `translateX(${Math.round(progress * maxX)}px)`;
  }
}

/* ══ 타임오버 ════════════════════════════════════════ */
function handleTimeover() {
  isOver = true;
  clearInterval(intervalId);

  const t    = THEMES[activeTheme];
  const gW   = $group.getBoundingClientRect().width || 60;

  if (t.targetFollows) {
    /* 배우가 타겟에 닿는 위치로 스냅 */
    const targetW     = $target.getBoundingClientRect().width || 50;
    const finalTarget = window.innerWidth - 148 - targetW - 8;
    const finalActor  = finalTarget - TARGET_GAP - gW;
    $group.style.transition  = 'transform 0.4s ease-out';
    $target.style.transition = 'transform 0.4s ease-out';
    $group.style.transform   = `translateX(${finalActor}px)`;
    $target.style.transform  = `translateX(${finalTarget}px)`;
  } else {
    const tRect = $target.getBoundingClientRect();
    $group.style.transition = 'transform 0.4s ease-out';
    $group.style.transform  = `translateX(${tRect.left - gW - 4}px)`;
  }

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
  $target.style.transition   = 'bottom 0.3s, transform 0.95s linear';

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
