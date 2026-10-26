import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDateISO, getRepeatEndDate, parseScheduleImport } from './timeSheet.js';

test('local calendar date remains correct before 07:00 and across month/year boundaries', () => {
  for (const [year, month, day] of [[2026, 9, 26], [2026, 10, 1], [2027, 0, 1]]) {
    const date = new Date(year, month, day, 1);
    assert.equal(formatDateISO(date), `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
});

test('every selected weekday occurs once per repeat week', () => {
  for (const weeks of [1, 2, 4]) {
    const end = new Date(`${getRepeatEndDate('2026-10-26', weeks)}T00:00:00Z`);
    let count = 0;
    for (const day = new Date('2026-10-26T00:00:00Z'); day <= end; day.setUTCDate(day.getUTCDate() + 1)) {
      if ([1, 3, 5].includes(day.getUTCDay())) count++;
    }
    assert.equal(count, weeks * 3);
  }
  assert.equal(getRepeatEndDate('2026-12-28', 1), '2027-01-03');
});

const employees = [{ id: 'employee-a', code: '001', name: 'Nhân viên A' }];
const row = { employeeCode: '001', workDate: '2026-10-26', shift: 'custom', startTime: '08:00', endTime: '12:00', note: 'Trực nhật' };

test('import preserves leading-zero employee codes, times and notes', () => {
  assert.deepEqual(parseScheduleImport([row], employees)[0], { ...row, employeeId: 'employee-a', employeeName: 'Nhân viên A' });
});

for (const [label, rows] of [
  ['unknown employee', [{ ...row, employeeCode: '002' }]],
  ['invalid date', [{ ...row, workDate: '2026-02-30' }]],
  ['invalid shift', [{ ...row, shift: 'other' }]],
  ['overnight shift', [{ ...row, startTime: '22:00', endTime: '06:00' }]],
  ['invalid time', [{ ...row, startTime: '25:00' }]],
  ['duplicate employee and date', [row, row]],
  ['empty file', []],
  ['more than 500 rows', Array(501).fill(row)],
]) {
  test(`import rejects ${label}`, () => assert.throws(() => parseScheduleImport(rows, employees)));
}

test('Excel export/import round trip retains leading zeros, custom hours and notes', async () => {
  const XLSX = await import('xlsx');
  const sheet = XLSX.utils.json_to_sheet([row]);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Lich lam viec');
  const buffer = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' });
  const restored = XLSX.read(buffer, { type: 'buffer', raw: true });
  const rows = XLSX.utils.sheet_to_json(restored.Sheets[restored.SheetNames[0]], { defval: '', raw: false });
  assert.equal(parseScheduleImport(rows, employees)[0].employeeCode, '001');
  assert.equal(parseScheduleImport(rows, employees)[0].note, row.note);
  assert.equal(parseScheduleImport(rows, employees)[0].startTime, row.startTime);
});

test('CSV import keeps a leading-zero code as text', async () => {
  const XLSX = await import('xlsx');
  const book = XLSX.read('employeeCode,workDate,shift\n001,2026-10-26,morning', { type: 'string', raw: true });
  const rows = XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: '', raw: false });
  assert.equal(parseScheduleImport(rows, employees)[0].employeeCode, '001');
});
