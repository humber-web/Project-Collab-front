<template>
  <div class="text-gray-400">
    {{ $t('message.assignee') }}: {{ username }}
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '@/config';
export default {
  name: "User",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      username: '',
    }
  },
  async created() {
    const response = await axios .get(`${BASE_URL}/api/users/${this.name}/`);
    this.username = response.data.username;
  }
};
</script>