<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row :gutter="10">
        <el-col :md="{span:12}">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px">
              Leave Slots
            </div>
              <div
                class="button-icon round active"
                style="display:flex;justify-content:center;margin-right:5px;"
                @click="form.addLeaveSlot.show = true"
              >
                <el-tooltip placement="top" content="Add Leave Slots">
                  <plus-icon></plus-icon>
                </el-tooltip>
              </div>
          </div>
        </el-col>
        <el-col :md="{span:4}">
          <el-input placeholder="Search..." v-model="query.query" @input="debounceInput"></el-input>
        </el-col>
        <el-col :md="{span:4}">
          <el-select v-model="query.leave_type">
            <el-option value="vacation_leave" label="Vacation Leave"></el-option>
            <el-option value="leave_of_absence" label="Leave of Absence"></el-option>
          </el-select>
        </el-col>
        <el-col :md="{span:4}">
          <el-date-picker
            v-model="week.start"
            type="week"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{firstDayOfWeek:1}"
            :clearable="false"
            @change="weekChange"
            style="width:100%"
          />
        </el-col>
      </el-row>
    </div>

  <div class="table-container shadow">
    <el-row :gutter="10">
      <el-col :md="{span:8}">
        {{ title() }}
      </el-col>
      <el-col :md="{span:16}">
        <el-pagination
          style="float:right"
          :pager-count="5"
          :page-sizes="[1,10,25,50]"
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
      <el-col :md="{span:24}">
        
    <el-table class="monday" v-loading="fetchEmployeesState.initial" :data="table_config.data" @sort-change="columnSort" style="margin-top:5px;">
      
            <el-table-column
              label="Name"
              sortable="custom"
              align="left"
              width="350"
              prop="full_name"
              fixed
            >
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-tooltip
                    :content="scope.row.email"
                    placement="top"
                  >
                    <div
                      style="width:100%;align-self:center;padding-left:20px;"
                    >
                      {{ scope.row.full_name }}
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50" fixed>
              <template slot-scope="scope">
                <div class="user-block">
                  <div v-if="scope.row.image_url" style="width:100%;">
                    <div style="margin:0 auto;height:30px;width:30px;">
                      <img
                        class="img-circle"
                        style="margin:0 auto;"
                        :src="scope.row.image_url"
                      />
                    </div>
                  </div>
                  <div v-else class="text-muted" style="width:100%;">
                    <div
                      class="img-circle"
                      style="background-color:white;margin:0 auto;"
                    >
                      <div style="display:flex;height:30px;width:30px;">
                        <div
                          style="align-self:center;width:100%;text-align:center;font-weight:bold;font-size:.8em"
                        >
                          {{
                            getAvatarLetters(
                              scope.row.firstname,
                              scope.row.lastname
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
      <template v-for="(header,index) in tableHeader">
        <el-table-column align="center" :key="index">
          <template slot="header" slot-scope="scope">
            <h4
              :class="[dateToday(tableHeader[index].date)?'today-header':'']"
              style="margin-bottom:5px"
            >{{ tableHeader[index].day }}</h4>
            <span :class="[dateToday(header.date)?'today-header':'']">{{ tableHeader[index].date1 }}</span>
          </template>
          <template slot-scope="{row}">
            <template v-for="(slot,index) in plotLeaveSlotsPerDay(row.leave_slots,header.date)">
              <cell-content
                @updateDelete="updateDelete"
                :key="index"
                :mslot="plotLeaveSlotsPerDay(row.leave_slots,header.date)[index]"
                :date="header.date"
              />
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
      </el-col>
    </el-row>

  </div>
    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.addLeaveSlot.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Add Leave Slots"
      width="30%"
      top="5vh"
    >
      <el-row>
        <el-col>
          <div class="form-label">Dates</div>
          <div class="form-item">
          <el-date-picker
            v-model="form.addLeaveSlot.field.dates"
            type="dates"
            style="width:100%;padding-bottom:2px"
            class="form-input"
          />
          </div>
          <span
            style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px"
          >count: {{ form.addLeaveSlot.field.dates.length }}</span>
        </el-col>
        <el-col>
          <div class="form-label mt-8">Cluster</div>
          <div class="form-item">
            
          <el-select
            v-model="form.addLeaveSlot.field.cluster"
            class="form-input"
            style="width:100%;padding-bottom:2px"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="Cluster..."
            :remote-method="remoteCluster"
            :loading="form.addLeaveSlot.remote_loader"
          >
            <el-option
              v-for="item in remote.cluster"
              :key="item.id"
              :label="item.full_name"
              :value="item.id"
            />
          </el-select>
          </div>
          <span
            style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px;"
          >count: {{ form.addLeaveSlot.field.cluster.length }}</span>
        </el-col>
        <el-col>
          <div class="form-label mt-8">Leave Type</div>
          <div class="form-item">
            <el-select
              v-model="form.addLeaveSlot.field.leave_type"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              class="form-input"
              placeholder="Select"
            >
              <el-option
                v-for="item in leave_types"
                :key="item.id"
                :label="item.title"
                :value="item.leave_type"
              />
            </el-select>
          </div>
        </el-col>
        <el-col>
          <div class="form-label mt-8">Value</div>
          <div class="form-item">
            <el-input-number
              v-model="form.addLeaveSlot.field.value"
              step="1"
              step-strictly
              controls-position="right"
              style="width:100%"
            ></el-input-number>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="form.addLeaveSlot.show=false">Cancel</el-button>
        <el-button
          type="danger"
          size="mini"
          :loading="form.addLeaveSlot.btn_loader"
          @click="submitLeaveSlotForm"
        >Confirm</el-button>
      </span>
    </el-dialog>
    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.updateLeaveSlot.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Update Leave Slots"
      width="350px"
      top="5vh"
    >
      <el-row>
        <el-col>
          <div class="form-label">Value</div>
          <div class="form-item">
            <el-input-number
              v-model="form.updateLeaveSlot.field.value"
              step="1"
              step-strictly
              controls-position="right"
              style="width:100%"
            ></el-input-number>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row>
          <el-col>
            <el-button
              size="mini"
              type="info"
              @click="submitDeleteSlot"
              style="float:left"
              :loading="form.updateLeaveSlot.btn_del_loader"
            >Delete</el-button>
            <el-button size="mini" @click="form.updateLeaveSlot.show=false">Cancel</el-button>
            <el-button
              type="danger"
              size="mini"
              :loading="form.updateLeaveSlot.btn_loader"
              @click="submitUpdateSlot()"
            >Confirm</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tabContent from "./components/tabContent";
import { mapGetters, mapActions } from "vuex";
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
import cellContent from "./components/cellContent";
const moment = extendMoment(Moment);
import axios from "axios";
import {debounce} from "debounce";
export default {
  components: { tabContent,cellContent },
  data() {
    return {
      query: {
        limit: 10,
        offset: 0,
        leave_slots: true,
        start_date: [],
        end_date: [],
        leave_type: "vacation_leave",
        sort: null,
        order: null,
        query: null,
        target: null
      },
      tableHeader: [],
      table_config: {
        page: 1,
        display_size: 10,
        count: 0,
        loader: false
      },
      refresh: false,
      week: {
        start: moment()
          .startOf("isoweek")
          .format("YYYY-MM-DD"),
        end: null
      },
      activeTab: null,
      options: {
        cluster: []
      },
      remote: {
        cluster: []
      },
      data: {
        start_date: null,
        end_date: null,
        leave_type: null
      },
      leave_types: [
        {
          leave_type: "vacation_leave",
          title: "Vacation Leave"
        },
        {
          leave_type: "leave_of_absence",
          title: "Leave of absence"
        }
      ],
      form: {
        addLeaveSlot: {
          remote_loader: false,
          show: false,
          btn_loader: false,
          field: {
            dates: [],
            cluster: [],
            leave_type: null,
            value: 10
          }
        },
        updateLeaveSlot: {
          show: false,
          btn_del_loader: false,
          btn_loader: false,
          field: {
            value: 0,
            id: null
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "createLeaveSlotBulkState",
      "createLeaveSlotBulkData",
      "createLeaveSlotBulkError",
      "fetchEmployeesState",
      "fetchEmployeesData",
      "fetchEmployeesError",
      "updateLeaveSlotsState",
      "updateLeaveSlotsData",
      "updateLeaveSlotsTitle",
      "deleteLeaveSlotsState",
      "deleteLeaveSlotsData",
      "deleteLeaveSlotsTitle",
      "fetchEmployeesTotal"
    ])
  },
  watch: {
    "query.leave_type":function(){
      this.fetchEmployees({data:this.query});
    },
    fetchEmployeesState({ initial, success, fail }) {
      if (initial) {
        this.table_config.data = [];
      }
      if (success) {
        this.table_config.data = this.fetchEmployeesData;
        this.table_config.count = this.fetchEmployeesTotal;
      }
      if (fail) {
        this.table_config.data = [];
        this.table_config.count = 0;
      }
    },
    updateLeaveSlotsState({ initial, success, fail }) {
      if (initial) {
        this.form.updateLeaveSlot.btn_loader = true;
      }
      if (success || fail) {
        this.$message({
          type: success ? "success" : "error",
          message: this.updateLeaveSlotsTitle,
          duration: 5000
        });
        this.form.updateLeaveSlot.btn_loader = false;
        if (success) {
          this.refresh = !this.refresh;
          this.form.updateLeaveSlot.show = false;
        }
      }
    },
    deleteLeaveSlotsState({ initial, success, fail }) {
      if (initial) {
        this.form.updateLeaveSlot.btn_del_loader = true;
      }
      if (success || fail) {
        this.$message({
          type: success ? "success" : "error",
          message: this.deleteLeaveSlotsTitle,
          duration: 5000
        });
        this.form.updateLeaveSlot.btn_del_loader = false;
        if (success) {
          this.refresh = !this.refresh;
          this.form.updateLeaveSlot.show = false;
        }
      }
    },
    createLeaveSlotBulkState({ initial, success, fail }) {
      if (initial) {
        this.form.addLeaveSlot.btn_loader = true;
      }
      if (success) {
        this.form.addLeaveSlot.btn_loader = false;
        this.form.addLeaveSlot.show = false;
        this.$message({
          type: "success",
          message: "You have successfully generated leave slots.",
          duration: 5000
        });
        this.refresh = !this.refresh;
      }
      if (fail) {
        this.form.addLeaveSlot.btn_loader = false;
        this.form.addLeaveSlot.show = false;
        this.$message({
          type: "error",
          message: "There is a problem processing your request.",
          duration: 5000
        });
      }
    }
  },
  mounted() {
    this.activeTab = "vacation_leave";
    this.form.addLeaveSlot.field.leave_type = this.leave_types[0].leave_type;
    this.getClusterOptions();
    this.weekChange(
      moment()
        .startOf("isoweek")
        .format("YYYY-MM-DD")
    );
  },
  methods: {
    ...mapActions([
      "createLeaveSlotBulk",
      "updateLeaveSlots",
      "deleteLeaveSlots",
      "fetchEmployees"
    ]),
    debounceInput:debounce(function(e){
      if(this.query.query !=="" && this.query.query!==null){
        this.query.target = ["full_name"];
      }else{
        this.query.target =null;
      }
      this.fetchEmployees({data:this.query});
    },1000),
    submitDeleteSlot() {
      if (confirm("Are you sure you want to delete slots?")) {
        this.deleteLeaveSlots({ id: this.form.updateLeaveSlot.field.id });
      }
    },
    submitUpdateSlot() {
      this.updateLeaveSlots(this.form.updateLeaveSlot.field);
    },
    updateDelete(data) {
      this.form.updateLeaveSlot.show = true;
      this.form.updateLeaveSlot.field.value = data.value;
      this.form.updateLeaveSlot.field.id = data.id;
    },
    resetLeaveSlotForm() {
      this.form.addLeaveSlot.field = {
        dates: [],
        cluster: [],
        leave_type: null,
        value: 10
      };
    },
    submitLeaveSlotForm() {
      let data = {},
        form = this.form.addLeaveSlot.field,
        leave_slots = [];
      form.cluster.forEach(
        ((v, i) => {
          form.dates.forEach(
            ((v1, i1) => {
              leave_slots.push({
                user_id: v,
                leave_type: form.leave_type,
                value: form.value,
                date: moment(v1).format("YYYY-MM-DD")
              });
            }).bind(this)
          );
        }).bind(this)
      );
      // console.log(leave_slots)
      data.leave_slots = leave_slots;
      this.createLeaveSlotBulk(data);
    },
    weekChange(e) {
      let start = moment(e)
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      let end = moment(e)
        .endOf("isoweek")
        .format("YYYY-MM-DD");
      this.week.start = start;
      this.week.end = end;
      this.query.start_date = start;
      this.query.end_date = end;
      const range = moment.range(start, end);
        const dates = Array.from(range.by("day")).map(m =>
          m.format("YYYY-MM-DD")
        );
        this.tableHeader = dates.map(d => ({
          day: moment(d).format("ddd"),
          date: moment(d).format("YYYY-MM-DD"),
          date1: moment(d).format("MMM Do")
        }));
    this.fetchEmployees({ data:this.query });
    },
    getClusterOptions() {
      let url = "api/v1/users?target[]=position&query=operations manager",
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        };
      axios
        .get(url, options)
        .then(res => {
          this.options.cluster = res.data.meta.metadata;
        })
        .catch(err => console.log(err.response.data));
    },
    remoteCluster(query) {
      this.form.addLeaveSlot.remote_loader = true;
      const data = {};
      if (query !== "") {
        this.remote.cluster = this.options.cluster.filter(
          i => i.full_name.toLowerCase().indexOf(query) > -1
        );
        this.form.addLeaveSlot.remote_loader = false;
      } else {
        this.remote.cluster = this.options.cluster;
        this.form.addLeaveSlot.remote_loader = false;
      }
    },
    title(){
      return moment(this.week.start).format("MMM. Do") + " - " + moment(this.week.end).format("MMM. Do") + (this.query.leave_type=="vacation_leave"? "(Vacation Leave)": "(Leave of Absence)")
    },
    columnSort({ column, prop, order }) {
      if (order) {
        this.query.sort = prop;
        this.query.order = order == "ascending" ? "asc" : "desc";
      } else {
        this.query.sort = null;
        this.query.order = null;
      }
      this.fetchEmployees({ data:this.query });
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.query.offset = 0;
      this.fetchEmployees({ data:this.query });
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.table_config.page = value;
      this.fetchEmployees({ data:this.query });
    },
    plotLeaveSlotsPerDay(slots, date) {
      const slot = slots.filter(
        i => moment(i.date).format("YYYY-MM-DD") == date
      );
      if (slot.length == 0) {
        return [{}];
      } else {
        return slot;
      }
    },
    dateToday(date) {
      if (moment(date).isSame(moment().format("YYYY-MM-DD"))) {
        return true;
      } else {
        return false;
      }
    },
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
  height:45px;
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
