<template>
  <div class="app-container">
    <h4 style="color:#646464">Action Logs</h4>

    <!-- Search and Pagination -->
    <el-row style="width: 100%;margin-top:30px;">
      <el-col :md="{ span:8 }">
        <el-input placeholder="Search..." v-model="searchQuery" size="mini">
          <el-select
            slot="prepend"
            placeholder="Select"
            v-model="searchTarget"
            style="width:150px;"
          >
            <el-option value="full_name" label="User" />
            <el-option value="position" label="Position" />
            <el-option value="date" label="Date" />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
      <el-col :md="{ span:16 }">
        <el-pagination
          style="float:right"
          :page-sizes="[10, 25, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="table_config.count"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table
      :data="table_config.data"
      v-loading="table_config.loader"
      style="width: 100%;margin-top:30px;"
    >
      <el-table-column align="center" label="User">
        <template slot-scope="scope">{{ scope.row.full_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="Position">
        <template slot-scope="scope">{{ scope.row.position }}</template>
      </el-table-column>
      <el-table-column align="center" label="Log">
        <template slot-scope="scope">{{ scope.row.affected_data }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date">
        <template slot-scope="scope">{{ formatDate(scope.row.created_at,"", "LL") }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "ActionLogs",
  mounted() {},
  data() {
    return {
      searchQuery: "",
      searchTarget: "full_name",
      query: {
        offset: 0,
        limit: 10,
        order: "desc",
        sort: "created_at"
      },
      table_config: {
        data: [],
        count: 0,
        loader: false
      }
    };
  },
  mounted() {
    this.fetchLogs(this.query);
  },
  computed: {
    ...mapGetters([
      "logs",
      "fetchingLogState",
      "logsSearchData",
      "logsSearchState"
    ])
  },
  watch: {
    date(v) {
      alert(v);
    },
    logsSearchState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.logsSearchData.logs;
        this.table_config.count = this.logsSearchData.count;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
        this.table_config.count = 0;
      }
    },
    fetchingLogState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.logs.metadata;
        this.table_config.count = this.logs.count;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
        this.table_config.count = 0;
      }
    },
    searchQuery(v) {
      this.tableSearch();
    },
    searchTarget(v) {
      if (this.searchQuery != "") {
        this.tableSearch();
      }
    }
  },
  methods: {
    ...mapActions(["fetchLogs", "searchLogs"]),
    tableSearch() {
      if (this.searchQuery !== "") {
        this.query["target[]"] = this.searchTarget;
        this.query.query = this.searchQuery;
        this.searchLogs(this.query);
      } else {
        this.query["target[]"] = "";
        this.query.query = "";
        this.fetchLogs(this.query);
      }
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.fetchLogs(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.fetchLogs(this.query);
    }
  }
};
</script>

<style>
</style>
