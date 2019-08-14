<template>
  <div class="app-container">
    <h4 style="color:#646464">Agent Leave</h4>
    <el-row>
      <el-col :md="{span:12}">
        <div>
          <span style="font-weight:900">VL CREDITS:</span>
        </div>
      </el-col>
      <el-col style="margin-bottom:20px;" :md="{span:12}">
        <el-button
          size="mini"
          @click="leaveForm({action:'create'})"
          style="float:right"
        >Create Request</el-button>
      </el-col>
      <!-- <el-col :md="{span:6}">
        <el-calendar v-model="calendar.today"></el-calendar>
      </el-col>-->
      <el-col :md="{span:6}">
        <el-row>
          <el-col>
            <div style="margin-bottom:10px;">
              <el-button
                size="mini"
                type="danger"
                round
                :plain="true"
                @click="today()"
                style="margin:0px;"
              >Today</el-button>
              <el-button
                size="mini"
                type="danger"
                circle
                :plain="true"
                @click="prev()"
                style="margin:0px;"
              >
                <i class="el-icon-arrow-left" />
              </el-button>
              <el-button
                size="mini"
                type="danger"
                circle
                :plain="true"
                @click="next()"
                style="margin:0px;"
              >
                <i class="el-icon-arrow-right" />
              </el-button>
              <span style="float:right;height:auto;line-height:30px">{{ calendar_date }}</span>
            </div>
          </el-col>
        </el-row>
        <calendar
          ref="tuiCalendar"
          style="height:50vh"
          :calendars="calendarList"
          :schedules="scheduleList"
          :view="view"
          :taskView="taskView"
          :scheduleView="scheduleView"
          :theme="theme"
          :week="week"
          :month="month"
          :timezones="timezones"
          :disableDblClick="disableDblClick"
          :isReadOnly="isReadOnly"
          :useCreationPopup="useCreationPopup"
          :useDetailPopup="useDetailPopup"
        />
        <!-- <calendar :view="'month'" style="height:800px"/> -->
      </el-col>
      <el-col :md="{span:18}" style="padding-left: 20px">
        <leave-table :status="null" @on-update="leaveForm" :active-tab="null" />
      </el-col>
    </el-row>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.leave.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Add Leave"
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
        <el-button size="mini" @click="form.leave.show=false">Cancel</el-button>
        <el-button
          type="danger"
          size="mini"
          :loading="form.leave.loading.confirm"
          @click="submitLeave"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import leaveTable from "./components/leaveTable";
import "tui-calendar/dist/tui-calendar.css";
import { Calendar } from "@toast-ui/vue-calendar";
export default {
  components: { leaveTable, Calendar },
  data() {
    return {
      calendar_date: null,
      calendarList: [
        // {
        //   id: "0",
        //   name: "home"
        // },
        // {
        //   id: "1",
        //   name: "office"
        // }
      ],
      scheduleList: [
        {
          id: "1",
          calendarId: "1",
          title: "my schedule",
          category: "time",
          dueDateClass: "",
          start: "2019-08-18T22:30:00+09:00",
          end: "2019-08-19T02:30:00+09:00"
        },
        {
          id: "2",
          calendarId: "1",
          title: "second schedule",
          category: "time",
          dueDateClass: "",
          start: "2019-08-18T17:30:00+09:00",
          end: "2019-08-19T17:31:00+09:00"
        }
      ],
      view: "month",
      taskView: false,
      theme: {
        "month.dayname.height": "30px",
        "month.dayname.borderLeft": "1px solid #ff0000",
        "month.dayname.textAlign": "center",
        "week.today.color": "#333",
        "week.daygridLeft.width": "100px",
        "week.timegridLeft.width": "100px"
      },
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
        user_id: 7, // temporary data
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
  mounted() {
    this.getDate();
  },
  computed: {
    ...mapGetters(["createLeaveState", "updateLeaveState", "userDetails"])
  },
  watch: {
    createLeaveState({ initial, success, fail }) {
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
          message: "Oops! There's a problem processing your request.",
          type: "error",
          duration: 1000 * 5
        });
      }
    },
    updateLeaveState({ initial, success, fail }) {
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
  methods: {
    ...mapActions(["createLeave", "updateLeave", "fetchLeave"]),
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
            user_id: 7,
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
        generated_by: null,
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

<style lang="scss">
.is-today {
  font-weight: 600;
}
.el-calendar__title {
  width: 100% !important;
  font-size: 0.8em;
}
.el-calendar__button-group {
  button {
    width: 100%;
  }
}
.el-calendar-day {
  padding: 8px !important;
  height: auto !important;
  width: auto !important;
}
.el-calendar-table {
  thead {
    th {
      font-size: 0.8em;
    }
  }
}
.hide-picker-input {
}
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.is-selected {
  color: #1989fa;
}
.list {
  height: 85%;
  overflow-y: scroll;

  ul {
    margin: 0;
    padding: 0;
    li {
      padding: 10px;
      border-bottom: #eeeeee solid 1px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
