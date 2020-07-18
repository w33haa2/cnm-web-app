<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper">
              Incident Reports
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-input v-model="searchQuery" placeholder="Search...">
            <el-select
              slot="prepend"
              placeholder="Select"
              v-model="searchTarget"
              style="width:150px;"
            >
              <el-option value="issued_to" label="Issued To" selected />
              <el-option value="issued_by" label="Issued By" />
            </el-select>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="table-container shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          All
        </el-col>
        <el-col :md="{ span: 12 }">
          <!-- Search and Pagination -->
          <el-pagination
            style="float:right"
            :page-sizes="[10, 25, 50]"
            :page-size="100"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            background
            small
            :v-model="5"
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>
        <el-col>
          <!-- Table -->
          <el-table
            v-loading="table_config.loader"
            :data="table_config.data"
            style="margin-top:5px;"
            class="monday"
            @sort-change="customSort"
          >
            <el-table-column align="center" label="Status" width="80" fixed>
              <template slot-scope="scope">
                <div style="border-left:red 7px solid;padding-left:1px">
                  <template v-if="scope.row.report_details.status == 0">
                    <el-tooltip content="Reopen this Report" placement="top">
                      <div
                        class="tag tag-success cursor-pointer"
                        @click="handleCommand('open||' + scope.row.report_details.id)"
                      >
                        <div style="align-self:center">CLOSED</div>
                      </div>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    <el-tooltip content="Close this Report" placement="top">
                      <div
                      class="tag tag-danger cursor-pointer"
                        style=""
                        @click="handleCommand('close||' + scope.row.report_details.id)"
                      >
                        <div style="align-self:center">OPEN</div>
                      </div>
                    </el-tooltip>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="Issued to"
              sortable="custom"
              align="left"
              width="350"
              prop="issued_to.full_name"
              fixed
            >
              <template slot-scope="scope">
                <div style="height:45px;display:flex">
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

            <el-table-column
              label="Issued by"
              sortable="custom"
              align="left"
              width="350"
              prop="issued_by.full_name"
            >
              <template slot-scope="scope">
                <div style="height:45px;display:flex">
                  <el-tooltip
                    :content="scope.row.issued_by.email"
                    placement="top"
                  >
                    <div
                      style="width:100%;align-self:center;padding-left:20px;"
                    >
                      {{ scope.row.issued_by.full_name }}
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <div class="user-block">
                  <div v-if="scope.row.issued_by.image_url" style="width:100%;">
                    <div style="margin:0 auto;height:30px;width:30px;">
                      <img
                        class="img-circle"
                        style="margin:0 auto;"
                        :src="scope.row.issued_by.image_url"
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
                              scope.row.issued_by.fname,
                              scope.row.issued_by.lname
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
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
                <view-report :data="scope.row"></view-report>
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
import viewReport from "./components/view-incident-report";
export default {
  name:"allIRpage",
  components:{viewReport},
  data() {
    return {
      query: {
        offset: 0,
        limit: 10,
        sort: "updated_at",
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
    customSort({ column, prop, order }) {
      this.query.sort = null;
      this.query.order = null;
      if (order) {
        this.query.sort = prop;
        this.query.order = order == "ascending" ? "asc" : "desc";
      }
      this.tableSearch();
    },
    tableSearch() {
      if (this.searchQuery !== "" && this.searchQuery !==null) {
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
        delete this.query["target[]"];
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
          if(confirm("Are you sure you want to reopen this report?")){
            this.updateIncidentReport({
              id: id,
              status: status
            });
          }
          break;
        case "close":
          status = 0;
          if(confirm("Are you sure you want to close this report?")){
            this.updateIncidentReport({
              id: id,
              status: status
            });
          }
          break;
        case "view":
          this.previewReport();
          break;
      }
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
