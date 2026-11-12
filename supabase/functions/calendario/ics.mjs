// Gera o calendário (.ics) que o iPhone assina. Função pura: recebe os documentos, devolve o texto.
// Horários "flutuantes" (sem fuso): o iPhone mostra no fuso dele, igual ao que aparece no app.

const ESTUDO = ['Aula', 'Trabalho', 'Entrega', 'Estudo', 'Revisão'];

function partes(s) {
  const out = [];
  if (s.type !== 'Aula' || !s.lesson || !s.pFrom) return out;
  for (let p = s.pFrom; p <= (s.pTo || s.pFrom); p++) out.push(`${s.lesson}.${p}`);
  return out;
}

export function concluida(s, progress) {
  if (s.type === 'Aula' && s.lesson && s.pFrom) {
    const feitas = (progress[s.subject] && progress[s.subject].parts) || {};
    return partes(s).every(k => feitas[k]);
  }
  return !!s.done;
}

export function titulo(s, subjects) {
  if (s.title) return s.title;
  const sub = subjects[s.subject];
  const curto = sub ? (sub.short || sub.name) : '';
  if (s.type === 'Aula' && s.lesson) {
    const p = s.pFrom ? (s.pTo && s.pTo !== s.pFrom ? `partes ${s.pFrom}–${s.pTo}` : `parte ${s.pFrom}`) : '';
    return `${curto} · Aula ${s.lesson}${p ? ' · ' + p : ''}`;
  }
  return curto ? `${s.type} · ${curto}` : s.type;
}

// Texto em .ics: \ ; , e quebras de linha escapados (RFC 5545, 3.3.11)
export const escapar = t => String(t ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// Linhas de no máximo 75 bytes; a continuação começa com espaço (RFC 5545, 3.1)
export function dobrar(linha) {
  const enc = new TextEncoder();
  if (enc.encode(linha).length <= 75) return linha;
  const out = []; let atual = ''; let bytes = 0; let limite = 75;
  for (const ch of linha) {
    const n = enc.encode(ch).length;
    if (bytes + n > limite) { out.push(atual); atual = ''; bytes = 0; limite = 74; }
    atual += ch; bytes += n;
  }
  out.push(atual);
  return out.join('\r\n ');
}

const pad = n => String(n).padStart(2, '0');
const dataHora = (data, hm) => `${data.replace(/-/g, '')}T${hm.replace(':', '')}00`;
function diaSeguinte(data) {
  const [y, m, d] = data.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}
const carimbo = agora => agora.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/**
 * @param {object} p
 * @param {object[]} p.sessions  documentos da coleção sessions
 * @param {object} p.progress    { idMateria: { parts: {"6.1": ...} } }
 * @param {object} p.subjects    { idMateria: { name, short } }
 * @param {string} p.desde       "AAAA-MM-DD": sessões antes disso ficam de fora
 * @param {Date}   p.agora       para o DTSTAMP
 */
export function gerarIcs({ sessions, progress = {}, subjects = {}, desde, agora = new Date() }) {
  const linhas = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rota de Estudos//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:Estudos', 'REFRESH-INTERVAL;VALUE=DURATION:PT1H', 'X-PUBLISHED-TTL:PT1H',
  ];
  const lista = sessions
    .filter(s => s && s.date && s.start && s.end && s.date >= desde && ESTUDO.includes(s.type) && !concluida(s, progress))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  for (const s of lista) {
    const fim = s.end === '24:00' ? dataHora(diaSeguinte(s.date), '00:00') : dataHora(s.date, s.end);
    const materia = subjects[s.subject] ? subjects[s.subject].name : '';
    const notas = [materia, s.note].filter(Boolean).join(' · ');
    linhas.push(
      'BEGIN:VEVENT',
      `UID:${s.id}@rota-de-estudos`,
      `DTSTAMP:${carimbo(agora)}`,
      `DTSTART:${dataHora(s.date, s.start)}`,
      `DTEND:${fim}`,
      `SUMMARY:${escapar(titulo(s, subjects))}`,
    );
    if (notas) linhas.push(`DESCRIPTION:${escapar(notas)}`);
    if (s.type === 'Entrega') linhas.push('PRIORITY:1');
    linhas.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Hora de estudar', 'TRIGGER:-PT15M', 'END:VALARM', 'END:VEVENT');
  }
  linhas.push('END:VCALENDAR');
  return linhas.map(dobrar).join('\r\n') + '\r\n';
}
