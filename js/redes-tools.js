// NVISION - Herramientas de redes: calculadora de subredes IPv4 y conversor de bases.
// Sin dependencias; respeta el idioma del sitio (localStorage user_lang).
(function () {
  'use strict';

  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { priv: 'Privada', pub: 'Pública', invalidIp: 'Revisa la dirección IP: usa 4 números entre 0 y 255 separados por puntos.', invalidVal: 'Valor no válido para la base elegida.', host: 'host', hosts: 'hosts' },
    en: { priv: 'Private', pub: 'Public', invalidIp: 'Check the IP address: use 4 numbers between 0 and 255 separated by dots.', invalidVal: 'Invalid value for the chosen base.', host: 'host', hosts: 'hosts' }
  }[lang];

  function $(id) { return document.getElementById(id); }
  function pad8(n) { var s = n.toString(2); while (s.length < 8) s = '0' + s; return s; }

  function parseIp(str) {
    var parts = String(str || '').trim().split('.');
    if (parts.length !== 4) return null;
    var out = [];
    for (var i = 0; i < 4; i++) {
      if (!/^\d{1,3}$/.test(parts[i])) return null;
      var v = parseInt(parts[i], 10);
      if (v > 255) return null;
      out.push(v);
    }
    return out;
  }
  function toNum(o) { return ((o[0] * 256 + o[1]) * 256 + o[2]) * 256 + o[3]; }
  function toOctets(n) { return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256]; }
  function dotted(o) { return o.join('.'); }
  function maskFromPrefix(p) {
    var o = [0, 0, 0, 0];
    for (var i = 0; i < 4; i++) {
      var bits = Math.max(0, Math.min(8, p - i * 8));
      o[i] = bits === 0 ? 0 : 256 - Math.pow(2, 8 - bits);
    }
    return o;
  }
  function ipClass(first) { return first < 128 ? 'A' : first < 192 ? 'B' : first < 224 ? 'C' : first < 240 ? 'D' : 'E'; }
  function isPrivate(o) { return o[0] === 10 || (o[0] === 172 && o[1] >= 16 && o[1] <= 31) || (o[0] === 192 && o[1] === 168) || (o[0] === 169 && o[1] === 254); }
  function fmtNum(n) { return n.toLocaleString(lang === 'en' ? 'en-US' : 'es-CO'); }

  function setOut(id, val) { var el = $(id); if (el) el.textContent = val; }

  function computeSubnet() {
    var ip = parseIp($('rt-ip').value);
    var prefix = parseInt($('rt-prefix').value, 10);
    setOut('rt-prefix-val', '/' + prefix);
    var err = $('rt-error');
    var mask = maskFromPrefix(prefix);
    setOut('rt-mask', dotted(mask));
    if (!ip) {
      err.textContent = T.invalidIp;
      err.classList.add('on');
      ['rt-net', 'rt-bcast', 'rt-first', 'rt-last', 'rt-hosts', 'rt-wild', 'rt-class', 'rt-type', 'rt-bin'].forEach(function (id) { setOut(id, '—'); });
      return;
    }
    err.classList.remove('on');
    var block = Math.pow(2, 32 - prefix);
    var ipN = toNum(ip);
    var netN = Math.floor(ipN / block) * block;
    var bcastN = netN + block - 1;
    var firstN, lastN, usable;
    if (prefix >= 32) { firstN = lastN = ipN; usable = 1; }
    else if (prefix === 31) { firstN = netN; lastN = bcastN; usable = 2; }
    else { firstN = netN + 1; lastN = bcastN - 1; usable = block - 2; }
    setOut('rt-net', dotted(toOctets(netN)));
    setOut('rt-bcast', dotted(toOctets(bcastN)));
    setOut('rt-first', dotted(toOctets(firstN)));
    setOut('rt-last', dotted(toOctets(lastN)));
    setOut('rt-hosts', fmtNum(usable));
    setOut('rt-wild', dotted(mask.map(function (m) { return 255 - m; })));
    setOut('rt-class', ipClass(ip[0]));
    setOut('rt-type', isPrivate(ip) ? T.priv : T.pub);
    setOut('rt-bin', ip.map(pad8).join('.'));
  }

  function computeConv() {
    var raw = String($('rt-conv-value').value || '').trim();
    var base = $('rt-conv-base').value;
    var err = $('rt-conv-error');
    var n = null;
    if (raw) {
      if (base === 'dec' && /^\d+$/.test(raw)) n = parseInt(raw, 10);
      else if (base === 'bin' && /^[01]+$/.test(raw)) n = parseInt(raw, 2);
      else if (base === 'hex' && /^[0-9a-fA-F]+$/.test(raw)) n = parseInt(raw, 16);
      else if (base === 'oct' && /^[0-7]+$/.test(raw)) n = parseInt(raw, 8);
      if (n !== null && (n < 0 || n > 4294967295)) n = null;
    }
    if (n === null) {
      if (raw) { err.textContent = T.invalidVal; err.classList.add('on'); } else { err.classList.remove('on'); }
      ['rt-c-dec', 'rt-c-bin', 'rt-c-hex', 'rt-c-oct'].forEach(function (id) { setOut(id, '—'); });
      return;
    }
    err.classList.remove('on');
    var binStr = n.toString(2);
    while (binStr.length % 8 !== 0) binStr = '0' + binStr;
    setOut('rt-c-dec', fmtNum(n));
    setOut('rt-c-bin', binStr.replace(/(.{8})(?=.)/g, '$1 '));
    setOut('rt-c-hex', '0x' + n.toString(16).toUpperCase());
    setOut('rt-c-oct', n.toString(8));
  }

  ['rt-ip', 'rt-prefix'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('input', computeSubnet); });
  ['rt-conv-value', 'rt-conv-base'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('input', computeConv); });
  computeSubnet();
  computeConv();
})();
