<template>
    <div class="flex items-center justify-center h-full">
        <div class="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
            <h2 class="text-3xl font-semibold mb-10 text-gray-900">Reset Password</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
                <input
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    type="password" placeholder="New Password" v-model="password" />
                <input
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    type="password" placeholder="Confirm Password" v-model="passwordConfirmation" />
                <button class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    type="submit">Reset Password</button>
            </form>
            <Toast ref="toast" />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '@/config'

export default {
    data() {
        return {
            password: '',
            passwordConfirmation: '',

        };
    },
    methods: {
        async submitForm() {
            if (!this.password || this.password !== this.passwordConfirmation) {
                this.$refs.toast.showToast('Passwords do not match', 'error');
                return;
            }
            try {
                console.log('uid',this.$route.params.uid)
                console.log('token:',this.$route.params.token)
                const res = await axios.post(`${BASE_URL}/api/reset-password/${this.$route.params.uid}/${this.$route.params.token}/`, {
                    new_password: this.password,
                });
                this.$refs.toast.showToast(res.data.message, 'success');
                this.$router.push('/signin');
            } catch (error) {
                this.$refs.toast.showToast('An error occurred while resetting the password', 'error');
            }
        },
    },
};
</script>