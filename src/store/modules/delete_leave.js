import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const DELETE_LEAVE = generateMutationTypes("leaves", "DELETE_LEAVE");

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
   * Commits initial state for  DELETE LEAVE
   * @param state
   */
  [DELETE_LEAVE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  DELETE LEAVE
   * @param state
   */
  [DELETE_LEAVE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  DELETE LEAVE
   * @param state
   */
  [DELETE_LEAVE.fail](state, payload) {
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
   * Action for  DELETE LEAVE
   * @param commit
   * @param params
   */
  deleteLeave({ commit }, params) {
    const slug = "api.leaves.delete";
    STATE_API({ slug, params }, commit, [
      DELETE_LEAVE.initial,
      DELETE_LEAVE.success,
      DELETE_LEAVE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
