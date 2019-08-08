<template>
  <div class="app-container">
    <h4 style="color:#646464">All Reports</h4>

    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{ span:8 }">
        <el-input v-model="searchQuery" placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
      <el-col :md="{ span:16 }">
        <el-pagination
          style="float:right
          "
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
    </el-row>

    <!-- Table -->
    <br>
    <el-alert
      v-if="fetchingAllIncidentReports.fail"
      title="Error!"
      type="error"
      :description="irErrors"
    />
    <el-table
      v-loading="fetchingAllIncidentReports.initial"
      :data="incidentReports"
      style="margin-top:30px;"
    >
      <el-table-column align="center" label="Action">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item icon="el-icon-edit" :command="'update||'+scope.row.id">Update</el-dropdown-item> -->
              <el-dropdown-item :command="'clear||'+scope.row.report_details.id" divided>Close</el-dropdown-item>
              <el-dropdown-item :command="'unclear||'+scope.row.report_details.id">Open</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Issued To">
        <template slot-scope="scope">
          <div class="td-image-name-container">
            <img v-if="scope.row.issued_to.image" :src="scope.row.issued_to.image" class="td-image">
            <div v-else class="td-name-avatar">
              <span>{{ getAvatarLetters(scope.row.issued_to.fname,scope.row.issued_to.lname) }}</span>
            </div>
            <div class="td-name">{{ scope.row.issued_to.full_name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Issued By">
        <template slot-scope="scope">
          <div class="td-image-name-container">
            <img v-if="scope.row.issued_by.image" :src="scope.row.issued_by.image" class="td-image">
            <div v-else class="td-name-avatar">
              <span>{{ getAvatarLetters(scope.row.issued_by.fname,scope.row.issued_by.lname) }}</span>
            </div>
            <div class="td-name">{{ scope.row.issued_by.full_name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Type">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_type.type_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Level">
        <template slot-scope="scope">{{ scope.row.report_details.sanction_level.level_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.response" type="success">cleared</el-tag>
          <el-tag v-else type="danger">uncleared</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description" width="350">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Response" width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.response" type="success">responded</el-tag>
          <el-tag v-else type="danger">no response</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Date Filed" width="220">
        <template slot-scope="scope">{{ scope.row.date_filed }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      query: {
        offset: 0,
        limit: 10
      },
      searchQuery: null
    }
  },
  computed: {
    ...mapGetters([
      'fetchingAllIncidentReports',
      'incidentReports',
      'irErrors',
      'incidentReportsTotal'
    ])
  },
  watch: {},
  mounted() {
    this.fetchAllReports(this.query)
  },
  methods: {
    ...mapActions(['fetchAllReports']),

    tableSizeChange(value) {
      this.query.limit = value
      this.fetchAllReports(this.query)
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit
      this.fetchAllReports(this.query)
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
