import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_AGENT_LEAVES = generateMutationTypes(
  "leaves",
  "FETCH_AGENT_LEAVES"
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
  [FETCH_AGENT_LEAVES.initial](state) {
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
  [FETCH_AGENT_LEAVES.success](state, payload) {
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
  [FETCH_AGENT_LEAVES.fail](state, payload) {
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
  fetchAgentLeave({ commit }, params) {
    const slug = "api.agents.fetch";
    STATE_API({ slug, params }, commit, [
      FETCH_AGENT_LEAVES.initial,
      FETCH_AGENT_LEAVES.success,
      FETCH_AGENT_LEAVES.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
