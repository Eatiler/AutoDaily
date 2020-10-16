const path = require('path');
const schedule = require('node-schedule');                                                //定时模块
const {HandleWork} = require(__dirname + '/index.tools.js');
const { SendMsg } =require(path.resolve(__dirname,'../master.config.js'));                //消息推送
const BonusWork = new HandleWork();
class BonusCore {

  constructor(config) {
    this.JDTime = config.JDServe;
    this.JDMsgTime = config.JDServe;
  }

  HandleTime(Time) {
    let TimeArr = Time.split(":");
    let TimeStr = `${TimeArr[2]} ${TimeArr[1]} ${TimeArr[0]} * * *`;
    return TimeStr
  }

  JDComply(Time) {
    SendMsg.CorpMsg('定时签到时间:'+this.JDMsgTime.Bonus);
    let SetTime = this.HandleTime(Time);
    schedule.scheduleJob(SetTime, () => {
      let sleep = Math.ceil(Math.random() * 30) * 1000;  //随机睡眠时间
      const SleepRun = setTimeout(() => {
        BonusWork.JDBonus();          //执行签到任务
        clearTimeout(SleepRun);
      }, sleep);

    });
  }

  JDUpdata(Time) {
    SendMsg.CorpMsg('JD自动更新时间:'+this.JDMsgTime.Update);
    let SetTime = this.HandleTime(Time);
    schedule.scheduleJob(SetTime, () => {
      let sleep = Math.ceil(Math.random() * 30) * 1000;  //随机睡眠时间
      const SleepRun = setTimeout(() => {
        BonusWork.JDUpdate();          //执行更新脚本
        clearTimeout(SleepRun);
      }, sleep);
    });
  }

  async All() {
    this.JDComply(this.JDTime.Bonus);
    this.JDUpdata(this.JDTime.Update);
  }
}


process.on('message', (Config) => {
  // SendMsg.CorpMsg('AutoDaily服务器已启动');
  const TheBonus = new BonusCore(Config);
  TheBonus.All();                     //启动服务
  process.stdout.write('\n AutoDaily-Bonus 服务启动/ 子进程PID【'+process.pid+'】\n');
});
