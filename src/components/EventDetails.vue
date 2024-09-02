<template>
  <div class="w-full max-w-xs mx-auto  relative rounded-md"
    :class="{ 'bg-gray-600 text-gray-100': userSettings.theme === 'dark', 'bg-white text-gray-900': userSettings.theme === 'light' }">
    <font-awesome-icon icon="times" class="absolute top-0 right-0 m-4 cursor-pointer" @click="closeForm"
      :class="{ 'hover:text-gray-700': userSettings.theme === 'dark', 'hover:text-gray-900': userSettings.theme === 'light' }" />
    <form class="shadow-md rounded px-8 pt-6 pb-8 mb-4"
      :class="{ 'bg-gray-600': userSettings.theme === 'dark', 'bg-white': userSettings.theme === 'light' }">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="name"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          Name
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="name" type="text" placeholder="Event Name" v-model="localEvent.name"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }">
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="description"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          Description
        </label>
        <textarea
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="description" placeholder="Event Description" v-model="localEvent.description"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }"></textarea>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="date"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          Date
        </label>
        <input
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="date" type="date" v-model="localEvent.date"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }">
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button" @click="updateOrSaveEvent">
          Save
        </button>
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button" @click.stop="showConfirmPopup">
          Delete
        </button>
        <ConfirmPopUp ref="confirmPopup" @accept="deleteEvent" :message="$t('message.delete_event_confirmation')"></ConfirmPopUp>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConfirmPopUp from './ConfirmPopUp.vue';

export default {
  components: {
    ConfirmPopUp
  },
  props: {
    event: Object
  },
  data() {
    return {
      localEvent: { ...this.event }
    };
  },
  computed: {
    ...mapState(['userSettings'])
  },
  methods: {
    showConfirmPopup() {
      this.$refs.confirmPopup.show();
    },
    updateOrSaveEvent() {
      if (this.localEvent.id) {
        this.$emit('update', this.localEvent);
      } else {
        this.$emit('save', this.localEvent);
      }
    },
    deleteEvent() {
      this.$emit('delete', this.event.id);
    },
    closeForm() {
      this.$emit('close-form');
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin: 0.5rem 0;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.2rem;
}

button {
  margin: 0.5rem 0.2rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
}
</style>
