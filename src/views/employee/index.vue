<template>
  <div class="app-container">
    <h4>Employee</h4>
    <div class="filter-container">
      <!-- ADD EMPLOYEE BUTTON & EXCEL EXPORT/IMPORT BUTTTONS -->
      <el-row :gutter="8" style="padding-right:8px;margin-bottom:30px;">
        <el-col :md="{span: 24}">
          <!-- <el-button
            size="mini"
            @click="form.toggle = true, form.action_data={action:'Create',data:null}"
          >Create Employee</el-button>
          <el-button-group>
            <el-button size="mini" @click="$refs.excelInput.click()">Import</el-button>
            <input
              ref="excelInput"
              type="file"
              style="display:none"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              @change="excelChanged"
            >
            <el-button size="mini">Export</el-button>
          </el-button-group>
          <el-button size="mini" @click="changeStatus">Change Status</el-button>-->

          <div style="float:right">
            <el-button
              size="mini"
              @click="form.toggle = true, form.action_data={action:'Create',data:null}"
              style="margin-right:2px;"
            >Create Employee</el-button>
            <el-button size="mini" @click="changeStatus" style="margin-left:0px;">Change Status</el-button>
            <el-dropdown @command="handleCommand">
              <el-button type="success" :plain="true" size="mini">
                Excel
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <input
                type="file"
                ref="importEmployeeInput"
                accept=".xlsx"
                style="display:none"
                @change="importEmployeeFileChange"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="importEmployee">Import Employee</el-dropdown-item>
                <el-dropdown-item command="downloadEmployeeTemplate">Export Employee Template</el-dropdown-item>
                <el-dropdown-item command="downloadEmployeeList">Export Employee List</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
      <employee-form
        :toggle="form.toggle"
        :data="form.action_data"
        @closeEmployeeModal="closeEmployeeModal"
      />
      <!-- DISPLAY RECORDS & PAGINATION -->
      <el-row :gutter="8" style="padding-right:8px;margin-bottom:5px;">
        <el-col :md="{span: 8}">
          <el-input v-model="searchQuery" placeholder="Search..." size="mini">
            <el-select
              slot="prepend"
              v-model="table_config.query.search.target"
              placeholder="Select"
              style="width:150px;"
            >
              <el-option
                v-for="(option,index) in table_config.searchable_fields"
                :key="index"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-button slot="append">
              <i class="el-icon-search" />
            </el-button>
          </el-input>
        </el-col>
        <el-col :md="{span: 16}">
          <el-pagination
            style="float:right"
            small
            background
            :page-sizes="[10, 25, 50]"
            :current-page.sync="table_config.page"
            :page-size="table_config.display_size"
            layout="total, sizes, prev, pager, next"
            :total="employeesTotal"
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>
      </el-row>

      <el-row :gutter="8" style="padding-right:8px;margin-bottom:30px;">
        <el-col
          :xs="{span: 24}"
          :sm="{span: 24}"
          :md="{span: 24}"
          :lg="{span: 24}"
          :xl="{span: 24}"
        >
          <el-alert
            v-if="employeeFetchState.fail"
            title="Error!"
            type="error"
            :description="employeeErrors"
          />
          <transaction-table :table-data="employeesData" @dropdownCommand="dropdownCommand" />
        </el-col>
      </el-row>
    </div>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="change_status.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Change Status"
      width="40%"
    >
      <label width="100%">Employees</label>
      <el-row style="margin-top: 7px; margin-bottom:5px;">
        <el-col>
          <el-select
            v-model="change_status.form.employees"
            size="mini"
            style="width:100%"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="Employees..."
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in rs_employees"
              :key="item.id"
              :label="item.full_name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <label>Status</label>
      <el-row style="margin-top: 7px; margin-bottom:5px;">
        <el-col>
          <el-select v-model="change_status.form.status_id" size="mini" style="width:100%">
            <el-option
              v-for="(status,index) in statusList"
              :key="status.id"
              :value="status.id"
              :label="status.type"
            />
          </el-select>
        </el-col>
      </el-row>
      <label>Date</label>
      <el-row style="margin-top: 7px; margin-bottom:5px;">
        <el-col>
          <el-date-picker size="mini" type="date" v-model="change_status.form.date" style="width:100%" placeholder="Select date..."></el-date-picker>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm">Cancel</el-button>
        <el-button
          type="danger"
          @click="confirmChangeStatus"
          :loading="change_status.confirm"
          size="mini"
        >Confirm</el-button>
      </span>
    </el-dialog>

    <!-- Create and Update Dialog
    <el-dialog
      :visible.sync="reset.toggle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Reset Password"
      width="40%"
    >
      <el-row>
        <h4>Are you sure? It cannot be reverted back.</h4>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelResetForm">Cancel</el-button>
        <el-button
          type="danger"
          size="mini"
          :loading="employeeUpdateState.initial"
          @click="resetPassword"
        >Confirm</el-button>
      </span>
    </el-dialog>-->

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="excel.import.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Importing Employee..."
      width="50%"
      top="5vh"
    >
      <el-alert
        title="Import Report"
        type="info"
        description="This report will only be displayed once every import. Please review results to reupload unimported data."
        show-icon
      ></el-alert>

      <div style="width:100%;margin-bottom:20px;margin-top:15px;">
        Progress
        <span>( {{ excel.import.loop_index }}</span>/
        <span>{{ excel.import.arr_length }} )</span>
      </div>
      <el-progress :percentage="excel.import.progress" :text-inside="true" :stroke-width="18"></el-progress>
      <div style="padding-bottom:15px;  ">
        <el-tabs
          v-model="excel.import.report.active_tab"
          type="border-card"
          style="margin-top:15px;margin-bottom:10px;"
        >
          <el-tab-pane :label="'All: '+excel.import.report.data.all.list.length" name="all">
            <el-table :data="excel.import.report.data.all.list" height="350px">
              <el-table-column label="CID" width="100">
                <template scope="scope">{{scope.row.company_id}}</template>
              </el-table-column>
              <el-table-column label="Full Name" width="350">
                <template scope="scope">{{scope.row.full_name}}</template>
              </el-table-column>
              <el-table-column label="Status">
                <template scope="scope">
                  <template v-if="scope.row.status_code==200">
                    <el-tag size="mini" type="success">UPLOADED</el-tag>
                  </template>
                  <template v-else>
                    <el-tag size="mini" type="danger">{{ scope.row.title }}</el-tag>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            :label="'Errors: ' +excel.import.report.data.errors.list.length "
            name="errors"
          >
            <el-table :data="excel.import.report.data.errors.list" height="350px">
              <el-table-column label="CID" width="100">
                <template scope="scope">{{scope.row.company_id}}</template>
              </el-table-column>
              <el-table-column label="Full Name" width="350">
                <template scope="scope">{{scope.row.full_name}}</template>
              </el-table-column>
              <el-table-column label="Status">
                <template scope="scope">
                  <template v-if="scope.row.status_code==200">
                    <el-tag size="mini" type="success">UPLOADED</el-tag>
                  </template>
                  <template v-else>
                    <el-tag size="mini" type="danger">{{ scope.row.title }}</el-tag>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-button size="mini" @click="closeImportReport" style="float:right">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TransactionTable from "./components/TransactionTable";
