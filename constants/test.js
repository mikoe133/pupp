handleURLfn().then(dataArray => {
    // 使用 Promise.all 来等待所有 getContentFromPage 的 Promise 完成  
    Promise.all(dataArray.map(uurl => {
        console.log("1");
        console.log(uurl);
        return getContentFromPage(uurl, tag)
            .then(content => {
                const folderPath = path.join(__dirname, '/target', tag);
                console.log(folderPath);
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

                fs.writeFile(folderPath + '/' + content.title + ".txt", content.fullText, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("文件写入成功");
                });
            })
            .catch(error => {
                // 单独处理 getContentFromPage 抛出的错误  
                console.error('从页面获取内容时发生错误:', error, 'URL:', uurl);
            });
    })).then(() => {
        // 所有页面内容都已处理完毕  
        console.log('所有页面内容处理完成');
    }).catch(error => {
        // 这里处理 Promise.all 的错误（实际上这个 catch 可能永远不会被触发，除非 handleURLfn 出错）  
        console.error('Promise.all 捕获到错误:', error);
    });
});

// getContentFromPage 函数保持不变