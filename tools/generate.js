#!/usr/bin/env node
// Builds assets/puzzle-data.js: a compact crossword of 40 Gibson answers and a
// word search hiding the same 40 answers. Deterministic for a given --seed.
//
//   node tools/generate.js [--seed 4] [--trials 1500]

const fs = require('fs');
const path = require('path');
const pool = require('./words');

const WORD_COUNT = 40;
const MAX_PER_SOURCE = 8;

const args = process.argv.slice(2);
const argVal = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const SEED = argVal('--seed', 4);
const TRIALS = argVal('--trials', 1500);

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const entries = pool.map((e) => ({
  ...e,
  answer: e.display.toUpperCase().replace(/[^A-Z]/g, ''),
  enumeration: e.display.split(/[\s]+/).map((p) => p.replace(/[^A-Za-z]/g, '').length).join(','),
}));

// ---------------------------------------------------------------- crossword

class Grid {
  constructor() { this.cells = new Map(); this.placed = []; this.minR = 0; this.maxR = -1; this.minC = 0; this.maxC = -1; }
  key(r, c) { return r + ',' + c; }
  get(r, c) { return this.cells.get(this.key(r, c)); }
  bboxWith(r, c, dir, len) {
    const r2 = dir === 'down' ? r + len - 1 : r;
    const c2 = dir === 'across' ? c + len - 1 : c;
    if (!this.placed.length) return { h: r2 - r + 1, w: c2 - c + 1 };
    return {
      h: Math.max(this.maxR, r2) - Math.min(this.minR, r) + 1,
      w: Math.max(this.maxC, c2) - Math.min(this.minC, c) + 1,
    };
  }
  // Returns number of crossings, or -1 if the word cannot go here.
  check(word, r, c, dir) {
    const dr = dir === 'down' ? 1 : 0, dc = dir === 'across' ? 1 : 0;
    if (this.get(r - dr, c - dc) || this.get(r + dr * word.length, c + dc * word.length)) return -1;
    let crossings = 0;
    for (let i = 0; i < word.length; i++) {
      const rr = r + dr * i, cc = c + dc * i;
      const cell = this.get(rr, cc);
      if (cell) {
        if (cell.ch !== word[i] || cell[dir]) return -1;
        crossings++;
      } else if (this.get(rr + dc, cc + dr) || this.get(rr - dc, cc - dr)) {
        return -1; // would sit flush beside a parallel word
      }
    }
    return crossings;
  }
  place(entry, r, c, dir) {
    const word = entry.answer;
    const dr = dir === 'down' ? 1 : 0, dc = dir === 'across' ? 1 : 0;
    for (let i = 0; i < word.length; i++) {
      const k = this.key(r + dr * i, c + dc * i);
      const cell = this.cells.get(k) || { ch: word[i] };
      cell[dir] = true;
      this.cells.set(k, cell);
    }
    if (!this.placed.length) { this.minR = this.maxR = r; this.minC = this.maxC = c; }
    this.minR = Math.min(this.minR, r); this.minC = Math.min(this.minC, c);
    this.maxR = Math.max(this.maxR, r + dr * (word.length - 1));
    this.maxC = Math.max(this.maxC, c + dc * (word.length - 1));
    this.placed.push({ entry, r, c, dir });
  }
  candidates(word) {
    const out = [];
    for (const [k, cell] of this.cells) {
      const [r, c] = k.split(',').map(Number);
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== cell.ch) continue;
        if (!cell.across) out.push({ r, c: c - i, dir: 'across' });
        if (!cell.down) out.push({ r: r - i, c, dir: 'down' });
      }
    }
    return out;
  }
}

function buildCrossword(rand, maxW, maxH) {
  const g = new Grid();
  const required = entries.filter((e) => e.required);
  const optional = entries.filter((e) => !e.required).sort(() => rand() - 0.5);
  const perSource = {};
  const first = required[Math.floor(rand() * required.length)];
  g.place(first, 0, 0, rand() < 0.5 ? 'across' : 'down');
  perSource[first.src] = 1;
  const remaining = new Set([...required, ...optional].filter((e) => e !== first));

  while (g.placed.length < WORD_COUNT) {
    const needRequired = required.some((e) => remaining.has(e));
    let best = null;
    for (const e of remaining) {
      if (needRequired && !e.required) continue;
      if ((perSource[e.src] || 0) >= MAX_PER_SOURCE) continue;
      for (const p of g.candidates(e.answer)) {
        const x = g.check(e.answer, p.r, p.c, p.dir);
        if (x < 1) continue;
        const bb = g.bboxWith(p.r, p.c, p.dir, e.answer.length);
        if (bb.w > maxW || bb.h > maxH) continue;
        const grow = bb.w * bb.h - (g.maxR - g.minR + 1) * (g.maxC - g.minC + 1);
        const score = x * 12 + e.answer.length * 0.6 - grow * 0.35 + rand() * 6;
        if (!best || score > best.score) best = { score, e, ...p };
      }
    }
    if (!best) return null;
    g.place(best.e, best.r, best.c, best.dir);
    perSource[best.e.src] = (perSource[best.e.src] || 0) + 1;
    remaining.delete(best.e);
  }
  return g;
}

