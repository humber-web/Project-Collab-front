<template>
  <div class="w-full max-w-xs mx-auto mt-20 relative">
    <font-awesome-icon icon="times" class="absolute top-0 right-0 m-4 cursor-pointer" @click="closeForm"
      :class="{ 'hover:text-gray-700': userSettings.theme === 'dark', 'hover:text-gray-900': userSettings.theme === 'light' }" />
    <form class="shadow-md rounded px-8 pt-6 pb-8 mb-4"
      :class="{ 'bg-gray-600': userSettings.theme === 'dark', 'bg-white': userSettings.theme === 'light' }">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="name"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.name') }}
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="name" type="text" :placeholder="$t('message.name')" v-model="formTask.name"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }">
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="description"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.description') }}
        </label>
        <textarea
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="description" :placeholder="$t('message.description')" v-model="formTask.description"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }"></textarea>
      </div>
      <div class="mb-6" v-if="formTask.id">
        <label class="block text-sm font-bold mb-2" for="status"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.status') }}
        </label>
        <select id="status" v-model="formTask.status"
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }">
          <option value="NS">{{ $t('message.notStarted') }}</option>
          <option value="IP">{{ $t('message.inProgress') }}</option>
          <option value="C">{{ $t('message.completed') }}</option>
        </select>
      </div>
      <div class="mb-6">
        <label for="assigneeEmail" class="block text-sm font-bold mb-2"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">{{
            $t('message.assignee') }}</label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="completion_data" type="email" v-model="formTask.assigneeEmail"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }">
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="completion_data"
          :class="{ 'text-gray-900 ': userSettings.theme === 'light', ' text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.completionDate') }}
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="completion_data" type="date" v-model="formTask.completion_data"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }">
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button" @click="submitTask">
          {{ formTask.id ? $t('message.updateTask') : $t('message.createTask') }}
        </button>
      </div>
    </form>
    <Toast ref="toast" />
  </div>
</template>

<script>
import formValidationMixin from '@/formValidationMixin';
import axios from 'axios'
import { BASE_URL } from '@/config';
import { mapState } from 'vuex';
import Toast from '@/components/Toast.vue'; // Import the Toast component

export default {
  mixins: [formValidationMixin],
  name: 'TaskForm',
  components: { Toast },
  data() {
    return {
      formTask: {
        name: '',
        description: '',
        assigneeEmail: '',
        completion_data: '',
        status: '',
        project: this.projectId
      },
      users: []
    }
  },
  props: {
    showForm: {
      type: Boolean,
      required: true
    },
    projectId: {
      type: String,
      required: true
    },
    task: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState(['userSettings']),
  },
  methods: {
    async submitTask() {


      try {
        let response;
        if (!this.validateForm(this.formTask)) {
          return;
        }
        if (this.formTask.id) {
          // Update existing task
          response = await axios.put(`${BASE_URL}/api/tasks/${this.formTask.id}/`, this.formTask);
          this.$refs.toast.showToast('Task updated successfully!', 'success');
          this.$emit('submit-task', response.data);
        } else {
          // Create new task
          response = await axios.post(`${BASE_URL}/api/tasks/`, this.formTask);
          this.$refs.toast.showToast('Task created successfully!', 'success');
          this.$emit('submit-task', response.data);
        }
      } catch (error) {
        console.log(error);
        this.$refs.toast.showToast('Task operation failed!', 'error');
      }
    }
  },
  fetchUsers() {
    axios.get(`${BASE_URL}/api/users/`)
      .then(response => {
        this.users = response.data
        console.log(this.users)
      })
      .catch(error => {
        console.error(error)
      })
  },
  closeForm() {
    this.$emit('close-form')
  },



  async created() {
    if (this.formTask.assignee) {
      const response = await axios.get(`${BASE_URL}/api/users/${this.formTask.assignee}/`);
      this.formTask.assigneeEmail = response.data.email;
      console.log(response.data);
    }
  },
  watch: {
    task: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.formTask = { ...newValue };
          console.log('Task::', this.formTask);
        } else {
          this.formTask = {
            name: '',
            description: '',
            completion_data: '',
            project: this.projectId
          };
        }
      }
    }
  }
};
</script>
