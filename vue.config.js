module.exports = {
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: false,
  productionSourceMap: false,
  runtimeCompiler: true, //关键点在这
    configureWebpack:{
        resolve:{
            // extension:[].vue.js.css配置过了,
            alias:{
                'assets':'@/assets',
                // 'common':'@/common',
                'components':'@/components',
                'network':'@/network'
            }
        }
    }
}