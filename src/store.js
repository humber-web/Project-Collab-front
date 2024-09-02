// store.js
import { createStore } from 'vuex';
// import EventBus from './eventBus.js';
let user = JSON.parse(localStorage.getItem('user'));

const store = createStore({
  state: {
    userSettings: {
      theme: 'light', // Default value
      language: 'en', // Default value
      userPhoto: user?.userPhoto || null
    },
  },
  mutations: {
    setUserSettings(state, userSettings) {
      state.userSettings = userSettings;
    },
    updateUserSettings(state, newSettings) {
      state.userSettings = { ...state.userSettings, ...newSettings };
    },
    updateUserPhoto(state, newPhotoUrl) {
      state.userSettings.userPhoto = newPhotoUrl;
      console.log('User photo updated:', newPhotoUrl);
    },
  },
  actions: {
    updateUserSettings({ commit }, newSettings) {
      commit('updateUserSettings', newSettings);
    },
    updateUserPhoto({ commit }, newPhotoUrl) {
      commit('updateUserPhoto', newPhotoUrl);
    },
  },
  modules: {},
});

// EventBus.on('user-photo-changed', newPhotoUrl => {
//   store.dispatch('updateUserPhoto', newPhotoUrl);
// });

export default store;
