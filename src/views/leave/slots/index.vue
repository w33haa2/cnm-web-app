<template>
  <div class="app-container">
    <h4 style="color:#646464">Leave Slots</h4>
    <el-row>
      <el-col :md="{span:4}">
          <el-date-picker
            v-model="week.start"
            size="mini"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{firstDayOfWeek:1}"
            :clearable="false"
            @change="weekChange"
            style="width:100%"
          />
      </el-col>
      <el-col :md="{span:20}">
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
            <tab-content :leaveType="item.leave_type" :tableHeader="tableHeader"></tab-content>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tabContent from "./components/tabContent"
import { mapGetters } from "vuex"
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
export default {
  components:{tabContent},
  data() {
    return {
      tableHeader:[],
      week:{
        start:moment().startOf("isoweek").format("YYYY-MM-DD"),
        end:null
      },
      table_config:{
        display_size: 10,
        count: 1,
        page:1
      },
      leave_types:[
        {
          leave_type: "vacation_leave",
          title:"Vacation Leave"
        },
        {
          leave_type: "leave_of_absence",
          title:"Leave of absence"
        }
      ]
    }
  },
  computed:{
    ...mapGetters(["token"])
  },
  mounted(){
    this.weekChange(
      moment().startOf("isoweek").format("YYYY-MM-DD")
    );
    console.log(this.token)
  },
  methods:{
    weekChange(e) {
      const start = moment(e)
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      const end = moment(e)
        .endOf("isoweek")
        .format("YYYY-MM-DD");
      this.week.start = start;
      this.week.end = end;

      const range = moment.range(start, end);
      const dates = Array.from(range.by("day")).map(m =>
        m.format("YYYY-MM-DD")
      );
      this.tableHeader = dates.map(d => ({
        day: moment(d).format("ddd"),
        date: moment(d).format("YYYY-MM-DD"),
        date1: moment(d).format("MMM Do")
      }));
    },
  }
}
</script>


<style lang="scss" scoped>

</style>
