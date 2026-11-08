// =========================================================
// NVISION PC WORKSHOP - Benchmarks y compartir (Fase 6)
// Puntajes por uso, FPS estimados por juego y resolucion a
// partir del rendimiento real del catalogo, y el resumen
// de texto + codigo del equipo para compartir/importar.
// Logica pura.
// =========================================================
import { temps } from './boot.js';

const L = (es, en) => ({ es, en });
export const GAMES = [
  { id: 'esports', factor: 2.2, label: L('Esports competitivo', 'Competitive esports') },
  { id: 'aaa', factor: 1.0, label: L('Aventura AAA', 'AAA adventure') },
  { id: 'open', factor: 0.66, label: L('Mundo abierto pesado', 'Heavy open world') },
  { id: 'sim', factor: 0.55, label: L('Simulación exigente', 'Demanding simulation') }
];
const RES = [
  { id: '1080p', factor: 1 },
  { id: '1440p', factor: 0.68 },
  { id: '4K', factor: 0.4 }
];
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

export function scores(installed) {
  const cpu = installed.cpu, gpu = installed.gpu, ram = installed.ram, st = installed.storage;
  if (!cpu) return null;
  const dedicated = gpu && gpu.id !== 'gpu-none';
  const gpuGame = dedicated ? (gpu.perf.gaming || 0) : Math.round((cpu.perf.gaming || 0) * 0.22);
  const gpuWork = dedicated ? (gpu.perf.work || 0) : 15;
  const ramBonus = ram ? clamp((ram.specs.gb - 8) / 4, 0, 8) + (ram.specs.speed >= 6000 ? 3 : 0) : 0;
  const stScore = st ? (st.perf.score || 30) : 0;
  return {
    gaming: Math.round(clamp(gpuGame * 0.68 + (cpu.perf.gaming || 0) * 0.24 + ramBonus * 0.5, 0, 100)),
    work: Math.round(clamp((cpu.perf.work || 0) * 0.72 + ramBonus * 1.2 + stScore * 0.12, 0, 100)),
    creation: Math.round(clamp((cpu.perf.work || 0) * 0.45 + gpuWork * 0.3 + stScore * 0.15 + ramBonus, 0, 100))
  };
}

export function fpsTable(installed) {
  const cpu = installed.cpu, gpu = installed.gpu, ram = installed.ram;
  if (!cpu || !gpu) return [];
  const dedicated = gpu.id !== 'gpu-none';
  const base = dedicated ? (gpu.perf.fps || gpu.perf.gaming || 40) : 18;
  const cpuFactor = clamp((cpu.perf.gaming || 50) / 85, 0.78, 1.15);
  const ramFactor = !ram ? 0.9 : ram.specs.gb >= 32 ? 1.03 : ram.specs.gb >= 16 ? 1 : 0.92;
  return GAMES.map(g => {
    const at1080 = base * g.factor * cpuFactor * ramFactor;
    const row = { game: g.label };
    RES.forEach(r => { row[r.id] = Math.max(5, Math.round(at1080 * r.factor)); });
    return row;
  });
}

export function buildSummary(installed, system, lang) {
  const en = lang === 'en';
  const sc = scores(installed);
  const t = temps(installed);
  const cost = Object.values(installed).reduce((s, i) => s + (i.price || 0), 0);
  const lines = [];
  lines.push('🖥️ ' + (en ? 'My NVISION PC Workshop build' : 'Mi equipo de NVISION PC Workshop'));
  const order = ['case', 'board', 'cpu', 'cooler', 'ram', 'gpu', 'storage', 'psu'];
  const names = { case: en ? 'Case' : 'Gabinete', board: en ? 'Board' : 'Placa', cpu: 'CPU', cooler: en ? 'Cooler' : 'Refrigeración', ram: 'RAM', gpu: 'GPU', storage: en ? 'Storage' : 'Disco', psu: en ? 'PSU' : 'Fuente' };
  order.forEach(cat => { if (installed[cat]) lines.push('• ' + names[cat] + ': ' + installed[cat].name); });
  lines.push((en ? 'Total: $' : 'Total: $') + cost + ' · ' + (en ? 'Load temp: ' : 'Temp. en carga: ') + t.load + ' °C');
  if (sc) lines.push((en ? 'Scores — Gaming ' : 'Puntajes — Gaming ') + sc.gaming + ' · ' + (en ? 'Work ' : 'Trabajo ') + sc.work + ' · ' + (en ? 'Creation ' : 'Creación ') + sc.creation);
  const fps = fpsTable(installed);
  if (fps.length) lines.push('FPS 1080p: ' + fps.map(r => (en ? r.game.en : r.game.es) + ' ' + r['1080p']).join(' · '));
  lines.push('— nvision.social/workshop');
  return lines.join('\n');
}

export function buildCode(installed) {
  const order = ['case', 'board', 'cpu', 'cooler', 'ram', 'gpu', 'storage', 'psu'];
  return 'NVW1-' + order.map(cat => (installed[cat] ? installed[cat].id : '-')).join('.');
}
export function parseCode(code) {
  if (!code || !/^NVW1-/.test(code.trim())) return null;
  const order = ['case', 'board', 'cpu', 'cooler', 'ram', 'gpu', 'storage', 'psu'];
  const parts = code.trim().slice(5).split('.');
  if (parts.length !== order.length) return null;
  const out = {};
  order.forEach((cat, i) => { if (parts[i] && parts[i] !== '-') out[cat] = parts[i]; });
  return out;
}
