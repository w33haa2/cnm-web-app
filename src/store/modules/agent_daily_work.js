import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const AGENTS_DAILY_REPORT = generateMutationTypes(
  "today's work",
  "AGENTS_DAILY_REPORT"
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
   * Commits initial state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [AGENTS_DAILY_REPORT.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [AGENTS_DAILY_REPORT.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    // console.log(payload.meta)
  },
  /**
   * Commits fail state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [AGENTS_DAILY_REPORT.fail](state, payload) {
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
   * Action for fetching AGENTS WORK REPORTS
   * @param commit
   * @param params
   */
  fetchAgentsTodayWork({ commit }, params) {
    const slug = "api.schedules.work";
    STATE_API({ slug, params }, commit, [
      AGENTS_DAILY_REPORT.initial,
      AGENTS_DAILY_REPORT.success,
      AGENTS_DAILY_REPORT.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
