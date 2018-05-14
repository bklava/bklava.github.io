const webpack = require('webpack');
// const htmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var ENV = process.env.NODE_ENV;

var webpackConfig = {

    entry: {
        'aldeia': './aldeia.js'
    },

    output: {
        path: __dirname + '/dist',
        // filename: ENV === 'production' ? '[name]-[chunkhash].js' : '[name].js'
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(png|gif)$/,
                loader: 'url-loader'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },

    devServer: {
        host: '192.168.1.99',
        port: 8081,
        https: true
    },

    plugins: [
        // new htmlWebpackPlugin({
        //     title: 'Tour editor',
        //     inject: 'head',
        //     template: './src/ejs/default_index.ejs'
        // }),
        // new BundleAnalyzerPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin() // scope hoisting
    ]

};

// if (ENV === 'production') {
//     webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
//         output: {
//             comments: false,
//             // beautify: true
//         },
//         compress: {
//             warnings: false,
//             drop_console: true
//         },
//         mangle: {
//             props: {
//                 regex: /_$/
//             }
//         }
//     }));
// }

webpackConfig.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']))

module.exports = webpackConfig;