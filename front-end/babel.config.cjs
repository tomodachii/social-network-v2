module.exports = {
  plugins: [
    "babel-plugin-transform-vite-meta-env",
    ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
  ],
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
