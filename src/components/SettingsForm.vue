<template>
  <div class="w-full max-w-xs mx-auto mt-20 relative"
    :class="{ 'bg-white': formUserSettings.theme === 'light', 'bg-gray-600': formUserSettings.theme === 'dark' }">
    <font-awesome-icon icon="times" class="absolute top-0 right-0 m-4 cursor-pointer"
      :class="{ 'hover:text-gray-900': formUserSettings.theme === 'light', 'hover:text-gray-100': formUserSettings.theme === 'dark' }"
      @click="closeForm" />
    <form class="shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="submitUserSettings">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="theme"
          :class="{ 'text-gray-900': formUserSettings.theme === 'light', 'text-gray-100': formUserSettings.theme === 'dark' }">
          Theme
        </label>
        <select
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="theme" v-model="formUserSettings.theme"
          :class="{ 'bg-gray-500 text-gray-200': formUserSettings.theme === 'dark', 'bg-white text-gray-900': formUserSettings.theme === 'light' }">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="language"
          :class="{ 'text-gray-900': formUserSettings.theme === 'light', 'text-gray-100': formUserSettings.theme === 'dark' }">
          Language
        </label>
        <select
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="language" v-model="formUserSettings.language"
          :class="{ 'bg-gray-500 text-gray-200': formUserSettings.theme === 'dark', 'bg-white text-gray-900': formUserSettings.theme === 'light' }">
          <option value="en">English</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      <div class="flex flex-col  items-center gap-2 w-10/12">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          Update Settings
        </button>
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded focus:outline-none focus:shadow-outline"
          @click.prevent="showConfirmPopup">
          Delete Account
        </button>
        <ConfirmPopUp ref="confirmPopup" @accept="deleteAccount" :message="$t('message.delete_account_confirmation')"></ConfirmPopUp>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '@/config';
import EventBus from '@/eventBus';
import { mapState, mapMutations } from 'vuex';
import ConfirmPopUp from './ConfirmPopUp.vue';

export default {
  components: {
    ConfirmPopUp
  },
  data() {
    return {
      formUserSettings: {
        theme: 'light',
        language: 'en'
      }
    };
  },
  computed: {
    ...mapState(['userSettings']),
  },
  methods: {
    ...mapMutations(['updateUserSettings']),
    submitUserSettings() {
      axios.put(`${BASE_URL}/api/user_settings/${this.user}/`, this.formUserSettings, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
      })
        .then(response => {
          console.log(response);
          EventBus.emit('user-settings-changed', response.data);
          this.updateUserSettings(response.data);
          localStorage.setItem('userSettings', JSON.stringify(response.data)); // Save to localStorage
          this.$router.push("/dashboard");
        })
        .catch(error => {
          console.error(error);
        });
    },
    showConfirmPopup() {
      this.$refs.confirmPopup.show();
    },
    async deleteAccount() {
      axios.delete(`${BASE_URL}/api/users/${this.user}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
      })
        .then(response => {
          console.log(response);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userSettings');
          this.$router.push("/signin");
        })
        .catch(error => {
          console.error(error);
        });
      console.log('Deleting account')
      // Implement account deletion here
    },
    closeForm() {
      this.$emit('close-settings-form');
    }
  },
  props: {
    user: {
      type: Number,
      required: true
    }
  },
  watch: {
    userSettings: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.formUserSettings = { ...newValue };
        } else {
          this.formUserSettings = {
            theme: 'light',
            language: 'en'
          };
        }
      }
    }
  }
};
</script>
