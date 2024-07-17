const TerserPlugin = require('terser-webpack-plugin');

module.exports = (config, { isProd, isDev, isTest }) => {
  /**
   * Customize the webpack by modifying the config object.
   * Consult https://webpack.js.org/configuration for more information
   */

  config.optimization.minimizer = [new TerserPlugin()]

  return config;
}
