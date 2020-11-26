/** @format */

const webpack = require('webpack') //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin') //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: './.env' })

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.min.js',
    publicPath: '/',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: path.resolve(__dirname, 'dist') } },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env.ACCESS_TOKEN': JSON.stringify(process.env.ACCESS_TOKEN),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, 'src', 'assets', 'favicon.ico'), to: path.resolve(__dirname, 'dist') }],
    }),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
}
