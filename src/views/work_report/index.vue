<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper">
              Work Reports
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 5, offset: 7 }">
          <el-date-picker
            type="month"
            style="width:100%"
            v-model="work_report.month"
            format="MMMM-yyyy"
            :clearable="false"
          ></el-date-picker>
        </el-col>
      </el-row>
    </div>

    <div class="table-container shadow">
      <el-row :gutter="20">
        <el-col :md="{span:24}">
          <div class="d-flex" style="justify-content:space-between">
            <div>
              {{ formatDate(work_report.month,"", "MMMM YYYY") +" Reports"}}
            </div>
            <div>
              
            <!-- number of data display 0 or more-->
              <template v-if="work_report.grid_data.length > 0">
                  {{ work_report.grid_data.length }}
                  Schedules
              </template>
              <!-- 0 number of data -->
              <template v-if="work_report.grid_data.length == 0">
                  No Schedules
              </template>
              </div>            
          </div>
        </el-col>
        <el-col
          class="schedule-container"
          v-for="(datum, index) in work_report.grid_data"
          :key="index"
        >
          <el-row>
            <el-col :md="{ span: 2 }">
              <div class="schedule-date">
                {{ formatDate(datum.start_event.date, "", "DD") }}
              </div>
              <div class="schedule-day">
                {{ formatDate(datum.start_event.date, "", "ddd") }}
              </div>
            </el-col>
            <el-col :md="{ span: 5 }">
              <div class="label">
                <small>
                  SCHEDULE
                  <small
                    v-if="datum.overtime_id"
                    style="padding:2px;background-color:#F56C6C;color:white;"
                    >OVERTIME</small
                  >
                  <small
                    v-else
                    style="padding:2px;background-color:#409EFF;color:white;"
                    >REGULAR</small
                  >
                </small>
              </div>
              <div class="text">
                {{
                  formatDate(datum.start_event.date, "", "hh:mm a") +
                    " - " +
                    formatDate(datum.end_event.date, "", "hh:mm a")
                }}
              </div>
            </el-col>
            <el-col :md="{ span: 5 }">
              <div class="label">
                <small>
                  ATTENDANCE
                  <template v-if="datum.remarks.toLowerCase() == 'on-leave'">
                    <span>
                      <small
                        style="padding:2px;background-color:#E6A23C;color:white"
                        >{{
                          leave_label[
                            datum.leave.leave_type.toLowerCase()
                          ].toUpperCase()
                        }}</small
                      >
                    </span>
                  </template>
                  <template v-else>
                    <span>
                      <small
                        :style="
                          'padding:2px;background-color:' +
                            tag[datum.remarks.toLowerCase()].bc +
                            ';color:' +
                            tag[datum.remarks.toLowerCase()].fc
                        "
                        >{{ datum.remarks.toUpperCase() }}</small
                      >
                    </span>
                  </template>
                </small>
              </div>
              <div class="text" v-if="datum.remarks == 'Present'">
                {{ formatDate(datum.time_in.date, "", "hh:mm a") + " - " }}
                <span v-if="datum.time_out">{{
                  formatDate(datum.time_out.date, "", "hh:mm a")
                }}</span>
                <span v-else>
                  <span
                    v-if="laterDate(datum.end_event.date)"
                    style="color:#409EFF"
                    >ongoing..</span
                  >
                  <span v-else style="color:#F56C6C">no timeout</span>
                </span>
              </div>
              <div v-else class="text" style="color:grey">NO LOGS</div>
            </el-col>
            <el-col :md="{ span: 2 }">
              <div class="label">
                <small>VTO</small>
              </div>
              <el-tag v-if="datum.vto_at" type="primary" size="mini">{{
                datum.vto_hours.second / 60 / 60 + " hr/s"
              }}</el-tag>
              <el-tag v-else type="info" size="mini">0 hr/s</el-tag>
            </el-col>
            <el-col :md="{ span: 4 }">
              <div class="label">
                <small>CONFORMANCE</small>
              </div>
              <div>
                <el-progress
                  :percentage="parseFloat(datum.conformance).toFixed(1)"
                  color="#6f7ad3"
                ></el-progress>
              </div>
            </el-col>
            <el-col :md="{ span: 3 }">
              <div class="label">
                <small>HOURS</small>
              </div>
              <div>
                <span style="color:grey">{{
                  (datum.rendered_hours.billable.second / 60 / 60).toFixed(1)
                }}</span>
              </div>
            </el-col>
            <el-col :md="{ span: 3 }">
              <div class="label">
                <small>ND</small>
              </div>
              <div>
                <span style="color:grey">{{
                  datum.rendered_hours.night_difference
                }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import agentCard from "./components/AgentCard";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AgentWorkReports",
  components: { agentCard },
  data() {
    return {
      tag: {
        present: {
          bc: "#67C23A",
          fc: "white",
          label: "PRESENT"
        },
        off: {
          bc: "#EBEEF5",
          fc: "#909399",
          label: "OFF"
        },
        upcoming: {
          bc: "#0072ff",
          fc: "white",
          label: "UPCOMING"
        },
        ncns: {
          bc: "#F56C6C",
          fc: "white",
          label: "NCNS"
        },
        absent: {
          bc: "#909399",
          fc: "white",
          label: "ABSENT"
        },
        inactive: {
          bc: "#000000",
          fc: "white",
          label: "INACTIVE"
        }
      },
      leave_label: {
        vacation_leave: "vacation",
        sick_leave: "sick",
        leave_of_absence: "LOA",
        maternity_leave: "maternity",
        paternity_leave: "paternity",
        bereavement_leave: "bereavement",
        solo_parent_leave: "solo parent",
        vawc: "vawc",
        magna_carta_leave: "magna carta",
        partial_sick_leave: "partial sick",
        loa1: "LOA1 (S)",
        loa2: "LOA2 (V)"
      },
      containerLoader: true,
      show_fetch_error: false,
      show_report: false,
      show_report_error: false,
      show_report_noschedule: false,
      summary: {},
      work_report: {
        month: moment().format("YYYY-MM"),
        query: {
          start: null,
          end: null
        },
        grid_data: []
      }
    };
  },
  computed: {
    ...mapGetters([
      "userDetails",
      "agentsWorkReportsfetchState",
      "agentsWorkReports",
      "position",
      "user_id"
    ])
  },
  mounted() {
    this.query = {
      start: moment()
        .startOf("month")
        .format("YYYY-MM-DD"),
      end: moment()
        .endOf("month")
        .format("YYYY-MM-DD"),
      userid: this.user_id
    };
    const data = this.query;
    this.fetchAgentsWorkReports({ data });
  },
  watch: {
    agentsWorkReportsfetchState({ initial, success, fail }) {
      if (initial) {
        this.containerLoader = true;
      }
      if (success) {
        this.containerLoader = false;
        let tmp = this.agentsWorkReports.agent_schedules[0].schedule;
        if (tmp.length > 0) {
          this.show_report = true;
          this.show_report_error = false;
          this.show_report_noschedule = false;
        } else {
          this.show_report = false;
          this.show_report_error = false;
          this.show_report_noschedule = true;
        }
        this.work_report.grid_data = tmp.sort(this.descStartEvent);
        this.summary = this.agentsWorkReports.agent_schedules[0].summary;
      }
      if (fail) {
        this.containerLoader = false;
        this.show_fetch_error = true;
        this.show_report = false;
        this.show_report_error = true;
        this.show_report_noschedule = true;
      }
    },
    "work_report.month": function(v) {
      this.query = {
        start: moment(v)
          .startOf("month")
          .format("YYYY-MM-DD"),
        end: moment(v)
          .endOf("month")
          .format("YYYY-MM-DD"),
        userid: this.user_id
      };
      const data = this.query;
      this.fetchAgentsWorkReports({ data });
    }
  },
  methods: {
    ...mapActions(["fetchAgentsWorkReports"]),
    descStartEvent(a, b) {
      let v1 = moment(a.start_event.date).format("YYYY-MM-DD HH:mm:ss"),
        v2 = moment(b.start_event.date).format("YYYY-MM-DD HH:mm:ss");
      let compare = 0;
      if (v2 > v1) {
        compare = 1;
      } else if (v2 < v1) {
        compare = -1;
      }
      return compare;
    },
    getTodaySchedule() {},
    getTodayOt() {},
    startWork() {},
    joinOt() {},
    displayMonth() {
      return this.formatDate(this.work_report.month, "", "MMMM").toUpperCase();
    },
    laterDate(date) {
      let result = false;
      if (moment().isBefore(moment(date).format("YYYY-MM-DD HH:mm:ss"))) {
        result = true;
      } else {
        result = false;
      }
      return result;
    },
    pastDate(date) {
      let result = false;
      if (moment().isAfter(moment(date).format("YYYY-MM-DD HH:mm:ss"))) {
        result = true;
      } else {
        result = false;
      }
      return result;
    },
    tagType(remarks) {
      let tag = "danger";
      switch (remarks.toLowerCase()) {
        case "present":
          tag = "success";
          break;
        case "ncns":
          tag = "danger";
          break;
        case "absent":
          tag = "info";
          break;
        case "on-leave":
          tag = "warning";
          break;
      }
      return tag;
    }
  }
};
</script>

<style scoped lang="scss">
.components-container div {
  margin: 10px;
}

.time-container {
  display: inline-block;
}

.c-grey {
  color: rgb(194, 194, 194);
}
.fw-400 {
  font-weight: 400;
}
.header {
  font-size: 16px;
}
.month-container {
  padding: 15px;
  background-color: white;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.schedule-container {
  padding-top: 5px;

  .label {
    margin-bottom: 10px;
    margin-top: 5px;
    font-size: 0.8em;
    font-weight: 600;

    small {
      color: grey;
      font-weight: 300;
    }
  }
  .text {
    line-height: 20px;
    font-size: 0.85em;
  }
  .schedule-date {
    font-size: 35px;
    width: 100%;
    text-align: center;
  }
  .schedule-day {
    width: 100%;
    text-align: center;
  }
}
</style>
