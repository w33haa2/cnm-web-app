<template>
  <div class="app-container">
    <h4 style="color:#646464">Sanction Type</h4>

    <el-row>
      <el-col>
        <el-button :plain="true" size="mini" @click="modal_show = true">Create Sanction Type</el-button>
      </el-col>
    </el-row>

    <!-- Search and Pagination -->
    <el-row style="width: 100%;margin-top:30px;">
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input v-model="searchQuery" placeholder="Search..." size="mini">
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>

      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[10, 25, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="sanctionTypes.count"
          background
          small
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
        />
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table v-loading="fetchSanctionTypeState.initial" :data="sanctionTypes.options" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="Type Number">
        <template slot-scope="scope">{{ scope.row.type_number }}</template>
      </el-table-column>
      <el-table-column align="center" label="Type Description">
        <template slot-scope="scope">{{ scope.row.type_description }}</template>
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
      :title="form.action + ' Sanction Type'"
      width="30%"
    >
      <label width="100%">Type Number</label>
      <el-row>
        <el-col>
          <el-input-number
            v-model="form.type_number"
            style="margin-top:3px; margin-bottom:10px;width:100%"
            :step="1"
            step-strictly
            size="mini"
          />
        </el-col>
      </el-row>
      <label style="margin-top:5px; margin-bottom:3px">Type Description</label>
      <el-row>
        <el-col>
          <el-input
            v-model="form.type_description"
            type="text"
            style="margin-top:3px; margin-bottom:5px;"
            size="mini"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm">Cancel</el-button>
        <el-button type="danger" size="mini" :disabled="createSanctionTypeState.initial" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Message } from 'element-ui'
export default {
  name: 'Type',
  data() {
    return {
      searchQuery: '',
      modal_show: false,
      form: {
        action: 'Create',
        // input models
        level_number: null,
        level_description: null
      },
      query: {
        limit: 10,
        offset: 0
      }
    }
  },
  computed: {
    ...mapGetters(['sanctionTypes', 'fetchSanctionTypeState', 'sanctionTypeTotal', 'createSanctionTypeState', 'updateSanctionTypeState', 'sanctionTypeErrors'])
  },
  watch: {
    createSanctionTypeState({ initial, success, fail }) {
      if (success) {
        this.fetchSanctionTypes(this.query)
        Message.success({ message: 'Successfully defined Sanction Type', duration: '2500' })
        this.resetForm()
        this.modal_show = false
      } else if (fail) {
        Message.error({ message: this.sanctionTypeErrors, duration: '2500' })
      }
    },
    updateSanctionTypeState({ initial, success, fail }) {
      if (success) {
        this.fetchSanctionTypes(this.query)
        Message.success({ message: 'Successfully updated Sanction Type', duration: '2500' })
        this.resetForm()
        this.modal_show = false
      } else if (fail) {
        Message.error({ message: this.sanctionTypeErrors, duration: '2500' })
      }
    },
    searchQuery(newData) {
      if (newData !== '') {
        this.query['target[]'] = 'type_description'
        this.query.query = newData
        this.fetchSanctionTypes(this.query)
      } else {
        this.query['target[]'] = ''
        this.query.query = ''
        this.fetchSanctionTypes(this.query)
      }
    }
  },
  mounted() {
    this.fetchSanctionTypes(this.query)
  },
  methods: {
    ...mapActions(['fetchSanctionTypes', 'createSanctionTypes', 'updateSanctionTypes']),
    tableSizeChange(value) {
      this.query.limit = value
      this.fetchSanctionTypes(this.query)
    },
    tablePageChange(value) {
      this.query.offset = value - 1
      this.fetchSanctionTypes(this.query)
    },
    updateRow(row) {
      this.form.action = 'Update'
      this.form.id = row.id
      this.form.type_number = row.type_number
      this.form.type_description = row.type_description
      this.modal_show = true
    },
    resetForm() {
      this.form.action = 'Create'
      this.form.type_number = null
      this.form.type_description = null
    },
    cancelForm() {
      this.resetForm()
      this.modal_show = false
    },
    submitForm() {
      // submit action
      if (this.form.action == 'Create') {
        // create
        const data = {
          type_number: this.form.type_number,
          type_description: this.form.type_description
        }
        this.createSanctionTypes(data)
      } else {
        // update
        const data = {
          id: this.form.id,
          type_number: this.form.type_number,
          type_description: this.form.type_description
        }
        this.updateSanctionTypes(data)
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
