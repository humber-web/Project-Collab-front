<template>
  <div
    class="calendar-view"
    :class="{ 'bg-white text-gray-900': userSettings.theme === 'light', 'bg-gray-700 text-gray-100': userSettings.theme === 'dark' }"
  >
    <div class="calendar-header p-1 flex gap-1">
      <button
      class="rounded-md p-1"
        :class="{ 'bg-gray-200 text-gray-900': userSettings.theme === 'light', 'bg-gray-600 text-gray-100': userSettings.theme === 'dark' }"
        @click="goToToday"
      >
        {{ $t('calendar.today') }}
      </button>
      <button
      class="rounded-md p-1"
        :class="{ 'bg-gray-200 text-gray-900': userSettings.theme === 'light', 'bg-gray-600 text-gray-100': userSettings.theme === 'dark' }"
        @click="goToPrevious"
      >
        {{ $t('message.back') }}
      </button>
      <button
      class="rounded-md p-1"
        :class="{ 'bg-gray-200 text-gray-900': userSettings.theme === 'light', 'bg-gray-600 text-gray-100': userSettings.theme === 'dark' }"
        @click="goToNext"
      >
        {{ $t('message.next') }}
      </button>
      <select
        v-model="currentView"
        @change="changeView"
        class="rounded-md p-1"
        :class="{ 'bg-gray-200 text-gray-900': userSettings.theme === 'light', 'bg-gray-700 text-gray-100': userSettings.theme === 'dark' }"
      >
        <option value="month">{{ $t('calendar.month') }}</option>
        <option value="week">{{ $t('calendar.week') }}</option>
        <option value="day">{{ $t('calendar.day') }}</option>
      </select>
    </div>
    <div class="calendar-content">
      <CalendarGrid :events="filteredEvents" :view="currentView" @selectEvent="openEventModal" :currentDate="currentDate"/>
    </div>
    <div class="calendar-footer">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search events"
        @input="filterEvents"
        class="rounded-md p-1"
        :class="{ 'bg-gray-200 text-gray-900': userSettings.theme === 'light', 'bg-gray-700 text-gray-100': userSettings.theme === 'dark' }"
      />
      <button
      class="rounded-md p-1"
        :class="{ 'bg-gray-200 text-gray-900': userSettings.theme === 'light', 'bg-gray-700 text-gray-100': userSettings.theme === 'dark' }"
        @click="openEventModal"
      >
      {{ $t('calendar.newEvent') }}
      </button>
    </div>
    <Modal v-if="showEventModal" @close="closeEventModal">
      <EventDetails :event="selectedEvent" @save="saveEvent" @update="updateEvent" @delete="deleteEvent" @close-form="this.closeEventModal()"/>
    </Modal>
    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '../config';
import CalendarGrid from '../components/CalendarGrid.vue';
import Modal from '../components/Modal.vue';
import EventDetails from '../components/EventDetails.vue';
import { mapState } from 'vuex';

export default {
  components: {
    CalendarGrid,
    Modal,
    EventDetails,
  },
  data() {
    return {
      currentView: 'month',
      currentDate: new Date(),
      events: [],
      searchTerm: '',
      showEventModal: false,
      selectedEvent: null,
    };
  },
  created() {
    this.getEvents();
  },
  computed: {
    filteredEvents() {
      if (!this.searchTerm) {
        return this.events;
      }
      return this.events.filter(
        (event) =>
          event.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    ...mapState(['userSettings']),
  },
  methods: {
    async getEvents() {
      let user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`${BASE_URL}/api/events/?user_id=${user.id}`, {});
        this.events = response.data;
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    goToToday() {
      this.currentDate = new Date();
    },
    goToPrevious() {
      if (this.currentView === 'month') {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      } else if (this.currentView === 'week') {
        this.currentDate.setDate(this.currentDate.getDate() - 7);
      } else if (this.currentView === 'day') {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
      }
    },
    goToNext() {
      if (this.currentView === 'month') {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      } else if (this.currentView === 'week') {
        this.currentDate.setDate(this.currentDate.getDate() + 7);
      } else if (this.currentView === 'day') {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
      }
    },
    changeView() {
      this.currentDate = new Date();
    },
    filterEvents() {
      // Logic to filter events based on the search term
    },
    openEventModal(event) {
      this.selectedEvent = event;
      this.showEventModal = true;
    },
    closeEventModal() {
      this.showEventModal = false;
    },
    async saveEvent(event) {
      event.user = JSON.parse(localStorage.getItem('user')).id;
      try {
        const response = await axios.post(`${BASE_URL}/api/events/`, event);
        this.$refs.toast.showToast('Event created successfully!', 'success');
        this.events.push(response.data);
      } catch (error) {
        this.$refs.toast.showToast('Event creation failed!', 'error');
        console.log('Error saving event:', error);
      }
      
      this.closeEventModal();
    },
    async deleteEvent(eventId) {
      try {
        await axios.delete(`${BASE_URL}/api/events/${eventId}/`);
        this.$refs.toast.showToast('Event deleted successfully!', 'success');
        this.events = this.events.filter((event) => event.id !== eventId);
      } catch (error) {
        this.$refs.toast.showToast('Failed to delete event!', 'error');
        console.error(error);
      }
      this.closeEventModal();
    },
    async updateEvent(event) {
      try {
        const response = await axios.put(`${BASE_URL}/api/events/${event.id}/`, event);
        this.$refs.toast.showToast('Event updated successfully!', 'success');
        const index = this.events.findIndex((e) => e.id === event.id);
        if (index !== -1) {
          this.events.splice(index, 1, response.data);
        }
      } catch (error) {
        this.$refs.toast.showToast('Failed to update event!', 'error');
        console.error(error);
      }
      this.closeEventModal();
    },
  },
};
</script>

<style scoped>
.calendar-view {
  padding: 1rem;
}

.calendar-footer {
  display:flex;
  gap:1rem;
}

/* Light theme */
.bg-white {
  background-color: #ffffff;
}

.text-gray-900 {
  color: #1a202c;
}

.bg-gray-200 {
  background-color: #edf2f7;
}

/* Dark theme */
.bg-gray-600 {
  background-color: #718096;
}

.text-gray-100 {
  color: #f7fafc;
}

.bg-gray-700 {
  background-color: #4a5568;
}
</style>
