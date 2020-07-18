<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px;">
              Sanction Type
            </div>
            <div
              class="button-icon round active"
              style="display:flex;justify-content:center;margin-right:5px;"
              @click="modal_show = true"
            >
              <el-tooltip placement="top" content="Add Sanction Type">
                <plus-icon></plus-icon>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 12 }">
          <div>
            <el-tooltip placement="top" content="Search">
              <el-input v-model="searchQuery" placeholder="Search...">
              </el-input>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="table-container shadow">
      <el-row>
        <el-col :md="{ span: 24 }">
          <!-- Search and Pagination -->
          <el-pagination
            style="float:right"
            :page-sizes="[10, 25, 50]"
            :page-size="query.limit"
            :pager-count="5"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            background
            small
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
          />
        </el-col>
        <el-col :md="24">
          <!-- Table -->
          <el-table
            v-loading="table_config.loader"
            :data="table_config.data"
            style="width: 100%;margin-top:5px;"
            class="monday"
          >
            <el-table-column align="center" label="Number" width="150">
              <template slot-scope="scope">
                <div style="height:45px;border-left:red 7px solid;display:flex">
                  <div style="width:100%;align-self:center;">
                    {{ scope.row.type_number }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Description">
              <template slot-scope="scope">
                <div class="d-flex">
                  <div
                    style="font-size:1.2em;font-weight:500;text-align:center;width:100%"
                  >
                    {{ scope.row.type_description }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Edit" width="50">
              <template slot-scope="scope">
                <el-tooltip content="Update Type" placement="top">
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
          </el-table>
        </el-col>
      </el-row>
    </div>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="modal_show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.action + ' Sanction Type'"
      width="30%"
    >
      <el-row>
        <el-col>
          <div class="form-label">Type Number</div>
          <div class="form-item">
            <el-input-number
              v-model="form.type_number"
              :step="1"
              step-strictly
              style="width:100%"
            />
          </div>
        </el-col>
        <el-col>
          <div class="form-label" style="margin-top:10px;">Type Description</div>
          <div class="form-item">
            <el-input v-model="form.type_description" type="text" />
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm">Cancel</el-button>
        <el-button
          type="danger"
          size="mini"
          :loading="form.confirm"
          @click="submitForm"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Message } from "element-ui";
export default {
  name: "Type",
  data() {
    return {
      searchQuery: "",
      modal_show: false,
      form: {
        action: "Create",
        // input models
        type_number: null,
        type_description: null,
        confirm: false
      },
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        sort: "created_at"
      },
      table_config: {
        page: 1,
        data: [],
        count: 0,
        loader: false
      }
    };
  },
  computed: {
    ...mapGetters([
      "sanctionTypes",
      "fetchSanctionTypeState",
      "createSanctionTypeState",
      "updateSanctionTypeState",
      "sanctionTypeErrors",
      "sanctionTypesSearch",
      "sanctionTypesSearchState"
    ])
  },
  watch: {
    fetchSanctionTypeState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.data = this.sanctionTypes.options;
        this.table_config.count = this.sanctionTypes.count;
        this.table_config.loader = false;
      } else if (fail) {
        this.table_config.loader = false;
      }
    },
    sanctionTypesSearchState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.data = this.sanctionTypesSearch.sanction_types;
        this.table_config.count = this.sanctionTypesSearch.count;
        this.table_config.loader = false;
      }
      if (fail) {
        this.table_config.data = this.sanctionTypesSearch.sanction_types;
        this.table_config.count = this.sanctionTypesSearch.count;
        this.table_config.loader = false;
      }
    },
    createSanctionTypeState({ initial, success, fail }) {
      if (initial) {
        this.form.confirm = true;
      }
      if (success) {
        this.form.confirm = false;
        this.fetchSanctionTypes(this.query);
        Message.success({
          message: "Successfully defined Sanction Type",
          duration: "2500"
        });
        this.resetForm();
        this.modal_show = false;
      } else if (fail) {
        this.form.confirm = false;
        Message.error({ message: this.sanctionTypeErrors, duration: "2500" });
      }
    },
    updateSanctionTypeState({ initial, success, fail }) {
      if (initial) {
        this.form.confirm = true;
      }
      if (success) {
        this.form.confirm = false;
        this.fetchSanctionTypes(this.query);
        Message.success({
          message: "Successfully updated Sanction Type",
          duration: "2500"
        });
        this.resetForm();
        this.modal_show = false;
      } else if (fail) {
        this.form.confirm = false;
        Message.error({ message: this.sanctionTypeErrors, duration: "2500" });
      }
    },
    searchQuery(newData) {
      if (newData !== "") {
        this.query.offset = 0;
        this.query["target[]"] = "type_description";
        this.query.query = newData;
        this.searchSanctionTypes(this.query);
      } else {
        this.query["target[]"] = "";
        this.query.query = "";
        this.fetchSanctionTypes(this.query);
      }
    }
  },
  mounted() {
    this.fetchSanctionTypes(this.query);
  },
  methods: {
    ...mapActions([
      "fetchSanctionTypes",
      "createSanctionTypes",
      "updateSanctionTypes",
      "searchSanctionTypes"
    ]),
    tableSizeChange(value) {
      this.query.limit = value;
      this.query.offset = 0;
      this.fetchSanctionTypes(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchSanctionTypes(this.query);
    },
    updateRow(row) {
      this.form.action = "Update";
      this.form.id = row.id;
      this.form.type_number = row.type_number;
      this.form.type_description = row.type_description;
      this.modal_show = true;
    },
    resetForm() {
      this.form.action = "Create";
      this.form.type_number = null;
      this.form.type_description = null;
    },
    cancelForm() {
      this.resetForm();
      this.modal_show = false;
    },
    submitForm() {
      // submit action
      if (this.form.action == "Create") {
        // create
        const data = {
          type_number: this.form.type_number,
          type_description: this.form.type_description
        };
        this.createSanctionTypes(data);
      } else {
        // update
        const data = {
          id: this.form.id,
          type_number: this.form.type_number,
          type_description: this.form.type_description
        };
        this.updateSanctionTypes(data);
      }
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
  border-left:5px solid crimson;
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
