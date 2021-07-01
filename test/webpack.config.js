const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {loader: 'babel-loader', options: {plugins: [require('../index.js')]}}
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  entry: path.resolve(__dirname, 'test.js'),
  output: {
    filename: 'test.webpack.js',
    path: __dirname,
  },
};
