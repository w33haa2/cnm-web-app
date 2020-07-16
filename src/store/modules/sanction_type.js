import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const FETCH_SANCTION_TYPES = generateMutationTypes(
    'sanction_types',
    'FETCH_SANCTION_TYPES'
)
const CREATE_SANCTION_TYPES = generateMutationTypes(
    'sanction_types',
    'CREATE_SANCTION_TYPES'
)
const UPDATE_SANCTION_TYPES = generateMutationTypes(
    'sanction_types',
    'UPDATE_SANCTION_TYPES'
)

/**
 * State
 */

const state = {
    fetchingSanctionTypeState: {
        initial: false,
        success: false,
        fail: false
    },
    createSanctionTypeState: {
        initial: false,
        success: false,
        fail: false
    },
    updateSanctionTypeState: {
        initial: false,
        success: false,
        fail: false
    },
    sanction_types: [],
    sanctionTypeErrors: null
}

/**
 * Mutators
 */
const mutations = {
    /**
     * Commits initial state for fetching sanction types
     * @param state
     */
    [FETCH_SANCTION_TYPES.initial](state) {
        state.fetchingSanctionTypeState = {
            initial: true,
            success: false,
            fail: false
        }
    },
    /**
     * Commits success state for fetching sanction types
     * @param state
     */
    [FETCH_SANCTION_TYPES.success](state, payload) {
        state.fetchingSanctionTypeState = {
            initial: false,
            success: true,
            fail: false
        }
        state.sanction_types = payload.meta
    },
    /**
     * Commits fail state for fetching sanction types
     * @param state
     */
    [FETCH_SANCTION_TYPES.fail](state, payload) {
        state.fetchingSanctionTypeState = {
            initial: false,
            success: false,
            fail: true
        }
        state.sanctionTypeErrors = payload.response.data.title
    },
    /**
     * Commits initial state for fetching sanction types
     * @param state
     */
    [CREATE_SANCTION_TYPES.initial](state) {
        state.createSanctionTypeState = {
            initial: true,
            success: false,
            fail: false
        }
    },
    /**
     * Commits success state for fetching sanction types
     * @param state
     */
    [CREATE_SANCTION_TYPES.success](state, payload) {
        state.createSanctionTypeState = {
            initial: false,
            success: true,
            fail: false
        }
    },
    /**
     * Commits fail state for fetching sanction types
     * @param state
     */
    [CREATE_SANCTION_TYPES.fail](state, payload) {
        state.createSanctionTypeState = {
            initial: false,
            success: false,
            fail: true
        }
        state.sanctionTypeErrors = payload.response.data.title
    },
    /**
     * Commits initial state for fetching sanction types
     * @param state
     */
    [UPDATE_SANCTION_TYPES.initial](state) {
        state.updateSanctionTypeState = {
            initial: true,
            success: false,
            fail: false
        }
    },
    /**
     * Commits success state for fetching sanction types
     * @param state
     */
    [UPDATE_SANCTION_TYPES.success](state, payload) {
        state.updateSanctionTypeState = {
            initial: false,
            success: true,
            fail: false
        }
    },
    /**
     * Commits fail state for fetching sanction types
     * @param state
     */
    [UPDATE_SANCTION_TYPES.fail](state, payload) {
        state.updateSanctionTypeState = {
            initial: false,
            success: false,
            fail: true
        }
        state.sanctionTypeErrors = payload.response.data.title
    }
}

const actions = {
    /**
     * Action for fetching sanction types
     * @param commit
     * @param params
     */
    fetchSanctionTypes({ commit }, params) {
        const slug = 'api.sanction_types.fetchAll'
        STATE_API({ slug, params }, commit, [
            FETCH_SANCTION_TYPES.initial,
            FETCH_SANCTION_TYPES.success,
            FETCH_SANCTION_TYPES.fail
        ])
    },
    /**
     * Action for fetching sanction types
     * @param commit
     * @param params
     */
    createSanctionTypes({ commit }, params) {
        const slug = 'api.sanction_types.create'
        STATE_API({ slug, params }, commit, [
            CREATE_SANCTION_TYPES.initial,
            CREATE_SANCTION_TYPES.success,
            CREATE_SANCTION_TYPES.fail
        ])
    },
    /**
     * Action for fetching sanction types
     * @param commit
     * @param params
     */
    updateSanctionTypes({ commit }, params) {
        const slug = 'api.sanction_types.update'
        STATE_API({ slug, params }, commit, [
            UPDATE_SANCTION_TYPES.initial,
            UPDATE_SANCTION_TYPES.success,
            UPDATE_SANCTION_TYPES.fail
        ])
    }
}

export default {
    state,
    mutations,
    actions
}