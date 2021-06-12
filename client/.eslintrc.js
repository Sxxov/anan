/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const eslintSveltePreprocess = require('eslint-svelte3-preprocess');
const svelteConfig = require('./svelte.config');

const DISABLED_TYPESCRIPT_RULES = {
	/*
	code used at: https://github.com/typescript-eslint/typescript-eslint/tree/53232d775ca0b808e2d75d9501f4411a868b2b48/packages/eslint-plugin/src/rules

	Array.from($$('.js-navigation-open')).map((elem) => {
		if (!elem.id) {
			return null;
		}

		if (elem.title.substr(-3) !== '.ts') {
			return null;
		}

		return `'@typescript-eslint/${
			elem.title.substr(0, elem.title.length - 3)
		}': [\'off\'],\n`;
	}).join('')

*/
	'@typescript-eslint/adjacent-overload-signatures': ['off'],
	'@typescript-eslint/array-type': ['off'],
	'@typescript-eslint/await-thenable': ['off'],
	'@typescript-eslint/ban-ts-comment': ['off'],
	'@typescript-eslint/ban-types': ['off'],
	'@typescript-eslint/brace-style': ['off'],
	'@typescript-eslint/class-literal-property-style': ['off'],
	'@typescript-eslint/comma-spacing': ['off'],
	'@typescript-eslint/consistent-type-assertions': ['off'],
	'@typescript-eslint/consistent-type-definitions': ['off'],
	'@typescript-eslint/default-param-last': ['off'],
	'@typescript-eslint/dot-notation': ['off'],
	'@typescript-eslint/explicit-function-return-type': ['off'],
	'@typescript-eslint/explicit-member-accessibility': ['off'],
	'@typescript-eslint/explicit-module-boundary-types': ['off'],
	'@typescript-eslint/func-call-spacing': ['off'],
	'@typescript-eslint/indent': ['off'],
	'@typescript-eslint/index': ['off'],
	'@typescript-eslint/init-declarations': ['off'],
	'@typescript-eslint/keyword-spacing': ['off'],
	'@typescript-eslint/lines-between-class-members': ['off'],
	'@typescript-eslint/member-delimiter-style': ['off'],
	'@typescript-eslint/member-ordering': ['off'],
	'@typescript-eslint/method-signature-style': ['off'],
	'@typescript-eslint/naming-convention': ['off'],
	'@typescript-eslint/no-array-constructor': ['off'],
	'@typescript-eslint/no-base-to-string': ['off'],
	'@typescript-eslint/no-dupe-class-members': ['off'],
	'@typescript-eslint/no-dynamic-delete': ['off'],
	'@typescript-eslint/no-empty-function': ['off'],
	'@typescript-eslint/no-empty-interface': ['off'],
	'@typescript-eslint/no-explicit-any': ['off'],
	'@typescript-eslint/no-extra-non-null-assertion': ['off'],
	'@typescript-eslint/no-extra-parens': ['off'],
	'@typescript-eslint/no-extra-semi': ['off'],
	'@typescript-eslint/no-extraneous-class': ['off'],
	'@typescript-eslint/no-floating-promises': ['off'],
	'@typescript-eslint/no-for-in-array': ['off'],
	'@typescript-eslint/no-implied-eval': ['off'],
	'@typescript-eslint/no-inferrable-types': ['off'],
	'@typescript-eslint/no-invalid-this': ['off'],
	'@typescript-eslint/no-invalid-void-type': ['off'],
	'@typescript-eslint/no-magic-numbers': ['off'],
	'@typescript-eslint/no-misused-new': ['off'],
	'@typescript-eslint/no-misused-promises': ['off'],
	'@typescript-eslint/no-namespace': ['off'],
	'@typescript-eslint/no-non-null-asserted-optional-chain': ['off'],
	'@typescript-eslint/no-non-null-assertion': ['off'],
	'@typescript-eslint/no-parameter-properties': ['off'],
	'@typescript-eslint/no-require-imports': ['off'],
	'@typescript-eslint/no-this-alias': ['off'],
	'@typescript-eslint/no-throw-literal': ['off'],
	'@typescript-eslint/no-type-alias': ['off'],
	'@typescript-eslint/no-unnecessary-boolean-literal-compare': ['off'],
	'@typescript-eslint/no-unnecessary-condition': ['off'],
	'@typescript-eslint/no-unnecessary-qualifier': ['off'],
	'@typescript-eslint/no-unnecessary-type-arguments': ['off'],
	'@typescript-eslint/no-unnecessary-type-assertion': ['off'],
	'@typescript-eslint/no-unsafe-assignment': ['off'],
	'@typescript-eslint/no-unsafe-call': ['off'],
	'@typescript-eslint/no-unsafe-member-access': ['off'],
	'@typescript-eslint/no-unsafe-return': ['off'],
	'@typescript-eslint/no-unused-expressions': ['off'],
	'@typescript-eslint/no-unused-vars-experimental': ['off'],
	'@typescript-eslint/no-unused-vars': ['off'],
	'@typescript-eslint/no-use-before-define': ['off'],
	'@typescript-eslint/no-useless-constructor': ['off'],
	'@typescript-eslint/no-var-requires': ['off'],
	'@typescript-eslint/prefer-as-const': ['off'],
	'@typescript-eslint/prefer-for-of': ['off'],
	'@typescript-eslint/prefer-function-type': ['off'],
	'@typescript-eslint/prefer-includes': ['off'],
	'@typescript-eslint/prefer-namespace-keyword': ['off'],
	'@typescript-eslint/prefer-nullish-coalescing': ['off'],
	'@typescript-eslint/prefer-optional-chain': ['off'],
	'@typescript-eslint/prefer-readonly-parameter-types': ['off'],
	'@typescript-eslint/prefer-readonly': ['off'],
	'@typescript-eslint/prefer-reduce-type-parameter': ['off'],
	'@typescript-eslint/prefer-regexp-exec': ['off'],
	'@typescript-eslint/prefer-string-starts-ends-with': ['off'],
	'@typescript-eslint/prefer-ts-expect-error': ['off'],
	'@typescript-eslint/promise-function-async': ['off'],
	'@typescript-eslint/quotes': ['off'],
	'@typescript-eslint/require-array-sort-compare': ['off'],
	'@typescript-eslint/require-await': ['off'],
	'@typescript-eslint/restrict-plus-operands': ['off'],
	'@typescript-eslint/restrict-template-expressions': ['off'],
	'@typescript-eslint/return-await': ['off'],
	'@typescript-eslint/semi': ['off'],
	'@typescript-eslint/space-before-function-paren': ['off'],
	'@typescript-eslint/strict-boolean-expressions': ['off'],
	'@typescript-eslint/switch-exhaustiveness-check': ['off'],
	'@typescript-eslint/triple-slash-reference': ['off'],
	'@typescript-eslint/type-annotation-spacing': ['off'],
	'@typescript-eslint/typedef': ['off'],
	'@typescript-eslint/unbound-method': ['off'],
	'@typescript-eslint/unified-signatures': ['off'],
};

