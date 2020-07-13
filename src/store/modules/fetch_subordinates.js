import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_SUBORDINATES = generateMutationTypes(
    "HIERARCHY LOGS",
    "FETCH_SUBORDINATES"
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
    [FETCH_SUBORDINATES.initial](state) {
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
    [FETCH_SUBORDINATES.success](state, payload) {
        state.state = {
            initial: false,
            success: true,
            fail: false
        };
        state.data = payload.meta;
        state.title = payload.title;
    },
    /**
     * Commits fail state for FETCH SUBORDINTATES
     * @param state
     */
    [FETCH_SUBORDINATES.fail](state, payload) {
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
    fetchSubordinates({ commit }, params) {
        const slug = "api.hierarchy_log.subordinates";
        STATE_API({ slug, params }, commit, [
            FETCH_SUBORDINATES.initial,
            FETCH_SUBORDINATES.success,
            FETCH_SUBORDINATES.fail
        ]);
    }
};

export default {
    state,
    mutations,
    actions
};