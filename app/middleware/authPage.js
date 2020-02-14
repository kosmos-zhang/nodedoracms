/*
 * @Author: doramart
 * @Date: 2019-08-16 14:51:46
 * @Last Modified by: doramart
 * @Last Modified time: 2019-09-07 22:40:29
 */
'use strict';

// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
// eslint-disable-next-line no-unused-vars
module.exports = options => {
  return async function authPage(ctx, next) {

    if (ctx.session.logined) {
      await next();
    } else {
      ctx.redirect('/users/login');
    }

  };

};
