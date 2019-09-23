import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_SCHEDULE = generateMutationTypes("UPDATE", "UPDATE_SCHEDULE");

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
   * Commits initial state for  CREATE LEAVE
   * @param state
   */
  [UPDATE_SCHEDULE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for  CREATE LEAVE
   * @param state
   */
  [UPDATE_SCHEDULE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  CREATE LEAVE
   * @param state
   */
  [UPDATE_SCHEDULE.fail](state, payload) {
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
   * Action for  CREATE LEAVE
   * @param commit
   * @param params
   */
  updateSchedule({ commit }, params) {
    const slug = "api.schedules.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_SCHEDULE.initial,
      UPDATE_SCHEDULE.success,
      UPDATE_SCHEDULE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
