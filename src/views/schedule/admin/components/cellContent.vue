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
                style="width:100%;text-align:center"
                size="mini"
              >{{ schedule.user_info.full_name }}</el-tag>
            </el-col>
            <el-col>
              <h5 style="margin-bottom:1px;margin-top:8px;">OM</h5>
            </el-col>
            <el-col style="text-align:center">
              <div class="c-grey" style="font-size:0.8em">{{schedule.om.lastname+", "+schedule.om.firstname[0]}}</div>
            </el-col>
            <el-col>
              <h5 style="margin-bottom:1px;margin-top:8px;">TL</h5>
            </el-col>
            <el-col style="text-align:center">
              <div class="c-grey" style="font-size:0.8em">{{schedule.tl.lastname+", "+schedule.tl.firstname[0]}}</div>
            </el-col>
            <el-col>
              <h5 style="margin-bottom:5px;margin-top:8px;">Schedule</h5>
            </el-col>
            <el-col style="text-align:center">
              <div class="c-grey">{{ formatDate(popup.data.schedule.in,"YYYY-MM-DD HH:mm:ss","MMM Do, YYYY hh:mm a") }}</div>
              <div class="c-grey">{{ formatDate(popup.data.schedule.out,"YYYY-MM-DD HH:mm:ss","MMM Do, YYYY hh:mm a") }}</div>
            </el-col>
            <template v-if="tag.label!='UPCOMING'">
              <el-col>
                <h5 style="margin-bottom:5px;margin-top:8px;">Attendance</h5>
              </el-col>
              <el-col style="text-align:center">
                <template v-if="schedule.time_in">
                  <div class="c-success">{{ formatDate(schedule.time_in.date,"","MMM Do, YYYY hh:mm a") }}</div>
                </template>
                <template v-else>
                  <div class="c-grey">
                    <small>
                      <i>NO DATA</i>
                    </small>
                  </div>
                </template>
                <template v-if="schedule.time_out">
                  <div class="c-success">{{ formatDate(schedule.time_out.date,"","MMM Do, YYYY hh:mm a") }}</div>
                </template>
                <template v-else>
                  <div class="c-grey">
                    <small>
                      <i>NO DATA</i>
                    </small>
                  </div>
                </template>
              </el-col>
              <template v-if="tag.label=='PRESENT'" >
                <template v-if="!schedule.attendances[0].time_out">
                <el-col style="margin-top:5px;">
                  <el-button size="mini" type="danger" style="width:100%" @click="form.rtaTimeOut.show=true">Define Timeout</el-button>
                </el-col>
                </template>
                <template v-if="schedule.attendances[0].time_out_by">
                <el-col style="margin-top:5px;">
                  <el-button size="mini" type="danger" :plain="true" style="width:100%" @click="rtaClearTimeOut()">Clear Timeout</el-button>
                </el-col>
                </template>
              </template>
            </template>
            <template v-if="tag.label == 'PRESENT'">
              <el-col>
                <h5 style="margin-bottom:5px;margin-top:8px;">Voluntary Time Out</h5>
              </el-col>
              <el-col style="text-align:center">
                <template v-if="schedule.vto_at">
                  <span>{{ (schedule.vto_hours.second/60/60) + " hours" }}</span>
                </template>
                <template v-else>
                  <span>NONE</span>
                </template>
                <!-- <el-tag
                  v-if="schedule.vto_at"
                  effect="dark"
                  style="width:100%;text-align:center
                "
                ></el-tag>
                <el-tag v-else style="width:100%;text-align:center
                ">ADD VTO</el-tag> -->
              </el-col>
            </template>
                <el-col>
                <h5 style="margin-bottom:5px;margin-top:8px;">Conformance</h5>
                <el-progress :percentage="schedule.conformance" :text-inside="true" :stroke-width="18"></el-progress>
              </el-col>
          </el-row>
          <template v-if="isRTA()">
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
              <el-col v-if="tag.bc=='#E6A23C' && schedule.leave.leave_type!='loa1' && schedule.leave.leave_type!='loa2'" style="margin-top:5px;">
                <el-button size="mini" type="danger" style="width:100%" @click="cancelSickLeave">CANCEL LEAVE</el-button>
              </el-col>
              <el-col v-if="tag.label=='UPCOMING'" style="margin-top:5px;">
                <el-button size="mini" type="info" effect="dark" style="width:100%" @click="deleteSchedule">DELETE SCHEDULE</el-button>
              </el-col>
              <el-col v-if="tag.label=='PRESENT' && schedule.time_out!=null" style="margin-top:5px;">
                <el-button size="mini" type="warning" style="width:100%" @click="tagPartialSick">TAG PARTIAL SICK LEAVE</el-button>
              </el-col>
            </el-row>
          </template>
        </el-col>
      </el-row>
      <!-- <el-tag slot="reference" :type="tag.type" :effect="tag.effect">{{ tag.label }}</el-tag> -->
      <span slot="reference" style="width:100%;padding:0px;margin:0px;cursor:pointer">
        <span :style="'padding:3px;font-size:.85em;background-color:'+ (popup.data.schedule.type == 1? 'blue':'purple') +';color:white'">{{ popup.data.schedule.type == 1 ? "REG":"OT" }}
        </span>
        <span  :style="'padding:3px;font-size:.85em;background-color:'+tag.bc+';color:'+tag.fc">
          <span>{{ tag.label }}</span>
        </span>
        <!-- <span  v-if="tag.label == 'PRESENT' && popup.data.schedule.type == 1 && popup.data.schedule.vto==true" style="padding:3px;font-size:.85em;background-color:indigo;color:white">V</span> -->
      </span>
    </el-popover>
    <!-- <span v-if="!schedule" :style="'padding:3px;font-size:.85em;background-color:#EBEEF5;color:#909399'">OFF</span> -->
