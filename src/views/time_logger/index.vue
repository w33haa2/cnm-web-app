<template>
  <div>
    <sticky :z-index="10" :sticky-top="84" class-name="sub-navbar" style="padding:0px">
      <el-row>
        <el-col :md="{span:12}">
          <template v-if="today.ot.has_schedule">
            <el-button
              size="mini"
              style="margin-right:10px"
              type="danger"
              @click="drawer=true"
            >Join OT</el-button>
            <span class="fw-400" style="color:grey">11:00AM to 05:00PM</span>
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
            <span
              class="fw-400"
              style="color:grey"
            >{{ formatDate(today.schedule.rendered_hours.time,"HH:mm:ss", "HH:mm")}}</span>

            <el-button
              v-if="today.schedule.time_in != null && today.schedule.time_out == null"
              style="margin-left: 10px;"
              type="info"
              size="mini"
              @click="endWork"
            >END</el-button>
            <el-button
              v-else-if="today.schedule.time_in == null && today.schedule.time_out == null"
              style="margin-left: 10px;"
              type="primary"
              size="mini"
              @click="startWork"
            >START</el-button>
            <el-button
              v-if="today.schedule.time_in != null && today.schedule.time_out != null"
              style="margin-left: 10px;"
              type="info"
              size="mini"
              disabled
            >ENDED</el-button>
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
          userid: 249
        },
        has_schedule: false,
        schedule: null,
        ot: {
          can_join: false,
          has_schedule: false
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "todaysWork",
      "todaysWorkfetchState",
      "agentStartWorkfetchState",
      "agentStartWorkData",
      "agentEndWorkfetchState",
      "agentEndWorkData"
    ])
  },
  watch: {
    agentStartWorkfetchState({ initial, success, fail }) {
      if (success) {
        alert("Successfully timed in");
        this.today.schedule = this.agentStartWorkData;
      }
      if (fail) {
        alert("Oops! There's an error logging your time in.");
      }
    },
    todaysWorkfetchState({ initial, success, fail }) {
      if (success) {
        // alert("DEYMSOGOOOD!");
        let schedule = this.todaysWork.agent_schedules[0].schedule;
        if (schedule.length > 0) {
          // filter regular work
          let regular_work = schedule.filter(i => i.overtime_id == null);
          let unfinished_work = regular_work.filter(
            (
              i //1
            ) =>
              moment(moment().format("YYYY-MM-DD HH:mm:ss")).isBefore(
                moment(i.end_event.date).format("YYYY-MM-DD HH:mm:ss")
              ) &&
              moment(moment().format("YYYY-MM-DD HH:mm:ss")).isAfter(
                moment(i.start_event.date).format("YYYY-MM-DD HH:mm:ss")
              )
          );
          let incoming_work = regular_work.filter(i =>
            moment(moment().format("YYYY-MM-DD HH:mm:ss")).isBefore(
              moment(i.start_event.date).format("YYYY-MM-DD HH:mm:ss")
            )
          );
          console.log(incoming_work);
          if (unfinished_work.length == 1) {
            this.today.ot.can_join = false;
            this.today.has_schedule = true;
            this.today.schedule = unfinished_work[0];
          } else {
            // incoming work
            // let time_in_buffer = moment(incoming_work[0].start_event.date).subtract(15,"minute").format("YYYY-MM-DD HH:mm:ss")
            // alert(time_in_buffer);
            // alert(incoming_work[0].start_event.date)
            // if(moment(moment(time_in_buffer).format("YYYY-MM-DD HH:mm:ss")).isBefore(moment().format("YYYY-MM-DD HH:mm:ss"))){
              this.today.ot.can_join = false;
              this.today.has_schedule = true;
              this.today.schedule = incoming_work[0];
            // }
          }
          // let now = moment().format("YYYY-MM-DD HH:mm:ss"),
          //   end_schedule = moment(schedule[0].end_event.date).format(
          //     "YYYY-MM-DD HH:mm:ss"
          //   );
          // alert(end_schedule + " VS " + now);
          // if (moment().isBefore(end_schedule)) {
          //   this.today.has_schedule = true;
          // } else {
          //   this.today.has_schedule = false;
          // }
        } else {
          this.today.has_schedule = false;
        }
      }
    }
  },
  mounted() {
    this.fetchAgentsTodayWork(this.today.query);
    this.fetchOvertimeSchedules();
  },
  methods: {
    ...mapActions(["fetchAgentsTodayWork", "agentStartWork", "agentEndWork","fetchOvertimeSchedules"]),
    getTodaySchedule() {
      this.getchAgentsTodayWork();
    },
    getOTSchedule() {},
    endWork() {
      if (confirm("Do you really want to end work?")) {
        // log timeout
        const data = {
          time_out: moment().format("YYYY-MM-DD HH:mm:ss"),
          id: this.today.schedule.attendances.slice(-1).pop().id,
          schedule_id: this.today.schedule.id
        };
        this.agentEndWork(data);
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
          time_in: moment().format("YYYY-MM-DD HH:mm:ss")
        };
        this.agentStartWork(data);
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
