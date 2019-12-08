<template>
  <div>
    <el-row>
      <el-col>
        <el-select
          size="mini"
          v-model="request.slots.leave_type"
          style="width:100%"
          @change="leaveTypeChange"
        >
          <el-option value="vacation_leave" label="Vacation Leave"></el-option>
          <el-option value="leave_of_absence" label="Leave of absence"></el-option>
        </el-select>
      </el-col>
      <el-col style="margin-top:10px;">
        <el-row>
          <el-col
            :sm="{span:12}"
            style="line-height:2"
          >{{ formatDate(curMonthDate,"","MMMM YYYY") }}</el-col>
          <el-col :sm="{span:12}">
            <el-button-group style="float:right">
              <el-button size="mini" @click="prev">
                <i class="el-icon-arrow-left" />
              </el-button>
              <el-button size="mini" @click="now">NOW</el-button>
              <el-button size="mini" @click="next">
                <i class="el-icon-arrow-right" />
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="margin-top:10px;">
        <el-calendar v-model="date" :picker-options="{firstDayOfWeek:7}">
          <template slot="dateCell" slot-scope="{date,data}">
            <template v-if="fetchLeaveSlotsState.success">
              <div
                style="height:100%;width:100%;text-align:center;padding:10px;"
              >
                <div
                  :style="'font-size:.8em;'+(highlightSunday(data))"
                >{{ parseInt(data.day.split("-")[2]) }}</div>
                <!-- <div style="width:100%;text-align:center">
                        <div style="height:5px;width:5px;border-radius:50%;background-color:red;"></div>
                </div>-->
                <div v-if="data.type=='current-month'">
                  <template v-if="sufficientSlots(data)">
                    <el-tooltip :content="slotValue(data) + ' available slots'">
                      <i class="el-icon-bell" style="color:#13ce66" />
                    </el-tooltip>
                  </template>
                  <template v-else>
                    <el-tooltip :content="slotValue(data) + ' available slots'">
                      <i class="el-icon-lock" style="color:red" />
                    </el-tooltip>
                  </template>
                  <!-- <i v-if="!sufficientSlots(data)" class="el-icon-lock" style="color:red" /> -->
                </div>
              </div>
            </template>
            <!-- state initial -->
            <template v-if="fetchLeaveSlotsState.initial">
              <div style="height:100%;width:100%;text-align:center;padding:10px;">
                <div
                  :style="'font-size:.8em;'+(highlightSunday(data))"
                >{{ parseInt(data.day.split("-")[2]) }}</div>
                <!-- <div style="width:100%;text-align:center">
                            <div style="height:5px;width:5px;border-radius:50%;background-color:red;"></div>
                </div>-->
                <div v-if="data.type=='current-month'">
                  <i class="el-icon-loading" />
                </div>
              </div>
            </template>
            <!-- state error -->
            <template v-if="fetchLeaveSlotsState.fail">
              <div style="height:100%;width:100%;text-align:center;padding:10px;">
                <div
                  :style="'font-size:.8em;'+(highlightSunday(data))"
                >{{ parseInt(data.day.split("-")[2]) }}</div>
                <!-- <div style="width:100%;text-align:center">
                            <div style="height:5px;width:5px;border-radius:50%;background-color:red;"></div>
                </div>-->
                <div v-if="data.type=='current-month'">
                  <el-tooltip
                    :content="fetchLeaveSlotsTitle=='No leave slots are found'? 'Slots Unavailable':'Please reload page'"
                  >
                    <i class="el-icon-refresh" />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
const dateCellStyle = {};
export default {
  data() {
    return {
      date: moment()._d,
      request: {
        slots: {
          start_event: null,
          end_event: null,
          user_id: null, //om_id/cluster_id
          leave_type: "vacation_leave"
        }
      },
      data: {
        slots: []
      }
    };
  },
  computed: {
    ...mapGetters([
      "position",
      "user_id",
      "token",
      "fetchHierarchyLogsData",
      "fetchHierarchyLogsState",
      "fetchHierarchyLogsTitle",
      "fetchLeaveSlotsData",
      "fetchLeaveSlotsState",
      "fetchLeaveSlotsTitle"
    ]),
    curMonthDate() {
      return moment(this.date).format("YYYY-MM-DD");
    }
  },
  mounted() {
    // console.log(this.token);
    // this.request.slots.leave_type = "vacation_leave";
    this.fetchHierarchyLogs({
      child_id: this.user_id,
      date: moment().format("YYYY-MM-DD")
    });
  },
  watch: {
    fetchLeaveSlotsState({ initial, success, fail }) {
      if (success) {
        this.data.slots = this.fetchLeaveSlotsData.leave_slots;
      }
    },
    fetchHierarchyLogsState({ initial, success, fail }) {
      if (success) {
        let position = this.position.toLowerCase();
        switch (position) {
          case "representative - order placer":
            this.request.slots.user_id = this.fetchHierarchyLogsData.hierarchy_log[0].parent_details.current_head_id;
            this.fetchLeaveSlots(this.request.slots);
            break;
        }
      }
    },
    date(v) {
      this.request.slots.start_event = moment(v)
        .startOf("month")
        .format("YYYY-MM-DD");
      this.request.slots.end_event = moment(v)
        .endOf("month")
        .format("YYYY-MM-DD");
      this.fetchLeaveSlots(this.request.slots);
    }
  },
  methods: {
    ...mapActions(["fetchHierarchyLogs", "fetchLeaveSlots"]),
    leaveTypeChange(v) {
      this.fetchLeaveSlots(this.request.slots);
    },
    slotValue(data) {
      let tmp = this.data.slots.filter(i => i.date.split(" ")[0] == data.day);
      return tmp.length > 0 ? tmp[0].value : 0;
    },
    sufficientSlots(data) {
      let result = false,
        tmp = this.data.slots.filter(i => i.date.split(" ")[0] == data.day);
      if (tmp.length > 0) {
        if (tmp[0].value > 0) {
          result = true;
        } else {
          result = false;
        }
      }
      return result;
    },
    now() {
      this.date = moment()._d;
    },
    prev() {
      this.date = moment(this.date)
        .subtract("month", 1)
        .startOf("month")._d;
    },
    next() {
      this.date = moment(this.date)
        .add("month", 1)
        .startOf("month")._d;
    },
    highlightSunday(data, date) {
      let result = "";
      if (
        moment(data.day)
          .format("dddd")
          .toLowerCase() == "sunday"
      ) {
        if (data.type == "current-month") {
          result = "color:red;";
        } else {
          result = "color:#ff9090;";
        }
      }
      return result;
    }
  }
};
</script>

<style scoped>
.el-calendar >>> .el-calendar-day {
  height: 50px;
  padding: 0px !important;
}
.el-calendar >>> *,
.el-calendar__table {
  border: none !important;
}
.el-calendar >>> .el-calendar__button-group {
  display: none;
}

.el-calendar >>> .el-calendar__title {
  display: none;
}

.el-calendar >>> .el-calendar__header {
  border: none;
  padding: 0px;
  margin: 0px;
}
.el-calendar >>> .el-calendar__body {
  padding: 0px;
}

.el-calendar >>> th {
  font-size: 0.7em;
  color: grey;
  text-transform: uppercase;
}

.el-calendar >>> .is-selected {
  /* border: rgb(100, 193, 255) 2px solid !important; */
}
</style>