<template>
  <div class="calendar-grid"
    :class="{ 'bg-white text-gray-900': userSettings.theme === 'light', 'bg-gray-700 text-gray-100': userSettings.theme === 'dark' }">
    <!-- ... -->
    <div class="header">
  <div class="header-item" v-for="day in days" :key="day">
    {{ day }}
  </div>
</div>
    <div class="body">
      <div class="body-item" v-for="date in dates" :key="date.toISOString()">
        <div class="date">{{ date.getDate() }}</div>
        <div class="events">
          <div v-for="event in getEventsForDate(date)" :key="event.id" class="event"
            :class="{ 'bg-white text-gray-900': userSettings.theme === 'light', 'bg-gray-600 text-gray-100': userSettings.theme === 'dark' }"
            v-on:mouseover="showEventDetails(event)" v-on:mouseout="hideEventDetails" @click="selectEvent(event)">
            {{ event.name }}
            <div v-if="eventDetailsVisible && eventDetails.id === event.id" class="event-details"
              :class="{ 'bg-white text-gray-900': userSettings.theme === 'light', 'bg-gray-600 text-gray-100': userSettings.theme === 'dark' }">
              <p>{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    events: Array,
    view: String
  },
  data() {
    return {
      eventDetailsVisible: false,
      eventDetails: null,
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      currentDate: new Date()
    };
  },

  computed: {
    dates() {
      return this.generateDates();

    },
    ...mapState(['userSettings']),
  },
  methods: {
    generateDates() {
      const dates = [];
      const current = new Date(this.currentDate);

      if (this.view === 'month') {
        current.setDate(1);
        while (current.getMonth() === this.currentDate.getMonth()) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      } else if (this.view === 'week') {
        const startOfWeek = current.getDate() - current.getDay();
        for (let i = 0; i < 7; i++) {
          const date = new Date(current.setDate(startOfWeek + i));
          dates.push(new Date(date));
        }
      } else if (this.view === 'day') {
        dates.push(new Date(current));
      }

      return dates;
    },
    showEventDetails(event) {
      this.eventDetails = event;
      this.eventDetailsVisible = true;
    },
    hideEventDetails() {
      this.eventDetailsVisible = false;
    },
    getEventsForDate(date) {
      return this.events.filter(event => new Date(event.date).toDateString() === date.toDateString());
    },
    selectEvent(event) {
      this.$emit('selectEvent', event)
    }
  },
  watch: {
    view() {
      this.currentDate = new Date();
    }
  },
  created() {
    console.log('Events:', this.events)
  }
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5rem;
}

.header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.header-item {
  padding: 0.5rem;
  text-align: center;
  font-weight: bold;
}

.body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.body-item {
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 10px;

}

.date {
  font-size: 0.8rem;
  font-weight: bold;
}

.events {
  margin-top: 0.5rem;
}

.event {
  /* background: #f0f0f0; */
  margin-bottom: 0.2rem;
  padding: 0.2rem;
  border-radius: 0.2rem;
}

.event-details {
  cursor: pointer;
  position: absolute;
  /* background: #fff; */
  padding: 1rem;
  /* border: 1px solid #ddd; */
  border-radius: 0.2rem;
  z-index: 1;
}

/* Light theme */
.light-theme .header-item,
.light-theme .body-item,
.light-theme .event-details {
  background-color: #ffffff;
  color: #1a202c;
}

/* Dark theme */
.dark-theme .header-item,
.dark-theme .body-item,
.dark-theme .event-details {
  background-color: #718096;
  color: #f7fafc;
}
</style>
