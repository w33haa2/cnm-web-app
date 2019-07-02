<template>
  <div class="app-container">
    <h4 style="color:#646464">Agent Schedule</h4>

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
        ></el-pagination>
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
    <el-radio-group v-model="action.type" size="mini">
      <el-radio-button type="primary" label="Create" />
      <el-radio-button type="primary" label="Update" />
      <el-radio-button type="primary" label="Delete" />
    </el-radio-group>
    <!-- <el-button :plain="true" size="mini">Schedule</el-button> -->

    <el-row>
      <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" :xl="{span:6}">
        <div class="w-100" style="height:100vh;overflow:scroll" />
      </el-col>
      <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:18}" :lg="{span:18}" :xl="{span:18}">
        <!-- calendar -->
        <el-calendar v-model="value">
          <template slot="dateCell" slot-scope="{date, data}">
            <div>
              <el-checkbox
                :label="data.day.split('-')[2]"
                :value="data.day"
                :disabled="calendar.data[0].start_date.includes(data.day)===true || data.type!='current-month'"
              />
            </div>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio1: null,
      value: new Date(),
      calendar: {
        data: [
          {
            id: 1,
            start_date: '2019-06-28 10:10:00',
            end_date: '2019-06-28 10:10:00',
            title: 'regularWork'
          }
        ]
      },
      action: {
        type: 'Create',
        selections: []
      }
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
.is-selected {
  color: #1989fa;
}
</style>
