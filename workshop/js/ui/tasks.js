// =========================================================
// NVISION PC WORKSHOP - Panel de montaje (Fase 3)
// Barra de herramientas (mano, destornillador, pasta) y la
// lista de tareas de la pieza seleccionada, con su avance.
// La logica vive en core/assembly.js; esto solo pinta.
// =========================================================
import { TOOLS } from '../core/assembly.js';
import { currentLang } from './hud.js';

const STR = {
  es: { title: '🔧 Montaje paso a paso', tools: 'Herramientas', pick: 'Toca una pieza montada para ver sus tareas de montaje.', none: 'Sin tareas: esta pieza no necesita pasos extra.', doIt: 'Hacer el siguiente paso', allDone: '✅ Montaje de esta pieza completo', selected: 'Pieza: ' },
  en: { title: '🔧 Step-by-step assembly', tools: 'Tools', pick: 'Tap a mounted part to see its assembly tasks.', none: 'No tasks: this part needs no extra steps.', doIt: 'Do the next step', allDone: '✅ This part is fully assembled', selected: 'Part: ' }
};

export function createTasksPanel(handlers) {
  const $ = id => document.getElementById(id);
  const toolsEl = $('ws-tools'), listEl = $('ws-tasks-list'), btn = $('ws-task-btn'), titleEl = $('ws-tasks-part');
  let tool = 'hand';
  function paintTools() {
    if (!toolsEl) return;
    toolsEl.querySelectorAll('[data-tool]').forEach(b => b.classList.toggle('ws-tool--active', b.dataset.tool === tool));
  }
  if (toolsEl) toolsEl.querySelectorAll('[data-tool]').forEach(b =>
    b.addEventListener('click', () => { tool = b.dataset.tool; paintTools(); handlers.onTool(tool); }));
  if (btn) btn.addEventListener('click', () => handlers.onDo());
  paintTools();
  return {
    getTool() { return tool; },
    setView(view) {
      const s = STR[currentLang()];
      if (titleEl) titleEl.textContent = view && view.partName ? s.selected + view.partName : s.title;
      if (!listEl) return;
      listEl.innerHTML = '';
      if (!view || !view.partName) {
        listEl.innerHTML = '<p class="ws-note">' + s.pick + '</p>';
        if (btn) btn.classList.add('u-hidden');
        return;
      }
      if (!view.tasks.length) {
        listEl.innerHTML = '<p class="ws-note">' + s.none + '</p>';
        if (btn) btn.classList.add('u-hidden');
        return;
      }
      view.tasks.forEach(tk => {
        const row = document.createElement('div');
        row.className = 'ws-task-row' + (tk.done >= tk.count ? ' ws-task-row--done' : '');
        row.innerHTML = '<span>' + (tk.done >= tk.count ? '✅' : TOOLS[tk.tool].icon) + ' ' + tk.label + '</span><b>' + tk.done + ' / ' + tk.count + '</b>';
        listEl.appendChild(row);
      });
      if (btn) {
        const pending = view.tasks.some(tk => tk.done < tk.count);
        btn.classList.toggle('u-hidden', !pending);
        btn.textContent = '▶ ' + s.doIt;
        if (!pending) {
          const done = document.createElement('p');
          done.className = 'ws-note';
          done.textContent = s.allDone;
          listEl.appendChild(done);
        }
      }
    }
  };
}
export { STR as TASKS_STR };