module.exports = {
	overrides: [
		{
			files: ['**/*.svelte'],
			processor: 'svelte3/svelte3',
			rules: {},
		},
		{
			files: ['**/*.js'],
			rules: {
				...DISABLED_TYPESCRIPT_RULES,

				'consistent-return': ['warn'],
			},
		},
		{
			files: ['**/*.ts', '**/*.svelte'],
			rules: {
				// includes svelte files now

				// ts has their own implementation that works
				'no-unused-vars': ['off'],
				'consistent-return': ['off'],
				// for $: lines
				'no-unused-expressions': ['off'],
				'no-sequences': ['off'],
				// interferes with TS
				'no-shadow': ['off'],
				// for svelte, to enable optional undefined props
				'no-undef-init': ['off'],
				// ts doesn't understand svelte stuff too much
				'@typescript-eslint/no-non-null-assertion': ['off'],
			},
		},
		{
			files: ['**/*.d.ts'],
			rules: {
				'@typescript-eslint/no-unused-vars': ['off'],
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 11,
	},
	env: {
		node: true,
		browser: true,
	},
	rules: {
		'no-param-reassign': ['off'],
		'import/no-unresolved': ['off'],
		'lines-between-class-members': ['off'],
		'no-multiple-empty-lines': ['warn', { max: 2 }],
		'import/no-mutable-exports': ['off'],
		'import/first': ['off'],
		'@typescript-eslint/no-empty-function': ['off'],
		'@typescript-eslint/no-use-before-define': ['off'],
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/no-this-alias': ['off'],
		// 'no-useless-constructor': ['off'],
		'max-classes-per-file': ['off'],
		// indent: [
		// 	'warn',
		// 	'tab',
		// 	{ SwitchCase: 1 },
		// ],
		'@typescript-eslint/ban-ts-comment': ['off'],
		'no-tabs': ['off'],
		'linebreak-style': ['warn', 'windows'],
		'no-underscore-dangle': ['off'],
		'no-plusplus': ['off'],
		'no-console': ['off'],
		'no-new': ['off'],
		'no-use-before-define': ['off'],
		'no-continue': ['off'],
		'import/prefer-default-export': ['off'],
		'import/extensions': [
			'warn',
			'never',
			{
				json: 'always',
				css: 'always',
				utility: 'always',
				error: 'always',
				type: 'always',
				svelte: 'always',
				types: 'always',
				animator: 'always',
				object: 'always',
				factory: 'always',
				factories: 'always',
				item: 'always',
			},
		],
		'no-await-in-loop': ['off'],

		// kinda prettier
		'array-bracket-newline': [
			'warn',
			{
				multiline: true,
				minItems: 3,
			},
		],
		'array-element-newline': [
			'warn',
			{
				multiline: true,
				minItems: 3,
			},
		],
		'multiline-ternary': ['warn', 'always-multiline'],
		'object-property-newline': ['warn', { allowAllPropertiesOnSameLine: false }],
		'function-paren-newline': ['warn', 'multiline-arguments'],
		'object-curly-newline': [
			'warn',
			{
				consistent: true,
				minProperties: 2,
			},
		],
		'padding-line-between-statements': [
			'warn',
			// Always require blank lines after directive (like 'use-strict'), except between directives
			{
				blankLine: 'always',
				prev: 'directive',
				next: '*',
			},
			{
				blankLine: 'any',
				prev: 'directive',
				next: 'directive',
			},
			// Always require blank lines after import, except between imports
			{
				blankLine: 'always',
				prev: 'import',
				next: '*',
			},
			{
				blankLine: 'any',
				prev: 'import',
				next: 'import',
			},
			// Always require blank lines before & after every sequence of variable declarations & export
			{
				blankLine: 'always',
				prev: '*',
				next: [
					'const',
					'let',
					'var',
					'export',
				],
			},
			{
				blankLine: 'always',
				prev: [
					'const',
					'let',
					'var',
					'export',
				],
				next: '*',
			},
			{
				blankLine: 'any',
				prev: [
					'const',
					'let',
					'var',
					'export',
				],
				next: [
					'const',
					'let',
					'var',
					'export',
				],
			},
			// Always require blank lines before and after class declaration, if, do/while, switch, try
			{
				blankLine: 'always',
				prev: '*',
				next: [
					'if',
					'class',
					'for',
					'do',
					'while',
					'switch',
					'try',
				],
			},
			{
				blankLine: 'always',
				prev: [
					'if',
					'class',
					'for',
					'do',
					'while',
					'switch',
					'try',
				],
				next: '*',
			},
			// Always require blank lines before return statements
			{
				blankLine: 'always',
				prev: '*',
				next: 'return',
			},
		],
		'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 2 }],
		// xo-typescript
		'@typescript-eslint/adjacent-overload-signatures': ['warn'],
		'@typescript-eslint/ban-types': [
			'warn',
			{
				extendDefaults: true,
				types: {
					String: {
						message: 'Use `string` instead.',
						fixWith: 'string',
					},
					Number: {
						message: 'Use `number` instead.',
						fixWith: 'number',
					},
					Boolean: {
						message: 'Use `boolean` instead.',
						fixWith: 'boolean',
					},
					Symbol: {
						message: 'Use `symbol` instead.',
						fixWith: 'symbol',
					},
					Object: {
						message: 'The `Object` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead. See https://github.com/typescript-eslint/typescript-eslint/pull/848',
						fixWith: 'Record<string, unknown>',
					},
					'{}': {
						message: 'The `{}` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead.',
						fixWith: 'Record<string, unknown>',
					},
					object: {
						message: 'The `object` type is hard to use. Use `Record<string, unknown>` instead. See: https://github.com/typescript-eslint/typescript-eslint/pull/848',
						fixWith: 'Record<string, unknown>',
					},
					Function: 'Use a specific function type instead, like `() => void`.',

					// TODO: Try to enable this in 2021.
					// null: {
					// 	message: 'Use `undefined` instead. See: https://github.com/sindresorhus/meta/issues/7',
					// 	fixWith: 'undefined'
					// }

					'[]': 'Don\'t use the empty array type `[]`. It only allows empty arrays. Use `SomeType[]` instead.',
					'[[]]': 'Don\'t use `[[]]`. It only allows an array with a single element which is an empty array. Use `SomeType[][]` instead.',
					'[[[]]]': 'Don\'t use `[[[]]]`. Use `SomeType[][][]` instead.',
					'[[[[]]]]': 'ur drunk 🤡',
					'[[[[[]]]]]': '🦄💥',
					Omit: 'Prefer the `Except` type in the `type-fest` package instead as it\'s stricter.',
				},
			},
		],
		'@typescript-eslint/brace-style': [
			'warn',
			'1tbs',
			{
				allowSingleLine: false,
			},
		],
		'comma-dangle': ['off'],
		'@typescript-eslint/comma-dangle': ['warn', 'always-multiline'],
		'default-param-last': ['off'],
		'@typescript-eslint/default-param-last': ['warn'],
		'func-call-spacing': ['off'],
		'@typescript-eslint/func-call-spacing': ['warn', 'never'],
		indent: ['off'],
		'@typescript-eslint/indent': [
			'warn',
			'tab',
			{
				SwitchCase: 1,
			},
		],
		'keyword-spacing': ['off'],
		'@typescript-eslint/keyword-spacing': ['warn'],
		'@typescript-eslint/member-delimiter-style': [
			'warn',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true,
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false,
				},
			},
		],
		// '@typescript-eslint/member-ordering': ['warn'],
		'no-extra-semi': ['off'],
		'@typescript-eslint/no-extra-semi': ['warn'],
		'no-loop-func': ['off'],
		'@typescript-eslint/no-loop-func': ['warn'],
		'no-loss-of-precision': ['off'],
		'@typescript-eslint/no-loss-of-precision': ['warn'],
		'@typescript-eslint/no-extraneous-class': [
			'warn',
			{
				allowConstructorOnly: false,
				allowEmpty: false,
				// allowStaticOnly: false,
				allowStaticOnly: true,
				allowWithDecorator: true,
			},
		],
		'no-void': [
			'warn',
			{
				// To allow `ignoreVoid` in `@typescript-eslint/no-floating-promises`
				allowAsStatement: true,
			},
		],
		// '@typescript-eslint/no-floating-promises': [
		// 	'warn',
		// 	{
		// 		// Prepend a function call with `void` to mark it as not needing to be await'ed,
		// 		// which silences this rule.
		// 		ignoreVoid: true,
		// 		ignoreIIFE: true,
		// 	},
		// ],
		// '@typescript-eslint/no-for-in-array': ['warn'],
		// '@typescript-eslint/no-implicit-any-catch': ['warn'],
		'@typescript-eslint/no-inferrable-types': ['warn'],
		// '@typescript-eslint/no-misused-promises': [
		// 	'warn',
		// 	{
		// 		checksConditionals: true,

		// 		// TODO: I really want this to be `true`, but it makes it inconvenient to use
		// 		// async functions as event handlers... I need to find a good way to handle that.
		// 		// https://github.com/sindresorhus/refined-github/pull/2391#discussion_r318990466
		// 		checksVoidReturn: false,
		// 	},
		// ],
		'no-throw-literal': ['off'],
		// '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['warn'],
		// '@typescript-eslint/no-unnecessary-qualifier': ['warn'],
		// '@typescript-eslint/no-unnecessary-type-arguments': ['warn'],
		// '@typescript-eslint/no-unnecessary-type-assertion': ['warn'],
		'@typescript-eslint/no-unnecessary-type-constraint': ['warn'],
		// '@typescript-eslint/no-unsafe-assignment': ['warn'],
		// '@typescript-eslint/no-unsafe-call': ['warn'],
		// '@typescript-eslint/no-unsafe-member-access': ['warn'],
		// '@typescript-eslint/no-unsafe-return': ['warn'],
		'no-useless-constructor': ['off'],
		'@typescript-eslint/no-useless-constructor': ['warn'],
		'@typescript-eslint/no-var-requires': ['warn'],
		// '@typescript-eslint/non-nullable-type-assertion-style': ['warn'],
		'@typescript-eslint/prefer-as-const': ['warn'],
		// '@typescript-eslint/prefer-for-of': ['warn'],
		'@typescript-eslint/prefer-function-type': ['warn'],
		// '@typescript-eslint/prefer-includes': ['warn'],
		'@typescript-eslint/prefer-literal-enum-member': ['warn'],
		'@typescript-eslint/prefer-namespace-keyword': ['warn'],
		// '@typescript-eslint/prefer-nullish-coalescing': ['warn'],
		'@typescript-eslint/prefer-optional-chain': ['warn'],
		// '@typescript-eslint/prefer-readonly': ['warn'],
		// '@typescript-eslint/prefer-reduce-type-parameter': ['warn'],
		// '@typescript-eslint/prefer-string-starts-ends-with': ['warn'],
		'@typescript-eslint/prefer-ts-expect-error': ['warn'],
		// '@typescript-eslint/promise-function-async': [
		// 	'warn',
		// 	{
		// 		allowAny: true,
		// 	},
		// ],
		quotes: ['off'],
		'@typescript-eslint/quotes': ['warn', 'single'],
		// '@typescript-eslint/restrict-plus-operands': ['warn'],
		// '@typescript-eslint/restrict-template-expressions': [
		// 	'warn',
		// 	{
		// 		allowNumber: true,
		// 	},
		// ],
		// '@typescript-eslint/return-await': ['off'],
		// '@typescript-eslint/require-array-sort-compare': [
		// 	'warn',
		// 	{
		// 		ignoreStringArrays: true,
		// 	},
		// ],
		'space-before-function-paren': ['off'],
		'@typescript-eslint/space-before-function-paren': [
			'warn',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'space-infix-ops': ['off'],
		'@typescript-eslint/space-infix-ops': ['warn'],
		semi: ['off'],
		'@typescript-eslint/semi': ['warn', 'always'],
		// '@typescript-eslint/switch-exhaustiveness-check': ['warn'],
		'@typescript-eslint/triple-slash-reference': [
			'warn',
			{
				path: 'never',

				// Cannot enable this until `@types/node` no longer has the `NodeJS` global
				// types: 'never'
			},
		],
		'@typescript-eslint/type-annotation-spacing': ['warn'],
		// '@typescript-eslint/prefer-regexp-exec': ['warn'],
		'@typescript-eslint/unified-signatures': ['warn'],
		// Disabled because of https://github.com/typescript-eslint/typescript-eslint/issues/60
		'no-redeclare': ['off'],
		// Disabled per typescript-eslint recommendation: https://github.com/typescript-eslint/typescript-eslint/blob/e26e43ffba96f6d46198b22f1c8dd5c814db2652/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
		'no-undef': ['off'],

		'destructuring-newline/object-property-newline': ['warn'],
	},
	plugins: [
		'svelte3',
		'@typescript-eslint',
		'destructuring-newline',
	],
	extends: [
		'eslint:recommended',
		'airbnb-base',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	settings: {
		'svelte3/typescript': true,
		'svelte3/preprocess': eslintSveltePreprocess(
			svelteConfig.autoPreprocessOptions,
		),
	},
};
