import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const DELETE_OT_SCHEDULE = generateMutationTypes(
  "STICKY TIMEIN",
  "DELETE_OT_SCHEDULE"
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
   * Commits initial state for DELETE INCOMING OT
   * @param state
   */
  [DELETE_OT_SCHEDULE.initial](state) {
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
  [DELETE_OT_SCHEDULE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for DELETE INCOMING OT
   * @param state
   */
  [DELETE_OT_SCHEDULE.fail](state, payload) {
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
   * Action for DELETE INCOMING OT
   * @param commit
   * @param params
   */
  deleteOvertimeSchedule({ commit }, params) {
    const slug = "api.overtime.delete";
    STATE_API({ slug, params }, commit, [
      DELETE_OT_SCHEDULE.initial,
      DELETE_OT_SCHEDULE.success,
      DELETE_OT_SCHEDULE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
