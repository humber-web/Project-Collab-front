<template>
    <div class="h-full flex flex-col gap-1" 
    :class="{ 'bg-gray-100': userSettings?.theme === 'light', 'bg-gray-700': userSettings?.theme === 'dark' }">
        <div class="p-1 w-full flex justify-center">
            <button
                class="w-2/3 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                @click="createNewTask">
                {{$t('message.createNewTask')}}
            </button>
        </div>
        <TaskForm v-if="showForm" @submit-task="submitTask" :projectId="this.projectId" :task="selectedTask" @close-form="closeForm"/>
        <div class="p-2" v-if="categorizedTasks.NS.length > 0">
            <div>
                <h2 :class="{ 'text-gray-900': userSettings?.theme === 'light', 'text-gray-100': userSettings?.theme === 'dark' }">{{ $t('message.notStarted') }}</h2>
            </div>
            <div class="flex overflow-x-auto gap-1 hide-scrollbar p-1">
                <div v-for="task in categorizedTasks.NS" :key="task.id" class="flex-none w-64">
                    <Task :task="task" @add-comment="addComment" @edit-task="editTask" @delete-task="deleteTask" />
                </div>
            </div>
        </div>
        <div class="p-2" v-if="categorizedTasks.IP.length > 0">
            <div>
                <h2 :class="{ 'text-gray-900': userSettings?.theme === 'light', 'text-gray-100': userSettings?.theme === 'dark' }">{{ $t('message.inProgress') }}</h2>
            </div>
            <div class="flex overflow-x-auto gap-1 hide-scrollbar p-1">
                <div v-for="task in categorizedTasks.IP" :key="task.id" class="flex-none w-64">
                    <Task :task="task" @add-comment="addComment" @edit-task="editTask" @delete-task="deleteTask" />
                </div>
            </div>
        </div>
        <div class="p-2" v-if="categorizedTasks.C.length > 0">
            <div>
                <h2 :class="{ 'text-gray-900': userSettings?.theme === 'light', 'text-gray-100': userSettings?.theme === 'dark' }">{{ $t('message.completed') }}</h2>
            </div>
            <div class="flex overflow-x-auto gap-1 hide-scrollbar p-1">
                <div v-for="task in categorizedTasks.C" :key="task.id" class="flex-none w-64">
                    <Task :task="task" @add-comment="addComment" @edit-task="editTask" @delete-task="deleteTask" />
                </div>
            </div>
        </div>
        <Toast ref="toast" />
    </div>
</template>

<script>
import axios from 'axios';
import Task from '../components/Task.vue';
import TaskForm from '../components/TaskForm.vue';
import { BASE_URL } from '@/config';
import { mapState } from 'vuex';
import Toast from '../components/Toast.vue';

export default {
    components: {
        Task,
        TaskForm,
        Toast,
    },
    props: {
        projectId: {
            type: String,
            required: true,
        },
        
    },
    computed: {
    ...mapState(['userSettings']),
  },
  mounted() {
    // Get user settings from local storage
    const userSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (userSettings) {
      this.$store.commit('setUserSettings', userSettings);
    }
  },
    data() {
        return {
            tasks: [],
            categorizedTasks: {},
            showForm: false,
            selectedTask: null
        };
    },
    methods: {
        async fetchTasks() {
            try {
                const response = await fetch(`${BASE_URL}/api/tasks/?project_id=${this.projectId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.tasks = await response.json();
            } catch (error) {
                console.error('There was a problem fetching the tasks:', error);
            }
        },
        submitTask(task) {
            const existingTaskIndex = this.tasks.findIndex(t => t.id === task.id);
            if (existingTaskIndex !== -1) {
                // Update existing task
                this.tasks[existingTaskIndex] = task;
                this.$refs.toast.showToast('Task updated successfully!', 'success');
            } else {
                // Add new task
                this.tasks.push(task);
                this.$refs.toast.showToast('Task created successfully!', 'success');
            }
            this.showForm = false;
        },
        async deleteTask(taskId) {
            const taskIndex = this.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                try {

                    await axios.delete(`${BASE_URL}/api/tasks/${taskId}/`);
                    this.$refs.toast.showToast('Task deleted successfully!', 'success');
                    this.tasks.splice(taskIndex, 1);
                } catch (error) {
                    this.$refs.toast.showToast('Failed to delete task!', 'error');
                    console.error('Failed to delete task:', error);
                }
            }
        },
        createNewTask() {
            this.selectedTask = null
            this.showForm = !this.showForm
        },
        editTask(task) {
            this.selectedTask = task
            this.showForm = true
        },
        closeForm(){
            this.showForm = false
        }

        // Other methods...
    },
    watch: {
        projectId: {
            handler: 'fetchTasks',
            immediate: true,
        },
    },
    computed: {
        categorizedTasks() {
            return {
                NS: this.tasks.filter(task => task.status === 'NS'),
                IP: this.tasks.filter(task => task.status === 'IP'),
                C: this.tasks.filter(task => task.status === 'C'),
            };
        },
        projectId() {
            return this.$route.params.projectId;
        }
    },
    created() {
        this.fetchTasks();
    },
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