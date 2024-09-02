<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-4xl font-semibold text-gray-800 mb-2">Welcome to ProjectCollab</h1>
      <p class="text-gray-600 mb-4">Collaborate and manage your projects efficiently</p>
      <div class="flex justify-center gap-4">
        <router-link to="/signin" class="px-6 py-3 border border-transparent text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition duration-300 ease-in-out">
          Sign In
        </router-link>
        <router-link to="/register" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
          Register
        </router-link>
      </div>
    </div>
  </div>
</template>


<script>


export default {
  name: "HomeView",
  components: {
 
    
  }
};
</script>