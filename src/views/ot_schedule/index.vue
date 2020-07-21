<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px">
              Overtime Schedules
            </div>
            <div
              class="button-icon round active"
              style="display:flex;justify-content:center;margin-right:5px;"
              @click="createForm"
            >
              <el-tooltip placement="top" content="Add VTO">
                <plus-icon></plus-icon>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 5, offset: 7 }">
          <div class="d-flex">
            <div style="width:60px;">
              <filter-or @filter="filterOr" :disabled="fetchOvertimeScheduleState.initial"></filter-or>
            </div>
            <div style="width:100%">
              <el-tooltip content="Select Date">
                <el-date-picker
                  :disabled="!filter || searchOvertimeScheduleState.initial"
                  type="date"
                  v-model="searchQuery"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                  placeholder="Select date..."
                  :clearable="false"
                  style="width:100%"
                ></el-date-picker>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="table-container shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          {{ formatDate(searchQuery,"","ddd. MMM Do, YYYY") }}
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-pagination
            style="float:right"
            :page-sizes="[10, 25, 50]"
            :pager-count="5"
            :page-size="table_config.display_size"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            :current-page.sync="table_config.page"
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
            background
            small
          />
        </el-col>
        <el-col :md="{ span: 24 }">
          <!-- Table -->
          <el-table
            :data="table_config.data"
            style="width: 100%;margin-top:5px;"
            v-loading="fetchOvertimeScheduleState.initial || searchOvertimeScheduleState.initial"
            class="monday"
          >
            <el-table-column label="Schedule">
              <template slot-scope="scope">
                <span style="padding-left:20px;font-size:1.2em;">{{
                  formatDate(
                    scope.row.start_event,
                    "",
                    "MMM Do, YYYY hh:mm a"
                  ) +
                    " - " +
                    formatDate(scope.row.end_event, "", "MMM Do, YYYY hh:mm a")
                }}</span>
                <span
                  v-if="ongoing(scope.row.start_event, scope.row.end_event)"
                >
                  <small style="color:#409EFF">ONGOING</small>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Agents" width="200">
              <template slot-scope="scope">
                <span style="font-size:1.5em">{{ scope.row.schedules.length }}</span>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-tooltip placement="top" content="Preview">
                  
                <div
                  style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                  @click="previewSched(scope.row)"
                >
                  <div style="align-self:center;color:gray;font-size:2em">
                    <eye-icon></eye-icon>
                  </div>
                </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-tooltip placement="top" content="Export to excel">
                  
                <div
                  style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                  @click="exportAgentOt(scope.row)"
                >
                  <div style="align-self:center;color:gray;font-size:2em">
                    <ms-excel-icon></ms-excel-icon>
                  </div>
                </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-tooltip placement="top" content="Update">
                <div
                  style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                  @click="updateRow(scope.row)"
                >
                  <div style="align-self:center;color:gray;font-size:2em">
                    <square-edit-icon></square-edit-icon>
                  </div>
                </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-tooltip placement="top" content="Delete">
                  <div
                    style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                    @click="deleteRow(scope.row)"
                  >
                    <div style="align-self:center;color:gray;font-size:2em">
                      <delete-icon></delete-icon>
                    </div>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.action + ' Overtime Schedule'"
      width="35%"
    >
      <el-row>
        <el-col>
          <div class="form-label">Schedule</div>
          <div class="form-item">
            <el-date-picker
              style="width:100%"
              type="datetimerange"
              placeholder="Set schedule..."
              v-model="form.schedule"
              :editable="false"
              :clearable="false"
              size="mini"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm" size="mini">Cancel</el-button>
        <el-button
          type="danger"
          @click="submitForm"
          size="mini"
          :loading="form.confirm"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import filterOr from "@/components/reusables/filter_button";
