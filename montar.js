// Monta o Rota de Estudos a partir de src/, em dois destinos:
//
//   index.html  a página publicada como artefato no claude.ai (dados no banco do artefato)
//   publico/    o site no Vercel (dados no Supabase, login por código no e-mail, ícones e manifesto)
//
// O código vive separado em src/ para poder ser lido, testado e revisado:
//   pagina.html   título, fontes, CSS (tokens do tema) e a estrutura fixa
//   planejador.js o planejador, função pura (testada em test/)
//   app.js        telas, dados, imprevistos, login e calendário
//
// Uso:
//   node montar.js              grava index.html e publico/
//   node montar.js --verificar  só confere se index.html está em dia (publico/ não vai para o git)
//
// Configuração do site: config.json, ou as variáveis ROTA_SUPABASE_URL e ROTA_SUPABASE_ANON_KEY
// (a chave "anon" do Supabase é pública por natureza: quem protege os dados são as regras do banco).
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = __dirname;
const SRC = path.join(RAIZ, 'src');
const SAIDA = path.join(RAIZ, 'index.html');
const PUBLICO = path.join(RAIZ, 'publico');
const MARCA = path.join(RAIZ, 'marca');

const ler = nome => fs.readFileSync(path.join(SRC, nome), 'utf8').replace(/\n$/, '');
const scripts = () => `<script>\n${ler('planejador.js')}\n</script>\n<script>\n${ler('app.js')}\n</script>\n`;

function montar() {
  return fs.readFileSync(path.join(SRC, 'pagina.html'), 'utf8') + scripts();
}

function config() {
  let arq = {};
  const f = path.join(RAIZ, 'config.json');
  if (fs.existsSync(f)) arq = JSON.parse(fs.readFileSync(f, 'utf8'));
  return {
    supabaseUrl: process.env.ROTA_SUPABASE_URL || arq.supabaseUrl || '',
    supabaseAnonKey: process.env.ROTA_SUPABASE_ANON_KEY || arq.supabaseAnonKey || '',
  };
}

const COR_PAPEL = '#FAF8F3';

function montarSite(conf = config()) {
  // o claude.ai embrulha o artefato num documento com este mínimo; no site, fazemos nós
  const cabeca = [
    '<!doctype html>', '<html lang="pt-BR">', '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
    '<title>Rota de Estudos</title>',
    '<meta name="description" content="Planejador pessoal de estudos: aulas em partes de 30 min, prazos, imprevistos e treino de código.">',
    `<meta name="theme-color" content="${COR_PAPEL}">`,
    '<link rel="icon" href="/rota-favicon.svg" type="image/svg+xml">',
    '<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/manifest.webmanifest">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-title" content="Rota">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
    '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px/1.45 system-ui,-apple-system,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>',
    `<script>window.ROTA_CONFIG=${JSON.stringify(conf).replace(/</g, '\\u003c')};</script>`,
    '</head>', '<body>',
  ].join('\n');
  return `${cabeca}\n${fs.readFileSync(path.join(SRC, 'pagina.html'), 'utf8')}${scripts()}</body>\n</html>\n`;
}

const MANIFESTO = {
  name: 'Rota de Estudos', short_name: 'Rota', lang: 'pt-BR',
  start_url: '/', scope: '/', display: 'standalone',
  background_color: COR_PAPEL, theme_color: COR_PAPEL,
  icons: [
    { src: '/rota-icone-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/rota-icone-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/rota-icone.svg', sizes: 'any', type: 'image/svg+xml' },
  ],
};
const ICONES = ['rota-icone.svg', 'rota-favicon.svg', 'rota-icone-192.png', 'rota-icone-512.png', 'apple-touch-icon.png', 'favicon-32.png', 'favicon-48.png'];

function gravarSite() {
  fs.rmSync(PUBLICO, { recursive: true, force: true });
  fs.mkdirSync(PUBLICO);
  fs.writeFileSync(path.join(PUBLICO, 'index.html'), montarSite());
  fs.writeFileSync(path.join(PUBLICO, 'manifest.webmanifest'), JSON.stringify(MANIFESTO, null, 2) + '\n');
  for (const f of ICONES) fs.copyFileSync(path.join(MARCA, f), path.join(PUBLICO, f));
  const c = config();
  if (!c.supabaseUrl || !c.supabaseAnonKey) console.warn('Aviso: Supabase sem configuração; o site vai pedir para configurar.');
}

if (require.main === module) {
  const html = montar();
  if (process.argv.includes('--verificar')) {
    const atual = fs.existsSync(SAIDA) ? fs.readFileSync(SAIDA, 'utf8') : '';
    if (atual !== html) {
      console.error('index.html está desatualizado: rode npm run montar');
      process.exit(1);
    }
  } else {
    fs.writeFileSync(SAIDA, html);
    gravarSite();
  }
}

module.exports = { montar, montarSite, MANIFESTO, ICONES, SAIDA };
