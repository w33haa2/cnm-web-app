<template>
  <div>
    <el-row>
      <el-col>
        <el-row>
          <el-col
            :sm="{span:12}"
            style="line-height:2"
          >{{ formatDate(curMonthDate,"","MMMM YYYY") }}</el-col>
          <el-col :sm="{span:12}">
            <el-button-group style="float:right">
              <el-button size="mini" @click="prev">
                <i class="el-icon-arrow-left" />
              </el-button>
              <el-button size="mini" @click="now">NOW</el-button>
              <el-button size="mini" @click="next">
                <i class="el-icon-arrow-right" />
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="margin-top:10px;">
        <el-calendar v-model="date">
          <template slot="dateCell" slot-scope="{date,data}">
            <div style="height:100%;width:100%;text-align:center">
              <div :style="'font-size:.8em;'+(highlightSunday(data))">{{ data.day.split("-")[2] }}</div>
              <!-- <div style="width:100%;text-align:center">
                    <div style="height:5px;width:5px;border-radius:50%;background-color:red;"></div>
              </div>-->
              <div v-if="data.type=='current-month'">
                <i class="el-icon-lock" style="color:grey" />
                <!-- <i class="el-icon-bell" /> -->
              </div>
            </div>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
const dateCellStyle = {};
export default {
  data() {
    return {
      date: moment()._d
    };
  },
  computed: {
    curMonthDate() {
      return moment(this.date).format("YYYY-MM-DD");
    }
  },
  watch: {},
  methods: {
    now() {
      this.date = moment()._d;
    },
    prev() {
      this.date = moment(this.date)
        .subtract("month", 1)
        .startOf("month")._d;
    },
    next() {
      this.date = moment(this.date)
        .add("month", 1)
        .startOf("month")._d;
    },
    highlightSunday(data, date) {
      let result = "";
      if (
        moment(data.day)
          .format("dddd")
          .toLowerCase() == "sunday"
      ) {
        if (data.type == "current-month") {
          result = "color:red;";
        } else {
          result = "color:#ff9090;";
        }
      }
      return result;
    }
  }
};
</script>

<style scoped>
.el-calendar >>> .el-calendar-day {
  height: 50px;
  padding: 10px;
}
.el-calendar >>> *,
.el-calendar__table {
  border: none !important;
}
.el-calendar >>> .el-calendar__button-group {
  display: none;
}

.el-calendar >>> .el-calendar__title {
  display: none;
}

.el-calendar >>> .el-calendar__header {
  border: none;
  padding: 0px;
  margin: 0px;
}
.el-calendar >>> .el-calendar__body {
  padding: 0px;
}

.el-calendar >>> th {
  font-size: 0.7em;
  color: grey;
  text-transform: uppercase;
}

.el-calendar >>> .is-selected {
  border: rgb(100, 193, 255) 2px solid !important;
}
</style>