<template>
  <div>
    <sticky :z-index="10" :sticky-top="84" class-name="sub-navbar" style="padding:0px">
      <el-row>
        <el-col :md="{span:12}">
          <template v-if="fetchTodaysScheduleTitle != 'on-leave schedule.'">
            <template v-if="fetchTodaysScheduleData.overtime">
              <template
                v-if="fetchTodaysScheduleData.schedule && fetchTodaysScheduleData.schedule.overtime_id && fetchTodaysScheduleData.overtime.id == fetchTodaysScheduleData.schedule.overtime_id"
              >
                <el-tag
                  v-if="!fetchTodaysScheduleData.schedule.time_out"
                  type="primary"
                >Attending Overtime.</el-tag>
                <el-tag v-else type="primary">Attended Overtime.</el-tag>
              </template>
              <template v-else>
                <el-button
                  size="mini"
                  style="margin-right:10px"
                  type="danger"
                  @click="joinOvertime"
                  :loading="btn_loading.join_ot"
                >Join OT</el-button>
                <span
                  class="fw-400"
                  style="color:grey"
                >{{ fromNow(fetchTodaysScheduleData.overtime.start_event) }}</span>
                <el-divider direction="vertical"></el-divider>
                <!-- <span class="c-grey fw-400">TIME IN</span> -->
                <span
                  class="fw-400"
                  style="color:grey"
                >{{ formatDate(fetchTodaysScheduleData.overtime.start_event,"","hh:mm a") }}</span>

                <span class="c-grey fw-400">-</span>
                <!-- <span class="c-grey fw-400">TIME OUT</span> -->
                <span
                  class="fw-400"
                  style="color:grey"
                >{{ formatDate(fetchTodaysScheduleData.overtime.end_event,"","hh:mm a") }}</span>
              </template>
            </template>
            <template v-else>
              <el-tag
                type="info"
              >{{ fetchTodaysScheduleState.initial ? "Fetching overtime schedule.": "No scheduled overtime." }}</el-tag>
            </template>
          </template>
        </el-col>
        <el-col :md="{span:12}" style="text-align:right">
          <!-- <span class="c-grey fw-400">SCHEDULE</span> -->
          <template v-if="fetchTodaysScheduleData.schedule">
            <template v-if="fetchTodaysScheduleTitle != 'on-leave schedule.'">
              <span
                class="fw-400"
                style="color:grey"
              >{{ fromNow(fetchTodaysScheduleData.schedule.start_event.date) }}</span>
              <el-divider direction="vertical"></el-divider>
              <!-- <span class="c-grey fw-400">TIME IN</span> -->
              <span
                class="fw-400"
                style="color:grey"
              >{{ formatDate(fetchTodaysScheduleData.schedule.start_event.date,"","hh:mm a") }}</span>

              <span class="c-grey fw-400">-</span>
              <!-- <span class="c-grey fw-400">TIME OUT</span> -->
              <span
                class="fw-400"
                style="color:grey"
              >{{ formatDate(fetchTodaysScheduleData.schedule.end_event.date,"","hh:mm a") }}</span>

              <el-divider direction="vertical"></el-divider>
              <!-- <span class="c-grey fw-400">DURATION</span> -->

              <template
                v-if="fetchTodaysScheduleData.schedule.time_in != null && fetchTodaysScheduleData.schedule.time_out == null"
              >
                <span class="fw-400" style="color:grey">{{ rendered }}</span>
                <el-button style="margin-left: 10px;" type="info" size="mini" @click="endWork">END</el-button>
              </template>
              <template
                v-else-if="fetchTodaysScheduleData.schedule.time_in == null && fetchTodaysScheduleData.schedule.time_out == null"
              >
                <span class="fw-400" style="color:grey">00:00:00</span>
                <el-button
                  style="margin-left: 10px;"
                  type="primary"
                  size="mini"
                  @click="startWork"
                  :loading="btn_loading.start_work"
                >START</el-button>
              </template>
              <template
                v-if="fetchTodaysScheduleData.schedule.time_in != null && fetchTodaysScheduleData.schedule.time_out != null"
              >
                <span class="fw-400" style="color:grey">{{ rendered }}</span>
                <el-button style="margin-left: 10px;" type="info" size="mini" disabled>ENDED</el-button>
              </template>
            </template>
            <template v-else>
              <el-tag
                type="warning"
              >{{ "ON "+ remUnderscore(fetchTodaysScheduleData.leave.leave_type).toUpperCase() }}</el-tag>
            </template>
          </template>
          <template v-else>
            <el-tag
              type="info"
            >{{ fetchTodaysScheduleState.initial ? "Fetching schedule.":"No schedule." }}</el-tag>
          </template>
        </el-col>
      </el-row>
    </sticky>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import { mapActions, mapGetters } from "vuex";
