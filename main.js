const { app, BrowserWindow, screen, ipcMain, Menu, nativeImage } = require('electron');
const path = require('path');
const { THEMES } = require('./themes');

let win = null;
let currentThemeId = 'penguin';

/* ── 타이머 창 생성 ─────────────────────────────── */
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const WIN_H = 120;

  win = new BrowserWindow({
    width,
    height: WIN_H,
    x: 0,
    y: height - WIN_H,
    transparent:  true,
    frame:        false,
    alwaysOnTop:  true,
    resizable:    false,
    skipTaskbar:  true,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration:  false,
    },
  });

  win.loadFile('index.html');
  win.on('closed', () => { win = null; });

  /* 우클릭 → 컨텍스트 메뉴 */
  win.webContents.on('context-menu', () => showContextMenu());
}

/* ── 컨텍스트 메뉴 (테마 선택 + Restart + Quit) ─── */
function showContextMenu() {
  const themeItems = Object.values(THEMES).map((t) => ({
    label:   t.label,
    type:    'radio',
    checked: t.id === currentThemeId,
    click:   () => switchTheme(t.id),
  }));

  const menu = Menu.buildFromTemplate([
    { label: '🎨 테마 선택', enabled: false },
    ...themeItems,
    { type: 'separator' },
    { label: '🔄 타이머 초기화', click: () => restartTimer() },
    { type: 'separator' },
    { label: '⏹ 종료',          click: () => app.quit() },
  ]);

  menu.popup({ window: win });
}

/* ── 테마 전환 ──────────────────────────────────── */
function switchTheme(themeId) {
  currentThemeId = themeId;
  if (win) win.webContents.send('theme-change', themeId);
}

/* ── 타이머 초기화 ──────────────────────────────── */
function restartTimer() {
  if (win) win.webContents.send('timer-restart');
}

/* ── IPC ────────────────────────────────────────── */
ipcMain.on('quit-app',        ()         => app.quit());
ipcMain.on('open-menu',       ()         => showContextMenu());
ipcMain.on('theme-ready',     (_, themeId) => { currentThemeId = themeId; });

/* ── 앱 시작 ────────────────────────────────────── */
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (!win) createWindow(); });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
