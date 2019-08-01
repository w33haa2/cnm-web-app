<template>
  <div class="app-container">
    <h4 style="color:#646464">
      Agent Schedule
      <small
        style="font-weight:lighter"
      >{{ "("+ formatDate(week.start,"YYYY-MM-DD","MMM Do")+ " - "+ formatDate(week.end,"YYYY-MM-DD","MMM Do") + ")" }}</small>
    </h4>

    <!-- <el-row>
      <el-col :md="{span:12}"></el-col>
      <el-col :md="{span:12}">
        <div style="float:right">
          <el-select size="mini" v-model="filter.by">
            <el-option value="all" label="All" />
            <el-option value="team_leader" label="Team Leader" />
            <el-option value="operations_manager" label="Operations Manager" />
          </el-select>
          <el-select size="mini" :disabled="filter.by=='all'">
            <el-option
              v-for="(item,index) in filter.options"
              :key="index"
              :value="item.id"
              :label="item.full_name"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>-->

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
        <el-button size="mini">Add Schedule</el-button>
        <el-button size="mini">Add Leave</el-button>
        <el-dropdown>
          <el-button type="success" :plain="true" size="mini">
            Excel<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Import Schedule</el-dropdown-item>
            <el-dropdown-item>Export Week Report</el-dropdown-item>
            <el-dropdown-item>Export Month Report</el-dropdown-item>
            <!-- <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div style="float:right">
          <el-select size="mini" v-model="filter.by">
            <el-option value="all" label="All" />
            <el-option value="team_leader" label="Team Leader" />
            <el-option value="operations_manager" label="Operations Manager" />
          </el-select>
          <el-select size="mini" :disabled="filter.by=='all'">
            <el-option
              v-for="(item,index) in filter.options"
              :key="index"
              :value="item.id"
              :label="item.full_name"
            />
          </el-select>
        </div>-->
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="{span:8}" style="margin-top:20px;">
        <el-input v-model="agent_search" size="mini" placeholder="Agent Search" />
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
                <img v-if="scope.row.image" class="img-circle" :src="scope.row.image">
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
              <cell-content
                :schedule="plotSchedulePerDay(row.schedule,tableHeader[0].date)"
                :date="tableHeader[0].date"
              />
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
              <cell-content
                :schedule="plotSchedulePerDay(row.schedule,tableHeader[1].date)"
                :date="tableHeader[1].date"
              />
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
              <cell-content
                :schedule="plotSchedulePerDay(row.schedule,tableHeader[2].date)"
                :date="tableHeader[2].date"
              />
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
              <cell-content
                :schedule="plotSchedulePerDay(row.schedule,tableHeader[3].date)"
                :date="tableHeader[3].date"
              />
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
              <cell-content
                :schedule="plotSchedulePerDay(row.schedule,tableHeader[4].date)"
                :date="tableHeader[4].date"
              />
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
              <cell-content
                :schedule="plotSchedulePerDay(row.schedule,tableHeader[5].date)"
                :date="tableHeader[5].date"
              />
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
              <cell-content
                :schedule="plotSchedulePerDay(row.schedule,tableHeader[6].date)"
                :date="tableHeader[6].date"
              />
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
    >
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="form.addSchedule.show=false">Cancel</el-button>
        <el-button type="danger" size="mini" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Moment from 'moment/moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
// components
import cellContent from './components/cellContent'
export default {
  components: { cellContent },
  computed: {
    ...mapGetters(['agentsWorkReports', 'agentsWorkReportsfetchState'])
  },
  watch: {
    agentsWorkReportsfetchState({ initial, success, fail }) {
      if (success) {
        this.tableData = this.agentsWorkReports.agent_schedules
      }
      if (fail) {
        this.tableData = []
      }
    }
  },
  mounted() {
    this.weekChange(
      moment()
        // .subtract(7, "days")
        .startOf('isoweek')
        .format('YYYY-MM-DD')
    )
  },
  data() {
    return {
      form: {
        addSchedule: {
          show: false,
          model: {}
        }
      },
      filter: {
        by: 'all',
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
        type: 'Create',
        selections: []
      }
    }
  },
  methods: {
    ...mapActions(['fetchAgentsWorkReports']),
    weekChange(e) {
      const start = moment(e)
        .startOf('isoweek')
        .format('YYYY-MM-DD')
      const end = moment(e)
        .endOf('isoweek')
        .format('YYYY-MM-DD')
      this.week.start = start
      this.week.end = end
      this.generateHeader(start, end)
    },
    generateHeader(start, end) {
      const range = moment.range(start, end)
      const dates = Array.from(range.by('day')).map(m => m.format('YYYY-MM-DD'))

      this.tableHeader = dates.map(d => ({
        day: moment(d).format('ddd'),
        date: moment(d).format('YYYY-MM-DD'),
        date1: moment(d).format('MMM Do')
      }))
      const data = {
        limit: this.query.limit,
        offset: this.query.offset,
        start: this.week.start,
        end: this.week.end
      }
      this.fetchAgentsWorkReports({ data })
    },
    tableSizeChange(value) {
      this.query.limit = value
      this.query.offset = 0
      const data = {
        limit: this.query.limit,
        offset: this.query.offset,
        start: this.week.start,
        end: this.week.end
      }
      this.fetchAgentsWorkReports({ data })
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit
      const data = {
        limit: this.query.limit,
        offset: this.query.offset,
        start: this.week.start,
        end: this.week.end
      }
      this.fetchAgentsWorkReports({ data })
    },
    plotSchedulePerDay(schedules, date) {
      const schedule = schedules.filter(
        i => moment(i.start_event).format('YYYY-MM-DD') == date
      )[0]
      // if (typeof schedule == "object") {
      //   alert(schedule.start_event);
      //   alert(date);
      // }
      return schedule
    },
    dateToday(date) {
      if (moment(date).isSame(moment().format('YYYY-MM-DD'))) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
