<template>
  <div>
    <sticky :z-index="10" :sticky-top="84" class-name="sub-navbar" style="padding:0px">
      <el-row>
        <el-col :md="{span:12}">
          <el-button
            size="mini"
            style="margin-right:10px"
            type="danger"
            @click="drawer=true"
          >Join OT</el-button>
          <span class="fw-400" style="color:grey">11:00AM to 05:00PM</span>
        </el-col>
        <el-col :md="{span:12}" style="text-align:right">
          <!-- <span class="c-grey fw-400">SCHEDULE</span> -->
          <span class="fw-400" style="color:grey">Today @ 10:00AM</span>
          <el-divider direction="vertical"></el-divider>
          <!-- <span class="c-grey fw-400">TIME IN</span> -->
          <span class="fw-400" style="color:grey">10:00AM</span>

          <span class="c-grey fw-400">-</span>
          <!-- <span class="c-grey fw-400">TIME OUT</span> -->
          <span class="fw-400" style="color:grey">10:00PM</span>

          <el-divider direction="vertical"></el-divider>
          <!-- <span class="c-grey fw-400">DURATION</span> -->
          <span class="fw-400" style="color:grey">12:00</span>

          <el-button style="margin-left: 10px;" type="primary" size="mini">START</el-button>
        </el-col>
      </el-row>
    </sticky>
    <component :is="page" />
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";

export default {
  name: "StickyDemo",
  components: { Sticky },
  data() {
    return { drawer: false };
  },
  methods: {
    getTodaySchedule() {},
    getTodayOt() {},
    startWork() {},
    joinOt() {}
  }
};
</script>

<style scoped>
.components-container div {
  margin: 10px;
}

.time-container {
  display: inline-block;
}

.c-grey {
  color: rgb(194, 194, 194);
}
.fw-400 {
  font-weight: 400;
}
</style>
                    
