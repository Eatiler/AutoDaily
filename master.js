const ChildProcess = require('child_process');
const {ServeConfig,BonusConfig,WeChat} = require(__dirname+'/master.config.js');              //引入配置信息
process.stdout.write("\n 【 AutoDaily System 】 初始化");
//———Koa服务————
const KoaServe = ChildProcess.fork(__dirname+'/Koa/index.js');
KoaServe.send(ServeConfig);                                                     //传输配置参数
KoaServe.on('message',(detail)=>{                                             //接收来自子进程的数据回报

});
//———签到服务————
const BonusServe = ChildProcess.fork(__dirname+'/AutoBonus/index.js');          //自动签到服务
BonusServe.send(BonusConfig);                                                   //传输配置参数
BonusServe.on('message',(detail)=>{

});






