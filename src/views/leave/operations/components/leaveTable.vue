<template>
  <div>
    <el-row>
      <!-- backup excel -->
      <el-col :md="{span:24}">
        <el-pagination
          style="float:right"
          :page-sizes="[10, 25, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="tableData.count"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
      <el-col>
        <el-table
          :data="tableData.leaves"
          style="margin-top:5px;"
          v-loading="leavesfetchState.initial"
        >
          <el-table-column label="Employee" min-width="100" prop="full_name" fixed>
            <template slot="header">
              <span style="float:left">
                <h4 class="text-muted">Employee</h4>
              </span>
              <!-- <span style="float:left;padding:15px;">
                <i class="el-icon-sort text-point-eight-em cur-p" @click="columnSort('email')" />
              </span>-->
            </template>
            <template slot-scope="scope">
              <div class="user-block">
                <img v-if="scope.row.user.image_url" class="img-circle" :src="scope.row.user.image_url">
                <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
                  <div
                    style="align-self:center;width:100%;text-align:center;"
                    class="text-point-eight-em"
                  >{{ getAvatarLetters(scope.row.user.firstname,scope.row.user.lastname) }}</div>
                </div>
                <span>
                  {{ scope.row.user.full_name }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Dates">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.start_event,"","MMM Do") }}</span> -
              <span>{{ formatDate(scope.row.end_event,"","MMM Do") }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Leave Type">
            <template slot-scope="scope">{{ remUnderscore(ucwords(scope.row.leave_type)) }}</template>
          </el-table-column>
          <!-- <el-table-column align="center" label="History" width="150">
            <template slot-scope="scope">
              <span style="color:grey">DATE HERE</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column align="center" label="Credits" width="150">
            <template slot-scope="scope">
              <span style="color:grey">{{ scope.row.leave_credits.filter(i=>i.leave_type == "vacation_leave")[0].value }}</span>
            </template>
          </el-table-column> -->
          <template v-if="isOperations()">
            <template v-if="status == 'pending'">
              <el-table-column align="center" label="Action" width="200px">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :md="{span:12}" style="padding-right:5px;">
                      <el-button
                        size="mini"
                        @click="approveLeave({id: scope.row.id,om_id:query.om_id})"
                        type="info"
                        style="width:100%;"
                      >Approve</el-button>
                    </el-col>
                    <el-col  :md="{span:12}">
                      <el-button
                      style="width:100%"
                        :plain="true"
                        size="mini"
                        @click="rejectLeaveRow({id: scope.row.id,om_id:query.om_id})"
                        type="info"
                      >Decline</el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </template>
            <!-- <template v-if="status == 'approved'">
              <el-table-column align="center" label="Action" width="100">
                <template slot-scope="scope">
                  <el-row>
                    <el-col>
                      <el-button
                        :plain="true"
                        size="mini"
                        @click="cancelLeaveRow({id: scope.row.id, cancel_event: scope.row.start_event})"
                        type="info"
                        style="width:100%"
                      >Cancel</el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </template> -->
          </template>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
const tag = {
  pending:"warning",
  approved:"success",
  rejected:"danger",
}
export default {
  name: "Leave_Tables",
  props: ["status", "data","refresh"],
  data() {
    return {
      tableData: {},
      query: {
        limit: 10,
        offset: 0,
        allowed_access:null
      },
      tag: {
        type: null,
        label: null
      }
    };
  },
  computed: {
    ...mapGetters(["userDetails", "leaves", "leavesfetchState","position","head_id","user_id"])
  },
  mounted() {
    if(this.isOperations()){
      this.query.allowed_access=17
      if(this.position.toLowerCase() == "operations manager"){
        this.query.om_id = this.user_id
      }else if(this.position.toLowerCase() == "team leader"){
        this.query.om_id = this.head.id
      }
    }
  },
  watch: {
    refresh(v){
      if (this.data.activeTab == this.status) {
        // clear previous query variables
        delete this.query.status;
        delete this.query.created_at_start;
        delete this.query.created_at_end;
        delete this.query.tl_id;
        delete this.query.om_id;
        // reassign query variables
        this.query.status = this.data.activeTab;
        this.query.created_at_start = moment(this.data.created_at_start).startOf('day').format("YYYY-MM-DD HH:mm:ss");
        this.query.created_at_end = moment(this.data.created_at_end).endOf('day').format("YYYY-MM-DD HH:mm:ss");

        if(this.isOperations()){
          if(this.data.filter_tl=='all'){
            if(this.position.toLowerCase() == "operations manager"){
              this.query.om_id = this.user_id
            }else if(this.position.toLowerCase() == "team leader"){
              this.query.om_id = this.head.id
            }
          }else{
            this.query.tl_id = this.data.filter_tl;
          }
        }else{
          if(this.data.filter_om!='all'){
            if(this.data.filter_tl=='all'){
              this.query.om_id = this.data.filter_om;
            }else{
              this.query.tl_id = this.data.filter_tl;
            }
          }
        }


        this.tag = {
          type:tag[this.data.activeTab.toUpperCase()],
          label: this.data.activeTab.toUpperCase()
        }

        this.fetchLeave(this.query);
      }
    },
    data(v) {
      if (v.activeTab == this.status) {
        // clear previous query variables
        delete this.query.status;
        delete this.query.created_at_start;
        delete this.query.created_at_end;
        delete this.query.tl_id;
        delete this.query.om_id;
        // reassign query variables
        this.query.status = v.activeTab;
        this.query.created_at_start = moment(v.created_at_start).startOf('day').format("YYYY-MM-DD HH:mm:ss");
        this.query.created_at_end = moment(v.created_at_end).endOf('day').format("YYYY-MM-DD HH:mm:ss");

        if(this.isOperations()){
          if(v.filter_tl=='all'){
            if(this.position.toLowerCase() == "operations manager"){
              this.query.om_id = this.user_id
            }else if(this.position.toLowerCase() == "team leader"){
              this.query.om_id = this.head.id
            }
          }else{
            this.query.tl_id = v.filter_tl;
          }
        }else{
          if(v.filter_om!='all'){
            if(v.filter_tl=='all'){
              this.query.om_id = v.filter_om;
            }else{
              this.query.tl_id = v.filter_tl;
            }
          }
        }


        this.tag = {
          type:tag[v.activeTab.toUpperCase()],
          label: v.activeTab.toUpperCase()
        }

        this.fetchLeave(this.query);
      }
    },
    leavesfetchState({ initial, success, fail }) {
      if (success) {
        this.tableData = this.leaves;
      }
      if (fail) {
        this.tableData = {
          leaves: [],
          count: 0
        };
      }
    }
  },
  methods: {
    ...mapActions([
      "fetchLeave",
      "approveLeave",
      "cancelLeave",
      "rejectLeave"
    ]),
    rejectLeaveRow(data){
      if(confirm("Are you sure you want to decline request? This change will be permanent.")){
        this.rejectLeave(data)
      }
    },
    cancelLeaveRow(data){
      if(confirm("Are you sure you want to cancel approved leave? This change will be permanent.")){
        this.cancelLeave(data)
      }
    },
    isOperations(){
      if(this.position.toLowerCase() == "operations manager" || this.position.toLowerCase() == "team leader"){
        return true;
      }else{
        return false;
      }
    },
    updateRow(data) {
      data.action = "update";
      this.$emit("on-update", data);
    },
    tableSizeChange(value) {
      this.query.limit = value;
      // this.fetchIssuedReports(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      // this.fetchIssuedReports(this.query);
    },
    tagType(status) {
      let type = "warning";
      switch (status) {
        case "pending":
          type = "warning";
          break;
        case "approved":
          type = "success";
          break;
        case "denied":
          type = "danger";
          break;
      }
      return type;
    },
    //
    remUnderscore(string) {
      let str = string.split("_");
      let result = "";
      str.forEach((v, i) => {
        if (str.lenght - 1 != i) {
          result += v + " ";
        } else {
          result += v;
        }
      });
      return result;
    }
  }
};
</script>

<style scoped>
.user-block >>> .img-circle {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.monday >>> td > .user-block >>> div > img {
  padding: 0px;
  margin: 0px;
}

.monday >>> th {
  background-color: white !important;
  border-top: none;
  border-right: none;
  border-left: none;
}

.monday >>> th >>> .cell {
  font-weight: light !important;
}
.monday >>> td:first-child {
  border-left:5px solid crimson;
}
.monday >>> .el-table__row tr {
  background-color: #efefef;
  border-left: white solid 1px;
  border-bottom: white solid 1px;
  padding: 0px;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.monday >>> td {
  background-color: #efefef;
  border: white solid 1px;
  padding: 0px;
}
.monday >>> .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.monday >>> td {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

th >>> .cell {
  font-weight: normal !important;
  font-size: 0.8em !important;
}
</style>
