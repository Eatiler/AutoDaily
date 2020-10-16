const fs = require('fs');
let FileJson =  fs.readFileSync(__dirname+'/config.json', 'utf8');                //载入JSON配置文件
let {ServeConfig} = JSON.parse(FileJson);                                         //KOA 配置信息
let {WeChat} = JSON.parse(FileJson);                                              //企业微信配置详情
let {BonusConfig} = JSON.parse(FileJson);                                              //京东签到运行时间
const {WeChatMsg} = require(__dirname+'/Tools/wechat-msg.js');                    //引入企业微信消息模块
const SendMsg = new WeChatMsg(WeChat.CorpId,WeChat.CorpSecret,WeChat.AgentId);

module.exports = {
  ServeConfig,
  SendMsg,
  WeChat,
  BonusConfig
};
