const uurl = "      https://www.mfk.com/jibing/gaishu/4311.shtml                ";
const tag = "民福康"
fetch(uurl)
  .then(response => response.text())
  .then(html => {
   if(html==null){
console.log('无法爬取网站内容')
}else{
 const title = document.title;
    // 提取HTML中的纯汉字和符号内容（每段40-60个字符左右）
    const chineseAndSymbolsContent = html.match(/[\u4e00-\u9fa5，。；，。！、？]{40,60}/g);
 const tagLine = tag ? `TOP100\n${tag}\n\n` : 'TOP100\n\n';
    if (chineseAndSymbolsContent !== null && chineseAndSymbolsContent.length >= 2) {
      const fullText =uurl.trim() + '\n\n' + tagLine  + title + '\n\n' + chineseAndSymbolsContent[Math.floor(Math.random() * chineseAndSymbolsContent.length)] + '\n\n' + chineseAndSymbolsContent[Math.floor(Math.random() * chineseAndSymbolsContent.length)] + '\n\n' + html;
      const blob = new Blob([fullText], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${title}.txt`;
      a.click();
    } else {
	 const fullText =uurl.trim() + '\n\n' + tagLine  + title + '\n\n' +'content内容未检索到或太短' +'\n\n'+ html;
 const blob = new Blob([fullText], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download =`${title}(无content内容).txt`
      a.click();
    }
}
  })
  .catch(error => {
    console.error('Error fetching webpage:', error);
  });