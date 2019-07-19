<template>
  <div class="app-container">
    <h4 style="color:#646464">All Reports</h4>

    <!-- Search and Pagination -->
    <el-row>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="400"
          background
          small
        />
      </el-col>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
    </el-row>

    <!-- Table -->
    <br>
    <el-alert
      v-if="fetchingIncidentReports.fail"
      title="Error!"
      type="error"
      :description="irErrors">
    </el-alert>
    <el-table :data="incidentReports" v-loading="fetchingIncidentReports.initial" style="width: 100%;margin-top:30px;">
      <el-table-column fixed type="selection" width="55" />
      <el-table-column align="center" label="Action" fixed>
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item icon="el-icon-edit" :command="'update||'+scope.row.id">Update</el-dropdown-item> -->
              <el-dropdown-item :command="'clear||'+scope.row.id" divided>Cleared</el-dropdown-item>
              <el-dropdown-item :command="'unclear||'+scope.row.id">Uncleared</el-dropdown-item>
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
      <el-table-column align="center" label="Issued By" width="220">
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
      <el-table-column align="center" label="Sanction Type" width="220">
        <template slot-scope="scope">{{ scope.row.sanction.type }}</template>
      </el-table-column>
      <el-table-column align="center" label="Sanction Level" width="220">
        <template slot-scope="scope">{{ scope.row.sanction.level }}</template>
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
    return {}
  },
  computed: {
    ...mapGetters(['fetchingIncidentReports', 'incidentReports', 'irErrors'])
  },
  watch: {},
  mounted() {
    this.fetchReports()
  },
  methods: {
    ...mapActions(['fetchReports']),
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
