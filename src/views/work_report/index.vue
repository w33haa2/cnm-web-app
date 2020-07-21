<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }" :sm="{ span: 12 }" :xs="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper">
              Work Reports
            </div>
          </div>
        </el-col>
        <el-col
          :md="{ span: 5, offset: 7 }"
          :sm="{ span: 6, offset: 6 }"
          :xs="{ span: 8, offset: 4 }"
        >
          <el-date-picker
            type="month"
            style="width:100%"
            v-model="work_report.month"
            format="MMMM-yyyy"
            :clearable="false"
          ></el-date-picker>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-col :md="{ span: 14 }" :sm="{ span: 24 }">
        <div class="table-container shadow">
          <el-row :gutter="20">
            <el-col :md="{ span: 24 }">
              <div class="d-flex" style="justify-content:space-between">
                <div style="align-self:center;">
                  {{
                    formatDate(work_report.month, "", "MMMM YYYY") + " Reports"
                  }}

                  <div style="display:inline-block">
                    <sort-button @sort_data="columnSort"></sort-button>
                  </div>
                </div>

                <div style="align-self:center;color:gray">
                  <!-- number of data display 0 or more-->
                  <template v-if="fetchSchedulesState.initial">
                    Loading...
                  </template>
                  <template v-else>
                    <template v-if="schedules.length > 0">
                      {{ schedules.length }}
                      Schedules
                    </template>
                    <!-- 0 number of data -->
                    <template v-else>
                      No Schedules
                    </template>
                  </template>
                </div>
              </div>
            </el-col>
            <el-col :md="{ span: 24 }">
              <el-table
                :data="schedules"
                v-loading="fetchSchedulesState.initial"
              >
                <el-table-column width="50" align="cefetchSchedulesDataay:flex">
                  <template slot-scope="scope">
                    <div style="align-self:center">
                      <div style="font-size:1.8em;">{{ scope.row.date.d }}</div>
                      <div>{{ scope.row.date.day1 }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="170" style="diplay:flex">
                  <template slot-scope="scope">
                    <div>
                      <div class="col-header">
                        SCHEDULE
                        <div
                          class="sub-col-header"
                          :class="
                            scope.row.title_id == 1 ? 'primary' : 'danger'
                          "
                        >
                          {{ scope.row.title_id == 1 ? "REGULAR" : "OVERTIME" }}
                        </div>
                      </div>
                      <div>
                        {{
                          formatDate(scope.row.start_event.date, "", "hh:mmA") +
                            " to " +
                            formatDate(scope.row.end_event.date, "", "hh:mmA")
                        }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="170" style="diplay:flex">
                  <template slot-scope="scope">
                    <div>
                      <div class="col-header">
                        ATTENDANCE
                        <div
                          class="sub-col-header"
                          :class="evaluateRemarks(scope.row.remarks)"
                        >
                          {{ scope.row.remarks.toUpperCase() }}
                        </div>
                      </div>
                      <div>
                        <template v-if="scope.row.attendances.length > 0">
                          {{
                            formatDate(
                              scope.row.attendances[0].time_in.date,
                              "",
                              "hh:mmA"
                            ) +
                              " to " +
                              (scope.row.attendances[0].time_out !== null
                                ? formatDate(
                                    scope.row.attendances[0].time_out.date,
                                    "",
                                    "hh:mmA"
                                  )
                                : "--:----")
                          }}
                        </template>
                        <template v-else>
                          {{ "--:---- to --:----" }}
                        </template>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="80" style="diplay:flex">
                  <template slot-scope="scope">
                    <el-tooltip placement="top" content="Night Differential">
                      <div>
                        <div class="col-header">
                          <span>ND</span>
                          
                        <div
                          class="sub-col-header primary"
                          v-if="scope.row.rendered_hours.night_difference != '0.00'"
                        >
                        <check-bold-icon></check-bold-icon>
                        </div>
                        </div>
                        <div>
                          {{
                            scope.row.rendered_hours.night_difference + " hr/s"
                          }}
                        </div>
                      </div>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column min-width="80" style="diplay:flex">
                  <template slot-scope="scope">
                    <el-tooltip placement="top" content="Voluntary Timeout">
                      <div>
                        <div class="col-header">
                          <span>VTO </span>
                          
                        <div
                          class="sub-col-header success"
                          v-if="scope.row.vto_at"
                        >
                        <check-bold-icon></check-bold-icon>
                        </div>
                        </div>
                        <div>
                          {{ scope.row.vto_at !==null ? scope.row.vto_hours.second / 60 / 60 + " hr/s" : "0.00 hr/s" }}
                        </div>
                      </div>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="70" style="diplay:flex">
                  <template slot-scope="scope">
                    <div>
                      <div class="col-header">OM</div>
                      <div>
                        <template v-if="scope.row.om!==null">
                          <el-tooltip :content="scope.row.om.full_name" placement="top">
                              <div>
                                <template v-if="scope.row.om.image_url!=null">
                                  <el-avatar :size="30" :src="scope.row.om.image_url"></el-avatar>
                                </template>
                                <template v-else>
                                  <el-avatar :size="30" src="default.gif"></el-avatar>
                                </template>
                              </div>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <el-tooltip content="Not assigned" placement="top">
                              <div>
                                <template>
                                  <el-avatar :size="30" src="default.gif"></el-avatar>
                                </template>
                              </div>
                          </el-tooltip>
                        </template>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="70" style="diplay:flex">
                  <template slot-scope="scope">
                    <div>
                      <div class="col-header">TL</div>
                      <div>
                        <template v-if="scope.row.tl!==null">
                          <el-tooltip :content="scope.row.tl.full_name" placement="top">
                              <div>
                                <template v-if="scope.row.tl.image_url!=null">
                                  <el-avatar :size="30" :src="scope.row.tl.image_url"></el-avatar>
                                </template>
                                <template v-else>
                                  <el-avatar :size="30" src="default.gif"></el-avatar>
                                </template>
                              </div>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <el-tooltip content="Not assigned" placement="top">
                              <div>
                                <template>
                                  <el-avatar :size="30" src="default.gif"></el-avatar>
                                </template>
                              </div>
                          </el-tooltip>
                        </template>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import agentCard from "./components/AgentCard";
import moment from "moment";
import sortButton from "@/components/reusables/sort_button";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AgentWorkReports",
  components: { agentCard, sortButton },
  data() {
    return {
      work_report: {
        month: moment().format("YYYY-MM")
      },
      query: {
        start_date: moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        end_date: moment()
          .endOf("month")
          .format("YYYY-MM-DD"),
        user_id: this.user_id,
        sort: "start_event",
        order: "desc",
        query_date: null
      },
      schedules: []
    };
  },
  computed: {
    ...mapGetters([
      "fetchSchedulesState",
      "fetchSchedulesData",
      "fetchSchedulesTitle",
      "user_id"
    ])
  },
  mounted() {
    this.fetchSchedules(this.query);
  },
  watch: {
    fetchSchedulesState({ initial, success, fail }) {
      if (success) {
        this.schedules = this.fetchSchedulesData.meta.agent_schedules;
      } else {
        this.schedules = [];
      }
    },
    "work_report.month": function(v) {
      this.query.start_date = moment(v)
        .startOf("month")
        .format("YYYY-MM-DD");
      this.query.end_date = moment(v)
        .endOf("month")
        .format("YYYY-MM-DD");
      this.fetchSchedules(this.query);
    }
  },
  methods: {
    ...mapActions(["fetchSchedules"]),
    columnSort(order) {
      this.query.order = order ? order : "desc";
      this.fetchSchedules(this.query);
    },
    evaluateRemarks(remarks) {
      let className = "danger";
      switch (remarks.toLowerCase()) {
        case "upcoming":
          className = "primary";
          break;
        case "present":
          className = "success";
          break;
        case "on-leave":
          className = "warning";
          break;
        case "absent":
          className = "secondary";
          break;
        case "ncns":
          className = "danger";
          break;
      }
      return className;
    }
  }
};
</script>
