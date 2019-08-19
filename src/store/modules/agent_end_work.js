import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_ATTENDANCE = generateMutationTypes(
  "end_work",
  "UPDATE_ATTENDANCE"
);

/**
 * State
 */

const state = {
  fetchingState: {
    initial: false,
    success: false,
    fail: false
  },
  data: [],
  errors: null
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for CREATE ATTENDANCE
   * @param state
   */
  [UPDATE_ATTENDANCE.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for CREATE ATTENDANCE
   * @param state
   */
  [UPDATE_ATTENDANCE.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for CREATE ATTENDANCE
   * @param state
   */
  [UPDATE_ATTENDANCE.fail](state, payload) {
    state.fetchingState = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for CREATE ATTENDANCE
   * @param commit
   * @param params
   */
  agentEndWork({ commit }, params) {
    const slug = "api.attendance.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_ATTENDANCE.initial,
      UPDATE_ATTENDANCE.success,
      UPDATE_ATTENDANCE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
