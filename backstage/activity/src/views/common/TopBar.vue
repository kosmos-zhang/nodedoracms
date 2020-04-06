<template>
  <div class="dr-toolbar">
    <el-col :xs="12" :md="6" class="option-button">
      <el-button size="small" type="primary" plain @click="addActivity('activity')" round>
        <svg-icon icon-class="icon_add" />
      </el-button>
      <el-button size="small" type="danger" plain round @click="branchDelete('activity')">
        <svg-icon icon-class="icon_delete" />
      </el-button>
      <!-- TOPBARLEFT -->
    </el-col>
    <el-col :xs="12" :md="18">
      <div class="dr-toolbar-right">
        <div class="dr-select-box">
          <el-select size="small" @change="changePostOptions" v-model="authPost" placeholder="请选择">
            <el-option
              v-for="item in authPostOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
import { deleteActivity, regUserList } from "@/api/activity";
export default {
  props: {
    device: String,
    pageInfo: Object,
    type: String,
    ids: Array
  },
  data() {
    return {
      loading: false,
      selectUserList: [],
      searchkey: "",
      authPost: "0",
      authPostOptions: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "待审核"
        }
      ]
    };
  },
  methods: {
    addActivity() {
      this.$store.dispatch("activity/showActivityForm");
      this.$router.push(this.$root.adminBasePath + "/activity/addActivity");
    },
    branchDelete(target) {
      let _this = this;
      if (_.isEmpty(_this.ids)) {
        this.$message({
          type: "info",
          message: this.$t("validate.selectNull", {
            label: this.$t("main.target_Item")
          })
        });
        return false;
      }
      this.$confirm(
        this.$t("main.del_notice"),
        this.$t("main.scr_modal_title"),
        {
          confirmButtonText: this.$t("main.confirmBtnText"),
          cancelButtonText: this.$t("main.cancelBtnText"),
          type: "warning"
        }
      )
        .then(() => {
          let ids = _this.ids.join();
          return deleteActivity({
            ids
          });
        })
        .then(result => {
          if (result.status === 200) {
            this.$store.dispatch("activity/getActivityList");
            this.$message({
              message: `${this.$t("main.scr_modal_del_succes_info")}`,
              type: "success"
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: this.$t("main.scr_modal_del_error_info")
          });
        });
    },
    searchResult(ev) {
      let searchkey = this.pageInfo ? this.pageInfo.searchkey : "";
      this.$store.dispatch("activity/getActivityList", {
        searchkey
      });
    },
    changePostOptions(value) {
      if (value == "0") {
        this.$store.dispatch("activity/getActivityList");
      } else if (value == "1") {
        this.$store.dispatch("activity/getActivityList", { state: "1" });
      }
    }
    // TOPBARLEFTOPTION
  },
  components: {}
};
</script>
<style lang="scss">
</style>
