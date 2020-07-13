<template>
  <div class="app-container">
    <h4 style="color:#646464">Assignment Log</h4>
    <!-- Search and Pagination -->

    <el-row :gutter="10" style="margin-bottom:5px;">
      <el-col :md="{ span:4 }">
        <el-date-picker
          v-model="table_config.query.date"
          size="mini"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
          style="width:100%"
        />
      </el-col>
      <el-col :md="{ span:12, offset:8 }">
        <el-pagination
          style="float:right"
          :pager-count="5"
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
    <el-row :gutter="10" style="margin-bottom:5px;">
      <el-col :md="{ span:4 }">
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
          :disabled="table_config.remoteFilter.by=='all'"
        >
          <el-option
            v-for="(option,index) in table_config.remoteFilter.options"
            :key="index"
            :label="option[table_config.remoteFilter.by].full_name"
            :value="option[table_config.remoteFilter.by].id"
          />
        </el-select>
      </el-col>
      <el-col :md="{ span:6, offset:14 }">
        <el-radio-group style="float:right" size="mini" v-model="table_config.remoteFilter.by">
          <el-radio-button label="parent_details">Head</el-radio-button>
          <el-radio-button label="child_details">Subordinate</el-radio-button>
          <el-radio-button label="all">All</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-bottom:5px;">
      <el-col :md="{ span:4,offset:20 }">
        <hierarchy-log-create :form="{title:'Promotion/Reassign Log'}" @refresh="refetchTable"></hierarchy-log-create>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table
      :data="table_config.data"
      style="width: 100%;margin-top:30px;"
      v-loading="fetchHierarchyLogsState.initial"
      @sort-change="columnSort"
    >
      <el-table-column align="center" label="ID" sortable="custom" prop="id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Head"
        prop="parent_details.full_name"
        sortable="custom"
      >
        <template slot-scope="scope">{{ scope.row.parent_details.full_name }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Subordinate"
        prop="child_details.full_name"
        sortable="custom"
      >
        <template slot-scope="scope">{{ scope.row.child_details.full_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="Start date" sortable="custom" prop="start_date">
        <template slot-scope="scope">{{ formatDate(scope.row.start_date,"","MMM Do YYYY") }}</template>
      </el-table-column>
      <el-table-column align="center" label="End date" sortable="custom" prop="end_date">
        <template slot-scope="scope">
          <template v-if="scope.row.end_date">{{ formatDate(scope.row.end_date,"","MMM Do YYYY") }}</template>
          <template v-else>
            <el-tag type="success" size="mini">At present</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="right" label="Delete" width="100">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="deleteRow(scope.row)">
            <i class="el-icon-delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import hierarchyLogCreate from "./components/hierarchy_log_create";

const ymdHms = "YYYY-MM-DD HH:mm:ss";

export default {
  components: { hierarchyLogCreate },
  data() {
    return {
      table_config: {
        data: [],
        dummy: [],
        count: 0,
        loader: false,
        query: {
          date: moment().format(ymdHms),
          page: 1,
          perpage: 10,
          sort: null,
          order: null
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
      "fetchHierarchyLogsTitle",
      "deleteHierarchyLogState",
      "deleteHierarchyLogData",
      "deleteHierarchyLogTitle",
      "position"
    ])
  },
  watch: {
    deleteHierarchyLogState({ initial, success, fail }) {
      if (success) {
        this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
        this.$message({
          type: "success",
          message: this.deleteHierarchyLogTitle,
          duration: 5000
        });
      }
      if (fail) {
        this.$message({
          type: "danger",
          message: this.deleteHierarchyLogTitle,
          duration: 5000
        });
      }
    },
    "table_config.query.date": function(v) {
      this.table_config.query.page = 1;
      // this.table_config.remoteFilter.select = null;
      if(this.table_config.remoteFilter.by == 'all'){
        this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
        this.getTableFilterOptions();
      }else{
        if (this.table_config.remoteFilter.select) {
          let data = {
            operations: this.isOperations(),
            date: v,
            perpage: this.table_config.query.perpage,
            page: this.table_config.query.page
          };
          if (this.table_config.remoteFilter.by == "parent_details") {
            data.parent_id = this.table_config.remoteFilter.select;
          } else {
            data.child_id = this.table_config.remoteFilter.select;
          }
          this.fetchHierarchyLogs(data);
        } else {
          this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
        }
      }
    },
    "table_config.remoteFilter.select": function(v) {
      if (v) {
        let data = {
          operations: this.isOperations(),
          date: this.table_config.query.date,
          perpage: this.table_config.query.perpage,
          page: this.table_config.query.page
        };
        if (this.table_config.remoteFilter.by == "parent_details") {
          data.parent_id = v;
        } else {
          data.child_id = v;
        }
        this.fetchHierarchyLogs(data);
      } else {
        this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
      }
    },
    "table_config.remoteFilter.by": function(v) {
      this.table_config.remoteFilter.options = [];
      this.table_config.remoteFilter.select = null;
      this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
      if (v != "all") {
        this.table_config.select = this.table_config.dummy[0][
          this.table_config.remoteFilter.by
        ].id;
      }
    },
    fetchHierarchyLogsState({ initial, success, fail }) {
      if (success) {
        this.table_config.data = this.fetchHierarchyLogsData.hierarchy_log.data;
        this.table_config.dummy = this.fetchHierarchyLogsData.hierarchy_log.data;
        this.table_config.count = this.fetchHierarchyLogsData.count;
        this.table_config.page = this.fetchHierarchyLogsData.hierarchy_log.current_page;
      }
    }
  },
  created() {
    this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
  },
  methods: {
    ...mapActions(["fetchHierarchyLogs", "deleteHierarchyLog"]),
    columnSort({ column, prop, order }) {
      this.table_config.query.sort = null;
      this.table_config.query.order = null;
      if (order) {
        this.table_config.query.sort = prop;
        this.table_config.query.order = order == "ascending" ? "asc" : "desc";
      }
      this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
    },
    refetchTable(v) {
      this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
    },
    deleteRow(data) {
      console.log(data);
      if (confirm("Are you sure you want to delete row?")) {
        this.deleteHierarchyLog({ id: data.id });
      }
    },
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
      this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
    },
    tablePageChange(v) {
      this.table_config.query.page = v;
      this.fetchHierarchyLogs(this.unsetNull(this.table_config.query));
    },
    remoteSearch(query) {
      let url =
        "api/v1/hierarchy_log?list=true&date=" +
        moment(this.table_config.query.date).format(ymdHms) +
        "&filter_by=" +
        this.table_config.remoteFilter.by;
      if (query != "") {
        url += "&target[]=full_name&query=" + query;
      }
      this.getTableFilterOptions(url);
    },
    isOperations(){
      let result = false;
      switch(this.position.toLowerCase()){
        case 'operations manager':
          case 'team leader':
            result=true;
            break;
            default:
              result =false;
              break
      }
      return result;
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
