/**
 * Created by Administrator on 2015/4/15.
 * 管理员对象
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const shortid = require('shortid');
  const Schema = mongoose.Schema;

  require('./adminGroup');

  const AdminUserSchema = new Schema({
    id: String,
    _id: {
      type: String,

      default: shortid.generate,
    },
    name: String,
    userName: String,
    password: String,
    email: String,
    phoneNum: String,
    countryCode: {
      type: String,
    }, // 手机号前国家代码
    comments: String,
    date: {
      type: Date,
      default: Date.now,
    },
    logo: {
      type: String,
      default: '/static/upload/images/defaultlogo.png',
    },
    enable: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: '1', // 1正常，0删除
    },
    auth: {
      type: Boolean,
      default: false,
    },
    group: {
      type: String,
      ref: 'AdminGroup',
    },
  });


  return mongoose.model('AdminUser', AdminUserSchema, 'adminusers');

};
