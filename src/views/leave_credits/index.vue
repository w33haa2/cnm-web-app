<template>
  <div class="app-container">
    <!-- title bar -->
    <div class="title-bar shadow">
      <el-row :gutter="8">
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px;">
              Leave Credits
            </div>
            <template v-if="isHR()">
              <create-credits></create-credits>
            </template>
          </div>
        </el-col>
        <el-col :md="{ span: 8 }">
          <el-tooltip content="Name search" placement="top">
            <el-input
              v-model="request.query"
              placeholder="Search..."
              @input="debounceInput"
            ></el-input>
          </el-tooltip>
        </el-col>
        <el-col :md="{ span: 4 }">
          <el-tooltip content="Leave Type" placement="top">
            <el-select
              v-model="request.leave_type"
              placeholder="Leave type"
              style="width:100%"
            >
              <template v-for="(option, index) in options.leave_type">
                <el-option
                  :key="index"
                  :value="option.value"
                  :label="option.label"
                />
              </template>
            </el-select>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>

    <!-- table -->
    <div class="table-container shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          {{
            options.leave_type.filter(i => i.value == request.leave_type)[0]
              .label
          }}
        </el-col>
        <!-- Search and Pagination -->
        <el-col :md="{ span: 12 }">
          <el-pagination
            style="float:right"
            :pager-count="5"
            :page-sizes="[10, 25, 50]"
            :page-size="table_config.display_size"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            :current-page.sync="table_config.page"
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
            background
            small
          />
        </el-col>
        <el-col :md="{ span: 24 }">
          <!-- Table -->
          <el-table
            :data="table_config.data"
            class="monday"
            style="width: 100%;margin-top:5px;"
            v-loading="table_config.loader"
            @sort-change="customSort"
          >
            <el-table-column
              label="Name"
              sortable="custom"
              align="left"
              prop="user.firstname"
            >
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-tooltip :content="scope.row.user.email">
                    <div
                      style="width:100%;align-self:center;padding-left:20px;"
                    >
                      {{ scope.row.user.full_name }}
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <div class="user-block">
                  <div v-if="scope.row.user.image_url" style="width:100%;">
                    <div style="margin:0 auto;height:30px;width:30px;">
                      <img
                        class="img-circle"
                        style="margin:0 auto;"
                        :src="scope.row.user.image_url"
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
                              scope.row.user.firstname,
                              scope.row.user.lastname
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Credits">
              <template slot-scope="scope">
                <span style="font-weight:800;font-size:1.2em">{{
                  scope.row.value
                }}</span>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <update-credits :data="scope.row"></update-credits>
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
import moment from "moment";
import createCredits from "./components/create_credits";
import updateCredits from "./components/update_credits";
import { debounce } from "debounce";

export default {
  components: { createCredits, updateCredits },
  data() {
    return {
      table_config: {
        display_size: 10,
        page: 1,
        loader: false,
        data: [],
        count: 0
      },
      request: {
        query: null,
        leave_type: "vacation_leave",
        offset: 0,
        limit: 10,
        order: "desc",
        sort: "updated_at"
      },
      options: {
        leave_type: [
          {
            value: "vacation_leave",
            label: "Vacation"
          },
          {
            value: "sick_leave",
            label: "Sick"
          }
        ]
      },
      form: {
        credits: {
          dialog: false,
          confirm: false,
          field: {
            value: 0,
            leave_type: null
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "fetchLeaveCreditsState",
      "fetchLeaveCreditsData",
      "fetchLeaveCreditsTitle",
      "updateLeaveCreditsState",
      "updateLeaveCreditsData",
      "updateLeaveCreditsError",
      "searchLeaveCreditsState",
      "searchLeaveCreditsData",
      "searchLeaveCreditsError",
      "bulkCreateLeaveCreditsState",
      "bulkCreateLeaveCreditsData",
      "bulkCreateLeaveCreditsError"
    ])
  },
  mounted() {
    this.fetchTable();
  },
  watch: {
    "request.leave_type": function(v) {
      this.fetchTable();
    },
    bulkCreateLeaveCreditsState({ initial, success, fail }) {
      if (initial) {
        this.form.credits.confirm = true;
      }
      if (success) {
        this.form.credits.confirm = false;
        this.refresh_table = !this.refresh_table;
        this.$message({
          type: "success",
          message:
            "You have successfully initialized agents with no leave credits.",
          duration: 5000
        });
      }
      if (fail) {
        this.form.credits.confirm = false;
        this.$message({
          type: "error",
          message: "There is a problem processing your request.",
          duration: 5000
        });
      }
    },
    fetchLeaveCreditsState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.count = this.fetchLeaveCreditsData.count;
        this.table_config.data = this.fetchLeaveCreditsData.leave_credits;
      }
      if (fail) {
        this.table_config.loader = false;
        this.$message({
          type: "error",
          message: this.fetchLeaveCreditsTitle,
          duration: 5000
        });
      }
    },
    updateLeaveCreditsState({ initial, success, fail }) {
      if (success) {
        this.fetchTable();
        this.$message({
          type: "success",
          message: "Successfully updated data.",
          duration: 5000
        });
      }
      if (fail) {
        this.$message({
          type: "error",
          message: "There is a problem processing your request.",
          duration: 5000
        });
      }
    }
  },
  methods: {
    ...mapActions(["fetchLeaveCredits", "searchLeaveCredits"]),
    debounceInput: debounce(function(e) {
      this.fetchTable();
    }, 1000),
    customSort({ column, prop, order }) {
      this.request.sort = null;
      this.request.order = null;
      if (order) {
        this.request.sort = prop;
        this.request.order = order == "ascending" ? "asc" : "desc";
      } else {
        this.request.sort = "updated_at";
        this.request.order = "desc";
      }
      this.fetchTable();
    },
    fetchTable() {
      this.fetchLeaveCredits(this.request);
    },
    tableSizeChange(value) {
      this.request.limit = value;
      this.fetchTable();
    },
    tablePageChange(value) {
      this.request.offset = (value - 1) * this.request.limit;
      this.fetchTable();
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
