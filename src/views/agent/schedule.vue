<template>
  <div class="app-container">
    <h4 style="color:#646464">
      Agent Schedule
      <small
        style="font-weight:lighter"
      >{{"("+ formatDate(week.start,"YYYY-MM-DD","MMM Do")+ " - "+ formatDate(week.end,"YYYY-MM-DD","MMM Do") + ")" }}</small>
    </h4>

    <!-- Search and Pagination -->
    <!-- <el-row>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="400"
          background
          small
        ></el-pagination>
      </el-col>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
    </el-row>-->
    <!-- <el-radio-group v-model="action.type" size="mini">
      <el-radio-button type="primary" label="Create" />
      <el-radio-button type="primary" label="Update" />
      <el-radio-button type="primary" label="Delete" />
    </el-radio-group>-->
    <!-- <el-button :plain="true" size="mini">Schedule</el-button> -->
    <el-row>
      <el-col :md="{span:12}">
        <el-date-picker
          size="mini"
          v-model="week.start"
          type="week"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="{firstDayOfWeek:1}"
          @change="weekChange"
          :clearable="false"
        ></el-date-picker>
      </el-col>
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
    </el-row>

    <el-row style="margin-top:10px;">
      <el-col :md="{span:12}">
        <el-button size="mini">Add Schedule</el-button>
      </el-col>
      <el-col :md="{span:12}">
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
        <el-table :data="tableData">
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
                  >{{ getAvatarLetters(scope.row.fname,scope.row.lname) }}</div>
                </div>
                <span>
                  <span class="el-dropdown-link" style="font-weight:600">{{ scope.row.full_name }}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <h4>{{ tableHeader[0].day }}</h4>
              <span>{{ tableHeader[0].date1 }}</span>
            </template>
            <template slot-scope="{row}">
              <el-tag type="success">PRESENT</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <h4>{{ tableHeader[1].day }}</h4>
              <span>{{ tableHeader[1].date1 }}</span>
            </template>
            <template slot-scope="{row}">
              <el-tag type="danger">NCNS</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <h4>{{ tableHeader[2].day }}</h4>
              <span>{{ tableHeader[2].date1 }}</span>
            </template>
            <template slot-scope="{row}">
              <el-popover width="300" trigger="click">
                <el-row style="padding:3px;">
                  <el-col :md="{span:8}" style="font-weight:600">Name</el-col>
                  <el-col :md="{span:16}">Emmanuel JamesLajom</el-col>
                </el-row>
                <el-row style="padding:3px;">
                  <el-col :md="{span:8}" style="font-weight:600">Schedule</el-col>
                  <el-col :md="{span:16}">10:00AM to 10:00PM</el-col>
                </el-row>
                <el-row style="padding:3px;">
                  <el-col :md="{span:8}" style="font-weight:600">Log</el-col>
                  <el-col :md="{span:16}">10:00AM to 10:00PM</el-col>
                </el-row>
                <el-row style="padding:3px;">
                  <el-col :md="{span:8}" style="font-weight:600">Attendance</el-col>
                  <el-col :md="{span:16}">On Leave</el-col>
                </el-row>
                <el-tag type="warning" slot="reference">LEAVE</el-tag>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <h4>{{ tableHeader[3].day }}</h4>
              <span>{{ tableHeader[3].date1 }}</span>
            </template>
            <template slot-scope="{row}">
              <el-tag type="info" effect="dark">ABSENT</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <h4>{{ tableHeader[4].day }}</h4>
              <span>{{ tableHeader[4].date1 }}</span>
            </template>
            <template slot-scope="{row}">
              <el-tag type="info">OFF</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <h4>{{ tableHeader[5].day }}</h4>
              <span>{{ tableHeader[5].date1 }}</span>
            </template>
            <template slot-scope="{row}">
              <span class></span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <h4>{{ tableHeader[6].day }}</h4>
              <span>{{ tableHeader[6].date1 }}</span>
            </template>
            <template slot-scope="{row}">
              <span class></span>
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
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
export default {
  components: {},
  mounted() {
    this.weekChange(
      moment()
        .startOf("isoweek")
        .format("YYYY-MM-DD")
    );
  },
  data() {
    return {
      form: {
        addSchedule: {
          show: true,
          model:{

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
      tableData: [
        {
          id: 1,
          image: null,
          full_name: "Emmanuel James Lajom",
          fname: "Emmanuel",
          lname: "Lajom",
          schedule: [
            {
              id: 1,
              title: "regularWork",
              startDate: moment(),
              endDate: moment().add(1, "days")
            }
          ]
        },
        {
          id: 1,
          image: null,
          full_name: "Emmanuel James Lajom",
          fname: "Emmanuel",
          lname: "Lajom",
          schedule: [
            {
              id: 1,
              title: "regularWork",
              startDate: moment(),
              endDate: moment().add(1, "days")
            }
          ]
        }
      ],
      // showDate: new Date(),
      // radio1: null,
      // value: new Date(),
      // calendar: {
      //   data: [
      //     {
      //       id: 1,
      //       startDate: "2019-07-27 10:10:00",
      //       endDate: "2019-07-28 10:10:00",
      //       title: "regularWork",
      //       classes: "regularWork"
      //     },
      //     {
      //       id: 2,
      //       startDate: "2019-07-27 10:10:00",
      //       endDate: "2019-07-28 10:10:00",
      //       title: "overTimeWork",
      //       classes: "overTimeWork"
      //     },
      //     {
      //       id: 3,
      //       startDate: "2019-07-28 10:10:00",
      //       endDate: "2019-07-29 10:10:00",
      //       title: "overTimeWork",
      //       classes: "overTimeWork"
      //     }
      //   ]
      // },
      action: {
        type: "Create",
        selections: []
      }
    };
  },
  watch: {},
  methods: {
    weekChange(e) {
      let start = moment(e)
          .startOf("isoweek")
          .format("YYYY-MM-DD"),
        end = moment(e)
          .endOf("isoweek")
          .format("YYYY-MM-DD");
      this.week.start = start;
      this.week.end = end;
      this.generateHeader(start, end);
    },
    generateHeader(start, end) {
      let range = moment.range(start, end),
        dates = Array.from(range.by("day")).map(m => m.format("YYYY-MM-DD"));

      this.tableHeader = dates.map(d => ({
        day: moment(d).format("ddd"),
        date: moment(d).format("YYYY-MM-DD"),
        date1: moment(d).format("MMM Do")
      }));
    },
    plotSchedulePerDay(schedules, date) {
      let schedule = schedules.filter(i => i.schedule.start_date == date);
      return schedule;
    }
  }
};
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
</style>
