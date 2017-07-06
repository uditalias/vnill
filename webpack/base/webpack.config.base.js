const webpack = require('webpack');
const version = require('../../package.json').version;
const path = require('path');
const contextPath = path.join(__dirname, '../../src');
const appEnv = process.env.NODE_ENV || 'development';
const isProduction = appEnv == 'production';
const isDevelopment = appEnv == 'development';
const destinationDir = (isProduction) ? `../../dist` : `../../build`;

module.exports = {

    stats: {
        errorDetails: true,
        colors: true,
        modules: true,
        reasons: true
    },

    context: contextPath,

    entry: {
        vnill: "index.ts"
    },

    resolve: {
        extensions: [".ts", ".js"],
        modules: [contextPath, "node_modules"]
    },

    output: {
        path: path.resolve(__dirname, destinationDir),
        filename: 'vnill.js',
        libraryTarget: 'umd',
        library: ['vnill']
    },

    module: {
        loaders: [
            {
                test: /\.ts?$/,
                loaders: ['ts-loader'],
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            $_ENVIRONMENT: JSON.stringify(appEnv),
            'process.env.NODE_ENV': JSON.stringify(appEnv),
            'process.env.VERSION': JSON.stringify(version)
        })
    ]
};