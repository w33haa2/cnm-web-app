<template>
  <div class="container">
    <el-row :gutter="5">
      <el-col :md="{span:12}">
        <el-select size="mini" v-model="filter" @change="selectFilter" style="width:100%">
          <el-option value="all" label="All"></el-option>
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
  props: ["range", "om_id"],
  components: {
    userRemote
  },
  data() {
    return {
      user_remote_config: {
        params: {},
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
  watch: {},
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
        delete this.user_remote_config.params.om;
        this.user_remote_config.params.tl = true;
        this.fetch = !this.fetch;
      } else if (e == "all") {
        this.clear = !this.clear;
        this.disable_remote = true;
        delete this.user_remote_config.params.tl;
        delete this.user_remote_config.params.om;
        this.user_remote_config.clear = !this.user_remote_config.clear;
      }
    },
    init() {
      this.disable_remote = true;
      this.filter = "all";
      this.user_remote_config.params.om_id = this.om_id;
      this.user_remote_config.params.tl = true;
      this.user_remote_config.params.start_date = this.range.start;
      this.user_remote_config.params.end_date = this.range.end;
      this.user_remote_config.params.no_relations = true;
    }
  }
};
</script>

<style lang="scss">
.container {
  width: 100%;
}
</style>