import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_LEAVE = generateMutationTypes("leaves", "CREATE_LEAVE");

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
   * Commits initial state for  CREATE LEAVE
   * @param state
   */
  [CREATE_LEAVE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  CREATE LEAVE
   * @param state
   */
  [CREATE_LEAVE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  CREATE LEAVE
   * @param state
   */
  [CREATE_LEAVE.fail](state, payload) {
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
   * Action for  CREATE LEAVE
   * @param commit
   * @param params
   */
  createLeave({ commit }, params) {
    const slug = "api.leaves.create";
    STATE_API({ slug, params }, commit, [
      CREATE_LEAVE.initial,
      CREATE_LEAVE.success,
      CREATE_LEAVE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
