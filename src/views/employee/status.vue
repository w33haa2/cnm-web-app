<template>
  <div class="app-container">
    <h4 style="color:#646464">Status</h4>

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
    <el-table :data="status" style="width: 100%;margin-top:30px;">
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
export default {
  data() {
    return {
      status: [
        { type: 'new', status: 'active' },
        { type: 'active', status: 'active' },
        { type: 'suspended', status: 'inactive' },
        { type: 'terminated', status: 'inactive' },
        { type: 'resigned', status: 'inactive' }
      ]
    }
  },
  computed: {},
  created() {},
  methods: {
    filterHeadName(head_id) {
      return accesslevels.filter(i => i.id == head_id)[0].name
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
