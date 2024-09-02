<template>
  <div class="notification-container">
    <div v-if="notifications.length === 0" class="p-2 text-center bg-gray-600 text-gray-200 ">Sem notificações</div>
    <div v-for="(notification, index) in notifications" :key="index" class="p-2 border-b border-gray-300 bg-gray-600 text-gray-200">
      <!-- Added click handler here -->
      <p class="cursor-pointer hover:bg-gray-700 rounded-md px-1" @click="markAsRead(notification.id)">
        {{ notification.message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationComponent',
  props: {
    notifications: {
      type: Array,
      required: true,
    },
  },
  methods: {
    markAsRead(notificationId) {
      // Emit an event when a notification is clicked
      this.$emit('notification-clicked', notificationId);
    }
  },
  created() {
    console.log('Notifications in notifications:',this.notifications)
  }
};
</script>

<style scoped>
.notification-container {
  max-height: 300px;
  overflow-y: auto;
  /* background-color: white; */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  z-index: 10;
}
</style>
