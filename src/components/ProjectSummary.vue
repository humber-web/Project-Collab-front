<template>
  <div>
    <h2 class=""
      :class="{ 'text-gray-100': userSettings.theme === 'dark', 'text-gray-800': userSettings.theme === 'light' }">{{ $t('message.workingOn') }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      :class="{ 'bg-gray-100': userSettings.theme === 'light', 'bg-gray-700': userSettings.theme === 'dark' }">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" :STATUS_CHOICES="STATUS_CHOICES"
        :user_id="user_id" @go-to-tasks="goToTasks" @edit-project="editProject" @delete-project="deleteProject"
        :isDashboard="isDashboard" />
    </div>
  </div>
</template>

<script>
import ProjectCard from './ProjectCard.vue'
import axios from 'axios'
import { BASE_URL } from '@/config';
import { mapState } from 'vuex';

export default {
  name: "ProjectSummary",
  components: {
    ProjectCard
  },
  props: {
    isDashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projects: [],
      selectedProject: null,
      user_id: null,
      STATUS_CHOICES: [
        { value: 'NS', label: 'Not Started' },
        { value: 'IP', label: 'In Progress' },
        { value: 'C', label: 'Completed' }
      ],
    }
  },
  computed: {
    ...mapState(['userSettings']),
  },
  methods: {
    async fecthMemberProjects(user_id) {
      try {
        const response = await axios.get(`${BASE_URL}/api/projects/member/${user_id}/`)
        this.projects = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    user() {
      return JSON.parse(localStorage.getItem('user'));
    },
  },
  deleteProject(project) {
    console.log("Called:",project)
    this.$emit('delete-project', project);
  },
  created() {
    this.user_id = this.user().id;
    this.fecthMemberProjects(this.user_id);
  },
}
</script>