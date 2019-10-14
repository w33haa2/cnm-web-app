<template>
  <div style="width:100%;">
    <template v-if="Object.keys(mslot).length>0">
      <el-tooltip content="available slots/issued slots">
        <el-tag :type="select" size="mini" @click="updateDelete(mslot)" style="cursor:pointer">{{mslot.value +"/"+mslot.original_value}}</el-tag>
      </el-tooltip>
    </template>
    <template v-else>
      <span style="color:red;">
        NA
      </span>
    </template>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: ["mslot"],
  data(){
    return {
      select:"danger",
    }
  },
  watch: {
  },
  mounted() {
      if(Object.keys(this.mslot).length>0){
        let percentage = this.mslot.value / this.mslot.original_value * 100;
        console.log(percentage)
        if(percentage >= 75 && percentage <=100){
          this.select = "success";
        }else if(percentage >= 50 && percentage < 75){
          this.select = "primary";
        }else if(percentage >= 25 && percentage < 50){
          this.select = "warning";
        }else if(percentage >= 0 && percentage < 25){
          this.select = "info";
        }
      }
  },
  methods:{
    updateDelete(data){
      this.$emit("updateDelete", data)
    }
  }
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
