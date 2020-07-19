<template>
  <div class="app-container">
    <div v-if="show_profile">
      <el-row :gutter="10">
        <el-col :md="{ span: 24 }">
          <!-- <user-card :user="userDetails" /> -->
          <div class="banner-container shadow">
            <div class="banner-image" style="background-image:url('bg.jpg')">
              <div class="user-profile">
                <div class="name">{{ userDetails.full_name }}</div>
                <div class="position">{{ userDetails.position }}</div>
              </div>
            </div>
            <div
              v-if="!userDetails.image_url"
              class="profile-image shadow"
              style="background-image:url('default.gif')"
            ></div>
            <img
              v-else
              class="profile-image shadow"
              :src="userDetails.image_url"
              alt=""
            />

            <!-- <div class="profile-navigation">
            </div> -->
            <div class="send-mail-wrapper">
              <a
                :href="
                  'https://mail.google.com/mail/u/0/?view=cm&fs=1&to=' +
                    userDetails.email +
                    '&tf=1'
                "
                target="_blank"
                class="send-mail-button"
              >
                Send me an Email
              </a>
            </div>
          </div>
        </el-col>
      </el-row>
      <template v-if="permit">
        <el-row :gutter="20" style="margin-top:20px;">
          <el-col :md="8" style="padding-top:10px;padding-bottom:10px;">
            <div class="custom-card shadow">
              <div style="padding:15px;">
                <div class="title">
                  General Information
                </div>
                <div class="content">
                  <div class="item">
                    <div class="label">
                      ID number
                    </div>
                    <div class="value">
                      {{ userDetails.company_id }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">
                      Email Address
                    </div>
                    <div class="value">
                      {{ userDetails.email }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">
                      Joined
                    </div>
                    <el-tooltip :content="fromNow(userDetails.hired_date)">
                      <div class="value">
                        {{
                          formatDate(
                            userDetails.hired_date,
                            "",
                            "ddd. MMM Do, YYYY"
                          )
                        }}
                      </div>
                    </el-tooltip>
                  </div>
                  <div class="item">
                    <div class="label">
                      Birth Date
                    </div>
                    <el-tooltip :content="fromNow(userDetails.hired_date)">
                      <div class="value">
                        {{
                          formatDate(
                            userDetails.birthdate,
                            "",
                            "ddd. MMM Do, YYYY"
                          )
                        }}
                      </div>
                    </el-tooltip>
                  </div>

                  <div class="item">
                    <div class="label">
                      Gender
                    </div>
                    <div class="value">
                      {{ userDetails.gender }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">
                      Supervisor
                    </div>
                    <div class="value">
                      {{ userDetails.head_name? userDetails.head_name: "Not assigned" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :md="16" style="padding-top:10px;padding-bottom:10px;">
            <div>
              <subordinates :user="userDetails" />
            </div>
          </el-col>
        </el-row>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "./components/UserCard";
import Activity from "./components/Activity";
import Timeline from "./components/Timeline";
import Account from "./components/Account";
import About from "./components/About";
import CompanyDetails from "./components/CompanyDetails";
import BenefitIDs from "./components/BenefitIDs";
import Subordinates from "./components/Subordinates";
import axios from "axios";
import store from "../../store";

export default {
  name: "Profile",
  components: {
    UserCard,
    Activity,
    Timeline,
    About,
    Account,
    CompanyDetails,
    "benefit-ids": BenefitIDs,
    Subordinates
  },
  data() {
    return {
      user: {},
      activeTab: "about",
      userDetails: {},
      token: store.state.user.token,
      subordinates: [],
      show_profile: false
    };
  },
  computed: {
    ...mapGetters(["position"]),
    permit() {
      let permit = false;
      switch (this.position.toLowerCase()) {
        case "admin":
        case "hr manager":
        case "hr assistant":
          permit = true;
          break;
        case "rta manager":
          permit = this.isPermitted([
            "representative - order placer",
            "rta supervisor",
            "rta analyst"
          ]);
        case "rta supervisor":
          permit = this.isPermitted([
            "representative - order placer",
            "rta analyst"
          ]);
          break;
        case "rta analyst":
          permit = this.isPermitted(["representative - order placer"]);
          break;
        case "operations manager":
          permit = this.isPermitted([
            "representative - order placer",
            "team leader"
          ]);
          break;
        case "team leader":
          permit = this.isPermitted(["representative - order placer"]);
          break;
      }
      return permit;
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      const token = this.token;
      var loader = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios
        .get("api/v1/users/fetch/" + this.$route.params.id, {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          this.userDetails = res.data.meta.metadata[0];
          this.show_profile = true;
          loader.close();
        })
        .catch(err => {
          console.log(err.response.data.title);
          loader.close();
          this.$message({
            type: "error",
            message: err.response.data.title,
            duration: 5000
          });
        });
    },
    isPermitted(roles){
      let permit = false;
      if(roles.filter(i=> i == this.userDetails.position.toLowerCase()).length> 0){
        permit = true;
      }
      return permit;
    }
  }
};
</script>
