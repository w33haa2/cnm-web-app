<template>
  <div>
    <el-button size="mini" style="float:right " :plain="true" @click="dialog=true">Reassign</el-button>

    <el-dialog
      width="300px"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialog"
      title="Reassign Form"
      top="5vh"
    >
      <el-row gutter="20">
        <!-- the form -->
        <el-col :md="{span:24}">
          <el-row>
            <el-col style="margin-bottom:10px;">
              <label>Head</label>
              <el-select
                v-model="form.reassign.field.head"
                class="form-input"
                style="width:100%;margin-top:5px"
                size="mini"
                filterable
                remote
                reserve-keyword
                placeholder="Head..."
                :remote-method="remoteHead"
                :loading="remote.head.loader"
              >
                <el-option
                  v-for="item in remote.head.options"
                  :key="item.id"
                  :label="item.full_name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col style="margin-bottom:10px;">
              <label>{{ action=='reassign' ? 'Subordinates' : 'Employees' }}</label>
              <template v-if="action=='reassign'">
                <el-select
                  v-model="form.reassign.field.subordinates"
                  class="form-input"
                  style="width:100%;margin-top:5px"
                  size="mini"
                  multiple
                  filterable
                  remote
                  :collapse-tags="false"
                  reserve-keyword
                  placeholder="Subordinates..."
                  :remote-method="remoteChild"
                  :loading="remote.sub.loader"
                  :disabled="!remote.sub.request.head_id"
                >
                  <el-option
                    v-for="item in remote.sub.options"
                    :key="item.id"
                    :label="item.full_name"
                    :value="item.id"
                  />
                </el-select>
              </template>
              <template v-else>
                <el-input
                  size="mini"
                  style="width:100%;margin-top:5px;"
                  v-model="form.promote.field.employees"
                ></el-input>
              </template>
            </el-col>
            <el-col style="margin-bottom:10px;">
              <label>Start Date</label>
              <el-date-picker
                v-model="form.reassign.field.start_date"
                size="mini"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width:100%;margin-top:5px;"
              />
            </el-col>
            <el-col style="margin-top:20px;">
              <div style="float:right">
                <el-button size="mini" @click="closeForm">Close</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  :loading="form.reassign.btn_loader"
                  @click="submitForm"
                >Submit</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.reassign.import_report.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Importing Data..."
      width="600px"
      top="5vh"
    >
      <el-alert
        title="Import Report"
        type="info"
        description="This report will only be displayed once every import. Please review results to reupload unimported data."
        show-icon
      ></el-alert>

      <div style="width:100%;margin-bottom:20px;margin-top:15px;">
        Progress
        <span>( {{ form.reassign.import_report.loop_index }}</span>/
        <span>{{ form.reassign.import_report.arr_length }} )</span>
      </div>
      <el-progress
        :percentage="form.reassign.import_report.progress"
        :text-inside="true"
        :stroke-width="18"
      ></el-progress>
      <div style="padding-bottom:15px;  ">
        <el-tabs
          v-model="form.reassign.import_report.active_tab"
          type="border-card"
          style="margin-top:15px;margin-bottom:10px;"
        >
          <el-tab-pane :label="'All: '+form.reassign.import_report.data_result.length" name="all">
            <el-table :data="form.reassign.import_report.data_result" height="350px">
              <el-table-column label="Head">
                <template scope="scope">{{scope.row.head.full_name}}</template>
              </el-table-column>
              <el-table-column label="Subordinate">
                <template scope="scope">{{scope.row.subordinate.full_name}}</template>
              </el-table-column>
              <el-table-column label="Start date">
                <template scope="scope">{{scope.row.start_date}}</template>
              </el-table-column>
              <el-table-column label="Status">
                <template scope="scope">
                  <el-tag
                    size="mini"
                    :type="scope.row.status==1?'success':'danger'"
                  >{{ scope.row.title }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            :label="'Errors: ' +form.reassign.import_report.data_result.filter(i=> i.status_code!=200).length "
            name="errors"
          >
            <el-table
              :data="form.reassign.import_report.data_result.filter(i=> i.status_code!=200)"
              height="350px"
            >
              <el-table-column label="Head" width="100">
                <template scope="scope">{{scope.row.head.full_name}}</template>
              </el-table-column>
              <el-table-column label="Subordinate" width="350">
                <template scope="scope">{{scope.row.subordinate.full_name}}</template>
              </el-table-column>
              <el-table-column label="Start date">
                <template scope="scope">{{scope.row.start_date}}</template>
              </el-table-column>
              <el-table-column label="Status">
                <template scope="scope">
                  <el-tag
                    size="mini"
                    :type="scope.row.status==1?'success':'danger'"
                  >{{ scope.row.title }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-button size="mini" @click="closeImportReport" style="float:right">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      urls: {
        remote: "api/v1/users/remote"
      },
      dialog: false,
      action: "reassign",
      form: {
        reassign: {
          model: [],
          btn_loader: false,
          field: {
            head: null,
            subordinates: [],
            start_date: null
          },
          import_report: {
            active_tab: "all",
            progress: 0,
            loop_index: 0,
            arr_length: 0,
            data_result: [],
            dialog: false,
            importing: false
          }
        },
        promote: {
          model: [],
          field: {
            head: null,
            employees: [],
            start_date: null
          }
        },
        table: {
          data: [],
          request: {
            promise: null,
            loader: false,
            relations: ["user_info"],
            positions: []
          }
        }
      },
      remote: {
        head: {
          options: [],
          promise: null,
          loader: false,
          request: {
            list: "heads",
            department: "all",
            full_name: null
          }
        },
        sub: {
          options: [],
          promise: null,
          loader: false,
          request: {
            list: "subordinates",
            head_id: null,
            full_name: null
          }
        }
      }
    };
  },
  mounted() {
    this.fetchUserRemote(this.remote.head.request);
  },
  computed: {
    ...mapGetters(["token"]),
    reassign_model() {
      let result = [],
        parent_id = this.form.reassign.field.head,
        start_date = this.form.reassign.field.start_date;
      this.form.reassign.field.subordinates.forEach((v, i) => {
        result.push({
          parent_id: parent_id,
          child_id: v,
          start_date: start_date
        });
      });
      console.log(result);
      return result;
    }
  },
  watch: {
    // "form.reassign.field.subordinates": function(v) {
    //   if (v.length > 0) {
    //     let newId = v.diff(this.form.table.data.map(i => i.id));
    //     // alert(v);
    //     if (newId.length > 0) {
    //       this.form.table.data.push(
    //         this.form.remote.sub.options.filter(i => i.id == newId[0])[0]
    //       );
    //     }
    //   } else {
    //     this.form.table.data = [];
    //   }
    // },
    "form.reassign.import_report.loop_index": function(v) {
      if (this.form.reassign.import_report.importing) {
        if (
          this.form.reassign.import_report.arr_length ==
          this.form.reassign.import_report.loop_index
        ) {
          this.form.reassign.import_report.importing = false;
          this.form.reassign.btn_loader = false;
          this.$emit("refresh", true);
        }
      }
    },
    "form.reassign.field.head": function(v) {
      this.remote.sub.request.head_id = v;
      this.form.reassign.field.subordinates = [];
      this.remote.sub.options = [];
    }
  },
  methods: {
    closeImportReport() {
      if (this.form.reassign.import_report.importing) {
        this.$message({
          type: "warning",
          message:
            "The app is still importing your data. Please wait until the process is done.",
          duration: 10000
        });
      } else {
        if (confirm("Are you sure you have reviewed the report?")) {
          this.form.reassign.import_report.dialog = false;
        }
      }
    },
    loopRequest() {
      let url = "api/v1/hierarchy_log/create",
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        },
        tmp_data = [],
        tmp_loop_index = 0;
      this.form.reassign.import_report.importing = true;
      this.form.reassign.import_report.loop_index = 0;
      this.form.reassign.import_report.arr_length = this.reassign_model.length;
      this.form.reassign.import_report.progress = 0;
      this.reassign_model.forEach((v, i) => {
        axios
          .post(url, v, options)
          .then(res => {
            tmp_loop_index++;
            this.form.reassign.import_report.loop_index = tmp_loop_index;
            this.form.reassign.import_report.progress =
              (this.form.reassign.import_report.loop_index /
                this.form.reassign.import_report.arr_length) *
              100;
            tmp_data.push(res.data.meta);
            this.form.reassign.import_report.data_result = tmp_data;
          })
          .catch(err => {
            tmp_loop_index++;
            this.form.reassign.import_report.loop_index = tmp_loop_index;
            this.form.reassign.import_report.progress =
              (this.form.reassign.import_report.loop_index /
                this.form.reassign.import_report.arr_length) *
              100;
            tmp_data.push(err.response.data.meta);
            this.form.reassign.import_report.data_result = tmp_data;
          });
      });
    },
    submitForm() {
      this.form.reassign.btn_loader = true;
      let form = this.form.reassign.field;
      if (
        form.head != null &&
        form.subordinates.length > 0 &&
        form.start_date != null
      ) {
        this.form.reassign.import_report.loop_index = 0;
        this.form.reassign.import_report.arr_length = 0;
        this.form.reassign.import_report.progress = 0;
        this.form.reassign.import_report.dialog = true;
        this.loopRequest();
      } else {
        this.$message({
          type: "info",
          message: "Please fill all fields.",
          duration: 5000
        });
        this.form.reassign.btn_loader = false;
      }
    },

    closeForm() {
      this.dialog = false;
      this.form.reassign.filed.head = null;
      this.form.reassign.filed.subordinates = [];
      this.form.reassign.filed.start_date = null;
      this.remote.head.options = [];
      this.remote.sub.options = [];
    },
    // ...mapActions(["fetchUserRemote"]),
    // remote for active tl and om list
    fetchUserRemote(params) {
      // init url
      // params.loader = true;
      let url = this.processRequestUrl(params.request, "api/v1/users/remote");

      params.promise = new Promise((resolve, reject) => {
        axios
          .get(url, {
            headers: {
              Authorization: "Bearer " + this.token
            }
          })
          .then(res => {
            // console.log(res);
            resolve(res.data.meta);
            // params.loader = false;
          })
          .catch(err => {
            // console.log(err.response.data);
            // params.loader = false;
          });
      });
    },
    remoteHead(q) {
      if (q != "") {
        this.remote.head.request.full_name = q;
        this.fetchUserRemote(this.remote.head);
        this.remote.head.promise.then(res => {
          this.remote.head.options = res.remote;
        });
      }
    },
    remoteChild(q) {
      if (q != "") {
        this.remote.sub.request.full_name = q;
        this.fetchUserRemote(this.remote.sub, q);
        this.remote.sub.promise.then(res => {
          this.remote.sub.options = res.remote;
        });
      }
    },
    fetchTableData() {
      this.fetchUserRemote(
        this.form.table.request,
        "",
        this.form.reassign.field.subordinates
      );
      this.form.table.request.promise.then(res => {
        this.form.table.data = res.remote;
      });
    },
    processRequestUrl(obj, url) {
      // returns endpoint
      if(obj){
      let tmp = obj,
        base_url = url,
        keys = Object.keys(tmp),
        url_params = "";
      keys.forEach(
        ((v, i) => {
          if (tmp[v] != null) {
            url_params += "&" + v + "=" + tmp[v];
          }
        }).bind(this)
      );
      return base_url + "?" + url_params.slice(1);
      }
    }
  }
};
</script>