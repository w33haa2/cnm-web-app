<template>
  <div>
    <div class="app-container">
      <div class="title-bar shadow">
        <el-row :gutter="10">
          <el-col :md="{ span: 12 }">
            <div class="d-flex">
              <div class="title-wrapper">
                Missed Logs
              </div>
            </div>
          </el-col>
          <el-col :md="{ span: 8 }">
            <el-input
              v-model="table.request.query"
              placeholder="Date..."
              @input="debounceInput"
              :disabled="fetchMissedLogsState.initial"
            ></el-input>
          </el-col>
          <el-col :md="{ span: 4 }">
            <el-select
              v-model="table.request.type"
              :disabled="fetchMissedLogsState.initial"
            >
              <el-option :value="null" label="All" />
              <el-option value="tardy" label="Tardy" />
              <el-option value="undertime" label="Undertime" />
              <el-option value="no_timeout" label="No Timeout" />
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div class="table-container shadow">
        <!-- DISPLAY RECORDS & PAGINATION -->
        <el-row :gutter="8">
          <el-col :md="{ span: 12 }">
            {{
              table.request.type
                ? ucwords(remUnderscore(table.request.type))
                : "All"
            }}
          </el-col>
          <el-col :md="{ span: 12 }">
            <el-pagination
              style="float:right"
              small
              background
              :disabled="fetchMissedLogsState.initial"
              :pager-count="5"
              :page-sizes="[10, 25, 50]"
              :current-page.sync="table.request.page"
              :page-size="table.request.perpage"
              layout="total, sizes, prev, pager, next"
              :total="table.count"
              @current-change="tablePageChange"
              @size-change="tableSizeChange"
            />
          </el-col>

          <el-col :md="{ span: 24 }">
            <el-table
              :data="table.data"
              v-loading="fetchMissedLogsState.initial"
              @sort-change="columnSort"
              style="margin-top:5px;"
              class="monday"
            >
              <el-table-column label="Date" sortable="custom" prop="date">
                <template slot-scope="scope">
                  <div style="display:flex;justify-content:center">
                    <div style="align-self:center;">
                      {{
                        formatDate(scope.row.date.ymd, "", "ddd. MMM Do, YYYY")
                      }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Type">
                <template slot-scope="scope">
                  <div class="d-flex" style="justify-content:center">
                    <div style="align-self:center">
                      <span
                        :style="
                          scope.row.log_status[0] != 'punctual'
                            ? 'color:#F56C6C'
                            : ''
                        "
                        >{{
                          ucwords(remUnderscore(scope.row.log_status[0]))
                        }}</span
                      >
                      <span>-</span>
                      <span
                        :style="
                          scope.row.log_status[1] != 'timed_out'
                            ? 'color:#F56C6C'
                            : ''
                        "
                        >{{
                          ucwords(remUnderscore(scope.row.log_status[1]))
                        }}</span
                      >
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- view coaching -->
              <el-table-column width="50">
                <template slot-scope="scope">
                  <template v-if="scope.row.log_status[1] == 'no_timeout'">
                    <el-tooltip content="View Coaching" placement="top">
                      <div
                        style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                        :style="
                          scope.row.coaching != null
                            ? 'cursor:pointer;'
                            : 'cursor:not-allowed;'
                        "
                        @click="
                          scope.row.coaching != null ? viewRow(scope.row) : null
                        "
                      >
                        <div style="align-self:center;color:gray;font-size:2em">
                          <eye-icon></eye-icon>
                        </div>
                      </div>
                    </el-tooltip>
                  </template>
                </template>
              </el-table-column>

              <el-table-column width="60">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="
                      scope.row.coaching
                        ? 'Coaching available'
                        : 'No coaching filed'
                    "
                    placement="top"
                  >
                    <div
                      style="height:45px;"
                      class="tag w-100"
                      :class="
                        scope.row.coaching != null
                          ? 'tag-success'
                          : 'tag-warning'
                      "
                    ></div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column width="60">
                <template slot-scope="scope">
                  <el-tooltip
                    placement="top"
                    :content="
                      scope.row.coaching
                        ? scope.row.coaching.filed_to_action
                          ? scope.row.coaching.filed_to_action == 'approved'
                            ? 'Approved'
                            : 'Disapproved'
                          : 'Waiting for agent response'
                        : 'No coaching filed'
                    "
                  >
                    <div
                      class="tag w-100"
                      :class="
                        scope.row.coaching
                          ? scope.row.coaching.filed_to_action
                            ? scope.row.coaching.filed_to_action == 'approved'
                              ? 'tag-success'
                              : 'tag-danger'
                            : 'tag-warning'
                          : 'tag-warning'
                      "
                    ></div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column width="60">
                <template slot-scope="scope">
                  <el-tooltip
                    placement="top"
                    :content="
                      scope.row.coaching
                        ? scope.row.coaching.filed_to_action
                          ? scope.row.coaching.filed_to_action == 'approved'
                            ? scope.row.coaching.verified_by
                              ? 'Verified'
                              : 'Waiting for verification'
                            : 'Process denied'
                          : 'Waiting for agent response'
                        : 'No coaching filed'
                    "
                  >
                    <div
                      class="tag w-100"
                      :class="
                        scope.row.coaching
                          ? scope.row.coaching.filed_to_action
                            ? scope.row.coaching.filed_to_action == 'approved'
                              ? scope.row.coaching.verified_by
                                ? 'tag-success'
                                : 'tag-warning'
                              : 'tag-danger'
                            : 'tag-warning'
                          : 'tag-warning'
                      "
                    ></div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="Status">
                <template slot-scope="scope">
                  <div
                    style="justify-content:center;height:45px;color:white;"
                    class="d-flex"
                    :class="
                      scope.row.coaching
                        ? scope.row.coaching.filed_to_action
                          ? scope.row.coaching.filed_to_action == 'approved'
                            ? 'bg-warning'
                            : 'bg-danger'
                          : 'bg-warning'
                        : 'bg-info'
                    "
                  >
                    <div style="align-self:center">
                      {{
                        scope.row.coaching
                          ? scope.row.coaching.filed_to_action
                            ? scope.row.coaching.filed_to_action == "approved"
                              ? "Waiting for RTA Verification"
                              : "Disapproved"
                            : "Waiting for your approval"
                          : "No coaching available"
                      }}
                    </div>
                  </div>
                </template>
              </el-table-column>
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
        :title="form.coaching.action + ' Coaching'"
        width="30%"
      >
        <el-row>
          <template v-if="form.coaching.action != 'View'">
            <el-col style="margin-bottom:10px;">
              <span style="font-size:0.8em">{{
                form.coaching.field.imageName
                  ? form.coaching.field.imageName
                  : "Select image file."
              }}</span>
            </el-col>
            <el-col style="margin-bottom:10px;">
              <el-button size="mini" @click="uploadProofClick"
                >Upload Proof</el-button
              >
              <input
                ref="proofInput"
                type="file"
                style="display:none"
                @change="proofChange"
                accept="image/x-png, image/jpeg"
              />
            </el-col>
          </template>
          <template v-if="form.coaching.action != 'Create'">
            <el-col>
              <el-button size="mini" @click="showProof()">Show Proof</el-button>
            </el-col>
          </template>
          <el-col style="margin-top:30px;">
            <div class="form-label">Coaching Details</div>
          </el-col>
          <el-col style="margin-top:10px;">
            <el-row>
              <el-col :md="8" style="margin-bottom:5px;">
            <span>Agent</span>
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
            </el-row>
          </el-col>
          <el-col>
            <div class="form-label mt-15">Remarks</div>
          </el-col>
          <template v-if="form.coaching.action != 'View'">
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
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelFormCoaching">Cancel</el-button>
          <template
            v-if="position.toLowerCase() == 'representative - order placer'"
          >
              <el-button
              style="color:white"
                type="danger"
                size="mini"
                plain
                :loading="form.coaching.btn.confirm.loader"
                @click="
                  updateAgentApproval({
                    id: form.coaching.details.id,
                    approval: 'disapproved'
                  })
                "
                :disabled="
                  (form.coaching.details.verified_by ? true : false) ||
                    (form.coaching.details.filed_to_action
                      ? form.coaching.details.filed_to_action == 'disapproved'
                        ? true
                        : false
                      : false)
                "
              >
              Disapprove
                <!-- <svg-icon icon-class="thumbs-down"></svg-icon> -->
              </el-button>
              <el-button
              style="color:white"
                type="success"
                size="mini"
                plain
                :loading="form.coaching.btn.confirm.loader"
                @click="
                  updateAgentApproval({
                    id: form.coaching.details.id,
                    approval: 'approved'
                  })
                "
                :disabled="
                  (form.coaching.details.verified_by ? true : false) ||
                    (form.coaching.details.filed_to_action
                      ? form.coaching.details.filed_to_action == 'approved'
                        ? true
                        : false
                      : false)
                "
              >
              Approve
                <!-- <svg-icon icon-class="thumbs-up"></svg-icon> -->
              </el-button>
          </template>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { debounce } from "debounce";
import axios from "axios";
export default {
  name: "Agent-MissedLogs",
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
            id: null,
            proof: null,
            full_name: null,
            date: null,
            schedule: null,
            attendance: null,
            log_status: null,
            coach: null,
            verified_by: null,
            filed_to_action: null
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
        data: [],
        count: 0,
        request: {
          page: 1,
          perpage: 15,
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
  mounted() {
    this.table.request.id = this.user_id;
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
    fetchMissedLogsState: function({ initial, success, fail }) {
      if (success) {
        this.table.data = this.fetchMissedLogsData.missed_logs;
        this.table.count = this.fetchMissedLogsData.count;
      } else {
        this.table.data = [];
        this.table.count = 0;
      }
    }
    // "table.request.status": function(v) {
    //   this.fetchMissedLogs(this.unsetNull(this.table.request));
    // }
  },
  methods: {
    ...mapActions(["fetchMissedLogs", "createCoaching"]),
    debounceInput: debounce(function(e) {
      this.fetchMissedLogs(this.table.request);
    }, 1000),
    updateAgentApproval(data) {
      if (confirm("Do you want to proceed?")) {
        axios
          .post(
            "api/v1/coaching/agent_action",
            { id: data.id, filed_to_action: data.approval, status: "noted" },
            this.axios.options.headers
          )
          .then(res => {
            this.$message({
              type: "success",
              message: res.data.title,
              duration: 5000
            });
            this.form.coaching.details.filed_to_action = data.approval;
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
      this.form.coaching.details.filed_to_action =
        data.coaching.filed_to_action;
      this.form.coaching.details.verified_by = data.coaching.verified_by;
      this.form.coaching.details.id = data.coaching.id;
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
          : "NO LOG");
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
  border-left: 5px solid crimson;
  height: 45px;
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
