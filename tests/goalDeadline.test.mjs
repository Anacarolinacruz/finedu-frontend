import test from 'node:test';
import assert from 'node:assert/strict';
import { getGoalDeadlineInfo } from '../src/app/utils/goalDeadline.ts';

const at = value => new Date(`${value}T12:00:00`);
test('viagem: 14 aportes mensais completos até janeiro de 2028', () => {
  assert.equal(getGoalDeadlineInfo('2028-01-01', at('2026-10-23')).months, 14);
});
test('mesmo dia e prazo vencido não criam um mês artificial', () => {
  assert.equal(getGoalDeadlineInfo('2026-10-23', at('2026-10-23')).dueToday, true);
  const expired = getGoalDeadlineInfo('2026-10-22', at('2026-10-23'));
  assert.equal(expired.expired, true);
  assert.equal(expired.months, 0);
});
test('prazo inferior a um mês e aniversário exato', () => {
  assert.equal(getGoalDeadlineInfo('2026-11-22', at('2026-10-23')).months, 0);
  assert.equal(getGoalDeadlineInfo('2026-11-23', at('2026-10-23')).months, 1);
});
test('fim de mês e ano bissexto', () => {
  assert.equal(getGoalDeadlineInfo('2027-02-28', at('2027-01-31')).months, 1);
  assert.equal(getGoalDeadlineInfo('2028-02-29', at('2028-01-31')).months, 1);
  assert.equal(getGoalDeadlineInfo('2028-02-28', at('2028-01-31')).months, 0);
});
test('datas inválidas não são normalizadas silenciosamente', () => {
  for (const value of ['2026-02-30', '2026-13-01', '2026-2-01', '', 'texto']) {
    assert.equal(getGoalDeadlineInfo(value, at('2026-01-01')).valid, false);
  }
});
