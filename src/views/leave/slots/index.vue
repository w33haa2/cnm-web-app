<template>
  <div class="app-container">
    <h4 style="color:#646464">Leave Slots</h4>
    <el-row>
      <el-col :md="{span:4}">
        <el-button size="mini" @click="form.addLeaveSlot.show = true">Add Leave Slots</el-button>
      </el-col>
      <el-col :md="{span:4, offset:16}" style="margin-top:10px;">
        <el-date-picker
          v-model="week.start"
          size="mini"
          type="week"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="{firstDayOfWeek:1}"
          :clearable="false"
          @change="weekChange"
          style="width:100%"
        />
      </el-col>
      <!-- <el-col :md="{span:20}">
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
      </el-col>-->
      <el-col style="margin-top:30px;">
        <el-tabs type="border-card" v-model="activeTab">
          <el-tab-pane
            v-for="(item,index) in leave_types"
            :key="index"
            :label="item.title"
            :name="item.leave_type"
          >
            <tab-content
              :leaveType="item.leave_type"
              :data="data"
              @updateDelete="updateDelete"
              :refresh="refresh"
            ></tab-content>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
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
          <label for="dates">Dates</label>
          <el-date-picker
            v-model="form.addLeaveSlot.field.dates"
            size="mini"
            type="dates"
            style="width:100%;padding-bottom:2px"
            class="form-input"
          />
          <span
            style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px"
          >count: {{ form.addLeaveSlot.field.dates.length }}</span>
        </el-col>
        <el-col>
          <label for="dates">Cluster</label>
          <el-select
            v-model="form.addLeaveSlot.field.cluster"
            class="form-input"
            style="width:100%;padding-bottom:2px"
            size="mini"
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
          <span
            style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px;"
          >count: {{ form.addLeaveSlot.field.cluster.length }}</span>
        </el-col>
        <el-col>
          <label for="dates">Leave Type</label>
          <el-select
            v-model="form.addLeaveSlot.field.leave_type"
            style="width:100%;padding-bottom:2px;margin-bottom:10px;"
            class="form-input"
            size="mini"
            placeholder="Select"
          >
            <el-option
              v-for="item in leave_types"
              :key="item.id"
              :label="item.title"
              :value="item.leave_type"
            />
          </el-select>
        </el-col>
        <el-col>
          <label for="dates">Value</label>
          <el-input-number
            size="mini"
            v-model="form.addLeaveSlot.field.value"
            step="1"
            step-strictly
            controls-position="right"
            style="width:100%"
          ></el-input-number>
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
          <label for="dates">Value</label>
          <el-input-number
            size="mini"
            v-model="form.updateLeaveSlot.field.value"
            step="1"
            step-strictly
            controls-position="right"
            style="width:100%"
          ></el-input-number>
        </el-col>
      </el-row>
      <div slot="footer">
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tabContent from "./components/tabContent";
import { mapGetters, mapActions } from "vuex";
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import axios from "axios";
export default {
  components: { tabContent },
  data() {
    return {
      refresh: false,
      week: {
        start: moment()
          .startOf("isoweek")
          .format("YYYY-MM-DD"),
        end: null
      },
      table_config: {
        display_size: 10,
        count: 1,
        page: 1
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
      "fetchEmployeesError",
      "updateLeaveSlotsState",
      "updateLeaveSlotsData",
      "updateLeaveSlotsTitle",
      "deleteLeaveSlotsState",
      "deleteLeaveSlotsData",
      "deleteLeaveSlotsTitle"
    ])
  },
  watch: {
    activeTab(v) {
      this.data = {
        start_date: this.week.start,
        end_date: this.week.end,
        leave_type: v
      };
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
    fetchEmployeesState({ initial, success, fail }) {
      if (fail) {
        this.$message({
          type: "warning",
          message: this.fetchEmployeesError,
          duration: 5000
        });
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
      "deleteLeaveSlots"
    ]),
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
      this.data = {
        start_date: start,
        end_date: end,
        leave_type: this.activeTab
      };
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
    }
  }
};
</script>
