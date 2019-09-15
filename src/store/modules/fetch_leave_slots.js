import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FECTH_LEAVE_SLOTS = generateMutationTypes(
  "BY ID",
  "FECTH_LEAVE_SLOTS"
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
   * Commits initial state for FETCH INCOMING OT
   * @param state
   */
  [FECTH_LEAVE_SLOTS.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for FETCH INCOMING OT
   * @param state
   */
  [FECTH_LEAVE_SLOTS.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for FETCH INCOMING OT
   * @param state
   */
  [FECTH_LEAVE_SLOTS.fail](state, payload) {
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
   * Action for FETCH INCOMING OT
   * @param commit
   * @param params
   */
  fetchLeaveSlots({ commit }, params) {
    const slug = "api.leave_slots.fetchAll";
    STATE_API({ slug, params }, commit, [
      FECTH_LEAVE_SLOTS.initial,
      FECTH_LEAVE_SLOTS.success,
      FECTH_LEAVE_SLOTS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
