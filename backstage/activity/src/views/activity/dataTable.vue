<template>
  <div>
    <el-table
      align="center"
      v-loading="loading"
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleActivitySelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" :label="$t('activities.title')" width="350" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.state =='2'">
            <a :href="'/details/'+scope.row._id+'.html'" target="_blank">{{scope.row.title}}</a>
          </div>
          <div v-else>{{scope.row.title}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="author.name" :label="$t('activities.author')" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{scope.row.uAuthor?scope.row.uAuthor.userName:(scope.row.author?scope.row.author.userName:'')}}</template>
      </el-table-column>
      <el-table-column prop="updateDate" :label="$t('activities.updateDate')" width="180">
        <template slot-scope="scope">{{scope.row.updateDate}}</template>
      </el-table-column>

      <el-table-column prop="clickNum" :label="$t('activities.clickNum')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="commentNum" :label="$t('activities.commentNum')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="state" :label="$t('activities.enable')" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon v-show="scope.row.state=='2'" :style="green" icon-class="check-circle-fill" />
          <svg-icon v-show="scope.row.state!='2'" :style="red" icon-class="minus-circle-fill" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('main.dataTableOptions')" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            round
            @click="editActivityInfo(scope.$index, dataList)"
          >
            <svg-icon icon-class="edit" />
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            round
            @click="deleteActivity(scope.$index, dataList)"
          >
            <svg-icon icon-class="icon_delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss">
.fa-star,
.fa-thumbs-up {
  cursor: pointer;
}

.fa-star-o,
.fa-thumbs-o-up {
  cursor: pointer;
}
</style>
<script>
import { deleteActivity } from "@/api/activity";
import _ from "lodash";
export default {
  props: {
    dataList: Array,
    pageInfo: Object
  },
  data() {
    return {
      loading: false,
      multipleSelection: [],
      yellow: {
        color: "#F7BA2A"
      },
      gray: {
        color: "#CCC"
      },
      green: { color: "#13CE66" },
      red: { color: "#FF4949" }
    };
  },

  methods: {
    handleActivitySelectionChange(val) {
      if (val && val.length > 0) {
        let ids = val.map((item, index) => {
          return item._id;
        });
        this.multipleSelection = ids;
        this.$emit("changeActivitySelectList", ids);
      }
    },
    editActivityInfo(index, rows) {
      let rowData = rows[index];
      this.$router.push(
        this.$root.adminBasePath + "/activity/editActivity/" + rowData._id
      );
    },
    deleteActivity(index, rows) {
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
          return deleteActivity({
            ids: rows[index]._id
          });
        })
        .then(result => {
          if (result.status === 200) {
            Object.assign(this.pageInfo);
            this.$store.dispatch("activity/getActivityList", this.pageInfo);
            this.$message({
              message: this.$t("main.scr_modal_del_succes_info"),
              type: "success"
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("main.scr_modal_del_error_info")
          });
        });
    }
  },
  computed: {}
};
</script>
