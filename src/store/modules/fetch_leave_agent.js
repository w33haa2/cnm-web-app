import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_LEAVE_AGENTS = generateMutationTypes(
  "leaves",
  "FETCH_LEAVE_AGENTS"
);

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
  errors: null
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching leaves
   * @param state
   */
  [FETCH_LEAVE_AGENTS.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching leaves
   * @param state
   */
  [FETCH_LEAVE_AGENTS.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for fetching leaves
   * @param state
   */
  [FETCH_LEAVE_AGENTS.fail](state, payload) {
    state.fetchingState = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for fetching leaves
   * @param commit
   * @param params
   */
  fetchLeaveAgent({ commit }, params) {
    const slug = "api.leaves.fetchAll";
    STATE_API({ slug, params }, commit, [
      FETCH_LEAVE_AGENTS.initial,
      FETCH_LEAVE_AGENTS.success,
      FETCH_LEAVE_AGENTS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
