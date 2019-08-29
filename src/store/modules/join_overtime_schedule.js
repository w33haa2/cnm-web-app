import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
import moment from "moment";
const JOIN_OT_SCHEDULE = generateMutationTypes("STICKY TIMEIN", "JOIN_OT_SCHEDULE");

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
   * Commits initial state for JOIN OT
   * @param state
   */
  [JOIN_OT_SCHEDULE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for JOIN OT
   * @param state
   */
  [JOIN_OT_SCHEDULE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for JOIN OT
   * @param state
   */
  [JOIN_OT_SCHEDULE.fail](state, payload) {
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
   * Action for JOIN OT
   * @param commit
   * @param params
   */
  joinOvertimeSchedule({ commit }, params) {
    const slug = "api.schedules.join_ot";
    STATE_API({ slug, params }, commit, [
      JOIN_OT_SCHEDULE.initial,
      JOIN_OT_SCHEDULE.success,
      JOIN_OT_SCHEDULE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
