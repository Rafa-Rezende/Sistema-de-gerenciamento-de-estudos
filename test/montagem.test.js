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

test('o site leva a configuração antes do app, os ícones e o manifesto', () => {
  const { montarSite } = require('../montar.js');
  const html = montarSite({ supabaseUrl: 'https://abc.supabase.co', supabaseAnonKey: 'chave</script>' });
  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.indexOf('window.ROTA_CONFIG') < html.indexOf('const P = window.RotaPlanner'));
  assert.ok(!html.includes('chave</script>'), 'config não pode fechar a tag script');
  assert.match(html, /rel="manifest"/);
  assert.match(html, /rel="apple-touch-icon"/);
});

test('o artefato do claude.ai não leva configuração do site', () => {
  assert.ok(!montar().includes('window.ROTA_CONFIG='));
});

test('todo ícone do manifesto e do site existe em marca/', () => {
  const { MANIFESTO, ICONES } = require('../montar.js');
  const path = require('node:path');
  for (const f of ICONES) assert.ok(fs.existsSync(path.join(__dirname, '..', 'marca', f)), f);
  for (const i of MANIFESTO.icons) assert.ok(ICONES.includes(i.src.slice(1)), i.src);
});
