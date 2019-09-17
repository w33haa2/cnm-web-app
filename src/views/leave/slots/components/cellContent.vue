<template>
  <div>
    <template v-if="Object.keys(slot).length>0">
      <span>
        {{slot.value+"/"+slot.original_value}}
      </span>
    </template>
    <template v-else>
      <span style="color:red">
        NA
      </span>
    </template>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: ["slot"],
  watch: {},
  mounted() {
    console.log(this.slot);
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
