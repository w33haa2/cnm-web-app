<template>
  <div class="app-container">
    <h4 style="color:#646464">Work Force</h4>

    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{span:8}">
        <el-date-picker type="date" size="mini" :clearable="false" v-model="query.start_date" placeholder="Select date..."></el-date-picker>
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
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            Scheduled
            <span style="color:white;background-color:grey;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"><small>{{ table_config.col_count.scheduled }}</small></span>
        </template>
        <template slot-scope="scope">
          <el-popover
            width="300"
            trigger="click">
              <el-table :data="scope.row.tl_schedules" width="100%" max-height="300px">
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference">{{scope.row.tl_schedules.length}}</span>
            </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            Present
            <span style="color:white;background-color:#67C23A;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"><small>{{ table_config.col_count.present }}</small></span>
        </template>
        <template slot-scope="scope">
          <el-popover
            width="300"
            trigger="click">
              <el-table :data="scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=='present')" width="100%" max-height="300px">
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            <span slot="reference">{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="present").length}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            On-leave
            <span style="color:white;background-color:#E6A23C;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"><small>{{ table_config.col_count.onleave }}</small></span>
        </template>
        <template slot-scope="scope">
          <el-popover
            width="300"
            trigger="click">
              <el-table :data="scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=='on-leave')" width="100%" max-height="300px">
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            <span slot="reference">{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="on-leave").length}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            Absent
            <span style="color:white;background-color:#909399;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"><small>{{ table_config.col_count.absent }}</small></span>
        </template>
        <template slot-scope="scope">
          <el-popover
            width="300"
            trigger="click">
              <el-table :data="scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=='absent')" width="100%">
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            <span slot="reference">{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="absent").length}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            NCNS
            <span style="color:white;background-color:#F56C6C;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"><small>{{ table_config.col_count.ncns }}</small></span>
        </template>
        <template slot-scope="scope">
          <el-popover
            width="300"
            trigger="click">
              <el-table :data="scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=='ncns' && i.user_status.status == 'active')" width="100%" max-height="300px">
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            <span slot="reference">{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="ncns" && i.user_status.status == "active").length}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            Upcoming
            <span style="color:white;background-color:#0072ff;padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"><small>{{ table_config.col_count.upcoming }}</small></span>
        </template>
        <template slot-scope="scope">
          <el-popover
            width="300"
            trigger="click">
              <el-table :data="scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=='upcoming'  && i.user_status.status == 'active')" width="100%" max-height="300px">
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            <span slot="reference">{{scope.row.tl_schedules.filter(i=>i.remarks.toLowerCase()=="upcoming"  && i.user_status.status == "active").length}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            Inactive
            <span style="color:white;background-color:rgb(143, 2, 2);padding:1px;border-radius:5px;padding-left:10px;padding-right:10px;"><small>{{ table_config.col_count.inactive }}</small></span>
        </template>
        <template slot-scope="scope">
          <el-popover
            width="300"
            trigger="click">
              <el-table :data="scope.row.tl_schedules.filter(i=> (i.remarks.toLowerCase()=='ncns'|| i.remarks.toLowerCase() == 'upcoming')  && i.user_status.status == 'inactive' )" width="100%" max-height="300px">
                <el-table-column label="Name">
                  <template slot-scope="scope1">
                    <span>{{ scope1.row.user_info.full_name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            <span slot="reference">{{scope.row.tl_schedules.filter(i=> (i.remarks.toLowerCase()=="ncns"|| i.remarks.toLowerCase() == "upcoming")  && i.user_status.status == "inactive" ).length}}</span>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      searchQuery:'',
      table_config: {
        col_count:{
          scheduled:0,
          present:0,
          onleave:0,
          absent:0,
          ncns:0,
          upcoming:0,
          inactive:0,
        },
        display_size: 10,
        page: 1,
        loader:false,
        data:[],
        count:0,
      },
      query: {
        om_id:null,
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
    ...mapGetters(["token","position","user_id","fetchWorkForceState","fetchWorkForceData","fetchWorkForceError"])
  },
  created() {
    this.query.start_date = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    this.query.end_date = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");

    if(this.position != "Team Leader"){
      if(this.position=="Operations Manager"){
        this.query.om_id = this.user_id;
        this.fetchWorkForce(this.query);
      }else{
        delete this.query.om_id;
        this.fetchWorkForce(this.query);
      }
    }else{
      this.getOmBySelectedDate();
    }
  },
  watch:{
    "query.start_date":function(v){
      this.query.start_date = moment(v).startOf('day').format("YYYY-MM-DD HH:mm:ss")
      this.query.end_date = moment(v).endOf('day').format("YYYY-MM-DD HH:mm:ss");

      if(this.position != "Team Leader"){
        if(this.position=="Operations Manager"){
          this.query.om_id = this.user_id;
          this.fetchWorkForce(this.query);
        }else{
          delete this.query.om_id;
          this.fetchWorkForce(this.query);
        }
      }else{
        this.getOmBySelectedDate();
      }
    },
    fetchWorkForceState({initial,success,fail}){
      if(initial){
        this.table_config.loader=true;
        this.table_config.data=[];
      }
      if(success){
        this.table_config.loader=false;
        this.table_config.data = this.fetchWorkForceData.metadata
        let res = [].concat(this.fetchWorkForceData.metadata.map(i=> i.tl_schedules));
        res = [].concat.apply([],res)
        // console.log(res)
        this.table_config.col_count.scheduled = res.length;
        this.table_config.col_count.present = res.filter(i=>i.remarks.toLowerCase() == "present").length;
        this.table_config.col_count.onleave = res.filter(i=>i.remarks.toLowerCase() == "on-leave").length;
        this.table_config.col_count.absent = res.filter(i=>i.remarks.toLowerCase() == "absent").length;
        this.table_config.col_count.upcoming = res.filter(i=>i.remarks.toLowerCase() == "upcoming" && i.user_status.status == "active").length;
        this.table_config.col_count.ncns = res.filter(i=>i.remarks.toLowerCase() == "ncns" && i.user_status.status == "active").length;
        this.table_config.col_count.inactive = res.filter(i=>(i.remarks.toLowerCase() == "ncns" || i.remarks.toLowerCase() == "upcoming")  && i.user_status.status == "inactive").length;
      }
      if(fail){
        this.table_config.loader=false
        this.table_config.data=[]
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
    getOmBySelectedDate(){
      this.table_config.loader = true;
      let query= this.query, options = {
        headers:{
          Authorization: "Bearer " + this.token
        }
      }, url = "api/v1/schedules?tl_id="+this.user_id+"&start_date="+query.start_date+"&end_date="+query.end_date;

      axios.get(url,options).then(res=>{
        let result = res.data.meta;
        if(result.agent_schedules.length > 0){
          this.query.om_id = result.agent_schedules[0].om_id;
          this.fetchWorkForce(this.query);
        }else{
          this.table_config.loader = false;
          this.table_config.data = [];
        }
      }).catch(err=>{
          console.log(err.response.data)
          this.table_config.loader = false;
          this.table_config.data = [];
      });

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
