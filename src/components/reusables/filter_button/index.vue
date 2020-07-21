<template>
  <div
    class="button-icon round"
    style="display:flex;justify-content:center;margin-right:10px;"
    :style="
      (filter > 0 ? 'background-color:#ccc' : '') +
        (disabled ? 'cursor:not-allowed' : '')
    "
    @click="disabled ? null : onChange()"
  >
    <el-tooltip placement="top" :content="filterOr.tooltip">
        <filter-icon></filter-icon>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "filterButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filter: false
    };
  },
  computed: {
    filterOr() {
      let tooltip = "Display All";
      switch (this.filter) {
        case true:
          tooltip = "Display All";
          break;
        case false:
          tooltip = "Filter";
          break;
      }
      return { tooltip: tooltip };
    }
  },
  methods: {
    onChange() {
      this.filter = !this.filter;
      this.$emit("filter", this.filter);
    }
  }
};
</script>
