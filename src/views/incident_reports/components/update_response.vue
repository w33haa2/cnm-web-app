<template>
  <div>
    <!-- button -->
    <div
      style="height:45px;display:flex;justify-content:center;cursor:pointer;"
      @click="form.response.dialog = true"
    >
      <div style="align-self:center;color:gray;font-size:2em">
        <comment-eye-icon></comment-eye-icon>
      </div>
    </div>
    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.response.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="'Update Response'"
      top="7vh"
    >
      <el-row style="margin-bottom:20px;">
        <el-col :md="{ span: 24 }">
          <div style="text-align:left">
            <div class="label">Issued By</div>
            <div style="margin-top:8px;font-size:1.5em;font-weight:500">
              {{
                  form.response.content.issued_by.name,
              }}
            </div>
            <div>{{ form.response.content.issued_by.position }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="label">Incident Date:</div>
            <div style="margin-top:8px;">
              {{
                formatDate(
                  form.response.content.incident_date,
                  "",
                  "ddd. MMM Do, YYYY"
                )
              }}
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="label">Sanction Type:</div>
            <div style="margin-top:8px;">
              {{ form.response.content.sanction_type }}
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="label">Sanction Level:</div>
            <div style="margin-top:8px;">
              {{ form.response.content.sanction_level }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:10px;">
        <el-col>
          <div style="text-align:left">
            <span class="label">Description:</span>
          </div>
        </el-col>
        <el-col>
          <div style="padding:10px;background-color:#f4f4f5;margin-top:8px;">
            <div
              class="shadow"
              style="padding:10px;border-radius:8px;background-color:white;"
            >
              <div style="color:grey;justify-text:inter-word;text-align:justify;text-indent:50px;">
                {{ form.response.content.description }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col>
          <div style="margin-bottom:8px;text-align:left">
            <span class="label">Response:</span>
          </div>
        </el-col>
        <el-col>
          <el-input
            v-model="form.response.data.commitment"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10}"
            placeholder="Response..."
          />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFormResponse">Cancel</el-button>
        <el-button type="danger" size="mini" :loading="form.response.confirm" @click="submitFormResponse"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions,mapGetters} from "vuex";
export default {
  name: "updateResponseButton",
  props: ["data"],
  data() {
    return {
      form: {
        response: {
          editable: true,
          dialog: false,
          action: "Create",
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
            issued_by: {
              name: null,
              position: null
            },
            sanction_level: null,
            sanction_type: null,
            description: null,
            incident_date: null
          }
        }
      }
    };
  },
  computed:{
    ...mapGetters([
      "updateReportResponseData",
      "createReportResponseData",
      "updateReportResponseState",
      "createReportResponseState",
    ]),
  },
  watch: {
    "form.response.dialog": function(v) {
      if (v) {
        this.fillResponseForm();
      }
    },
    updateReportResponseState({ initial, success, fail }) {
      if (initial) {
        this.form.response.confirm = true;
      }
      if (success) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
        this.query.offset = 0;
      }

      if (fail) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
      }
    },
    createReportResponseState({ initial, success, fail }) {
      if (initial) {
        this.form.response.confirm = true;
      }
      if (success) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
        this.query.offset = 0;
      }

      if (fail) {
        this.form.response.confirm = false;
        this.form.response.dialog = false;
      }
    }
  },
  methods: {
    ...mapActions([
      "createReportResponse",
      "updateReportResponse"
    ]),
    submitFormResponse() {
      if (this.form.response.editable) {
        if (this.form.response.action == "Update") {
          const data = {
            id: this.form.response.response_id,
            user_response_id: this.form.response.report_id,
            commitment: this.form.response.data.commitment
          };
          this.updateReportResponse(data);
        } else {
          const data = {
            user_response_id: this.form.response.report_id,
            commitment: this.form.response.data.commitment
          };
          this.createReportResponse(data);
        }
      } else {
        this.$message({
          type: "warning",
          message: "Update to closed report is not allowed.",
          duration: 2500
        });
      }
    },
    fillResponseForm() {
      let ir = this.data;
      this.form.response.report_id = ir.report_details.id;
      if (ir.report_details.status == 1) {
        this.form.response.editable = true;
      } else {
        this.form.response.editable = false;
      }
      if (ir.report_details.agent_response) {
        this.form.response.response_id = ir.report_details.agent_response.id;
        this.form.response.action = "Update";
        this.form.response.data.commitment =
          ir.report_details.agent_response.commitment;
      } else {
        this.form.response.action = "Create";
      }
      this.form.response.content = {
        sanction_type: ir.report_details.sanction_type.type_description,
        sanction_level: ir.report_details.sanction_level.level_description,
        description: ir.report_details.description,
        incident_date: ir.report_details.incident_date,
        issued_by:{
            name:ir.issued_by.fname +" "+ir.issued_by.lname,
            position:ir.issued_by.position,
        }
      };
    },
    cancelFormResponse() {
      this.form.response.dialog = false;
    },
    clearFormResponse() {
      this.form.response = {};
    }
  }
};
</script>
