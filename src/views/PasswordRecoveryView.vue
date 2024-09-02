<template>
  <div class="flex items-center justify-center h-full">
    <div class="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-3xl font-semibold mb-10 text-gray-900">Reset Password</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <input class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          type="email" placeholder="Email" v-model="email" />
        <button class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          type="submit">Send Reset Link</button>
      </form>
      <Toast ref="toast" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {BASE_URL} from '@/config'
export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    async submitForm() {
      if (!this.email) {
        this.$refs.toast.showToast('Please enter your email', 'error');
        return;
      }
      const res = await axios.post(`${BASE_URL}/api/password-reset/`, {
        email: this.email,
      });
      this.$refs.toast.showToast(res.data.message, 'success');

      // Here you can call your API to send the password reset link
      // You can access the email using this.email
      // Make sure to handle errors and show a success message when the email is sent
    },
  },
};
</script>