const axios = require('axios');
// 企业微信群消息+应用消息
class WeChatMsg {
  robotOutTime = 0;
  robotToken = '';
  constructor(CorpId,CorpSecret,AgentId){
    // 企业微信应用参数
    this.CorpId = CorpId;                   //企业id
    this.CorpSecret = CorpSecret;           //应用Secret
    this.AgentId = AgentId;                 //应用id
    this.SignLink = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='+CorpId+'&corpsecret='+CorpSecret;         //企业应用签名地址
  }

  //企业应用签名
  async Sign(){
    if(this.robotOutTime>new Date().getTime()){
      // console.log('以存在Token');
      return this.robotToken;                 //未超时可以使用token
    }else {

      let res = await axios.get(this.SignLink);
      this.robotToken = res.data.access_token;                  //记录Token
      let time = res.data.expires_in;                           //记录时间
      this.robotOutTime = new Date().getTime()+Number(time)*1000;
      // console.log('获取初始化Token');
      return this.robotToken;               //返回新token
    }
  }

  //企业应用消息
  async CorpMsg(item,user){
    let token = await this.Sign();
    let target = 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='+token;
    //文字模板字符
    // let msg = item;
    let msg = item;

    let resApp = await axios.post(target, {
      touser: user?user:"@all",
      msgtype: "markdown",
      agentid: this.AgentId,
      markdown: {
        content:msg
      },
      enable_duplicate_check: 1,
      duplicate_check_interval: 5
    });
    return resApp;
  }
}

module.exports = {
  WeChatMsg
};
