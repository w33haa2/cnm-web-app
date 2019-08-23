import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const DELETE_USER_STATUS = generateMutationTypes("USER_STATUS", "DELETE_USER_STATUS");

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
   * Commits initial state for  DELETE USER STATUS
   * @param state
   */
  [DELETE_USER_STATUS.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  DELETE USER STATUS
   * @param state
   */
  [DELETE_USER_STATUS.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  DELETE USER STATUS
   * @param state
   */
  [DELETE_USER_STATUS.fail](state, payload) {
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
   * Action for  DELETE USER STATUS
   * @param commit
   * @param params
   */
  deleteUserStatus({ commit }, params) {
    const slug = "api.user_status.delete";
    STATE_API({ slug, params }, commit, [
      DELETE_USER_STATUS.initial,
      DELETE_USER_STATUS.success,
      DELETE_USER_STATUS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
