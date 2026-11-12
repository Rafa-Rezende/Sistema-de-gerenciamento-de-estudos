// Testes do calendário que o iPhone assina (supabase/functions/calendario/ics.mjs).
const test = require('node:test');
const assert = require('node:assert/strict');

const carregar = () => import('../supabase/functions/calendario/ics.mjs');
const subjects = { devops: { name: 'DevOps na prática', short: 'DevOps' }, co: { name: 'Comportamento Organizacional na TI', short: 'Comport. Org.' } };
const base = {
  subjects,
  progress: { devops: { parts: { '6.1': '2026-11-12', '6.2': '2026-11-12' } } },
  desde: '2026-11-12',
  agora: new Date('2026-11-12T13:00:00Z'),
};
const eventos = ics => ics.split('BEGIN:VEVENT').length - 1;

test('aula pendente vira evento com horário local, título e alerta', async () => {
  const { gerarIcs } = await carregar();
  const ics = gerarIcs({ ...base, sessions: [{ id: 'p1', type: 'Aula', subject: 'co', lesson: 6, pFrom: 1, pTo: 5, date: '2026-11-13', start: '10:30', end: '13:00' }] });
  assert.match(ics, /DTSTART:20261113T103000\r\n/);
  assert.match(ics, /DTEND:20261113T130000\r\n/);
  assert.match(ics, /SUMMARY:Comport. Org. · Aula 6 · partes 1–5\r\n/);
  assert.match(ics, /UID:p1@rota-de-estudos/);
  assert.match(ics, /TRIGGER:-PT15M/);
  assert.match(ics, /X-WR-CALNAME:Estudos/);
});

test('aula com todas as partes assistidas e sessão concluída ficam de fora', async () => {
  const { gerarIcs } = await carregar();
  const ics = gerarIcs({ ...base, sessions: [
    { id: 'feita', type: 'Aula', subject: 'devops', lesson: 6, pFrom: 1, pTo: 2, date: '2026-11-12', start: '20:00', end: '21:00' },
    { id: 'meia', type: 'Aula', subject: 'devops', lesson: 6, pFrom: 2, pTo: 3, date: '2026-11-13', start: '09:00', end: '10:00' },
    { id: 'trab', type: 'Trabalho', subject: 'co', done: true, date: '2026-11-13', start: '14:00', end: '15:00', title: 'Trabalho' },
  ] });
  assert.equal(eventos(ics), 1);
  assert.match(ics, /UID:meia@/);
});

test('passado, descanso, reserva e sessão sem horário ficam de fora', async () => {
  const { gerarIcs } = await carregar();
  const ics = gerarIcs({ ...base, sessions: [
    { id: 'velha', type: 'Estudo', date: '2026-11-11', start: '21:00', end: '22:00', title: 'x' },
    { id: 'desc', type: 'Descanso', date: '2026-11-15', start: '', end: '' },
    { id: 'res', type: 'Reserva', date: '2026-11-21', start: '12:30', end: '14:00' },
    { id: 'sem', type: 'Estudo', date: '2026-11-21', title: 'sem hora' },
  ] });
  assert.equal(eventos(ics), 0);
});

test('fim 24:00 vira meia-noite do dia seguinte, inclusive na virada de mês', async () => {
  const { gerarIcs } = await carregar();
  const ics = gerarIcs({ ...base, sessions: [{ id: 'n', type: 'Estudo', date: '2026-11-30', start: '22:00', end: '24:00', title: 'Código' }] });
  assert.match(ics, /DTEND:20261201T000000\r\n/);
});

test('texto com vírgula, ponto e vírgula e quebra de linha é escapado', async () => {
  const { escapar } = await carregar();
  assert.equal(escapar('a, b; c\\d\ne'), 'a\\, b\\; c\\\\d\\ne');
});

test('linhas longas são dobradas em 75 bytes sem quebrar acentos', async () => {
  const { dobrar } = await carregar();
  const longa = 'DESCRIPTION:' + 'Organização '.repeat(12);
  const dobrada = dobrar(longa);
  for (const l of dobrada.split('\r\n')) assert.ok(new TextEncoder().encode(l).length <= 75);
  assert.equal(dobrada.split('\r\n').map((l, i) => (i ? l.slice(1) : l)).join(''), longa);
});

test('entrega tem prioridade alta e o arquivo termina com CRLF', async () => {
  const { gerarIcs } = await carregar();
  const ics = gerarIcs({ ...base, sessions: [{ id: 'e2', type: 'Entrega', date: '2026-11-26', start: '10:00', end: '10:30', title: 'ENTREGA Fase 2' }] });
  assert.match(ics, /PRIORITY:1/);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});
