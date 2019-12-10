<template>
  <div class="app-container">
    <h4 style="color:#646464">Agent Leave</h4>
    <el-row>
      <!-- <el-col :md="{ span: 4 }" style="padding-right:5px;margin-bottom:10px;">
        <el-tooltip placement="top" content="Name Search">
          <el-input placeholder="Search..." size="mini" />
        </el-tooltip>
      </el-col> -->
      <el-col :md="{ span: 12, offset: 12 }">
        <el-row>
          <el-col
            :md="{ span: 8 }"
            style="padding-right:5px;margin-bottom:10px;"
          >
            <el-tooltip placement="top" content="Chart Month">
              <el-date-picker
                v-model="filter.month"
                size="mini"
                type="month"
                format="MMMM yyyy"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width:100%"
                @change="fetch = !fetch"
              />
            </el-tooltip>
          </el-col>
          <el-col
            :md="{ span: 8 }"
            style="padding-right:5px;margin-bottom:10px;"
          >
            <el-tooltip placement="top" content="Filter Leave Type">
              <el-select
                size="mini"
                style="width:100%"
                v-model="filter.leave_type"
                @change="fetch = !fetch"
              >
                <el-option
                  value="vacation_leave"
                  label="Vacation Leave"
                ></el-option>
                <el-option
                  value="leave_of_absence"
                  label="Leave of absence"
                ></el-option>
              </el-select>
            </el-tooltip>
          </el-col>
          <el-col
            :md="{ span: 8 }"
            style="padding-right:5px;margin-bottom:10px;"
          >
          <template v-if="isRTA()">
            <el-tooltip placement="top" content="Filter Cluster">
              <el-select
                size="mini"
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
                size="mini"
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
      </el-col>
      <el-col :md="{ span: 24 }">
        <approve-leave-component
          :filter="filter"
          :cluster="cluster_name"
          :fetch="fetch"
        ></approve-leave-component>
      </el-col>
      <el-col style="margin-top:30px">
        <monday-leave-table
          :filter="filter"
          @week="requestWeek"
          :fetch="fetch"
        ></monday-leave-table>
      </el-col>
    </el-row>
  </div>
  <!-- <el-col :md="{ span: 4 }" style="padding-right:5px;margin-bottom:10px;">
        <el-tooltip placement="top" content="Filter requests by week">
          <el-date-picker
            v-model="filter.request_week"
            size="mini"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{ firstDayOfWeek: 1 }"
            :clearable="false"
            style="width:100%"
            @change="weekChange()"
          />
        </el-tooltip>
      </el-col> -->
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
    ...mapGetters(["token","position","user_id","name"]),
    cluster_name(){
      let result = null;
      if(this.isRTA()){
        result = this.filter.cluster_id
      ? this.options.cluster.filter(i => i.id == this.filter.cluster_id)[0]
          .full_name
      : null

      }else{
        switch(this.position.toLowerCase()){
          case 'operations manager':
            result = this.name
            break;
        }
      }
      return result;
    }
  },
  mounted() {
    let position = this.position.toLowerCase();
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
              .format("YYYY-MM-DD")
          }),
        {
          Authorization: "Bearer " + this.token
        }
      ).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.options.cluster = res.meta.metadata;
          this.filter.cluster_id = res.meta.metadata[0].id;
          this.fetch = !this.fetch;
        } else {
          alert(res.title);
        }
      });
    }
    if(this.isOP()){
      if(position=='operations manager'){
        this.filter.cluster_id = this.user_id;
        this.fetch = !this.fetch;
      }else if(position=='team leader'){
        alert("team leader")
        // this.filter.cluster_id = this.user_id;
      }
    }
  },
  watch: {},
  methods: {
    requestWeek(v) {
      this.filter.request_week = v;
    },
    weekChange(v) {
      this.filter.request_week = moment(v)
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      this.fetch = !this.fetch;
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
