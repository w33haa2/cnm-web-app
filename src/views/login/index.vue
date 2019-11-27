<template>
  <div
    style="height:100%;background-color:#e8302a;background-image:linear-gradient(to bottom right, teal, red)"
  >
    <div class="login-container">
      <div style="width:600px;margin:0 auto;padding-top:20vh">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <el-row>
            <el-col
              :xs="{span:10}"
              :sm="{span:10}"
              :md="{span:10}"
              style="padding:0px;background-image:url('finalbanner.png');background-attachment:fixed;background-position:center"
            >
              <div style="width:100%">
                <img src="logo-trans.png" height="340" style="margin:0 auto" />
              </div>
            </el-col>
            <el-col :xs="{span:14}" :sm="{span:14}" :md="{span:14}">
              <div
                style="padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:50px"
              >
                <h4>Welcome!</h4>
                <el-form
                  ref="loginForm"
                  :model="loginForm"
                  :rules="loginRules"
                  class="login-form"
                  autocomplete="on"
                  label-position="left"
                >
                  <div class="login">
                    <div>
                      <span style="font-size:0.7em">USERNAME</span>
                    </div>
                    <el-form-item prop="username">
                      <!-- <span class="svg-container">
                    <svg-icon icon-class="user" />
                      </span>-->
                      <el-input
                        style="width:100%"
                        ref="username"
                        v-model="loginForm.username"
                        placeholder="Username"
                        name="username"
                        type="text"
                        tabindex="1"
                        autocomplete="on"
                        size="mini"
                      />
                    </el-form-item>

                    <div>
                      <span style="font-size:0.7em">PASSWORD</span>
                    </div>
                    <el-tooltip
                      v-model="capsTooltip"
                      content="Caps lock is On"
                      placement="right"
                      manual
                    >
                      <el-form-item prop="password">
                        <el-input
                          style="width:100%;display:inline-block;"
                          size="mini"
                          :key="passwordType"
                          ref="password"
                          v-model="loginForm.password"
                          :type="passwordType"
                          placeholder="Password"
                          name="password"
                          tabindex="2"
                          autocomplete="on"
                          @keyup.native="checkCapslock"
                          @blur="capsTooltip = false"
                          @keyup.enter.native="handleLogin"
                        >
                          <i slot="suffix" class="el-input__icon" @click="showPwd">
                            <el-tooltip :content="passwordType === 'password' ? 'show' : 'hide'">
                              <svg-icon
                                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                              />
                            </el-tooltip>
                          </i>
                        </el-input>
                        <!-- <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                        </span>-->
                      </el-form-item>
                    </el-tooltip>
                  </div>

                  <el-button
                    :loading="loading"
                    round
                    size="mini"
                    type="danger"
                    style="width:100%;margin-top:20px;"
                    @click.native.prevent="handleLogin"
                  >Login</el-button>
                </el-form>
              </div>
              <!-- <div style="padding:20px">
                <span style="font-size:0.7em;color:grey">Follow us on</span>
              </div>
              <div style="padding:20px">
                <el-button circle>
                  <i class="el-icon-user" />
                </el-button>
              </div>-->
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>

    <el-dialog
      title="Mandatory Change Password"
      :visible.sync="changePassDiag"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
    >
      <label>New Password</label>
      <el-input v-model="newPassword1" type="password" style="margin-top:3px; margin-bottom:10px;" />
      <label style="margin-top:5px; margin-bottom:3px">Confirm New Password</label>
      <el-input v-model="newPassword2" type="password" style="margin-top:3px; margin-bottom:5px;" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="logout">Cancel</el-button>
        <el-button
          type="primary"
          :disabled="employeeUpdateState.initial"
          @click="confirmChangePass"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validEmail } from "@/utils/validate";
import { Message } from "element-ui";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error("Please enter the correct email"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error("The password can not be less than 4 digits"));
      } else {
        callback();
      }
    };
    return {
      changePassDiag: false,
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      newPassword1: "",
      newPassword2: ""
    };
  },
  computed: {
    ...mapGetters([
      "loginState",
      "userDetails",
      "employeeUpdateState",
      "employeeErrors",
      "loginError"
    ])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    },
    employeeUpdateState({ initial, success, fail }) {
      if (success) {
        this.$router.push({
          path: "/dashboard"
        });
      } else if (fail) {
        Message.error({
          message: this.employeeErrors,
          duration: "2500"
        });
      }
    },
    loginState({ initial, success, fail }) {
      if (initial) {
        this.loading = true;
      }
      if (success) {
        this.loading = false;
        if (this.userDetails.login_flag === 0) {
          this.changePassDiag = true;
        } else {
          this.$router.push({
            path: "/dashboard"
          });
        }
      }
      if (fail) {
        Message.error({
          message: this.loginError,
          duration: "2500"
        });
        this.loading = false;
      }
    }
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },

  methods: {
    ...mapActions(["authenticate", "logout", "changePassEmployee"]),
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const data = {
            username: this.loginForm.username,
            password: this.loginForm.password
          };
          this.authenticate({ data });
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    confirmChangePass() {
      // validate first
      if (this.newPassword1 === this.newPassword2) {
        const data = {
          id: this.userDetails.id,
          password: this.newPassword1
        };
        this.changePassEmployee(data);
      } else if (this.newPassword1 !== this.newPassword2) {
        Message.error({
          message: "Password does not match.",
          duration: "2500"
        });
      } else {
        Message.error({
          message: "Please fill in the fields correctly.",
          duration: "2500"
        });
      }
    }
  }
};
</script>


<style lang="scss" scoped>
</style>
