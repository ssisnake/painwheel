// ---- hover a page's logo to see Ada's art up close (like the Uwutek portrait) ----
(function () {
  const pop = document.createElement('div');
  pop.style.cssText = 'position:fixed;z-index:9900;pointer-events:none;opacity:0;transform:scale(.85);transform-origin:top left;transition:opacity .18s, transform .18s;padding:10px;border-radius:14px;background:rgba(10,8,6,.92);border:2px solid #a16207;box-shadow:0 16px 40px rgba(0,0,0,.75)';
  const big = document.createElement('img'); big.alt = ''; big.style.cssText = 'display:block;height:auto;image-rendering:pixelated';
  pop.appendChild(big);
  const show = (img) => {
    if (!pop.isConnected) document.body.appendChild(pop);
    big.src = img.currentSrc || img.src;
    const r = img.getBoundingClientRect(), w = Math.min(560, innerWidth - 32, (img.naturalWidth || 600) * 1.1);
    big.style.width = w + 'px';
    pop.style.left = Math.max(12, Math.min(r.left, innerWidth - w - 36)) + 'px'; pop.style.top = (r.bottom + 10) + 'px';
    requestAnimationFrame(() => { pop.style.opacity = '1'; pop.style.transform = 'scale(1)'; });
  };
  const hide = () => { pop.style.opacity = '0'; pop.style.transform = 'scale(.85)'; };
  const hook = () => document.querySelectorAll('h1.logo-h1 img, #logoImg').forEach((img) => {
    if (img.dataset.zoom) return; img.dataset.zoom = '1';
    img.addEventListener('mouseenter', () => show(img)); img.addEventListener('mouseleave', hide);
  });
  hook(); setTimeout(hook, 1500);   // the wheel builds its logo a moment after load
  addEventListener('scroll', hide, { passive: true });
})();
