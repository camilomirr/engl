// =========================================================
// NVISION PC WORKSHOP - Efectos de sonido (Fase 7)
// Todo sintetizado con WebAudio: ningun archivo de audio,
// ninguna licencia que anotar. Cada funcion es segura de
// llamar aunque el navegador bloquee el audio o no exista
// AudioContext (no-op silencioso).
// =========================================================
let ctx = null, master = null, enabled = true;
export function setSoundEnabled(on) { enabled = !!on; }
export function soundEnabled() { return enabled; }
function ac() {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.14;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch (e) { return null; }
}
function tone(freq, dur, type, vol, when, slideTo) {
  const c = ac(); if (!c) return;
  try {
    const t0 = c.currentTime + (when || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  } catch (e) {}
}
function noise(dur, vol, when) {
  const c = ac(); if (!c) return;
  try {
    const t0 = c.currentTime + (when || 0);
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
    const g = c.createGain(); g.gain.value = vol || 0.25;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  } catch (e) {}
}
export const sfx = {
  click() { tone(660, 0.06, 'triangle', 0.35); },
  snap() { noise(0.07, 0.5); tone(190, 0.09, 'square', 0.22, 0, 90); },
  ratchet() { noise(0.045, 0.4); noise(0.045, 0.3, 0.07); },
  paste() { tone(300, 0.12, 'sine', 0.3, 0, 180); },
  error() { tone(160, 0.16, 'sawtooth', 0.3); tone(120, 0.2, 'sawtooth', 0.25, 0.05); },
  beep() { tone(880, 0.12, 'square', 0.28); },
  powerOk() { tone(523, 0.1, 'triangle', 0.35); tone(784, 0.14, 'triangle', 0.35, 0.09); },
  cash() { tone(988, 0.09, 'square', 0.22); tone(1319, 0.16, 'square', 0.22, 0.08); },
  deliver() { tone(523, 0.1, 'triangle', 0.35); tone(659, 0.1, 'triangle', 0.35, 0.09); tone(784, 0.18, 'triangle', 0.4, 0.18); }
};
