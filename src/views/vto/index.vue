<template>
  <div class="app-container">
    <h4 style="color:#646464">VTO list</h4>
    <!-- <el-row style="padding-right:8px;margin-bottom:30px;">
    </el-row> -->

    <el-row style="margin-bottom:5px;">
      <el-col :md="{span:8}">
        <el-button :plain="true" size="mini" @click="createForm">Add VTO</el-button>
      </el-col>
      <el-col :md="{span:4,offset:12}">
        <el-date-picker type="date" size="mini" v-model="searchQuery" placeholder="Select date..." style="width:100%"></el-date-picker>
      </el-col>
    </el-row>

    <el-row style="padding:2px;">
      <el-col>
        <tab-content></tab-content>
      </el-col>
    </el-row>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="'Add VTO'"
      width="30%"
    >
      <el-row>
        <el-col style="margin-bottom:8px;">
          <label width="100%" >VTO at</label>
          <el-date-picker  style="width:100%" type="datetime" placeholder="Set vto at..." v-model="form.field.vto_at" size="mini"></el-date-picker>
        </el-col><el-col>
            <label for="dates">Agents</label>
            <el-select
              v-model="form.field.agents"
              class="form-input"
              style="width:100%;padding-bottom:2px"
              size="mini"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Agents..."
              :remote-method="remoteAgent"
            >
              <el-option
                v-for="item in agents.agents"
                :key="item.id"
                :label="item.full_name"
                :value="item.id"
              />
            </el-select>
            <span
              style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px;"
            >count: {{ form.field.agents.length }}</span>
          </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm" size="mini">Cancel</el-button>
        <el-button type="danger" @click="submitForm" size="mini" :loading="form.confirm">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.report.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :show-close="false"
      title="Creating Vto..."
      width="50%"
      top="5vh"
    >
      <el-alert
        title="Create Report"
        type="info"
        description="This report will only be displayed once every import. Please review results to reupload unimported data."
        show-icon
      ></el-alert>

      <div style="width:100%;margin-bottom:20px;margin-top:15px;">
        Progress
        <span>( {{ form.report.loop_index }}</span>/
        <span>{{ form.report.arr_length }} )</span>
      </div>
      <el-progress :percentage="form.report.progress" :text-inside="true" :stroke-width="18"></el-progress>
      <div style="padding-bottom:15px;  ">
        <el-tabs
          v-model="form.report.active_tab"
          type="border-card"
          style="margin-top:15px;margin-bottom:10px;"
        >
          <el-tab-pane :label="'All: '+form.report.data.all.length" name="all">
            <el-table :data="form.report.data.all" height="350px">
              <el-table-column label="Name" width="350">
                <template scope="scope">{{scope.row.full_name}}</template>
              </el-table-column>
              <!-- <el-table-column label="Schedule" width="100">
                <template scope="scope">{{+" To "+}}</template>
              </el-table-column> -->
              <el-table-column label="Status">
                <template scope="scope">
                  <template v-if="scope.row.status_code==200">
                    <el-tag size="mini" type="success">UPLOADED</el-tag>
                  </template>
                  <template v-else>
                    <el-tag size="mini" type="danger">{{ scope.row.title }}</el-tag>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            :label="'Errors: ' +form.report.data.errors.length "
            name="errors"
          >
            <el-table :data="form.report.data.errors" height="350px">
              <el-table-column label="Name" width="350">
                <template scope="scope">{{scope.row.full_name}}</template>
              </el-table-column>
              <el-table-column label="Status">
                <template scope="scope">
                  <template v-if="scope.row.status_code==200">
                    <el-tag size="mini" type="success">UPLOADED</el-tag>
                  </template>
                  <template v-else>
                    <el-tag size="mini" type="danger">{{ scope.row.title }}</el-tag>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <!-- <el-button size="mini" @click="closeCreateVtoReport" style="float:right">Close</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios"
import { mapActions, mapGetters } from "vuex"
import tabContent from "./components/tabContent"
import moment from "moment"
export default {
  components:{tabContent},
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
        sort:"created_at"
      },
      form: {
        show: false,
        action: "Create",
        update_id:null,
        schedule:null,
        confirm:false,
        field:{
          vto_at:null,
          agents:[]
        },
        model:{
          start_event:null,
          end_event:null,
        },
        report:{
          dialog:false,
          arr_length:0,
          loop_index:0,
          progress:0,
          data:{
            all:[],
            errors:[]
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters(["agents","token"])
  },
  created() {
    this.fetchVtoList();
  },
  watch:{
  },
  methods: {
    ...mapActions(["fetchVtoList","fetchAgents"]),
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
      let field = this.form.field;
      this.form.confirm = true;
      if(field.agents.length > 0 && field.vto_at!=""){
        this.loopCreateVto();
      }else{
        this.form.confirm=false;
        this.$message({
          type:"warning",
          message:"Please fill all fields.",
          duration:5000
        })
      }
    },
    loopCreateVto(){
      let field = this.form.field,
      url="api/v1/schedules/vto/create",
      options={
        headers:{
          Authorization: "Bearer "+ this.token
        }
      };
      this.form.report.arr_length = field.agents.length;
      this.form.report.dialog = true;

      field.agents.forEach(((v,i)=>{
        let formData = new FormData;
        formData.append('agent',v);
        formData.append('timestamp',moment(field.vto_at).format("YYYY-MM-DD HH:mm:ss"))
        axios.post(url,formData,options).then(res=>{
          this.form.report.loop_index = i+1;
          this.form.report.progress = this.form.report.arr_length/this.form.report.loop_index;
          if(res.data.code == 200){
            this.form.report.data.all.push({full_name: res.data.parameters.agent});
          }
        }).catch(err=>console.log(err.response.data.title));
      }).bind(this));
    },
    remoteAgent(query) {
      const data = {}
      if (query !== '') {
        data['target[]'] = 'full_name'
        data.query = query
        this.fetchAgents({ data })
      } else {
        data['target[]'] = ''
        data.query = ''
        this.fetchAgents({ data })
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
