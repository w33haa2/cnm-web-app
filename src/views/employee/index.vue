<template>
  <div class="app-container">
    <h4>Employee</h4>
    <div class="filter-container">
      <!-- ADD EMPLOYEE BUTTON & EXCEL EXPORT/IMPORT BUTTTONS -->
      <el-row :gutter="8" style="padding-right:8px;margin-bottom:30px;">
        <el-col
          :xs="{span: 24}"
          :sm="{span: 24}"
          :md="{span: 24}"
          :lg="{span: 12}"
          :xl="{span: 12}"
        >
          <el-button
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
            />
            <el-button size="mini">Export</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <employee-form
        :toggle="form.toggle"
        :data="form.action_data"
        @closeEmployeeModal="closeEmployeeModal"
      />
      <!-- DISPLAY RECORDS & PAGINATION -->
      <el-row :gutter="8" style="padding-right:8px;margin-bottom:5px;">
        <el-col
          :xs="{span: 24}"
          :sm="{span: 24}"
          :md="{span: 12}"
          :lg="{span: 12}"
          :xl="{span: 12}"
        >
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
        <el-col
          :xs="{span: 24}"
          :sm="{span: 24}"
          :md="{span: 12}"
          :lg="{span: 12}"
          :xl="{span: 12}"
        >
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
  </div>
</template>

<script>
import TransactionTable from "./components/TransactionTable";
import SelectSearch from "./components/select_search";
import EmployeeForm from "./components/EmployeeForm";
import { mapGetters, mapActions } from "vuex";
import { Message } from "element-ui";
import excel from "xlsx";
export default {
  name: "DashboardHR",
  components: {
    TransactionTable,
    SelectSearch,
    EmployeeForm
  },
  data() {
    return {
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
      },
      form: {
        toggle: false,
        action_data: {
          action: "Create",
          data: null
        }
      }
    };
  },
  mounted() {
    // fetch and commit table data via vuex action
    const data = this.query;
    this.fetchEmployees({ data });
    this.$root.$on("employee_table.refresh", this.refreshTable);
    // setup filter select
  },
  computed: {
    ...mapGetters([
      "employees",
      "employeeErrors",
      "allPosition",
      "employeesData",
      "employeesTotal",
      "employeeFetchState"
    ])
  },
  watch: {
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
    }
  },
  methods: {
    ...mapActions(["fetchUsers", "fetchPositions", "fetchEmployees"]),
    dropdownCommand(v) {
      switch (v.action) {
        case "edit":
          this.form.toggle = true;
          this.form.action_data = {
            action: "Update",
            data: this.getUpdateData(v.id)
          };
          break;
      }
    },
    getUpdateData(id) {
      console.log(this.employeesData.filter(i => i.id == id)[0]);

      return this.employeesData.filter(i => i.id == id)[0];
    },
    excelChanged(e) {
      var files = e.target.files,
        f = files[0];
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
