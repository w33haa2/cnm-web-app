<template>
  <div>
    <div class="app-container">
      <h4 style="color:#646464">Received Reports</h4>

      <!-- Search and Pagination -->
      <el-row>
        <el-col :md="{ span:8 }">
          <el-input v-model="searchQuery" placeholder="Search..." size="mini">
            <!-- <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
            </el-select>-->
            <el-button slot="append">
              <i class="el-icon-search" />
            </el-button>
          </el-input>
        </el-col>
        <el-col :md="{ span:16 }">
          <el-pagination
            style="float:right
          "
            :page-sizes="[10, 25, 50]"
            :page-size="100"
            layout="total, sizes, prev, pager, next"
            :total="incidentReportsTotal"
            background
            small
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>
      </el-row>

      <!-- Table -->
      <el-table
        v-loading="fetchingReceivedIncidentReports.initial"
        :data="incidentReports"
        style="width: 100%;margin-top:30px;"
      >
        <el-table-column align="center" label="Action" fixed>
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'response||'+scope.row.report_details.id">Response</el-dropdown-item>
                <!-- <el-dropdown-item icon="el-icon-printer" divided>Print</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Status" width="220">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.report_details.status == '0'" type="success">Closed</el-tag>
            <el-tag v-else type="danger">Open</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Issued by" width="220">
          <template slot-scope="scope">
            <div class="td-image-name-container">
              <img
                v-if="scope.row.issued_by.image"
                :src="scope.row.issued_by.image"
                class="td-image"
              />
              <div v-else class="td-name-avatar">
                <span>{{ getAvatarLetters(scope.row.issued_by.fname,scope.row.issued_by.lname) }}</span>
              </div>
              <div class="td-name">{{ scope.row.issued_by.full_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Sanction Type" width="220">
          <template slot-scope="scope">{{ scope.row.report_details.sanction_type.type_description }}</template>
        </el-table-column>
        <el-table-column align="center" label="Sanction Level" width="220">
          <template
            slot-scope="scope"
          >{{ scope.row.report_details.sanction_level.level_description }}</template>
        </el-table-column>
        <el-table-column align="center" label="Response" width="220">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.report_details.agent_response" type="success">Responded</el-tag>
            <el-tag v-else type="danger">No Response</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Incident Date" width="150">
          <template slot-scope="scope">{{ fromNow(scope.row.report_details.incident_date) }}</template>
        </el-table-column>
        <el-table-column align="header-center" label="Description" width="350">
          <template slot-scope="scope">{{ scope.row.report_details.description }}</template>
        </el-table-column>
        <el-table-column align="center" label="Date Filed" width="220">
          <template slot-scope="scope">{{ scope.row.report_details.created_at.date }}</template>
        </el-table-column>
      </el-table>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="form.response.dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :title="'Update Response'"
        width="30%"
      >
        <el-row style="margin-bottom:10px;">
          <el-col>
            <div style="margin-bottom:20px;">
              <span style="font-weight:600;color:grey;">Incident Date:</span>
              {{form.response.content.incident_date}}
            </div>
          </el-col>
          <el-col>
            <div style="margin-bottom:10px;">
              <span style="font-weight:600;color:grey;">Sanction Type:</span>
              {{ form.response.content.sanction_type }}
            </div>
            <div style="margin-bottom:10px;">
              <span style="font-weight:600;color:grey;">Sanction Level:</span>
              {{form.response.content.sanction_level }}
            </div>
          </el-col>
          <el-col>
            <div style="margin-bottom:10px;">
              <span style="font-weight:600;color:grey;">Description:</span>
            </div>
          </el-col>
          <el-col style="padding:10px;background-color:#f4f4f5">
            <p style="color:grey;text-align:center;">{{ form.response.content.description }}</p>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px; margin-bottom:3px;">
          <div style="margin-bottom:20px;">
            <span style="font-weight:600;color:grey;">Response:</span>
          </div>
          <el-col>
            <el-input
              v-model="form.response.data.commitment"
              type="textarea"
              placeholder="Response..."
              size="mini"
            />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelFormResponse">Cancel</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="submitFormResponse"
            :loading="form.response.confirm"
          >Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        response: {
          editable: true,
          dialog: false,
          action: "Create",
          report_id: null,
          response_id: null,
          confirm: false,
          // user data directly to pass as params..
          data: {
            user_response_id: null,
            status: null,
            commitment: null
          },
          content: {
            sanction_level: null,
            sanction_type: null,
            description: null,
            incident_date: null
          }
        }
      },
      query: {
        limit: 10,
        offset: 0,
        sort: "created_at",
        order: "desc"
      },
      searchQuery: ""
    };
  },
  computed: {
    ...mapGetters([
      "fetchingReceivedIncidentReports",
      "incidentReports",
      "incidentReportsTotal",
      "irErrors",
      "userDetails",
      "updateReportResponseData",
      "createReportResponseData",
      "updateReportResponseState",
      "createReportResponseState",
      "position"
    ])
  },
  watch: {
    searchQuery(newData) {
      if (newData !== "") {
        this.query.offset = 0;
        this.query["target[]"] = "full_name";
        this.query.query = newData;
        this.fetchReceivedReports(this.query);
      } else {
        delete this.query["target[]"];
        delete this.query.query;
        this.fetchReceivedReports(this.query);
      }
    },
    updateReportResponseState({ initial, success, fail }) {
      if (initial) {
        this.form.response.confirm = true;
      }
      if (success) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
        this.query.offset = 0;
        this.fetchReceivedReports(this.query);
        this.$message({
          type: "success",
          message: "You have successfuly updated a response.",
          duration: 2500
        });
      }

      if (fail) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
        this.$message({
          type: "error",
          message: "There is an error updating a response.",
          duration: 2500
        });
      }
    },
    createReportResponseState({ initial, success, fail }) {
      if (initial) {
        this.form.response.confirm = true;
      }
      if (success) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
        this.query.offset = 0;
        this.fetchReceivedReports(this.query);
        this.$message({
          type: "success",
          message: "You have successfuly updated a response.",
          duration: 2500
        });
      }

      if (fail) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
        this.$message({
          type: "error",
          message: "There is an error updating a response.",
          duration: 2500
        });
      }
    }
  },
  mounted() {
    this.query.id = this.userDetails.id;
    this.fetchReceivedReports(this.query);
  },
  methods: {
    ...mapActions([
      "fetchReceivedReports",
      "createReportResponse",
      "updateReportResponse"
    ]),
    submitFormResponse() {
      if (this.form.response.editable) {
        if (this.form.response.action == "Update") {
          const data = {
            id: this.form.response.response_id,
            user_response_id: this.form.response.report_id,
            commitment: this.form.response.data.commitment
          };
          this.updateReportResponse(data);
        } else {
          const data = {
            user_response_id: this.form.response.report_id,
            commitment: this.form.response.data.commitment
          };
          this.createReportResponse(data);
        }
      } else {
        this.$message({
          type: "warning",
          message: "Update to closed report is not allowed.",
          duration: 2500
        });
      }
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.fetchReceivedReports(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.fetchReceivedReports(this.query);
    },
    cancelFormResponse() {
      this.form.response.dialog = false;
    },
    clearFormResponse() {
      this.form.response = {};
    },
    fillResponseForm(id) {
      let ir = this.incidentReports.filter(i => i.report_details.id == id)[0];
      this.form.response.report_id = ir.report_details.id;
      if (ir.report_details.status == 1) {
        this.form.response.editable = true;
      } else {
        this.form.response.editable = false;
      }
      if (ir.report_details.agent_response) {
        this.form.response.response_id = ir.report_details.agent_response.id;
        this.form.response.action = "Update";
        this.form.response.data.commitment =
          ir.report_details.agent_response.commitment;
      } else {
        this.form.response.action = "Create";
      }
      this.form.response.content = {
        sanction_type: ir.report_details.sanction_type.type_description,
        sanction_level: ir.report_details.sanction_level.level_description,
        description: ir.report_details.description,
        incident_date: ir.report_details.incident_date
      };
    },
    handleCommand(command) {
      const id = command.split("||")[1];
      const action = command.split("||")[0];
      switch (action) {
        case "response":
          this.form.response.dialog = true;
          this.fillResponseForm(id);
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
