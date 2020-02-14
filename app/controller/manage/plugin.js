/*
 * @Author: doramart
 * @Date: 2019-06-20 18:55:40
 * @Last Modified by: doramart
 * @Last Modified time: 2019-11-06 15:11:38
 */
'use strict';
const Controller = require('egg').Controller;
const shell = require('shelljs');


const {
  pluginRule,
} = require('@validate');
const _ = require('lodash');
const muri = require('muri');

class PluginController extends Controller {

  async list() {
    const {
      ctx,
      service,
    } = this;
    try {

      const payload = ctx.query;
      const helpType = ctx.query.helpType;
      const queryObj = {};

      if (helpType) {
        queryObj.type = helpType;
      }

      const pluginList = await ctx.service.plugin.find(payload, {
        query: queryObj,
        searchKeys: [ 'alias', 'enName', 'name' ],
        populate: [{
          path: 'user',
          select: 'name userName _id',
        }],
      });

      let currentPluginList = [];
      if (!_.isEmpty(pluginList) && !_.isEmpty(pluginList.docs)) {

        const renderPluginList = JSON.parse(JSON.stringify(pluginList.docs));
        for (const pluginItem of renderPluginList) {
          const pluginShopItem = await this.ctx.helper.reqJsonData(this.app.config.doracms_api + '/api/pluginManage/getOne?id=' + pluginItem.pluginId);
          if (!_.isEmpty(pluginShopItem)) {
            if (Number((pluginShopItem.version).split('.')) === Number((pluginShopItem.version).split('.'))) {
              pluginItem.shouldUpdate = true;
              pluginItem.targetVersion = pluginShopItem.version;
            } else {
              pluginItem.shouldUpdate = false;
            }
          } else {
            throw new Error(ctx.__('validate_error_params'));
          }
        }
        currentPluginList = _.assign({}, pluginList, {
          docs: renderPluginList,
        });

      } else {
        currentPluginList = pluginList;
      }


      ctx.helper.renderSuccess(ctx, {
        data: currentPluginList,
      });

    } catch (err) {

      ctx.helper.renderFail(ctx, {
        message: err,
      });

    }
  }

