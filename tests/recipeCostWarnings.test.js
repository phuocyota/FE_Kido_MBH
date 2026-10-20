import test from 'node:test';
import assert from 'node:assert/strict';
import { costPerBaseUnit, ingredientProductsWithoutCost } from '../src/components/Products/recipeCostWarnings.js';

const g = { id: 'g', dimension: 'MASS', factorToBase: '1.000000' };
const kg = { id: 'kg', dimension: 'MASS', factorToBase: '1000.000000' };
const piece = { id: 'piece', dimension: 'COUNT', factorToBase: 1 };

test('converts buying price to the stock base unit in either direction', () => {
  assert.equal(costPerBaseUnit('120000', kg, g), 120);
  assert.equal(costPerBaseUnit('120', g, kg), 120000);
  assert.equal(costPerBaseUnit('2000', piece, piece), 2000);
  assert.equal(costPerBaseUnit('0', kg, g), 0);
  assert.equal(costPerBaseUnit('12345', kg, g), 12.35);
});

test('blocks missing/negative/invalid prices and incompatible or missing units', () => {
  for (const value of ['', null, undefined, 'abc', -1, Infinity]) {
    assert.throws(() => costPerBaseUnit(value, kg, g));
  }
  assert.throws(() => costPerBaseUnit(1000, piece, g));
  assert.throws(() => costPerBaseUnit(1000, undefined, g));
  assert.throws(() => costPerBaseUnit(1000, kg, undefined));
  assert.throws(() => costPerBaseUnit(1000, { ...kg, factorToBase: 0 }, g));
});

test('rejects conversion overflow and a positive price rounded down to zero', () => {
  assert.throws(() => costPerBaseUnit(1e10, g, g));
  assert.throws(() => costPerBaseUnit(1, kg, g));
});

test('quick entry only includes missing-cost products once and keeps base-unit references', () => {
  const bread = { id: 'bread', name: 'Bánh mì không', costPrice: null, baseUnitId: 'piece' };
  const recipe = { items: [
    { ingredientProductId: 'bread', ingredientProduct: bread },
    { ingredientProductId: 'bread', ingredientProduct: bread },
    { ingredientProductId: 'meat', ingredientProduct: { name: 'Chả', costPrice: '0', baseUnitId: 'g' } },
  ] };
  assert.deepEqual(ingredientProductsWithoutCost(recipe), [bread]);
});
