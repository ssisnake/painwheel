window.pwAch = window.pwAch || ((id) => { try { const q = JSON.parse(localStorage.getItem('painWheelPendingAch') || '[]'); const a = JSON.parse(localStorage.getItem('painWheelAchievements') || '{}'); if (!q.includes(id) && !(a && a[id])) { q.push(id); localStorage.setItem('painWheelPendingAch', JSON.stringify(q)); } } catch (e) {} });   // the wheel hands out the trophy next time it's open
// ---- the singing swordfish: "The Ghost of Gallows Reef" by kaazoom (Pixabay), cut down and squeezed through a cheap toy speaker ----
// fishSing(fallback): plays the shanty once (no stacking). Returns true if it's singing. fallback runs if the clip can't play.
// While he sings, a popup shows Gary on his plaque flopping along like the real singing-fish plaque (frames by Ada: media/fishpop_1-5.webp):
// 1 = rest, 2 = mouth half open, 3 = mouth wide (singing), 4 = head turned out at you, 5 = tail flick.
(function () {
  let a = null, pop = null, anim = 0;
  const F = (n) => 'media/fishpop_' + n + '.webp';
  [1, 2, 3, 4, 5].forEach(n => { const i = new Image(); i.src = F(n); });
  function showPop() {
    if (!pop) {
      const css = document.createElement('style');
      css.textContent = `#fishPop { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%) translateY(140%); z-index: 9800; width: min(340px, 72vw); padding: 10px 12px 8px; border-radius: 14px; background: linear-gradient(170deg, #1c1410, #2a1d14); border: 3px solid #b45309; box-shadow: 0 14px 34px rgba(0,0,0,.7); text-align: center; transition: transform .45s cubic-bezier(.2,1.4,.4,1); pointer-events: auto; cursor: pointer; }
        #fishPop.on { transform: translateX(-50%) translateY(0); }
        #fishPop img { display: block; width: 100%; height: auto; image-rendering: pixelated; }
        #fishPop .cap { font: 800 15px/1.2 system-ui, sans-serif; color: #fde68a; margin-top: 2px; letter-spacing: .04em; }
        @media (prefers-reduced-motion: reduce) { #fishPop { transition: none; } }`;
      document.head.appendChild(css);
      pop = document.createElement('div'); pop.id = 'fishPop'; pop.setAttribute('role', 'status'); pop.title = 'Click to make him stop (he will not)';
      pop.innerHTML = `<img src="${F(1)}" alt="Gary the singing swordfish"><div class="cap">🎵 GARY IS SINGING 🎵</div>`;
      pop.onclick = () => { if (a) a.pause(); };
      document.body.appendChild(pop);
    }
    pop.style.display = 'block'; void pop.offsetWidth; pop.classList.add('on');
    const img = pop.querySelector('img');
    // the routine: the head swings out at you at the start, then mouth-flaps with the music, tail flicks, and swings out again near the end
    let t = 0, out = 0; clearInterval(anim);
    anim = setInterval(() => {
      if (!a) return; const ct = a.currentTime || 0, dur = a.duration || 15; t++;
      if (ct < 1.4 || (ct > dur - 3.2 && ct < dur - 1.2)) { img.src = F(4); out = 1; return; }
      if (out) { out = 0; img.src = F(1); return; }
      const r = Math.random();
      img.src = r < .08 ? F(5) : (t % 2 ? F(r < .55 ? 3 : 2) : F(1));
    }, 170);
  }
  function hidePop() {
    clearInterval(anim); if (!pop) return;
    pop.querySelector('img').src = F(5); setTimeout(() => { if (pop) pop.querySelector('img').src = F(1); }, 250);
    setTimeout(() => { if (pop) pop.classList.remove('on'); }, 700);
  }
  window.fishSing = function (fallback, who) {
    try {   // Something Smells Fishy: hear every singing swordfish (the Board, both on the yacht, Steve at the Emporium)
      const id = who || (/emporium/.test(location.pathname) ? 'emporium' : /yacht/.test(location.pathname) ? 'yacht' : 'board');
      const s = JSON.parse(localStorage.getItem('painWheelFishSung') || '{}') || {}; s[id] = 1; localStorage.setItem('painWheelFishSung', JSON.stringify(s));
      if (['board', 'yacht', 'yacht2', 'emporium'].every(k => s[k]) && window.pwAch) pwAch('fishy');
    } catch (e) {}
    let vol = 0.6;
    try { const v = parseFloat(localStorage.getItem('painWheelVolume')); if (!isNaN(v)) vol = Math.max(0, Math.min(1, v)); if (localStorage.getItem('painWheelMuted') === 'true') vol = 0; } catch (e) {}
    if (!vol) return false;
    if (a && !a.paused && !a.ended) return true;   // already singing
    a = new Audio('media/audio_fish_shanty.mp3?v=3'); a.volume = 0.385 * vol;
    // the background music steps aside while he sings (every page's music listens to window.__wf), then comes back
    const was = window.__wf !== false; window.__fishSinging = true; window.__wf = false; dispatchEvent(new Event('wfchange'));
    const back = () => { hidePop(); if (!window.__fishSinging) return; window.__fishSinging = false; if (was && document.hasFocus()) { window.__wf = true; dispatchEvent(new Event('wfchange')); } };
    a.addEventListener('ended', back); a.addEventListener('pause', back); a.addEventListener('error', back);
    a.addEventListener('playing', showPop, { once: true });
    a.play().catch(() => { back(); a = null; if (fallback) fallback(); });
    return true;
  };
})();
