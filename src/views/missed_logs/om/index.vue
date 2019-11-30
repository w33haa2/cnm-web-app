<template>
  <div class="app-container">
    <h4 style="color:#646464">Missed Logs</h4>
    <div class="filter-container">
      <!-- DISPLAY RECORDS & PAGINATION -->
      <el-row :gutter="8" style="padding-right:8px;margin-bottom:15px;">
        <el-col :md="{span: 4}" style="margin-bottom:5px;">
          <el-input v-model="table.request.query" placeholder="Date or Employee..." size="mini"></el-input>
        </el-col>
        <el-col :md="{span:12,offset:8}">
          <el-radio-group v-model="table.request.type" size="mini" style="float:right">
            <el-radio-button :label="null">All</el-radio-button>
            <!-- <el-radio-button label="Washington">w/o Coaching</el-radio-button> -->
            <el-radio-button label="tardy">Tardy</el-radio-button>
            <el-radio-button label="undertime">Undertime</el-radio-button>
            <el-radio-button label="no_timeout">No Timeout</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :md="{span: 12,offset:12}">
          <el-pagination
            style="float:right"
            small
            background
            :page-sizes="[10, 25, 50, 100]"
            :current-page.sync="table.request.page"
            :page-size="table.request.perpage"
            layout="total, sizes, prev, pager, next"
            :total="fetchMissedLogsData.missed_logs.total"
            @current-change="tablePageChange"
            @size-change="tableSizeChange"
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-table
            :data="fetchMissedLogsData.missed_logs.data"
            v-loading="table.loader"
            @sort-change="columnSort"
          >
            <el-table-column label="Type">
              <template slot-scope="scope">
                <span
                  :style="scope.row.log_status[0]!='punctual'?'color:#F56C6C':''"
                >{{ scope.row.log_status[0] }}</span>
                <span>-</span>
                <span
                  :style="scope.row.log_status[1]!='timed_out'?'color:#F56C6C':''"
                >{{ scope.row.log_status[1] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Date" sortable="custom" prop="date">
              <template slot-scope="scope">
                <span>{{ scope.row.date.day+", "+ scope.row.date.ymd }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Employee" sortable="custom" prop="user_info.full_name">
              <template slot-scope="scope">
                <span>{{ scope.row.user_info.full_name }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="Supervisor" sortable="custom" prop="coaching.filed_by.full_name">
              <template slot-scope="scope">
                <span>{{ scope.row.coaching.filed_by.full_name }}</span>
              </template>
            </el-table-column>-->
            <el-table-column label="Schedule">
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.start_event.date,"","hh:mm a") +" - "+ formatDate(scope.row.end_event.date,"","hh:mm a") }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Log">
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.time_in.date,"","hh:mm a") +" - "}}</span>
                <template v-if="scope.row.time_out">
                  <span>{{ formatDate(scope.row.time_out.date,"","hh:mm a") }}</span>
                </template>
                <template v-else>
                  <span style="color:#F56C6C">No data</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="Coaching progress">
              <template slot-scope="scope">
                <template v-if="scope.row.log_status[1]=='no_timeout'">
                  <div
                    :style="scope.row.coaching?'cursor:pointer':''"
                    @click="scope.row.coaching?viewRow(scope.row):''"
                  >
                    <el-row gutter="1">
                      <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                        <el-tooltip
                          :content="scope.row.coaching?'Coaching available':'No coaching filed'"
                        >
                          <div
                            class="progress-box"
                            :style="'background-color:'+(scope.row.coaching?'#67C23A':'')"
                          ></div>
                        </el-tooltip>
                      </el-col>
                      <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                        <el-tooltip
                          :content="scope.row.coaching?
                        scope.row.coaching.filed_to_action?
                        scope.row.coaching.filed_to_action == 'approved'?'Approved':'Disapproved'
                        :'Waiting for agent response'
                        :'No coaching filed'"
                        >
                          <div
                            class="progress-box"
                            :style="'background-color:'+(scope.row.coaching?
                          scope.row.coaching.filed_to_action?
                          scope.row.coaching.filed_to_action == 'approved'?'#67C23A':'#F56C6C':'#E6A23C':'')"
                          ></div>
                        </el-tooltip>
                      </el-col>
                      <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                        <el-tooltip
                          :content="scope.row.coaching?
                        scope.row.coaching.filed_to_action?
                        scope.row.coaching.filed_to_action == 'approved'?
                        scope.row.coaching.verified_by?
                        'Verified'
                        :'Waiting for verification'
                        :'Process denied'
                        :'Waiting for agent response'
                        :'No coaching filed'"
                        >
                          <div
                            class="progress-box"
                            :style="'background-color:'+(scope.row.coaching?
                          scope.row.coaching.filed_to_action?
                          scope.row.coaching.filed_to_action == 'approved'?
                        scope.row.coaching.verified_by?
                        '#67C23A'
                        :'#E6A23C'
                        :'#F56C6C'
                        :''
                        :'')"
                          ></div>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </div>
                </template>
                <template v-else>
                  <el-tag type="info" style="text-align:center;width:100%">Coaching Unavailable</el-tag>
                </template>
              </template>
            </el-table-column>
            <template v-if="position.toLowerCase() == 'team leader'">
            <el-table-column label="Coaching" width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.log_status[1]=='no_timeout'">
                  <template v-if="scope.row.coaching">
                    <!-- if coaching exist -->
                    <el-button-group style="width:100%">
                      <el-button
                        size="mini"
                        type="warning"
                        style="width:50%"
                        @click="updateRow(scope.row)"
                        :disabled="scope.row.coaching.filed_to_action"
                      >
                        <i class="el-icon-edit" />
                      </el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        style="width:50%"
                        @click="deleteRow(scope.row)"
                        :disabled="scope.row.coaching.filed_to_action"
                      >
                        <i class="el-icon-delete" />
                      </el-button>
                    </el-button-group>
                  </template>
                  <template v-else>
                    <el-button
                      size="mini"
                      type="primary"
                      style="width:100%"
                      @click="createFormCoaching(scope.row)"
                    >
                      <i class="el-icon-plus" />
                    </el-button>
                  </template>
                </template>
                <template v-else>
                  <el-tag type="info" style="width:100%;text-align:center">No Action</el-tag>
                </template>
              </template>
            </el-table-column>
            </template>
          </el-table>
        </el-col>
      </el-row>
    </div>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.coaching.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.coaching.action+' Coaching'"
      width="30%"
      top="5vh"
    >
      <el-row>
        <template v-if="form.coaching.action!='View'">
          <el-col style="margin-bottom:10px;">
            <span
              style="font-size:0.8em"
            >{{ form.coaching.field.imageName ? form.coaching.field.imageName : "Select image file."}}</span>
          </el-col>
          <el-col style="margin-bottom:10px;">
            <el-button size="mini" @click="uploadProofClick">Upload Proof</el-button>
            <input
              ref="proofInput"
              type="file"
              style="display:none"
              @change="proofChange"
              accept="image/x-png, image/jpeg"
            />
          </el-col>
        </template>
        <template v-if="form.coaching.action!='Create'">
          <el-button size="mini" @click="showProof()">Show Proof</el-button>
        </template>
        <el-col>
          <h5>Coaching Details</h5>
        </el-col>
        <el-col :md="8" style="margin-bottom:5px;">
          <span>Employee</span>
        </el-col>
        <el-col :md="16" style="margin-bottom:5px;">
          <span>{{ form.coaching.details.full_name }}</span>
        </el-col>
        <el-col :md="8" style="margin-bottom:5px;">
          <span>Date</span>
        </el-col>
        <el-col :md="16" style="margin-bottom:5px;">
          <span>{{ form.coaching.details.date }}</span>
        </el-col>
        <el-col :md="8" style="margin-bottom:5px;">
          <span>Schedule</span>
        </el-col>
        <el-col :md="16" style="margin-bottom:5px;">
          <span>{{ form.coaching.details.schedule }}</span>
        </el-col>
        <el-col :md="8" style="margin-bottom:5px;">
          <span>Logs</span>
        </el-col>
        <el-col :md="16" style="margin-bottom:5px;">
          <span>{{ form.coaching.details.attendance }}</span>
        </el-col>
        <el-col :md="8" style="margin-bottom:5px;">
          <span>Log's status</span>
        </el-col>
        <el-col :md="16" style="margin-bottom:5px;">
          <span>{{ form.coaching.details.log_status }}</span>
        </el-col>
        <el-col>
          <h5>Remarks</h5>
        </el-col>
        <template v-if="form.coaching.action!='View'">
          <el-col>
            <el-input
              type="textarea"
              autosize
              placeholder="Please input"
              v-model="form.coaching.field.remarks"
            ></el-input>
          </el-col>
        </template>
        <template v-else>
          <el-col>
            <p>{{ form.coaching.field.remarks }}</p>
          </el-col>
        </template>
        <template v-if="form.coaching.action!='Create'">
          <el-col>
            <h5>Coached By:</h5>
          </el-col>
          <el-col :md="24" style="margin-bottom:5px;">
            <span>{{ form.coaching.details.coach }}</span>
          </el-col>
        </template>
        <template v-if="form.coaching.details.verified_by">
          <el-col>
            <h5>Verified By</h5>
          </el-col>
          <el-col :md="24" style="margin-bottom:5px;">
            <span>{{ form.coaching.details.verified_by.full_name }}</span>
          </el-col>
        </template>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFormCoaching">Cancel</el-button>
        <template v-if="form.coaching.action!='View'">
          <template v-if="position.toLowerCase()=='team leader'">
          <el-button
            type="danger"
            size="mini"
            :loading="form.coaching.btn.confirm.loader"
            @click="submitCoachingForm()"
          >Confirm</el-button>
          </template>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "RTA-MissedLogs",
  components: {},
  data() {
    return {
      axios: {
        options: {
          headers: {
            Authorization: null
          }
        }
      },
      form: {
        coaching: {
          dialog: false,
          action: "Create",
          btn: {
            confirm: {
              loader: false
            }
          },
          details: {
            proof: null,
            full_name: null,
            date: null,
            schedule: null,
            attendance: null,
            log_status: null,
            coach:null,
            verified_by:null,
          },
          field: {
            imageName: null,
            image: null,
            remarks: null,
            sched_id: null,
            status: null,
            filed_by: null,
            filed_to: null,
            type: null,
            id: null
          }
        }
      },
      table: {
        loader: false,
        request: {
          page: 1,
          perpage: 10,
          query: null,
          tl_id: null,
          om_id: null,
          id: null,
          status: null,
          type: null
        }
      }
    };
  },
  created() {
    this.axios.options.headers = "Bearer " + this.token;
    if (this.position == "Team Leader") {
      this.table.request.tl_id = this.user_id;
    } else if (this.position == "Operations Manager") {
      this.table.request.om_id = this.user_id;
    }
    this.fetchMissedLogs(this.unsetNull(this.table.request));
  },
  computed: {
    ...mapGetters([
      "position",
      "user_id",
      "token",
      "fetchMissedLogsState",
      "fetchMissedLogsData",
      "fetchMissedLogsTitle",
      "createCoachingState",
      "createCoachingData",
      "createCoachingTitle"
    ])
  },
  watch: {
    fetchMissedLogsState({ initial, success, fail }) {
      if (initial) {
        this.table.loader = true;
      }
      if (success) {
        this.table.loader = false;
      }
      if (fail) {
        this.table.loader = false;
      }
    },
    "table.request.query": function(v) {
      setTimeout(() => {
        this.fetchMissedLogs(this.unsetNull(this.table.request));
      }, 3000);
    },
    "table.request.status": function(v) {
      this.fetchMissedLogs(this.unsetNull(this.table.request));
    },
    "table.request.type": function(v) {
      this.fetchMissedLogs(this.unsetNull(this.table.request));
    }
  },
  methods: {
    ...mapActions(["fetchMissedLogs", "createCoaching"]),
    columnSort({ column, prop, order }) {
      this.table.request.sort = order ? prop : "date.ymd";
      this.table.request.order = order
        ? order == "ascending"
          ? "asc"
          : "desc"
        : "desc";
      this.fetchMissedLogs(this.unsetNull(this.table.request));
    },
    showProof() {
      window.open(this.form.coaching.details.proof, "_blank");
    },
    viewRow(data) {
      this.form.coaching.dialog = true;
      this.form.coaching.field.id = data.coaching.id;
      this.form.coaching.details.full_name = data.user_info.full_name;
      this.form.coaching.details.date = this.formatDate(
        data.start_event.date,
        "",
        "MMM Do, YYYY"
      );
      this.form.coaching.details.schedule =
        this.formatDate(data.start_event.date, "", "hh:mm a") +
        " - " +
        this.formatDate(data.end_event.date, "", "hh:mm a");
      this.form.coaching.details.attendance =
        this.formatDate(data.time_in.date, "", "hh:mm a") +
        " - " +
        (data.time_out
          ? this.formatDate(data.time_out.date, "", "hh:mm a")
          : "no log");
      this.form.coaching.details.log_status =
        this.remUnderscore(data.log_status[0]) +
        " - " +
        this.remUnderscore(data.log_status[1]);
      this.form.coaching.field.sched_id = data.id;
      this.form.coaching.field.status = data.coaching.status;
      this.form.coaching.field.type = data.coaching.type;
      this.form.coaching.field.filed_by = data.coaching.filed_by.id;
      this.form.coaching.field.filed_to = data.user_info.id;
      this.form.coaching.action = "View";
      this.form.coaching.field.remarks = data.coaching.remarks;
      this.form.coaching.details.proof = data.coaching.img_proof_url;
      this.form.coaching.details.coach = data.coaching.filed_by.full_name;
      this.form.coaching.details.verified_by = data.coaching.verified_by;
    },
    updateRow(data) {
      // if (true) {
      //   this.$message({
      //     type:"warning",
      //     message:"You cannot modify coaching once verified.",
      //     duration:5000
      //   });
      // } else {
      this.form.coaching.dialog = true;
      this.form.coaching.details.proof = data.coaching.img_proof_url;
      this.form.coaching.field.id = data.coaching.id;
      this.form.coaching.details.full_name = data.user_info.full_name;
      this.form.coaching.details.date = this.formatDate(
        data.start_event.date,
        "",
        "MMM Do, YYYY"
      );
      this.form.coaching.details.schedule =
        this.formatDate(data.start_event.date, "", "hh:mm a") +
        " - " +
        this.formatDate(data.end_event.date, "", "hh:mm a");
      this.form.coaching.details.attendance =
        this.formatDate(data.time_in.date, "", "hh:mm a") +
        " - " +
        (data.time_out
          ? this.formatDate(data.time_out.date, "", "hh:mm a")
          : "No data");
      this.form.coaching.details.log_status =
        data.log_status[0] + " - " + data.log_status[1];
      this.form.coaching.field.sched_id = data.id;
      this.form.coaching.field.status = data.coaching.status;
      this.form.coaching.field.type = data.coaching.type;
      this.form.coaching.field.filed_by = data.coaching.filed_by.id;
      this.form.coaching.field.filed_to = data.user_info.id;
      this.form.coaching.action = "Update";
      this.form.coaching.field.remarks = data.coaching.remarks;
      this.form.coaching.field.imageName = "Select new image proof.";
      this.form.coaching.details.coach = data.coaching.filed_by.full_name;
      this.form.coaching.details.verified_by = data.coaching.verified_by;
      // }
    },
    deleteRow(data) {
      // if (data.coaching.verified_by) {
      //   this.$message({
      //     type:"warning",
      //     message:"You cannot modify coaching once verified.",
      //     duration:5000
      //   });
      // } else {
      if (confirm("Are you sure you want to delete?")) {
        axios
          .post(
            "api/v1/coaching/delete/" + data.coaching.id,
            this.axios.options.headers
          )
          .then(res => {
            this.$message({
              type: "success",
              message: res.data.title,
              duration: 5000
            });
            this.fetchMissedLogs(this.unsetNull(this.table.request));
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err.response.data.title,
              duration: 5000
            });
          });
      }
      // }
    },
    toFormData(obj) {
      // alert("form data created")
      const fd = new FormData();
      const tmp = Object.keys(obj);
      tmp.forEach((v, i) => {
        if (obj[v]) {
          fd.append(v, obj[v]);
        }
      });
      return fd;
    },
    submitCoachingForm() {
      let data = this.toFormData(this.form.coaching.field),
        url = "api/v1/coaching/create";
      this.form.coaching.btn.confirm.loader = true;
      if (this.form.coaching.action == "Update") {
        url = "api/v1/coaching/update";
      }

      axios
        .post(url, data, this.axios.options.headers)
        .then(res => {
          this.form.coaching.btn.confirm.loader = false;
          this.cancelFormCoaching();
          this.$message({
            type: "success",
            message: res.data.title,
            duration: 5000
          });
          this.fetchMissedLogs(this.unsetNull(this.table.request));
        })
        .catch(err => {
          this.form.coaching.btn.confirm.loader = false;
          this.$message({
            type: "error",
            message: err.response.data.title,
            duration: 5000
          });
        });
    },
    cancelFormCoaching() {
      this.form.coaching.dialog = false;
      this.form.coaching.action = "Create";
      this.form.coaching.field.id = null;
      this.form.coaching.details.proof = null;
      this.form.coaching.details.full_name = null;
      this.form.coaching.details.date = null;
      this.form.coaching.details.schedule = null;
      this.form.coaching.details.attendance = null;
      this.form.coaching.details.log_status = null;
      this.form.coaching.field.imageName = null;
      this.form.coaching.field.image = null;
      this.form.coaching.field.remarks = null;
      this.form.coaching.field.sched_id = null;
      this.form.coaching.field.status = null;
      this.form.coaching.field.filed_by = null;
      this.form.coaching.field.filed_to = null;
      this.form.coaching.field.type = null;
    },
    createFormCoaching(data) {
      this.form.coaching.dialog = true;
      this.form.coaching.details.full_name = data.user_info.full_name;
      this.form.coaching.details.date = this.formatDate(
        data.start_event.date,
        "",
        "MMM Do, YYYY"
      );
      this.form.coaching.details.schedule =
        this.formatDate(data.start_event.date, "", "hh:mm a") +
        " - " +
        this.formatDate(data.end_event.date, "", "hh:mm a");
      this.form.coaching.details.attendance =
        this.formatDate(data.time_in.date, "", "hh:mm a") +
        " - " +
        (data.time_out
          ? this.formatDate(data.time_out.date, "", "hh:mm a")
          : "No data");
      this.form.coaching.details.log_status =
        data.log_status[0] + " - " + data.log_status[1];
      this.form.coaching.field.sched_id = data.id;
      this.form.coaching.field.status = "pending";
      this.form.coaching.field.type = "missed_logs";
      this.form.coaching.field.filed_by = this.user_id;
      this.form.coaching.field.filed_to = data.user_info.id;
    },
    uploadProofClick() {
      this.$refs.proofInput.click();
    },
    proofChange(e) {
      var fileData = e.target.files[0];
      this.form.coaching.field.imageName = fileData.name;
      this.form.coaching.field.image = fileData;
    },
    tablePageChange(e) {
      this.fetchMissedLogs(this.unsetNull(this.table.request));
    },
    tableSizeChange(e) {
      this.table.request.perpage = e;
      this.table.request.page = 1;
      this.fetchMissedLogs(this.unsetNull(this.table.request));
    }
  }
};
</script>


<style lang="scss">
.progress-box {
  background-color: #ccc;
  width: 100%px;
  height: 20px;
}
.card-content-text {
  color: #777;
  font-size: 0.7em;
}
.clear-fix:before,
.clear-fix:after {
  display: table;
  content: "";
}

.clear-fix:after {
  clear: both;
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