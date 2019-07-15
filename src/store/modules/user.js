import SecureLS from "secure-ls";
// import axios from 'axios'
import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
import router, { resetRouter } from "@/router";
const LOGIN = generateMutationTypes("auth", "LOGIN");
const LOGOUT = generateMutationTypes("auth", "LOGOUT");
const FETCH_USER_STATUS_LIST = generateMutationTypes(
  "user_status",
  "FETCH_USER_STATUS_LIST"
);
const FETCH_POTENTIAL_HEAD = generateMutationTypes(
  "position_cascade_select",
  "FETCH_POTENTIAL_HEAD"
);

var ls = new SecureLS({
  encodingType: "aes"
});

const state = {
  token: ls.get("token").access_token,
  name: "",
  avatar: "",
  introduction: "",
  loggingInState: {
    initial: false,
    success: false,
    fail: false
  },
  roles: [],
  // structure
  data: {
    statusList: [],
    potentialHead: []
  },
  fetchState: {
    statusList: {
      initial: false,
      success: false,
      fail: false
    },
    potentialHead: {
      initial: false,
      success: false,
      fail: false
    }
  },
  errors: {
    statusList: null,
    potentialHead: null
  }
};
const mutations = {
  [LOGIN.initial](state) {
    state.loggingInState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  [LOGIN.success](state, payload) {
    state.loggingInState = {
      initial: false,
      success: true,
      fail: false
    };
    state.token = payload.meta.token.access_token;
    alert(state.token);
    console.log(state.token);
    ls.set("token", { access_token: state.token });
    router.push({
      path: "/dashboard"
    });
  },
  [LOGIN.fail](state, payload) {
    state.loggingInState = {
      initial: false,
      success: false,
      fail: true
    };
  },
  [LOGOUT.success](state, payload) {
    state.token = null;
    state.userFullName = null;
    state.userEmail = null;
    state.loginSuccess = false;
    resetRouter();
    ls.removeAll();
    router.push({
      path: "/login"
    });
  },
  [LOGOUT.fail](state, payload) {
    state.token = null;
    state.userFullName = null;
    state.userEmail = null;
    state.loginSuccess = false;
  },
  // FETCH USER STATUS LIST
  // initial
  [FETCH_USER_STATUS_LIST.initial](state) {
    state.fetchState.statusList = {
      initial: true,
      success: false,
      fail: false
    };
  },
  [FETCH_USER_STATUS_LIST.success](state, payload) {
    state.fetchState.statusList = {
      initial: false,
      success: true,
      fail: false
    };
    state.data.statusList = payload.meta.metadata;
  },
  [FETCH_USER_STATUS_LIST.fail](state, payload) {
    state.fetchState.statusList = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors.statusList = payload.response.data.title;
  },
  // FETCH POTENTIAL HEAD LIST
  // initial
  [FETCH_POTENTIAL_HEAD.initial](state) {
    state.fetchState.potentialHead = {
      initial: true,
      success: false,
      fail: false
    };
  },
  [FETCH_POTENTIAL_HEAD.success](state, payload) {
    state.fetchState.potentialHead = {
      initial: false,
      success: true,
      fail: false
    };
    state.data.potentialHead = payload.meta.metadata;
  },
  [FETCH_POTENTIAL_HEAD.fail](state, payload) {
    state.fetchState.statusList = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors.potentialHead = payload.response.data.title;
  }
  // SET_TOK,EN: (state, token) => {
  //   state.token = token
  // },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  // SET_ROLES: (state, roles) => {
  //   state.roles = roles
  // }
};

const actions = {
  authenticate({ commit }, params) {
    const slug = "auth.login";
    STATE_API({ slug, params: params.data }, commit, [
      LOGIN.initial,
      LOGIN.success,
      LOGIN.fail
    ]);
  },
  logout({ commit }) {
    const slug = "auth.logout";
    STATE_API({ slug }, commit, [LOGOUT.success, LOGOUT.fail]);
  },
  // fetch user_status_list
  fetchStatusList({ commit }) {
    const slug = "api.users.statusList";
    STATE_API({ slug }, commit, [
      FETCH_USER_STATUS_LIST.initial,
      FETCH_USER_STATUS_LIST.success,
      FETCH_USER_STATUS_LIST.fail
    ]);
  },
  fetchPotentialHead({ commit }, params) {
    const slug = "api.users.fetchAll";
    params = params.data;
    STATE_API({ slug, params }, commit, [
      FETCH_POTENTIAL_HEAD.initial,
      FETCH_POTENTIAL_HEAD.success,
      FETCH_POTENTIAL_HEAD.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
