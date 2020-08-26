<template>
  <div>
    <div class="app-container">
      <div class="title-bar shadow">
        <el-row>
          <el-col :md="{ span: 12 }" :xs="{ span: 12 }" :sm="{ span: 12 }">
            <div class="d-flex">
              <div class="title-wrapper" style="margin-right:10px">
                Agent Leaves
              </div>

              <div
                class="button-icon round active"
                style="display:flex;justify-content:center;margin-right:5px;"
                @click="leaveForm({ action: 'create' })"
              >
                <el-tooltip placement="top" content="Add Leave">
                  <plus-icon></plus-icon>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col
            :md="{ span: 2, offset: 8 }"
            :xs="{ span: 4, offset: 4 }"
            :sm="{ span: 3, offset: 6 }"
            style="text-align:right"
          >
            <div style="cursor:default">
              <div style="font-size:.6em;color:gray;justify-content:right">
                <div>
                  <div
                    style="font-weight:500;border-radius:3px;background-color:#1890ff;padding:3px;display:inline-block;color:white;font-size:.8em;"
                  >
                    VL
                  </div>
                  CREDITS
                </div>
              </div>
              <div>
                <el-tooltip placement="bottom" content="Vacation Leave Credits">
                  <div style="width:100%;font-size:1.3em;font-weight:600">
                    <count-to
                      :start-val="0"
                      :end-val="vl_credits"
                      :duration="4000"
                      :decimals="0"
                      separator=","
                      :autoplay="true"
                    />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col
            :md="{ span: 2 }"
            :xs="{ span: 4 }"
            :sm="{ span: 3 }"
            style="text-align:right"
          >
            <div style="cursor:default">
              <div style="font-size:.6em;color:gray;">
                <div
                  style="font-weight:500;border-radius:3px;background-color:#ffc107;padding:3px;display:inline-block;color:white;font-size:.8em;"
                >
                  SL
                </div>
                CREDITS
              </div>
              <div>
                <el-tooltip placement="bottom" content="Sick Leave Credit">
                  <div style="width:100%;font-size:1.3em;font-weight:600">
                    <count-to
                      :start-val="0"
                      :end-val="sl_credits"
                      :duration="4000"
                      :decimals="0"
                      separator=","
                      :autoplay="true"
                    />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>


      <el-row :gutter="20">
        <el-col :md="{ span: 6 }">
          <div class="table-container shadow">
            <slots-calendar></slots-calendar>
          </div>
        </el-col>
        <el-col style="margin-bottom:20px;" :md="{ span: 18 }">
          <div class="table-container shadow">
              <leave-table
                :status="null"
                @on-update="leaveForm"
                :active-tab="null"
              />
          </div>
        </el-col>
      </el-row>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="form.leave.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Request Leave"
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col>
            <label for="dates">Dates</label>
            <el-date-picker
              size="mini"
              type="daterange"
              v-model="form.leave.model.dates"
              style="width:100%;margin-top:4px;margin-bottom:10px;"
              class="form-input"
              placeholder="Range picker"
            ></el-date-picker>
            <!-- <span style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px">count:   {{ form.addSchedule.model.dates.length}}</span> -->
          </el-col>
          <el-col>
            <label for="dates">Leave Type</label>
            <el-select
              v-model="form.leave.model.leave_type"
              size="mini"
              class="form-input"
              style="width:100%;margin-top:4px;margin-bottom:10px;"
            >
              <el-option value="vacation_leave" label="Vacation leave" />
              <el-option value="leave_of_absence" label="Leave of absence" />
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="form.leave.show = false"
            >Cancel</el-button
          >
          <el-button
            type="danger"
            size="mini"
            :loading="form.leave.loading.confirm"
            @click="submitLeave"
            >Confirm</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Moment from "moment/moment";
// import tz from "moment-timezone";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import leaveTable from "./components/leaveTable";
import slotsCalendar from "@/components/SlotsCalendar";
import countTo from "vue-count-to";
// import "tui-calendar/dist/tui-calendar.css";
// import { Calendar } from "@toast-ui/vue-calendar";

