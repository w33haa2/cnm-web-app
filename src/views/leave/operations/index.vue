<template>
  <div class="app-container">
    <h4 style="color:#646464">Agent Leave</h4>
    <el-row>
      <el-col :md="{span:4}" style="padding-right:5px;">
        <el-tooltip placement="top" content="Select week...">
          <el-date-picker
            v-model="query.created_at_start"
            size="mini"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{firstDayOfWeek:1}"
            :clearable="false"
            style="width:100%"
            @change="weekChange"
          />
        </el-tooltip>
      </el-col>
      <el-col :md="{span:4}" style="padding-right:5px" v-if="!isOperations()">
        <el-tooltip placement="top" content="Select Operations Manager...">
          <el-select size="mini" style="margin-bottom:10px;width:100%;" placeholder="Select.." v-model="query.filter_om">
            <el-option v-for="(option, index) in options.operationsManager" :key="index" :value="option.value" :label="option.label" />
          </el-select>
        </el-tooltip>
      </el-col>
      <el-col :md="{span:4}">
        <el-tooltip placement="top" content="Select Team Leader...">
          <el-select size="mini" style="margin-bottom:10px;width:100%;" placeholder="Select.." v-model="query.filter_tl" :disabled="disable_tl_select">
            <el-option v-for="(option, index) in options.teamLeader" :key="index" :value="option.value" :label="option.label" />
          </el-select>
        </el-tooltip>
      </el-col>
      <el-col :md="{span:12}">
        <el-tooltip placement="top" content="Print selected week approved list.">
          <el-button size="mini" style="float:right" @click="getDataApprovedLeaves()">Print Approved</el-button>
        </el-tooltip>
      </el-col>
      <el-col :md="{span:24}">
        <el-tabs v-model="query.activeTab" type="border-card">
          <el-tab-pane :label="tab.label" :name="tab.name" v-for="(tab,index) in tabs" :key="index">
            <leave-table :status="tab.name" @on-update="leaveForm" :data="to_query" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions,mapGetters } from "vuex"
