<template>
  <div class="tab-content-container">
    <el-row style="margin-bottom:10px;">
      <el-col :md="{span:8}">
        <el-input size="mini" placeholder="Search..."></el-input>
      </el-col>
      <el-col :md="{span:16}">
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
    </el-row>

          <el-table v-loading="table_config.loader" :data="table_config.data">
            <el-table-column label="Employee" min-width="200" prop="full_name" fixed>
              <template slot="header">
                <span style="float:left">
                  <h4 class="text-muted">Employee</h4>
                </span>
              </template>
              <template slot-scope="scope">
                <div class="user-block">
                  <img v-if="scope.row.user.image_url" class="img-circle" :src="scope.row.user.image_url" />
                  <div
                    v-else
                    class="img-circle text-muted"
                    style="background-color:#d9d9d9;display:flex"
                  >
                    <div
                      style="align-self:center;width:100%;text-align:center;"
                      class="text-point-eight-em"
                    >{{ getAvatarLetters(scope.row.user.firstname,scope.row.user.lastname) }}</div>
                  </div>
                  <span>
                    <span class="el-dropdown-link" style="font-weight:600">{{ scope.row.user. full_name }}</span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[0].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[0].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[0].date)?'today-header':'']"
                >{{ tableHeader[0].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(slot,index) in plotLeaveSlotsPerDay(row,tableHeader[0].date)">
                  <cell-content
                  :key="index"
                  :slot="plotLeaveSlotsPerDay(row,tableHeader[0].date)[index]"
                  :date="tableHeader[0].date"
                />
                </template>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[1].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[1].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[1].date)?'today-header':'']"
                >{{ tableHeader[1].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotLeaveSlotsPerDay(row.schedule,tableHeader[1].date)">
                  <cell-content
                  :key="index"
                  :slot="plotLeaveSlotsPerDay(row.schedule,tableHeader[1].date)[index]"
                  :date="tableHeader[1].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[2].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[2].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[2].date)?'today-header':'']"
                >{{ tableHeader[2].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotLeaveSlotsPerDay(row.schedule,tableHeader[2].date)">
                  <cell-content
                  :key="index"
                  :slot="plotLeaveSlotsPerDay(row.schedule,tableHeader[2].date)[index]"
                  :date="tableHeader[2].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[3].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[3].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[3].date)?'today-header':'']"
                >{{ tableHeader[3].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotLeaveSlotsPerDay(row.schedule,tableHeader[3].date)">
                  <cell-content
                  :key="index"
                  :slot="plotLeaveSlotsPerDay(row.schedule,tableHeader[3].date)[index]"
                  :date="tableHeader[3].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[4].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[4].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[4].date)?'today-header':'']"
                >{{ tableHeader[4].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotLeaveSlotsPerDay(row.schedule,tableHeader[4].date)">
                  <cell-content
                  :key="index"
                  :slot="plotLeaveSlotsPerDay(row.schedule,tableHeader[4].date)[index]"
                  :date="tableHeader[4].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[5].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[5].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[5].date)?'today-header':'']"
                >{{ tableHeader[5].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotLeaveSlotsPerDay(row.schedule,tableHeader[5].date)">
                  <cell-content
                  :key="index"
                  :slot="plotLeaveSlotsPerDay(row.schedule,tableHeader[5].date)[index]"
                  :date="tableHeader[5].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[6].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[6].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[6].date)?'today-header':'']"
                >{{ tableHeader[6].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotLeaveSlotsPerDay(row.schedule,tableHeader[6].date)">
                  <cell-content
                  :key="index"
                  :slot="plotLeaveSlotsPerDay(row.schedule,tableHeader[6].date)[index]"
                  :date="tableHeader[6].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column> -->
          </el-table>
  </div>
</template>

<script>
import axios from "axios"
import moment from "moment"
import { mapActions,mapGetters } from "vuex"
import cellContent from "./cellContent"
export default {
  props:["dates","tableHeader"],
  data(){
    return{
      table_config:{
        page:1,
        display_size:10,
        count:1,
        loader:false,
      },
    dummy:[
        {
          info:{
            image_url:"default.gif",
            full_name:"Emmanuel James E. Lajom",
            firstname:"Emmanuel James",
            lastname:"Lajom"
          },
          vto:{
            hours: "3",
            spent_credits: "3"
          }
        },
        {
          info:{
            image_url:null,
            full_name:"Allen B. Lamparas",
            firstname:"Allen",
            lastname:"Lamparas"
          },
          vto:{
            hours: "3",
            spent_credits: "3"
          }
        }
      ]
    }
  },
  mounted(){
    // this.fetchLeaveSlots()
  },
  computed:{
    ...mapGetters(["fetchLeaveSlotsState","fetchLeaveSlotsData","fetchLeaveSlotsError"])
  },
  watch:{
    fetchLeaveSlotsState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true
      }
      if(success){
        this.table_config.loader = false
        this.table_config.data = this.fetchLeaveSlotsData.leave_slots;
        this.table_config.count = this.fetchLeaveSlotsData.count
      }
      if(fail){
        this.table_config.loader = false
      }
    },
    tableHeader(v){
      this.fetchLeaveSlots()
    }
  },
  methods:{
    ...mapActions(["fetchLeaveSlots"]),
    plotLeaveSlotsPerDay(slots, date) {
      const slot = slots.filter(
        i => moment(i.date).format("YYYY-MM-DD") == date
      );
      if(slot.length==0){
        return [{}];
      }else{
        return slot;
      }
    },
    dateToday(date) {
      if (moment(date).isSame(moment().format("YYYY-MM-DD"))) {
        return true;
      } else {
        return false;
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.user-block {
  .username,
  .description {
    display: block;
    margin-left: 50px;
    padding: 2px 0;
  }
  .username {
    // font-size: 0.8em;
    color: #777;
  }
  :after {
    clear: both;
  }
  .img-circle {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    float: left;
  }
  span {
    font-weight: 500;
    margin-left: 10px;
    // font-size: 0.8em;
  }
}
</style>
