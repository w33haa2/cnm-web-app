<template>
  <div>
    <div
      v-loading="table.loader"
      :style="
        !table.loader
          ? 'background-color:#1d1e3d;padding-top:20px;padding-left:10px;padding-right:20px;'
          : 'background-color:white;height:200px;'
      "
    >
      <el-row v-show="!table.loader">
        <el-col :sm="{ span: 23 }">
          <span class="gantt-header">Cluster Approved Leaves</span>
        </el-col>
        <el-col :sm="{ span: 1 }">
          <el-popover placement="bottom" width="200" trigger="click">
            <el-row>
              <el-col>
                Options
              </el-col>
              <el-col>
                <el-tooltip content="Cluster">
                  <el-select size="mini" placeholder="Select cluster...">
                    <el-option></el-option>
                  </el-select>
                </el-tooltip>
              </el-col>
              <el-col>
                <el-tooltip content="Leave Type">
                  <el-select size="mini" placeholder="Select Leave Type...">
                    <el-option></el-option>
                  </el-select>
                </el-tooltip>
              </el-col>
              <el-col>
                <el-tooltip content="Month">
                  <el-select size="mini" placeholder="Select Leave Type...">
                    <el-option></el-option>
                  </el-select>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-button
              slot="reference"
              type="text"
              icon="el-icon-setting"
              style="padding-top:0px;margin-top:0px;"
            >
              <!-- <i slot="reference" class="el-icon-setting icon-btn" /> -->
            </el-button>
          </el-popover>
        </el-col>
        <el-col style="border-top:1px solid #24254e;margin-top:15px;">
          <el-table
            class="gantt-table"
            :border="false"
            style="width: 100%"
            :data="table.data"
            :span-method="spanMethod"
          >
            <!-- @sort-change="columnSort" -->

            <!-- {start:'2019-11-11',end:'2019-11-11',name:'Floyd Francis Matabilas'},
          {start:'2019-11-01',end:'2019-11-15',name:'Allen Lamparas'}-->
            <el-table-column width="70" fixed sortable="custom">
              <template slot-scope="scope">
                <div class="user-block">
                  <div v-if="scope.row.image_url" style="width:100%;">
                    <div style="margin:0 auto;height:30px;width:30px;">
                      <img
                        class="img-circle"
                        style="margin:0 auto;"
                        :src="scope.row.image_url"
                      />
                    </div>
                  </div>
                  <div v-else class="text-muted" style="width:100%;">
                    <div
                      class="img-circle"
                      style="background-color:white;margin:0 auto;"
                    >
                      <div style="display:flex;height:30px;width:30px;">
                        <div
                          style="align-self:center;width:100%;text-align:center;font-weight:bold;font-size:.8em"
                        >
                          {{
                            getAvatarLetters(
                              scope.row.firstname,
                              scope.row.lastname
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="Date/slots" align="center"> -->
            <template v-for="(datum, index) in month">
              <el-table-column
                :key="index"
                align="center"
                :width="60"
                style="padding:0px;margin:0px"
                :label="datum.date"
                :class-name="'column-' + index"
              >
                <template slot="header" slot-scope="scope">
                  <div
                    v-if="
                      filter.leave_type == 'vacation_leave' ||
                        filter.leave_type == 'leave_of_absence'
                    "
                  >
                    <el-tooltip content="slot">
                      <span>
                        {{
                          table.slots.filter(
                            i => i.date.slice(0, 10) == datum.date
                          ).length > 0
                            ? table.slots.filter(
                                i => i.date.slice(0, 10) == datum.date
                              )[0].value + ""
                            : 0 + ""
                        }}
                      </span>
                    </el-tooltip>
                  </div>
                  <div
                    style="display:flex;align-items:center;justify-content:center"
                  >
                    <div
                      style="background-color:white;border-radius:50%;width:31px;height:31px;display:flex"
                      :style="
                        'background-color:' +
                          (headerToday(datum.date) ? 'white' : '#1d1e3d')
                      "
                    >
                      <span style="font-size:.7em;align-self:center;">{{
                        split(datum.date, "-")[2]
                      }}</span>
                      <!-- <span style="font-size:.7em">{{ table.slots.filter(i => i.date.slice(0, 10) == datum.date)
                    .length > 0 ? table.slots.filter(i => i.date.slice(0, 10) ==
                    datum.date)[0] .value + "" : 0 + "" }}</span>-->
                    </div>
                  </div>
                  <div>
                    <small style="color:white">{{
                      datum.day.toUpperCase()
                    }}</small>
                  </div>
                </template>
                <template slot-scope="scope">
                  <!-- <template v-for="(date, index1) in scope.row.month"> -->
                  <template v-if="scope.row.month.length > index">
                    <template v-for="(leave, index1) in scope.row.leaves">
                      <template
                        v-if="
                          leave.start_event.split(' ')[0] ==
                            scope.row.month[index].date
                        "
                      >
                        <gantt-object
                          :key="index1"
                          :leave="leave"
                          :leaves="scope.row.leaves"
                          :slots="table.slots"
                        ></gantt-object>
                      </template>
                    </template>
                  </template>
                  <!-- </template> -->
                  <!-- </template> -->
                </template>
              </el-table-column>
            </template>
            <!-- </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Moment from "moment/moment";
import tz from "moment-timezone";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment, tz);
import ganttObject from "./ganttObject";
import requestBlock from "./requestBlock";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["filter", "fetch"],
  components: {
    ganttObject,
    requestBlock
  },
  data() {
    return {
      table: {
        data: null,
        loader: false,
        slots: []
      },
      month: [],
      column_width: 0,
      query: {
        leave_slots: {
          start_event: null,
          end_event: null,
          user_id: null, //om_id/cluster_id
          leave_type: null,
        },
        leaves: {
          // limit: 1,
          leaves: true,
          om_id: null,
          tl_id: null,
          status: "approved",
          leave_type: null,
          created_start_date: null,
          created_end_date: null
        }
      }
    };
  },
  mounted() {
    this.table.loader = true;
  },
  computed: {
    ...mapGetters([
      "fetchLeaveSlotsData",
      "fetchLeaveSlotsState",
      "fetchEmployeesData",
      "fetchEmployeesState"
    ])
  },
  watch: {
    fetch(v) {
      this.init();
    },
    fetchEmployeesState({ initial, success, fail }) {
      if (initial) {
        this.table.loader = true;
      }
      if (success) {
        var tmp_table_data = [];
        this.table.loader = false;
        this.fetchEmployeesData.forEach(
          ((v, i) => {
            let tmp_month = [],
              tmp_emp = v;
            this.month.forEach(
              ((v1, i1) => {
                // console.log(v.leaves);
                var data = v1;
                var leave = tmp_emp.leaves.filter(fi =>
                  moment(data.date).isBetween(
                    moment(fi.start_event.split(" ")[0]),
                    moment(fi.end_event.split(" ")[0]),
                    null,
                    []
                  )
                );
                data.index = this.indexGenerator(tmp_emp.leaves)[i1];
                if (leave.length) {
                  if (leave[0].start_event.split(" ")[0] == data.date) {
                    tmp_month.push(data);
                  }
                } else {
                  tmp_month.push(data);
                }
              }).bind(this)
            );
            this;
            tmp_emp.month = tmp_month;
            tmp_table_data.push(tmp_emp);
          }).bind(this)
        );
        this.table.data = tmp_table_data;
      }
      if (fail) {
        this.table.loader = false;
        this.table.data = [];
      }
    },
    fetchLeaveSlotsState({ initial, success, fail }) {
      if (success) {
        this.table.slots = this.fetchLeaveSlotsData.leave_slots;
      }
      if (fail) {
        this.table.slots = [];
      }
    }
  },
  methods: {
    ...mapActions(["fetchLeaveSlots", "fetchEmployees"]),
    tindex(index, leaves) {
      return this.indexGenerator(leaves)[index] - 1;
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex) {
        if (columnIndex < row.month.length) {
          let leave = row.leaves.filter(
            i => row.month[columnIndex - 1].date == i.start_event.split(" ")[0]
          );
          if (leave.length) {
            return [1, leave[0].leave_days];
          }
        }
      }
    },
    headerToday(date) {
      let result = false;
      if (moment().format("YYYY-MM-DD") == date) {
        result = true;
      }
      return result;
    },
    indexGenerator(leaves) {
      let result = [],
        base_index = 1,
        month = this.month;
      month.forEach((v, i) => {
        let increment = false;
        let leave = leaves.filter(i =>
          moment(v.date).isBetween(
            moment(i.start_event.split(" ")[0]),
            moment(i.end_event.split(" ")[0]),
            null,
            []
          )
        );
        if (leave.length) {
          if (leave[0].start_event.split(" ")[0] == v.date) {
            result.push(base_index);
          }
          increment = true;
        } else {
          result.push(base_index);
          increment = true;
        }
        if (increment) {
          base_index++;
        }
      });
      return result;
    },
    init() {
      this.table.loader = true;
      const range = moment.range(
        moment(this.filter.month).startOf("month"),
        moment(this.filter.month).endOf("month")
      );
      this.month = Array.from(range.by("day")).map(m => m.format("YYYY-MM-DD"));
      this.month = this.month.map(d => ({
        day: moment(d).format("ddd"),
        date: moment(d).format("YYYY-MM-DD"),
        date1: moment(d).format("MMM Do")
      }));

      // assign leave slots params
      this.query.leave_slots.start_event = this.month[0].date;
      this.query.leave_slots.end_event = this.month[this.month.length - 1].date;
      this.query.leave_slots.user_id = this.filter.cluster_id;
      this.query.leave_slots.leave_type = this.filter.leave_type;
      // fetch leave slots
      this.fetchLeaveSlots(this.unsetNull(this.query.leave_slots));

      // assign leave params
      // this.query.leaves.status = this.filter.leave_status;
      this.query.leaves.leave_type = this.filter.leave_type;
      this.query.leaves.om_id = this.filter.cluster_id;
      this.query.leaves.created_start_date = moment(this.filter.request_week)
        .startOf("isoweek")
        .format("YYYY-MM-DD HH:mm:ss");
      this.query.leaves.created_end_date = moment(this.filter.request_week)
        .endOf("isoweek")
        .format("YYYY-MM-DD HH:mm:ss");
      // fetch leaves
      let data = this.unsetNull(this.query.leaves);
      this.fetchEmployees({ data });
    }
  }
};
</script>

