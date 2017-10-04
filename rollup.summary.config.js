import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import gzip from 'rollup-plugin-gzip'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

export default {
  input: 'src/summary.js',
  output: {
    file: 'dist/summary.js',
    format: 'iife'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
      include: [
        'node_modules/**'
      ]
    }),
    vue({
      compileTemplate: true,
      css:true
    }),
    buble(),
    uglify(),
    gzip()
  ]
}