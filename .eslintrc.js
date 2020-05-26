module.exports = {
	env: { node: true },
	extends: [
		"plugin:vue/recommended",
		"eslint:recommended",
		"plugin:prettier/recommended",
		"prettier/vue",
		"plugin:import/errors",
		"plugin:import/warnings",
	],
	rules: {
		"no-console": "off",
		"no-debugger": "off",
		"prettier/prettier": "warn",
	},
	parserOptions: {
		parser: "babel-eslint",
	},
};
