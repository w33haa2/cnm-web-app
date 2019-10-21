<template>
  <div>
    <sticky :z-index="10" :sticky-top="84" class-name="sub-navbar" style="padding:0px">
      <el-row>
        <el-col :md="{span:12}">
          <template v-if="today.ot.has_schedule">
            <template v-if="today.ot.joined">
              <span style="color:#409EFF;font-weight:600;cursor:default">Attending Overtime.</span>
            </template>
            <template v-else>
              <el-button
                size="mini"
                style="margin-right:10px"
                type="danger"
                @click="joinOvertime"
              >Join OT</el-button>
              <span class="fw-400" style="color:grey">{{ fromNow(today.ot.schedule.start_event) }}</span>
              <el-divider direction="vertical"></el-divider>
              <!-- <span class="c-grey fw-400">TIME IN</span> -->
              <span
                class="fw-400"
                style="color:grey"
              >{{ formatDate(today.ot.schedule.start_event,"","hh:mm a") }}</span>

              <span class="c-grey fw-400">-</span>
              <!-- <span class="c-grey fw-400">TIME OUT</span> -->
              <span
                class="fw-400"
                style="color:grey"
              >{{ formatDate(today.ot.schedule.end_event,"","hh:mm a") }}</span>
            </template>
          </template>
          <template v-else>
            <span style="color:#ccc;font-weight:600;cursor:default">No scheduled overtime.</span>
          </template>
        </el-col>
        <el-col :md="{span:12}" style="text-align:right">
          <!-- <span class="c-grey fw-400">SCHEDULE</span> -->
          <template v-if="today.has_schedule">
            <span class="fw-400" style="color:grey">{{ fromNow(today.schedule.start_event.date) }}</span>
            <el-divider direction="vertical"></el-divider>
            <!-- <span class="c-grey fw-400">TIME IN</span> -->
            <span
              class="fw-400"
              style="color:grey"
            >{{ formatDate(today.schedule.start_event.date,"","hh:mm a") }}</span>

            <span class="c-grey fw-400">-</span>
            <!-- <span class="c-grey fw-400">TIME OUT</span> -->
            <span
              class="fw-400"
              style="color:grey"
            >{{ formatDate(today.schedule.end_event.date,"","hh:mm a") }}</span>

            <el-divider direction="vertical"></el-divider>
            <!-- <span class="c-grey fw-400">DURATION</span> -->

            <template v-if="today.schedule.time_in != null && today.schedule.time_out == null">
              <span class="fw-400" style="color:grey">{{ secToHMS(today.rendered) }}</span>
              <el-button style="margin-left: 10px;" type="info" size="mini" @click="endWork">END</el-button>
            </template>
            <template v-else-if="today.schedule.time_in == null && today.schedule.time_out == null">
              <span class="fw-400" style="color:grey">00:00:00</span>
              <el-button
                style="margin-left: 10px;"
                type="primary"
                size="mini"
                @click="startWork"
                :loading="btn_loading.start_work"
              >START</el-button>
            </template>
            <template v-if="today.schedule.time_in != null && today.schedule.time_out != null">
              <span
                class="fw-400"
                style="color:grey"
              >{{ secToHMS(getDuration(today.schedule.time_in.date,today.schedule.time_out.date)) }}</span>
              <el-button style="margin-left: 10px;" type="info" size="mini" disabled>ENDED</el-button>
            </template>
          </template>
          <template v-else>
            <span style="color:#ccc;font-weight:600;cursor:default">No schedule for today.</span>
          </template>
        </el-col>
      </el-row>
    </sticky>
  </div>
</template>

