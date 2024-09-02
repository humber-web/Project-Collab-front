<template>
  <div class="rounded-lg shadow-lg p-4 cursor-pointer" 
       :class="{
         'bg-gray-100 hover:bg-gray-200': userSettings && userSettings.theme === 'light', 
         'bg-gray-600 hover:bg-gray-500': userSettings && userSettings.theme === 'dark'
       }" 
       @click="goToTasks(project.id)">
    <h3 class="text-xl font-semibold" :class="{'text-gray-800': userSettings && userSettings.theme === 'light', 'text-gray-100': userSettings && userSettings.theme === 'dark'}">{{ project?.name }}</h3>
    <p :class="{'text-gray-800': userSettings && userSettings.theme === 'light', 'text-gray-100': userSettings && userSettings.theme === 'dark'}">{{ project?.description }}</p>
    <div class="mt-4">
      <span :class="getStatusColor(project?.status) + ' text-sm font-medium py-1 px-2 rounded'">{{ STATUS_CHOICES?.find(choice => choice.value === project.status)?.label }}</span>
    </div>
    <div class="flex justify-end space-x-2 mt-4" v-if="project?.creator === user_id && !isDashboard ">
      <button @click.stop="editProject(project)" class="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded">{{ $t('message.edit') }}</button>
      <button @click.stop="showConfirmPopup" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">{{ $t('message.delete') }}</button>
      <ConfirmPopUp ref="confirmPopup" @accept="deleteProject(project)" :message="$t('message.delete_project_confirmation')"></ConfirmPopUp>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConfirmPopUp from './ConfirmPopUp.vue';
export default {
  name: 'ProjectCard',
  components : {
    ConfirmPopUp
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    STATUS_CHOICES: {
      type: Array,
      required: true
    },
    user_id: {
      type: Number,
      required: true
    },
    isDashboard: {
      type:Boolean,
      default:false
    }
    
  },
  computed: {
    ...mapState(['userSettings'])
  },
  methods: {
    goToTasks(id) {
      this.$emit('go-to-tasks', id);
    },
    showConfirmPopup(event) {
      this.$refs.confirmPopup.show(event.target);
    },
    editProject(project) {
      this.$emit('edit-project', project);
    },
    deleteProject(project) {
      this.$emit('delete-project', project);
    },
    getStatusColor(status) {
      switch (status) {
        case 'NS':
          return 'bg-red-100 text-red-800'; // Not Started
        case 'IP':
          return 'bg-yellow-100 text-yellow-800'; // In Progress
        case 'C':
          return 'bg-green-100 text-green-800'; // Completed
        default:
          return '';
      }
    }
  },
  
}
</script>