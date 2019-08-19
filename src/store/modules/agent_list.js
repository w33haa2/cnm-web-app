import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_AGENTS = generateMutationTypes(
  "for_remote_funtion",
  "FETCH_AGENTS"
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
  errors: []
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching agent list
   * @param state
   */
  [FETCH_AGENTS.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching agent list
   * @param state
   */
  [FETCH_AGENTS.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for fetching agent list
   * @param state
   */
  [FETCH_AGENTS.fail](state, payload) {
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
   * Action for fetching agent list
   * @param commit
   * @param params
   */
  fetchAgents({ commit }, params) {
    const slug = "api.schedules.agents";
    params = params.data;
    STATE_API({ slug, params }, commit, [
      FETCH_AGENTS.initial,
      FETCH_AGENTS.success,
      FETCH_AGENTS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
