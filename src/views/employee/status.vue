<template>
  <div class="app-container">
    <h4 style="color:#646464">User Status</h4>

    <!-- <el-row style="padding-right:8px;margin-bottom:30px;">
    </el-row> -->
    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{span:8}">
        <el-button :plain="true" size="mini" @click="createForm">Create Status</el-button>
      </el-col>
      <el-col :md="{span:16}">
        <el-pagination
        style="float:right"
          :page-sizes="[10,25,50]"
          :page-size="table_config.display_size"
          layout="total, sizes, prev, pager, next"
          :total="table_config.count"
          :current-page.sync="table_config.page"
          @size-change="tableSizeChange"
          @current-change="tablePageChange"
          background
          small
        />
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table :data="table_config.data" style="width: 100%;margin-top:30px;" v-loading="table_config.loader">
      <el-table-column align="center" label="Type">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column align="center" label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='active'? 'success':'danger'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template slot-scope="scope">
          <el-button :plain="true" size="mini" @click="updateRow(scope.row)">
            <i class="el-icon-edit-outline" />
          </el-button>
          <el-button :plain="true" size="mini" type="danger" @click="deleteRow({id:scope.row.id})">
            <i class="el-icon-delete" />
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
        <el-button type="danger" @click="submitForm" size="mini" :loading="form.confirm">Confirm</el-button>
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
        page: 1,
        loader:false,
        data:[],
        count:0,
      },
      query: {
        offset: 0,
        limit: 10,
        order:"desc",
        sort:"created_at"
      },
      form: {
        show: false,
        action: "Create",
        update_id:null,
        type: null,
        status: "active",
        confirm:false,
      }
    };
  },
  computed: {
    ...mapGetters(["statusList", "statusListCount","statusListState", "createUserStatusState", "updateUserStatusState", "deleteUserStatusState", "createUserStatusError", "updateUserStatusError", "deleteUserStatusError"])
  },
  created() {
    const data = this.query;
    this.fetchStatusList(data);
  },
  watch:{
    statusListState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true
        this.table_config.data = []
      }
      if(success){
        this.table_config.loader = false
        this.table_config.data = this.statusList
        this.table_config.count = this.statusListCount
      }
      if(fail){
        this.table_config.loader = false
        this.table_config.data = []
      }
    },
    createUserStatusState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true;
        this.form.confirm = true;
      }
      if(success){
        this.table_config.loader = false;
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchStatusList(this.query);
        this.$message({
          type:"success",
          message: "You have successfully created a status."
        });
      }
      if(fail){
        this.table_config.loader = false;
        this.form.confirm = false;

        this.$message({
          type:"error",
          message: "There is a problem in creating the status."
        });
      }
    },
    updateUserStatusState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true;
        this.form.confirm = true;
      }
      if(success){
        this.table_config.loader = false;
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchStatusList(this.query);
        this.$message({
          type:"success",
          message: "You have successfully updated a status."
        });
      }
      if(fail){
        this.table_config.loader = false;
        this.form.confirm = false;

        this.$message({
          type:"error",
          message: "There is a problem in updating the status."
        });
      }
    },
    deleteUserStatusState({initial,success,fail}){
      if(initial){
        this.table_config.loader = true;
      }
      if(success){
        this.table_config.loader = false;
        this.query.offset = 0;
        this.fetchStatusList(this.query);
        this.$message({
          type:"success",
          message: "You have successfully deleted a status."
        });
      }
      if(fail){
        this.table_config.loader = false;

        this.$message({
          type:"error",
          message: "There is a problem in deleting the status."
        });
      }
    }
  },
  methods: {
    ...mapActions(["fetchStatusList","createUserStatus","updateUserStatus","deleteUserStatus"]),
    deleteRow(data){
      if(confirm("This may affect other data in your system. Do you want to proceed?")){
        this.deleteUserStatus(data);
      }
    },
    submitForm() {
      const data = {
        type: this.form.type,
        status: this.form.status
      }

      if (this.form.action == "Create") {
        this.createUserStatus(data)
      } else {
        data.id = this.form.update_id;
        this.updateUserStatus(data)
      }
    },
    updateRow(row) {
      this.form.action = "Update"
      this.form.update_id = row.id;
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
      this.fetchStatusList(data) ;
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchStatusList(data);
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
