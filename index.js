const puppeteer = require('puppeteer');
const {Errwritefile} = require('./tools/Errwritefile')
const { tag } = require('./constants/constants');
const { handleURLfn } = require('./tools/handleURLfn')
var fs = require("fs");
const path = require('path');
handleURLfn().then(dataArray => {
  // 逐个处理每个 uurl
  (async function processUrls() {
    for (const uurl of dataArray) {
      console.log("uurl是:", uurl);
      try {
        const content = await getContentFromPage(uurl, tag);
        let folderPath = path.join(__dirname, '/target', tag.tag1);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          console.log("创建文件夹成功");
        } else {
          console.log("文件夹已存在，无需创建");
        }
        let filePath = path.join(folderPath, content.title + ".txt");
        if (fs.existsSync(filePath)) {
          console.log("文件已存在，跳过写入操作");
          continue;
        }
        fs.writeFileSync(filePath, content.fullText);
        console.log("文件写入成功");
      } catch (error) {
        console.log("uurl是:", uurl);
        Errwritefile(uurl, error);
      }
    }
    console.log('所有页面内容处理完成');
  })().catch(error => {
    console.error('处理过程捕获到错误:', error);
  });
});

async function getContentFromPage(uurl, tag) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(tag.TIME);
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