const path = require('path');
const {SendMsg} = require(path.resolve(__dirname,'../../master.config.js'));
const {HandleWork} = require(path.resolve(__dirname + '../../../AutoBonus/index.tools.js'));
const TalkWork = new HandleWork();
class TalkCommand {

  constructor(name){
    this.FromUser = name;
    this.MsgList = [];
  }

  async Menus(){
    let detail ='**【功能菜单】** \n '+
        '>[1]京东签到脚本至最新版 \n'+
        '>[2]更新京东Cookie \n'+
        '>[3]手动执行【京东】签到  \n '+
        '【回复菜单编号数字执行】 \n';
    await SendMsg.CorpMsg(detail,this.FromUser);
  }

  async Instruction1(){
    // console.log('菜单1执行');
    await SendMsg.CorpMsg('已执行京东脚本更新',this.FromUser);
    try{
      await TalkWork.JDUpdate();
      await SendMsg.CorpMsg('京东签到脚本更新完成',this.FromUser);
      this.MsgList.pop();     //返回上一级
      await this.Menus();
    }catch(e){
      await SendMsg.CorpMsg('【网络错误】无法连接Github服务器',this.FromUser);
      this.MsgList = [0];
    }
  }

  async Instruction2(cookie){
    // console.log('菜单2执行');
    await TalkWork.SetJDCookie(cookie);
    await TalkWork.SaveCookie();
    await SendMsg.CorpMsg('京东签到Cookie更新完成',this.FromUser);
    this.MsgList.pop();     //返回上一级
    await this.Menus();
  }



  async Instruction3(){
    // console.log('菜单4执行');
    await SendMsg.CorpMsg('开始执行京东签到',this.FromUser);
    try{
      await TalkWork.JDBonus();
      await this.Menus();
      this.MsgList.pop();     //返回上一级
    }catch (e) {
      await SendMsg.CorpMsg('签到失败\n'+e,this.FromUser);
    }
  }

  HandleMsg(ctx){
    let msg = ctx.replace(/\r\n/g,"");        //过滤消息中的回车
    //没有回复过消息则回复菜单内容
    if(this.MsgList.length -1 === -1){
      this.Menus();
      this.AddKey(0);
    }else{
      let IntMsg = Number(msg.toString().trim());
      switch (IntMsg) {
        case 1 : this.AddKey(1);this.Instruction1();break;
        case 2 : this.AddKey(2);SendMsg.CorpMsg('请回复Cookie文本',this.FromUser);break;
        case 3 : this.AddKey(3);this.Instruction3();break;
        default:this.SetCommand(msg);break;
      }
    }
  }
  //插入操作顺序
  AddKey(num){
    this.MsgList.push(num);
  }

  SetCommand(msg){
    let IntMsg = this.MsgList[this.MsgList.length-1];
    switch (IntMsg) {
      case 2 : this.Instruction2(msg);break;
      default:this.Menus();break;
    }
  }

}

module.exports = {
  TalkCommand
};
