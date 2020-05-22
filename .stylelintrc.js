module.exports = {
	extends: [
		"stylelint-config-standard",
		"stylelint-config-sass-guidelines",
		"stylelint-a11y/recommended",
	],
	plugins: ["stylelint-order", "stylelint-scss", "stylelint-a11y"],
	rules: {
		indentation: "tab",
		"string-quotes": "double",
		"selector-class-pattern": null, // allow underscores for BEM
	},
};
