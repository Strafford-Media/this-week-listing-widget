import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'

export default [
  'full-listing',
  'listing-list',
  'featured-listings',
  'search-bar',
  'ad-placement',
  'ad-group',
  'evvnt-gallery',
  'hawaiian-islands',
  'profile-page',
]
  .map((widgetName) => ({
    input: {
      [widgetName]: `src/${widgetName}.tsx`,
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      }),
      alias({
        entries: [
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom', replacement: 'preact/compat' },
          { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
          { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
          { find: 'react/jsx-dev-runtime', replacement: 'preact/jsx-dev-runtime' },
        ],
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      esbuild({
        jsx: 'automatic',
        jsxImportSource: 'preact',
        target: 'es2022',
        tsconfig: 'tsconfig.json',
      }),
    ],
    output: [
      {
        dir: 'public',
        format: 'iife',
        entryFileNames: `${widgetName}.js`,
        sourcemap: process.env.ROLLUP_WATCH === 'true' ? true : false,
        compact: process.env.ROLLUP_WATCH === 'true' ? false : true,
        name: camelCase(widgetName),
        exports: 'named',
      },
    ],
  }))
  .concat({
    input: './src/tailwind.css',
    plugins: [
      postcss({
        extract: true,
        minimize: process.env.ROLLUP_WATCH === 'true' ? false : true,
        sourceMap: process.env.ROLLUP_WATCH === 'true' ? true : false,
      }),
    ],
    output: {
      dir: 'public',
      entryFileNames: 'this-week-widgets.css',
    },
  })

function camelCase(str) {
  return str
    .split(/[^a-zA-Z]/g)
    .filter(Boolean)
    .map((seg, i) => (i === 0 ? seg : capitalize(seg)))
    .join('')
}

function capitalize(str) {
  if (!str) return ''

  return `${str[0].toUpperCase()}${str.slice(1)}`
}
