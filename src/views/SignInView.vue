<template>
  <div class="h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-3xl font-semibold mb-10 text-gray-900">Sign In</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <input class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          type="text" placeholder="Username" v-model="username" />
        <input class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          type="password" placeholder="Password" v-model="password" />
        <button class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          type="submit">Sign In</button>
        <div class="text-center">
          <router-link to="/password-recovery" class="text-blue-500 hover:text-blue-700">Forgot your
            password?</router-link>
        </div>
      </form>
      <Toast ref="toast" />
    </div>
  </div>
</template>



<script>
import formValidationMixin from '@/formValidationMixin';
import axios from 'axios';
import { BASE_URL } from '@/config';

export default {
  mixins: [formValidationMixin],
  name: "SignInView",
  data() {
    return {
      username: '',
      password: '',
      users: null,
      projects: null,
      user: null
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    }

  },
  methods: {
    submitForm() {
      const formData = {
        username: this.username,
        password: this.password,
      };
      if (!this.validateForm(formData)) {
        return;
      }

      // Clear existing token from local storage and axios headers
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      axios.post(`${BASE_URL}/api/login/`, {
        username: this.username,
        password: this.password,
      })
        .then(response => {
          // Save the token
          console.log("user:",response.data)
          localStorage.setItem('token', response.data.token);
          this.$refs.toast.showToast('You have successfully logged in!', 'success');
          localStorage.setItem('user-token',response.data.token)

          // Set the Authorization header for axios
          axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;

          localStorage.setItem('unread_messages_count', response.data.unread_messages_count)

          // Save the user data
          localStorage.setItem('user', JSON.stringify(response.data.user));

          if (response.data.user && response.data.user.UserSettings) {
            localStorage.setItem('userSettings', JSON.stringify(response.data.user.UserSettings));
            this.$router.push("/dashboard");
          }

          // Redirect to the dashboard
        })
        .catch(error => {
          this.$refs.toast.showToast('Failed to sign in!', 'error');
        });
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

html {
  font-family: 'Roboto', sans-serif;
}
</style>