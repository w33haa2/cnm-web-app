<template>
  <div>
    <div class="dashboard-editor-container" :style="'background-color:'+bgColor">
      <div class="clearfix">
        <pan-thumb v-if="avatar!=null" :image="avatar" style="float: left" />
        <pan-thumb v-else image="default.gif" style="float: left" />
        <!-- Your roles: -->
        <!-- <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span> -->
        <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
        <div class="info-container">
          <span class="display_name">{{ name }}</span>
          <span style="font-size:20px;padding-top:20px;display:inline-block;">Dashboard</span>
        </div>
      </div>
      <div>
        <img :src="emptyGif" class="emptyGif" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanThumb from "@/components/PanThumb";

export default {
  name: "DashboardAgent",
  components: { PanThumb },
  data() {
    return {
      emptyGif: null,
      bgColor: null
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles", "position", "gender"])
  },
  created() {
    if (this.gender.toLowerCase() == "male") {
      this.emptyGif = "tmp-img-male-young.gif";
      this.bgColor = "#ffffff";
    } else {
      this.emptyGif = "tmp-img-female-young.gif";
      this.bgColor = "#ffffff";
    }
  }
};
</script>

<style lang="scss" scoped>
.emptyGif {
  display: block;
  width: 300px;
  margin: 0 auto;
}

.dashboard-editor-container {
  min-height: 100vh;
  padding: 50px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
