<template>
  <div>
    <el-tooltip content="Update Credits" placement="top">
      <div
        style="height:45px;display:flex;justify-content:center;cursor:pointer;"
        @click="update(data)"
      >
        <div style="align-self:center;color:gray;font-size:2em">
          <square-edit-icon></square-edit-icon>
        </div>
      </div>
    </el-tooltip>

    <!-- Update Dialog -->
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
          <div width="100%" class="form-label">Value</div>
          <div class="form-item">
            <el-input-number
              style="margin-top:5px;width:100%"
              :step="1"
              v-model="form.credits.update.model.value"
            ></el-input-number>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm" size="mini">Cancel</el-button>
        <el-button
          type="danger"
          @click="submitForm"
          size="mini"
          :loading="form.credits.update.confirm"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "updateCredits",
  props: ["data"],
  data() {
    return {
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
    ...mapGetters(["updateLeaveCreditsState"])
  },
  watch:{
      updateLeaveCreditsState({initial,success,fail}){
          if(initial){
            this.form.credits.update.confirm = true;
          }else{
            this.form.credits.update.confirm = false;
          }
          if(success){
              this.form.credits.update.dialog =false;
          }
      }
  },
  methods: {
    ...mapActions(["updateLeaveCredits"]),
    cancelForm() {
      this.form.credits.update.dialog = false;
      this.form.credits.update.title = null;
      this.form.credits.update.confirm = false;
    },
    submitForm() {
      if (confirm("Are you sure you want to apply changes?")) {
        this.updateLeaveCredits(this.form.credits.update.model);
      }
    },
    update(data) {
      this.form.credits.update.dialog = true;
      this.form.credits.update.title =
        "Updating " +
        data.user.firstname[0] +". "+ data.user.lastname +
        "'s " +
        this.remUnderscore(data.leave_type);
      this.form.credits.update.confirm = false;
      this.form.credits.update.model.id = data.id;
      this.form.credits.update.model.value = data.value;
    }
  }
};
</script>
