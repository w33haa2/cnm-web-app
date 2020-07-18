<template>
  <div>
    <div
      style="height:45px;display:flex;justify-content:center;cursor:pointer;"
      @click="show = true"
    >
      <div style="align-self:center;color:gray;font-size:2em">
        <comment-eye-icon></comment-eye-icon>
      </div>
    </div>

    <!-- modal -->

    <el-dialog
      :visible.sync="show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="'Incident Report'"
      top="7vh"
    >
      <el-row style="margin-bottom:20px;">
        <el-col :md="{ span: 24 }">
          <div class="d-flex" style="justify-content:space-between">
            <div style="text-align:left">
              <div class="form-label">Issued to</div>
              <div
                class="form-item"
                style="margin-top:8px;font-size:1.5em;font-weight:500"
              >
                {{
                      data.issued_to.fname +" "+data.issued_to.lname,
                }}
              </div>
              <div>{{ data.issued_to.position }}</div>
            </div>
            <div>
              <div class="form-label" style="text-align:right">Status</div>
              <div class="form-item">
                <el-tag
                  :type="data.report_details.status == 1 ? 'danger' : 'success'"
                >
                  {{ data.report_details.status == 1 ? "OPEN" : "CLOSED" }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
          <el-col>
              <div class="form-label">Issued by</div>
              <div
                class="form-item"
                style="margin-top:8px;font-size:1.5em;font-weight:500"
              >
                {{
                      data.issued_by.fname +" "+data.issued_by.lname,
                }}
              </div>
              <div>{{ data.issued_by.position }}</div>
          </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;margin-top:20px;">
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="form-label">Incident Date:</div>
            <div class="form-item" style="padding-right:8px;">
              {{
                formatDate(
                  data.report_details.incident_date,
                  "",
                  "ddd. MMM Do, YYYY"
                )
              }}
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="form-label">Sanction Type:</div>
            <div class="form-item" style="padding-right:8px">
              {{ data.report_details.sanction_type.type_description }}
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 8 }">
          <div style="text-align:left">
            <div class="form-label">Sanction Level:</div>
            <div class="form-item" style="padding-right:8px">
              {{ data.report_details.sanction_level.level_description }}
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
          </div>
        </el-col>
        <el-col>
          <!-- if description update == false -->
          <div style="padding:10px;background-color:#f4f4f5;margin-top:8px;">
            <div
              class="shadow"
              style="padding:10px;border-radius:8px;background-color:white;"
            >
              <div
                style="color:grey;justify-text:inter-word;text-align:justify;text-indent:50px;"
              >
                {{ data.report_details.description }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
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
                  {{ data.report_details.agent_response.commitment }}
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="show = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "viewIRButton",
  props: ["data", "action"],
  data() {
    return {
      show: false
    };
  }
};
</script>
