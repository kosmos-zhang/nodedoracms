<template>
  <div :class="classObj" class="dr-activityForm">
    <div class="main-container">
      <el-form
        :model="formState.formData"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="device == 'mobile' ? 'top' : 'right'"
      >
        <el-form-item :label="$t('activities.enable')" prop="state">
          <el-select size="small" v-model="formState.formData.state" placeholder="审核文章">
            <el-option
              v-for="item in activityState"
              :key="'kw_'+item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formState.formData.state == '3'" label="驳回原因" prop="dismissReason">
          <el-input size="small" v-model="formState.formData.dismissReason"></el-input>
        </el-form-item>
        <el-form-item :label="$t('activities.title')" prop="title">
          <el-input size="small" v-model="formState.formData.title"></el-input>
        </el-form-item>

        <div v-if="formState.formData.type == '1'">
          <el-form-item :label="$t('activities.stitle')" prop="stitle">
            <el-input size="small" v-model="formState.formData.stitle"></el-input>
          </el-form-item>

          <el-form-item label="关键字" prop="keywords">
            <el-input size="small" v-model="formState.formData.keywords"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="upSimg" :label="$t('activities.sImg')" prop="sImg">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/files"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="{action:'uploadimage'}"
          >
            <img v-if="formState.formData.sImg" :src="formState.formData.sImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button size="mini" @click="getRandomActivityImg()" class="refresh-btn" plain round>
            <svg-icon icon-class="reload" />
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('activities.discription')" prop="discription">
          <el-input size="small" type="textarea" v-model="formState.formData.discription"></el-input>
        </el-form-item>
        <el-form-item :label="$t('activities.comments')" prop="comments">
          <!-- <Ueditor @ready="editorReady" ref="ueditor"></Ueditor> -->
          <vue-ueditor-wrap
            class="editorForm"
            @ready="editorReady"
            v-model="formState.formData.comments"
            :config="editorConfig"
          ></vue-ueditor-wrap>
        </el-form-item>

        <el-form-item class="dr-submitActivity">
          <el-button
            size="medium"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{formState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button>
          <el-button size="medium" @click="backToList">{{$t('main.back')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.edui-default .edui-toolbar {
  line-height: 20px !important;
}
.dr-activityForm {
  padding: 20px;
  .post-rate {
    .el-rate {
      margin-top: 10px;
    }
  }
  .dr-submitActivity {
    position: fixed;
    z-index: 9999999;
    padding: 10px 30px;
    text-align: right;
    right: 0;
    bottom: 0;
    background: none;
    margin-bottom: 0;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 150px;
    line-height: 150px !important;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 158px;
    display: block;
  }

  .upSimg {
    position: relative;
    .refresh-btn {
      position: absolute;
      left: 220px;
      top: 0;
      i {
        // color: #dcdfe6;
        font-weight: 400;
      }
    }
  }
}
</style>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
import { initEvent } from "@root/publicMethods/events";
import {
  getOneActivity,
  addActivity,
  updateActivity,
  getRandomActivityImg,
  regUserList
} from "@/api/activity";

import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    groups: Array
  },
  data() {
    return {
      sidebarOpened: true,
      device: "desktop",
      activityState: [
        { value: "0", label: "退回" },
        { value: "1", label: "待审核" },
        { value: "2", label: "审核通过" },
        { value: "3", label: "审核不通过" }
      ],
      selectUserList: [],
      loading: false,
      userLoading: false,
      selectSpecialList: [],
      content: "",
      simpleComments: "",
      isflash: false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
      editorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "/api/upload/ueditor",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: this.$root.staticRootPath + "/plugins/ueditor/"
      },
      imageUrl: "",
      categoryProps: {
        value: "_id",
        label: "name",
        children: "children"
      },
      currentType: "1",
      rules: {
        sImg: [
          {
            required: true,
            message: this.$t("validate.selectNull", {
              label: "缩略图"
            }),
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("activities.title")
            }),
            trigger: "blur"
          },
          {
            min: 2,
            max: 50,
            message: this.$t("validate.rangelength", { min: 2, max: 50 }),
            trigger: "blur"
          }
        ],
        stitle: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("activities.stitle")
            }),
            trigger: "blur"
          },
          {
            min: 2,
            max: 50,
            message: this.$t("validate.rangelength", { min: 2, max: 50 }),
            trigger: "blur"
          }
        ],
        discription: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("activities.discription")
            }),
            trigger: "blur"
          },
          {
            min: 5,
            max: 300,
            message: this.$t("validate.rangelength", { min: 5, max: 100 }),
            trigger: "blur"
          }
        ],
        comments: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("activities.comments")
            }),
            trigger: "blur"
          },
          {
            min: 5,
            message: this.$t("validate.rangelength", { min: 5, max: 100000 }),
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    VueUeditorWrap
  },
  methods: {
    changeTargetUser(value) {
      let targetUserInfo = _.filter(this.selectUserList, item => {
        return item.value == value;
      });
      if (!_.isEmpty(targetUserInfo)) {
        localStorage.setItem(
          "activityAuthor",
          JSON.stringify(targetUserInfo[0])
        );
      }
    },
    queryUserListByParams(params = {}) {
      let _this = this;
      regUserList(params)
        .then(result => {
          let specialList = result.data.docs;
          if (specialList) {
            _this.selectUserList = specialList.map(item => {
              return {
                value: item._id,
                label: item.userName
              };
            });
            _this.userLoading = false;
          } else {
            _this.selectUserList = [];
          }
        })
        .catch(err => {
          console.log(err);
          _this.selectUserList = [];
        });
    },
    getRandomActivityImg(params = {}) {
      let _this = this;
      getRandomActivityImg(params)
        .then(result => {
          if (result.status == 200 && result && result.data) {
            let randomImg = result.data[0];
            let initFormData = Object.assign({}, this.formState.formData, {
              sImg: randomImg
            });
            // 保留原有指定作者
            let oldUauthor = localStorage.getItem("activityAuthor");
            if (oldUauthor) {
              let targetUser = JSON.parse(oldUauthor);
              this.queryUserListByParams({
                searchkey: targetUser.label
              });
              Object.assign(initFormData, { targetUser: targetUser.value });
            }
            this.$store.dispatch("activity/showActivityForm", {
              formData: initFormData
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkFlashPost(currentType) {
      this.$store.dispatch("activity/showActivityForm", {
        edit: this.formState.edit,
        formData: Object.assign({}, this.formState.formData, {
          type: currentType ? "2" : "1"
        })
      });
    },
    inputEditor(value) {
      this.$store.dispatch("activity/showActivityForm", {
        edit: this.formState.edit,
        formData: Object.assign({}, this.formState.formData, {
          markDownComments: value
        })
      });
    },
    changeEditor(value) {
      console.log(value);
    },
    getLocalActivities() {
      let localActivity = localStorage.getItem("addActivity") || "";
      if (localActivity) {
        return JSON.parse(localActivity);
      } else {
        return {};
      }
    },
    editorReady(instance) {
      this.ueditorObj = instance;
    },

    handleAvatarSuccess(res, file) {
      let imageUrl = res.data.path;
      this.$store.dispatch("activity/showActivityForm", {
        edit: this.formState.edit,
        formData: Object.assign({}, this.formState.formData, {
          sImg: imageUrl
        })
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGIF = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error(this.$t("validate.limitUploadImgType"));
      }
      if (!isLt2M) {
        this.$message.error(
          this.$t("validate.limitUploadImgSize", { size: 2 })
        );
      }
      return (isJPG || isPNG || isGIF) && isLt2M;
    },
    backToList() {
      this.$router.push(this.$root.adminBasePath + "/activity");
    },
    submitForm(formName, type = "") {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.formState.formData, {
            comments: this.ueditorObj.getActivity(),
            simpleComments: this.ueditorObj.getPlainTxt()
          });
          // 更新
          if (this.formState.edit) {
            updateActivity(params).then(result => {
              if (result.status === 200) {
                this.$router.push(this.$root.adminBasePath + "/activity");
                this.$message({
                  message: this.$t("main.updateSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            });
          } else {
            // 新增
            addActivity(params).then(result => {
              if (result.status === 200) {
                this.$router.push(this.$root.adminBasePath + "/activity");
                this.$message({
                  message: this.$t("main.addSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {
    ...mapGetters([]),
    formState() {
      return this.$store.getters.activityFormState;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebarOpened,
        openSidebar: this.sidebarOpened,
        withoutAnimation: "false",
        mobile: this.device === "mobile"
      };
    }
  },
  mounted() {
    initEvent(this);
    // 针对手动页面刷新
    let _this = this;
    if (this.$route.params.id) {
      getOneActivity({ id: this.$route.params.id }).then(result => {
        if (result.status === 200) {
          if (result.data) {
            let activityObj = result.data,
              categoryIdArr = [],
              tagsArr = [];

            if (activityObj.categories) {
              activityObj.categories.map((item, index) => {
                item && categoryIdArr.push(item._id);
              });
              activityObj.categories = categoryIdArr;
            }
            if (activityObj.tags) {
              activityObj.tags.map((item, index) => {
                item && tagsArr.push(item._id);
              });
              activityObj.tags = tagsArr;
            }
            if (activityObj.keywords) {
              activityObj.keywords = activityObj.keywords.join();
            }
            if (activityObj.uAuthor) {
              this.queryUserListByParams({
                searchkey: activityObj.uAuthor.userName
              });
              activityObj.targetUser = activityObj.uAuthor._id;
            }

            this.$store.dispatch("activity/showActivityForm", {
              edit: true,
              formData: activityObj
            });
          } else {
            this.$message({
              message: this.$t("validate.error_params"),
              type: "warning",
              onClose: () => {
                this.$router.push(this.$root.adminBasePath + "/activity");
              }
            });
          }
        } else {
          this.$message.error(result.message);
        }
      });
    } else {
      let localActivity = this.getLocalActivities();
      if (!_.isEmpty(localActivity)) {
        this.$confirm(
          this.$t("main.askForReInputActivity"),
          this.$t("main.scr_modal_title"),
          {
            confirmButtonText: this.$t("main.confirmBtnText"),
            cancelButtonText: this.$t("main.cancelBtnText"),
            type: "warning"
          }
        )
          .then(() => {
            let currentComments = localActivity.comments || "";
            _this.$refs.ueditor.setActivity(currentComments);
            // 清除缓存
            localStorage.removeItem(this.$route.path.split("/")[1]);
            this.$store.dispatch("activity/showActivityForm", {
              edit: false,
              formData: localActivity
            });
          })
          .catch(() => {
            localStorage.removeItem(this.$route.path.split("/")[1]);
            this.$message({
              type: "info",
              message: this.$t("main.scr_modal_del_error_info")
            });
          });
      } else {
        this.getRandomActivityImg();
      }
    }
  }
};
</script>