import axios from "axios";
export default {
  components:{filterOr},
  data() {
    return {
      searchQuery: moment().format("YYYY-MM-DD"),
      filter:false,
      table_config: {
        display_size: 10,
        page: 1,
        loader: false,
        data: [],
        count: 0
      },
      query: {
        offset: 0,
        limit: 10,
        order: "desc",
        sort: "created_at",
        relations: ["schedules"]
      },
      form: {
        confirm: false,
        show: false,
        action: "Create",
        update_id: null,
        schedule: null,
        model: {
          start_event: null,
          end_event: null
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "fetchOvertimeScheduleState",
      "fetchOvertimeScheduleData",
      "fetchOvertimeScheduleError",
      "searchOvertimeScheduleState",
      "searchOvertimeScheduleData",
      "searchOvertimeScheduleError",
      "createOvertimeScheduleState",
      "createOvertimeScheduleData",
      "createOvertimeScheduleError",
      "updateOvertimeScheduleState",
      "updateOvertimeScheduleData",
      "updateOvertimeScheduleTitle",
      "deleteOvertimeScheduleState",
      "deleteOvertimeScheduleData",
      "deleteOvertimeScheduleTitle"
    ])
  },
  created() {
    this.fetchOT(this.query);
  },
  watch: {
    "form.schedule": function(v) {
      this.form.model.start_event = moment(v[0]).format("YYYY-MM-DD HH:mm:ss");
      this.form.model.end_event = moment(v[1]).format("YYYY-MM-DD HH:mm:ss");
    },
    fetchOvertimeScheduleState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
        this.table_config.data = [];
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.fetchOvertimeScheduleData.overtimes;
        this.table_config.count = this.fetchOvertimeScheduleData.count;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
        this.table_config.count = 0;

      }
    },
    searchOvertimeScheduleState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
        this.table_config.data = [];
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.searchOvertimeScheduleData.overtime;
        this.table_config.count = this.searchOvertimeScheduleData.count;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
        this.table_config.count = 0;
      }
    },
    searchQuery(v) {
      this.fetchOT();
    },
    createOvertimeScheduleState({ initial, success, fail }) {
      if (initial) {
        this.form.confirm = true;
      }
      if (success) {
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchOT(this.query);
        this.$message({
          type: "success",
          message: "You have successfully created a schedule."
        });
      }
      if (fail) {
        this.form.confirm = false;
        this.$message({
          type: "error",
          message: "There is a problem in creating the schedule."
        });
      }
    },
    updateOvertimeScheduleState({ initial, success, fail }) {
      if (initial) {
        this.form.confirm = true;
      }
      if (success) {
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchOT(this.query);
        this.$message({
          type: "success",
          message: this.updateOvertimeScheduleTitle,
          duration: 5000
        });
      }
      if (fail) {
        this.form.confirm = false;
        this.$message({
          type: "error",
          message: this.updateOvertimeScheduleTitle,
          duration: 5000
        });
      }
    },
    deleteOvertimeScheduleState({ initial, success, fail }) {
      if (success) {
        this.query.offset = 0;
        this.fetchOT(this.query);
        this.$message({
          type: "success",
          message: this.deleteOvertimeScheduleTitle
        });
      }
      if (fail) {
        this.$message({
          type: "error",
          message: this.deleteOvertimeScheduleTitle
        });
      }
    }
  },
  methods: {
    fetchOT(){
      if(this.filter){
        this.query.offset = 0;
        if (this.searchQuery !== "" && this.searchQuery !== null) {
          this.query.target = ["start_event"];
          this.query.query = moment(this.searchQuery).format("YYYY-MM-DD");
          this.searchOvertimeSchedule(this.query);
        }
      }else{
        this.query.target=null;
        this.query.query = null;
        this.fetchOvertimeSchedule(this.query);
      }
    },
    filterOr(v){
      this.filter = v;
      this.fetchOT(this.query)
    },
    ...mapActions([
      "fetchOvertimeSchedule",
      "searchOvertimeSchedule",
      "createOvertimeSchedule",
      "updateOvertimeSchedule",
      "deleteOvertimeSchedule"
    ]),
    exportToExcel(data, filename) {
      let url = "api/v1/excel/create_multisheet_excel",
        options = {
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + this.token
          }
        },
        fd = new FormData();
      fd.append("obj", JSON.stringify(data));
      axios.post(url, fd, options).then(res => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var // json = JSON.stringify(res.data),
          blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename + ".xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    exportAgentOt(data) {
      let url = "api/v1/schedules?overtime_id=" + data.id;
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token
          }
        })
        .then(res => {
          let result = res.data.meta.agent_schedules;
          result = result.map(i => [
            i.user_info.full_name,
            moment(i.time_in.date).format("YYYY-MM-DD hh:mm a"),
            i.time_out
              ? moment(i.time_out.date).format("YYYY-MM-DD hh:mm a")
              : "ongoing"
          ]);
          result.unshift([]);
          result.unshift(["Agent", "Time In", "Time Out"]);
          result.unshift([]);
          result.unshift([
            "Agent Overtime (" + data.start_event + " - " + data.end_event + ")"
          ]);
          this.exportToExcel(
            {
              content: [
                {
                  sheet_data: result,
                  sheet_name: "Agent Overtime"
                }
              ]
            },
            "Agent Overtime " + data.start_event + " - " + data.end_event
          );
          // console.log(result);
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "There is a problem fetching your request.",
            duration: 5000
          });
        });
    },
    previewSched(data) {
      const otId = data.id;
      this.$router.push({ path: `/overtime_agents/${otId}` });
    },

    deleteRow(data) {
      // if (
      //   this.ongoing(data.start_event, data.end_event) ||
      //   moment(moment(data.end_event).format("YYYY-MM-DD HH:mm:ss")).isBefore(
      //     moment().format("YYYY-MM-DD HH:mm:ss")
      //   )
      // ) {
      //   this.$message({
      //     type: "warning",
      //     message: "You cannot update/delete ongoing or past schedules.",
      //     duration: 5000
      //   });
      // } else {
      if (confirm("Do you want to proceed?")) {
        this.deleteOvertimeSchedule({ id: data.id });
      }
      // }
    },
    submitForm() {
      let data = this.form.model;
      if (this.form.action == "Create") {
        if (
          moment(
            moment(data.start_event).format("YYYY-MM-DD HH:mm:ss")
          ).isBefore(moment().format("YYYY-MM-DD HH:mm:ss"))
        ) {
          this.$message({
            type: "warning",
            message: "Please enter future dates.",
            duration: 5000
          });
        } else {
          data.id = null;
          this.createOvertimeSchedule(data);
        }
      } else {
        data.id = this.form.update_id;
        // if(this.ongoing(data.start_event,data.end_event) || moment(moment(data.end_event).format("YYYY-MM-DD HH:mm:ss")).isBefore(moment().format("YYYY-MM-DD HH:mm:ss"))){
        //   this.$message({
        //     type:"warning",
        //     message: "You cannot update/delete ongoing or past schedules.",
        //     duration:5000
        //   });
        // }else{
        this.updateOvertimeSchedule(data);
        // }
      }
    },
    updateRow(row) {
      this.form.action = "Update";
      this.form.update_id = row.id;
      this.form.show = true;
      this.form.schedule = [row.start_event, row.end_event];
    },
    createForm() {
      this.form.show = true;
    },
    cancelForm() {
      this.resetForm();
      this.form.show = false;
    },
    resetForm() {
      this.form.action = "Create";
      this.form.schedule = null;
    },
    filterHeadName(head_id) {
      return accesslevels.filter(i => i.id == head_id)[0].name;
    },
    tableSizeChange(value) {
      this.query.limit = value;
      const data = this.query;
      this.fetchOT(data);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchOT(data);
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
  height:45px;
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
