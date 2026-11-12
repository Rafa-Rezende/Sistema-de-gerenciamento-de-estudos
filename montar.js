// Monta index.html, a página publicada como artefato no claude.ai.
//
// O claude.ai publica um HTML único, mas o código vive separado em src/
// para poder ser lido, testado e revisado:
//   pagina.html   título, fontes, CSS (tokens do tema) e a estrutura fixa
//   planejador.js o planejador, função pura (testada em test/)
//   app.js        telas, banco do artefato, imprevistos, sincronização com o iPhone
//
// Uso:
//   node montar.js              regrava index.html
//   node montar.js --verificar  falha se index.html estiver desatualizado
const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, 'src');
const SAIDA = path.join(__dirname, 'index.html');

const ler = nome => fs.readFileSync(path.join(SRC, nome), 'utf8').replace(/\n$/, '');

function montar() {
  const pagina = fs.readFileSync(path.join(SRC, 'pagina.html'), 'utf8');
  return `${pagina}<script>\n${ler('planejador.js')}\n</script>\n<script>\n${ler('app.js')}\n</script>\n`;
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
  }
}

module.exports = { montar, SAIDA };
