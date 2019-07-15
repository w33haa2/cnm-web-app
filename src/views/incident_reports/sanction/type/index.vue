<template>
  <div class="app-container">
    <h4 style="color:#646464">Sanction Level</h4>
    <!--
    <el-alert
      title="This list is uneditable, Please contact service provider."
      type="info"
      show-icon
    ></el-alert>-->

    <!-- Search and Pagination -->
    <!-- <el-row>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="400"
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
    </el-row>-->

    <!-- Table -->
    <el-table :data="sanction_types" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="Level Number">
        <template slot-scope="scope">{{ scope.row.type_number }}</template>
      </el-table-column>
      <el-table-column align="center" label="Description">
        <template slot-scope="scope">{{ scope.row.type_description }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sanction_types: [
        { id: 1, type_number: 1, type_description: 'Absentism' },
        { id: 2, type_number: 2, type_description: 'Tardiness' }
      ]
    }
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
