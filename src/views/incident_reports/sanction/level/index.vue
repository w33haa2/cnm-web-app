<template>
  <div class="app-container">
    <h4 style="color:#646464">Sanction Level</h4>

    <el-row>
      <el-col>
        <el-button :plain="true" size="mini" @click="modal_show = true">Create Saction Level</el-button>
      </el-col>
    </el-row>

    <!-- Search and Pagination -->
    <el-row style="width: 100%;margin-top:30px;">
      <el-col :md="{ span:8 }">
        <el-input v-model="searchQuery" placeholder="Search..." size="mini">
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
      <el-col :md="{ span:16 }">
        <el-pagination
          style="float:right"
          :page-sizes="[10, 25, 50]"
          :page-size="query.limit"
          layout="total, sizes, prev, pager, next"
          :total="sanctionLevels.count"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table :data="sanctionLevels.options" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="Level Number">
        <template slot-scope="scope">{{ scope.row.level_number }}</template>
      </el-table-column>
      <el-table-column align="center" label="Level Description">
        <template slot-scope="scope">{{ scope.row.level_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Edit">
        <template slot-scope="scope">
          <el-button :plain="true" @click="updateRow(scope.row)">
            <i class="el-icon-edit-outline" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="modal_show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.action + ' Sanction Level'"
      width="30%"
    >
      <label width="100%">Level Number</label>
      <el-row>
        <el-col>
          <el-input-number
            v-model="form.level_number"
            style="margin-top:3px; margin-bottom:10px;width:100%"
            :step="1"
            step-strictly
            size="mini"
          />
        </el-col>
      </el-row>
      <label style="margin-top:5px; margin-bottom:3px">Level Description</label>
      <el-row>
        <el-col>
          <el-input
            v-model="form.level_description"
            type="text"
            style="margin-top:3px; margin-bottom:5px;"
            size="mini"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm">Cancel</el-button>
        <el-button type="danger" size="mini" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Level',
  data() {
    return {
      modal_show: false,
      form: {
        action: 'Create',
        // input models
        level_number: null,
        level_description: null
      },
      query: {
        offset: 0,
        limit: 10
      }
    }
  },
  mounted() {
    const data = this.query
    this.fetchSanctionLevels({ data })
  },
  computed: {
    ...mapGetters(['sanctionLevels'])
  },
  methods: {
    ...mapActions(['fetchSanctionLevels']),

    tableSizeChange(value) {
      this.query.limit = value
      this.query.offset = 0
      const data = this.query
      this.fetchSanctionLevels({ data })
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit
      const data = this.query
      this.fetchSanctionLevels({ data })
    },
    updateRow(row) {
      this.form.action = 'Update'
      this.form.level_number = row.level_number
      this.form.level_description = row.level_description
      this.modal_show = true
    },
    resetForm() {
      this.form.action = 'Create'
      this.form.level_number = null
      this.form.level_description = null
    },
    cancelForm() {
      this.resetForm()
      this.modal_show = false
    },
    submitForm() {
      // submit action
      if (this.form.action == 'Create') {
        // create
      } else {
        // update
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
