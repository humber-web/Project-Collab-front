<template>
  <div>
    <h2 class="" :class="{'text-gray-100': userSettings.theme === 'dark', 'text-gray-800': userSettings.theme === 'light'}">{{ $t('message.pendingTasks') }}</h2>
    <div class="flex overflow-x-auto gap-1 hide-scrollbar p-1">
      <div v-for="task in tasks" :key="task.id" class="flex-none w-64">
        <Task :task="task" :theme="userSettings.theme" :language="userSettings.language" @add-comment="addComment" @edit-task="editTask" @delete-task="deleteTask" :isDashboard="isDashboard"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Task from './Task.vue';
import { BASE_URL } from '@/config';
import { mapState } from 'vuex';

export default {
  name: 'TaskSummary',
  components: {
    Task
  },
  data() {
    return {
      tasks: [],
      user_id: null
    };
  },
  props: {
    isDashboard: {
      type: Boolean,
      required: false,
    }
  },
  computed: {
    ...mapState(['userSettings']),
  },
  created() {
    this.fetchTasks(this.user());
  },
  methods: {
    async fetchTasks(user_id) {
      try {
        const response = await axios.get(`${BASE_URL}/api/tasks/pending_tasks/?user_id=${user_id}`);
        this.tasks = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    user() {
      let user = JSON.parse(localStorage.getItem('user'));
      return user.id 
    }
  }
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>