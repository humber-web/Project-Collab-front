<template>
  <div :class="{ 'bg-gray-600': userSettings.theme === 'dark', 'bg-white': userSettings.theme === 'light' }"
    class="flex gap-1 p-1 w-full max-w-xs">
    <div class="flex flex-col w-full p-2 rounded-xl"
      :class="{ 'bg-gray-100': userSettings.theme === 'light', 'bg-gray-700': userSettings.theme === 'dark' }">
      <div class="flex items-center space-x-1 ">
        <span class="text-xs font-semibold"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-white': userSettings.theme === 'dark' }">{{
            message.sender }}</span>
        <span class="text-xs"
          :class="{ 'text-gray-500': userSettings.theme === 'light', 'text-gray-400': userSettings.theme === 'dark' }">{{
            formatDate(message.timestamp) }}</span>
      </div>
      <p class="text-xs"
        :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-white': userSettings.theme === 'dark' }">{{
          message.content }}</p>
    </div>
    <div class="ml-auto">
      <button @click="toggleDropdown" class="p-1 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none"
        :class="{ 'text-gray-900 bg-white focus:ring-gray-50': userSettings.theme === 'light', 'text-white bg-gray-900 dark:hover:bg-gray-800 focus:ring-gray-600': userSettings.theme === 'dark' }">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 4 15" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>
      <div v-show="dropdownOpen" class="divide-y divide-gray-100 rounded-lg shadow w-36 mt-1"
        :class="{ 'bg-white': userSettings.theme === 'light', 'bg-gray-700 dark:divide-gray-600': userSettings.theme === 'dark' }">
        <ul class="py-1 text-xs"
          :class="{ 'text-gray-700 hover:bg-gray-600': userSettings.theme === 'light', 'text-gray-200': userSettings.theme === 'dark' }">
          <li>
            <a href="#" class="block px-3 py-1 rounded"
              :class="{ 'hover:bg-gray-100 hover:text-white': userSettings.theme === 'light', 'hover:bg-gray-600 hover:text-white': userSettings.theme === 'dark' }">
              {{ $t('message.reply') }}
            </a>
          </li>
          <li>
            <a href="#" class="block px-3 py-1"
              :class="{ 'hover:bg-gray-100 hover:text-white': userSettings.theme === 'light', 'hover:bg-gray-600 hover:text-white': userSettings.theme === 'dark' }">
              {{ $t('message.copy') }}
            </a>
          </li>
          <a href="#" @click.prevent="deleteMessage" class="block px-3 py-1"
            :class="{ 'hover:bg-gray-100 hover:bg-gray-600 hover:text-white': userSettings.theme === 'light', 'hover:bg-gray-600 hover:text-white': userSettings.theme === 'dark', 'opacity-50 cursor-not-allowed': message.sender !== loggedInUser.id }">
            {{ $t('message.delete') }}
          </a>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'ChatMessage',
  computed: {
    ...mapState(['userSettings']),
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    loggedInUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString(); // change this to your preferred format
    },
    deleteMessage(event) {
      if (this.message.sender !== this.loggedInUser.id) {
        event.preventDefault();
        return;
      }
      this.$emit('delete-message', this.message);
    },
  },
};
</script>
