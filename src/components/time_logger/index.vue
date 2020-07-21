<template>
    <div>
        <template>
            <!-- schedule board -->
            <div :style="'padding:10px; background-color:'+board.color+';color:white;border-left:4px solid '+adjustColorTone(board.color, -40)">
                <div style="width:100%;display:flex;justify-content:space-between">
                    <div>
                        <div style="font-weight:700">{{board.title}}</div>
                        <div style="font-weight:light;font-size:0.75em;padding-top:3px;">{{board.sub}}</div>
                        <div style="font-weight:light;font-size:0.75em;padding-top:3px;"><small>{{board.small_sub}}</small></div>
                    </div>
                    <template v-if="board.button">
                        <div>
                            <!-- <template v-if="schedule.vto_at===null"> -->
                                <template v-if="board.button == 'start'">
                                    <el-button round type="success" size="small" @click="startWork()" :disabled="button.start">Start Work</el-button>
                                </template>
                                <template v-if="board.button == 'join_ot'">
                                    <el-button round type="warning" size="small" :disabled="button.join" @click="joinOt()" :loading="joinOvertimeScheduleState.initial">Join OT</el-button>
                                </template>
                                <template v-if="board.button == 'end'">
                                    <el-button round type="primary" size="small" @click="endWork()" :disabled="button.end">End Work</el-button>
                                </template>
                            <!-- </template> -->
                            <!-- <template v-else>
                                    <el-button round type="success" size="small" :disabled="true">Start Work</el-button>
                            </template> -->
                        </div>
                    </template>
                </div>
            </div>
            <!-- actual logs -->
            <template v-if="schedule">
                <template v-if="schedule.attendances.length != 0 ">
                    <div style="padding-left:10px;padding-right:10px;margin-bottom:5px">
                        <div style="background-color:#dc143c;border-radius:8px;color:white;margin-top:5px;">
                            <div style="display:flex;">
                                <div style="font-size:3em;padding:7px;background-color:#e7385b;border-radius:7px;">
                                    <i class="el-icon-stopwatch" />
                                </div>
                                <div style="padding-left:10px;padding-right:10px;width:100%;display:flex">
                                    <div style="align-self:center">
                                        <div style="font-size:.9em;">Actual Logs</div>
                                        <div style='font-size:1.2em;font-weight:700'>
                                            <span>
                                                {{ schedule.attendances[0].time_in? formatDate(schedule.attendances[0].time_in.date,"yyyy-mm-dd HH:mm:ss", "hh:mm a").toUpperCase().replace(" ",""): "--:----"}}
                                            </span>
                                                {{ " - " }}
                                            <span>
                                                {{ schedule.attendances[0].time_out? formatDate(schedule.attendances[0].time_out.date7hbh73,"yyyy-mm-dd HH:mm:ss", "hh:mm a").toUpperCase().replace(" ",""): "--:----"}}
                                            </span>
                                        </div>
                                        <div style="font-size:.63em">0 NIGHT DIFFERENCE</div>
                                    </div>
                                </div>
                            </div>
                            <div style="position:relative;">
                                <div style="position:absolute;bottom:0px;right:0px;text-align:right;">
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </template>
    </div>
</template>

