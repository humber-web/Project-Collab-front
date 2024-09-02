<template>
  <div class="shadow-lg rounded-lg p-6 cursor-pointer"
    :class="{ 'bg-gray-600 hover:bg-gray-500 text-gray-200': userSettings.theme === 'dark', 'bg-gray-100 hover:bg-gray-200 text-gray-800': userSettings.theme === 'light' }"
    @click="toggleDetails" ref="taskElement">
    <div class=" h-14 max-h-14 overflow-hidden">
      <h4 class="text-xl  font-bold mb-2 overflow-ellipsis overflow-hidden">{{ task.name }}</h4>
    </div>
    <div class="h-24 max-h-24 overflow-hidden multiline-truncate">
      <p class="mb-2">{{ task.description }}</p>
    </div>
    <div v-if="showDetails">
      <div v-for="comment in task.comments" :key="comment.text" class="mb-2">
        <Comment :comment="comment" />
      </div>
      <p class="text-sm mb-2 " >{{ $t('message.dueDate') }}: {{ task.completion_data }}</p>
      <!-- <p v-if="isOverdue" class="text-sm text-red-500 mb-2">This task is overdue!</p> -->
      <p :class="statusClass">{{ task.status }}</p>
      <div v-if="isDashboard" class="mb-2">
        <label class="block text-sm font-bold mb-2" for="status"
          :class="{ 'text-gray-900': userSettings.theme === 'light', 'text-gray-100': userSettings.theme === 'dark' }">
          {{ $t('message.status') }}
        </label>
        <select id="status" v-model="task.status" @click.stop
          class="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'text-gray-900 bg-gray-200': userSettings.theme === 'light', 'bg-gray-500 text-gray-100': userSettings.theme === 'dark' }">
          <option value="NS">{{ $t('message.notStarted') }}</option>
          <option value="IP">{{ $t('message.inProgress') }}</option>
          <option value="C">{{ $t('message.completed') }}</option>
        </select>
      </div>
      <User :name="task.assignee" />
      <div v-show="!isDashboard" class="flex gap-1">
        <button @click.stop="editTask(task)"
          class="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded">{{$t('message.edit')}}</button>
        <button @click.stop="showConfirmPopup" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">{{$t('message.delete')}}</button>
        <ConfirmPopUp ref="confirmPopup" @accept="deleteTask(task.id)" :message="$t('message.delete_task_confirmation')"></ConfirmPopUp>
      </div>
    </div>
    <Toast ref="toast" />
  </div>
</template>

<script>
import Comment from "./Comment.vue";
import Status from "./Status.vue";
import User from "./User.vue";
import { mapState } from 'vuex';
import axios from 'axios';
import { BASE_URL } from "@/config";
import ConfirmPopUp from './ConfirmPopUp.vue';

export default {
  name: "Task",
  components: {
    Comment,
    Status,
    User,
    ConfirmPopUp
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
    isDashboard: {
      type: Boolean,
      required: false,
    }
  },
  computed: {
    ...mapState(['userSettings']),
    isOverdue() {
      const today = new Date().toISOString().split('T')[0];
      return this.task.dueDate < today;
    },
    statusClass() {
      switch (this.task.status) {
        case 'NS':
          return 'text-gray-500';  // gray text
        case 'IP':
          return 'text-yellow-500';  // yellow text
        case 'C':
          return 'text-green-500';  // green text
        default:
          return '';
      }
    },
  },
  data() {
    return {
      newCommentText: '',
      showDetails: false,
      user:null
    };
  },
  watch: {
    'task.status': function(newStatus, oldStatus) {
      if (newStatus !== oldStatus) {
        this.updateTaskStatus(this.task.id, newStatus);
      }
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
    showConfirmPopup() {
      this.$refs.confirmPopup.show(this.$refs.taskElement);
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    addComment() {
      this.$emit('add-comment', { text: this.newCommentText, author: 'user1' });
      this.newCommentText = '';
    },
    editTask() {
      window.scrollTo({ top: 170, behavior: 'smooth' });
      this.$emit('edit-task', this.task);
    },
    updateTaskStatus(taskId, status) {
      // Update the task object with the new status
      this.task.status = status;
      this.task.assigneeEmail = this.user.email;

      // Make an API call to update the task
      
      axios.put(`${BASE_URL}/api/tasks/${taskId}/`, this.task)
        .then(response => {
          this.$refs.toast.showToast('Task updated successfully!', 'success');
          console.log(response);
          this.$emit('submit-task', response.data);
        })
        .catch(error => {
          this.$refs.toast.showToast('Task update failed!', 'error');
          console.error(error);
        });
    },
    deleteTask() {
      this.$emit('delete-task', this.task.id);
    },
  },
};
</script>

<style scoped>
.multiline-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  /* number of lines to show */
  -webkit-box-orient: vertical;
}
</style>
<!-- 
assignee:32
completion_data:"2024-05-29"
date_completed:null
date_created:"2024-05-20T22:26:11.246140Z"
description:"asdasd"
id:50
name:"asdasd"
project:2
status:"IP"


assignee:24
assigneeEmail:"starrkilller@gmail.com"
completion_data:"2024-05-29"
date_completed:null
date_created:"2024-05-20T23:58:08.683748Z"
description:"Description"
id:51
name:"Task to Zeny to test work"
project:14
status:
"NS"
 -->

