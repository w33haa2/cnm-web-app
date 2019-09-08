<template>
  <div>
    <div class="app-container">
      <h4 style="color:#646464">
        Agent Schedule
        <small
          style="font-weight:lighter"
        >{{ "("+ formatDate(week.start,"YYYY-MM-DD","MMM Do")+ " - "+ formatDate(week.end,"YYYY-MM-DD","MMM Do") + ")" }}</small>
      </h4>

      <el-row style="margin-top:10px;">
        <el-col :md="{span:12}">
          <el-date-picker
            v-model="week.start"
            size="mini"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{firstDayOfWeek:1}"
            :clearable="false"
            @change="weekChange"
          />
        </el-col>
        <el-col :md="{span:12}">
          <div style="float:right">
            <el-button-group>
              <el-button size="mini" @click="showModal('addSchedule')">Add Schedule</el-button>
              <el-button size="mini" @click="showModal('addLeave')">Add Leave</el-button>
            </el-button-group>
            <el-dropdown>
              <el-button type="success" :plain="true" size="mini">
                Excel
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Import Schedule</el-dropdown-item>
                <el-dropdown-item>Export Week Report</el-dropdown-item>
                <el-dropdown-item>Export Month Report</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="{span:8}" style="margin-top:20px;">
          <el-input v-model="searchQuery" size="mini" placeholder="Agent Search" />
        </el-col>
        <el-col :md="{span:16}" style="margin-top:20px;">
          <el-pagination
            style="float:right"
            :page-sizes="[10, 25, 50]"
            :page-size="query.limit"
            :current-page.sync="table_config.page"
            layout="total, sizes, prev, pager, next"
            :total="agentsWorkReports.count"
            background
            small
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top:10px;">
        <!-- CALENDAR VIEW -->

        <!-- <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" :xl="{span:6}">
        <el-row>
          <el-col :md="{span:24}">
            <div class="user-profile">
              <div class="box-center">
                <pan-thumb
                  :image="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'"
                  :height="'100px'"
                  :width="'100px'"
                  :hoverable="false"
                >{{ "POSITION" }}</pan-thumb>
              </div>
              <div class="box-center">
                <div class="user-name text-center">{{ "FULLNAME" }}</div>
                <div class="user-role text-center text-muted">{{ "POSITION" }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:18}" :lg="{span:18}" :xl="{span:18}">
       <calendar-view :show-date="showDate" :events="calendar.data">
          <calendar-view-header
            slot="header"
            slot-scope="t"
            :header-props="t.headerProps"
            @input="setShowDate"
          />
        </calendar-view>
        </el-col>-->

        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}">
          <el-table v-loading="agentsWorkReportsfetchState.initial" :data="tableData">
            <el-table-column label="Employee" min-width="300" prop="full_name" fixed>
              <template slot="header">
                <span style="float:left">
                  <h4 class="text-muted">Employee</h4>
                </span>
              </template>
              <template slot-scope="scope">
                <div class="user-block">
                  <img v-if="scope.row.image" class="img-circle" :src="scope.row.image" />
                  <div
                    v-else
                    class="img-circle text-muted"
                    style="background-color:#d9d9d9;display:flex"
                  >
                    <div
                      style="align-self:center;width:100%;text-align:center;"
                      class="text-point-eight-em"
                    >{{ getAvatarLetters(scope.row.info.firstname,scope.row.info.lastname) }}</div>
                  </div>
                  <span>
                    <span class="el-dropdown-link" style="font-weight:600">{{ scope.row.full_name }}</span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[0].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[0].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[0].date)?'today-header':'']"
                >{{ tableHeader[0].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[0].date)">
                  <cell-content
                  :key="index"
                  :schedule="plotSchedulePerDay(row.schedule,tableHeader[0].date)[index]"
                  :date="tableHeader[0].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[1].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[1].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[1].date)?'today-header':'']"
                >{{ tableHeader[1].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[1].date)">
                  <cell-content
                  :key="index"
                  :schedule="plotSchedulePerDay(row.schedule,tableHeader[1].date)[index]"
                  :date="tableHeader[1].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[2].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[2].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[2].date)?'today-header':'']"
                >{{ tableHeader[2].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[2].date)">
                  <cell-content
                  :key="index"
                  :schedule="plotSchedulePerDay(row.schedule,tableHeader[2].date)[index]"
                  :date="tableHeader[2].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[3].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[3].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[3].date)?'today-header':'']"
                >{{ tableHeader[3].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[3].date)">
                  <cell-content
                  :key="index"
                  :schedule="plotSchedulePerDay(row.schedule,tableHeader[3].date)[index]"
                  :date="tableHeader[3].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[4].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[4].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[4].date)?'today-header':'']"
                >{{ tableHeader[4].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[4].date)">
                  <cell-content
                  :key="index"
                  :schedule="plotSchedulePerDay(row.schedule,tableHeader[4].date)[index]"
                  :date="tableHeader[4].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[5].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[5].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[5].date)?'today-header':'']"
                >{{ tableHeader[5].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[5].date)">
                  <cell-content
                  :key="index"
                  :schedule="plotSchedulePerDay(row.schedule,tableHeader[5].date)[index]"
                  :date="tableHeader[5].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <h4
                  :class="[dateToday(tableHeader[6].date)?'today-header':'']"
                  style="margin-bottom:5px"
                >{{ tableHeader[6].day }}</h4>
                <span
                  :class="[dateToday(tableHeader[6].date)?'today-header':'']"
                >{{ tableHeader[6].date1 }}</span>
              </template>
              <template slot-scope="{row}">

                <template v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[6].date)">
                  <cell-content
                  :key="index"
                  :schedule="plotSchedulePerDay(row.schedule,tableHeader[6].date)[index]"
                  :date="tableHeader[6].date"
                  :info="row.info"
                />
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="form.addSchedule.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Add Schedule"
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col>
            <label for="dates">Dates</label>
            <el-date-picker
              v-model="form.addSchedule.model.dates"
              size="mini"
              type="dates"
              style="width:100%;padding-bottom:2px"
              class="form-input"
            />
            <span
              style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px"
            >count: {{ form.addSchedule.model.dates.length }}</span>
          </el-col>
          <el-col>
            <label for="dates">Time in</label>
            <el-time-picker
              v-model="form.addSchedule.model.time_in"
              size="mini"
              style="width:100%"
              class="form-input"
            />
          </el-col>
          <el-col>
            <label for="dates">Duration</label>
            <el-time-picker
              v-model="form.addSchedule.model.duration"
              size="mini"
              style="width:100%;padding-bottom:2px"
              class="form-input"
            />
            <el-alert
              type="info"
              title="Time out will be automatically formulated based on the duration"
              style="margin-bottom:10px"
            />
          </el-col>
          <el-col>
            <label for="dates">Agents</label>
            <el-select
              v-model="form.addSchedule.model.agents"
              class="form-input"
              style="width:100%;padding-bottom:2px"
              size="mini"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Agents..."
              :remote-method="remoteAgent"
              :loading="loading"
            >
              <el-option
                v-for="item in agents.agents"
                :key="item.id"
                :label="item.full_name"
                :value="item.id"
              />
            </el-select>
            <span
              style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px;"
            >count: {{ form.addSchedule.model.agents.length }}</span>
          </el-col>
          <el-col>
            <label for="dates">Team Leader</label>
            <el-select
              v-model="form.addSchedule.model.teamleader"
              class="form-input"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              size="mini"
              filterable
              remote
              reserve-keyword
              placeholder="Select"
            >
              <el-option
                v-for="item in agents.agents"
                :key="item.id"
                :label="item.full_name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col>
            <label for="dates">Operations Manager</label>
            <el-select
              v-model="form.addSchedule.model.teamleader"
              style="width:100%;padding-bottom:2px"
              class="form-input"
              size="mini"
              filterable
              remote
              reserve-keyword
              placeholder="Select"
              :remote-method="remoteTeamLeader"
              :loading="loading"
            >
              <el-option
                v-for="item in agents.agents"
                :key="item.id"
                :label="item.full_name"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="form.addSchedule.show=false">Cancel</el-button>
          <el-button type="danger" size="mini" @click="onSubmit">Confirm</el-button>
        </span>
      </el-dialog>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="form.addLeave.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Add Leave"
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col>
            <el-col>
              <label for="dates">Agent</label>
              <el-select
                v-model="form.addLeave.model.user_id"
                class="form-input"
                style="width:100%;padding-bottom:2px;margin-bottom:10px"
                size="mini"
                filterable
                remote
                reserve-keyword
                placeholder="Agent..."
                :remote-method="remoteAgent"
                :loading="loading"
              >
                <el-option
                  v-for="item in agents.agents"
                  :key="item.id"
                  :label="item.full_name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <label for="dates">Dates</label>
            <el-date-picker
              v-model="form.addLeave.model.dates"
              size="mini"
              type="daterange"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              class="form-input"
              placeholder="Range picker"
            />
          </el-col>
          <el-col>
            <label for="dates">Leave Type</label>
            <el-select
              v-model="form.addLeave.leave_type"
              size="mini"
              class="form-input"
              style="width:100%;margin-bottom:10px;"
            >
              <el-option value="maternity_leave" label="Maternity" />
              <el-option value="paternity_leave" label="Paternity" />
              <el-option value="bereavement_leave" label="Bereavement" />
              <el-option value="vawc" label="VAWC" />
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="form.addLeave.show=false">Cancel</el-button>
          <el-button type="danger" size="mini" @click="onSubmit">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import cellContent from "./components/cellContent";
export default {
  components: { cellContent },
  computed: {
    ...mapGetters([
      "agentsWorkReports",
      "agentsWorkReportsfetchState",
      "agents",
      "agentsfetchState"
    ])
  },
  watch: {
    searchQuery(v) {
      if (v != "") {
        this.query["target[]"] = "full_name";
        this.query.query = v;
        this.weekChange(
          moment()
            // .subtract(7, "days")
            .startOf("isoweek")
            .format("YYYY-MM-DD")
        );
      } else {
        delete this.query["target[]"];
        delete this.query.query;
        this.weekChange(
          moment()
            // .subtract(7, "days")
            .startOf("isoweek")
            .format("YYYY-MM-DD")
        );
      }
    },
    agentsWorkReportsfetchState({ initial, success, fail }) {
      if (success) {
        this.tableData = this.agentsWorkReports.agent_schedules;
      }
      if (fail) {
        this.tableData = [];
      }
    }
  },
  mounted() {
    this.weekChange(
      moment()
        // .subtract(7, "days")
        .startOf("isoweek")
        .format("YYYY-MM-DD")
    );
  },
  data() {
    return {
      searchQuery: "",
      form: {
        addSchedule: {
          show: false, // temporary value
          model: {
            dates: [],
            time_in: null,
            duration: null,
            agents: [],
            teamleader: null
          }
        },
        addLeave: {
          show: false, // temporary value
          model: {
            user_id: null,
            dates: {},
            leave_type: null,
            status: null,
            generated_by: null,
            allowed_access: null
          }
        }
      },
      filter: {
        by: "all",
        options: []
      },
      week: {
        start: null,
        end: null
      },
      fetchData: [],
      tableHeader: [],
      tableData: [],
      query: {
        offset: 0,
        limit: 10
      },
      table_config: {
        page: 1
      },
      action: {
        type: "Create",
        selections: []
      }
    };
  },
  methods: {
    ...mapActions([
      "fetchAgentsWorkReports",
      "fetchAgents",
      "createBulkSchedule"
    ]),
    showModal(type) {
      this.form[type].show = true;
    },
    weekChange(e) {
      const start = moment(e)
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      const end = moment(e)
        .endOf("isoweek")
        .format("YYYY-MM-DD");
      this.week.start = start;
      this.week.end = end;
      this.generateHeader(start, end);
    },
    generateHeader(start, end) {
      const range = moment.range(start, end);
      const dates = Array.from(range.by("day")).map(m =>
        m.format("YYYY-MM-DD")
      );

      this.tableHeader = dates.map(d => ({
        day: moment(d).format("ddd"),
        date: moment(d).format("YYYY-MM-DD"),
        date1: moment(d).format("MMM Do")
      }));
      const data = {
        limit: this.query.limit,
        offset: this.query.offset,
        start: this.week.start,
        end: this.week.end
      };
      if (this.searchQuery != "") {
        data["target[]"] = "full_name";
        data.query = this.searchQuery;
      }
      this.fetchAgentsWorkReports({ data });
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.query.offset = 0;
      const data = {
        limit: this.query.limit,
        offset: this.query.offset,
        start: this.week.start,
        end: this.week.end
      };
      this.fetchAgentsWorkReports({ data });
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = {
        limit: this.query.limit,
        offset: this.query.offset,
        start: this.week.start,
        end: this.week.end
      };
      this.fetchAgentsWorkReports({ data });
    },
    plotSchedulePerDay(schedules, date) {
      const schedule = schedules.filter(
        i => moment(i.start_event.date).format("YYYY-MM-DD") == date
      );

      // ..sort((a, b) => {
      //       let v1 = moment(a.start_event).format("YYYY-MM-DD HH:mm:ss"),
      //         v2 = moment(b.start_event).format("YYYY-MM-DD HH:mm:ss");
      //       let compare = 0;
      //       if (v1 > v2) {
      //         compare = 1;
      //       } else if (v1 < v2) {
      //         compare = -1;
      //       }
      //       return compare;
      //     });

      // if (typeof schedule == "object") {
      //   alert(schedule.start_event);
      //   alert(date);
      // }
      // alert("console");
      // console.log(schedule);
      if(schedule.length==0){
        return [{}];
      }else{
        return schedule;
      }
    },
    onSubmit() {
      this.createBulkSchedule();
    },
    dateToday(date) {
      if (moment(date).isSame(moment().format("YYYY-MM-DD"))) {
        return true;
      } else {
        return false;
      }
    },
    remoteAgent(query) {
      const data = {};
      if (query !== "") {
        data["target[]"] = "full_name";
        data.query = query;
        this.fetchAgents({ data });
      } else {
        data["target[]"] = "";
        data.query = "";
        this.fetchAgents({ data });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-input {
  padding-top: 5px;
  padding-bottom: 10px;
}
.overTimeWork {
  background-color: rgb(209, 87, 209);
}
.regularWork {
  background-color: rgb(209, 87, 87);
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
.cv-wrapper {
  .cv-header {
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #f0f0f0;
  }
  .cv-header-days {
  }
  .cv-weeks {
    .cv-week {
      min-height: 10em;
    }
  }
}
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-block {
  .username,
  .description {
    display: block;
    margin-left: 50px;
    padding: 2px 0;
  }
  .username {
    // font-size: 0.8em;
    color: #777;
  }
  :after {
    clear: both;
  }
  .img-circle {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    float: left;
  }
  span {
    font-weight: 500;
    margin-left: 10px;
    // font-size: 0.8em;
  }
}

.today-header {
  color: #86c5ff;
}
</style>
