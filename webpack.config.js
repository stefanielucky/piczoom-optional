let path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode:'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'vue3-piczoom.js',
        library: 'vue3-piczoom',
        libraryTarget: "umd"
    },
    plugins:[new VueLoaderPlugin()],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']},
            {
                test: /\.png$/,
                use: [{
                   loader: 'url-loader',  //使用url-loader处理打包图片
                    options:{
                       limit:10750
                    }
                 }]
             },
             {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/, //排除作用 node_modules下不要处理
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],  //处理方式
                    }
                }
            }
        ]
    },
    externals: {
        vue: 'vue'
    }

}

