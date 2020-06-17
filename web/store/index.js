import Vuex from 'vuex'

Vue.use(Vuex)

let store = () => new Vuex.store({
    state: {
        token: ''
    },
    mutations: {
        setToken (state, token) {
           state.token = token
        }
    },
    actions: {
        nuxtServerInit({ commit}, { req }) {
            console.log(3)
            let cookie = req.headers.cookie
            console.log(commit)
            // commit('setToken ', cookie.token)
        }
    }
 })

export default store