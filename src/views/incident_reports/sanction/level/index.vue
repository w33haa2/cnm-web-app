<template>
  <div class="app-container">
    <div class="title-bar shadow">
      <el-row>
        <el-col :md="{ span: 12 }">
          <div class="d-flex">
            <div class="title-wrapper" style="margin-right:10px;">
              Sanction Level
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
        <el-col :md="{ span: 24 }">
          <!-- Table -->
          <el-table
            v-loading="table_config.loader"
            :data="table_config.data"
            style="width: 100%;margin-top:5px;"
            class="monday"
          >
            <el-table-column align="center" label="Number" width="150">
              <template slot-scope="scope">
                <div style="display:flex">
                  <div style="width:100%;align-self:center;">
                    {{ scope.row.level_number }}
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
                    {{ scope.row.level_description }}
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
      :title="form.action + ' Sanction Level'"
      width="30%"
    >
      <el-row>
        <el-col>
          <div class="form-label">Level Number</div>
          <div class="form-item">
            <el-input-number
              v-model="form.level_number"
              style="margin-top:3px; margin-bottom:10px;width:100%"
              :step="1"
              step-strictly
            />
          </div>
        </el-col>
        <el-col>
          <div class="form-label" style="margin-top:10px">
            Level Description
          </div>
          <div class="form-item">
            <el-input
              v-model="form.level_description"
              type="text"
              style="margin-top:3px; margin-bottom:5px;"
            />
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
  name: "Level",
  data() {
    return {
      searchQuery: "",
      modal_show: false,
      form: {
        action: "Create",
        // input models
        level_number: null,
        level_description: null,
        confirm: false
      },
      query: {
        offset: 0,
        limit: 10,
        sort: "created_at",
        order: "desc"
      },
      table_config: {
        page: 1,
        data: [],
        count: 0,
        loader: false
      }
    };
  },
  mounted() {
    const data = this.query;
    this.fetchSanctionLevels(data);
  },
  computed: {
    ...mapGetters([
      "sanctionLevels",
      "sanctionLevelsSearch",
      "sanctionLevelsSearchState",
      "fetchSanctionLevelState",
      "createSanctionLevelState",
      "sanctionLevelErrors",
      "updateSanctionLevelState"
    ])
  },
  watch: {
    fetchSanctionLevelState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.data = this.sanctionLevels.options;
        this.table_config.count = this.sanctionLevels.count;
        this.table_config.loader = false;
      } else if (fail) {
        this.table_config.loader = false;
      }
    },
    sanctionLevelsSearchState({ initial, success, fail }) {
      if (initial) {
        this.table_config.loader = true;
      }
      if (success) {
        this.table_config.data = this.sanctionLevelsSearch.sanction_levels;
        this.table_config.count = this.sanctionLevelsSearch.count;
        this.table_config.loader = false;
      }
      if (fail) {
        this.table_config.data = [];
        this.table_config.count = 0;
        this.table_config.loader = false;
      }
    },
    searchQuery: function(newData) {
      if (newData !== "") {
        this.query.offset = 0;
        this.query["target[]"] = "level_description";
        this.query.query = newData;
        const data = this.query;
        this.searchSanctionLevels(data);
      } else {
        this.query["target[]"] = "";
        this.query.query = "";
        const data = this.query;
        this.fetchSanctionLevels(data);
      }
    },
    createSanctionLevelState({ initial, success, fail }) {
      if (initial) {
        this.form.confirm = true;
      }
      if (success) {
        this.form.confirm = false;

        const data = this.query;
        this.fetchSanctionLevels(data);
        Message.success({
          message: "Successfully defined Sanction Level",
          duration: "2500"
        });
        this.resetForm();
        this.modal_show = false;
      } else if (fail) {
        this.form.confirm = false;

        Message.error({ message: this.sanctionLevelErrors, duration: "2500" });
      }
    },
    updateSanctionLevelState({ initial, success, fail }) {
      if (initial) {
        this.form.confirm = true;
      }
      if (success) {
        this.form.confirm = false;
        const data = this.query;
        this.fetchSanctionLevels(data);
        Message.success({
          message: "Successfully updated Sanction Level",
          duration: "2500"
        });
        this.resetForm();
        this.modal_show = false;
      } else if (fail) {
        this.form.confirm = false;
        Message.error({ message: this.sanctionLevelErrors, duration: "2500" });
      }
    }
  },
  methods: {
    ...mapActions([
      "fetchSanctionLevels",
      "searchSanctionLevels",
      "createSanctionLevels",
      "updateSanctionLevels"
    ]),

    tableSizeChange(value) {
      this.query.limit = value;
      this.query.offset = 0;
      const data = this.query;
      this.fetchSanctionLevels({ data });
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchSanctionLevels({ data });
    },
    updateRow(row) {
      this.form.action = "Update";
      this.form.id = row.id;
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
        const data = {
          level_number: this.form.level_number,
          level_description: this.form.level_description
        };
        this.createSanctionLevels(data);
      } else {
        // update
        const data = {
          id: this.form.id,
          level_number: this.form.level_number,
          level_description: this.form.level_description
        };
        this.updateSanctionLevels(data);
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