import SelectSearch from "./components/select_search";
import EmployeeForm from "./components/EmployeeForm";
import { mapGetters, mapActions } from "vuex";
import { Message } from "element-ui";
import excel from "xlsx";
import axios from "axios";
import moment from "moment";
export default {
  name: "DashboardHR",
  components: {
    TransactionTable,
    SelectSearch,
    EmployeeForm
  },
  data() {
    return {
      excel: {
        import: {
          status: null,
          progress: 0,
          dialog: false,
          loop_index: 0,
          arr_length: 100,
          data: [],
          importing: false,
          report: {
            active_tab: "all",
            data: {
              all: {
                count: 0,
                list: []
              },
              errors: {
                count: 0,
                list: []
              }
            }
          }
        }
      },
      searchQuery: "",
      table_config: {
        searchable_fields: [
          { value: "full_name", label: "Name" },
          { value: "position", label: "Position" },
          { value: "email", label: "Email" },
          { value: "contract", label: "Contract" },
          { value: "status", label: "Status" },
          { value: "gender", label: "Gender" },
          { value: "address", label: "Address" }
        ],
        query: {
          search: {
            target: "full_name",
            query: null
          },
          limit: 10,
          offset: 0
          // sort: null,
          // order: null
        },
        data: [],
        rows: 0
      },
      query: {
        limit: 10,
        offset: 0
        // order:"desc",
        // sort:"user.created_at"
      },
      reset: {
        toggle: false,
        id: null
      },
      form: {
        toggle: false,
        action_data: {
          action: "Create",
          data: null
        }
      },
      change_status: {
        dialog: false,
        form: {
          employees: [],
          status_id: 1,
          date:null
        },
        model: {
          user_id: null,
          status: null,
          type: null,
          status_reason: null,
          hired_date:null,
          separation_date:null
        },
        confirm: false
      }
    };
  },
  mounted() {
    // fetch and commit table data via vuex action
    const data = this.query;
    this.fetchEmployees({ data });
    this.$root.$on("employee_table.refresh", this.refreshTable);
    this.fetchStatusList();
    this.fetchRSEmployees();

    // setup filter select
  },
  beforeRouteLeave(to, from, next) {
    if (this.excel.import.importing) {
      if (confirm("Are you sure you want to leave?")) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
    // if(from==to){
    //   next(false)
    // }
  },

  computed: {
    ...mapGetters([
      "employees",
      "employeeErrors",
      "allPosition",
      "employeesData",
      "employeesTotal",
      "employeeFetchState",
      "employeeUpdateState",
      "statusList",
      "rs_employees",
      "token",
      "changeStatusState",
      "resetPassState"
    ])
  },
  watch: {
    resetPassState({ initial, success, fail }) {
      if (success) {
        this.$message({
          type: "success",
          message:
            "You have successfully reset employees password, NEW PASSWORD HINT: firstname+lastname *small-caps *no-spaces.",
          duration: 8000
        });
      }
      if (fail) {
        this.$message({
          type: "error",
          message: "There's a problem processing your request.",
          duration: 5000
        });
      }
    },
    changeStatusState({ initial, success, fail }) {
      if (initial) {
        this.change_status.confirm = true;
      }
      if (success) {
        this.change_status.confirm = false;
        this.query.offset = 0;
        let data = this.query;
        this.fetchEmployees({data});
        this.$message({
          type: "success",
          message: "You have successfully changed status of chosen employee/s.",
          duration: 5000
        });
      }
      if (fail) {
        this.change_status.confirm = false;
        this.$message({
          type: "error",
          message: "There's an error processing your request.",
          duration: 5000
        });
      }
    },
    employeeData: function(v) {
      console.log(v);
    },
    searchQuery: function(newData) {
      if (newData !== "") {
        this.query["target[]"] = this.table_config.query.search.target;
        this.query.query = newData;
        const data = this.query;
        this.fetchEmployees({ data });
      } else {
        this.query["target[]"] = "";
        this.query.query = "";
        const data = this.query;
        this.fetchEmployees({ data });
      }
    },
    employeesFetchState({ initial, success, fail }) {
      if (fail) {
        Message.error({ message: this.irErrors, duration: "2500" });
      }
    },
    employeeUpdateState({ initial, success, fail }) {
      if (fail) {
        Message.error({ message: this.employeeErrors, duration: "2500" });
      } else if (success) {
        Message.success({
          message: "Successfully updated user details.",
          duration: "2500"
        });
        this.reset.toggle = false;
      }
    },
    statusList(v) {
      let row = v[0];
      this.change_status.model.status = row.status;
      this.change_status.model.type = row.type;
      this.change_status.model.reason = row.type;
    },
    "change_status.form.status_id": function(v) {
      let row = this.statusList.filter(i => i.id == v)[0];
      this.change_status.model.status = row.status;
      this.change_status.model.type = row.type;
      this.change_status.model.reason = row.type;

      if(row.status == "active"){
        this.change_status.model.hired_date = this.change_status.form.date
        this.change_status.model.separation_date = null
      }else{
        this.change_status.model.hired_date = null
        this.change_status.model.separation_date = this.change_status.form.date
      }
    },
    "change_status.form.date":function(v){
      if(this.change_status.model.status == "active"){
        this.change_status.model.hired_date = moment(this.change_status.form.date).format("YYYY-MM-DD")
        this.change_status.model.separation_date = null
      }else{
        this.change_status.model.hired_date = null
        this.change_status.model.separation_date = this.change_status.form.date.format("YYYY-MM-DD")
      }
    },
    "change_status.form.employees": function(v) {
      this.change_status.model.user_id = v;
    }
  },
  methods: {
    ...mapActions([
      "changeStatusEmployee",
      "fetchPositions",
      "fetchEmployees",
      "fetchStatusList",
      "fetchRSEmployees",
      "resetPassEmployee",
    ]),
    confirmChangeStatus() {
      // let data = {};
      // data.user_id = this.change_status.employees;
      // data.status = this.change_status.form.status;
      // data.type = this.change_status.form.status;
      this.changeStatusEmployee(this.change_status.model);
    },
    closeImportReport(e) {
      if (this.excel.import.importing) {
        this.$message({
          type: "warning",
          message:
            "You are not allowed to close this dialog until the process is done. If you want to checkout something on other pages, Please open another browser tab.",
          duration: 10000
        });
      } else {
        if (confirm("Are you sure you already reviewed the import report?")) {
          this.excel.import.dialog = false;
          this.excel.import.report.data.all.list = [];
          this.excel.import.report.data.errors.list = [];
          //   all:{list:[],count:0},
          //   errors:{list:[],count:0}
          // }
          this.excel.import.loop_index = 0;
          this.excel.import.arr_length = 0;
        }
      }
    },
    excelAddUser(arr) {
      let count = arr.length;
      this.excel.import.arr_length = arr.length;
      this.excel.import.dialog = true;
      this.excel.import.importing = true;
      let tmp_arr = [];

      var i = 0;
      for (i in arr) {
        let suffix = arr[i].suffix ? " " + arr[i].suffix : "";
        let tmp_data = {
          company_id: arr[i].company_id,
          full_name:
            arr[i].firstname +
            " " +
            arr[i].middlename +
            " " +
            arr[i].lastname +
            suffix
        };
        console.log(tmp_data);
        axios
          .post("api/v1/users/import_user", arr[i], {
            headers: {
              Authorization: "Bearer " + this.token
            }
          })
          .then(res => {
            console.log(res);
            this.excel.import.loop_index = parseInt(i) + 1;
            this.excel.import.progress =
              (this.excel.import.loop_index / this.excel.import.arr_length) *
              100;
            tmp_data.status_code = res.status;
            tmp_data.title = res.data.title;
            tmp_arr.push(tmp_data);
            this.excel.import.report.data.all.list = tmp_arr;
            this.excel.import.report.data.errors.list = tmp_arr.filter(
              i => i.status_code != 200
            );
            if (this.excel.import.loop_index == this.excel.import.arr_length) {
              this.excel.import.importing = false;
              this.query.offset = 0;
              let data = this.query;
              this.fetchEmployees({data});
            }
          })
          .catch(err => {
            console.log(err.response.data);
            this.excel.import.loop_index = parseInt(i) + 1;
            this.excel.import.progress =
              (this.excel.import.loop_index / this.excel.import.arr_length) *
              100;
            tmp_data.status_code = err.response.data.code;
            tmp_data.title = err.response.data.title;
            tmp_arr.push(tmp_data);
            this.excel.import.report.data.all.list = tmp_arr;
            this.excel.import.report.data.errors.list = tmp_arr.filter(
              i => i.status_code != 200
            );
            if (this.excel.import.loop_index == this.excel.import.arr_length) {
              this.excel.import.importing = false;
              this.query.offset = 0;
              let data = this.query;
              this.fetchEmployees({data});
            }
          });
      }
    },
    importEmployeeFileChange(e) {
      let file = e.target.files[0],
        formData = new FormData(),
        options = {
          headers: {
            Authorizaion: "Bearer " + this.token
          }
        };
      formData.append("file", e.target.files[0]);
      axios
        .post("api/v1/users/excel_to_array", formData, options)
        .then(res => {
          console.log(res.data.meta.user);
          this.excelAddUser(res.data.meta.user);
        })
        .catch(err => console.log(err));
    },
    exportEmployeeList() {
      let url = "api/v1/excel/export_report",
        options = {
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + this.token
          }
        };

      axios.get(url, options).then(res => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        console.log(res);
        var // json = JSON.stringify(res.data),
          blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "EmployeeList-" + moment().format("YYYY-MM-DD") + ".xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    exportEmployeeTemplate() {
      let url = "api/v1/excel/export_add_template",
        options = {
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + this.token
          }
        };

      axios.get(url, options).then(res => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        console.log(res);
        var // json = JSON.stringify(res.data),
          blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "EmployeeTemplate.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    handleCommand(command) {
      switch (command) {
        case "downloadEmployeeTemplate":
          this.exportEmployeeTemplate();
          break;
        case "downloadEmployeeList":
          this.exportEmployeeList();
          break;
        case "importEmployee":
          this.$refs.importEmployeeInput.click();
          break;
      }
    },
    changeStatus() {
      this.change_status.dialog = true;
    },
    remoteMethod(query) {
      const data = {};
      if (query !== "") {
        data["target[]"] = "full_name";
        data.query = query;
        this.fetchRSEmployees({ data });
      } else {
        data["target[]"] = "";
        data.query = "";
        this.fetchRSEmployees({ data });
      }
    },
    cancelForm() {
      this.resetForm();
      this.change_status.dialog = false;
    },
    cancelResetForm() {
      this.reset.toggle = false;
    },
    resetForm() {
      this.change_status.form = {
        employees: [],
        status: 1
      };
    },
    dropdownCommand(v) {
      switch (v.action) {
        case "edit":
          this.form.toggle = true;
          this.form.action_data = {
            action: "Update",
            data: this.getUpdateData(v.id)
          };
          break;
        case "resetPass":
          if (confirm("Are you sure? It cannot be reverted back.")) {
            this.resetPassEmployee({ id: v.id });
          }
          break;
        case "preview":
          this.$router.push({ path: `/profile/index/${v.id}` });
          break;
      }
    },
    getUpdateData(id) {
      console.log(this.employeesData.filter(i => i.id == id)[0]);

      return this.employeesData.filter(i => i.id == id)[0];
    },
    excelChanged(e) {
      var files = e.target.files;
      var f = files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = excel.read(data, { type: "array" });

        /* DO SOMETHING WITH workbook HERE */
      };
      reader.readAsArrayBuffer(f);
      console.log(reader);
    },
    closeEmployeeModal(v) {
      this.form.toggle = v;
    },
    refreshTable() {
      const data = this.query;
      this.fetchEmployees({ data });
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.query.offset = 0;
      const data = this.query;
      this.fetchEmployees({ data });
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchEmployees({ data });
    },
    onColumnSort(value) {
      this.query.sort = value.sort;
      this.query.order = value.order ? "asc" : "desc";
      const data = this.query;
      this.fetchEmployees({ data });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
