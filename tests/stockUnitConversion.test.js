import test from 'node:test';
import assert from 'node:assert/strict';
import { compatibleStockUnits, convertStockLineUnit } from '../src/components/Stock/stockUnitConversion.js';
import { validateStockInItems, stockInItemPayload } from '../src/components/StockIn/stockInItems.js';

const g = { id: 'g', code: 'g', dimension: 'MASS', factorToBase: '1' };
const kg = { id: 'kg', code: 'kg', dimension: 'MASS', factorToBase: '1000' };
const ml = { id: 'ml', code: 'ml', dimension: 'VOLUME', factorToBase: 1 };
const l = { id: 'l', code: 'l', dimension: 'VOLUME', factorToBase: 1000 };
const piece = { id: 'piece', code: 'cái', dimension: 'COUNT', factorToBase: 1 };

test('40g at 160 VND/g becomes 0.04kg at 160000 VND/kg with unchanged amount', () => {
  const original = { quantity: 40, price: 160 };
  const converted = convertStockLineUnit(original, g, kg);
  assert.equal(converted.quantity, 0.04);
  assert.equal(converted.price, 160000);
  assert.equal(converted.unitId, 'kg');
  assert.equal(converted.quantity * converted.price, 6400);
  const restored = convertStockLineUnit(converted, kg, g);
  assert.equal(restored.quantity, 40);
  assert.equal(restored.price, 160);
  assert.deepEqual(original, { quantity: 40, price: 160 });
});

test('ml/l conversion and small quantities preserve amount', () => {
  const converted = convertStockLineUnit({ quantity: 250, price: 20 }, ml, l);
  assert.equal(converted.quantity, 0.25);
  assert.equal(converted.price, 20000);
  assert.equal(converted.quantity * converted.price, 5000);
  assert.equal(convertStockLineUnit({ quantity: 0.0001, price: 160 }, g, kg).quantity, 0.0000001);
});

test('offers all compatible active units, including configured count conversions', () => {
  const box = { ...piece, id: 'box', code: 'hộp', factorToBase: 12 };
  const all = [g, kg, ml, piece, box, { ...g, id: 'disabled', isActive: false }];
  assert.deepEqual(compatibleStockUnits(g.id, all), [g, kg]);
  assert.deepEqual(compatibleStockUnits(piece.id, all), [piece, box]);
  assert.deepEqual(compatibleStockUnits('missing', all), []);
  assert.throws(() => convertStockLineUnit({ quantity: 1, price: 1 }, g, ml));
  const converted = convertStockLineUnit({ quantity: 24, price: 1000 }, piece, box);
  assert.equal(converted.quantity, 2);
  assert.equal(converted.price, 12000);
  assert.equal(converted.inputToBaseFactor, 12);
});

test('serial counts and API unit IDs follow physical base units after pack conversion', () => {
  const box = { ...piece, id: 'box', code: 'hộp', factorToBase: 12 };
  const converted = { productId: 'p', serialMode: 'MANUAL', serialText: Array.from({length: 12}, (_, i) => `S${i}`).join('\n'), ...convertStockLineUnit({ quantity: 12, price: 1000 }, piece, box) };
  assert.equal(validateStockInItems([converted]), '');
  converted.baseUnitId = 'piece';
  assert.equal(stockInItemPayload(converted).unitId, 'piece');
  assert.equal(stockInItemPayload(converted).quantity, 12);
  assert.equal(stockInItemPayload(converted).unitPrice, 1000);
  assert.equal(stockInItemPayload(converted).serials.length, 12);
  assert.match(validateStockInItems([{ ...converted, serialText: 'S1' }]), /sau quy đổi/);
});

test('invalid values and conversion factors are rejected', () => {
  for (const line of [{ quantity: -1, price: 1 }, { quantity: 1, price: NaN }, { quantity: Infinity, price: 1 }])
    assert.throws(() => convertStockLineUnit(line, g, kg));
  assert.throws(() => convertStockLineUnit({ quantity: 1, price: 1 }, g, { ...kg, factorToBase: 0 }));
});

test('material imports validate lot details without requiring a manual tracking switch', () => {
  const item = { productId: 'bread', name: 'Bánh mì không', productType: 'INGREDIENT', baseUnitId: 'piece', lotTrackingEnabled: false, quantity: 1, price: 5000, lotCode: 'LO-BREAD', expiresAt: '2026-11-20' };
  assert.equal(validateStockInItems([item], 'NHNNL'), '');
  assert.match(validateStockInItems([{ ...item, expiresAt: '' }], 'NHNNL'), /chưa có hạn sử dụng/);
  assert.match(validateStockInItems([{ ...item, lotCode: '' }], 'NHNNL'), /số lô/);
  assert.match(validateStockInItems([{ ...item, baseUnitId: null }], 'NHNNL'), /đơn vị tồn chuẩn/);
});
