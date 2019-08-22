import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_REPORT_RESPONSE = generateMutationTypes("INCIDENT REPORTS", "CREATE_REPORT_RESPONSE");

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
  errors: null,
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for CREATE REPORT RESPONSE
   * @param state
   */
  [CREATE_REPORT_RESPONSE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for CREATE REPORT RESPONSE
   * @param state
   */
  [CREATE_REPORT_RESPONSE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for CREATE REPORT RESPONSE
   * @param state
   */
  [CREATE_REPORT_RESPONSE.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  },
};

const actions = {
  /**
   * Action for CREATE REPORT RESPONSE
   * @param commit
   * @param params
   */
  createReportResponse({ commit }, params) {
    const slug = "api.reports.create_response";
    STATE_API({ slug, params }, commit, [
      CREATE_REPORT_RESPONSE.initial,
      CREATE_REPORT_RESPONSE.success,
      CREATE_REPORT_RESPONSE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
