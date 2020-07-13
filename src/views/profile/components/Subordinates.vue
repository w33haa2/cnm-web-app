<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-bottom:5px;">
      <el-col :md="{ span:4}">
        <!-- <el-select
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
        </el-select> -->
      </el-col>
      <el-col :md="{ span:12, offset:8 }">
        <el-pagination
          style="float:right"
          :pager-count="5"
          :page-sizes="[10,25,50]"
          :page-size="table_config.query.limit"
          layout="total, sizes, prev, pager, next"
          :total="table_config.count"
          :current-page.sync="table_config.page"
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
      v-loading="fetchSubordinatesState.initial"
    >
      <el-table-column label="Name">
        <template slot-scope="scope">
          <router-link :to="'/profile/index/'+scope.row.child_id">{{ scope.row.child_details.full_name }}</router-link>
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
        page:1,
        data: [],
        dummy: [],
        count: 0,
        loader: false,
        query: {
          date: moment().format(ymdHms),
          parent_id: this.$route.params.id,
          offset: null,
          limit: 10,
          search:''
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
      "fetchSubordinatesState",
      "fetchSubordinatesData",
      "fetchSubordinatesTitle"
    ]),
    offset(){
      return (this.table_config.page - 1) * this.table_config.query.limit; 
    }
  },
  watch: {
    "table_config.query.parent_id": function() {
      this.fetchSubordinates(this.table_config.query);
    },
    fetchSubordinatesState({ initial, success, fail }) {
      if (success) {
        this.table_config.data = this.fetchSubordinatesData.subordinates;
        this.table_config.count = this.fetchSubordinatesData.count;
        this.table_config.page = this.fetchSubordinatesData.hierarchy_log.current_page;
      }
    }
  },
  created() {
    this.fetchSubordinates(this.table_config.query);
  },
  methods: {
    ...mapActions(["fetchSubordinates"]),
    tableSizeChange(v) {
      this.table_config.page = 1;
      this.table_config.query.limit = v;
      this.fetchSubordinates(this.table_config.query);
    },
    tablePageChange(v) {
      this.table_config.page = v;
      this.fetchSubordinates(this.table_config.query);
    },
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
