<template>
  <div class="app-container">
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
          <el-button size="mini" @click="form.toggle = true">Add Employee</el-button>
          <el-button-group>
            <el-button size="mini">Import</el-button>
            <el-button size="mini">Export</el-button>
          </el-button-group>
        </el-col>
      </el-row>

      <!-- EMPLOYEE FORM ELEMENT -->
      <!-- <el-row v-if="form.toggle" :gutter="8" style="padding-right:8px;margin-bottom:30px;">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span:24}">
          <employee-form :toggle="form.toggle" :data />
        </el-col>
      </el-row>-->
      <employee-form
        :toggle="form.toggle"
        :data="{action:'Add', id:null}"
        @closeEmployeeModal="closeEmployeeModal"
      />

      <!-- MULTI SEARCH & FILTER, CHANGE STATUS ELEMENTS -->
      <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 20}" :xl="{span:20}" style="padding-right:8px;margin-bottom:10px;">
        <select-search style="width:100%" :multiple="true" :filterable="true" :remote="true" :size="'mini'" autocomplete="on" placeholder="Search and select..." :data="select_search[filtered.by].data" @filter="filterEmployee" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 4}" :xl="{span:4}" style="padding-right:8px;margin-bottom:10px;">
        <el-button size="mini" type="danger" style="width:100%" :disabled="multiSelect.length===0">Change Status</el-button>
        <el-select v-model="filtered.by" style="width:100%" size="mini">
          <el-option v-for="option in options.filter" :key="option.value" :value="option.value" :label="option.label" />
        </el-select>
      </el-col>
      </el-row>-->

      <!-- SIMPLE BACKEND SEARCH INPUT -->
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

      <!-- <el-row :gutter="2">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" style="padding-right:8px;margin-bottom:10px;">

        <el-tag>
          {{ filtered.count+' record/s' }}
        </el-tag>
        <el-tag>
          {{ filtered.count+' displayed' }}
        </el-tag>
        <el-tag>
          {{ filtered.count+' selected' }}
        </el-tag>
      </el-col>
      </el-row>-->
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
          <transaction-table :table-data="employeesData" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import TransactionTable from './components/TransactionTable'
import SelectSearch from './components/select_search'
import EmployeeForm from './components/EmployeeForm'
import { mapGetters, mapActions } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'DashboardHR',
  components: {
    TransactionTable,
    SelectSearch,
    EmployeeForm
  },
  data() {
    return {
      searchQuery: '',
      table_config: {
        searchable_fields: [
          { value: 'full_name', label: 'Name' },
          { value: 'position', label: 'Position' },
          { value: 'email', label: 'Email' },
          { value: 'contract', label: 'Contract' },
          { value: 'status', label: 'Status' },
          { value: 'gender', label: 'Gender' },
          { value: 'address', label: 'Address' }
        ],
        query: {
          search: {
            target: 'full_name',
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
        action: {
          value: 'add',
          label: 'Add'
        }
      }
    }
  },
  mounted() {
    // fetch and commit table data via vuex action
    const data = this.query
    this.fetchEmployees({ data })
    this.$root.$on('employee_table.refresh', this.refreshTable)
    // setup filter select
  },
  computed: {
    ...mapGetters([
      'employees',
      'employeeErrors',
      'allPosition',
      'employeesData',
      'employeesTotal',
      'employeeFetchState'
    ])
  },
  watch: {
    employeeData: function(v) {
      console.log(v)
    },
    searchQuery: function(newData) {
      if (newData !== '') {
        this.query['target[]'] = this.table_config.query.search.target
        this.query.query = newData
        const data = this.query
        this.fetchEmployees({ data })
      } else {
        this.query['target[]'] = ''
        this.query.query = ''
        const data = this.query
        this.fetchEmployees({ data })
      }
    }
  },
  methods: {
    ...mapActions(['fetchUsers', 'fetchPositions', 'fetchEmployees']),
    closeEmployeeModal(v) {
      this.form.toggle = v
    },
    refreshTable() {
      const data = this.query
      this.fetchEmployees({ data })
    },
    tableSizeChange(value) {
      this.query.limit = value
      const data = this.query
      this.fetchEmployees({ data })
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit
      const data = this.query
      this.fetchEmployees({ data })
    },
    onColumnSort(value) {
      this.query.sort = value.sort
      this.query.order = value.order ? 'asc' : 'desc'
      const data = this.query
      this.fetchEmployees({ data })
    }
  }
}
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
