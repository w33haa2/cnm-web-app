import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const SEARCH_ISSUED_BY = generateMutationTypes(
  "INCIDENT REPORT",
  "SEARCH_ISSUED_BY"
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
   * Commits initial state for search sanction levels
   * @param state
   */
  [SEARCH_ISSUED_BY.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for search sanction levels
   * @param state
   */
  [SEARCH_ISSUED_BY.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for search sanction levels
   * @param state
   */
  [SEARCH_ISSUED_BY.fail](state, payload) {
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
   * Action for search sanction levels
   * @param commit
   * @param params
   */
  searchIssuedByIr({ commit }, params) {
    const slug = "api.reports.issued_by_search";
    STATE_API({ slug, params }, commit, [
      SEARCH_ISSUED_BY.initial,
      SEARCH_ISSUED_BY.success,
      SEARCH_ISSUED_BY.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
