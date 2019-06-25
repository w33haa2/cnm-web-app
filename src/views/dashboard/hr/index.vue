<template>
  <div class="dashboard-editor-container">

    <!-- ADD EMPLOYEE BUTTON & EXCEL EXPORT/IMPORT BUTTTONS -->
    <el-row :gutter="8" style="padding-right:8px;margin-bottom:30px;">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">
        <el-button size="mini" @click="form.toggle = !form.toggle">Add Employee</el-button>
        <el-button-group>
          <el-button size="mini">Import</el-button>
          <el-button size="mini">Export</el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <!-- EMPLOYEE FORM ELEMENT -->
    <el-row v-if="form.toggle" :gutter="8" style="padding-right:8px;margin-bottom:30px;">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span:24}">
        <employee-form />
      </el-col>
    </el-row>

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
    </el-row> -->

    <!-- SIMPLE BACKEND SEARCH INPUT -->
    <!-- DISPLAY RECORDS & PAGINATION -->
    <el-row :gutter="8" style="padding-right:8px;margin-bottom:5px;">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
        <el-input v-model="table_config.query.search.query" placeholder="Search..." size="mini">
          <el-select slot="prepend" v-model="table_config.query.search.target" placeholder="Select" style="width:150px;">
            <el-option v-for="(option,index) in table_config.searchable_fields" :key="index" :label="option.label" :value="option.value" />
          </el-select>
          <el-button slot="append"><i class="el-icon-search" /></el-button>
        </el-input>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
        <el-pagination
          style="float:right"
          small
          background
          :page-sizes="[10, 25, 50]"
          :current-page.sync="table_config.page"
          :page-size="table_config.display_size"
          layout="total, sizes, prev, pager, next"
          :total="employees.rows"
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
    </el-row> -->
    <el-row :gutter="8" style="padding-right:8px;margin-bottom:30px;">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}">
        <transaction-table :table-data="employees.data" @sort="onColumnSort" />
      </el-col>
      <!-- <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import SelectSearch from './components/select_search'
import EmployeeForm from './components/EmployeeForm'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DashboardHR',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    SelectSearch,
    EmployeeForm
  },
  data() {
    return {
      table_config: {
        searchable_fields: [
          { value: 'full_name', label: 'Name' }
        ],
        query: {
          search: {
            target: 'full_name',
            query: null
          },
          limit: 10,
          offset: 0,
          sort: null,
          order: null
        },
        data: [],
        rows: 0
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
  created() {
    // fetch and commit table data via vuex action
    this.fetchUsers(this.table_config.query)
    // setup filter select
  },
  computed: {
    ...mapGetters(['employees', 'allPosition'])
  },
  watch: {
    employees: function() {
      this.employees = this.employees
    }
  },
  methods: {
    ...mapActions(['fetchUsers', 'fetchPositions']),
    tableSizeChange(value) {
      this.table_config.query.limit = value
      // alert('size changed: '+ value)
      this.fetchUsers(this.table_config.query)
    },
    tablePageChange(value) {
      this.table_config.query.offset = value - 1
      // alert('page changed: '+ value)
      this.fetchUsers(this.table_config.query)
    },
    onColumnSort(value) {
      alert('deym')
      this.table_config.query.sort = value.sort
      this.table_config.query.order = value.order
      this.fetchUsers(this.table_config.query)
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
