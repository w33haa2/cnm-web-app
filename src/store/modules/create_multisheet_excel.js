import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const TO_MS_EXCEL = generateMutationTypes(
  "to multisheet excel",
  "TO_MS_EXCEL"
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
  [TO_MS_EXCEL.initial](state) {
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
  [TO_MS_EXCEL.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload;
  },
  /**
   * Commits fail state for  update incident report
   * @param state
   */
  [TO_MS_EXCEL.fail](state, payload) {
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
  createMultisheetExcel({ commit }, params) {
    const slug = "api.excel.multisheet";
    STATE_API({ slug, params }, commit, [
      TO_MS_EXCEL.initial,
      TO_MS_EXCEL.success,
      TO_MS_EXCEL.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
