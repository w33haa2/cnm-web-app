<template>
    <div>
        <el-table :data="table_data" class="monday">
            <el-table-column label="SUBORDINATES">
                <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between;padding-left:12px;padding-right:12px;border-left:5px solid orange;height:60px">
                        <div style="align-self:center;font-size:.9em;">
                            <div style="font-weight:600;">{{scope.row.name}}</div>
                            <div style="color:gray">{{scope.row.email}}</div>
                        </div>
                        <div style="display:flex;height:60px;">
                            <div style="font-size:3em;align-self:center;font-weight:light;color:#red">
                                <i class="el-icon-chat-dot-round" />
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="60">
                <template slot-scope="scope">
                    <div style="width:100%;height:60px;justify-content:center" class="d-flex">
                        <div style="align-self:center">
                            <el-avatar icon="el-icon-user-solid" size="large" style="font-size:.8em;margin:0;padding:0">
                            </el-avatar>
                            <div class="status-badge status-online"></div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name:"attendanceTable",
    data(){
        return{
            table_data:[
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                    status: "online"
                    
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                    status: "online"
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                    status: "online"
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                    status: "online"
                },
                {
                    img:null,
                    name:"Emmanuel James Lajom",
                    email:"jeng@cnmsolutions.net",
                    position: "Admin",
                    head:"Maria Obsiana",
                    work_status: "is_working",
                    stamp: "10:00AM",
                    status: "online"
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
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
  /* border-left: 5px solid red !important; */
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
    border-radius:4px;
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

.status-badge{
    border-radius:50%;
    position:absolute;
    bottom:15px;
    right:12px;
    width:10px;
    height:10px;
    border:1px solid #eee;
}

</style>