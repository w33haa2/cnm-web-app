import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const REVERT_OVERTIME_SCHEDULES = generateMutationTypes(
  "REVERT APPROVED",
  "REVERT_OVERTIME_SCHEDULES"
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
  [REVERT_OVERTIME_SCHEDULES.initial](state) {
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
  [REVERT_OVERTIME_SCHEDULES.success](state, payload) {
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
  [REVERT_OVERTIME_SCHEDULES.fail](state, payload) {
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
  revertOvertimeSchedule({ commit }, params) {
    const slug = "api.schedules.revert_ot";
    STATE_API({ slug, params }, commit, [
      REVERT_OVERTIME_SCHEDULES.initial,
      REVERT_OVERTIME_SCHEDULES.success,
      REVERT_OVERTIME_SCHEDULES.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
