module.exports = {
	env: { node: true },
	extends: [
		"plugin:vue/recommended",
		"eslint:recommended",
		"plugin:prettier/recommended",
		"prettier/vue",
		"plugin:import/errors",
		"plugin:import/warnings"
	],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
	},
	parserOptions: {
		parser: "babel-eslint"
	}
};
