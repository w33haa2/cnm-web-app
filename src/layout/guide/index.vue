<template>
  <div class="guide-wrapper">
    <el-row>
      <el-col :md="{ span: 5 }" :sm="{ span: 8 }" :xs="{ span: 0 }">
        <div class="guide-nav">
          <div
            style="display:flex;font-size:1.1em;padding:10px;height:50px;padding-top:20px;justify-content:center"
          >
            <div style="align-self:center;">
              <img src="cnmfinal.png" alt="" width="40px" />
            </div>
            <div
              style="align-self:center;margin-left:5px;font-weight:bold;line-height:1em;"
            >
              <div style="padding:0px;margin:0px;font-size:1em;">
                User Manual
              </div>
              <div
                style="padding:0px;margin:0px;font-weight:lighter;font-size:.7em"
              >
                CNM Solutions Web Application
              </div>
            </div>
          </div>
          <hr style="color:#eee;background-color:#eee" />
          <guide-nav />
          <!-- <div style="background-color:white">
            <img src="miniwithlabel.png" alt="" height="50px;">
          </div> -->
        </div>
      </el-col>
      <el-col :md="{ span: 19 }" :sm="{ span: 16 }" :xs="{ span: 24 }">
        <div class="content-container">
          <div style="font-weight:bolder;font-size:2em;">
            Guide
          </div>
          <!-- navigate content-->

          <div
            style="margin-top:30px;font-size:1.5em;color:gray"
            id="introduction"
          >
            Introduction
          </div>
          <div class="intro-content text indent">
            <!-- {{guide.intro}} -->
            {{ intro }}
            <!-- Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis vitae alias repellendus eaque quos dolor praesentium dicta vero? Odit iure quisquam, quia dolore iusto animi velit harum modi autem beatae impedit, nemo perferendis! Reprehenderit, eveniet nulla ea totam quaerat illo at explicabo ullam iure quibusdam enim sint ad eius adipisci aperiam eligendi mollitia deleniti similique, ex non ipsa, qui eos! Dolores id culpa laboriosam, porro corporis dolorum. A, labore accusantium temporibus assumenda itaque maxime voluptates aperiam consequuntur nostrum quisquam culpa excepturi possimus odit esse ipsa vitae adipisci reiciendis delectus quas tenetur aliquam eligendi cumque distinctio? Reiciendis consectetur ducimus in odit. -->
          </div>
          <div class="divider alert alert-warning">
            <span style="font-weight:bold;">Note:</span> Guide display is based
            on logged-in user role.
          </div>

          <div class="divider text indent">
            Basically most of the action buttons and filters are placed on the
            title bar for easy usage.
          </div>

          <template>
            <div class="divider text indent" style="padding-bottom:70px;">
              As an Order Placer, You can use this web application to create your timelogs, review your work reports, request for leaves (leave of absence or vacation leave, other leave type that requires document approval from HR must be done personally.) and respond to Issued incident reports by your leaders.
            </div>
          </template>

          <template v-if="position == 'Representative - Order Placer'">
            <div>
              <div class="divider" style="margin-top:30px;">
                <div class="d-flex">
                  <div style="width:50px;align-self:center">
                    <div
                      style="background-color:coral;color:white;border-radius:8px 0px 0px 8px;display:flex;justify-content:center;min-height:50px;"
                    >
                      <i
                        class="el-icon-timer drawer-button-icon"
                        style="align-self:center;font-size:2em;"
                      />
                    </div>
                  </div>
                  <div
                    style="font-size:1.2em;color:gray;align-self:center;margin-left:20px;"
                  >
                    Time Logger Drawer
                  </div>
                </div>
              </div>

              <div class="divider text indent">
                A button found on the lower-right side of your pages. This
                button toggles a side drawer that contains time log
                functionalities and the display of work history.
              </div>
              <!-- start work -->
              <div class="divider" style="margin-top:30px;">
                <div>
                  The <el-button round type="success" size="small">Start Work</el-button> Button
                </div>
                <div class="divider text indent">
                  A button that will log your work time in stamp. This will only be visible when you have a schedule. If your current schedule has an approved leave then this button is not visible. After activating this button it will be replaced by the End Work Button.
                </div>
              </div>
              <!-- end work -->
              <div class="divider" style="margin-top:30px;">
                <div>
                  The <el-button round type="primary" size="small">End Work</el-button> Button
                </div>
                <div class="divider text indent">
                  A button that will log your work time out stamp.
                </div>
              </div>
              <!-- join ot -->
              <div class="divider" style="margin-top:30px;">
                <div>
                  The <el-button round type="warning" size="small">Join OT</el-button> Button <small>(Join Overtime)</small>
                </div>
                <div class="divider text indent">
                  A button that will creates your overtime schedule and automatically creates your time in stamp. This button will only be visible if the Overtime schedule has no conflicts with your regular schedule. After activating this button it will be replaced by the End Work Button.
                </div>
              </div>
            </div>
          </template>

          <div style="margin-top:40px;">
            <page-and-features></page-and-features>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pageAndFeatures from "./components/page_and_features";
import guideNav from "./components/nav";
export default {
  name: "Guide",
  components: { guideNav, pageAndFeatures },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["position"]),
    intro() {
      return (
        "CNM Web Application is an Employee Management System that allows user to perform functions or tasks base on certain role or department."
      );
    }
  },
  methods: {
    goto(ref) {
      var element = this.$refs[ref];
      var top = element.offsetTop;

      window.scrollTo(0, top);
    }
  }
};
</script>
<style lang="scss">
.url-list-title {
  font-size: 1.5em;
}
.guide-wrapper {
  background-color: #eee;
  line-height: 2em;
  .text {
    font-size: 0.9em;
    color: gray;
  }
  .indent {
    text-indent: 5em;
  }
}
.divider {
  margin-top: 10px;
  &.alert {
    padding: 5px;
    font-size: 0.9em;
    border-radius: 5px;
  }
  &.alert-warning {
    letter-spacing: 0.12em;
    background-color: rgb(255, 247, 203);
    color: gray;
    border: 0.5px solid rgb(253, 235, 134);
  }
}
.intro-content {
  margin-top: 10px;
  font-size: 0.9em;
}
.content-container {
  padding: 50px 100px;
  min-height: 100vh;
  background-color: white;
  overflow-y: auto;
  max-height: 100vh;
}

.el-container {
  width: 80%;
  padding: 15px 30px;
  border-radius: 20px;
  background-color: white;
  margin: 0 auto;
}
</style>
