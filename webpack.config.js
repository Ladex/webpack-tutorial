var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('Webpack-merge');
var validate = require('webpack-validator');
var parts = require('./libs/parts');

var PATHS = {
    app: path.join(__dirname, 'app'),
    style:[
        path.join(__dirname,'node_modules', 'purecss'),
        path.join(__dirname,'app', 'main.css')
    ],
    build: path.join(__dirname, 'build')
};

var common = {
    entry: {
        style:PATHS.style,
        app: PATHS.app
            // vendor:['react']
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
        config = merge(common, {
                devtool: 'source-map',
                output: {
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    chunkFilename: '[chunkhash].js'
                }
            },
            parts.setFreeVariable('process.env.NODE_ENV', 'production'),
            parts.minify(),
            parts.extractCSS(PATHS.style),
            parts.purifyCSS([PATHS.app]),
            parts.extractBundle({
                name: 'vendor',
                entries: ['react']
            }),
            parts.clean(PATHS.build)
        );
        break;
    default:
        config = merge(common, { devtool: 'eval-source-map' },
            parts.setupCSS(PATHS.style),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT
            }));
}

module.exports = validate(config);
