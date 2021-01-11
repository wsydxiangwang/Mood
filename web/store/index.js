export const state = () => ({
    data: {},
    index: false
})

export const mutations = {
    data (state, data) {
        state.data = data
    },
    isIndex (state) {
        state.index = true
    }
}

export const actions = {
    // 获取网站信息
    async nuxtServerInit({ commit }, { req }) {
        const res = await this.$axios.get('info')
        commit('data', res.data.body)
    },
}