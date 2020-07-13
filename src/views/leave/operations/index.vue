<template>
  <div class="app-container">
    <div
      class="shadow title-bar"
    >
      <el-row>
        <el-col :md="{ span: 8 }">
          <div
            style="align-self:center;color:#646464;font-weight:700;font-size:1.2em;padding:5px 0px 5px 0px;"
          >
            Agent Leave
          </div>
        </el-col>
        <el-col :md="{ span: 16 }">
          <div>
            <el-row :gutter="8">
              <el-col :md="{ span: 8 }">
                <el-tooltip placement="top" content="Chart Month">
                  <el-date-picker
                    v-model="filter.month"
                    type="month"
                    format="MMMM yyyy"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    style="width:100%"
                    @change="monthChange"
                  />
                </el-tooltip>
              </el-col>
              <el-col :md="{ span: 8 }">
                <el-tooltip placement="top" content="Filter Leave Type">
                  <el-select
                    style="width:100%"
                    v-model="filter.leave_type"
                    @change="fetch = !fetch"
                  >
                    <el-option
                      value="bereavement_leave"
                      label="Bereavement Leave"
                    ></el-option>
                    <el-option
                      value="leave_of_absence"
                      label="Leave of absence"
                    ></el-option>
                    <el-option
                      value="loa1"
                      label="Leave of absence 1"
                    ></el-option>
                    <el-option
                      value="loa2"
                      label="Leave of absence 2"
                    ></el-option>
                    <el-option
                      value="magna_carta_leave"
                      label="Magna carta leave"
                    ></el-option>
                    <el-option
                      value="maternity_leave"
                      label="Maternity leave"
                    ></el-option>
                    <el-option
                      value="partial_sick_leave"
                      label="Partial sick leave"
                    ></el-option>
                    <el-option
                      value="paternity_leave"
                      label="Paternity leave"
                    ></el-option>
                    <el-option
                      value="sick_leave"
                      label="Sick leave"
                    ></el-option>
                    <el-option
                      value="solo_parent_leave"
                      label="Solo parent leave"
                    ></el-option>
                    <el-option
                      value="vacation_leave"
                      label="Vacation leave"
                    ></el-option>
                    <el-option
                      value="vawc"
                      label="Violence against women and their children"
                    ></el-option>
                  </el-select>
                </el-tooltip>
              </el-col>
              <el-col :md="{ span: 8 }">
                <template v-if="isRTA()">
                  <el-tooltip placement="top" content="Filter Cluster">
                    <el-select
                      style="width:100%"
                      v-model="filter.cluster_id"
                      @change="fetch = !fetch"
                    >
                      <el-option
                        v-for="(option, index) in options.cluster"
                        :key="index"
                        :value="option.id"
                        :label="option.full_name"
                      ></el-option>
                    </el-select>
                  </el-tooltip>
                </template>
                <template v-else-if="isOP()">
                  <el-tooltip content="Request Week">
                    <el-date-picker
                      type="week"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="{ firstDayOfWeek: 1 }"
                      :clearable="false"
                      style="width:100%"
                      v-model="filter.request_week"
                      @change="weekChange"
                    />
                  </el-tooltip>
                </template>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-col :md="{ span: 24 }">
        <approve-leave-component
          :filter="filter"
          :cluster="cluster_name"
          :fetch="fetch"
        ></approve-leave-component>
      </el-col>
      <template v-if="isOP()">
        <template
          v-if="
            filter.leave_type == 'vacation_leave' ||
              filter.leave_type == 'leave_of_absence'
          "
        >
          <el-col style="margin-top:30px">
            <monday-leave-table
              :filter="filter"
              @week="requestWeek"
              :fetch="fetch"
            ></monday-leave-table>
          </el-col>
        </template>
      </template>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import approveLeaveComponent from "./components/ganttLeaveApproval";
import mondayLeaveTable from "./components/mondayLeaveTable";
export default {
  components: { approveLeaveComponent, mondayLeaveTable },
  data() {
    return {
      options: {
        cluster: []
      },
      filter: {
        cluster_id: null,
        leave_type: "vacation_leave",
        month: moment().format("YYYY-MM-DD"),
        leave_status: null,
        request_week: moment()
          .startOf("isoweek")
          .format("YYYY-MM-DD")
      },
      fetch: false
    };
  },
  computed: {
    ...mapGetters(["token", "position", "user_id", "name", "head"]),
    
    cluster_name() {
      let result = null;
      if (this.isRTA()) {
        result = this.filter.cluster_id
          ? this.options.cluster.filter(i => i.id == this.filter.cluster_id)[0]
              .full_name
          : null;
      } else {
        switch (this.position.toLowerCase()) {
          case "operations manager":
            result = this.name;
            break;
          case "team leader":
            result = this.head.parent_details.full_name;
            break;
        }
      }
      return result;
    }
  },
  mounted() {
    let position = this.position.toLowerCase();
    if (this.isRTA()) {
      this.fetchOmOptions();
    }
    if (this.isOP()) {
      if (position == "operations manager") {
        this.filter.cluster_id = this.user_id;
        this.fetch = !this.fetch;
      } else if (position == "team leader") {
        this.filter.cluster_id = this.head.parent_id;
        this.fetch = !this.fetch;
      }
    }
  },
  watch: {},
  methods: {
    fetchOmOptions() {
      if(this.isRTA()){
        this.axiosRequest(
          "get",
          "api/v1/users" +
            this.toUrlParams({
              om: true,
              start_date: moment(this.filter.month)
                .startOf("month")
                .format("YYYY-MM-DD"),
              end_date: moment(this.filter.month)
                .endOf("month")
                .format("YYYY-MM-DD"),
              no_relations: true
            }),
          {
            Authorization: "Bearer " + this.token
          }
        ).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.options.cluster = res.meta.metadata;
            this.filter.cluster_id = res.meta.metadata[0].id;
            this.fetch = !this.fetch;
          } else {
            // alert(res.title);
          }
        });
      }
    },
    monthChange(v) {
      let position = this.position.toLowerCase();
      switch (position) {
        case "rta manager":
        case "rta analyst":
        case "rta supervisor":
      alert("hey")

          this.fetchOmOptions();
          this.fetch = !this.fetch;
          break;
        case "operations manager":
          break;
        case "team leader":
          this.fetchSupervisor(moment(this.filter.month).endOf("month").format("YYYY-MM-DD HH:mm:ss"),this.user_id);
          break;
      }
    },
    requestWeek(v) {
      this.filter.request_week = v;
    },
    weekChange(v) {
      this.filter.request_week = moment(v)
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      this.fetch = !this.fetch;
    },
    fetchSupervisor(date,child_id){//head
      this.axiosRequest(
        "get",
        "api/v1/hierarchy_log/supervisor" +
          this.toUrlParams({
            date:date,
            child_id:child_id
          }),
        {
          Authorization: "Bearer " + this.token
        }
      ).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.filter.cluster_id =res.meta.supervisor.parent_id;
          this.fetch = !this.fetch;
        } else {
          this.filter.cluster_id = null;
          this.fetch = !this.fetch;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.hide-picker-input {
}
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.is-selected {
  color: #1989fa;
}
.list {
  height: 85%;
  overflow-y: scroll;

  ul {
    margin: 0;
    padding: 0;
    li {
      padding: 10px;
      border-bottom: #eeeeee solid 1px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
