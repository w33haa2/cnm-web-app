<template>
  <div>
    <div>
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
    </div>
    <calendar
      ref="tuiCalendar"
      style="height:500px;"
      :schedules="scheduleList"
      :view="view"
      :taskView="taskView"
      :scheduleView="scheduleView"
      :theme="theme"
      :week="week"
      :month="month"
      :timezones="timezones"
      :disableDblClick="true"
      :isReadOnly="true"
      :useCreationPopup="false"
      :useDetailPopup="useDetailPopup"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import "tui-calendar/dist/tui-calendar.css";
import { Calendar } from "@toast-ui/vue-calendar";
import moment from "moment";
export default {
  name: "agentCalendar",
  components: { Calendar },
  props: ["agent-id"],
  mounted() {
    this.getDate();
    this.fetchAgentCalendar({
      userid: this.user_id,
      start: moment(this.calendar_date)
        .startOf("month")
        .format("YYYY-MM-DD"),
      end: moment(this.calendar_date)
        .endOf("month")
        .format("YYYY-MM-DD")
    });
  },
  computed: {
    ...mapGetters([
      "fetchAgentCalendarState",
      "fetchAgentCalendarData",
      "fetchAgentCalendarError",
      "user_id"
    ])
  },
  watch: {
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
      }
      if (success) {
        console.log();
        let schedules = this.fetchAgentCalendarData.agent_schedules[0].schedule;
        this.scheduleList = schedules.map(i => ({
          body: "something",
          id: i.id,
          title:
            i.title.title +
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
    }
  },
  methods: {
    ...mapActions(["fetchAgentCalendar"]),
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
    }
  },
  data() {
    return {
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
      calendar: {
        today: moment().format("YYYY-MM-DD")
      }
    };
  }
};
</script>

<style>
</style>