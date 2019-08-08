<template>
  <div>
    <el-row>
      <!-- pagination -->
      <el-col>
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
          <el-table-column align="center" label="Status">
            <template slot-scope="scope">
              <el-tag :type="tagType(scope.row.status)">{{ scope.row.status.toUpperCase() }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Dates">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.start_event,"","MMM Do") }}</span> -
              <span>{{ formatDate(scope.row.end_event,"","MMM Do") }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Leave Type">
            <template slot-scope="scope">{{ ucwords(scope.row.leave_type) }}</template>
          </el-table-column>
          <template v-if="status == 'pending'">
            <el-table-column align="center" label="Edit">
              <template slot-scope="scope">
                <el-button :plain="true" size="mini" @click="updateRow(scope.row)">
                  <i class="el-icon-edit-outline" />
                </el-button>
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
        // user_id: this.userDetails.id, //uncomment on production
        user_id: 7, // temporary data
        status: null
      }
    };
  },
  computed: {
    ...mapGetters(["userDetails", "leaves", "leavesfetchState"])
  },
  mounted() {
    if (this.activeTab == this.status) {
      this.query.status = this.activeTab;
      this.fetchLeave(this.query);
    }
  },
  watch: {
    activeTab(v) {
      this.tableData = {};
      if (v == this.status) {
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
      "fetchPendingLeave",
      "fetchApprovedLeave",
      "fetchDeniedLeave"
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
</style>
