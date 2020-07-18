<template>
    <div>
        <div style="font-size:1.5em;font-weight:500">Schedules</div>
        <div class="w-100 mt-20">
            <el-tabs v-model="tabs.active" type="card">
                <el-tab-pane label="Daily" name="daily"></el-tab-pane>
                <el-tab-pane label="Weekly" name="weekly"></el-tab-pane>
            </el-tabs>
        </div>
        <div>
            <el-row>
                <el-col :md="{span:6}">
                    <div style="cursor:pointer;border-radius:25px;" class="px-15 py-3 hover-eee">
                        <div style="display:flex;justify-content:space-between">
                            <div style="display:flex;">
                                <div>
                                    <i class="el-icon-date" style="" />
                                </div>
                                <div style="display:flex;widht:auto !important;" class="ml-5">
                                    <div style="align-self:center">
                                        <div style="width:100%;font-weight:700;font-size:1.5">
                                            MONDAY
                                        </div>
                                        <div style="width:100%;color:gray;font-size:.7em">
                                            JAN. 01, 2020
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex">
                                <div style="align-self:center" >
                                    <i class="el-icon-arrow-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :md="{span:6}" style="background-color:red">
                    <div style="float:right">
                        <div style="display:flex;">
                            <div style="height:40px;width:40px;border-radius:50%;display:flex;justify-content:center" class="hover-eee mr-5">
                                <div style="align-self:center;font-weight:bold;font-size:1.2em">
                                    <svg-icon icon-class="search" />
                                </div>
                            </div>
                            
                            <div style="height:40px;width:40px;border-radius:50%;display:flex;justify-content:center" class="hover-eee">
                                <div style="align-self:center;font-weight:bold;font-size:1.2em">
                                    <i class="el-icon-search"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name:"attendanceTable",
    data(){
        return{
            tabs:{
                active: "daily"
            },
            table_data:[
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                }
            ]
        }
    }
}
</script>

<style scoped>
.bg-primary{
    background-color:cornflowerblue;
}

.bg-success{
    background-color:forestgreen;
    color:white;
    font-weight:600;
}

.bg-warning{
    background-color:sandybrown;
    color:white
}


.bg-danger{
    background-color:tomato;
}



.badge{
    width:100%;
    text-align:center;
    border-radius:4px;
}

.el-table__row{
    padding:0 !important;
}


.monday >>> td > .user-block >>> div > img {
  padding: 0px;
  margin: 0px;
}

.monday >>> th {
  background-color: white !important;
  font-size:.8em;
  padding:7px;
  padding-bottom:3px;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom:none;
}

.monday >>> th >>> .cell {
  font-weight: light !important;
}
.monday >>> td:first-child {
  border-left:5px solid crimson;
}
.monday >>> .el-table__row tr {
  background-color: #efefef;
  border-left: white solid 1px;
  border-bottom: white solid 1px;
  padding: 0px;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.monday >>> td {
  background-color: #efefef;
  border: white solid 1px;
  padding: 0px;
}
.monday >>> .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.monday >>> td {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

th >>> .cell {
  font-weight: normal !important;
  font-size:.8em !important;
}

.monday >>> td .cell{
    min-height:30px;
    height:60px;
    max-height:100px;
    border-radius:8px;
}

.monday >>> td{
    border-radius:8px;
}
.c-white{
    color:white;
}

.fw-700{
    font-weight:700;
}

.d-flex{
    display:flex;
}

.text-center{
    text-align:center;
}


</style>