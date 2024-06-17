function Errwritefile(uurl, error) {
  let path = require('path');
  let fs = require('fs');
  let { tag } = require('../constants/constants');
  let folderPath = path.join(__dirname, '..', 'err', tag.tag1);
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
  let errorString = error.toString(); // 将error对象转换为字符串
  let filePath = folderPath.replace(/\\/g, '/');
  let filepath1 = uurl.match(/[a-zA-Z0-9]/g).join('');
  console.log("filepath1-----", filepath1);  let correctedFilePath = path.join(filePath, filepath1 + ".txt");
  fs.writeFile(correctedFilePath, errorString, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("err文件写入成功");
  });
}

module.exports = { Errwritefile };