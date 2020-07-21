<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px;">
              Overtime Agents
            </div>

            <div
              class="button-icon round excel"
              style="display:flex;justify-content:center;margin-right:10px;"
              @click="exportAgentOt()"
            >
              <el-tooltip placement="top" content="Export to Excel">
                <export-icon></export-icon>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-input
            @input="debounceInput"
            v-model="table.request.query"
            placeholder="Search"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="table-container shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          {{ schedule }}
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-pagination
            style="float:right"
            :pager-count="5"
            :page-sizes="[10, 25, 50]"
            :page-size="table.request.limit"
            layout="total, sizes, prev, pager, next"
            :total="table.count"
            :current-page.sync="table.page"
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
            background
            small
          />
        </el-col>
        <el-col>
          <!-- Table -->
          <el-table
            :data="table.data"
            style="width: 100%;margin-top:5px;"
            v-loading="table.loader || fetchOvertimeScheduleState.initial"
            class="monday"
          >
            <el-table-column
              label="Name"
              align="left"
              width="350"
              fixed
            >
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-tooltip
                    :content="scope.row.user_info.email"
                    placement="top"
                  >
                    <div
                      style="width:100%;align-self:center;padding-left:20px;"
                    >
                      {{ scope.row.user_info.full_name }}
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50" fixed>
              <template slot-scope="scope">
                <div class="user-block">
                  <div v-if="scope.row.user_info.image_url" style="width:100%;">
                    <div style="margin:0 auto;height:30px;width:30px;">
                      <img
                        class="img-circle"
                        style="margin:0 auto;"
                        :src="scope.row.user_info.image_url"
                      />
                    </div>
                  </div>
                  <div v-else class="text-muted" style="width:100%;">
                    <div
                      class="img-circle"
                      style="background-color:white;margin:0 auto;"
                    >
                      <div style="display:flex;height:30px;width:30px;">
                        <div
                          style="align-self:center;width:100%;text-align:center;font-weight:bold;font-size:.8em"
                        >
                          {{
                            getAvatarLetters(
                              scope.row.user_info.firstname,
                              scope.row.user_info.lastname
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Log">
              <template slot-scope="scope">
                <span>{{
                  formatDate(scope.row.time_in.date, "", "MMM Do, YYYY hh:mm a")
                }}</span>
                -
                <span v-if="scope.row.time_out">{{
                  formatDate(
                    scope.row.time_out.date,
                    "",
                    "MMM Do, YYYY hh:mm a"
                  )
                }}</span>
                <span v-else style="color:#409EFF">ONGOING</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import { debounce } from "debounce";

export default {
  name:"overtimeAgents",
  data() {
    return {
      schedule: null,
      axios: {
        options: {
          headers: {
            Authorization: null
          }
        }
      },
      table: {
        data: [],
        count: 0,
        loader: false,
        page: 1,
        request: {
          limit: 10,
          offset: 0,
          overtime_id: this.$route.params.id,
          order: "desc",
          sort: "created_at",
          target: null,
          query: null
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "fetchOvertimeScheduleData",
      "fetchOvertimeScheduleState"
    ])
  },
  mounted() {
    this.axios.options.headers.Authorization = "Bearer " + this.token;
    this.fetchOvertimeSchedule({ id: this.$route.params.id });
  },
  watch: {
    fetchOvertimeScheduleState({ initial, success, fail }) {
      if (success) {
        this.schedule =
          this.formatDate(
            this.fetchOvertimeScheduleData.overtime.start_event,
            "YYYY-MM-DD HH:mm:ss",
            "MMM DD, YYYY hh:mm a"
          ) +
          " to " +
          this.formatDate(
            this.fetchOvertimeScheduleData.overtime.end_event,
            "YYYY-MM-DD HH:mm:ss",
            "MMM DD, YYYY hh:mm a"
          );
        this.fetchTable();
      }
    },
    approveOvertimeSchedulesState({ initial, success, fail }) {
      if (initial) {
        this.form.approve_ot.confirm = true;
      }
      if (success) {
        this.form.approve_ot.confirm = false;
        this.form.approve_ot.dialog = false;
        this.refresh_table = !this.refresh_table;
      }
      if (fail) {
        this.form.approve_ot.confirm = false;
        this.$message({
          type: "warning",
          message: this.approveOvertimeSchedulesError,
          duration: 5000
        });
      }
    }
    // create function
  },
  methods: {
    debounceInput:debounce(function(e){
      this.fetchTable();
    },1000),
    ...mapActions(["fetchOvertimeSchedule"]),
    fetchTable() {
      this.table.loader = true;
      
      if (this.table.request.query != "" && this.table.request.query != null) {
        this.table.request.target = ["full_name"];
      } else {
        this.table.request.target = null;
        this.table.request.query = null;
      }

      let url = "api/v1/schedules" + this.toUrlParams(this.table.request);
      axios
        .get(url, this.unsetNull(this.table.request), this.axios.options)
        .then(res => {
          this.table.loader = false;
          this.table.data = res.data.meta.agent_schedules;
          this.table.count = res.data.meta.count;
        })
        .catch(err => {
          this.table.loader = false;
          this.table.data = [];
          this.table.count = 0;
        });
    },
    exportAgentOt() {
      // url creation
      let url = "api/v1/schedules?overtime_id=" + this.$route.params.id;
      axios
        .get(url, this.axios.options)
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
          result.unshift(["Agent Overtime (" + this.schedule + ")"]);
          this.exportToExcel(
            {
              content: [
                {
                  sheet_data: result,
                  sheet_name: "Agent Overtime"
                }
              ]
            },
            "Agent Overtime " + this.schedule
          );
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "There is a problem fetching your request.",
            duration: 5000
          });
        });
    },
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
    tableSizeChange(value) {
      this.table.page = 1;
      this.table.request.offset = 0;
      this.table.request.limit = value;
      this.fetchTable();
    },
    tablePageChange(value) {
      this.table.page = value;
      this.table.request.offset = (value - 1) * this.table.request.limit;
      this.fetchTable();
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

