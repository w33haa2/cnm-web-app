<template>
  <div class="app-container">
    <h4 style="color:#646464">Missed Logs</h4>
    <div class="filter-container">
      <!-- DISPLAY RECORDS & PAGINATION -->
      <el-row :gutter="8" style="padding-right:8px;margin-bottom:5px;">
        <el-col :md="{span: 4}">
          <el-input v-model="table.request.query" placeholder="Search..." size="mini"></el-input>
        </el-col>
        <el-col :md="{span: 12,offset:8}">
          <el-pagination
            style="float:right"
            small
            background
            :page-sizes="[10, 25, 50, 100]"
            :current-page.sync="table.request.page"
            :page-size="table.request.perpage"
            layout="total, sizes, prev, pager, next"
            :total="fetchMissedLogsData.missed_logs.total"
          />
          <!-- @current-change="tablePageChange" -->
          <!-- @size-change="tableSizeChange" -->
        </el-col>
      </el-row>

      <el-row :gutter="8" style="padding-right:8px;margin-bottom:30px;">
        <el-table v-loading="table.loader" :data="fetchMissedLogsData.missed_logs.data">
          <el-table-column width="200" label="Agent" prop="full_name" fixed>
            <template slot-scope="scope">
              <div class="user-block">
                <img
                  v-if="scope.row.user_info.image_url"
                  class="img-circle"
                  :src="scope.row.user_info.image_url"
                />
                <div
                  v-else
                  class="img-circle text-muted"
                  style="background-color:#d9d9d9;display:flex"
                >
                  <div
                    style="align-self:center;width:100%;text-align:center;"
                    class="text-point-eight-em"
                  >{{ getAvatarLetters(scope.row.user_info.firstname,scope.row.user_info.lastname) }}</div>
                </div>
                <span>
                  <span
                    class="el-dropdown-link"
                    style="font-weight:600"
                  >{{ scope.row.user_info.full_name }}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="200" label="OM">
            <template slot-scope="scope">{{ scope.row.om.full_name }}</template>
          </el-table-column>
          <el-table-column width="200" label="TL">
            <template slot-scope="scope">{{ scope.row.tl.full_name }}</template>
          </el-table-column>
          <el-table-column width="200" label="Date">
            <template
              slot-scope="scope"
            >{{ formatDate(scope.row.start_event.date,"","MMM Do, YYYY")}}</template>
          </el-table-column>
          <el-table-column width="200" label="Schedule">
            <template
              slot-scope="scope"
            >{{ formatDate(scope.row.start_event.date,"","hh:mm a") +" - "+ formatDate(scope.row.end_event.date,"","hh:mm a") }}</template>
          </el-table-column>
          <el-table-column width="200" label="Logs">
            <template
              slot-scope="scope"
            >{{ formatDate(scope.row.time_in.date,"","hh:mm a") +" - "+ (scope.row.time_out?formatDate(scope.row.time_out.date,"","hh:mm a"):'NO LOG') }}</template>
          </el-table-column>
          <el-table-column width="200" label="Status">
            <template
              slot-scope="scope"
            >{{ scope.row.log_status[0].toUpperCase() +" - "+ scope.row.log_status[1].toUpperCase() }}</template>
          </el-table-column>
          <el-table-column width="200" label="Sharable Link">
            <template slot-scope="scope">{{ scope.row.coaching? "YES":"NONE" }}</template>
          </el-table-column>
          <el-table-column width="200" label="Filed by">
            <template slot-scope="scope">{{ scope.row.coaching? "YES":"NONE" }}</template>
          </el-table-column>
          <el-table-column width="200" label="Agent's Approval">
            <template slot-scope="scope">{{ scope.row.coaching? "YES":"NONE" }}</template>
          </el-table-column>
          <el-table-column width="200" label="Agent's Approval">
            <template slot-scope="scope">{{ scope.row.coaching? "YES":"NONE" }}</template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <!-- Create and Update Dialog
    <el-dialog
      :visible.sync="reset.toggle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Reset Password"
      width="40%"
    >
      <el-row>
        <h4>Are you sure? It cannot be reverted back.</h4>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelResetForm">Cancel</el-button>
        <el-button
          type="danger"
          size="mini"
          :loading="employeeUpdateState.initial"
          @click="resetPassword"
        >Confirm</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "RTA-MissedLogs",
  components: {},
  data() {
    return {
      table: {
        loader: false,
        request: {
          page: 1,
          perpage: 10,
          query: null
        }
      }
    };
  },
  created() {
    this.fetchMissedLogs(this.table.request);
  },
  computed: {
    ...mapGetters([
      "fetchMissedLogsState",
      "fetchMissedLogsData",
      "fetchMissedLogsTitle"
    ])
  },
  watch: {
    fetchMissedLogsState({ initial, success, fail }) {
      if (initial) {
        this.table.loader = true;
      }
      if (success) {
        this.table.loader = false;
      }
      if (fail) {
        this.table.loader = false;
      }
    }
  },
  methods: {
    ...mapActions(["fetchMissedLogs"])
  }
};
</script>


<style lang="scss">
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