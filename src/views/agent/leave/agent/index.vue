<template>
  <div class="app-container">
    <h4 style="color:#646464">Agent Leave</h4>
    <el-row>
      <el-col :md="{span:24}">
        <el-button
          size="mini"
          @click="leaveForm({action:'create'})"
          style="float:right"
        >Create Request</el-button>
      </el-col>
      <el-col :md="{span:10}">
        <el-calendar v-model="calendar.today"></el-calendar>
      </el-col>
      <el-col :md="{span:14}" style="padding-left: 20px">
        <!-- <el-calendar v-model="calendar.today"></el-calendar> -->
        <el-tabs style="padding-left:5px;padding-right:5px;" v-model="activeTab">
          <el-tab-pane :label="tab.label" :name="tab.name" v-for="(tab,index) in tabs" :key="index">
            <leave-table :status="tab.name" @on-update="leaveForm" :active-tab="activeTab" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.addLeave.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Add Leave"
      width="30%"
      top="5vh"
    >
      <el-row>
        <el-col>
          <label for="dates">Dates</label>
          <el-date-picker
            size="mini"
            type="daterange"
            v-model="form.addLeave.model.dates"
            style="width:100%;margin-top:4px;margin-bottom:10px;"
            class="form-input"
            placeholder="Range picker"
          ></el-date-picker>
          <!-- <span style="float:right;font-size:12px;color:grey;padding-right:10px;margin-bottom:10px">count:   {{ form.addSchedule.model.dates.length}}</span> -->
        </el-col>
        <el-col>
          <label for="dates">Leave Type</label>
          <el-select
            v-model="form.addLeave.model.leave_type"
            size="mini"
            class="form-input"
            style="width:100%;margin-top:4px;margin-bottom:10px;"
          >
            <el-option value="vacation_leave" label="Vacation" />
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="form.addLeave.show=false">Cancel</el-button>
        <el-button type="danger" size="mini">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import leaveTable from "./components/leaveTable";
export default {
  components: { leaveTable },
  data() {
    return {
      form: {
        addLeave: {
          show: false, // temporary value
          model: {
            user_id: null,
            dates: [],
            leave_type: null,
            status: null,
            generated_by: null,
            allowed_access: null
          }
        }
      },
      activeTab: "pending",
      tabs: [
        { label: "Pending", name: "pending" },
        { label: "Approved", name: "approved" },
        { label: "Denied", name: "denied" }
      ],
      calendar: {
        today: moment()
      }
    };
  },
  methods: {
    leaveForm(data) {
      this.form.addLeave.show = true;
      this.clearForm();
      if (data.action == "create") {
        alert("create");
      } else if (data.action == "update") {
        // update only if leave is before current date
        alert("update");
        this.fillForm(data);
      }
    },
    clearForm() {
      this.form.addLeave.model = {
        user_id: null,
        dates: [],
        leave_type: null,
        status: null,
        generated_by: null,
        allowed_access: null
      };
    },
    fillForm(data) {
      this.form.addLeave.model = {
        user_id: data.user_id,
        dates: [data.start_event, data.end_event],
        leave_type: data.leave_type,
        id: data.id
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.hide-picker-input {
}
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.is-selected {
  color: #1989fa;
}
.list {
  height: 85%;
  overflow-y: scroll;

  ul {
    margin: 0;
    padding: 0;
    li {
      padding: 10px;
      border-bottom: #eeeeee solid 1px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
