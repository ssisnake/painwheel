// ---- Axazon hides in the background of important places. Was it him all along? ...maybe. ----
(function () {
  const spot = window.AXA_CAMEO; if (!spot) return;
  const host = document.querySelector(spot.host); if (!host) return;
  let seen = {}; try { seen = JSON.parse(localStorage.getItem('painWheelAxaSightings')) || {}; } catch (e) {}
  if (Math.random() > (seen[spot.id] ? .25 : .45)) return;   // not every visit. You have to be paying attention
  const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Something in the background');
  b.style.cssText = `position:absolute;left:${spot.x}%;top:${spot.y}%;width:${spot.w}%;padding:0;border:0;background:none;cursor:pointer;z-index:${spot.z || 1};opacity:0;transition:opacity 2.5s, transform .6s;${spot.clip ? 'clip-path:' + spot.clip + ';' : ''}`;
  b.innerHTML = `<img src="media/axa_peek.png" alt="" style="display:block;width:100%;height:auto;image-rendering:pixelated;${spot.flip ? 'transform:scaleX(-1);' : ''}filter:${spot.filter || 'brightness(.55) saturate(.6)'}">`;
  new Image().src = 'media/axa_duck.png';   // the ducking frame, ready
  host.appendChild(b); setTimeout(() => b.style.opacity = String(spot.op || .9), 1500);
  const LINES = ["...you didn't see me.", 'Nothing to see here. Keep investigating. Not me though.', "I'm not here. I'm at the flea market. Ask anyone.", 'Shh. I am a background character.', 'Was it me this whole time? ...Maybe.', 'Wrong guy. Totally different halo.'];
  b.onclick = (e) => {
    e.stopPropagation(); seen[spot.id] = Date.now(); try { localStorage.setItem('painWheelAxaSightings', JSON.stringify(seen)); } catch (err) {}
    const n = Object.keys(seen).length, t = document.createElement('div');
    t.textContent = LINES[Math.floor(Math.random() * LINES.length)] + (n > 1 ? `  (sightings: ${n})` : '');
    t.style.cssText = `position:absolute;left:${spot.x}%;top:${Math.max(0, spot.y - 6)}%;transform:translateX(-30%);z-index:30;max-width:320px;padding:8px 12px;border-radius:10px;background:#1c1712;border:2px solid #a16207;color:#fde68a;font:800 16px/1.3 system-ui,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.6);pointer-events:none`;
    host.appendChild(t); b.querySelector('img').src = 'media/axa_duck.png'; setTimeout(() => { b.style.opacity = '0'; }, 500); setTimeout(() => { t.remove(); b.remove(); }, 3600);
  };
})();
