<template>
  <div>
    <el-row>
      <!-- pagination -->
      <el-col>
        <el-pagination
          style="float:right"
          :page-sizes="[10, 25, 50]"
          :page-size="100"
          :pager-count="5"
          layout="total, sizes, prev, pager, next"
          :total="tableData.count"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
      <el-col>
        <el-table
          :data="tableData.leaves"
          style="margin-top:5px;"
          v-loading="leavesfetchState.initial"
          class="monday"
          @sort-change="customSort"
        >
          <el-table-column
            align="center"
            label="Leave Type"
            prop="leave_type"
            @sort="custom"
          >
            <template slot-scope="scope">{{
              remUnderscore(ucwords(scope.row.leave_type))
            }}</template>
          </el-table-column>
          <el-table-column align="center" label="Dates">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.start_event, "", "MMM Do") }}</span>
              -
              <span>{{ formatDate(scope.row.end_event, "", "MMM Do") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Request Date"
            prop="created_at"
            @sort="custom"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="fromNow(scope.row.created_at)"
                placement="top"
              >
                <div class="d-flex" style="justify-content:center">
                  <div style="align-self:center">
                    {{ formatDate(scope.row.created_at, "", "MMM Do, YYYY") }}
                  </div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column align="center" label="Status">
            <template slot-scope="scope">
              <div
                class="tag d-flex"
                :class="'tag-' + tagType(scope.row.status)"
              >
                <div style="align-self:center">
                  {{ scope.row.status.toUpperCase() }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Edit" width="50">
            <template slot-scope="scope">
              <div
                style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                @click="updateRow(scope.row)"
              >
                <div style="align-self:center;color:gray;font-size:2em">
                  <square-edit-icon></square-edit-icon>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="Del" width="50">
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
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import { Message } from "element-ui"
import moment from "moment";
export default {
  name: "Leave_Tables",
  props: ["status", "activeTab"],
  data() {
    return {
      tableData: {},
      query: {
        limit: 10,
        offset: 0,
        user_id: null, // temporary data
        order: "desc",
        sort: "created_at"
      }
    };
  },
  computed: {
    ...mapGetters([
      "userDetails",
      "leaves",
      "leavesfetchState",
      "deleteLeaveState",
      "user_id"
    ])
  },
  mounted() {
    this.query.generated_by = this.user_id;
    this.fetchLeave(this.unsetNull(this.query));
  },
  watch: {
    leavesfetchState({ initial, success, fail }) {
      if (success) {
        this.tableData = this.leaves;
      }
      if (fail) {
        this.tableData = {
          leaves: [],
          count: 0
        };
      }
    },
    deleteLeaveState({ initial, success, fail }) {
      if (success) {
        this.$message({
          message: "You have successfully deleted your request.",
          type: "success",
          duration: 1000 * 5
        });
        this.fetchLeave(this.unsetNull(this.query));
      }
      if (fail) {
        this.$message({
          message: "Oops! There's a problem processing your request.",
          type: "error",
          duration: 1000 * 5
        });
      }
    }
  },
  methods: {
    ...mapActions([
      "fetchLeave",
      "fetchPendingLeave",
      "fetchApprovedLeave",
      "fetchDeniedLeave",
      "deleteLeave"
    ]),
    updateRow(data) {
      let isBefore = moment(data.start_event, "YYYY-MM-DD").isBefore(
        moment().format("YYYY-MM-DD")
      );
      if (isBefore) {
        this.$message({
          message: "Oops! Updates for this request is not allowed.",
          type: "warning",
          duration: 1000 * 5
        });
      } else {
        data.action = "update";
        this.$emit("on-update", data);
      }
    },
    deleteRow(data) {
      let isBefore = moment(data.start_event, "YYYY-MM-DD").isBefore(
        moment().format("YYYY-MM-DD")
      );
      if (isBefore) {
        this.$message({
          message: "Oops! Deletion of this request is not allowed.",
          type: "warning",
          duration: 1000 * 5
        });
      } else {
        if (confirm("Are you sure you want to delete?")) {
          this.deleteLeave({ id: data.id });
        } else {
          alert("not deleted"); //temporary
        }
      }
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.fetchLeave(this.unsetNull(this.query));
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.fetchLeave(this.unsetNull(this.query));
    },
    tagType(status) {
      let type = "warning";
      switch (status) {
        case "pending":
          type = "warning";
          break;
        case "approved":
          type = "success";
          break;
        case "rejected":
          type = "danger";
          break;
        case "cancelled":
          type = "info";
          break;
      }
      return type;
    },
    //
    remUnderscore(string) {
      let str = string.split("_");
      let result = "";
      str.forEach((v, i) => {
        if (str.lenght - 1 != i) {
          result += v + " ";
        } else {
          result += v;
        }
      });
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
  border-left: 5px solid crimson;
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
