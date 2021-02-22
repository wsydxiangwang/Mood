export const state = () => ({
    data: {},
    index: false,
    status: 'more',
    scroll: {}
})

export const mutations = {
    data (state, data) {
        state.data = data
    },
    isIndex (state) {
        state.index = true
    },
    setStatus (state, data) {
        state.status = data
    },
    scrollInfo (state, data) {
        state.scroll = data
    }
}

export const actions = {
    async nuxtServerInit({ commit }, { req }) {
        const res = await this.$axios.get('info')
        commit('data', res.data.body)
    },
}