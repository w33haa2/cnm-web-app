<template>
  <div>{{slot.value}}</div>
</template>

<script>
import moment from "moment";
export default {
  props: ["slot"],
  watch: {},
  mounted() {
    alert(this.slot);
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.fs-12px {
  font-size: 12px;
}
.c-grey {
  color: grey;
}
.c-success {
  color: #13ce91;
}
</style>
