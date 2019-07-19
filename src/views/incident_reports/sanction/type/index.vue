<template>
  <div class="app-container">
    <h4 style="color:#646464">Sanction Level</h4>

    <el-row>
      <el-col>
        <el-button :plain="true" size="mini" @click="modal_show = true">Create Saction Type</el-button>
      </el-col>
    </el-row>

    <!-- Search and Pagination -->
    <el-row style="width: 100%;margin-top:30px;">
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[25, 50, 100]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="25"
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
    <el-table :data="sanction_types" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="Type Number">
        <template slot-scope="scope">{{ scope.row.type_number }}</template>
      </el-table-column>
      <el-table-column align="center" label="Type Description">
        <template slot-scope="scope">{{ scope.row.type_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Edit">
        <el-button :plain="true" size="mini">
          <i class="el-icon-edit-outline" />
        </el-button>
      </el-table-column>
    </el-table>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="modal_show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.action + ' Sanction Type'"
    >
      <label width="100%">Type Number</label>
      <el-row>
        <el-col>
          <el-input-number
            v-model="form.type_number"
            style="margin-top:3px; margin-bottom:10px;width:100%"
            :step="1"
            step-strictly
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
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Level",
  data() {
    return {
      sanction_levels: [
        { id: 1, level_number: 1, level_description: "Written" },
        { id: 2, level_number: 2, level_description: "Verbal" }
      ],
      modal_show: false,
      form: {
        action: "Create",
        // input models
        level_number: null,
        level_description: null
      }
    };
  },
  methods: {
    resetForm() {
      this.form.action = "Create";
      this.form.level_number = null;
      this.form.level_description = null;
    },
    cancelForm() {
      this.resetForm();
      this.modal_show = false;
    },
    submitForm() {
      // submit action
    }
  }
};
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
