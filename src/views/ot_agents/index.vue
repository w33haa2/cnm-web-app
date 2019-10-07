<template>
  <div class="app-container">
    <h4 style="color:#646464">Overtime Agents</h4>
    <h4><small>{{schedule}}</small></h4>
    <el-row >
      <!-- <el-col v-if="position != 'Operations Manager' && position != 'Team Leader'" :md="{span:4}">
        <el-select v-model="select.operationsManager" placeholder="Operations Manager" size="mini" style="margin-bottom:20px;width:100%;padding-right:5px">
          <el-option v-for="(item,index) in options.operationsManager" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :md="{span:4}">
        <el-select v-model="select.teamLeader" placeholder="Team Leader..." size="mini" style="margin-bottom:20px;width:100%" :disabled="disable_select.teamLeader">
          <el-option v-for="(item,index) in options.teamLeader" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-col> -->
      <el-col :md="{span:4}">
        <el-button size="mini" @click="openApproveOtModal()">Approve Agent Overtime</el-button>
      </el-col>
      <template v-if="isRTA()">

        <el-col :md="{span:4,offset:16}">
          <el-button style="float:right" size="mini" @click="exportAgentOt()">Export</el-button>
        </el-col>
      </template>
    </el-row>
      <el-tabs type="border-card" v-model="activeTab"  style="margin-top:10px;">
        <el-tab-pane v-for="(tab,index) in tabs" :key="index" :label="tab.label" :name="tab.name" >
          <tab-content :tabName="tab.name" :activeTab="activeTab" :refresh="refresh_table"></tab-content>
        </el-tab-pane>
      </el-tabs>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="form.approve_ot.dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Approve agent overtime"
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col>
            <label>Conformance</label>
            <el-input-number
              v-model="form.approve_ot.field.conformance"
              size="mini"
              :max="100"
              style="width:100%;padding-bottom:2px;margin-top:5px;"
              class="form-input"
            />
          </el-col>
          <el-col style="margin-top:8px;">
            <label>Agents</label>
            <el-select
              v-model="form.approve_ot.field.agents"
              class="form-input"
              style="width:100%;padding-bottom:2px;margin-top:5px;"
              size="mini"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Agents..."
              :loading="form.approve_ot.remote.loading"
              :remote-method="fetchOtAgents"
            >
              <el-option
                v-for="(item,index) in form.approve_ot.options.agents"
                :key="index"
                :label="item.user_info.full_name"
                :value="item.id"
              />
            </el-select>
            <span
              style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px;"
            >count: {{ form.approve_ot.field.agents.length }}</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="(form.approve_ot.dialog=false)">Cancel</el-button>
          <el-button
            type="danger"
            size="mini"
            :loading="form.approve_ot.confirm"
            @click="submitApproveOtSchedules()"
          >Confirm</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import tabContent from "./components/tabContent";

