<template>
  <div style="padding:10px;">
    <el-tooltip :content="fromNow(leave.updated_at)">
      <div style class="row-detail-container" :class="bgc">
        <div style="height:100%;">
          <div class="name-container">
            <!-- <div class="truncate cur-p c-white">{{ details.name }}</div> -->
          </div>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import Moment from "moment/moment";
// import tz from "moment-timezone";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment
// , tz
);
export default {
  props: ["leave", "leaves", "slots", "week"],
  data() {
    return {
      // bgc: "approved"
    };
  },
  computed: {
    bgc() {
      let week_start = moment(this.week).startOf("isoweek"),
        week_end = moment(this.week).endOf("isoweek"),
        leave_start = moment(this.leave.created_at),
        isBetween = moment(leave_start).isBetween(
          week_start,
          week_end,
          null,
          []
        );
      return isBetween ? "approved" : "blue";
    }
  }

  // mounted() {
  //   let range = moment.range(
  //       moment(this.leave.start_event).startOf("day"),
  //       moment(this.leave.end_event).endOf("day")
  //     ),
  //     range1 = Array.from(range.by("day")).map(m => m.format("YYYY-MM-DD")),
  //     slot_dates = this.slots.filter(i => range1.includes(i.date.slice(0, 10))),
  //     insufficient_slots =
  //       slot_dates.filter(i => parseInt(i.value) < 2).length > 0 ? true : false;
  //   console.log(range);
  //   if (insufficient_slots) {
  //     this.bgc = "disabled";
  //   } else {
  //     if (this.leaves.filter(i => i.status == "approved").length > 0) {
  //       if (this.leave.status == "pending") {
  //         this.bgc = "disabled";
  //       } else if (this.leave.status == "approved") {
  //         this.bgc = "approved";
  //       }
  //     } else {
  //       if (this.leave.status == "pending") {
  //         this.bgc = "pending";
  //       } else if (this.leave.status == "approved") {
  //         this.bgc = "approved";
  //       }
  //     }
  //   }
  // }
};
</script>

<style lang="scss">
.row-detail-container {
  width: 100%;
  border-radius: 20px;
  box-sizing: border-box;
  height: 30px;
  text-align: left;
  cursor: pointer;
}
.truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
}
.cur-p {
  cursor: pointer;
}
.pt-4 {
  padding-top: 4px;
}
.c-white {
  color: white;
}
.name-container {
  float: left;
  margin-left: 10px;
  width: calc(90% - 40px);
}

.approved {
  background-image: linear-gradient(to right, #80fbc8, #00de83);
}
.pending {
  background-image: linear-gradient(to right, #fbe089, #f38281);
}
.disabled {
  background-image: linear-gradient(to right, #fba989, #f8221f);
}
.blue {
  background-color: #272852;
}

.blue-hover {
  background-color: #5bcef7;
}
</style>
