const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    devtool: "cheap-module-eval-source-map",
    // entry: ["@babel/polyfill","./src/main.js"],
    entry: {
        "chain.common":"./src/index.common.js",
        "chain": "./src/index.js"
    },
    output: {
        path: path.join(__dirname, "./dist/"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".es6", ".js", ".jsx", ".tsx", ".ts"]
    },
    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        // new htmlWebpackPlugin({
        //     template: "./index.html"
        // }),
        new CleanWebpackPlugin({
            verbose: true,
            dry: false
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: "babel-loader"
            }
        }]
    }
};