<template>
  <div class="table-container shadow">
    <el-row :gutter="20">
      <el-col :md="{ span: 6 }">
        <div class="text-header">Requests</div>
      </el-col>
      <el-col :md="{ span: 18 }">
        <el-pagination
          style="float:right"
          small
          background
          :pager-count="5"
          :page-sizes="[10, 25, 50]"
          :page-size="table.request.limit"
          layout="total, sizes, prev, pager, next"
          :total="table.count"
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
      <el-col :md="{ span: 7 }" style="margin-top:10px">
        <el-tooltip content="Name Search">
          <el-input size="mini" v-model="table.request.query" placeholder="Search..."></el-input>
        </el-tooltip>
      </el-col>
      <el-col :md="{ span: 6, offset:11 }" style="margin-top:10px;">
        <el-tooltip content="Request Week">
          <el-date-picker
            size="mini"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{ firstDayOfWeek: 1 }"
            :clearable="false"
            style="width:100%"
            v-model="table.request.created_start_date"
            @change="weekChange"
          />
        </el-tooltip>
      </el-col>
      <el-col style="margin-top:10px">
        <el-table
          class="monday"
          :data="table.data"
          width="400"
          v-loading="table.loader"
          @sort-change="columnSort"
        >
          <el-table-column label="Name" width="250">
            <template slot-scope="scope">
              <div style="height:45px;border-left:red 7px solid;display:flex">
                <div
                  style="width:100%;align-self:center;padding-left:20px;"
                >{{ scope.row.full_name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" sortable="custom" prop="full_name">
            <template slot-scope="scope">
              <div class="user-block">
                <div v-if="scope.row.image_url" style="width:100%;">
                  <div style="margin:0 auto;height:30px;width:30px;">
                    <img class="img-circle" style="margin:0 auto;" :src="scope.row.image_url" />
                  </div>
                </div>
                <div v-else class="text-muted" style="width:100%;">
                  <div class="img-circle" style="background-color:white;margin:0 auto;">
                    <div style="display:flex;height:30px;width:30px;">
                      <div
                        style="align-self:center;width:100%;text-align:center;font-weight:bold;font-size:.8em"
                      >
                        {{
                        getAvatarLetters(
                        scope.row.firstname,
                        scope.row.lastname
                        )
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <template v-for="(n, i) in 3">
            <el-table-column :label="'Request ' + (i + 1)" :key="i">
              <template slot-scope="scope">
                <request-block
                  :leave="
                    typeof scope.row.leaves[i] == 'undefined'
                      ? null
                      : scope.row.leaves[i]
                  "
                  :slots="table.slots"
                  :requestedBy="scope.row.full_name"
                  :cluster_id="filter.cluster_id"
                  @fetch="fetchTableData"
                ></request-block>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="Previous Leave">
            <template slot-scope="scope">
              <div style="height:45px;display:flex">
                <div style="align-self:center;width:100%;text-align:center">
                  {{
                  scope.row.last_approved_leave
                  ? formatDate(
                  scope.row.last_approved_leave.start_event,
                  "",
                  "ddd MMM Do"
                  ) +
                  " (" +
                  scope.row.last_approved_leave.leave_days +
                  ")"
                  : "No approved leaves"
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Credits">
            <template slot-scope="scope">
              <div style="height:45px;display:flex">
                <div
                  style="align-self:center;width:100%;text-align:center;font-size:2em;font-weight:bold;"
                >
                  {{
                  scope.row.leave_credits.filter(
                  i => i.leave_type == filter.leave_type
                  )[0] ?
                  scope.row.leave_credits.filter(
                  i => i.leave_type == filter.leave_type
                  )[0].value: 0
                  }}
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
import Moment from "moment/moment";
// import tz from "moment-timezone";
import { extendMoment } from "moment-range";
const moment = extendMoment(
  Moment
  // , tz
);
import requestBlock from "./requestBlock";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["filter", "fetch"],
  components: { requestBlock },
  data() {
    return {
      table: {
        data: null,
        loader: false,
        count: 0,
        request: {
          created_start_date: moment()
            .startOf("isoweek")
            .format("YYYY-MM-DD HH:mm:ss"),
          created_end_date: moment()
            .endOf("isoweek")
            .format("YYYY-MM-DD HH:mm:ss"),
          leave_type: null,
          om_id: null,
          sort: "full_name",
          order: "asc",
          offset: null,
          limit: 10,
          target: null,
          query: ""
          // relations: ["leaves", "leave_credits"]
        }
      }
    };
  },
  mounted() {
    this.table.request.om_id = this.filter.cluster_id;
    this.fetchTableData();
  },
  watch: {
    fetch(v) {
      this.fetchTableData();
    },
    "table.request.query": function(v) {
      if (v != "") {
        this.table.request.target = ["full_name"];
      } else {
        this.table.request.target = null;
      }
      this.fetchTableData();
    },
    fetchUserWeeklyLeaveRequestsState({ initial, success, fail }) {
      if (initial) {
        this.table.loader = true;
      }
      if (success) {
        this.table.loader = false;
        this.table.data = this.fetchUserWeeklyLeaveRequestsData.metadata;
        this.table.count = this.fetchUserWeeklyLeaveRequestsData.count;
      }
      if (fail) {
        this.table.loader = false;
        this.table.data = null;
        this.table.count = 0;
      }
    },
    "table.request.created_start_date": function(v) {
      this.table.request.created_end_date = moment(v)
        .endOf("isoweek")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  },
  computed: {
    ...mapGetters([
      "fetchUserWeeklyLeaveRequestsData",
      "fetchUserWeeklyLeaveRequestsState",
      "fetchUserWeeklyLeaveRequestsTitle"
    ])
  },
  methods: {
    ...mapActions(["fetchUserWeeklyLeaveRequests"]),
    weekChange(v) {
      this.table.request.created_start_date = moment(v)
        .startOf("isoweek")
        .format("YYYY-MM-DD HH:mm:ss");
      this.table.request.created_end_date = moment(v)
        .endOf("isoweek")
        .format("YYYY-MM-DD HH:mm:ss");
      this.$emit("week", this.table.request.created_start_date);
      this.fetchTableData();
    },
    initializeRequestData() {
      this.table.request.leave_type = this.filter.leave_type;
      this.table.request.om_id = this.filter.cluster_id;
      this.table.request.created_start_date = moment(this.filter.request_week)
        .startOf("isoweek")
        .format("YYYY-MM-DD HH:mm:ss");
      this.table.request.created_end_date = moment(this.filter.request_week)
        .endOf("isoweek")
        .format("YYYY-MM-DD HH:mm:ss");
    },
    fetchTableData() {
      this.initializeRequestData();
      if (this.table.request.om_id) {
        this.fetchUserWeeklyLeaveRequests(this.table.request);
      }
    },
    columnSort({ column, prop, order }) {
      this.table.request.order = order
        ? order == "ascending"
          ? "asc"
          : "desc"
        : "asc";
      this.table.request.sort = order ? prop : "full_name";
      this.fetchTableData();
    },
    tableSizeChange(v) {
      this.table.request.offset = 0;
      this.table.request.limit = v;
      this.fetchTableData();
    },
    tablePageChange(v) {
      this.table.request.offset = (v - 1) * this.table.request.limit;
      this.fetchTableData();
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
  /* border-left: 5px solid red !important; */
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

.monday >>> th > .cell {
  font-weight: light;
}
</style>
