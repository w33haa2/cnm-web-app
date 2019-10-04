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
        <el-button size="mini" @click="bulkCreditsCreate()">Create Agent Credits</el-button>
      </el-col>
    </el-row>
      <el-tabs type="border-card" v-model="activeTab"  style="margin-top:10px;">
        <el-tab-pane v-for="(tab,index) in tabs" :key="index" :label="tab.label" :name="tab.name" >
          <tab-content :tabName="tab.name" :activeTab="activeTab" :refresh="refresh_table"></tab-content>
        </el-tab-pane>
      </el-tabs>

      <!-- Create and Update Dialog -->
      <!-- <el-dialog
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
      </el-dialog> -->
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
      ]
    };
  },
  computed: {
    ...mapGetters([])
  },
  mounted() {
    this.activeTab = "vacation_leave"
  },
  watch:{
    // create function
  },
  methods: {
    ...mapActions([]),

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
