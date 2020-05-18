module.exports = {
  "extends": [
    "plugin:vue/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "prettier/vue"
  ],
  "rules": {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": "warn"
  },
  "parserOptions": {
    "parser": "babel-eslint"
  }
}