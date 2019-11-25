<template>
  <div class="app-container">
    <h4 style="color:#646464">Positions</h4>
    <!--
    <el-alert
      title="This list is uneditable, Please contact service provider."
      type="info"
      show-icon
    ></el-alert>-->

    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{ span:4 }">
        <el-input placeholder="Search..." size="mini" v-model="table.request.query">
          <!-- <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>-->
          <!-- <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>-->
        </el-input>
      </el-col>
      <el-col :md="{ span:12,offset:8 }">
        <el-pagination
          style="float:right"
          :pager-count="table.paginationCount"
          :page-sizes="[10,25,50]"
          :page-size="table.request.limit"
          layout="total, sizes, prev, pager, next"
          :total="fetchAccessLevelsData.count"
          background
          small
          @current-change="tablePageChange"
          @size-change="tableSizeChange"
          :current-page.sync="table.page"
        />
      </el-col>
      <el-col :md="{span:24}" style="padding-top:5px;">
        <el-button
          type="primary"
          size="mini"
          style="float:right"
          @click="createForm"
        >Create Position</el-button>
      </el-col>
    </el-row>
    <!-- Table -->
    <el-table
      :data="fetchAccessLevelsData.access_levels"
      style="width: 100%;margin-top:30px;"
      v-loading="fetchAccessLevelsState.initial"
      @sort-change="columnSort"
    >
      <el-table-column align="center" label="Code" sortable="custom" prop="code">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column align="center" label="Description" sortable="custom" prop="name">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="Head" sortable="custom" prop="parent.name">
        <template slot-scope="scope">
          <template v-if="scope.row.parent">{{ scope.row.parent.name }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="warning"
            :disabled="!scope.row.flag"
            @click="updateRow(scope.row)"
          >
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            :disabled="!scope.row.flag"
            @click="deleteRow(scope.row)"
          >
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.position.action+' Position'"
      width="30%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="form.position.dialog"
    >
      <el-row>
        <el-col>
          <label>Description</label>
        </el-col>
        <el-col style="margin-top:3px">
          <el-input
            size="mini"
            v-model="form.position.model.name"
            style="width:100%"
            placeholder="Description"
          ></el-input>
        </el-col>
        <el-col style="margin-top:10px;">
          <label>Supervising Position</label>
        </el-col>
        <el-col style="margin-top:3px">
          <el-select size="mini" style="width:100%" v-model="form.position.model.parent">
            <el-option
              v-for="(option,index) in form.position.options.parent.data"
              :key="index"
              :value="option.id"
              :label="option.name"
            ></el-option>
          </el-select>
        </el-col>
        <el-col style="margin-top:20px">
          <div style="float:right">
            <el-button size="mini" @click="cancelForm">Cancel</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="submitPosition"
              :loading="form.position.submit"
            >Confirm</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        position: {
          dialog: false,
          submit: false,
          action: "Create",
          options: {
            parent: {
              data: [],
              request: {
                sort: "name",
                order: "asc"
              }
            }
          },
          model: {
            name: null,
            code: null,
            parent: null,
            id: null
          }
        }
      },
      table: {
        paginationCount: 4,
        page: 1,
        loader: false,
        searchFields: ["name", "code"],
        data: [],
        request: {
          offset: 0,
          limit: 10,
          relations: ["parent"],
          sort: "created_at",
          order:"desc",
          target: null,
          query: "",
          name: null,
          code: null,
          parent_id: null
        }
      }
    };
  },
  mounted() {
    this.fetchAccessLevels(this.unsetNull(this.table.request));
  },
  watch: {
    deleteAccessLevelState({ initial, success, fail }) {
      if (success) {
        this.$message({
          type: "success",
          message: this.deleteAccessLevelTitle
        });
        this.fetchAccessLevels(this.unsetNull(this.table.request));
      }
      if (fail) {
        this.$message({
          type: "error",
          message: this.deleteAccessLevelTitle
        });
      }
    },
    updateAccessLevelState({ initial, success, fail }) {
      if (initial) {
        this.form.position.submit = true;
      }
      if (success) {
        this.form.position.submit = false;
        this.fetchAccessLevels(this.unsetNull(this.table.request));
        this.cancelForm();
        this.$message({
          type: "success",
          message: this.updateAccessLevelTitle
        });
      }
      if (fail) {
        this.form.position.submit = false;
        this.$message({
          type: "error",
          message: this.updateAccessLevelTitle
        });
      }
    },
    createAccessLevelState({ initial, success, fail }) {
      if (initial) {
        this.form.position.submit = true;
      }
      if (success) {
        this.form.position.submit = false;
        this.fetchAccessLevels(this.unsetNull(this.table.request));
        this.cancelForm();
        this.$message({
          type: "success",
          message: this.createAccessLevelTitle
        });
      }
      if (fail) {
        this.form.position.submit = false;
        this.$message({
          type: "error",
          message: this.createAccessLevelTitle
        });
      }
    },
    "table.request.query": function(v) {
      if (v == "") {
        this.table.request.target = null;
      } else {
        this.table.request.target = this.table.searchFields;
      }
      this.table.page = 1;
      this.table.request.offset = 0;
      this.fetchAccessLevels(this.unsetNull(this.table.request));
    }
  },
  computed: {
    ...mapGetters([
      "fetchAccessLevelsData",
      "fetchAccessLevelsState",
      "fetchAccessLevelsTitle",
      "createAccessLevelData",
      "createAccessLevelState",
      "createAccessLevelTitle",
      "updateAccessLevelData",
      "updateAccessLevelState",
      "updateAccessLevelTitle",
      "deleteAccessLevelData",
      "deleteAccessLevelState",
      "deleteAccessLevelTitle"
    ])
  },
  methods: {
    ...mapActions([
      "fetchAccessLevels",
      "createAccessLevel",
      "updateAccessLevel",
      "deleteAccessLevel"
    ]),
    getParentOptions() {
      this.axiosRequest(
        "get",
        "api/v1/position" +
          this.toUrlParams(this.form.position.options.parent.request),
        {}
      ).then(res => {
        this.form.position.options.parent.data = res.meta.access_levels;
        if (this.form.position.action == "Create") {
          this.form.position.model.parent = res.meta.access_levels[0].id;
        }
      });
    },
    deleteRow(data) {
      if (confirm("Delete confirmation. Proceed?")) {
        this.deleteAccessLevel({ id: data.id });
      }
    },
    updateRow(data) {
      this.form.position.model.id = data.id;
      this.form.position.model.name = data.name;
      this.form.position.model.parent = data.parent.id;
      this.form.position.action = "Update";
      this.getParentOptions();
      this.form.position.dialog = true;
    },
    submitPosition() {
      this.form.position.model.code = this.form.position.model.name
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .trim();
      if (this.form.position.action == "Create") {
        this.createAccessLevel(this.unsetNull(this.form.position.model));
      } else if (this.form.position.action == "Update") {
        this.updateAccessLevel(this.unsetNull(this.form.position.model));
      }
    },
    createForm() {
      this.form.position.dialog = true;
      this.clearForm();
      this.getParentOptions();
    },
    cancelForm() {
      this.form.position.dialog = false;
      this.clearForm();
    },
    clearForm() {
      this.form.position.model.name = null;
      this.form.position.model.code = null;
      this.form.position.model.parent = null;
      this.form.position.model.id = null;
      this.form.position.action = "Create";
    },
    tableSearch(v) {
      alert(v);
    },
    columnSort({ column, prop, order }) {
      this.table.page = 1;
      this.table.request.offset = 0;
      this.table.request.sort = order != null ? prop : "created_at";
      this.table.request.order = order != null ? order : "desc";
      this.fetchAccessLevels(this.unsetNull(this.table.request));
    },
    tableSizeChange(v) {
      this.table.page = 1;
      this.table.request.offset = 0;
      this.table.request.limit = v;
      this.fetchAccessLevels(this.unsetNull(this.table.request));
    },
    tablePageChange(v) {
      this.table.page = v;
      this.table.request.offset = (v - 1) * this.table.request.limit;
      this.fetchAccessLevels(this.unsetNull(this.table.request));
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
