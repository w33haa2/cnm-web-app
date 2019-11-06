<template>
  <div class="app-container">
    <h4 style="color:#646464">Missed Logs</h4>
    <div class="filter-container">
      <!-- DISPLAY RECORDS & PAGINATION -->
      <el-row :gutter="8" style="padding-right:8px;margin-bottom:15px;">
        <!-- <el-col :md="{span: 4}" style="margin-bottom:5px;">
          <el-input v-model="table.request.query" placeholder="Search..." size="mini"></el-input>
        </el-col> -->
        <el-col :md="{span:12}">
          <el-radio-group v-model="table.request.status" size="mini">
            <el-radio-button :label="null">All</el-radio-button>
            <!-- <el-radio-button label="Washington">w/o Coaching</el-radio-button> -->
            <el-radio-button label="pending">Pending</el-radio-button>
            <el-radio-button label="noted">For Verification</el-radio-button>
            <el-radio-button label="verified">Verified</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :md="{span: 12}">
          <el-pagination
            style="float:right"
            small
            background
            :page-sizes="[15, 50, 100]"
            :current-page.sync="table.request.page"
            :page-size="table.request.perpage"
            layout="total, sizes, prev, pager, next"
            :total="fetchMissedLogsData.missed_logs.total"
            @current-change="tablePageChange"
            @size-change="tableSizeChange"
          />
        </el-col>
      </el-row>

      <el-row
        :gutter="10"
        style="padding-right:8px;margin-bottom:30px;"
        v-loading="fetchMissedLogsState.initial"
      >
        <template v-for="(datum,index) in fetchMissedLogsData.missed_logs.data">
          <el-col :key="index" :md="{span:6}" :sm="{span:8}" style="margin-bottom:10px;">
            <el-card shadow="hover" body-style="padding-bottom:0px;">
              <!-- <div slot="header" class="clear-fix">
                <div class="user-block">
                  <img
                    v-if="datum.user_info.image_url"
                    class="img-circle"
                    :src="datum.user_info.image_url"
                  />
                  <div
                    v-else
                    class="img-circle text-muted"
                    style="background-color:#d9d9d9;display:flex"
                  >
                    <div
                      style="align-self:center;width:100%;text-align:center;font-size:.7em"
                    >{{ getAvatarLetters(datum.user_info.firstname,datum.user_info.lastname) }}</div>
                  </div>
                  <div style="display:flex;height:30px;padding-left:10px;">
                    <div
                      class="el-dropdown-link text-muted"
                      style="font-weight:600;font-size:.7em;align-self:center"
                    >{{ datum.user_info.full_name }}</div>
                  </div>
                </div>
              </div>-->
              <div>
                <el-row>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">Date</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span
                      class="card-content-text"
                    >{{ formatDate(datum.start_event.date,"","MMM Do, YYYY") }}</span>
                  </el-col>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">OM</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span class="card-content-text">{{ datum.om.full_name }}</span>
                  </el-col>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">TL</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span class="card-content-text">{{ datum.tl.full_name }}</span>
                  </el-col>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">Schedule</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span
                      class="card-content-text"
                    >{{ formatDate(datum.start_event.date,"","hh:mm a") +" - "+ formatDate(datum.end_event.date,"","hh:mm a") }}</span>
                  </el-col>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">Log</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span
                      class="card-content-text"
                    >{{ formatDate(datum.time_in.date,"","hh:mm a") +" - "+ (datum.time_out?formatDate(datum.time_out.date,"","hh:mm a"):'no log') }}</span>
                  </el-col>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">Log status</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span
                      class="card-content-text"
                      style="color:red"
                    >{{ remUnderscore(datum.log_status[0]) +" - "+ remUnderscore(datum.log_status[1]) }}</span>
                  </el-col>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">Approval</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span
                      class="card-content-text"
                      :style="'color:'+(datum.coaching ? datum.coaching.filed_to_action? datum.coaching.filed_to_action =='approved'? 'green':'red':'orange':'blue')"
                    >
                      {{ datum.coaching ? (datum.coaching.filed_to_action?
                      datum.coaching.filed_to_action =='approved'? "Approved":"Disapproved"
                      :"Pending"):"No coaching data..." }}
                    </span>
                  </el-col>
                  <el-col :xs="{span:8}" :sm="{span:8}" :md="{span:8}">
                    <span class="card-content-text">Coached By</span>
                  </el-col>
                  <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}">
                    <span
                      class="card-content-text"
                    >{{ datum.coaching ? datum.coaching.filed_by.full_name :"NA" }}</span>
                  </el-col>
                  <el-col style="margin-top:15px;padding-bottom:20px;">
                    <!-- coaching exist -->
                    <template v-if="datum.coaching">
                      <!-- rta verified -->
                      <template v-if="datum.coaching.verified_by">
                        <div style="width:100%">
                          <el-tag
                            size="mini"
                            style="width:100%;text-align:center"
                            type="success"
                          >VERIFIED</el-tag>
                        </div>
                        <el-tag type="success" style="width:100%;text-align:center;margin-top:5px;">RESOLVED</el-tag>
                      </template>
                      <!-- no rta verification -->
                      <template v-else>
                        <div style="width:100%">
                          <el-tag
                            size="mini"
                            style="width:100%;text-align:center"
                            type="warning"
                          >PENDING</el-tag>
                        </div>
                        <div style="width:100%;margin-top:5px">
                          <el-row gutter="10">
                            <el-col :xs="{span:12}" :sm="{span:12}" :md="{span:12}">
                              <el-button
                                size="mini"
                                type="success"
                                @click="updateAgentApproval({id:datum.coaching.id,approval:'approved'})"
                                plain
                                style="width:100%"
                                :disabled="datum.coaching.filed_to_action == 'approved'"
                              >APPROVE</el-button>
                            </el-col>
                            <el-col :xs="{span:12}" :sm="{span:12}" :md="{span:12}">
                              <el-button
                                size="mini"
                                type="danger"
                                plain
                                style="width:100%"
                                @click="updateAgentApproval({id:datum.coaching.id,approval:'disapproved'})"
                                :disabled="datum.coaching.filed_to_action == 'disapproved'"
                              >DISAPPROVE</el-button>
                            </el-col>
                          </el-row>
                        </div>
                      </template>
                    </template>
                    <!-- coaching null -->
                    <template v-else>
                      <div style="width:100%">
                        <el-tag
                          size="mini"
                          style="width:100%;text-align:center"
                          type="primary"
                        >TO BE COACHED</el-tag>
                      </div>
                      <div style="width:100%;margin-top:5px">
                        <el-tag type="info" style="width:100%;text-align:center;">NOTHING TO APPROVE</el-tag>
                      </div>
                    </template>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </template>
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
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFormCoaching">Cancel</el-button>
        <template v-if="form.coaching.action!='View'">
          <el-button
            type="danger"
            size="mini"
            :loading="form.coaching.btn.confirm.loader"
            @click="submitCoachingForm()"
          >Confirm</el-button>
        </template>
        <!-- @click="resetPassword" -->
        <!-- :loading="employeeUpdateState.initial" -->
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
            log_status: null
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
          perpage: 15,
          query: null,
          tl_id: null,
          om_id: null,
          id: null,
          status: null
        }
      }
    };
  },
  created() {
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
    "table.request.query": function(v) {
      setTimeout(() => {
        this.fetchMissedLogs(this.unsetNull(this.table.request));
      }, 3000);
    },
    "table.request.status": function(v){
      this.fetchMissedLogs(this.unsetNull(this.table.request))
    }
  },
  methods: {
    ...mapActions(["fetchMissedLogs", "createCoaching"]),
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
          : "NO LOG");
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


<style lang="scss">
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