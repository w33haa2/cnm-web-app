<template>
  <div style="text-align:left">
    <div
      class="button-icon round active"
      style="display:flex;justify-content:center;margin-right:5px;"
      @click="form.credits.dialog = true"
    >
      <el-tooltip placement="top" content="Add Credits">
        <plus-icon></plus-icon>
      </el-tooltip>
    </div>
    <!-- Create and Update Dialog -->
    <el-dialog
      :visible.sync="form.credits.dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Create Agent Credits"
      width="30%"
      top="5vh"
    >
      <el-row>
        <el-col style="margin-bottom:10px;">
          <el-alert
            title="This will only apply to new agents with no existing credits."
            type="info"
            show-icon
          >
          </el-alert>
        </el-col>
        <el-col>
          <div class="form-label">Leave Type</div>
          <div class="form-item">
            <el-select
              v-model="form.credits.field.leave_type"
              style="width:100%;"
            >
              <el-option value="vacation_leave" label="Vacation Leave" />
              <el-option value="sick_leave" label="Sick Leave" />
            </el-select>
          </div>
        </el-col>
        <el-col>
          <div class="form-label" style="margin-top:10px;">Value</div>
          <div class="form-item">
            <el-input-number
              v-model="form.credits.field.value"
              :max="100"
              style="width:100%;"
              class="form-input"
            />
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="form.credits.dialog = false"
          >Cancel</el-button
        >
        <el-button
          type="danger"
          size="mini"
          :loading="form.credits.confirm"
          @click="bulkCreateLeaveCredits(form.credits.field)"
          s
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "createCreditsButton",
  data() {
    return {
      form: {
        credits: {
          dialog: false,
          confirm: false,
          field: {
            value: 0,
            leave_type: null
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "bulkCreateLeaveCreditsState",
      "bulkCreateLeaveCreditsData",
      "bulkCreateLeaveCreditsError"
    ])
  },
  watch: {
    bulkCreateLeaveCreditsState({ initial, success, fail }) {
      if (initial) {
        this.form.credits.confirm = true;
      } else {
        this.form.credits.confirm = false;
      }
    }
  },
  methods: {
    ...mapActions(["bulkCreateLeaveCredits"])
  }
};
</script>
