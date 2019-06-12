const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
entry:['babel-polyfill','./src/js/index.js'],
output:
{
    path:path.resolve(__dirname,'dist'),
    filename:'js/bundle.js'
},
devServer:
{
    contentBase :'./dist'

},
plugins:[new htmlWebpackPlugin({
    filename: 'index.html',
    template:'./src/index.html'

})],
module: {
    //rules is an array that contains all the loaders to be used
    rules: [
        {
            //test will look for all files ending with .js.It is a regular expression
            test: /\.js$/,
            
            //we want to exclude everything in node_modules, 
            //else babel will be applied to all 1000's of js files inside node_module
            //If we exclude it, babel files will be applie only to js files of pur project
            exclude: /node_modules/,

            //
            use: {
                loader: 'babel-loader'
            }
        }
    ]
}
};