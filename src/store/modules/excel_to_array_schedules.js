import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const EXCEL_TO_ARRAY = generateMutationTypes(
  "REGULAR SCHEDULE",
  "EXCEL_TO_ARRAY"
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
   * Commits initial state for DELETE INCOMING OT
   * @param state
   */
  [EXCEL_TO_ARRAY.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for DELETE INCOMING OT
   * @param state
   */
  [EXCEL_TO_ARRAY.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for DELETE INCOMING OT
   * @param state
   */
  [EXCEL_TO_ARRAY.fail](state, payload) {
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
   * Action for DELETE INCOMING OT
   * @param commit
   * @param params
   */
  excelToArraySchedule({ commit }, params) {
    const slug = "api.schedules.excel_to_array";
    STATE_API({ slug, params }, commit, [
      EXCEL_TO_ARRAY.initial,
      EXCEL_TO_ARRAY.success,
      EXCEL_TO_ARRAY.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
