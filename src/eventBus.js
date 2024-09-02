import { reactive, readonly } from 'vue';

const state = reactive({
  events: []
});

const listeners = {};

const EventBus = {
  state: readonly(state),

  emit(event, payload) {
    state.events.push({ event, payload });
    if (listeners[event]) {
      listeners[event].forEach(callback => callback(payload));
    }
  },

  on(event, callback) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
  },

  off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(listener => listener !== callback);
  },

  clear() {
    state.events.length = 0;
  }
};

export default EventBus;
