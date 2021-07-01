const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    entry: {
        index: './src/main-map/index.ts',
        index2: './src/main-map2/index.ts',
        login: './src/login-map/index.ts',
        'join-member-map': './src/join-member-map/join-member-map.ts',
        'Find-Password': './src/Find-Password/Find-Password.ts',
        'Find-id': './src/Find-id/Find-id.ts'
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
                }
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css'],
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
        new HtmlWebpackPlugin({
            template: './src/join-member-map/join-member-map.html',
            title: 'join-member-map',
            inject: true,
            chunks: ['join-member-map'],
            filename: 'join-member-map.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/Find-Password/Find-Password.html',
            title: 'Find-Password',
            inject: true,
            chunks: ['Find-Password'],
            filename: 'Find-Password.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/Find-id/Find-id.html',
            title: 'Find-id',
            inject: true,
            chunks: ['Find-id'],
            filename: 'Find-id.html',
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
        port: 5500
    },
};