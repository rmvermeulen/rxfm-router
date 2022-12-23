const path = require("path");
const webpackRxjsExternals = require("webpack-rxjs-externals");

/** @type {import("webpack").Configuration} */
module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/index.ts",
  context: path.resolve(__dirname),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "rxfm-router",
      type: "umd",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  externals: [webpackRxjsExternals()],
};
