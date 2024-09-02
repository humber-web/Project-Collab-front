export default {
  methods: {
    validateForm(formData) {
      for (const key in formData) {
        if (formData[key] === '') {
          this.$refs.toast.showToast(`${key} is required`, 'error');
          return false;
        }

        if (key === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[key])) {
            this.$refs.toast.showToast('Invalid email format', 'error');
            return false;
          }
        }
      }
      return true;
    },
  },
};