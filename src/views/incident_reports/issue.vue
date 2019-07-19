<template>
  <div class="app-container">
    <el-button
      :plain="true"
      size="mini"
      @click="form.show = !form.show, form.action='create'"
    >File a Report</el-button>
    <ir-form v-if="form.show" :action="form.action" :update-id="form.update_id" />

    <h4 style="color:#646464">Filed Reports</h4>

    <!-- Search and Pagination -->
    <el-row>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[10, 25, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="incidentReportsTotal"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input v-model="searchQuery" placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option value="1" />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
    </el-row>
    <br>
    <el-alert
      v-if="fetchingIssuedIncidentReports.fail"
      title="Error!"
      type="error"
      :description="irErrors"
    />
    <!-- Table -->
    <el-table v-loading="fetchingIssuedIncidentReports.initial" :data="incidentReports" style="width: 100%;margin-top:10px;">
      <el-table-column fixed type="selection" width="55" />
      <el-table-column align="center" label="Action" fixed>
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit" :command="'update||'+scope.row.id">Update</el-dropdown-item>
              <!-- <el-dropdown-item icon="el-icon-printer" divided>Print</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Issued To" width="220">
        <template slot-scope="scope">
          <div class="td-image-name-container">
            <div v-if="false" class="td-name-avatar">
              <span>TD</span>
            </div>
            <img v-else :src="scope.row.issuedby.image" class="td-image">
            <div class="td-name">{{ scope.row.issuedby.full_name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.response" type="success">cleared</el-tag>
          <el-tag v-else type="danger">uncleared</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Response" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.response" type="success">Responded</el-tag>
          <el-tag v-else type="danger">No Response</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Type" width="220">
        <template slot-scope="scope">{{ scope.row.sanction.type }}</template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Level" width="220">
        <template slot-scope="scope">{{ scope.row.sanction.level }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date Filed" width="220">
        <template slot-scope="scope">{{ scope.row.date_filed }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="Description" width="350">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
import irForm from './components/ir_form'
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  components: { irForm },
  data() {
    return {
      searchQuery: '',
      form: {
        show: true,
        action: 'create',
        update_id: null
      },
      query: {
        limit: 10,
        offset: 0
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    },
    ...mapGetters(['fetchingIssuedIncidentReports', 'incidentReports', 'incidentReportsTotal', 'irErrors', 'userDetails'])
  },
  watch: {
    searchQuery(newData) {
      if (newData !== '') {
        this.query['target[]'] = 'full_name'
        this.query.query = newData
        this.fetchIssuedReports(this.query)
      } else {
        delete this.query['target[]']
        delete this.query.query
        this.fetchIssuedReports(this.query)
      }
    }
  },
  mounted() {
    this.query.id = this.userDetails.id
    this.fetchIssuedReports(this.query)
  },
  methods: {
    ...mapActions(['fetchIssuedReports']),
    tableSizeChange(value) {
      this.query.limit = value
      this.fetchIssuedReports(this.query)
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit
      this.fetchIssuedReports(this.query)
    },
    handleCommand(command) {
      const id = command.split('||')[1]
      const action = command.split('||')[0]
      switch (action) {
        case 'update':
          this.form.show = true
          this.form.action = action
          this.form.update_id = id
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
