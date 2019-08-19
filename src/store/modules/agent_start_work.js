import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_ATTENDANCE = generateMutationTypes(
  "start_work",
  "CREATE_ATTENDANCE"
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
  [CREATE_ATTENDANCE.initial](state) {
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
  [CREATE_ATTENDANCE.success](state, payload) {
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
  [CREATE_ATTENDANCE.fail](state, payload) {
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
  agentStartWork({ commit }, params) {
    const slug = "api.attendance.create.single";
    STATE_API({ slug, params }, commit, [
      CREATE_ATTENDANCE.initial,
      CREATE_ATTENDANCE.success,
      CREATE_ATTENDANCE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
