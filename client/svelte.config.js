// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const autoPreprocess = require('svelte-preprocess');

const autoPreprocessOptions = undefined;

module.exports = {
	autoPreprocessOptions,
	preprocess: autoPreprocess(autoPreprocessOptions),
};
