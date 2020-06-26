<template>
  <div>
    <div class="app-container">
      <h4 style="color:#646464">
        Agent Schedule
        <small
          style="font-weight:lighter"
        >{{ "("+ formatDate(query.start,"YYYY-MM-DD","MMM Do")+ " - "+ formatDate(query.end,"YYYY-MM-DD","MMM Do") + ")" }}</small>
      </h4>

      <el-row :gutter="5" style="margin-top:10px;">
        <el-col :md="{span:4}">
          <el-date-picker
            size="mini"
            v-model="week.start"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{firstDayOfWeek:2}"
            :clearable="false"
            style="width:100%"
            @change="weekChange"
          />
        </el-col>
        <el-col :md="{span:4}">
          <el-input v-model="searchQuery" size="mini" placeholder="Search..." />
        </el-col>

        <el-col :md="{span:16}" style="margin-top:10px;">
          <el-pagination
            style="float:right"
            :page-sizes="[10, 25, 50]"
            :page-size="query.limit"
            :current-page.sync="table_page"
            layout="total, sizes, prev, pager, next"
            :total="agentsWorkReports.count"
            background
            small
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>

        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}">
          <el-switch v-model="show_option" active-text="Show more options"></el-switch>
        </el-col>
        <el-col :xs="{span:12}" :sm="{span:12}" :md="{span:12}" style="margin-top:10px;">
          <el-row :gutter="5" v-show="show_option">
            <template v-if="position.toLowerCase() != 'team leader'">
              <el-col :md="{span:8}" style="font-size:.8em;color:grey;padding-top:5px;">
                <label>Advance Filter</label>
              </el-col>
              <el-col :md="{span:16}">
                <el-tooltip content="Filter By">
                  <template v-if="isRTA() || isHR() || isADMIN()">
                    <remote-filter-head :range="{start:query.start,end:query.end}" @filter="filterTable"></remote-filter-head>
                  </template>
                  <template v-if="position.toLowerCase() == 'operations manager'">
                    <tl-filter :range="{start:query.start,end:query.end}" @filter="filterTable" :om_id="user_id"></tl-filter>
                  </template>
                </el-tooltip>
              </el-col>
            </template>
            <el-col :md="{span:8}" style="font-size:.8em;color:grey;padding-top:5px;">
              <label>Preview</label>
            </el-col>
            <el-col :md="{span:16}" style="margin-top:5px">
              <el-tooltip content="Display preview">
                <template>
                  <el-select size="mini" v-model="table_config.view" style="float:right">
                    <el-option value="hours" label="Hours" />
                    <el-option value="log_status" label="Log status" />
                  </el-select>
                </template>
              </el-tooltip>
            </el-col>
            <el-col :md="{span:8}" style="font-size:.8em;color:grey;padding-top:5px;">
              <label>Functions</label>
            </el-col>
            <el-col :md="{span:16}" style="margin-top:5px">
              <div style="float:right">
                <template v-if="isRTA()">
                  <el-button
                    size="mini"
                    @click="showModal('addSchedule'), form.addSchedule.model.auto_assign=false"
                  >Add Schedule</el-button>
                </template>
                <template v-if="isHR()">
                  <el-button size="mini" @click="showModal('addLeave')">Add Leave</el-button>
                </template>
                <template>
                  <el-dropdown @command="handleCommand">
                    <el-button type="success" :plain="true" size="mini">
                      Excel
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="isRTA()" command="importSchedule">Import Schedule</el-dropdown-item>
                      <el-dropdown-item
                        v-if="isRTA()"
                        command="importScheduleQuarterly"
                      >Import Schedule(Quarterly)</el-dropdown-item>
                      <el-dropdown-item command="exportSVA">Export SVA Report</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </div>
            </el-col>
            <input
              type="file"
              v-if="importScheduleReset"
              ref="importScheduleInput"
              accept=".xlsx"
              style="display:none"
              @change="importScheduleFileChangeV2"
            />
          </el-row>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px;">
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}">
          <el-table
            class="monday"
            v-loading="agentsWorkReportsfetchState.initial"
            :data="tableData"
            @sort-change="columnSort"
          >
            <!-- <el-table-column
              label="Employee"
              min-width="200"
              prop="full_name"
              fixed
              sortable="custom"
            >
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
            </el-table-column>-->
            <el-table-column width="250" label="Name"  sortable="custom" prop="full_name" fixed
            >
              <template slot="header" slot-scope="scope">
                <span
                  style="font-weight:normal;font-size:.8em"
                >Name</span>
              </template>
              <template slot-scope="scope">
                <div style="height:45px;border-left:red 7px solid;display:flex">
                  <el-tooltip :content="scope.row.email">
                    <div
                      style="width:100%;align-self:center;padding-left:20px;"
                    >{{ scope.row.full_name }}</div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50" fixed
            >
            <!-- sortable="custom" prop="full_name" -->

              <template slot-scope="scope">
                <div class="user-block">
                  <div v-if="scope.row.image_url" style="width:100%;">
                    <div style="margin:0 auto;height:30px;width:30px;">
                      <img class="img-circle" style="margin:0 auto;" :src="scope.row.image_url" />
                    </div>
                  </div>
                  <div v-else class="text-muted" style="width:100%;">
                    <div class="img-circle" style="background-color:white;margin:0 auto;">
                      <div style="display:flex;height:30px;width:30px;">
                        <div
                          style="align-self:center;width:100%;text-align:center;font-weight:bold;font-size:.8em"
                        >
                          {{
                          getAvatarLetters(
                          scope.row.info.firstname,
                          scope.row.info.lastname
                          )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <template v-for="(thead,index1) in tableHeader">
              <el-table-column align="center" :key="index1">
                <template slot="header" slot-scope="scope">
                  <!-- <h4
                    :class="[dateToday(tableHeader[index1].date)?'today-header':'']"
                    style="margin-bottom:5px"
                  >{{ tableHeader[index1].day }}</h4> -->
                  <span
                    style="font-weight:normal;font-size:.8em"
                    :class="[dateToday(tableHeader[index1].date)?'today-header':'']"
                  >{{ tableHeader[index1].day+', '+tableHeader[index1].date1 }}</span>
                </template>
                <template slot-scope="{row}">
                  <template
                    v-if="sched_array.filter(i=> i.user_info.id==row.uid && formatDate(i.start_event.date,'YYYY-MM-DD HH:mm:ss','YYYY-MM-DD')==tableHeader[index1].date).length>0"
                  >
                    <template
                      v-for="(schedule,index) in sched_array.filter(i=> i.user_info.id==row.uid && formatDate(i.start_event.date,'YYYY-MM-DD HH:mm:ss','YYYY-MM-DD')==tableHeader[index1].date)"
                    >
                      <template
                        v-if="sched_array.filter(i=> i.user_info.id==row.uid && formatDate(i.start_event.date,'YYYY-MM-DD HH:mm:ss','YYYY-MM-DD')==tableHeader[index1].date)[index]"
                      >
                        <cell-content
                          @refreshTable="weekChange(week.start)"
                          :key="index"
                          :schedule="sched_array.filter(i=> i.user_info.id==row.uid && formatDate(i.start_event.date,'YYYY-MM-DD HH:mm:ss','YYYY-MM-DD')==tableHeader[index1].date)[index]"
                          :date="tableHeader[index1].date"
                          :info="row.info"
                          :view="table_config.view"
                        />
                      </template>
                    </template>
                  </template>
                  <!-- v-else-if="sched_array.filter(i=> i.user_info.id==row.id && formatDate(i.start_event.date,'YYYY-MM-DD HH:mm:ss','YYYY-MM-DD')==tableHeader[index1].date).length===0" -->

                  <template v-else>
                    <div style="width:100%;padding:0px;margin:0px;">
                      <div
                        style="padding:3px;font-size:.85em;color:#909399;height:inherit"
                      >OFF</div>
                    </div>
                  </template>
                </template>
              </el-table-column>
            </template>
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
            <label>Dates</label>
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
            <label>Time in</label>
            <el-time-picker
              v-model="form.addSchedule.model.time_in"
              size="mini"
              style="width:100%"
              class="form-input"
            />
          </el-col>
          <el-col>
            <label>Duration</label>
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
            <label>Agents</label>
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
              :loading="form.addSchedule.remote_loader"
            >
              <el-option
                v-for="item in agents.agents"
                :key="item.uid"
                :label="item.full_name"
                :value="item.email"
              />
            </el-select>
            <span
              style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px;"
            >count: {{ form.addSchedule.model.agents.length }}</span>
          </el-col>
          <el-col>
            <el-switch v-model="form.addSchedule.replicate" active-text="Week to Quarterly"></el-switch>
            <el-alert
              type="info"
              title="Activating WTQ will automatically apply schedules quarterly."
              style="margin-bottom:10px;margin-top:10px;"
            />
          </el-col>
          <el-col>
            <el-switch
              v-model="form.addSchedule.model.auto_assign"
              active-text="Auto-assign"
              :disabled="form.addSchedule.disable_auto_assign"
            ></el-switch>
            <el-alert
              type="info"
              title="Activating auto assign will use current cluster supervisors automatically. Else, "
              style="margin-bottom:10px;margin-top:10px;"
            />
          </el-col>
          <el-col>
            <label>Operations Manager</label>
            <el-select
              v-model="form.addSchedule.model.operationsManager"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              class="form-input"
              size="mini"
              remote
              filterable
              placeholder="Operations Manager"
              :remote-method="remoteManager"
              :loading="form.addSchedule.options.operationsManager.loader"
              :disabled="form.addSchedule.model.auto_assign"
            >
              <el-option
                v-for="item in form.addSchedule.options.operationsManager.data"
                :key="item.id"
                :label="item.full_name"
                :value="item.email"
              />
            </el-select>
          </el-col>
          <el-col>
            <label>Team Leader</label>
            <el-select
              v-model="form.addSchedule.model.teamLeader"
              class="form-input"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              size="mini"
              remote
              filterable
              placeholder="Team Leader"
              :remote-method="remoteLeader"
              :loading="form.addSchedule.options.teamLeader.loader"
              :disabled="form.addSchedule.model.auto_assign"
            >
              <el-option
                v-for="(item,index) in form.addSchedule.options.teamLeader.data"
                :key="index"
                :label="item.full_name"
                :value="item.email"
              />
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="(form.addSchedule.show=false)">Cancel</el-button>
          <el-button
            type="danger"
            size="mini"
            :loading="form.addSchedule.btn_loader"
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
              <label>Agent</label>
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
                :loading="agentsfetchState.initial"
              >
                <el-option
                  v-for="item in agents.agents"
                  :key="item.uid"
                  :label="item.full_name"
                  :value="item.uid"
                />
              </el-select>
            </el-col>
            <label>Dates</label>
            <el-date-picker
              v-model="form.addLeave.model.dates"
              size="mini"
              type="daterange"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              class="form-input"
              placeholder="Range picker..."
            />
          </el-col>
          <el-col>
            <label>Leave Type</label>
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
          <el-button
            type="danger"
            :loading="createLeaveState.initial"
            size="mini"
            @click="onSubmit"
          >Confirm</el-button>
        </span>
      </el-dialog>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="excel.export_sva.dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Export SVA"
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col>
            <el-radio-group
              size="mini"
              v-model="excel.export_sva.field.radio_select"
              @change="excel.export_sva.clear_cluster_field != excel.export_sva.clear_cluster_field"
            >
              <el-radio-button label="all">All</el-radio-button>
              <el-radio-button label="multiCluster">Selected Clusters</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col style="margin-top:10px;">
            <label>Dates</label>
          </el-col>
          <el-col style="margin-top:5px">
            <el-date-picker
              v-model="excel.export_sva.field.dates"
              size="mini"
              type="daterange"
              style="width:100%;"
              class="form-input"
              placeholder="Range picker..."
            />
          </el-col>
          <el-col style="margin-top:10px;">
            <label>Clusters</label>
          </el-col>
          <el-col style="margin-top:5px">
            <!-- component here -->
            <remote-search
              @selected="excelCluster"
              :multiple="true"
              :filterable="true"
              :params="{
              om:true,
              start_date:formatDate(excel.export_sva.field.dates[0],'','YYYY-MM-DD'),
              end_date:formatDate(excel.export_sva.field.dates[1],'','YYYY-MM-DD')
              }"
              :placeholder="'Select Cluster...'"
              style="width:100%"
              :disabled="excel.export_sva.field.radio_select =='all'"
              :clear="excel.export_sva.clear_cluster_field"
            ></remote-search>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="excel.export_sva.dialog=false">Cancel</el-button>
          <!-- frontend way of exporting sva -->
          <!-- <el-button type="danger" :loading="false" size="mini" @click="generateSvaReport">Confirm</el-button> -->
          <!-- backend way -->
          <el-button
            type="danger"
            size="mini"
            @click="generateSvaReport()"
            :loading="excel.export_sva.confirm"
          >Download</el-button>
        </span>
      </el-dialog>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="excel.import.dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Importing Schedule..."
        width="70%"
        top="5vh"
      >
        <el-alert
          title="Import Report"
          type="info"
          description="This report will only be displayed once every import. Please review results to reupload unimported data."
          show-icon
        ></el-alert>

        <div style="width:100%;margin-bottom:20px;margin-top:15px;">
          <template v-if="excel.import.arr_length == 0">
            Initializing data, Please wait...
          </template>
          <template v-else>
            Progress
            <span>( {{ excel.import.report.data.all.list.length }}</span>/
            <span>{{ excel.import.arr_length }} )</span>
          </template>
        </div>
        <el-progress :percentage="excel.import.arr_length!=0?excel.import.report.data.all.list.length / excel.import.arr_length * 100: 0" :text-inside="true" :stroke-width="18"></el-progress>
        <div style="padding-bottom:15px;  ">
          <el-tabs
            v-model="excel.import.report.active_tab"
            type="border-card"
            style="margin-top:15px;margin-bottom:10px;"
          >
            <el-tab-pane :label="'All: '+excel.import.report.data.all.list.length" name="all">
              <el-table :data="excel.import.report.data.all.list" height="350px">
                <el-table-column label="Email" width="350">
                  <template scope="scope">{{scope.row.email}}</template>
                </el-table-column>
                <el-table-column label="Schedule" width="400">
                <template scope="scope">{{ scope.row.start_event +(scope.row.end_event?" To "+ scope.row.end_event:"")}}</template>
                </el-table-column>
                <el-table-column label="Status" width="500">
                  <template scope="scope">
                    <template v-if="scope.row.import_result.code==200">
                      <template v-if="scope.row.import_result.action!='delete'">
                        <el-tag size="mini" type="success">{{ scope.row.import_result.action == "create"? "Created": "Updated"}}</el-tag>
                      </template>
                      <template v-else>
                        <el-tag size="mini" type="warning">Cleared</el-tag>
                      </template>
                    </template>
                    <template v-else>
                      <el-tag size="mini" type="danger">{{ scope.row.import_result.description }}</el-tag>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane
              :label="'Errors: ' +excel.import.report.data.all.list.filter(i=> i.import_result.code != 200).length"
              name="errors"
            >
              <el-table
                :data="excel.import.report.data.all.list.filter(i=> i.import_result.code != 200)"
                height="350px"
              >
                <el-table-column label="Email" width="350">
                  <template scope="scope">{{scope.row.email}}</template>
                </el-table-column>
                
                <el-table-column label="Schedule" width="400">
                <template scope="scope">{{ scope.row.start_event +" To "+ scope.row.end_event}}</template>
                </el-table-column>
                <el-table-column label="Status" width="500">
                  <template scope="scope">
                    <template>
                      <el-tag size="mini" type="danger">{{ scope.row.import_result.description }}</el-tag>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <el-button size="mini" @click="closeImportReport" style="float:right">Close</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import cellContent from "./components/cellContent";
import remoteSearch from "./components/userRemoteSearch";
import remoteFilterHead from "./components/agentScheduleHeadFilter";
import tlFilter from "./components/TeamLeaderFilter";
import readXlsxFile from "read-excel-file";
import { getJsDateFromExcel } from "excel-date-to-js";
import tz from "moment-timezone";


export default {
  components: { cellContent, remoteSearch, remoteFilterHead, tlFilter },
  computed: {
    table_page(){
      return this.query.offset/this.query.limit + 1;
    },
    ...mapGetters([
      "agentsWorkReports",
      "agentsWorkReportsfetchState",
      "agents",
      "agentsfetchState",
      "position",
      "token",
      "user_id",
      "createScheduleBulkState",
      "createScheduleBulkData",
      "createLeaveState",
      "createScheduleBulkError",
      "updateScheduleState",
      "position_id",
      "createLeaveParams",
      "cancelLeaveState",
      "deleteSingleScheduleData",
      "deleteSingleScheduleState",
      "deleteSingleScheduleError",
      "exportSvaReportData",
      "exportSvaReportState",
      "exportSvaReportTitle",
      "agentTimeOutState",
      "removeTimeOutState",
      "agentTimeOutTitle",
      "removeTimeOutTitle"
    ]),
    row2offset() {
      let result = 0,
        position = this.position.toLowerCase();
      if (this.isRTA() || this.isHR()) {
        result = 14;
      } else {
        if (position == "admin") {
          result = 14;
        }
      }
      return result;
    }
  },
  watch: {
    "form.addSchedule.replicate": function(v) {
      if (v == true) {
        this.form.addSchedule.model.auto_assign = false;
        this.form.addSchedule.disable_auto_assign = true;
      } else {
        this.form.addSchedule.model.auto_assign = true;
        this.form.addSchedule.disable_auto_assign = false;
      }
    },
    "form.addSchedule.model.auto_assign": function(v) {
      if (v) {
        this.form.addSchedule.model.teamLeader = null;
        this.form.addSchedule.model.operationsManager = null;
      }
    },
    agentTimeOutState({ initial, success, fail }) {
      if (success) {
        this.weekChange(this.week.start);
        const data = this.query;
        this.fetchAgentsWorkReports({
          data
        });
        this.$message({
          type: "success",
          message: this.agentTimeOutTitle,
          duration: 5000
        });
      }

      if (fail) {
        this.$message({
          type: "error",
          message: this.agentTimeOutTitle,
          duration: 5000
        });
      }
    },
    removeTimeOutState({ initial, success, fail }) {
      if (success) {
        this.weekChange(this.week.start);
        this.$message({
          type: "success",
          message: this.removeTimeOutTitle,
          duration: 5000
        });
      }

      if (fail) {
        this.$message({
          type: "error",
          message: this.removeTimeOutTitle,
          duration: 5000
        });
      }
    },
    agentsfetchState({ initial, success, fail }) {
      if (initial) {
        this.form.addSchedule.remote_loader = true;
      }
      if (success) {
        this.form.addSchedule.remote_loader = false;
      }
      if (fail) {
        this.form.addSchedule.remote_loader = false;
      }
    },
    "excel.import.report.data.all.list": function(v) {
      if (v.length == this.excel.import.arr_length) {
        this.excel.import.importing = false;
        this.weekChange(this.week.start);
        if(this.excel.import.inapp){
          this.form.addSchedule.show = false;
        }
      }
    },
    exportSvaReportState({ initial, success, fail }) {
      if(initial){
        this.excel.export_sva.confirm = true;
      }

      if (success) {
        this.excel.export_sva.dialog = false;
        this.$message({
          type: "success",
          message: this.exportSvaReportTitle,
        });
        this.excel.export_sva.confirm = false;
      }
      if(fail){
        this.excel.export_sva.confirm = false;
        this.$message({
          type: "error",
          message: this.exportSvaReportTitle,
        });
      }
    },
    deleteSingleScheduleState({ initial, success, fail }) {
      if (success) {
        this.weekChange(this.week.start);
        this.$message({
          type: "success",
          message: "You have successfully deleted a schedule.",
          duration: 5000
        });
      }

      if (fail) {
        this.$message({
          type: "error",
          message: this.deleteSingleScheduleError,
          duration: 5000
        });
      }
    },
    updateScheduleState({ initial, success, fail }) {
      if (initial) {
      }
      if (success) {
        this.$message({
          type: "success",
          message: "Successfully updated schedule.",
          duration: 5000
        });
        this.weekChange(moment(this.week.start).format("YYYY-MM-DD"));
      }
      if (fail) {
        this.$message({
          type: "warning",
          message: "There's a problem processing your request.",
          duration: 5000
        });
      }
    },
    createLeaveState({ initial, success, fail }) {
      if (success) {
        this.form.addLeave.show = false;
        if (this.createLeaveParams.approval_status.code == 500) {
          this.$message({
            type: "warning",
            message: this.createLeaveParams.approval_status.title,
            duration: 5000
          });
        } else {
          this.$message({
            type: "success",
            message: this.createLeaveParams.approval_status.title,
            duration: 5000
          });
        }
        this.weekChange(moment(this.week.start).format("YYYY-MM-DD"));
      } else if (fail) {
        this.$message({
          type: "error",
          message: this.createLeaveError,
          duration: 5000
        });
      }
    },
    cancelLeaveState({ initial, success, fail }) {
      if (success) {
        // if(this.createLeaveParams.approval_status.code == 500 ){
        //   this.$message({
        //     type:"warning",
        //     message:this.createLeaveParams.approval_status.title,
        //     duration:5000
        //   })
        // }else{
        this.$message({
          type: "success",
          message: "You have successfully cancelled a leave.",
          duration: 5000
        });
        // }
        this.weekChange(moment(this.week.start).format("YYYY-MM-DD"));
      } else if (fail) {
        this.$message({
          type: "error",
          message: this.createLeaveError,
          duration: 5000
        });
      }
    },
    // 'form.addSchedule.model.operationsManager': function() {
    //   this.getFormOptions({ query: 'team leader', var: 'teamLeader' })
    // },
    searchQuery(v) {
      if (v != "") {
        this.query["target[]"] = "full_name";
        this.query.query = v;
      } else {
        this.query["target[]"]=null;
        this.query.query=null;
      }
      this.refetchSchedules();
    },
    agentsWorkReportsfetchState({ initial, success, fail }) {
      if (success) {
        this.tableData = this.agentsWorkReports.agent_schedules;
        let tmp = [].concat(
          this.agentsWorkReports.agent_schedules.map(i => i.schedule)
        );
        tmp = [].concat(...tmp.map(i => i));
        tmp = tmp.filter(i => i.overtime_id == null);
        this.sched_array = tmp;

        // console.log(this.sched_array.filter(i=> i.user_info.id==20 && formatDate(i.start_event.date,'','YYYY-MM-DD')==tableHeader[2].date)[0])
        // console.log(this.sched_array.filter(i=> i.user_info.id==row.id && formatDate(i.start_event.date,'','YYYY-MM-DD')==tableHeader[index1].date).length)
      }
      if (fail) {
        this.tableData = [];
      }
    },
    // 'select.operationsManager': function(v) {
    //   if (
    //     this.position != 'Operations Manager' &&
    //     this.position != 'Team Leader'
    //   ) {
    //     if (v == 'all') {
    //       this.disable_select.teamLeader = true
    //       this.select.teamLeader = 'all'
    //     } else {
    //       this.disable_select.teamLeader = false
    //       this.getUsersByPosition({
    //         query: 'team leader',
    //         var: 'teamLeader',
    //         start:this.week.start,
    //         end:this.week.end,
    //       })
    //     }
    //   }
    // this.weekChange(moment(this.week.start).format('YYYY-MM-DD'))
    // },
    // 'select.teamLeader': function(v) {
    //   this.weekChange(moment(this.week.start).format('YYYY-MM-DD'))
    // },
    "excel.export_sva.field.dates": function(v) {
      let start =
          this.excel.export_sva.model.start !=
          moment(v[0]).format("YYYY-MM-DD"),
        end =
          this.excel.export_sva.model.end != moment(v[1]).format("YYYY-MM-DD");
      if (start || end) {
        this.excel.export_sva.clear_cluster_field = !this.excel.export_sva
          .clear_cluster_field;
      }
      this.excel.export_sva.model.start = moment(v[0]).format("YYYY-MM-DD");
      this.excel.export_sva.model.end = moment(v[1]).format("YYYY-MM-DD");
    }
  },
  mounted() {
    // console.log(this.token)
    this.axios.options.headers.Authorization = "Bearer " + this.token;
    if (
      this.position == "Admin" ||
      this.position == "HR Manager" ||
      this.position == "HR Assistant" ||
      this.position == "RTA Manager" ||
      this.position == "RTA Analyst" ||
      this.position == "RTA Supervisor"
    ) {
      this.disable_select.teamLeader = true;
      this.getUsersByPosition({
        query: "operations manager",
        var: "operationsManager",
        start: this.week.start,
        end: this.week.end
      });
    } else {
      this.disable_select.teamLeader = false;
      this.getUsersByPosition({
        query: "team leader",
        var: "teamLeader",
        start: this.week.start,
        end: this.week.end
      });
    }

    this.weekChange(moment());
  },
  data() {
    return {
      importScheduleReset: true,
      show_option: true,
      blank: [{}],
      axios: { options: { headers: { Authorization: null } } },
      sched_array: [],
      excel: {
        import: {
          replicate: false,
          status: null,
          progress: 0,
          dialog: false,
          loop_index: 0,
          arr_length: 0,
          data: [],
          importing: false,
          report: {
            active_tab: "all",
            data: {
              all: {
                count: 0,
                list: []
              },
              errors: {
                count: 0,
                list: []
              }
            }
          }
        },
        export_sva: {
          dialog: false,
          confirm: false,
          clear_cluster_field: false,
          model: {
            start: null,
            end: null
          },
          field: {
            dates: [],
            radio_select: "all",
            clusters: []
          }
        }
      },
      searchQuery: "",
      creatingFlag: false,
      form: {
        addSchedule: {
          inapp:true,
          replicate: false,
          disabled_auto_assign: false,
          remote_loader: false,
          show: false,
          btn_loader: false,
          model: {
            dates: [],
            time_in: null,
            duration: null,
            agents: [],
            auto_assign: true,
            teamLeader: null,
            operationsManager: null
          },
          options: {
            teamLeader: {
              request: {
                full_name: null,
                list: "heads",
                position_id: 16
              },
              data: [],
              loader: false
            },
            operationsManager: {
              request: {
                full_name: null,
                list: "heads",
                position_id: 15
              },
              data: [],
              loader: false
            }
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
      filter_table: {
        om_id: null,
        tl_id: null
      },
      filter: {
        by: "all",
        options: []
      },
      week: {
        start: moment()
          .startOf("isoweek")
          .format("YYYY-MM-DD"),
        end: moment()
          .endOf("isoweek")
          .format("YYYY-MM-DD")
      },
      fetchData: [],
      tableHeader: [],
      tableData: [],
      query: {
        limit: 10,
        offset: 0,
        start: null,
        end: null,
        sort: null,
        order: null,
        target:null,
        query:null,
        om_id:null,
        tl_id:null,
      },
      table_config: {
        page: 1,
        view: "hours"
      },
      action: {
        type: "Create",
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
          { value: "bereavement_leave", label: "Bereavement" },
          { value: "leave_of_absence", label: "Leave of absence" },
          { value: "loa1", label: "Leave of absence 1 (Sick)" },
          { value: "loa2", label: "Leave of absence 2 (Vacation)" },
          { value: "maternity_leave", label: "Maternity" },
          { value: "paternity_leave", label: "Paternity" },
          { value: "solo_parent_leave", label: "Solo Parent" },
          { value: "magna_carta_leave", label: "Magna Carta" },
          { value: "vawc", label: "Violence Againts Women and Children" }
        ]
      },
      disable_select: {
        teamLeader: false,
        operationsManager: false
      }
    };
  },
  methods: {
    ...mapActions([
      "fetchAgentsWorkReports",
      "fetchAgents",
      "createLeave",
      "createSchedule",
      "excelToArraySchedule",
      "exportEmployeeTemplate",
      "exportSvaReport"
    ]),
    columnSort({ column, prop, order }) {
      this.query.sort = order ? prop : null;
      this.query.order =
        order != null ? (order == "ascending" ? "asc" : "desc") : null;
      this.refetchSchedules();
    },
    filterTable(v) {
      this.query.offset=0;
      this.query.tl_id = null;
      this.query.om_id = null;
      switch(this.position.toLowerCase()){
        case 'operations manager':
            this.query.om_id = v.om_id;
            if(v.tl_id){
              this.query.tl_id = v.tl_id;
              this.query.om_id = null;
            }
          break;
        case 'team leader':
            this.query.tl_id = this.user_id;
          break;
          default:
            if(v.tl_id){
              this.query.tl_id = v.tl_id;
              this.query.om_id = null;
            }else if(v.om_id){
              this.query.tl_id = null;
              this.query.om_id = v.om_id;
            }
            break;
      }
      const data = this.query;
      this.fetchAgentsWorkReports({data});
    },
    excelCluster(v) {
      this.excel.export_sva.field.clusters = v;
    },
    generateSvaReport() {
      let params = {
        start_date: this.excel.export_sva.model.start,
        end_date: this.excel.export_sva.model.end
      };

      if (
        Array.isArray(this.excel.export_sva.field.clusters) &&
        this.excel.export_sva.field.radio_select != "all"
      ) {
        params.om_id = this.excel.export_sva.field.clusters;
      }
      this.exportSvaReport(params);
    },
    createMultisheetExcel(data) {
      let url = "api/v1/excel/create_multisheet_excel",
        formData = new FormData(),
        options = {
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + this.token
          }
        };
      formData.append("obj", JSON.stringify(data));
      axios.post(url, formData, options).then(res => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        // console.log(res);
        var // json = JSON.stringify(res.data),
          blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download =
          "SVA " +
          moment(this.excel.export_sva.model.start).format("YYYY-MM-DD") +
          " to " +
          moment(this.excel.export_sva.model.end).format("YYYY-MM-DD") +
          ".xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    closeImportReport(e) {
      if (this.excel.import.importing) {
        this.$message({
          type: "warning",
          message:
            "You are not allowed to close this dialog until the process is done. If you want to checkout something on other pages, Please open another browser tab.",
          duration: 10000
        });
      } else {
        if (confirm("Are you sure you already reviewed the import report?")) {
          this.excel.import.dialog = false;
          this.excel.import.report.data.all.list = [];
          this.excel.import.report.data.errors.list = [];
          this.excel.import.loop_index = 0;
          this.excel.import.arr_length = 0;
        }
      }
    },
    handleCommand(e) {
      switch (e) {
        case "importSchedule":
          this.$refs.importScheduleInput.click();
          this.form.addSchedule.replicate = false;
          this.form.addSchedule.inapp = false;
          break;
        case "importScheduleQuarterly":
          this.$refs.importScheduleInput.click();
          this.form.addSchedule.replicate = true;
          this.form.addSchedule.inapp = false;
          break;
        case "exportSVA":
          this.excel.export_sva.field.dates = [];
          this.excel.export_sva.dialog = true;
          break;
      }
    },
    importScheduleFileChange(e) {
      let file = e.target.files[0],
        formData = new FormData(),
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        };
      formData.set("file", e.target.files[0]);
      formData.set("auth_id", this.user_id);
      formData.set("replicate", this.form.addSchedule.replicate);
      axios
        .post("api/v1/schedules/excel_to_array", formData, options)
        .then(res => {
          // console.log(res.data.meta);

          this.importScheduleReset = false;
          this.$nextTick(() => {
            this.importScheduleReset = true;
          });
          let data = res.data.meta.excel_data.map(i => ({
            title_id: 1,
            auth_id: this.user_id,
            om_id: i.om_id,
            tl_id: i.tl_id,
            email: i.email.toLowerCase(),
            start_event: moment(i.start_event).format("YYYY-MM-DD HH:mm:ss"),
            end_event: moment(i.end_event).format("YYYY-MM-DD HH:mm:ss"),
            replicate: i.replicate
          }));
          this.loopCreateSchedule(data);
        })
        .catch(err => console.log(err));
    },
    scheduleChunk(data, size){
        var i,j,tmparray=[], chunk = size;
        
        var array_report=[];

        for(i=0,j=data.length; i<j; i+=chunk){
          tmparray.push(data.slice(i,i+chunk));
        }

        return tmparray;
    },
    importArray(data){
      let tmp = this.excel.import.report.data.all.list;
      axios
        .post("api/v1/schedules/import", data)
        .then(res => {
          console.log(res);
          tmp.push(...res.data.parameters.report);
          this.excel.import.report.data.all.list = tmp;
        })
        .catch(err => console.log(err));
    },
    templateToInputRows(rows){
    let result=[];
      rows.forEach(((row,index)=>{
        if(index != 0){
          for(let l=0; l<7;l++){
            result.push([
              null,
              row[1],
              row[2],
              row[3],
              row[(l*3)+4], // schedule
              row[(l*3)+5], // timein
              row[(l*3)+6], // timeout
            ])
          }
        }
        
      }).bind(this));
    return result;
    },
    importScheduleFileChangeV2(e) {
      this.excel.import.dialog = true;
      readXlsxFile(e.target.files[0]).then((rows) => {
        let d_rows = this.templateToInputRows(rows);
        let body= d_rows.filter(i=> moment(i[5]).isValid()==true),data=[];
        
        this.excel.import.importing = true;
        this.excel.import.arr_length = body.length;

        this.excel.import.progress =
          (this.excel.import.report.data.all.list.length / this.excel.import.arr_length) *
          100;

        body.forEach(((v,i)=>{
          // insert replicate value
          // cell format for index 5 & 6 must be custom => m/d/yyyy h:mm
          v[5] = moment(v[5]).subtract(20,"hours").format("YYYY-MM-DD HH:mm:ss");
          v[6] = moment(v[6]).subtract(20,"hours").format("YYYY-MM-DD HH:mm:ss");

          v.push(this.form.addSchedule.replicate);
          data.push(v)
          }).bind(this)
        );

        
        let arr_data = this.scheduleChunk(data, 10);

        arr_data.forEach(((v,i)=>{
          let delay = i * 15000;
          setTimeout(function(){
            this.importArray(v);
          }.bind(this),delay);
        }).bind(this));
      })

      this.importScheduleReset = false;
      this.$nextTick(() => {
        this.importScheduleReset = true;
      });
    },
    
    processAddScheduleData() {
      let form = this.form.addSchedule.model;
      let data = [];
      form.agents.forEach((v, i) => {
        form.dates.forEach((v1, i1) => {
          const start = moment(
            moment(v1).format("YYYY-MM-DD") +
              " " +
              moment(form.time_in).format("HH:mm:ss")
          ).format("YYYY-MM-DD HH:mm:ss");
          const duration = moment(
            moment(form.duration).format("HH:mm:ss"),
            "HH:mm:ss"
          ).diff(moment().startOf("day"), "seconds");
          // alert(v1+" "+start+" "+duration)
          // alert(start + ' ' + duration)
          let row = [
            null,v, form.operationsManager,
            form.teamLeader,null, start,moment(moment(start).add(duration, "s")).format(
              "YYYY-MM-DD HH:mm:ss"
            ),this.form.addSchedule.replicate];
          data.push(
            row
          );
        });
      });

      // initialize
      this.excel.import.dialog = true;
      this.excel.import.importing = true;
      this.excel.import.arr_length = data.length;
      this.excel.import.progress = (this.excel.import.report.data.all.list.length / this.excel.import.arr_length) * 100;

      let arr_data = this.scheduleChunk(data,10);
      
      arr_data.forEach(((v,i)=>{
        let delay = i * 15000;
        setTimeout(function(){
          this.importArray(v);
        }.bind(this),delay);
      }).bind(this));
    },
    submitAddSchedule() {
      if (this.validateAddSchedule()) {
        this.form.addSchedule.inapp=true;
        this.processAddScheduleData();
      } else {
        this.$message({
          type: "warning",
          message: "Please fillup all form fields.",
          duration: 5000
        });
      }
    },
    validateAddSchedule() {
      const form = this.form.addSchedule.model;
      let result = false;
      if (this.form.addSchedule.model.auto_assign) {
        if (
          form.dates.length < 1 ||
          form.agents < 1 ||
          form.duration == null ||
          form.time_in == null
        ) {
          result = false;
        } else {
          result = true;
        }
      } else {
        if (
          form.dates.length < 1 ||
          form.agents < 1 ||
          form.duration == null ||
          form.time_in == null ||
          form.teamLeader == null ||
          form.operationsManager == null
        ) {
          result = false;
        } else {
          result = true;
        }
      }
      return result;
    },
    getUsersByPosition(query) {
      const position = {
        "operations manager": "om",
        "team leader": "tl"
      };
      const url =
        "api/v1/users?" +
        position[query.query] +
        "=true&start_date=" +
        query.start+" 00:00:00" +
        "&end_date=" +
        query.end+ " 23:59:59";
      const options = {
        headers: {
          Authorization: "Bearer " + this.token
        }
      };
      axios
        .get(url, options)
        .then(res => {
          let filtered = res.data.meta.metadata;
          if (query.query == "team leader") {
            if (this.position == "Team Leader") {
              filtered = res.data.meta.metadata.filter(
                i => i.parent_id == this.head.id
              );
            } else if (this.position == "Operations Manager") {
              filtered = res.data.meta.metadata.filter(
                i => i.parent_id == this.user_id
              );
            } else {
              filtered = res.data.meta.metadata.filter(
                i => i.parent_id == this.select.operationsManager
              );
              if (filtered.length > 0) {
                this.disable_select.teamLeader = false;
              } else {
                this.disable_select.teamLeader = true;
              }
            }
          }
          this.options[query.var] = filtered.map(function(v) {
            return { value: v.id, label: v.full_name };
          });
          this.options[query.var].unshift({ value: "all", label: "All" });
          this.select[query.var] = "all";
        })
        .catch(err => {
          console.log(err.response.data);
          this.options[query.var].unshift({ value: "all", label: "All" });
          this.select[query.var] = "all";
        });
    },
    showModal(type) {
      this.form[type].show = true;
    },
    weekChange(e) {
      // console.log(e);
      this.query.offset=0;
      this.query.om_id=null;
      this.query.tl_id=null;
      this.query.start = moment(moment(e)
        .isoWeekday(2)).startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      this.query.end = moment(moment(this.query.start)
        .add(6, "days")).endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      
      this.week.start = this.query.start;

      const range = moment.range(this.query.start, this.query.end);
      const dates = Array.from(range.by("day")).map(m =>
        m.format("YYYY-MM-DD")
      );

      this.tableHeader = dates.map(d => ({
        day: moment(d).format("ddd"),
        date: moment(d).format("YYYY-MM-DD"),
        date1: moment(d).format("MMM Do")
      }));   

      this.refetchSchedules();
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.query.offset = 0;
      this.refetchSchedules();
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.refetchSchedules();
    },
    plotSchedulePerDay(schedules, date) {
      const schedule = schedules.filter(
        i => moment(i.start_event.date).format("YYYY-MM-DD") == date
      );
      if (schedule.length == 0) {
        return [{}];
      } else {
        return schedule;
      }
    },
    refetchSchedules(){
      let data = this.query;
      switch(this.position.toLowerCase()){
        case "operations manager": 
          if(!this.query.tl_id){
            this.query.om_id = this.user_id;
          }
        break;
        case "team leader": 
          this.query.tl_id = this.user_id;
        break;
        default: 
        break;
      }
      this.fetchAgentsWorkReports({data});
    },
    dateToday(date) {
      if (moment(date).isSame(moment().format("YYYY-MM-DD"))) {
        return true;
      } else {
        return false;
      }
    },
    onSubmit() {
      const params = {
        user_id: this.form.addLeave.model.user_id,
        start_event: moment(this.form.addLeave.model.dates[0])
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        end_event: moment(this.form.addLeave.model.dates[1])
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        leave_type: this.form.addLeave.leave_type,
        status: "approved",
        generated_by: this.user_id,
        allowed_access: this.position_id
        // om_id: this.agents.agents.filter(i=>i.id == this.form.addLeave.model.user_id)[0].operations_manager.id
      };
      if (
        this.form.addLeave.leave_type != "loa1" &&
        this.form.addLeave.leave_type != "loa2"
      ) {
        this.createLeave(params);
      } else {
        if (
          confirm(
            "LOA1 and LOA2 do not have revert or cancel function. Please check your data before hitting OK."
          )
        ) {
          this.createLeave(params);
        }
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
    },
    remoteManager(query) {
      this.form.addSchedule.options.operationsManager.loader = true;
      this.form.addSchedule.options.operationsManager.request.full_name = query;
      let url =
        "api/v1/users/remote" +
        this.toUrlParams(
          this.form.addSchedule.options.operationsManager.request
        );
      this.axiosRequest("get", url, this.axios.options).then(res => {
        this.form.addSchedule.options.operationsManager.loader = false;
        if (res.code == 200) {
          this.form.addSchedule.options.operationsManager.data =
            res.meta.remote;
        } else {
          this.form.addSchedule.options.operationsManager.data = [];
        }
      });
    },
    remoteLeader(query) {
      this.form.addSchedule.options.teamLeader.loader = true;
      this.form.addSchedule.options.teamLeader.request.full_name = query;
      let url =
        "api/v1/users/remote" +
        this.toUrlParams(this.form.addSchedule.options.teamLeader.request);
      this.axiosRequest("get", url, this.axios.options).then(res => {
        this.form.addSchedule.options.teamLeader.loader = false;
        if (res.code == 200) {
          this.form.addSchedule.options.teamLeader.data = res.meta.remote;
        } else {
          this.form.addSchedule.options.teamLeader.data = [];
        }
      });
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
  /* border-left: 5px solid red !important; */
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
  font-size:.8em !important;
}
</style>