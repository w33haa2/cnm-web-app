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
              <div class="c-grey">{{ formatDate(popup.data.schedule.in,"YYYY-MM-DD HH:mm:ss","MMM Do, YYYY hh:mm a") }}</div>
              <div class="c-grey">{{ formatDate(popup.data.schedule.out,"YYYY-MM-DD HH:mm:ss","MMM Do, YYYY hh:mm a") }}</div>
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
              <el-button size="mini" type="danger" style="width:100%" @click="tagStatus(0)">TAG NCNS</el-button>
            </el-col>
            <el-col v-if="tag.label=='NCNS'" style="margin-top:5px;">
              <el-button size="mini" type="info" style="width:100%" @click="tagStatus(1)">TAG ABSENT</el-button>
            </el-col>
            <el-col v-if="tag.label=='NCNS' || tag.label=='ABSENT'" style="margin-top:5px;">
              <el-button size="mini" type="warning" style="width:100%" @click="tagSick">TAG SICK LEAVE</el-button>
            </el-col>
            <el-col v-if="tag.bc=='#E6A23C'" style="margin-top:5px;">
              <el-button size="mini" type="danger" style="width:100%" @click="cancelSickLeave">CANCEL LEAVE</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- <el-tag slot="reference" :type="tag.type" :effect="tag.effect">{{ tag.label }}</el-tag> -->
      <span slot="reference" style="width:100%;padding:0px;margin:0px">
        <span :style="'padding:3px;font-size:.85em;background-color:'+ (popup.data.schedule.type == 1? 'blue':'purple') +';color:white'">{{ popup.data.schedule.type == 1 ? "REG":"OT" }}
        </span>
        <span  :style="'padding:3px;font-size:.85em;background-color:'+tag.bc+';color:'+tag.fc">
          <span>{{ tag.label }}</span>
        </span>
        <span  v-if="tag.label == 'PRESENT' && popup.data.schedule.type == 1 && popup.data.schedule.vto==true" style="padding:3px;font-size:.85em;background-color:indigo;color:white">V</span>
      </span>
    </el-popover>
    <span v-else :style="'padding:3px;font-size:.85em;background-color:#EBEEF5;color:#909399'">OFF</span>
<!-- Create and Update Dialog -->
      <!-- <el-dialog
        :visible.sync="form.cancelLeave.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="Add Leave"
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col>
            <label for="dates">Cancel Date</label>
            <el-date-picker
              v-model="form.cancelLeave.model.cancel_event"
              size="mini"
              type="date"
              format="yyyy-MM-DD"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              class="form-input"
              placeholder="Range picker..."
            />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="form.cancelLeave.show=false">Cancel</el-button>
          <el-button type="danger" :loading="cancelLeaveState.initial" size="mini" @click="cancelSickLeave">Confirm</el-button>
        </span>
      </el-dialog> -->

    <!-- <el-tag v-else :type="tag.type" :effect="tag.effect">{{ tag.label }}</el-tag> -->
  </div>
</template>

<script>
import moment from "moment";
import {mapActions, mapGetters } from "vuex";

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
  "upcoming":{
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
      form:{
        cancelLeave:{
          show:false,
          model:{
            id:null,
            cancel_event:null
          }
        }
      },
      with_schedule: false,
      tag: {
        bc:null,fc:null
      },

      popup: {
        width: 0,
        data: {
          schedule: {
            in: null,
            out: null,
            type: null,
            vto: true
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
          }
        }
      }
    };
  },
  computed:{
    ...mapGetters(["user_id","cancelLeaveState","cancelLeaveData","cancelLeaveError"])
  },
  watch: {
    schedule(v) {
      this.tag={}
      this.evaluateSchedule();
    },
  },
  mounted() {
    this.evaluateSchedule();
  },
  methods: {
    ...mapActions(["updateSchedule","createLeave","cancelLeave"]),
    tagSick(){
      const data = {
        user_id: this.schedule.user_id,
        start_event: moment(this.schedule.start_event.date).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        end_event: moment(this.schedule.end_event.date).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        leave_type: "sick_leave",
        status: "approved",
        generated_by: this.user_id,
        allowed_access: 12
      };
    this.createLeave(data);
    },
    tagStatus(remarks){
      let data = {
        id:this.schedule.id,
        user_id: this.schedule.user_id,
        title_id: this.schedule.title_id,
        start_event: moment(this.schedule.start_event.date).format("YYYY-MM-DD HH:mm:ss"),
        end_event: moment(this.schedule.end_event.date).format("YYYY-MM-DD HH:mm:ss"),
        remarks:remarks
        };
      this.updateSchedule(data)
    },
    // cancelLeaveForm(){
    //   alert(this.schedule.leave_id)
    //   this.form.cancelLeave.model.id = this.schedule.leave_id
    //   this.form.cancelLeave.show = true;
    // },
    cancelSickLeave(){
      let data = {
        id: this.schedule.leave_id,
        cancel_event: moment(this.date).format("YYYY-MM-DD")
      }
      this.cancelLeave(data);
    },
    evaluateSchedule() {
      const schedule = this.schedule;
      // alert(this.schedule)
      if (Object.keys(schedule).length > 0) {
        this.with_schedule = true;
        this.popup.data.schedule = {
          in: schedule.start_event.date,
          out: schedule.end_event.date,
          type: schedule.title_id,
          // vto: schedule.vto_at
          vto: true
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
        if(schedule.user_status.status == "active"){
          if(schedule.remarks.toLowerCase()=="on-leave" && schedule.leave.status=="approved"){
            this.tag.label = schedule.leave.leave_type.toUpperCase()
            this.tag.bc ="#E6A23C"
            this.tag.fc ="white"
          }else{
            this.tag = tag[schedule.remarks.toLowerCase()]
          }
          if(moment(moment(schedule.start_event.date).format("YYYY-MM-DD")).isBefore(moment(this.date).format("YYYY-MM-DD"))){
            this.tag = tag["upcoming"]
          }
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
        // if(this.info.status == "active"){
        //   this.tag = tag["off"]
        // }else{
        //   let hired_date = moment(moment(this.info.hired_date).startOf("day")).format("YYYY-MM-DD HH:mm:ss"),
        //   separation_date = moment(moment(this.info.separation_date).endOf("day")).format("YYYY-MM-DD HH:mm:ss"),
        //   now = moment(moment(this.date).startOf("day")).format("YYYY-MM-DD HH:mm:ss");
        //   if(!moment(now).isBetween(hired_date,separation_date)){
        //     this.tag = tag['inactive'];
        //   }else{
        //     this.tag = tag['off'];
        //   }
        // }

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
