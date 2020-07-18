<template>
  <div>
    <template v-if="action == 'Create'">
      <div
        class="button-icon round active"
        style="display:flex;justify-content:center;margin-right:5px;"
        @click="
          (form.issue.dialog = true), (form.issue.create.filed_by = user_id)
        "
      >
        <el-tooltip placement="top" content="Report an Incident">
          <plus-icon></plus-icon>
        </el-tooltip>
      </div>
    </template>
    <template v-if="action == 'Update'">
      <div
        style="height:45px;display:flex;justify-content:center;cursor:pointer;"
        @click="
          action == 'Update' ? (fillData(), (form.issue.dialog = true)) : ''
        "
      >
        <div style="align-self:center;color:gray;font-size:2em">
          <comment-eye-icon></comment-eye-icon>
        </div>
      </div>
    </template>

    <!-- modal -->

    <el-dialog
      :visible.sync="form.issue.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="action + ' Report'"
      top="7vh"
    >
      <el-row style="margin-bottom:20px;">
        <template v-if="action == 'Update'">
          <template
            v-if="
              data.report_details.agent_response ||
                data.report_details.status == 0
            "
          >
            <el-col :md="{ span: 24 }">
              <el-alert
                title="Updates are disabled for all Incident Reports with response Or CLOSED status."
                type="info"
                show-icon
              >
              </el-alert>
            </el-col>
          </template>
        </template>
        <el-col :md="{ span: 24 }">
          <div class="d-flex" style="justify-content:space-between">
            <div style="text-align:left">
              <div class="form-label">Issued To</div>
              <template v-if="action == 'Update'">
                <div
                  class="form-item"
                  style="margin-top:8px;font-size:1.5em;font-weight:500"
                >
                  {{
                      form.issue.content.issued_to.name,
                  }}
                </div>
                <div>{{ form.issue.content.issued_to.position }}</div>
              </template>
              <template v-if="action == 'Create'">
                <div class="form-item" style="margin-top:8px;">
                  <el-select
                    v-model="form.issue.create.user_reports_id"
                    style="width:100%"
                  >
                    <el-option
                      v-for="(comrade, index) in comrades"
                      :key="index"
                      :value="comrade.id"
                      :label="comrade.full_name"
                    />
                  </el-select>
                </div>
              </template>
            </div>
            <div>
              <div class="form-label" style="text-align:right">Status</div>
              <div class="form-item">
                <template v-if="action == 'Update'">
                  <el-tag
                    :type="
                      data.report_details.status == 1 ? 'danger' : 'success'
                    "
                  >
                    {{ data.report_details.status == 1 ? "OPEN" : "CLOSED" }}
                  </el-tag>
                </template>
                <template v-else>
                  <el-tag type="danger">OPEN</el-tag>
                </template>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="form-label">Incident Date:</div>
            <div class="form-item" style="padding-right:8px;">
              <template v-if="action == 'Create'">
                <el-date-picker
                  v-model="form.issue.create.incident_date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :clearable="false"
                  style="width:100%"
                />
              </template>
              <template v-if="action == 'Update'">
                <!-- disable attr update on reports with response -->
                <template v-if="data.report_details.status == 1">
                  <template v-if="!data.report_details.agent_response">
                    <el-date-picker
                      v-model="form.issue.update.incident_date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :clearable="false"
                      style="width:100%"
                    />
                  </template>
                  <template v-else>
                    {{
                      formatDate(
                        form.issue.content.incident_date,
                        "",
                        "ddd. MMM Do, YYYY"
                      )
                    }}
                  </template>
                </template>
                <template v-else>
                  {{
                    formatDate(
                      form.issue.content.incident_date,
                      "",
                      "ddd. MMM Do, YYYY"
                    )
                  }}
                </template>
              </template>
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="form-label">Sanction Type:</div>
            <div class="form-item" style="padding-right:8px">
              <template v-if="action == 'Create'">
                <el-select
                  style="width:100%"
                  v-model="form.issue.create.sanction_type_id"
                >
                  <template v-for="(option, index) in sanctionTypes.options">
                    <el-option
                      :key="index"
                      :value="option.id"
                      :label="option.type_description"
                    />
                  </template>
                </el-select>
              </template>
              <template v-if="action == 'Update'">
                <template v-if="data.report_details.status == 1">
                  <template v-if="!data.report_details.agent_response">
                    <el-select
                      style="width:100%"
                      v-model="form.issue.update.sanction_type_id"
                    >
                      <template
                        v-for="(option, index) in sanctionTypes.options"
                      >
                        <el-option
                          :key="index"
                          :value="option.id"
                          :label="option.type_description"
                        />
                      </template>
                    </el-select>
                  </template>
                  <template v-else>
                    {{ form.issue.content.sanction_type }}
                  </template>
                </template>
                <template v-else>
                  {{ form.issue.content.sanction_type }}
                </template>
              </template>
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="form-label">Sanction Level:</div>
            <div class="form-item" style="padding-right:8px">
              <template v-if="action == 'Create'">
                <el-select
                  style="width:100%"
                  v-model="form.issue.create.sanction_level_id"
                >
                  <template v-for="(option, index) in sanctionLevels.options">
                    <el-option
                      :key="index"
                      :value="option.id"
                      :label="option.level_description"
                    />
                  </template>
                </el-select>
              </template>
              <template v-if="action == 'Update'">
                <template v-if="data.report_details.status == 1">
                  <template v-if="!data.report_details.agent_response">
                    <el-select
                      style="width:100%"
                      v-model="form.issue.update.sanction_level_id"
                    >
                      <template
                        v-for="(option, index) in sanctionLevels.options"
                      >
                        <el-option
                          :key="index"
                          :value="option.id"
                          :label="option.level_description"
                        />
                      </template>
                    </el-select>
                  </template>
                  <template v-else>
                    {{ form.issue.content.sanction_level }}
                  </template>
                </template>
                <template v-else>
                  {{ form.issue.content.sanction_level }}
                </template>
              </template>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:10px;">
        <el-col>
          <div style="text-align:left">
            <span class="form-label" style="margin-right:5px">
              Description:
            </span>
            <!-- action == Update => show description update button on status open or value = 1 -->
            <template
              v-if="action == 'Update' ? data.report_details.status==1 : false"
            >
              <!-- action == Update => show description update button on agent_responce = null OR no agent_response yet -->
              <template v-if="!data.report_details.agent_response">
                <template v-if="form.description.update == false">
                  <span style="font-size:1.5em;cursor:pointer;color:gray">
                    <el-tooltip placement="top" content="Edit Description">
                      <tooltip-edit-icon
                        @click="form.description.update = true"
                      ></tooltip-edit-icon>
                    </el-tooltip>
                  </span>
                </template>
                <template v-else>
                  <span style="font-size:1.5em;cursor:pointer;color:gray">
                    <el-tooltip placement="top" content="Cancel edit">
                      <cancel-icon
                        @click="cancelDescriptionUpdate()"
                      ></cancel-icon>
                    </el-tooltip>
                  </span>
                </template>
              </template>
            </template>
          </div>
        </el-col>
        <el-col>
          <!-- if description update == false -->
          <template v-if="form.description.update == false">
            <div style="padding:10px;background-color:#f4f4f5;margin-top:8px;">
              <div
                class="shadow"
                style="padding:10px;border-radius:8px;background-color:white;"
              >
                <div
                  style="color:grey;justify-text:inter-word;text-align:justify;text-indent:50px;"
                >
                  {{ form.issue.update.description }}
                </div>
              </div>
            </div>
          </template>
          <!-- if description update == true -->
          <template v-else>
            <div class="form-item">
              <template v-if="action == 'Update'">
                <el-input
                  v-model="form.issue.update.description"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10 }"
                  placeholder="Description..."
                />
              </template>
              <template v-if="action == 'Create'">
                <el-input
                  v-model="form.issue.create.description"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10 }"
                  placeholder="Description..."
                />
              </template>
            </div>
          </template>
        </el-col>
      </el-row>
      <template v-if="action != 'Create'">
        <template v-if="data.report_details.agent_response">
          <el-row style="margin-bottom:20px;">
            <el-col>
              <div style="margin-bottom:8px;text-align:left">
                <span class="form-label">Response:</span>
              </div>
            </el-col>
            <el-col>
              <div
                style="padding:10px;background-color:#f4f4f5;margin-top:8px;"
                class="form-item"
              >
                <div
                  class="shadow"
                  style="padding:10px;border-radius:8px;background-color:white;"
                >
                  <div
                    style="color:grey;justify-text:inter-word;text-align:justify;text-indent:50px;"
                  >
                    {{ form.issue.data.commitment }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelDialog">Cancel</el-button>
        <template v-if="action == 'Create'">
          <el-button
            type="danger"
            size="mini"
            :loading="form.issue.confirm"
            @click="submit()"
            >Confirm</el-button
          >
        </template>
        <template v-if="action == 'Update'">
          <!-- if report open -->
          <template v-if="data.report_details.status == 1">
            <!-- if response null -->
            <template v-if="!data.report_details.agent_response">
              <el-button
                type="danger"
                size="mini"
                :loading="form.issue.confirm"
                @click="submit()"
                >Confirm</el-button
              >
            </template>
          </template>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "fileIRButton",
  props: ["data", "action"],
  data() {
    return {
      form: {
        issue: {
          create: {
            status: 1,
            incident_date: null,
            sanction_type_id: null,
            sanction_level_id: null,
            description: null,
            user_reports_id: null,
            filed_by: this.user_id
          },
          update: {
            id: null,
            sanction_type_id: null,
            sanction_level_id: null,
            description: null,
            incident_date: null
          },
          editable: true,
          dialog: false,
          report_id: null,
          response_id: null,
          confirm: false,
          // user data directly to pass as params..
          data: {
            user_response_id: null,
            status: null,
            commitment: null
          },
          content: {
            issued_to: {
              name: null,
              position: null
            },
            sanction_level: null,
            sanction_type: null,
            description: null,
            incident_date: null
          }
        },
        description: {
          update: this.action == "Create" ? true : false
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "sanctionTypes",
      "sanctionLevels",
      "comrades",
      "creatingIncidentReports",
      "updateIncidentReportState",
      "user_id"
    ])
  },
  watch: {
    creatingIncidentReports({ initial, success, fail }) {
      if (initial) {
        this.form.issue.confirm = true;
      } else {
        this.form.issue.confirm = false;
      }
      if (success) {
        this.form.issue.dialog = false;
        this.clearCreateForm();
      }
    },
    updateIncidentReportState({ initial, success, fail }) {
      if (initial) {
        this.form.issue.confirm = true;
      } else {
        this.form.issue.confirm = false;
      }

      if (success) {
        this.form.issue.dialog = false;
        this.clearUpdateForm();
      }
    }
  },
  methods: {
    // general functions
    ...mapActions(["createReports", "updateIncidentReport"]),
    cancelDialog() {
      this.form.issue.dialog = false;
    },
    submit() {
      if (this.action == "Update") {
        if (confirm("Please Confirm updating of Incident Report")) {
          this.updateIncidentReport(this.form.issue.update);
        }
      } else if (this.action == "Create") {
        if (confirm("Please Confirm creation of Incident Report")) {
          this.createReports(this.form.issue.create);
        }
      }
    },
    // action == Update functions
    fillData() {
      let ir = this.data;
      this.form.issue.report_id = ir.report_details.id;
      if (ir.report_details.agent_response) {
        this.form.issue.response_id = ir.report_details.agent_response.id;
        this.form.issue.data.commitment =
          ir.report_details.agent_response.commitment;
      }
      // read only
      this.form.issue.content = {
        sanction_type: ir.report_details.sanction_type.type_description,
        sanction_level: ir.report_details.sanction_level.level_description,
        description: ir.report_details.description,
        incident_date: ir.report_details.incident_date,
        issued_to: {
          name: ir.issued_to.fname + " " + ir.issued_to.lname,
          position: ir.issued_to.position
        }
      };
      // model
      this.form.issue.update.id = ir.report_details.id;
      this.form.issue.update.sanction_type_id =
        ir.report_details.sanction_type.id;
      this.form.issue.update.sanction_level_id =
        ir.report_details.sanction_level.id;
      this.form.issue.update.description = ir.report_details.description;
      this.form.issue.update.incident_date = ir.report_details.incident_date;
    },
    cancelDescriptionUpdate() {
      this.form.issue.update.description = this.data.report_details.description;
      this.form.description.update = false;
    },
    clearUpdateForm() {
      this.form.issue.update.id = null;
      this.form.issue.update.incident_date = null;
      this.form.issue.update.sanction_type_id = null;
      this.form.issue.update.sanction_level_id = null;
      this.form.issue.update.description = null;
    },
    // action == Create functions
    clearCreateForm() {
      this.form.issue.create.status = 1;
      this.form.issue.create.incident_date = null;
      this.form.issue.create.sanction_type_id = null;
      this.form.issue.create.sanction_level_id = null;
      this.form.issue.create.description = null;
      this.form.issue.create.user_reports_id = null;
      this.form.issue.create.filed_by = this.user_id;
    }
  }
};
</script>
