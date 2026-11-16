// ---- the WHEELTARI 2601: the wood-console TV in the VIP room. Every cartridge in the room is a dud; the one that works is sold by the
// hooded stranger at the Emporium (painWheelCart). Click the TV to turn it on. With the cart in, it's a crude 1982-style wheel game:
// 3 lives, Kevin takes one, high score saved. Drawn at 120x90 and blown up with no smoothing. No flashing, no strobe. ----
(function () {
  const stage = document.getElementById('vipStage'), tvBtn = document.getElementById('vipTv'), con = document.getElementById('vipConsole'), vip = document.getElementById('vip');
  if (!stage || !tvBtn) return;
  const G = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const P = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const msg = (t) => { const m = document.getElementById('vipMsg'); if (m) m.textContent = t; };

  const css = document.createElement('style');
  css.textContent = `
  #tvScr { position: absolute; left: 73.35%; top: 50.1%; width: 14.2%; height: 23.3%; border-radius: 9% / 13%; overflow: hidden; pointer-events: none; background: #050505; display: none; }
  #tvScr.on { display: block; }
  #tvScr canvas { width: 100%; height: 100%; display: block; image-rendering: pixelated; image-rendering: crisp-edges; transform-origin: 50% 50%; }
  #tvScr.boot canvas { animation: tvBoot .45s ease-out; }
  @keyframes tvBoot { 0% { transform: scale(1, .02); filter: brightness(2); } 60% { transform: scale(1, .02); } 100% { transform: none; filter: none; } }
  #tvScr::after { content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 1px, transparent 1px 3px), radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.55));
    box-shadow: inset 0 0 1.2cqw rgba(0,0,0,.8); }
  #tvGlare { position: absolute; left: 73.35%; top: 50.1%; width: 14.2%; height: 23.3%; border-radius: 9% / 13%; pointer-events: none;
    background: linear-gradient(125deg, rgba(255,255,255,.10), transparent 32%), radial-gradient(ellipse at 30% 22%, rgba(255,255,255,.07), transparent 40%); }
  #tvGlow { position: absolute; left: 70%; top: 44%; width: 21%; height: 36%; border-radius: 50%; pointer-events: none; display: none; background: radial-gradient(closest-side, rgba(96,165,250,.16), transparent); }
  #tvGlow.on { display: block; }
  @media (prefers-reduced-motion: reduce) { #tvScr.boot canvas { animation: none; } }`;
  document.head.appendChild(css);
  const glow = document.createElement('div'); glow.id = 'tvGlow'; stage.insertBefore(glow, tvBtn);
  const scr = document.createElement('div'); scr.id = 'tvScr'; scr.innerHTML = '<canvas width="120" height="90"></canvas>'; stage.insertBefore(scr, tvBtn);
  const glare = document.createElement('div'); glare.id = 'tvGlare'; stage.insertBefore(glare, tvBtn);
  const cv = scr.firstChild, c = cv.getContext('2d'), W = 120, H = 90;

  // ---------- sound: square-wave beeps, mono, quiet ----------
  let ac = null;
  const vol = () => { const v = parseFloat(localStorage.getItem('painWheelVolume')); return isNaN(v) ? .6 : Math.max(0, Math.min(1, v)); };
  function beep(f, t0, dur, g = .05, type = 'square') {
    const v = vol(); if (!v || localStorage.getItem('painWheelMuted') === 'true') return;
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator(), a = ac.createGain(); o.type = type; o.frequency.value = f; a.gain.setValueAtTime(g * v, ac.currentTime + t0); a.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + t0 + dur);
      o.connect(a); a.connect(ac.destination); o.start(ac.currentTime + t0); o.stop(ac.currentTime + t0 + dur + .02); } catch (e) {}
  }

  // ---------- a 3x5 pixel font ----------
  const F = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
    I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
    Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110', 4: '101101111001001', 5: '111100110001110',
    6: '011100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001110', '!': '010010010000010', '-': '000000111000000', '+': '000010111010000', '.': '000000000000010',
    ':': '000010000010000', "'": '010010000000000', '?': '110001010000010', '/': '001001010100100', ' ': '000000000000000' };
  function text(t, x, y, col, s = 1, center) {
    t = String(t).toUpperCase(); if (center) x = Math.round(x - (t.length * 4 * s - s) / 2);
    c.fillStyle = col;
    [...t].forEach((ch, i) => { const g = F[ch] || F['?']; for (let p = 0; p < 15; p++) if (g[p] === '1') c.fillRect(x + (i * 4 + p % 3) * s, y + Math.floor(p / 3) * s, s, s); });
  }

  // ---------- the wheel: 8 chunky slices, no words on it (it's 1982) ----------
  const SL = [['KEVIN', '#d92b2b', 'kevin'], ['+100', '#2f5bd8', 100], ['+250', '#2fa84f', 250], ['+500', '#e8c21a', 500],
              ['KEVIN', '#d92b2b', 'kevin'], ['X2', '#8e3fd1', 'x2'], ['NOTHING', '#6b6b6b', 0], ['+LIFE', '#e86fa8', 'life']];
  const N = SL.length, A = Math.PI * 2 / N;
  function wheel(cx, cy, r, rot) {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      const d = x * x + y * y; if (d > r * r) continue;
      if (d > (r - 2) * (r - 2)) { c.fillStyle = '#111'; c.fillRect(cx + x, cy + y, 1, 1); continue; }
      let a = Math.atan2(y, x) - rot; a = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      c.fillStyle = SL[Math.floor(a / A)][1]; c.fillRect(cx + x, cy + y, 1, 1);
    }
    c.fillStyle = '#111'; c.fillRect(cx - 2, cy - 2, 5, 5); c.fillStyle = '#f59e0b'; c.fillRect(cx - 1, cy - 1, 3, 3);
    c.fillStyle = '#f5f5f5'; c.fillRect(cx - 2, cy - r - 4, 5, 2); c.fillRect(cx - 1, cy - r - 2, 3, 2);   // the pointer
  }
  const under = (rot) => { let a = -Math.PI / 2 - rot; a = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2); return Math.floor(a / A); };

  // ---------- state ----------
  let spinId = 0, st = 'off', rot = 0, spinning = false, score = 0, lives = 3, last = '', hi = G('painWheelWheeltariHi', 0) || 0, anim = 0, iv = 0, frame = 0;
  const hasCart = () => !!G('painWheelCart', false);
  const pad = (n) => String(n).padStart(6, '0');
  function draw() {
    c.fillStyle = '#0a0a14'; c.fillRect(0, 0, W, H); frame++;
    if (st === 'title') {
      c.fillStyle = '#1a1446'; c.fillRect(0, 0, W, 14); c.fillStyle = '#3b2a12'; c.fillRect(0, H - 8, W, 8);
      text('WHEELTARI', W / 2, 3, '#ff9f1c', 1, true);
      wheel(60, 42, 17, rot); rot += .045;
      const k = (Math.sin(frame / 6) + 1) / 2, col = `rgb(${Math.round(120 + 135 * k)},${Math.round(120 + 135 * k)},${Math.round(120 + 135 * k)})`;
      text(hasCart() ? 'PRESS FIRE' : 'INSERT CART', W / 2, 66, col, 1, true);
      text('2601', W / 2, H - 7, '#fbbf24', 1, true);
      if (hi) text('HI ' + pad(hi), W / 2, 74, '#94a3b8', 1, true);
    } else if (st === 'play' || st === 'over') {
      text('SCORE ' + pad(score), 2, 2, '#e5e7eb');
      for (let i = 0; i < lives; i++) { c.fillStyle = '#ef4444'; c.fillRect(W - 6 - i * 6, 2, 4, 4); }
      wheel(60, 45, 26, rot);
      if (st === 'over') { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(14, 30, 92, 30); text('GAME OVER', W / 2, 35, '#ef4444', 2, true); text('HI ' + pad(hi), W / 2, 52, '#fbbf24', 1, true); }
      text(last || (spinning ? '' : 'PRESS FIRE'), W / 2, H - 8, last.startsWith('KEVIN') ? '#ef4444' : '#a7f3d0', 1, true);
    }
  }
  let ticking = false;   // the title screen animates at ~30fps; gameplay only redraws while the wheel moves
  function loop() { if (st !== 'title' || document.hidden) { ticking = false; return; } ticking = true; draw(); setTimeout(() => { anim = requestAnimationFrame(loop); }, 1000 / 30); }
  const kick = () => { if (!ticking) loop(); };

  function powerOn() {
    if (st !== 'off') return;
    st = 'title'; frame = 0; scr.classList.add('on', 'boot'); glow.classList.add('on'); setTimeout(() => scr.classList.remove('boot'), 500);
    beep(60, 0, .25, .05, 'sawtooth'); tvBtn.dataset.label = '📺 The TV (it\'s on)';
    kick();
    msg('📺 ' + (hasCart() ? 'The TV hums to life. WHEELTARI. Press fire. (Click the TV, or hit Space.)' : pick(['The TV warms up. WHEELTARI 2601. INSERT CART. Every cart in this room is a dud.', 'Click. Hum. WHEELTARI. It wants a cartridge. A real one.'])));
  }
  function powerOff() {
    if (st === 'off') return; cancelAnimationFrame(anim); spinId++; spinning = false; st = 'off';   // spinId: any spin still in flight sees it changed and stops
    scr.classList.remove('on'); glow.classList.remove('on'); tvBtn.dataset.label = '📺 The TV (it\'s off)'; beep(90, 0, .12, .04, 'sawtooth');
  }
  let noCart = 0;
  function fire() {
    if (st === 'off') return powerOn();
    if (st === 'title') {
      if (!hasCart()) { beep(110, 0, .2); msg('📼 ' + ['INSERT CART. You blow on one of the duds and jam it in. Nothing. The TV just keeps asking.', "None of the cartridges in here work. They're all THE WHEEL. They're all dead.",
        'Somebody has a working one. Somebody who only comes out at night. At the flea market. Allegedly.'][Math.min(noCart++, 2)]); return; }
      if (!G('painWheelCartIn', false)) {
        P('painWheelCartIn', true);
        msg("📼 You slide in the stranger's cartridge. It clicks. The screen doesn't even flicker. It just works. Every other cart in this room is jealous.");
        if (window.yachtAward) window.yachtAward('cartridge'); if (window.pwAch) window.pwAch('cartridge');
      }
      st = 'play'; score = 0; lives = 3; last = ''; [523, 659, 784].forEach((f, i) => beep(f, i * .09, .12)); draw(); return;
    }
    if (st === 'over') { st = 'play'; score = 0; lives = 3; last = ''; draw(); return; }
    if (spinning) return;
    spinning = true; last = ''; const my = ++spinId;
    const t0 = performance.now(), dur = 2300 + Math.random() * 900, start = rot, total = Math.PI * 2 * (3 + Math.random() * 2) + Math.random() * Math.PI * 2;
    let lastS = under(rot);
    (function step(now) {
      if (st !== 'play' || my !== spinId) return;
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3); rot = start + total * e;
      const u = under(rot); if (u !== lastS) { lastS = u; beep(1200, 0, .02, .025); }
      draw(); if (t < 1) requestAnimationFrame(step); else land(u);
    })(t0);
  }
  function land(i) {
    spinning = false; const [label, , fx] = SL[i];
    if (fx === 'kevin') { lives--; last = 'KEVIN! -1 LIFE'; beep(180, 0, .2); beep(120, .18, .3); }
    else if (fx === 'x2') { score *= 2; last = 'SCORE X2'; [660, 880].forEach((f, k) => beep(f, k * .08, .1)); }
    else if (fx === 'life') { lives = Math.min(5, lives + 1); last = 'EXTRA LIFE'; [784, 1046].forEach((f, k) => beep(f, k * .08, .12)); }
    else if (fx === 0) { last = 'NOTHING'; beep(300, 0, .12); }
    else { score += fx; last = label; beep(880, 0, .08); beep(1175, .07, .1); }
    if (lives <= 0) { st = 'over'; if (score > hi) { hi = score; P('painWheelWheeltariHi', hi); } beep(220, .3, .25); beep(165, .55, .4);
      msg('🕹️ ' + pick(['GAME OVER. Kevin got you. On a 1982 console. In a yacht.', 'Game over. The high score table has one entry and it is you. And Kevin.', 'GAME OVER. You lost to an 8-slice wheel with no words on it.'])); }
    draw();
  }
  tvBtn.addEventListener('click', fire);
  if (con) con.addEventListener('click', () => {
    if (st === 'off') { msg('🕹️ ' + pick(['WHEELTARI 2601. One joystick, one button, one game. The game is a wheel.', 'The console is warm. It is always warm. Click the TV to turn it on.', 'Fake wood paneling. Real dust. Nine years of somebody spinning in here.'])); return; }
    powerOff(); msg('🕹️ You flip the switch. The picture shrinks to a dot and the dot goes away. Like Kevin\'s attention span.');
  });
  addEventListener('keydown', (e) => {
    if (st === 'off' || !vip.classList.contains('open')) return;
    const mini = document.getElementById('mini'), pc = document.getElementById('pc98');
    if ((mini && mini.classList.contains('open')) || (pc && pc.classList.contains('open'))) return;
    const f = document.activeElement;   // don't steal Enter/Space from a button or box that has focus (unless it's the TV itself)
    if (f && f !== document.body && f !== tvBtn && /^(BUTTON|INPUT|TEXTAREA|SELECT|A)$/.test(f.tagName)) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fire(); }
  });
  new MutationObserver(() => { if (!vip.classList.contains('open')) powerOff(); }).observe(vip, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && st === 'title') kick(); });
})();
