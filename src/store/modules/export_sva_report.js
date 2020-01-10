import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const EXPORT_SVA_REPORT = generateMutationTypes(
  "EXCEL",
  "EXPORT_SVA_REPORT"
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
   * Commits initial state for EXPORT SVA
   * @param state
   */
  [EXPORT_SVA_REPORT.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for EXPORT SVA
   * @param state
   */
  [EXPORT_SVA_REPORT.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload;
    state.title = payload.title;
  },
  /**
   * Commits fail state for EXPORT SVA
   * @param state
   */
  [EXPORT_SVA_REPORT.fail](state, payload) {
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
   * Action for CANCEL INCOMING OT
   * @param commit
   * @param params
   */
  exportSvaReport({ commit }, params) {
    const slug = "api.excel.export_sva";
    STATE_API({ slug, params }, commit, [
      EXPORT_SVA_REPORT.initial,
      EXPORT_SVA_REPORT.success,
      EXPORT_SVA_REPORT.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
