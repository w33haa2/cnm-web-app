import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_USER_WEEKLY_LEAVE_REQUEST = generateMutationTypes(
  "LOGS",
  "FETCH_USER_WEEKLY_LEAVE_REQUEST"
);

/**
 * State
 */

const state = {
  state: {
    initial: false,
    success: false,
    fail: false
  },
  data: [],
  title: null
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetch approved leaves
   * @param state
   */
  [FETCH_USER_WEEKLY_LEAVE_REQUEST.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetch approved leaves
   * @param state
   */
  [FETCH_USER_WEEKLY_LEAVE_REQUEST.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for fetch approved leaves
   * @param state
   */
  [FETCH_USER_WEEKLY_LEAVE_REQUEST.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.title = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for fetch approved leaves
   * @param commit
   * @param params
   */
  fetchUserWeeklyLeaveRequests({ commit }, params) {
    const slug = "api.users.fetchAll";
    params.leaves = true;
    STATE_API({ slug, params }, commit, [
      FETCH_USER_WEEKLY_LEAVE_REQUEST.initial,
      FETCH_USER_WEEKLY_LEAVE_REQUEST.success,
      FETCH_USER_WEEKLY_LEAVE_REQUEST.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
