import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_SCHEDULE_BULK = generateMutationTypes(
  "REGULAR SCHEDULE",
  "CREATE_SCHEDULE_BULK"
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
  [CREATE_SCHEDULE_BULK.initial](state) {
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
  [CREATE_SCHEDULE_BULK.success](state, payload) {
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
  [CREATE_SCHEDULE_BULK.fail](state, payload) {
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
  createScheduleBulk({ commit }, params) {
    const slug = "api.schedules.create_bulk";
    STATE_API({ slug, params }, commit, [
      CREATE_SCHEDULE_BULK.initial,
      CREATE_SCHEDULE_BULK.success,
      CREATE_SCHEDULE_BULK.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
