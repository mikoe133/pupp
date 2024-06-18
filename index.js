const puppeteer = require('puppeteer');
const { Errwritefile } = require('./tools/Errwritefile')
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

  // 收集文本内容并计算中文字符数量  
  const { contentWithWeights, title ,soucecode} = await page.evaluate((tag,chineseRegex) => {  
    // 初始化内容数组  
    let content = [];  
    let soucecode = document.documentElement.outerHTML;
    // 用于检测是否包含中文字符的简单正则表达式  
function containsChinese(text) {  
  return /[\u4e00-\u9fa5]/.test(text);  
}  
    // 递归函数，用于遍历DOM元素  
    function traverseDOM(node) {  
      if (node.nodeType === Node.ELEMENT_NODE) {  
        const tagName = node.tagName.toLowerCase();  
        // 只处理p、div、h1、h2标签  
        if (['p', 'div', 'h1', 'h2'].includes(tagName)) {  
          const textContent = node.textContent.trim();  
          if (containsChinese(textContent)) {  
            // 计算中文字符数量（这里简化处理，只统计中文字符）  
            const chineseCharsCount = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length;  
            if (chineseCharsCount > 0) {  
              // 存储内容及其权重（这里权重为中文字符数量）  
              content.push({ text: textContent, weight: chineseCharsCount });  
            }  
          }  
        }  
        // 递归遍历子元素  
        for (let child = node.firstChild; child; child = child.nextSibling) {  
          traverseDOM(child);  
        }  
      }  
    }  
  
    // 从body开始遍历  
    traverseDOM(document.body);  
  
    // 根据中文字符数量排序内容  
    content.sort((a, b) => b.weight - a.weight);  
  
    // 返回排序后的内容列表和页面标题  
    return { contentWithWeights: content, title: document.title,soucecode:soucecode };  
  }, tag,/[\u4e00-\u9fa5]/);  
  
  // 假设我们只想要中文字符数量最多的两个内容片段  
  const topContent = contentWithWeights.slice(0, 2).map(item => item.text).join('\n\n');  
  
  // 构建最终的文本内容  
  const fullText = uurl.trim() + '\n\n' +  
    (tag.tag1 ? `${tag.tag1}\n${tag.must}\n\n` : `${tag.must}\n\n`) +  
    title + '\n\n' +  
    (topContent.length > 0 ? topContent : 'content内容未检索到或太短') + '\n\n'+soucecode;  
  
  await browser.close();  
  return { fullText, title };  
}  