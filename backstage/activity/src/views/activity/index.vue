<template>
  <div :class="classObj" class="content">
    <div class="main-container">
      <DirectUser :dialogState="directUserFormState" :ids="selectlist" />
      <el-row class="dr-datatable">
        <el-col :span="24">
          <TopBar
            :device="device"
            type="content"
            :ids="selectlist"
            :pageInfo="activityList.pageInfo"
          ></TopBar>
          <DataTable
            :dataList="activityList.docs"
            :pageInfo="activityList.pageInfo"
            @changeActivitySelectList="changeSelect"
          ></DataTable>
          <Pagination :device="device" :pageInfo="activityList.pageInfo" pageType="content"></Pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import DataTable from "./dataTable.vue";
import DirectUser from "./directUser.vue";
import TopBar from "../common/TopBar.vue";
import Pagination from "../common/Pagination.vue";
import { mapGetters, mapActions } from "vuex";
import { initEvent } from "@root/publicMethods/events";

export default {
  name: "index",
  data() {
    return {
      selectlist: [],
      sidebarOpened: true,
      device: "desktop"
    };
  },
  components: {
    DataTable,
    TopBar,
    Pagination,
    DirectUser
  },
  methods: {
    changeSelect(ids) {
      this.selectlist = ids;
    }
  },
  computed: {
    ...mapGetters(["activityList", "directUserFormState"]),
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
    this.$store.dispatch("activity/getActivityList");
  }
};
</script>

<style lang="">
</style>