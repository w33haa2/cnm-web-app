<template>
  <div class="tab-content-container">
    <el-row style="margin-bottom:10px;">
      <el-col :md="{span:4}">
        <el-input size="mini" placeholder="Search..." v-model="search"></el-input>
      </el-col>
      <el-col :md="{span:20}">
        <el-pagination
          style="float:right"
          pager-count="4"
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
    </el-row>

    <el-table v-loading="table_config.loader" :data="table_config.data" @sort-change="columnSort">
      <el-table-column label="Employee" min-width="200" prop="full_name" fixed sortable="custom">
        <template slot-scope="scope">
          <div class="user-block">
            <img v-if="scope.row.image_url" class="img-circle" :src="scope.row.image_url" />
            <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
              <div
                style="align-self:center;width:100%;text-align:center;"
                class="text-point-eight-em"
              >{{ getAvatarLetters(scope.row.firstname,scope.row.lastname) }}</div>
            </div>
            <span>
              <span class="el-dropdown-link" style="font-weight:600">{{ scope.row.full_name }}</span>
            </span>
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
  </div>
</template>

<script>
import axios from "axios";
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import { mapActions, mapGetters } from "vuex";
import cellContent from "./cellContent";
export default {
  components: { cellContent },
  props: ["leaveType", "data", "refresh"],
  data() {
    return {
      search: "",
      query: {
        limit: 10,
        offset: 0,
        leave_slots: true,
        start_date: [],
        end_date: [],
        leave_type: this.leaveType,
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
      }
    };
  },
  mounted() {
    // this.fetchLeaveSlots()
  },
  computed: {
    ...mapGetters([
      "fetchEmployeesState",
      "fetchEmployeesData",
      "fetchEmployeesError",
      "fetchEmployeesTotal"
    ])
  },
  watch: {
    search(v) {
      if (v != "") {
        this.query.query = v;
        this.query.target = ["full_name"];
      } else {
        this.query.query = null;
        this.query.target = null;
      }
      const data = this.unsetNull(this.query);
      this.fetchEmployees({ data });
    },
    refresh(v) {
      if (this.leaveType == this.data.leave_type) {
        const data = this.unsetNull(this.query);
        this.fetchEmployees({ data });
      }
    },
    fetchEmployeesState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
        this.table_config.data = [];
        // this.table_config.count = 0
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.fetchEmployeesData;
        this.table_config.count = this.fetchEmployeesTotal;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
        this.table_config.count = 0;
      }
    },
    data(v) {
      // setting query values
      // alert(this.leaveType +" -- "+ v.leave_type)
      this.query.offset = 0;
      if (this.leaveType == v.leave_type) {
        this.query.leave_type = this.data.leave_type;
        const range = moment.range(v.start_date, v.end_date);
        const dates = Array.from(range.by("day")).map(m =>
          m.format("YYYY-MM-DD")
        );
        this.tableHeader = dates.map(d => ({
          day: moment(d).format("ddd"),
          date: moment(d).format("YYYY-MM-DD"),
          date1: moment(d).format("MMM Do")
        }));
        this.query.start_date = v.start_date;
        this.query.end_date = v.end_date;
        const data = this.unsetNull(this.query);
        this.fetchEmployees({ data });
      }
    }
  },
  methods: {
    ...mapActions(["fetchEmployees"]),
    columnSort({ column, prop, order }) {
      if (order) {
        this.query.sort = prop;
        this.query.order = order == "ascending" ? "asc" : "desc";
      } else {
        this.query.sort = null;
        this.query.order = null;
      }
      const data = this.unsetNull(this.query);
      this.fetchEmployees({ data });
    },
    updateDelete(data) {
      this.$emit("updateDelete", data);
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
    tableSizeChange(value) {
      this.query.limit = value;
      this.query.offset = 0;
      const data = this.unsetNull(this.query);
      this.fetchEmployees({ data });
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.table_config.page = value;
      const data = this.unsetNull(this.query);
      this.fetchEmployees({ data });
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
</style>
