<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-bottom:5px;">
      <el-col :md="{ span:4}">
        <el-select
          v-model="table_config.remoteFilter.select"
          class="form-input"
          style="width:100%;padding-bottom:2px"
          size="mini"
          filterable
          remote
          reserve-keyword
          placeholder="Search..."
          :remote-method="remoteSearch"
          :loading="table_config.remoteFilter.loader"
        >
          <el-option
            v-for="(option,index) in table_config.remoteFilter.options"
            :key="index"
            :label="option.child_details.full_name"
            :value="option.child_details.id"
          />
        </el-select>
      </el-col>
      <el-col :md="{ span:12, offset:8 }">
        <el-pagination
          style="float:right"
          :pager-count="4"
          :page-sizes="[10,25,50]"
          :page-size="table_config.query.perpage"
          layout="total, sizes, prev, pager, next"
          :total="table_config.count"
          :current-page.sync="table_config.query.page"
          background
          small
          @current-change="tablePageChange"
          @size-change="tableSizeChange"
        />
      </el-col>
    </el-row>
    <!-- Table -->
    <el-table
      :data="table_config.data"
      style="width: 100%;margin-top:30px;"
      v-loading="fetchHierarchyLogsState.initial"
    >
      <el-table-column label="Name">
        <template slot-scope="scope">
          <router-link :to="'/profile/index/'+scope.row.id">{{ scope.row.child_details.full_name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="Email">
        <template slot-scope="scope">{{ scope.row.child_user_details.email }}</template>
      </el-table-column>
      <el-table-column label="Position">
        <template slot-scope="scope">{{ scope.row.child_user_details.access.name }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";

const ymdHms = "YYYY-MM-DD HH:mm:ss";

export default {
  data() {
    return {
      table_config: {
        data: [],
        dummy: [],
        count: 0,
        loader: false,
        query: {
          date: moment().format(ymdHms),
          parent_id: this.$route.params.id,
          page: 1,
          perpage: 10
        },
        remoteFilter: {
          select: null,
          options: [],
          by: "all",
          loader: false
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "fetchHierarchyLogsState",
      "fetchHierarchyLogsData",
      "fetchHierarchyLogsTitle"
    ])
  },
  watch: {
    "table_config.query.parent_id": function() {
      this.fetchHierarchyLogs(this.table_config.query);
    },
    "table_config.remoteFilter.select": function(v) {
      if (v) {
        this.table_config.query.child_id = v;
      } else {
        delete this.table_config.query.child_id;
      }
      this.fetchHierarchyLogs(this.table_config.query);
    },
    fetchHierarchyLogsState({ initial, success, fail }) {
      if (success) {
        this.table_config.data = this.fetchHierarchyLogsData.hierarchy_log.data;
        this.table_config.count = this.fetchHierarchyLogsData.count;
        this.table_config.page = this.fetchHierarchyLogsData.hierarchy_log.current_page;
      }
    }
  },
  created() {
    this.fetchHierarchyLogs(this.table_config.query);
  },
  methods: {
    ...mapActions(["fetchHierarchyLogs", "deleteHierarchyLog"]),
    getTableFilterOptions(url) {
      let options = {
        headers: {
          Authorization: "Bearer " + this.token
        }
      };

      axios
        .get(url, options)
        .then(res => {
          this.table_config.remoteFilter.options = res.data.meta.hierarchy_log;
        })
        .catch(err => console.log(err.response.data));
    },
    tableSizeChange(v) {
      this.table_config.query.page = 1;
      this.table_config.query.perpage = v;
      this.fetchHierarchyLogs(this.table_config.query);
    },
    tablePageChange(v) {
      this.table_config.query.page = v;
      this.fetchHierarchyLogs(this.table_config.query);
    },
    remoteSearch(query) {
      let url =
        "api/v1/hierarchy_log?list=true&date=" +
        moment(this.table_config.query.date).format(ymdHms) +
        "&parent_id=" +
        this.table_config.query.parent_id +
        "&filter_by=child_details";
      if (query != "") {
        url += "&target[]=full_name&query=" + query;
      }
      this.getTableFilterOptions(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
