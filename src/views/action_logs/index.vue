<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row :gutter="8">
        <el-col :md="{ span: 12 }">
          <div class="title-wrapper">
            Action Logs
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-input placeholder="Search..." v-model="searchQuery">
            <el-select
              slot="prepend"
              placeholder="Select"
              v-model="searchTarget"
              style="width:100px;"
            >
              <el-option value="full_name" label="User" />
              <el-option value="position" label="Position" />
              <el-option value="date" label="Date" />
            </el-select>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div class="table-container shadow">
      <el-row style="width: 100%;margin-top:5px;">
        <el-col :md="{ span: 24 }">
          <!-- Search and Pagination -->

          <el-pagination
            style="float:right"
            :page-sizes="[10, 25, 50]"
            :page-size="100"
            :pager-count="5"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            background
            small
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>
        <el-col :md="{ span: 24 }">
          <!-- Table -->
          <el-table
            :data="table_config.data"
            v-loading="table_config.loader"
            style="width: 100%;margin-top:5px;"
          >
            <el-table-column align="center" label="User">
              <template slot-scope="scope">{{ scope.row.full_name }}</template>
            </el-table-column>
            <el-table-column align="center" label="Position">
              <template slot-scope="scope">{{ scope.row.position }}</template>
            </el-table-column>
            <el-table-column align="center" label="Log">
              <template slot-scope="scope">{{
                scope.row.affected_data
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="Date">
              <template slot-scope="scope">{{
                formatDate(scope.row.created_at, "", "LL")
              }}</template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
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

<style></style>
