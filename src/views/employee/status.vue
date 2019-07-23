<template>
  <div class="app-container">
    <h4 style="color:#646464">Status</h4>

    <el-row style="padding-right:8px;margin-bottom:30px;">
      <el-col>
        <el-button :plain="true" size="mini">Create Status</el-button>
      </el-col>
    </el-row>
    <!-- Search and Pagination -->
    <el-row>
      <el-col>
        <el-pagination
          :page-sizes="[10,25,50]"
          :page-size="table_config.display_size"
          layout="total, sizes, prev, pager, next"
          :total="statusListCount"
          :current-page.sync="table_config.page"
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
          background
          small
        />
      </el-col>
      <!-- <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>-->
    </el-row>

    <!-- Table -->
    <el-table :data="statusList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="Type">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column align="center" label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='active'? 'success':'danger'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      table_config: {
        display_size: 10,
        page: 1
      },
      query: {
        offset: 0,
        limit: 10
      }
    };
  },
  computed: {
    ...mapGetters(["statusList", "statusListCount"])
  },
  created() {
    const data = this.query;
    this.fetchStatusList({ data });
  },
  methods: {
    ...mapActions(["fetchStatusList"]),
    filterHeadName(head_id) {
      return accesslevels.filter(i => i.id == head_id)[0].name;
    },
    tableSizeChange(value) {
      this.query.limit = value;
      const data = this.query;
      this.fetchStatusList({ data });
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchStatusList({ data });
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
