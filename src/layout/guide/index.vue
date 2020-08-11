<template>
  <div class="guide-wrapper">
    <el-row>
      <el-col :md="{ span: 5 }">
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
        </div>
      </el-col>
      <el-col :md="{ span: 19 }">
        <div class="content-container">
          <div style="font-weight:bolder;font-size:2em;">
            Guide
          </div>
          <!-- navigate content-->

          <div style="margin-top:30px;font-size:1.5em;color:gray" id="introduction">
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

          <div class="divider text indent">
            As a {{ this.position }}, the role is basically focused on managing
            employee details, leaves and monitoring incident reports. Below is
            the list of pages you can access together with its features.
          </div>
          <div style="margin-top:40px;" id="employee_list">
            <page-and-features></page-and-features>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <div
      style="background-color:crimson;color:white;display:flex;justify-content:space-between;padding:10px 30px;"
    >
      <div style="align-self:center">
        CNM Web Application User Guide
      </div>
      <div style="align-self:center">
        <el-input size="large" placeholder="Search"></el-input>
      </div>
    </div>
    <div style="width:100%;margin-top:20px;">
      <div class="el-container shadow">
        <div style="width:100%">
          <el-row>
            <el-col>
              <div style="color:crimson;width:100%">
                This are the list of functions you can do with your role.
              </div>
            </el-col>
            <el-col>
              <div style="color:gray;width:100%;margin-top:20px;">
                <ul>
                    <li>Employee Page
                        <ul>
                            <li>Add &amp; Update Employee (In App)</li>
                            <li>Add &amp; Update Employee (Import Excel)</li>
                            <li>Change Employee Status</li>
                            <li>Export All Employees</li>
                            <li>Employee Reset Password</li>
                        </ul>
                    </li>
                    <li>Status Page
                        <ul>
                            <li>Add, Update and Delete User Status</li>
                            <li>Add and Delete Employee Assignment</li>
                        </ul>
                    </li>
                    <li>Incident Report (Issue)
                        <ul>File and Update Incident Reports.</ul>
                        <ul>Sanction Types and Levels.</ul>
                    </li>
                    <li>Add Employee Leave</li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pageTitle from "./components/page_title";
import pageAndFeatures from "./components/page_and_features";
import guideNav from "./components/nav";
export default {
  name: "Guide",
  components: { pageTitle, guideNav, pageAndFeatures },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["position"]),
    intro() {
      return (
        "CNM Web Application is an Employee Management System that allows user to perform functions or tasks base on certain role or department. In this case, Logged in user has the role of  " +
        this.position +
        " which belongs to HR Department. This guide will be focusing on the said role."
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
