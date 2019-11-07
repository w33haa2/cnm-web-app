import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_OT_SCHEDULE = generateMutationTypes(
  "STICKY TIMEIN",
  "UPDATE_OT_SCHEDULE"
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
   * Commits initial state for UPDATE INCOMING OT
   * @param state
   */
  [UPDATE_OT_SCHEDULE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for UPDATE INCOMING OT
   * @param state
   */
  [UPDATE_OT_SCHEDULE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for UPDATE INCOMING OT
   * @param state
   */
  [UPDATE_OT_SCHEDULE.fail](state, payload) {
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
   * Action for UPDATE INCOMING OT
   * @param commit
   * @param params
   */
  updateOvertimeSchedule({ commit }, params) {
    const slug = "api.overtime.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_OT_SCHEDULE.initial,
      UPDATE_OT_SCHEDULE.success,
      UPDATE_OT_SCHEDULE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
