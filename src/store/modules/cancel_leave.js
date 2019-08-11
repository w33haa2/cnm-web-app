import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CANCEL_LEAVE = generateMutationTypes("leaves", "CANCEL_LEAVE");

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
  errors: null,
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for CANCEL LEAVE
   * @param state
   */
  [CANCEL_LEAVE.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for CANCEL LEAVE
   * @param state
   */
  [CANCEL_LEAVE.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for CANCEL LEAVE
   * @param state
   */
  [CANCEL_LEAVE.fail](state, payload) {
    state.fetchingState = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  },
};

const actions = {
  /**
   * Action for CANCEL LEAVE
   * @param commit
   * @param params
   */
  cancelLeave({ commit }, params) {
    const slug = "api.leaves.cancel";
    STATE_API({ slug, params }, commit, [
      CANCEL_LEAVE.initial,
      CANCEL_LEAVE.success,
      CANCEL_LEAVE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
