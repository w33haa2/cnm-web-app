<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :modal-append-to-body="false"
      :append-to-body="false"
      :show-close="false"
      :with-header="false"
      size="230"
      custom-class="time-logger-drawer"
    >
      <time-logger />
      <!-- work history -->
      <div style="border-left:4px solid gray;background-color:#f0f3f5;border-bottom:#eee 1px solid" class="p-10">
        <div style="font-weight:800;color:gray;font-size:.75em;text-align:center">WORK HISTORY</div>
      </div>
      <!-- contents -->
      <previous-work :toggle="toggle.previous_work" />
    </el-drawer>
    <div class="drawer-button-wrapper" :class="drawer?'active':''" :style="drawer?'display:none':''">
      <div class="drawer-button" @click="drawer=!drawer">
        <i class="el-icon-timer drawer-button-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import timeLogger from '@/components/time_logger'
import previousWork from '@/components/previous_work'
export default {
  name: 'RightSideBar',
  components: { timeLogger, previousWork },
  data() {
    return {
      drawer: true,
      toggle: {
        previous_work: true
      },
      refresh: false
    }
  },
  watch: {
    drawer(v) {
      if (v) {
        this.refresh = !this.refresh
      }
    }
  }
}
</script>

<style scoped>
.drawer-button-wrapper{
    position:fixed;
    right:0px;
    bottom:15px;
    z-index:9999;
}

.drawer-button{
    cursor:pointer;
    color:white;
    background-color:coral;
    border-top-left-radius:8px;
    border-bottom-left-radius:8px;
    height:50px;
    width:50px;
    display:flex;
    justify-content:center;
}

.drawer-button-icon{
    align-self:center;
    font-size:2em;
}

/* .drawer-button-wrapper.active{
    right:275px;
    z-index:99999;
} */

.time-logger-drawer{
    background-color:white;
    width:300px !important;
}
</style>
