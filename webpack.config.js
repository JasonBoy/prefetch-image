const path = require('path');
const webpack = require('webpack');

const PROD_MODE = process.env.NODE_ENV === 'production';

const entry = path.resolve(__dirname, 'index.js');

const config = {
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: PROD_MODE ? 'prefetch-image.min.js' : 'prefetch-image.js',
    library: 'prefetchImages',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname),
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(PROD_MODE ? 'production' : 'development')
      }
    }),
  ],
  devtool: 'source-map',
};

if(PROD_MODE) {
  const plugins = config.plugins;
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      dead_code: true,
      drop_debugger: true,
    },
    sourceMap: true,
    mangle: true,
  }))
}


module.exports = config;