/**
 * themes.js — 테마 데이터 레지스트리
 *
 * actor.imgSrc 가 있으면 <img> 렌더, 없으면 emoji <span>
 * → GIF 교체 시 imgSrc 만 바꾸면 됩니다.
 */
const PINGU_SRC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxMDAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIxMDAiPgogIDwhLS0g66q47Ya1ICjsp4TtlZwg64Sk7J2067mEKSAtLT4KICA8ZWxsaXBzZSBjeD0iNDAiIGN5PSI2OCIgcng9IjIyIiByeT0iMjgiIGZpbGw9IiMxYTIzNDAiLz4KICA8IS0tIOuwsCAo7Z2wIO2DgOybkCkgLS0+CiAgPGVsbGlwc2UgY3g9IjQwIiBjeT0iNzIiIHJ4PSIxMyIgcnk9IjE5IiBmaWxsPSIjZjBlY2U0Ii8+CiAgPCEtLSDrqLjrpqwgLS0+CiAgPGNpcmNsZSBjeD0iNDAiIGN5PSIzNiIgcj0iMjIiIGZpbGw9IiMxYTIzNDAiLz4KICA8IS0tIOu6qCDtnbAg7Yyo7LmYIC0tPgogIDxlbGxpcHNlIGN4PSIzMCIgY3k9IjQyIiByeD0iNiIgcnk9IjUiIGZpbGw9IiNmMGVjZTQiLz4KICA8ZWxsaXBzZSBjeD0iNTAiIGN5PSI0MiIgcng9IjYiIHJ5PSI1IiBmaWxsPSIjZjBlY2U0Ii8+CiAgPCEtLSDriIgg7Z2w7J6QIC0tPgogIDxlbGxpcHNlIGN4PSIzMyIgY3k9IjMxIiByeD0iNS41IiByeT0iNiIgZmlsbD0iI2ZmZmZmZiIvPgogIDxlbGxpcHNlIGN4PSI0NyIgY3k9IjMxIiByeD0iNS41IiByeT0iNiIgZmlsbD0iI2ZmZmZmZiIvPgogIDwhLS0g64iI64+Z7J6QIC0tPgogIDxjaXJjbGUgY3g9IjM0LjUiIGN5PSIzMi41IiByPSIzLjIiIGZpbGw9IiMxMTEiLz4KICA8Y2lyY2xlIGN4PSI0OC41IiBjeT0iMzIuNSIgcj0iMy4yIiBmaWxsPSIjMTExIi8+CiAgPCEtLSDriIgg7ZWY7J2065287J207Yq4IC0tPgogIDxjaXJjbGUgY3g9IjM1LjgiIGN5PSIzMS4yIiByPSIxLjEiIGZpbGw9IiNmZmZmZmYiLz4KICA8Y2lyY2xlIGN4PSI0OS44IiBjeT0iMzEuMiIgcj0iMS4xIiBmaWxsPSIjZmZmZmZmIi8+CiAgPCEtLSDrtoDrpqwgKOyjvO2ZqSkgLS0+CiAgPHBvbHlnb24gcG9pbnRzPSI0MCw0MSAzNSw0OCA0NSw0OCIgZmlsbD0iI2U4NzIwYyIvPgogIDxsaW5lIHgxPSIzNSIgeTE9IjQ4IiB4Mj0iNDUiIHkyPSI0OCIgc3Ryb2tlPSIjYzA1YTA2IiBzdHJva2Utd2lkdGg9IjEuMiIvPgogIDwhLS0g7Jm87Kq9IOuCoOqwnCAtLT4KICA8ZWxsaXBzZSBjeD0iMTYiIGN5PSI2NSIgcng9IjciIHJ5PSIxOCIgZmlsbD0iIzE0MWEzMCIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyIDE2IDY1KSIvPgogIDwhLS0g7Jik66W47Kq9IOuCoOqwnCAtLT4KICA8ZWxsaXBzZSBjeD0iNjQiIGN5PSI2NSIgcng9IjciIHJ5PSIxOCIgZmlsbD0iIzE0MWEzMCIgdHJhbnNmb3JtPSJyb3RhdGUoMTIgNjQgNjUpIi8+CiAgPCEtLSDruajqsIQg66qp64+E66asIC0tPgogIDxyZWN0IHg9IjIyIiB5PSI1MiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSIjZDQyMDIwIi8+CiAgPHJlY3QgeD0iMjYiIHk9IjUyIiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgcng9IjMiIGZpbGw9IiNkNDIwMjAiLz4KICA8IS0tIOuwnCAo7KO87ZmpKSAtLT4KICA8ZWxsaXBzZSBjeD0iMzEiIGN5PSI5NyIgcng9IjkiIHJ5PSI0IiBmaWxsPSIjZTg3MjBjIi8+CiAgPGVsbGlwc2UgY3g9IjQ5IiBjeT0iOTciIHJ4PSI5IiByeT0iNCIgZmlsbD0iI2U4NzIwYyIvPgo8L3N2Zz4K";

