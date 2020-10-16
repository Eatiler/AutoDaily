const path = require('path');
const router = require('koa-router')();
const WXBizMsgCrypt = require('wxcrypt');
const {SendMsg,WeChat} = require(path.resolve(__dirname,'../../master.config.js'));
const {TalkCommand} = require(path.resolve(__dirname,'../Config/talking.js'));           //处理对话消息
const wxBizMsgCrypt = new WXBizMsgCrypt(WeChat.Token, WeChat.EncodingAESKey, WeChat.CorpId);
const { x2o } = require('wxcrypt');                             //转化XML
let DialogStatus = {};                                          //用户对话状态
let DestroyStatus = {};                                           //销毁管理器
router.get('/',async (ctx,next)=>{
  // 校验URL
  let msg = wxBizMsgCrypt.verifyURL(ctx.query.msg_signature, ctx.query.timestamp, ctx.query.nonce, ctx.query.echostr);
  ctx.body = msg;
});

router.post('/',async(ctx,next)=>{
  ctx.body = {};
  let msginfo = wxBizMsgCrypt.decryptMsg(ctx.query.msg_signature, ctx.query.timestamp, ctx.query.nonce, ctx.request.body);        //解密消息内容
  let {xml} = x2o(msginfo);             //xml节点内容
  // SendMsg.CorpMsg('以收到消息内容'+xml.FromUserName);
  if(DialogStatus.hasOwnProperty(xml.FromUserName)){
    DialogStatus[xml.FromUserName].HandleMsg(xml.Content);
    DestroyUser(xml.FromUserName);                                          //重制计时器
  }else {
    DialogStatus[xml.FromUserName] = new TalkCommand(xml.FromUserName);     //初始化
    DialogStatus[xml.FromUserName].HandleMsg(xml.Content);                  //对话回复
    DestroyUser(xml.FromUserName);                                          //对话销毁计时初始化
  }

});


function DestroyUser(account){
  clearTimeout(DestroyStatus[account]);
  DestroyStatus[account] = setTimeout(()=>{
    clearTimeout(DestroyStatus[account]);
    delete DialogStatus[account];
    SendMsg.CorpMsg('当前对话已结束',account);
    delete DestroyStatus[account];
  },180000);            //3分钟销毁对话记录
}

module.exports = router;
