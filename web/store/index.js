export const state = () => ({
    data: {}
})

export const mutations = {
    data (state, data) {
        state.data = data
    }
}

export const actions = {
    async nuxtServerInit({ commit }, { req }) {
        const res = await this.$axios.get('info')
        commit('data', res.data.body);
    },
}