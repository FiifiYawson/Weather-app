const path = require("path");
const hwp = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src", "index.js"),
    output: {
        path: path.resolve(__dirname, "static"),
        filename: "bundle.js",
        clean: true,
    },
    devtool: "source-map",
    devServer: {
        port: 4000,
        hot: true,
        static: {
            directory: path.resolve(__dirname, "static")
        }
    },
    plugins: [
        new hwp({
            title: "web pack plugin",
            filename: "index.html",
            template: path.resolve(__dirname, "src/template.html")
        })
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    }

}