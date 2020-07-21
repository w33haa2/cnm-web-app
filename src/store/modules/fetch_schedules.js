import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_SCHEDULES = generateMutationTypes(
    "AGENT SCHEDULES",
    "FETCH_SCHEDULES"
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
     * Commits initial state for FETCH SUBORDINTATES
     * @param state
     */
    [FETCH_SCHEDULES.initial](state) {
        state.state = {
            initial: true,
            success: false,
            fail: false
        };
    },
    /**
     * Commits success state for FETCH SUBORDINTATES
     * @param state
     */
    [FETCH_SCHEDULES.success](state, payload) {
        state.state = {
            initial: false,
            success: true,
            fail: false
        };
        state.data = payload;
        state.title = payload.title;
    },
    /**
     * Commits fail state for FETCH SUBORDINTATES
     * @param state
     */
    [FETCH_SCHEDULES.fail](state, payload) {
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
     * Action for FETCH SUBORDINTATES
     * @param commit
     * @param params
     */
    fetchSchedules({ commit }, params) {
        const slug = "api.schedules.fetchAll";
        STATE_API({ slug, params }, commit, [
            FETCH_SCHEDULES.initial,
            FETCH_SCHEDULES.success,
            FETCH_SCHEDULES.fail
        ]);
    }
};

export default {
    state,
    mutations,
    actions
};