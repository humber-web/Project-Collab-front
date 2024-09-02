<template>
  <div :class="{ 'bg-gray-600': userSettings.theme === 'dark', 'bg-white': userSettings.theme === 'light' }">
    <ChatMessage v-for="message in messages" :key="message.id" :message="message" @delete-message="handleDeleteMessage"
      :loggedInUser="this.loggedInUser" />
  </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue';
import { ref, watch } from 'vue';
import { mapState } from 'vuex';

export default {
  name: 'ChatContainer',
  components: {
    ChatMessage,
  },
  computed: {
    ...mapState(['userSettings']),

  },
  props: {
    project: {
      type: Object,
      required: true,
    },

    messages: {
      type: Array,
      required: true,
    },
    loggedInUser: {
      type: Object,
      required: true,
    }
  },
  methods: {
    handleNewMessage(newMessage) {
      console.log('newMessage', newMessage)
      this.messages.push(newMessage)
    },
    handleDeleteMessage(message) {
      this.$emit('delete-message', message);
    },
  },

  setup(props) {
    const messageInput = ref('');



    return {
      messageInput,
      sendMessage() {
        if (messageInput.value !== '') {
          socket.value.send(JSON.stringify({
            content: messageInput.value,
          }));
          messageInput.value = '';
        }
      },
    };
  },
};
</script>