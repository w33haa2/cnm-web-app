<template>
  <div class="app-container">
    <h4 style="color:#646464">Action Logs</h4>

    <!-- Search and Pagination -->
    <el-row style="width: 100%;margin-top:30px;">
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[25, 50, 100]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="25"
          background
          small
        />
      </el-col>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input placeholder="Search..." size="mini">
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
    <el-table :data="action_logs" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="User">
        <template slot-scope="scope">{{ scope.row.personnel }}</template>
      </el-table-column>
      <el-table-column align="center" label="Position">
        <template slot-scope="scope">{{ scope.row.user_position }}</template>
      </el-table-column>
      <el-table-column align="center" label="Log">
        <template slot-scope="scope">{{ scope.row.affected_data }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date">
        <template slot-scope="scope">{{ scope.row.created_date }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ActionLogs",
  mounted() {},
  data() {
    return {
      action_logs: [
        {
          personnel: "Emman Lajom",
          user_position: "RTA",
          affected_data: "sadasd",
          created_date: "dsadas"
        }
      ]
    };
  }
};
</script>

<style>
</style>
