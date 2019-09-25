import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const APPROVE_LEAVE = generateMutationTypes("leaves", "APPROVE_LEAVE");

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
  errors: null,
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for APPROVE LEAVE
   * @param state
   */
  [APPROVE_LEAVE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for APPROVE LEAVE
   * @param state
   */
  [APPROVE_LEAVE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for APPROVE LEAVE
   * @param state
   */
  [APPROVE_LEAVE.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  },
};

const actions = {
  /**
   * Action for APPROVE LEAVE
   * @param commit
   * @param params
   */
  approveLeave({ commit }, params) {
    const slug = "api.leaves.approve";
    STATE_API({ slug, params }, commit, [
      APPROVE_LEAVE.initial,
      APPROVE_LEAVE.success,
      APPROVE_LEAVE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
