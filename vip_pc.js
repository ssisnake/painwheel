// ---- the VIP room's right monitor: degen1350's Windows 98 PC (art by Ada). Unlocks once the 8/11 is open ----
// Desktop with joke icons + Clippy, and the 8/11 Security Camera Archive, which fills up one cam at a time as you find
// the hidden Axazons (one per location, see axa_cameo.js / AXA_PLACES). Coordinates are % of the 2560x1440 art.
(function () {
  const $ = (id) => document.getElementById(id);
  const G = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const has811 = () => G('painWheel811Open', false) === true || (((G('painWheelStats', {}) || {}).byType || {}).SEVEN_ELEVEN || 0) > 0;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const PLACES = window.AXA_PLACES || {};
  const TOTAL_CAMS = 15;

  const css = document.createElement('style');
  css.textContent = `
  #pc98 { position: fixed; inset: 0; z-index: 90; display: none; background: rgba(2,1,6,.92); align-items: center; justify-content: center; }
  #pc98.open { display: flex; animation: pcOn .45s ease-out; }
  @keyframes pcOn { from { opacity: 0; transform: scale(.96); filter: brightness(3); } to { opacity: 1; transform: none; filter: none; } }
  #pcScr { position: relative; width: min(100vw, calc(100vh * 16 / 9)); aspect-ratio: 16 / 9; background: #000 url(media/pc_desktop.webp) center / 100% 100% no-repeat; container-type: inline-size; user-select: none; overflow: hidden; }
  #pcScr.cams { background-image: url(media/pc_cams.webp); }
  #pcScr::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0 1px, transparent 1px 3px); }
  .pch { position: absolute; padding: 0; border: 0; background: none; cursor: pointer; border-radius: .3cqw; }
  .pch:hover, .pch:focus-visible { background: rgba(0,0,128,.28); outline: .12cqw dotted #fff; }
  #pcScr.cams .dsk, #pcScr:not(.cams) .cam { display: none !important; }
  .pcBub { position: absolute; display: flex; align-items: center; justify-content: center; text-align: center; color: #1c1917; font: 700 1.35cqw/1.25 Tahoma, Verdana, sans-serif; padding: .6cqw; pointer-events: none; }
  #pcClock { position: absolute; left: 89.8%; top: 90.2%; width: 7.6%; height: 4.2%; display: flex; align-items: center; justify-content: center; background: #c0c0c0; color: #000; font: 700 1.25cqw Tahoma, Verdana, sans-serif; pointer-events: none; }
  #pcStart { position: absolute; left: 2.6%; bottom: 6.2%; width: 18%; display: none; background: #c0c0c0; border: .15cqw solid; border-color: #fff #404040 #404040 #fff; box-shadow: .2cqw .2cqw 0 #000; z-index: 5; font: 700 1.3cqw Tahoma, Verdana, sans-serif; }
  #pcStart.open { display: flex; }
  #pcStart .side { width: 2.2cqw; background: linear-gradient(0deg, #000080, #1084d0); color: #c0c0c0; writing-mode: vertical-rl; transform: rotate(180deg); font: 900 1.3cqw Arial, sans-serif; padding: .4cqw 0; }
  #pcStart .items { flex: 1; display: flex; flex-direction: column; padding: .2cqw; }
  #pcStart button { text-align: left; padding: .55cqw .8cqw; border: 0; background: none; font: inherit; cursor: pointer; }
  #pcStart button:hover { background: #000080; color: #fff; }
  .w98 { position: absolute; left: 50%; top: 44%; transform: translate(-50%, -50%); min-width: 30cqw; max-width: 46cqw; background: #c0c0c0; border: .15cqw solid; border-color: #fff #404040 #404040 #fff; box-shadow: .25cqw .25cqw 0 #000; z-index: 6; font: 1.35cqw/1.35 Tahoma, Verdana, sans-serif; color: #000; }
  .w98 .tb { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, #000080, #1084d0); color: #fff; font-weight: 700; padding: .3cqw .5cqw; }
  .w98 .tb button { width: 1.8cqw; height: 1.6cqw; border: .12cqw solid; border-color: #fff #404040 #404040 #fff; background: #c0c0c0; font: 900 1cqw Arial; cursor: pointer; padding: 0; line-height: 1; }
  .w98 .bd { padding: 1.1cqw 1.3cqw; display: flex; gap: 1cqw; align-items: flex-start; white-space: pre-line; }
  .w98 .bd .ic { font-size: 2.6cqw; line-height: 1; }
  .w98 .bt { display: flex; justify-content: center; gap: .8cqw; padding: 0 1cqw 1cqw; }
  .w98 .bt button { min-width: 7cqw; padding: .35cqw 1cqw; border: .15cqw solid; border-color: #fff #404040 #404040 #fff; background: #c0c0c0; font: 1.25cqw Tahoma, Verdana, sans-serif; cursor: pointer; }
  .w98 .bt button:active { border-color: #404040 #fff #fff #404040; }
  .w98 .big { width: 40cqw; aspect-ratio: 16 / 10; position: relative; overflow: hidden; border: .15cqw solid; border-color: #404040 #fff #fff #404040; }
  .camShot { position: absolute; overflow: hidden; background: #111; pointer-events: none; }
  .camShot .bg { position: absolute; inset: 0; background-repeat: no-repeat; filter: grayscale(.75) sepia(.35) brightness(.85) contrast(1.15); }
  .camShot .ax { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 26%; image-rendering: pixelated; filter: grayscale(.6) sepia(.3) brightness(.9); }
  .camShot .ax.flip { transform: translate(-50%, -50%) scaleX(-1); }
  .camShot .rec { position: absolute; left: 4%; top: 4%; color: #f87171; font: 900 max(9px, .8cqw) monospace; text-shadow: 0 0 2px #000; }
  .camShot .ts { position: absolute; right: 4%; bottom: 4%; color: #e5e7eb; font: 700 max(8px, .72cqw) monospace; text-shadow: 0 0 2px #000; }
  .camShot .nm { position: absolute; left: 4%; bottom: 4%; color: #fde68a; font: 800 max(8px, .75cqw) monospace; text-shadow: 0 0 2px #000; }
  .camShot::after { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 1px, transparent 1px 3px); animation: camRoll 6s linear infinite; }
  @keyframes camRoll { from { background-position: 0 0; } to { background-position: 0 3cqw; } }
  .camSlot.sel { outline: .35cqw solid #facc15; outline-offset: .2cqw; }
  #pcStore { position: absolute; left: 87.4%; top: 63.6%; width: 6.6%; height: 3.4%; white-space: nowrap; background: #031a0a; color: #4ade80; font: 900 1.7cqw/1 'Courier New', monospace; display: flex; align-items: center; justify-content: flex-end; pointer-events: none; }
  #pcBar { position: absolute; left: 83.15%; top: 62%; height: 1.35%; background: #22c55e; box-shadow: 0 0 .5cqw #22c55e; pointer-events: none; }
  #pcBarBg { position: absolute; left: 83.1%; top: 61.9%; width: 10.5%; height: 1.55%; background: #0b1a10; pointer-events: none; }
  #pcLeave { position: fixed; right: 14px; top: 12px; z-index: 91; font: 800 16px system-ui, sans-serif; padding: 9px 14px; border-radius: 10px; border: 2px solid #94a3b8; background: #1e293b; color: #f1f5f9; cursor: pointer; }
  @media (prefers-reduced-motion: reduce) { #pc98.open, .camShot::after { animation: none; } }`;
  document.head.appendChild(css);

  const root = document.createElement('div'); root.id = 'pc98'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', "degen1350's computer");
  root.innerHTML = '<div id="pcScr"></div><button id="pcLeave" type="button">⏻ Get up from the PC</button>';
  document.body.appendChild(root);
  const scr = $('pcScr');
  const hot = (cls, l, t, w, h, label, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'pch ' + cls; b.title = label; b.setAttribute('aria-label', label);
    b.style.cssText = `left:${l}%;top:${t}%;width:${w}%;height:${h}%`; b.onclick = (e) => { e.stopPropagation(); closeStart(); fn(); }; scr.appendChild(b); return b; };

  // ---------- Clippy (he cannot be turned off; that is the point) ----------
  const bubD = document.createElement('div'); bubD.className = 'pcBub dsk'; bubD.style.cssText = 'left:71.6%;top:61%;width:13.8%;height:17.8%'; scr.appendChild(bubD);
  const bubC = document.createElement('div'); bubC.className = 'pcBub cam'; bubC.style.cssText = 'left:81.3%;top:70.2%;width:8.6%;height:12.2%;font-size:1.05cqw'; scr.appendChild(bubC);
  let clipT = 0;
  const clippy = (t) => { [bubD, bubC].forEach(b => b.textContent = t); clearTimeout(clipT); clipT = setTimeout(idleClippy, 9000); };
  const IDLE = ["It looks like you're snooping on someone's computer. Would you like help with that?", "Tip: the Security Cam Viewer is the only program on here that works. Mostly.",
    "I've been on this desktop since 1998. Nobody has ever closed me. Nobody CAN close me.", "Don't open the Por... Photos folder. It's photos of porches. It's worse than you think."];
  const idleClippy = () => { [bubD, bubC].forEach(b => b.textContent = scr.classList.contains('cams') ? camLine() : pick(IDLE)); };
  hot('dsk', 84, 65, 13, 23, 'Clippy', () => clippy(pick(["Ow. That's my eye. I only have two and they're both googly.", "You can't close me. I checked. I tried. I'm still here.", "It looks like you're clicking a paperclip. Would you like help with that?"])));
  hot('cam', 88, 73, 9, 18, 'Clippy', () => clippy(pick(["He's out there. Every place has ONE of him. Probably.", "I don't spy. I ASSIST with spying."])));

  // ---------- Win98 dialogs ----------
  function box(title, icon, text, buttons, extra) {
    scr.querySelectorAll('.w98').forEach(w => w.remove());
    const w = document.createElement('div'); w.className = 'w98';
    w.innerHTML = `<div class="tb"><span></span><button type="button" aria-label="Close">✕</button></div>${extra || ''}<div class="bd"><span class="ic">${icon}</span><span class="tx"></span></div><div class="bt"></div>`;
    w.querySelector('.tb span').textContent = title; w.querySelector('.tx').textContent = text;
    const bt = w.querySelector('.bt'); (buttons || [['OK']]).forEach(([label, fn]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.onclick = (e) => { e.stopPropagation(); w.remove(); if (fn) fn(); }; bt.appendChild(b); });
    w.querySelector('.tb button').onclick = (e) => { e.stopPropagation(); w.remove(); };
    w.addEventListener('click', (e) => e.stopPropagation());
    scr.appendChild(w); return w;
  }
  const ok = (title, icon, text, after) => box(title, icon, text, [['OK', after]]);

  // ---------- the desktop ----------
  const L1 = 2.9, L2 = 11.8, W = 7.4;
  hot('dsk', L1, 4.4, W, 12.9, 'My Computer', () => ok('My Computer', '🖥️', 'Packard Bell Legend 3000\n64 MB RAM · 4 GB hard drive (3.9 GB is The Wheel)\nWindows 98 Second Edition, First Problem', () => clippy("It's fine. It's not fine. Don't kick it.")));
  hot('dsk', L2, 4.9, W, 12.4, 'Por... Photos', () => ok('Access Denied', '⛔', 'C:\\My Documents\\Por... Photos\\\n\nAccess is denied. Nice try, degen1350.', () => clippy("It's PORCH photos. 412 of them. All the same porch. Somehow worse.")));
  hot('dsk', L1, 19.6, W, 12.4, 'Recycle Bin', () => box('Confirm File Delete', '🗑️', 'Are you sure you want to permanently delete "Kevin"?', [['Yes', () => ok('Error Deleting File', '❌', 'Cannot delete Kevin: Kevin is being used by another program (The Wheel).')], ['No']]));
  hot('dsk', L2, 19.6, W, 11.2, 'WinRAR', () => box('Please purchase WinRAR license', '📦', 'Notice: your 40-day trial expired on 03/14/1999.\nYou are on day 10,108 of your 40-day trial.', [['Buy Now', () => clippy("Nobody has ever pressed that. You're the first. Legends say a goblin answers.")], ['Close']]));
  hot('dsk', L1, 34.2, W, 14.4, "Greg's Adventure (DEMO)", () => ok("Greg's Adventure (DEMO)", '🐏', "Greg's Adventure requires a 3dfx Voodoo2 graphics card.\n\nAlso: Greg is not authorized to operate heavy machinery, including this computer.", () => clippy("Ada had it uninstalled. Greg reinstalled it. Ada laminated a sign.")));
  hot('dsk', L2, 34.2, W, 11.6, 'Curses.exe', () => ok('Curses.exe', '💀', 'Curses.exe has performed an illegal operation and will be shut down.\n\nIf the problem persists, it is probably Kevin.', () => clippy("Somebody keeps buying curses at the 8/11 from this machine. I'm not saying who. It's degen1350.")));
  hot('dsk', L1, 50.2, W, 12.6, 'Security Cam Viewer', openCams);
  hot('dsk', L2, 50.2, W, 11.4, 'The Wheel', () => {   // launches the WHEEL-2600 (the wheel inside the wheel)
    clippy("Launching THE WHEEL. Again. From inside The Wheel. I'm not getting paid enough for this.");
    const w = ok('The Wheel', '🎡', 'Loading WHEEL-2600...\nInsert cartridge. Blow on it. Insert it again.');
    setTimeout(() => { w.remove(); close(); if (window.vipSitDown) window.vipSitDown(); }, 1600);
  });
  hot('dsk', L1, 65.3, 8, 13, 'To Do... (Probably Not)', () => ok('To Do.txt - Notepad', '📝', '1. fix the claw  ✓ (Cogsworth)\n2. stop ADDing so hard  ✗\n3. find the hidden guy on the cams  ...\n4. return Ada\'s wrench\n5. tell Greg no\n6. tell Greg no again', () => clippy('Number 2 has been on there since 1998.')));
  hot('dsk', L2, 65.3, W, 13, 'Internet (Good Luck)', () => { const w = ok('Dial-Up Networking', '☎️', 'Dialing... *SKREEEEE-KSSSHHH-BWAAANG*\nConnecting at 14.4 kbps...'); setTimeout(() => { if (w.isConnected) { w.remove(); ok('Dial-Up Networking', '📵', 'Connection lost.\nSomebody picked up the phone.', () => clippy("It's a landline. Somebody always picks up the phone. Usually Vince.")); } }, 2600); });
  hot('dsk', 83.2, 89.6, 2.6, 5, 'Volume', () => clippy("The volume knob is taped at 11. Don't ask. Nobody asks."));
  hot('dsk', 86.3, 89.6, 2.8, 5, 'Mail', () => ok('Outlook Express', '✉️', 'You have 1 new message.\n\nFrom: gallywix@goblinexpress.biz\nSubject: YOUR ACCOUNT HAS BEEN PRE-APPROVED (AGAIN)', () => clippy('He sends one every 9 minutes. He has never been approved for anything himself.')));
  // things in the wallpaper
  hot('dsk', 86, 6, 9.5, 28, 'Water tower', () => clippy("The wheel on the water tower. They put it everywhere. It's watching. It's always watching."));
  hot('dsk', 78.5, 46.5, 7, 15, 'Soda machine', () => clippy('It only takes Canadian quarters. Nobody here has Canadian quarters. Except Bibledaddy, weirdly.'));
  hot('dsk', 69.8, 41.5, 6.2, 12, 'Hot dog sign', () => clippy('$1.35 out here. 0.99 inside. Nobody knows why. The hot dogs know.'));
  hot('dsk', 17, 51, 21, 26, 'The truck', () => clippy("That's the 8/11 truck. It has been 'getting fixed' since 2004."));

  // the start menu + clock
  const sm = document.createElement('div'); sm.id = 'pcStart'; sm.className = 'dsk';
  sm.innerHTML = '<div class="side">Windows98</div><div class="items"><button data-s="cams">📹 Security Cam Viewer</button><button data-s="todo">📝 To Do... (Probably Not)</button><button data-s="help">❓ Help</button><button data-s="off">⏻ Shut Down...</button></div>';
  scr.appendChild(sm);
  function closeStart() { sm.classList.remove('open'); }
  sm.addEventListener('click', (e) => { e.stopPropagation(); const s = e.target.dataset.s; closeStart();
    if (s === 'cams') openCams(); else if (s === 'todo') scr.querySelector('[aria-label="To Do... (Probably Not)"]').click();
    else if (s === 'help') ok('Windows Help', '❓', 'There is no help. There is only Clippy.', () => clippy('Hi.')); else if (s === 'off') close(); });
  hot('dsk', 2.5, 89.8, 8, 4.8, 'Start', () => sm.classList.toggle('open'));
  const clock = document.createElement('div'); clock.id = 'pcClock'; scr.appendChild(clock);
  const tick = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };
  scr.addEventListener('click', closeStart);

  // ---------- the 8/11 Security Camera Archive ----------
  const COLS = [27.4, 38.4, 49.4, 60.15, 71.05], ROWS = [28, 47.6, 67.1], PW = 8.6, PH = 12.9;
  const found = () => { const s = G('painWheelAxaSightings', {}) || {}; return Object.entries(s).filter(([k, t]) => PLACES[k] && t).sort((a, b) => a[1] - b[1]); };
  const when = (t) => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`; };
  function shot(k, t, big) {   // a zoomed-in crop of that place's background, centered on where he was hiding
    const P = PLACES[k], z = big ? 3.4 : 4.4, box = big ? 1.6 : 1.19;   // box = shot width / height
    const cx = P.x + P.w / 2, cy = P.y + P.w * 1.674 * P.ar / 2, zy = z * box / P.ar;
    const px = Math.min(100, Math.max(0, (cx - 50 / z) / (100 - 100 / z) * 100)), py = zy <= 1 ? 50 : Math.min(100, Math.max(0, (cy - 50 / zy) / (100 - 100 / zy) * 100));
    const ax = (cx - (px / 100) * (100 - 100 / z)) * z, ay = (cy - (py / 100) * (100 - 100 / zy)) * zy;   // where he lands inside the crop
    return `<div class="bg" style="background-image:url(${P.bg});background-size:${z * 100}% auto;background-position:${px.toFixed(1)}% ${py.toFixed(1)}%"></div>` +
      `<img class="ax${P.flip ? ' flip' : ''}" src="media/axa_peek.png" alt="" style="left:${ax.toFixed(1)}%;top:${ay.toFixed(1)}%;width:${(P.w * z).toFixed(1)}%;opacity:${Math.min(1, (P.op || .6) + .25)}"><span class="rec">● REC</span>${big ? `<span class="nm">${P.name.toUpperCase()}</span><span class="ts">${when(t)}</span>` : ''}`;
  }
  let sel = -1;
  const camLine = () => { const n = found().length;
    return n === 0 ? "No footage yet. He's out there. One in every place. Hiding badly, but hiding."
      : n < 4 ? `${n} caught on camera. He thinks he's sneaky. He is not sneaky.` : n < 8 ? `${n} sightings. At this point it's a pattern.` : `${n} of ${TOTAL_CAMS}. He's starting to get nervous.`; };
  function renderCams() {
    scr.querySelectorAll('.camSlot, #pcStore, #pcBar, #pcBarBg').forEach(e => e.remove());
    const f = found();
    for (let i = 0; i < TOTAL_CAMS; i++) {
      const l = COLS[i % 5], t = ROWS[Math.floor(i / 5)], it = f[i];
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pch cam camSlot' + (sel === i ? ' sel' : ''); b.title = it ? `CAM ${String(i + 1).padStart(2, '0')} · ${PLACES[it[0]].name}` : `CAM ${String(i + 1).padStart(2, '0')} · no signal`;
      b.style.cssText = `left:${l}%;top:${t}%;width:${PW}%;height:${PH}%`;
      if (it) { const s = document.createElement('div'); s.className = 'camShot'; s.style.cssText = 'inset:0'; s.innerHTML = shot(it[0], it[1]); b.appendChild(s); }
      b.onclick = (e) => { e.stopPropagation(); if (!it) { sel = -1; renderCams(); return clippy(pick(['No signal. That camera is pointed at a wall. On purpose.', "Nothing yet. He's somewhere. Probably in plain sight.", 'Static. Either the camera is broken or he is VERY good.'])); }
        sel = i; renderCams(); clippy(`CAM ${String(i + 1).padStart(2, '0')}: ${PLACES[it[0]].name}. ` + pick(["Zoom. Enhance. Yep, it's him.", 'He looks guilty. He always looks guilty.', 'Caught red-handed. Gray-handed. The cameras are cheap.'])); };
      b.ondblclick = () => it && viewSel();
      scr.appendChild(b);
    }
    const bg = document.createElement('div'); bg.id = 'pcBarBg'; bg.className = 'cam'; scr.appendChild(bg);
    const bar = document.createElement('div'); bar.id = 'pcBar'; bar.className = 'cam'; bar.style.width = (10.4 * Math.min(1, f.length / TOTAL_CAMS)) + '%'; scr.appendChild(bar);
    const st = document.createElement('div'); st.id = 'pcStore'; st.className = 'cam'; st.textContent = `${f.length} / ${TOTAL_CAMS}`; scr.appendChild(st);
  }
  function viewSel() {
    const f = found(), it = f[sel];
    if (!it) return clippy('Select a camera first. Click one. Any one with something in it.');
    const w = box(`CAM ${String(sel + 1).padStart(2, '0')} - ${PLACES[it[0]].name}`, '📹', `Subject: Axazon (probably)\nLocation: ${PLACES[it[0]].name}\nRecorded: ${new Date(it[1]).toLocaleString()}\nStatus: pretending to be a background character`, [['Close']],
      `<div style="padding:1cqw 1cqw 0"><div class="big"><div class="camShot" style="inset:0">${shot(it[0], it[1], true)}</div></div></div>`);
    w.style.maxWidth = 'none';
  }
  function openCams() { scr.classList.add('cams'); sel = -1; renderCams(); clippy(camLine()); }
  hot('cam', 82.2, 25.6, 12, 3.9, 'View Selected', viewSel);
  hot('cam', 82.2, 30.5, 12, 3.9, 'Import Image', () => ok('Import Image', '📂', 'Unsupported file type: "your_face.jpg".\nThis archive only accepts footage of one (1) man.'));
  hot('cam', 82.2, 35.4, 12, 3.9, 'Save As', () => ok('Save As', '💾', 'Saved to C:\\My Documents\\Evidence\\axazon_FINAL_final(3).jpg', () => clippy('That folder has 9,000 files in it. They are all the same picture.')));
  hot('cam', 82.2, 40.3, 12, 3.9, 'Delete', () => ok('Delete', '❌', 'You cannot delete evidence.\nThat is literally the one rule.'));
  hot('cam', 82.2, 45.2, 12, 4, 'Clear All', () => box('Clear All', '🧹', 'Are you sure you want to clear all footage?', [['Yes', () => ok('Clear All', '🚫', 'No.')], ['No']]));
  hot('cam', 92.9, 8, 2.2, 3.4, 'Close', () => { scr.classList.remove('cams'); scr.querySelectorAll('.w98').forEach(w => w.remove()); idleClippy(); });
  hot('cam', 88.2, 8, 2.2, 3.4, 'Minimize', () => { scr.classList.remove('cams'); clippy('Minimized. It is still recording. It is ALWAYS recording.'); });
  hot('cam', 90.5, 8, 2.2, 3.4, 'Maximize', () => clippy("It's already as big as it gets. Like my eyes."));

  // ---------- open / close ----------
  let clockIv = 0;
  function open() { root.classList.add('open'); scr.classList.remove('cams'); tick(); clearInterval(clockIv); clockIv = setInterval(tick, 15000); idleClippy();
    try { const v = G('painWheelVipPc', 0) || 0; localStorage.setItem('painWheelVipPc', JSON.stringify(v + 1)); } catch (e) {} }
  function close() { root.classList.remove('open'); clearInterval(clockIv); scr.querySelectorAll('.w98').forEach(w => w.remove()); closeStart(); }
  $('pcLeave').onclick = close;
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('open')) { e.stopImmediatePropagation(); if (scr.querySelector('.w98')) scr.querySelectorAll('.w98').forEach(w => w.remove()); else if (scr.classList.contains('cams')) scr.classList.remove('cams'); else close(); } }, true);
  window.openVipPc = open;

  // ---------- the right monitor in the VIP room ----------
  const mon = document.querySelector('[data-label="🖥️ Monitor #3 (also the wheel)"]');
  if (mon && has811()) {
    mon.removeAttribute('data-vsay'); mon.dataset.label = "🖥️ Monitor #3 (degen1350's computer)"; mon.title = "degen1350's computer";
    const scrEl = mon.parentElement.querySelectorAll('.vipScr')[1];
    if (scrEl) { Object.assign(scrEl.style, { left: '55.05%', top: '47.4%', width: '8.3%', height: '13.5%' }); scrEl.innerHTML = ''; scrEl.style.background = '#000 url(media/pc_monitor.webp) center / 100% 100% no-repeat'; scrEl.style.filter = 'brightness(1.08)'; }
    mon.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); open(); }, true);
  }
})();
