<template>
  <div class="app-container">
    <h4 style="color:#646464">Overtime Agents</h4>
    <el-row>
      <el-col v-if="position != 'Operations Manager' && position != 'Team Leader'" :md="{span:4}">
        <el-select v-model="select.operationsManager" placeholder="Operations Manager" size="mini" style="margin-bottom:20px;width:100%;padding-right:5px">
          <el-option v-for="(item,index) in options.operationsManager" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :md="{span:4}">
        <el-select v-model="select.teamLeader" placeholder="Team Leader..." size="mini" style="margin-bottom:20px;width:100%" :disabled="disable_select.teamLeader">
          <el-option v-for="(item,index) in options.teamLeader" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
    </el-row>
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane v-for="(tab,index) in tabs" :key="index" :label="tab.label" :name="tab.name" >
          <tab-content :tabName="tab.name" :filter="filterContent"></tab-content>
        </el-tab-pane>
      </el-tabs>
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
      filterContent:{},
      filter:{
        activeTab:null,
        field:null,
        id:null
      },
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
      options:{
        teamLeader:[{value:"all",label:"All"}],
        operationsManager:null
      },
      select:{
        teamLeader:"all",
        operationsManager:null,
      },
      disable_select:{
        teamLeader:false,
        operationsManager:false,
      },
    };
  },
  computed: {
    ...mapGetters(["token","position","user_id","head_id"])
  },
  created() {
    this.activeTab="approved";
    if(this.position == "Operations Manager" || this.position =='Team Leader'){
      this.disable_select.teamLeader = false;
      this.getUsersByPosition({query:"team leader", var:"teamLeader"})
    }else{
      this.disable_select.teamLeader = true;
      this.getUsersByPosition({query:"operations manager",var:"operationsManager"})
    }
  },
  watch:{
    activeTab(v){
      this.filter.activeTab = v;
      this.filterContent = this.filter;
    },

    "select.operationsManager":function(v){
      if(this.position != "Operations Manager" || this.position != "Team Leader"){
        this.filter.field = "om";
        this.filter.id = v;
        this.filterContent = this.filter
        if(v == "all"){
          this.disable_select.teamLeader = true;
          this.select.teamLeader = v;
        }else{
          this.disable_select.teamLeader = false;
          this.getUsersByPosition({query:"team leader",var:"teamLeader"})
        }
      }
    },
    "select.teamLeader":function(v){
      this.filter.field = "tl"
      this.filter.id = v
    }
  },
  methods: {
    getUsersByPosition(query){
      let url = "api/v1/users/search?target[]=position&query="+query.query,options = {
        headers:{
          Authorization: "Bearer "+ this.token
        }
      };
      axios.get(
        url, options
      ).then(res => {
        let filtered = res.data.meta.users;
        if(query.query == "team leader"){
          filtered = res.data.meta.users.filter(i => i.parent_id == this.select.operationsManager)
        }
        this.options[query.var] = filtered.map(function(v){
          return {value:v.id, label:v.full_name}
        });
        this.options[query.var].unshift({value:"all",label:"All"})
        this.select[query.var] = "all"
      }).catch(err=>console.log(err.response.data))
    },
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
