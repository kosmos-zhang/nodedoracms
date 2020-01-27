'use strict';
const path = require('path')

module.exports = appInfo => {

    return {
        // 插件路径
        admin_root_path: 'http://111.229.88.118:8080/cms/plugins/static/admin',
        // 数据库连接
        mongoose: {
            client: {
                url: 'mongodb://127.0.0.1:27017/doracms2',
                options: {
                    useCreateIndex: true,
                    useUnifiedTopology: true
                },
            },
        },
        // 静态目录
        static: {
            prefix: '/static',
            dir: [path.join(appInfo.baseDir, 'app/public'), '/home/doraData/uploadFiles/static'],
            maxAge: 31536000,
        },
        // 日志路径
        logger: {
            dir: '/home/doraData/logsdir/doracms',
        },
        // 服务地址配置
        server_path: 'http://111.229.88.118:8080',
        server_api: 'http://111.229.88.118:8080/api',

    }
};