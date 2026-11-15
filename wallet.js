window.pwAch = window.pwAch || ((id) => { try { const q = JSON.parse(localStorage.getItem('painWheelPendingAch') || '[]'); const a = JSON.parse(localStorage.getItem('painWheelAchievements') || '{}'); if (!q.includes(id) && !(a && a[id])) { q.push(id); localStorage.setItem('painWheelPendingAch', JSON.stringify(q)); } } catch (e) {} });   // the wheel hands out the trophy next time it's open
// ---- shared header bits for the side pages: centered nav, gold on the right with a coin, and a money popup (wallet / vault / Goblin Express) ----
(function () {
  const g = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const num = (k) => Math.max(0, Number(g(k, 0)) || 0);
  const fmt = (n) => { n = Math.round(n); if (n < 1e15) return n.toLocaleString() + 'g'; const e = Math.floor(Math.log10(n)); return (n / Math.pow(10, e)).toFixed(2) + 'e' + e + 'g'; };
  const css = document.createElement('style');
  css.textContent = `
  header { display: grid !important; grid-template-columns: 1fr auto 1fr; align-items: center; }
  header h1 { grid-column: 1; grid-row: 1; justify-self: start; } header nav { grid-column: 2; grid-row: 1; justify-content: center; } header #goldBox { grid-column: 3; grid-row: 1; justify-self: end; }
  #bar nav { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; } #bar #goldBox { background: rgba(12,6,2,.86); border-color: rgba(250,204,21,.6); color: #fde047; font: 800 20px ui-monospace, monospace; }
  header nav a { font-size: 16px !important; padding: 7px 12px !important; white-space: nowrap; } header nav a.here { display: none; }
  header h1.logo-h1 { margin: 0; line-height: 0; } header h1.logo-h1 img { height: 64px; width: auto; image-rendering: pixelated; display: block; filter: drop-shadow(0 3px 4px rgba(0,0,0,.5)); }
  @media (max-width: 1000px) { header h1.logo-h1 img { height: 46px; } }
  nav a.plate { background: none !important; padding: 0 !important; border-radius: 8px; line-height: 0; transition: transform .12s, filter .12s; } nav a.plate img { height: 50px; width: auto; image-rendering: pixelated; display: block; }
  nav a.plate:hover, nav a.plate:focus-visible { transform: translateY(-1px); filter: brightness(1.15); outline: none; }
  @media (max-width: 1000px) { header { grid-template-columns: 1fr auto; } header nav { grid-column: 1 / -1; grid-row: 2; } header #goldBox { grid-column: 2; grid-row: 1; } }
  header h1 { white-space: nowrap; font-size: clamp(22px, 2.4vw, 32px) !important; }
  #goldBox { font: 800 20px ui-monospace, monospace !important; color: #fde047; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; padding: 6px 12px; border-radius: 10px; border: 2px solid transparent; transition: border-color .15s, background .15s; user-select: none; }
  #goldBox:hover, #goldBox:focus-visible { border-color: #facc15; background: rgba(250,204,21,.1); outline: none; }
  #goldBox img { height: 30px; width: auto; image-rendering: pixelated; filter: drop-shadow(0 2px 0 rgba(0,0,0,.5)); }
  #moneyPop { position: fixed; inset: 0; z-index: 80; display: none; align-items: center; justify-content: center; padding: 16px; background: rgba(0,0,0,.6); }
  #moneyPop.open { display: flex; }
  #moneyPop .box { width: min(440px, 100%); background: #1c1917; border: 3px solid #a16207; border-radius: 14px; padding: 18px; color: #fef3c7; box-shadow: 0 20px 60px rgba(0,0,0,.6); font: 18px system-ui, sans-serif; }
  #moneyPop h2 { margin: 0 0 12px; font-size: 24px; color: #facc15; display: flex; align-items: center; gap: 10px; } #moneyPop h2 img { height: 34px; image-rendering: pixelated; }
  #moneyPop .ln { display: flex; justify-content: space-between; gap: 12px; padding: 9px 2px; border-top: 1px solid #44403c; } #moneyPop .ln b { font-family: ui-monospace, monospace; color: #fde68a; }
  #moneyPop .ln.debt b { color: #fca5a5; } #moneyPop .ln.total { border-top: 2px solid #a16207; font-weight: 900; } #moneyPop .ln.total b { color: #4ade80; }
  #moneyPop .card { display: flex; gap: 12px; align-items: center; margin-top: 12px; padding: 10px; border-radius: 10px; background: #292524; } #moneyPop .card img { width: 96px; height: auto; border-radius: 6px; }
  #moneyPop .card small { color: #d6d3d1; font-size: 15px; line-height: 1.35; }
  #moneyPop button { display: block; margin: 14px auto 0; font: 800 18px system-ui, sans-serif; padding: 9px 22px; border-radius: 10px; border: 0; background: #f59e0b; color: #1c1917; cursor: pointer; }`;
  document.head.appendChild(css);
  // a button for every place you've unlocked (the page you're on is skipped)
  const st = () => (g('painWheelStats', {}) || {}).byType || {};
  const PLACES = [['./', '<img src="media/board_icon.png" alt="" style="display:inline-block;height:1.15em;width:auto;vertical-align:-.25em;margin-right:.25em;border-radius:2px">The Board', () => true, /^(\.\/|index\.html)$/],
    ['yacht.html', '🛥️ Yacht', () => g('painWheelHouseLevel', 0) >= 6, /^yacht\.html$/], ['shack.html', '🏚️ Shack', () => g('painWheelSeenClaw', false) || g('painWheelTokens', 0) > 0, /^shack\.html$/],
    ['811.html', '🏪 8/11', () => g('painWheel811Open', false) || st().SEVEN_ELEVEN > 0, /^811\.html$/], ['gnome.html', '🔨 Gnome Depot', () => g('painWheelSeenGnome', false) || g('painWheelGnomeNotice', false), /^gnome\.html$/],
    ['emporium.html', '🧺 Emporium', () => g('painWheelEmporiumOpen', false) || st().EMPORIUM > 0, /^emporium\.html$/],
    ['wheel.html', '🎡 Back to The Wheel', () => true, /^wheel\.html$/]];
  const nav = document.querySelector('header nav, #bar nav'), here = (location.pathname.split('/').pop() || 'index.html');
  if (nav) {
    [...nav.querySelectorAll('a')].forEach(a => { const h = a.getAttribute('href') || ''; if (PLACES.some(p => p[3].test(h))) a.remove(); });   // drop the old place links, keep page-specific buttons (like the catalog)
    const PLATE = { './': 'board', 'yacht.html': 'yacht', 'shack.html': 'shack', '811.html': '811', 'gnome.html': 'gnome', 'emporium.html': 'emporium', 'wheel.html': 'wheel' };
    PLACES.forEach(([href, label, ok, re]) => { if (!ok() || re.test(here)) return; const a = document.createElement('a'); a.href = href; a.className = 'plate'; a.title = label.replace(/<[^>]*>/g, '').trim(); a.innerHTML = `<img src="media/plate_${PLATE[href]}.png" alt="${a.title}">`; nav.appendChild(a); });
    const cat = document.getElementById('catalogBtn'); if (cat) { cat.className = 'plate'; cat.title = 'The whole catalog'; cat.innerHTML = '<img src="media/plate_catalog.png" alt="The whole catalog">'; nav.insertBefore(cat, nav.firstChild); }
  }
  const box = document.getElementById('goldBox'); if (!box) return;
  box.setAttribute('role', 'button'); box.tabIndex = 0; box.title = 'Your money';
  window.renderGoldBox = () => { box.innerHTML = `<img src="media/photo_coin_1.png" alt="">${fmt(num('painWheelGold'))}`; };
  renderGoldBox();
  addEventListener('storage', (e) => { if (/^painWheel(Gold|Vault|Debt)$/.test(e.key || '')) { renderGoldBox(); if (pop.classList.contains('open')) fill(); } });
  const pop = document.createElement('div'); pop.id = 'moneyPop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'true'); pop.setAttribute('aria-label', 'Your money');
  document.body.appendChild(pop);
  const TIER = (n) => n >= 50 ? ['black', 'Black'] : n >= 10 ? ['plat', 'Platinum'] : ['red', 'Red'];
  function fill() {
    const gold = num('painWheelGold'), vault = num('painWheelVault'), debt = num('painWheelDebt'), card = !!g('painWheelGoblinCard', false);
    const limit = Math.max(1000000, Math.round((gold + vault) * 0.5)), avail = Math.max(0, limit - debt), [tk, tn] = TIER(num('painWheelCardCharges'));
    pop.innerHTML = `<div class="box"><h2><img src="media/photo_coin_1.png" alt="">Your money</h2>
      <div class="ln"><span>💰 On hand</span><b>${fmt(gold)}</b></div>
      <div class="ln"><span>🏦 Guild Bank Vault</span><b>${fmt(vault)}</b></div>
      ${debt ? `<div class="ln debt"><span>💳 Goblin debt (400% APR)</span><b>−${fmt(debt)}</b></div>` : ''}
      <div class="ln total"><span>Net worth</span><b>${debt > gold + vault ? '−' : ''}${fmt(Math.abs(gold + vault - debt))}</b></div>
      ${card ? `<div class="card"><img src="media/photo_gx_${tk}.png" alt=""><div><b>Goblin Express ${tn}</b><br><small>Credit limit: <b style="color:#fde68a">${fmt(limit)}</b><br>Available: <b style="color:#4ade80">${fmt(avail)}</b><br>"Based on vibes." Half your net worth, at least 1M.</small></div></div>`
        : `<div class="card"><div><small>No Goblin Express card yet. The goblins will find you. They always do.</small></div></div>`}
      <button type="button" id="moneyX">Close</button></div>`;
    pop.querySelector('#moneyX').onclick = () => pop.classList.remove('open');
  }
  const open = () => { fill(); pop.classList.add('open'); };
  box.addEventListener('click', open); box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  pop.addEventListener('click', (e) => { if (e.target === pop) pop.classList.remove('open'); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') pop.classList.remove('open'); });
})();
