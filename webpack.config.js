const Fiber = require('fibers');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MediaQueryPlugin = require('media-query-plugin');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');

var path = require('path');

const publicPath = '/';

module.exports = {
    watchOptions: {
        ignored: [
            path.resolve(__dirname, 'html/js'),
            path.resolve(__dirname, 'html/css'),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    
    mode: 'development', //development or production
    
    entry: ["./ts/index.tsx", "./sass/index.scss"],
    output: {
        filename: "js/bundle.js",
        path: path.resolve(__dirname, 'html'),
        publicPath: publicPath,
    },
    
    devServer: {
        contentBase: path.resolve(__dirname, './html'),
        compress: true,
        hot: true,
        port: 9000,
    },
    
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".scss"]
    },
    
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "css/[name].css",
            chunkFilename: "css/[id].css",
        }),
        new CopyPlugin([
            {from: 'node_modules/react/umd/react.development.js', to: "js/"},
            {from: 'node_modules/react-dom/umd/react-dom.development.js', to: "js/"},
        ]),
    ],
    
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, 
                loader: "awesome-typescript-loader",
            },
            
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            //Sass 
            {
                test: /\.scss$/,
                use: [
                    // fallback to style-loader in development
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    // MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};
