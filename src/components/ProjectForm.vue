<template>
  <div class="w-full max-w-xs mx-auto mt-20 relative rounded">
    <font-awesome-icon icon="times" class="absolute top-0 right-0 m-4 cursor-pointer"
      :class="{ 'hover:text-gray-900': userSettings.theme === 'light', 'hover:text-gray-100': userSettings.theme === 'dark' }"
      @click="closeForm" />
    <form class="shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="addOrUpdateProject"
      :class="{ 'bg-white': userSettings.theme === 'light', 'bg-gray-600': userSettings.theme === 'dark' }">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="name"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.name') }}
        </label>
        <input v-model="Project.name" type="text"
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          :placeholder="$t('message.name')" 
          :class="{ 'bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="description"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.description') }}
        </label>
        <textarea v-model="Project.description" type="text" name="floating_project_description"
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          :placeholder="$t('message.description')" 
          :class="{ 'bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }" />
      </div>
      <div v-if="project" class="relative z-0 w-full mb-5 group">
        <label for="underline_select" class="block text-sm font-bold mb-2"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.status') }}
        </label>
        <select id="underline_select" v-model="Project.status"
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }">
          <option v-for="choice in STATUS_CHOICES" :value="choice.value" :key="choice.value">
            {{ choice.label }}
          </option>
        </select>
      </div>
      <button type="submit"
        class="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700 text-white">
        {{ $t('message.submit') }}
      </button>
    </form>
    <Toast ref="toast" />
  </div>
</template>

<script>
import formValidationMixin from '@/formValidationMixin';
import { mapState } from 'vuex';

const STATUS_CHOICES = [
  { value: 'NS', label: 'Not Started' },
  { value: 'IP', label: 'In Progress' },
  { value: 'C', label: 'Completed' },
];

export default {
  mixins: [formValidationMixin],
  name: "ProjectForm",
  props: {
    project: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      STATUS_CHOICES,
    };
  },
  computed: {
    ...mapState(['userSettings']),
    Project() {
      if (this.project) {
        return { ...this.project };
      } else {
        return {
          name: '',
          description: '',
          status: '',
          creator: '',
          members: [],
        };
      }
    }
  },
  methods: {
    addOrUpdateProject() {
      const user = JSON.parse(localStorage.getItem('user'));
      this.Project.creator = user.id;
      this.Project.members.push(user.id);
      this.Project.status = this.project ? this.Project.status : 'NS';
      const FormData = {
        name: this.Project.name,
        description: this.Project.description,
        status: this.Project.status,
        members: this.Project.members,
      }

      if (!this.validateForm(FormData)) {
        return;
      } else {
        this.$emit('addProject', this.Project);
      }
      // Emit the newProject data to the parent component

      // Clear the form
      this.Project = {
        name: '',
        description: '',
        status: '',
        creator: '',
        members: []
      };
    },
    closeForm() {
      this.$emit('close')
    }
  },
};
</script>
