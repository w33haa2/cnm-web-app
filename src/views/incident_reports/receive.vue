<template>
  <div class="app-container">
    <h4 style="color:#646464">Received Reports</h4>

    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{ span:8 }">
        <el-input v-model="searchQuery" placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
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
          <el-tag v-if="scope.row.report_details.status == 'close'" type="success">Closed</el-tag>
          <el-tag v-else type="danger">Open</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Type" width="220">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_type.type_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Level" width="220">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_level.level_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Response" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.report_details.agent_response" type="success">Responded</el-tag>
          <el-tag v-else type="danger">No Response</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description" width="350">
        <template slot-scope="scope">{{ scope.row.report_details.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date Filed" width="220">
        <template slot-scope="scope">{{ scope.row.report_details.created_at.date }}</template>
      </el-table-column>
      <el-table-column align="center" label="Issued by" width="220">
        <template slot-scope="scope">
          <div class="td-image-name-container">
            <img v-if="scope.row.issued_by.image" :src="scope.row.issued_by.image" class="td-image" />
            <div v-else class="td-name-avatar">
              <span>{{ getAvatarLetters(scope.row.issued_by.fname,scope.row.issued_by.lname) }}</span>
            </div>
            <div class="td-name">{{ scope.row.issued_by.full_name }}</div>
          </div>
        </template>
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
          <el-tag>{{ form.response.content.sanction_type }}</el-tag>
          <el-tag>{{form.response.content.sanction_level }}</el-tag>
        </el-col>
        <el-col style="margin-top:5px;padding:15px;">
          <p style="color:grey;text-align:center">{{ form.response.content.description }}</p>
        </el-col>
      </el-row>
      <label>Response</label>
      <el-row style="margin-top: 5px; margin-bottom:3px;">
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
        <el-button type="danger" size="mini" @click="submitFormResponse">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        response: {
          dialog: true,
          action: "Create",
          update_id: null,
          // user data directly to pass as params..
          data: {
            user_response_id: null,
            status: null,
            commitment: null
          },
          content: {
            sanction_level: null,
            sanction_type: null,
            description: null
          }
        }
      },
      query: {
        limit: 10,
        offset: 0
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
      "userDetails"
    ])
  },
  watch: {
    searchQuery(newData) {
      if (newData !== "") {
        this.query["target[]"] = "full_name";
        this.query.query = newData;
        this.fetchReceivedReports(this.query);
      } else {
        delete this.query["target[]"];
        delete this.query.query;
        this.fetchReceivedReports(this.query);
      }
    }
  },
  mounted() {
    this.query.id = this.userDetails.id;
    this.fetchReceivedReports(this.query);
  },
  methods: {
    ...mapActions(["fetchReceivedReports"]),
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
    fillResponseForm(id) {
      let ir = this.incidentReports.filter(i => i.report_details.id == id)[0];
      if (ir.report_details.agent_response) {
        this.form.response.action = "Update";
        this.form.response.update_id = ir.report_details.agent_response.id;
        this.form.response.data.commitment =
          ir.report_details.agent_response.commitment;
      } else {
        this.form.response.action = "Create";
      }
      this.form.response.content = {
        sanction_type: ir.report_details.sanction_type.type_description,
        sanction_level: ir.report_details.sanction_level.level_description,
        description: ir.report_details.description
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
