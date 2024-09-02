<template>
  <div id="app" class="h-screen flex flex-col">
    <Navbar v-if="showNavbar" :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" class="fixed w-full z-50" />
    <div class="flex-grow overflow-auto "
    :class="contentClass"
    :style="{ 'height': `calc(100vh - 4rem)`, 'padding-top': paddingTop }">
      <router-view />
    </div>
  </div>
</template>
<script>
import Navbar from "./components/Navbar.vue";
import { useRouter } from 'vue-router';
import {mapState} from 'vuex';

export default {
  name: "App",
  components: {
    Navbar
  },
  computed: {
    ...mapState(['userSettings']),
    showNavbar() {
      // Don't show the navbar on the home, sign in, and register pages
      const currentPath = this.router.currentRoute.value.path;
      return !['/', '/signin', '/register' ,'/password-recovery'].includes(currentPath) && !currentPath.startsWith('/reset-password');
    },
    contentClass() {
      if (['/signin', '/register','password-recovery','/reset-password' ].includes(this.router.currentRoute.value.path)) {
        return 'bg-gray-100 text-gray-900'; // Default theme for sign in and register pages
      }
      return this.userSettings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900';
    },
    paddingTop() {
      if (['/signin', '/register', '/password-recovery','/reset-password','/'].includes(this.router.currentRoute.value.path)) {
        return '0'; // No padding-top for sign in and register pages
      }
      return '4rem'; // Adjust this value as needed
    }
  },
  watch: {
    'userSettings.language':{

      handler(newLanguage) {
        this.$i18n.locale = newLanguage;
      },
      immediate: true
    }
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      isSidebarOpen: false
    };
  },
  
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    }
  }
};
</script>