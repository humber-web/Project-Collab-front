<template>
  <div class="w-full max-w-xs mx-auto mt-20 relative"
    :class="{ 'bg-white': userSettings.theme === 'light', 'bg-gray-600': userSettings.theme === 'dark' }">
    <font-awesome-icon icon="times" class="absolute top-0 right-0 m-4 cursor-pointer"
      :class="{ 'hover:text-gray-900': userSettings.theme === 'light', 'hover:text-gray-100': userSettings.theme === 'dark' }"
      @click="closeForm" />
    <form class="shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="submitUser">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="username"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          Username
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="username" type="text" placeholder="Username" v-model="formUser.username"
          :class="{ 'bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }">
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="email"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          Email
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="email" type="email" placeholder="Email" v-model="formUser.email"
          :class="{ 'bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }">
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="password"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          Password
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password" type="password" placeholder="Password" v-model="formUser.password"
          :class="{ 'bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }">
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="userPhoto"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          User Photo
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="userPhoto" type="file" @change="onFileChange"
          :class="{ 'bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }">
      </div>
      <div class="flex items-center justify-between">
        <button
          class=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          Update User
        </button>
      </div>
    </form>
    <Toast ref="toast" />
  </div>
</template>

<!-- <script>
import formValidationMixin from '@/formValidationMixin';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { mapState, mapMutations } from 'vuex';
// import router from '@router';

export default {
  mixins: [formValidationMixin],
  data() {
    return {
      formUser: {
        username: '',
        email: '',
        userPhoto: null
      }
    };
  },
  computed: {
    ...mapState(['userSettings']),
  },
  methods: {
    onFileChange(event) {
      // If a file is selected, capture it. Otherwise, set userPhoto to null.
      this.formUser.userPhoto = event.target.files.length > 0 ? event.target.files[0] : null;
    },
    submitUser() {
      if (!this.validateForm(this.formUser)) {
        return;
      }
      const formData = new FormData();
      formData.append('username', this.formUser.username);
      formData.append('email', this.formUser.email);
      formData.append('password', this.formUser.password);

      if (this.formUser.userPhoto !== null) {
        formData.append('userPhoto', this.formUser.userPhoto);
      }

      axios.put(`${BASE_URL}/api/users/${this.formUser.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          this.$refs.toast.showToast('User updated successfully!', 'success');
          if (response.data.userPhoto.startsWith(BASE_URL)) {
            response.data.userPhoto = response.data.userPhoto.substring(BASE_URL.length);
          }
          this.$emit('submit-user', response.data);
          const userData = JSON.stringify(response.data);
          localStorage.setItem('user', userData);
          this.$router.push("/dashboard");

          EventBus.emit('user-photo-changed', userData.userPhoto);

        })
        .catch(error => {
          this.$refs.toast.showToast('User update failed!', 'error');
          console.error(error);
        });
    },
    closeForm() {
      this.$emit('close-user-form');
    }
  },
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.formUser = { ...newValue };
        } else {
          this.formUser = {
            username: '',
            email: '',
            userPhoto: null
          };
        }
      }
    }
  }
};
</script> -->
<script>
import formValidationMixin from '@/formValidationMixin';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { mapState, mapActions } from 'vuex'; // Import mapActions

export default {
  mixins: [formValidationMixin],
  data() {
    return {
      formUser: {
        username: '',
        email: '',
        userPhoto: null,
      },
    };
  },
  computed: {
    ...mapState(['userSettings']),
  },
  methods: {
    ...mapActions(['updateUserPhoto']), // Map the action

    onFileChange(event) {
      this.formUser.userPhoto = event.target.files.length > 0 ? event.target.files[0] : null;
    },
    submitUser() {
      if (!this.validateForm(this.formUser)) {
        return;
      }
      const formData = new FormData();
      formData.append('username', this.formUser.username);
      formData.append('email', this.formUser.email);
      formData.append('password', this.formUser.password);

      if (this.formUser.userPhoto !== null) {
        formData.append('userPhoto', this.formUser.userPhoto);
      }

      axios.put(`${BASE_URL}/api/users/${this.formUser.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          this.$refs.toast.showToast('User updated successfully!', 'success');
          if (response.data.userPhoto.startsWith(BASE_URL)) {
            response.data.userPhoto = response.data.userPhoto.substring(BASE_URL.length);
          }
          this.$emit('submit-user', response.data);
          const userData = JSON.stringify(response.data);
          localStorage.setItem('user', userData);
          this.$router.push('/dashboard');

          this.updateUserPhoto(response.data.userPhoto); // Dispatch the action

          // EventBus.emit('user-photo-changed', response.data.userPhoto);
        })
        .catch(error => {
          this.$refs.toast.showToast('User update failed!', 'error');
          console.error(error);
        });
    },
    closeForm() {
      this.$emit('close-user-form');
    },
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.formUser = { ...newValue };
        } else {
          this.formUser = {
            username: '',
            email: '',
            userPhoto: null,
          };
        }
      },
    },
  },
};
</script>

