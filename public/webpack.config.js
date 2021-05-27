const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  entry: {
    app: './index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      name: 'The Budgeting App',
      short_name: 'Budget App',
      description:
        'An application that allows you to track your incomes and expenses over time.',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      start_url: '/',
      icons: [
        {
          src: path.resolve('icons/icon-192x192.png'),
          sizes: [192, 512],
          destination: path.join('icons')
        }
      ],
      display: 'standalone'
    })
  ]
};

module.exports = config;
