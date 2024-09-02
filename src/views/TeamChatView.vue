<template>
    <div class="h-full p-1 flex gap-1 flex-col md:flex-row lg:flex-row"
        :class="{ 'bg-gray-600 text-gray-100': userSettings.theme === 'dark', 'bg-gray-100 text-gray-800': userSettings.theme === 'light' }">
      <div class="w-full md:w-1/6 p-1 rounded-lg min-h-full max-h-full overflow-auto custom-scrollbar"
          :class="{ 'bg-gray-700 text-gray-100': userSettings.theme === 'dark', 'bg-gray-200 text-gray-800': userSettings.theme === 'light' }"
          v-if="showProjects">
        <h1 class="px-1 text-lg">{{ $t('message.chats') }}</h1>
        <input type="search" v-model="searchTerm" class="w-full p-2 rounded-lg mb-2"
            :class="{ 'bg-gray-300 text-gray-800': userSettings.theme === 'light', 'bg-gray-800 text-gray-100': userSettings.theme === 'dark' }"
            :placeholder="$t('message.searchPlaceholder')">
        <div class="gap-1">
          <div v-for="project in filteredProjects" :key="project.id" @click="selectProject(project)"
              class="flex items-center justify-between py-2 px-1 w-full rounded-lg cursor-pointer relative"
              :class="{ 'bg-gray-600 text-gray-100 hover:bg-gray-500': userSettings.theme === 'dark', 'bg-gray-200 text-gray-800 hover:bg-gray-300': userSettings.theme === 'light' }"
              v-if="filteredProjects.length">
            <div class="flex gap-4">
              <div class="w-6 h-6 rounded-full"
                  :class="{ 'bg-gray-600': userSettings.theme === 'dark', 'bg-white': userSettings.theme === 'light' }">
              </div>
              {{ project.name }}
            </div>
            <p v-show="project.unreadMessagesCount > 0"
                class="bg-red-500 text-white rounded-full text-center text-xs shadow-2xl p-1">
                {{ project.unreadMessagesCount }}
            </p>
          </div>
        </div>
        <div v-if="!filteredProjects.length"
            :class="{ 'text-gray-100': userSettings.theme === 'dark', 'text-gray-800': userSettings.theme === 'light' }"
            class="py-4 px-1 w-full">
            {{ $t('message.noChatsFound') }}
        </div>
      </div>
      <div class="chat-container w-full flex flex-col justify-between min-h-full max-h-full overflow-auto"
          v-if="showChat">
        <div class="w-full h-14 px-4 flex items-center gap-2 rounded-tl-lg rounded-tr-lg"
            :class="{ 'bg-gray-700 text-gray-100': userSettings.theme === 'dark', 'bg-gray-200 text-gray-900': userSettings.theme === 'light' }">
          <div v-if="isMobile" class="cursor-pointer" @click="toggleChatsView">{{ $t('message.back') }}</div>
          <div class="bg-gray-300 h-6 w-6 rounded-full"></div>
          <div class="flex flex-col">
            <p v-if="projectSelected">{{ projectSelected.name }}</p>
            <div v-if="memberDetails.length" class="flex text-sm">
              <h2>{{ $t('message.members') }}</h2>
              <p>{{ memberUsernames }}</p>
            </div>
          </div>
        </div>
        <div class="custom-scrollbar scrollable-down w-full flex-grow overflow-y-auto" :style="scrollbarStyle"
            ref="messageContainer">
          <ChatContainer v-if="projectSelected" :project="projectSelected" :messages="messages"
              @delete-message="deleteMessage" :loggedInUser="user" />
        </div>
        <div class="flex relative h-14">
          <input type="text" v-model="message.content" class="w-full p-2 rounded-bl-lg rounded-br-lg"
              :class="{ 'bg-gray-800 text-gray-100': userSettings.theme === 'dark', 'bg-gray-200 text-gray-900': userSettings.theme === 'light' }"
              :placeholder="$t('message.typeMessagePlaceholder')" @keyup.enter="createMessage">
          <span v-if="message.content"
              :class="{ 'text-gray-100': userSettings.theme === 'dark', 'text-gray-900': userSettings.theme === 'light' }"
              class="absolute right-4 top-4 cursor-pointer" @click="createMessage"><font-awesome-icon
                  icon="paper-plane" /></span>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from 'axios';
import { BASE_URL } from '@/config';
import EventBus from '@/eventBus';
import ChatContainer from '@/components/ChatContainer.vue';
import { mapState } from 'vuex';

