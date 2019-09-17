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
        <el-col :md="{span:4}">
          <el-date-picker
            v-model="week.start"
            size="mini"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{firstDayOfWeek:1}"
            :clearable="false"
            style="width:100%"
            @change="weekChange"
          />
        </el-col>
        <el-col :md="{span:20}">
          <div style="float:right">
            <el-select
              v-if="position != 'Operations Manager' && position != 'Team Leader'"
              v-model="select.operationsManager"
              size="mini"
              placeholder="Operations Manager"
            >
              <el-option
                v-for="(option,index) in options.operationsManager"
                :key="index"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-select
              v-model="select.teamLeader"
              size="mini"
              placeholder="Team Leader"
              :disabled="disable_select.teamLeader"
            >
              <el-option
                v-for="(option,index) in options.teamLeader"
                :key="index"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="{span:12}" style="margin-top:10px">
          <el-button-group>
            <!--            v-if="position=='RTA Manager' || position=='RTA Supervisor' || position=='RTA Analyst'"-->
            <template
              v-if="position=='RTA Manager' || position=='RTA Supervisor' || position=='RTA Analyst'"
            >
              <el-button size="mini" @click="showModal('addSchedule')">Add Schedule</el-button>
            </template>
            <!--            v-if="position=='HR Manager' || position=='HR Assistant'"-->
            <template v-if="position=='HR Manager' || position=='HR Assistant'">
              <el-button size="mini" @click="showModal('addLeave')">Add Leave</el-button>
            </template>
          </el-button-group>
        </el-col>
        <el-col :md="{span:12}" style="margin-top:10px">
          <div style="float:right">
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
        <el-col :md="{span:4}" style="margin-top:10px;">
          <el-input v-model="searchQuery" size="mini" placeholder="Agent Search" />
        </el-col>
        <el-col :md="{span:20}" style="margin-top:10px;">
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
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}">
          <el-table v-loading="agentsWorkReportsfetchState.initial" :data="tableData">
            <el-table-column label="Employee" min-width="200" prop="full_name" fixed>
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
                <template
                  v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[0].date)"
                >
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
                <template
                  v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[1].date)"
                >
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
                <template
                  v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[2].date)"
                >
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
                <template
                  v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[3].date)"
                >
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
                <template
                  v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[4].date)"
                >
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
                <template
                  v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[5].date)"
                >
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
                <template
                  v-for="(schedule,index) in plotSchedulePerDay(row.schedule,tableHeader[6].date)"
                >
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
            <label for="dates">Operations Manager</label>
            <el-select
              v-model="form.addSchedule.model.operationsManager"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              class="form-input"
              size="mini"
              placeholder="Select"
            >
              <el-option
                v-for="item in form.addSchedule.options.operationsManager"
                :key="item.id"
                :label="item.full_name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col>
            <label for="dates">Team Leader</label>
            <el-select
              v-model="form.addSchedule.model.teamLeader"
              class="form-input"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              size="mini"
              placeholder="Select"
            >
              <el-option
                v-for="item in form.addSchedule.options.teamLeader"
                :key="item.id"
                :label="item.full_name"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="form.addSchedule.show=false">Cancel</el-button>
          <el-button
            type="danger"
            size="mini"
            :loading="btn_loader"
            @click="submitAddSchedule"
          >Confirm</el-button>
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
              <el-option
                v-for="(type, index) in options.leave_type"
                :key="index"
                :value="type.value"
                :label="type.label"
              />
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="form.addLeave.show=false">Cancel</el-button>
          <el-button type="danger" :disabled="createLeaveState.initial" size="mini" @click="onSubmit">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import Moment from 'moment/moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
