<template>
  <div class="app-container">

    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{span:4}">
        <el-input size="mini" v-model="searchQuery" placeholder="Search"></el-input>
      </el-col>
      <el-col :md="{span:20}">
        <el-pagination
        style="float:right"
          :page-sizes="[10,25,50]"
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
    </el-row>

    <!-- Table -->
    <el-table :data="table_config.data" style="width: 100%;margin-top:30px;" v-loading="table_config.loader">
      <el-table-column label="Agent">
        <template slot-scope="scope">
          <div class="user-block">
          <img v-if="scope.row.image_url" class="img-circle" :src="scope.row.user_info.image_url">
          <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
            <div
              style="align-self:center;width:100%;text-align:center;"
              class="text-point-eight-em"
            >
            {{ getAvatarLetters(scope.row.user_info.firstname,scope.row.user_info.lastname) }}

            </div>
          </div>
          <span>
              {{ scope.row.user_info.full_name }}
          </span>
        </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Log" width="300">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.time_in.date,"","MMM Do, YYYY hh:mm a") +" - " }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Conformance" width="200">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.conformance | toFix" color="#6f7ad3"></el-progress>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.approved_by" type="success">Approved</el-tag>
          <el-tag v-else type="warning">Pending</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Approval" width="150">
        <template slot-scope="scope">
          <el-button icon="el-icon-check" :plain="true" size="mini" @click="approveRow(scope.row)">
            Approve
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.action + ' Overtime Schedule'"
      width="40%"
    >
      <el-row>
        <el-col style="margin-bottom:10px;">
          <label width="100%" >Schedule</label>
        </el-col>
        <el-col>
          <el-date-picker  style="width:100%" type="datetimerange" placeholder="Set schedule..." v-model="form.schedule" size="mini"></el-date-picker>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm" size="mini">Cancel</el-button>
        <el-button type="danger" @click="submitForm" size="mini" :loading="form.confirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment"
import axios from "axios"
export default {
  props:['filter','approved',"activeTab"],
  data() {
    return {
      searchQuery:'',
      table_config: {
        display_size: 10,
        page: 1,
        loader:false,
        data:[],
        count:0,
      },
      query: {
        offset: 0,
        limit: 10,
        order:"desc",
        sort:"created_at",
      },
      filter:{
        om_id:null,
        tl_id:null
      },
      form: {
        show: false,
        action: "Create",
        update_id:null,
        schedule:null,
        model:{
          start_event:null,
          end_event:null,
        }
      }
    };
  },
  computed: {
    ...mapGetters(["token","position","head_id"])
  },
  created() {
    console.log(this.token)
    if(this.approved==false){
      this.fetchOvertime();
    }
  },
  watch:{
    searchQuery(v){
      if(this.approved==false){
        if(v!=""){
          this.fetchOvertime();
        }
      }
    },
    filter(v){
      if(this.approved==false){
        this.fetchOvertime();
      }
    }
  },
  methods: {
    ...mapActions(["approveOvertimeSchedules"]),
    approveRow(data){
      this.approveOvertimeSchedules({schedules:[data.id]})
    },
    fetchOvertime(){
      this.table_config.loader = true;
      let url = "api/v1/schedules?overtime_id="+ this.$route.params.id+"&offset="+this.query.offset+"&limit="+this.query.limit+"&order="+this.query.order+"&sort="+this.query.sort+"&approved=false",
      options = {
        headers:{
          Authorization: "Bearer "+ this.token
        }
      };
      if(this.searchQuery!=""){
        url+="&target[]=full_name&query="+this.searchQuery;
      }

      if(this.position != "Operations Manager" && this.position!="Team Leader"){
        if(this.filter.operationsManager!="all"){
          url+="&om_id="+this.filter.operationsManager;
        }
        if(this.filter.teamLeader!="all"){
          url+="&tl_id="+this.filter.teamLeader;
        }
      }else{
        if(this.filter.teamLeader!="all"){
          url+="&tl_id="+this.filter.teamLeader;
        }
      }
      // if(this.filter == "all"){
      //   url+="&om_id="
      // }else{

      // }
      axios.get(url,options).then(res => {
        console.log(res.data.meta.agent_schedules)
        this.table_config.loader = false;
        this.table_config.data = res.data.meta.agent_schedules
        this.table_config.count = res.data.meta.count
        })
      .catch(err=>{
        this.table_config.loader = false;
          this.table_config.data = []
        this.$message({
          type:"error",
          message:err.response.data.title,
          duration:5000
        });
      })
    },
    tableSizeChange(value) {
      this.query.limit = value;
      const data = this.query;
      this.fetchOvertime() ;
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchOvertime();
    }
  }
};
</script>

<style lang="scss" scoped>

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
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
