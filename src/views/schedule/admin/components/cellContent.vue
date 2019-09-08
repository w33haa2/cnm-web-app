<template>
  <div>
    <el-popover v-if="with_schedule" width="200" trigger="click">
      <el-row>
        <el-col>
          <!-- if NCNS -->

          <el-row>
            <el-col>
              <el-tag
                :type="tag.type"
                :effect="tag.effect"
                style="width:100%;text-align:center
                "
              >{{ tag.label }}</el-tag>
            </el-col>
            <el-col>
              <h5 style="margin-bottom:5px;margin-top:8px;">Schedule</h5>
            </el-col>
            <el-col style="text-align:center">
              <div class="c-grey">{{ popup.data.schedule.in }}</div>
              <div class="c-grey">{{ popup.data.schedule.out }}</div>
            </el-col>
            <template v-if="tag.label!='WORK'">
              <el-col>
                <h5 style="margin-bottom:5px;margin-top:8px;">Attendance</h5>
              </el-col>
              <el-col style="text-align:center">
                <template v-if="popup.data.attendance.in.time">
                  <div class="c-success">{{ popup.data.attendance.in.time }}</div>
                </template>
                <template v-else>
                  <div class="c-grey">
                    <small>
                      <i>NO DATA</i>
                    </small>
                  </div>
                </template>
                <template v-if="popup.data.attendance.out.time">
                  <div class="c-success">{{ popup.data.attendance.out.time }}</div>
                </template>
                <template v-else>
                  <div class="c-grey">
                    <small>
                      <i>NO DATA</i>
                    </small>
                  </div>
                </template>
              </el-col>
            </template>
            <template v-if="tag.label == 'PRESENT'">
              <el-col>
                <h5 style="margin-bottom:5px;margin-top:8px;">Voluntary Time Out</h5>
              </el-col>
              <el-col style="text-align:center">
                <el-tag
                  v-if="popup.data.attendance.has_vto"
                  effect="dark"
                  style="width:100%;text-align:center
                "
                >HAS VTO</el-tag>
                <el-tag v-else style="width:100%;text-align:center
                ">ADD VTO</el-tag>
              </el-col>
            </template>
          </el-row>
          <el-row style="margin-top:10px;">
            <el-col v-if="tag.label=='ABSENT'" style="margin-top:5px;">
              <el-button size="mini" type="danger" style="width:100%">TAG NCNS</el-button>
            </el-col>
            <el-col v-if="tag.label=='NCNS'" style="margin-top:5px;">
              <el-button size="mini" type="info" style="width:100%">TAG ABSENT</el-button>
            </el-col>
            <el-col v-if="tag.label=='NCNS' || tag.label=='ABSENT'" style="margin-top:5px;">
              <el-button size="mini" type="warning" style="width:100%">TAG SICK LEAVE</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- <el-tag slot="reference" :type="tag.type" :effect="tag.effect">{{ tag.label }}</el-tag> -->
      <span slot="reference" :style="'padding:3px;font-size:.85em;background-color:'+tag.bc+';color:'+tag.fc">{{ tag.label }}</span>
    </el-popover>
    <span v-else :style="'padding:3px;font-size:.85em;background-color:'+tag.bc+';color:'+tag.fc">{{ tag.label }}</span>


    <!-- <el-tag v-else :type="tag.type" :effect="tag.effect">{{ tag.label }}</el-tag> -->
  </div>
</template>

<script>
import moment from "moment";
const tag  = {
  "present":{
    bc:"#67C23A",fc:"white",label:"PRESENT"
  },
  "on-leave":{
    bc:"#E6A23C",fc:"white",label:"ON-LEAVE"
  },
  "off":{
    bc:"#EBEEF5",fc:"#909399",label:"OFF"
  },
  "ncns":{
    bc:"#F56C6C",fc:"white",label:"NCNS"
  },
  "absent":{
    bc:"#909399",fc:"white",label:"ABSENT"
  },
  "inactive":{
    bc:"#000000",fc:"white",label:"INACTIVE"
  }
}
export default {
  props: ["schedule", "date", "info"],
  data() {
    return {
      with_schedule: false,
      tag: {
        bc:null,fc:null
      },
      popup: {
        width: 0,
        data: {
          schedule: {
            in: null,
            out: null
          },
          attendance: {
            in: {
              time: null,
              status: null
            },
            out: {
              time: null,
              status: null
            },
            status: null,
            has_vto: true
          }
        }
      }
    };
  },
  watch: {
    schedule(v) {
      this.evaluateSchedule();
    }
  },
  mounted() {
    this.evaluateSchedule();
  },
  methods: {
    evaluateSchedule() {
      const schedule = this.schedule;
      // alert(this.schedule)
      if (Object.keys(schedule).length > 0) {
        this.with_schedule = true;
        this.popup.data.schedule = {
          in: schedule.start_event.date,
          out: schedule.end_event.date
        };
        // if (moment(schedule.start_event.date).isBefore(moment())) {
        //   if (schedule.time_in) {
        //     this.tag = colors["present"]
        //   } else {
        //     // ?leave?absent
        //     if (schedule.leave_id) {
        //       this.tag = {
        //         type: "warning",
        //         effect: "",
        //         label: "LEAVE"
        //       };
        //     } else {
        //       if (schedule.remarks == "NCNS") {
        //         this.tag = colors["ncns"]
        //       } else {
        //         this.tag = {
        //           type: "info",
        //           effect: "dark",
        //           label: "ABSENT"
        //         };
        //       }
        //     }
        //   }
        // } else {
        //   this.tag = {
        //     type: "",
        //     effect: "",
        //     label: "WORK"
        //   };
        // }

        // if active
        if(this.info.status == "active"){
          this.tag = tag[schedule.remarks.toLowerCase()]
        }else{
          let hired_date = moment(moment(this.info.hired_date).startOf("day")).format("YYYY-MM-DD HH:mm:ss"),
          separation_date = moment(moment(this.info.separation_date).endOf("day")).format("YYYY-MM-DD HH:mm:ss"),
          now = moment(moment(this.date).startOf("day")).format("YYYY-MM-DD HH:mm:ss");
          if(moment(now).isBetween(hired_date,separation_date)){
            this.tag = tag[schedule.remarks.toLowerCase()]
          }
        }

      } else {
        // no schedule
        this.with_schedule = false;
        if(this.info.status == "active"){
          this.tag = tag["off"]
        }else{
          let hired_date = moment(moment(this.info.hired_date).startOf("day")).format("YYYY-MM-DD HH:mm:ss"),
          separation_date = moment(moment(this.info.separation_date).endOf("day")).format("YYYY-MM-DD HH:mm:ss"),
          now = moment(moment(this.date).startOf("day")).format("YYYY-MM-DD HH:mm:ss");
          if(!moment(now).isBetween(hired_date,separation_date)){
            this.tag = tag['inactive'];
          }else{
            this.tag = tag['off'];
          }
        }

      }
    }
  }
};
</script>

<style lang="scss" scoped>
.fs-12px {
  font-size: 12px;
}
.c-grey {
  color: grey;
}
.c-success {
  color: #13ce91;
}
</style>
