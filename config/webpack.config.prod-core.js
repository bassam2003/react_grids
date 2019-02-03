const webpackCommon = require('./webpack.common.config');

const config =  {
  entry: {
    'react-data-grid/dist/react-data-grid': ['./packages/react-data-grid/src'],
    'react-data-grid/dist/react-data-grid.min': ['./packages/react-data-grid/src']
  },
  output: {
    path: './packages',
    filename: '[name].js',
    library: ['ReactDataGrid'],
    libraryTarget: 'umd'
  }
};

module.exports = Object.assign({ }, webpackCommon, config);
