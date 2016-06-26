var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('Webpack-merge');
var validate = require('webpack-validator');
var parts = require('./libs/parts');

var PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

var common = {
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ]
};

var config;
// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(common, parts.setupCSS(PATHS.app));
        break;
    default:
        config = merge(common,
        	parts.setupCSS(PATHS.app),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT
            }));
}

module.exports = validate(config);