<script>
import moment from "moment";
import {mapActions, mapGetters}  from "vuex";
export default {
    name: "ScheduleBoard",
    props:["refresh"],
    computed: {
        ...mapGetters([
        "user_id",
        "todaysWork",
        "todaysWorkfetchState",
        "agentStartWorkfetchState",
        "agentStartWorkData",
        "agentEndWorkfetchState",
        "agentEndWorkData",
        "fetchTodaysOvertimeScheduleState",
        "fetchTodaysOvertimeScheduleData",
        "fetchTodaysOvertimeScheduleError",
        "joinOvertimeScheduleState",
        "joinOvertimeScheduleData",
        "joinOvertimeScheduleError",
        "agentTimeInState",
        "agentTimeInData",
        "agentTimeInTitle",
        "agentTimeOutState",
        "agentTimeOutData",
        "agentTimeOutTitle",
        "fetchTodaysScheduleState",
        "fetchTodaysScheduleData",
        "fetchTodaysScheduleTitle"
        ]),
    },
    watch:{
        joinOvertimeScheduleState({initial,success,fail}){
            if(success){
                this.fetchTodaysSchedule({userid:this.user_id})
            }
            if(fail){
                this.fetchTodaysSchedule({userid:this.user_id})
            }
        },
        agentTimeOutState({ initial, success, fail }) {
            if (success) {
                this.fetchTodaysSchedule({userid:this.user_id});
                this.$message({
                    type: "success",
                    message: this.agentTimeOutTitle,
                    duration: 5000
                });
            }
            if (fail) {
                this.fetchTodaysSchedule({userid:this.user_id});
                this.$message({
                    type: "error",
                    message: this.agentTimeOutTitle,
                    duration: 10000
                });
            }
        },
        agentTimeInState({ initial, success, fail }) {
            if (initial) {
                this.button.start = true;
            }
            if (success) {
                this.$message({
                    type: "success",
                    message: this.agentTimeInTitle,
                    duration: 5000
                });
                this.fetchTodaysSchedule({userid:this.user_id});
            }
            if (fail) {
                this.button.start = false;
                this.$message({
                    type: "error",
                    message: this.agentTimeInTitle,
                    duration: 5000
                });
                if (
                    this.agentTimeInTitle.toLowerCase() == "schedule no longer available."
                ) {
                    this.fetchTodaysSchedule({userid:this.user_id});
                }
            }
        },
        fetchTodaysScheduleState({initial,success,fail}){
            if(initial){
                this.board.title = "SCHEDULE";
                this.board.sub = "Loading...";
                this.board.color = "#800080";
                this.board.button = null;
                this.board.small_sub = null;
                this.board.log = false;
                this.schedule = null;
                this.ot_schedule = null;
            }
            if (fail) {
                this.board.title = "FAILED";
                this.board.sub = "Please reload page.";
                this.board.color = "red";
                this.board.small_sub = null;
                this.board.button = null;
                this.board.log = false;
            }
            if (success) {
                this.schedule = this.fetchTodaysScheduleData.schedule;
                this.ot_schedule = this.fetchTodaysScheduleData.ot_schedule;
                this.leave = this.fetchTodaysScheduleData.leave;
                this.evaluateSchedule();
            }
        },
        refresh(v){
            this.fetchTodaysSchedule({userid:this.user_id});
        }
    },
    data(){
        return {
            schedule:null,
            ot_schedule:null,
            leave:null,
            button:{
                start:false,
                end:false,
                join:false,
            },
            board:{
                title:null,
                sub:null,
                button:null,
                color:null,
                log:null,
                small_sub:null
            }
        }
    },
    mounted() {
        this.fetchTodaysSchedule({userid:this.user_id});
    },
    methods:{
        ...mapActions([
        "fetchAgentsTodayWork",
        "agentStartWork",
        "agentEndWork",
        "fetchTodaysOvertimeSchedule",
        "joinOvertimeSchedule",
        "agentTimeIn",
        "agentTimeOut",
        "fetchTodaysSchedule"
        ]),
        evaluateSchedule(){
            // 
            if(!this.leave){
                if(this.schedule==null){
                    this.board.title = "OFF";
                    this.board.sub = "NO SCHEDULE";
                    this.board.color = "#858585";
                    this.board.button = null;
                    this.board.log = false;
                }else{
                    if(this.schedule.title_id==1){
                            this.board.title = "Regular Work";
                            this.board.color = "#dc143c";
                            this.board.small_sub = this.formatDate(this.schedule.date.ymd,"","ddd, MMM. DD, YYYY");
                            this.board.sub = this.formatDate(this.schedule.start_event.date,"yyyy-mm-dd HH:mm:ss","hh:mm a").replace(" ","").toUpperCase()
                            +" - "+this.formatDate(this.schedule.end_event.date,"yyyy-mm-dd HH:mm:ss","hh:mm a").replace(" ","").toUpperCase();
                        if(schedule.vto_at === null){
                            this.button.start = false;
                        }else{
                            this.button.start = true;
                        }
                    }else{
                        this.board.title = "Overtime";
                        this.board.color = "#938af1";
                        this.board.small_sub = this.formatDate(this.schedule.date.ymd,"","ddd, MMM. DD, YYYY");
                        this.board.sub = this.formatDate(this.schedule.start_event.date,"yyyy-mm-dd HH:mm:ss","hh:mm a").replace(" ","").toUpperCase()
                        +" - "+this.formatDate(this.schedule.end_event.date,"yyyy-mm-dd HH:mm:ss","hh:mm a").replace(" ","").toUpperCase();
                    }

                    if(this.schedule.attendances.length<1){
                        this.board.button = "start";
                    }else{
                        if(this.schedule.attendances[0].time_out==null){
                            this.board.button = "end";
                        }else{
                            this.board.button = null;
                        }
                    }
                }

                if(this.ot_schedule){
                    this.board.title = "Overtime";
                    this.board.sub = this.formatDate(this.ot_schedule.start_event,"yyyy-mm-dd HH:mm:ss","hh:mm a").replace(" ","").toUpperCase()
                            +" - "+this.formatDate(this.ot_schedule.end_event,"yyyy-mm-dd HH:mm:ss","hh:mm a").replace(" ","").toUpperCase();
                    this.board.small_sub = this.formatDate(this.ot_schedule.date.ymd,"","ddd, MMM. DD, YYYY");
                    this.board.color = "#938af1";
                    this.board.button = "join_ot";
                    this.board.log = false;
                }
            }else{
                this.board.title = "ON-LEAVE";
                this.board.sub = this.schedule.leave.leave_type.toUpperCase();
                this.board.color = "#ffa500";
                this.board.button = null;
                this.board.log = false;
            }
            
        },
        startWork(){
            if(confirm("Confirmation: Do you want to proceed?")){
                const data = {
                    schedule_id: this.schedule.id
                }
                this.agentTimeIn(data);
            }
        },
        endWork() {
            if (confirm("Confirmation: Do you want to proceed?")) {
                // log timeout
                const data = {
                attendance_id: this.schedule.attendances
                    .slice(-1)
                    .pop().id
                };
                this.agentTimeOut(data);
            }
        },
        joinOt(){
            this.joinOvertimeSchedule();
        }
    }
}
</script>
