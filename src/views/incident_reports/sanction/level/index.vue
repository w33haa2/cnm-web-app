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
    <el-table :data="sanction_levels" style="width: 100%;margin-top:30px;">
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
        <el-button @click="cancelForm" size="mini">Cancel</el-button>
        <el-button type="danger" @click="submitForm" size="mini">Confirm</el-button>
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
    updateRow(row) {
      this.form.action = "Update";
      this.form.level_number = row.level_number;
      this.form.level_description = row.level_description;
      this.modal_show = true;
    },
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
      if (this.form.action == "Create") {
        // create
      } else {
        // update
      }
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