// import { timer } from "vue-timers";
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
      btn_loading: {
        start_work: false,
        join_ot: false
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
      "fetchTodaysScheduleState",
      "fetchTodaysScheduleData",
      "fetchTodaysScheduleTitle"
    ]),
    rendered() {
      return this.today.rendered != null
        ? this.secToHMS(this.today.rendered)
        : "00:00:00";
    }
  },
  watch: {
    joinOvertimeScheduleState({ initial, success, fail }) {
      if (initial) {
        this.btn_loading.join_ot = true;
      }
      if (success) {
        this.$message({
          type: "success",
          message: "You have successfully timed-in with the overtime schedule.",
          duration: 10000
        });
        this.fetchTodaysSchedule(this.today.query);
      }
      if (fail) {
        this.$message({
          type: "error",
          message: this.joinOvertimeScheduleError,
          duration: 10000
        });
        this.btn_loading.join_ot = false;
      }
    },
    agentTimeInState({ initial, success, fail }) {
      if (initial) {
        this.btn_loading.start_work = true;
        this.btn_loading.join_ot = true;
      }
      if (success) {
        this.$message({
          type: "success",
          message: this.agentTimeInTitle,
          duration: 10000
        });
        // this.btn_loading.start_work = false;
        this.fetchTodaysSchedule(this.today.query);
      }
      if (fail) {
        this.btn_loading.start_work = false;
        this.btn_loading.join_ot = false;
        this.$message({
          type: "error",
          message: this.agentTimeInTitle,
          duration: 10000
        });
      }
    },
    agentTimeOutState({ initial, success, fail }) {
      if (success) {
        this.fetchTodaysSchedule(this.today.query);
        this.$timer.stop("renderedTick");
        this.$message({
          type: "success",
          message: this.agentTimeOutTitle,
          duration: 10000
        });
      }
      if (fail) {
        this.fetchTodaysSchedule(this.today.query);
        this.$message({
          type: "error",
          message: this.agentTimeOutTitle,
          duration: 10000
        });
      }
    },
    fetchTodaysScheduleState({ initial, success, fail }) {
      if (fail) {
        alert("There is a problem fetching your schedule.");
      }
      if (success) {
        this.btn_loading.join_ot = false;
        // this.fetchTodaysOvertimeSchedule();
        this.today.rendered = this.fetchTodaysScheduleData.schedule.overtime_id
          ? this.fetchTodaysScheduleData.schedule.overtime.second
          : this.fetchTodaysScheduleData.schedule.rendered_hours.second;
        switch (this.fetchTodaysScheduleTitle) {
          case "previous schedule.":
          case "ongoing schedule.":
          case "upcoming schedule.":
            if (
              this.fetchTodaysScheduleData.schedule.time_in &&
              !this.fetchTodaysScheduleData.schedule.time_out
            ) {
              this.$timer.start("renderedTick");
            } else {
              this.$timer.stop("renderedTick");
            }
            break;
        }
      }
    },
    fetchTodaysOvertimeScheduleState({ initial, success, fail }) {}
  },
  mounted() {
    this.today.query.userid = this.user_id;
    this.fetchTodaysSchedule(this.today.query);
  },
  timers: [{ name: "renderedTick", time: 1000, repeat: true }],
  methods: {
    ...mapActions([
      "fetchAgentsTodayWork",
      "agentStartWork",
      "agentEndWork",
      "fetchTodaysOvertimeSchedule",
      "joinOvertimeSchedule",
      "agentTimeIn",
      "agentTimeOut",
      "fetchTodaysSchedule"
    ]),
    renderedTick() {
      this.today.rendered++;
    },
    joinOvertime() {
      // if (this.fetchTodaysScheduleData.allow_ot) {
        this.joinOvertimeSchedule();
      // } else {
      //   this.$message({
      //     type: "error",
      //     message: "You are not allowed to join overtime.",
      //     duration: 10000
      //   });
      // }
    },
    endWork() {
      if (confirm("Do you really want to end work?")) {
        // log timeout
        const data = {
          attendance_id: this.fetchTodaysScheduleData.schedule.attendances
            .slice(-1)
            .pop().id
        };
        this.agentTimeOut(data);
      }
    },
    startWork() {
      const data = {
        schedule_id: this.fetchTodaysScheduleData.schedule.id
      };
      this.agentTimeIn(data);
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
