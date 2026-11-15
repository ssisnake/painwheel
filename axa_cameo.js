// ---- Axazon hides in the background of every place. ONE hiding spot per place, and once you catch him there he's gone for good.
// Every catch lands on the 8/11 Security Camera Archive (the VIP room's right monitor, vip_pc.js) in the order you found them.
// A page sets window.AXA_CAMEO to one spot (or an array of spots). AXA_PLACES is the master list (keep it in sync with the pages + the spoilers file).
window.AXA_PLACES = {   // x/y/w: % of that place's picture (top-left of the sprite); ar: picture width / height; bg: the picture the camera shows
  board:    { name: 'The Board',      bg: 'media/board_bg.jpg',         x: 90.55, y: 36,   w: 1.8, ar: 2.357, op: .5 },
  shack:    { name: 'The Shack',      bg: 'media/shack_interior.jpg',   x: 46.1,  y: 40,   w: 2.5, ar: 1.791, op: .5, flip: true },
  '811':    { name: 'The 8/11',       bg: 'media/store811_bg.jpg',      x: 96.4,  y: 82,   w: 2.6, ar: 1.778, op: .55, flip: true },
  gnome:    { name: 'Gnome Depot',    bg: 'media/gnome_bg.jpg',         x: 12.4,  y: 36.5, w: 2.1, ar: 1.778, op: .42 },
  emporium: { name: "Axazon's Emporium", bg: 'media/emporium_bg.jpg',   x: 97.3,  y: 35,   w: 1.8, ar: 1.792, op: .45, flip: true },
  yacht:    { name: "Gallywix's Yacht", bg: 'media/yacht_interior.webp', x: 2.6,  y: 34,   w: 3.2, ar: 2.357, op: .45 },
  vip:      { name: 'The VIP Room',   bg: 'media/vip_room.webp',        x: 64.3,  y: 69.5, w: 1.5, ar: 2.357, op: .55 }
};
(function () {
  const spots = [].concat(window.AXA_CAMEO || []); if (!spots.length) return;
  let seen = {}; try { seen = JSON.parse(localStorage.getItem('painWheelAxaSightings')) || {}; } catch (e) {}
  const SPOTS = Object.keys(window.AXA_PLACES);
  const LINES = ["...you didn't see me.", 'Nothing to see here. Keep investigating. Not me though.', "I'm not here. I'm at the flea market. Ask anyone.", 'Shh. I am a background character.', 'Was it me this whole time? ...Maybe.', 'Wrong guy. Totally different halo.'];
  const ALL = ['Okay. You found me everywhere. ...Everywhere you KNOW about.', 'Fine. Every hiding spot. You win nothing. I win nothing. We are all losers here.', 'All of them? Who told you? Was it the skeleton? It was the skeleton.'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  spots.forEach((spot) => {
    if (seen[spot.id]) return;   // caught here already: he never comes back to a burned hiding spot
    if (Math.random() > .4) return;   // and he isn't there every visit. You have to be paying attention
    const host = document.querySelector(spot.host); if (!host) return;
    const P = window.AXA_PLACES[spot.id] || {}, S = Object.assign({}, P, spot);
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Something in the background');
    b.style.cssText = `position:absolute;left:${S.x}%;top:${S.y}%;width:${S.w}%;padding:0;border:0;background:none;cursor:pointer;z-index:${S.z || 1};opacity:0;transition:opacity 2.5s, transform .6s;${S.clip ? 'clip-path:' + S.clip + ';' : ''}`;
    b.innerHTML = `<img src="media/axa_peek.png" alt="" style="display:block;width:100%;height:auto;image-rendering:pixelated;${S.flip ? 'transform:scaleX(-1);' : ''}filter:${S.filter || 'brightness(.55) saturate(.6)'}">`;
    new Image().src = 'media/axa_duck.png';
    host.appendChild(b); setTimeout(() => b.style.opacity = String(S.op || .9), 1500);
    b.onclick = (e) => {
      e.stopPropagation(); seen[spot.id] = Date.now(); try { localStorage.setItem('painWheelAxaSightings', JSON.stringify(seen)); } catch (err) {}
      const n = SPOTS.filter(k => seen[k]).length, t = document.createElement('div');
      const all = n >= SPOTS.length; if (all) { try { if (!localStorage.getItem('painWheelAxaAll')) localStorage.setItem('painWheelAxaAll', JSON.stringify(Date.now())); } catch (err) {} }
      t.textContent = (all ? pick(ALL) : pick(LINES)) + `  📹 Caught on camera (${n})`;
      t.style.cssText = `position:absolute;left:${Math.min(S.x, 80)}%;top:${Math.max(0, S.y - 6)}%;transform:translateX(-30%);z-index:30;max-width:320px;padding:8px 12px;border-radius:10px;background:#1c1712;border:2px solid #a16207;color:#fde68a;font:800 16px/1.3 system-ui,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.6);pointer-events:none`;
      host.appendChild(t); b.querySelector('img').src = 'media/axa_duck.png'; setTimeout(() => { b.style.opacity = '0'; }, 500); setTimeout(() => { t.remove(); b.remove(); }, 3600);
    };
  });
})();
