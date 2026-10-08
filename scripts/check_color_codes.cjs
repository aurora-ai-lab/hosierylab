/* eslint-disable @typescript-eslint/no-require-imports */
// Exercise the actual catalog normalization used by the site.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { allHosiery } = require('../src/lib/data.ts');
const counts = {};
for (const item of allHosiery) counts[item.colorCode] = (counts[item.colorCode] ?? 0) + 1;
assert.equal(allHosiery.length, 2000);
assert.deepEqual(counts, {
  black: 400, skin_tone: 400, white: 299, grey: 600,
  brown: 100, navy: 100, burgundy: 101,
});
assert.equal(allHosiery.filter(item => item.colorCode === 'black' && item.lengthClass === 'waist').length, 292);
console.log('OK: actual colorCode counts and black + waist intersection');
console.table(counts);
