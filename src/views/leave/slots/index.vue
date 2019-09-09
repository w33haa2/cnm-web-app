<template>
  <div class="app-container">
    <h4 style="color:#646464">Leave Slots</h4>
    <el-row>
      <el-col :md="{span:6}">
        <el-input size="mini" placeholder="Search..."></el-input>
      </el-col>
      <el-col :md="{span:18}">
        <el-pagination
          style="float:right"
          pager-count="4"
          :page-sizes="[10,25,50]"
          :page-size="table_config.display_size"
          layout="total, sizes, prev, pager, next"
          :total="table_config.count"
          :current-page.sync="table_config.page"
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
          background
          small
        />
      </el-col>
      <el-col style="margin-top:30px;">
        <el-tabs type="border-card">
          <el-tab-pane v-for="(item,index) in leave_types" :key="index" :label="item.title">
            <tab-content :leaveType="item.leave_type"></tab-content>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tabContent from "./components/tabContent"
import { mapGetters } from "vuex"
export default {
  components:{tabContent},
  data() {
    return {
      table_config:{
        display_size: 10,
        count: 1,
        page:1
      },
      leave_types:[
        {
          leave_type: "vacation_leave",
          title:"Vacation Leave"
        }
      ]
    }
  },
  computed:{
    ...mapGetters(["token"])
  },
  mounted(){
    console.log(this.token)
  }
}
</script>


<style lang="scss" scoped>

</style>
