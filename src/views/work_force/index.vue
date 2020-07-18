<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 20 }">
          <div class="title-wrapper">
            Work Force
          </div>
        </el-col>
        <el-col :md="{ span: 4 }">
          <!-- Search and Pagination -->
          <el-date-picker
            type="date"
            style="width:100%"
            :clearable="false"
            v-model="query.start_date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="Select date..."
          ></el-date-picker>
        </el-col>
      </el-row>
    </div>

    <!-- Table -->
    <div class="table-container work-force-container shadow">
      <div>
        {{
          formatDate(
            query.start_date,
            "",
            "ddd. MMM Do, YYYY"
          )
        }}
      </div>
      <el-table
        :data="table_config.data"
        class="monday"
        style="width: 100%;"
        v-loading="table_config.loader"
        @sort-change="columnSort"
      >
        <el-table-column
          label="Team Leader"
          sortable="custom"
          prop="full_name"
          fixed
        >
          <template slot-scope="scope">
            <div style="display:flex">
              <el-tooltip :content="scope.row.email">
                <div style="width:100%;align-self:center;padding-left:20px;">
                  {{ scope.row.full_name }}
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="50" fixed>
          <!-- sortable="custom" prop="full_name" -->

          <template slot-scope="scope">
            <div class="user-block">
              <div v-if="scope.row.image_url" style="width:100%;">
                <div style="margin:0 auto;height:30px;width:30px;">
                  <img
                    class="img-circle"
                    style="margin:0 auto;"
                    :src="scope.row.image_url"
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

        <!-- <el-table-column
          align="left"
          label="Team Leader"
          sortable="custom"
          prop="full_name"
        >
          <template slot-scope="scope">
            <div class="user-block">
              <img
                v-if="scope.row.image_url"
                class="img-circle"
                :src="scope.row.image_url"
              />
              <div
                v-else
                class="img-circle text-muted"
                style="background-color:#d9d9d9;display:flex"
              >
                <div
                  style="align-self:center;width:100%;text-align:center;"
                  class="text-point-eight-em"
                >
                  {{
                    getAvatarLetters(scope.row.firstname, scope.row.lastname)
                  }}
                </div>
              </div>
              <span>{{ scope.row.full_name }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column align="center" width="110" class="attr-count">
          <template slot="header" slot-scope="scope">
            Scheduled
            <div style="padding:0px 5px">
              <div
                style="color:white;background-color:grey;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"
              >
                <!-- <small> -->
                {{ table_config.col_count.scheduled }}
                <!-- </small> -->
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-popover width="300" trigger="click">
              <el-table
                :data="scope.row.tl_schedules"
                width="100%"
                max-height="300px"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{ scope.row.tl_schedules.length }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" class="attr-count">
          <template slot="header" slot-scope="scope">
            Present
            <div style="padding: 0px 5px;">
              <div
                style="color:white;background-color:#67C23A;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"
              >
                <!-- <small> -->
                {{ table_config.col_count.present }}
                <!-- </small> -->
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-popover width="300" trigger="click">
              <el-table
                :data="
                  scope.row.tl_schedules.filter(
                    i => i.remarks.toLowerCase() == 'present'
                  )
                "
                width="100%"
                max-height="300px"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{
                scope.row.tl_schedules.filter(
                  i => i.remarks.toLowerCase() == "present"
                ).length
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" class="attr-count">
          <template slot="header" slot-scope="scope">
            On-leave
            <div style="padding:0px 5px">
              <div
                style="color:white;background-color:#E6A23C;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"
              >
                <!-- <small> -->
                {{ table_config.col_count.onleave }}
                <!-- </small> -->
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-popover width="300" trigger="click">
              <el-table
                :data="
                  scope.row.tl_schedules.filter(
                    i => i.remarks.toLowerCase() == 'on-leave'
                  )
                "
                width="100%"
                max-height="300px"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{
                scope.row.tl_schedules.filter(
                  i => i.remarks.toLowerCase() == "on-leave"
                ).length
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" class="attr-count">
          <template slot="header" slot-scope="scope">
            Absent
            <div style="padding:0px 5px;">
              <div
                style="color:white;background-color:#909399;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"
              >
                <!-- <small> -->
                {{ table_config.col_count.absent }}
                <!-- </small> -->
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-popover width="300" trigger="click">
              <el-table
                :data="
                  scope.row.tl_schedules.filter(
                    i => i.remarks.toLowerCase() == 'absent'
                  )
                "
                width="100%"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{
                scope.row.tl_schedules.filter(
                  i => i.remarks.toLowerCase() == "absent"
                ).length
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" class="attr-count">
          <template slot="header" slot-scope="scope">
            NCNS
            <div style="padding:0px 5px">
              <div
                style="color:white;background-color:#F56C6C;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"
              >
                <!-- <small> -->
                {{ table_config.col_count.ncns }}
                <!-- </small> -->
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-popover width="300" trigger="click">
              <el-table
                :data="
                  scope.row.tl_schedules.filter(
                    i =>
                      i.remarks.toLowerCase() == 'ncns' &&
                      i.user_status.status == 'active'
                  )
                "
                width="100%"
                max-height="300px"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{
                scope.row.tl_schedules.filter(
                  i =>
                    i.remarks.toLowerCase() == "ncns" &&
                    i.user_status.status == "active"
                ).length
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" class="attr-count">
          <template slot="header" slot-scope="scope">
            Upcoming
            <div style="padding:0px 5px">
              <div
                style="color:white;background-color:#0072ff;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"
              >
                <!-- <small> -->
                {{ table_config.col_count.upcoming }}
                <!-- </small> -->
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-popover width="300" trigger="click">
              <el-table
                :data="
                  scope.row.tl_schedules.filter(
                    i =>
                      i.remarks.toLowerCase() == 'upcoming' &&
                      i.user_status.status == 'active'
                  )
                "
                width="100%"
                max-height="300px"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{
                scope.row.tl_schedules.filter(
                  i =>
                    i.remarks.toLowerCase() == "upcoming" &&
                    i.user_status.status == "active"
                ).length
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" class="attr-count">
          <template slot="header" slot-scope="scope">
            inactive
            <div style="padding:0px 5px">
              <div
                style="color:white;background-color:rgb(143, 2, 2);padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"
              >
                <!-- <small> -->
                {{ table_config.col_count.inactive }}
                <!-- </small> -->
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-popover width="300" trigger="click">
              <el-table
                :data="
                  scope.row.tl_schedules.filter(
                    i =>
                      (i.remarks.toLowerCase() == 'ncns' ||
                        i.remarks.toLowerCase() == 'upcoming') &&
                      i.user_status.status == 'inactive'
                  )
                "
                width="100%"
                max-height="300px"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{
                scope.row.tl_schedules.filter(
                  i =>
                    (i.remarks.toLowerCase() == "ncns" ||
                      i.remarks.toLowerCase() == "upcoming") &&
                    i.user_status.status == "inactive"
                ).length
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      searchQuery: "",
      table_config: {
        col_count: {
          scheduled: 0,
          present: 0,
          onleave: 0,
          absent: 0,
          ncns: 0,
          upcoming: 0,
          inactive: 0
        },
        display_size: 10,
        page: 1,
        loader: false,
        data: [],
        count: 0
      },
      query: {
        om: null,
        om_id: null,
        tl: null,
        tl_id: null,
        start_date: null,
        end_date: null
      },
      form: {
        show: false,
        action: "Create",
        update_id: null,
        schedule: null,
        model: {
          start_event: null,
          end_event: null
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "position",
      "user_id",
      "fetchWorkForceState",
      "fetchWorkForceData",
      "fetchWorkForceError"
    ])
  },
  created() {
    this.query.start_date = moment()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    this.query.end_date = moment()
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    switch (this.position.toLowerCase()) {
      case "operations manager":
        this.query.tl = true;
        this.query.om_id = this.user_id;
        this.fetchWorkForce(this.unsetNull(this.query));
        break;
      case "team leader":
        this.query.tl_id = this.user_id;
        break;
      case "admin":
      case "rta manager":
      case "rta supervisor":
      case "rta analyst":
        this.query.tl = true;
        this.fetchWorkForce(this.unsetNull(this.query));
        break;

    }

    // if(this.position != "Team Leader"){
    //   if(this.position=="Operations Manager"){
    //     this.query.om_id = this.user_id;
    //     this.fetchWorkForce(this.query);
    //   }else{
    //     delete this.query.om_id;
    //     this.fetchWorkForce(this.query);
    //   }
    // }else{
    //   this.getOmBySelectedDate();
    // }
  },
  watch: {
    "query.start_date": function(v) {
      this.query.start_date = moment(v)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      this.query.end_date = moment(v)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
        
      this.query.tl = true;

      switch (this.position.toLowerCase()) {
        case "operations manager":
          this.query.om_id = this.user_id;
          this.fetchWorkForce(this.unsetNull(this.query));
          break;
        case "team leader":
          this.getOmBySelectedDate();
          break;
        case "rta manager":
        case "hr manager":
        case "hr assistant":
        case "admin":
        case "rta supervisor":
        case "rta analyst":
          this.fetchWorkForce(this.unsetNull(this.query));
          break;
      }

      // if(this.position != "Team Leader"){
      //   if(this.position=="Operations Manager"){
      //     this.query.om_id = this.user_id;
      //     this.fetchWorkForce(this.query);
      //   }else{
      //     delete this.query.om_id;
      //     this.fetchWorkForce(this.query);
      //   }
      // }else{
      //   this.getOmBySelectedDate();
      // }
    },
    fetchWorkForceState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
        this.table_config.data = [];
      }
      if (success) {
        let res = [];
        this.table_config.loader = false;
        this.table_config.data = this.fetchWorkForceData.metadata;
        res = [].concat(
          this.fetchWorkForceData.metadata.map(i => i.tl_schedules)
        );
        res = [].concat.apply([], res);
        // console.log(res)
        this.table_config.col_count.scheduled = res.length;
        this.table_config.col_count.present = res.filter(
          i => i.remarks.toLowerCase() == "present"
        ).length;
        this.table_config.col_count.onleave = res.filter(
          i => i.remarks.toLowerCase() == "on-leave"
        ).length;
        this.table_config.col_count.absent = res.filter(
          i => i.remarks.toLowerCase() == "absent"
        ).length;
        this.table_config.col_count.upcoming = res.filter(
          i =>
            i.remarks.toLowerCase() == "upcoming" &&
            i.user_status.status == "active"
        ).length;
        this.table_config.col_count.ncns = res.filter(
          i =>
            i.remarks.toLowerCase() == "ncns" &&
            i.user_status.status == "active"
        ).length;
        this.table_config.col_count.inactive = res.filter(
          i =>
            (i.remarks.toLowerCase() == "ncns" ||
              i.remarks.toLowerCase() == "upcoming") &&
            i.user_status.status == "inactive"
        ).length;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
        this.table_config.col_count.scheduled = 0;
        this.table_config.col_count.present = 0;
        this.table_config.col_count.onleave = 0;
        this.table_config.col_count.absent = 0;
        this.table_config.col_count.upcoming = 0;
        this.table_config.col_count.ncns = 0;
        this.table_config.col_count.inactive = 0;
      }
    }
  },
  methods: {
    ...mapActions(["fetchWorkForce"]),
    columnSort({ column, prop, order }) {
      this.query.sort = null;
      this.query.order = null;
      if (order) {
        this.query.sort = prop;
        this.query.order = order == "ascending" ? "asc" : "desc";
      }
      this.fetchWorkForce(this.unsetNull(this.query));
    },
    getOmBySelectedDate() {
      this.table_config.loader = true;
      let query = this.query,
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        },
        url =
          "api/v1/users?om=true&tl_id=" +
          this.user_id +
          "&start_date=" +
          query.start_date +
          "&end_date=" +
          query.end_date;

      axios
        .get(url, options)
        .then(res => {
          let result = res.data.meta;
          if (result.metadata.length > 0) {
            this.query.om_id = result.metadata[0].id;
            this.fetchWorkForce(this.unsetNull(this.query));
          } else {
            this.table_config.loader = false;
            this.table_config.data = [];
          }
        })
        .catch(err => {
          console.log(err.response.data);
          this.table_config.loader = false;
          this.table_config.data = [];
        });
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
