// =========================================================
// NVISION PC WORKSHOP - Monitor del banco (Fase 4)
// La pantalla donde se ven el POST, la BIOS, la instalacion
// del sistema y el escritorio. Solo pinta; la logica de
// arranque vive en core/boot.js.
// =========================================================

export function createMonitor() {
  const screen = document.getElementById('ws-screen');
  let runId = 0;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  return {
    off(text) {
      runId++;
      if (screen) screen.innerHTML = '<p class="ws-line ws-line--dim">' + esc(text) + '</p>';
    },
    clear() { runId++; if (screen) screen.innerHTML = ''; return runId; },
    line(text, cls, id) {
      if (!screen || (id !== undefined && id !== runId)) return;
      const p = document.createElement('p');
      p.className = 'ws-line' + (cls ? ' ws-line--' + cls : '');
      p.textContent = text;
      screen.appendChild(p);
      screen.scrollTop = screen.scrollHeight;
    },
    async playLines(lines, lang, delayMs) {
      const id = this.clear();
      for (const ln of lines) {
        if (id !== runId) return false;
        this.line(typeof ln.text === 'string' ? ln.text : ln.text[lang], ln.level, id);
        await wait(delayMs || 320);
      }
      return id === runId;
    },
    fault(fault, lang) {
      if (!screen) return;
      const div = document.createElement('div');
      div.className = 'ws-fault';
      div.innerHTML = '<b>⛔ ' + esc(fault.title[lang]) + ' <small>[' + esc(fault.code) + ']</small></b><p>' + esc(fault.hint[lang]) + '</p>';
      screen.appendChild(div);
      screen.scrollTop = screen.scrollHeight;
    },
    desktop(html) {
      runId++;
      if (screen) screen.innerHTML = html;
    }
  };
}
