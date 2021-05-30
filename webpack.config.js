const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    entry: {
        index: './src/main-map/index.ts',
        index2: './src/main-map2/index.ts',
        login: './src/login-map/index.ts'
    },
    devtool: 'inline-source-map',
    mode:'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: "file-loader",
                options: {
                    name: "assets/[name].[ext]",
                    publicPath: 'assets',
                    // outputPath: 'assets'
                }
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: (entrypoint) => `runtimechunk~${entrypoint.name}`
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        filename: '[name].[hash:20].js',
        path: buildPath
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/main-map/index.html',
            title: 'index',
            inject: true,
            chunks: ['index'],
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/main-map2/index.html',
            title: 'index2',
            inject: true,
            chunks: ['index2'],
            filename: 'index2.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/login-map/index.html',
            title: 'login',
            inject: true,
            chunks: ['login'],
            filename: 'login.html',
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css"
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: "src/assets", 
                    to: "assets" 
                }
            ],
        })
    ],
    devServer:{
        contentBase:`${__dirname}/dist`,
        inline:true,
        hot:true,
        host: '127.0.0.1',
        port: 4500
    },
    // 빌드를 위한 것
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack_cache')
    },
};