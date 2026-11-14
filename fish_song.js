// ---- the singing swordfish: "The Ghost of Gallows Reef" by kaazoom (Pixabay), cut down and squeezed through a cheap toy speaker ----
// fishSing(fallback): plays the shanty once (no stacking). Returns true if it's singing. fallback runs if the clip can't play.
(function () {
  let a = null;
  window.fishSing = function (fallback) {
    let vol = 0.6;
    try { const v = parseFloat(localStorage.getItem('painWheelVolume')); if (!isNaN(v)) vol = Math.max(0, Math.min(1, v)); if (localStorage.getItem('painWheelMuted') === 'true') vol = 0; } catch (e) {}
    if (!vol) return false;
    if (a && !a.paused && !a.ended) return true;   // already singing
    a = new Audio('media/audio_fish_shanty.mp3'); a.volume = 0.55 * vol;
    a.play().catch(() => { a = null; if (fallback) fallback(); });
    return true;
  };
})();
