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
        <el-select size="mini" style="width:100%" :disabled="filter.select.vto_list.disabled" v-model="filter.select.vto_list.model">
          <el-option v-for="(option,index) in filter.options.vto_list" :key="index" :value="option.value" :label="option.label"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row style="margin-bottom:10px;">
      <el-col :md="{span:4}">
        <el-input size="mini" placeholder="Search..." v-model="searchQuery"></el-input>
      </el-col>
      <el-col :md="{span:20}">
        <el-pagination
          style="float:right"
          pager-count="4"
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

    <el-row>
      <el-col>
      <el-table :data="table_config.data" style="width:100%;" v-loading="table_config.loader">
        <el-table-column label="Agent" >
          <template slot-scope="scope">
            <div class="user-block">
              <img v-if="scope.row.user_info.image_url" class="img-circle" :src="scope.row.user_info.image_url" />
              <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
                <div
                  style="align-self:center;width:100%;text-align:center;"
                  class="text-point-eight-em"
                >{{ getAvatarLetters(scope.row.user_info.firstname,scope.row.user_info.lastname) }}</div>
              </div>
              <span>
                  {{ scope.row.user_info.full_name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="VTO Hours">
          <template slot-scope="scope">
            <span>{{scope.row.vto_hours.time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Rendered Hours">
          <template slot-scope="scope">
            <span>{{ scope.row.rendered_hours.billable.second/60/60 +'hr/s'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Conformance">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.conformance | toFix" color="#6f7ad3"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="Remove" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteVto(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
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
              :loading="form.remote_loader"
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
            :label="'Errors: ' +form.report.data.all.filter(i=> i.status_code != 200).length "
            name="errors"
          >
            <el-table :data="form.report.data.all.filter(i=> i.status_code != 200)" height="350px">
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
        <el-button size="mini" @click="closeCreateVtoReport" style="float:right">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios"
import { mapActions, mapGetters } from "vuex"
import moment from "moment"
export default {
  data() {
    return {
      refresh_table:false,
      filter:{
        options:{
          vto_list:[]
        },
        select:{
          vto_list:{
            model:null,
            disabled:false,
          }
        }
      },
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
        remote_loader:false,
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
          active_tab:"all",
          data:{
            all:[],
            errors:[]
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "agents",
      "token",
      "fetchVtoListState",
      "fetchVtoListData",
      "fetchVtoListError",
      "fetchVtoState",
      "fetchVtoData",
      "fetchVtoError",
      "cancelVtoState",
      "cancelVtoData",
      "cancelVtoError",
      "agentsfetchState"
      ])
  },
  created() {
    this.fetchVtoList();
  },
  watch:{
    agentsfetchState({initial,success,fail}){
      if(initial){
        this.form.remote_loader=true;
      }
      if(success){
        this.form.remote_loader=false;
      }
      if(fail){
        this.form.remote_loader=false;
      }
    },
    "form.report.loop_index":function(v){
      if(v==this.form.report.arr_length){
        this.fetchVtoList();
      }
    },
    cancelVtoState({initial,success,fail}){
      if(success){
        this.filter.select.vto_list.model=[];
        this.fetchVtoList();
        this.$message({
          type:"success",
          message:"You have successfully cancelled VTO.",
          duration:5000
        });
      }
      if(fail){
        this.$message({
          type:"error",
          message:"There is a problem processing a request.",
          duration:5000
        })
      }
    },
    fetchVtoListState({initial,success,fail}){
      if(initial){
        this.filter.select.vto_list.disabled = true;
      }
      if(success){
        this.filter.options.vto_list = this.fetchVtoListData.agent_schedules.map(i=> ({value:moment(i.date).format("YYYY-MM-DD HH:mm:ss"),label:moment(i.date).format("YYYY-MM-DD HH:mm:ss")})).sort(this.descVtoList);
        this.filter.select.vto_list.model = this.filter.options.vto_list[0].value;
        this.filter.select.vto_list.disabled = false;
      }
      if(fail){
        this.filter.select.vto_list.disabled = false;
      }
    },
    fetchVtoState({initial,success,fail}){
      if(initial){
        this.table_config.data = [];
        this.table_config.loader = true;
        this.table_config.count = 0;
      }
      if(success){
        this.table_config.loader = false;
        this.table_config.data = this.fetchVtoData.agent_schedules;
        this.table_config.count = this.fetchVtoData.count;
        // this.filter.select.vto_list.model = this.filter.options.vto_list[0].value;
        // this.filter.select.vto_list.disabled = false;
      }
      if(fail){
        this.table_config.data = [];
        this.table_config.loader = false;
        this.table_config.count = 0;

      }
    },
    "filter.select.vto_list.model":function(v){
      let data = {}
      data.timestamp = v;
      if(this.searchQuery!=""){
        data["target[]"]="full_name";
        data["query"]=this.searchQuery;
      }
      this.fetchVto(data);
    },
    searchQuery(v){
      let data = {}
      data.timestamp = this.filter.select.vto_list.model;
      if(v!=""){
        data["target[]"]="full_name";
        data["query"]=v;
      }
      this.fetchVto(data);
    }
  },
  methods: {
    ...mapActions(["fetchVtoList","fetchAgents","fetchVto","cancelVto"]),
    closeCreateVtoReport(){
      if(this.form.report.progress==100){
        this.form.report.dialog = false;
        this.fetchVtoList();
        this.form.confirm = false;
        this.form.show = false;
        this.form.report.arr_length=0;
        this.form.report.loop_index=0;
        this.form.report.progress=0;
        this.form.report.active_tab='all';
        this.form.report.data.all =[];
        this.form.report.data.errors =[];
      }
    },
    deleteVto(data){
      if(confirm("Are you sure you want to cancel this vto?")){
        this.cancelVto({schedules:[data.id]})
      }
    },
    descVtoList(a, b) {
      let v1 = moment(a.date).format("YYYY-MM-DD HH:mm:ss"),
        v2 = moment(b.date).format("YYYY-MM-DD HH:mm:ss");
      let compare = 0;
      if (v2 > v1) {
        compare = 1;
      } else if (v2 < v1) {
        compare = -1;
      }
      return compare;
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
      let field = this.form.field,tmp_arr=[],
      url="api/v1/schedules/vto/create",
      options={
        headers:{
          Authorization: "Bearer "+ this.token
        }
      }, loop_count = 0;;
      this.form.report.arr_length = field.agents.length;
      this.form.report.dialog = true;

      field.agents.forEach(((v,i)=>{
        let formData = new FormData,tmp_data={};
        formData.append('agent',v);
        formData.append('timestamp',moment(field.vto_at).format("YYYY-MM-DD HH:mm:ss"))
        axios.post(url,formData,options).then(res=>{
          loop_count+=1;
          this.form.report.loop_index = loop_count;
          tmp_data.full_name = res.data.meta.agent_schedule.user_info.full_name;
          tmp_data.status_code = res.status;
          tmp_data.title = res.data.title;
          tmp_arr.push(tmp_data);
          this.form.report.data.all = tmp_arr;
          this.form.report.progress = (this.form.report.loop_index/this.form.report.arr_length)*100;
        }).catch(err=>{
          loop_count+=1;
            let res = err.response.data;
            this.form.report.loop_index = loop_count;
            tmp_data.full_name = res.meta.agent_schedule.user_info.full_name;
            tmp_data.status_code = res.code;
            tmp_data.title = res.title;
            tmp_arr.push(tmp_data);
            this.form.report.data.all = tmp_arr;
            this.form.report.progress = (this.form.report.loop_index/this.form.report.arr_length)*100;
        });
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