function finalizeCrossword(g) {
  const rows = g.maxR - g.minR + 1, cols = g.maxC - g.minC + 1;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (const [k, cell] of g.cells) {
    const [r, c] = k.split(',').map(Number);
    grid[r - g.minR][c - g.minC] = cell.ch;
  }
  const starts = new Map();
  for (const p of g.placed) {
    const k = (p.r - g.minR) + ',' + (p.c - g.minC);
    if (!starts.has(k)) starts.set(k, []);
    starts.get(k).push(p);
  }
  const clues = { across: [], down: [] };
  let n = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ps = starts.get(r + ',' + c);
      if (!ps) continue;
      n++;
      for (const p of ps) {
        clues[p.dir].push({
          number: n, row: r, col: c,
          answer: p.entry.answer, display: p.entry.display,
          enumeration: p.entry.enumeration, clue: p.entry.clue, source: p.entry.src,
        });
      }
    }
  }
  const crossings = [...g.cells.values()].filter((c) => c.across && c.down).length;
  return { rows, cols, grid: grid.map((row) => row.map((ch) => ch || '.').join('')), clues, crossings };
}

let bestCw = null;
for (let t = 0; t < TRIALS; t++) {
  const rand = mulberry32(SEED * 100003 + t);
  const size = 15 + Math.floor(rand() * 8); // try 15..22 square-ish bounds
  const g = buildCrossword(rand, size + (rand() < 0.5 ? 0 : 2), size);
  if (!g) continue;
  const cw = finalizeCrossword(g);
  const aspect = Math.max(cw.rows, cw.cols) / Math.min(cw.rows, cw.cols);
  const score = cw.rows * cw.cols * (1 + (aspect - 1) * 0.5) - cw.crossings * 3;
  if (!bestCw || score < bestCw.score) bestCw = { ...cw, score };
}
if (!bestCw) throw new Error('No crossword fit; raise --trials or loosen bounds');

// -------------------------------------------------------------- word search

const words = [...bestCw.clues.across, ...bestCw.clues.down].map((c) => c.answer);
const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];

function countOccurrences(grid, n, word) {
  let count = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) for (const [dr, dc] of DIRS) {
    let i = 0;
    while (i < word.length) {
      const rr = r + dr * i, cc = c + dc * i;
      if (rr < 0 || cc < 0 || rr >= n || cc >= n || grid[rr][cc] !== word[i]) break;
      i++;
    }
    if (i === word.length) count++;
  }
  return count;
}

function buildWordSearch(rand, n) {
  const grid = Array.from({ length: n }, () => Array(n).fill(null));
  const placements = [];
  const order = [...words].sort((a, b) => b.length - a.length || rand() - 0.5);
  for (const w of order) {
    let best = null;
    for (let attempt = 0; attempt < 400; attempt++) {
      const [dr, dc] = DIRS[Math.floor(rand() * DIRS.length)];
      const r = Math.floor(rand() * n), c = Math.floor(rand() * n);
      const er = r + dr * (w.length - 1), ec = c + dc * (w.length - 1);
      if (er < 0 || ec < 0 || er >= n || ec >= n) continue;
      let overlap = 0, ok = true;
      for (let i = 0; i < w.length; i++) {
        const ch = grid[r + dr * i][c + dc * i];
        if (ch && ch !== w[i]) { ok = false; break; }
        if (ch) overlap++;
      }
      if (!ok || overlap === w.length) continue;
      const score = overlap * 3 + rand();
      if (!best || score > best.score) best = { score, r, c, dr, dc };
    }
    if (!best) return null;
    for (let i = 0; i < w.length; i++) grid[best.r + best.dr * i][best.c + best.dc * i] = w[i];
    placements.push({ word: w, row: best.r, col: best.c, dr: best.dr, dc: best.dc });
  }
  // Filler drawn from the answers' own letters so hidden words don't stand out.
  const letters = words.join('');
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!grid[r][c]) grid[r][c] = letters[Math.floor(rand() * letters.length)];
  }
  for (const w of words) {
    const palindrome = w === [...w].reverse().join('');
    if (countOccurrences(grid, n, w) !== (palindrome ? 2 : 1)) return null;
  }
  return { size: n, grid: grid.map((row) => row.join('')), placements };
}

let ws = null;
for (let n = 18; !ws && n <= 24; n++) {
  for (let t = 0; t < 300 && !ws; t++) ws = buildWordSearch(mulberry32(SEED * 7919 + n * 1000 + t), n);
}
if (!ws) throw new Error('No word search fit');

// ------------------------------------------------------------------- output

const { score, ...crossword } = bestCw;
const data = { seed: SEED, crossword, wordsearch: ws };
const out = path.join(__dirname, '..', 'assets', 'puzzle-data.js');
fs.writeFileSync(out, '// Generated by tools/generate.js -- do not edit by hand.\nwindow.PUZZLE = ' + JSON.stringify(data, null, 1) + ';\n');

console.log(`Crossword ${crossword.rows}x${crossword.cols}, ${crossword.crossings} crossings, ` +
  `${crossword.clues.across.length} across / ${crossword.clues.down.length} down`);
console.log(crossword.grid.join('\n'));
console.log(`\nWord search ${ws.size}x${ws.size}`);
console.log(ws.grid.join('\n'));
const bySrc = {};
for (const c of [...crossword.clues.across, ...crossword.clues.down]) bySrc[c.source] = (bySrc[c.source] || 0) + 1;
console.log('\n', bySrc);