const THEMES = {
  penguin: {
    id:    'penguin',
    label: '🐧 펭귄 횡단보도',
    actor: {
      imgSrc:    PINGU_SRC,   // SVG Pingu
      count:     4,
      width:     '56px',
      animation: 'waddle',
    },
    target: { emoji: '🚩', size: '38px' },
    background: `repeating-linear-gradient(
      90deg,
      rgba(255,255,255,0.88) 0px,  rgba(255,255,255,0.88) 38px,
      rgba(20,20,20,0.72)   38px,  rgba(20,20,20,0.72)   68px)`,
    stripHeight:    '30px',
    stripBorderTop: '3px solid rgba(255,255,255,0.45)',
    actorBottom:    '22px',
    targetBottom:   '22px',
    timerGlow:      'rgba(80,200,255,0.85)',
    timerWarnGlow:  'rgba(255,80,80,0.9)',
    timeoverMsg:    'Noot Noot! 🐧',
    timeoverColor:  '#ffffff',
    timeoverShadow: '#cc0000',
  },

  cat: {
    id:    'cat',
    label: '🐈 나비 잡기',
    actor: {
      emoji:     '🐈',
      count:     1,
      size:      '52px',
      animation: 'catrun',
    },
    target: { emoji: '🦋', size: '38px' },
    background: `linear-gradient(
      to bottom,
      rgba(34,139,34,0) 0%,
      rgba(34,139,34,0.55) 35%,
      rgba(18,90,18,0.82) 100%)`,
    stripHeight:    '34px',
    stripBorderTop: '2px solid rgba(80,200,80,0.5)',
    actorBottom:    '26px',
    targetBottom:   '26px',
    timerGlow:      'rgba(150,255,80,0.85)',
    timerWarnGlow:  'rgba(255,160,0,0.9)',
    timeoverMsg:    '잡았다! 🐈🦋',
    timeoverColor:  '#fff9c4',
    timeoverShadow: '#ff7700',
  },

  dog: {
    id:    'dog',
    label: '🐕 공 쫓기',
    actor: {
      emoji:     '🐕',
      count:     1,
      size:      '52px',
      animation: 'dogrun',
    },
    target: { emoji: '🎾', size: '36px' },
    background: `linear-gradient(
      to bottom,
      rgba(135,206,235,0)   0%,
      rgba(124,185,100,0.5) 40%,
      rgba(80,140,60,0.78)  100%)`,
    stripHeight:    '34px',
    stripBorderTop: '2px solid rgba(180,230,100,0.5)',
    actorBottom:    '26px',
    targetBottom:   '30px',
    timerGlow:      'rgba(255,220,50,0.9)',
    timerWarnGlow:  'rgba(255,100,30,0.9)',
    timeoverMsg:    'Nice Catch! 🐕🎾',
    timeoverColor:  '#fffde7',
    timeoverShadow: '#e65100',
  },
};

if (typeof module !== 'undefined') module.exports = { THEMES };
