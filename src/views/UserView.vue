<template>
    <div class="h-full p-4" :class="{ 'bg-white': userSettings.theme === 'light', 'bg-gray-700': userSettings.theme === 'dark' }">
        <div v-show="showUserForm">
            <UserForm :user="this.user" @close-user-form="CloseUserForm" @submit-user="handleUser" />
        </div>
        <div v-show="showSettings">
            <SettingsForm :user-settings="this.user.UserSettings" :user="this.user.id"
                @submit-user-settings="handleSettings" @close-settings-form="closeSettingsForm" />
        </div>
    </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue'
import SettingsForm from '@/components/SettingsForm.vue'
import { mapState } from 'vuex';
export default {
    name: 'UserView',
    components: {
        UserForm,
        SettingsForm
    },
    props: {
        openForm: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapState(['userSettings'])
    },

    data() {
        return {
            user: null,
            showSettings: false,
            showUserForm: false
        }

    },
    created() {
        this.user = JSON.parse(localStorage.getItem('user'))
        this.showUserForm = this.openForm === 'user';
        this.showSettings = this.openForm === 'settings';
    },
    methods: {

        handleSettings(data) {
            console.log('Settings data:', data);
        },
        handleUser(data) {
            console.log('User data:', data);
        },
        closeSettingsForm() {
            this.showSettings = false;
        },
        CloseUserForm() {
            console.log('clicked')
            this.showUserForm = false;
        }
    },
    watch: {
        openForm(newOpenForm) {
            this.showUserForm = newOpenForm === 'user';
            this.showSettings = newOpenForm === 'settings';
        }
    },

}
</script>

<style></style>