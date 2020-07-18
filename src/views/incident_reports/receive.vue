<template>
  <div>
    <div class="app-container">
      <!-- <h4 style="color:#646464">Received Reports</h4> -->
      <div class="title-bar shadow">
        <el-row :gutter="8">
          <el-col :md="{ span: 12 }">
            <div class="title-wrapper">Incident Reports</div>
          </el-col>
          <el-col :md="{ span: 12 }">
            <el-tooltip placement="top" content="Search">
              <el-input v-model="searchQuery" placeholder="Search..." />
            </el-tooltip>
          </el-col>
        </el-row>
      </div>

      <div class="table-container shadow">
        <el-row :gutter="8">
          <el-col :md="{ span: 12 }">
            Received
          </el-col>
          <!-- Search and Pagination -->
          <el-col :md="{ span: 12 }">
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
          <el-col :md="{ span: 24 }">
            <!-- Table -->
            <el-table
              v-loading="fetchingReceivedIncidentReports.initial"
              :data="incidentReports"
              style="width: 100%;margin-top:5px;"
              class="monday"
              @sort-change="customSort"
            >
              <el-table-column
                label="Issued by"
                sortable="custom"
                align="left"
                width="350"
                prop="issued_by.full_name"
                fixed
              >
                <template slot-scope="scope">
                  <div
                    style="display:flex"
                  >
                    <el-tooltip :content="scope.row.issued_by.email" placement="top">
                      <div
                        style="width:100%;align-self:center;padding-left:20px;"
                      >
                        {{ scope.row.issued_by.full_name }}
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="50" fixed>
                <template slot-scope="scope">
                  <div class="user-block">
                    <div
                      v-if="scope.row.issued_by.image_url"
                      style="width:100%;"
                    >
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
              <el-table-column align="center" label="Status" width="100" fixed>
                <template slot-scope="scope">
                  <template v-if="scope.row.report_details.status == '0'">
                    <div
                      class="tag tag-success"
                    >
                      <div style="align-self:center">CLOSED</div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="tag tag-danger"
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
              <el-table-column
                align="center"
                label="Sanction Level"
                width="170"
              >
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
                  <update-response :data="scope.row"></update-response>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import updateResponse from "./components/update_response";
export default {
  name: "recievedIRPage",
  components: { updateResponse },
  data() {
    return {
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
      "position",
      "updateReportResponseData",
      "createReportResponseData",
      "updateReportResponseState",
      "createReportResponseState",
    
    ])
  },
  watch: {
    updateReportResponseState({ initial, success, fail }) {
      if (success) {
        this.fetchReceivedReports(this.query);
        this.$message({
          type: "success",
          message: "You have successfuly updated a response.",
          duration: 2500
        });
      }

      if (fail) {
        this.$message({
          type: "error",
          message: "There is an error updating a response.",
          duration: 2500
        });
      }
    },
    createReportResponseState({ initial, success, fail }) {
      if (success) {
        this.fetchReceivedReports(this.query);
        this.$message({
          type: "success",
          message: "You have successfuly updated a response.",
          duration: 2500
        });
      }

      if (fail) {
        this.$message({
          type: "error",
          message: "There is an error updating a response.",
          duration: 2500
        });
      }
    },
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
    }
  },
  mounted() {
    this.query.id = this.userDetails.id;
    this.fetchReceivedReports(this.query);
  },
  methods: {
    ...mapActions(["fetchReceivedReports"]),
    customSort({ column, prop, order }) {
      this.query.sort = null;
      this.query.order = null;
      if (order) {
        this.query.sort = prop;
        this.query.order = order == "ascending" ? "asc" : "desc";
      }
      this.fetchReceivedReports(this.query);
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.fetchReceivedReports(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.fetchReceivedReports(this.query);
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
