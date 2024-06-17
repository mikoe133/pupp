

function errwritefile(uurl,error){
    let { tag } = require('../constants/constants'); 
    let folderPath = path.join(__dirname, '..','err', tag.tag1);
if (!fs.existsSync(folderPath)) {
  fs.mkdir(folderPath, { recursive: true }, err => {
    if (err) {
      console.log('创建err文件夹失败', err);
      return;
    }
    console.log("创建err文件夹成功");
  });
} else {
  console.log("err文件夹已存在，无需创建");
}
fs.writeFile(folderPath + '/' + uurl+ ".txt", error, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("err文件写入成功");
});
}
module.exports = {errwritefile};


