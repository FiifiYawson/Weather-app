const path = require("path");
const hwp = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    entry: {
        app: path.resolve(__dirname, "src", "scripts", "index.js"),
    },
    output: {
        path: path.resolve(__dirname, "static"),
        filename: "[name].js",
    },
    devtool: "source-map",
    devServer: {
        port: 4000,
        hot: true,
        static: {
            directory: path.resolve(__dirname, "static")
        },
        watchFiles: ["src/**/*"]
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"]
        }, {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        }, {
            test: /\.html$/i,
            loader: "html-loader",
        }]
    },
    plugins: [
        new hwp({
            template: path.resolve(__dirname, "src", "index.html")
        })
    ]
}