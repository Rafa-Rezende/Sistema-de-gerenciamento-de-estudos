// O index.html publicado tem de ser exatamente o código revisado em src/.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { montar, SAIDA } = require('../montar.js');

test('index.html é igual ao que sai de src/', () => {
  assert.equal(fs.readFileSync(SAIDA, 'utf8'), montar());
});

test('o planejador carrega antes do app', () => {
  const html = montar();
  assert.ok(html.indexOf('root.RotaPlanner =') < html.indexOf('const P = window.RotaPlanner'));
});

test('a página só carrega scripts de fora dos CDNs permitidos pelo claude.ai', () => {
  const srcs = [...montar().matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
  for (const s of srcs) assert.match(s, /^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net\/npm|unpkg\.com)\//);
});

test('sem alert, confirm ou prompt (o artefato não mostra esses diálogos)', () => {
  assert.doesNotMatch(fs.readFileSync(require.resolve('../src/app.js'), 'utf8'), /\b(alert|confirm|prompt)\(/);
});
