<template>
  <div class="app-container">
    <!-- title bar -->
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px">
              Incident Reports
            </div>
            <file-incident-report :data="null" action="Create"></file-incident-report>
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-tooltip content="Search" placement="top">
            <el-input v-model="searchQuery" placeholder="Search..."></el-input>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>

    <!-- <el-button :plain="true" size="mini" @click="createForm">File a Report</el-button> -->
    <div class="table-container shadow">
      <el-row style="width: 100%;" :gutter="8">
        <el-col :md="{ span: 12 }">
          <div>
            Issued
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <!-- Search and Pagination -->
          <el-pagination
            style="float:right"
            :page-sizes="[10, 25, 50]"
            :page-size="100"
            :pager-count="5"
            layout="total, sizes, prev, pager, next"
            :total="incidentReportsTotal"
            background
            small
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>
        <el-col :md="{ span: 24 }" style="margin-top:5px;">
          <!-- Table -->
          <el-table
            v-loading="fetchingIssuedIncidentReports.initial"
            :data="incidentReports"
            style="width: 100%;"
            class="monday"
          >
            <el-table-column
              label="Issued to"
              sortable="custom"
              align="left"
              width="350"
              fixed
            >
              <template slot-scope="scope">
                <div style="height:45px;border-left:red 7px solid;display:flex">
                  <el-tooltip
                    :content="scope.row.issued_to.email"
                    placement="top"
                  >
                    <div
                      style="width:100%;align-self:center;padding-left:20px;"
                    >
                      {{ scope.row.issued_to.full_name }}
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50" fixed>
              <template slot-scope="scope">
                <div class="user-block">
                  <div v-if="scope.row.issued_to.image_url" style="width:100%;">
                    <div style="margin:0 auto;height:30px;width:30px;">
                      <img
                        class="img-circle"
                        style="margin:0 auto;"
                        :src="scope.row.issued_to.image_url"
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
                              scope.row.issued_to.fname,
                              scope.row.issued_to.lname
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Status" width="100" fixed>
              <template slot-scope="scope">
                <template v-if="scope.row.report_details.status == '0'">
                  <div
                    style="display:flex;justify-content:center;color:#ff4545;background-color:#ffeded;"
                  >
                    <div style="align-self:center">CLOSED</div>
                  </div>
                </template>
                <template v-else>
                  <div
                    style="display:flex;justify-content:center;color:#ff4545;background-color:#ffeded;height:45px;border:1px solid #ff4545;"
                  >
                    <div style="align-self:center">OPEN</div>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Sanction Type" width="170">
              <template slot-scope="scope">{{
                scope.row.report_details.sanction_type.type_description
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="Sanction Level" width="170">
              <template slot-scope="scope">{{
                scope.row.report_details.sanction_level.level_description
              }}</template>
            </el-table-column>

            <el-table-column align="center" label="Filed">
              <template slot-scope="scope">
                <el-tooltip
                  placement="top"
                  :content="fromNow(scope.row.report_details.created_at.date)"
                >
                  <div>
                    {{
                      formatDate(
                        scope.row.report_details.created_at.date,
                        "",
                        "ddd. MMM Do, YYYY"
                      )
                    }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="View" width="50">
              <template slot-scope="scope">
                <file-incident-report :data="scope.row" action="Update"></file-incident-report>
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
      :title="form.action + ' Report'"
      width="30%"
    >
      <label width="100%">To</label>
      <el-row style="margin-top: 5px; margin-bottom:3px;">
        <el-col>
          <el-select
            v-model="form.user_reports_id"
            size="mini"
            style="width:100%"
          >
            <el-option
              v-for="(comrade, index) in comrades"
              :key="index"
              :value="comrade.id"
              :label="comrade.full_name"
            />
          </el-select>
        </el-col>
      </el-row>
      <label>Incident Date</label>
      <el-row style="margin-top: 5px; margin-bottom:3px;">
        <el-col>
          <el-date-picker
            size="mini"
            type="date"
            placeholder="Select date..."
            v-model="form.incident_date"
            style="width:100%"
          ></el-date-picker>
        </el-col>
      </el-row>
      <label>Sanction Type</label>
      <el-row style="margin-top: 5px; margin-bottom:3px;">
        <el-col>
          <el-select
            v-model="form.sanction_type_id"
            size="mini"
            style="width:100%"
          >
            <el-option
              v-for="(types, index) in sanctionTypes.options"
              :key="types.id"
              :value="types.id"
              :label="types.type_description"
            />
          </el-select>
        </el-col>
      </el-row>
      <label>Sanction Level</label>
      <el-row style="margin-top: 5px; margin-bottom:3px;">
        <el-col>
          <el-select
            v-model="form.sanction_level_id"
            size="mini"
            style="width:100%"
          >
            <el-option
              v-for="(levels, index) in sanctionLevels.options"
              :key="levels.id"
              :value="levels.id"
              :label="levels.level_description"
            />
          </el-select>
        </el-col>
      </el-row>
      <label>Description</label>
      <el-row style="margin-top: 5px; margin-bottom:3px;">
        <el-col>
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="Description..."
            size="mini"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm">Cancel</el-button>
        <el-button
          type="danger"
          size="mini"
          @click="submitForm"
          :loading="confirm"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { Message } from "element-ui";
import { deepClone } from "@/utils";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import fileIncidentReport from "./components/file-incident-report";
const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: []
};

export default {
  name: "IssueIRPage",
  components: { fileIncidentReport },
  data() {
    return {
      searchQuery: "",
      confirm: false,
      form: {
        show: false,
        action: "Create",
        id: null,
        incident_date: null,
        sanction_type_id: null,
        sanction_level_id: null,
        description: null,
        user_reports_id: null,
        filed_by: null,
        status: 1
      },
      query: {
        limit: 10,
        offset: 0,
        sort: "created_at",
        order: "desc"
      }
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
    ...mapGetters([
      "fetchingIssuedIncidentReports",
      "incidentReports",
      "incidentReportsTotal",
      "irErrors",
      "comrades",
      "userDetails",
      "creatingIncidentReports",
      "sanctionLevels",
      "sanctionTypes",
      "fetchSanctionTypeState",
      "updateIncidentReportState"
    ])
  },
  watch: {
    updateIncidentReportState({ initial, success, fail }) {
      if (success) {
        this.fetchIssuedReports(this.query);
        this.clearForm();
        this.form.show = false;
        this.confirm = false;
        Message.success({
          message: "Successfully updated report.",
          duration: "2500"
        });
      } else if (fail) {
        this.confirm = false;
        Message.error({ message: this.irErrors, duration: "2500" });
      }
    },
    incidentReports(newData) {
      // console.log(newData);
    },
    sanctionLevels(v) {
      this.form.sanction_level_id = v.options[0].id;
    },
    sanctionTypes(v) {
      this.form.sanction_type_id = v.options[0].id;
    },
    searchQuery(newData) {
      if (newData !== "") {
        this.query["target[]"] = "full_name";
        this.query.query = newData;
        this.fetchIssuedReports(this.query);
      } else {
        delete this.query["target[]"];
        delete this.query.query;
        this.fetchIssuedReports(this.query);
      }
    },
    creatingIncidentReports({ initial, success, fail }) {
      if (success) {
        this.fetchIssuedReports(this.query);
        this.clearForm();
        this.form.show = false;
        this.confirm = false;
        Message.success({
          message: "Successfully submitted report",
          duration: "2500"
        });
      } else if (fail) {
        this.confirm = false;
        Message.error({ message: this.irErrors, duration: "2500" });
      }
    }
  },
  mounted() {
    this.query.id = this.userDetails.id;
    this.fetchIssuedReports(this.query);
    this.fetchComrades({ id: this.userDetails.id,order:"asc",sort:"firstname"});
    this.fetchSanctionLevels();
    this.fetchSanctionTypes();
    window.addEventListener("beforeunload", this.beforeUnload);
  },
  methods: {
    ...mapActions([
      "fetchIssuedReports",
      "fetchComrades",
      "fetchSanctionLevels",
      "fetchSanctionTypes",
      "createReports",
      "updateIncidentReport"
    ]),
    beforeUnload(e) {
      alert("UNLOADING");
    },
    submitForm() {
      this.confirm = true;
      if (this.form.action == "Create") {
        const data = {
          incident_date: moment(this.form.incident_date).format("YYYY-MM-DD"),
          sanction_type_id: this.form.sanction_type_id,
          sanction_level_id: this.form.sanction_level_id,
          description: this.form.description,
          user_reports_id: this.form.user_reports_id,
          filed_by: this.userDetails.id,
          status: 1
        };
        this.createReports(data);
      } else {
        if (this.form.status == 0) {
          Message.warning({
            message: "Updates on closed reports is not allowed.",
            duration: "2500"
          });
        } else {
          const data = {
            id: this.form.id,
            incident_date: moment(this.form.incident_date).format("YYYY-MM-DD"),
            sanction_type_id: this.form.sanction_type_id,
            sanction_level_id: this.form.sanction_level_id,
            description: this.form.description,
            filed_by: this.userDetails.id
          };
          this.updateIncidentReport(data);
        }
      }
    },
    handleCommand(command) {
      const action = command.split(":")[0];
      const id = command.split(":")[1];
      switch (action) {
        case "Update":
          const data = this.incidentReports.filter(
            i => i.report_details.id == id
          )[0];
          this.form = {
            show: true,
            action: action,
            id: data.report_details.id,
            incident_date: data.report_details.incident_date,
            sanction_type_id: data.report_details.sanction_type.id,
            sanction_level_id: data.report_details.sanction_level.id,
            description: data.report_details.description,
            user_reports_id: data.issued_to.id,
            filed_by: data.issued_by.id,
            status: data.report_details.status
          };
          break;
      }
    },
    createForm() {
      this.clearForm();
      this.form.show = true;
      this.form.sanction_level_id = this.sanctionLevels.options[0].id;
      this.form.sanction_type_id = this.sanctionTypes.options[0].id;
    },
    clearForm() {
      this.form = {
        action: "Create",
        id: null,
        sanction_type_id: null,
        sanction_level_id: null,
        description: null,
        user_reports_id: null,
        filed_by: null,
        status: 1
      };
    },
    cancelForm() {
      this.clearForm();
      this.form.show = false;
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.fetchIssuedReports(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.fetchIssuedReports(this.query);
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
  font-size: 0.8em !important;
}
</style>
