const path = require("path");
const webpackRxjsExternals = require("webpack-rxjs-externals");

module.exports = [
  {
    mode: "production",
    devtool: "source-map",
    entry: "./src/index.ts",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
      library: "rxfm-router",
      libraryTarget: "umd",
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
  },
];