<script>
// import leavePage from "./leave";
// import WorkReportPage from "./work_report";
// import SchedulePage from "./schedule";
// import SchedulePage from "./schedule";
// import IRPage from "../incident_reports/receive";
import Sticky from "@/components/Sticky";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  components: { Sticky },
  data() {
    return {
      page: null,
      today: {
        query: {
          start: moment()
            .subtract(1, "day")
            .format("YYYY-MM-DD"),
          end: moment()
            .add(1, "day")
            .format("YYYY-MM-DD"),
          userid: null
        },
        has_schedule: false,
        schedule: null,
        rendered: null,
        ot: {
          joined: false,
          show: false,
          allowed: false,
          has_schedule: false,
          schedule: null
        }
      },
      btn_loading:{
        start_work:false,
      }
    };
  },
  computed: {
    ...mapGetters([
      "user_id",
      "todaysWork",
      "todaysWorkfetchState",
      "agentStartWorkfetchState",
      "agentStartWorkData",
      "agentEndWorkfetchState",
      "agentEndWorkData",
      "fetchTodaysOvertimeScheduleState",
      "fetchTodaysOvertimeScheduleData",
      "fetchTodaysOvertimeScheduleError",
      "joinOvertimeScheduleState",
      "joinOvertimeScheduleData",
      "joinOvertimeScheduleError",
      "agentTimeInState",
      "agentTimeInData",
      "agentTimeInTitle",
      "agentTimeOutState",
      "agentTimeOutData",
      "agentTimeOutTitle",
    ])
  },
  watch: {
    joinOvertimeScheduleState({ initial, success, fail }) {
      if (success) {
        alert("You have successfully timed-in with the overtime schedule.")
        this.fetchAgentsTodayWork(this.today.query);
      }
      if(fail){
        alert(this.joinOvertimeScheduleError);
      }
    },
    agentTimeInState({ initial, success, fail }) {
      if(initial){
        this.btn_loading.start_work = true;
      }
      if (success) {
        this.$message({
          type:"success",
          message:this.agentTimeInTitle,
          duration:10000
        })
        this.btn_loading.start_work = false;
        this.fetchAgentsTodayWork(this.today.query);
      }
      if (fail) {
        this.btn_loading.start_work = false;
        this.$message({
          type:"error",
          message:this.agentTimeInTitle,
          duration:10000
        })
      }
    },
    agentTimeOutState({ initial, success, fail }){
      if(success){
        this.fetchAgentsTodayWork(this.today.query);
        this.$message({
          type:"success",
          message:this.agentTimeOutTitle,
          duration:10000,
        });
      }
      if(fail){
        this.fetchAgentsTodayWork(this.today.query);
        this.$message({
          type:"error",
          message:this.agentTimeOutTitle,
          duration:10000,
        });
      }
    },
    todaysWorkfetchState({ initial, success, fail }) {
      if (success) {
        let schedule = this.todaysWork.agent_schedules[0].schedule;

        if (schedule.length > 0) {
          let unfinished_work,ot_sched = schedule.filter(i=> i.overtime_id !== null);

          unfinished_work = ot_sched.filter((
            i //1
          ) => this.ongoing(moment(i.start_event.date).subtract(10,'minutes').format("YYYY-MM-DD HH:mm:ss"), i.end_event.date));
          if(unfinished_work.length==0){
            unfinished_work = schedule.filter((
              i //1
            ) => this.ongoing(i.start_event.date, i.end_event.date));
          }

          if (unfinished_work.length > 0) {
            this.today.ot.allowed = false;
            this.today.has_schedule = true;
            this.today.schedule = unfinished_work[0];
            this.today.rendered = moment
              .duration(
                moment(moment().format("YYYY-MM-DD HH:mm:ss")).diff(
                  moment(this.today.schedule.time_in.date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                )
              )
              .as("seconds");
            if (this.today.schedule.time_out == null) {
              this.renderedTick();
            }
          } else {
            let incoming_work = schedule.filter(i =>
              moment(moment().format("YYYY-MM-DD HH:mm:ss")).isBefore(
                moment(i.start_event.date).format("YYYY-MM-DD HH:mm:ss")
              )
            );
            if (incoming_work.length > 0) {
              incoming_work.sort(this.sortIncomingWork);
              this.today.has_schedule = true;
              this.today.schedule = incoming_work[0];
              this.today.rendered = moment
                .duration(
                  moment(moment().format("YYYY-MM-DD HH:mm:ss")).diff(
                    moment(this.today.schedule.time_in.date).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  )
                )
                .as("seconds");
              this.renderedTick();
            } else {
              this.today.has_schedule = false;
              this.today.schedule = null;
            }
          }
        } else {
          this.today.has_schedule = false;
          this.today.schedule = null;
        }
      }

      let data = {
        "target[]": "start_event",
        query: moment().format("YYYY-MM-DD")
      };
      this.fetchTodaysOvertimeSchedule(data);
    },
    fetchTodaysOvertimeScheduleState({ initial, success, fail }) {
      if (success) {
        let schedule = this.fetchTodaysOvertimeScheduleData.overtime;
        if (schedule.length > 0) {
          let ongoing = schedule.filter(i =>
            this.ongoing(i.start_event, i.end_event)
          );
          ongoing.sort((a, b) => {
            let v1 = moment(a.start_event).format("YYYY-MM-DD HH:mm:ss"),
              v2 = moment(b.start_event).format("YYYY-MM-DD HH:mm:ss");
            let compare = 0;
            if (v1 > v2) {
              compare = 1;
            } else if (v1 < v2) {
              compare = -1;
            }
            return compare;
          });
          if (ongoing.length > 0) {
            console.log(ongoing);
            this.today.ot.has_schedule = true;
            this.today.ot.schedule = ongoing[0];
          } else {
            let incoming = schedule.filter(i =>
              moment(moment().format("YYYY-MM-DD HH:mm:ss")).isBefore(
                moment(i.start_event).format("YYYY-MM-DD HH:mm:ss")
              )
            );
            if (incoming.length > 0) {
              incoming.sort(this.sortIncomingWork);
              this.today.ot.has_schedule = true;
              this.today.ot.schedule = incoming[0];
            } else {
              this.today.ot.has_schedule = false;
              this.today.ot.schedule = null;
            }
          }
        } else {
          this.today.ot.has_schedule = false;
          this.today.ot.schedule = null;
        }
      }
      this.generateLogRestrictions();
    }
  },
  mounted() {
    this.today.query.userid = this.user_id;
    this.fetchAgentsTodayWork(this.today.query);
  },
  methods: {
    ...mapActions([
      "fetchAgentsTodayWork",
      "agentStartWork",
      "agentEndWork",
      "fetchTodaysOvertimeSchedule",
      "joinOvertimeSchedule",
      "agentTimeIn",
      "agentTimeOut"
    ]),
    renderedTick() {
      setInterval(() => {
        this.today.rendered = parseInt(this.today.rendered) + 1;
      }, 1000);
    },
    generateLogRestrictions() {
      if (this.today.has_schedule) {
        // check if ot has schedule
        if (this.today.ot.schedule) {
          // check if same with ot id
          if (this.today.schedule.overtime_id == this.today.ot.schedule.id) {
            this.today.ot.joined = true;
            this.today.duration = this.today.schedule.overtime.second
          } else {
            this.today.ot.joined = false;
            // variable for the same start event
            let isSameStart = moment(
              moment(this.today.ot.schedule.start_event).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            ).isSame(
              moment(this.today.schedule.start_event.date).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
            // check if schedules are conflict
            if (
              this.conflictDates(this.today.ot.schedule, this.today.schedule) ||
              isSameStart
            ) {
              this.today.ot.allowed = false;
            } else {
              this.today.ot.allowed = true;
            }
          }
        } else {
          this.today.ot.has_schedule = false;
          this.today.ot.schedule = null;
          this.today.ot.joined = false;
          this.today.ot.allowed = false;
        }
      } else {
        this.today.has_schedule = false;
        this.today.schedule = null;
        if (this.today.ot.has_schedule) {
          this.today.ot.allowed = true;
        } else {
          this.today.ot.allowed = false;
        }
      }
    },
    sortIncomingWork(a, b) {
      // ascending
      let v1 = moment(a.start_event.date).format("YYYY-MM-DD HH:mm:ss"),
        v2 = moment(b.start_event.date).format("YYYY-MM-DD HH:mm:ss");
      let compare = 0;
      if (v1 > v2) {
        compare = 1;
      } else if (v1 < v2) {
        compare = -1;
      }
      return compare;
    },
    getTodaySchedule() {
      this.getchAgentsTodayWork();
    },
    joinOvertime() {
      // this.today.schedule.leave.status=="approved"
      if (this.today.ot.allowed) {
        // confirm if 10mins before overtime start_event
        if(this.today.ot.has_schedule){
          let start10mins = moment(this.today.ot.schedule.start_event).subtract(10,"minutes").format("YYYY-MM-DD HH:mm:ss"), end = moment(this.today.ot.schedule.end_event).format("YYYY-MM-DD HH:mm:ss"), isBetweenAllowedTime = moment().isBetween(start10mins,end);
          // alert(isBetweenAllowedTime);
          if(isBetweenAllowedTime){
            this.joinOvertimeSchedule();
          }else{
            alert(
              "You're only allowed to start 10mins before the actual schedule."
            );
          }
        }
      } else {
        this.$message({
          type: "warning",
          message: "You have existing regular work schedule.",
          duration: "5000"
        });
      }
    },
    endWork() {
      if (confirm("Do you really want to end work?")) {
        // log timeout
        const data = {
          attendance_id: this.today.schedule.attendances.slice(-1).pop().id,
        };
        this.agentTimeOut(data);
      }
    },
    startWork() {
      let allowed_time = moment(this.today.schedule.start_event.date)
        .subtract(10 * 60, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");
      if (moment().isBefore(moment(allowed_time))) {
        alert(
          "You're only allowed to start 10mins before the actual schedule."
        );
      } else {
        const data = {
          schedule_id: this.today.schedule.id,
        };
        if(this.today.schedule.leave!=null){
          if(this.today.schedule.leave.status=="approved"){
            alert('This schedule is under "ON-LEAVE" status. Please inform RTA group if you want to start work.')
          }else{
            this.agentTimeIn(data);
          }
        }else{
            this.agentTimeIn(data);
        }
      }
    }
  }
};
</script>

<style lang="scss">
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
</style>
