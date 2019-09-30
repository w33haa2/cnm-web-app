import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const EMPLOYEE_TEMPLATE = generateMutationTypes(
  "export excel",
  "EMPLOYEE_TEMPLATE"
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
   * Commits initial state for fetching EXCEL EMPLOYEE TEMPLATE
   * @param state
   */
  [EMPLOYEE_TEMPLATE.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching EXCEL EMPLOYEE TEMPLATE
   * @param state
   */
  [EMPLOYEE_TEMPLATE.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
  },
  /**
   * Commits fail state for fetching EXCEL EMPLOYEE TEMPLATE
   * @param state
   */
  [EMPLOYEE_TEMPLATE.fail](state, payload) {
    state.fetchingState = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response;
  }
};

const actions = {
  /**
   * Action for fetching AGENTS WORK REPORTS
   * @param commit
   * @param params
   */
  exportEmployeeTemplate({ commit }, params) {
    const slug = "api.excel.employeeTemplate";
    STATE_API({ slug, params }, commit, [
      EMPLOYEE_TEMPLATE.initial,
      EMPLOYEE_TEMPLATE.success,
      EMPLOYEE_TEMPLATE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