export default {
  components:{ tabContent },
  data() {
    return {
      refresh_table:true,
      schedule:null,
      request:{
        options:{
          headers :{
            Authorization: null,
          }
        }
      },
      form:{
        approve_ot:{
          remote:{
            loading:false,
          },
          options:{
            agents:[]
          },
          field:{
            conformance:null,
            agents:[],

          },
          model:{
            schedules:[]
          },
          confirm:false,
          dialog:false,
        }
      },
      table:{
        search:""
      },
      filterContent:{},
      activeTab:null,
      tabs:[
        {
          label:"Approved",
          name:"approved"
        },
        {
          label:"Unapproved",
          name:"unapprove"
        }
      ],
    };
  },
  computed: {
    ...mapGetters(["token","position","user_id","head_id","fetchOvertimeScheduleData","fetchOvertimeScheduleState","approveOvertimeSchedulesState","approveOvertimeSchedulesError","revertOvertimeScheduleState","revertOvertimeScheduleError"])
  },
  mounted() {
    this.activeTab="approved";
    this.request.options.headers.Authorization= "Bearer "+ this.token;
    this.fetchOvertimeSchedule({id:this.$route.params.id});
  },
  watch:{
    revertOvertimeScheduleState({initial,success,fail}){
      if(success){
        this.$message({
          type:"success",
          message: "Request successful.",
          duration:5000
        })
        this.refresh_table = !this.refresh_table;
      }
      if(fail){
        this.$message({
          type:"error",
          message: this.revertOvertimeScheduleError,
          duration:5000
        })
      }
    },
    fetchOvertimeScheduleState({initial,success,fail}){
      if(success){
        this.schedule = this.formatDate(this.fetchOvertimeScheduleData.overtime.start_event,"YYYY-MM-DD HH:mm:ss", "MMM DD, YYYY hh:mm a") +" to "+ this.formatDate(this.fetchOvertimeScheduleData.overtime.end_event,"YYYY-MM-DD HH:mm:ss", "MMM DD, YYYY hh:mm a")
      }
    },
    approveOvertimeSchedulesState({initial,success,fail}){
      if(initial){
        this.form.approve_ot.confirm = true;
      }
      if(success){
        this.form.approve_ot.confirm = false;
        this.form.approve_ot.dialog = false;
        this.refresh_table = !this.refresh_table;
      }
      if(fail){
        this.form.approve_ot.confirm = false;
        this.$message({
          type:"warning",
          message:this.approveOvertimeSchedulesError,
          duration:5000
        })

      }
    },
    "form.approve_ot.field.agents":function(v){
      this.processApproveOtModel()
    },
    "form.approve_ot.field.conformance":function(v){
      this.processApproveOtModel()
    }
    // create function
  },
  methods: {
    ...mapActions(["approveOvertimeSchedules","fetchOvertimeSchedule"]),
    exportAgentOt(){
      // url creation
      let url="api/v1/schedules?overtime_id="+ this.$route.params.id;
      axios.get(url,this.request.options).then(res=>{
        // console.log(res.data.meta);
        let result = res.data.meta.agent_schedules;
        // result.forEach(((v,i)=>{

        // }).bind(this));

        result = result.map(i=>([i.user_info.full_name,moment(i.time_in.date).format("YYYY-MM-DD hh:mm a"), i.time_out ? moment(i.time_out.date).format("YYYY-MM-DD hh:mm a"):'ongoing',i.conformance+"%"] ));
        result.unshift([]);
        result.unshift(["Agent","Time In", "Time Out", "Conformance"]);
        result.unshift([]);
        result.unshift(["Agent Overtime ("+this.schedule+")"]);
        this.exportToExcel({content:[{
          sheet_data:result,
          sheet_name:"Agent Overtime"
        }]},"Agent Overtime "+this.schedule)
        console.log(result);
      }).catch(err=>{
        this.$message({
          type:"error",
          message:"There is a problem fetching your request.",
          duration:5000
        });
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
    submitApproveOtSchedules(){
      let field = this.form.approve_ot.field;
      if(field.agents.length>0){
        this.approveOvertimeSchedules({schedules:this.form.approve_ot.model.schedules});
      }else{
        this.$message({
          type:"warning",
          message:"Please select agents...",
          duration:5000
        });
      }
    },
    openApproveOtModal(){
      this.form.approve_ot.field.agents=[];
      this.form.approve_ot.field.conformance=0;
      this.form.approve_ot.dialog=true;
    },
    processApproveOtModel(){
      let field = this.form.approve_ot.field,data=[];
      field.agents.forEach(((v,i)=>{
        data.push({id:v,conformance:field.conformance})
      }).bind(this));
      this.form.approve_ot.model.schedules = data;
    },
    fetchOtAgents(search){
      // url creation
      this.form.approve_ot.remote.loading = true;
      let url="api/v1/schedules";
      if(search != ""){
        url+="/search?target[]=full_name&query="+search+"&"
      }else{
        url+="?"
      }
      url+="overtime_id="+ this.$route.params.id
      axios.get(url,this.request.options).then(res=>{
        this.form.approve_ot.options.agents=res.data.meta.agent_schedules;
        this.form.approve_ot.remote.loading = false;
      }).catch(err=>{
        this.form.approve_ot.remote.loading = false;
        this.form.approve_ot.options.agents=[]
      });
    },
    isRTA(){
      if(this.position.toLowerCase() == "rta manager" || this.position.toLowerCase() == "rta supervisor" || this.position.toLowerCase() == "rta analyst"){
        return true;
      }else{
        return false;
      }
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
