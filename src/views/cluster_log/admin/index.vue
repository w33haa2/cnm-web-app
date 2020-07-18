<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px;">
              Assignment Log
            </div>
                <hierarchy-log-create :form="{ title: 'Promotion/Reassign Log' }"></hierarchy-log-create>
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-row :gutter="8">
            <el-col :md="{ span: 18 }">
              <el-input
                v-model="table_config.query.query"
                type="text"
                style="width:100%"
                placeholder="Search..."
                @input="debounceInput"
              />
            </el-col>
            <el-col :md="{ span: 6 }">
              <el-date-picker
                v-model="table_config.query.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width:100%"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>


    <!-- Table -->
    <div class="table-container shadow">
      <el-row>
        <el-col :md="{span:12}">
          {{formatDate(table_config.query.date,"YYYY-MM-DD","ddd. MMM Do, YYYY")}}
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-pagination
            style="float:right"
            :pager-count="5"
            :page-sizes="[10, 25, 50]"
            :page-size="table_config.query.perpage"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            :current-page.sync="table_config.query.page"
            background
            small
            @current-change="tablePageChange"
            @size-change="tableSizeChange"
          />
        </el-col>
        <el-col :md="{ span: 24 }">
          <el-table
            :data="table_config.data"
            style="width: 100%;margin-top:5px;"
            class="monday"
            v-loading="fetchHierarchyLogsTableState.initial"
            @sort-change="customSort"
          >
            <!-- <el-table-column align="center" label="ID" sortable="custom" prop="id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column> -->
      
              <el-table-column
                label="Head"
                sortable="custom"
              align="left"
              prop="parent_details.full_name"
              >
                <template slot-scope="scope">
                  <div
                    style="display:flex"
                  >
                    <el-tooltip :content="scope.row.parent_user_details.email">
                      <div
                        style="width:100%;align-self:center;padding-left:20px;"
                      >
                        {{ scope.row.parent_details.full_name }}
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="50">
                <template slot-scope="scope">
                  <div class="user-block">
                    <div v-if="scope.row.parent_details.image_url" style="width:100%;">
                      <div style="margin:0 auto;height:30px;width:30px;">
                        <img
                          class="img-circle"
                          style="margin:0 auto;"
                          :src="scope.row.parent_details.image_url"
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
                                scope.row.parent_details.firstname,
                                scope.row.parent_details.lastname
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
                label="Subordinate"
                sortable="custom"
              align="left"
              prop="child_details.full_name"
              >
                <template slot-scope="scope">
                  <div
                    style="height:45px;display:flex"
                  >
                    <el-tooltip :content="scope.row.child_user_details.email">
                      <div
                        style="width:100%;align-self:center;padding-left:20px;"
                      >
                        {{ scope.row.child_details.full_name }}
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="50">
                <template slot-scope="scope">
                  <div class="user-block">
                    <div v-if="scope.row.child_details.image_url" style="width:100%;">
                      <div style="margin:0 auto;height:30px;width:30px;">
                        <img
                          class="img-circle"
                          style="margin:0 auto;"
                          :src="scope.row.child_details.image_url"
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
                                scope.row.child_details.firstname,
                                scope.row.child_details.lastname
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
              align="center"
              label="Start date"
              prop="start_date"
              width="120"
            >
              <template slot-scope="scope">{{
                formatDate(scope.row.start_date, "", "MMM Do YYYY")
              }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              label="End date"
              prop="end_date"
              width="120"
            >
              <template slot-scope="scope">
                <template v-if="scope.row.end_date">{{
                  formatDate(scope.row.end_date, "", "MMM Do YYYY")
                }}</template>
                <template v-else>
                  <!-- <el-tag type="success" size="mini">At present</el-tag> -->
                  <div style="width:100%;background-color:#67c23a;height:45px;color:white;display:flex;justify-content:center">
                    <div style="align-self:center">At present</div>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="Delete" width="50">
              <template slot-scope="scope">
                  <div
                    style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                    @click="deleteRow(scope.row)"
                  >
                    <div style="align-self:center;color:gray;font-size:2em">
                      <delete-icon></delete-icon>
                    </div>
                  </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import hierarchyLogCreate from "./components/hierarchy_log_create";
import { debounce } from "debounce";

const ymdHms = "YYYY-MM-DD HH:mm:ss";

export default {
  components: { hierarchyLogCreate },
  data() {
    return {
      table_config: {
        data: [],
        dummy: [],
        count: 0,
        loader: false,
        query: {
          date: moment().format(ymdHms),
          page: 1,
          perpage: 10,
          sort: "updated_at",
          sort_order: "desc"
        },
        remoteFilter: {
          select: null,
          options: [],
          by: "all",
          loader: false
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "fetchHierarchyLogsTableState",
      "fetchHierarchyLogsTableData",
      "fetchHierarchyLogsTableTitle",
      "deleteHierarchyLogState",
      "deleteHierarchyLogData",
      "deleteHierarchyLogTitle",
      "position"
    ])
  },
  watch: {
    deleteHierarchyLogState({ initial, success, fail }) {
      if (success) {
        this.fetchHierarchyLogsTable(this.table_config.query);
        this.$message({
          type: "success",
          message: this.deleteHierarchyLogTitle,
          duration: 5000
        });
      }
      if (fail) {
        this.$message({
          type: "danger",
          message: this.deleteHierarchyLogTitle,
          duration: 5000
        });
      }
    },
    "table_config.query.date": function(v) {
      this.table_config.query.page = 1;
      // this.table_config.remoteFilter.select = null;
      if(this.table_config.remoteFilter.by == 'all'){
        this.fetchHierarchyLogsTable(this.table_config.query);
      }else{
        if (this.table_config.remoteFilter.select) {
          let data = {
            operations: this.isOperations(),
            date: v,
            perpage: this.table_config.query.perpage,
            page: this.table_config.query.page
          };
          if (this.table_config.remoteFilter.by == "parent_details") {
            data.parent_id = this.table_config.remoteFilter.select;
          } else {
            data.child_id = this.table_config.remoteFilter.select;
          }
          this.fetchHierarchyLogsTable(data);
        } else {
          this.fetchHierarchyLogsTable(this.table_config.query);
        }
      }
    },
    fetchHierarchyLogsTableState({ initial, success, fail }) {
      if (success) {
        this.table_config.data = this.fetchHierarchyLogsTableData.hierarchy_log;
        this.table_config.dummy = this.fetchHierarchyLogsTableData.hierarchy_log;
        this.table_config.count = this.fetchHierarchyLogsTableData.count;
      }
      if(fail){
        this.table_config.data=[];
        this.table_config.dummy = [];
        this.table_config.count=0;
      }
    }
  },
  created() {
    this.fetchHierarchyLogsTable(this.table_config.query);
  },
  methods: {
    ...mapActions(["fetchHierarchyLogsTable", "deleteHierarchyLog"]),
    debounceInput: debounce(function (e) {
      this.fetchHierarchyLogsTable(this.table_config.query);
    }, 1000),
    customSort({ column, prop, order }) {
      this.table_config.query.sort = null;
      this.table_config.query.sort_order = null;
      if (order) {
        this.table_config.query.sort = prop;
        this.table_config.query.sort_order = order == "ascending" ? "asc" : "desc";
      }
      this.fetchHierarchyLogsTable(this.table_config.query);
    },
    refetchTable(v) {
      this.fetchHierarchyLogsTable(this.table_config.query);
    },
    deleteRow(data) {
      if (confirm("Are you sure you want to delete row?")) {
        this.deleteHierarchyLog({ id: data.id });
      }
    },
    getTableFilterOptions(url) {
      let options = {
        headers: {
          Authorization: "Bearer " + this.token
        }
      };

      axios
        .get(url, options)
        .then(res => {
          this.table_config.remoteFilter.options = res.data.meta.hierarchy_log;
        })
        .catch(err => console.log(err.response.data));
    },
    tableSizeChange(v) {
      this.table_config.query.page = 1;
      this.table_config.query.perpage = v;
      this.fetchHierarchyLogsTable(this.table_config.query);
    },
    tablePageChange(v) {
      this.table_config.query.page = v;
      this.fetchHierarchyLogsTable(this.table_config.query);
    },
    remoteSearch(query) {
      let url =
        "api/v1/hierarchy_log?list=true&date=" +
        moment(this.table_config.query.date).format(ymdHms) +
        "&filter_by=" +
        this.table_config.remoteFilter.by;
      if (query != "") {
        url += "&target[]=full_name&query=" + query;
      }
      this.getTableFilterOptions(url);
    },
    isOperations(){
      let result = false;
      switch(this.position.toLowerCase()){
        case 'operations manager':
          case 'team leader':
            result=true;
            break;
            default:
              result =false;
              break
      }
      return result;
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
