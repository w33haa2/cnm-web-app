import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const DELETE_SINGLE_SCHEDULE = generateMutationTypes(
  "Incident Reports",
  "DELETE_SINGLE_SCHEDULE"
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
  [DELETE_SINGLE_SCHEDULE.initial](state) {
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
  [DELETE_SINGLE_SCHEDULE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for  update incident report
   * @param state
   */
  [DELETE_SINGLE_SCHEDULE.fail](state, payload) {
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
  deleteSingleSchedule({ commit }, params) {
    const slug = "api.schedules.delete";
    STATE_API({ slug, params }, commit, [
      DELETE_SINGLE_SCHEDULE.initial,
      DELETE_SINGLE_SCHEDULE.success,
      DELETE_SINGLE_SCHEDULE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
