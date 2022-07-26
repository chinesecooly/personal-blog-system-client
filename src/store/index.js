import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseURL: '',
    blogAlter: {
      success: false,
      failed: false,
      warning: false,
      text: ''
    },
    loading: false,
    user: null,
    token: null
  },
  getters: {
    baseURL(state) {
      return state.baseURL;
    },
    blogAlter(state) {
      return state.blogAlter;
    },
    loading(state) {
      return state.loading;
    },
    user(state) {
      return state.user;
    },
    token(state) {
      return state.token;
    }
  },
  mutations: {
    baseURL(state, val) {
      state.baseURL = val;
    },
    successBlogAlter(state, text) {
      state.blogAlter.text = text;
      state.blogAlter.success = true;
    },
    failedBlogAlter(state, text) {
      state.blogAlter.text = text;
      state.blogAlter.failed = true;
    },
    warningBlogAlter(state, text) {
      state.blogAlter.text = text;
      state.blogAlter.warning = true;
    },
    closeSuccessBlogAlter(state) {
      state.blogAlter.success = false;
    },
    closeFailedBlogAlter(state) {
      state.blogAlter.failed = false;
    },
    closeWarningBlogAlter(state) {
      state.blogAlter.warning = false;
    },
    loading(state) {
      state.loading = !state.loading;
    },
    user(state, user) {
      state.user = user;
    },
    token(state, token) {
      state.token = token;
    }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer(state) {
        return {
          baseURL: state.baseURL,
          user: state.user,
          token: state.token
        }
      }
    })
  ]
})