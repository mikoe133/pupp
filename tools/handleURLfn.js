function handleURLfn() {  
    return new Promise((resolve, reject) => {  
        let { createReadStream } = require('fs');  
        let path = require('path');  
        let { tag } = require('../constants/constants');  
        let filePath1 = path.join(__dirname, '..', 'OriginURL', `${tag.tag1}.txt`);  
        let rs = createReadStream(filePath1, {  
            highWaterMark: 10 * 1024 * 1024,  
        });  
  
        let dataArray = [];  
        rs.on('data', function (data) {  
            let text = data.toString();  
            let splitData = text.split(/[,\s]+/);  
            dataArray = dataArray.concat(splitData);  
        });  
  
        rs.on('error', reject);  
        rs.on('end', function () {  
            console.log('数据读取完成');  
            resolve(dataArray);  
        });  
    });  
}  
  

module.exports = { handleURLfn };