export default {
    name: "TeamChatView",
    components: {
        ChatContainer
    },
    computed: {
        ...mapState(['userSettings']),
        memberUsernames() {
            return this.memberDetails.map(member => member.username).join(', ');
        },
        filteredProjects() {
            if (!this.searchTerm) {
                return this.projects;
            }
            return this.projects.filter(project => project.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
        },
        scrollbarStyle() {
            if (this.userSettings.theme === 'dark') {
                return {
                    '--scrollbar-thumb': 'rgb(107 114 128)',
                    '--scrollbar-track': 'rgb(51, 65, 85)',
                };
            } else {
                return {
                    '--scrollbar-thumb': 'rgb(209 213 219)',
                    '--scrollbar-track': 'rgb(229, 231, 235)',
                };
            }
        }
    },
    mounted() {
        // Get user settings from local storage
        const userSettings = JSON.parse(localStorage.getItem('userSettings'));
        if (userSettings) {
            this.$store.commit('setUserSettings', userSettings);
            console.log(userSettings)
        }

    },
    data() {
        return {
            projects: [],
            user: null,
            projectSelected: null,
            searchTerm: '',
            allMembers: [],
            memberDetails: [],
            message: {},
            messages: [],
            showProjects: true,
            showChat: true,
            isMobile: false,
            unreadMessages: 0,
        };
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        EventBus.on('newMessage', this.handleNewMessage);
        EventBus.on('unreadMessagesCountChanged', this.updateUnreadMessagesCount);



    },
    created() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.fetchProjects();
    },
    methods: {
        handleResize() {
            this.isMobile = window.innerWidth <= 768;
            if (this.isMobile) {
                this.showChat = false;
            } else {
                this.showChat = true;
            }
        },
        toggleProjectsView() { },
        toggleChatsView() {
            this.showProjects = true;
            this.showChat = false;
            this.projectSelected = null;
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        },
        async markMessagesAsRead(projectId, unreadMessages) {
            try {
                for (let message of unreadMessages) {
                    await axios.get(`${BASE_URL}/api/mark_message_as_read/${this.user.id}/${message.id}/`);
                }
                const project = this.projects.find(project => project.id === projectId);
                if (project) {
                    project.unreadMessagesCount = 0;
                    this.updateTotalUnreadMessages();
                }
            } catch (error) {
                console.error('Failed to mark messages as read:', error);
            }
        },
        async selectProject(project) {
            if (this.projectSelected) {
                // Marque as mensagens como lidas do projeto atualmente selecionado
                const unreadMessages = await this.fetchUnreadMessages(this.projectSelected.id);
                await this.markMessagesAsRead(this.projectSelected.id, unreadMessages);
            }

            this.projectSelected = project;
            this.memberDetails = [];
            if (this.projectSelected && this.projectSelected.members) {
                for (const memberId of this.projectSelected.members) {
                    const response = await axios.get(`${BASE_URL}/api/users/${memberId}`);
                    this.memberDetails.push(response.data);
                }
            }
            if (this.isMobile) {
                this.showChat = true;
                this.showProjects = false;
            }
            if (this.projectSelected) {
                await this.fetchMessages(this.projectSelected.id);
            }
        },
        async fetchMessages(projectId) {
            try {
                const response = await axios.get(`${BASE_URL}/api/chat_messages/?project_id=${projectId}`);
                this.messages = response.data;
                this.scrollToBottom();

                const unreadMessages = await this.fetchUnreadMessages(projectId);
                await this.markMessagesAsRead(projectId, unreadMessages);

            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        },
        async fetchUnreadMessages(projectId) {
            try {
                const response = await axios.get(`${BASE_URL}/api/chat_messages/?project_id=${projectId}&user_id=${this.user.id}&read=False`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch unread messages:', error);
                return [];
            }
        },
        async createMessage() {
            this.message.sender = this.user.id;
            this.message.project = this.projectSelected.id;
            let res = await axios.post(`${BASE_URL}/api/chat_messages/`, this.message);
            res.data.project = this.projectSelected.id; // Adiciona o ID do projeto à mensagem
            EventBus.emit('newMessage', res.data); // Emite o evento com a mensagem atualizada
            this.message = {};
            this.scrollToBottom();
        },
        async deleteMessage(messageToDelete) {
            try {
                await axios.delete(`${BASE_URL}/api/chat_messages/${messageToDelete.id}/`);
                this.messages = this.messages.filter(message => message.id !== messageToDelete.id);
            } catch (error) {
                console.error('Failed to delete message:', error);
            }
        },
        handleNewMessage(message) {
            if (this.projectSelected && message.project === this.projectSelected.id) {
                console.log('Handling new message selected :', message);
                // Verifique se a mensagem já está na lista
                const messageExists = this.messages.some(msg => msg.id === message.id);
                if (!messageExists) {
                    this.messages.push(message);
                    this.scrollToBottom();
                }
            } else {
                console.log('Handling new message notselected :', message);
                const project = this.projects.find(project => project.id === message.project);
                if (project) {
                    project.unreadMessagesCount = (project.unreadMessagesCount || 0) + 1;
                    this.updateTotalUnreadMessages();
                }
            }
        },
        updateUnreadMessagesCount(count) {
            this.unreadMessagesCount = count;
        },
        updateTotalUnreadMessages() {
            const totalUnreadMessages = this.projects.reduce((total, project) => total + (project.unreadMessagesCount || 0), 0);
            EventBus.emit('unreadMessagesCountChanged', totalUnreadMessages);
        },
        async fetchProjects() {
            try {
                const response = await axios.get(`${BASE_URL}/api/projects/member/${this.user.id}/`);
                this.projects = response.data.map(project => ({
                    ...project,
                    unreadMessagesCount: 0, // Initialize unreadMessagesCount for each project
                }));

                if (this.projects.length > 0 && !this.isMobile) {
                    this.selectProject(this.projects[0]);
                }

                const unreadMessagesPromises = this.projects.map(project => this.fetchUnreadMessages(project.id));
                const unreadMessagesResponses = await Promise.all(unreadMessagesPromises);

                this.projects.forEach((project, index) => {
                    project.unreadMessagesCount = unreadMessagesResponses[index].length;
                });

                this.updateTotalUnreadMessages();

            } catch (error) {
                console.error(error);
            }
        },
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
        EventBus.off('newMessage', this.handleNewMessage);
        EventBus.off('unreadMessagesCountChanged', this.updateUnreadMessagesCount);
    },
};
</script>
<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}
</style>