// import { mkdir } from "fs";
export default {
  components: { leaveTable, slotsCalendar, countTo },
  data() {
    return {
      month: [],
      calendarLoader: true,
      vl_credits: 0,
      sl_credits: 0,
      calendar_date: null,
      calendarList: [],
      scheduleList: [],
      view: "month",
      taskView: false,
      theme: {},
      week: {
        narrowWeekend: true,
        showTimezoneCollapseButton: true,
        timezonesCollapsed: false
      },
      month: {},
      disableDblClick: true,
      isReadOnly: false,
      template: {
        monthGridHeader: function(dayModel) {
          var date = parseInt(dayModel.date.split("-")[2], 10);
          var classNames = ["tui-full-calendar-weekday-grid-date "];

          if (dayModel.isToday) {
            classNames.push("tui-full-calendar-weekday-grid-date-decorator");
          }

          return (
            '<span class="' + classNames.join(" ") + '">' + date + "</span>"
          );
        }
      },
      useCreationPopup: true,
      useDetailPopup: false,

      query: {
        limit: 10,
        offset: 0,
        // user_id: this.userDetails.id, //uncomment on production
        generated_by: null, // temporary data
        order: "desc",
        sort: "created_at"
      },
      form: {
        leave: {
          action: "create",
          show: false, // temporary value
          loading: {
            confirm: false
          },
          model: {
            user_id: null,
            dates: [],
            leave_type: null,
            status: null,
            generated_by: null,
            allowed_access: null
          }
        }
      },
      activeTab: "pending",
      tabs: [
        { label: "Pending", name: "pending" },
        { label: "Approved", name: "approved" },
        { label: "Denied", name: "denied" }
      ],
      calendar: {
        today: moment().format("YYYY-MM-DD")
      }
    };
  },
  computed: {
    ...mapGetters([
      "createLeaveState",
      "createLeaveError",
      "updateLeaveState",
      "userDetails",
      "fetchAgentCalendarState",
      "fetchAgentCalendarData",
      "fetchAgentCalendarError",
      "fetchLeaveCreditsState",
      "fetchLeaveCreditsData",
      "fetchLeaveCreditsTitle",
      "user_id",
      "position"
    ])
  },
  watch: {
    fetchLeaveCreditsState({ initial, success, fail }) {
      if (success) {
        console.log(this.fetchLeaveCreditsData);
        let tmp = this.fetchLeaveCreditsData.leave_credits,
          vl = tmp.filter(i => i.leave_type == "vacation_leave"),
          sl = tmp.filter(i => i.leave_type == "sick_leave");
        this.vl_credits = vl.length > 0 ? vl[0].value : 0;
        this.sl_credits = sl.length > 0 ? sl[0].value : 0;
      }
      if (fail) {
        this.$message({
          type: "warning",
          message: this.fetchLeaveCreditsTitle,
          duration: 5000
        });
      }
    },
    calendar_date(v) {
      this.fetchAgentCalendar({
        userid: this.user_id,
        start: moment(v)
          .startOf("month")
          .format("YYYY-MM-DD"),
        end: moment(v)
          .endOf("month")
          .format("YYYY-MM-DD")
      });
    },
    fetchAgentCalendarState({ initial, success, fail }) {
      if (initial) {
        // alert("initializing..")
        // this.$refs.tuiCalendar.invoke('clear');
        this.calendarLoader = true;
      }
      if (success) {
        // console.log();
        this.calendarLoader = false;
        let schedules = this.fetchAgentCalendarData.agent_schedules[0].schedule;
        this.scheduleList = schedules.map(i => ({
          body: "something",
          id: i.id,
          title: i.leave_id
            ? "ON LEAVE *" +
              i.title.title +
              "(" +
              moment(i.start_event.date).format("HH:mm") +
              " - " +
              moment(i.end_event.date).format("HH:mm") +
              ")"
            : i.title.title +
              "(" +
              moment(i.start_event.date).format("HH:mm") +
              " - " +
              moment(i.end_event.date).format("HH:mm") +
              ")",
          start: moment(i.start_event.date).format("YYYY-MM-DD HH:mm:ss"),
          end: moment(i.end_event.date).format("YYYY-MM-DD HH:mm:ss"),
          category: "time",
          bgColor: i.title.color
        }));
        this.$refs.tuiCalendar.invoke("createSchedules", [
          this.scheduleList,
          true
        ]);
        this.$refs.tuiCalendar.invoke("render");
      }
      if (fail) {
        this.calendarLoader = false;
        this.scheduleList = [];
        this.$message({
          type: "warning",
          message: "There's a problem fetching your calendar events.",
          duration: 5000
        });
      }
    },
    createLeaveState({ initial, success, fail }) {
      if (initial) {
        this.form.leave.loading.confirm = true;
      }
      if (success) {
        this.form.leave.loading.confirm = false;
        this.form.leave.show = false;
        this.$message({
          message: "You have successfully added a leave request.",
          type: "success",
          duration: 1000 * 5
        });
        this.fetchLeave(this.query);
      }
      if (fail) {
        this.form.leave.loading.confirm = false;
        this.$message({
          message: this.createLeaveError,
          type: "error",
          duration: 1000 * 5
        });
      }
    },
    updateLeaveState({ initial, success, fail }) {
      if (initial) {
        this.form.leave.loading.confirm = true;
      }
      if (success) {
        this.form.leave.loading.confirm = false;
        this.form.leave.show = false;
        this.$message({
          message: "You have successfully updated a leave request.",
          type: "success",
          duration: 1000 * 5
        });
        this.fetchLeave(this.query);
      }
      if (fail) {
        this.form.leave.loading.confirm = false;
        this.$message({
          message: "Oops! There's a problem processing your request.",
          type: "error",
          duration: 1000 * 5
        });
      }
    }
  },
  mounted() {
    // console.log(moment.tz.names());
    // console.log("PHT " + moment().format("YYYY-MM-DD HH:mm:ss"));
    // console.log(
    //   "PST " +
    //     moment()
    //       .tz("US/Pacific")
    //       .format("YYYY-MM-DD HH:mm:ss")
    // );
    console.log(this.month);
    this.query.generated_by = this.user_id;
    // this.getDate();
    // this.fetchAgentCalendar({
    //   userid: this.user_id,
    //   start: moment(this.calendar_date)
    //     .startOf("month")
    //     .format("YYYY-MM-DD"),
    //   end: moment(this.calendar_date)
    //     .endOf("month")
    //     .format("YYYY-MM-DD")
    // });
    this.fetchLeaveCredits({ user_id: this.user_id });
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      let no_days = moment(row.end).diff(moment(row.start), "days");
      if (no_days > 0) {
        let istart = parseInt(row.start.split("-")[2]),
          iend = parseInt(row.end.split("-")[2]);
        // console.log(istart + "-" + iend);
        if (columnIndex == istart - 1) {
          return [1, 1 + no_days];
        }
      }
    },
    ...mapActions([
      "createLeave",
      "updateLeave",
      "fetchLeave",
      "fetchAgentCalendar",
      "fetchLeaveCredits"
    ]),
    getDate() {
      this.calendar_date = this.formatDate(
        this.$refs.tuiCalendar.invoke("getDate")._date,
        "",
        "YYYY MMMM"
      );
    },
    today() {
      this.$refs.tuiCalendar.invoke("today");
      this.getDate();
    },
    next() {
      this.$refs.tuiCalendar.invoke("next");
      this.getDate();
    },
    prev() {
      this.$refs.tuiCalendar.invoke("prev");
      this.getDate();
    },
    submitLeave() {
      this.form.leave.loading.confirm = true;
      if (this.form.leave.action == "create") {
        if (this.checkFields() && this.checkIfDateIsBefore()) {
          const data = {
            user_id: this.user_id,
            start_event: moment(this.form.leave.model.dates[0])
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            end_event: moment(this.form.leave.model.dates[1])
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            leave_type: this.form.leave.model.leave_type,
            status: "pending",
            generated_by: this.userDetails.id,
            allowed_access: 15
          };
          this.createLeave(data);
        }
      } else if (this.form.leave.action == "update") {
        if (
          this.checkFields() &&
          this.checkIfDateIsBefore() &&
          this.checkIfPending()
        ) {
          const data = {
            id: this.form.leave.model.id,
            start_event: moment(this.form.leave.model.dates[0])
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            end_event: moment(this.form.leave.model.dates[1])
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            leave_type: this.form.leave.model.leave_type
          };
          this.updateLeave(data);
        }
      }
      this.form.leave.loading.confirm = false;
    },
    checkIfPending() {
      let result = false;
      if (this.form.leave.model.status == "pending") {
        result = true;
      } else {
        result = false;
        this.$message({
          message: "Oops! Delete and update for this request is not allowed.",
          type: "warning",
          duration: 1000 * 5
        });
      }
      return result;
    },
    checkIfDateIsBefore() {
      let result = false;
      if (
        !moment(this.form.leave.model.dates[0], "YYYY-MM-DD").isBefore(moment())
      ) {
        result = true;
      } else {
        result = false;
        this.$message({
          message: "Oops! Please select future dates.",
          type: "warning",
          duration: 1000 * 5
        });
      }
      return result;
    },
    checkFields() {
      let result = false;
      if (
        !Object.keys(this.form.leave.model.dates).length == false &&
        this.form.leave.model.leave_type != null
      ) {
        result = true;
      } else {
        result = false;
        this.$message({
          message: "Please fill all fields.",
          type: "primary",
          duration: 1000 * 5
        });
      }
      return result;
    },
    leaveForm(data) {
      this.form.leave.show = true;
      this.clearForm();
      this.form.leave.action = data.action;
      if (data.action == "create") {
        // alert("create");
      } else if (data.action == "update") {
        // update only if leave is before current date
        this.fillForm(data);
      }
    },
    clearForm() {
      this.form.leave.model = {
        user_id: null,
        dates: [],
        leave_type: null,
        status: null,
        generated_by: this.user_id,
        allowed_access: null
      };
    },
    fillForm(data) {
      this.form.leave.model = {
        user_id: data.user_id,
        dates: [data.start_event, data.end_event],
        leave_type: data.leave_type,
        id: data.id
      };
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

.monday >>> th {
  background-color: white !important;
  border-top: none;
  border-right: none;
  border-left: none;
}

.monday >>> th >>> .cell {
  font-weight: light !important;
}
.monday >>> td:first-child {
  border-left:5px solid crimson;
}
.monday >>> .el-table__row tr {
  background-color: #efefef;
  border-left: white solid 1px;
  border-bottom: white solid 1px;
  padding: 0px;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.monday >>> td {
  background-color: #efefef;
  border: white solid 1px;
  padding: 0px;
}
.monday >>> .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.monday >>> td {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

th >>> .cell {
  font-weight: normal !important;
  font-size: 0.8em !important;
}
</style>
