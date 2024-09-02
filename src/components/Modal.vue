<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop
      :class="{ 'bg-white text-gray-900': userSettings.theme === 'light', 'bg-gray-700 text-gray-100': userSettings.theme === 'dark' }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['userSettings'])
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}
.bg-white {
  background: white;
}
.text-gray-900 {
  color: #1a202c;
}
.bg-gray-700 {
  background: #4a5568;
}
.text-gray-100 {
  color: #f7fafc;
}
</style>
