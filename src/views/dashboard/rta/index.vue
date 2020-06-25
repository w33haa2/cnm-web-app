<template>
    <div style="width:100%" class="app-container">
        <el-row :gutter="20">
            <el-col :md="{span:8}" style="margin-top:20px;">
                <el-card cutom-class="card">
                    <el-row>
                        <el-col>
                            <div style="width:100%;display:flex;justify-content:space-between">
                                <div style="font-weight:700">
                                    Attendance
                                </div>
                                <div style="font-size:.7em;font-weight:600;padding:5px 10px 5px 10px;background-color:crimson;border-radius:25px;color:white;cursor:pointer">
                                    <small>EXPAND</small>
                                </div>
                            </div>
                        </el-col>
                        <el-col>
                            <div style="width:100%;padding:20px;">
                                <div  class="pt-20 d-flex" style="justify-content:center">
                                    <div style="align-self:center">
                                        <vc-donut :thickness="20" :sections="donut_graph.sections">
                                            <div style="font-size:2em">
                                                <i class="el-icon-s-data" />
                                            </div>
                                            <div style="font-size:2em;font-weight:700">
                                                {{ donut_graph.total }}
                                            </div>
                                            <div style="font-size:.7em;font-weight:600;color:gray">POPULATION</div>
                                        </vc-donut>
                                    </div>
                                </div>
                            </div>
                            <el-row>
                                <template v-for="(item,index) in donut_graph.sections">
                                    <el-col :md="{span:12}" style="margin-top:20px;" class="px-2" :key="index">
                                        <donut-label :data="item"></donut-label>
                                    </el-col>
                                </template>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :md="{span:16}" style="margin-top:20px;">
                <el-card>
                    <div style="width:100%;display:flex;justify-content:space-between">
                        <div style="font-weight:700">
                            Attendance History
                        </div>
                        <div style="font-size:.7em;font-weight:600;padding:5px 10px 5px 10px;background-color:crimson;border-radius:25px;color:white;cursor:pointer">
                            <small>EXPAND</small>
                        </div>
                    </div>
                    <div style="width:100%;padding:10px">
                        <attendance-history height="462px"></attendance-history>
                    </div>
                </el-card>
            </el-col>
            <el-col :md="{span:24}">
                <div style="margin-top:10px;justify-content:space-between;display:flex;width:100%">
                    <div style="font-weight:700">
                    Today
                    </div>
                    <div style="font-size:.7em;font-weight:600;padding:5px 10px 5px 10px;background-color:crimson;border-radius:25px;color:white;cursor:pointer">
                        <small>EXPAND</small>
                    </div>
                </div>
                <div style="margin-top:15px">
                    <el-select style="border-radius:25px;" v-model="option.table_select">
                        <template  v-for="(datum,index) in table_options">
                            <el-option :key="index" :value="datum.value" :label="datum.text"></el-option>
                        </template>
                    </el-select>
                </div>
                <div style="width:100%;margin-top:15px;">
                    <attendance-table></attendance-table>
                </div>
            </el-col>
            <el-col :md="{span:8}">
                <subordinates />
            </el-col>
        </el-row>
        <time-logger></time-logger>
    </div>
</template>

<script>
import progressCard from "./components/progress_card";
import attendanceTable from "./components/attendance_table";
import attendanceHistory from "./components/attendance_history";
import Calendar from "./components/calendar";
import timeLogger from "@/components/right_side_bar";
import subordinates from "./components/subordinates";
import donutLabel from "./components/donut_label";

export default {
    name: "RTADashboard",
    components:{progressCard, attendanceTable, attendanceHistory, Calendar,timeLogger, subordinates,donutLabel},
    data(){
        return {
            drawer:true,
            option:{
                table_select:1,
            },
            donut_graph:{
                thickness:20,
                total: "4,018",
                sections:[
                    {label: "Scheduled",value:15,color:"#409EFF", count:"627"},
                    {label: "Working",value:15,color:"#67C23A", count:"2644"},
                    {label: "Onleave",value:25,color:"#E6A23C", count:"50"},
                    {label: "NCNS",value:20,color:"#F56C6C", count:"102"},
                    {label: "OFF",value:25,color:"#909399", count:"595"},
                ]
            },
            table_options:[
                {value:1,text:"WORKING"},
                {value:2,text:"ONLEAVE"},
                {value:3,text:"ABSENT"},
            ],
            progress_card:[
                {
                    label:"WORKING",
                    count: 200,
                    percent: 20,
                    icon:"calendar",
                    progress_status:"success"
                },
                {
                    label:"ABSENT",
                    count: 200,
                    percent: 20,
                    icon:"calendar",
                    progress_status:"exception"
                },
                {
                    label:"ONLEAVE",
                    count: 200,
                    percent: 20,
                    icon:"calendar",
                    progress_status:"warning"
                }
            ]
        }
    },
}
</script>

<style>

h1,h2,h3,h4,h5,h6{
    padding:0;
    margin:0;
}


.el-card__body{
    cursor:pointer;
    box-shadow: 0 4px 25px 0 rgba(0,0,0,.1);
}


.cdc-legend-item{
    font-size:.75em
}

.coral .el-select input.el-input__inner{
    border-radius:25px;
    background-color:coral;
    color:white;
    font-weight:700;
}
.el-select__caret.el-input__icon.el-icon-arrow-up{
    color:white;
}

.el-select-dropdown__item{
    font-weight:700;
}

.is-hover-shadow.active{
    border:none !important;
    background-color:#ccc;
}

.shadow-f5 {
    box-shadow:
}
</style>