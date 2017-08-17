const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;
const DotenvPlugin = require('webpack-dotenv-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const libraryName = 'rdocs-light';
const lib = 'rdl';

var envPath = './.env';
var prodEnvPath = './.prodEnv';

const plugins = [
  new DotenvPlugin({
    sample: './.env.example',
    path: (env == 'build') ? prodEnvPath : envPath,
  }),
  new WebpackAutoInject({
    components: {
      AutoIncreaseVersion: false,
      InjectAsComment: {
        tag: 'Build version: {version} - {date}',
      },
    },
  }),
];
let outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin());
  outputFile = `${libraryName}.min.js`;
} else {
  outputFile = `${libraryName}.js`;
}

const config = {
  entry: path.join(__dirname, '/src/rdocs-light.js'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: outputFile,
    library: lib,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        enforce: 'pre',
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /shadow\.scss$/,
        use: [
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
        exclude: /node_modules/,
      },
      {
        test: /main\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        },
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  plugins,
};

module.exports = config;
