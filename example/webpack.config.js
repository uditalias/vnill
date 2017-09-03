const webpack = require('webpack');
const path = require('path');
const contextPath = path.join(__dirname, 'src');
const destinationDir = path.join(__dirname, 'public');

module.exports = {

    stats: {
        errors: true,
        errorDetails: true,
        colors: true,
        modules: true,
        reasons: true,
        performance: true,
        timings: true
    },

    devtool: "#source-map",

    context: contextPath,

    entry: {
        app: "app.js"
    },

    resolve: {
        extensions: [".js"],

        modules: [contextPath, "node_modules"]
    },
    
    module: {
        rules: [{
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }],
        }]
    },

    output: {
        path: path.resolve(__dirname, destinationDir),
        filename: 'bundle.js'
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ]
};