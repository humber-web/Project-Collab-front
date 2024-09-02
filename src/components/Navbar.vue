<template>
  <nav :class="{ 'bg-gray-200': userSettings.theme === 'light', 'bg-gray-800': userSettings.theme === 'dark' }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button type="button"
            :class="['relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white', { 'text-gray-400 hover:bg-gray-700 hover:text-white': userSettings.theme === 'dark', 'text-gray-600 hover:bg-gray-300 hover:text-black': userSettings.theme === 'light' }]"
            aria-controls="mobile-menu" aria-expanded="false" v-on:click="showMobileMenu = !showMobileMenu">
            <span class="sr-only">{{ $t('message.openMainMenu') }}</span>
            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img class="h-8 w-auto" src="" alt="">
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <router-link :to="'/dashboard'"
                :class="[activePage === 'Dashboard' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'rounded-md px-3 py-2 text-sm font-medium']"
                @click.native="activePage = 'Dashboard'">{{ $t('message.dashboard') }}</router-link>
              <router-link :to="'/teamchat'"
                :class="[activePage === 'Team' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium']"
                @click="activePage = 'Team'">{{ $t('message.team') }}
                <p v-if="counterMessages > 0"
                  class="bg-red-500 text-white rounded-full text-center text-xs h-4 w-4 shadow-2xl">
                  {{ counterMessages }}
                </p>
              </router-link>
              <router-link :to="'/projects'"
                :class="[activePage === 'Projects' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'rounded-md px-3 py-2 text-sm font-medium']"
                @click.native="activePage = 'Projects'">{{ $t('message.projects') }}</router-link>
              <router-link :to="'/calendar'"
                :class="[activePage === 'Calendar' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'rounded-md px-3 py-2 text-sm font-medium']"
                @click="activePage = 'Calendar'">{{ $t('message.calendar') }}</router-link>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button type="button" :class="['relative rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2',
            userSettings.theme === 'dark' ? 'bg-gray-800 focus:ring-white focus:ring-offset-gray-800 text-gray-400 hover:text-white' :
              'bg-gray-200 focus:ring-black focus:ring-offset-gray-200 text-gray-600 hover:text-black']"
            @click="toggleNotifications">
            <span class="sr-only">{{ $t('message.viewNotifications') }}</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              :stroke="userSettings.theme === 'light' ? '#000000' : '#FFFFFF'" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <div v-if="unreadNotifications > 0"
              class="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center p-2 text-xs text-white">
              <div class="text-center p-1">
                {{ unreadNotifications }}
              </div>
            </div>
          </button>
          <div v-if="showNotifications"
            :class="[userSettings.theme === 'dark' ? 'bg-gray-700' : 'bg-white', 'absolute right-0 top-14 w-64 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 overflow-hidden']"
            role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
            <NotificationComponent :notifications="notifications" @notification-clicked="handleNotificationClick" />
          </div>
          <div class="relative ml-3">
            <div>
              <button type="button"
                class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                v-on:click="showDropdown = !showDropdown">
                <span class="sr-only">{{ $t('message.openMainMenu') }}</span>
                <img class="h-8 w-8 rounded-full" :src="userPhoto" :alt="Image">
              </button>
            </div>
            <div
              :class="[userSettings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700', 'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none']"
              role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1"
              v-if="showDropdown">
              <router-link :to="{ name: 'user', params: { openForm: 'user' } }" class="block px-4 py-2 text-sm"
                role="menuitem" tabindex="-1" id="user-menu-item-0" @click.native="closeDropdown">{{
                  $t('message.yourProfile') }}</router-link>
              <router-link :to="{ name: 'user', params: { openForm: 'settings' } }" class="block px-4 py-2 text-sm"
                role="menuitem" tabindex="-1" id="user-menu-item-0" @click.native="closeDropdown">{{
                  $t('message.settings') }}</router-link>
              <div class="cursor-pointer block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="user-menu-item-2"
                @click="logout">{{ $t('message.signOut') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sm:hidden" id="mobile-menu" v-if="showMobileMenu">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <router-link :to="'/dashboard'"
          :class="[activePage === 'Dashboard' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'block rounded-md px-3 py-2 text-base font-medium']"
          @click.native="activePage = 'Dashboard'">{{ $t('message.dashboard') }}</router-link>
        <router-link :to="'/teamchat'"
          :class="[activePage === 'Team' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium']"
          @click="activePage = 'Team'">{{ $t('message.team') }}
          <p v-if="counterMessages > 0"
            class="bg-red-500 text-white rounded-full text-center text-xs h-4 w-4 shadow-2xl">
            {{ counterMessages }}
          </p>
        </router-link>
        <router-link :to="'/projects'"
          :class="[activePage === 'Projects' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'block rounded-md px-3 py-2 text-base font-medium']"
          @click.native="activePage = 'Projects'">{{ $t('message.projects') }}</router-link>
        <router-link :to="'/calendar'"
          :class="[activePage === 'Calendar' ? 'bg-gray-900 text-white' : (userSettings.theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-300 hover:text-black'), 'block rounded-md px-3 py-2 text-base font-medium']"
          @click="activePage = 'Calendar'">{{ $t('message.calendar') }}</router-link>
        
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
import NotificationComponent from './NotificationComponent.vue';
import { WS_BASE_URL, BASE_URL } from '@/config';
import EventBus from '@/eventBus';
import { mapState } from 'vuex';
import avatar from '@/assets/avatar.png';


export default {
  components: {
    NotificationComponent

  },
  computed: {
    ...mapState(['userSettings']),
    
   
   
  },
  data() {
    return {
      showDropdown: false,
      showMobileMenu: false,
      showNotifications: false,
      notifications: [],
      unreadNotifications: 0,
      activePage: 'Dashboard',
      socket: null,
      projectSockets: {},
      counterMessages: 0,
      userPhoto: null,
      user: JSON.parse(localStorage.getItem('user')) || {}
    };
  },
  watch: {
    userSettings: {
      handler(newVal,oldVal) {
        if( newVal.userPhoto) {
          console.log('New Val:',newVal);
          this.userPhoto = `${BASE_URL}${newVal.userPhoto}`;
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    closeDropdown() {
      this.showDropdown = false;
    },
    getUserFromLocalStorage() {
      this.user = JSON.parse(localStorage.getItem('user'));
    },
    initializeWebSockets(projects) {
      let user = JSON.parse(localStorage.getItem('user'));
      projects.forEach(project => {
        const projectId = project.id;
        const socket = new WebSocket(`${WS_BASE_URL}/ws/chat/${projectId}/`);

        socket.onopen = () => {
          console.log(`WebSocket connected for project ${projectId}.`);
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.message) {
            data.message.project = projectId;
            if (data.message.sender != user.id) {
              this.counterMessages++;
              // EventBus.emit('unreadMessagesCountChanged', this.counterMessages);
            }
            EventBus.emit('newMessage', data.message);

          } else {
            console.log('Received data without message:', data);
          }
        };

        socket.onclose = () => {
          console.log(`WebSocket closed for project ${projectId}.`);
        };

        socket.onerror = (error) => {
          console.error(`WebSocket error for project ${projectId}:`, error);
        };

        this.projectSockets[projectId] = socket;
      });
    },
    async fetchUserProjects() {
      // const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`${BASE_URL}/api/projects/member/${this.user.id}/`);
        const projects = response.data;
        this.initializeWebSockets(projects);
      } catch (error) {
        console.error('Failed to fetch user projects:', error);
      }
    },
    logout() {
      this.showDropdown = false;
      localStorage.removeItem('user'); // Remove o usuário do localStorage
      this.$router.push("/"); // Redireciona para a página inicial
      localStorage.clear();
      // Clear Authorization header from axios
      delete axios.defaults.headers.common['Authorization'];
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        // this.unreadNotifications = 0;
      }
    },
    handleNotificationClick(notificationId) {
      axios.put(`${BASE_URL}/api/notifications/mark-read/${notificationId}/`)
        .then(() => {
          // Update the notification's read state in the list
          const index = this.notifications.findIndex(n => n.id === notificationId);
          if (index !== -1 && !this.notifications[index].read) { // Check if it's not already marked as read
            this.notifications[index].read = true;
            this.unreadNotifications -= 1; // Decrement the unread count
          }
        })
        .catch(error => {
          console.error('Error updating notification:', error);
        });
    },
    async fetchUnreadMessages() {
      let user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`${BASE_URL}/api/unread-messages-count/${user.id}/`);
        if (this.activePage != 'Team') {
          this.counterMessages = response.data.unread_messages_count;
        }
      } catch {
        console.error('Failed to fetch unread messages');
      }
    }
  },

  created() {
    
    this.userPhoto = `${BASE_URL}${this.userSettings.userPhoto}`;
    this.fetchUserProjects();
    this.fetchUnreadMessages();
    this.socket = new WebSocket(`${BASE_URL}/ws/notifications/${this.user.id}/`);
    this.getUserFromLocalStorage();

    this.socket.onopen = () => {
      console.log('WebSocket is connected.');
    };

    this.socket.onmessage = (event) => {

      const data = JSON.parse(event.data);
      console.log('Event', event.data)
      this.notifications.push(data);
      // Since the array only contains unread notifications, directly use its length
      this.unreadNotifications = this.notifications.length;
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed.');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    EventBus.on('unreadMessagesCountChanged', count => {
      this.counterMessages = count;
    });
  },
  beforeDestroy() {
    Object.values(this.projectSockets).forEach(socket => {
      if (socket) {
        socket.close();
      }
    });
    EventBus.off('unreadMessagesCountChanged');
    EventBus.off('user-photo-changed');
  }
};
</script>

<style scoped>
.notification-container {
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  z-index: 10;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: auto;
}
</style>
