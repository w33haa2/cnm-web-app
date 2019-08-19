<template>
  <div>
    <div class="app-container">
      <el-row>
        <el-col>
          <h4 style="color:#646464">Work Reports</h4>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="{span:6}">
          <agent-card :user="sample_user"></agent-card>
        </el-col>
        <el-col :md="{span:18}" style="padding-left:30px;">
          <el-row style="margin-bottom:10px;">
            <el-col>
              <el-date-picker
                type="month"
                size="mini"
                v-model="work_report.month"
                format="MMMM-yyyy"
                :clearable="false"
              ></el-date-picker>
            </el-col>
          </el-row>
          <el-card style="padding-bottom:15px;">
            <el-col class="header">{{ formatDate(work_report.month,"", " MMMM YYYY") }}</el-col>
            <el-col
              class="schedule-container"
              v-for="(datum,index) in work_report.grid_data"
              :key="index"
            >
              <el-divider style="padding:5px;"></el-divider>
              <el-row>
                <el-col :md="{span:2}">
                  <div class="schedule-date">{{ formatDate(datum.start_event.date,"", "DD") }}</div>
                  <div class="schedule-day">{{ formatDate(datum.start_event.date,"","ddd") }}</div>
                </el-col>
                <el-col :md="{span:5}">
                  <div class="label">
                    <small>SCHEDULE</small>
                  </div>
                  <div
                    class="text"
                  >{{ formatDate(datum.start_event.date,"","HH:mm a") + " - " + formatDate(datum.end_event.date,"","HH:mm a") }}</div>
                </el-col>
                <el-col :md="{span:5}">
                  <div class="label">
                    <small>ATTENDANCE</small>
                  </div>
                  <div class="text" v-if="datum.remarks == 'Present'">
                    {{ formatDate(datum.time_in.date,"","HH:mm a") + " - " }}
                    <span
                      v-if="datum.time_out"
                    >{{ formatDate(datum.time_out.date,"","HH:mm a") }}</span>
                    <span v-else>
                      <span v-if="laterDate(datum.end_event.date)" style="color:#409EFF">ongoing..</span>
                      <span v-else style="color:#F56C6C">no timeout</span>
                    </span>
                  </div>
                  <div v-else class="text" style="color:grey">NO LOGS</div>
                </el-col>
                <el-col :md="{span:2}">
                  <div class="label">
                    <small>VTO</small>
                  </div>
                  <el-tag type="primary" size="mini">YES</el-tag>
                </el-col>
                <el-col :md="{span:4}">
                  <div class="label">
                    <small>CONFORMANCE</small>
                  </div>
                  <div>
                    <el-progress :percentage="datum.conformance | toFix" color="#6f7ad3"></el-progress>
                  </div>
                </el-col>
                <el-col :md="{span:6}">
                  <div class="label">
                    <small>STATUS</small>
                  </div>
                  <div>
                    <el-tag v-if="laterDate(datum.start_event.date)" size="mini">LATER DATE</el-tag>
                    <el-tag v-else :type="tagType(datum.remarks)" size="mini">{{ datum.remarks }}</el-tag>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import agentCard from "./components/AgentCard";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "StickyDemo",
  components: { Sticky, agentCard },
  data() {
    return {
      sample_user: {
        full_name: "John Doe",
        position: "Representative - Order Placer",
        image_url: null,
        summary: {
          monthly: {
            month: "August",
            conformance: 12
          },
          yearly: {
            year: "2019",
            conformance: 99
          },
          overall: {
            conformance: 99
          },
          count: {
            ncns: 1,
            absent: 2,
            present: 15,
            onleave: 0
          }
        }
      },
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
      "agentsWorkReports"
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
      userid: 7
    };
    const data = this.query;
    this.fetchAgentsWorkReports({ data });
  },
  watch: {
    agentsWorkReports(v) {
      let tmp = v.agent_schedules[0].schedule;
      this.work_report.grid_data = tmp.sort(this.descStartEvent);
    },
    agentsWorkReportsfetchState({ initial, success, fail }) {},
    "work_report.month": function(v) {
      this.query = {
        start: moment(v)
          .startOf("month")
          .format("YYYY-MM-DD"),
        end: moment(v)
          .endOf("month")
          .format("YYYY-MM-DD"),
        userid: 7
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
                    
