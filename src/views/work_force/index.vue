<template>
  <div class="app-container">
    <h4 style="color:#646464">Work Force</h4>

    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{span:8}">
        <el-date-picker type="date" size="mini" v-model="query.start_date" placeholder="Select date..."></el-date-picker>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table :data="table_config.data" style="width: 100%;margin-top:30px;" v-loading="table_config.loader">
      <el-table-column align="center" label="Team Leader">
        <template slot-scope="scope">
          <div class="user-block">
            <img v-if="scope.row.image_url" class="img-circle" :src="scope.row.image_url" />
            <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
              <div
                style="align-self:center;width:100%;text-align:center;"
                class="text-point-eight-em"
              >{{ getAvatarLetters(scope.row.firstname,scope.row.lastname) }}</div>
            </div>
              <span>{{ scope.row.full_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SCHEDULED">
        <template slot-scope="scope">
          <span>{{scope.row.tl_schedules.length}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PRESENT">
        <template slot-scope="scope">
          <span>{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="present").length}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ON-LEAVE">
        <template slot-scope="scope">
          <span>{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="on-leave").length}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ABSENT">
        <template slot-scope="scope">
          <span>{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="absent").length}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="NCNS">
        <template slot-scope="scope">
          <span>{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="ncns").length}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="UPCOMING">
        <template slot-scope="scope">
          <span>{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="upcoming").length}}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment"
export default {
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
        // offset: 0,
        // limit: 10,
        // order:"desc",
        // sort:"created_at",
        tl:true,
        start_date:null,
        end_date:null,
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
    ...mapGetters(["fetchWorkForceState","fetchWorkForceData","fetchWorkForceError"])
  },
  created() {
    this.query.start_date = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    this.fetchWorkForce(this.query);
  },
  watch:{
    "query.start_date":function(v){
      this.query.start_date = moment(v).startOf('day').format("YYYY-MM-DD HH:mm:ss")
      this.query.end_date = moment(v).endOf('day').format("YYYY-MM-DD HH:mm:ss");
      this.fetchWorkForce(this.query);
    },
    fetchWorkForceState({initial,success,fail}){
      if(initial){
        this.table_config.loader=true;
        this.table_config.data=[];
      }
      if(success){
        this.table_config.loader=false;
        this.table_config.data = this.fetchWorkForceData.metadata
      }
      if(fail){
        this.table_config.loader=false
        this.table_config.data=[]
      }
    }
  },
  methods: {
    ...mapActions(["fetchWorkForce"]),
    tableSizeChange(value) {
      this.query.limit = value;
      const data = this.query;
      // this.fetchOvertimeSchedule(data) ;
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      // this.fetchOvertimeSchedule(data);
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
