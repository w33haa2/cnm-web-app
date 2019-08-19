import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_INCIDENT_REPORT = generateMutationTypes(
  "leaves",
  "UPDATE_INCIDENT_REPORT"
);

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
   * Commits initial state for  update incident report
   * @param state
   */
  [UPDATE_INCIDENT_REPORT.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  update incident report
   * @param state
   */
  [UPDATE_INCIDENT_REPORT.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  update incident report
   * @param state
   */
  [UPDATE_INCIDENT_REPORT.fail](state, payload) {
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
   * Action for  update incident report
   * @param commit
   * @param params
   */
  updateIncidentReport({ commit }, params) {
    const slug = "api.reports.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_INCIDENT_REPORT.initial,
      UPDATE_INCIDENT_REPORT.success,
      UPDATE_INCIDENT_REPORT.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