<!-- Create and Update Dialog -->
      <el-dialog
        :visible.sync="form.rtaTimeOut.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :title="Object.keys(schedule).length > 0 ? 'Define timeout for ' + schedule.user_info.full_name:'' "
        width="30%"
        top="5vh"
      >
        <el-row>
          <el-col>
            <label style="float:left">Timeout <small>{{Object.keys(schedule).length > 0 ? "("+formatDate(popup.data.schedule.in,"YYYY-MM-DD HH:mm:ss","MMM Do, YYYY hh:mm a") + " to "+ formatDate(popup.data.schedule.out,"YYYY-MM-DD HH:mm:ss","MMM Do, YYYY hh:mm a")+")":''}}</small></label>
            <el-date-picker
              v-model="form.rtaTimeOut.model.time_out"
              size="mini"
              type="datetime"
              style="width:100%;padding-bottom:2px;margin-bottom:10px;"
              class="form-input"
              placeholder="Set Timeout..."
            />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="form.rtaTimeOut.show=false">Cancel</el-button>
          <el-button type="danger" :loading="agentTimeOut.initial" size="mini" @click="rtaTimeOut">Confirm</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script>
import moment from "moment";
import {mapActions, mapGetters } from "vuex";

const tag  = {
  "present":{
    bc:"#67C23A",fc:"white",label:"PRESENT"
  },
  "off":{
    bc:"#EBEEF5",fc:"#909399",label:"OFF"
  },
  "upcoming":{
    bc:"#0072ff",fc:"white",label:"UPCOMING"
  },
  "ncns":{
    bc:"#F56C6C",fc:"white",label:"NCNS"
  },
  "absent":{
    bc:"#909399",fc:"white",label:"ABSENT"
  },
  "inactive":{
    bc:"rgb(143, 2, 2)",fc:"white",label:"INACTIVE"
  }
}
const leave_label = {
  "vacation_leave":"vacation",
  "sick_leave":"sick",
  "leave_of_absence":"LOA",
  "maternity_leave":"maternity",
  "paternity_leave":"paternity",
  "bereavement_leave":"bereavement",
  "solo_parent_leave":"solo parent",
  "vawc":"vawc",
  "magna_carta_leave":"magna carta",
  "loa1":"LOA1(sick)",
  "loa2":"LOA2(vacation)",
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
        },
        rtaTimeOut:{
          show:false,
          btn_loader:false,
          model:{
            time_out:null
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
    ...mapGetters(["user_id","cancelLeaveState","cancelLeaveData","cancelLeaveError","position","agentTimeOutState"])
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
    ...mapActions(["updateSchedule","createLeave","cancelLeave","deleteSingleSchedule","agentTimeOut","removeTimeOut"]),
    rtaClearTimeOut(){
      let data ={
        attendance_id: this.schedule.attendances[0].id,
      }
      if(confirm("Are you sure you want to proceed?")){
        this.removeTimeOut(data);
      }
    },
    rtaTimeOut(){
      // open modal
      let data ={
        attendance_id: this.schedule.attendances[0].id,
        time_out: this.form.rtaTimeOut.model.time_out
      }
      console.log(data)
      if(confirm("Are you sure you want to proceed?")){
        this.form.rtaTimeOut.show=false;
        this.agentTimeOut(data);
      }
    },
    deleteSchedule(){
      if(confirm("Are you sure you want to delete this schedule?")){
        this.deleteSingleSchedule({id:this.schedule.id})
      }
    },
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
    tagPartialSick(){
      const data = {
        schedule_id: this.schedule.id,
        leave_type: "partial_sick_leave",
        status: "approved",
        generated_by: this.user_id,
      };
      if(confirm("There are no revert functions for this action. Are you sure you want to proceed?")){
        this.createLeave(data);
      }
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
      console.log(schedule)

      if (schedule) {
        this.with_schedule = true;
        this.popup.data.schedule = {
          in: schedule.start_event.date,
          out: schedule.end_event.date,
          type: schedule.title_id,
          // vto: schedule.vto_at
          vto: true
        };

        this.form.rtaTimeOut.model.time_out = moment(this.popup.data.schedule.out).format("YYYY-MM-DD HH:mm:ss");

        if(schedule.user_status.status == "active"){
          if(schedule.remarks.toLowerCase()=="on-leave" && schedule.leave.status=="approved"){
            this.tag.label = leave_label[schedule.leave.leave_type].toUpperCase()
            this.tag.bc ="#E6A23C"
            this.tag.fc ="white"
          }else if(schedule.remarks.toLowerCase()=="present"){
            this.tag = tag[schedule.remarks.toLowerCase()]
            if(schedule.time_out){
              if(schedule.attendances[0].time_out_by){
                this.tag.fc = "teal";
              }else{
                this.tag.fc = "white";
              }
            }else{
              this.tag.fc = "red";
            }
          }else{
              this.tag = tag[schedule.remarks.toLowerCase()]
          }
        }else{
              this.tag = tag["inactive"];
              this.tag.label = schedule.user_status.type.toUpperCase()
        }

      }else{
        this.with_schedule = false;
      }
    },
    isRTA(){
      if(this.position.toLowerCase() == "rta manager" || this.position.toLowerCase() == "rta supervisor" || this.position.toLowerCase() == "rta analyst"){
        return true;
      }else{
        return false;
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
.something{
  color:rgb(143, 2, 2);
}
</style>
