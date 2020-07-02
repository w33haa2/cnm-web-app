<template>
  <div style="width:100%">
    <el-select
      size="mini"
      remote="remote"
      :filterable="filterable"
      :multiple="multiple"
      :placeholder="placeholder"
      v-model="select"
      :remote-method="remote===true?remoteMethod:null"
      :loading="loading"
      style="width:100%"
      :disabled="isDisabled"
    >
      <template v-for="(option,index) in options">
        <el-option :key="index" :value="option.id" :label="option.full_name" />
      </template>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: [
    "placeholder",
    "params",
    "multiple",
    "disabled",
    "clear",
    "fetch",
    "filterable",
    "remote"
  ],
  data() {
    return {
      select: null,
      options: [],
      loading: false,
      isDisabled: false
    };
  },
  watch: {
    fetch(v) {
      if (this.params.om || this.params.tl) {
        this.select = null;
        this.options = [];
        this.isDisabled = true;
        let url = "api/v1/users" + this.toUrlParams(this.params),
          options = {
            headers: {
              Authorization: "Bearer " + this.token
            }
          };

        this.axiosRequest("get", url, options).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.isDisabled = false;
            this.options = res.meta.metadata;
            this.select = res.meta.metadata[0].id;
          } else {
            this.isDisabled = true;
            this.options = [];
          }
        });
      }
    },
    clear(v) {
      this.select = null;
      if (this.filterable) {
        this.options = [];
      }
    },
    select(v) {
      this.$emit("selected", v);
    },
    disabled(newData){
      this.isDisabled = newData;
    }
  },
  computed: {
    ...mapGetters(["token"])
  },
  methods: {
    remoteMethod(q) {
      this.loading = true;
      if (q) {
        this.params.target = ["full_name"];
        this.params.query = q;
      } else {
        this.params.target = null;
        this.params.query = null;
      }
      let url = "api/v1/users" + this.toUrlParams(this.params),
        options = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        };

      this.axiosRequest("get", url, options).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.options = res.meta.metadata;
        } else {
          this.options = [];
        }
      });
    }
  }
};
</script>