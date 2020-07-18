<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px">
              User Status
            </div>
            <div
              class="button-icon round active"
              style="display:flex;justify-content:center;margin-right:5px;"
              @click="createForm"
            >
              <el-tooltip placement="top" content="Add Employee">
                <plus-icon></plus-icon>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <el-tooltip placement="top" content="Search">
            <el-input
              type="text"
              placeholder="Search"
              v-model="query.query"
              @input="debounceInput"
            ></el-input>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <!-- <el-row style="padding-right:8px;margin-bottom:30px;">
    </el-row> -->
    <!-- Search and Pagination -->
    <div class="table-container shadow">
      <el-row>
        <el-col :md="{ span: 24 }">
          <el-pagination
            style="float:right"
            :pager-count="5"
            :page-sizes="[10, 25, 50]"
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
        <el-col :md="{ span: 24 }">
          <!-- Table -->
          <el-table
            :data="table_config.data"
            style="width: 100%;margin-top:5px;"
            v-loading="table_config.loader"
            class="monday"
            @sort-change="customSort"
          >
            <el-table-column label="Type" sortable="custom" prop="type">
              <template slot-scope="scope">
                <div style="padding-left:20px;">
                  {{ scope.row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Status" width="100"  sortable="custom" prop="status">
              <template slot-scope="scope">
                <div
                  :class="
                    scope.row.status == 'active'
                      ? 'tag tag-success'
                      : 'tag tag-danger'
                  "
                  class="d-flex"
                  style="justify-content:center"
                >
                  <div style="align-self:center">
                    {{ scope.row.status.toUpperCase() }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-tooltip placement="top" content="Update">
                  <div
                    style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                    @click="updateRow(scope.row)"
                  >
                    <div style="align-self:center;color:gray;font-size:2em">
                      <square-edit-icon></square-edit-icon>
                    </div>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-tooltip content="Delete" placement="top">
                  <div
                    style="height:45px;display:flex;justify-content:center;cursor:pointer;"
                    @click="deleteRow(scope.row)"
                  >
                    <div style="align-self:center;color:gray;font-size:2em">
                      <delete-icon></delete-icon>
                    </div>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>

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
        <el-button
          type="danger"
          @click="submitForm"
          size="mini"
          :loading="form.confirm"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {debounce} from "debounce";
const default_status = ["new hired","active","suspended", "terminated", "resigned"];
export default {
  data() {
    return {
      table_config: {
        display_size: 10,
        page: 1,
        loader: false,
        data: [],
        count: 0
      },
      query: {
        target:['status',"type"],
        query:null,
        offset: 0,
        limit: 10,
        order: "desc",
        sort: "created_at"
      },
      form: {
        show: false,
        action: "Create",
        update_id: null,
        type: null,
        status: "active",
        confirm: false
      }
    };
  },
  computed: {
    ...mapGetters([
      "statusList",
      "statusListCount",
      "statusListState",
      "createUserStatusState",
      "updateUserStatusState",
      "deleteUserStatusState",
      "createUserStatusError",
      "updateUserStatusError",
      "deleteUserStatusError"
    ])
  },
  created() {
    const data = this.query;
    this.fetchStatusList(data);
  },
  watch: {
    statusListState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
        this.table_config.data = [];
      }
      if (success) {
        this.table_config.loader = false;
        this.table_config.data = this.statusList.statuses;
        this.table_config.count = this.statusList.count;
      }
      if (fail) {
        this.table_config.loader = false;
        this.table_config.data = [];
      }
    },
    createUserStatusState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
        this.form.confirm = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchStatusList(this.query);
        this.$message({
          type: "success",
          message: "You have successfully created a status."
        });
      }
      if (fail) {
        this.table_config.loader = false;
        this.form.confirm = false;

        this.$message({
          type: "error",
          message: "There is a problem in creating the status."
        });
      }
    },
    updateUserStatusState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
        this.form.confirm = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.form.confirm = false;
        this.query.offset = 0;
        this.form.show = false;
        this.resetForm();
        this.fetchStatusList(this.query);
        this.$message({
          type: "success",
          message: "You have successfully updated a status."
        });
      }
      if (fail) {
        this.table_config.loader = false;
        this.form.confirm = false;

        this.$message({
          type: "error",
          message: "There is a problem in updating the status."
        });
      }
    },
    deleteUserStatusState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.loader = false;
        this.query.offset = 0;
        this.fetchStatusList(this.query);
        this.$message({
          type: "success",
          message: "You have successfully deleted a status."
        });
      }
      if (fail) {
        this.table_config.loader = false;

        this.$message({
          type: "error",
          message: "There is a problem in deleting the status."
        });
      }
    }
  },
  methods: {
    ...mapActions([
      "fetchStatusList",
      "createUserStatus",
      "updateUserStatus",
      "deleteUserStatus"
    ]),
    customSort({ column, prop, order }) {
      this.query.sort = null;
      this.query.order = null;
      if (order) {
        this.query.sort = prop;
        this.query.order = order == "ascending" ? "asc" : "desc";
      }else{
        this.query.sort = "updated_at";
        this.query.order = "asc";
      }
      this.fetchStatusList(this.query);
    },
    debounceInput: debounce(function (e) {
      this.fetchStatusList(this.query);
    }, 1000),
    deleteRow(data) {
      let temp = default_status.filter(i=> i == data.type.toLowerCase()),readOnly=false;
      
      if(temp.length>0){
        readOnly = true;
      }

      if(readOnly){
        alert("Unable to delete system defaults.");
      }else{
        if (
          confirm(
            "This may affect other data in your system. Do you want to proceed?"
          )
        ) {
          this.deleteUserStatus(data);
        }
      }
    },
    submitForm() {
      const data = {
        type: this.form.type,
        status: this.form.status
      };

      if (this.form.action == "Create") {
        this.createUserStatus(data);
      } else {
        data.id = this.form.update_id;
        this.updateUserStatus(data);
      }
    },
    updateRow(row) {
      let temp = default_status.filter(i=> i == row.type.toLowerCase()),readOnly=false;
      
      if(temp.length>0){
        readOnly = true;
      }

      if(readOnly){
        alert("Unable to update system defaults.")
      }else{
        this.form.action = "Update";
        this.form.update_id = row.id;
        this.form.show = true;
        this.form.status = row.status.toLowerCase();
        this.form.type = row.type.toLowerCase();
      }
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
      this.fetchStatusList(data);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchStatusList(data);
    }
  }
};
</script>

<style scoped>
.user-block >>> .img-circle {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.monday >>> td > .user-block >>> div > img {
  padding: 0px;
  margin: 0px;
}

.monday >>> th {
  background-color: white !important;
  border-top: none;
  border-right: none;
  border-left: none;
}

.monday >>> th >>> .cell {
  font-weight: light !important;
}
.monday >>> td:first-child {
  border-left: 5px solid crimson;
  height: 45px;
}
.monday >>> .el-table__row tr {
  background-color: #efefef;
  border-left: white solid 1px;
  border-bottom: white solid 1px;
  padding: 0px;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.monday >>> td {
  background-color: #efefef;
  border: white solid 1px;
  padding: 0px;
}
.monday >>> .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.monday >>> td {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

th >>> .cell {
  font-weight: normal !important;
  font-size: 0.8em !important;
}
</style>
