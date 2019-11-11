<template>
  <div class="app-container">
    <!-- Search and Pagination -->
    <el-row>
      <el-col :md="{span:4}">
        <el-input size="mini" v-model="searchQuery" placeholder="Search"></el-input>
      </el-col>
      <el-col :md="{span:24}">
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
    <el-table
      :data="table_config.data"
      style="width: 100%;margin-top:30px;"
      v-loading="table_config.loader"
    >
      <el-table-column label="Agent">
        <template slot-scope="scope">
          <div class="user-block">
            <img v-if="scope.row.user.image_url" class="img-circle" :src="scope.row.user.image_url" />
            <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
              <div
                style="align-self:center;width:100%;text-align:center;"
                class="text-point-eight-em"
              >{{ getAvatarLetters(scope.row.user.firstname,scope.row.user.lastname) }}</div>
            </div>
            <span>{{ scope.row.user.full_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Credits">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template slot-scope="scope">
          <el-button :plain="true" size="mini" @click="updateRow(scope.row)">
            <i class="el-icon-edit-outline" />
          </el-button>
          <!-- <el-button :plain="true" size="mini" type="danger" @click="deleteRow(scope.row)">
            <i class="el-icon-delete" />
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.credits.update.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="form.credits.update.title"
      width="40%"
    >
      <el-row>
        <el-col>
          <label width="100%">Value</label>
          <el-input-number
            style="margin-top:5px;width:100%"
            size="mini"
            step="1"
            v-model="form.credits.update.model.value"
          ></el-input-number>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateForm" size="mini">Cancel</el-button>
        <el-button
          type="danger"
          @click="submitUpdateForm"
          size="mini"
          :loading="form.credits.update.confirm"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  props: ["activeTab", "tabName", "refresh"],
  data() {
    return {
      searchQuery: "",
      table_config: {
        display_size: 10,
        page: 1,
        loader: false,
        data: [],
        count: 0
      },
      query: {
        offset: 0,
        limit: 10,
        order: "desc",
        sort: "created_at",
        leave_type: "",
        "relations[]": "user"
      },
      filter: {
        om_id: null,
        tl_id: null
      },
      form: {
        credits: {
          update: {
            dialog: false,
            title: null,
            confirm: false,
            model: {
              id: null,
              value: 0
            }
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "position",
      "head_id",
      "user_id",
      "fetchLeaveCreditsState",
      "fetchLeaveCreditsData",
      "fetchLeaveCreditsTitle",
      "searchLeaveCreditsState",
      "searchLeaveCreditsData",
      "searchLeaveCreditsError",
      "updateLeaveCreditsState",
      "updateLeaveCreditsData",
      "updateLeaveCreditsError"
    ])
  },
  watch: {
    fetchLeaveCreditsState({ initial, success, fail }) {
      if (this.tabName == this.activeTab) {
        if (initial) {
          this.table_config.loader = true;
        }
        if (success) {
          this.table_config.loader = false;
          this.table_config.count = this.fetchLeaveCreditsData.count;
          this.table_config.data = this.fetchLeaveCreditsData.leave_credits;
        }
        if (fail) {
          this.table_config.loader = false;
          this.$message({
            type: "error",
            message: this.fetchLeaveCreditsTitle,
            duration: 5000
          });
        }
      }
    },
    searchLeaveCreditsState({ initial, success, fail }) {
      if (this.tabName == this.activeTab) {
        if (initial) {
          this.table_config.loader = true;
        }
        if (success) {
          this.table_config.loader = false;
          this.table_config.count = this.searchLeaveCreditsData.count;
          this.table_config.data = this.searchLeaveCreditsData.leave_credits;
        }
        if (fail) {
          this.table_config.loader = false;
          this.$message({
            type: "error",
            message: "There is a problem processing your request.",
            duration: 5000
          });
        }
      }
    },
    updateLeaveCreditsState({ initial, success, fail }) {
      if (this.tabName == this.activeTab) {
        if (initial) {
          this.form.credits.update.confirm = true;
        }
        if (success) {
          this.form.credits.update.confirm = false;
          this.form.credits.update.dialog = false;
          this.fetchLeaveCredits(this.query);
          this.$message({
            type: "success",
            message: "You have successfully updated leave credits.",
            duration: 5000
          });
        }
        if (fail) {
          this.form.credits.update.confirm = false;
          this.$message({
            type: "error",
            message: "There is a problem processing your request.",
            duration: 5000
          });
        }
      }
    },
    refresh(v) {
      if (this.tabName == this.activeTab) {
        this.fetchLeaveCredits(this.query);
      }
    },
    searchQuery(v) {
      if (this.tabName == this.activeTab) {
        if (v != "") {
          this.query["target[]"] = "full_name";
          this.query["query"] = v;
          this.searchLeaveCredits(this.query);
        } else {
          delete this.query["target[]"];
          delete this.query["query"];
          this.fetchLeaveCredits(this.query);
        }
      }
    },
    activeTab(v) {
      if (this.tabName == v) {
        this.query.leave_type = v;
        this.fetchLeaveCredits(this.query);
      }
    }
  },
  methods: {
    ...mapActions([
      "fetchLeaveCredits",
      "searchLeaveCredits",
      "updateLeaveCredits"
    ]),
    cancelUpdateForm() {
      this.form.credits.update.dialog = false;
      this.form.credits.update.title = null;
      this.form.credits.update.confirm = false;
    },
    submitUpdateForm() {
      if (confirm("Are you sure you want to apply changes?")) {
        this.updateLeaveCredits(this.form.credits.update.model);
      }
    },
    updateRow(data) {
      // this.revertOvertimeSchedule({schedules:[{id:data.id}]})
      this.form.credits.update.dialog = true;
      this.form.credits.update.title =
        "Updating " +
        data.user.full_name +
        "'s " +
        this.remUnderscore(data.leave_type);
      this.form.credits.update.confirm = false;
      this.form.credits.update.model.id = data.id;
      this.form.credits.update.model.value = 0;
      // console.log(data)
    },
    tableSizeChange(value) {
      this.query.limit = value;
      this.fetchLeaveCredits(this.query);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      this.fetchLeaveCredits(this.query);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-block {
  .username,
  .description {
    display: block;
    margin-left: 50px;
    padding: 2px 0;
  }
  .username {
    // font-size: 0.8em;
    color: #777;
  }
  :after {
    clear: both;
  }
  .img-circle {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    float: left;
  }
  span {
    font-weight: 500;
    margin-left: 10px;
    // font-size: 0.8em;
  }
}
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
