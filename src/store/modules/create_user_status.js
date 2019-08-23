import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_USER_STATUS = generateMutationTypes("USER_STATUS", "CREATE_USER_STATUS");

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
   * Commits initial state for  CREATE USER STATUS
   * @param state
   */
  [CREATE_USER_STATUS.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  CREATE USER STATUS
   * @param state
   */
  [CREATE_USER_STATUS.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  CREATE USER STATUS
   * @param state
   */
  [CREATE_USER_STATUS.fail](state, payload) {
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
   * Action for  CREATE USER STATUS
   * @param commit
   * @param params
   */
  createUserStatus({ commit }, params) {
    const slug = "api.user_status.create";
    STATE_API({ slug, params }, commit, [
      CREATE_USER_STATUS.initial,
      CREATE_USER_STATUS.success,
      CREATE_USER_STATUS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
