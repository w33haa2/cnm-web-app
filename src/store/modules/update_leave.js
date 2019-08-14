import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_LEAVE = generateMutationTypes("leaves", "UPDATE_LEAVE");

/**
 * state
 */

const state = {
  state: {
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
   * Commits initial state for  UPDATE LEAVE
   * @param state
   */
  [UPDATE_LEAVE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  UPDATE LEAVE
   * @param state
   */
  [UPDATE_LEAVE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  UPDATE LEAVE
   * @param state
   */
  [UPDATE_LEAVE.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for  UPDATE LEAVE
   * @param commit
   * @param params
   */
  updateLeave({ commit }, params) {
    const slug = "api.leaves.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_LEAVE.initial,
      UPDATE_LEAVE.success,
      UPDATE_LEAVE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
