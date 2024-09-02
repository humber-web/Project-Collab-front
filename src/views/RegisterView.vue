<template>
  <div class="flex items-center justify-center h-screen bg-gray-50">
    <div class="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Register</h2>
      <input v-model="username" autocomplete="off"
        class="mb-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        type="text" placeholder="Username" />
      <input v-model="email" autocomplete="off"
        class="mb-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        type="email" placeholder="Email" />
      <input v-model="password" autocomplete="new-password"
        class="mb-6 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        type="password" placeholder="Password" />
      <button class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        @click="registerUser">Register</button>
    </div>
    <Toast ref="toast" />
  </div>
</template>




<script>
import formValidationMixin from '@/formValidationMixin';
import axios from 'axios';
import { BASE_URL } from '@/config';
export default {
  mixins: [formValidationMixin],
  name: "RegisterView",
  data() {
    return {
      username: '',
      email: '',
      password: '',
      users: {},
    };
  },
  created() {

  },
  methods: {
    registerUser() {
      const formData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };
      if (!this.validateForm(formData)) {
        return;
      }
      axios.post(`${BASE_URL}/api/register/`, {
        username: this.username,
        email: this.email,
        password: this.password,
      }, {
        headers: {
          'Authorization': ''  // Override the default Authorization header
        }
      })
        .then(response => {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('unread_messages_count', response.data.unread_messages_count)

          // Save the user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.$router.push("/dashboard");
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>

<style scope>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

html {
  font-family: 'Roboto', sans-serif;
}

input:focus,
button:focus {
  outline: none;
  ring: 2px solid blue;
}

button:hover {
  background-color: #3b82f6;
  /* Lighter blue on hover */
}
</style>