import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const SEARCH_ACTION_LOGS = generateMutationTypes(
  "ACTION_LOGS",
  "SEARCH_ACTION_LOGS"
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
  errors: null
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for search sanction type
   * @param state
   */
  [SEARCH_ACTION_LOGS.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for search sanction type
   * @param state
   */
  [SEARCH_ACTION_LOGS.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for search sanction type
   * @param state
   */
  [SEARCH_ACTION_LOGS.fail](state, payload) {
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
   * Action for search ir
   * @param commit
   * @param params
   */
  searchLogs({ commit }, params) {
    const slug = "api.logs.search";
    STATE_API({ slug, params }, commit, [
      SEARCH_ACTION_LOGS.initial,
      SEARCH_ACTION_LOGS.success,
      SEARCH_ACTION_LOGS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
