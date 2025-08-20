// webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './src/index.ts', // or your actual entry file
  target: 'node', // for Node.js apps
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    libraryTarget: 'module', // output as ESM
  },
  experiments: {
    outputModule: true, // enable ESM output
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        type: 'json'
      }
    ],
  },
  externals: [nodeExternals()], // exclude node_modules from bundle
};