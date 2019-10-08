<template>
  <div class="app-container">
    <h4 style="color:#646464">Leave Credits</h4>
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
        <el-button size="mini" @click="openCreateCreditsModal()">Create Agent Credits</el-button>
      </el-col>
    </el-row>
      <el-tabs type="border-card" v-model="activeTab"  style="margin-top:10px;">
        <el-tab-pane v-for="(tab,index) in tabs" :key="index" :label="tab.label" :name="tab.name" >
          <tab-content :tabName="tab.name" :activeTab="activeTab" :refresh="refresh_table"></tab-content>
        </el-tab-pane>
      </el-tabs>

      <!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="form.credits.dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Create Agent Credits."
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col style="margin-bottom:10px;">
            <el-alert
              title="This will only apply to new agents with no existing credits."
              type="info"
              show-icon>
            </el-alert>
          </el-col>
          <el-col style="padding-bottom:5px;">
            <label>Leave Type</label>
            <el-select size="mini" v-model="form.credits.field.leave_type" style="width:100%;margin-top:5px;">
              <el-option value="vacation_leave" label="Vacation Leave"/>
              <el-option value="sick_leave" label="Sick Leave"/>
            </el-select>
          </el-col>
          <el-col style="padding-bottom:5px;">
            <label>Value</label>
            <el-input-number
              v-model="form.credits.field.value"
              size="mini"
              :max="100"
              style="width:100%;margin-top:5px;"
              class="form-input"
            />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="(form.credits.dialog=false)">Cancel</el-button>
          <el-button
            type="danger"
            size="mini"
            :loading="form.credits.confirm"
            @click="bulkCreateLeaveCredits(form.credits.field)"
s          >Confirm</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import tabContent from "./components/tabContent"

export default {
  components:{tabContent},
  data() {
    return {
      refresh_table:false,
      activeTab:null,
      tabs:[
        {
          name:"vacation_leave",
          label:"Vacation"
        },
        {
          name:"sick_leave",
          label:"Sick"
        }
      ],
      form:{
        credits:{
          dialog:false,
          confirm:false,
          field:{
            value:0,
            leave_type:null
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters(["bulkCreateLeaveCreditsState","bulkCreateLeaveCreditsData","bulkCreateLeaveCreditsError","searchLeaveCreditsState","searchLeaveCreditsData","searchLeaveCreditsError"])
  },
  mounted() {
    this.activeTab = "vacation_leave"
  },
  watch:{
    bulkCreateLeaveCreditsState({initial,success,fail}){
      if(initial){
        this.form.credits.confirm = true;
      }
      if(success){
        this.form.credits.confirm = false
        this.refresh_table = ! this.refresh_table;
        this.$message({
          type:"success",
          message: "You have successfully initialized agents with no leave credits.",
          duration: 5000
        })
      }
      if(fail){
        this.form.credits.confirm = false
        this.$message({
          type:"error",
          message: "There is a problem processing your request.",
          duration: 5000
        })
      }
    }
  },
  methods: {
    ...mapActions(["bulkCreateLeaveCredits"]),
    openCreateCreditsModal(){
      this.form.credits.field = {
        value:0,
        leave_type:'vacation_leave'
      }
      this.form.credits.dialog = true;
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
