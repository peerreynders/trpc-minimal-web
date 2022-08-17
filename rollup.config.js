import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './client/client/main.js',
  output: {
    dir: './server/dist',
    format: 'esm',
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};
