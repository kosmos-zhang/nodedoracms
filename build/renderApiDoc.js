/*
 * @Author: doramart
 * @Date: 2019-11-20 14:25:02
 * @Description 修改API文档
 * @Last Modified by:   doramart
 * @Last Modified time: 2019-11-20 14:25:02
 */
'use strict';
const fs = require('fs');
const apiDocPathArr = [ './app/public/apidoc/api_data.json',
  './app/public/apidoc/api_data.js',
  './app/public/apidoc/api_project.json',
  './app/public/apidoc/api_project.js' ];
let docState = 'dev'; //  dev 或 prd 可选
require('shelljs/global');
const argvs = process.argv;
if (argvs[2] === '--docv') {
  docState = argvs[3];
}
if (docState === 'prd') {
  for (const targetPath of apiDocPathArr) {
    if (fs.existsSync(targetPath)) {
      const apiDocHtmlText = fs.readFileSync(targetPath, 'utf-8');
      const reg = new RegExp('http://localhost:8080', 'g');
      const newApiHtmlText = apiDocHtmlText.replace(reg, 'http://111.229.88.118:8080');
      fs.writeFileSync(targetPath, newApiHtmlText);
    }
  }
}
