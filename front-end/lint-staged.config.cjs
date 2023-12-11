module.exports = {
  "*.{ts,tsx}": [() => "tsc -p tsconfig.json --noEmit", "prettier --write ./src/**/*.{ts,tsx,js,jsx}", "eslint ./src"],
};
