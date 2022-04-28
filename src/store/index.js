import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseURL: '',
    blogAlter: {
      success: false,
      failed: false,
      text: ''
    },
    loading: false
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
    closeSuccessBlogAlter(state) {
      state.blogAlter.success = false;
    },
    closeFailedBlogAlter(state) {
      state.blogAlter.failed = false;
    },
    loading(state) {
      state.loading = !state.loading;
    }
  },
  actions: {},
  modules: {}
})