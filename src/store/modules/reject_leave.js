import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const REJECT_LEAVE = generateMutationTypes("leaves", "REJECT_LEAVE");

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
   * Commits initial state for REJECT LEAVE
   * @param state
   */
  [REJECT_LEAVE.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for REJECT LEAVE
   * @param state
   */
  [REJECT_LEAVE.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for REJECT LEAVE
   * @param state
   */
  [REJECT_LEAVE.fail](state, payload) {
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
   * Action for REJECT LEAVE
   * @param commit
   * @param params
   */
  rejectLeave({ commit }, params) {
    const slug = "api.leaves.reject";
    STATE_API({ slug, params }, commit, [
      REJECT_LEAVE.initial,
      REJECT_LEAVE.success,
      REJECT_LEAVE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
