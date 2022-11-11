//新版配置代码
const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app){
  app.use(
    createProxyMiddleware('/generator',{
      target:'http://localhost:8088',
      changeOrigin:true,
      pathRewrite:{'^/generator':''}
    })
  )
}