<template>
  <el-table
    v-loading="employeeFetchState.initial"
    :data="tableData"
    style="width: 100%;"
    class="monday"
    @sort-change="columnSort"
  >
    <!-- <el-table-column type="selection" width="55" fixed /> -->
    <el-table-column label="CNM ID" fixed class="">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center;height:100%">{{ row.company_id }}</div>
      </template>
    </el-table-column>
    <el-table-column align="center" width="50" fixed>
      <template slot-scope="scope">
        <div class="user-block">
          <div v-if="scope.row.image_url" style="width:100%;">
            <div style="margin:0 auto;height:30px;width:30px;">
              <img class="img-circle" style="margin:0 auto;" :src="scope.row.image_url" />
            </div>
          </div>
          <div v-else class="text-muted" style="width:100%;">
            <div class="img-circle" style="background-color:white;margin:0 auto;">
              <div style="display:flex;height:30px;width:30px;">
                <div
                  style="align-self:center;width:100%;text-align:center;font-weight:bold;font-size:.8em"
                >
                  {{
                  getAvatarLetters(
                  scope.row.firstname,
                  scope.row.lastname
                  )
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed>
      <template slot-scope="scope">
      <div style="width:100%;text-align:center">
        <svg-icon icon-class="edit" style="margin-left:2px;margin-right:2px;cursor:pointer;" @click="handleCommand('edit:'+scope.row.id)"/>
        <svg-icon icon-class="link" style="margin-left:2px;margin-right:2px;cursor:pointer;" @click="handleCommand('preview:'+scope.row.id)"/>
        <svg-icon icon-class="password" style="margin-left:2px;margin-right:2px;cursor:pointer;" @click="handleCommand('resetPass:'+scope.row.id)"/>
      </div>
      </template>
    </el-table-column>
    <el-table-column label="Employee" min-width="300" fixed sortable="custom" prop="full_name">
      <template slot-scope="scope">
        <div class="user-block">
          <span style="margin-left:10px;">
            <!-- <el-tag :type="scope.row.status.toLowerCase()=='active'?'success':'danger'">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ scope.row.full_name }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'edit:'+scope.row.id">Update</el-dropdown-item>
                  <el-dropdown-item :command="'preview:'+scope.row.id">View Profile</el-dropdown-item>
                  <el-dropdown-item :command="'resetPass:'+scope.row.id">Reset Password</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tag> -->
            {{ scope.row.full_name }}
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Position" width="200" sortable="custom" prop="position">
      <template slot-scope="{row}">
        <div style='width:100;text-align:center'>{{ row.position }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Head" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.head_name }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Email@cnmsolutions.net" width="200" sortable="custom" prop="email">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.email.split("@")[0] }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.status.toUpperCase() }}</div>
      </template>
    </el-table-column>
    <el-table-column label="type" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">
        <!-- <el-tag
          :type="row.status.toLowerCase()=='active'?'success':'danger'"
        > -->
        {{ row.type != '' ? row.type.toUpperCase() : 'N/A' }}
        <!-- </el-tag> -->
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Contract" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.contract }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Gender" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.gender }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Birthdate" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.birthdate }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Address" width="200" sortable="custom" prop="user_infos.address">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.address }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Hired Date" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.hired_date }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Separation Date" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.separation_date }}</div>
      </template>
    </el-table-column>-->
    <el-table-column label="SSS #" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.benefits.length>0 ?row.benefits[0].id_number:"" }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Philhealth #" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.benefits.length>0 ?row.benefits[1].id_number:"" }}</div>
      </template>
    </el-table-column>
    <el-table-column label="PagIbig #" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.benefits.length>0 ?row.benefits[2].id_number:"" }}</div>
      </template>
    </el-table-column>
    <el-table-column label="TIN #" width="200">
      <template slot-scope="{row}">
        <div style="width:100%;text-align:center">{{ row.benefits.length>0 ?row.benefits[3].id_number:"" }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
const avatarPrefix = "?imageView2/1/w/80/h/80";
import TableExpansion from "./TableExpansion";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { TableExpansion },
  props: ["tableData"],
  computed: {
    ...mapGetters(["allPosition", "employeeFetchState"]),
    sort_icon() {
      let field = this.sort.field;
      let order = this.sort.order;
      return {
        full_name:
          field == "full_name"
            ? order == 1
              ? "el-icon-sort-down"
              : "el-icon-sort-up"
            : ""
      };
    }
  },
  data() {
    return {
      list: {
        data: [],
        filters: {
          status: [],
          head: []
        }
      },
      multiSelect: [],
      avatarPrefix,
      sort: {
        field: "full_name",
        order: 0,
        icon: ""
      }
    };
  },
  created() {},
  methods: {
    test({ column, prop, order }) {
      console.log(column);
      console.log(prop);
      console.log(order);
    },
    ...mapActions(["fetchAccessLevels"]),
    // local component functions
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8);
      });
    },
    onSelect(param) {
      this.selectedOption = param;
    },
    handleCommand(command) {
      this.$emit("dropdownCommand", {
        action: command.split(":")[0],
        id: command.split(":")[1]
      });
    },
    // table filter callback {Element UI} functions
    // filterHeads(value, row) {
    //   return row.company_details.head === value
    // },
    // filterStatus(value, row) {
    //   return row.info.status === value
    // },
    // multiple filterhandler
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSelectionChange(val) {
      this.multiSelect = val;
      this.$emit("table-select", this.multiSelect);
    },
    columnSort({ column, prop, order }) {
      this.$emit("sort", { sort: prop, order: order });
    }
  }
};
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
  border-left: 5px solid #67C23A !important;

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
.monday >>> tbody tr {
  height:50px !important;
}
</style>