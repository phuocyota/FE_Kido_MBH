import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { getPublicProduct } from '../src/api/publicProductLookupApi.js';
import { productLookupModel } from '../src/components/ProductLookup/productLookupModel.js';

const finished = {
  type: 'FINISHED_GOOD',
  unit: { id: 'bc85ab45-4eea-4be5-8d3c-d0120ee86e69', serial: 1, batchId: 'hidden-batch-id' },
  product: { id: 'hidden-product-id', name: 'Bánh mì', code: 'BANH-MI', productType: 'FINISHED_GOOD', imageUrl: 'uploads/banh-mi.jpg' },
  imageUrl: 'uploads/banh-mi.jpg', imageSource: 'ILLUSTRATION', status: 'EXPIRED',
  production: { batchId: 'hidden-batch-id', status: 'COMPLETED', actualQuantity: '1.0000' },
  lifecycle: { inStockAt: '2026-10-20T10:30:54.329Z', startedAt: '2026-10-23T10:30:20.255Z', readyAt: '2026-10-23T12:02:36.425Z', completedAt: '2026-10-23T12:02:36.453Z', expiresAt: '2026-10-23T14:02:36.425Z' },
  inputs: [{ lotId: 'hidden-ingredient-id', lotCode: 'hidden-ingredient-code', tracePath: '/stock-trace/full?lotId=hidden-ingredient-id', product: { name: 'Chả' }, receivedAt: '2026-10-20T10:30:54.329Z', usedQuantity: 40 }],
};

test('public API accepts the finished-good response with unit and lifecycle instead of lot', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true, data: finished }) });
  try { assert.deepEqual(await getPublicProduct(finished.unit.id), finished); }
  finally { globalThis.fetch = originalFetch; }
});

test('finished and ingredient models use their own dates and quantities', () => {
  const model = productLookupModel(finished);
  assert.equal(model.finished, true);
  assert.equal(model.quantity, '1.0000');
  assert.equal(model.status, 'EXPIRED');
  assert.equal(model.milestones.length, 5);
  assert.match(model.milestones[0][1], /Chả:.*20\/10\/2026/);
  assert.match(model.milestones[1][1], /17:30:20/);
  assert.match(model.milestones[4][1], /21:02:36/);
  assert.ok(!JSON.stringify(model.milestones).includes('hidden-ingredient'));
  const ingredient = productLookupModel({ product: { name: 'Chả' }, lot: { quantity: 0, status: 'AVAILABLE', manufacturedAt: '2026-10-20', expiresAt: '2026-10-27' } });
  assert.equal(ingredient.finished, false);
  assert.equal(ingredient.quantity, 0);
  assert.equal(ingredient.milestones.length, 3);
  assert.equal(ingredient.milestones[0][1], '20/10/2026 (chưa có giờ)');
});

test('scan card and full profile render finished products without lot, identifier fields or NaN', async () => {
  const server = await createServer({ configFile: false, appType: 'custom', server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, entries: [] } });
  try {
    for (const component of ['ProductDetails', 'ProductProfile']) {
      const { default: Component } = await server.ssrLoadModule(`/src/components/ProductLookup/${component}.jsx`);
      const html = renderToStaticMarkup(React.createElement(Component, { data: finished }));
      for (const text of ['Bánh mì', 'Hết hạn', 'Chả:', 'Make', 'Ready', 'Completed', 'Expired', '23/10/2026']) assert.ok(html.includes(text), `${component}: ${text}`);
      for (const text of ['hidden-product-id', 'hidden-batch-id', 'hidden-ingredient-id', 'hidden-ingredient-code', 'NaN']) assert.ok(!html.includes(text), `${component}: ${text}`);
    }
  } finally { await server.close(); }
});
