<template>
  <div class="app-container">
    <h4 style="color:#646464">Filed Reports</h4>
    <el-button :plain="true" size="mini" @click="createForm">File a Report</el-button>
    <!-- Search and Pagination -->
    <el-row style="width: 100%;margin-top:30px;">
      <el-col :md="{ span:8 }">
        <el-input v-model="searchQuery" placeholder="Search..." size="mini">
          <!-- <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option v-for="(option, index) in search.options" :key="index" value="full_name" />
          </el-select>-->
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
      <el-col :md="{ span:16 }">
        <el-pagination
          style="float:right"
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
    <br />
    <el-alert
      v-if="fetchingIssuedIncidentReports.fail"
      title="Error!"
      type="error"
      :description="irErrors"
    />
    <!-- Table -->
    <el-table
      v-loading="fetchingIssuedIncidentReports.initial"
      :data="incidentReports"
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column align="center" label="Action" fixed>
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="'Update:'+scope.row.report_details.id">Update</el-dropdown-item>
              <!-- <el-dropdown-item icon="el-icon-printer" divided>Print</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Issued To" width="220">
        <template slot-scope="scope">
          <div class="td-image-name-container">
            <img v-if="scope.row.issued_to.image" :src="scope.row.issued_to.image" class="td-image" />
            <div v-else class="td-name-avatar">
              <span>{{ getAvatarLetters(scope.row.issued_to.fname,scope.row.issued_to.lname) }}</span>
            </div>
            <div class="td-name">{{ scope.row.issued_to.full_name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.report_details.status == '0'" type="success">Closed</el-tag>
          <el-tag v-else type="danger">Open</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Response" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.report_details.agent_response" type="success">Responded</el-tag>
          <el-tag v-else type="danger">No Response</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Type" width="220">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_type.type_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Level" width="220">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_level.level_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date Filed" width="220">
        <template slot-scope="scope">{{ fromNow(scope.row.report_details.created_at.date) }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="Description" width="350">
        <template slot-scope="scope">{{ scope.row.report_details.description }}</template>
      </el-table-column>
    </el-table>

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
          <el-select v-model="form.user_reports_id" size="mini" style="width:100%">
            <el-option
              v-for="(comrade,index) in comrades"
              :key="index"
              :value="comrade.id"
              :label="comrade.full_name"
            />
          </el-select>
        </el-col>
      </el-row>
      <label>Sanction Type</label>
      <el-row style="margin-top: 5px; margin-bottom:3px;">
        <el-col>
          <el-select v-model="form.sanction_type_id" size="mini" style="width:100%">
            <el-option
              v-for="(types,index) in sanctionTypes.options"
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
          <el-select v-model="form.sanction_level_id" size="mini" style="width:100%">
            <el-option
              v-for="(levels,index) in sanctionLevels.options"
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
        <el-button type="danger" size="mini" @click="submitForm" :loading="confirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { Message } from "element-ui";
import { deepClone } from "@/utils";
import { mapActions, mapGetters } from "vuex";
const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: []
};

export default {
  data() {
    return {
      searchQuery: "",
      confirm: false,
      form: {
        show: false,
        action: "Create",
        id: null,
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
      "fetchingSanctionTypeState",
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
      console.log(newData);
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
    this.fetchComrades({ id: this.userDetails.id });
    this.fetchSanctionLevels();
    this.fetchSanctionTypes();
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
    submitForm() {
      this.confirm = true;
      if (this.form.action == "Create") {
        const data = {
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
