<template>
  <div class="p-4 flex flex-col gap-4 h-full"
    :class="{ 'bg-gray-100': userSettings.theme === 'light', 'bg-gray-700': userSettings.theme === 'dark' }">
    <div class="p-1 w-full flex justify-center">

      <button @click="openProjectForm"
        class="w-2/3 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">{{
          $t('message.createProject') }}</button>
    </div>

    <ProjectForm v-if="isProjectFormOpen" @close="closeProjectForm" @addProject="createOrUpdateProject"
      :project="selectedProject" :isProjectFormOpen="isProjectFormOpen" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" :STATUS_CHOICES="STATUS_CHOICES"
        :user_id="user_id" @go-to-tasks="goToTasks" @edit-project="editProject" @delete-project="deleteProject" />
    </div>
    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from 'axios';
import ProjectCard from '../components/ProjectCard.vue'
import ProjectForm from '../components/ProjectForm.vue'
import { BASE_URL } from '@/config';
import { mapState } from 'vuex';
import {useI18n} from 'vue-i18n';

const STATUS_CHOICES = [
  { value: 'NS', label: 'Not Started' },
  { value: 'IP', label: 'In Progress' },
  { value: 'C', label: 'Completed' },
];

export default {
  name: "ProjectsView",
  components: {
    ProjectCard,
    ProjectForm,
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
      isProjectFormOpen: false,
      projects: [],
      selectedProject: null,
      user_id: null,
      STATUS_CHOICES: [
        { value: 'NS', label: 'Not Started' },
        { value: 'IP', label: 'In Progress' },
        { value: 'C', label: 'Completed' }
      ],
    };
  },
  created() {
    
    this.user_id = this.user().id;
    axios.get(`${BASE_URL}/api/projects/user/${this.user_id}/`)
      .then(response => {
        this.projects = response.data;
      })
      .catch(error => console.error('Error:', error));
  },
  methods: {
    openProjectForm() {
      this.isProjectFormOpen = true;
    },
    closeProjectForm() {
      this.isProjectFormOpen = false;
      this.selectedProject = null;
    },
    addProject(newProject) {
      this.projects.push(newProject);
    },
    editProject(project) {
      this.selectedProject = project;
      this.openProjectForm();
    },
    goToTasks(projectId) {
      this.$router.push(`/projects/${projectId}/tasks`);
    },
    createOrUpdateProject(projectData) {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      };

      if (this.selectedProject) {
        // Atualizar projeto existente
        axios.put(`${BASE_URL}/api/projects/${this.selectedProject.id}/`, projectData, config)
          .then(response => {
            this.$refs.toast.showToast('Project updated successfully!', 'success');
            const updatedProject = response.data;
            const index = this.projects.findIndex(project => project.id === this.selectedProject.id);
            this.projects.splice(index, 1, updatedProject);

            this.selectedProject = null;
            this.closeProjectForm();
          })
          .catch(error => {
            this.$refs.toast.showToast('Failed to update project!', 'error');
            console.error('Error:', error);
          });
      } else {
        // Criar novo projeto
        axios.post(`${BASE_URL}/api/projects/`, projectData, config)
          .then(response => {
            this.$refs.toast.showToast('Project created successfully!', 'success');
            const newProject = response.data;
            this.projects.push(newProject);
            this.closeProjectForm();
          })

          .catch(error => {
            console.error('Error:', error);
            this.$refs.toast.showToast('Failed to create project!.', 'error');
          });

      }
    },
    deleteProject(project) {
      console.log("Called:", project)
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Token ${token}`
        }
      };

      axios.delete(`${BASE_URL}/api/projects/${project.id}/`, config)
        .then(() => {
          this.$refs.toast.showToast('Project deleted successfully!', 'success');
          const index = this.projects.findIndex(p => p.id === project.id);
          if (index !== -1) {
            this.projects.splice(index, 1);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          this.$refs.toast.showToast('Failed to delete project!', 'error');
        });
    },
    user() {
      return JSON.parse(localStorage.getItem('user'));
    }
  }
};
</script>
