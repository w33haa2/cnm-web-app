import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_LEAVE_SLOT_BULK = generateMutationTypes("STICKY TIMEIN", "CREATE_LEAVE_SLOT_BULK");

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
  [CREATE_LEAVE_SLOT_BULK.initial](state) {
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
  [CREATE_LEAVE_SLOT_BULK.success](state, payload) {
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
  [CREATE_LEAVE_SLOT_BULK.fail](state, payload) {
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
  createLeaveSlotBulk({ commit }, params) {
    const slug = "api.leave_slots.create_bulk";
    STATE_API({ slug, params }, commit, [
      CREATE_LEAVE_SLOT_BULK.initial,
      CREATE_LEAVE_SLOT_BULK.success,
      CREATE_LEAVE_SLOT_BULK.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
