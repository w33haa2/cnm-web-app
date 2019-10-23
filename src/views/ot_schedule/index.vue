<template>
  <div class="app-container">
    <h4 style="color:#646464">Overtime Schedules</h4>

    <!-- <el-row style="padding-right:8px;margin-bottom:30px;">
    </el-row> -->
    <!-- Search and Pagination -->
    <el-row style="margin-bottom:10px;">
      <el-col :md="{span:8}">
        <el-button :plain="true" size="mini" @click="createForm">Create Overtime Schedule</el-button>
      </el-col>
      <el-col :md="{span:16}">
      </el-col>
    </el-row>
    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{span:8}">
        <el-date-picker type="date" size="mini" v-model="searchQuery" placeholder="Select date..."></el-date-picker>
      </el-col>
      <el-col :md="{span:16}">
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
      <el-table-column align="center" label="Schedule">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.start_event,"","MMM Do, YYYY hh:mm a")  + " - " + formatDate(scope.row.end_event,"","MMM Do, YYYY hh:mm a")   }}
          </span>
          <span v-if="ongoing(scope.row.start_event,scope.row.end_event)"><small style="color:#409EFF">ONGOING</small></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Agents" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.schedules.length }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="View/Export" width="300">
        <template slot-scope="scope">
          <el-button :plain="true" size="mini" @click="previewSched(scope.row)">
            <i class="el-icon-view" />
          </el-button>
          <el-button :plain="true" size="mini" @click="exportAgentOt(scope.row)">
              <svg-icon icon-class="excel" />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Update/Delete" width="300">
        <template slot-scope="scope">
          <el-button :plain="true" size="mini" @click="updateRow(scope.row)">
            <i class="el-icon-edit-outline" />
          </el-button>
          <el-button :plain="true" size="mini" type="danger" @click="deleteRow(scope.row)">
            <i class="el-icon-delete" />
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
        relations:['schedules']
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
    ...mapGetters(["token","fetchOvertimeScheduleState","fetchOvertimeScheduleData","fetchOvertimeScheduleError","searchOvertimeScheduleState","searchOvertimeScheduleData","searchOvertimeScheduleError","createOvertimeScheduleState","createOvertimeScheduleData","createOvertimeScheduleError","updateOvertimeScheduleState","updateOvertimeScheduleData","updateOvertimeScheduleError","deleteOvertimeScheduleState","deleteOvertimeScheduleData","deleteOvertimeScheduleError"])
  },
  created() {
    this.fetchOvertimeSchedule(this.query);
  },
  watch:{
    "form.schedule":function(v){
      this.form.model.start_event = moment(v[0]).format("YYYY-MM-DD HH:mm:ss")
      this.form.model.end_event = moment(v[1]).format("YYYY-MM-DD HH:mm:ss")
    },
    fetchOvertimeScheduleState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true
        this.table_config.data = []
      }
      if(success){
        this.table_config.loader = false
        this.table_config.data = this.fetchOvertimeScheduleData.overtimes
        this.table_config.count = this.fetchOvertimeScheduleData.count
      }
      if(fail){
        this.table_config.loader = false
        this.table_config.data = []
        this.$message({
          type:"error",
          message:this.fetchOvertimeScheduleError,
          duration:5000
        });
      }
    },
    searchOvertimeScheduleState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true
        this.table_config.data = []
      }
      if(success){
        this.table_config.loader = false
        this.table_config.data = this.searchOvertimeScheduleData.overtime
        this.table_config.count = this.searchOvertimeScheduleData.count
      }
      if(fail){
        this.table_config.loader = false
        this.table_config.data = []
        this.$message({
          type:"error",
          message:this.searchOvertimeScheduleError,
          duration:5000
        });
      }
    },
    searchQuery(v){
      this.query.offset=0;
      if(v==null){
        v=""
      }
      if(v!=""){
        this.query['target[]'] = 'start_event';
        this.query.query = moment(v).format("YYYY-MM-DD");
        this.searchOvertimeSchedule(this.query)
      }else{
        delete this.query['target[]'];
        delete this.query.query;
        this.fetchOvertimeSchedule(this.query)
      }
    },
    createOvertimeScheduleState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true;
        this.form.confirm = true;
      }
      if(success){
        this.table_config.loader = false;
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchOvertimeSchedule(this.query);
        this.$message({
          type:"success",
          message: "You have successfully created a schedule."
        });
      }
      if(fail){
        this.table_config.loader = false;
        this.form.confirm = false;
        this.$message({
          type:"error",
          message: "There is a problem in creating the schedule."
        });
      }
    },
    updateOvertimeScheduleState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true;
        this.form.confirm = true;
      }
      if(success){
        this.table_config.loader = false;
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchOvertimeSchedule(this.query);
        this.$message({
          type:"success",
          message: "You have successfully updated a schedule."
        });
      }
      if(fail){
        this.table_config.loader = false;
        this.form.confirm = false;
        this.$message({
          type:"error",
          message: "There is a problem in updating the schedule."
        });
      }
    },
    deleteOvertimeScheduleState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true;
      }
      if(success){
        this.table_config.loader = false;
        this.query.offset = 0;
        this.fetchOvertimeSchedule(this.query);
        this.$message({
          type:"success",
          message: "You have successfully deleted a status."
        });
      }
      if(fail){
        this.table_config.loader = false;
        this.$message({
          type:"error",
          message: "There is a problem in deleting the status."
        });
      }
    }
  },
  methods: {
    ...mapActions(["fetchOvertimeSchedule","searchOvertimeSchedule","createOvertimeSchedule","updateOvertimeSchedule","deleteOvertimeSchedule"]),
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
     exportAgentOt(data){
      let url="api/v1/schedules?overtime_id="+ data.id;
      axios.get(url,{
        headers:{
          Authorization: "Bearer " + this.token,
        }
      }).then(res=>{
        let result = res.data.meta.agent_schedules;
        result = result.map(i=>([i.user_info.full_name,moment(i.time_in.date).format("YYYY-MM-DD hh:mm a"), i.time_out ? moment(i.time_out.date).format("YYYY-MM-DD hh:mm a"):'ongoing',i.conformance+"%"] ));
        result.unshift([]);
        result.unshift(["Agent","Time In", "Time Out", "Conformance"]);
        result.unshift([]);
        result.unshift(["Agent Overtime ("+data.start_event+" - "+data.end_event+")"]);
        this.exportToExcel({content:[{
          sheet_data:result,
          sheet_name:"Agent Overtime"
        }]},"Agent Overtime "+data.start_event+" - "+data.end_event)
        // console.log(result);
      }).catch(err=>{
        this.$message({
          type:"error",
          message:"There is a problem fetching your request.",
          duration:5000
        });
      });
    },
    previewSched(data){
      const otId = data.id
      this.$router.push({path:`/overtime_agents/${otId}`})
    },

    deleteRow(data){
      if(this.ongoing(data.start_event,data.end_event) || moment(moment(data.end_event).format("YYYY-MM-DD HH:mm:ss")).isBefore(moment().format("YYYY-MM-DD HH:mm:ss"))){
        this.$message({
            type:"warning",
            message: "You cannot update/delete ongoing or past schedules.",
            duration:5000
          });
      }else{
        if(confirm("This may affect other data in your system. Do you want to proceed?")){
          this.deleteOvertimeSchedule({id:data.id});
        }
      }
    },
    submitForm() {
        let data = this.form.model;
      if (this.form.action == "Create") {
        if(moment(moment(data.start_event).format("YYYY-MM-DD HH:mm:ss")).isBefore(moment().format("YYYY-MM-DD HH:mm:ss"))){
          this.$message({
            type:"warning",
            message:"Please enter future dates.",
            duration:5000
          })
        }else{
          data.id = null;
          this.createOvertimeSchedule(data)
        }
      } else {
        data.id = this.form.update_id;
        if(this.ongoing(data.start_event,data.end_event) || moment(moment(data.end_event).format("YYYY-MM-DD HH:mm:ss")).isBefore(moment().format("YYYY-MM-DD HH:mm:ss"))){
          this.$message({
            type:"warning",
            message: "You cannot update/delete ongoing or past schedules.",
            duration:5000
          });
        }else{
          this.updateOvertimeSchedule(data)
        }
      }
    },
    updateRow(row) {
      this.form.action = "Update"
      this.form.update_id = row.id;
      this.form.show = true;
      this.form.schedule = [row.start_event,row.end_event];
    },
    createForm() {
      this.form.show = true;
    },
    cancelForm() {
      this.resetForm();
      this.form.show = false;
    },
    resetForm() {
      this.form.action = "Create";
      this.form.schedule = null;
    },
    filterHeadName(head_id) {
      return accesslevels.filter(i => i.id == head_id)[0].name;
    },
    tableSizeChange(value) {
      this.query.limit = value;
      const data = this.query;
      this.fetchOvertimeSchedule(data) ;
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchOvertimeSchedule(data);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
