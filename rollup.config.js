import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/intent-parser.js',
  format: 'umd',
  plugins: [babel()],
  moduleName: 'IntentParser',
  external: [
    'chrono-node',
    'moment',
    'twitter_cldr',
  ],
  globals: {
    'chrono-node': 'chrono',
    'moment': 'moment',
    'twitter_cldr': 'TwitterCldr',
  },
  dest: 'dist/intent-parser.js',
  sourceMap: true,
};
