## 1.安装项目依赖	puppeteer

- 本项目需求node版本>=20

- ```shell
  npm start
  ```

## 2.项目文件夹说明

- other 在原网页控制台测试脚本代码
- target 输出内容文件夹
- uurl 爬取内容网址
- constants 网页标签等常量文件
- err 错误日志文件夹
- OriginURL  需要爬取内容的文件
- tools 公共函数

## 3.url读取策略

Originurl文件夹中相同的domain网址在同一个文件中,由于需求的网站是cv到txt文件中,所以需要进行格式转换操作

## 4.使用步骤

1. 将需要爬取的网站以网站名.txt命名,保存为网站a,网站b,网站c,.....的格式
2. 修改constants中的tag名称为网站名称
3. 启动项目