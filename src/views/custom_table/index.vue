<template>
 <el-table
    v-loading="employeeFetchState.initial"
    :data="tableData"
    style="width: 100%;"
    class="monday"
    @sort-change="columnSort"
  >
    <!-- <el-table-column type="selection" width="55" fixed /> -->
    <el-table-column label="CNM ID" fixed>
      <template slot-scope="{row}">
        <span class>{{ row.company_id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Employee" min-width="500" fixed sortable="custom" prop="full_name">
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
            <el-tag :type="scope.row.status.toLowerCase()=='active'?'success':'danger'">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ scope.row.full_name }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'edit:'+scope.row.id">Update</el-dropdown-item>
                  <el-dropdown-item :command="'preview:'+scope.row.id">View Profile</el-dropdown-item>
                  <el-dropdown-item :command="'resetPass:'+scope.row.id">Reset Password</el-dropdown-item>
                  <!-- <el-dropdown-item>Delete</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </el-tag>
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Position" width="200" sortable="custom" prop="position">
      <template slot-scope="{row}">
        <span class>{{ row.position }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Head" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.head_name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Email" width="200" sortable="custom" prop="email">
      <template slot-scope="{row}">
        <span class>{{ row.email }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.status.toUpperCase() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="type" width="200">
      <template slot-scope="{row}">
        <el-tag
          :type="row.status.toLowerCase()=='active'?'success':'danger'"
        >{{ row.type != '' ? row.type.toUpperCase() : 'N/A' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Contract" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.contract }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Gender" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.gender }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Birthdate" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.birthdate }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Address" width="200" sortable="custom" prop="user_infos.address">
      <template slot-scope="{row}">
        <span class>{{ row.address }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Hired Date" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.hired_date }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Separation Date" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.separation_date }}</span>
      </template>
    </el-table-column>-->
    <el-table-column label="SSS #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits.length>0 ?row.benefits[0].id_number:"" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Philhealth #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits.length>0 ?row.benefits[1].id_number:"" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="PagIbig #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits.length>0 ?row.benefits[2].id_number:"" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="TIN #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits.length>0 ?row.benefits[3].id_number:"" }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default{
    name:"custom-table-component",
    data(){
        return{

        }
    }
}
</script>



<style scoped>
.user-block >>> .img-circle {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.monday >>> td > .user-block >>> div > img {
  padding: 0px;
  margin: 0px;
}

.monday >>> th {
  background-color: white !important;
  border-top: none;
  border-right: none;
  border-left: none;
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
</style>