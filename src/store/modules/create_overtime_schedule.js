import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_OT_SCHEDULE = generateMutationTypes("STICKY TIMEIN", "CREATE_OT_SCHEDULE");

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
   * Commits initial state for CREATE INCOMING OT
   * @param state
   */
  [CREATE_OT_SCHEDULE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for CREATE INCOMING OT
   * @param state
   */
  [CREATE_OT_SCHEDULE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for CREATE INCOMING OT
   * @param state
   */
  [CREATE_OT_SCHEDULE.fail](state, payload) {
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
   * Action for CREATE INCOMING OT
   * @param commit
   * @param params
   */
  createOvertimeSchedule({ commit }, params) {
    const slug = "api.overtime.create";
    STATE_API({ slug, params }, commit, [
      CREATE_OT_SCHEDULE.initial,
      CREATE_OT_SCHEDULE.success,
      CREATE_OT_SCHEDULE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
