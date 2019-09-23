import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_SCHEDULE = generateMutationTypes(
  "REGULAR SCHEDULE",
  "CREATE_SCHEDULE"
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
  [CREATE_SCHEDULE.initial](state) {
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
  [CREATE_SCHEDULE.success](state, payload) {
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
  [CREATE_SCHEDULE.fail](state, payload) {
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
  createSchedule({ commit }, params) {
    const slug = "api.schedules.create.single";
    STATE_API({ slug, params }, commit, [
      CREATE_SCHEDULE.initial,
      CREATE_SCHEDULE.success,
      CREATE_SCHEDULE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
