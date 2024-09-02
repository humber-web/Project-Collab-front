<template>
  <div class="flex flex-col " :class="{ 'bg-gray-100': userSettings.theme === 'light', 'bg-gray-700': userSettings.theme === 'dark' }">
    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 p-4 overflow-auto">
        <ProjectSummary :isDashboard="isDashboard"/>
        <TaskSummary :isDashboard="isDashboard"/>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectSummary from "../components/ProjectSummary.vue";
import TaskSummary from '../components/TaskSummary.vue';
import { mapState } from 'vuex';

export default {
  name: "DashboardView",
  components: {
    ProjectSummary,
    TaskSummary,
  },
  data() {
    return {
      isDashboard: true
    }
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

    console.log('DashboardView mounted, current theme:', this.userSettings.theme); // Debug log
  },
}
</script>