<style scoped>
.user-block >>> .img-circle {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.monday >>> td > .user-block >>> div > img {
  padding: 0px;
  margin: 0px;
}

.row-detail-container {
  width: 100%;
  box-sizing: border-box;
  height: 30px;
  background-color: red;
  text-align: left;
  cursor: pointer;
}
.truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
}
.cur-p {
  cursor: pointer;
}
.pt-4 {
  padding-top: 4px;
}
.c-white {
  color: white;
}
.name-container {
  float: left;
  margin-left: 10px;
  width: calc(90% - 40px);
}

.gantt-table >>> th {
  background-color: #1d1e3d !important;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: #252649 1px solid;
}
.gantt-table >>> td {
  background-color: #1d1e3d !important;
  border-left: #252649 1px solid;
  border-right: #252649 1px solid;
}
.gantt-table >>> .cell {
  padding: 2px;
  background-color: #1d1e3d !important;
}
.gantt-table >>> td {
  padding: 0px;
  border-bottom: none;
}

.gantt-table >>> .pl-20 {
  padding-left: 20px;
}

tbody >>> tr {
  margin-top: 20px;
  margin-bottom: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.gantt-table >>> .el-table__body-wrapper,
.el-table__fixed-body-wrapper {
  background-color: #1d1e3d !important;
}
.gantt-table >>> .el-table__fixed:before {
  background-color: #1d1e3d !important;
  /* height: 0px !important; */
}
.icon-btn:hover {
  color: #5f60b3;
}
.icon-btn {
  color: #454688;
  cursor: pointer;
  float: right;
}
.gantt-header {
  color: #cacbff;
}
.gantt-table >>> .col-active {
  background-color: red;
}

.el-table >>> .column:hover .column,
.cell {
  background-color: white !important;
}
</style>
