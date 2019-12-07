import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_USER_APPROVED_LEAVES = generateMutationTypes(
  "LOGS",
  "FETCH_USER_APPROVED_LEAVES"
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
   * Commits initial state for fetch approved leaves
   * @param state
   */
  [FETCH_USER_APPROVED_LEAVES.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetch approved leaves
   * @param state
   */
  [FETCH_USER_APPROVED_LEAVES.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for fetch approved leaves
   * @param state
   */
  [FETCH_USER_APPROVED_LEAVES.fail](state, payload) {
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
   * Action for fetch approved leaves
   * @param commit
   * @param params
   */
  fetchUserApprovedLeaves({ commit }, params) {
    const slug = "api.user.fetchAll";
    params.status = "approved";
    params.leaves = true;
    STATE_API({ slug, params }, commit, [
      FETCH_USER_APPROVED_LEAVES.initial,
      FETCH_USER_APPROVED_LEAVES.success,
      FETCH_USER_APPROVED_LEAVES.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
