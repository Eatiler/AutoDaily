const fs = require('fs');
const Koa = require('koa');
let Router = require('koa-router');
const cors = require('@koa/cors');
const app = new Koa();
app.use(cors());                    //跨域
let router = new Router();          //请求路由
const koaBody = require('koa-body');
app.use(koaBody());
// 首页
app.use(async (ctx, next) => {
  if(ctx.header.token !== null){
    ctx.header.authorization = 'Bearer '+ctx.header.token       // 插入 jwt
  }
  if (ctx.request.path === '/') {
    ctx.response.status = 200;
    ctx.response.body = 'AutoDaily-System';
  }

  await next();
});

const JwtKoa = require('koa-jwt');                                 //引入Jwt
const {JwtKey} = require(__dirname+'/Config/verify.js');        //Jwt 密钥

/* jwt密钥 */
// passthrough 为 false时 在当前中间件判断
app.use(function (ctx, next) {        //捕获错误
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        status:2,
        msg:err
      };
      // throw {msg:err};
    }
  });
});

app.use(JwtKoa({secret:JwtKey,passthrough: false}).unless({
      path: [ /^\/wechat/],            //  企业应用不需要验证token接口
    })
);


// 其他页面通过 router 加载
let urls = fs.readdirSync(__dirname + '/Routes');
urls.forEach((element) => {
  // urls 下面的每个文件负责一个特定的功能，分开管理
  //读取 urls 目录下的所有文件名，挂载到 router 上面
  let module = require(__dirname + '/Routes/' + element);
  router.use('/' + element.replace('.js', ''), module.routes(), module.allowedMethods())
});


app.use(router.routes()).use(router.allowedMethods());




process.on('message',(Config)=>{
  // console.log(process.pid)
  // console.log(Config.Port)
  app.listen(Config.Port, () => {                                     //启动koa服务器
    process.stdout.write('\n AutoDaily-Koa 端口【'+Config.Port+'】/ 子进程PID【'+process.pid+'】\n');
  });

});
