const puppeteer = require('puppeteer');
const {errwritefile} = require('./tools/Errwritefile')
const { tag } = require('./constants/constants');
const { handleURLfn } = require('./tools/handleURLfn')
var fs = require("fs");
const path = require('path');
handleURLfn().then(dataArray => {
  Promise.all(dataArray.map(uurl => {
    return getContentFromPage(uurl, tag)
      .then(content => {
        let folderPath = path.join(__dirname, '/target', tag.tag1);
        if (!fs.existsSync(folderPath)) {
          fs.mkdir(folderPath, { recursive: true }, err => {
            if (err) {
              console.log('创建文件夹失败', err);
              return;
            }
            console.log("创建文件夹成功");
          });
        } else {
          console.log("文件夹已存在，无需创建");
        }

        let filePath = folderPath + '/' + content.title + ".txt";
        if (fs.existsSync(filePath)) {
          console.log("文件已存在，跳过写入操作");
          return;
        }

        fs.writeFile(filePath, content.fullText, function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("文件写入成功");
        });

      })
      .catch(error => {
        errwritefile(uurl, error)
      });
  })).then(() => {
    console.log('所有页面内容处理完成');
  }).catch(error => {
    console.error('Promise.all 捕获到错误:', error);
    errwritefile(uurl,error)
  });
});

async function getContentFromPage(uurl, tag) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(uurl);
  const content = await page.evaluate((uurl, tag) => {
    let sourceCode = document.documentElement.outerHTML;
    let fullText = '';
    const title = document.title;
    if (sourceCode == null) {
      console.log('无法爬取网站内容')
    } else {
      const chineseAndSymbolsContent = sourceCode.match(/[\u4e00-\u9fa5，。；，。！、？]{40,60}/g);
      const tagLine = tag.tag1 ? `${tag.tag1}\n${tag.must}\n\n` : `${tag.must}\n\n`;

      if (chineseAndSymbolsContent !== null && chineseAndSymbolsContent.length >= 2) {
        fullText = uurl.trim() + '\n\n' + tagLine + title + '\n\n' + chineseAndSymbolsContent[Math.floor(Math.random() * chineseAndSymbolsContent.length)] + '\n\n' + chineseAndSymbolsContent[Math.floor(Math.random() * chineseAndSymbolsContent.length)] + '\n\n' + sourceCode;
      } else {
        fullText = uurl.trim() + '\n\n' + tagLine + title + '\n\n' + 'content内容未检索到或太短' + '\n\n' + sourceCode;
      }
    }
    return {
      fullText,
      title
    };
  }, uurl, tag);
  await browser.close();
  return content;
}