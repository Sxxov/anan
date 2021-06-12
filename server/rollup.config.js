/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
// import babel from '@rollup/plugin-babel';
// import analyze from 'rollup-plugin-analyzer';
import typescript from '@rollup/plugin-typescript';
// import typescript from 'rollup-plugin-typescript2';
import shebang from 'rollup-plugin-preserve-shebang';
import json from '@rollup/plugin-json';
import run from '@rollup/plugin-run';

const production = !process.env.ROLLUP_WATCH;

const onwarn = (message, warn) => {
	const ignored = {
		EVAL: ['node_modules'],
		CIRCULAR_DEPENDENCY: [''],
	};
	const ignoredKeys = Object.keys(ignored);
	const ignoredValues = Object.values(ignored);

	for (let i = 0, l = ignoredKeys.length; i < l; ++i) {
		const ignoredKey = ignoredKeys[i];
		const ignoredValue = ignoredValues[i];

		for (const ignoredValuePart of ignoredValue) {
			if (message.code !== ignoredKey
				|| !message.toString().includes(ignoredValuePart)) {
				continue;
			}

			return;
		}
	}

	warn(message);
};

const watch = {
	clearScreen: false,
};

const plugins = [
	// If you have external dependencies installed from
	// npm, you'll most likely need these plugins. In
	// some cases you'll need additional configuration -
	// consult the documentation for details:
	// https://github.com/rollup/plugins/tree/master/packages/commonjs
	resolve({
		preferBuiltins: true,
	}),

	commonjs(),

	json(),

	shebang(),

	// typescript({
	// 	sourceMap: !production,
	// 	include: ['../**/src/**/*.ts'],
	// }),

	// production && babel({
	// 	extensions: [
	// 		'.js',
	// 		'.mjs',
	// 		'.ts',
	// 	],
	// 	include: ['src/**'],
	// 	babelHelpers: 'bundled',
	// 	sourceMaps: !production,
	// }),

	!production && run(),

	// If we're building for production (npm run build
	// instead of npm run dev), minify
	production && terser({
		keep_classnames: true,
	}),

	// analyze({
	// 	summaryOnly: true,
	// 	limit: 10,
	// }),
];

export default [{
	input: '.tsc/server/src/index.js',
	output: {
		sourcemap: !production,
		format: 'esm',
		name: 'server',
		dir: 'dist',
		entryFileNames: 'server.js',
	},
	onwarn,
	watch,
	plugins,
}];
