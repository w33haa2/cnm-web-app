<template>
  <div class="app-container">
    <h4 style="color:#646464">Subordinates</h4>

    <!-- Search and Pagination -->
    <el-row :gutter="10">
      <el-col :md="{ span:4 }">
          <el-date-picker
            v-model="table_config.query.date"
            size="mini"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            style="width:100%"
          />
      </el-col>
      <el-col :md="{ span:5 }">
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
            :label="option[table_config.remoteFilter.by].full_name"
            :value="option[table_config.remoteFilter.by].id"
          />
        </el-select>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table :data="table_config.data"  style="width: 100%;margin-top:30px;" v-loading="fetchHierarchyLogsState.initial">
      <el-table-column align="center" label="Subordinate">
        <template slot-scope="scope">{{ scope.row.child_details.full_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="Start date">
        <template slot-scope="scope">{{ formatDate(scope.row.start_date,"","MM Do YYYY") }}</template>
      </el-table-column>
      <el-table-column align="center" label="End date">
        <template slot-scope="scope">
          <template v-if="scope.row.end_date">
            {{ formatDate(scope.row.end_date,"","MM Do YYYY") }}
          </template>
          <template v-else>
            <el-tag type="success" size="mini">At present</el-tag>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
const ymdHms ="YYYY-MM-DD HH:mm:ss"
export default {
  data() {
    return {
      table_config:{
        data:[],
        dummy:[],
        count:0,
        loader:false,
        page:1,
        query:{
          date:moment().format(ymdHms),
          parent_id: this.$route.params.id
        },
        remoteFilter:{
          select:null,
          options:[],
          by:"child_details",
          loader:false,
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      "fetchHierarchyLogsState","fetchHierarchyLogsData","fetchHierarchyLogsTitle",
      ]),
  },
  watch:{
    "table_config.query.date":function(v){
      this.fetchHierarchyLogs(this.table_config.query);
    },
    "table_config.remoteFilter.select":function(v){
      if(v){
        this.table_config.data = this.table_config.dummy.filter(i=> i.child_id == v);
      }else{
        this.table_config.data = this.table_config.dummy;
      }
    },
    fetchHierarchyLogsState({initial, success, fail}){
      if(success){
        this.table_config.data = this.fetchHierarchyLogsData.hierarchy_log;
        this.table_config.dummy = this.fetchHierarchyLogsData.hierarchy_log;
        this.table_config.count = this.fetchHierarchyLogsData.count;
      }
    },
  },
  created() {
    this.fetchHierarchyLogs(this.table_config.query);
  },
  methods: {
    ...mapActions(["fetchHierarchyLogs"]),
    tableSizeChange(){},
    tablePageChange(){},
    remoteSearch(query) {
      let filtered = null;
      this.table_config.remoteFilter.options = [];

      this.table_config.remoteFilter.loader = true;
      if (query !== "") {
        filtered = this.table_config.dummy.filter(i=> i[this.table_config.remoteFilter.by].full_name.toLowerCase().includes(query));
      } else if(query !== "all"){
        filtered = this.table_config.dummy;
      }
      this.table_config.remoteFilter.options = filtered;
      this.table_config.remoteFilter.options.unshift({child_details:{id:null,full_name:""}});
      this.table_config.remoteFilter.loader = false;

    },
  }
}
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
