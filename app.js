'use strict';
const path = require('path');

class AppBootHook {


  constructor(app) {
    this.app = app;
  }

  beforeStart() {
    this.app.runSchedule('backup_data');
  }

  configWillLoad() {

    this.app.loader.loadFile(path.join(this.app.config.baseDir, 'app/bootstrap/index.js'));
    const ctx = this.app.createAnonymousContext();
    // eslint-disable-next-line no-undef
    this.app.nunjucks.addExtension('remote', new remote(ctx));

  }

  // eslint-disable-next-line no-empty-function
  async didLoad() {

  }

  async willReady() {

    // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
  }

  // eslint-disable-next-line no-empty-function
  async didReady() {

  }
}

module.exports = AppBootHook;
