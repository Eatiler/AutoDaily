const util = require('util');
const exec = util.promisify(require('child_process').exec);

class HandleWget {
  static async Down(path,filename,url){
    let wgetcom = 'wget -O '+path+'/'+filename+' '+url;
    const { error,stdout, stderr } = await exec(wgetcom);
    return {error,stdout,stderr}
  }
}

module.exports = {
  HandleWget
};
