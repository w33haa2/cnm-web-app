<template>
  <div>
    <div style="padding:20px;border:#ccc solid 1px;border-radius:4px;margin-top:30px;">
      <h4 style="margin-top:0px;color:#646464">{{ report.title_action }} Report Form</h4>
      <el-row style="margin-bottom:4px;">
        <el-col :md="{span:2}" style="display:flex;padding:8px;">
          <label style="align-self:center;align:right;font-weight:normal" class="text-muted">To</label>
        </el-col>
        <el-col :md="{span:22}">
          <auto-complete-input
            :placeholder="'File report to...'"
            :options="options.offspring"
            @selected="user_reports_id"
          />
        </el-col>
      </el-row>
      <el-row style="margin-bottom:4px;">
        <el-col :md="{span:2}" style="display:flex;padding:8px;">
          <label style="align-self:center;align:right;font-weight:normal" class="text-muted">Type</label>
        </el-col>
        <el-col :md="{span:10}">
          <el-select
            v-model="report.form.sanction_type_id"
            size="mini"
            placeholder="Sanction Type"
            class="w-100"
          >
            <el-option
              v-for="(option,index) in options.type"
              :key="index"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </el-col>
        <el-col :md="{span:2}" style="display:flex;padding:8px;">
          <label style="align-self:center;align:right;font-weight:normal" class="text-muted">Level</label>
        </el-col>
        <el-col :md="{span:10}">
          <el-select
            v-model="report.form.sanction_level_id"
            size="mini"
            placeholder="Sanction Level"
            class="w-100"
          >
            <el-option
              v-for="(option,index) in options.level"
              :key="index"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:4px;">
        <el-col :md="{span:2}" style="display:flex;padding:8px;">
          <label
            style="align-self:center;align:right;font-weight:normal"
            class="text-muted"
          >Description</label>
        </el-col>
        <el-col :md="{span:22}">
          <el-input
            v-model="report.form.description"
            type="textarea"
            placeholder="Description..."
            size="mini"
          />
        </el-col>
      </el-row>
      <el-button
        size="mini"
        type="primary"
        :plain="true"
        :loading="report.onSubmit.loading"
        @click="formSubmit"
      >Confirm</el-button>
    </div>
  </div>
</template>

<script>
import AutoCompleteInput from './autoComInput'
export default {
  name: 'ReportForm',
  components: { AutoCompleteInput },
  props: ['action', 'updateId'],
  data() {
    return {
      report: {
        onSubmit: {
          loading: false
        },
        form: {
          user_reports_id: null,
          filed_by: null,
          sanction_type_id: null,
          sanction_level_id: null,
          description: null,
          status: 'new'
        },
        action: this.action,
        title_action: null
      },
      //   test data only
      options: {
        // must bu loaded from sanction_types db table
        type: [
          { value: 1, label: 'Absentism' },
          { value: 2, label: 'Tardy' },
          { value: 3, label: 'Littering' }
        ],
        // must bu loaded from sanction_levels db table
        level: [{ value: 1, label: 'Verbal' }, { value: 2, label: 'Written' }],

        // must bu loaded from database
        // list of employees under the current user
        offspring: [
          { id: 1, value: 'ABL', hint: 'Senior Developer' },
          { id: 2, value: 'Mr. Robot', hint: 'Senior Developer' },
          { id: 3, value: 'Pusher', hint: 'Senior Developer' }
        ]
      }
    }
  },
  watch: {
    action: function() {
      if (this.action == 'update') {
        this.report.action = this.action
        this.report.title_action = 'Update'
      }
    }
  },
  created() {
    if (this.action == 'create') {
      this.report.title_action = 'Create'
    } else if (this.action == 'update') {
      this.report.title_action = 'Update'
    }
  },
  methods: {
    // assigning values from AutoCompleteInput component
    user_reports_id(value) {
      this.report.form.user_reports_id = value
    },

    formSubmit() {
      this.report.onSubmit.loading = true
      // do post here
      setInterval(() => {
        this.report.onSubmit.loading = false
      }, 5000)
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
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .label {
      text-overflow: ellipsis;
      overflow: hidden;
      float: left;
    }
    .position {
      font-size: 12px;
      color: #b4b4b4;
      float: right;
    }
  }
}
</style>
