# AutoDaily 使用说明
基于node.js环境，可以通过企业微信应用来控制的京东签到服务<br>
只需要通过简单的数字回复就可以做到更新Cookie ，更新签到脚本.
> 注意：本工具依赖企业微信应用<br>

>
### 配置说明
> ### 一、首先配置 `config.json `文件
```json
{
  "ServeConfig":{
    "Port":9968                 //企业微信接收api端口
  },
  "WeChat":{
    "Token":"",                 //企业微信【接收消息服务器配置】Token
    "EncodingAESKey":"",        //企业微信【接收消息服务器配置】EncodingAESKey
    "CorpId":"",                //企业微信ID
    "AgentId":"",               //企业微信应用AgentId
    "CorpSecret":""             //企业微信应用Secret
  },
  "BonusConfig":{
    "JDServe":{
      "Bonus":"9:30:00",        //每天自动签到的时间
      "Update":"22:30:00"       //每天自动更新签到脚本的时间
    }
  }
}

```
> ### 三、启动服务
node.js 版本12.X以上<br>
> ##### 1) 根目录下初始化 `npm install`
> ##### 2) 运行 `npm run serve`
如果运行报错。则需要全局安装`pm2`

> ##### 3) pm2全局安装 `npm install pm2 -g` <br>
>

> ### 四、配置接收域名
URL 校验服务 运行在` http://127.0.0.1:port/wechat` <br>



> #### 五、进入企业微信应用中初始化

>##### 1）首次对话回复任意内容可以呼出菜单栏
>##### 2）根据菜单操作更新签到脚本至最新版
>##### 3）选择更新Cookie 配置自己的京东账户Cookie
>##### 4）更新完可以选择手动执行一次，否则等自动签到时间到来才会执行