import axios from "axios"
import leaveTable from "./components/leaveTable";
export default {
  components: { leaveTable },
  computed:{
    ...mapGetters(["position","token","deleteSingleScheduleState","deleteSingleScheduleData","deleteSingleScheduleError"])
  },
  data() {
    return {
      list:{
        teamLeader:[]
      },
      disable_tl_select:false,
      options:{
        teamLeader:[],
        operationsManager:[],
      },
      tabs: [
        { label: "Pending", name: "pending" },
        { label: "Approved", name: "approved" },
        { label: "Rejected", name: "rejected" }
      ],
      calendar: {
        today: moment()
      },
      query:{
        created_at_start:null,
        created_at_end:null,
        activeTab:'pending',
        filter_tl:'all',
        filter_om:'all'
      },
      to_query:{}
    };
  },
  created(){
    if(this.isOperations()){
      this.disable_tl_select = false;
    }else{
      this.disable_tl_select = true;
    }
    this.weekChange(moment().startOf('isoweek'))
  },
  mounted(){
    this.getTeamLeaders()
    this.getOperationsManager()
  },
  watch:{
    deleteSingleScheduleState({initial,success,fail}){
      if(success){
        this.weekChange(this.query.created_at_start)
        this.$message({
          type:"success",
          message:"You have successfully deleted a schedule.",
          duration:5000
        })
      }

      if(fail){
        this.$message({
          type:"error",
          message:this.deleteSingleScheduleError,
          duration:5000
        })
      }
    },
    approveLeaveState({initial,success,fail}){
      if(success){
        this.weekChange(this.query.created_at_start)
        this.$message({
          type:"success",
          message:"Leave is approved!",
          duration:5000
        });
      }
      if(fail){
        this.$message({
          type:"error",
          message:this.approveLeaveError,
          duration:5000
        });
      }
    },
    "query.created_at_start":function(v){
      if(this.isOperations()){
        this.to_query={
          created_at_start:v,
          created_at_end:this.query.created_at_end,
          filter_tl:this.query.filter_tl,
          activeTab:this.query.activeTab
        }
      }else{
        this.to_query={
          created_at_start:v,
          created_at_end:this.query.created_at_end,
          filter_tl:this.query.filter_tl,
          filter_om:this.query.filter_om,
          activeTab:this.query.activeTab
        }
      }
    },
    "query.activeTab":function(v){
      if(this.isOperations()){
        this.to_query={
          created_at_start:this.query.created_at_start,
          created_at_end:this.query.created_at_end,
          filter_tl:this.query.filter_tl,
          activeTab:v
        }
      }else{
        this.to_query={
          created_at_start:this.query.created_at_start,
          created_at_end:this.query.created_at_end,
          filter_tl:this.query.filter_tl,
          filter_om:this.query.filter_om,
          activeTab:v
        }
      }
    },
    "query.filter_tl":function(v){
      if(this.isOperations()){
        this.to_query={
          created_at_start:this.query.created_at_start,
          created_at_end:this.query.created_at_end,
          filter_tl:v,
          activeTab:this.query.activeTab
        }
      }else{
        this.to_query={
          created_at_start:this.query.created_at_start,
          created_at_end:this.query.created_at_end,
          filter_tl:v,
          filter_om:this.query.filter_om,
          activeTab:this.query.activeTab
        }
      }
    },
    "query.filter_om":function(v){
      if(!this.isOperations()){
          this.getTeamLeaders();
        if(v=='all'){
          this.disable_tl_select = true;
          this.query.filter_tl = 'all';
        }else{
          let filtered = this.list.teamLeader.filter(i=> i.parent_id == v).map(i=>({value:i.id,label:i.full_name}))
          if(filtered.length!=0){
            this.options.teamLeader = filtered;
            this.disable_tl_select = false;
            this.options.teamLeader.unshift({value:"all",label:"All"});
          }else{
            this.options.teamLeader = [];
            this.disable_tl_select = true;
          }
          // console.log(filtered)
        }
        this.to_query={
          created_at_start:this.query.created_at_start,
          created_at_end:this.query.created_at_end,
          filter_tl:this.query.filter_tl,
          filter_om:v,
          activeTab:this.query.activeTab
        }
      }
    }
  },
  methods: {
    weekChange(e) {
      const start = moment(e)
        .startOf('isoweek')
        .format('YYYY-MM-DD')
      const end = moment(e)
        .endOf('isoweek')
        .format('YYYY-MM-DD')
      this.query.created_at_start = start;
      this.query.created_at_end = end;
    },
    getDataApprovedLeaves(){
      let url = "api/v1/leaves?status=approved&created_at_start="+this.query.created_at_start+"&created_at_end="+this.query.created_at_end,
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        }, data = [];
        axios.get(url,options).then(res=>{
          let result = res.data.meta.leaves;
          result.forEach(((v,i)=>{
            data.push([
              v.leave_type,
              moment(v.start_event).format("YYYY-MM-DD") +" to "+ moment(v.end_event).format("YYYY-MM-DD"),
              v.user.full_name,
              v.approved_by.full_name,
              moment(v.created_at).format("YYYY-MM-DD HH:mm:ss")
            ])
          }).bind(this));
          console.log(data)
          data.unshift(["Leave Type","Date Range","Employee","Approved By","Created at"])
          data.unshift(["List of approved leave from "+ this.query.created_at_start +" to "+ this.query.created_at_start])
          let obj = {
            content:[
              {
                sheet_data:data,
                sheet_name:"Approved List"
              }
            ]
          }
          this.exportToExcel(obj,this.query.created_at_start +" to "+ this.query.created_at_start+" Approved Leave List")
        }).catch(err=>{
          this.$message({
            type:"error",
            message: err.response.data.title,
            duration:5000
          })
        });
    },
    exportToExcel(data,filename) {
      let url = "api/v1/excel/create_multisheet_excel",
        options = {
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + this.token
          }
        },
        fd=new FormData;
      fd.append("obj",JSON.stringify(data))


      axios.post(url, fd, options).then(res => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var // json = JSON.stringify(res.data),
          blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename+".xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    getTeamLeaders(){
      let url = "api/v1/users?tl=true&start_date="+this.query.created_at_start+"&end_date="+this.query.created_at_end,
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        };
      axios.get(url,options).then(res=>{
        console.log(res);
        this.options.teamLeader = res.data.meta.metadata.map(i=>({value:i.id,label:i.full_name}));
        this.list.teamLeader = res.data.meta.metadata;
        this.options.teamLeader.unshift({value:"all", label:"All"})
        this.query.filter_tl = "all";
      }).catch(err=>{
        console.log(err.response.data)
        this.options.teamLeader = [];
      })
    },
    getOperationsManager(){
      let url = "api/v1/users?om=true&start_date="+this.query.created_at_start+"&end_date="+this.query.created_at_end,
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        };
      axios.get(url,options).then(res=>{
        console.log(res);
        this.options.operationsManager = res.data.meta.metadata.map(i=>({value:i.id,label:i.full_name}));
        this.options.operationsManager.unshift({value:"all", label:"All"})
        this.query.filter_om = "all";
      }).catch(err=>{
        console.log(err.response.data)
        this.options.operationsManager = [];
      })
    },
    isOperations(){
      if(this.position.toLowerCase() == "operations manager" || this.position.toLowerCase() == "team leader"){
        return true;
      }else{
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
