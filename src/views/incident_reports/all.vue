<template>
  <div class="app-container">
    <h4 style="color:#646464">All Reports</h4>

    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{ span:8 }">
        <el-input v-model="searchQuery" placeholder="Search..." size="mini">
          <el-select
            slot="prepend"
            placeholder="Select"
            v-model="searchTarget"
            style="width:150px;"
          >
            <el-option value="issued_to" label="Issued To" selected />
            <el-option value="issued_by" label="Issued By" />
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
          :total="table_config.count"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
    </el-row>

    <!-- Table -->
    <br />
    <el-alert
      v-if="fetchingAllIncidentReports.fail"
      title="Error!"
      type="error"
      :description="irErrors"
    />
    <el-table v-loading="table_config.loader" :data="table_config.data" style="margin-top:30px;">
      <el-table-column align="center" label="Action">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item icon="el-icon-edit" :command="'update||'+scope.row.id">Update</el-dropdown-item> -->
              <el-dropdown-item :command="'close||'+scope.row.report_details.id">Close</el-dropdown-item>
              <el-dropdown-item :command="'open||'+scope.row.report_details.id" divided>Open</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Issued To" width="300">
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
      <el-table-column align="center" label="Issued By" width="300">
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
      <el-table-column align="center" label="Sanction Type" width="150">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_type.type_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Level" width="150">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_level.level_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.report_details.status=='0'" type="success">Closed</el-tag>
          <el-tag v-else type="danger">Open</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description" width="350">
        <template slot-scope="scope">{{ scope.row.report_details.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Response" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.response" type="success">Responded</el-tag>
          <el-tag v-else type="danger">No Response</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Date Filed" width="220">
        <template slot-scope="scope">{{ fromNow(scope.row.report_details.created_at.date) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      query: {
        offset: 0,
        limit: 10,
        sort: "created_at",
        order: "desc"
      },
      searchQuery: null,
      searchTarget: "issued_to",
      table_config: {
        data: [],
        count: 0,
        loader: false
      }
    };
  },
  computed: {
    ...mapGetters([
      "fetchingAllIncidentReports",
      "incidentReports",
      "irErrors",
      "incidentReportsTotal",
      "updateIncidentReportState",
      "issuedToSearchData",
      "issuedToSearchState",
      "issuedBySearchData",
      "issuedBySearchState"
    ])
  },
  watch: {
    issuedBySearchState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.issuedBySearchData.reports;
        this.table_config.count = this.issuedBySearchData.count;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
      }
    },
    issuedToSearchState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.issuedToSearchData.reports;
        this.table_config.count = this.issuedToSearchData.count;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
      }
    },
    fetchingAllIncidentReports({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.incidentReports;
        this.table_config.count = this.incidentReportsTotal;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
      }
    },
    searchQuery(v) {
      this.tableSearch();
    },
    searchTarget(v) {
      if (this.searchQuery) {
        this.tableSearch();
      }
    },
    updateIncidentReportState({ initial, success, fail }) {
      if (success) {
        this.$message({
          type: "success",
          message: "Successfuly changed report status."
        });
        this.fetchAllReports(this.query);
      }
    }
  },
  mounted() {
    this.fetchAllReports(this.query);
  },
  methods: {
    ...mapActions([
      "fetchAllReports",
      "updateIncidentReport",
      "searchIssuedToIr",
      "searchIssuedByIr"
    ]),
    tableSearch() {
      if (this.searchQuery !== "") {
        this.query.offset = 0;
        this.query["target[]"] = "full_name";
        this.query.query = this.searchQuery;
        const data = this.query;
        switch (this.searchTarget) {
          case "issued_to":
            this.searchIssuedToIr(data);
            break;
          case "issued_by":
            this.searchIssuedByIr(data);
            break;
        }
      } else {
        this.query.offset = 0;
        const data = this.query;
        this.fetchAllReports(data);
      }
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.fetchAllReports(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.fetchAllReports(this.query);
    },
    handleCommand(command) {
      const id = command.split("||")[1];
      const action = command.split("||")[0];
      let status = 1;
      switch (action) {
        case "open":
          status = 1;
          break;
        case "close":
          status = 0;
          break;
      }
      this.updateIncidentReport({
        id: id,
        status: status
      });
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
