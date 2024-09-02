<template>
  <select v-model="status" @change="updateStatus" :class="statusClass">
    <option v-for="statusOption in statuses" :key="statusOption" :value="statusOption">
      {{ statusOption }}
    </option>
  </select>
</template>

<script>
export default {
  name: "Status",
  props: {
    initialStatus: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      status: this.initialStatus,
      statuses: ['Not Started', 'In Progress', 'Completed'],
    };
  },
  computed: {
    statusClass() {
      return {
        'status-not-started': this.status === 'Not Started',
        'status-in-progress': this.status === 'In Progress',
        'status-completed': this.status === 'Completed',
      };
    },
  },
  methods: {
    updateStatus() {
      this.$emit('status-updated', this.status);
    },
  },
};
</script>

<style scoped>
.status-not-started {
  color: red;
}

.status-in-progress {
  color: orange;
}

.status-completed {
  color: green;
}
</style>