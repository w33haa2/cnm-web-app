import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_USER_STATUS = generateMutationTypes("USER_STATUS", "UPDATE_USER_STATUS");

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
   * Commits initial state for  UPDATE USER STATUS
   * @param state
   */
  [UPDATE_USER_STATUS.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  UPDATE USER STATUS
   * @param state
   */
  [UPDATE_USER_STATUS.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  UPDATE USER STATUS
   * @param state
   */
  [UPDATE_USER_STATUS.fail](state, payload) {
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
   * Action for  UPDATE USER STATUS
   * @param commit
   * @param params
   */
  updateUserStatus({ commit }, params) {
    const slug = "api.user_status.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_USER_STATUS.initial,
      UPDATE_USER_STATUS.success,
      UPDATE_USER_STATUS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
