/**
 * Created by Administrator on 2015/4/15.
 * 数据操作记录
 */

module.exports = app => {

    const mongoose = app.mongoose;
    var shortid = require('shortid');
    var Schema = mongoose.Schema;

    var SystemConfigSchema = new Schema({
        _id: {
            type: String,

            'default': shortid.generate
        },
        date: {
            type: Date,
            default: Date.now
        },
        siteName: {
            type: String,
            default: 'BW技术园地',
        },
        ogTitle: {
            type: String,
            default: ''
        },
        siteLogo: {
            type: String,
            default: '/static/themes/dorawhite/images/logo.png'
        }, // 站点logo
        siteDomain: {
            type: String,
            default: 'https://www.daisyyang.cn'
        },
        siteDiscription: {
            type: String,
            default: 'BW技术园地'
        },
        siteKeywords: String,
        siteAltKeywords: String, // 标签内的alt关键字
        siteEmailServer: String,
        siteEmail: String,
        siteEmailPwd: String,
        registrationNo: {
            type: String,
            default: ''
        },
        mongodbInstallPath: String,
        databackForderPath: String,
        showImgCode: {
            type: Boolean,
            default: false
        }, // 是否显示验证码
        bakDatabyTime: {
            type: Boolean,
            default: false
        }, // 是否自动备份数据
        bakDataRate: {
            type: String,
            default: '1'
        }, // 数据备份频率
        statisticalCode: {
            type: String,
            default: ''
        }, // 百度统计链接
    });

    return mongoose.model("SystemConfig", SystemConfigSchema, 'systemconfigs');

}
