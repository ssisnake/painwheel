// ---- the singing swordfish: "The Ghost of Gallows Reef" by kaazoom (Pixabay), cut down and squeezed through a cheap toy speaker ----
// fishSing(fallback): plays the shanty once (no stacking). Returns true if it's singing. fallback runs if the clip can't play.
(function () {
  let a = null;
  window.fishSing = function (fallback) {
    let vol = 0.6;
    try { const v = parseFloat(localStorage.getItem('painWheelVolume')); if (!isNaN(v)) vol = Math.max(0, Math.min(1, v)); if (localStorage.getItem('painWheelMuted') === 'true') vol = 0; } catch (e) {}
    if (!vol) return false;
    if (a && !a.paused && !a.ended) return true;   // already singing
    a = new Audio('media/audio_fish_shanty.mp3?v=3'); a.volume = 0.385 * vol;   // 30% quieter than before
    // the background music steps aside while he sings (every page's music listens to window.__wf), then comes back
    const was = window.__wf !== false; window.__fishSinging = true; window.__wf = false; dispatchEvent(new Event('wfchange'));
    const back = () => { if (!window.__fishSinging) return; window.__fishSinging = false; if (was && document.hasFocus()) { window.__wf = true; dispatchEvent(new Event('wfchange')); } };
    a.addEventListener('ended', back); a.addEventListener('pause', back); a.addEventListener('error', back);
    a.play().catch(() => { back(); a = null; if (fallback) fallback(); });
    return true;
  };
})();
