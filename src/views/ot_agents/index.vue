<template>
  <div class="app-container">
    <h4 style="color:#646464">Overtime Agents</h4>
    <h4>
      <small>{{schedule}}</small>
    </h4>
    <el-row>
      <el-col :md="{span:4}">
        <el-input size="mini" v-model="table.request.query" placeholder="Search"></el-input>
      </el-col>
      <el-col :md="{span:20}">
        <el-pagination
          style="float:right"
          :page-sizes="[10,25,50]"
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
      <template v-if="isRTA()">
        <el-col :md="{span:4,offset:20}" style="margin-top:5px">
          <el-button style="float:right" size="mini" @click="exportAgentOt()">Export</el-button>
        </el-col>
      </template>
      <el-col style="margin-top:20px;">
        <!-- Table -->
        <el-table :data="table.data" style="width: 100%;margin-top:30px;" v-loading="table.loader">
          <el-table-column label="Agent">
            <template slot-scope="scope">
              <div class="user-block">
                <img
                  v-if="scope.row.user_info.image_url"
                  class="img-circle"
                  :src="scope.row.user_info.image_url"
                />
                <div
                  v-else
                  class="img-circle text-muted"
                  style="background-color:#d9d9d9;display:flex"
                >
                  <div
                    style="align-self:center;width:100%;text-align:center;"
                    class="text-point-eight-em"
                  >{{ getAvatarLetters(scope.row.user_info.firstname,scope.row.user_info.lastname) }}</div>
                </div>
                <span>{{ scope.row.user_info.full_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Log">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.time_in.date,"","MMM Do, YYYY hh:mm a")}}</span> -
              <span
                v-if="scope.row.time_out"
              >{{formatDate(scope.row.time_out.date,"","MMM Do, YYYY hh:mm a")}}</span>
              <span v-else style="color:#409EFF">ONGOING</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import tabContent from "./components/tabContent";

export default {
  components: { tabContent },
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
          "target[]": null,
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
    this.fetchTable();
  },
  watch: {
    "table.request.query": function(v) {
      if (v != "" || v != null) {
        this.table.request["target[]"] = "full_name";
      } else {
        this.table.request["target[]"] = null;
      }
      this.fetchTable();
    },
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
    ...mapActions(["fetchOvertimeSchedule"]),
    fetchTable() {
      this.table.loader = true;
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
      alert(value);
      this.table.page = 1;
      this.table.request.offset = 0;
      this.table.request.limit = value;
      // this.fetchOvertime();
      this.fetchTable();
    },
    tablePageChange(value) {
      alert(value);
      this.table.page = value;
      this.table.request.offset = (value - 1) * this.table.request.limit;
      // this.fetchOvertime();
      this.fetchTable();
    }
  }
};
</script>

<style lang="scss" scoped>
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
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
