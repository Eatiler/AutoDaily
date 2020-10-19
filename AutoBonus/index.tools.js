const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { HandleWget } =require(path.resolve(__dirname,'../Tools/wget-file.js'));           //下载文件
const { SendMsg } =require(path.resolve(__dirname,'../master.config.js'));                //消息推送

class HandleWork {

  ReadCookieJson(){
    const FileJson =  fs.readFileSync(__dirname+'/account.cookie.json', 'utf8');                        //载入用户cookie的JSON配置文件
    return JSON.parse(FileJson);
  }

  WriteCookieJson(file){
    let FileJson = JSON.stringify(file);
    fs.writeFileSync(__dirname+'/account.cookie.json',FileJson);                              //保存编辑后的签到文件
  }

  async JDUpdate(){
    try{
      await HandleWget.Down(__dirname+'/JDModule/Down','JDBonus.js','https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js');
      const FileContent =  fs.readFileSync(__dirname+'/JDModule/Down/JDBonus.js', 'utf8');                //载入下载的JS文件
      fs.writeFileSync(__dirname+'/JDModule/Down/JDBonusBak.js',FileContent);                              //操作备份
      const {JDCookie} = this.ReadCookieJson();
      let HandleKey = `var Key = '${JDCookie.User1}';`;                                                   //用户1数据
      let HandleFileRes = FileContent.replace("var Key = '';",HandleKey);
      fs.writeFileSync(__dirname+'/JDModule/Down/JDBonus.js',HandleFileRes);                              //保存编辑后的签到文件
    }catch(e){
     this.SaveCookie();                               //发生错误恢复原文件备份
    }
  }

  //设置Cookie到Json文件中
  async SetJDCookie(user1){
    let OrgFileRes  = this.ReadCookieJson();
    user1? OrgFileRes.JDCookie.User1 = user1:'';
    this.WriteCookieJson(OrgFileRes);
  }

  //保存Cookie至Js脚本中
  async SaveCookie(){
    const FileContent =  fs.readFileSync(__dirname+'/JDModule/Down/JDBonusBak.js', 'utf8');                //读取备份空白文件去修改
    const {JDCookie} = this.ReadCookieJson();
    let HandleKey = `var Key = '${JDCookie.User1}';`;                                                   //用户1数据
    let HandleFileRes = FileContent.replace("var Key = '';",HandleKey);
    fs.writeFileSync(__dirname+'/JDModule/Down/JDBonus.js',HandleFileRes);                              //保存编辑后的签到文件
  }

  //执行京东签到
  async JDBonus(){
    let runcom = 'node '+__dirname+'/JDModule/Down/JDBonus.js';
    const {stdout, stderr} = await exec(runcom);
    SendMsg.CorpMsg(stdout.split('京东-总京豆查询成功')[1]+stderr)

  }

}


module.exports = {
  HandleWork
};
