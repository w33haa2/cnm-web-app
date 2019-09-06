<template>
  <el-card style="margin-bottom:20px;">
    <!-- <div slot="header" class="clearfix">
      <span>About me</span>
    </div>-->

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb
          :image="avatar  ?  avatar : 'default.gif'"
          :height="'100px'"
          :width="'100px'"
          :hoverable="false"
        ></pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ name }}</div>
        <div class="user-role text-center text-muted">{{ position | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <!-- <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education" />
          <span>Education</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">JS in Computer Science from the University of Technology</div>
        </div>
      </div>-->

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <!-- <svg-icon icon-class="skill" /> -->
          <span>Conformance</span>
        </div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <!-- <span>{{ formatDate(month,"","YYYY MMMM") }}</span> -->
            <el-progress :percentage="stat.conformance.overall" />
          </div>
          <!-- <div class="progress-item">
            <span>{{ user.summary.yearly.year }}</span>
            <el-progress :percentage="user.summary.yearly.conformance" />
          </div>
          <div class="progress-item">
            <span>Overall</span>
            <el-progress :percentage="user.summary.overall.conformance" />
          </div>-->
          <!-- <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>-->
        </div>
        <div class="user-bio-section-header" style="margin-top:15px;">
          <!-- <svg-icon icon-class="skill" /> -->
          <span>Count</span>
        </div>
        <div class="user-bio-section-body">
          <div style="margin-bottom:5px;">
            <span>Present</span>
            <span style="float:right">{{ stat.present?stat.present:"0" }}</span>
          </div>
          <div style="margin-bottom:5px;">
            <span>Absent</span>
            <span style="float:right">{{ stat.absent?stat.absent:"0" }}</span>
          </div>
          <div style="margin-bottom:5px;">
            <span>Leave</span>
            <span style="float:right">{{ stat.leave?stat.leave:"0" }}</span>
          </div>
          <div sotyle="margin-bottom:5px;">
            <span>NCNS</span>
            <span style="float:right">{{ stat.ncns?stat.ncns:"0" }}</span>
          </div>
          <!-- <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>-->
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from "@/components/PanThumb";
import { mapGetters } from "vuex";
export default {
  props: ["stat", "month"],
  components: { PanThumb },
  computed: {
    ...mapGetters(["name", "position", "avatar"])
  }
  // mounted(){
  //   this.getDetails();
  // },
  // methods:{
  //   getDetails(){

  //   }
  // }
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
