/** @format */

const HtmlWebpackPlugin = require('html-webpack-plugin') //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack') //to access built-in plugins
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: './.env' })

module.exports = {
  mode: 'production',
  entry: './src/assets/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.min.js',
    publicPath: '/',
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
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({}),
    new webpack.DefinePlugin({
      'process.env.ACCESS_TOKEN': JSON.stringify(process.env.ACCESS_TOKEN),
    }),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
}
