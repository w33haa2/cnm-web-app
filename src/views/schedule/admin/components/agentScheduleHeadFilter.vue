<template>
  <div class="container">
    <el-row :gutter="5">
      <el-col :md="{span:12}">
        <el-select size="mini" v-model="filter" @change="selectFilter" style="width:100%">
          <el-option value="all" label="All"></el-option>
          <el-option value="om" label="Operations Manager"></el-option>
          <el-option value="tl" label="Team Leader"></el-option>
        </el-select>
      </el-col>
      <el-col :md="{span:12}">
        <user-remote
          :placeholder="user_remote_config.placeholder"
          :multiple="user_remote_config.multiple"
          :disabled="disable_remote"
          :clear="user_remote_config.clear"
          :params="user_remote_config.params"
          :fetch="fetch"
          @selected="remote_selection"
        ></user-remote>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userRemote from "./userRemoteSearch";
export default {
  props: ["range"],
  components: {
    userRemote
  },
  data() {
    return {
      user_remote_config: {
        params: {
          om: null,
          tl: null,
          start_date: null,
          end_date: null
        },
        placeholder: "Select...",
        multiple: false,
        disabled: false,
        clear: false
      },
      filter: null,
      fetch: false,
      disable_remote: false
    };
  },
  watch: {
    "range.start": function(v) {
      this.user_remote_config.params.start_date = this.range.start;
      this.user_remote_config.params.end_date = this.range.end;
      3;
      this.fetch = !this.fetch;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    remote_selection(e) {
      let result = {};
      if (this.filter == "om") {
        result.om_id = e;
        result.tl_id = null;
      } else if (this.filter == "tl") {
        result.om_id = null;
        result.tl_id = e;
      } else {
        result.om_id = null;
        result.tl_id = null;
      }
      this.$emit("filter", result);
    },
    selectFilter(e) {
      if (e == "tl") {
        this.disable_remote = false;
        this.user_remote_config.params.om = null;
        this.user_remote_config.params.tl = true;
        this.fetch = !this.fetch;
      } else if (e == "om") {
        this.disable_remote = false;
        this.user_remote_config.params.tl = null;
        this.user_remote_config.params.om = true;
        this.fetch = !this.fetch;
      } else if (e == "all") {
        this.clear = !this.clear;
        this.disable_remote = true;
        this.user_remote_config.params.tl = null;
        this.user_remote_config.params.om = null;
        this.user_remote_config.clear = !this.user_remote_config.clear;
      }
    },
    init() {
      this.filter = "all";
      this.disable_remote = true;
      this.user_remote_config.params.start_date = this.range.start;
      this.user_remote_config.params.end_date = this.range.end;
    }
  }
};
</script>

<style lang="scss">
.container {
  width: 100%;
}
</style>