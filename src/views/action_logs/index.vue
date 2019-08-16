<template>
  <div class="app-container">
    <h4 style="color:#646464">Action Logs</h4>

    <!-- Search and Pagination -->
    <el-row style="width: 100%;margin-top:30px;">
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[10, 25, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="logs.count"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input placeholder="Search..." v-model="searchQuery" size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table :data="logs.metadata" v-loading="fetchingLogState.initial" style="width: 100%;margin-top:30px;">
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: "ActionLogs",
  mounted() {},
  data() {
    return {
      searchQuery: '',
      query: {
        offset: 0,
        limit: 10
      },
    }
  },
  mounted() {
    this.fetchLogs(this.query)
  },
  computed: {
    ...mapGetters(['logs','fetchingLogState'])
  },
  watch: {
    searchQuery(newData) {
      if (newData !== "") {
        this.query["target[]"] = 'full_name';
        this.query.query = newData;
        this.fetchLogs(this.query);
      } else {
        this.query["target[]"] = "";
        this.query.query = "";
        this.fetchLogs(this.query);
      }
    },
  },
  methods: {
    ...mapActions(['fetchLogs']),
    tableSizeChange(value) {
      this.query.limit = value
      this.fetchLogs(this.query)
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit
      this.fetchLogs(this.query)
    },
  }
};
</script>

<style>
</style>