import cellContent from './components/cellContent'
export default {
  components: { cellContent },
  computed: {
    ...mapGetters([
      'agentsWorkReports',
      'agentsWorkReportsfetchState',
      'agents',
      'agentsfetchState',
      'position',
      'token',
      'head_id',
      'createScheduleBulkState',
      'createScheduleBulkData',
      'createLeaveState',
      'createScheduleBulkError'
    ])
  },
  watch: {
    createLeaveState({ initial, success, fail }) {
      if (success) {
        this.form.addLeave.show = false
        this.$message({
          type: 'success',
          message: 'Leave successfully created!.',
          duration: 5000
        })
      } else if (fail) {
        this.$message({
          type: 'danger',
          message: 'Internal Server Error.',
          duration: 5000
        })
      }
    },
    createScheduleBulkState({ initial, success, fail }) {
      if (initial) {
        this.form.addSchedule.btn_loader = true
      }

      if (success) {
        this.form.addSchedule.btn_loader = false
        this.weekChange(moment(this.week.start).format('YYYY-MM-DD'))
        this.$message({
          type: 'success',
          message: 'Schedules successfully created!.',
          duration: 5000
        })
      }

      if (fail) {
        this.form.addSchedule.btn_loader = false
        this.$message({
          type: 'warning',
          message: "There's a problem creating the schedules.",
          duration: 5000
        })
      }
    },
    'form.addSchedule.model.operationsManager': function() {
      this.getFormOptions({ query: 'team leader', var: 'teamLeader' })
    },
    searchQuery(v) {
      if (v != '') {
        this.query['target[]'] = 'full_name'
        this.query.query = v
        this.weekChange(
          moment(this.week.start)
            // .subtract(7, "days")
            // .startOf("isoweek")
            .format('YYYY-MM-DD')
        )
      } else {
        delete this.query['target[]']
        delete this.query.query
        this.weekChange(
          moment(this.week.start)
            // .subtract(7, "days")
            // .startOf("isoweek")
            .format('YYYY-MM-DD')
        )
      }
    },
    agentsWorkReportsfetchState({ initial, success, fail }) {
      if (success) {
        this.tableData = this.agentsWorkReports.agent_schedules
      }
      if (fail) {
        this.tableData = []
      }
    },
    'select.operationsManager': function(v) {
      if (
        this.position != 'Operations Manager' &&
        this.position != 'Team Leader'
      ) {
        if (v == 'all') {
          this.disable_select.teamLeader = true
          this.select.teamLeader = 'all'
        } else {
          this.disable_select.teamLeader = false
          this.getUsersByPosition({ query: 'team leader', var: 'teamLeader' })
        }
      }
      this.weekChange(moment(this.week.start).format('YYYY-MM-DD'))
    },
    'select.teamLeader': function(v) {
      this.weekChange(moment(this.week.start).format('YYYY-MM-DD'))
    }
  },
  mounted() {
    if (
      this.position == 'Admin' ||
      this.position == 'HR Manager' ||
      this.position == 'HR Assistant' ||
      this.position == 'RTA Manager' ||
      this.position == 'RTA Analyst'
    ) {
      this.disable_select.teamLeader = true
      this.getUsersByPosition({
        query: 'operations manager',
        var: 'operationsManager'
      })
    } else {
      this.disable_select.teamLeader = false
      this.getUsersByPosition({ query: 'team leader', var: 'teamLeader' })
    }
    this.weekChange(
      moment()
        // .subtract(7, "days")
        .startOf('isoweek')
        .format('YYYY-MM-DD')
    )
    this.getFormOptions({
      query: 'operations manager',
      var: 'operationsManager'
    })
  },
  data() {
    return {
      searchQuery: '',
      creatingFlag: false,
      form: {
        addSchedule: {
          show: false, // temporary value
          btn_loader: false,
          model: {
            dates: [],
            time_in: null,
            duration: null,
            agents: [],
            teamleader: null,
            operationsManager: null
          },
          options: {
            teamLeader: [],
            operationsManager: []
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
        by: 'all',
        options: []
      },
      week: {
        start: moment()
          .startOf('isoweek')
          .format('YYYY-MM-DD'),
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
      },
      select: {
        teamLeader: null,
        operationsManager: null
      },
      options: {
        teamLeader: [],
        operationsManager: [],
        leave_type: [
          { value: 'bereavement_leave', label: 'Bereavement' },
          { value: 'leave_of_absence', label: 'Leave of absence' },
          { value: 'maternity_leave', label: 'Maternity' },
          { value: 'paternity_leave', label: 'Paternity' },
          { value: 'solo_parent_leave', label: 'Solo Parent' },
          { value: 'vawc', label: 'Violence Againts Women and Children' }
        ]
      },
      disable_select: {
        teamLeader: false,
        operationsManager: false
      }
    }
  },
  methods: {
    ...mapActions([
      'fetchAgentsWorkReports',
      'fetchAgents',
      'createBulkSchedule',
      'createLeave',
      'createScheduleBulk'
    ]),
    processAddScheduleData() {
      const form = this.form.addSchedule.model
      const data = []
      form.agents.forEach(
        (v, i) => {
          form.dates.forEach(
            (v1, i1) => {
              const start = moment(
                moment(v1).format('YYYY-MM-DD') +
                    ' ' +
                    moment(form.time_in).format('HH:mm:ss')
              ).format('YYYY-MM-DD HH:mm:ss')
              const duration = moment(
                moment(form.duration).format('HH:mm:ss'),
                'HH:mm:ss'
              ).diff(moment().startOf('day'), 'seconds')
              // alert(v1+" "+start+" "+duration)
              alert(start + ' ' + duration)
              data.push({
                user_id: v,
                tl_id: form.teamLeader,
                om_id: form.operationsManager,
                title_id: 1,
                start_event: start,
                end_event: moment(moment(start).add(duration, 's')).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              })
            }
          )
        }
      )
      return data
    },
    submitAddSchedule() {
      if (this.validateAddSchedule()) {
        this.createScheduleBulk(this.processAddScheduleData())
      } else {
        this.$message({
          type: 'warning',
          message: 'Please fillup all form fields.',
          duration: 5000
        })
      }
    },
    validateAddSchedule() {
      const form = this.form.addSchedule.model
      if (
        form.dates.length < 1 ||
        form.agents < 1 ||
        form.duration == null ||
        form.time_in == null ||
        form.teamLeader == null ||
        form.operationsManager == null
      ) {
        return false
      } else {
        return true
      }
    },
    getFormOptions(query) {
      const url = 'api/v1/users/search?target[]=position&query=' + query.query
      const options = {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      }
      axios
        .get(url, options)
        .then(res => {
          const result = res.data.meta.users
          if (query.query == 'team leader') {
            this.form.addSchedule.options[query.var] = result.filter(
              i => i.parent_id == this.form.addSchedule.model.operationsManager
            )
            if (this.form.addSchedule.options[query.var].length < 1) {
              this.form.addSchedule.options[query.var] = []
            } else {
              this.form.addSchedule.model[
                query.var
              ] = this.form.addSchedule.options[query.var][0].id
            }
          } else {
            this.form.addSchedule.options[query.var] = result
            this.form.addSchedule.model[
              query.var
            ] = this.form.addSchedule.options[query.var][0].id
          }
        })
        .catch(err => console.log(err.response.data))
    },
    getUsersByPosition(query) {
      const url = 'api/v1/users/search?target[]=position&query=' + query.query
      const options = {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      }
      axios
        .get(url, options)
        .then(res => {
          let filtered = res.data.meta.users
          if (query.query == 'team leader') {
            if (this.position == 'Team Leader') {
              filtered = res.data.meta.users.filter(
                i => i.parent_id == this.head_id
              )
            } else if (this.position == 'Operations Manager') {
              filtered = res.data.meta.users.filter(
                i => i.parent_id == this.user_id
              )
            } else {
              filtered = res.data.meta.users.filter(
                i => i.parent_id == this.select.operationsManager
              )
              if (filtered.length > 0) {
                this.disable_select.teamLeader = false
              } else {
                this.disable_select.teamLeader = true
              }
            }
          }
          this.options[query.var] = filtered.map(function(v) {
            return { value: v.id, label: v.full_name }
          })
          this.options[query.var].unshift({ value: 'all', label: 'All' })
          this.select[query.var] = 'all'
        })
        .catch(err => console.log(err.response.data))
    },
    showModal(type) {
      this.form[type].show = true
    },
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
      const dates = Array.from(range.by('day')).map(m =>
        m.format('YYYY-MM-DD')
      )

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
      if (this.searchQuery != '') {
        data['target[]'] = 'full_name'
        data.query = this.searchQuery
      }

      if (
        this.position != 'Operations Manager' &&
        this.position != 'Team Leader'
      ) {
        if (this.select.operationsManager != 'all') {
          data.om_id = this.select.operationsManager
        } else {
          delete data.om_id
        }
        if (this.select.teamLeader != 'all') {
          delete data.om_id
          data.tl_id = this.select.teamLeader
        } else {
          delete data.tl_id
        }
      } else {
        if (this.select.teamLeader != 'all') {
          delete data.om_id
          data.tl_id = this.select.teamLeader
        } else {
          if (this.position == 'Operations Manager') {
            data.om_id = this.user_id
          } else {
            data.om_id = this.head_id
          }
        }
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

      if (this.searchQuery != '') {
        data['target[]'] = 'full_name'
        data.query = this.searchQuery
      }

      if (
        this.position != 'Operations Manager' &&
        this.position != 'Team Leader'
      ) {
        if (this.select.operationsManager != 'all') {
          data.om_id = this.select.operationsManager
        } else {
          delete data.om_id
        }
        if (this.select.teamLeader != 'all') {
          data.tl_id = this.select.teamLeader
        } else {
          delete data.tl_id
        }
      } else {
        if (this.select.teamLeader != 'all') {
          delete data.om_id
          data.tl_id = this.select.teamLeader
        } else {
          if (this.position == 'operationsManager') {
            data.om_id = this.user_id
          } else {
            data.om_id = this.head_id
          }
        }
      }
      this.fetchAgentsWorkReports({ data })
    },
    plotSchedulePerDay(schedules, date) {
      const schedule = schedules.filter(
        i => moment(i.start_event.date).format('YYYY-MM-DD') == date
      )
      if (schedule.length == 0) {
        return [{}]
      } else {
        return schedule
      }
    },
    dateToday(date) {
      if (moment(date).isSame(moment().format('YYYY-MM-DD'))) {
        return true
      } else {
        return false
      }
    },
    onSubmit() {
      const params = {
        user_id: this.form.addLeave.model.user_id,
        start_event: this.form.addLeave.model.dates[0],
        end_event: this.form.addLeave.model.dates[0],
        leave_type: this.form.addLeave.leave_type
      }
      console.log(params)
      this.createLeave(params)
    },
    remoteAgent(query) {
      const data = {}
      if (query !== '') {
        data['target[]'] = 'full_name'
        data.query = query
        this.fetchAgents({ data })
      } else {
        data['target[]'] = ''
        data.query = ''
        this.fetchAgents({ data })
      }
    }
  }
}
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
