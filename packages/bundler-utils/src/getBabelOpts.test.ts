import { join } from 'path';
import {
  getBabelDepsOpts,
  getBabelOpts,
  getBabelPresetOpts,
} from './getBabelOpts';

const fixtures = join(__dirname, 'fixtures');

test('getBabelOpts', () => {
  const ret = getBabelOpts({
    cwd: '/tmp/foo',
    presetOpts: { foo: 'bar' },
    config: {
      extraBabelPresets: ['a'],
      extraBabelPlugins: ['b'],
    },
  });
  expect(ret.sourceType).toEqual('unambiguous');
  expect(ret.cacheDirectory).toEqual('.umi/.cache/babel-loader');
  expect(ret.babelrc).toEqual(false);
  expect(ret.presets).toContain('a');
  expect(ret.plugins).toContain('b');
});

test('getBabelOpts with BABEL_CACHE=none', () => {
  const oldBabelCache = process.env.BABEL_CACHE;
  process.env.BABEL_CACHE = 'none';
  const ret = getBabelOpts({
    cwd: '/tmp/foo',
    presetOpts: { foo: 'bar' },
    config: {},
  });
  expect(ret.cacheDirectory).toEqual(false);
  process.env.BABEL_CACHE = oldBabelCache;
});

test('getBabelOpts with empty extraBabelPresets and extraBabelPlugins', () => {
  const ret = getBabelOpts({
    cwd: '/tmp/foo',
    presetOpts: {},
    config: {},
  });
  expect(ret.sourceType).toEqual('unambiguous');
  expect(ret.cacheDirectory).toEqual('.umi/.cache/babel-loader');
  expect(ret.babelrc).toEqual(false);
  expect(ret.presets.length).toEqual(1);
  expect(ret.plugins).toEqual([]);
});

test('getBabelOpts with src directory', () => {
  const ret = getBabelOpts({
    cwd: join(fixtures, 'with-src'),
    presetOpts: {},
    config: {},
  });
  expect(ret.cacheDirectory).toEqual('src/.umi/.cache/babel-loader');
});

test('getBabelDepsOpts', () => {
  const ret = getBabelDepsOpts({
    cwd: '/tmp/foo',
    env: 'development',
    config: {
      dynamicImport: {},
    },
  });
  expect(ret.sourceType).toEqual('unambiguous');
  expect(ret.cacheDirectory).toEqual('.umi/.cache/babel-loader');
  expect(ret.babelrc).toEqual(false);
  expect(ret.presets[0][1]).toEqual({
    nodeEnv: 'development',
    dynamicImportNode: false,
  });
});

test('getBabelPresetOpts', () => {
  const ret = getBabelPresetOpts({
    env: 'development',
    config: {},
    targets: {
      foo: 1,
    },
  });
  expect(ret).toEqual({
    nodeEnv: 'development',
    dynamicImportNode: true,
    autoCSSModules: true,
    svgr: true,
    env: { targets: { foo: 1 } },
    import: [],
  });
});
