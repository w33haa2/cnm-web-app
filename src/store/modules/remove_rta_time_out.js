import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const REMOVE_TIMEOUT = generateMutationTypes(
  "SINGLE",
  "REMOVE_TIMEOUT"
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
   * Commits initial state for FETCH INCOMING OT
   * @param state
   */
  [REMOVE_TIMEOUT.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for FETCH INCOMING OT
   * @param state
   */
  [REMOVE_TIMEOUT.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for FETCH INCOMING OT
   * @param state
   */
  [REMOVE_TIMEOUT.fail](state, payload) {
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
   * Action for FETCH INCOMING OT
   * @param commit
   * @param params
   */
  removeTimeOut({ commit }, params) {
    const slug = "api.attendance.remove_timeout";
    STATE_API({ slug, params }, commit, [
      REMOVE_TIMEOUT.initial,
      REMOVE_TIMEOUT.success,
      REMOVE_TIMEOUT.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
