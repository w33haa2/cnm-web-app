<template>
  <div class="app-container">
    <h4 style="color:#646464">Status</h4>

    <el-row style="padding-right:8px;margin-bottom:30px;">
      <el-col>
        <el-button :plain="true" size="mini" @click="createForm">Create Status</el-button>
      </el-col>
    </el-row>
    <!-- Search and Pagination -->
    <el-row>
      <el-col>
        <el-pagination
          :page-sizes="[10,25,50]"
          :page-size="table_config.display_size"
          layout="total, sizes, prev, pager, next"
          :total="statusListCount"
          :current-page.sync="table_config.page"
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
          background
          small
        />
      </el-col>
      <!-- <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>-->
    </el-row>

    <!-- Table -->
    <el-table :data="statusList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="Type">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column align="center" label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='active'? 'success':'danger'">{{ scope.row.status }}</el-tag>
        </template>
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
      :visible.sync="form.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.action + ' Status'"
      width="30%"
    >
      <label width="100%">Type</label>
      <el-row>
        <el-col>
          <el-input
            v-model="form.type"
            style="margin-top:3px; margin-bottom:10px;width:100%"
            size="mini"
          />
        </el-col>
      </el-row>
      <label style="margin-top:5px; margin-bottom:3px">Status</label>
      <el-row>
        <el-col>
          <el-select size="mini" v-model="form.status" style="width:100%">
            <el-option value="active" label="Active" />
            <el-option value="inactive" label="Inactive" />
          </el-select>
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
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      table_config: {
        display_size: 10,
        page: 1
      },
      query: {
        offset: 0,
        limit: 10
      },
      form: {
        show: false,
        action: "Create",
        type: null,
        status: "active"
      }
    };
  },
  computed: {
    ...mapGetters(["statusList", "statusListCount"])
  },
  created() {
    const data = this.query;
    this.fetchStatusList({ data });
  },
  methods: {
    ...mapActions(["fetchStatusList"]),
    submitForm() {
      if (this.form.action == "Create") {
        alert("ADD");
      } else {
        alert("UPDATE");
      }
    },
    updateRow(row) {
      this.form.show = true;
      this.form.status = row.status.toLowerCase();
      this.form.type = row.type.toLowerCase();
    },
    createForm() {
      this.form.show = true;
    },
    cancelForm() {
      this.resetForm();
      this.form.show = false;
    },
    resetForm() {
      this.form.action = "Create";
      this.form.type = null;
      this.form.status = "active";
    },
    filterHeadName(head_id) {
      return accesslevels.filter(i => i.id == head_id)[0].name;
    },
    tableSizeChange(value) {
      this.query.limit = value;
      const data = this.query;
      this.fetchStatusList({ data });
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchStatusList({ data });
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
