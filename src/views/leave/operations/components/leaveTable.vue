<template>
  <div>
    <el-row>
      <!-- pagination -->
      <el-col :md="{span:8}">
        <el-tag :type="tag.type">{{ tag.label }}</el-tag>
      </el-col>
      <el-col :md="{span:16}">
        <el-pagination
          style="float:right"
          :page-sizes="[10, 25, 50]"
          :page-size="100"
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
          style="margin-top:10px;"
          v-loading="leavesfetchState.initial"
        >
          <el-table-column label="Employee" min-width="100" prop="full_name" fixed>
            <template slot="header">
              <span style="float:left">
                <h4 class="text-muted">Employee</h4>
              </span>
              <!-- <span style="float:left;padding:15px;">
                <i class="el-icon-sort text-point-eight-em cur-p" @click="columnSort('email')" />
              </span>-->
            </template>
            <template slot-scope="scope">
              <div class="user-block">
                <img v-if="scope.row.user.info.image_url" class="img-circle" :src="scope.row.user.info.image_url">
                <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
                  <div
                    style="align-self:center;width:100%;text-align:center;"
                    class="text-point-eight-em"
                  >{{ getAvatarLetters(scope.row.user.info.firstname,scope.row.user.info.lastname) }}</div>
                </div>
                <span>
                  {{ scope.row.user.full_name }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Dates"  width="150">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.start_event,"","MMM Do") }}</span> -
              <span>{{ formatDate(scope.row.end_event,"","MMM Do") }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Leave Type"  width="150">
            <template slot-scope="scope">{{ remUnderscore(ucwords(scope.row.leave_type)) }}</template>
          </el-table-column>
          <el-table-column align="center" label="History" width="150">
            <template slot-scope="scope">
              <span style="color:grey">DATE HERE</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Credits" width="150">
            <template slot-scope="scope">
              <span style="color:grey">DATE HERE</span>
            </template>
          </el-table-column>
          <template v-if="status == 'pending'">
            <el-table-column align="center" label="Action" width="100">
              <template slot-scope="scope">
                <el-row>
                  <el-col>
                    <el-button
                      size="mini"
                      @click="approveLeave({id: scope.row.id})"
                      type="info"
                      style="margin-bottom:3px;width:100%"
                    >Approve</el-button>
                  </el-col>
                  <el-col>
                    <el-button
                      :plain="true"
                      size="mini"
                      @click="rejectLeave({id: scope.row.id})"
                      type="info"
                      style="width:100%"
                    >Decline</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </template>
          <template v-if="status == 'approved'">
            <el-table-column align="center" label="Action" width="100">
              <template slot-scope="scope">
                <el-row>
                  <el-col>
                    <el-button
                      :plain="true"
                      size="mini"
                      @click="cancelLeave({id: scope.row.id, cancel_event: scope.row.start_event})"
                      type="info"
                      style="width:100%"
                    >Cancel</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Leave_Tables",
  props: ["status", "activeTab"],
  data() {
    return {
      tableData: {},
      query: {
        limit: 10,
        offset: 0,
        status: null
      },
      tag: {
        type: null,
        label: null
      }
    };
  },
  computed: {
    ...mapGetters(["userDetails", "leaves", "leavesfetchState"])
  },
  mounted() {
    if (this.activeTab == this.status) {
      this.tag = {
        type: "warning",
        label: "PENDING"
      };
      this.query.status = this.activeTab;
      this.fetchLeave(this.query);
    }
  },
  watch: {
    activeTab(v) {
      this.tableData = {};
      if (v == this.status) {
        switch (v) {
          case "pending":
            this.tag = {
              type: "warning",
              label: v.toUpperCase()
            };
            break;
          case "approved":
            this.tag = {
              type: "success",
              label: v.toUpperCase()
            };
            break;
          case "rejected":
            this.tag = {
              type: "danger",
              label: v.toUpperCase()
            };
            break;
        }
        this.query.status = v;
        this.fetchLeave(this.query);
      }
    },
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
    }
  },
  methods: {
    ...mapActions([
      "fetchLeave",
      "approveLeave",
      "cancelLeave",
      "rejectLeave"
    ]),
    updateRow(data) {
      data.action = "update";
      this.$emit("on-update", data);
    },
    tableSizeChange(value) {
      this.query.limit = value;
      // this.fetchIssuedReports(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      // this.fetchIssuedReports(this.query);
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
        case "denied":
          type = "danger";
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

<style lang="scss" scoped>
.fz-14px {
  font-size: 14px;
}
.c-grey {
  color: grey;
}
.user-block {
  .username,
  .description {
    display: block;
    margin-left: 50px;
    padding: 2px 0;
  }
  .username {
    // font-size: 0.8em;
    color: #777;
  }
  :after {
    clear: both;
  }
  .img-circle {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    float: left;
  }
  span {
    font-weight: 500;
    margin-left: 10px;
    // font-size: 0.8em;
  }
}
</style>