  async installPlugin() {

    const {
      ctx,
      service,
    } = this;
    try {

      const pluginId = ctx.query.pluginId;

      const targetPlugin = await ctx.service.plugin.item(ctx, {
        query: {
          pluginId,
        },
      });

      if (!_.isEmpty(targetPlugin)) {
        throw new Error('您已经安装了该插件！');
      }

      // 1、获取插件信息
      const pluginInfos = await this.ctx.helper.reqJsonData(this.app.config.doracms_api + '/api/pluginManage/getOne?id=' + pluginId);

      if (_.isEmpty(pluginInfos)) {
        throw new Error('未找到该插件');
      }

      if (!_.isEmpty(pluginInfos)) {

        // 1、npm install 安装
        shell.exec(`npm install ${pluginInfos.pkgName} --save --registry=https://registry.npm.taobao.org`);

        // 2、初始化数据表
        if (pluginInfos.initData) {
          await this.app.initExtendData(ctx, pluginInfos);
        }

        // 3、插入resource数据
        await this.app.initResourceData(ctx, pluginInfos);

        // 4、插入配置文件
        await this.app.initPluginConfig(pluginInfos);

        // 5、保存插件基本信息到本地
        const currentPluginInfo = _.assign({}, pluginInfos, {
          pluginId: pluginInfos._id,
        });
        delete currentPluginInfo._id;
        await ctx.service.plugin.create(currentPluginInfo);

        ctx.helper.renderSuccess(ctx);

      } else {
        throw new Error(ctx.__('validate_error_params'));
      }


    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async unInstallPlugin() {

    const {
      ctx,
      service,
    } = this;
    try {

      const targetId = ctx.query.pluginId;

      const pluginInfos = await ctx.service.plugin.item(ctx, {
        query: {
          _id: targetId,
        },
      });

      if (_.isEmpty(pluginInfos)) {
        throw new Error(ctx.__('validate_error_params'));
      }

      // 1、npm uninstall 卸载
      // TODO 插件卸载暂不执行卸载库操作
      // shell.exec(`npm uninstall ${pluginInfos.pkgName}`);

      // 2、删除数据表
      if (pluginInfos.initData) {
        await this.app.initExtendData(ctx, pluginInfos, 'uninstall');
      }

      // 3、删除插入的resource数据
      await this.app.initResourceData(ctx, pluginInfos, 'uninstall');

      // 4、删除配置文件
      await this.app.initPluginConfig(pluginInfos, 'uninstall');

      // 5、删除插件基本信息
      await ctx.service.plugin.removes(ctx, targetId);

      ctx.helper.renderSuccess(ctx);

    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }
  async updatePlugin() {

    const {
      ctx,
      service,
    } = this;
    try {

      const targetId = ctx.query.pluginId;

      const pluginInfos = await ctx.service.plugin.item(ctx, {
        query: {
          _id: targetId,
        },
      });

      if (_.isEmpty(pluginInfos)) {
        throw new Error(ctx.__('validate_error_params'));
      }

      const pluginItem = await this.ctx.helper.reqJsonData(this.app.config.doracms_api + '/api/pluginManage/getOne?id=' + pluginInfos.pluginId);

      if (!_.isEmpty(pluginItem)) {
        delete pluginItem._id;
        pluginItem.updateTime = new Date();
        await ctx.service.plugin.update(ctx, targetId, pluginItem);
        shell.exec(`npm install ${pluginItem.pkgName} --save --registry=https://registry.npm.taobao.org`);

      }

      ctx.helper.renderSuccess(ctx);

    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async getOne() {
    const {
      ctx,
      service,
    } = this;
    try {
      const _id = ctx.query.id;

      const targetItem = await ctx.service.plugin.item(ctx, {
        query: {
          _id,
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: targetItem,
      });

    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }

  }


  async removes() {
    const {
      ctx,
      service,
    } = this;
    try {
      const targetIds = ctx.query.ids;
      await ctx.service.plugin.removes(ctx, targetIds);
      ctx.helper.renderSuccess(ctx);

    } catch (err) {

      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async getPluginShopList() {
    const {
      ctx,
      service,
    } = this;
    try {

      const payload = ctx.query;
      const pluginList = await this.ctx.helper.reqJsonData(this.app.config.doracms_api + '/api/pluginManage/getList', payload);
      if (!_.isEmpty(pluginList) && !_.isEmpty(pluginList.docs)) {
        const renderPluginList = JSON.parse(JSON.stringify(pluginList.docs));
        for (const pluginItem of renderPluginList) {
          const targetItem = await ctx.service.plugin.item(ctx, {
            query: {
              pluginId: pluginItem._id,
            },
          });
          if (!_.isEmpty(targetItem)) {
            pluginItem.installed = true;
          } else {
            pluginItem.installed = false;
          }
        }
        pluginList.docs = renderPluginList;
      }
      ctx.helper.renderSuccess(ctx, {
        data: pluginList,
      });

    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async getPluginShopItem() {
    try {
      const {
        ctx,
        service,
      } = this;

      const targetId = ctx.query.id;

      if (!targetId) {
        throw new Error(ctx.__('validate_error_params'));
      }

      const pluginItem = await this.ctx.helper.reqJsonData(this.app.config.doracms_api + '/api/pluginManage/getOne?id=' + targetId);

      ctx.helper.renderSuccess(ctx, {
        data: pluginItem,
      });

    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async createInvoice() {

    const {
      ctx,
      service,
    } = this;

    try {

      const targetId = ctx.request.body.pluginId;

      const pluginItem = await this.ctx.helper.reqJsonData(this.app.config.doracms_api + '/api/pluginManage/getOne?id=' + targetId);
      if (_.isEmpty(pluginItem)) {
        throw new Error(ctx.__('validate_error_params'));
      }
      const invoiceData = {
        subject: pluginItem.name,
        amount: pluginItem.amount,
        body: pluginItem.description,
      };
      const askCreateInvoiceUrl = `${this.app.config.doracms_api}/api/alipaySystem/createInvoice`;
      const createInvoiceResult = await ctx.helper.reqJsonData(askCreateInvoiceUrl, invoiceData, 'post');

      ctx.helper.renderSuccess(ctx, {
        data: createInvoiceResult,
      });

    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async checkInvoice() {

    const {
      ctx,
      service,
    } = this;

    try {


      const noInvoice = ctx.request.body.noInvoice;

      if (!noInvoice) {
        throw new Error(ctx.__('validate_error_params'));
      }

      const checkInviceState = await this.ctx.helper.reqJsonData(this.app.config.doracms_api + '/api/alipaySystem/checkInvoice', {
        noInvoice,
      }, 'post');

      ctx.helper.renderSuccess(ctx, {
        data: checkInviceState,
      });

    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

}

module.exports = PluginController;
